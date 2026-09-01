
export interface StampDutyInput {
  instrumentType: string;
  considerationValue: number;
  guidelineValue: number;
  isFemaleBuyer?: boolean;
}

export interface StampDutyOutput {
  taxableMarketValue: number;
  stampDutyPercent: number;
  stampDutyAmount: number;
  registrationFeePercent: number;
  registrationFeeAmount: number;
  surchargePercent: number;
  surchargeAmount: number;
  totalOutlay: number;
  calculationBasis: string;
}

export function calculateStampDuty(input: StampDutyInput): StampDutyOutput {
  const taxableValue = Math.max(input.considerationValue || 0, input.guidelineValue || 0);
  
  let stampDutyPct = 7;
  let regFeePct = 2;
  let surchargePct = 0;

  switch (input.instrumentType?.toLowerCase()) {
    case 'gift':
      stampDutyPct = 7;
      regFeePct = 2;
      break;
    case 'settlement_family':
    case 'settlement':
      stampDutyPct = 1;
      regFeePct = 1;
      break;
    case 'partition':
      stampDutyPct = 1;
      regFeePct = 1;
      break;
    case 'release':
      stampDutyPct = 1;
      regFeePct = 1;
      break;
    case 'mortgage':
      stampDutyPct = 1;
      regFeePct = 1;
      break;
    case 'lease':
      stampDutyPct = 1;
      regFeePct = 1;
      break;
    case 'sale':
    default:
      stampDutyPct = 7;
      regFeePct = 2;
      surchargePct = 0;
      break;
  }

  const stampDutyAmt = Math.round((taxableValue * stampDutyPct) / 100);
  const regFeeAmt = Math.round((taxableValue * regFeePct) / 100);
  const surchargeAmt = Math.round((taxableValue * surchargePct) / 100);
  const total = stampDutyAmt + regFeeAmt + surchargeAmt;

  return {
    taxableMarketValue: taxableValue,
    stampDutyPercent: stampDutyPct,
    stampDutyAmount: stampDutyAmt,
    registrationFeePercent: regFeePct,
    registrationFeeAmount: regFeeAmt,
    surchargePercent: surchargePct,
    surchargeAmount: surchargeAmt,
    totalOutlay: total,
    calculationBasis: input.considerationValue > input.guidelineValue
      ? 'Calculated on Agreed Consideration Value (higher than Guideline Value)'
      : 'Calculated on Government Guideline Value (higher than Agreed Consideration)'
  };
}

export interface BuildingValueParams {
  buildingType: string;
  ageYears: number;
  totalAreaSqFt: number;
  floorsCount?: number;
  amenitiesCost?: number;
}

export function calculateBuildingValue(params: BuildingValueParams) {
  let baseRateSqFt = 1800; // PWD RCC Standard rate
  if (params.buildingType?.toLowerCase().includes('commercial')) baseRateSqFt = 2400;
  if (params.buildingType?.toLowerCase().includes('industrial')) baseRateSqFt = 1500;
  if (params.buildingType?.toLowerCase().includes('tiled')) baseRateSqFt = 1100;

  const grossReplacementValue = params.totalAreaSqFt * baseRateSqFt;
  
  // Standard PWD depreciation: 1.5% per annum capped at 60%
  const depreciationPct = Math.min(params.ageYears * 1.5, 60);
  const depreciationAmount = Math.round((grossReplacementValue * depreciationPct) / 100);
  const depreciatedStructureValue = grossReplacementValue - depreciationAmount;
  const totalAmenities = params.amenitiesCost || 0;
  const netEstimatedValue = depreciatedStructureValue + totalAmenities;

  return {
    totalAreaSqFt: params.totalAreaSqFt,
    basePlinthRatePerSqFt: baseRateSqFt,
    grossReplacementValue,
    depreciationPercent: depreciationPct,
    depreciationAmount,
    depreciatedStructureValue,
    amenitiesCost: totalAmenities,
    estimatedBuildingValue: netEstimatedValue
  };
}
