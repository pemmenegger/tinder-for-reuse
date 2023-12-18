from typing import List

from app.models.stakeholders.contractor_model import Contractor
from app.models.type_model import MaterialType, WasteCodeType
from app.schemas.stakeholders.contractor_schema import (
    ContractorCreate,
    ContractorFilterOptions,
    ContractorRead,
    ContractorSearchRequest,
    ContractorSearchResponse,
)
from app.utils.database import get_session, read_types, read_types_by_name_or_throw
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from sqlmodel import select

router = APIRouter()


@router.post("/")
def create_contractors(
    payload: List[ContractorCreate],
    session: Session = Depends(get_session),
):
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No contractors found in payload")

    contractors_to_create = []
    for contractor_create in payload:
        material_types = read_types_by_name_or_throw(session, MaterialType, contractor_create.material_types)
        waste_code_types = read_types_by_name_or_throw(session, WasteCodeType, contractor_create.waste_code_types)

        contractor = Contractor(
            **contractor_create.dict(
                exclude_unset=True,
                exclude={"material_types", "waste_code_types"},
            ),
            material_types=material_types,
            waste_code_types=waste_code_types,
        )
        contractors_to_create.append(contractor)

    session.add_all(contractors_to_create)
    session.commit()

    return [contractor.dict() for contractor in contractors_to_create]


@router.get("/")
def fetch_contractors(
    session: Session = Depends(get_session),
):
    query = (
        select(Contractor)
        .options(joinedload(Contractor.material_types))
        .options(joinedload(Contractor.waste_code_types))
    )
    results = session.execute(query)
    contractors_read = [ContractorRead.from_contractor(contractor) for contractor in results.scalars().unique()]
    return contractors_read


@router.get("/filter/", response_model=ContractorFilterOptions)
def read_filter_options(session: Session = Depends(get_session)):
    material_types = read_types(session, MaterialType)
    waste_code_types = read_types(session, WasteCodeType)
    return ContractorFilterOptions(
        material_types=material_types,
        waste_code_types=waste_code_types,
    )


@router.post("/search", response_model=ContractorSearchResponse)
def search(payload: ContractorSearchRequest, session: Session = Depends(get_session)):
    text = payload.query.text if len(payload.query.text) > 0 else None
    material_type_ids = payload.filter.material_type_ids
    waste_code_type_ids = payload.filter.waste_code_type_ids

    query = (
        select(Contractor)
        .options(joinedload(Contractor.material_types))
        .options(joinedload(Contractor.waste_code_types))
    )

    if text:
        query = query.where(Contractor.name.ilike(f"%{text}%"))

    if material_type_ids:
        query = query.where(Contractor.material_types.any(MaterialType.id.in_(material_type_ids)))
    if waste_code_type_ids:
        query = query.where(Contractor.waste_code_types.any(WasteCodeType.id.in_(waste_code_type_ids)))

    query = query.order_by(Contractor.name.asc())
    results = session.execute(query)

    contractors_read = [ContractorRead.from_contractor(contractor) for contractor in results.scalars().unique()]
    return ContractorSearchResponse(
        results=contractors_read,
        hasMore=False,
    )
