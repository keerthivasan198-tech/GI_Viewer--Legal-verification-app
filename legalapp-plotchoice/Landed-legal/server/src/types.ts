
export interface SROMasterRecord {
  id: string;
  zone: string;
  district: string;
  taluk: string;
  sroCode: string;
  sroName: string;
  address: string;
  phone: string;
  email: string;
  pincode: string;
  jurisdictionVillages: string[];
}

export interface GuidelineMasterRecord {
  id: string;
  zone: string;
  district: string;
  sro: string;
  village: string;
  streetName: string;
  surveyNumber?: string;
  guidelineValueSqFt: number;
  guidelineValueAcre: number;
  landClassification: string;
  effectiveDate: string;
  compositeValueSqFt?: number;
}

export interface ProhibitedRecord {
  id: string;
  prohibitionType: 'HRCE_TEMPLE' | 'WAQF_BOARD' | 'GOVT_PORAMBOKE' | 'BHOODAN';
  institutionName: string;
  district: string;
  taluk: string;
  village: string;
  surveyNumber: string;
  subDivision?: string;
  extent: string;
  gazetteReference: string;
  description: string;
}

export interface ECRecord {
  id: string;
  documentNumber: string;
  registrationDate: string;
  natureOfDocument: string;
  executants: string;
  claimants: string;
  propertyDescription: string;
  surveyNo: string;
  extent: string;
  isEncumbrance: boolean;
  remarks?: string;
}
