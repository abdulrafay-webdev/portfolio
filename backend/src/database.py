"""
Database configuration and session management.
"""

from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.orm import sessionmaker
from typing import Generator
import os

from src.config import settings


# Get database URL from environment or settings
DATABASE_URL = os.getenv("DATABASE_URL") or settings.database_url

# Create database engine with connection pooling
# Lazy initialization - only create engine when needed
engine = None
SessionLocal = None


def get_engine():
    """Get or create database engine."""
    global engine
    if engine is None:
        if not DATABASE_URL:
            raise ValueError("DATABASE_URL environment variable is not set")
        engine = create_engine(
            DATABASE_URL,
            pool_size=10,
            max_overflow=20,
            pool_pre_ping=True,  # Enable connection health checks
            echo=False,  # Set to True for SQL debugging
        )
    return engine


def get_session_factory():
    """Get or create session factory."""
    global SessionLocal
    if SessionLocal is None:
        engine = get_engine()
        SessionLocal = sessionmaker(
            autocommit=False,
            autoflush=False,
            bind=engine,
            class_=Session,
        )
    return SessionLocal


def create_db_and_tables():
    """Create all database tables. Use Alembic for migrations in production."""
    engine = get_engine()
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency that provides a database session.
    Automatically closes the session after use.
    """
    SessionLocal = get_session_factory()
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
