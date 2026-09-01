import { StampDutyCategory } from '../types';

// TODO: Replace mock rate configuration with official Tamil Nadu Inspector General of Registration (TNREGINET) API / Government Rate Schedules.
export const STAMP_DUTY_CATEGORIES: StampDutyCategory[] = [
  {
    id: 'conveyance_sale',
    name: '1. Conveyance (Sale)',
    stampDutyRatePercent: 7,
    registrationFeeRatePercent: 2,
    description: '7% Stamp Duty + 2% Registration Fee on market consideration or guideline value.'
  },
  {
    id: 'sale_deed_apartments',
    name: '2. Sale Deed for Apartments',
    stampDutyRatePercent: 7,
    registrationFeeRatePercent: 2,
    description: 'Calculated on Apartment Composite Value (Land UDS + Building).'
  },
  {
    id: 'gift',
    name: '3. Gift',
    stampDutyRatePercent: 7,
    registrationFeeRatePercent: 2,
    description: '7% Stamp Duty + 2% Registration Fee on market value.'
  },
  {
    id: 'exchange',
    name: '4. Exchange',
    stampDutyRatePercent: 7,
    registrationFeeRatePercent: 2,
    description: '7% Stamp Duty on the property of greater value.'
  },
  {
    id: 'simple_mortgage',
    name: '5. Simple Mortgage',
    stampDutyRatePercent: 1,
    registrationFeeRatePercent: 1,
    description: '1% Stamp Duty (Max ₹40,000) + 1% Reg Fee.'
  },
  {
    id: 'mortgage_with_possession',
    name: '6. Mortgage with possession',
    stampDutyRatePercent: 4,
    registrationFeeRatePercent: 1,
    description: '4% Stamp Duty + 1% Registration Fee on secured amount.'
  },
  {
    id: 'agreement_to_sale',
    name: '7. Agreement to Sale',
    stampDutyRatePercent: 1,
    registrationFeeRatePercent: 1,
    description: '1% Stamp Duty (Max ₹20,000) + 1% Reg Fee.'
  },
  {
    id: 'agreement_construction_building',
    name: '8. Agreement relating to construction of building',
    stampDutyRatePercent: 1,
    registrationFeeRatePercent: 1,
    description: '1% Stamp Duty on construction cost + 1% Reg Fee.'
  },
  {
    id: 'cancellation',
    name: '9. Cancellation',
    stampDutyRatePercent: 0.5,
    registrationFeeRatePercent: 1,
    description: 'Fixed / nominal rate for agreement cancellations.'
  },
  {
    id: 'partition_family',
    name: '10. Partition among family members',
    stampDutyRatePercent: 1,
    registrationFeeRatePercent: 1,
    description: '1% Stamp Duty (Max ₹25,000 per share) + 1% Reg Fee.'
  },
  {
    id: 'partition_non_family',
    name: '11. Partition among non-family members',
    stampDutyRatePercent: 4,
    registrationFeeRatePercent: 1,
    description: '4% Stamp Duty + 1% Registration Fee.'
  },
  {
    id: 'gpa_sell_non_family',
    name: '12. General Power of Attorney to SELL immovable property (non-family member)',
    stampDutyRatePercent: 4,
    registrationFeeRatePercent: 1,
    description: '4% Stamp Duty on market value + 1% Reg Fee.'
  },
  {
    id: 'gpa_sell_family',
    name: '13. General Power of Attorney to SELL immovable property (family member)',
    stampDutyRatePercent: 1,
    registrationFeeRatePercent: 1,
    description: 'Fixed nominal Stamp Duty (₹1,000) + Reg Fee.'
  },
  {
    id: 'gpa_movable_other',
    name: '14. General Power of Attorney to SELL movable property & for other purposes',
    stampDutyRatePercent: 0.5,
    registrationFeeRatePercent: 0.5,
    description: 'Nominal POA stamp duty for non-immovable authorizations.'
  },
  {
    id: 'gpa_consideration',
    name: '15. General Power of Attorney given for consideration',
    stampDutyRatePercent: 4,
    registrationFeeRatePercent: 1,
    description: '4% Stamp Duty + 1% Registration Fee on consideration amount.'
  },
  {
    id: 'settlement_family',
    name: '16. Settlement in favour of family members',
    stampDutyRatePercent: 1,
    registrationFeeRatePercent: 1,
    description: '1% Stamp Duty (Max ₹25,000) + 1% Reg Fee (Max ₹4,000).'
  },
  {
    id: 'settlement_other',
    name: '17. Settlement in other cases',
    stampDutyRatePercent: 7,
    registrationFeeRatePercent: 2,
    description: '7% Stamp Duty + 2% Reg Fee for non-family settlements.'
  },
  {
    id: 'partnership_under_500',
    name: '18. Partnership deed (capital does not exceed ₹500)',
    stampDutyRatePercent: 0.5,
    registrationFeeRatePercent: 0.5,
    description: 'Nominal partnership deed registration fee.'
  },
  {
    id: 'partnership_other',
    name: '19. Partnership deed (other cases)',
    stampDutyRatePercent: 1,
    registrationFeeRatePercent: 1,
    description: '1% Stamp Duty on capital contribution.'
  },
  {
    id: 'deposit_title_deeds',
    name: '20. Memorandum of Deposit of Title Deeds',
    stampDutyRatePercent: 0.5,
    registrationFeeRatePercent: 1,
    description: '0.5% Stamp Duty (Max ₹30,000) + 1% Reg Fee (Max ₹6,000).'
  },
  {
    id: 'release_family',
    name: '21. Release among family members (co-parceners)',
    stampDutyRatePercent: 1,
    registrationFeeRatePercent: 1,
    description: '1% Stamp Duty (Max ₹25,000) + 1% Reg Fee.'
  },
  {
    id: 'release_non_family',
    name: '22. Release among non-family members',
    stampDutyRatePercent: 7,
    registrationFeeRatePercent: 2,
    description: '7% Stamp Duty + 2% Reg Fee on released property value.'
  },
  {
    id: 'lease_under_30',
    name: '23. Lease below 30 years',
    stampDutyRatePercent: 1,
    registrationFeeRatePercent: 1,
    description: '1% Stamp Duty on total rent + advance deposit.'
  },
  {
    id: 'lease_up_to_99',
    name: '24. Lease up to 99 years',
    stampDutyRatePercent: 4,
    registrationFeeRatePercent: 1,
    description: '4% Stamp Duty + 1% Reg Fee.'
  },
  {
    id: 'lease_over_99',
    name: '25. Lease above 99 years or perpetual lease',
    stampDutyRatePercent: 7,
    registrationFeeRatePercent: 2,
    description: '7% Stamp Duty + 2% Reg Fee (treated equivalent to conveyance).'
  },
  {
    id: 'declaration_trust',
    name: '26. Declaration of Trust',
    stampDutyRatePercent: 1,
    registrationFeeRatePercent: 1,
    description: '1% Stamp Duty + 1% Reg Fee.'
  },
  {
    id: 'receipt',
    name: '27. Receipt',
    stampDutyRatePercent: 0.1,
    registrationFeeRatePercent: 0.5,
    description: 'Nominal stamp duty on mortgage loan discharge receipts.'
  },
  {
    id: 'sale_cert_court',
    name: '28. Sale Certificate issued by Revenue authority or Court',
    stampDutyRatePercent: 7,
    registrationFeeRatePercent: 2,
    description: '7% Stamp Duty + 2% Reg Fee on court auction purchase price.'
  },
  {
    id: 'sale_cert_others',
    name: '29. Sale Certificate issued by Others',
    stampDutyRatePercent: 7,
    registrationFeeRatePercent: 2,
    description: '7% Stamp Duty + 2% Reg Fee.'
  }
];

