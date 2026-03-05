"""Add JSON columns to services table

Revision ID: 006_add_service_json_fields
Revises: 005_add_service_image
Create Date: 2026-02-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '006_add_service_json_fields'
down_revision: Union[str, None] = '005_add_service_image'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add JSON columns to services table
    op.add_column('services', sa.Column('features', postgresql.JSONB(astext_type=sa.Text()), nullable=True))
    op.add_column('services', sa.Column('delivery_time', sa.String(), nullable=True))
    
    # Set default values for existing services
    op.execute("""
        UPDATE services SET 
        features = '["Professional quality work", "Fast delivery", "Unlimited revisions", "24/7 support"]'::jsonb
        WHERE features IS NULL
    """)
    
    op.execute("""
        UPDATE services SET 
        delivery_time = '3-5 business days'
        WHERE delivery_time IS NULL
    """)


def downgrade() -> None:
    op.drop_column('services', 'delivery_time')
    op.drop_column('services', 'features')
