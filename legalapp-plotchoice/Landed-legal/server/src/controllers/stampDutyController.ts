
import { Request, Response } from 'express';
import { calculateStampDuty } from '../services/calculationEngine';

export const computeStampDuty = (req: Request, res: Response) => {
  const { instrumentType, considerationValue, guidelineValue, isFemaleBuyer } = req.body;
  const result = calculateStampDuty({
    instrumentType: String(instrumentType || 'sale'),
    considerationValue: Number(considerationValue) || 0,
    guidelineValue: Number(guidelineValue) || 0,
    isFemaleBuyer: Boolean(isFemaleBuyer)
  });

  return res.json({
    success: true,
    data: result
  });
};
