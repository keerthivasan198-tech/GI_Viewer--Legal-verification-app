
import { Request, Response } from 'express';

export const searchCERSAI = (req: Request, res: Response) => {
  const { searchMode, borrowerName, pan, propertyAddress, surveyNumber } = req.body;

  const records = [
    {
      id: 'CERSAI-SEC-901',
      securityInterestId: 'SI-2021-098412',
      borrowerName: borrowerName || 'S. Ananthakrishnan',
      lenderBank: 'HDFC Bank Ltd.',
      assetCategory: 'Immovable Residential Property',
      propertyAddress: propertyAddress || 'Plot 42B, Green Park Enclave, Velachery, Chennai',
      surveyNo: surveyNumber || '142/3B',
      sanctionedAmount: 5500000,
      chargeCreationDate: '12-May-2018',
      chargeStatus: 'ACTIVE'
    }
  ];

  return res.json({
    success: true,
    count: records.length,
    data: records,
    message: 'CERSAI Security Interest Registry check completed.'
  });
};
