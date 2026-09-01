from fastapi import APIRouter
from app.schemas.tool_schemas import CompositeQuery

router = APIRouter()

@router.post("/calculate")
def calculate_composite(query: CompositeQuery):
    land_rate = query.landGuidelineSqFt or 8500.0
    sbu_area = query.superBuiltUpAreaSqFt or 1200.0
    uds_area = query.udsAreaSqFt or 450.0
    age = query.ageYears or 3

    land_value_component = uds_area * land_rate
    construction_rate = 2800.0 if query.buildingClass != "premium" else 3600.0

    gross_building_component = sbu_area * construction_rate
    depreciation_amount = round((gross_building_component * min(age * 1.5, 50.0)) / 100.0)
    net_building_component = gross_building_component - depreciation_amount

    total_composite_valuation = land_value_component + net_building_component
    effective_composite_rate_sqft = round(total_composite_valuation / sbu_area)

    return {
        "success": True,
        "data": {
            "landRateSqFt": land_rate,
            "udsAreaSqFt": uds_area,
            "landValueComponent": land_value_component,
            "constructionRateSqFt": construction_rate,
            "grossBuildingComponent": gross_building_component,
            "depreciationAmount": depreciation_amount,
            "netBuildingComponent": net_building_component,
            "totalCompositeValuation": total_composite_valuation,
            "effectiveCompositeRateSqFt": effective_composite_rate_sqft
        }
    }