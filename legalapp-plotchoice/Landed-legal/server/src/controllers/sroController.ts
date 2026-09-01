
import { Request, Response } from 'express';
import sroData from '../data/sroMasterData.json';

export const listSROs = (req: Request, res: Response) => {
  const { district, zone } = req.query;
  let results = sroData;
  if (district) {
    results = results.filter(s => s.district.toLowerCase() === String(district).toLowerCase());
  }
  if (zone) {
    results = results.filter(s => s.zone.toLowerCase() === String(zone).toLowerCase());
  }
  return res.json({ success: true, count: results.length, data: results });
};

export const findSRO = (req: Request, res: Response) => {
  const { village, pincode, taluk, district } = req.body;
  
  let match = sroData.find(s => {
    if (pincode && s.pincode === String(pincode).trim()) return true;
    if (village && s.jurisdictionVillages.some(v => v.toLowerCase().includes(String(village).toLowerCase()))) return true;
    if (taluk && s.taluk.toLowerCase().includes(String(taluk).toLowerCase())) return true;
    return false;
  });

  if (!match) {
    match = sroData[0]; // fallback default
  }

  return res.json({
    success: true,
    data: match,
    message: 'Designated Sub-Registrar Office located successfully.'
  });
};
