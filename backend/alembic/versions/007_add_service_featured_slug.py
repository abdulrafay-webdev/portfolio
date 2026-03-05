"""Add featured and slug to services table

Revision ID: 007_add_service_featured_slug
Revises: 006_add_service_json_fields
Create Date: 2026-02-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '007_add_service_featured_slug'
down_revision: Union[str, None] = '006_add_service_json_fields'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add featured boolean and slug columns
    op.add_column('services', sa.Column('featured', sa.Boolean(), nullable=True, default=False))
    op.add_column('services', sa.Column('slug', sa.String(length=250), nullable=True))
    
    # Create index on featured and slug
    op.create_index('idx_services_featured', 'services', ['featured'], postgresql_where=sa.text('featured = TRUE'))
    op.create_unique_constraint('uq_services_slug', 'services', ['slug'])
    
    # Set defaults for existing services
    op.execute("""
        UPDATE services SET featured = FALSE WHERE featured IS NULL
    """)
    
    # Generate slug from name for existing services
    op.execute("""
        UPDATE services 
        SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g'))
        WHERE slug IS NULL
    """)


def downgrade() -> None:
    op.drop_constraint('uq_services_slug', 'services', type_='unique')
    op.drop_index('idx_services_featured', 'services')
    op.drop_column('services', 'slug')
    op.drop_column('services', 'featured')
