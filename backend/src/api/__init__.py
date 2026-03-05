"""
API package - exports all API routers.
"""

from src.api.projects import router as projects_router
from src.api.services import router as services_router
from src.api.contact import router as contact_router
from src.api.admin import router as admin_router

__all__ = [
    "projects_router",
    "services_router",
    "contact_router",
    "admin_router",
]
