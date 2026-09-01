
import { Request, Response } from 'express';

export const searchEC = (req: Request, res: Response) => {
  const { searchMode, zone, district, sro, village, surveyRows, plots, flats, documentNumber, documentYear, documentType } = req.body;

  const primarySurvey = surveyRows?.[0]?.surveyNumber || '142/3B';
  const primaryPlot = plots?.[0]?.plotNumber || 'Plot No. 42B';

  let records = [];

  if (searchMode === 'document') {
    records = [
      {
        id: 'EC-DOC-001',
        documentNumber: `Doc ${documentNumber || '1420'} / ${documentYear || '2021'}`,
        registrationDate: `15-Mar-${documentYear || '2021'}`,
        natureOfDocument: `${documentType || 'Sale Deed (Conveyance)'}`,
        executants: 'K. Rajendran & Co-owners',
        claimants: 'S. Ananthakrishnan',
        propertyDescription: `${primaryPlot}, Green Park Enclave, Door No. 12`,
        surveyNo: primarySurvey,
        extent: '1,450 Sq.Ft',
        isEncumbrance: false,
        remarks: 'Registered absolute sale deed. Nil outstanding charges.'
      }
    ];
  } else {
    records = [
      {
        id: 'EC-TX-001',
        documentNumber: 'Doc 1420 / 2021',
        registrationDate: '15-Mar-2021',
        natureOfDocument: 'Sale Deed (Conveyance)',
        executants: 'K. Rajendran',
        claimants: 'S. Ananthakrishnan',
        propertyDescription: `${primaryPlot}, Survey No ${primarySurvey}, ${village || 'Velachery'}`,
        surveyNo: primarySurvey,
        extent: '1,450 Sq.Ft',
        isEncumbrance: false
      },
      {
        id: 'EC-TX-002',
        documentNumber: 'Doc 890 / 2018',
        registrationDate: '10-May-2018',
        natureOfDocument: 'Deposit of Title Deeds (Mortgage)',
        executants: 'S. Ananthakrishnan',
        claimants: 'HDFC Bank Ltd.',
        propertyDescription: `${primaryPlot}, Survey No ${primarySurvey}`,
        surveyNo: primarySurvey,
        extent: '1,450 Sq.Ft',
        isEncumbrance: true,
        remarks: 'Mortgage registered for home loan. Release deed verification recommended.'
      },
      {
        id: 'EC-TX-003',
        documentNumber: 'Doc 412 / 2012',
        registrationDate: '18-Feb-2012',
        natureOfDocument: 'Family Settlement Deed',
        executants: 'V. Krishnamurthy (Father)',
        claimants: 'K. Rajendran (Son)',
        propertyDescription: `Parent Title: Survey No ${primarySurvey}`,
        surveyNo: primarySurvey,
        extent: '2,900 Sq.Ft (Parent Extent)',
        isEncumbrance: false
      }
    ];
  }

  return res.json({
    success: true,
    totalRecords: records.length,
    data: records,
    message: 'Encumbrance Certificate search completed.'
  });
};
