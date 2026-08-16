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

## JMeter staged load

The plan is `tests/jmeter/rss-load-test.jmx`. Run one level at a time and save a separate result file for comparison:

```bash
jmeter -n -t tests/jmeter/rss-load-test.jmx -Jthreads=1 -l results/rss-x1.jtl
jmeter -n -t tests/jmeter/rss-load-test.jmx -Jthreads=10 -l results/rss-x10.jtl
jmeter -n -t tests/jmeter/rss-load-test.jmx -Jthreads=100 -l results/rss-x100.jtl
jmeter -n -t tests/jmeter/rss-load-test.jmx -Jthreads=1000 -l results/rss-x1000.jtl
jmeter -n -t tests/jmeter/rss-load-test.jmx -Jthreads=10000 -l results/rss-x10000.jtl
```

Each simulated client performs a health request and an RSS feed retrieval. Compare throughput, average latency, error percentage, and the API's `RequestLog` totals between levels. The x1000 and x10000 stages should be run only after confirming the EC2 instance has sufficient CPU, memory, connection capacity, and disk space.