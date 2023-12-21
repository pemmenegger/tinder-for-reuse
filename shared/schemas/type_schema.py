######################################################################
# THIS FILE WILL BE SHARED AND COPIED TO THE RELEVANT CONTAINERS     #
# DO ONLY CHANGE IT IN ./shared/                                     #
# SYNC WITH ./frontend/types/api/type.ts                             #
######################################################################

from sqlmodel import Field, SQLModel


class UnifiedTypeBase(SQLModel):
    discriminator: str = Field(index=True)
    type_id: int
    type_label: str = Field(index=True)


class UnifiedTypeCreate(UnifiedTypeBase):
    pass


class UnifiedTypeRead(UnifiedTypeBase):
    id: int
