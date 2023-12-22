#!/bin/bash
set -e

if [ ! -d ".venv" ]
then
    python3 -m venv .venv
fi

source .venv/bin/activate

.venv/bin/python3 -m pip install -r requirements.txt

cp ../.env .env

source .env

# disable python bytecode generation
export PYTHONDONTWRITEBYTECODE=1

# run backend
.venv/bin/uvicorn app.main:app --host 0.0.0.0 --port $BACKEND_PORT --reload