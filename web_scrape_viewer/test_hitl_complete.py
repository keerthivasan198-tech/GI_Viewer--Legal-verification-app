import unittest
import requests
import time

BASE_URL = "http://127.0.0.1:5000"

class TestHITLStrictCaptchaAndLiveResolution(unittest.TestCase):

    def test_01_hitl_visual_captcha_and_strict_verification(self):
        # 1. Trigger Interruption Gate for specific clicked house coordinates
        payload = {
            "flow_type": "AUTH_DELEGATION",
            "target_resource": "eservices.tn.gov.in",
            "challenge_type": "CAPTCHA_CHALLENGE",
            "context_data": {"lat": 13.02235, "lng": 80.23719, "district": "Chennai"}
        }
        res = requests.post(f"{BASE_URL}/api/hitl/trigger-session", json=payload, timeout=5)
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data.get("success"))
        session = data.get("session")
        session_id = session.get("session_id")
        
        # Verify visual CAPTCHA image was generated and input is NOT pre-filled
        self.assertIsNotNone(session.get("captcha_image_b64"))
        self.assertNotIn("mock_code", session) # Plaintext not exposed to client
        print(f"[PASS] Visual CAPTCHA challenge generated: Session {session_id} (TTL: 120s)")

        # 2. Test WRONG CAPTCHA -> Must enforce 2-minute lockout penalty!
        wrong_payload = {
            "session_id": session_id,
            "human_input": "WRONG1",
            "authorized_by": "Human User"
        }
        wrong_res = requests.post(f"{BASE_URL}/api/hitl/resume-session", json=wrong_payload, timeout=5)
        self.assertEqual(wrong_res.status_code, 200)
        wrong_data = wrong_res.json()
        self.assertFalse(wrong_data.get("success"))
        self.assertTrue(wrong_data.get("is_locked"))
        self.assertEqual(wrong_data.get("cooldown_seconds"), 120)
        print(f"[PASS] Incorrect CAPTCHA Rejected & 2-Minute Lockout Enforced: {wrong_data['error']}")

        # 3. Test regenerate challenge after cooldown
        regen_res = requests.post(f"{BASE_URL}/api/hitl/regenerate-challenge", json={"session_id": session_id}, timeout=5)
        self.assertEqual(regen_res.status_code, 200)
        regen_data = regen_res.json()
        self.assertIsNotNone(regen_data.get("captcha_image_b64"))
        print(f"[PASS] Fresh CAPTCHA generated after cooldown reset.")

if __name__ == '__main__':
    unittest.main()
