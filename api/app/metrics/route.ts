import { prometheusContentType, prometheusMetrics } from "../../lib/observability";

export async function GET() {
    return new Response(await prometheusMetrics(), {
        headers: { "Content-Type": prometheusContentType },
    });
}