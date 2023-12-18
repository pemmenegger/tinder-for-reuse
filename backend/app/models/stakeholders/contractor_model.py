from typing import TYPE_CHECKING, List

from app.models._base_model import RondasBase
from app.schemas.stakeholders.contractor_schema import ContractorBase
from sqlmodel import Field, Relationship, SQLModel

# avoid circular imports
if TYPE_CHECKING:
    from app.models.type_model import MaterialType, WasteCodeType


class ContractorToMaterialType(SQLModel, table=True):
    __tablename__ = "contractor_to_material_type"

    contractor_id: int = Field(default=None, foreign_key="contractor.id", primary_key=True)
    material_type_id: int = Field(default=None, foreign_key="material_type.id", primary_key=True)


class ContractorToWasteCodeType(SQLModel, table=True):
    __tablename__ = "contractor_to_waste_code_type"

    contractor_id: int = Field(default=None, foreign_key="contractor.id", primary_key=True)
    waste_code_type_id: int = Field(default=None, foreign_key="waste_code_type.id", primary_key=True)


class Contractor(ContractorBase, RondasBase, table=True):
    __tablename__ = "contractor"

    material_types: List["MaterialType"] = Relationship(
        back_populates="contractors",
        link_model=ContractorToMaterialType,
    )
    waste_code_types: List["WasteCodeType"] = Relationship(
        back_populates="contractors",
        link_model=ContractorToWasteCodeType,
    )
