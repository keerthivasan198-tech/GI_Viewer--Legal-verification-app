import requests
import json

lat, lng = 13.0337, 80.2692 # Mylapore near Ramkrishna Mutt Road

# Method 1: Overpass API with headers
overpass_url = 'https://overpass-api.de/api/interpreter'
query = f"""
[out:json][timeout:10];
(
  way["building"](around:50, {lat}, {lng});
);
out geom;
"""
headers = {
    "User-Agent": "CadastralGISViewer/1.0 (contact@tamilnadugis.org)",
    "Content-Type": "application/x-www-form-urlencoded"
}

try:
    r = requests.post(overpass_url, data={'data': query}, headers=headers, timeout=10)
    print('Overpass Status:', r.status_code)
    data = r.json()
    elements = data.get('elements', [])
    print('Found buildings:', len(elements))
    for el in elements:
        geom = el.get('geometry', [])
        coords = [[pt['lat'], pt['lon']] for pt in geom]
        print('Building Way ID:', el.get('id'), 'Nodes:', len(coords))
        print('Sample coords:', coords[:3])
except Exception as e:
    print('Overpass error:', e)

# Method 2: Nominatim with polygon_geojson=1
nom_url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lng}&zoom=19&polygon_geojson=1&addressdetails=1"
try:
    r2 = requests.get(nom_url, headers=headers, timeout=8)
    print('Nominatim Status:', r2.status_code)
    d2 = r2.json()
    print('Nominatim Geojson Type:', d2.get('geojson', {}).get('type'))
    print('Nominatim Display Name:', d2.get('display_name'))
except Exception as e:
    print('Nominatim error:', e)
