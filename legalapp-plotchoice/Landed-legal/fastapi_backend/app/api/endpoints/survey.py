from fastapi import APIRouter
from app.schemas.tool_schemas import SurveyQuery

router = APIRouter()

@router.post("/resolve")
def resolve_survey(query: SurveyQuery):
    sno = query.surveyNumber or "142"
    subdiv = query.subDivision or "3B"
    return {
        "success": True,
        "data": {
            "surveyNumber": sno,
            "subDivision": subdiv,
            "fullSurveyKey": f"{sno}/{subdiv}",
            "district": query.district or "Chennai",
            "taluk": query.taluk or "Velachery",
            "village": query.village or "Velachery",
            "sroName": "Velachery SRO",
            "landClassification": "Ryotwari Natham / Residential",
            "pattaNumber": "PATTA-VEL-2021-982",
            "totalExtent": "0.08 Hectares (1,950 Sq.Ft)",
            "fmbSketchAvailable": True,
            "fmbSketchUrl": "/api/v1/fmb/preview/142-3B.pdf"
        },
        "message": "Cadastral survey intelligence resolved."
    }