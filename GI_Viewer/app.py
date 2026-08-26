# --- Flask Web GIS Server (app.py) ---
# Dependencies: pip install flask flask-cors requests

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import json
import os
import requests

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing (CORS) for frontend requests

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
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading database: {e}")
        return []

# Point-in-Polygon (Ray-Casting) Algorithm to check if a clicked GPS point is inside a land parcel
def point_in_polygon(lat, lng, polygon):
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
    db = load_database()
    return jsonify(db)

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
                        
                    ownersList = ["M. Subramanian", "T. Loganathan", "K. Palanivel", "R. Chidambaram", "S. Swaminathan", "V. Bhuvaneshwari", "A. Murugan", "P. Karthikeyan", "S. Jayachandran", "K. Meenakshi"]
                    randomOwner = ownersList[int(lat * 1000) % len(ownersList)]
                    randomExtent = round(0.2 + (lng % 0.5), 2)
                    randomTax = round(2.0 + (lat % 1.5) * 5, 2)
                    randomUlpin = f"74TM{int(lat*100)%90}DD{int(lng*100)%9}MPLH{int(lat+lng)%9}"
                    
                    # Apply specific dynamic values based on the Land Type filter
                    category = "Private (Ryotwari)"
                    parcel_type = "Ryotwari Punjai (Dry Land)"
                    owner = randomOwner
                    
                    if land_type == "Government Poramboke":
                        category = "Government Poramboke"
                        parcel_type = "Tharisu (Waste Land / Public)"
                        owner = "Government of Tamil Nadu"
                    elif land_type == "Temple Trust":
                        category = "Private (Temple Endowment)"
                        parcel_type = "Ryotwari Nanjai (Wet Land)"
                        owner = "Arulmigu Subramaniaswamy Temple Trust (HR&CE)"
                    elif land_type == "WAQF Property":
                        category = "WAQF Board Property"
                        parcel_type = "Ryotwari Punjai (Dry Land)"
                        owner = "Tamil Nadu Waqf Board Mutawalli"
                    elif land_type == "Ryotwari Nanjai":
                        category = "Private (Ryotwari)"
                        parcel_type = "Ryotwari Nanjai (Wet Land)"
                    elif land_type == "Ryotwari Punjai":
                        category = "Private (Ryotwari)"
                        parcel_type = "Ryotwari Punjai (Dry Land)"
                        
                    dynamic_parcel = {
                        "district": district,
                        "taluk": taluk or "General Taluk",
                        "village": village or "General Village",
                        "survey": survey,
                        "subdiv": subdiv,
                        "owner": owner,
                        "patta": str(int(lat*1000)%9000),
                        "category": category,
                        "type": parcel_type,
                        "area": f"0 Hectares, {int(randomExtent*100)} Ares ({round(randomExtent*2.47, 2)} Acres)",
                        "tax": "Exempted" if category == "Government Poramboke" else f"₹ {randomTax}",
                        "soil": "Sandy Loam / Class II" if category != "Government Poramboke" else "Clayey / Class V",
                        "coords": coords,
                        "ulpin": randomUlpin,
                        "adjacent": {
                            "N": f"Survey {survey}/{subdiv}_N",
                            "S": f"Survey {survey}/{subdiv}_S",
                            "E": "Private Land",
                            "W": "Road Access"
                        },
                        "svgPath": "M 20,40 L 180,20 L 190,160 L 40,180 Z",
                        "svgDims": [
                            { "x": 100, "y": 25, "val": "45.2 m" }, { "x": 190, "y": 90, "val": "38.5 m" },
                            { "x": 115, "y": 175, "val": "44.1 m" }, { "x": 25, "y": 110, "val": "37.8 m" }
                        ],
                        "vertices": [{ "x": 20, "y": 40, "lbl": "A" }, { "x": 180, "y": 20, "lbl": "B" }, { "x": 190, "y": 160, "lbl": "C" }, { "x": 40, "y": 180, "lbl": "D" }]
                    }
                    
                    return jsonify([dynamic_parcel])
            except Exception as e:
                print(f"OSM Search exception for query '{search_query}': {e}")
                
    return jsonify([])

# 3. Endpoint: Click map GPS query (Identify tool)
@app.route('/api/query-coords', methods=['POST'])
def query_coords():
    data = request.json or {}
    lat = data.get('lat')
    lng = data.get('lng')
    
    if lat is None or lng is None:
        return jsonify({"error": "Latitude and longitude required"}), 400
        
    db = load_database()
    
    for parcel in db:
        if point_in_polygon(lat, lng, parcel['coords']):
            return jsonify({"found": True, "parcel": parcel})
            
    return jsonify({"found": False, "message": "No local land parcel found."})

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

# 5. Endpoint: Get unique districts in database
@app.route('/api/districts', methods=['GET'])
def get_districts():
    # Return list of districts (both from fallback dataset and custom uploads in db)
    db = load_database()
    districts = set(parcel.get('district') for parcel in db if parcel.get('district'))
    districts.update(FALLBACK_DATA.keys())
    return jsonify(sorted(list(districts)))

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


# Serve frontend files (index.html, JS, CSS) from the app directory
@app.route('/', methods=['GET'])
def serve_index():
    return send_from_directory(os.path.dirname(__file__), 'index.html')


@app.route('/<path:filename>')
def serve_static(filename):
    # Protect API routes from being captured by this catch-all
    if filename.startswith('api/'):
        return jsonify({"error": "API route not found"}), 404
    return send_from_directory(os.path.dirname(__file__), filename)

if __name__ == '__main__':
    print("---------------------------------------------")
    print("Flask Web GIS Server starting on port 5000...")
    print("Endpoints available:")
    print(" - GET  http://127.0.0.1:5000/api/parcels")
    print(" - POST http://127.0.0.1:5000/api/search")
    print(" - POST http://127.0.0.1:5000/api/query-coords")
    print(" - POST http://127.0.0.1:5000/api/reverse-geocode")
    print(" - GET  http://127.0.0.1:5000/api/districts")
    print(" - GET  http://127.0.0.1:5000/api/taluks")
    print(" - GET  http://127.0.0.1:5000/api/villages")
    print(" - GET  http://127.0.0.1:5000/api/surveys")
    print(" - GET  http://127.0.0.1:5000/api/subdivs")
    print("---------------------------------------------")
    app.run(debug=True, port=5000)
