# RSS Server and LMS

Assessment 2 implementation: a Next.js RSS client, a Prisma/PostgreSQL RSS API, and Docker Compose deployment.

## Run with Docker

```bash
docker-compose up --build
```

For the EC2 host `ec2-54-84-138-176.compute-1.amazonaws.com`, the services are available at:

- Frontend: http://ec2-54-84-138-176.compute-1.amazonaws.com
- API: http://ec2-54-84-138-176.compute-1.amazonaws.com:4080
- PostgreSQL: localhost:5432

The API container waits for PostgreSQL, applies the Prisma schema with `prisma db push`, and loads demo records.

## API endpoints

- `GET /health` - service health response
- `GET /count` - request, feed, and item totals
- `GET /api/feeds` - list feeds with RSS items
- `POST /api/feeds` - create a feed
- `GET /api/feeds/:slug` - read one feed for the RSS client
- `PATCH /api/feeds/:slug` - update feed metadata
- `DELETE /api/feeds/:slug` - remove a feed and its items
- `GET /api/metrics` - feed and request summaries used by the client

## Local API commands

```bash
cd api
npm install
npm run db:push
npm run db:seed
npm run dev
```

The local database URL is configured in `api/.env`. Do not commit real credentials or `.env` files.

## Demonstration flow

1. Start the stack with `docker-compose up --build`.
2. Open the frontend and show database-backed feeds.
3. Select a feed to show the RSS client view.
4. Use the dashboard form to create a feed and refresh the list.
5. Run `curl http://localhost:4080/health` and `curl http://localhost:4080/count` in the API container or host shell.
6. Show the API, frontend, and PostgreSQL containers with `docker-compose ps`.
