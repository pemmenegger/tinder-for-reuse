#!/bin/bash
set -e

if [ ! -d ".venv" ]
then
    echo "Please run ./run_localhost.sh first"
    exit 1
fi

source .venv/bin/activate

if [ -z "$1" ]
then
    echo "Please provide a migration message"
    exit 1
fi

cp ../.env .env

# disable python bytecode generation
export PYTHONDONTWRITEBYTECODE=1

.venv/bin/alembic revision --autogenerate -m "$1"
