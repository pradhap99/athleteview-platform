"""
Vitals Analyzer
Combines HR, SpO2, temperature, and hydration data for comprehensive analysis.
"""
from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import structlog

logger = structlog.get_logger()
router = APIRouter()


class VitalsSnapshot(BaseModel):
    athlete_id: str
    heart_rate: float
    spo2: float
    skin_temperature: float
    core_temperature_estimate: Optional[float] = None
    hydration_index: Optional[float] = None  # 0-1, from sweat analysis
    sweat_rate_ml_hr: Optional[float] = None
    sodium_mmol_l: Optional[float] = None
    exertion_score: Optional[float] = None  # 0-10


class VitalsAnalysis(BaseModel):
    athlete_id: str
    status: str  # normal, caution, warning, critical
    exertion_level: str  # low, moderate, high, extreme
    hydration_status: str  # optimal, adequate, dehydrated, critical
    heat_stress_risk: str  # low, moderate, high
    recommendations: list[str]
    metrics: dict


# Sport-specific thresholds
CRICKET_THRESHOLDS = {
    "hr_zone_1": (90, 120),   # Light (fielding)
    "hr_zone_2": (120, 150),  # Moderate (running)
    "hr_zone_3": (150, 175),  # Hard (fast bowling)
    "hr_zone_4": (175, 200),  # Maximum
    "temp_caution": 38.5,
    "temp_warning": 39.0,
    "temp_critical": 39.5,
    "spo2_caution": 95,
    "spo2_warning": 92,
    "spo2_critical": 88,
}


@router.post("/analyze", response_model=VitalsAnalysis)
async def analyze_vitals(snapshot: VitalsSnapshot):
    """Analyze athlete vitals and provide recommendations."""
    recommendations = []
    status = "normal"

    # Heart rate analysis
    hr = snapshot.heart_rate
    if hr > 190:
        status = "warning"
        recommendations.append("Heart rate extremely elevated — consider rest period")
    elif hr > 175:
        recommendations.append("Heart rate in maximum zone — monitor closely")

    # Temperature analysis
    temp = snapshot.core_temperature_estimate or snapshot.skin_temperature + 1.0
    if temp > CRICKET_THRESHOLDS["temp_critical"]:
        status = "critical"
        recommendations.append("CRITICAL: Core temperature dangerously high — immediate cooling required")
    elif temp > CRICKET_THRESHOLDS["temp_warning"]:
        status = "warning"
        recommendations.append("Elevated body temperature — hydrate and seek shade")

    # SpO2 analysis
    if snapshot.spo2 < CRICKET_THRESHOLDS["spo2_warning"]:
        status = "warning"
        recommendations.append("Low blood oxygen — reduce intensity immediately")

    # Hydration analysis
    hydration_status = "optimal"
    if snapshot.sweat_rate_ml_hr and snapshot.sweat_rate_ml_hr > 1500:
        hydration_status = "dehydrated"
        recommendations.append(f"High sweat rate ({snapshot.sweat_rate_ml_hr:.0f} mL/hr) — increase fluid intake")

    # Exertion level
    if hr > 170:
        exertion = "extreme"
    elif hr > 150:
        exertion = "high"
    elif hr > 120:
        exertion = "moderate"
    else:
        exertion = "low"

    if not recommendations:
        recommendations.append("All vitals within normal range")

    return VitalsAnalysis(
        athlete_id=snapshot.athlete_id,
        status=status,
        exertion_level=exertion,
        hydration_status=hydration_status,
        heat_stress_risk="high" if temp > 38.5 else "moderate" if temp > 37.5 else "low",
        recommendations=recommendations,
        metrics={
            "heart_rate_bpm": hr,
            "spo2_pct": snapshot.spo2,
            "skin_temp_c": snapshot.skin_temperature,
            "core_temp_est_c": temp,
        },
    )
