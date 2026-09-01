import { CourtCNRContact } from '../types';

// TODO: Connect eCourts Services National Judicial Data Grid (NJDG) & TN Revenue Court API
export interface CourtSearchParams {
  mode: 'party' | 'revenue' | 'cnr';
  partyName?: string;
  district?: string;
  taluk?: string;
  village?: string;
  surveyNumber?: string;
  subdivision?: string;
  cnrNumber?: string;
  contactName?: string;
  countryCode?: string;
  whatsappNumber?: string;
}

export interface CourtCaseRecord {
  caseNumber: string;
  courtName: string;
  filingYear: string;
  petitioner: string;
  respondent: string;
  caseStatus: string;
  nextHearingDate: string;
  subject: string;
}

export interface CourtSearchResponse {
  success: boolean;
  cases: CourtCaseRecord[];
  message: string;
  deliveryNotice?: string;
  refNumber?: string;
}

export const searchCourtCases = async (params: CourtSearchParams): Promise<CourtSearchResponse> => {
  await new Promise((resolve) => setTimeout(resolve, 900));

  const refNumber = `REF-${Math.floor(100000 + Math.random() * 900000)}`;

  let deliveryNotice = undefined;
  if (params.whatsappNumber) {
    // TODO: Integrate official WhatsApp/SMS notification API service (e.g. Twilio / WhatsApp Business API).
    deliveryNotice = `Verification report reference link (${refNumber}) generated and queued for delivery to WhatsApp ${params.countryCode || '+91'} ${params.whatsappNumber}.`;
  }

  return {
    success: true,
    cases: [
      {
        caseNumber: params.mode === 'cnr' ? (params.cnrNumber || 'TNCH010042892022') : 'OS / 1042 / 2022',
        courtName: 'City Civil Court, Chennai - III Assistant',
        filingYear: '2022',
        petitioner: params.partyName || 'M. Ramanathan',
        respondent: 'V. Sundaram & 2 others',
        caseStatus: 'Pending (Injunction Application)',
        nextHearingDate: '14-Oct-2024',
        subject: 'Suit for Specific Performance and Permanent Injunction over property'
      }
    ],
    message: 'Mock Litigation Search Report Generated.',
    deliveryNotice,
    refNumber
  };
};
