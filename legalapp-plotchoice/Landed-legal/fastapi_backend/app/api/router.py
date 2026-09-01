from fastapi import APIRouter
from app.api.endpoints import (
    ec, cersai, court, guideline, composite, temple,
    waqf, stamp_duty, sro, forms, building_value, survey,
    audit, auth
)

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(audit.router, prefix="/audit", tags=["Master Property Audit"])
api_router.include_router(ec.router, prefix="/ec", tags=["Encumbrance Certificate"])
api_router.include_router(cersai.router, prefix="/cersai", tags=["CERSAI"])
api_router.include_router(court.router, prefix="/court", tags=["Court Cases"])
api_router.include_router(guideline.router, prefix="/guideline", tags=["Guideline Values"])
api_router.include_router(composite.router, prefix="/composite", tags=["Composite Valuation"])
api_router.include_router(temple.router, prefix="/temple", tags=["Temple HR&CE Check"])
api_router.include_router(waqf.router, prefix="/waqf", tags=["Waqf Check"])
api_router.include_router(stamp_duty.router, prefix="/stamp-duty", tags=["Stamp Duty Calculator"])
api_router.include_router(sro.router, prefix="/sro", tags=["SRO Locator"])
api_router.include_router(forms.router, prefix="/forms", tags=["Deeds & Forms"])
api_router.include_router(building_value.router, prefix="/building-value", tags=["Building Value"])
api_router.include_router(survey.router, prefix="/survey", tags=["Survey Number Intelligence"])