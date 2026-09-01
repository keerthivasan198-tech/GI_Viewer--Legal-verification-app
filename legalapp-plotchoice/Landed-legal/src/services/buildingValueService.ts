import { BuildingValueInput, BuildingValueOutput } from '../types';

export const calculateBuildingValuation = (input: BuildingValueInput): BuildingValueOutput => {
  const baseRates: Record<string, number> = {
    residential: 1850,
    commercial: 2200,
    industrial: 1600,
    apartment: 2100
  };

  const baseRate = baseRates[input.buildingType] || 1850;
  
  // Total area calculation
  const totalArea = input.floors.reduce((sum, f) => sum + (Number(f.areaSqFt) || 0), 0);
  const rawBaseCost = totalArea * baseRate;

  // Depreciation based on age (1.5% per year up to 50 years max 60%)
  const age = Math.min(50, Math.max(0, input.ageYears || 0));
  const depreciationFactor = Math.max(0.4, 1 - (age * 0.015));
  
  const depreciatedCost = rawBaseCost * depreciationFactor;

  // Additional amenities estimations
  const electricalCost = Number(input.electricalCost) || 0;
  const waterSupplyCost = Number(input.waterSupplyCost) || 0;
  const sanitaryCost = Number(input.sanitaryCost) || 0;
  const extraAmenitiesCost = Number(input.extraAmenitiesCost) || 0;
  const compoundWallCost = (Number(input.compoundWallLength) || 0) * 450;
  const garageCost = (Number(input.garageArea) || 0) * 1200;

  const amenitiesTotal = electricalCost + waterSupplyCost + sanitaryCost + extraAmenitiesCost + compoundWallCost + garageCost;
  
  const floorAdjustments = input.floors.length > 2 ? (input.floors.length - 2) * 50000 : 0;
  
  const estimatedBuildingValue = Math.round(depreciatedCost + amenitiesTotal + floorAdjustments);

  return {
    totalAreaSqFt: totalArea,
    basePlinthRate: baseRate,
    depreciatedValue: Math.round(depreciatedCost),
    floorAdjustments,
    amenitiesTotal,
    estimatedBuildingValue
  };
};
