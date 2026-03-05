"""
Public contact form API endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlmodel import Session
from datetime import datetime, timedelta

from src.database import get_session
from src.models.contact import Contact, ContactCreate, ContactRead

router = APIRouter(prefix="/contact", tags=["Contact"])

# Simple in-memory rate limiting (for production, use Redis)
_rate_limit_cache = {}


@router.post("", response_model=ContactRead, status_code=201)
def submit_contact_form(
    contact: ContactCreate,
    request: Request,
    session: Session = Depends(get_session)
):
    """
    Submit a contact form.
    
    Rate limited to 10 requests per minute per IP address.
    """
    # Rate limiting
    client_ip = request.client.host
    now = datetime.utcnow()
    
    if client_ip in _rate_limit_cache:
        last_request, count = _rate_limit_cache[client_ip]
        if now - last_request < timedelta(minutes=1) and count >= 10:
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please try again in 60 seconds."
            )
        _rate_limit_cache[client_ip] = (last_request, count + 1)
    else:
        _rate_limit_cache[client_ip] = (now, 1)
    
    # Create contact submission
    db_contact = Contact.model_validate(contact)
    session.add(db_contact)
    session.commit()
    session.refresh(db_contact)
    
    return db_contact
