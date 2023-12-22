from typing import TYPE_CHECKING, List

from app.models._base_model import RondasBase
from app.schemas.collector_schema import CollectorBase
from sqlmodel import Field, Relationship, SQLModel

# avoid circular imports
if TYPE_CHECKING:
    from app.models.unified_type_model import UnifiedType


class CollectorToTypeBase(SQLModel):
    collector_id: int = Field(default=None, foreign_key="collector.id", primary_key=True)
    unified_type_id: int = Field(default=None, foreign_key="unified_type.id", primary_key=True)


class CollectorToMaterialType(CollectorToTypeBase, table=True):
    __tablename__ = "collector_to_material_type"


class CollectorToWasteCodeType(CollectorToTypeBase, table=True):
    __tablename__ = "collector_to_waste_code_type"


class CollectorToAuthorizedVehicleType(CollectorToTypeBase, table=True):
    __tablename__ = "collector_to_authorized_vehicle_type"


class CollectorToCircularStrategyType(CollectorToTypeBase, table=True):
    __tablename__ = "collector_to_circular_strategy_type"


class Collector(CollectorBase, RondasBase, table=True):
    __tablename__ = "collector"

    material_types: List["UnifiedType"] = Relationship(
        back_populates="collector_material_types",
        link_model=CollectorToMaterialType,
    )
    waste_code_types: List["UnifiedType"] = Relationship(
        back_populates="collector_waste_code_types",
        link_model=CollectorToWasteCodeType,
    )
    authorized_vehicle_types: List["UnifiedType"] = Relationship(
        back_populates="collector_authorized_vehicle_types",
        link_model=CollectorToAuthorizedVehicleType,
    )
    circular_strategy_types: List["UnifiedType"] = Relationship(
        back_populates="collector_circular_strategy_types",
        link_model=CollectorToCircularStrategyType,
    )
