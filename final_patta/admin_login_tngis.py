"""
admin_login_tngis.py - Captures authenticated session for Tamil Nilam - GI Viewer
Portal URL: https://tngis.tn.gov.in/apps/village_dashboard/
"""

import os
from playwright.sync_api import sync_playwright

AUTH_FILE = os.path.join(os.path.dirname(__file__), "tngis_auth.json")

def capture_tngis_session():
    print("=" * 65)
    print("  Tamil Nilam - GI Viewer Session Manager")
    print("  Portal: https://tngis.tn.gov.in/apps/village_dashboard/")
    print("=" * 65)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            viewport={"width": 1366, "height": 768}
        )
        page = context.new_page()
        
        url = "https://tngis.tn.gov.in/apps/village_dashboard/"
        print(f">> Opening: {url}")
        page.goto(url)
        
        print("\n" + "#" * 65)
        print(" ACTION REQUIRED:")
        print(" 1. In the browser window, log in with your account or sign up (Free).")
        print(" 2. Once the map/viewer loads successfully, return to this terminal.")
        print("#" * 65 + "\n")
        
        input(">> Press [ENTER] after logging in to save the master session: ")
        
        context.storage_state(path=AUTH_FILE)
        print(f"\n SUCCESS! Session saved to: {AUTH_FILE}")
        print(">> Scraper background workers can now query Tamil Nilam GI Viewer directly.\n")
        browser.close()

if __name__ == "__main__":
    capture_tngis_session()
