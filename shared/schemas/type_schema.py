######################################################################
# THIS FILE WILL BE SHARED AND COPIED TO THE RELEVANT CONTAINERS     #
# DO ONLY CHANGE IT IN ./shared/                                     #
# SYNC WITH ./frontend/types/api/type.ts                             #
######################################################################

from sqlmodel import Field, SQLModel


class TypeBase(SQLModel):
    name: str = Field(unique=True, index=True)


class TypeCreate(TypeBase):
    pass


class TypeRead(TypeBase):
    # change also in frontend/types/api/type.ts
    id: int

    @classmethod
    def from_enum(cls, type_enum):
        return cls(id=type_enum.id, name=type_enum.label)
