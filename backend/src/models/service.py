"""
Service model for portfolio services.
"""

from sqlmodel import SQLModel, Field, Column
from typing import Optional
from uuid import UUID, uuid4
from datetime import datetime
from sqlalchemy import JSON


class ServiceBase(SQLModel):
    """Base schema with common fields."""
    pass


class Service(ServiceBase, table=True):
    """Service table in database."""

    __tablename__ = "services"

    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(..., min_length=3, max_length=100)
    slug: str = Field(..., min_length=1, max_length=250, unique=True, index=True)
    description: str = Field(..., min_length=20, max_length=50000)  # Increased for rich text
    pricing: Optional[str] = Field(default=None, max_length=200)
    image_url: Optional[str] = Field(default=None, max_length=500)  # Service image
    featured: bool = Field(default=False, index=True)
    
    # Dynamic sections (JSON fields) - Use Column with JSON type
    features: Optional[list] = Field(default=None, sa_column=Column(JSON))
    delivery_time: Optional[str] = Field(default=None, sa_column=Column(JSON))
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class ServiceCreate(SQLModel):
    """Schema for creating a service."""

    name: str = Field(..., min_length=3, max_length=100)
    slug: str = Field(..., min_length=1, max_length=250)
    description: str = Field(..., min_length=20, max_length=50000)  # Increased for rich text
    pricing: Optional[str] = Field(default=None, max_length=200)
    image_url: Optional[str] = Field(default=None, max_length=500)
    featured: bool = Field(default=False)
    features: Optional[list] = None
    delivery_time: Optional[str] = None


class ServiceUpdate(SQLModel):
    """Schema for updating a service."""
    
    name: Optional[str] = Field(default=None, min_length=3, max_length=100)
    slug: Optional[str] = Field(default=None, min_length=1, max_length=250)
    description: Optional[str] = Field(default=None, min_length=20, max_length=1000)
    pricing: Optional[str] = Field(default=None, max_length=200)
    image_url: Optional[str] = Field(default=None, max_length=500)
    featured: Optional[bool] = None
    features: Optional[list] = None
    delivery_time: Optional[str] = None


class ServiceRead(SQLModel):
    """Schema for reading a service."""
    
    id: UUID
    name: str
    slug: str
    description: str
    pricing: Optional[str]
    image_url: Optional[str]
    featured: bool
    features: Optional[list]
    delivery_time: Optional[str]
    created_at: datetime
    updated_at: datetime
