from typing import List, Literal
from pydantic import BaseModel


class LatLng(BaseModel):
    lat: float
    lng: float


class RouteRequest(BaseModel):
    origin: str
    destination: str
    mode: Literal["DRIVE", "WALK", "BICYCLE", "TRANSIT", "TWO_WHEELER"] = "WALK"


class SafeRouteResponse(BaseModel):
    label: str
    duration: int
    distance: float
    safetyScore: int
    riskLevel: Literal["low", "medium", "high"]
    description: str
    riskFactors: List[str]
    path: List[LatLng]
