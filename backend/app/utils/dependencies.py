from app.config import settings
from fastapi import HTTPException, Security, status
from fastapi.security.api_key import APIKeyHeader


async def get_api_key(api_key: str = Security(APIKeyHeader(name="X-API-KEY", auto_error=False))):
    if api_key != settings.BACKEND_ALLOWED_API_KEY:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