export interface DetailedStampDutyResult {
  propertyValue: number;
  categoryId: string;
  categoryName: string;
  stampDutyRatePercent: number;
  stampDutyAmount: number;
  registrationFeeRatePercent: number;
  registrationFeeAmount: number;
  totalFees: number;
}

export const calculateStampDuty = (
  propertyValue: number,
  categoryId: string
): DetailedStampDutyResult => {
  const amount = Math.max(0, propertyValue || 0);

  const matchedCategory = STAMP_DUTY_CATEGORIES.find((c) => c.id === categoryId) || STAMP_DUTY_CATEGORIES[0];

  const stampRate = matchedCategory.stampDutyRatePercent / 100;
  const regRate = matchedCategory.registrationFeeRatePercent / 100;

  const stampDutyAmount = Math.round(amount * stampRate);
  const registrationFeeAmount = Math.round(amount * regRate);
  const totalFees = stampDutyAmount + registrationFeeAmount;

  return {
    propertyValue: amount,
    categoryId: matchedCategory.id,
    categoryName: matchedCategory.name,
    stampDutyRatePercent: matchedCategory.stampDutyRatePercent,
    stampDutyAmount,
    registrationFeeRatePercent: matchedCategory.registrationFeeRatePercent,
    registrationFeeAmount,
    totalFees
  };
};
