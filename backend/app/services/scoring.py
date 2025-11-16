import pandas as pd
from shapely.geometry import Point, LineString
from typing import List, Tuple

from app.core.config import CRIME_CSV_PATH
from app.schemas.routes import SafeRouteResponse, LatLng

crime_df = pd.read_csv(CRIME_CSV_PATH)

CATEGORY_WEIGHTS = {
    "Violent/Person-Related": 3.0,
    "Property": 2.0,
    "Substance/Impairment": 1.5,
    "Public Safety/Suspicious": 1.0,
    "Other Incident": 0.8,
    "Other": 0.5,
}


def calculate_safety(path_points: List[Tuple[float, float]]):
    """Compute safety score using shapely buffer against crime locations."""
    line = LineString([(lng, lat) for lat, lng in path_points])
    buffer_dist = 0.001
    buffer = line.buffer(buffer_dist)

    total_risk = 0.0
    risk_factors = set()

    for _, row in crime_df.iterrows():
        point = Point(row["Longitude"], row["Latitude"])
        if buffer.contains(point):
            cat = row["Crime_Category"]
            total_risk += CATEGORY_WEIGHTS.get(cat, 0.5)
            risk_factors.add(cat)

    score = max(0, 100 - total_risk * 2)
    level = (
        "low" if score >= 85 else
        "medium" if score >= 70 else
        "high"
    )

    description = {
        "low": "Prioritizes lower-incident blocks around campus.",
        "medium": "Passes near a few recent incidents; stay cautious.",
        "high": "Near several incident zones; consider safer alternative."
    }[level]

    return int(score), level, description, sorted(list(risk_factors))


def route_to_schema(route, idx):
    """Convert Google route → SafeRouteResponse."""
    dist_meters = route["distanceMeters"]
    duration_seconds = int(route["duration"].replace("s", ""))
    encoded = route["polyline"]["encodedPolyline"]

    from app.services.google_maps import decode_route
    points = decode_route(encoded)

    score, riskLevel, desc, factors = calculate_safety(points)

    return SafeRouteResponse(
        label=f"Route {idx + 1}",
        duration=round(duration_seconds / 60),
        distance=round(dist_meters / 1609.34, 2),
        safetyScore=score,
        riskLevel=riskLevel,
        description=desc,
        riskFactors=factors or ["No incidents in area"],
        path=[LatLng(lat=a, lng=b) for a, b in points]
    )


def pick_best_median_worst(routes: List[SafeRouteResponse]):
    """Select best, median, and worst routes by safetyScore."""
    sorted_routes = sorted(routes, key=lambda r: r.safetyScore)

    if len(sorted_routes) <= 3:
        return sorted_routes[::-1]

    worst = sorted_routes[0]
    best = sorted_routes[-1]
    median = sorted_routes[len(sorted_routes) // 2]

    return [best, median, worst]
