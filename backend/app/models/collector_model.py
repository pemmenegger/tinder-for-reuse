from typing import List

from app.models._base_model import RondasBase, RondasTypeBase
from app.shared.schemas.collector_schema import CollectorBase
from app.shared.schemas.type_schema import TypeBase
from sqlmodel import Field, Relationship, SQLModel


class CollectorToCollectorCollectionType(SQLModel, table=True):
    __tablename__ = "collector_to_collector_collection_type"

    collector_id: int = Field(default=None, foreign_key="collector.id", primary_key=True)
    collector_collection_type_id: int = Field(
        default=None, foreign_key="collector_collection_type.id", primary_key=True
    )


class CollectorCollectionType(TypeBase, RondasTypeBase, table=True):
    __tablename__ = "collector_collection_type"

    collectors: List["Collector"] = Relationship(
        back_populates="collection_types", link_model=CollectorToCollectorCollectionType
    )


class CollectorToCollectorAuthorizedVehicleType(SQLModel, table=True):
    __tablename__ = "collector_to_collector_authorized_vehicle_type"

    collector_id: int = Field(default=None, foreign_key="collector.id", primary_key=True)
    collector_authorized_vehicle_type_id: int = Field(
        default=None, foreign_key="collector_authorized_vehicle_type.id", primary_key=True
    )


class CollectorAuthorizedVehicleType(TypeBase, RondasTypeBase, table=True):
    __tablename__ = "collector_authorized_vehicle_type"

    collectors: List["Collector"] = Relationship(
        back_populates="authorized_vehicle_types", link_model=CollectorToCollectorAuthorizedVehicleType
    )


class CollectorToCollectorMaterialRecoveryType(SQLModel, table=True):
    __tablename__ = "collector_to_collector_material_recovery_type"

    collector_id: int = Field(default=None, foreign_key="collector.id", primary_key=True)
    collector_material_recovery_type_id: int = Field(
        default=None, foreign_key="collector_material_recovery_type.id", primary_key=True
    )


class CollectorMaterialRecoveryType(TypeBase, RondasTypeBase, table=True):
    __tablename__ = "collector_material_recovery_type"

    collectors: List["Collector"] = Relationship(
        back_populates="material_recovery_types", link_model=CollectorToCollectorMaterialRecoveryType
    )


class Collector(CollectorBase, RondasBase, table=True):
    __tablename__ = "collector"

    collection_types: List[CollectorCollectionType] = Relationship(
        back_populates="collectors",
        link_model=CollectorToCollectorCollectionType,
    )
    authorized_vehicle_types: List[CollectorAuthorizedVehicleType] = Relationship(
        back_populates="collectors",
        link_model=CollectorToCollectorAuthorizedVehicleType,
    )
    material_recovery_types: List[CollectorMaterialRecoveryType] = Relationship(
        back_populates="collectors",
        link_model=CollectorToCollectorMaterialRecoveryType,
    )
