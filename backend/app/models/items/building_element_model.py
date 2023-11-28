from typing import List, Optional

from app.models._base_model import RondasItemBase, RondasTypeBase
from app.models.item_model import Item
from app.schemas.items.building_element_schema import BuildingElementBase
from app.shared.schemas.type_schema import TypeBase
from sqlmodel import Field, Relationship, SQLModel


class BuildingElementToBuildingElementConstitutionType(SQLModel, table=True):
    __tablename__ = "building_element_to_building_element_constitution_type"

    building_element_id: int = Field(default=None, foreign_key="building_element.id", primary_key=True)
    building_element_constitution_type_id: int = Field(
        default=None, foreign_key="building_element_constitution_type.id", primary_key=True
    )


class BuildingElementToBuildingElementMaterialType(SQLModel, table=True):
    __tablename__ = "building_element_to_building_element_material_type"

    building_element_id: int = Field(default=None, foreign_key="building_element.id", primary_key=True)
    building_element_material_type_id: int = Field(
        default=None, foreign_key="building_element_material_type.id", primary_key=True
    )


class BuildingElementConstitutionType(TypeBase, RondasTypeBase, table=True):
    __tablename__ = "building_element_constitution_type"

    building_elements: List["BuildingElement"] = Relationship(
        back_populates="constitution_types", link_model=BuildingElementToBuildingElementConstitutionType
    )


class BuildingElementMaterialType(TypeBase, RondasTypeBase, table=True):
    __tablename__ = "building_element_material_type"

    building_elements: List["BuildingElement"] = Relationship(
        back_populates="material_types", link_model=BuildingElementToBuildingElementMaterialType
    )


class BuildingElementCategoryType(TypeBase, RondasTypeBase, table=True):
    __tablename__ = "building_element_category_type"

    building_elements: List["BuildingElement"] = Relationship(back_populates="category_type")


class BuildingElementUnitType(TypeBase, RondasTypeBase, table=True):
    __tablename__ = "building_element_unit_type"

    building_elements: List["BuildingElement"] = Relationship(back_populates="unit_type")


class BuildingElement(BuildingElementBase, RondasItemBase, table=True):
    __tablename__ = "building_element"

    item_id: Optional[int] = Field(default=None, unique=True, index=True, foreign_key="item.id")
    item: Item = Relationship(back_populates="building_element")

    category_type_id: int = Field(foreign_key="building_element_category_type.id")
    category_type: BuildingElementCategoryType = Relationship(back_populates="building_elements")
    unit_type_id: int = Field(foreign_key="building_element_unit_type.id")
    unit_type: BuildingElementUnitType = Relationship(back_populates="building_elements")
    constitution_types: List[BuildingElementConstitutionType] = Relationship(
        back_populates="building_elements",
        link_model=BuildingElementToBuildingElementConstitutionType,
    )
    material_types: List[BuildingElementMaterialType] = Relationship(
        back_populates="building_elements",
        link_model=BuildingElementToBuildingElementMaterialType,
    )
