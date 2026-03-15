"""
AthleteView AI Service
FastAPI application for video processing, AI inference, and highlight detection.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import structlog

from .pipelines.video_enhancer import router as enhancer_router
from .pipelines.highlight_detector import router as highlight_router
from .pipelines.pose_estimator import router as pose_router
from .models.registry import ModelRegistry

logger = structlog.get_logger()

model_registry = ModelRegistry()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    logger.info("Starting AthleteView AI Service")
    await model_registry.load_models()
    app.state.models = model_registry
    yield
    logger.info("Shutting down AI Service")
    await model_registry.unload_models()


app = FastAPI(
    title="AthleteView AI Service",
    description="Real-time video enhancement, highlight detection, and pose estimation",
    version="0.1.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ai-service",
        "models_loaded": model_registry.loaded_models,
    }


# Register routers
app.include_router(enhancer_router, prefix="/api/v1/enhance", tags=["Video Enhancement"])
app.include_router(highlight_router, prefix="/api/v1/highlights", tags=["Highlight Detection"])
app.include_router(pose_router, prefix="/api/v1/pose", tags=["Pose Estimation"])
