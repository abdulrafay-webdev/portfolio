"""
Image model for media assets.
"""

from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from uuid import UUID
from datetime import datetime

from src.models.base import BaseModel


class Image(BaseModel, table=True):
    """Image table in database."""
    
    __tablename__ = "images"
    
    url: str = Field(..., max_length=500)
    alt_text: Optional[str] = Field(default=None, max_length=200)
    entity_type: str = Field(...)  # 'project' or 'service'
    entity_id: UUID = Field(...)
    project_id: Optional[UUID] = Field(default=None, foreign_key="projects.id", nullable=True)
    service_id: Optional[UUID] = Field(default=None, foreign_key="services.id", nullable=True)


class ImageCreate(SQLModel):
    """Schema for creating an image."""
    
    url: str = Field(..., max_length=500)
    alt_text: Optional[str] = Field(default=None, max_length=200)
    entity_type: str = Field(...)  # 'project' or 'service'
    entity_id: UUID


class ImageUpdate(SQLModel):
    """Schema for updating an image."""
    
    url: Optional[str] = Field(default=None, max_length=500)
    alt_text: Optional[str] = Field(default=None, max_length=200)


class ImageRead(SQLModel):
    """Schema for reading an image."""
    
    id: UUID
    url: str
    alt_text: Optional[str]
    entity_type: str
    entity_id: UUID
    created_at: datetime
    updated_at: datetime
