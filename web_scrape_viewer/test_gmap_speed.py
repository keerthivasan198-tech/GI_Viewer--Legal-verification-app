import time
import requests

urls = [
    ("Google Maps Vector", "https://mt1.google.com/vt/lyrs=m&x=47372&y=29994&z=16"),
    ("Google Maps Satellite", "https://mt1.google.com/vt/lyrs=s&x=47372&y=29994&z=16"),
    ("Google Maps Hybrid", "https://mt1.google.com/vt/lyrs=y&x=47372&y=29994&z=16"),
    ("ESRI World Street Map", "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/16/29994/47372"),
    ("CARTO Voyager Standard", "https://a.basemaps.cartocdn.com/rastertiles/voyager/16/47372/29994.png")
]

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

for name, url in urls:
    try:
        t0 = time.time()
        r = requests.get(url, headers=headers, timeout=5)
        dt = (time.time() - t0) * 1000
        print(f"{name}: HTTP {r.status_code} in {dt:.1f}ms ({len(r.content)} bytes)")
    except Exception as e:
        print(f"{name}: Failed - {e}")
