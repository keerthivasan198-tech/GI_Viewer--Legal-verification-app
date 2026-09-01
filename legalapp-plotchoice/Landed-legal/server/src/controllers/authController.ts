
import { Request, Response } from 'express';

export const sendOTP = (req: Request, res: Response) => {
  const { phone, countryCode } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, message: 'Phone number is required.' });
  }

  return res.json({
    success: true,
    message: `OTP sent successfully via WhatsApp to ${countryCode || '+91'} ${phone}`,
    expiresInSeconds: 300
  });
};

export const verifyOTP = (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  if (!otp || String(otp).length < 4) {
    return res.status(400).json({ success: false, message: 'Please provide a valid 6-digit OTP.' });
  }

  return res.json({
    success: true,
    token: 'jwt-mock-session-token-' + Date.now(),
    user: {
      phone,
      role: 'pro_subscriber',
      dailyQuotaRemaining: 999
    },
    message: 'Authentication successful.'
  });
};
