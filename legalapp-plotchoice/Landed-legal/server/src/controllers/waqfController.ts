
import { Request, Response } from 'express';
import waqfData from '../data/waqfProhibitedData.json';

export const checkWaqfProperty = (req: Request, res: Response) => {
  const { district, taluk, village, surveyNumber, subDivisionNumber, institutionName } = req.body;

  const cleanSurvey = String(surveyNumber || '').trim();
  const match = waqfData.find(w => {
    if (cleanSurvey && w.surveyNumber === cleanSurvey) return true;
    if (institutionName && w.institutionName.toLowerCase().includes(String(institutionName).toLowerCase())) return true;
    return false;
  });

  if (match) {
    return res.json({
      success: true,
      isProhibited: true,
      riskLevel: 'HIGH_RISK_PROHIBITED',
      data: match,
      statutoryAdvice: 'Target property is gazetted as Waqf Board endowment land under Waqf Act 1995 & Section 22-A. Conveyance prohibited without State Waqf Board sanction.'
    });
  }

  return res.json({
    success: true,
    isProhibited: false,
    riskLevel: 'CLEAR',
    data: null,
    statutoryAdvice: 'No Waqf Board restrictions detected for this survey parcel in published registers.'
  });
};
