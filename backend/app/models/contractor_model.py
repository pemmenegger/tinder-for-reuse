from typing import TYPE_CHECKING, List

from app.models._base_model import RondasBase
from app.schemas.contractor_schema import ContractorBase
from sqlmodel import Field, Relationship, SQLModel

# avoid circular imports
if TYPE_CHECKING:
    from app.models.unified_type_model import UnifiedType


class ContractorToTypeBase(SQLModel):
    contractor_id: int = Field(default=None, foreign_key="contractor.id", primary_key=True)
    unified_type_id: int = Field(default=None, foreign_key="unified_type.id", primary_key=True)


class ContractorToMaterialType(ContractorToTypeBase, table=True):
    __tablename__ = "contractor_to_material_type"


class ContractorToWasteCodeType(ContractorToTypeBase, table=True):
    __tablename__ = "contractor_to_waste_code_type"


class ContractorToCircularServiceType(ContractorToTypeBase, table=True):
    __tablename__ = "contractor_to_circular_service_type"


class Contractor(ContractorBase, RondasBase, table=True):
    __tablename__ = "contractor"

    material_types: List["UnifiedType"] = Relationship(
        back_populates="contractor_material_types",
        link_model=ContractorToMaterialType,
    )
    waste_code_types: List["UnifiedType"] = Relationship(
        back_populates="contractor_waste_code_types",
        link_model=ContractorToWasteCodeType,
    )
    circular_service_types: List["UnifiedType"] = Relationship(
        back_populates="contractor_circular_service_types",
        link_model=ContractorToCircularServiceType,
    )
