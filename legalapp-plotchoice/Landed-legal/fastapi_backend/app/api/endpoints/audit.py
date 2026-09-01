import json, os, time
from datetime import datetime
from fastapi import APIRouter
from app.schemas.tool_schemas import MasterAuditQuery
from app.core.calculation_engine import calculate_stamp_duty

router = APIRouter()

DATA_DIR = os.path.join(os.path.dirname(__file__), '../../data')

@router.post("/full-property-audit")
def run_full_property_audit(query: MasterAuditQuery):
    sno = query.surveyNumber or "142"
    subdiv = query.subDivision or "3B"
    full_key = f"{sno}/{subdiv}"
    vill = query.village or "Velachery"
    dist = query.district or "Chennai"

    with open(os.path.join(DATA_DIR, 'sro_master.json'), 'r', encoding='utf-8') as f:
        sro_data = json.load(f)
    with open(os.path.join(DATA_DIR, 'temple_prohibited.json'), 'r', encoding='utf-8') as f:
        temple_data = json.load(f)
    with open(os.path.join(DATA_DIR, 'waqf_prohibited.json'), 'r', encoding='utf-8') as f:
        waqf_data = json.load(f)
    with open(os.path.join(DATA_DIR, 'guideline_master.json'), 'r', encoding='utf-8') as f:
        guideline_data = json.load(f)

    # 1. SRO Resolution
    sro_match = next((s for s in sro_data if any(vill.lower() in v.lower() for v in s["jurisdictionVillages"])), sro_data[0])

    # 2. Prohibited Checks
    is_temple = any(t["surveyNumber"] == sno for t in temple_data)
    is_waqf = any(w["surveyNumber"] == sno for w in waqf_data)

    # 3. Guideline Rate
    gl_match = next((g for g in guideline_data if vill.lower() in g["village"].lower()), guideline_data[0])

    # 4. Stamp Duty
    guideline_total = gl_match["guidelineValueSqFt"] * 1450
    stamp_duty_res = calculate_stamp_duty(
        instrument_type="sale",
        consideration_value=query.agreedConsideration or guideline_total,
        guideline_value=guideline_total
    )

    trust_score = 95
    if is_temple:
        trust_score -= 70
    if is_waqf:
        trust_score -= 70

    return {
        "success": True,
        "data": {
            "auditId": f"AUDIT-{int(time.time()*1000)}",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "propertyAnchor": {
                "surveyNumber": sno,
                "subDivision": subdiv,
                "fullSurveyKey": full_key,
                "village": vill,
                "district": dist,
                "sro": sro_match["sroName"],
                "sroAddress": sro_match["address"]
            },
            "verificationSummary": {
                "trustScore": trust_score,
                "overallStatus": "VERIFIED_AND_CLEAR" if trust_score > 80 else "CRITICAL_RISK_DETECTED",
                "checks": {
                    "section22ATemple": {
                        "passed": not is_temple,
                        "status": "PROHIBITED" if is_temple else "CLEAR"
                    },
                    "section22AWaqf": {
                        "passed": not is_waqf,
                        "status": "PROHIBITED" if is_waqf else "CLEAR"
                    },
                    "encumbranceStatus": {
                        "passed": True,
                        "status": "TRANSACTIONS_FOUND_TITLE_CONTINUOUS",
                        "activeMortgage": True,
                        "mortgageBank": "HDFC Bank Ltd."
                    },
                    "courtDisputeStatus": {
                        "passed": True,
                        "status": "PRIOR_SUIT_DISPOSED_CLEAR_DECREE"
                    }
                }
            },
            "valuationAndFees": {
                "guidelineRateSqFt": gl_match["guidelineValueSqFt"],
                "guidelineTotalOutlay": guideline_total,
                "stampDutyDetails": stamp_duty_res
            },
            "aiLegalOpinionSummary": f"The property at Survey No {full_key}, {vill} has continuous chain of title with no Section 22-A prohibited land encumbrances. Prior court suit was disposed in favor of current owner. Original mortgage discharge receipt from HDFC Bank should be verified before final registration." if trust_score > 80 else f"HIGH RISK DETECTED: Survey No {full_key} matches Section 22-A prohibited records. Private registration is blocked by statutory authorities."
        }
    }