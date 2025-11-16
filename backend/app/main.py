from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.risk_engine_route import router as risk_router
from app.api.health import router as health_router


app = FastAPI(title="SafeSteps API")

# CORS - allow local frontend dev server
origins = [
	"http://localhost:5173",
]

app.add_middleware(
	CORSMiddleware,
	allow_origins=origins,
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

# include the two routers
app.include_router(health_router, prefix="/api")
app.include_router(risk_router, prefix="/api")

