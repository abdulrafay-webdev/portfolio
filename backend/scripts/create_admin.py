"""
Script to create admin user in database.
Run this once to setup admin account.
"""

from sqlmodel import Session, create_engine, select
from src.models.admin import AdminUser
from src.utils.security import get_password_hash
from src.config import settings

def create_admin():
    # Database connect
    engine = create_engine(settings.database_url)
    
    email = "abdullrrafay@gmail.com"
    password = "admin123"  # Shorter password
    
    with Session(engine) as session:
        # Check if admin exists
        statement = select(AdminUser).where(AdminUser.email == email)
        admin = session.exec(statement).first()
        
        if admin:
            print(f"Admin user already exists: {email}")
            print("Deleting old user and creating new one...")
            session.delete(admin)
            session.commit()
        
        # Create new admin user
        admin = AdminUser(
            email=email,
            password_hash=get_password_hash(password)
        )
        session.add(admin)
        session.commit()
        
        print("Admin user created successfully!")
        print(f"Email: {email}")
        print(f"Password: {password}")
        print("")
        print("You can now login at: http://localhost:3000/admin")

if __name__ == "__main__":
    try:
        create_admin()
    except Exception as e:
        print(f"Error: {e}")
        print("")
        print("Make sure:")
        print("  1. Database is connected")
        print("  2. .env file has correct DATABASE_URL")
