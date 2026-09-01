
import { Request, Response } from 'express';
import templeData from '../data/templeProhibitedData.json';

export const checkTempleProperty = (req: Request, res: Response) => {
  const { district, taluk, village, surveyNumber, subDivisionNumber, templeName } = req.body;

  const cleanSurvey = String(surveyNumber || '').trim();
  const match = templeData.find(t => {
    if (cleanSurvey && t.surveyNumber === cleanSurvey) return true;
    if (templeName && t.institutionName.toLowerCase().includes(String(templeName).toLowerCase())) return true;
    if (village && t.village.toLowerCase() === String(village).toLowerCase() && cleanSurvey.startsWith(t.surveyNumber)) return true;
    return false;
  });

  if (match) {
    return res.json({
      success: true,
      isProhibited: true,
      riskLevel: 'HIGH_RISK_PROHIBITED',
      data: match,
      statutoryAdvice: 'Property is classified as Temple Inam/Devadhanam land under Section 22-A of Registration Act. Strictly prohibited from private registration or sale.'
    });
  }

  return res.json({
    success: true,
    isProhibited: false,
    riskLevel: 'CLEAR',
    data: null,
    statutoryAdvice: 'No Section 22-A HR&CE Temple endowment restrictions detected for this survey number in gazetted records.'
  });
};
