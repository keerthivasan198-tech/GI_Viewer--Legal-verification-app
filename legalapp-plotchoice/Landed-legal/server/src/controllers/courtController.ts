
import { Request, Response } from 'express';

export const searchCourt = (req: Request, res: Response) => {
  const { courtLevel, caseNumber, cnrNumber, partyName, surveyNumber } = req.body;

  const records = [
    {
      id: 'CRT-001',
      cnrNumber: cnrNumber || 'TNCH01-002491-2023',
      caseNumber: caseNumber || 'OS 340/2023',
      caseType: 'Original Suit (Partition & Injunction)',
      year: '2023',
      courtName: 'Principal District Munsif Court, Alandur',
      petitioner: partyName || 'K. Ramesh & Others',
      respondent: 'K. Rajendran & S. Ananthakrishnan',
      surveyNo: surveyNumber || '142/3B',
      status: 'DISPOSED',
      summary: 'Suit for partition dismissed on 14-Oct-2024. Clear decree in favor of defendants. No active stay order.'
    }
  ];

  return res.json({
    success: true,
    count: records.length,
    data: records,
    message: 'eCourts judicial litigation search completed.'
  });
};
