# Tamil Nadu Cadastral GIS & Patta Viewer (final_patta)

Official Land Records, Cadastral Boundaries (FMB), and Digital Patta Extraction portal for all 38 districts of Tamil Nadu.

## 🚀 How to Run

1. **Install Prerequisites**:
   ```bash
   pip install -r requirements.txt
   playwright install chromium
   ```

2. **Start the Web GIS Server**:
   ```bash
   python app.py
   ```

3. **Open the Website**:
   Open **http://localhost:5000/** in your web browser.

---

## 🏛️ Features

- **State-Wide Cadastral Mapping**: All 38 Tamil Nadu districts with administrative boundaries and interactive zoom.
- **Point & Click Inspection**: Click anywhere in Tamil Nadu to extract live government cadastral boundaries, ULPIN, Survey/Sub-division, and verified Patta owner records.
- **24/7 Silent Session Daemon**: Automatic background token renewal without CAPTCHA prompts.
- **Zero Fake Data Policy**: Displays only authentic, verified government records with real-time feedback.
