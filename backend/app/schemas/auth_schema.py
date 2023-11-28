from app.schemas.account_schema import AccountRead
from pydantic import BaseModel, EmailStr


class TokenPayload(BaseModel):
    id: int
    email: EmailStr


class AuthenticatedResponse(BaseModel):
    user: AccountRead
    access_token: str
    refresh_token: str
    expires_at: float
