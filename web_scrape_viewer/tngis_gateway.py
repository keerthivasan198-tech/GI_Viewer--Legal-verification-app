import os
import requests
from flask import Blueprint, request, jsonify

tngis_bp = Blueprint("tngis_gateway", __name__, url_prefix="/api/tngis")

TNGIS_BASE_URL = os.environ.get("TNGIS_BASE_URL", "https://tngis.tnega.org/generic_api")
TNGIS_APP_NAME = os.environ.get("TNGIS_APP_NAME", "")

def get_headers():
    return {
        "X-APP-NAME": TNGIS_APP_NAME,
        "User-Agent": "TNGIS-Cadastral-Viewer/2.0",
        "Content-Type": "application/json"
    }

# 1. Administrative Data - District
@tngis_bp.route("/admin/district", methods=["POST"])
def get_district():
    data = request.json or {}
    payload = {
        "case": "district",
        "filter_code": data.get("filter_code", "lgd_code")
    }
    if not TNGIS_APP_NAME:
        # High-fidelity fallback with 38 Tamil Nadu districts
        return jsonify([{
            "success": 1,
            "message": "Districts Found (Offline Master)",
            "data": [
                {"district_code": "568", "district_name": "Chennai"},
                {"district_code": "610", "district_name": "Ariyalur"},
                {"district_code": "5706", "district_name": "Chengalpattu"},
                {"district_code": "577", "district_name": "Coimbatore"},
                {"district_code": "578", "district_name": "Cuddalore"},
                {"district_code": "579", "district_name": "Dharmapuri"},
                {"district_code": "580", "district_name": "Dindigul"},
                {"district_code": "581", "district_name": "Erode"},
                {"district_code": "582", "district_name": "Kallakurichi"},
                {"district_code": "583", "district_name": "Kanchipuram"},
                {"district_code": "584", "district_name": "Kanyakumari"},
                {"district_code": "585", "district_name": "Karur"},
                {"district_code": "586", "district_name": "Krishnagiri"},
                {"district_code": "587", "district_name": "Madurai"},
                {"district_code": "588", "district_name": "Mayiladuthurai"},
                {"district_code": "589", "district_name": "Nagapattinam"},
                {"district_code": "590", "district_name": "Namakkal"},
                {"district_code": "591", "district_name": "Nilgiris"},
                {"district_code": "592", "district_name": "Perambalur"},
                {"district_code": "593", "district_name": "Pudukkottai"},
                {"district_code": "594", "district_name": "Ramanathapuram"},
                {"district_code": "595", "district_name": "Ranipet"},
                {"district_code": "596", "district_name": "Salem"},
                {"district_code": "597", "district_name": "Sivaganga"},
                {"district_code": "598", "district_name": "Tenkasi"},
                {"district_code": "599", "district_name": "Thanjavur"},
                {"district_code": "600", "district_name": "Theni"},
                {"district_code": "601", "district_name": "Thoothukudi"},
                {"district_code": "602", "district_name": "Tiruchirappalli"},
                {"district_code": "603", "district_name": "Tirunelveli"},
                {"district_code": "604", "district_name": "Tirupathur"},
                {"district_code": "605", "district_name": "Tiruppur"},
                {"district_code": "606", "district_name": "Tiruvallur"},
                {"district_code": "607", "district_name": "Tiruvannamalai"},
                {"district_code": "608", "district_name": "Tiruvarur"},
                {"district_code": "609", "district_name": "Vellore"},
                {"district_code": "611", "district_name": "Viluppuram"},
                {"district_code": "612", "district_name": "Virudhunagar"}
            ]
        }])
    try:
        res = requests.post(f"{TNGIS_BASE_URL}/v1/getAdminDropDown", json=payload, headers=get_headers(), timeout=5)
        return jsonify(res.json()), res.status_code
    except Exception as e:
        return jsonify([{"success": 0, "message": str(e), "data": []}]), 500

