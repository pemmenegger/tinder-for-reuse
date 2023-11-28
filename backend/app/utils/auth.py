from datetime import datetime, timedelta

import jwt
from app.config import settings
from app.models.account_model import Account
from app.schemas.auth_schema import TokenPayload
from app.utils.database import get_session
from fastapi import Depends, HTTPException, Security, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from pydantic import SecretStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def hash_password(password: SecretStr) -> str:
    password_str = password.get_secret_value()
    return password_context.hash(password_str)


def verify_password(password: SecretStr, hashed_password: str) -> bool:
    password_str = password.get_secret_value()
    return password_context.verify(password_str, hashed_password)


def _create_token(token_payload: TokenPayload, secret_key: str, valid_minutes: int) -> tuple[str, datetime]:
    expires_at = datetime.utcnow() + timedelta(minutes=valid_minutes)

    to_encode = token_payload.dict()
    to_encode.update({"exp": expires_at})

    encoded_jwt = jwt.encode(to_encode, secret_key, settings.BACKEND_JWT_ALGORITHM)
    return encoded_jwt, expires_at


def create_access_token(token_payload: TokenPayload) -> tuple[str, datetime]:
    return _create_token(
        token_payload,
        settings.BACKEND_JWT_SECRET_KEY,
        settings.BACKEND_JWT_EXPIRE_MINUTES,
    )


def create_refresh_token(token_payload: TokenPayload) -> str:
    token, _ = _create_token(
        token_payload,
        settings.BACKEND_JWT_REFRESH_SECRET_KEY,
        settings.BACKEND_JWT_REFRESH_EXPIRE_MINUTES,
    )
    return token


async def get_current_account(
    token: str = Security(oauth2_scheme), session: AsyncSession = Depends(get_session)
) -> Account:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, settings.BACKEND_JWT_SECRET_KEY, algorithms=[settings.BACKEND_JWT_ALGORITHM])
        token_data = TokenPayload(**payload)
        async with session:
            account = await session.execute(select(Account).where(Account.id == token_data.id))
            account = account.scalar_one_or_none()
            if account is None:
                raise credentials_exception
            return account
    except jwt.PyJWTError:
        raise credentials_exception
