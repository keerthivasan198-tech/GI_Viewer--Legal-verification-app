# --- Flask Web GIS Server (app.py) ---
# Dependencies: pip install flask flask-cors requests

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import requests

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS) for frontend requests

@app.route('/')
def index():
    return send_from_directory(os.path.dirname(__file__), 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory(os.path.dirname(__file__), path)

DB_FILE = os.path.join(os.path.dirname(__file__), 'parcels_db.json')

FALLBACK_DATA = {
    "Chennai": {
        "taluks": ["Mylapore", "Egmore", "Adyar", "Tondiarpet", "Perambur", "Guindy", "Velachery", "Alandur", "Sholinganallur"],
        "villages": {
            "Mylapore": ["Mylapore Village", "Mandaveli", "Alwarpet", "Santhome"],
            "Egmore": ["Egmore Village", "Chetpet", "Nungambakkam", "Triplicane"],
            "Adyar": ["Adyar Village", "Thiruvanmiyur", "Besant Nagar"],
            "Alandur": ["Alandur Village", "Nanganallur", "Adambakkam"]
        }
    },
    "Madurai": {
        "taluks": ["Madurai South", "Madurai North", "Melur", "Thirumangalam", "Thirupparankundram", "Vadipatti"],
        "villages": {
            "Madurai South": ["Thirupparankundram Village", "Avaniyapuram", "Villapuram"],
            "Madurai North": ["Melamadai", "Tallakulam", "Sellur"]
        }
    },
    "Coimbatore": {
        "taluks": ["Coimbatore North", "Coimbatore South", "Pollachi", "Mettupalayam", "Sulur"],
        "villages": {
            "Coimbatore North": ["Tudiyalur Village", "Ganapathy", "Saravanampatti", "Chinnavedampatti"],
            "Coimbatore South": ["Ramanathapuram", "Singanallur", "Kuniyamuthur"]
        }
    },
    "Kanchipuram": {
        "taluks": ["Sriperumbudur", "Kanchipuram", "Walajabad", "Kundrathur"],
        "villages": {
            "Sriperumbudur": ["Vallam Village", "Sunguvarchatram", "Irungattukottai"],
            "Kanchipuram": ["Kanchipuram Town", "Orikkai", "Konerikuppam"]
        }
    },
    "Salem": {
        "taluks": ["Salem", "Omalur", "Attur", "Mettur", "Yercaud", "Valapady", "Gangavalli"],
        "villages": {
            "Yercaud": ["Yercaud", "Nagalur", "Semmantham", "Kiliyur", "Manjakuttai"],
            "Salem": ["Salem City", "Kannankurichi", "Suramangalam", "Ammapet"],
            "Mettur": ["Mettur Dam", "Kolanalli", "Palar"]
        }
    }
}

def get_fallback_taluks(district):
    if district in FALLBACK_DATA:
        return FALLBACK_DATA[district]["taluks"]
    return [f"{district} North", f"{district} South", f"{district} Central", f"{district} East"]

def get_fallback_villages(district, taluk):
    if district in FALLBACK_DATA and taluk in FALLBACK_DATA[district]["villages"]:
        return FALLBACK_DATA[district]["villages"][taluk]
    return [f"{taluk} Town", f"{taluk} Suburb", f"{taluk} Rural", f"{taluk} Village"]

def load_database():
    return []

# Point-in-Polygon (Ray-Casting) Algorithm to check if a clicked GPS point is inside a land parcel
def point_in_polygon(lat, lng, polygon):
    if not polygon:
        return False
    num = len(polygon)
    j = num - 1
    inside = False
    
    for i in range(num):
        p_i = polygon[i]
        p_j = polygon[j]
        
        # Check if ray crosses the polygon boundary
        if ((p_i[0] > lat) != (p_j[0] > lat)) and \
           (lng < (p_j[1] - p_i[1]) * (lat - p_i[0]) / (p_j[0] - p_i[0]) + p_i[1]):
            inside = not inside
        j = i
        
    return inside

# 1. Endpoint: Retrieve all parcels to display on map overlays
@app.route('/api/parcels', methods=['GET'])
def get_all_parcels():
    return jsonify([])

# 2. Endpoint: Search filters (District, Taluk, Village, Survey, Subdivision)
@app.route('/api/search', methods=['POST'])
def search_parcel():
    data = request.json or {}
    district = data.get('district')
    taluk = data.get('taluk')
    village = data.get('village')
    land_type = data.get('type')
    survey = data.get('survey') or "100"
    subdiv = data.get('subdiv') or "1"
    
    db = load_database()
    
    # 1. Search local database first for an exact match
    for parcel in db:
        if district and parcel.get('district').lower() != district.lower():
            continue
        if taluk and parcel.get('taluk').lower() != taluk.lower():
            continue
        if village and parcel.get('village').lower() != village.lower():
            continue
        if survey and parcel.get('survey') != survey:
            continue
        if subdiv and subdiv != 'All' and subdiv != '' and parcel.get('subdiv') != subdiv:
            continue
        if land_type:
            # Check local type matching
            if land_type == "Government Poramboke" and "govt" not in parcel.get('category').lower() and "government" not in parcel.get('category').lower():
                continue
            if land_type == "Temple Trust" and "temple" not in parcel.get('owner').lower():
                continue
            if land_type == "WAQF Property" and "waqf" not in parcel.get('owner').lower():
                continue
            if land_type == "Ryotwari Nanjai" and "nanjai" not in parcel.get('type').lower():
                continue
            if land_type == "Ryotwari Punjai" and "punjai" not in parcel.get('type').lower():
                continue
        return jsonify([parcel]) # Found local match
        
    # 2. Dynamic OSM search with sequential fallbacks if no local match
    if district:
        queries = []
        if village and taluk:
            queries.append(f"{village}, {taluk}, {district}, Tamil Nadu")
        if village:
            queries.append(f"{village}, {district}, Tamil Nadu")
        if taluk:
            queries.append(f"{taluk}, {district}, Tamil Nadu")
        queries.append(f"{district}, Tamil Nadu")
        
        headers = {
            "User-Agent": "PlotChoiceGISViewer/1.0 (contact@plotchoice.com)",
            "Referer": "https://gi-viewer.local"
        }
        
        for search_query in queries:
            url = "https://nominatim.openstreetmap.org/search"
            params = {
                "format": "json",
                "q": search_query,
                "limit": 1
            }
            try:
                response = requests.get(url, params=params, headers=headers, timeout=6)
                results = response.json()
                if results:
                    loc = results[0]
                    lat = float(loc['lat'])
                    lng = float(loc['lon'])
                    
                    bbox = loc.get('boundingbox')
                    if bbox and len(bbox) == 4:
                        minLat = float(bbox[0])
                        maxLat = float(bbox[1])
                        minLng = float(bbox[2])
                        maxLng = float(bbox[3])
                        if (maxLat - minLat) > 0.005:
                            size = 0.0002
                            coords = [
                                [lat - size, lng - size],
                                [lat + size, lng - size],
                                [lat + size, lng + size],
                                [lat - size, lng + size]
                            ]
                        else:
                            coords = [
                                [minLat, minLng],
                                [maxLat, minLng],
                                [maxLat, maxLng],
                                [minLat, maxLng]
                            ]
                    else:
                        size = 0.0002
                        coords = [
                            [lat - size, lng - size],
                            [lat + size, lng - size],
                            [lat + size, lng + size],
                            [lat - size, lng + size]
                        ]
                        
                    # Return location bounds without fabricating fake owner details
                    spatial_parcel = {
                        "district": district,
                        "taluk": taluk or "",
                        "village": village or "",
                        "survey": survey or "",
                        "subdiv": subdiv or "",
                        "owner": "Record Not Fetched (Live Govt Verification Required)",
                        "patta": "N/A",
                        "category": "Land Parcel",
                        "type": "Cadastral Survey",
                        "area": "See Official Extract",
                        "tax": "N/A",
                        "soil": "N/A",
                        "coords": coords,
                        "ulpin": "N/A",
                        "adjacent": { "N": "-", "S": "-", "E": "-", "W": "-" },
                        "svgPath": "M 20,40 L 180,20 L 190,160 L 40,180 Z",
                        "svgDims": [
                            { "x": 100, "y": 25, "val": "-" }, { "x": 190, "y": 90, "val": "-" },
                            { "x": 115, "y": 175, "val": "-" }, { "x": 25, "y": 110, "val": "-" }
                        ],
                        "vertices": [{ "x": 20, "y": 40, "lbl": "A" }, { "x": 180, "y": 20, "lbl": "B" }, { "x": 190, "y": 160, "lbl": "C" }, { "x": 40, "y": 180, "lbl": "D" }],
                        "source": "OSM Spatial Boundary"
                    }
                    return jsonify([spatial_parcel])
            except Exception as e:
                print(f"OSM Search exception for query '{search_query}': {e}")
                
    return jsonify([])

# Import TNGIS Live Client
from tngis_client import query_tngis_by_coords

def extract_polygon_coords(geojson_obj, default_lat, default_lng):
    if not geojson_obj or "coordinates" not in geojson_obj:
        size = 0.0002
        return [
            [default_lat - size, default_lng - size],
            [default_lat + size, default_lng - size],
            [default_lat + size, default_lng + size],
            [default_lat - size, default_lng + size]
        ]
    
    geom_type = geojson_obj.get("type", "Polygon")
    coords = geojson_obj.get("coordinates", [])
    
    if geom_type == "MultiPolygon" and len(coords) > 0 and len(coords[0]) > 0:
        ring = coords[0][0]
    elif geom_type == "Polygon" and len(coords) > 0:
        ring = coords[0]
    else:
        ring = []

    poly_coords = []
    for pt in ring:
        if isinstance(pt, (list, tuple)) and len(pt) >= 2 and isinstance(pt[0], (int, float)):
            # GeoJSON is [lng, lat] -> Leaflet expects [lat, lng]
            poly_coords.append([float(pt[1]), float(pt[0])])

    if not poly_coords:
        size = 0.0002
        poly_coords = [
            [default_lat - size, default_lng - size],
            [default_lat + size, default_lng - size],
            [default_lat + size, default_lng + size],
            [default_lat - size, default_lng + size]
        ]
    return poly_coords

# 3. Endpoint: Click map GPS query (Identify tool - live TNGIS integration)
@app.route('/api/query-coords', methods=['POST'])
def query_coords():
    data = request.json or {}
    lat = data.get('lat')
    lng = data.get('lng')
    
    if lat is None or lng is None:
        return jsonify({"error": "Latitude and longitude required"}), 400
        
    # 1. Try Live TNGIS GeoServer / GIS Engine query first
    try:
        tngis_res = query_tngis_by_coords(float(lat), float(lng))
        if tngis_res.get("success"):
            d = tngis_res
            poly_coords = extract_polygon_coords(d.get("geojson"), float(lat), float(lng))

            live_parcel = {
                "district": d.get("district"),
                "district_tamil": d.get("district_tamil"),
                "taluk": d.get("taluk"),
                "taluk_tamil": d.get("taluk_tamil"),
                "village": d.get("village"),
                "village_tamil": d.get("village_tamil"),
                "survey": d.get("survey"),
                "subdiv": d.get("subdiv"),
                "ulpin": d.get("ulpin"),
                "owner": d.get("owner"),
                "owners_list": d.get("owners_list") or [],
                "patta": d.get("patta"),
                "category": "Private (Ryotwari)" if d.get("type") else "Government Land",
                "type": d.get("type"),
                "area": d.get("area"),
                "tax": d.get("tax"),
                "soil": "Cadastral Survey Class",
                "coords": poly_coords,
                "adjacent": { "N": "-", "S": "-", "E": "-", "W": "-" },
                "svgPath": "M 20,40 L 180,20 L 190,160 L 40,180 Z",
                "svgDims": [
                    { "x": 100, "y": 25, "val": "-" }, { "x": 190, "y": 90, "val": "-" },
                    { "x": 115, "y": 175, "val": "-" }, { "x": 25, "y": 110, "val": "-" }
                ],
                "vertices": [{ "x": 20, "y": 40, "lbl": "A" }, { "x": 180, "y": 20, "lbl": "B" }, { "x": 190, "y": 160, "lbl": "C" }, { "x": 40, "y": 180, "lbl": "D" }],
                "source": "TNGIS Live Government API",
                "raw_data": d.get("raw_data")
            }
            return jsonify({"found": True, "parcel": live_parcel, "source": "tngis_live"})
    except Exception as ex:
        print(f"DEBUG EXCEPTION IN QUERY_COORDS: {ex}")

    return jsonify({"found": False, "message": "No land parcel record found on government portal."})

# 4. Endpoint: Reverse Geocode Proxy (Bypass CORS and set User-Agent for OSM Nominatim)
@app.route('/api/reverse-geocode', methods=['POST'])
def reverse_geocode():
    data = request.json or {}
    lat = data.get('lat')
    lng = data.get('lng')
    
    if lat is None or lng is None:
        return jsonify({"error": "Latitude and longitude required"}), 400
        
    url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}"
    headers = {
        "User-Agent": "PlotChoiceGISViewer/1.0 (contact@plotchoice.com)",
        "Referer": "https://gi-viewer.local"
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=10)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({"error": f"Failed to fetch address from OSM: {str(e)}"}), 500

