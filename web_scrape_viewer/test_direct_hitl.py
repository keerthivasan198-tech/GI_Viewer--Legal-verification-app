import os

# Clean test
from hitl_manager import hitl_instance

session = hitl_instance.create_interruption_gate(
    flow_type="AUTH_DELEGATION",
    target_resource="eservices.tn.gov.in",
    context_data={"lat": 13.02235, "lng": 80.23719},
    challenge_type="CAPTCHA_CHALLENGE"
)

assert session["captcha_image_b64"] is not None
assert session["ttl_remaining"] == 120

# Test Wrong Code
res_wrong = hitl_instance.resume_interruption_gate(session["session_id"], "WRONG1")
assert res_wrong["success"] is False
assert res_wrong["is_locked"] is True
assert res_wrong["cooldown_seconds"] == 120

# Test Correct Code
expected = hitl_instance.active_sessions[session["session_id"]]["expected_code"]
hitl_instance.active_sessions[session["session_id"]]["cooldown_until"] = 0
res_correct = hitl_instance.resume_interruption_gate(session["session_id"], expected)
assert res_correct["success"] is True

print("ALL DIRECT HITL UNIT TESTS PASSED WITH 100% SUCCESS!")
