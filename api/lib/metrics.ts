import { prisma } from "./prisma";
import { httpRequestDurationSeconds, httpRequestsTotal, logger, metricsRoute } from "./observability";

export async function recordRequest(input: {
    feedId?: number;
    clientId: string;
    method: string;
    path: string;
    status: number;
    startedAt: number;
}) {
    const durationMs = Date.now() - input.startedAt;
    const route = metricsRoute(input.path);
    const labels = { method: input.method, route, status: String(input.status) };
    httpRequestsTotal.inc(labels);
    httpRequestDurationSeconds.observe(labels, durationMs / 1000);
    logger.info({ ...labels, clientId: input.clientId, feedId: input.feedId, durationMs }, "request completed");

    try {
        await prisma.requestLog.create({
            data: {
                feedId: input.feedId,
                clientId: input.clientId,
                method: input.method,
                path: input.path,
                status: input.status,
                duration: durationMs,
            },
        });
    } catch (error) {
        logger.error({ err: error, ...labels }, "request log persistence failed");
        throw error;
    }
}

export async function getDashboardMetrics() {
    const [feeds, totalRequests, uniqueClients, requestsByFeed, requestsByClient, recentRequests] =
        await Promise.all([
            prisma.feed.findMany({
                select: { id: true, name: true, slug: true, status: true, lastFetched: true, _count: { select: { items: true } } },
                orderBy: { name: "asc" },
            }),
            prisma.requestLog.count(),
            prisma.requestLog.findMany({ distinct: ["clientId"], select: { clientId: true } }),
            prisma.requestLog.groupBy({ by: ["feedId"], _count: { _all: true }, orderBy: { _count: { feedId: "desc" } }, take: 6 }),
            prisma.requestLog.groupBy({ by: ["clientId"], _count: { _all: true }, orderBy: { _count: { clientId: "desc" } }, take: 6 }),
            prisma.requestLog.findMany({ take: 8, orderBy: { createdAt: "desc" }, include: { feed: { select: { name: true } } } }),
        ]);

    const feedNames = new Map(feeds.map((feed) => [feed.id, feed.name]));

    return {
        summary: {
            totalFeeds: feeds.length,
            healthyFeeds: feeds.filter((feed) => feed.status === "healthy").length,
            warningFeeds: feeds.filter((feed) => feed.status !== "healthy").length,
            totalItems: feeds.reduce((total, feed) => total + feed._count.items, 0),
            totalRequests,
            uniqueClients: uniqueClients.length,
        },
        feeds: feeds.map(({ _count, ...feed }) => ({ ...feed, itemCount: _count.items })),
        requestsByFeed: requestsByFeed.map((row) => ({ feed: row.feedId ? feedNames.get(row.feedId) ?? "Unknown feed" : "Unassigned", requests: row._count._all })),
        requestsByClient: requestsByClient.map((row) => ({ client: row.clientId, requests: row._count._all })),
        recentRequests,
    };
}