from typing import List, Optional

from app.schemas.account_schema import AccountRead
from app.shared.schemas.item_schema import ItemBase, ItemImageBase
from app.shared.schemas.type_schema import TypeRead
from pydantic import BaseModel


class ItemImageRead(ItemImageBase):
    is_best: bool


class ItemRead(ItemBase):
    id: int
    category_type: TypeRead
    account: Optional[AccountRead]
    images: Optional[List[ItemImageRead]]

    @classmethod
    def from_item(cls, item):
        return cls(
            id=item.id,
            title=item.title,
            description=item.description,
            category_type=TypeRead.from_orm(item.category_type),
            account=AccountRead.from_orm(item.account) if item.account else None,
            images=[ItemImageRead.from_orm(item_image) for item_image in item.images],
        )


class ItemSearchRequest(BaseModel):
    class Query(BaseModel):
        text: str
        image: Optional[str]

    class Filter(BaseModel):
        category: Optional[str]
        embedding_type: Optional[str]

    query: Query
    filter: Filter


class ItemSearchResponse(BaseModel):
    results: List[ItemRead]
    hasMore: bool
