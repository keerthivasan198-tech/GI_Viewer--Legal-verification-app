import time
import requests

tile_urls = [
    ("ESRI World Street Map", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/16/29994/47372"),
    ("OpenStreetMap Standard", "https://a.tile.openstreetmap.org/16/47372/29994.png"),
    ("CARTO Voyager", "https://a.basemaps.cartocdn.com/rastertiles/voyager/16/47372/29994.png"),
    ("ESRI Satellite", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/16/29994/47372")
]

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

for name, url in tile_urls:
    try:
        t0 = time.time()
        r = requests.get(url, headers=headers, timeout=4)
        elapsed = (time.time() - t0) * 1000
        print(f"{name}: HTTP {r.status_code} in {elapsed:.1f}ms (size: {len(r.content)} bytes)")
    except Exception as e:
        print(f"{name}: Failed - {e}")
