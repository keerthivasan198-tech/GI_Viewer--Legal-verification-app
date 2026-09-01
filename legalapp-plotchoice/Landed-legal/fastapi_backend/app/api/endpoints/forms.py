from fastapi import APIRouter
import time
from app.schemas.tool_schemas import DeedQuery

router = APIRouter()

@router.get("/templates")
def list_templates():
    templates = [
        {"id": "sale-agreement", "name": "Agreement to Sell", "category": "draft-deed"},
        {"id": "sale-deed", "name": "Absolute Sale Deed", "category": "draft-deed"},
        {"id": "lease-agreement", "name": "Residential Lease Agreement", "category": "draft-deed"},
        {"id": "general-power-of-attorney", "name": "General Power of Attorney (GPA)", "category": "draft-deed"},
        {"id": "settlement-deed", "name": "Family Settlement Deed", "category": "draft-deed"},
        {"id": "will-deed", "name": "Last Will and Testament", "category": "draft-deed"}
    ]
    return {"success": True, "count": len(templates), "data": templates}

@router.post("/generate")
def generate_deed(query: DeedQuery):
    return {
        "success": True,
        "deedId": f"DEED-{int(time.time()*1000)}",
        "templateId": query.templateId or "sale-deed",
        "downloadDocxUrl": f"/downloads/deeds/deed-{query.templateId or 'sale'}.docx",
        "downloadPdfUrl": f"/downloads/deeds/deed-{query.templateId or 'sale'}.pdf",
        "message": "Legal deed generated with custom recitals and property schedules."
    }