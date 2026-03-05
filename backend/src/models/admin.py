"""
Admin user model for authentication.
"""

from sqlmodel import SQLModel, Field
from typing import Optional
from uuid import UUID
from datetime import datetime

from src.models.base import BaseModel
from src.utils.security import get_password_hash, verify_password


class AdminUser(BaseModel, table=True):
    """Admin user table in database."""
    
    __tablename__ = "admin_users"
    
    email: str = Field(..., unique=True, index=True)
    password_hash: str = Field(...)
    
    def verify_password(self, plain_password: str) -> bool:
        """Verify a plain password against the hashed password."""
        return verify_password(plain_password, self.password_hash)


class AdminUserCreate(SQLModel):
    """Schema for creating an admin user."""
    
    email: str = Field(...)
    password: str = Field(..., min_length=8)


class AdminUserRead(SQLModel):
    """Schema for reading an admin user (excludes password)."""
    
    id: UUID
    email: str
    created_at: datetime
    updated_at: datetime


class AdminLogin(SQLModel):
    """Schema for admin login request."""
    
    email: str
    password: str
