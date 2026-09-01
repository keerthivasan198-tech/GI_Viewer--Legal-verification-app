from fastapi import APIRouter
from app.schemas.tool_schemas import StampDutyQuery
from app.core.calculation_engine import calculate_stamp_duty

router = APIRouter()

@router.post("/calculate")
def compute_stamp_duty(query: StampDutyQuery):
    result = calculate_stamp_duty(
        instrument_type=query.instrumentType or "sale",
        consideration_value=query.considerationValue or 0.0,
        guideline_value=query.guidelineValue or 0.0,
        is_female_buyer=query.isFemaleBuyer or False
    )
    return {
        "success": True,
        "data": result
    }