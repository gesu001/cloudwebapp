import { prisma } from "../../../lib/prisma";
import { recordRequest } from "../../../lib/metrics";

export async function GET(request: Request) {
  const startedAt = Date.now();
  const clientId = request.headers.get("x-client-id") ?? "dashboard-client";
  try {
    const feeds = await prisma.feed.findMany({ include: { items: { orderBy: { publishedAt: "desc" } } }, orderBy: { name: "asc" } });
    await recordRequest({ clientId, method: "GET", path: "/api/feeds", status: 200, startedAt });
    return Response.json(feeds);
  } catch {
    await recordRequest({ clientId, method: "GET", path: "/api/feeds", status: 503, startedAt });
    return Response.json({ error: "Feeds unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const startedAt = Date.now();
  const clientId = request.headers.get("x-client-id") ?? "dashboard-client";
  try {
    const body = await request.json();
    if (!body.name || !body.slug || !body.sourceUrl) {
      return Response.json({ error: "name, slug, and sourceUrl are required" }, { status: 400 });
    }
    const feed = await prisma.feed.create({ data: { name: body.name, slug: body.slug, sourceUrl: body.sourceUrl, description: body.description } });
    await recordRequest({ clientId, method: "POST", path: "/api/feeds", status: 201, startedAt });
    return Response.json(feed, { status: 201 });
  } catch {
    await recordRequest({ clientId, method: "POST", path: "/api/feeds", status: 400, startedAt });
    return Response.json({ error: "Unable to create feed" }, { status: 400 });
  }
}