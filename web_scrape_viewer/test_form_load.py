from playwright.sync_api import sync_playwright

def test_form():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        try:
            print("1. Navigating to Home...")
            page.goto("https://eservices.tn.gov.in/eservicesnew/home.html", timeout=30000)
            page.wait_for_load_state("networkidle")
            
            # Click the link directly
            print("2. Clicking Patta/Chitta link...")
            link_el = page.locator("a[href*='chittaNewRural']").first
            link_el.wait_for(state="visible", timeout=10000)
            link_el.click()
            
            print("Clicked. Waiting for load...")
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(5000)
            
            # Take screenshot
            page.screenshot(path="form_screenshot.png")
            print("Screenshot saved to form_screenshot.png")
            
            # Check for selectors
            has_district = page.locator("#districtCode").count() > 0
            has_taluk = page.locator("#talukCode").count() > 0
            has_village = page.locator("#villageCode").count() > 0
            print(f"Selectors found: district={has_district}, taluk={has_taluk}, village={has_village}")
            
            # Write page content to inspect
            with open("clicked_content.html", "w", encoding="utf-8") as f:
                f.write(page.content())
            print("Successfully saved clicked_content.html")
                
        except Exception as e:
            print("Error:", e)
        finally:
            browser.close()

if __name__ == "__main__":
    test_form()
