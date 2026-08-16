#!/bin/sh

# Wait for Postgres to be available
bash ./wait-for-it.sh postgres:5432 --timeout=30 --strict -- echo "Postgres is up"

# Prepare the database from the committed schema and demo records.
npx prisma generate
npx prisma db push
npm run db:seed

# Start the app
npm run dev