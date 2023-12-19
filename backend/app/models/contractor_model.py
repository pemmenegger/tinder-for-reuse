from typing import TYPE_CHECKING, List

from app.models._base_model import RondasBase
from app.schemas.contractor_schema import ContractorBase
from app.shared.types import MaterialType, WasteCodeType
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


class ContractorToTypeBase(SQLModel):
    contractor_id: int = Field(default=None, foreign_key="contractor.id")
    unified_type_id: int = Field(default=None)
    unified_type_discriminator: str = Field(default=None)

    @classmethod
    def get_table_args(self):
        return (
            ForeignKeyConstraint(
                ["unified_type_id", "unified_type_discriminator"], ["unified_type.id", "unified_type.discriminator"]
            ),
            PrimaryKeyConstraint("contractor_id", "unified_type_id", "unified_type_discriminator"),
        )


class ContractorToMaterialType(ContractorToTypeBase, table=True):
    __tablename__ = "contractor_to_material_type"
    __table_args__ = ContractorToTypeBase.get_table_args()


class ContractorToWasteCodeType(ContractorToTypeBase, table=True):
    __tablename__ = "contractor_to_waste_code_type"
    __table_args__ = ContractorToTypeBase.get_table_args()


class Contractor(ContractorBase, RondasBase, table=True):
    __tablename__ = "contractor"

    def _relationship_definition(back_populates, type_class, link_model):
        return Relationship(
            back_populates=back_populates,
            link_model=link_model,
            sa_relationship_kwargs={
                "primaryjoin": f"and_(Contractor.id == {link_model.__name__}.contractor_id, {link_model.__name__}.unified_type_discriminator == '{type_class.DISCRIMINATOR}')"  # noqa: E501
            },
        )

    material_types: List["UnifiedType"] = _relationship_definition(
        "contractor_material_types", MaterialType, ContractorToMaterialType
    )
    waste_code_types: List["UnifiedType"] = _relationship_definition(
        "contractor_waste_code_types", WasteCodeType, ContractorToWasteCodeType
    )
