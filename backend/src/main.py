"""
Main FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os

from src.database import create_db_and_tables
from src.api import projects_router, services_router, contact_router, admin_router
from src.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    # Startup: Create database tables
    print("Starting up application...")
    try:
        create_db_and_tables()
        print("Database tables created successfully")
    except Exception as e:
        print(f"Database connection warning: {e}")
        print("Make sure DATABASE_URL environment variable is set correctly")
    yield
    # Shutdown: cleanup if needed


# Create FastAPI application
app = FastAPI(
    title="Portfolio Rafay API",
    description="RESTful API for Portfolio Rafay - Managing projects, services, contact forms, and admin operations",
    version="1.0.0",
    lifespan=lifespan,
)

# Get frontend URL from environment or use default
frontend_url = os.getenv("NEXT_PUBLIC_API_URL", "").replace("/api/v1", "").replace("localhost:8000", "localhost:3000")
cors_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3008",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3008",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

# Add production frontend URL if available
if frontend_url and frontend_url not in cors_origins:
    cors_origins.append(frontend_url)

# Always allow the known frontend URL
cors_origins.append("https://portfolio-abdulrafay.vercel.app")

# Add Vercel preview URLs for mobile testing
cors_origins.extend([
    "https://portfolio-backend-*.vercel.app",
    "https://*.vercel.app",
])

print(f"CORS configured for: {cors_origins}")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers with /api/v1 prefix
app.include_router(projects_router, prefix="/api/v1")
app.include_router(services_router, prefix="/api/v1")
app.include_router(contact_router, prefix="/api/v1")
app.include_router(admin_router, prefix="/api/v1")

print("API routers registered")


@app.get("/")
def root():
    """Root endpoint - API information."""
    return {
        "name": "Portfolio Rafay API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "configured": settings.is_configured
    }


@app.get("/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


@app.get("/api/v1/init-db")
def init_database():
    """Initialize database tables. Call this once after deployment."""
    try:
        create_db_and_tables()
        return {"status": "success", "message": "Database tables created successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}
