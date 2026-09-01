import json, os
from fastapi import APIRouter
from typing import Optional
from app.schemas.tool_schemas import SROQuery

router = APIRouter()
DATA_PATH = os.path.join(os.path.dirname(__file__), '../../data/sro_master.json')

@router.get("/list")
def list_sros(district: Optional[str] = None, zone: Optional[str] = None):
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        master_data = json.load(f)
    results = master_data
    if district:
        results = [s for s in results if s["district"].lower() == district.lower()]
    if zone:
        results = [s for s in results if s["zone"].lower() == zone.lower()]
    return {"success": True, "count": len(results), "data": results}

@router.post("/find")
def find_sro(query: SROQuery):
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        master_data = json.load(f)

    match = None
    for s in master_data:
        if query.pincode and s["pincode"] == str(query.pincode).strip():
            match = s
            break
        if query.village and any(query.village.lower() in v.lower() for v in s["jurisdictionVillages"]):
            match = s
            break
        if query.taluk and query.taluk.lower() in s["taluk"].lower():
            match = s
            break

    if not match:
        match = master_data[0]

    return {
        "success": True,
        "data": match,
        "message": "Designated Sub-Registrar Office located successfully."
    }