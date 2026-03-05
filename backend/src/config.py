"""
Configuration management for the backend.
Loads environment variables and provides type-safe access.
"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Database
    database_url: str
    
    # ImageKit
    imagekit_public_key: str
    imagekit_private_key: str
    imagekit_url_endpoint: str
    
    # WhatsApp
    whatsapp_number: str
    
    # Admin
    admin_email: str
    admin_password: str
    
    # JWT
    jwt_secret: str
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


# Global settings instance
settings = Settings()
