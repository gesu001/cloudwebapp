#!/bin/sh

# Apply committed migrations and load demo records.
npx prisma generate
npx prisma migrate deploy
npm run db:seed

# Start the app
npm run dev