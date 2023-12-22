###################################################################
# IMPORTANT: Keep in sync with frontend/types/api/type.ts         #
###################################################################

from sqlmodel import Field, SQLModel


class UnifiedTypeBase(SQLModel):
    discriminator: str = Field(index=True)
    type_id: int
    type_label: str = Field(index=True)


class UnifiedTypeCreate(UnifiedTypeBase):
    pass


class UnifiedTypeRead(UnifiedTypeBase):
    id: int
