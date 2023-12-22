from typing import List

from app.models.collector_model import (
    Collector,
    CollectorToAuthorizedVehicleType,
    CollectorToCircularStrategyType,
    CollectorToMaterialType,
    CollectorToWasteCodeType,
)
from app.models.unified_type_model import UnifiedType
from app.schemas.collector_schema import (
    CollectorCreate,
    CollectorFilterOptions,
    CollectorRead,
    CollectorSearchRequest,
)
from app.schemas.search_schema import SearchResponse
from app.types import (
    AuthorizedVehicleType,
    CircularStrategyType,
    MaterialType,
    WasteCodeType,
)
from app.utils.database import get_session, read_types, read_types_by_values_or_throw
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

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
        material_types = read_types_by_values_or_throw(session, MaterialType, collector_create.material_types)
        waste_code_types = read_types_by_values_or_throw(session, WasteCodeType, collector_create.waste_code_types)
        authorized_vehicle_types = read_types_by_values_or_throw(
            session, AuthorizedVehicleType, collector_create.authorized_vehicle_types
        )
        circular_strategy_types = read_types_by_values_or_throw(
            session, CircularStrategyType, collector_create.circular_strategy_types
        )

        collector = Collector(
            **collector_create.dict(
                exclude_unset=True,
                exclude={"material_types", "waste_code_types", "authorized_vehicle_types", "circular_strategy_types"},
            ),
            material_types=material_types,
            waste_code_types=waste_code_types,
            authorized_vehicle_types=authorized_vehicle_types,
            circular_strategy_types=circular_strategy_types,
        )
        collectors_to_create.append(collector)

    session.add_all(collectors_to_create)
    session.commit()

    return [collector.dict() for collector in collectors_to_create]


@router.put("/{id}")
def update_collector(
    id: int,
    payload: CollectorCreate,
    session: Session = Depends(get_session),
):
    collector = session.get(Collector, id)
    if not collector:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collector not found")
    material_types = read_types_by_values_or_throw(session, MaterialType, payload.material_types)
    waste_code_types = read_types_by_values_or_throw(session, WasteCodeType, payload.waste_code_types)
    authorized_vehicle_types = read_types_by_values_or_throw(
        session, AuthorizedVehicleType, payload.authorized_vehicle_types
    )
    circular_strategy_types = read_types_by_values_or_throw(
        session, CircularStrategyType, payload.circular_strategy_types
    )

    collector.name = payload.name
    collector.address = payload.address
    collector.zip_code = payload.zip_code
    collector.city = payload.city
    collector.latitude = payload.latitude
    collector.longitude = payload.longitude
    collector.email = payload.email
    collector.phone = payload.phone
    collector.material_types = material_types
    collector.waste_code_types = waste_code_types
    collector.authorized_vehicle_types = authorized_vehicle_types
    collector.circular_strategy_types = circular_strategy_types

    session.add(collector)
    session.commit()

    return collector.dict()


@router.delete("/{id}")
def delete_collector(
    id: int,
    session: Session = Depends(get_session),
):
    collector = session.get(Collector, id)
    if not collector:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Collector not found")
    session.delete(collector)
    session.commit()
    return collector.dict()


@router.delete("/")
def delete_all_collectors(
    session: Session = Depends(get_session),
):
    session.query(CollectorToMaterialType).delete()
    session.query(CollectorToWasteCodeType).delete()
    session.query(CollectorToAuthorizedVehicleType).delete()
    session.query(CollectorToCircularStrategyType).delete()
    session.query(Collector).delete()
    session.commit()
    return {"message": "All collectors deleted"}


@router.get("/filter/", response_model=CollectorFilterOptions)
def read_filter_options(session: Session = Depends(get_session)):
    material_types = read_types(session, MaterialType)
    waste_code_types = read_types(session, WasteCodeType)
    authorized_vehicle_types = read_types(session, AuthorizedVehicleType)
    circular_strategy_types = read_types(session, CircularStrategyType)
    return CollectorFilterOptions(
        material_types=material_types,
        waste_code_types=waste_code_types,
        authorized_vehicle_types=authorized_vehicle_types,
        circular_strategy_types=circular_strategy_types,
    )


@router.post("/search", response_model=SearchResponse)
def search(payload: CollectorSearchRequest, session: Session = Depends(get_session)):
    text = payload.query.text if payload.query.text else None
    material_type_ids = payload.filter.material_type_ids
    waste_code_type_ids = payload.filter.waste_code_type_ids
    authorized_vehicle_type_ids = payload.filter.authorized_vehicle_type_ids
    circular_strategy_type_ids = payload.filter.circular_strategy_type_ids

    query = session.query(Collector)

    if text:
        query = query.where(Collector.name.ilike(f"%{text}%"))

    if material_type_ids:
        query = query.where(Collector.material_types.any(UnifiedType.id.in_(material_type_ids)))
    if waste_code_type_ids:
        query = query.where(Collector.waste_code_types.any(UnifiedType.id.in_(waste_code_type_ids)))
    if authorized_vehicle_type_ids:
        query = query.where(Collector.authorized_vehicle_types.any(UnifiedType.id.in_(authorized_vehicle_type_ids)))
    if circular_strategy_type_ids:
        query = query.where(Collector.circular_strategy_types.any(UnifiedType.id.in_(circular_strategy_type_ids)))

    query = query.order_by(Collector.name.asc())
    results = session.execute(query)

    collectors_results = [CollectorRead.from_collector(collector) for collector in results.scalars().unique()]
    return SearchResponse[CollectorRead](results=collectors_results)
