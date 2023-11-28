from typing import TYPE_CHECKING, List

from app.models._base_model import RondasBase
from app.schemas.account_schema import AccountBase
from sqlmodel import Field, Relationship

# avoid circular imports
if TYPE_CHECKING:
    from app.models.item_model import Item


class Account(AccountBase, RondasBase, table=True):
    __tablename__ = "account"

    hashed_password: str
    is_email_verified: bool = Field(default=False)

    items: List["Item"] = Relationship(back_populates="account")
