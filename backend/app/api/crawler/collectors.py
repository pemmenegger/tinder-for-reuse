from typing import List

from app.models.collector_model import Collector, CollectorCollectionType
from app.shared.schemas.collector_schema import CollectorCreate
from app.utils.database import get_session, read_type_by_name
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
        collection_types = []
        for collection_type in collector_create.collection_types:
            collection_type = read_type_by_name(session, CollectorCollectionType, collection_type)
            if not collection_type:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Collection type {collection_type} does not exist",
                )
            collection_types.append(collection_type)

        collector = Collector(
            **collector_create.dict(
                exclude_unset=True,
                exclude={"collection_types"},
            ),
            collection_types=collection_types,
        )
        collectors_to_create.append(collector)

    session.add_all(collectors_to_create)
    session.commit()

    return [collector.dict() for collector in collectors_to_create]
