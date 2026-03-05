"""Add image_url column to projects table

Revision ID: 003_add_project_image
Revises: 002_fix_tech_stack
Create Date: 2026-02-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '003_add_project_image'
down_revision: Union[str, None] = '002_fix_tech_stack'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add image_url column
    op.add_column('projects', sa.Column('image_url', sa.String(length=500), nullable=True))


def downgrade() -> None:
    # Remove image_url column
    op.drop_column('projects', 'image_url')
