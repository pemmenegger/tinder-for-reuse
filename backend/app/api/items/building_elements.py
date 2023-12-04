from typing import List

from app.models.account_model import Account
from app.models.collector_model import Collector
from app.models.item_model import Item, ItemCategoryType
from app.models.items.building_element_model import (
    BuildingElement,
    BuildingElementCategoryType,
    BuildingElementConstitutionType,
    BuildingElementMaterialType,
    BuildingElementUnitType,
)
from app.schemas.items.building_element_schema import (
    BuildingElementCreate,
    BuildingElementFilterOptions,
    BuildingElementMatchesResponse,
    BuildingElementRead,
    BuildingElementSearchRequest,
    BuildingElementSearchResponse,
)
from app.shared.schemas.collector_schema import CollectorRead
from app.shared.schemas.type_schema import TypeRead
from app.shared.types import ItemCategoryEnum
from app.utils.auth import get_current_account
from app.utils.database import (
    get_session,
    read_or_create_type_by_name,
    read_or_create_types_by_names,
    read_type_by_id,
    read_type_by_name,
    read_types,
)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session, joinedload
from sqlmodel import select

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_building_elements(
    payload: List[BuildingElementCreate],
    current_account: Account = Depends(get_current_account),
    session: Session = Depends(get_session),
):
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No building elements found in payload")

    building_elements_to_create = []
    for building_element_create in payload:
        unit_type = read_type_by_name(session, BuildingElementUnitType, building_element_create.unit_type)
        if not unit_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unit {building_element_create.unit_type} does not exist",
            )

        building_element = BuildingElement(
            **building_element_create.dict(
                exclude_unset=True,
                exclude={"category_type", "unit_type", "constitution_types", "material_types", "item"},
            ),
            category_type=read_or_create_type_by_name(
                session, BuildingElementCategoryType, building_element_create.category_type
            ),
            unit_type=unit_type,
            constitution_types=read_or_create_types_by_names(
                session, BuildingElementConstitutionType, building_element_create.constitution_types
            ),
            material_types=read_or_create_types_by_names(
                session, BuildingElementMaterialType, building_element_create.material_types
            ),
            item=Item(
                **building_element_create.item.dict(
                    exclude_unset=True,
                    exclude={"category_type", "account", "embedding", "images"},
                ),
                category_type=read_type_by_id(session, ItemCategoryType, ItemCategoryEnum.BUILDING_ELEMENT.id),
                account=current_account,
                embedding=None,
                images=[],
            ),
        )
        building_elements_to_create.append(building_element)

    session.add_all(building_elements_to_create)
    session.commit()

    return [building_element.dict() for building_element in building_elements_to_create]


@router.get("/filter/", response_model=BuildingElementFilterOptions)
def read_filter_options(session: Session = Depends(get_session)):
    unit_types = read_types(session, BuildingElementUnitType)
    category_types = read_types(session, BuildingElementCategoryType)
    constitution_types = read_types(session, BuildingElementConstitutionType)
    material_types = read_types(session, BuildingElementMaterialType)

    return BuildingElementFilterOptions(
        unit_types=[TypeRead.from_orm(unit_type) for unit_type in unit_types],
        category_types=[TypeRead.from_orm(category_type) for category_type in category_types],
        constitution_types=[TypeRead.from_orm(constitution_type) for constitution_type in constitution_types],
        material_types=[TypeRead.from_orm(material_type) for material_type in material_types],
    )


