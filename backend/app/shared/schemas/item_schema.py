######################################################################
# THIS FILE WILL BE SHARED AND COPIED TO THE RELEVANT CONTAINERS     #
# DO ONLY CHANGE IT IN ./shared/                                     #
# SYNC WITH ./frontend/types/api/item.ts                             #
######################################################################


from typing import List, Optional

from sqlmodel import Field, SQLModel


class ItemImageBase(SQLModel):
    url: str = Field(unique=True)


class ItemImageCreate(ItemImageBase):
    pass


class ItemBase(SQLModel):
    title: str
    description: Optional[str]


class ItemCreate(ItemBase):
    category_type_id: int
    # Account will be set by the API
    images: Optional[List[ItemImageCreate]]