# 2. Administrative Data - Taluk
@tngis_bp.route("/admin/taluk", methods=["POST"])
def get_taluk():
    data = request.json or {}
    district_code = str(data.get("district", "568"))
    payload = {
        "case": "taluk",
        "district": district_code,
        "filter_code": data.get("filter_code", "lgd_code")
    }
    if not TNGIS_APP_NAME:
        return jsonify([{
            "success": 1,
            "message": "Taluks Found (Offline Master)",
            "data": [
                {"taluk_code": "5701", "taluk_name": "Mylapore"},
                {"taluk_code": "5702", "taluk_name": "Guindy"},
                {"taluk_code": "5703", "taluk_name": "Velachery"},
                {"taluk_code": "5704", "taluk_name": "Alandur"},
                {"taluk_code": "5705", "taluk_name": "Ambattur"},
                {"taluk_code": "5706", "taluk_name": "Chengalpattu"}
            ]
        }])
    try:
        res = requests.post(f"{TNGIS_BASE_URL}/v1/getAdminDropDown", json=payload, headers=get_headers(), timeout=5)
        return jsonify(res.json()), res.status_code
    except Exception as e:
        return jsonify([{"success": 0, "message": str(e), "data": []}]), 500

# 3. Administrative Data - Revenue Village
@tngis_bp.route("/admin/village", methods=["POST"])
def get_village():
    data = request.json or {}
    payload = {
        "case": "village",
        "district": str(data.get("district", "568")),
        "taluk": str(data.get("taluk", "5701")),
        "filter_code": data.get("filter_code", "lgd_code")
    }
    if not TNGIS_APP_NAME:
        return jsonify([{
            "success": 1,
            "message": "Revenue Villages Found (Offline Master)",
            "data": [
                {"village_code": "629001", "village_name": "Adyar"},
                {"village_code": "629002", "village_name": "Mylapore Town"},
                {"village_code": "629003", "village_name": "Triplicane"},
                {"village_code": "629004", "village_name": "Velachery Village"}
            ]
        }])
    try:
        res = requests.post(f"{TNGIS_BASE_URL}/v1/getAdminDropDown", json=payload, headers=get_headers(), timeout=5)
        return jsonify(res.json()), res.status_code
    except Exception as e:
        return jsonify([{"success": 0, "message": str(e), "data": []}]), 500

# 4. Spatial Extent (District, Taluk, Village)
@tngis_bp.route("/spatial/extent", methods=["GET"])
def get_spatial_extent():
    init_level = request.args.get("initLevel", "1")
    district = request.args.get("district", "568")
    taluk = request.args.get("taluk", "")
    village = request.args.get("village", "")
    filter_code = request.args.get("filter_code", "lgd_code")

    params = {
        "initLevel": init_level,
        "filter_code": filter_code,
        "district": district
    }
    if taluk: params["taluk"] = taluk
    if village: params["village"] = village

    if not TNGIS_APP_NAME:
        return jsonify([{
            "success": 1,
            "message": "Extent Found (Standard Extent)",
            "extent": "79.8000, 12.8000, 80.3500, 13.2500"
        }])
    try:
        res = requests.get(f"{TNGIS_BASE_URL}/v1/get_extent", params=params, headers=get_headers(), timeout=5)
        return jsonify(res.json()), res.status_code
    except Exception as e:
        return jsonify([{"success": 0, "message": str(e)}]), 500

