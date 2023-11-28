from typing import List

from app.config import settings
from app.models.account_model import Account
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
    BuildingElementRead,
    BuildingElementSearchRequest,
    BuildingElementSearchResponse,
)
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
from sqlalchemy.orm import joinedload
from sqlmodel import select
from sqlmodel.ext.asyncio.session import AsyncSession

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_building_elements(
    payload: List[BuildingElementCreate],
    current_account: Account = Depends(get_current_account),
    session: AsyncSession = Depends(get_session),
):
    if not payload:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No building elements found in payload")

    async with session.begin():
        building_elements_to_create = []
        for building_element_create in payload:
            unit_type = await read_type_by_name(session, BuildingElementUnitType, building_element_create.unit_type)
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
                category_type=await read_or_create_type_by_name(
                    session, BuildingElementCategoryType, building_element_create.category_type
                ),
                unit_type=unit_type,
                constitution_types=await read_or_create_types_by_names(
                    session, BuildingElementConstitutionType, building_element_create.constitution_types
                ),
                material_types=await read_or_create_types_by_names(
                    session, BuildingElementMaterialType, building_element_create.material_types
                ),
                item=Item(
                    **building_element_create.item.dict(
                        exclude_unset=True,
                        exclude={"category_type", "account", "embedding", "images"},
                    ),
                    category_type=await read_type_by_id(
                        session, ItemCategoryType, ItemCategoryEnum.BUILDING_ELEMENT.id
                    ),
                    account=current_account,
                    embedding=None,
                    images=[],
                ),
            )
            building_elements_to_create.append(building_element)

        session.add_all(building_elements_to_create)
        await session.commit()

    return [building_element.dict() for building_element in building_elements_to_create]


@router.get("/filter/", response_model=BuildingElementFilterOptions)
async def read_filter_options(session: AsyncSession = Depends(get_session)):
    async with session:
        unit_types = await read_types(session, BuildingElementUnitType)
        category_types = await read_types(session, BuildingElementCategoryType)
        constitution_types = await read_types(session, BuildingElementConstitutionType)
        material_types = await read_types(session, BuildingElementMaterialType)

        return BuildingElementFilterOptions(
            unit_types=[TypeRead.from_orm(unit_type) for unit_type in unit_types],
            category_types=[TypeRead.from_orm(category_type) for category_type in category_types],
            constitution_types=[TypeRead.from_orm(constitution_type) for constitution_type in constitution_types],
            material_types=[TypeRead.from_orm(material_type) for material_type in material_types],
        )


@router.post("/search", response_model=BuildingElementSearchResponse)
async def search(payload: BuildingElementSearchRequest, session: AsyncSession = Depends(get_session), page: int = 0):
    offset = page * settings.ITEMS_PER_PAGE
    text = payload.query.text if len(payload.query.text) > 0 else None
    unit_type_ids = payload.filter.unit_type_ids
    category_type_ids = payload.filter.category_type_ids
    constitution_type_ids = payload.filter.constitution_type_ids
    material_type_ids = payload.filter.material_type_ids

    async with session:
        query = (
            select(BuildingElement)
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
            query = query.where(
                BuildingElement.material_types.any(BuildingElementMaterialType.id.in_(material_type_ids))
            )

        query = query.order_by(Item.created_at.desc())
        query = query.limit(settings.ITEMS_PER_PAGE).offset(offset)
        results = await session.execute(query)

        building_elements_read = [
            BuildingElementRead.from_building_element(building_element)
            for building_element in results.scalars().unique()
        ]
        return BuildingElementSearchResponse(
            results=building_elements_read,
            hasMore=len(building_elements_read) == settings.ITEMS_PER_PAGE,
        )


@router.get("/my/")
async def read_my_building_elements(
    current_account: Account = Depends(get_current_account), session: AsyncSession = Depends(get_session)
):
    async with session:
        query = (
            (select(BuildingElement).where(BuildingElement.account_id == current_account.id))
            .options(joinedload(BuildingElement.account))
            .options(joinedload(BuildingElement.category_type))
            .options(joinedload(BuildingElement.unit_type))
            .options(joinedload(BuildingElement.constitution_types))
            .options(joinedload(BuildingElement.material_types))
        )
        query = query.order_by(BuildingElement.created_at.desc())
        results = await session.execute(query)

        building_elements_read = [
            BuildingElementRead.from_building_element(building_element)
            for building_element in results.scalars().unique()
        ]
        return building_elements_read
