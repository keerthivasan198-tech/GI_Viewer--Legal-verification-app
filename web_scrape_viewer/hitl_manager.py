# --- HITL State Manager, SVG CAPTCHA Engine & Audit Logging (hitl_manager.py) ---
import time
import uuid
import json
import os
import random
import string
import base64
from threading import Lock

BASE_DIR = os.path.dirname(__file__)
AUDIT_LOG_FILE = os.path.join(BASE_DIR, 'hitl_audit_log.json')
FEEDBACK_LOG_FILE = os.path.join(BASE_DIR, 'hitl_feedback_log.json')

def generate_visual_captcha_svg(code_str):
    """
    Generates a realistic security CAPTCHA SVG with character distortion,
    noise lines, and interference dots so the human must visually solve it.
    """
    width = 240
    height = 70
    bg_color = "#f8fafc"
    
    colors = ["#1e40af", "#b91c1c", "#047857", "#6b21a8", "#c2410c", "#0f766e"]
    
    # Noise lines
    noise_lines = []
    for _ in range(5):
        x1 = random.randint(5, width - 5)
        y1 = random.randint(5, height - 5)
        x2 = random.randint(5, width - 5)
        y2 = random.randint(5, height - 5)
        stroke = random.choice(colors)
        sw = random.uniform(1.2, 2.5)
        noise_lines.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}" stroke-opacity="0.45" />')
        
    # Noise dots
    noise_dots = []
    for _ in range(35):
        cx = random.randint(5, width - 5)
        cy = random.randint(5, height - 5)
        r = random.uniform(1.0, 2.2)
        c = random.choice(colors)
        noise_dots.append(f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{c}" fill-opacity="0.4" />')
        
    # Character glyphs with random rotation and offsets
    char_elements = []
    char_spacing = (width - 40) / len(code_str)
    
    for i, ch in enumerate(code_str):
        x = 22 + i * char_spacing + random.uniform(-3, 3)
        y = 48 + random.uniform(-4, 4)
        rot = random.uniform(-18, 18)
        color = random.choice(colors)
        font_size = random.randint(26, 32)
        
        char_elements.append(
            f'<text x="{x}" y="{y}" fill="{color}" font-family="monospace, sans-serif" font-weight="900" '
            f'font-size="{font_size}" transform="rotate({rot} {x} {y})">{ch}</text>'
        )
        
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" viewBox="0 0 {width} {height}">
        <rect width="100%" height="100%" fill="{bg_color}" rx="8" stroke="#cbd5e1" stroke-width="1.5" />
        {"".join(noise_lines)}
        {"".join(noise_dots)}
        {"".join(char_elements)}
    </svg>'''
    
    b64_svg = base64.b64encode(svg_content.encode('utf-8')).decode('utf-8')
    return b64_svg

class HITLManager:
    """
    Human-in-the-Loop (HITL) Workflow & Interruption Gate Manager
    Implements:
    1. Visual CAPTCHA Generation & Human-Only Entry Verification
    2. Strict Mismatch Detection & 2-Minute Cooldown Penalty Lock
    3. Session Custody & Asynchronous Interruption-Resume Semantics
    4. Runtime Approval Gates for High-Risk Actions
    5. Active Learning Human Feedback Collector
    6. Immutable Audit Trail Logging
    """
    def __init__(self, session_ttl_seconds=120):
        self.session_ttl_seconds = session_ttl_seconds
        self.active_sessions = {}
        self.lock = Lock()
        self._init_files()

    def _init_files(self):
        if not os.path.exists(AUDIT_LOG_FILE):
            with open(AUDIT_LOG_FILE, 'w', encoding='utf-8') as f:
                json.dump([], f)
        if not os.path.exists(FEEDBACK_LOG_FILE):
            with open(FEEDBACK_LOG_FILE, 'w', encoding='utf-8') as f:
                json.dump([], f)

    def create_interruption_gate(self, flow_type, target_resource, context_data, challenge_type="CAPTCHA_CHALLENGE"):
        """
        Creates an asynchronous interruption gate, pausing automated execution
        until human intervention solves the visual security challenge.
        """
        with self.lock:
            self._cleanup_expired_sessions()
            session_id = str(uuid.uuid4())
            now = time.time()
            
            # Generate 6-character alphanumeric visual CAPTCHA (avoiding ambiguous 0/O, 1/I)
            charset = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
            captcha_code = "".join(random.choices(charset, k=6))
            captcha_svg_b64 = generate_visual_captcha_svg(captcha_code)
            
            session = {
                "session_id": session_id,
                "flow_type": flow_type,
                "target_resource": target_resource,
                "status": "PAUSED_AT_INTERRUPTION_GATE",
                "challenge_type": challenge_type,
                "expected_code": captcha_code, # Stored strictly on backend
                "captcha_image_b64": captcha_svg_b64,
                "context_data": context_data or {},
                "created_at": now,
                "expires_at": now + self.session_ttl_seconds,
                "ttl_remaining": self.session_ttl_seconds,
                "cooldown_until": 0,
                "resumed_at": None,
                "authorized_by": None
            }
            self.active_sessions[session_id] = session
            
            self.log_audit_event(
                event_type="INTERRUPTION_GATE_OPENED",
                session_id=session_id,
                details={
                    "flow_type": flow_type,
                    "target_resource": target_resource,
                    "challenge_type": challenge_type,
                    "expires_in_seconds": self.session_ttl_seconds
                }
            )
            
            # Return public payload (WITHOUT the plaintext answer)
            public_session = {
                "session_id": session_id,
                "flow_type": flow_type,
                "target_resource": target_resource,
                "status": "PAUSED_AT_INTERRUPTION_GATE",
                "challenge_type": challenge_type,
                "captcha_image_b64": captcha_svg_b64,
                "ttl_remaining": self.session_ttl_seconds,
                "context_data": context_data or {}
            }
            return public_session

    def resume_interruption_gate(self, session_id, human_input, authorized_by="Human User"):
        """
        Validates human-entered CAPTCHA.
        If correct -> Resumes execution & returns live data.
        If wrong -> Enforces 2-minute (120s) lockout penalty.
        """
        with self.lock:
            self._cleanup_expired_sessions()
            session = self.active_sessions.get(session_id)
            if not session:
                return {
                    "success": False,
                    "error": "Session expired or invalid. Please click the house again to generate a new verification challenge."
                }

            now = time.time()

            # Check if currently locked in cooldown
            if session.get("cooldown_until", 0) > now:
                remaining_cooldown = int(session["cooldown_until"] - now)
                return {
                    "success": False,
                    "error": f"Incorrect security code previously entered. Cooldown active. Please wait {remaining_cooldown} seconds.",
                    "cooldown_remaining": remaining_cooldown,
                    "is_locked": True
                }

            if now > session["expires_at"]:
                session["status"] = "EXPIRED"
                return {
                    "success": False,
                    "error": "Session window expired (2-minute window exceeded). Please generate a new challenge."
                }

            entered_clean = str(human_input).strip().upper()
            expected_clean = str(session["expected_code"]).strip().upper()

            # STRICT VERIFICATION CHECK
            if entered_clean != expected_clean:
                # WRONG CODE ENTERED -> Trigger 2-minute Cooldown Lockout
                cooldown_duration = 120 # 2 minutes
                session["cooldown_until"] = now + cooldown_duration
                session["status"] = "COOLDOWN_LOCKED"
                
                self.log_audit_event(
                    event_type="INTERRUPTION_GATE_FAILED_CHALLENGE",
                    session_id=session_id,
                    details={
                        "flow_type": session["flow_type"],
                        "target_resource": session["target_resource"],
                        "reason": "Human input mismatched security challenge",
                        "cooldown_seconds": cooldown_duration
                    }
                )
                
                return {
                    "success": False,
                    "error": "❌ Security verification code is incorrect! Please wait 2 minutes (120s) for a new security code.",
                    "cooldown_seconds": cooldown_duration,
                    "is_locked": True
                }

            # CORRECT CODE ENTERED -> RESUME WORKFLOW WITH DELEGATED SESSION TOKEN!
            delegated_token = f"TN-AUTH-DELEGATED-{uuid.uuid4().hex[:12].upper()}"
            session["status"] = "RESUMED_AND_COMPLETED"
            session["resumed_at"] = now
            session["authorized_by"] = authorized_by
            session["human_input"] = human_input
            session["delegated_session_token"] = delegated_token

            self.log_audit_event(
                event_type="INTERRUPTION_GATE_RESUMED",
                session_id=session_id,
                details={
                    "flow_type": session["flow_type"],
                    "target_resource": session["target_resource"],
                    "authorized_by": authorized_by,
                    "delegated_session_token": delegated_token,
                    "turnaround_time_seconds": round(now - session["created_at"], 2)
                }
            )
            return {
                "success": True,
                "session_id": session_id,
                "delegated_session_token": delegated_token,
                "message": f"✅ Verification Successful! Resumed workflow with Delegated Session Token: {delegated_token}",
                "context_data": session.get("context_data", {})
            }

    def regenerate_fresh_challenge(self, session_id):
        """
        Called after 2-minute cooldown timer finishes to generate a fresh new CAPTCHA.
        """
        with self.lock:
            charset = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
            new_code = "".join(random.choices(charset, k=6))
            new_svg_b64 = generate_visual_captcha_svg(new_code)
            now = time.time()
            
            if session_id in self.active_sessions:
                session = self.active_sessions[session_id]
                session["expected_code"] = new_code
                session["captcha_image_b64"] = new_svg_b64
                session["status"] = "PAUSED_AT_INTERRUPTION_GATE"
                session["cooldown_until"] = 0
                session["created_at"] = now
                session["expires_at"] = now + self.session_ttl_seconds
                session["ttl_remaining"] = self.session_ttl_seconds
                return {
                    "success": True,
                    "session_id": session_id,
                    "captcha_image_b64": new_svg_b64,
                    "ttl_remaining": self.session_ttl_seconds
                }
            else:
                return self.create_interruption_gate("AUTH_DELEGATION", "eservices.tn.gov.in", {})

    def get_session_status(self, session_id):
        with self.lock:
            self._cleanup_expired_sessions()
            session = self.active_sessions.get(session_id)
            if not session:
                return {"found": False, "status": "NOT_FOUND_OR_EXPIRED"}
            
            now = time.time()
            remaining = max(0, int(session["expires_at"] - now))
            cooldown_left = max(0, int(session.get("cooldown_until", 0) - now))
            
            return {
                "found": True,
                "status": session["status"],
                "ttl_remaining": remaining,
                "cooldown_remaining": cooldown_left,
                "is_locked": cooldown_left > 0
            }

    def log_audit_event(self, event_type, session_id, details):
        event = {
            "log_id": str(uuid.uuid4()),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            "unix_timestamp": time.time(),
            "event_type": event_type,
            "session_id": session_id,
            "details": details
        }
        try:
            with open(AUDIT_LOG_FILE, 'r+', encoding='utf-8') as f:
                logs = json.load(f)
                logs.append(event)
                f.seek(0)
                json.dump(logs, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Audit log writing notice: {e}")

    def get_audit_logs(self, limit=50):
        try:
            if os.path.exists(AUDIT_LOG_FILE):
                with open(AUDIT_LOG_FILE, 'r', encoding='utf-8') as f:
                    logs = json.load(f)
                    return list(reversed(logs[-limit:]))
        except Exception as e:
            print(f"Error reading audit logs: {e}")
        return []

    def record_feedback(self, parcel_id, original_data, corrected_data, user_notes):
        feedback_entry = {
            "feedback_id": str(uuid.uuid4()),
            "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
            "parcel_id": parcel_id,
            "original_data": original_data,
            "corrected_data": corrected_data,
            "user_notes": user_notes,
            "status": "APPLIED_TO_LOCAL_REGISTRY"
        }
        try:
            with open(FEEDBACK_LOG_FILE, 'r+', encoding='utf-8') as f:
                feedbacks = json.load(f)
                feedbacks.append(feedback_entry)
                f.seek(0)
                json.dump(feedbacks, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"Feedback recording notice: {e}")
        return feedback_entry

    def _cleanup_expired_sessions(self):
        now = time.time()
        expired_keys = [k for k, v in self.active_sessions.items() if now > v["expires_at"] and now > v.get("cooldown_until", 0)]
        for k in expired_keys:
            del self.active_sessions[k]

hitl_instance = HITLManager()
