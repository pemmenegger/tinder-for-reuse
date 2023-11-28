from app.models.account_model import Account
from app.schemas.account_schema import AccountCreate, AccountLogin, AccountRead
from app.schemas.auth_schema import AuthenticatedResponse, TokenPayload
from app.shared.helpers import from_datetime_to_unix_timestamp
from app.utils.auth import (
    create_access_token,
    create_refresh_token,
    hash_password,
    verify_password,
)
from app.utils.database import get_session
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

router = APIRouter()


@router.post("/register/", response_model=AuthenticatedResponse)
async def register(
    payload: AccountCreate, session: AsyncSession = Depends(get_session)
):
    async with session:
        account = await session.execute(
            select(Account).where(Account.email == payload.email)
        )
        account = account.scalar_one_or_none()
        if account:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        new_account = Account(
            email=payload.email,
            hashed_password=hash_password(payload.password),
            display_name=payload.display_name,
            phone=payload.phone,
        )
        session.add(new_account)
        await session.commit()
        await session.refresh(new_account)

    token_payload = TokenPayload(id=new_account.id, email=new_account.email)
    access_token, expires_at = create_access_token(token_payload)
    return AuthenticatedResponse(
        user=AccountRead.from_orm(new_account),
        access_token=access_token,
        refresh_token=create_refresh_token(token_payload),
        expires_at=from_datetime_to_unix_timestamp(expires_at),
    )


@router.post("/login/", response_model=AuthenticatedResponse)
async def login(payload: AccountLogin, session: AsyncSession = Depends(get_session)):
    async with session:
        account = await session.execute(
            select(Account).where(Account.email == payload.email)
        )
        account = account.scalar_one_or_none()
        if not account:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
            )

        if not verify_password(payload.password, account.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect password"
            )

        token_payload = TokenPayload(id=account.id, email=account.email)
        access_token, expires_at = create_access_token(token_payload)
        return AuthenticatedResponse(
            user=AccountRead.from_orm(account),
            access_token=access_token,
            refresh_token=create_refresh_token(token_payload),
            expires_at=from_datetime_to_unix_timestamp(expires_at),
        )


# @router.post("/refresh/", response_model=AuthenticatedResponse)
# async def refresh(token_payload: TokenPayload = Depends(), session: AsyncSession = Depends(get_session)):
#     pass
