# app/utils/geo.py
import requests
from fastapi import HTTPException
from app.core.config import GOOGLE_MAPS_API_KEY

def geocode(address: str):
    """Return latitude, longitude for an address using Google Geocoding API."""
    if not GOOGLE_MAPS_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_MAPS_API_KEY is not set in environment / .env",
        )

    url = "https://maps.googleapis.com/maps/api/geocode/json"

    params = {
        "address": address,
        "key": GOOGLE_MAPS_API_KEY,
        "region": "us",                      # bias to US
    }

    r = requests.get(url, params=params, timeout=10)
    try:
        data = r.json()
    except Exception:
        raise HTTPException(
            status_code=502,
            detail=f"Geocoding HTTP error {r.status_code}: {r.text}",
        )

    status = data.get("status")
    error_message = data.get("error_message")

    if status != "OK":
        raise HTTPException(
            status_code=400,
            detail=(
                f"Geocoding failed for '{address}' "
                f"(status={status}, error={error_message})"
            ),
        )

    loc = data["results"][0]["geometry"]["location"]
    return loc["lat"], loc["lng"]
