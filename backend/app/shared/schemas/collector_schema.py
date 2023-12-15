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

    collection_types: List[str]
    authorized_vehicle_types: List[str]
    material_recovery_types: List[str]


class CollectorCreate(CollectorBase):
    pass


class CollectorRead(CollectorBase):
    id: int

    @classmethod
    def from_collector(cls, collector):
        return cls(
            **collector.dict(
                exclude_unset=False,
                exclude={"collection_types", "authorized_vehicle_types", "material_recovery_types"},
            ),
            collection_types=[collection_type.name for collection_type in collector.collection_types],
            authorized_vehicle_types=[
                authorized_vehicle_type.name for authorized_vehicle_type in collector.authorized_vehicle_types
            ],
            material_recovery_types=[
                material_recovery_type.name for material_recovery_type in collector.material_recovery_types
            ],
        )
