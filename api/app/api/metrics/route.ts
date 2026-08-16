import { getDashboardMetrics } from "../../../lib/metrics";

export async function GET() {
  try {
    return Response.json(await getDashboardMetrics());
  } catch {
    return Response.json({ error: "Metrics unavailable" }, { status: 503 });
  }
}