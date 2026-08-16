import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client/index.js";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
const feeds = [
  { name: "Campus brief", slug: "campus-brief", sourceUrl: "https://lms.example.edu/feeds/campus.xml", description: "Updates from the learning platform.", items: [{ title: "Assessment 3 is now live", author: "LMS team", summary: "The data and reporting stage is ready for review.", link: "https://lms.example.edu/news/assessment-3" }, { title: "Library hours extended", author: "Student services", summary: "Evening access is available throughout the assessment period.", link: "https://lms.example.edu/news/library" }] },
  { name: "Engineering desk", slug: "engineering-desk", sourceUrl: "https://engineering.example.edu/rss", description: "Practical engineering and platform notes.", items: [{ title: "Observability patterns for small services", author: "M. Chen", summary: "A field guide to useful metrics without unnecessary noise.", link: "https://engineering.example.edu/posts/observability" }] },
  { name: "Student life", slug: "student-life", sourceUrl: "https://students.example.edu/feed.xml", description: "Events and opportunities for students.", items: [{ title: "Project showcase registrations", author: "Student union", summary: "Register your project for the end of semester showcase.", link: "https://students.example.edu/events/showcase" }] },
];

for (const feed of feeds) {
  const { items, ...data } = feed;
  const saved = await prisma.feed.upsert({ where: { slug: data.slug }, update: data, create: data });
  await prisma.feedItem.deleteMany({ where: { feedId: saved.id } });
  await prisma.feedItem.createMany({ data: items.map((item) => ({ ...item, feedId: saved.id, publishedAt: new Date() })) });
}

await prisma.requestLog.createMany({ data: [{ clientId: "rss-dashboard", method: "GET", path: "/api/metrics", status: 200, duration: 42 }, { clientId: "jmeter-client-01", method: "GET", path: "/api/feeds/campus-brief", status: 200, duration: 28 }, { clientId: "rss-reader", method: "GET", path: "/api/feeds/engineering-desk", status: 200, duration: 35 }] });
await prisma.$disconnect();