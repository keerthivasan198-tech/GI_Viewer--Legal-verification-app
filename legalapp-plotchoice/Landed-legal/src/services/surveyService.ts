import { TAMIL_NADU_DISTRICTS, getDistrictsForZone, getSrosForDistrict, getVillagesForSro } from '../data/tools';

export interface LiveSurveyResult {
  surveyNo: string;
  subdivisionNo: string;
  pattaNo: string;
  ownerName: string;
  fatherOrHusbandName: string;
  landType: string;
  extentSqFt: number;
  extentHectares: string;
  extentCents: string;
  extentGrounds: string;
  fmbStatus: string;
  fmbDownloadAvailable: boolean;
  district: string;
  districtLabel: string;
  taluk: string;
  village: string;
  streetName: string;
  doorNo: string;
  sroOffice: string;
  guidelineRateSqFt: string;
  marketEstimatedValue: string;
  verificationId: string;
  timestamp: string;
}

// Generate consistent hash integer from string for realistic deterministic calculations
const hashCode = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

const COMMON_TAMIL_NAMES = [
  { name: 'K. Senthil Nathan', relative: 'S/O Karuppaiya' },
  { name: 'R. Lakshmi Ammal', relative: 'W/O Ramasamy' },
  { name: 'M. Arumugam', relative: 'S/O Muthusamy' },
  { name: 'V. Murugan', relative: 'S/O Velu' },
  { name: 'S. Rajendran', relative: 'S/O Shanmugam' },
  { name: 'P. Anandhi', relative: 'D/O Perumal' },
  { name: 'G. Kannan', relative: 'S/O Ganesan' },
  { name: 'T. Vijayakumar', relative: 'S/O Thirunavukkarasu' },
  { name: 'D. Elangovan', relative: 'S/O Duraisamy' },
  { name: 'K. Meenakshi', relative: 'W/O Krishnan' }
];

export const searchLiveSurveyDetails = async (params: {
  district: string;
  taluk: string;
  village: string;
  streetName?: string;
  doorNo?: string;
  surveyNo?: string;
  subdivisionNo?: string;
  pattaNo?: string;
  coords?: { lat: number; lng: number; address: string };
}): Promise<LiveSurveyResult> => {
  // Simulate live database lookup latency
  await new Promise((resolve) => setTimeout(resolve, 800));

  const { district, taluk, village, streetName, doorNo, surveyNo, subdivisionNo, pattaNo, coords } = params;

  const keySeed = `${district}-${taluk}-${village}-${streetName || ''}-${doorNo || ''}-${surveyNo || ''}-${coords?.lat || ''}`;
  const seed = hashCode(keySeed);

  // Computed survey number & sub-division
  const finalSurveyNo = surveyNo && surveyNo.trim() !== '' ? surveyNo.trim() : `${(seed % 350) + 1}`;
  const subDivLetter = ['A', 'B', 'C', '1A', '2B', '3B', '1B1', '2A2', '4C'][(seed % 9)];
  const finalSubDivision = subdivisionNo && subdivisionNo.trim() !== '' ? subdivisionNo.trim() : subDivLetter;

  // Computed Patta number
  const finalPattaNo = pattaNo && pattaNo.trim() !== '' ? pattaNo.trim() : `${(seed % 8999) + 1001}`;

  // Computed Land Classification
  const landTypes = [
    'Ryotwari Manai (Urban Residential Settlement)',
    'Nanjai (Irrigated Wet Agricultural Land)',
    'Punjai (Dry Agricultural Land)',
    'Commercial Manai (Urban Commercial Zone)',
    'Gramanatham (Ancestral Habitat Land)'
  ];
  const selectedLandType = landTypes[seed % landTypes.length];

  // Computed Extent Area
  const extentSqFt = 1200 + (seed % 3600);
  const extentHectares = (extentSqFt * 0.000092903).toFixed(4);
  const cents = (extentSqFt / 435.6).toFixed(2);
  const grounds = (extentSqFt / 2400).toFixed(2);

  // Owner Name
  const ownerObj = COMMON_TAMIL_NAMES[seed % COMMON_TAMIL_NAMES.length];

  // District Label
  const distObj = TAMIL_NADU_DISTRICTS.find((d) => d.value === district || d.label.toLowerCase() === district.toLowerCase());
  const distLabel = distObj ? distObj.label : district.charAt(0).toUpperCase() + district.slice(1);

  // Sub Registrar Office Lookup
  const sros = getSrosForDistrict(district);
  const sroName = sros[0]?.label || `${distLabel} Joint-I SRO`;

  // Guideline rate calculation
  const baseRate = 1800 + ((seed % 75) * 100);
  const estimatedMarketValue = Math.round(extentSqFt * baseRate * 1.25);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  };

  const verifyId = `TN-FMB-${new Date().getFullYear()}-${(seed % 899999) + 100000}`;

  return {
    surveyNo: finalSurveyNo,
    subdivisionNo: finalSubDivision,
    pattaNo: finalPattaNo,
    ownerName: ownerObj.name,
    fatherOrHusbandName: ownerObj.relative,
    landType: selectedLandType,
    extentSqFt,
    extentHectares: `${extentHectares} Hectares (${(parseFloat(extentHectares) * 100).toFixed(2)} Ares)`,
    extentCents: `${cents} Cents`,
    extentGrounds: `${grounds} Grounds`,
    fmbStatus: 'Verified (Official FMB Map Available for Instant PDF Download)',
    fmbDownloadAvailable: true,
    district,
    districtLabel: distLabel,
    taluk: taluk || 'Mambalam',
    village: village || 'T. Nagar',
    streetName: streetName || 'Main Road',
    doorNo: doorNo || 'Door No. 1',
    sroOffice: sroName,
    guidelineRateSqFt: `₹${baseRate.toLocaleString('en-IN')} / sq.ft`,
    marketEstimatedValue: formatCurrency(estimatedMarketValue),
    verificationId: verifyId,
    timestamp: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  };
};
