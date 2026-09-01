from fastapi import APIRouter
from app.schemas.tool_schemas import BuildingValueQuery
from app.core.calculation_engine import calculate_building_value

router = APIRouter()

@router.post("/calculate")
def compute_building_value(query: BuildingValueQuery):
    total_area = query.totalAreaSqFt or 0.0
    if query.floors:
        total_area = sum([float(f.get("areaSqFt", 0.0)) for f in query.floors])

    result = calculate_building_value(
        building_type=query.buildingType or "residential_rcc",
        age_years=query.ageYears or 0,
        total_area_sqft=total_area,
        amenities_cost=query.amenitiesCost or 0.0
    )
    return {
        "success": True,
        "data": result
    }