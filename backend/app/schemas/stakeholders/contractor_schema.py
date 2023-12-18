##########################################################
# IMPORTANT: Keep in sync with frontend/types
##########################################################

from typing import List, Optional

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


class ContractorCreate(ContractorBase):
    pass


class ContractorRead(ContractorBase):
    id: int

    @classmethod
    def from_contractor(cls, contractor):
        return cls(
            **contractor.dict(
                exclude_unset=False,
                exclude={"material_types", "waste_code_types"},
            ),
            material_types=[material_type.name for material_type in contractor.material_types],
            waste_code_types=[waste_code_type.name for waste_code_type in contractor.waste_code_types],
        )
