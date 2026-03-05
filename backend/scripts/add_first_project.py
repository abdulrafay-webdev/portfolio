"""
Quick script to add your first project.
Run this after logging in to get the token.
"""

import httpx

# Backend URL
API_URL = "http://localhost:8000/api/v1"

# Your admin credentials
EMAIL = "abdullrrafay@gmail.com"
PASSWORD = "Rafay@2005"

def login():
    """Login and get access token."""
    response = httpx.post(
        f"{API_URL}/admin/login",
        json={"email": EMAIL, "password": PASSWORD}
    )
    
    if response.status_code == 200:
        data = response.json()
        print("✅ Login successful!")
        return data["access_token"]
    else:
        print(f"❌ Login failed: {response.text}")
        return None

def create_project(token: str):
    """Create a new project."""
    
    # Project details - EDIT THESE!
    project_data = {
        "title": "My First Portfolio Project",
        "slug": "my-first-project",
        "description": "This is an amazing full-stack project built with Next.js 14 and FastAPI. It features a modern UI with neon-glassmorphism design, smooth animations, and responsive layout.",
        "tech_stack": ["Next.js", "FastAPI", "PostgreSQL", "TypeScript", "Tailwind CSS"],
        "featured": True,
        "github_url": "https://github.com/yourusername/project",
        "live_url": "https://your-demo.vercel.app"
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    
    response = httpx.post(
        f"{API_URL}/admin/projects",
        json=project_data,
        headers=headers
    )
    
    if response.status_code == 201:
        print("✅ Project created successfully!")
        print(f"\nProject Details:")
        print(f"  Title: {response.json()['title']}")
        print(f"  Slug: {response.json()['slug']}")
        print(f"  Featured: {response.json()['featured']}")
        print(f"\nView it at: http://localhost:3000")
    else:
        print(f"❌ Failed to create project: {response.text}")

def main():
    print("=" * 50)
    print("  Adding Your First Project")
    print("=" * 50)
    print()
    
    # Step 1: Login
    print("Step 1: Logging in...")
    token = login()
    
    if not token:
        return
    
    print()
    
    # Step 2: Create project
    print("Step 2: Creating project...")
    create_project(token)
    
    print()
    print("=" * 50)
    print("  Done!")
    print("=" * 50)

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nMake sure:")
        print("  1. Backend is running (http://localhost:8000)")
        print("  2. Database is connected")
