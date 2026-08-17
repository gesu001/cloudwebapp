import { prisma } from "../../lib/prisma";

export async function GET() {
  const timestamp = new Date().toISOString();

  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok", service: "rss-api", database: "ok", timestamp });
  } catch {
    return Response.json({ status: "error", service: "rss-api", database: "unavailable", timestamp }, { status: 503 });
  }
}