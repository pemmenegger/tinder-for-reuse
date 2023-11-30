from app.models.collector_model import Collector, CollectorCollectionType
from app.schemas.collector_schema import (
    CollectorFilterOptions,
    CollectorSearchRequest,
    CollectorSearchResponse,
)
from app.shared.schemas.collector_schema import CollectorRead
from app.utils.database import get_session, read_types
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from sqlmodel import select

router = APIRouter()


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
    return CollectorFilterOptions(
        collection_types=collection_types,
    )


@router.post("/search", response_model=CollectorSearchResponse)
def search(payload: CollectorSearchRequest, session: Session = Depends(get_session)):
    text = payload.query.text if len(payload.query.text) > 0 else None
    collection_type_ids = payload.filter.collection_type_ids

    query = select(Collector).options(joinedload(Collector.collection_types))

    if text:
        query = query.where(Collector.name.ilike(f"%{text}%"))

    if collection_type_ids:
        query = query.where(Collector.collection_types.any(CollectorCollectionType.id.in_(collection_type_ids)))

    query = query.order_by(Collector.name.asc())
    results = session.execute(query)

    collectors_read = [CollectorRead.from_collector(collector) for collector in results.scalars().unique()]
    return CollectorSearchResponse(
        results=collectors_read,
        hasMore=False,
    )
