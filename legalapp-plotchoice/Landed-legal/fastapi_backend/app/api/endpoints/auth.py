from fastapi import APIRouter, HTTPException
import time
from app.schemas.tool_schemas import OTPQuery, OTPVerifyQuery

router = APIRouter()

@router.post("/send-otp")
def send_otp(query: OTPQuery):
    if not query.phone:
        raise HTTPException(status_code=400, detail="Phone number is required.")
    return {
        "success": True,
        "message": f"OTP sent successfully via WhatsApp to {query.countryCode or '+91'} {query.phone}",
        "expiresInSeconds": 300
    }

@router.post("/verify-otp")
def verify_otp(query: OTPVerifyQuery):
    if not query.otp or len(query.otp) < 4:
        raise HTTPException(status_code=400, detail="Please provide a valid 6-digit OTP.")
    return {
        "success": True,
        "token": f"jwt-session-token-{int(time.time()*1000)}",
        "user": {
            "phone": query.phone,
            "role": "pro_subscriber",
            "dailyQuotaRemaining": 999
        },
        "message": "Authentication successful."
    }