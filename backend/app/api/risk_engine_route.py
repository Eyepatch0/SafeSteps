from fastapi import APIRouter

from app.schemas.routes import RouteRequest, SafeRouteResponse
from app.utils.geo import geocode
from app.services.google_maps import fetch_routes
from app.services.scoring import route_to_schema, pick_best_median_worst

router = APIRouter(prefix="/routes", tags=["Routes"])


@router.post("/safe", response_model=list[SafeRouteResponse])
def safe_routes(req: RouteRequest):

    # Step 1 — Geocode addresses
    o_lat, o_lng = geocode(req.origin)
    d_lat, d_lng = geocode(req.destination)

    # Step 2 — Fetch routes from Google
    raw = fetch_routes(o_lat, o_lng, d_lat, d_lng, req.mode)

    # Step 3 — Convert + score routes
    ready = [route_to_schema(r, i) for i, r in enumerate(raw)]

    # Step 4 — Choose best, median, worst
    selected = pick_best_median_worst(ready)

    return selected
