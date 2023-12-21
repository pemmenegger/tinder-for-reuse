###################################################################
# IMPORTANT: Keep in sync with frontend/types/building-element.ts #
###################################################################

from typing import List, Optional

from app.shared.schemas.type_schema import UnifiedTypeRead
from pydantic import BaseModel
from sqlmodel import SQLModel


class BuildingElementBase(SQLModel):
    worksheet_type: str
    category: str

    reference: str
    title: str
    unit_type: str

    total: Optional[float]
    total_mass_kg: Optional[float]
    total_volume_m3: Optional[float]
    material_type: Optional[str]
    health_status_type: Optional[str]
    reuse_potential_type: Optional[str]
    waste_code_type: Optional[str]
    recycling_potential_type: Optional[str]
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
                exclude={
                    "worksheet_type",
                    "unit_type",
                    "material_type",
                    "health_status_type",
                    "reuse_potential_type",
                    "waste_code_type",
                    "recycling_potential_type",
                },
            ),
            worksheet_type=building_element.worksheet_type.type_label,
            unit_type=building_element.unit_type.type_label,
            material_type=building_element.material_type.type_label if building_element.material_type else None,
            health_status_type=building_element.health_status_type.type_label
            if building_element.health_status_type
            else None,
            reuse_potential_type=building_element.reuse_potential_type.type_label
            if building_element.reuse_potential_type
            else None,
            waste_code_type=building_element.waste_code_type.type_label if building_element.waste_code_type else None,
            recycling_potential_type=building_element.recycling_potential_type.type_label
            if building_element.recycling_potential_type
            else None,
        )


class BuildingElementUploadBase(SQLModel):
    address: str
    latitude: float
    longitude: float


class BuildingElementUploadCreate(BuildingElementUploadBase):
    building_elements: List[BuildingElementCreate]


class BuildingElementUploadRead(BuildingElementUploadBase):
    id: int
    building_elements: List[BuildingElementCreate]

    @classmethod
    def from_building_element_upload(cls, building_element_upload):
        return BuildingElementUploadRead(
            **building_element_upload.dict(exclude_unset=False, exclude={"building_elements"}),
            building_elements=[
                BuildingElementRead.from_building_element(building_element)
                for building_element in building_element_upload.building_elements
            ],
        )


class BuildingElementFilterOptions(BaseModel):
    worksheet_types: List[UnifiedTypeRead]
    unit_types: List[UnifiedTypeRead]
    material_types: List[UnifiedTypeRead]
    health_status_types: List[UnifiedTypeRead]
    reuse_potential_types: List[UnifiedTypeRead]
    waste_code_types: List[UnifiedTypeRead]
    recycling_potential_types: List[UnifiedTypeRead]


class BuildingElementSearchRequest(BaseModel):
    class Query(BaseModel):
        text: str

    class Filter(BaseModel):
        worksheet_type_ids: List[int]
        unit_type_ids: List[int]
        material_type_ids: List[int]
        health_status_type_ids: List[int]
        reuse_potential_type_ids: List[int]
        waste_code_type_ids: List[int]
        recycling_potential_type_ids: List[int]

    query: Query
    filter: Filter