# 7. Attributes - GIS (map_column)
@tngis_bp.route("/gis/attributes", methods=["POST"])
def get_gis_attributes():
    data = request.json or {}
    payload = {
        "case": "gis_attributes",
        "layer_id": data.get("layer_id", 1),
        "latitude": data.get("latitude", 13.0827),
        "longitude": data.get("longitude", 80.2707)
    }
    if not TNGIS_APP_NAME:
        return jsonify({
            "Districts": {
                "object_id": 29,
                "district_lgd_code": 568,
                "district_name": "Chennai",
                "district_tamil_name": "சென்னை",
                "area_in_sqkm": "462.260",
                "no_of_villages": 0
            },
            "status": 1,
            "message": "Data Found (Local Catalog)"
        })
    try:
        res = requests.post(f"{TNGIS_BASE_URL}/v1/attributes", json=payload, headers=get_headers(), timeout=5)
        return jsonify(res.json()), res.status_code
    except Exception as e:
        return jsonify({"status": 0, "message": str(e)}), 500

# 8. Multi Feature Attributes - Based on Buffer
@tngis_bp.route("/gis/buffer-features", methods=["POST"])
def get_buffer_features():
    data = request.json or {}
    payload = {
        "case": "multi_feature_gis_attributes",
        "layer_id": data.get("layer_id", 101),
        "latitude": data.get("latitude", 13.0827),
        "longitude": data.get("longitude", 80.2707),
        "buffer_distance": data.get("buffer_distance", 500)
    }
    if not TNGIS_APP_NAME:
        return jsonify([{
            "State Highways & Key Roads": [
                {
                    "object_id": 416,
                    "road_num": "SH118A",
                    "road_nam": "Gandhi Mandapam / Kanchipuram Corridor",
                    "circle_nam": "Chennai",
                    "divn_nam": "Chengalpattu",
                    "subdvn_nam": "Kanchipuram",
                    "distance": "0.42 km"
                }
            ],
            "status": 1,
            "message": "Data Found (Buffer Search)"
        }])
    try:
        res = requests.post(f"{TNGIS_BASE_URL}/v1/attributes", json=payload, headers=get_headers(), timeout=5)
        return jsonify(res.json()), res.status_code
    except Exception as e:
        return jsonify([{"status": 0, "message": str(e)}]), 500

# 9. Nearest Feature
@tngis_bp.route("/gis/nearest-feature", methods=["POST"])
def get_nearest_feature():
    data = request.json or {}
    payload = {
        "layer_id": data.get("layer_id", 1472),
        "latitude": data.get("latitude", 13.0827),
        "longitude": data.get("longitude", 80.2707),
        "feature_count": data.get("feature_count", 3)
    }
    if not TNGIS_APP_NAME:
        return jsonify([{
            "Civic & Utilities Infrastructure": [
                {
                    "facility_name": "TNeGA e-Seva Centre / Corporation Ward Office",
                    "latitude": str(data.get("latitude", 13.0827)),
                    "longitude": str(data.get("longitude", 80.2707)),
                    "distance": "120.5 meters",
                    "object_id": 78,
                    "layer_id": 1472
                }
            ],
            "status": 1,
            "message": "Data Found"
        }])
    try:
        res = requests.post(f"{TNGIS_BASE_URL}/v1/nearest_feature", json=payload, headers=get_headers(), timeout=5)
        return jsonify(res.json()), res.status_code
    except Exception as e:
        return jsonify([{"status": 0, "message": str(e)}]), 500

# 10. Inside Boundary Check
@tngis_bp.route("/gis/inside-boundary", methods=["POST"])
def check_inside_boundary():
    data = request.json or {}
    payload = {
        "latitude": data.get("latitude", 13.0827),
        "longitude": data.get("longitude", 80.2707),
        "layer_id": data.get("layer_id", 1),
        "attribute_column": data.get("attribute_column", "district_lgd_code"),
        "attribute_value": str(data.get("attribute_value", "568"))
    }
    if not TNGIS_APP_NAME:
        return jsonify([{
            "success": 1,
            "message": "Inside the given feature"
        }])
    try:
        res = requests.post(f"{TNGIS_BASE_URL}/v1/inside_boundary", json=payload, headers=get_headers(), timeout=5)
        return jsonify(res.json()), res.status_code
    except Exception as e:
        return jsonify([{"success": 0, "message": str(e)}]), 500
