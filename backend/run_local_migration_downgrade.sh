#!/bin/bash
set -e

if [ ! -d ".venv" ]
then
    echo "Please run ./run_localhost.sh first"
    exit 1
fi

source .venv/bin/activate

cp ../.env .env

# disable python bytecode generation
export PYTHONDONTWRITEBYTECODE=1

.venv/bin/alembic downgrade -1
