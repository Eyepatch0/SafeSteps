# app/services/google_maps.py
import requests
import polyline
from fastapi import HTTPException

from app.core.config import GOOGLE_MAPS_API_KEY


def fetch_routes(origin_lat, origin_lng, dest_lat, dest_lng, mode):
    """Call Google Directions Routes API with alternative routes enabled."""
    if not GOOGLE_MAPS_API_KEY:
        raise HTTPException(500, "GOOGLE_MAPS_API_KEY is not set")

    url = "https://routes.googleapis.com/directions/v2:computeRoutes"

    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": (
            "routes.distanceMeters,"
            "routes.duration,"
            "routes.polyline.encodedPolyline"
        ),
    }

    body = {
        "origin": {
            "location": {
                "latLng": {"latitude": origin_lat, "longitude": origin_lng}
            }
        },
        "destination": {
            "location": {
                "latLng": {"latitude": dest_lat, "longitude": dest_lng}
            }
        },
        "travelMode": mode,
        "computeAlternativeRoutes": True,
        "polylineQuality": "OVERVIEW",
    }

    # routingPreference is ONLY allowed for certain modes
    modes_supporting_pref = {"DRIVE", "TWO_WHEELER", "TRANSIT"}
    if mode in modes_supporting_pref:
        body["routingPreference"] = "TRAFFIC_AWARE"

    r = requests.post(url, json=body, headers=headers, timeout=15)

    if r.status_code != 200:
        # Surface Google’s error clearly to the client
        raise HTTPException(
            status_code=500,
            detail=f"Google Routes API error: {r.text}",
        )

    data = r.json()
    routes = data.get("routes", [])
    if not routes:
        raise HTTPException(404, "No routes found from Google Routes API.")
    return routes


def decode_route(polyline_str: str):
    """Decode encoded polyline → list of (lat, lng)."""
    return polyline.decode(polyline_str)