@router.post("/search/", response_model=BuildingElementSearchResponse)
def search(payload: BuildingElementSearchRequest, session: Session = Depends(get_session)):
    text = payload.query.text if len(payload.query.text) > 0 else None
    unit_type_ids = payload.filter.unit_type_ids
    category_type_ids = payload.filter.category_type_ids
    constitution_type_ids = payload.filter.constitution_type_ids
    material_type_ids = payload.filter.material_type_ids

    query = (
        select(BuildingElement)
        .join(BuildingElement.item)
        .options(joinedload(BuildingElement.category_type))
        .options(joinedload(BuildingElement.unit_type))
        .options(joinedload(BuildingElement.constitution_types))
        .options(joinedload(BuildingElement.material_types))
        .options(joinedload(BuildingElement.item))
        .options(joinedload("item.category_type"))
        .options(joinedload("item.account"))
        .options(joinedload("item.images"))
    )

    if text:
        query = query.where(BuildingElement.item.title.ilike(f"%{text}%"))

    if unit_type_ids:
        query = query.where(BuildingElement.unit_type_id.in_(unit_type_ids))
    if category_type_ids:
        query = query.where(BuildingElement.category_type_id.in_(category_type_ids))
    if constitution_type_ids:
        query = query.where(
            BuildingElement.constitution_types.any(BuildingElementConstitutionType.id.in_(constitution_type_ids))
        )
    if material_type_ids:
        query = query.where(BuildingElement.material_types.any(BuildingElementMaterialType.id.in_(material_type_ids)))

    query = query.order_by(Item.created_at.desc())
    results = session.execute(query)

    building_elements_read = [
        BuildingElementRead.from_building_element(building_element) for building_element in results.scalars().unique()
    ]
    return BuildingElementSearchResponse(results=building_elements_read)


@router.post("/matches/")
def read_my_matches(session: Session = Depends(get_session)):
    building_elements_query = (
        select(BuildingElement)
        .join(BuildingElement.item)
        .options(joinedload(BuildingElement.category_type))
        .options(joinedload(BuildingElement.unit_type))
        .options(joinedload(BuildingElement.constitution_types))
        .options(joinedload(BuildingElement.material_types))
        .options(joinedload(BuildingElement.item))
        .where(Item.account_id == 1)
        .order_by(Item.created_at.desc())
    )
    building_elements = session.execute(building_elements_query).scalars().unique()
    building_elements_read = [BuildingElementRead.from_building_element(be) for be in building_elements]

    upload_uuids_to_lat_lngs = {}
    for building_element_read in building_elements_read:
        if building_element_read.upload_uuid not in upload_uuids_to_lat_lngs:
            upload_uuids_to_lat_lngs[building_element_read.upload_uuid] = {
                "lat": building_element_read.lat,
                "lng": building_element_read.lng,
            }

    nearest_collectors_read = {}
    for uuid, lat_lng in upload_uuids_to_lat_lngs.items():
        lat, lng = lat_lng["lat"], lat_lng["lng"]
        collectors_nearby_query = (
            select(Collector)
            .where(Collector.lat.isnot(None))
            .where(Collector.lng.isnot(None))
            .order_by(text("haversine(:lat, :lon, Collector.lat, Collector.lng)").params(lat=lat, lon=lng))
            .limit(5)
        )
        collectors_nearby = session.execute(collectors_nearby_query).scalars().unique()
        nearest_collectors_read[uuid] = [CollectorRead.from_collector(collector) for collector in collectors_nearby]

    collectors_read = [collector for collectors in nearest_collectors_read.values() for collector in collectors]

    return BuildingElementMatchesResponse(
        results=[
            BuildingElementMatchesResponse.BuildingElementMatchesRead(
                building_elements_read=building_elements_read,
                collectors_read=collectors_read,
            )
        ]
    )


@router.get("/my/")
def read_my_building_elements(
    current_account: Account = Depends(get_current_account), session: Session = Depends(get_session)
):
    query = (
        select(BuildingElement)
        .join(BuildingElement.item)
        .options(joinedload(BuildingElement.category_type))
        .options(joinedload(BuildingElement.unit_type))
        .options(joinedload(BuildingElement.constitution_types))
        .options(joinedload(BuildingElement.material_types))
        .options(joinedload(BuildingElement.item))
    )
    query = query.where(Item.account_id == current_account.id)
    query = query.order_by(BuildingElement.created_at.desc())
    results = session.execute(query)

    building_elements_read = [
        BuildingElementRead.from_building_element(building_element) for building_element in results.scalars().unique()
    ]
    return building_elements_read
