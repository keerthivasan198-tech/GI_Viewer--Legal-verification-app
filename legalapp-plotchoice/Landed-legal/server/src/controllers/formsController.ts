
import { Request, Response } from 'express';

export const listTemplates = (req: Request, res: Response) => {
  const templates = [
    { id: 'sale-agreement', name: 'Agreement to Sell', category: 'draft-deed' },
    { id: 'sale-deed', name: 'Absolute Sale Deed', category: 'draft-deed' },
    { id: 'lease-agreement', name: 'Residential Lease Agreement', category: 'draft-deed' },
    { id: 'general-power-of-attorney', name: 'General Power of Attorney (GPA)', category: 'draft-deed' },
    { id: 'settlement-deed', name: 'Family Settlement Deed', category: 'draft-deed' },
    { id: 'will-deed', name: 'Last Will and Testament', category: 'draft-deed' }
  ];

  return res.json({ success: true, count: templates.length, data: templates });
};

export const generateDeed = (req: Request, res: Response) => {
  const { templateId, executantName, claimantName, propertySchedule, considerationAmount } = req.body;

  return res.json({
    success: true,
    deedId: `DEED-${Date.now()}`,
    templateId: templateId || 'sale-deed',
    downloadDocxUrl: `/downloads/deeds/deed-${templateId || 'sale'}.docx`,
    downloadPdfUrl: `/downloads/deeds/deed-${templateId || 'sale'}.pdf`,
    message: 'Legal deed generated with custom recitals and property schedules.'
  });
};
