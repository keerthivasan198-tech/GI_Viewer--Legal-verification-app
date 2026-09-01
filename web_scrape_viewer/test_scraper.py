import sys
import os

# Add directory to path
sys.path.append(os.path.dirname(__file__))

from scraper import start_scraping_session

print("Running test scraping session...")
try:
    res = start_scraping_session(
        district="Chennai",
        taluk="Egmore",
        village="Egmore Village",
        survey="101",
        subdiv="1A"
    )
    print("Scraper result:", res.keys())
    if res.get("success"):
        print("Scraper succeeded! Captcha length:", len(res.get("captcha_image", "")))
    else:
        print("Scraper failed:", res.get("error"))
except Exception as e:
    print("Exception occurred:", e)
