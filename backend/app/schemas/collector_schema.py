###################################################################
# IMPORTANT: Keep in sync with frontend/types/collector.ts        #
###################################################################

from typing import List

from app.shared.schemas.collector_schema import CollectorRead
from app.shared.schemas.type_schema import TypeRead
from pydantic import BaseModel


class CollectorFilterOptions(BaseModel):
    collection_types: List[TypeRead]
    authorized_vehicle_types: List[TypeRead]
    material_recovery_types: List[TypeRead]


class CollectorSearchRequest(BaseModel):
    class Query(BaseModel):
        text: str

    class Filter(BaseModel):
        collection_type_ids: List[int]
        authorized_vehicle_type_ids: List[int]
        material_recovery_type_ids: List[int]

    query: Query
    filter: Filter


class CollectorSearchResponse(BaseModel):
    results: List[CollectorRead]
    hasMore: bool
