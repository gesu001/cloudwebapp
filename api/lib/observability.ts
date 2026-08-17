import pino from "pino";
import { Counter, Histogram, Registry, collectDefaultMetrics } from "prom-client";

const registry = new Registry();
collectDefaultMetrics({ register: registry, prefix: "rss_api_" });

export const logger = pino({
    level: process.env.LOG_LEVEL ?? "info",
    base: { service: "rss-api" },
});

export const httpRequestsTotal = new Counter({
    name: "rss_api_http_requests_total",
    help: "Total number of API requests recorded by the application.",
    labelNames: ["method", "route", "status"],
    registers: [registry],
});

export const httpRequestDurationSeconds = new Histogram({
    name: "rss_api_http_request_duration_seconds",
    help: "API request duration in seconds.",
    labelNames: ["method", "route", "status"],
    buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5],
    registers: [registry],
});

export function metricsRoute(path: string) {
    return path.startsWith("/api/feeds/") ? "/api/feeds/:slug" : path;
}

export function prometheusMetrics() {
    return registry.metrics();
}

export const prometheusContentType = registry.contentType;