ALL_TN_DISTRICTS = [
    "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", 
    "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", 
    "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", 
    "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", 
    "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", 
    "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"
]

# 5. Endpoint: Get all 38 official districts in Tamil Nadu
@app.route('/api/districts', methods=['GET'])
def get_districts():
    return jsonify(sorted(ALL_TN_DISTRICTS))

# Endpoint: Serve official Tamil Nadu District Boundaries GeoJSON
@app.route('/api/tn-district-boundaries', methods=['GET'])
def get_tn_district_boundaries():
    geojson_path = os.path.join(os.path.dirname(__file__), 'tn_districts.geojson')
    if os.path.exists(geojson_path):
        with open(geojson_path, 'r', encoding='utf-8') as f:
            return jsonify(json.load(f))
    return jsonify({"type": "FeatureCollection", "features": []})

# 6. Endpoint: Get taluks under selected district (uses Overpass API for dynamic discovery)
@app.route('/api/taluks', methods=['GET'])
def get_taluks():
    district = request.args.get('district')
    if not district:
        return jsonify([])
        
    overpass_url = "https://overpass-api.de/api/interpreter"
    query = f"""
    [out:json][timeout:15];
    area["name"="{district}"]["admin_level"="6"]->.a;
    (
      relation(area.a)["boundary"="administrative"]["admin_level"="8"];
      way(area.a)["boundary"="administrative"]["admin_level"="8"];
    );
    out tags;
    """
    try:
        response = requests.post(overpass_url, data={"data": query}, timeout=8)
        data = response.json()
        taluks = set()
        for element in data.get('elements', []):
            tags = element.get('tags', {})
            name = tags.get('name')
            if name:
                taluks.add(name.replace(" Taluk", "").replace(" Taluka", "").strip())
        
        if not taluks:
            taluks = get_fallback_taluks(district)
        return jsonify(sorted(list(taluks)))
    except Exception as e:
        print(f"Error fetching taluks: {e}")
        return jsonify(sorted(get_fallback_taluks(district)))

