"""
Model Registry — loads and manages AI models.
"""
import structlog

logger = structlog.get_logger()


class ModelRegistry:
    """Manages lifecycle of AI models for inference."""

    def __init__(self):
        self.models = {}
        self.loaded_models = []

    async def load_models(self):
        """Load all required models on startup."""
        logger.info("Loading AI models...")

        # TODO: Load actual models
        # self.models["super_resolution"] = load_esrgan()
        # self.models["pose_estimator"] = load_mediapipe_pose()
        # self.models["highlight_detector"] = load_highlight_model()
        # self.models["athlete_tracker"] = load_yolov8()

        self.loaded_models = [
            "super_resolution_placeholder",
            "pose_estimator_placeholder",
            "highlight_detector_placeholder",
            "athlete_tracker_placeholder",
        ]

        logger.info(f"Loaded {len(self.loaded_models)} models")

    async def unload_models(self):
        """Clean up models on shutdown."""
        self.models.clear()
        self.loaded_models.clear()
        logger.info("All models unloaded")

    def get_model(self, name: str):
        """Get a loaded model by name."""
        return self.models.get(name)
