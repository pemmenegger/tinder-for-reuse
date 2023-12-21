from datetime import datetime
from typing import Optional

from sqlmodel import TIMESTAMP, Column, Field, SQLModel, func


class RondasBase(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    created_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP(timezone=True),
            nullable=False,
            server_default=func.current_timestamp(),
        ),
    )
    updated_at: datetime = Field(
        sa_column=Column(
            TIMESTAMP(timezone=True),
            nullable=False,
            server_default=func.current_timestamp(),
            onupdate=func.current_timestamp(),
        ),
    )

    class Config:
        orm_mode = True
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
