"""Add image_url to services table

Revision ID: 005_add_service_image
Revises: 004_add_dynamic_sections
Create Date: 2026-02-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '005_add_service_image'
down_revision: Union[str, None] = '004_add_dynamic_sections'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add image_url column to services table
    op.add_column('services', sa.Column('image_url', sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column('services', 'image_url')
