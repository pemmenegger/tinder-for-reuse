from pydantic import BaseSettings


class Settings(BaseSettings):
    # load and validate .env variables
    ENV: str = "prod"
    FRONTEND_URL: str
    POSTGRES_CONNECTION_STRING: str

    class Config:
        env_file = "./.env"


settings = Settings()
