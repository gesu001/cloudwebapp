import { prisma } from "../../../../lib/prisma";
import { recordRequest } from "../../../../lib/metrics";

type Context = { params: Promise<{ slug: string }> };

export async function GET(request: Request, context: Context) {
  const startedAt = Date.now();
  const clientId = request.headers.get("x-client-id") ?? "rss-reader";
  const { slug } = await context.params;
  const feed = await prisma.feed.findUnique({ where: { slug }, include: { items: { orderBy: { publishedAt: "desc" } } } });
  const status = feed ? 200 : 404;
  await recordRequest({ clientId, feedId: feed?.id, method: "GET", path: `/api/feeds/${slug}`, status, startedAt });
  return feed ? Response.json(feed) : Response.json({ error: "Feed not found" }, { status });
}

export async function PATCH(request: Request, context: Context) {
  const startedAt = Date.now();
  const clientId = request.headers.get("x-client-id") ?? "dashboard-client";
  const { slug } = await context.params;
  try {
    const body = await request.json();
    const feed = await prisma.feed.update({
      where: { slug },
      data: {
        name: body.name,
        sourceUrl: body.sourceUrl,
        description: body.description,
        status: body.status,
        lastFetched: body.lastFetched ? new Date(body.lastFetched) : undefined,
      },
      include: { items: true },
    });
    await recordRequest({ clientId, feedId: feed.id, method: "PATCH", path: `/api/feeds/${slug}`, status: 200, startedAt });
    return Response.json(feed);
  } catch {
    await recordRequest({ clientId, method: "PATCH", path: `/api/feeds/${slug}`, status: 404, startedAt });
    return Response.json({ error: "Feed not found or update payload is invalid" }, { status: 404 });
  }
}

export async function DELETE(request: Request, context: Context) {
  const startedAt = Date.now();
  const clientId = request.headers.get("x-client-id") ?? "dashboard-client";
  const { slug } = await context.params;
  const feed = await prisma.feed.findUnique({ where: { slug }, select: { id: true } });
  if (!feed) return Response.json({ error: "Feed not found" }, { status: 404 });
  await prisma.feed.delete({ where: { slug } });
  await recordRequest({ clientId, feedId: feed.id, method: "DELETE", path: `/api/feeds/${slug}`, status: 204, startedAt });
  return new Response(null, { status: 204 });
}