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

## External assessment evidence

Run JMeter from the laptop where it is installed against the deployed API. Use staged levels such as 1, 10, 100, 1000, and 10000 clients, covering `GET /health` and `GET /api/feeds`. Save the JMeter result files and screenshots showing throughput, average latency, error percentage, and the dashboard's request totals and unique clients after each stage.

Run the accessibility review separately in Chrome DevTools Lighthouse against the deployed frontend. Record the Accessibility, Performance, Best Practices, and SEO scores, and save the report or screenshots with the submission evidence. Playwright remains the automated end-to-end test run documented above.