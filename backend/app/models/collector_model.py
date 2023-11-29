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


class Collector(CollectorBase, RondasBase, table=True):
    __tablename__ = "collector"

    collection_types: List[CollectorCollectionType] = Relationship(
        back_populates="collectors",
        link_model=CollectorToCollectorCollectionType,
    )
