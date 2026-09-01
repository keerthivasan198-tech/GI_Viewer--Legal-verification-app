
import { Request, Response } from 'express';

export const resolveSurvey = (req: Request, res: Response) => {
  const { surveyNumber, subDivision, district, taluk, village } = req.body;

  const parcelData = {
    surveyNumber: surveyNumber || '142',
    subDivision: subDivision || '3B',
    fullSurveyKey: `${surveyNumber || '142'}/${subDivision || '3B'}`,
    district: district || 'Chennai',
    taluk: taluk || 'Velachery',
    village: village || 'Velachery',
    sroName: 'Velachery SRO',
    landClassification: 'Ryotwari Natham / Residential',
    pattaNumber: 'PATTA-VEL-2021-982',
    totalExtent: '0.08 Hectares (1,950 Sq.Ft)',
    fmbSketchAvailable: true,
    fmbSketchUrl: '/api/v1/fmb/preview/142-3B.pdf'
  };

  return res.json({
    success: true,
    data: parcelData,
    message: 'Cadastral survey intelligence resolved.'
  });
};
