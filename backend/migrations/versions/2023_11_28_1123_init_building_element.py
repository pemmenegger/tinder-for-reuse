"""init_building_element

Revision ID: 5eaff17eaece
Revises: 96dd039a5c9f
Create Date: 2023-11-28 11:23:52.607263

"""
import sqlalchemy as sa  # noqa: F401
import sqlmodel  # noqa: F401
from alembic import op

# revision identifiers, used by Alembic.
revision = "5eaff17eaece"
down_revision = "96dd039a5c9f"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "building_element_category_type",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_building_element_category_type_name"), "building_element_category_type", ["name"], unique=True
    )
    op.create_table(
        "building_element_constitution_type",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_building_element_constitution_type_name"), "building_element_constitution_type", ["name"], unique=True
    )
    op.create_table(
        "building_element_material_type",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_building_element_material_type_name"), "building_element_material_type", ["name"], unique=True
    )
    building_element_unit_type_table = op.create_table(
        "building_element_unit_type",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_building_element_unit_type_name"), "building_element_unit_type", ["name"], unique=True)
    op.bulk_insert(
        building_element_unit_type_table,
        [
            {"id": 1, "name": "ml"},
            {"id": 2, "name": "m²"},
            {"id": 3, "name": "m³"},
            {"id": 4, "name": "U"},
            {"id": 5, "name": "ens"},
        ],
    )
    item_category_type_table = op.create_table(
        "item_category_type",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_item_category_type_name"), "item_category_type", ["name"], unique=True)
    op.bulk_insert(
        item_category_type_table,
        [
            {"id": 1, "name": "Building Element"},
        ],
    )
    op.create_table(
        "item",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("description", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column(
            "created_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False
        ),
        sa.Column(
            "updated_at", sa.TIMESTAMP(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False
        ),
        sa.Column("category_type_id", sa.Integer(), nullable=False),
        sa.Column("account_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(
            ["account_id"],
            ["account.id"],
        ),
        sa.ForeignKeyConstraint(
            ["category_type_id"],
            ["item_category_type.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "building_element",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("item_id", sa.Integer(), nullable=True),
        sa.Column("quantity", sa.Float(), nullable=False),
        sa.Column("total_mass_kg", sa.Float(), nullable=True),
        sa.Column("total_volume_m3", sa.Float(), nullable=True),
        sa.Column("l", sa.Float(), nullable=True),
        sa.Column("L", sa.Float(), nullable=True),
        sa.Column("diameter", sa.Float(), nullable=True),
        sa.Column("H", sa.Float(), nullable=True),
        sa.Column("P", sa.Float(), nullable=True),
        sa.Column("E", sa.Float(), nullable=True),
        sa.Column("localization", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("condition", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("reuse_potential", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("drop_off_procedures", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("storage_method", sqlmodel.sql.sqltypes.AutoString(), nullable=True),
        sa.Column("category_type_id", sa.Integer(), nullable=False),
        sa.Column("unit_type_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["category_type_id"],
            ["building_element_category_type.id"],
        ),
        sa.ForeignKeyConstraint(
            ["item_id"],
            ["item.id"],
        ),
        sa.ForeignKeyConstraint(
            ["unit_type_id"],
            ["building_element_unit_type.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_building_element_item_id"), "building_element", ["item_id"], unique=True)
    op.create_table(
        "item_image",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("item_id", sa.Integer(), nullable=False),
        sa.Column("url", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("is_best", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(
            ["item_id"],
            ["item.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("url"),
    )
    op.create_table(
        "building_element_to_building_element_constitution_type",
        sa.Column("building_element_id", sa.Integer(), nullable=False),
        sa.Column("building_element_constitution_type_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["building_element_constitution_type_id"],
            ["building_element_constitution_type.id"],
        ),
        sa.ForeignKeyConstraint(
            ["building_element_id"],
            ["building_element.id"],
        ),
        sa.PrimaryKeyConstraint("building_element_id", "building_element_constitution_type_id"),
    )
    op.create_table(
        "building_element_to_building_element_material_type",
        sa.Column("building_element_id", sa.Integer(), nullable=False),
        sa.Column("building_element_material_type_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["building_element_id"],
            ["building_element.id"],
        ),
        sa.ForeignKeyConstraint(
            ["building_element_material_type_id"],
            ["building_element_material_type.id"],
        ),
        sa.PrimaryKeyConstraint("building_element_id", "building_element_material_type_id"),
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("building_element_to_building_element_material_type")
    op.drop_table("building_element_to_building_element_constitution_type")
    op.drop_table("item_image")
    op.drop_index(op.f("ix_building_element_item_id"), table_name="building_element")
    op.drop_table("building_element")
    op.drop_table("item")
    op.drop_index(op.f("ix_item_category_type_name"), table_name="item_category_type")
    op.drop_table("item_category_type")
    op.drop_index(op.f("ix_building_element_unit_type_name"), table_name="building_element_unit_type")
    op.drop_table("building_element_unit_type")
    op.drop_index(op.f("ix_building_element_material_type_name"), table_name="building_element_material_type")
    op.drop_table("building_element_material_type")
    op.drop_index(op.f("ix_building_element_constitution_type_name"), table_name="building_element_constitution_type")
    op.drop_table("building_element_constitution_type")
    op.drop_index(op.f("ix_building_element_category_type_name"), table_name="building_element_category_type")
    op.drop_table("building_element_category_type")
    # ### end Alembic commands ###
