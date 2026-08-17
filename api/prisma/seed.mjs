import "dotenv/config";
import pg from "pg";

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const query = (text, values) => pool.query(text, values);

const feeds = [
  { name: "Campus brief", slug: "campus-brief", sourceUrl: "https://lms.example.edu/feeds/campus.xml", description: "Updates from the learning platform.", items: [{ title: "Assessment 3 is now live", author: "LMS team", summary: "The data and reporting stage is ready for review.", link: "https://lms.example.edu/news/assessment-3" }, { title: "Library hours extended", author: "Student services", summary: "Evening access is available throughout the assessment period.", link: "https://lms.example.edu/news/library" }] },
  { name: "Engineering desk", slug: "engineering-desk", sourceUrl: "https://engineering.example.edu/rss", description: "Practical engineering and platform notes.", items: [{ title: "Observability patterns for small services", author: "M. Chen", summary: "A field guide to useful metrics without unnecessary noise.", link: "https://engineering.example.edu/posts/observability" }] },
  { name: "Student life", slug: "student-life", sourceUrl: "https://students.example.edu/feed.xml", description: "Events and opportunities for students.", items: [{ title: "Project showcase registrations", author: "Student union", summary: "Register your project for the end of semester showcase.", link: "https://students.example.edu/events/showcase" }] },
];

for (const feed of feeds) {
  const { items, ...data } = feed;
  const saved = await query(`INSERT INTO "Feed" (name, slug, "sourceUrl", description, status, "lastFetched", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, 'healthy', NOW(), NOW(), NOW())
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name, "sourceUrl" = EXCLUDED."sourceUrl", description = EXCLUDED.description, "updatedAt" = NOW()
    RETURNING id`, [data.name, data.slug, data.sourceUrl, data.description]);
  const feedId = saved.rows[0].id;
  await query('DELETE FROM "FeedItem" WHERE "feedId" = $1', [feedId]);
  for (const item of items) await query(`INSERT INTO "FeedItem" ("feedId", title, author, summary, link, "publishedAt") VALUES ($1, $2, $3, $4, $5, NOW())`, [feedId, item.title, item.author, item.summary, item.link]);
}

await query(`INSERT INTO "RequestLog" ("clientId", method, path, status, duration, "createdAt") VALUES
  ('rss-dashboard', 'GET', '/api/metrics', 200, 42, NOW()),
  ('rss-reader', 'GET', '/api/feeds/engineering-desk', 200, 35, NOW())`);
await pool.end();