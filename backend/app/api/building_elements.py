# from collections import defaultdict
from typing import List

from app.models.building_element_model import BuildingElement
from app.schemas.building_element_schema import (
    BuildingElementCreate,
    BuildingElementFilterOptions,
    BuildingElementRead,
    BuildingElementSearchRequest,
    BuildingElementSearchResponse,
)
from app.shared.types import (
    BuildingElementUnitType,
    BuildingElementWorksheetType,
    HealthStatusType,
    MaterialType,
    RecyclingPotentialType,
    ReusePotentialType,
    WasteCodeType,
)
from app.utils.database import get_session, read_type_by_value_or_throw, read_types
from fastapi import APIRouter, Depends, HTTPException, status

# from sqlalchemy import text
from sqlalchemy.orm import Session
from sqlmodel import select

# from app.shared.schemas.collector_schema import CollectorRead


router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_building_elements(
    payload: List[BuildingElementCreate],
    session: Session = Depends(get_session),
):
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No building elements found in payload")

    building_elements_to_create = []
    for building_element_create in payload:
        worksheet_type = read_type_by_value_or_throw(
            session, BuildingElementWorksheetType, building_element_create.worksheet_type
        )
        unit_type = read_type_by_value_or_throw(session, BuildingElementUnitType, building_element_create.unit_type)
        material_type = read_type_by_value_or_throw(session, MaterialType, building_element_create.material_type)
        health_status_type = read_type_by_value_or_throw(
            session, HealthStatusType, building_element_create.health_status_type
        )
        reuse_potential_type = read_type_by_value_or_throw(
            session, ReusePotentialType, building_element_create.reuse_potential_type
        )
        waste_code_type = read_type_by_value_or_throw(session, WasteCodeType, building_element_create.waste_code_type)
        recycling_potential_type = read_type_by_value_or_throw(
            session, RecyclingPotentialType, building_element_create.recycling_potential_type
        )

        building_element = BuildingElement(
            **building_element_create.dict(
                exclude_unset=True,
                exclude={
                    "worksheet_type",
                    "unit_type",
                    "material_type",
                    "health_status_type",
                    "reuse_potential_type",
                    "waste_code_type",
                    "recycling_potential_type",
                },
            ),
            worksheet_type=[worksheet_type],
            unit_type=[unit_type],
            material_type=[material_type],
            health_status_type=[health_status_type],
            reuse_potential_type=[reuse_potential_type],
            waste_code_type=[waste_code_type],
            recycling_potential_type=[recycling_potential_type],
        )
        building_elements_to_create.append(building_element)

    session.add_all(building_elements_to_create)
    session.commit()

    return [building_element.dict() for building_element in building_elements_to_create]


@router.delete("/{id}")
def delete_building_element(
    id: int,
    session: Session = Depends(get_session),
):
    building_element = session.get(BuildingElement, id)
    if not building_element:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Building element not found")
    session.delete(building_element)
    session.commit()
    return building_element.dict()


@router.get("/filter/", response_model=BuildingElementFilterOptions)
def read_filter_options(session: Session = Depends(get_session)):
    worksheet_types = read_types(session, BuildingElementWorksheetType)
    unit_types = read_types(session, BuildingElementUnitType)
    material_types = read_types(session, MaterialType)
    health_status_types = read_types(session, HealthStatusType)
    reuse_potential_types = read_types(session, ReusePotentialType)
    waste_code_types = read_types(session, WasteCodeType)
    recycling_potential_types = read_types(session, RecyclingPotentialType)

    return BuildingElementFilterOptions(
        worksheet_types=worksheet_types,
        unit_types=unit_types,
        material_types=material_types,
        health_status_types=health_status_types,
        reuse_potential_types=reuse_potential_types,
        waste_code_types=waste_code_types,
        recycling_potential_types=recycling_potential_types,
    )


