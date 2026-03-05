"""
Base SQLModel with common fields.
All models should inherit from this base class.
"""

from sqlmodel import SQLModel, Field
from datetime import datetime
from uuid import UUID, uuid4


class BaseModel(SQLModel):
    """Base model with common fields."""
    
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        # Allow population by field name for API compatibility
        populate_by_name = True
