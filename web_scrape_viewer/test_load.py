import sys
import base64
from playwright.sync_api import sync_playwright

def test():
    with sync_playwright() as p:
        # Let's try launching headed first to bypass basic bot detection
        browser = p.chromium.launch(headless=True)
        # Use a realistic desktop user agent
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800}
        )
        page = context.new_page()
        print("Navigating...")
        try:
            page.goto("https://eservices.tn.gov.in/eservicesweb/land/chitta.html?lan=en", timeout=30000, wait_until="commit")
            print("Committed. Waiting for load...")
            page.wait_for_timeout(5000)
            page.screenshot(path="page_screenshot.png")
            print("Screenshot saved to page_screenshot.png")
            print("Page content length:", len(page.content()))
            print("Title:", page.title())
        except Exception as e:
            print("Error:", e)
        finally:
            browser.close()

if __name__ == "__main__":
    test()
