from app.api.building_elements import router as building_elements_router
from app.api.collectors import router as collectors_router
from app.api.contractors import router as contractors_router
from app.config import settings
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware

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
    building_elements_router,
    tags=["building-elements"],
    prefix="/api/building-elements",
)

app.include_router(
    collectors_router,
    tags=["collectors"],
    prefix="/api/collectors",
)

app.include_router(
    contractors_router,
    tags=["contractors"],
    prefix="/api/contractors",
)


@app.get("/")
def running():
    # for docker healthcheck needed
    return Response(status_code=status.HTTP_200_OK, content="Backend is running")


@app.get("/api/healthcheck")
def healthcheck():
    # for docker healthcheck needed
    return Response(status_code=status.HTTP_200_OK, content="Backend is healthy")
