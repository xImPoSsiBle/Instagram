"""add media_type column to posts

Revision ID: ff7bc39d283b
Revises: 
Create Date: 2026-01-25 21:35:35.271529

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ff7bc39d283b'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    
    op.add_column(
        'posts',
        sa.Column('media_type', sa.String(), nullable=False, server_default='image')
    )


def downgrade() -> None:
    """Downgrade schema."""

    op.drop_column('posts', 'media_type')
