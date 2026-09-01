from fastapi import APIRouter
from app.schemas.tool_schemas import CERSAIQuery

router = APIRouter()

@router.post("/search")
def search_cersai(query: CERSAIQuery):
    records = [
        {
            "id": "CERSAI-SEC-901",
            "securityInterestId": "SI-2021-098412",
            "borrowerName": query.borrowerName or "S. Ananthakrishnan",
            "lenderBank": "HDFC Bank Ltd.",
            "assetCategory": "Immovable Residential Property",
            "propertyAddress": query.propertyAddress or "Plot 42B, Green Park Enclave, Velachery, Chennai",
            "surveyNo": query.surveyNumber or "142/3B",
            "sanctionedAmount": 5500000,
            "chargeCreationDate": "12-May-2018",
            "chargeStatus": "ACTIVE"
        }
    ]
    return {
        "success": True,
        "count": len(records),
        "data": records,
        "message": "CERSAI Central Securitisation Registry lookup complete."
    }