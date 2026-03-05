"""
Public services API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from src.database import get_session
from src.models.service import Service, ServiceRead

router = APIRouter(prefix="/services", tags=["Services"])


@router.get("", response_model=List[ServiceRead])
def get_services(session: Session = Depends(get_session)):
    """Get all services."""
    statement = select(Service)
    services = session.exec(statement).all()
    return services


@router.get("/featured", response_model=List[ServiceRead])
def get_featured_services(session: Session = Depends(get_session)):
    """Get only featured services for carousel."""
    statement = select(Service).where(Service.featured == True)
    services = session.exec(statement).all()
    return services


@router.get("/{slug}", response_model=ServiceRead)
def get_service_by_slug(slug: str, session: Session = Depends(get_session)):
    """Get a specific service by slug."""
    statement = select(Service).where(Service.slug == slug)
    service = session.exec(statement).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    return service
