// TODO: Integrate official CERSAI Central Register portal API
export interface CERSAIParams {
  searchMode: 'map' | 'manual';
  district?: string;
  cityVillage?: string;
  pincode?: string;
  propertyType?: string;
  surveyNumber?: string;
  plotNumber?: string;
  doorNumber?: string;
  ownerName?: string;
  recipientName: string;
  whatsappNumber: string;
}

export interface CERSAIResult {
  status: 'CLEAR' | 'MORTGAGED' | 'UNDER_VERIFICATION';
  secId?: string;
  lenderName?: string;
  chargeAmount?: string;
  creationDate?: string;
  remarks: string;
}

export const searchCERSAI = async (params: CERSAIParams): Promise<CERSAIResult> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Return realistic mock verification result
  return {
    status: 'CLEAR',
    remarks: `No active security interest charge found in CERSAI database for Survey No ${params.surveyNumber || '142/3B'}. (Demo verification result)`
  };
};
