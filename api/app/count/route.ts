import { prisma } from "../../lib/prisma";

export async function GET() {
  try {
    const [requests, feeds, items] = await Promise.all([
      prisma.requestLog.count(),
      prisma.feed.count(),
      prisma.feedItem.count(),
    ]);
    return Response.json({ requests, feeds, items });
  } catch {
    return Response.json({ error: "Count unavailable" }, { status: 503 });
  }
}