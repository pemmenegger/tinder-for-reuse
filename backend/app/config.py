from pydantic import BaseSettings


class Settings(BaseSettings):
    # load and validate .env variables
    ENV: str = "prod"

    FRONTEND_URL: str

    BACKEND_ALLOWED_API_KEY: str
    BACKEND_JWT_SECRET_KEY: str
    BACKEND_JWT_EXPIRE_MINUTES = 15
    BACKEND_JWT_REFRESH_SECRET_KEY: str
    BACKEND_JWT_REFRESH_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days
    BACKEND_JWT_ALGORITHM = "HS256"

    POSTGRES_CONNECTION_STRING: str

    # LOG_FOLDER_ON_CONTAINER: str

    ITEMS_PER_PAGE = int = 20

    class Config:
        env_file = "./.env"


settings = Settings()
