"""
session_daemon.py - 24/7 Silent Background Master Session Auto-Renewal Worker
Keeps Tamil Nadu GIS (TNGIS) JWT access and refresh tokens continuously active.
Runs every 6 hours automatically in a background daemon thread.
"""

import os
import json
import time
import threading
import requests
from datetime import datetime

AUTH_FILE = os.path.join(os.path.dirname(__file__), "tngis_auth.json")
BASE_API = "https://tngis.tn.gov.in/apps/gi_viewer_api/gi_mvc/api/v1"

_lock = threading.Lock()

def fast_rest_refresh():
    """
    Attempts ultra-fast HTTP REST token refresh (sub-second).
    """
    if not os.path.exists(AUTH_FILE):
        return False

    with open(AUTH_FILE, "r") as f:
        auth_data = json.load(f)

    cookies_dict = {c["name"]: c["value"] for c in auth_data.get("cookies", [])}
    refresh_token = cookies_dict.get("refresh_token")
    if not refresh_token:
        return False

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Referer": "https://tngis.tn.gov.in/apps/gi_viewer/map-viewer/index.html",
        "Origin": "https://tngis.tn.gov.in"
    }

    url = f"{BASE_API}/auth/refresh"
    try:
        r = requests.post(url, json={"refreshToken": refresh_token, "refresh_token": refresh_token}, headers=headers, cookies=cookies_dict, timeout=10)
        if r.status_code == 200:
            resp_cookies = r.cookies.get_dict()
            if "access_token" in resp_cookies:
                for c in auth_data["cookies"]:
                    if c["name"] == "access_token":
                        c["value"] = resp_cookies["access_token"]
                with open(AUTH_FILE, "w") as f_out:
                    json.dump(auth_data, f_out, indent=2)
                return True
    except Exception:
        pass
    return False

def headless_browser_refresh():
    """
    Headless Playwright session restore (silent, background, zero CAPTCHA).
    """
    if not os.path.exists(AUTH_FILE):
        return False

    try:
        from playwright.sync_api import sync_playwright
        with open(AUTH_FILE, "r") as f:
            auth_data = json.load(f)

        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            context = browser.new_context(
                user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            )
            context.add_cookies(auth_data.get("cookies", []))
            page = context.new_page()

            page.goto("https://tngis.tn.gov.in/apps/gi_viewer/map-viewer/index.html", timeout=25000)
            page.wait_for_timeout(3500)

            state = context.storage_state()
            auth_data["cookies"] = state.get("cookies", [])
            auth_data["origins"] = state.get("origins", [])

            with open(AUTH_FILE, "w") as f_out:
                json.dump(auth_data, f_out, indent=2)

            browser.close()
            return True
    except Exception as e:
        print(f"[Session Daemon] Headless refresh error: {e}")
        return False

def renew_session():
    """
    Thread-safe session renewal. Tries fast REST first, falls back to headless browser.
    """
    with _lock:
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] [Session Daemon] Renewing TNGIS master session in background...")
        
        if fast_rest_refresh():
            print(f"[{timestamp}] [Session Daemon] Master session renewed successfully via Fast REST.")
            return True

        if headless_browser_refresh():
            print(f"[{timestamp}] [Session Daemon] Master session renewed successfully via Silent Browser.")
            return True

        print(f"[{timestamp}] [Session Daemon] Session renewal attempted. If expired, manual login via admin_login_tngis.py may be required.")
        return False

def _daemon_loop(interval_seconds=21600):
    """
    Background timer loop running every interval (default: 6 hours = 21,600s).
    """
    # Initial startup renewal
    time.sleep(3)
    renew_session()

    while True:
        try:
            time.sleep(interval_seconds)
            renew_session()
        except Exception as e:
            print(f"[Session Daemon] Loop exception: {e}")
            time.sleep(60)

def start_session_daemon(interval_seconds=21600):
    """
    Spawns the background auto-renewal worker thread.
    """
    t = threading.Thread(target=_daemon_loop, args=(interval_seconds,), daemon=True, name="TNGIS_Session_Daemon")
    t.start()
    print(">> [Session Daemon] 24/7 Background Master Session Auto-Renewal Worker started (Interval: 6 hours).")
    return t

if __name__ == "__main__":
    renew_session()
