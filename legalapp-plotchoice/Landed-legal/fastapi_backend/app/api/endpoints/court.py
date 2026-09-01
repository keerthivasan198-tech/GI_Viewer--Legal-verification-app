from fastapi import APIRouter
from app.schemas.tool_schemas import CourtQuery

router = APIRouter()

@router.post("/search")
def search_court(query: CourtQuery):
    records = [
        {
            "id": "CRT-001",
            "cnrNumber": query.cnrNumber or "TNCH01-002491-2023",
            "caseNumber": query.caseNumber or "OS 340/2023",
            "caseType": "Original Suit (Partition & Injunction)",
            "year": "2023",
            "courtName": "Principal District Munsif Court, Alandur",
            "petitioner": query.partyName or "K. Ramesh & Others",
            "respondent": "K. Rajendran & S. Ananthakrishnan",
            "surveyNo": query.surveyNumber or "142/3B",
            "status": "DISPOSED",
            "summary": "Suit for partition dismissed. Clear decree in favor of defendants. No active stay order."
        }
    ]
    return {
        "success": True,
        "count": len(records),
        "data": records,
        "message": "eCourts judicial litigation search completed."
    }