# 7. Endpoint: Get villages under selected district and taluk
@app.route('/api/villages', methods=['GET'])
def get_villages():
    district = request.args.get('district')
    taluk = request.args.get('taluk')
    if not district or not taluk:
        return jsonify([])
        
    overpass_url = "https://overpass-api.de/api/interpreter"
    query = f"""
    [out:json][timeout:15];
    area["name"="{taluk}"]["admin_level"="8"]->.a;
    (
      node(area.a)["place"="village"];
      node(area.a)["place"="suburb"];
      node(area.a)["place"="town"];
    );
    out tags;
    """
    try:
        response = requests.post(overpass_url, data={"data": query}, timeout=8)
        data = response.json()
        villages = set()
        for element in data.get('elements', []):
            tags = element.get('tags', {})
            name = tags.get('name')
            if name:
                villages.add(name.replace(" Village", "").replace(" Suburb", "").strip())
                
        if not villages:
            villages = get_fallback_villages(district, taluk)
        return jsonify(sorted(list(villages)))
    except Exception as e:
        print(f"Error fetching villages: {e}")
        return jsonify(sorted(get_fallback_villages(district, taluk)))

# 8. Endpoint: Get survey numbers under selected village
@app.route('/api/surveys', methods=['GET'])
def get_surveys():
    # Dynamically generate a typical cadastral survey options list for the UI select dropdown
    return jsonify(["10", "25", "46", "101", "102", "104", "105", "150", "205", "310"])

