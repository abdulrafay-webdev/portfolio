"""
Public projects API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List, Optional

from src.database import get_session
from src.models.project import Project, ProjectRead
from src.models.image import ImageRead

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=List[ProjectRead])
def get_projects(
    featured: Optional[bool] = None,
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    session: Session = Depends(get_session)
):
    """
    Get all projects with optional filtering.
    
    - **featured**: Filter by featured status (true/false)
    - **limit**: Maximum number of projects to return (1-100)
    - **offset**: Number of projects to skip for pagination
    """
    statement = select(Project)
    
    if featured is not None:
        statement = statement.where(Project.featured == featured)
    
    statement = statement.offset(offset).limit(limit)
    
    projects = session.exec(statement).all()
    
    return projects


@router.get("/featured", response_model=List[ProjectRead])
def get_featured_projects(
    session: Session = Depends(get_session)
):
    """Get only featured projects for homepage carousel."""
    statement = select(Project).where(Project.featured == True)
    projects = session.exec(statement).all()
    return projects


@router.get("/{slug}", response_model=ProjectRead)
def get_project_by_slug(
    slug: str,
    session: Session = Depends(get_session)
):
    """Get a specific project by its slug."""
    statement = select(Project).where(Project.slug == slug)
    project = session.exec(statement).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project
