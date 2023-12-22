from typing import List, Optional

from app.models.building_element_model import BuildingElement
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
from app.schemas.type_schema import UnifiedTypeBase
from sqlmodel import Field, Relationship


class UnifiedType(UnifiedTypeBase, table=True):
    __tablename__ = "unified_type"

    id: Optional[int] = Field(default=None, primary_key=True)

    # BuildingElement
    building_element_worksheet_type: List[BuildingElement] = Relationship(
        back_populates="worksheet_type",
        sa_relationship_kwargs={"foreign_keys": "[BuildingElement.worksheet_type_id]"},
    )
    building_element_unit_type: List[BuildingElement] = Relationship(
        back_populates="unit_type",
        sa_relationship_kwargs={"foreign_keys": "[BuildingElement.unit_type_id]"},
    )
    building_element_material_type: List[BuildingElement] = Relationship(
        back_populates="material_type",
        sa_relationship_kwargs={"foreign_keys": "[BuildingElement.material_type_id]"},
    )
    building_element_health_status_type: List[BuildingElement] = Relationship(
        back_populates="health_status_type",
        sa_relationship_kwargs={"foreign_keys": "[BuildingElement.health_status_type_id]"},
    )
    building_element_reuse_potential_type: List[BuildingElement] = Relationship(
        back_populates="reuse_potential_type",
        sa_relationship_kwargs={"foreign_keys": "[BuildingElement.reuse_potential_type_id]"},
    )
    building_element_waste_code_type: List[BuildingElement] = Relationship(
        back_populates="waste_code_type",
        sa_relationship_kwargs={"foreign_keys": "[BuildingElement.waste_code_type_id]"},
    )
    building_element_recycling_potential_type: List[BuildingElement] = Relationship(
        back_populates="recycling_potential_type",
        sa_relationship_kwargs={"foreign_keys": "[BuildingElement.recycling_potential_type_id]"},
    )
    building_element_circular_service_needed: List[BuildingElement] = Relationship(
        back_populates="circular_service_needed",
        sa_relationship_kwargs={"foreign_keys": "[BuildingElement.circular_service_needed_id]"},
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
