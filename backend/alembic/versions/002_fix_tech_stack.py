"""Fix tech_stack column from ARRAY to TEXT

Revision ID: 002_fix_tech_stack
Revises: 001_initial_schema
Create Date: 2026-02-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '002_fix_tech_stack'
down_revision: Union[str, None] = '001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Change tech_stack from ARRAY to TEXT
    op.alter_column('projects', 'tech_stack',
               existing_type=sa.ARRAY(sa.String()),
               type_=sa.Text(),
               existing_nullable=False,
               postgresql_using='tech_stack::text')


def downgrade() -> None:
    # Revert back to ARRAY (not recommended)
    op.alter_column('projects', 'tech_stack',
               existing_type=sa.Text(),
               type_=sa.ARRAY(sa.String()),
               existing_nullable=False)
