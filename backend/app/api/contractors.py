from typing import List

from app.models.contractor_model import Contractor
from app.models.unified_type_model import UnifiedType
from app.schemas.contractor_schema import (
    ContractorCreate,
    ContractorFilterOptions,
    ContractorRead,
    ContractorSearchRequest,
    ContractorSearchResponse,
)
from app.shared.types import CircularServiceType, MaterialType, WasteCodeType
from app.utils.database import get_session, read_types, read_types_by_values_or_throw
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlmodel import select

router = APIRouter()


@router.get("/")
def fetch_contractors(
    session: Session = Depends(get_session),
):
    query = (
        select(Contractor)
        .options(joinedload(Contractor.material_types))
        .options(joinedload(Contractor.waste_code_types))
        .options(joinedload(Contractor.circular_service_types))
    )
    results = session.execute(query)
    contractors_read = [ContractorRead.from_contractor(contractor) for contractor in results.scalars().unique()]
    return contractors_read


@router.post("/")
def create_contractors(
    payload: List[ContractorCreate],
    session: Session = Depends(get_session),
):
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No contractors found in payload")

    contractors_to_create = []
    for contractor_create in payload:
        material_types = read_types_by_values_or_throw(session, MaterialType, contractor_create.material_types)
        waste_code_types = read_types_by_values_or_throw(session, WasteCodeType, contractor_create.waste_code_types)
        circular_service_types = read_types_by_values_or_throw(
            session, CircularServiceType, contractor_create.circular_service_types
        )

        contractor = Contractor(
            **contractor_create.dict(
                exclude_unset=True,
                exclude={"material_types", "waste_code_types", "circular_service_types"},
            ),
            material_types=material_types,
            waste_code_types=waste_code_types,
            circular_service_types=circular_service_types,
        )
        contractors_to_create.append(contractor)

    session.add_all(contractors_to_create)
    session.commit()

    return [contractor.dict() for contractor in contractors_to_create]


@router.put("/{id}")
def update_contractor(
    id: int,
    payload: ContractorCreate,
    session: Session = Depends(get_session),
):
    contractor = session.get(Contractor, id)
    if not contractor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contractor not found")

    material_types = read_types_by_values_or_throw(session, MaterialType, payload.material_types)
    waste_code_types = read_types_by_values_or_throw(session, WasteCodeType, payload.waste_code_types)
    circular_service_types = read_types_by_values_or_throw(session, CircularServiceType, payload.circular_service_types)

    contractor.name = payload.name
    contractor.address = payload.address
    contractor.zip_code = payload.zip_code
    contractor.city = payload.city
    contractor.latitude = payload.latitude
    contractor.longitude = payload.longitude
    contractor.email = payload.email
    contractor.phone = payload.phone
    contractor.material_types = material_types
    contractor.waste_code_types = waste_code_types
    contractor.circular_service_types = circular_service_types

    session.add(contractor)
    session.commit()

    return contractor.dict()


@router.delete("/{id}")
def delete_contractor(
    id: int,
    session: Session = Depends(get_session),
):
    contractor = session.get(Contractor, id)
    if not contractor:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contractor not found")

    session.delete(contractor)
    session.commit()

    return contractor.dict()


@router.get("/filter/", response_model=ContractorFilterOptions)
def read_filter_options(session: Session = Depends(get_session)):
    material_types = read_types(session, MaterialType)
    waste_code_types = read_types(session, WasteCodeType)
    circular_service_types = read_types(session, CircularServiceType)
    return ContractorFilterOptions(
        material_types=material_types,
        waste_code_types=waste_code_types,
        circular_service_types=circular_service_types,
    )


@router.post("/search", response_model=ContractorSearchResponse)
def search(payload: ContractorSearchRequest, session: Session = Depends(get_session)):
    text = payload.query.text if len(payload.query.text) > 0 else None
    material_type_ids = payload.filter.material_type_ids
    waste_code_type_ids = payload.filter.waste_code_type_ids
    circular_service_type_ids = payload.filter.circular_service_type_ids

    query = session.query(Contractor)

    if text:
        query = query.where(Contractor.name.ilike(f"%{text}%"))

    if material_type_ids:
        query = query.where(Contractor.material_types.any(UnifiedType.id.in_(material_type_ids)))
    if waste_code_type_ids:
        query = query.where(Contractor.waste_code_types.any(UnifiedType.id.in_(waste_code_type_ids)))
    if circular_service_type_ids:
        query = query.where(Contractor.circular_service_types.any(UnifiedType.id.in_(circular_service_type_ids)))

    query = query.order_by(Contractor.name.asc())
    results = session.execute(query)

    contractors_read = [ContractorRead.from_contractor(contractor) for contractor in results.scalars().unique()]
    return ContractorSearchResponse(
        results=contractors_read,
        hasMore=False,
    )
