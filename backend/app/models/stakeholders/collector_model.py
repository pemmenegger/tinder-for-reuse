from typing import TYPE_CHECKING, List

from app.models._base_model import RondasBase
from app.shared.schemas.collector_schema import CollectorBase
from sqlmodel import Field, Relationship, SQLModel

# avoid circular imports
if TYPE_CHECKING:
    from app.models.type_model import (
        AuthorizedVehicleType,
        CircularStrategyType,
        MaterialType,
        WasteCodeType,
    )


class CollectorToMaterialType(SQLModel, table=True):
    __tablename__ = "collector_to_material_type"

    collector_id: int = Field(default=None, foreign_key="collector.id", primary_key=True)
    material_type_id: int = Field(default=None, foreign_key="material_type.id", primary_key=True)


class CollectorToWasteCodeType(SQLModel, table=True):
    __tablename__ = "collector_to_waste_code_type"

    collector_id: int = Field(default=None, foreign_key="collector.id", primary_key=True)
    waste_code_type_id: int = Field(default=None, foreign_key="waste_code_type.id", primary_key=True)


class CollectorToAuthorizedVehicleType(SQLModel, table=True):
    __tablename__ = "collector_to_authorized_vehicle_type"

    collector_id: int = Field(default=None, foreign_key="collector.id", primary_key=True)
    authorized_vehicle_type_id: int = Field(default=None, foreign_key="authorized_vehicle_type.id", primary_key=True)


class CollectorToCircularStrategyType(SQLModel, table=True):
    __tablename__ = "collector_to_circular_strategy_type"

    collector_id: int = Field(default=None, foreign_key="collector.id", primary_key=True)
    circular_strategy_type_id: int = Field(default=None, foreign_key="circular_strategy_type.id", primary_key=True)


class Collector(CollectorBase, RondasBase, table=True):
    __tablename__ = "collector"

    material_types: List["MaterialType"] = Relationship(
        back_populates="collectors",
        link_model=CollectorToMaterialType,
    )
    waste_code_types: List["WasteCodeType"] = Relationship(
        back_populates="collectors",
        link_model=CollectorToWasteCodeType,
    )
    authorized_vehicle_types: List["AuthorizedVehicleType"] = Relationship(
        back_populates="collectors",
        link_model=CollectorToAuthorizedVehicleType,
    )
    circular_strategy_types: List["CircularStrategyType"] = Relationship(
        back_populates="collectors",
        link_model=CollectorToCircularStrategyType,
    )
