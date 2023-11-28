import asyncio

from app.config import settings
from sqlalchemy.orm import sessionmaker
from sqlmodel import create_engine, select
from sqlmodel.ext.asyncio.session import AsyncEngine, AsyncSession

DB_CONNECTION_STRING = settings.POSTGRES_CONNECTION_STRING

# sqlalchemy logs
echo = True if settings.ENV == "local" else False

engine = AsyncEngine(create_engine(DB_CONNECTION_STRING, echo=echo, future=True))


async def get_session() -> AsyncSession:
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with async_session() as session:
        yield session


async def read_or_create_type_by_name(session: AsyncSession, model_class, name):
    if not hasattr(model_class, "name"):
        raise ValueError(f"{model_class} is not an instance of TypeBase")

    name = name.strip().upper()
    statement = select(model_class).where(model_class.name == name)
    result = await session.execute(statement)
    instance = result.scalars().first()
    if not instance:
        instance = model_class(name=name)
        session.add(instance)
    return instance


async def read_or_create_types_by_names(session, model_class, names):
    coroutines = [read_or_create_type_by_name(session, model_class, name) for name in names]
    return await asyncio.gather(*coroutines)


async def read_type_by_name(session, model_class, name):
    result = await session.execute(select(model_class).where(model_class.name == name))
    return result.scalars().first()


async def read_type_by_id(session, model_class, id):
    result = await session.execute(select(model_class).where(model_class.id == id))
    return result.scalars().first()


async def read_types(session, model_class):
    types = await session.execute(select(model_class))
    types = types.scalars().all()
    return types
