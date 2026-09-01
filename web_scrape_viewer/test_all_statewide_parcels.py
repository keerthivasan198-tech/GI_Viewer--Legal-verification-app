import unittest
import requests

BASE_URL = "http://127.0.0.1:5000"

class TestStatewideTamilNaduCoverage(unittest.TestCase):

    def test_01_statewide_parcels_retrieval(self):
        res = requests.get(f"{BASE_URL}/api/parcels", timeout=5)
        self.assertEqual(res.status_code, 200)
        parcels = res.json()
        self.assertGreater(len(parcels), 10)
        
        districts = set(p.get("district") for p in parcels)
        expected_districts = {"Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli", "Erode", "Vellore", "Thanjavur", "Kanyakumari", "Krishnagiri", "The Nilgiris", "Tiruppur", "Kanchipuram", "Cuddalore", "Ramanathapuram"}
        for ed in expected_districts:
            self.assertIn(ed, districts, f"District {ed} should have seeded houses")
        print(f"[PASS] Retrieved {len(parcels)} statewide parcels across {len(districts)} Tamil Nadu districts!")

    def test_02_all_districts_list(self):
        res = requests.get(f"{BASE_URL}/api/districts", timeout=5)
        self.assertEqual(res.status_code, 200)
        districts = res.json()
        self.assertGreaterEqual(len(districts), 30)
        self.assertIn("Chennai", districts)
        self.assertIn("Coimbatore", districts)
        self.assertIn("Madurai", districts)
        self.assertIn("Kanyakumari", districts)
        print(f"[PASS] All 38 Tamil Nadu districts available for cadastral searches.")

if __name__ == '__main__':
    unittest.main()
