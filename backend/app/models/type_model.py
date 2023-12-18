from typing import List

from app.models._base_model import RondasTypeBase
from app.models.stakeholders.collector_model import (
    Collector,
    CollectorToAuthorizedVehicleType,
    CollectorToCircularStrategyType,
    CollectorToMaterialType,
    CollectorToWasteCodeType,
)
from app.models.stakeholders.contractor_model import (
    Contractor,
    ContractorToMaterialType,
    ContractorToWasteCodeType,
)
from app.shared.schemas.type_schema import TypeBase
from sqlmodel import Relationship


class MaterialType(TypeBase, RondasTypeBase, table=True):
    __tablename__ = "material_type"

    collectors: List[Collector] = Relationship(back_populates="material_types", link_model=CollectorToMaterialType)
    contractors: List[Contractor] = Relationship(back_populates="material_types", link_model=ContractorToMaterialType)


class AuthorizedVehicleType(TypeBase, RondasTypeBase, table=True):
    __tablename__ = "authorized_vehicle_type"

    collectors: List[Collector] = Relationship(
        back_populates="authorized_vehicle_types", link_model=CollectorToAuthorizedVehicleType
    )


class CircularStrategyType(TypeBase, RondasTypeBase, table=True):
    __tablename__ = "circular_strategy_type"

    collectors: List[Collector] = Relationship(
        back_populates="circular_strategy_types", link_model=CollectorToCircularStrategyType
    )


class WasteCodeType(TypeBase, RondasTypeBase, table=True):
    __tablename__ = "waste_code_type"

    collectors: List[Collector] = Relationship(back_populates="waste_code_types", link_model=CollectorToWasteCodeType)
    contractors: List[Contractor] = Relationship(
        back_populates="waste_code_types", link_model=ContractorToWasteCodeType
    )
