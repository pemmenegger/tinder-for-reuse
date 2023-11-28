set -e

[ -f .env ] && rm .env

cp ../.env .env

npm install

npm run dev