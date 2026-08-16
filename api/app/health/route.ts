export function GET() {
  return Response.json({ status: "ok", service: "rss-api", timestamp: new Date().toISOString() });
}