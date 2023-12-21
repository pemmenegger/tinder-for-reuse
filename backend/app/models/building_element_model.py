from typing import TYPE_CHECKING, List, Optional

from app.models._base_model import RondasBase
from app.schemas.building_element_schema import (
    BuildingElementBase,
    BuildingElementUploadBase,
)
from app.shared.types import (
    BuildingElementUnitType,
    BuildingElementWorksheetType,
    HealthStatusType,
    MaterialType,
    RecyclingPotentialType,
    ReusePotentialType,
    WasteCodeType,
)
from sqlmodel import Field, Relationship

# avoid circular imports
if TYPE_CHECKING:
    from app.models.unified_type_model import UnifiedType


class BuildingElementUpload(BuildingElementUploadBase, RondasBase, table=True):
    __tablename__ = "building_element_upload"

    building_elements: List["BuildingElement"] = Relationship(back_populates="building_element_upload")


class BuildingElement(BuildingElementBase, RondasBase, table=True):
    __tablename__ = "building_element"

    building_element_upload_id: int = Field(foreign_key="building_element_upload.id")
    building_element_upload: BuildingElementUpload = Relationship(back_populates="building_elements")

    worksheet_type_id: int = Field(foreign_key="unified_type.id")
    unit_type_id: int = Field(foreign_key="unified_type.id")
    material_type_id: Optional[int] = Field(foreign_key="unified_type.id")
    health_status_type_id: Optional[int] = Field(foreign_key="unified_type.id")
    reuse_potential_type_id: Optional[int] = Field(foreign_key="unified_type.id")
    waste_code_type_id: Optional[int] = Field(foreign_key="unified_type.id")
    recycling_potential_type_id: Optional[int] = Field(foreign_key="unified_type.id")

    def _relationship_definition(back_populates, column_name, type_class):
        return Relationship(
            back_populates=back_populates,
            sa_relationship_kwargs={
                "primaryjoin": f"and_(BuildingElement.{column_name} == UnifiedType.id, UnifiedType.discriminator == '{type_class.DISCRIMINATOR}')",  # noqa: E501
            },
        )

    worksheet_type: "UnifiedType" = _relationship_definition(
        "building_element_worksheet_type", "worksheet_type_id", BuildingElementWorksheetType
    )
    unit_type: "UnifiedType" = _relationship_definition(
        "building_element_unit_type", "unit_type_id", BuildingElementUnitType
    )
    material_type: Optional["UnifiedType"] = _relationship_definition(
        "building_element_material_type", "material_type_id", MaterialType
    )
    health_status_type: Optional["UnifiedType"] = _relationship_definition(
        "building_element_health_status_type", "health_status_type_id", HealthStatusType
    )
    reuse_potential_type: Optional["UnifiedType"] = _relationship_definition(
        "building_element_reuse_potential_type", "reuse_potential_type_id", ReusePotentialType
    )
    waste_code_type: Optional["UnifiedType"] = _relationship_definition(
        "building_element_waste_code_type", "waste_code_type_id", WasteCodeType
    )
    recycling_potential_type: Optional["UnifiedType"] = _relationship_definition(
        "building_element_recycling_potential_type", "recycling_potential_type_id", RecyclingPotentialType
    )
