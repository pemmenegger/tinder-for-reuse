from typing import TYPE_CHECKING, List, Optional

from app.models._base_model import RondasBase, RondasItemBase, RondasTypeBase
from app.shared.schemas.item_schema import ItemBase, ItemImageBase
from app.shared.schemas.type_schema import TypeBase
from sqlmodel import Field, Relationship

# avoid circular imports
if TYPE_CHECKING:
    from app.models.items.building_element_model import BuildingElement


class ItemCategoryType(TypeBase, RondasTypeBase, table=True):
    __tablename__ = "item_category_type"

    items: List["Item"] = Relationship(back_populates="category_type")


class ItemImage(ItemImageBase, RondasItemBase, table=True):
    __tablename__ = "item_image"

    # only read
    is_best: bool

    item_id: int = Field(foreign_key="item.id")
    item: "Item" = Relationship(back_populates="images")


class Item(ItemBase, RondasBase, table=True):
    __tablename__ = "item"

    category_type_id: int = Field(foreign_key="item_category_type.id")
    category_type: ItemCategoryType = Relationship(back_populates="items")
    images: Optional[List[ItemImage]] = Relationship(back_populates="item")

    building_element: "BuildingElement" = Relationship(back_populates="item")
