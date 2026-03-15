"""
AthleteView Biometrics Service
Processes and analyzes real-time biometric data from SmartPatch sensors.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog

from .sensors.ppg_processor import router as ppg_router
from .analysis.vitals_analyzer import router as vitals_router
from .alerts.threshold_monitor import router as alerts_router

logger = structlog.get_logger()

app = FastAPI(
    title="AthleteView Biometrics Service",
    description="Real-time biometric data processing and analysis",
    version="0.1.0",
)

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


@app.get("/health")
async def health():
    return {"status": "ok", "service": "biometrics"}


app.include_router(ppg_router, prefix="/api/v1/ppg", tags=["PPG Heart Rate"])
app.include_router(vitals_router, prefix="/api/v1/vitals", tags=["Vitals Analysis"])
app.include_router(alerts_router, prefix="/api/v1/alerts", tags=["Health Alerts"])
