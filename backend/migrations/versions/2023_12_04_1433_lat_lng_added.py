"""lat_lng_added

Revision ID: 176db6ff5a87
Revises: 4b88da371ba9
Create Date: 2023-12-04 14:33:37.278051

"""
import sqlalchemy as sa  # noqa: F401
import sqlmodel  # noqa: F401
from alembic import op

# revision identifiers, used by Alembic.
revision = "176db6ff5a87"
down_revision = "4b88da371ba9"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column("building_element", sa.Column("lat", sa.Float(), nullable=True))
    op.add_column("building_element", sa.Column("lng", sa.Float(), nullable=True))
    op.add_column("building_element", sa.Column("upload_uuid", sqlmodel.sql.sqltypes.AutoString(), nullable=True))
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column("building_element", "upload_uuid")
    op.drop_column("building_element", "lng")
    op.drop_column("building_element", "lat")
    # ### end Alembic commands ###
