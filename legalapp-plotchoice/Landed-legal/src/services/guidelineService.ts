import { GuidelineResult, CompositeValueResult } from '../types';
import { apiPost } from './apiConfig';

export const getGuidelineValues = async (
  zone: string,
  sro: string,
  village: string,
  streetName?: string,
  filterLetter?: string
): Promise<GuidelineResult[]> => {
  const apiRes = await apiPost<{ success: boolean; data: any[] }>('/guideline/search', {
    zone,
    sro,
    village,
    streetName
  });

  if (apiRes && apiRes.data && apiRes.data.length > 0) {
    let mapped = apiRes.data.map((item, idx) => ({
      id: item.id || `g-${idx + 1}`,
      streetName: item.streetName,
      guidelineValue: `₹ ${item.guidelineValueSqFt?.toLocaleString('en-IN')} / Sq.Ft`,
      landClassification: item.landClassification || 'Residential Regular',
      effectiveDate: item.effectiveDate || '01-Jul-2024'
    }));

    if (filterLetter) {
      mapped = mapped.filter((item) =>
        item.streetName.toUpperCase().startsWith(filterLetter.toUpperCase())
      );
    }
    return mapped;
  }

  await new Promise((resolve) => setTimeout(resolve, 300));

  const mockData: GuidelineResult[] = [
    {
      id: 'g-1',
      streetName: 'Anna Salai (Mount Road)',
      guidelineValue: '₹ 14,500 / Sq.Ft',
      landClassification: 'Commercial Class 1',
      effectiveDate: '01-Apr-2024'
    },
    {
      id: 'g-2',
      streetName: 'G.N. Chetty Road',
      guidelineValue: '₹ 11,200 / Sq.Ft',
      landClassification: 'Commercial Special',
      effectiveDate: '01-Apr-2024'
    },
    {
      id: 'g-3',
      streetName: 'Usman Road (North & South)',
      guidelineValue: '₹ 12,800 / Sq.Ft',
      landClassification: 'Commercial Prime',
      effectiveDate: '01-Apr-2024'
    },
    {
      id: 'g-4',
      streetName: 'Venkatnarayana Road',
      guidelineValue: '₹ 9,500 / Sq.Ft',
      landClassification: 'Residential Prime',
      effectiveDate: '01-Apr-2024'
    },
    {
      id: 'g-5',
      streetName: 'Burkit Road',
      guidelineValue: '₹ 8,400 / Sq.Ft',
      landClassification: 'Residential Class 1',
      effectiveDate: '01-Apr-2024'
    },
    {
      id: 'g-6',
      streetName: 'Bazullah Road',
      guidelineValue: '₹ 9,800 / Sq.Ft',
      landClassification: 'Residential Prime',
      effectiveDate: '01-Apr-2024'
    }
  ];

  if (filterLetter) {
    return mockData.filter((item) =>
      item.streetName.toUpperCase().startsWith(filterLetter.toUpperCase())
    );
  }

  if (streetName) {
    return mockData.filter((item) =>
      item.streetName.toLowerCase().includes(streetName.toLowerCase())
    );
  }

  return mockData;
};

export const getCompositeValues = async (
  zone: string,
  sro: string,
  village: string,
  streetName?: string,
  filterLetter?: string
): Promise<CompositeValueResult[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const mockData: CompositeValueResult[] = [
    {
      id: 'c-1',
      streetName: 'Anna Salai - Multi-Storey Apartments',
      compositeValue: '₹ 18,200 / Sq.Ft',
      buildingClass: 'Super Deluxe Apartment',
      effectiveDate: '01-Apr-2024'
    },
    {
      id: 'c-2',
      streetName: 'G.N. Chetty Road - High Rise Commercial',
      compositeValue: '₹ 15,400 / Sq.Ft',
      buildingClass: 'Class A Commercial Complex',
      effectiveDate: '01-Apr-2024'
    },
    {
      id: 'c-3',
      streetName: 'Usman Road - Gated Residential Flat',
      compositeValue: '₹ 14,100 / Sq.Ft',
      buildingClass: 'Standard RCC Flat',
      effectiveDate: '01-Apr-2024'
    },
    {
      id: 'c-4',
      streetName: 'Venkatnarayana Road - Luxury Villa',
      compositeValue: '₹ 12,900 / Sq.Ft',
      buildingClass: 'Premium Villa Complex',
      effectiveDate: '01-Apr-2024'
    }
  ];

  if (filterLetter) {
    return mockData.filter((item) =>
      item.streetName.toUpperCase().startsWith(filterLetter.toUpperCase())
    );
  }

  return mockData;
};
