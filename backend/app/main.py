from app.api.accounts import router as accounts_router
from app.api.collectors import router as collectors_router
from app.api.crawler.collectors import router as crawler_collectors_router
from app.api.items.building_elements import router as building_elements_router
from app.config import settings

# from app.shared.helpers import init_logging
from app.shared.types import ItemCategoryEnum
from app.utils.dependencies import get_api_key
from fastapi import Depends, FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware

# init_logging("backend.log")
app = FastAPI()

origins = [
    settings.FRONTEND_URL,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    crawler_collectors_router,
    tags=["crawler-collectors"],
    prefix="/api/crawler/collectors",
    dependencies=[Depends(get_api_key)],
)

app.include_router(
    building_elements_router,
    tags=[f"items-{ItemCategoryEnum.BUILDING_ELEMENT.slug}"],
    prefix=f"/api/items/{ItemCategoryEnum.BUILDING_ELEMENT.slug}",
)

app.include_router(
    collectors_router,
    tags=["collectors"],
    prefix="/api/collectors",
)


app.include_router(accounts_router, tags=["accounts"], prefix="/api/accounts")


@app.get("/")
def running():
    # for docker healthcheck needed
    return Response(status_code=status.HTTP_200_OK, content="Backend is running")


@app.get("/api/healthcheck")
def healthcheck():
    # for docker healthcheck needed
    return Response(status_code=status.HTTP_200_OK, content="Backend is healthy")
