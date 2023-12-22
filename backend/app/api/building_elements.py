from app.models.building_element_model import BuildingElement, BuildingElementUpload
from app.schemas.building_element_schema import (
    BuildingElementFilterOptions,
    BuildingElementRead,
    BuildingElementSearchRequest,
    BuildingElementUploadCreate,
    BuildingElementUploadRead,
)
from app.schemas.search_schema import SearchResponse
from app.types import (
    BuildingElementUnitType,
    BuildingElementWorksheetType,
    CircularServiceType,
    HealthStatusType,
    MaterialType,
    RecyclingPotentialType,
    ReusePotentialType,
    WasteCodeType,
)
from app.utils.database import get_session, read_type_by_value_or_throw, read_types
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlmodel import select

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_building_element_upload(
    payload: BuildingElementUploadCreate,
    session: Session = Depends(get_session),
):
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="No building element upload found in payload"
        )
    if not payload.building_elements:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No building elements found in payload")

    building_element_upload = BuildingElementUpload(**payload.dict(exclude_unset=True, exclude={"building_elements"}))
    session.add(building_element_upload)
    session.commit()

    building_elements = (
        BuildingElement(
            **building_element_create.dict(
                exclude_unset=True,
                exclude={
                    "building_element_upload_id",
                    "worksheet_type",
                    "unit_type",
                    "material_type",
                    "health_status_type",
                    "reuse_potential_type",
                    "waste_code_type",
                    "recycling_potential_type",
                    "circular_service_needed",
                },
            ),
            building_element_upload_id=building_element_upload.id,
            worksheet_type=read_type_by_value_or_throw(
                session, BuildingElementWorksheetType, building_element_create.worksheet_type
            ),
            unit_type=read_type_by_value_or_throw(session, BuildingElementUnitType, building_element_create.unit_type),
            material_type=read_type_by_value_or_throw(session, MaterialType, building_element_create.material_type),
            health_status_type=read_type_by_value_or_throw(
                session, HealthStatusType, building_element_create.health_status_type
            ),
            reuse_potential_type=read_type_by_value_or_throw(
                session, ReusePotentialType, building_element_create.reuse_potential_type
            ),
            waste_code_type=read_type_by_value_or_throw(
                session, WasteCodeType, building_element_create.waste_code_type
            ),
            recycling_potential_type=read_type_by_value_or_throw(
                session, RecyclingPotentialType, building_element_create.recycling_potential_type
            ),
            circular_service_needed_type=read_type_by_value_or_throw(
                session, CircularServiceType, building_element_create.circular_service_needed
            ),
        )
        for building_element_create in payload.building_elements
    )
    session.add_all(building_elements)
    session.commit()


@router.delete("/")
def delete_all_building_element_uploads(session: Session = Depends(get_session)):
    session.query(BuildingElement).delete()
    session.query(BuildingElementUpload).delete()
    session.commit()
    return {"message": "All building element uploads deleted"}


@router.get("/filter/", response_model=BuildingElementFilterOptions)
def read_filter_options(session: Session = Depends(get_session)):
    worksheet_types = read_types(session, BuildingElementWorksheetType)
    unit_types = read_types(session, BuildingElementUnitType)
    material_types = read_types(session, MaterialType)
    health_status_types = read_types(session, HealthStatusType)
    reuse_potential_types = read_types(session, ReusePotentialType)
    waste_code_types = read_types(session, WasteCodeType)
    recycling_potential_types = read_types(session, RecyclingPotentialType)
    circular_service_needed_types = read_types(session, CircularServiceType)

    return BuildingElementFilterOptions(
        worksheet_types=worksheet_types,
        unit_types=unit_types,
        material_types=material_types,
        health_status_types=health_status_types,
        reuse_potential_types=reuse_potential_types,
        waste_code_types=waste_code_types,
        recycling_potential_types=recycling_potential_types,
        circular_service_needed_types=circular_service_needed_types,
    )


@router.post("/search/", response_model=SearchResponse)
def search_building_elements(request: BuildingElementSearchRequest, session: Session = Depends(get_session)):
    search_text = request.query.text if request.query.text else None

    filter_criteria = {
        "worksheet_type_id": request.filter.worksheet_type_ids,
        "unit_type_id": request.filter.unit_type_ids,
        "material_type_id": request.filter.material_type_ids,
        "health_status_type_id": request.filter.health_status_type_ids,
        "reuse_potential_type_id": request.filter.reuse_potential_type_ids,
        "waste_code_type_id": request.filter.waste_code_type_ids,
        "recycling_potential_type_id": request.filter.recycling_potential_type_ids,
        "circular_service_needed_id": request.filter.circular_service_needed_type_ids,
    }

    query = select(BuildingElement)

    if search_text:
        query = query.filter(BuildingElement.title.ilike(f"%{search_text}%"))

    for attribute, ids in filter_criteria.items():
        if ids:
            query = query.filter(getattr(BuildingElement, attribute).in_(ids))

    building_elements = session.execute(query).scalars().all()

    upload_ids = [element.building_element_upload_id for element in building_elements]
    upload_query = select(BuildingElementUpload).where(BuildingElementUpload.id.in_(upload_ids))
    building_element_uploads = session.execute(upload_query).scalars().all()

    building_element_upload_data = [
        BuildingElementUploadRead(
            id=upload.id,
            address=upload.address,
            latitude=upload.latitude,
            longitude=upload.longitude,
            building_elements=[
                BuildingElementRead.from_building_element(element)
                for element in building_elements
                if element.building_element_upload_id == upload.id
            ],
        )
        for upload in building_element_uploads
    ]

    return SearchResponse[BuildingElement](results=building_element_upload_data)
