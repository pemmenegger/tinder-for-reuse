from typing import TYPE_CHECKING

from app.models._base_model import RondasBase
from app.schemas.building_element_schema import BuildingElementBase
from app.shared.types import (
    BuildingElementUnitType,
    BuildingElementWorksheetType,
    HealthStatusType,
    MaterialType,
    RecyclingPotentialType,
    ReusePotentialType,
    WasteCodeType,
)
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


class BuildingElementToBuildingElementWorksheetType(BuildingElementToTypeBase, table=True):
    __tablename__ = "building_element_to_building_element_worksheet_type"
    __table_args__ = BuildingElementToTypeBase.get_table_args()


class BuildingElementToBuildingElementUnitType(BuildingElementToTypeBase, table=True):
    __tablename__ = "building_element_to_building_element_unit_type"
    __table_args__ = BuildingElementToTypeBase.get_table_args()


class BuildingElementToHealthStatusType(BuildingElementToTypeBase, table=True):
    __tablename__ = "building_element_to_health_status_type"
    __table_args__ = BuildingElementToTypeBase.get_table_args()


class BuildingElementToReusePotentialType(BuildingElementToTypeBase, table=True):
    __tablename__ = "building_element_to_reuse_potential_type"
    __table_args__ = BuildingElementToTypeBase.get_table_args()


class BuildingElementToWasteCodeType(BuildingElementToTypeBase, table=True):
    __tablename__ = "building_element_to_waste_code_type"
    __table_args__ = BuildingElementToTypeBase.get_table_args()


class BuildingElementToRecyclingPotentialType(BuildingElementToTypeBase, table=True):
    __tablename__ = "building_element_to_recycling_potential_type"
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

    worksheet_type: "UnifiedType" = _relationship_definition(
        "building_element_worksheet_type", BuildingElementWorksheetType, BuildingElementToBuildingElementWorksheetType
    )
    unit_type: "UnifiedType" = _relationship_definition(
        "building_element_unit_type", BuildingElementUnitType, BuildingElementToBuildingElementUnitType
    )
    material_type: "UnifiedType" = _relationship_definition(
        "building_element_material_type", MaterialType, BuildingElementToMaterialType
    )
    health_status_type: "UnifiedType" = _relationship_definition(
        "building_element_health_status_type", HealthStatusType, BuildingElementToHealthStatusType
    )
    reuse_potential_type: "UnifiedType" = _relationship_definition(
        "building_element_reuse_potential_type", ReusePotentialType, BuildingElementToReusePotentialType
    )
    waste_code_type: "UnifiedType" = _relationship_definition(
        "building_element_waste_code_type", WasteCodeType, BuildingElementToWasteCodeType
    )
    recycling_potential_type: "UnifiedType" = _relationship_definition(
        "building_element_recycling_potential_type", RecyclingPotentialType, BuildingElementToRecyclingPotentialType
    )
