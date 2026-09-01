import { ECSearchMode, ECSurveyRow, ECPlotRow, ECFlatRow } from '../types';
import { apiPost } from './apiConfig';

export interface ECParams {
  searchMode: ECSearchMode;
  zone?: string;
  district?: string;
  sro?: string;
  village?: string;
  startDate?: string;
  endDate?: string;
  surveyRows?: ECSurveyRow[];
  plots?: ECPlotRow[];
  flats?: ECFlatRow[];
  documentType?: string;
  documentNumber?: string;
  documentYear?: string;
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
}

export const searchEC = async (params: ECParams): Promise<{ success: boolean; data: ECRecord[]; message: string }> => {
  const apiResponse = await apiPost<{ success: boolean; data: ECRecord[]; message: string }>('/ec/search', params);
  if (apiResponse && apiResponse.data) {
    return apiResponse;
  }

  await new Promise((resolve) => setTimeout(resolve, 600));

  let mockRecords: ECRecord[] = [];

  if (params.searchMode === 'document') {
    mockRecords = [
      {
        id: 'EC-DOC-001',
        documentNumber: `Doc ${params.documentNumber || '1420'} / ${params.documentYear || '2021'}`,
        registrationDate: `15-Mar-${params.documentYear || '2021'}`,
        natureOfDocument: `${params.documentType || 'Sale Deed (Conveyance)'}`,
        executants: 'K. Rajendran & Family',
        claimants: 'S. Ananthakrishnan',
        propertyDescription: 'Plot No. 42B, Flat 3A, Green Park Enclave, Door No. 12',
        surveyNo: '142/3B',
        extent: '1,450 Sq.Ft'
      }
    ];
  } else if (params.searchMode === 'survey') {
    const primarySurvey = params.surveyRows?.[0]?.surveyNumber || '142/3B';
    const primaryPlot = params.plots?.[0]?.plotNumber || 'Plot 42B';
    mockRecords = [
      {
        id: 'EC-SURV-001',
        documentNumber: 'Doc 1420 / 2021',
        registrationDate: '15-Mar-2021',
        natureOfDocument: 'Sale Deed (Conveyance)',
        executants: 'K. Rajendran',
        claimants: 'S. Ananthakrishnan',
        propertyDescription: `${primaryPlot}, Green Park Enclave`,
        surveyNo: primarySurvey,
        extent: '1,450 Sq.Ft'
      },
      {
        id: 'EC-SURV-002',
        documentNumber: 'Doc 890 / 2018',
        registrationDate: '10-May-2018',
        natureOfDocument: 'Deposit of Title Deeds (Mortgage)',
        executants: 'S. Ananthakrishnan',
        claimants: 'HDFC Bank Ltd.',
        propertyDescription: `${primaryPlot}, Green Park Enclave`,
        surveyNo: primarySurvey,
        extent: '1,450 Sq.Ft'
      }
    ];
  } else {
    // Mode 3: Plot/Flat
    const primaryPlot = params.plots?.[0]?.plotNumber || 'Plot 42B';
    mockRecords = [
      {
        id: 'EC-PLOT-001',
        documentNumber: 'Doc 2041 / 2022',
        registrationDate: '22-Aug-2022',
        natureOfDocument: 'Construction Agreement & Sale of UDS',
        executants: 'Green Property Developers Pvt Ltd',
        claimants: 'R. Sriram',
        propertyDescription: `Specified ${primaryPlot}, Flat 3A`,
        surveyNo: params.surveyRows?.[0]?.surveyNumber || '142/3B',
        extent: '1,200 Sq.Ft UDS'
      }
    ];
  }

  return {
    success: true,
    data: mockRecords,
    message: 'Demo EC Search Report Generated. Connect live TNREGINET API for official certified copies.'
  };
};
