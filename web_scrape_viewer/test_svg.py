import math

def haversine_distance_meters(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def polygon_to_fmb_svg(coords):
    # Normalize coords to SVG viewBox 0,0 to 200,200
    lats = [c[0] for c in coords]
    lngs = [c[1] for c in coords]
    min_lat, max_lat = min(lats), max(lats)
    min_lng, max_lng = min(lngs), max(lngs)
    
    d_lat = max(max_lat - min_lat, 0.00001)
    d_lng = max(max_lng - min_lng, 0.00001)
    
    padding = 25
    scale_w = (200 - 2 * padding) / d_lng
    scale_h = (200 - 2 * padding) / d_lat
    scale = min(scale_w, scale_h)
    
    svg_pts = []
    for lat, lng in coords:
        # Invert lat for SVG Y axis
        x = padding + (lng - min_lng) * scale
        y = 200 - (padding + (lat - min_lat) * scale)
        svg_pts.append((round(x, 1), round(y, 1)))
        
    path_d = f"M {svg_pts[0][0]},{svg_pts[0][1]} " + " ".join([f"L {p[0]},{p[1]}" for p in svg_pts[1:]]) + " Z"
    
    # Calculate side lengths
    dims = []
    vertices = []
    n = len(coords)
    for i in range(n - 1 if coords[0] == coords[-1] else n):
        p1 = coords[i]
        p2 = coords[(i + 1) % n]
        dist = haversine_distance_meters(p1[0], p1[1], p2[0], p2[1])
        
        # Midpoint in SVG
        sp1 = svg_pts[i]
        sp2 = svg_pts[(i + 1) % len(svg_pts)]
        mx = (sp1[0] + sp2[0]) / 2.0
        my = (sp1[1] + sp2[1]) / 2.0
        dims.append({"x": round(mx, 1), "y": round(my, 1), "val": f"{dist:.1f} m"})
        
        lbl = chr(65 + (i % 26))
        vertices.append({"x": sp1[0], "y": sp1[1], "lbl": lbl})
        
    return path_d, dims, vertices

# Test with real building coords
sample_coords = [[13.0336638, 80.2695216], [13.0336679, 80.2695036], [13.0333738, 80.269415], [13.0333682, 80.2694384]]
path, dims, verts = polygon_to_fmb_svg(sample_coords)
print("Generated SVG Path:", path)
print("Generated Dims:", dims)
print("Generated Vertices:", verts)
