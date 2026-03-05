"""
Contact model for contact form submissions.
"""

from sqlmodel import SQLModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

from src.models.base import BaseModel


class Contact(BaseModel, table=True):
    """Contact table in database."""
    
    __tablename__ = "contacts"
    
    name: str = Field(..., min_length=2, max_length=200)
    email: str = Field(..., max_length=255)
    subject: str = Field(..., min_length=5, max_length=500)
    message: str = Field(..., min_length=10, max_length=5000)


class ContactCreate(SQLModel):
    """Schema for creating a contact submission."""
    
    name: str = Field(..., min_length=2, max_length=200)
    email: str = Field(..., max_length=255)
    subject: str = Field(..., min_length=5, max_length=500)
    message: str = Field(..., min_length=10, max_length=5000)


class ContactRead(SQLModel):
    """Schema for reading a contact submission."""
    
    id: UUID
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime
    updated_at: datetime
