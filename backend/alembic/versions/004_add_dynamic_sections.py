"""Add dynamic sections to projects table

Revision ID: 004_add_dynamic_sections
Revises: 003_add_project_image
Create Date: 2026-02-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '004_add_dynamic_sections'
down_revision: Union[str, None] = '003_add_project_image'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add JSON columns for dynamic sections
    op.add_column('projects', sa.Column('project_meta', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column('projects', sa.Column('challenges', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column('projects', sa.Column('key_features', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    
    # Set default values for existing projects
    op.execute("""
        UPDATE projects SET 
        project_meta = '{
            "project_type": "Full Stack Web Application",
            "performance": "Optimized for speed & SEO",
            "responsive": "Mobile, Tablet & Desktop",
            "security": "Production-ready security"
        }'::jsonb
        WHERE project_meta IS NULL
    """)
    
    op.execute("""
        UPDATE projects SET 
        challenges = '{
            "challenge_title": "Scalable Architecture",
            "challenge_description": "Implementing a scalable architecture that supports rapid development while maintaining code quality and performance.",
            "solution_title": "Modern Tech Stack",
            "solution_description": "Utilized Next.js for frontend with server-side rendering, FastAPI for backend with async support, and implemented CI/CD pipelines for automated deployments."
        }'::jsonb
        WHERE challenges IS NULL
    """)
    
    op.execute("""
        UPDATE projects SET 
        key_features = '[
            "Responsive design across all devices",
            "Fast loading with optimized assets",
            "Secure authentication & authorization",
            "Real-time data updates",
            "SEO optimized structure",
            "Accessible UI components"
        ]'::jsonb
        WHERE key_features IS NULL
    """)


def downgrade() -> None:
    op.drop_column('projects', 'key_features')
    op.drop_column('projects', 'challenges')
    op.drop_column('projects', 'project_meta')
