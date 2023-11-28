##########################################################
# IMPORTANT: Keep in sync with frontend/types/account.ts #
##########################################################

from typing import Optional

from pydantic import BaseModel, EmailStr, SecretStr, constr
from sqlmodel import Field, SQLModel


class RondasSecretStr(SecretStr):
    min_length = 8
    max_length = 50


class AccountBase(SQLModel):
    email: EmailStr = Field(unique=True)
    display_name: constr(min_length=3, max_length=100)
    phone: Optional[str]


class AccountCreate(AccountBase):
    password: RondasSecretStr


class AccountRead(AccountBase):
    id: int
    is_email_verified: bool


class AccountLogin(BaseModel):
    email: EmailStr
    password: SecretStr
