export interface ToolItem {
  id: string;
  title: string;
  description: string;
  path: string;
  category: 'verification' | 'valuation' | 'search' | 'utilities';
  iconName: string;
  badge?: string;
  imageBanner?: string;
  cardImage?: string;
  imageUrl?: string;
}

export interface LocationOption {
  value: string;
  label: string;
}

export type ECSearchMode = 'survey' | 'document' | 'plotFlat';

export interface ECSurveyRow {
  id: string;
  surveyNumber: string;
  subDivisionNumber: string;
}

export interface ECPlotRow {
  id: string;
  plotNumber: string;
}

export interface ECFlatRow {
  id: string;
  flatNumber: string;
}

export interface ECFormData {
  searchMode: ECSearchMode;
  zone: string;
  district: string;
  sro: string;
  village: string;
  startDate: string;
  endDate: string;
  surveyRows: ECSurveyRow[];
  plots: ECPlotRow[];
  flats: ECFlatRow[];
  documentType: string;
  documentNumber: string;
  documentYear: string;
}

export interface CourtCNRContact {
  recipientName: string;
  countryCode: string;
  whatsappNumber: string;
}

export interface TempleSearchInput {
  district: string;
  templeName?: string;
  taluk?: string;
  village?: string;
  oldSurveyNumber?: string;
  newSurveyNumber?: string;
  subDivisionNumber?: string;
  pattaNumber?: string;
}

export interface StampDutyCategory {
  id: string;
  name: string;
  stampDutyRatePercent: number;
  registrationFeeRatePercent: number;
  description?: string;
}

export interface GuidelineResult {
  id: string;
  streetName: string;
  guidelineValue: string;
  landClassification: string;
  effectiveDate: string;
}

export interface CompositeValueResult {
  id: string;
  streetName: string;
  compositeValue: string;
  buildingClass: string;
  effectiveDate: string;
}

export type FormCategory = 'draft-deed' | 'other-form' | 'cmda-form';

export interface FormDocument {
  id: string;
  title: string;
  category: FormCategory;
  description: string;
  englishAvailable?: boolean;
  tamilAvailable?: boolean;
  downloadUrl?: string | null;
  pdfUrl?: string | null;
  documentType: string;
}

export interface TemplateDocument {
  id: string;
  title: string;
  description: string;
  category: string;
  englishLink?: string;
  tamilLink?: string;
}

export interface FloorDetail {
  id: string;
  floorName: string;
  areaSqFt: number;
  materialType: string;
  woodType: string;
  roofType: string;
}

export interface BuildingValueInput {
  buildingType: string;
  region: string;
  calculationPeriod: string;
  insertionUnit: string;
  ageYears: number;
  floors: FloorDetail[];
  floorType?: string;
  electricalCost?: number;
  waterSupplyCost?: number;
  sanitaryCost?: number;
  extraAmenitiesCost?: number;
  compoundWallLength?: number;
  garageArea?: number;
}

export interface BuildingValueOutput {
  totalAreaSqFt: number;
  basePlinthRate: number;
  depreciatedValue: number;
  floorAdjustments: number;
  amenitiesTotal: number;
  estimatedBuildingValue: number;
}
