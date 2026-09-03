import json
import base64
import os
import time
import requests
import hashlib
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives import padding

AUTH_FILE = os.path.join(os.path.dirname(__file__), "tngis_auth.json")
BASE_API = "https://tngis.tn.gov.in/apps/gi_viewer_api/gi_mvc/api/v1"

def pbkdf2_sha512(key: str, salt: bytes, iterations: int = 1000, key_length: int = 32) -> bytes:
    return hashlib.pbkdf2_hmac('sha512', key.encode('utf-8'), salt, iterations, dklen=key_length)

def encrypt_payload(data_dict: dict, session_key: str) -> str:
    plaintext = json.dumps(data_dict).encode('utf-8')
    salt = os.urandom(16)
    iv = os.urandom(16)
    hash_key = pbkdf2_sha512(session_key, salt, iterations=1000, key_length=32)
    padder = padding.PKCS7(128).padder()
    padded_data = padder.update(plaintext) + padder.finalize()
    cipher = Cipher(algorithms.AES(hash_key), modes.CBC(iv))
    encryptor = cipher.encryptor()
    ciphertext = encryptor.update(padded_data) + encryptor.finalize()
    container = {
        "ciphertext": base64.b64encode(ciphertext).decode('utf-8'),
        "iv": iv.hex(),
        "salt": salt.hex(),
        "iterations": 1000
    }
    return base64.b64encode(json.dumps(container).encode('utf-8')).decode('utf-8')

def decrypt_payload(enc_b64: str, session_key: str) -> str:
    container_json = base64.b64decode(enc_b64).decode('utf-8')
    container = json.loads(container_json)
    salt = bytes.fromhex(container["salt"])
    iv = bytes.fromhex(container["iv"])
    ciphertext = base64.b64decode(container["ciphertext"])
    iterations = int(container.get("iterations", 1000))
    hash_key = pbkdf2_sha512(session_key, salt, iterations=iterations, key_length=32)
    cipher = Cipher(algorithms.AES(hash_key), modes.CBC(iv))
    decryptor = cipher.decryptor()
    padded_plaintext = decryptor.update(ciphertext) + decryptor.finalize()
    unpadder = padding.PKCS7(128).unpadder()
    plaintext = unpadder.update(padded_plaintext) + unpadder.finalize()
    return plaintext.decode('utf-8')

def get_auth_tokens():
    if not os.path.exists(AUTH_FILE):
        return None, None, None
    with open(AUTH_FILE, "r") as f:
        auth_data = json.load(f)
    cookies_dict = {c["name"]: c["value"] for c in auth_data.get("cookies", [])}
    access_token = cookies_dict.get("access_token")
    user_info_raw = cookies_dict.get("tngis_user_info", "")
    user_id = "96492"
    try:
        import urllib.parse
        decoded = urllib.parse.unquote(user_info_raw)
        user_obj = json.loads(base64.b64decode(decoded).decode('utf-8'))
        user_id = str(user_obj.get("user_id", "96492"))
    except Exception:
        pass
    return access_token, cookies_dict, user_id

