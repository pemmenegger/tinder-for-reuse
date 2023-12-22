###################################################################
# IMPORTANT: Keep in sync with frontend/types/api/collector.ts    #
###################################################################

from typing import List, Optional

from app.schemas.type_schema import UnifiedTypeRead
from pydantic import BaseModel
from sqlmodel import SQLModel


class CollectorBase(SQLModel):
    name: str
    address: str
    zip_code: str
    city: str
    latitude: float
    longitude: float
    email: Optional[str]
    phone: Optional[str]

    material_types: List[str]
    waste_code_types: List[str]
    authorized_vehicle_types: List[str]
    circular_strategy_types: List[str]


class CollectorCreate(CollectorBase):
    pass


class CollectorRead(CollectorBase):
    id: int

    @classmethod
    def from_collector(cls, collector):
        return cls(
            **collector.dict(
                exclude_unset=False,
                exclude={"material_types", "waste_code_types", "authorized_vehicle_types", "circular_strategy_types"},
            ),
            material_types=[material_type.type_label for material_type in collector.material_types],
            waste_code_types=[waste_code_type.type_label for waste_code_type in collector.waste_code_types],
            authorized_vehicle_types=[
                authorized_vehicle_type.type_label for authorized_vehicle_type in collector.authorized_vehicle_types
            ],
            circular_strategy_types=[
                circular_strategy_type.type_label for circular_strategy_type in collector.circular_strategy_types
            ],
        )


class CollectorFilterOptions(BaseModel):
    material_types: List[UnifiedTypeRead]
    waste_code_types: List[UnifiedTypeRead]
    authorized_vehicle_types: List[UnifiedTypeRead]
    circular_strategy_types: List[UnifiedTypeRead]


class CollectorSearchRequest(BaseModel):
    class Query(BaseModel):
        text: str

    class Filter(BaseModel):
        material_type_ids: List[int]
        waste_code_type_ids: List[int]
        authorized_vehicle_type_ids: List[int]
        circular_strategy_type_ids: List[int]

    query: Query
    filter: Filter
