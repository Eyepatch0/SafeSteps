import math
from typing import List, Tuple

import pandas as pd
from shapely.geometry import LineString, Point

from app.core.config import CRIME_CSV_PATH
from app.schemas.routes import LatLng, SafeRouteResponse

EARTH_RADIUS = 6_378_137.0  # meters for Web Mercator projection
BUFFER_METERS = 50.0
INCIDENTS_PER_KM_FULL_PENALTY = 6.0

CATEGORY_SEVERITY = {
    "Violent/Person-Related": 1.0,
    "Substance/Impairment": 0.8,
    "Property": 0.65,
    "Public Safety/Suspicious": 0.45,
    "Admin/Legal/Special": 0.35,
}

SEVERITY_MIN = min(CATEGORY_SEVERITY.values())
SEVERITY_MAX = max(CATEGORY_SEVERITY.values())
DEFAULT_SEVERITY = SEVERITY_MIN

RISK_DESCRIPTIONS = {
    "low": "Prioritizes lower-incident blocks around campus.",
    "medium": "Passes near a few recent incidents; stay cautious.",
    "high": "Near several incident zones; consider safer alternative.",
}


def _to_web_mercator(lat: float, lng: float) -> Tuple[float, float]:
    """Project lat/lng into meters for distance calculations."""
    lat = max(min(lat, 89.9), -89.9)
    x = EARTH_RADIUS * math.radians(lng)
    y = EARTH_RADIUS * math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))
    return x, y


def _is_night(ts):
    if pd.isna(ts):
        return True
    hour = int(ts.hour)
    return hour < 6 or hour >= 18


def _load_crime_records():
    df = pd.read_csv(CRIME_CSV_PATH)
    df = df.rename(
        columns={
            "Date Occurred": "date_occurred",
            "Crime_Category": "crime_category",
        }
    )
    df["Latitude"] = pd.to_numeric(df["Latitude"], errors="coerce")
    df["Longitude"] = pd.to_numeric(df["Longitude"], errors="coerce")
    df["date_occurred"] = pd.to_datetime(
        df["date_occurred"],
        errors="coerce",
        format="%m/%d/%Y %H:%M:%S",
    )
    df = df.dropna(subset=["Latitude", "Longitude"])

    records = []
    for row in df.itertuples(index=False):
        x, y = _to_web_mercator(row.Latitude, row.Longitude)
        category = row.crime_category
        severity = CATEGORY_SEVERITY.get(category, DEFAULT_SEVERITY)
        records.append(
            {
                "point": Point(x, y),
                "category": category,
                "severity": severity,
                "is_night": _is_night(row.date_occurred),
            }
        )

    return records


CRIME_RECORDS = _load_crime_records()


def _route_geometry(path_points: List[Tuple[float, float]]):
    merc_points = [_to_web_mercator(lat, lng) for lat, lng in path_points]
    if len(merc_points) == 1:
        merc_points = merc_points * 2

    line = LineString(merc_points)
    buffer_geom = line.buffer(BUFFER_METERS)
    return line, buffer_geom


def _count_component(count: int, route_length_m: float) -> float:
    route_km = max(route_length_m / 1000.0, 0.01)
    max_incidents = max(1.0, route_km * INCIDENTS_PER_KM_FULL_PENALTY)
    count_norm = min(count / max_incidents, 1.0)
    return (1 - count_norm) * 40.0


def _severity_component(records: List[dict]) -> float:
    if not records:
        return 50.0

    avg_severity = sum(r["severity"] for r in records) / len(records)
    if SEVERITY_MAX == SEVERITY_MIN:
        severity_norm = 1.0
    else:
        severity_norm = (avg_severity - SEVERITY_MIN) / (SEVERITY_MAX - SEVERITY_MIN)
    severity_norm = min(max(severity_norm, 0.0), 1.0)
    return (1 - severity_norm) * 50.0


def _lighting_component(records: List[dict]) -> float:
    if not records:
        return 10.0

    night_ratio = sum(1 for r in records if r["is_night"]) / len(records)
    night_ratio = min(max(night_ratio, 0.0), 1.0)
    return (1 - night_ratio) * 10.0


def calculate_safety(path_points: List[Tuple[float, float]]):
    """Compute composite safety score using 50 m buffers around the path."""
    if not path_points:
        return 0, "high", RISK_DESCRIPTIONS["high"], ["No path data"]

    line, buffer_geom = _route_geometry(path_points)
    nearby = [r for r in CRIME_RECORDS if buffer_geom.contains(r["point"])]

    count_component = _count_component(len(nearby), max(line.length, 1.0))
    severity_component = _severity_component(nearby)
    lighting_component = _lighting_component(nearby)

    score = count_component + severity_component + lighting_component
    score = max(0, min(100, round(score)))

    if score >= 75:
        level = "low"
    elif score >= 50:
        level = "medium"
    else:
        level = "high"

    description = RISK_DESCRIPTIONS[level]
    risk_factors = sorted({r["category"] for r in nearby}) or ["No incidents in area"]

    return score, level, description, risk_factors


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
