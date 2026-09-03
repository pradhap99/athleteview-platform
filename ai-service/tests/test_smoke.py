"""Smoke tests for the AI service.

These assert the service imports and wires up its routes. That catches broken
imports, missing dependencies and router registration errors - the class of
failure that went unnoticed while CI was unable to run at all.
"""


def test_app_imports():
    from src.main import app

    assert app is not None


def test_app_exposes_health_route():
    from src.main import app

    paths = {getattr(route, "path", None) for route in app.routes}
    assert "/health" in paths
