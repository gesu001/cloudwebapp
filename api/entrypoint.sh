#!/bin/sh

# Prepare the database from the committed schema and demo records.
npx prisma generate
npx prisma db push
npm run db:seed

# Start the app
npm run dev