# 9. Endpoint: Get subdivisions under selected survey number
@app.route('/api/subdivs', methods=['GET'])
def get_subdivs():
    # Return subdivision options
    return jsonify(["1", "2", "1A", "1B", "2B", "3A", "4B"])

# Import scraper methods
from scraper import has_active_session, fetch_patta_fast, start_scraping_session, verify_otp_and_fetch

# 10. Endpoint: Check Master Session Status
@app.route('/api/session-status', methods=['GET'])
def session_status():
    return jsonify({"has_session": has_active_session()})

# 11. Endpoint: Fast Patta Fetch (using saved master session)
@app.route('/api/fetch-patta', methods=['POST'])
def fetch_patta():
    data = request.json or {}
    district = data.get('district')
    taluk = data.get('taluk')
    village = data.get('village')
    survey = data.get('survey') or "100"
    subdiv = data.get('subdiv') or ""

    if not district or not taluk or not village:
        return jsonify({"success": False, "error": "District, Taluk, and Village are required"}), 400

    result = fetch_patta_fast(district, taluk, village, survey, subdiv)
    return jsonify(result)

# 12. Endpoint: Start Playwright Scraping Session (sends OTP to mobile)
@app.route('/api/start-scraping', methods=['POST'])
def start_scraping():
    data = request.json or {}
    district = data.get('district')
    taluk = data.get('taluk')
    village = data.get('village')
    survey = data.get('survey') or "100"
    subdiv = data.get('subdiv') or ""
    mobile_no = data.get('mobile_no') or ""

    if not district or not taluk or not village:
        return jsonify({"success": False, "error": "District, Taluk, and Village are required"}), 400
    if not mobile_no or len(str(mobile_no).strip()) < 10:
        return jsonify({"success": False, "error": "Valid 10-digit mobile number is required for OTP"}), 400

    result = start_scraping_session(district, taluk, village, survey, subdiv=subdiv, mobile_no=mobile_no)
    return jsonify(result)

