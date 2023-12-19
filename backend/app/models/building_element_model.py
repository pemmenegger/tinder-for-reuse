from typing import TYPE_CHECKING, List

from app.models._base_model import RondasBase
from app.schemas.building_element_schema import BuildingElementBase
from app.shared.types import MaterialType
from sqlmodel import (
    Field,
    ForeignKeyConstraint,
    PrimaryKeyConstraint,
    Relationship,
    SQLModel,
)

# avoid circular imports
if TYPE_CHECKING:
    from app.models.unified_type_model import UnifiedType


class BuildingElementToTypeBase(SQLModel):
    building_element_id: int = Field(default=None, foreign_key="building_element.id")
    unified_type_id: int = Field(default=None)
    unified_type_discriminator: str = Field(default=None)

    @classmethod
    def get_table_args(self):
        return (
            ForeignKeyConstraint(
                ["unified_type_id", "unified_type_discriminator"], ["unified_type.id", "unified_type.discriminator"]
            ),
            PrimaryKeyConstraint("building_element_id", "unified_type_id", "unified_type_discriminator"),
        )


class BuildingElementToMaterialType(BuildingElementToTypeBase, table=True):
    __tablename__ = "building_element_to_material_type"
    __table_args__ = BuildingElementToTypeBase.get_table_args()


class BuildingElement(BuildingElementBase, RondasBase, table=True):
    __tablename__ = "building_element"

    def _relationship_definition(back_populates, type_class, link_model):
        return Relationship(
            back_populates=back_populates,
            link_model=link_model,
            sa_relationship_kwargs={
                "primaryjoin": f"and_(BuildingElement.id == {link_model.__name__}.building_element_id, {link_model.__name__}.unified_type_discriminator == '{type_class.DISCRIMINATOR}')"  # noqa: E501
            },
        )

    material_types: List["UnifiedType"] = _relationship_definition(
        "building_element_material_types", MaterialType, BuildingElementToMaterialType
    )


# class BuildingElement(BuildingElementBase, RondasItemBase, table=True):
#     __tablename__ = "building_element"

#     category_type_id: int = Field(foreign_key="building_element_category_type.id")
#     category_type: BuildingElementCategoryType = Relationship(back_populates="building_elements")
#     unit_type_id: int = Field(foreign_key="building_element_unit_type.id")
#     unit_type: BuildingElementUnitType = Relationship(back_populates="building_elements")
#     constitution_types: List[BuildingElementConstitutionType] = Relationship(
#         back_populates="building_elements",
#         link_model=BuildingElementToBuildingElementConstitutionType,
#     )
#     material_types: List[BuildingElementMaterialType] = Relationship(
#         back_populates="building_elements",
#         link_model=BuildingElementToBuildingElementMaterialType,
#     )
