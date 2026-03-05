#!/usr/bin/env python3
"""
Interactive credential setup script for Portfolio Rafay.
Prompts user for all required credentials with explanations.
"""

import os
import secrets
import hashlib
from pathlib import Path

def print_header():
    print("=" * 60)
    print("  Portfolio Rafay - Credential Setup")
    print("=" * 60)
    print()

def print_section(title):
    print(f"\n{'=' * 60}")
    print(f"  {title}")
    print(f"{'=' * 60}\n")

def get_input(prompt, explanation=None, default=None, validator=None):
    """Get user input with optional explanation and validation."""
    if explanation:
        print(f"  💡 {explanation}\n")
    
    if default:
        prompt = f"{prompt} [{default}]"
    
    while True:
        value = input(f"  {prompt}: ").strip()
        
        if not value and default:
            value = default
        
        if not value:
            print("  ❌ This field is required. Please enter a value.")
            continue
        
        if validator:
            is_valid, error_msg = validator(value)
            if not is_valid:
                print(f"  ❌ {error_msg}")
                continue
        
        return value

def validate_url(value):
    """Validate URL format."""
    if value.startswith(('http://', 'https://')):
        return True, ""
    return False, "URL must start with http:// or https://"

def validate_email(value):
    """Validate email format."""
    if '@' in value and '.' in value.split('@')[-1]:
        return True, ""
    return False, "Please enter a valid email address"

def validate_neon_url(value):
    """Validate Neon PostgreSQL connection string."""
    if value.startswith('postgresql://') and 'neon.tech' in value:
        return True, ""
    if value.startswith('postgresql://'):
        print("  ⚠️  Warning: URL doesn't contain 'neon.tech'. Is this correct?")
        return True, ""
    return False, "Must be a valid PostgreSQL connection string"

def main():
    print_header()
    
    env_file = Path(__file__).parent / '.env'
    
    if env_file.exists():
        print(f"  ⚠️  .env file already exists at: {env_file}")
        overwrite = input("  Do you want to overwrite it? (y/n): ").strip().lower()
        if overwrite != 'y':
            print("  Exiting without changes.")
            return
    
    credentials = {}
    
    # Section 1: Database
    print_section("1. Neon PostgreSQL Database")
    
    credentials['DATABASE_URL'] = get_input(
        "Enter your Neon PostgreSQL DATABASE_URL",
        explanation="Connection string for your cloud-hosted PostgreSQL database.\n"
                   "Find this in your Neon dashboard > Connection Details",
        validator=validate_neon_url
    )
    
    # Section 2: ImageKit
    print_section("2. ImageKit Account")
    
    credentials['IMAGEKIT_PUBLIC_KEY'] = get_input(
        "Enter your ImageKit Public Key",
        explanation="Public API key for image hosting and optimization.\n"
                   "Find this in ImageKit dashboard > Settings > API Keys"
    )
    
    credentials['IMAGEKIT_PRIVATE_KEY'] = get_input(
        "Enter your ImageKit Private Key",
        explanation="Private API key for server-side operations.\n"
                   "Keep this secret! Same location as Public Key"
    )
    
    credentials['IMAGEKIT_URL_ENDPOINT'] = get_input(
        "Enter your ImageKit URL Endpoint",
        explanation="Base URL for serving images via CDN.\n"
                   "Find this in ImageKit dashboard > Overview\n"
                   "Example: https://ik.imagekit.io/your-id/",
        validator=validate_url
    )
    
    # Section 3: WhatsApp
    print_section("3. WhatsApp Configuration")
    
    credentials['WHATSAPP_NUMBER'] = get_input(
        "Enter your WhatsApp number for client CTAs",
        explanation="Phone number that clients will message when clicking WhatsApp buttons.\n"
                   "Format: Country code + number (no spaces or dashes)\n"
                   "Example: +15551234567"
    )
    
    # Section 4: Admin Credentials
    print_section("4. Admin Credentials")
    
    credentials['ADMIN_EMAIL'] = get_input(
        "Enter admin email for login",
        explanation="Email address for accessing the admin panel.",
        validator=validate_email
    )
    
    credentials['ADMIN_PASSWORD'] = get_input(
        "Enter admin password (min 8 characters)",
        explanation="Password for admin panel access.\n"
                   "Will be hashed with bcrypt before storage."
    )
    
    # Section 5: JWT Secret
    print_section("5. JWT Secret")
    
    auto_generate = input("  Auto-generate a secure JWT secret? (Y/n): ").strip().lower()
    if auto_generate != 'n':
        credentials['JWT_SECRET'] = secrets.token_hex(32)
        print(f"  ✅ Generated secure JWT secret")
    else:
        credentials['JWT_SECRET'] = get_input(
            "Enter JWT secret key",
            explanation="Secret key for signing authentication tokens.\n"
                       "Generate with: openssl rand -hex 32"
        )
    
    # Write .env file
    print_section("Writing Configuration")
    
    env_content = """# Portfolio Rafay - Environment Variables
# Generated by setup_credentials.py
# DO NOT COMMIT THIS FILE TO VERSION CONTROL

"""
    
    for key, value in credentials.items():
        env_content += f"{key}={value}\n"
    
    env_content += """
# Security Notes:
# - Keep this file secure and never commit to Git
# - Rotate credentials periodically
# - Use different credentials for development and production
"""
    
    with open(env_file, 'w') as f:
        f.write(env_content)
    
    print(f"\n  ✅ Configuration saved to: {env_file}")
    print(f"\n  📝 Next steps:")
    print(f"     1. Review the .env file and verify all values")
    print(f"     2. Run: pip install -r requirements.txt")
    print(f"     3. Run: alembic upgrade head")
    print(f"     4. Run: uvicorn src.main:app --reload")
    print()
    
    # Create .env.example if it doesn't exist
    env_example = Path(__file__).parent / '.env.example'
    if not env_example.exists():
        example_content = """# Portfolio Rafay - Environment Variables Template
# Copy this file to .env and fill in your actual values

DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
IMAGEKIT_PUBLIC_KEY=your_public_key_here
IMAGEKIT_PRIVATE_KEY=your_private_key_here
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-id/
WHATSAPP_NUMBER=+1234567890
ADMIN_EMAIL=admin@portfolio.rafay
ADMIN_PASSWORD=your_secure_password_here
JWT_SECRET=generate_with_openssl_rand_-hex_32
"""
        with open(env_example, 'w') as f:
            f.write(example_content)
        print(f"  ✅ Created .env.example template")
    
    print()
    print("=" * 60)
    print("  Setup Complete!")
    print("=" * 60)

if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print("\n\n  ❌ Setup cancelled by user.")
    except Exception as e:
        print(f"\n  ❌ Error: {e}")
        raise
