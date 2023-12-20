from typing import List, Optional

from app.models.building_element_model import (
    BuildingElement,
    BuildingElementToMaterialType,
)
from app.models.collector_model import (
    Collector,
    CollectorToAuthorizedVehicleType,
    CollectorToCircularStrategyType,
    CollectorToMaterialType,
    CollectorToWasteCodeType,
)
from app.models.contractor_model import (
    Contractor,
    ContractorToCircularServiceType,
    ContractorToMaterialType,
    ContractorToWasteCodeType,
)
from app.shared.schemas.type_schema import UnifiedTypeBase
from sqlmodel import Field, Relationship


class UnifiedType(UnifiedTypeBase, table=True):
    __tablename__ = "unified_type"

    id: Optional[int] = Field(default=None, primary_key=True)

    # BuildingElement
    building_element_material_types: List[BuildingElement] = Relationship(
        back_populates="material_types", link_model=BuildingElementToMaterialType
    )
    # Collector
    collector_material_types: List[Collector] = Relationship(
        back_populates="material_types", link_model=CollectorToMaterialType
    )
    collector_waste_code_types: List[Collector] = Relationship(
        back_populates="waste_code_types", link_model=CollectorToWasteCodeType
    )
    collector_authorized_vehicle_types: List[Collector] = Relationship(
        back_populates="authorized_vehicle_types", link_model=CollectorToAuthorizedVehicleType
    )
    collector_circular_strategy_types: List[Collector] = Relationship(
        back_populates="circular_strategy_types", link_model=CollectorToCircularStrategyType
    )
    # Contractor
    contractor_material_types: List[Contractor] = Relationship(
        back_populates="material_types", link_model=ContractorToMaterialType
    )
    contractor_waste_code_types: List[Contractor] = Relationship(
        back_populates="waste_code_types", link_model=ContractorToWasteCodeType
    )
    contractor_circular_service_types: List[Contractor] = Relationship(
        back_populates="circular_service_types", link_model=ContractorToCircularServiceType
    )
