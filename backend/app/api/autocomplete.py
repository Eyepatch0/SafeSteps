from fastapi import APIRouter, HTTPException
from app.schemas.autocomplete import AutocompleteResponse, PlaceSuggestion
import httpx
import os

router = APIRouter(prefix="/places", tags=["places"])

GOOGLE_MAPS_API_KEY = os.getenv("GOOGLE_MAPS_API_KEY")


@router.get("/autocomplete", response_model=AutocompleteResponse)
async def autocomplete_places(query: str):
    if not GOOGLE_MAPS_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="GOOGLE_MAPS_API_KEY not set in environment.",
        )

    q = query.strip()
    if len(q) < 3:
        return AutocompleteResponse(suggestions=[])

    params = {
        "input": q,
        "key": GOOGLE_MAPS_API_KEY,
        "components": "country:us",
        "types": "geocode",
    }

    try:
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.get(
                "https://maps.googleapis.com/maps/api/place/autocomplete/json",
                params=params,
            )
        data = resp.json()
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Places API error: {e}")

    # If Google sends an error status, return it cleanly
    status = data.get("status")
    if status != "OK":
        raise HTTPException(
            status_code=502,
            detail={
                "google_status": status,
                "google_error": data.get("error_message"),
            },
        )

    preds = data.get("predictions", [])
    suggestions = [
        PlaceSuggestion(description=p["description"])
        for p in preds[:5]
    ]

    return AutocompleteResponse(suggestions=suggestions)
