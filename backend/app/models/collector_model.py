from typing import TYPE_CHECKING, List

from app.models._base_model import RondasBase
from app.shared.schemas.collector_schema import CollectorBase
from app.shared.types import (
    AuthorizedVehicleType,
    CircularStrategyType,
    MaterialType,
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


class CollectorToTypeBase(SQLModel):
    collector_id: int = Field(default=None, foreign_key="collector.id")
    unified_type_id: int = Field(default=None)
    unified_type_discriminator: str = Field(default=None)

    @classmethod
    def get_table_args(self):
        return (
            ForeignKeyConstraint(
                ["unified_type_id", "unified_type_discriminator"], ["unified_type.id", "unified_type.discriminator"]
            ),
            PrimaryKeyConstraint("collector_id", "unified_type_id", "unified_type_discriminator"),
        )


class CollectorToMaterialType(CollectorToTypeBase, table=True):
    __tablename__ = "collector_to_material_type"
    __table_args__ = CollectorToTypeBase.get_table_args()


class CollectorToWasteCodeType(CollectorToTypeBase, table=True):
    __tablename__ = "collector_to_waste_code_type"
    __table_args__ = CollectorToTypeBase.get_table_args()


class CollectorToAuthorizedVehicleType(CollectorToTypeBase, table=True):
    __tablename__ = "collector_to_authorized_vehicle_type"
    __table_args__ = CollectorToTypeBase.get_table_args()


class CollectorToCircularStrategyType(CollectorToTypeBase, table=True):
    __tablename__ = "collector_to_circular_strategy_type"
    __table_args__ = CollectorToTypeBase.get_table_args()


class Collector(CollectorBase, RondasBase, table=True):
    __tablename__ = "collector"

    def _relationship_definition(back_populates, type_class, link_model):
        return Relationship(
            back_populates=back_populates,
            link_model=link_model,
            sa_relationship_kwargs={
                "primaryjoin": f"and_(Collector.id == {link_model.__name__}.collector_id, {link_model.__name__}.unified_type_discriminator == '{type_class.DISCRIMINATOR}')"  # noqa: E501
            },
        )

    material_types: List["UnifiedType"] = _relationship_definition(
        "collector_material_types", MaterialType, CollectorToMaterialType
    )
    waste_code_types: List["UnifiedType"] = _relationship_definition(
        "collector_waste_code_types", WasteCodeType, CollectorToWasteCodeType
    )
    authorized_vehicle_types: List["UnifiedType"] = _relationship_definition(
        "collector_authorized_vehicle_types", AuthorizedVehicleType, CollectorToAuthorizedVehicleType
    )
    circular_strategy_types: List["UnifiedType"] = _relationship_definition(
        "collector_circular_strategy_types", CircularStrategyType, CollectorToCircularStrategyType
    )
