from typing import List

from app.models.collector_model import (
    Collector,
    CollectorAuthorizedVehicleType,
    CollectorCollectionType,
    CollectorMaterialRecoveryType,
)
from app.schemas.collector_schema import (
    CollectorFilterOptions,
    CollectorSearchRequest,
    CollectorSearchResponse,
)
from app.shared.schemas.collector_schema import CollectorCreate, CollectorRead
from app.utils.database import get_session, read_type_by_name, read_types
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlmodel import select

router = APIRouter()


@router.post("/")
def create_collectors(
    payload: List[CollectorCreate],
    session: Session = Depends(get_session),
):
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No collectors found in payload")

    collectors_to_create = []
    for collector_create in payload:
        collection_types = []
        authorized_vehicle_types = []
        material_recovery_types = []

        for collection_type in collector_create.collection_types:
            collection_type = read_type_by_name(session, CollectorCollectionType, collection_type)
            if not collection_type:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Collection type {collection_type} does not exist",
                )
            collection_types.append(collection_type)

        for authorized_vehicle_type in collector_create.authorized_vehicle_types:
            authorized_vehicle_type = read_type_by_name(
                session, CollectorAuthorizedVehicleType, authorized_vehicle_type
            )
            if not authorized_vehicle_type:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Authorized vehicle type {authorized_vehicle_type} does not exist",
                )
            authorized_vehicle_types.append(authorized_vehicle_type)

        for material_recovery_type in collector_create.material_recovery_types:
            material_recovery_type = read_type_by_name(session, CollectorMaterialRecoveryType, material_recovery_type)
            if not material_recovery_type:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Material recovery type {material_recovery_type} does not exist",
                )
            material_recovery_types.append(material_recovery_type)

        collector = Collector(
            **collector_create.dict(
                exclude_unset=True,
                exclude={"collection_types", "authorized_vehicle_types", "material_recovery_types"},
            ),
            collection_types=collection_types,
            authorized_vehicle_types=authorized_vehicle_types,
            material_recovery_types=material_recovery_types,
        )
        collectors_to_create.append(collector)

    session.add_all(collectors_to_create)
    session.commit()

    return [collector.dict() for collector in collectors_to_create]


@router.get("/")
def fetch_collectors(
    session: Session = Depends(get_session),
):
    query = select(Collector).options(joinedload(Collector.collection_types))
    results = session.execute(query)
    collectors_read = [CollectorRead.from_collector(collector) for collector in results.scalars().unique()]
    return collectors_read


@router.get("/filter/", response_model=CollectorFilterOptions)
def read_filter_options(session: Session = Depends(get_session)):
    collection_types = read_types(session, CollectorCollectionType)
    authorized_vehicle_types = read_types(session, CollectorAuthorizedVehicleType)
    material_recovery_types = read_types(session, CollectorMaterialRecoveryType)
    return CollectorFilterOptions(
        collection_types=collection_types,
        authorized_vehicle_types=authorized_vehicle_types,
        material_recovery_types=material_recovery_types,
    )


@router.post("/search", response_model=CollectorSearchResponse)
def search(payload: CollectorSearchRequest, session: Session = Depends(get_session)):
    text = payload.query.text if len(payload.query.text) > 0 else None
    collection_type_ids = payload.filter.collection_type_ids
    authorized_vehicle_type_ids = payload.filter.authorized_vehicle_type_ids
    material_recovery_type_ids = payload.filter.material_recovery_type_ids

    query = select(Collector).options(joinedload(Collector.collection_types))

    if text:
        query = query.where(Collector.name.ilike(f"%{text}%"))

    if collection_type_ids:
        query = query.where(Collector.collection_types.any(CollectorCollectionType.id.in_(collection_type_ids)))
    if authorized_vehicle_type_ids:
        query = query.where(
            Collector.authorized_vehicle_types.any(CollectorAuthorizedVehicleType.id.in_(authorized_vehicle_type_ids))
        )
    if material_recovery_type_ids:
        query = query.where(
            Collector.material_recovery_types.any(CollectorMaterialRecoveryType.id.in_(material_recovery_type_ids))
        )

    query = query.order_by(Collector.name.asc())
    results = session.execute(query)

    collectors_read = [CollectorRead.from_collector(collector) for collector in results.scalars().unique()]
    return CollectorSearchResponse(
        results=collectors_read,
        hasMore=False,
    )
