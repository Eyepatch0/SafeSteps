from fastapi import FastAPI
from app.api.risk_engine_route import router as risk_router
from app.api.health import router as health_router


app = FastAPI(title="SafeSteps API")

# include the two routers
app.include_router(health_router, prefix="/api")
app.include_router(risk_router, prefix="/api")

