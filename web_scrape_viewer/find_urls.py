from playwright.sync_api import sync_playwright

def find_links():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        try:
            page.goto("https://eservices.tn.gov.in/eservicesnew/home.html", timeout=30000)
            page.wait_for_load_state("networkidle")
            
            links = page.locator("a").all()
            output_lines = []
            for l in links:
                href = l.get_attribute("href") or ""
                text = l.text_content() or ""
                output_lines.append(f"Text: {text.strip()} | Href: {href}")
                
            with open("links_output.txt", "w", encoding="utf-8") as f:
                f.write("\n".join(output_lines))
            print("Successfully wrote links to links_output.txt")
        except Exception as e:
            print("Error:", e)
        finally:
            browser.close()

if __name__ == "__main__":
    find_links()
