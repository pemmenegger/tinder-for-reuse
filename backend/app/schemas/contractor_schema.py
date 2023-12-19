##########################################################
# IMPORTANT: Keep in sync with frontend/types
##########################################################

from typing import List, Optional

from app.shared.schemas.type_schema import UnifiedTypeRead
from pydantic import BaseModel
from sqlmodel import SQLModel


class ContractorBase(SQLModel):
    name: str
    address: str
    zip_code: str
    city: str
    lat: float
    lng: float
    email: Optional[str]
    phone: Optional[str]

    material_types: List[str]
    waste_code_types: List[str]
    circular_service_types: List[str]


class ContractorCreate(ContractorBase):
    pass


class ContractorRead(ContractorBase):
    id: int

    @classmethod
    def from_contractor(cls, contractor):
        return cls(
            **contractor.dict(
                exclude_unset=False,
                exclude={"material_types", "waste_code_types", "circular_service_types"},
            ),
            material_types=[material_type.name for material_type in contractor.material_types],
            waste_code_types=[waste_code_type.name for waste_code_type in contractor.waste_code_types],
            circular_service_types=[
                circular_service_type.name for circular_service_type in contractor.circular_service_types
            ],
        )


class ContractorFilterOptions(BaseModel):
    material_types: List[UnifiedTypeRead]
    waste_code_types: List[UnifiedTypeRead]
    circular_service_types: List[UnifiedTypeRead]


class ContractorSearchRequest(BaseModel):
    class Query(BaseModel):
        text: str

    class Filter(BaseModel):
        material_type_ids: List[int]
        waste_code_type_ids: List[int]
        circular_service_type_ids: List[int]

    query: Query
    filter: Filter


class ContractorSearchResponse(BaseModel):
    results: List[ContractorRead]
    hasMore: bool