def query_tngis_by_coords(lat: float, lng: float):
    access_token, cookies_dict, user_id = get_auth_tokens()
    if not cookies_dict:
        return {"success": False, "error": "No saved TNGIS session. Please run admin_login_tngis.py"}

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Authorization": f"Bearer {access_token}" if access_token else "",
        "Referer": "https://tngis.tn.gov.in/apps/gi_viewer/map-viewer/index.html",
        "Origin": "https://tngis.tn.gov.in",
        "X-APP-NAME": "demo",
        "X-Secure-Request": "true"
    }

    try:
        # 1. Fetch live session key & CSRF token
        s_url = f"{BASE_API}/session-key"
        s_resp = requests.get(s_url, headers=headers, cookies=cookies_dict, timeout=10).json()
        
        # If session expired, auto-refresh and retry once
        if "sessionKey" not in s_resp:
            try:
                from session_daemon import renew_session
                if renew_session():
                    access_token, cookies_dict, user_id = get_auth_tokens()
                    headers["Authorization"] = f"Bearer {access_token}" if access_token else ""
                    s_resp = requests.get(s_url, headers=headers, cookies=cookies_dict, timeout=10).json()
            except Exception:
                pass

        if "sessionKey" not in s_resp:
            return {"success": False, "error": "TNGIS Session expired. Please login."}

        session_id = s_resp["sessionId"]
        session_key = s_resp["sessionKey"]
        csrf_token = s_resp["csrfToken"]

        headers["X-CSRF-Token"] = csrf_token
        headers["X-Session-ID"] = session_id

        # 2. Query /land-info with exact official TNGIS parameters
        lat_str = f"{float(lat):.6f}"
        lng_str = f"{float(lng):.6f}"

        raw_payload = {
            "latitude": lat_str,
            "longitude": lng_str,
            "up": 0,
            "uid": user_id,
            "timestamp": int(time.time() * 1000)
        }
        enc_payload = encrypt_payload(raw_payload, session_key)
        
        url = f"{BASE_API}/land-info"
        r = requests.post(url, json={"payload": enc_payload}, headers=headers, cookies=cookies_dict, timeout=12)
        resp_json = r.json()

        if "payload" not in resp_json:
            return {"success": False, "error": resp_json.get("error", "No land parcel at coordinates")}

        decrypted_str = decrypt_payload(resp_json["payload"], session_key)
        land_data = json.loads(decrypted_str)
        
        # If token expired, renew and retry
        if isinstance(land_data, dict) and "Invalid or expired token" in str(land_data.get("error", "")):
            try:
                from session_daemon import renew_session
                if renew_session():
                    return query_tngis_by_coords(lat, lng)
            except Exception:
                pass
            return {"success": False, "error": "TNGIS session expired."}

        d = land_data.get("data", land_data)
        if not d or not isinstance(d, dict) or "district_code" not in d:
            return {"success": False, "error": land_data.get("message", "No land parcel record found at coordinates.")}

        # 3. Query Real Ownership Details (/land/ownership-details or /land/urban-ownership-details)
        owners_list = []
        patta_no = None
        land_extent = None
        land_tax = None
        land_type_str = None

        try:
            area_type = str(d.get("rural_urban", "rural"))
            endpoint = "/land/ownership-details" if area_type == "rural" else "/land/urban-ownership-details"
            
            own_payload = {
                "district_code": str(d.get("district_code")),
                "taluk_code": str(d.get("taluk_code")),
                "village_code": str(d.get("village_code")),
                "survey_number": str(d.get("survey_number")),
                "sub_division_number": str(d.get("sub_division")),
                "land_type": area_type,
                "code_type": "revenue",
                "search_type": "survey_number"
            }
            if area_type == "urban":
                own_payload["revenue_town_code"] = str(d.get("revenue_town_code", ""))
                own_payload["firka_ward_number"] = str(d.get("firka_ward_number", ""))
                own_payload["urban_block_number"] = str(d.get("urban_block_number", ""))

            enc_own = encrypt_payload(own_payload, session_key)
            own_url = f"{BASE_API}{endpoint}"
            r_own = requests.post(own_url, json={"payload": enc_own}, headers=headers, cookies=cookies_dict, timeout=10)
            
            if "payload" in r_own.json():
                dec_own = decrypt_payload(r_own.json()["payload"], session_key)
                own_json = json.loads(dec_own)
                if own_json.get("success") == 1 and "data" in own_json:
                    own_d = own_json["data"]
                    if "ownership_detail" in own_d and isinstance(own_d["ownership_detail"], list):
                        owners_list = own_d["ownership_detail"]
                    if "land_detail" in own_d and isinstance(own_d["land_detail"], dict):
                        ld = own_d["land_detail"]
                        if ld.get("pattaNo"):
                            patta_no = str(ld.get("pattaNo"))
                        if ld.get("extAres") is not None:
                            land_extent = f"{ld.get('extHect', 0)} ஹெக்டேர் {ld.get('extAres')} ஏர்ஸ்"
                        if ld.get("totTax") is not None:
                            land_tax = f"₹ {ld.get('totTax')}"
                        if ld.get("govtPriTamil") and ld.get("landTypeTamil"):
                            land_type_str = f"{ld.get('govtPriTamil')} {ld.get('landTypeTamil')}"
        except Exception:
            pass

        # Format primary owner name strictly from official government response
        primary_owner = None
        if owners_list and len(owners_list) > 0:
            o0 = owners_list[0]
            owner_name = o0.get("Owner", "")
            relative = o0.get("Relative", "")
            relation = o0.get("Relation", "த/பெ")
            if relative:
                primary_owner = f"{owner_name} ({relation}: {relative})"
            else:
                primary_owner = owner_name

        return {
            "success": True,
            "district": d.get("district_name"),
            "district_tamil": d.get("district_tamil_name"),
            "taluk": d.get("taluk_name"),
            "taluk_tamil": d.get("taluk_tamil_name"),
            "village": d.get("village_name"),
            "village_tamil": d.get("village_tamil_name"),
            "survey": d.get("survey_number"),
            "subdiv": d.get("sub_division"),
            "ulpin": d.get("ulpin"),
            "lgd_village": d.get("lgd_village_code"),
            "centroid": d.get("centroid"),
            "geojson": json.loads(d.get("geojson_geom")) if d.get("geojson_geom") else None,
            "owner": primary_owner,
            "owners_list": owners_list,
            "patta": patta_no,
            "area": land_extent,
            "tax": land_tax,
            "type": land_type_str,
            "raw_data": d
        }

    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    test_coords = [
        (12.165718, 79.572914), # Alagramam East, Tindivanam
        (13.0330, 80.2690),     # Chennai
        (12.8387, 79.7016),     # Sriperumbudur
    ]
    for lat, lng in test_coords:
        res = query_tngis_by_coords(lat, lng)
        print(f"Coordinates ({lat}, {lng}) -> Found: {res.get('success')}, District: {res.get('district')}, ULPIN: {res.get('ulpin')}")
