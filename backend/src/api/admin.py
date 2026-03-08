"""
Admin panel API endpoints for CRUD operations.
"""

from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from typing import List, Optional
from datetime import timedelta

from src.database import get_session
from src.models.admin import AdminUser, AdminUserCreate, AdminUserRead, AdminLogin
from src.models.project import Project, ProjectCreate, ProjectUpdate, ProjectRead
from src.models.service import Service, ServiceCreate, ServiceUpdate, ServiceRead
from src.models.image import Image, ImageCreate, ImageRead
from src.models.contact import Contact, ContactUpdate, ContactRead
from src.utils.security import create_access_token, verify_password, decode_access_token
from src.config import settings
from src.services.imagekit import imagekit_service

router = APIRouter(prefix="/admin", tags=["Admin"])
security = HTTPBearer()


@router.get("/setup")
def setup_admin(session: Session = Depends(get_session)):
    """
    Setup initial admin user. Call this ONCE after deployment.
    Credentials from environment variables or defaults:
    - ADMIN_EMAIL (default: abdullrrafay@2005)
    - ADMIN_PASSWORD (default: Rafay@2005)
    """
    import os
    
    # Get credentials from environment or use defaults
    admin_email = os.getenv("ADMIN_EMAIL", "abdullrrafay@2005")
    admin_password = os.getenv("ADMIN_PASSWORD", "Rafay@2005")
    
    # Check if admin already exists
    statement = select(AdminUser)
    existing_admin = session.exec(statement).first()
    
    if existing_admin:
        # Update existing admin password
        existing_admin.set_password(admin_password)
        existing_admin.email = admin_email
        session.add(existing_admin)
        session.commit()
        
        return {
            "status": "updated",
            "message": "Admin credentials updated successfully!",
            "email": admin_email,
            "password": admin_password
        }
    
    # Create new admin
    admin_data = AdminUserCreate(
        email=admin_email,
        password=admin_password
    )
    
    db_admin = AdminUser.model_validate(admin_data)
    session.add(db_admin)
    session.commit()
    
    return {
        "status": "success",
        "message": "Admin user created successfully!",
        "email": admin_email,
        "password": admin_password
    }


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    session: Session = Depends(get_session)
) -> AdminUser:
    """Dependency to get current authenticated admin user."""
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    statement = select(AdminUser).where(AdminUser.email == email)
    admin = session.exec(statement).first()
    
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return admin


@router.post("/login", response_model=dict)
def admin_login(
    login: AdminLogin,
    session: Session = Depends(get_session)
):
    """
    Admin login endpoint.
    
    Returns JWT token in response (set as HTTPOnly cookie in production).
    """
    statement = select(AdminUser).where(AdminUser.email == login.email)
    admin = session.exec(statement).first()
    
    if not admin or not admin.verify_password(login.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": admin.email},
        expires_delta=timedelta(minutes=settings.jwt_expire_minutes)
    )
    
    return {
        "message": "Login successful",
        "access_token": access_token,
        "token_type": "bearer",
        "email": admin.email
    }


# Project CRUD
@router.get("/projects", response_model=List[ProjectRead])
def admin_get_projects(
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Get all projects (admin view)."""
    statement = select(Project)
    projects = session.exec(statement).all()
    return projects


@router.post("/projects", response_model=ProjectRead, status_code=201)
def admin_create_project(
    project: ProjectCreate,
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Create a new project."""
    # Check if slug already exists
    statement = select(Project).where(Project.slug == project.slug)
    if session.exec(statement).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A project with this slug already exists"
        )

    db_project = Project.model_validate(project)
    session.add(db_project)
    session.commit()
    session.refresh(db_project)
    
    return db_project


@router.get("/projects/{project_id}", response_model=ProjectRead)
def admin_get_project(
    project_id: str,
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Get a specific project by ID."""
    statement = select(Project).where(Project.id == project_id)
    project = session.exec(statement).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    return project


@router.put("/projects/{project_id}", response_model=ProjectRead)
def admin_update_project(
    project_id: str,
    project_update: ProjectUpdate,
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Update an existing project."""
    statement = select(Project).where(Project.id == project_id)
    project = session.exec(statement).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check if slug changed and already exists
    if project_update.slug and project_update.slug != project.slug:
        slug_statement = select(Project).where(Project.slug == project_update.slug)
        if session.exec(slug_statement).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A project with this slug already exists"
            )
    
    update_data = project_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
    
    session.add(project)
    session.commit()
    session.refresh(project)
    
    return project


