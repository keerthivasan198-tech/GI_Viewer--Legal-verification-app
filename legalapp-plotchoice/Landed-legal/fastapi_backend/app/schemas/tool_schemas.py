from pydantic import BaseModel, Field
from typing import Optional, List, Any

class ECQuery(BaseModel):
    searchMode: Optional[str] = "survey"
    zone: Optional[str] = None
    district: Optional[str] = None
    sro: Optional[str] = None
    village: Optional[str] = None
    startDate: Optional[str] = None
    endDate: Optional[str] = None
    surveyRows: Optional[List[dict]] = None
    plots: Optional[List[dict]] = None
    flats: Optional[List[dict]] = None
    documentType: Optional[str] = None
    documentNumber: Optional[str] = None
    documentYear: Optional[str] = None

class CERSAIQuery(BaseModel):
    searchMode: Optional[str] = "asset"
    borrowerName: Optional[str] = None
    pan: Optional[str] = None
    propertyAddress: Optional[str] = None
    surveyNumber: Optional[str] = None

class CourtQuery(BaseModel):
    courtLevel: Optional[str] = "district"
    caseNumber: Optional[str] = None
    cnrNumber: Optional[str] = None
    partyName: Optional[str] = None
    surveyNumber: Optional[str] = None

class GuidelineQuery(BaseModel):
    zone: Optional[str] = None
    district: Optional[str] = None
    sro: Optional[str] = None
    village: Optional[str] = None
    streetName: Optional[str] = None
    surveyNumber: Optional[str] = None

class CompositeQuery(BaseModel):
    landGuidelineSqFt: Optional[float] = 8500.0
    superBuiltUpAreaSqFt: Optional[float] = 1200.0
    udsAreaSqFt: Optional[float] = 450.0
    buildingClass: Optional[str] = "standard"
    floorNumber: Optional[int] = 2
    ageYears: Optional[int] = 3

class ProhibitedQuery(BaseModel):
    district: Optional[str] = None
    taluk: Optional[str] = None
    village: Optional[str] = None
    surveyNumber: Optional[str] = None
    subDivisionNumber: Optional[str] = None
    templeName: Optional[str] = None
    institutionName: Optional[str] = None

class StampDutyQuery(BaseModel):
    instrumentType: Optional[str] = "sale"
    considerationValue: Optional[float] = 0.0
    guidelineValue: Optional[float] = 0.0
    isFemaleBuyer: Optional[bool] = False

class SROQuery(BaseModel):
    village: Optional[str] = None
    pincode: Optional[str] = None
    taluk: Optional[str] = None
    district: Optional[str] = None

class BuildingValueQuery(BaseModel):
    buildingType: Optional[str] = "residential_rcc"
    ageYears: Optional[int] = 0
    totalAreaSqFt: Optional[float] = 0.0
    floors: Optional[List[dict]] = None
    amenitiesCost: Optional[float] = 0.0

class SurveyQuery(BaseModel):
    surveyNumber: Optional[str] = "142"
    subDivision: Optional[str] = "3B"
    district: Optional[str] = "Chennai"
    taluk: Optional[str] = "Velachery"
    village: Optional[str] = "Velachery"

class DeedQuery(BaseModel):
    templateId: Optional[str] = "sale-deed"
    executantName: Optional[str] = None
    claimantName: Optional[str] = None
    propertySchedule: Optional[str] = None
    considerationAmount: Optional[float] = None

class OTPQuery(BaseModel):
    phone: str
    countryCode: Optional[str] = "+91"

class OTPVerifyQuery(BaseModel):
    phone: str
    otp: str

class MasterAuditQuery(BaseModel):
    surveyNumber: Optional[str] = "142"
    subDivision: Optional[str] = "3B"
    village: Optional[str] = "Velachery"
    district: Optional[str] = "Chennai"
    agreedConsideration: Optional[float] = None