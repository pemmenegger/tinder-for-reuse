###################################################################
# IMPORTANT: Keep in sync with frontend/types/building-element.ts #
###################################################################

from typing import List, Optional

from app.schemas.item_schema import ItemRead
from app.shared.schemas.item_schema import ItemCreate
from app.shared.schemas.type_schema import TypeRead
from pydantic import BaseModel
from sqlmodel import Field, SQLModel


class BuildingElementBase(SQLModel):
    quantity: float
    total_mass_kg: Optional[float] = Field(default=None)
    total_volume_m3: Optional[float] = Field(default=None)
    l: Optional[float] = Field(default=None)
    L: Optional[float] = Field(default=None)
    diameter: Optional[float] = Field(default=None)
    H: Optional[float] = Field(default=None)
    P: Optional[float] = Field(default=None)
    E: Optional[float] = Field(default=None)
    localization: Optional[str] = Field(default=None)
    condition: Optional[str] = Field(default=None)
    reuse_potential: Optional[str] = Field(default=None)
    drop_off_procedures: Optional[str] = Field(default=None)
    storage_method: Optional[str] = Field(default=None)

    category_type: str
    unit_type: str
    constitution_types: List[str]
    material_types: List[str]


class BuildingElementCreate(BuildingElementBase):
    item: ItemCreate


class BuildingElementRead(BuildingElementBase):
    id: int
    item: ItemRead

    @classmethod
    def from_building_element(cls, building_element):
        return cls(
            id=building_element.id,
            quantity=building_element.quantity,
            total_mass_kg=building_element.total_mass_kg,
            total_volume_m3=building_element.total_volume_m3,
            l=building_element.l,
            L=building_element.L,
            diameter=building_element.diameter,
            H=building_element.H,
            P=building_element.P,
            E=building_element.E,
            localization=building_element.localization,
            condition=building_element.condition,
            reuse_potential=building_element.reuse_potential,
            drop_off_procedures=building_element.drop_off_procedures,
            storage_method=building_element.storage_method,
            category_type=building_element.category_type.name,
            unit_type=building_element.unit_type.name,
            constitution_types=[constitution_type.name for constitution_type in building_element.constitution_types],
            material_types=[material_type.name for material_type in building_element.material_types],
            item=ItemRead.from_item(building_element.item),
        )


class BuildingElementFilterOptions(BaseModel):
    unit_types: List[TypeRead]
    category_types: List[TypeRead]
    constitution_types: List[TypeRead]
    material_types: List[TypeRead]


class BuildingElementSearchRequest(BaseModel):
    class Query(BaseModel):
        text: str

    class Filter(BaseModel):
        unit_type_ids: List[int]
        category_type_ids: List[int]
        constitution_type_ids: List[int]
        material_type_ids: List[int]

    query: Query
    filter: Filter


class BuildingElementSearchResponse(BaseModel):
    results: List[BuildingElementRead]
    hasMore: bool
