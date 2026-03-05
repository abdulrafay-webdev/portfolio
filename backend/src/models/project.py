"""
Project model for portfolio projects.
"""

from sqlmodel import SQLModel, Field, Column
from typing import Optional, Dict, List
from uuid import UUID, uuid4
from datetime import datetime
from sqlalchemy import JSON

class ProjectBase(SQLModel):
    """Base schema with common fields."""
    pass


class Project(ProjectBase, table=True):
    """Project table in database."""
    
    __tablename__ = "projects"
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    title: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=250, unique=True, index=True)
    description: str = Field(..., min_length=50, max_length=10000)  # Increased for rich text
    tech_stack: str = Field(default="")  # Comma-separated string
    featured: bool = Field(default=False, index=True)
    image_url: Optional[str] = Field(default=None, max_length=500)
    github_url: Optional[str] = Field(default=None, max_length=500)
    live_url: Optional[str] = Field(default=None, max_length=500)
    
    # Dynamic sections (JSON fields) - Use Column with JSON type
    project_meta: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    challenges: Optional[dict] = Field(default=None, sa_column=Column(JSON))
    key_features: Optional[list] = Field(default=None, sa_column=Column(JSON))
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ProjectCreate(SQLModel):
    """Schema for creating a project."""
    
    title: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=250)
    description: str = Field(..., min_length=50, max_length=10000)  # Increased for rich text
    tech_stack: str = Field(default="")
    featured: bool = Field(default=False)
    image_url: Optional[str] = Field(default=None, max_length=500)
    github_url: Optional[str] = Field(default=None, max_length=500)
    live_url: Optional[str] = Field(default=None, max_length=500)
    project_meta: Optional[dict] = None
    challenges: Optional[dict] = None
    key_features: Optional[list] = None


class ProjectUpdate(SQLModel):
    """Schema for updating a project."""
    
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    slug: Optional[str] = Field(default=None, min_length=1, max_length=250)
    description: Optional[str] = Field(default=None, min_length=50, max_length=2000)
    tech_stack: Optional[str] = None
    featured: Optional[bool] = None
    image_url: Optional[str] = Field(default=None, max_length=500)
    github_url: Optional[str] = Field(default=None, max_length=500)
    live_url: Optional[str] = Field(default=None, max_length=500)
    project_meta: Optional[dict] = None
    challenges: Optional[dict] = None
    key_features: Optional[list] = None


class ProjectRead(SQLModel):
    """Schema for reading a project."""
    
    id: UUID
    title: str
    slug: str
    description: str
    tech_stack: str
    featured: bool
    image_url: Optional[str]
    github_url: Optional[str]
    live_url: Optional[str]
    project_meta: Optional[dict]
    challenges: Optional[dict]
    key_features: Optional[list]
    created_at: datetime
    updated_at: datetime
