###################################################################
# IMPORTANT: Keep in sync with frontend/types/collector.ts        #
###################################################################

from typing import List

from app.shared.schemas.type_schema import UnifiedTypeRead
from pydantic import BaseModel


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