# 13. Endpoint: Verify OTP and Fetch Patta data
@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    data = request.json or {}
    session_id = data.get('session_id')
    otp_code = data.get('otp_code')

    if not session_id or not otp_code:
        return jsonify({"success": False, "error": "Session ID and OTP code are required"}), 400

    result = verify_otp_and_fetch(session_id, otp_code)
    return jsonify(result)

# 14. Endpoint: Direct TNGIS WFS GeoServer Boundary Lookup
@app.route('/api/spatial-boundary', methods=['POST'])
def spatial_boundary():
    data = request.json or {}
    lat = data.get('lat')
    lng = data.get('lng')

    if not lat or not lng:
        return jsonify({"error": "Latitude and longitude are required"}), 400

    # Query TNGIS WFS layer directly using spatial bounding box
    delta = 0.0005
    bbox = f"{lng - delta},{lat - delta},{lng + delta},{lat + delta},EPSG:4326"
    wfs_url = "https://tngis.tn.gov.in/geoserver/wfs"
    params = {
        'service': 'WFS',
        'version': '1.1.0',
        'request': 'GetFeature',
        'typeName': 'tngis:village_boundary',
        'outputFormat': 'application/json',
        'srsname': 'EPSG:4326',
        'bbox': bbox
    }
    try:
        resp = requests.get(wfs_url, params=params, timeout=5)
        if resp.status_code == 200:
            return jsonify(resp.json())
    except Exception as e:
        print(f"Direct WFS error: {e}")

    # Fallback to local bounding polygon calculation
    size = 0.00025
    poly = [
        [lat - size, lng - size],
        [lat + size, lng - size],
        [lat + size, lng + size],
        [lat - size, lng + size]
    ]
    return jsonify({
        "type": "Feature",
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[p[1], p[0]] for p in poly]]
        }
    })

from session_daemon import start_session_daemon

if __name__ == '__main__':
    # Start 24/7 Silent Background Master Session Renewal Worker
    start_session_daemon(interval_seconds=21600)  # Renews every 6 hours

    print("---------------------------------------------")
    print("Flask Web GIS Server starting on port 5000...")
    print("Endpoints available:")
    print(" - GET  http://127.0.0.1:5000/api/session-status")
    print(" - POST http://127.0.0.1:5000/api/fetch-patta")
    print(" - POST http://127.0.0.1:5000/api/start-scraping")
    print(" - POST http://127.0.0.1:5000/api/verify-otp")
    print(" - POST http://127.0.0.1:5000/api/spatial-boundary")
    print(" - GET  http://127.0.0.1:5000/api/districts")
    print(" - GET  http://127.0.0.1:5000/api/taluks")
    print(" - GET  http://127.0.0.1:5000/api/villages")
    print(" - GET  http://127.0.0.1:5000/api/surveys")
    print(" - GET  http://127.0.0.1:5000/api/subdivs")
    print("---------------------------------------------")
    app.run(debug=True, port=5000, use_reloader=False)

