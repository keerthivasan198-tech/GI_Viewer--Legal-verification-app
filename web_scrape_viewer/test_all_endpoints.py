import unittest
import json
import sys
from app import app

class GISAppTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_parcels_endpoint(self):
        response = self.app.get('/api/parcels')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)
        print(f"[PASS] /api/parcels returned {len(data)} parcels.")

    def test_mpa_zones_endpoint(self):
        response = self.app.get('/api/mpa-zones')
        self.assertEqual(response.status_code, 200)
        zones = json.loads(response.data)
        self.assertIsInstance(zones, list)
        self.assertGreater(len(zones), 0)
        print(f"[PASS] /api/mpa-zones returned {len(zones)} Master Plan Areas & Marine Protected Areas.")

    def test_check_mpa_endpoint(self):
        # Chennai Coordinate inside CMDA Master Plan Area
        response = self.app.post('/api/check-mpa', 
                                 data=json.dumps({"lat": 13.0330, "lng": 80.2690}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data.get("in_mpa"))
        self.assertIn("CMDA", data.get("zone_name"))
        print(f"[PASS] /api/check-mpa verified Chennai in MPA: {data.get('zone_name')}")

    def test_query_coords_house_detection(self):
        # Test clicking on a house in Egmore
        response = self.app.post('/api/query-coords',
                                 data=json.dumps({"lat": 13.0827, "lng": 80.2707}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data.get("found"))
        parcel = data.get("parcel")
        self.assertIn("door_no", parcel)
        self.assertIn("owner", parcel)
        self.assertIn("patta", parcel)
        self.assertIn("svgPath", parcel)
        self.assertIn("mpa", parcel)
        print(f"[PASS] /api/query-coords retrieved house: {parcel.get('door_no')}, Owner: {parcel.get('owner')}, Patta: {parcel.get('patta')}, Survey: {parcel.get('survey')}/{parcel.get('subdiv')}")

    def test_scraper_session_and_captcha(self):
        # Test scraper start
        start_res = self.app.post('/api/start-scraping',
                                  data=json.dumps({
                                      "district": "Chennai",
                                      "taluk": "Egmore",
                                      "village": "Egmore Village",
                                      "survey": "101",
                                      "subdiv": "1A"
                                  }),
                                  content_type='application/json')
        self.assertEqual(start_res.status_code, 200)
        start_data = json.loads(start_res.data)
        self.assertTrue(start_data.get("success"))
        session_id = start_data.get("session_id")
        self.assertIsNotNone(session_id)
        print(f"[PASS] /api/start-scraping created session {session_id} with CAPTCHA.")

        # Test solve captcha
        solve_res = self.app.post('/api/solve-captcha',
                                  data=json.dumps({
                                      "session_id": session_id,
                                      "captcha_text": "TN78G"
                                  }),
                                  content_type='application/json')
        self.assertEqual(solve_res.status_code, 200)
        solve_data = json.loads(solve_res.data)
        self.assertTrue(solve_data.get("success"))
        self.assertIn("data", solve_data)
        print(f"[PASS] /api/solve-captcha successfully parsed government record for Patta {solve_data['data'].get('patta')}.")

if __name__ == '__main__':
    unittest.main()
