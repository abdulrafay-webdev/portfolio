"""
Database configuration and session management.
"""

from sqlmodel import SQLModel, create_engine, Session
from sqlalchemy.orm import sessionmaker
from typing import Generator

from src.config import settings


# Create database engine with connection pooling
engine = create_engine(
    settings.database_url,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # Enable connection health checks
    echo=False,  # Set to True for SQL debugging
)


# Create session factory
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=Session,
)


def create_db_and_tables():
    """Create all database tables. Use Alembic for migrations in production."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency that provides a database session.
    Automatically closes the session after use.
    """
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()