@router.post("/search/", response_model=BuildingElementSearchResponse)
def search(payload: BuildingElementSearchRequest, session: Session = Depends(get_session)):
    text = payload.query.text if len(payload.query.text) > 0 else None

    worksheet_type_ids = payload.filter.worksheet_type_ids
    unit_type_ids = payload.filter.unit_type_ids
    material_type_ids = payload.filter.material_type_ids
    health_status_type_ids = payload.filter.health_status_type_ids
    reuse_potential_type_ids = payload.filter.reuse_potential_type_ids
    waste_code_type_ids = payload.filter.waste_code_type_ids
    recycling_potential_type_ids = payload.filter.recycling_potential_type_ids

    query = select(BuildingElement)

    if text:
        query = query.where(BuildingElement.item.title.ilike(f"%{text}%"))

    if worksheet_type_ids:
        query = query.where(BuildingElement.worksheet_type_id.in_(worksheet_type_ids))
    if unit_type_ids:
        query = query.where(BuildingElement.unit_type_id.in_(unit_type_ids))
    if material_type_ids:
        query = query.where(BuildingElement.material_type_id.in_(material_type_ids))
    if health_status_type_ids:
        query = query.where(BuildingElement.health_status_type_id.in_(health_status_type_ids))
    if reuse_potential_type_ids:
        query = query.where(BuildingElement.reuse_potential_type_id.in_(reuse_potential_type_ids))
    if waste_code_type_ids:
        query = query.where(BuildingElement.waste_code_type_id.in_(waste_code_type_ids))
    if recycling_potential_type_ids:
        query = query.where(BuildingElement.recycling_potential_type_id.in_(recycling_potential_type_ids))

    query = query.order_by(BuildingElement.created_at.desc())
    results = session.execute(query)

    building_elements_read = [
        BuildingElementRead.from_building_element(building_element) for building_element in results.scalars().unique()
    ]
    return BuildingElementSearchResponse(results=building_elements_read)


# @router.post("/matches/")
# def read_my_matches(session: Session = Depends(get_session)):
#     building_elements_query = (
#         select(BuildingElement)
#         .join(BuildingElement.item)
#         .options(joinedload(BuildingElement.category_type))
#         .options(joinedload(BuildingElement.unit_type))
#         .options(joinedload(BuildingElement.constitution_types))
#         .options(joinedload(BuildingElement.material_types))
#         .options(joinedload(BuildingElement.item))
#         .where(Item.account_id == 1)
#         .order_by(Item.created_at.desc())
#     )
#     building_elements = session.execute(building_elements_query).scalars().unique()
#     building_elements_read = [BuildingElementRead.from_building_element(be) for be in building_elements]

#     upload_uuids_to_lat_lngs = {}
#     for building_element_read in building_elements_read:
#         if building_element_read.upload_uuid not in upload_uuids_to_lat_lngs:
#             upload_uuids_to_lat_lngs[building_element_read.upload_uuid] = {
#                 "lat": building_element_read.latitude,
#                 "lng": building_element_read.longitude,
#             }

#     # Pre-process the upload UUIDs to lat-long pairs
#     lat_lng_pairs = {uuid: (lat_lng["lat"], lat_lng["lng"]) for uuid, lat_lng in upload_uuids_to_lat_lngs.items()}

#     # Function to get nearby collectors
#     def get_nearby_collectors(latitude, longitude):
#         collectors_nearby_query = (
#             select(Collector)
#             .where(Collector.latitude.isnot(None))
#             .where(Collector.longitude.isnot(None))
#             .order_by(text("haversine(:lat, :lon, Collector.latitude, Collector.longitude)").params(lat=latitude, lon=longitude))
#             .limit(10)
#         )
#         return session.execute(collectors_nearby_query).scalars().unique()

#     nearest_collectors_read = defaultdict(list)
#     for uuid, (lat, lng) in lat_lng_pairs.items():
#         collectors = get_nearby_collectors(lat, lng)
#         nearest_collectors_read[uuid].extend(CollectorRead.from_collector(collector) for collector in collectors)

#     # Flatten the list of collectors and remove duplicates
#     unique_collectors = {
#         collector.id: collector for collectors in nearest_collectors_read.type_labels() for collector in collectors
#     }
#     collectors_read = list(unique_collectors.values())

#     return BuildingElementMatchesResponse(
#         results=[
#             BuildingElementMatchesResponse.BuildingElementMatchesRead(
#                 building_elements_read=building_elements_read,
#                 collectors_read=collectors_read,
#             )
#         ]
#     )


# @router.get("/my/")
# def read_my_building_elements(
#     current_account: session: Session = Depends(get_session)
# ):
#     query = (
#         select(BuildingElement)
#         .join(BuildingElement.item)
#         .options(joinedload(BuildingElement.category_type))
#         .options(joinedload(BuildingElement.unit_type))
#         .options(joinedload(BuildingElement.constitution_types))
#         .options(joinedload(BuildingElement.material_types))
#         .options(joinedload(BuildingElement.item))
#         .where(Item.account_id == current_account.id)
#         .order_by(Item.created_at.desc())
#     )
#     results = session.execute(query)

#     building_elements_read = [
#         BuildingElementRead.from_building_element(building_element) for building_element in results.scalars().unique()
#     ]
#     return building_elements_read
