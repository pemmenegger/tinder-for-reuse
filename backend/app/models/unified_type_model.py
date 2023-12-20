from typing import List, Optional

from app.models.building_element_model import (
    BuildingElement,
    BuildingElementToBuildingElementUnitType,
    BuildingElementToBuildingElementWorksheetType,
    BuildingElementToHealthStatusType,
    BuildingElementToMaterialType,
    BuildingElementToRecyclingPotentialType,
    BuildingElementToReusePotentialType,
    BuildingElementToWasteCodeType,
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
    building_element_worksheet_type: List[BuildingElement] = Relationship(
        back_populates="worksheet_type", link_model=BuildingElementToBuildingElementWorksheetType
    )
    building_element_unit_type: List[BuildingElement] = Relationship(
        back_populates="unit_type", link_model=BuildingElementToBuildingElementUnitType
    )
    building_element_material_type: List[BuildingElement] = Relationship(
        back_populates="material_type", link_model=BuildingElementToMaterialType
    )
    building_element_health_status_type: List[BuildingElement] = Relationship(
        back_populates="health_status_type", link_model=BuildingElementToHealthStatusType
    )
    building_element_reuse_potential_type: List[BuildingElement] = Relationship(
        back_populates="reuse_potential_type", link_model=BuildingElementToReusePotentialType
    )
    building_element_waste_code_type: List[BuildingElement] = Relationship(
        back_populates="waste_code_type", link_model=BuildingElementToWasteCodeType
    )
    building_element_recycling_potential_type: List[BuildingElement] = Relationship(
        back_populates="recycling_potential_type", link_model=BuildingElementToRecyclingPotentialType
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
