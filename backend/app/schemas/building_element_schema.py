###################################################################
# IMPORTANT: Keep in sync with frontend/types/building-element.ts #
###################################################################

from typing import List, Optional

from app.shared.schemas.collector_schema import CollectorRead
from app.shared.schemas.type_schema import UnifiedTypeRead
from pydantic import BaseModel
from sqlmodel import SQLModel


class BuildingElementBase(SQLModel):
    upload_uuid: str
    address: str
    latitude: float
    longitude: float

    worksheet_type: str
    category_type: str

    reference: Optional[str]
    title: str
    unit_type: str
    total: Optional[float]
    total_mass_t: Optional[float]
    total_volume_m3: Optional[float]
    material_types: Optional[List[str]]
    health_status_types: Optional[List[str]]
    reuse_potential_types: Optional[List[str]]
    waste_code_types: Optional[List[str]]
    recycling_code_types: Optional[List[str]]
    has_energy_recovery: Optional[bool]
    has_elimination: Optional[bool]


class BuildingElementCreate(BuildingElementBase):
    pass


class BuildingElementRead(BuildingElementBase):
    id: int

    @classmethod
    def from_building_element(cls, building_element):
        return BuildingElementRead(
            **building_element.dict(
                exclude_unset=False,
                exclude={"category_type", "unit_type", "constitution_types", "material_types"},
            ),
            category_type=building_element.category_type.name,
            unit_type=building_element.unit_type.name,
            constitution_types=[constitution_type.name for constitution_type in building_element.constitution_types],
            material_types=[material_type.name for material_type in building_element.material_types],
        )


class BuildingElementFilterOptions(BaseModel):
    unit_types: List[UnifiedTypeRead]
    category_types: List[UnifiedTypeRead]
    material_types: List[UnifiedTypeRead]


class BuildingElementSearchRequest(BaseModel):
    class Query(BaseModel):
        text: str

    class Filter(BaseModel):
        unit_type_ids: List[int]
        category_type_ids: List[int]
        material_type_ids: List[int]

    query: Query
    filter: Filter


class BuildingElementSearchResponse(BaseModel):
    results: List[BuildingElementRead]


class BuildingElementMatchesResponse(BaseModel):
    class BuildingElementMatchesRead(BaseModel):
        building_elements_read: List[BuildingElementRead]
        collectors_read: List[CollectorRead]

    results: List[BuildingElementMatchesRead]
