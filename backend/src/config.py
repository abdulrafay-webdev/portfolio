"""
Configuration management for the backend.
Loads environment variables and provides type-safe access.
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database (optional - can be set via DATABASE_URL env var)
    database_url: Optional[str] = None

    # ImageKit (optional)
    imagekit_public_key: Optional[str] = None
    imagekit_private_key: Optional[str] = None
    imagekit_url_endpoint: Optional[str] = None

    # WhatsApp
    whatsapp_number: str = "923239518506"

    # Admin
    admin_email: Optional[str] = None
    admin_password: Optional[str] = None

    # JWT
    jwt_secret: Optional[str] = None
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440  # 24 hours

    # CORS - Allow all localhost ports for development
    cors_origins: str = "http://localhost:3000,http://localhost:3001,http://localhost:3008,http://127.0.0.1:3000,http://127.0.0.1:3001,http://127.0.0.1:3008"

    # API
    api_v1_prefix: str = "/api/v1"

    class Config:
        env_file = ".env"
        case_sensitive = False

    @property
    def cors_origins_list(self) -> list:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def is_configured(self) -> bool:
        """Check if essential settings are configured."""
        return bool(
            os.getenv("DATABASE_URL") or self.database_url
        )


# Global settings instance
settings = Settings()
