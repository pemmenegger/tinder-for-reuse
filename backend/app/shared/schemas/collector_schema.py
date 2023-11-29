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


class CollectorCreate(CollectorBase):
    pass


class CollectorRead(CollectorBase):
    id: int

    @classmethod
    def from_collector(cls, collector):
        return cls(
            id=collector.id,
            name=collector.name,
            address=collector.address,
            zip_code=collector.zip_code,
            city=collector.city,
            lat=collector.lat,
            lng=collector.lng,
            email=collector.email,
            phone=collector.phone,
            collection_types=[collection_type.name for collection_type in collector.collection_types],
        )
