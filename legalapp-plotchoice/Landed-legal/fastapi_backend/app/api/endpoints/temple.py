import json, os
from fastapi import APIRouter
from app.schemas.tool_schemas import ProhibitedQuery

router = APIRouter()
DATA_PATH = os.path.join(os.path.dirname(__file__), '../../data/temple_prohibited.json')

@router.post("/check")
def check_temple(query: ProhibitedQuery):
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        master_data = json.load(f)

    clean_sno = str(query.surveyNumber or "").strip()
    match = None
    for t in master_data:
        if clean_sno and t["surveyNumber"] == clean_sno:
            match = t
            break
        if query.templeName and query.templeName.lower() in t["institutionName"].lower():
            match = t
            break

    if match:
        return {
            "success": True,
            "isProhibited": True,
            "riskLevel": "HIGH_RISK_PROHIBITED",
            "data": match,
            "statutoryAdvice": "Property is classified as Temple Inam/Devadhanam land under Section 22-A of Registration Act. Strictly prohibited from private registration."
        }

    return {
        "success": True,
        "isProhibited": False,
        "riskLevel": "CLEAR",
        "data": None,
        "statutoryAdvice": "No Section 22-A HR&CE Temple endowment restrictions detected for this survey number."
    }