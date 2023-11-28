from fastapi import APIRouter

router = APIRouter()


@router.post("/")
async def create_collectors():
    print("create_collectors")
