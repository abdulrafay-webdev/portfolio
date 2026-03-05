"""Initial schema with projects, services, contacts, images, admin_users

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-02-26

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_initial_schema'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Enable UUID extension
    op.execute('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    
    # Create projects table
    op.create_table('projects',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=250), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('tech_stack', postgresql.ARRAY(sa.String()), nullable=False, server_default='{}'),
        sa.Column('featured', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('github_url', sa.String(length=500), nullable=True),
        sa.Column('live_url', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_projects_featured', 'projects', ['featured'], postgresql_where=sa.text('featured = TRUE'))
    op.create_unique_constraint('uq_projects_slug', 'projects', ['slug'])
    op.create_index('idx_projects_created_at', 'projects', ['created_at'], postgresql_ops={'created_at': 'DESC'})
    
    # Create services table
    op.create_table('services',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('pricing', sa.String(length=200), nullable=True),
        sa.Column('icon_url', sa.String(length=500), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_services_name', 'services', ['name'])
    
    # Create contacts table
    op.create_table('contacts',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('subject', sa.String(length=500), nullable=False),
        sa.Column('message', sa.Text(), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_contacts_created_at', 'contacts', ['created_at'], postgresql_ops={'created_at': 'DESC'})
    op.create_index('idx_contacts_email', 'contacts', ['email'])
    
    # Create images table
    op.create_table('images',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('alt_text', sa.String(length=200), nullable=True),
        sa.Column('entity_type', sa.String(length=20), nullable=False),
        sa.Column('entity_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('project_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('service_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.CheckConstraint("entity_type IN ('project', 'service')", name='check_entity_type'),
        sa.ForeignKeyConstraint(['project_id'], ['projects.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['service_id'], ['services.id'], ondelete='CASCADE')
    )
    op.create_index('idx_images_entity', 'images', ['entity_type', 'entity_id'])
    op.create_index('idx_images_created_at', 'images', ['created_at'], postgresql_ops={'created_at': 'DESC'})
    
    # Create admin_users table
    op.create_table('admin_users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('created_at', sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('idx_admin_users_email', 'admin_users', ['email'], unique=True)
    
    # Create trigger function for updated_at
    op.execute("""
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    """)
    
    # Apply triggers to all tables
    op.execute("""
        CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    """)
    op.execute("""
        CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    """)
    op.execute("""
        CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    """)
    op.execute("""
        CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON images
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    """)
    op.execute("""
        CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
        FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()
    """)


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table('admin_users')
    op.drop_table('images')
    op.drop_table('contacts')
    op.drop_table('services')
    op.drop_table('projects')
    
    # Drop trigger function
    op.execute('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE')
    
    # Drop UUID extension
    op.execute('DROP EXTENSION IF EXISTS "uuid-ossp"')
