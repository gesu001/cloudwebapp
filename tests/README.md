# Assessment Tests

Start the Compose stack before running the tests:

```bash
docker-compose up -d
```

Run both Playwright server and client use cases from `frontend`:

```bash
cd frontend
npx playwright install chromium
npm run test:e2e
```

The server test performs feed CRUD through the API. The client test loads the feeds page, checks the filters and original-post link, then opens a dynamic feed page.