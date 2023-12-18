##########################################################
# IMPORTANT: Keep in sync with frontend/types
##########################################################

from typing import List, Optional

from sqlmodel import SQLModel


class CollectorBase(SQLModel):
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
                exclude={"material_types", "authorized_vehicle_types", "circular_strategy_types"},
            ),
            material_types=[material_type.name for material_type in collector.material_types],
            authorized_vehicle_types=[
                authorized_vehicle_type.name for authorized_vehicle_type in collector.authorized_vehicle_types
            ],
            circular_strategy_types=[
                circular_strategy_type.name for circular_strategy_type in collector.circular_strategy_types
            ],
        )
