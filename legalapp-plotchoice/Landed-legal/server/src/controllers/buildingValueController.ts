
import { Request, Response } from 'express';
import { calculateBuildingValue } from '../services/calculationEngine';

export const computeBuildingValue = (req: Request, res: Response) => {
  const { buildingType, ageYears, totalAreaSqFt, floors, amenitiesCost } = req.body;

  let totalArea = Number(totalAreaSqFt) || 0;
  if (Array.isArray(floors) && floors.length > 0) {
    totalArea = floors.reduce((sum, f) => sum + (Number(f.areaSqFt) || 0), 0);
  }

  const result = calculateBuildingValue({
    buildingType: String(buildingType || 'residential_rcc'),
    ageYears: Number(ageYears) || 0,
    totalAreaSqFt: totalArea,
    amenitiesCost: Number(amenitiesCost) || 0
  });

  return res.json({
    success: true,
    data: result
  });
};
