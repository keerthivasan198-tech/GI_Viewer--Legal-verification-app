from playwright.sync_api import sync_playwright

def print_html():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
        )
        page = context.new_page()
        try:
            url = "https://eservices.tn.gov.in/eservicesnew/land/chittaNewRuralTamil.html?lan=ta&rno=1I85nEy7RQXgHuQRPNA2O3hTV6ka9LEQATosNJ8yyFURL4jqBQsgfEu0ajlPB7fyFZiq7gQGgdEtZsMiHJfv5eCfLfxaE9Wx4ZlqkdZ2cMRcPVkaVkjGjpQCxbt55grgg1kMvgHcvEXBWP9T4GX8dQRiIKNk3JJu3TJleenTbhyYxuUfFvXEMOq3N4s0uzBWyPfP3vld6G19YsvJdkduhQ9AQkRiVOApqzPLgZKlgQGaDI9JxpWZiFvcNpFpi510"
            page.goto(url, timeout=30000)
            page.wait_for_load_state("networkidle")
            page.wait_for_timeout(3000)
            
            # Print page HTML structure briefly
            content = page.content()
            print("Content length:", len(content))
            print("Snippets:")
            
            # Look for iframe or form elements
            iframes = page.locator("iframe").all()
            print("Number of iframes:", len(iframes))
            for i, f in enumerate(iframes):
                print(f"  Iframe {i}: src={f.get_attribute('src')}, id={f.get_attribute('id')}, name={f.get_attribute('name')}")
                
            forms = page.locator("form").all()
            print("Number of forms:", len(forms))
            
            # Write full HTML to file
            with open("form_content.html", "w", encoding="utf-8") as f:
                f.write(content)
            print("Successfully saved page HTML to form_content.html")
            
        except Exception as e:
            print("Error:", e)
        finally:
            browser.close()

if __name__ == "__main__":
    print_html()
