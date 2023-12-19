from app.config import settings
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
        raise ValueError(f"{model_class} is not an instance of TypeBase")

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


def read_type_by_name(session, model_class, name):
    result = session.execute(select(model_class).where(model_class.name == name))
    return result.scalars().first()


def read_type_by_id(session, model_class, id):
    result = session.execute(select(model_class).where(model_class.id == id))
    return result.scalars().first()


def read_types(session, model_class):
    types = session.execute(select(model_class))
    types = types.scalars().all()
    return types


def read_types_by_name_or_throw(session, model_class, names):
    instances = []
    for name in names:
        instance = read_type_by_name(session, model_class, name)
        if not instance:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail=f"{model_class} with name {name} not found"
            )
        instances.append(instance)
    return instances
