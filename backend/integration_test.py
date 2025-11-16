"""
Simple integration test: POST to /api/routes/safe with sample origin/destination.

Run this after starting the backend (uvicorn) locally.

python integration_test.py
"""
import json
import requests

URL = "http://localhost:8000/api/routes/safe"

def run_test():
    payload = {
        "origin": "McKeldin Library, College Park, MD",
        "destination": "Prince George's Stadium, College Park, MD",
        "mode": "WALK",
    }

    try:
        r = requests.post(URL, json=payload, timeout=20)
        print("Status:", r.status_code)
        try:
            print(json.dumps(r.json(), indent=2))
        except Exception:
            print(r.text)
    except Exception as exc:
        print("Request failed:", exc)

if __name__ == '__main__':
    run_test()
