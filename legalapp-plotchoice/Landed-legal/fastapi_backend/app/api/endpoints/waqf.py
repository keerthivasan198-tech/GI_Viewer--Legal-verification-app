import json, os
from fastapi import APIRouter
from app.schemas.tool_schemas import ProhibitedQuery

router = APIRouter()
DATA_PATH = os.path.join(os.path.dirname(__file__), '../../data/waqf_prohibited.json')

@router.post("/check")
def check_waqf(query: ProhibitedQuery):
    with open(DATA_PATH, 'r', encoding='utf-8') as f:
        master_data = json.load(f)

    clean_sno = str(query.surveyNumber or "").strip()
    match = None
    for w in master_data:
        if clean_sno and w["surveyNumber"] == clean_sno:
            match = w
            break
        if query.institutionName and query.institutionName.lower() in w["institutionName"].lower():
            match = w
            break

    if match:
        return {
            "success": True,
            "isProhibited": True,
            "riskLevel": "HIGH_RISK_PROHIBITED",
            "data": match,
            "statutoryAdvice": "Target property is gazetted as Waqf Board endowment land under Waqf Act 1995 & Section 22-A. Conveyance prohibited without State Waqf Board sanction."
        }

    return {
        "success": True,
        "isProhibited": False,
        "riskLevel": "CLEAR",
        "data": None,
        "statutoryAdvice": "No Waqf Board restrictions detected for this survey parcel in published registers."
    }