@router.delete("/projects/{project_id}", status_code=204)
def admin_delete_project(
    project_id: str,
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Delete a project and its associated images."""
    statement = select(Project).where(Project.id == project_id)
    project = session.exec(statement).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    session.delete(project)
    session.commit()
    
    return None


# Service CRUD
@router.get("/services", response_model=List[ServiceRead])
def admin_get_services(
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Get all services (admin view)."""
    statement = select(Service)
    services = session.exec(statement).all()
    return services


@router.post("/services", response_model=ServiceRead, status_code=201)
def admin_create_service(
    service: ServiceCreate,
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Create a new service."""
    db_service = Service.model_validate(service)
    session.add(db_service)
    session.commit()
    session.refresh(db_service)
    
    return db_service


@router.put("/services/{service_id}", response_model=ServiceRead)
def admin_update_service(
    service_id: str,
    service_update: ServiceUpdate,
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Update an existing service."""
    statement = select(Service).where(Service.id == service_id)
    service = session.exec(statement).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    update_data = service_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(service, key, value)
    
    session.add(service)
    session.commit()
    session.refresh(service)
    
    return service


@router.delete("/services/{service_id}", status_code=204)
def admin_delete_service(
    service_id: str,
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Delete a service and its associated images."""
    statement = select(Service).where(Service.id == service_id)
    service = session.exec(statement).first()
    
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    session.delete(service)
    session.commit()

    return None


@router.post("/images/upload")
async def upload_image(
    file: UploadFile = File(...),
    folder: str = 'portfolio',
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """
    Upload an image to ImageKit.
    
    Accepts file upload and returns ImageKit URL.
    """
    try:
        # Read file content
        file_content = await file.read()
        
        # Upload to ImageKit
        result = imagekit_service.upload_file(
            file_data=file_content,
            file_name=file.filename or 'uploaded-image',
            folder=folder
        )
        
        return {
            'url': result['url'],
            'fileId': result['fileId'],
            'name': result['name'],
            'size': result['size'],
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image upload failed: {str(e)}"
        )


@router.get("/images/upload-params")
def get_imagekit_upload_params(
    admin: AdminUser = Depends(get_current_admin)
):
    """
    Get ImageKit authentication parameters for client-side upload.

    Use these params to upload directly from browser.
    """
    params = imagekit_service.get_authentication_parameters()
    return params


# Contact Management Endpoints
@router.get("/contacts", response_model=List[ContactRead])
def admin_get_contacts(
    status: Optional[str] = None,
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Get all contact submissions with optional filtering."""
    statement = select(Contact)
    if status:
        statement = statement.where(Contact.status == status)
    statement = statement.order_by(Contact.created_at.desc())
    contacts = session.exec(statement).all()
    return contacts


@router.get("/contacts/stats")
def admin_get_contact_stats(
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Get contact submission statistics."""
    total = session.exec(select(Contact)).all()
    new_count = session.exec(select(Contact).where(Contact.status == "new")).all()
    read_count = session.exec(select(Contact).where(Contact.is_read == True)).all()
    
    return {
        "total": len(total),
        "new": len(new_count),
        "read": len(read_count),
        "unread": len(total) - len(read_count)
    }


@router.get("/contacts/{contact_id}", response_model=ContactRead)
def admin_get_contact(
    contact_id: str,
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Get a specific contact submission by ID."""
    statement = select(Contact).where(Contact.id == contact_id)
    contact = session.exec(statement).first()

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    # Mark as read
    contact.is_read = True
    if contact.status == "new":
        contact.status = "read"
    session.add(contact)
    session.commit()
    session.refresh(contact)

    return contact


@router.put("/contacts/{contact_id}", response_model=ContactRead)
def admin_update_contact(
    contact_id: str,
    contact_update: ContactUpdate,
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Update a contact submission (mark as read, change status, etc.)."""
    statement = select(Contact).where(Contact.id == contact_id)
    contact = session.exec(statement).first()

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    update_data = contact_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(contact, key, value)

    session.add(contact)
    session.commit()
    session.refresh(contact)

    return contact


@router.delete("/contacts/{contact_id}", status_code=204)
def admin_delete_contact(
    contact_id: str,
    session: Session = Depends(get_session),
    admin: AdminUser = Depends(get_current_admin)
):
    """Delete a contact submission."""
    statement = select(Contact).where(Contact.id == contact_id)
    contact = session.exec(statement).first()

    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    session.delete(contact)
    session.commit()

    return None
