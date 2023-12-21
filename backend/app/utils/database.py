from app.config import settings
from app.models.unified_type_model import UnifiedType
from fastapi import HTTPException, status
from sqlalchemy.orm import sessionmaker
from sqlmodel import create_engine, select

DB_CONNECTION_STRING = settings.POSTGRES_CONNECTION_STRING

# sqlalchemy logs
echo = True if settings.ENV == "local" else False

engine = create_engine(DB_CONNECTION_STRING, echo=echo, future=True)


def get_session():
    Session = sessionmaker(bind=engine, expire_on_commit=False)
    with Session() as session:
        yield session


def read_or_create_type_by_name(session, model_class, name):
    if not hasattr(model_class, "name"):
        raise ValueError(f"{model_class} is not an instance of UnifiedTypeBase")

    name = name.strip().upper()
    statement = select(model_class).where(model_class.name == name)
    result = session.execute(statement)
    instance = result.scalars().first()
    if not instance:
        instance = model_class(name=name)
        session.add(instance)
        session.commit()
    return instance


def read_or_create_types_by_names(session, model_class, names):
    instances = [read_or_create_type_by_name(session, model_class, name) for name in names]
    return instances


def read_types(session, type_class):
    types = session.execute(select(UnifiedType).where(UnifiedType.discriminator == type_class.DISCRIMINATOR))
    types = types.scalars().all()
    return types


def read_type_by_value_or_throw(session, type_class, value):
    instance = session.execute(
        select(UnifiedType)
        .where(UnifiedType.discriminator == type_class.DISCRIMINATOR)
        .where(UnifiedType.type_label == value)
    )
    instance = instance.scalars().first()
    if not instance:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"type discriminator <{type_class.DISCRIMINATOR}> with value <{value}> not found",
        )
    return instance


def read_types_by_values_or_throw(session, type_class, values):
    instances = []
    for value in values:
        instance = read_type_by_value_or_throw(session, type_class, value)
        instances.append(instance)
    return instances
