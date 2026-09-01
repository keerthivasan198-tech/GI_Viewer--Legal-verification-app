
import { Request, Response } from 'express';

export const calculateComposite = (req: Request, res: Response) => {
  const { landGuidelineSqFt, superBuiltUpAreaSqFt, udsAreaSqFt, buildingClass, floorNumber, ageYears } = req.body;

  const landRate = Number(landGuidelineSqFt) || 8500;
  const sbuArea = Number(superBuiltUpAreaSqFt) || 1200;
  const udsArea = Number(udsAreaSqFt) || 450;
  const age = Number(ageYears) || 3;

  const landValueComponent = udsArea * landRate;
  let constructionRateSqFt = 2800;
  if (buildingClass === 'premium') constructionRateSqFt = 3600;

  const grossBuildingComponent = sbuArea * constructionRateSqFt;
  const depreciationAmount = Math.round((grossBuildingComponent * Math.min(age * 1.5, 50)) / 100);
  const netBuildingComponent = grossBuildingComponent - depreciationAmount;

  const totalCompositeValuation = landValueComponent + netBuildingComponent;
  const effectiveCompositeRateSqFt = Math.round(totalCompositeValuation / sbuArea);

  return res.json({
    success: true,
    data: {
      landRateSqFt: landRate,
      udsAreaSqFt: udsArea,
      landValueComponent,
      constructionRateSqFt,
      grossBuildingComponent,
      depreciationAmount,
      netBuildingComponent,
      totalCompositeValuation,
      effectiveCompositeRateSqFt
    }
  });
};
