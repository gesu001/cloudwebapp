"use client";

import { FormEvent, useEffect, useState } from "react";

type FeedItem = { id: number; title: string; author: string; summary: string; link: string; publishedAt: string };
type Feed = { id: number; name: string; slug: string; sourceUrl: string; status: string; itemCount?: number; items?: FeedItem[] };
type Metrics = {
    summary: { totalFeeds: number; healthyFeeds: number; warningFeeds: number; totalItems: number; totalRequests: number; uniqueClients: number };
    feeds: Feed[];
    requestsByFeed: { feed: string; requests: number }[];
    requestsByClient: { client: string; requests: number }[];
    recentRequests: { id: number; clientId: string; method: string; path: string; status: number; duration: number; createdAt: string; feed?: { name: string } }[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4080";

export default function DashboardPage() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [health, setHealth] = useState<"healthy" | "offline">("offline");

    async function refresh() {
        try {
            const healthResponse = await fetch(`${API_URL}/health`, { cache: "no-store" });
            const response = await fetch(`${API_URL}/api/metrics`, { cache: "no-store" });
            if (!healthResponse.ok || !response.ok) throw new Error("API unavailable");
            setMetrics(await response.json());
            setHealth("healthy");
            setError("");
        } catch {
            setHealth("offline");
            setError("The API is offline. Start the API service to load live data.");
        }
    }

    useEffect(() => {
        const timer = window.setTimeout(() => { void refresh(); }, 0);
        return () => window.clearTimeout(timer);
    }, []);

    async function openFeed(feed: Feed) {
        const response = await fetch(`${API_URL}/api/feeds/${feed.slug}`, { headers: { "x-client-id": "rss-dashboard" } });
        if (response.ok) setSelectedFeed(await response.json());
    }

    async function createFeed(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const response = await fetch(`${API_URL}/api/feeds`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-client-id": "rss-dashboard" },
            body: JSON.stringify({ name: form.get("name"), slug: form.get("slug"), sourceUrl: form.get("sourceUrl") }),
        });
        if (response.ok) { setShowForm(false); event.currentTarget.reset(); refresh(); }
    }

    const summary = metrics?.summary;
    return (
        <main className="shell">
            <section className="intro"><div><p className="eyebrow">RSS SERVER / LMS NETWORK</p><h1>RSS operations dashboard</h1><p className="lede">A working view of feeds, clients, and the requests moving through the RSS server.</p></div><div className={`health ${health}`}><span className="health-icon">{health === "healthy" ? "+" : "!"}</span><div><strong>{health === "healthy" ? "System healthy" : "System offline"}</strong><span>{health === "healthy" ? "API response nominal" : "API unavailable"}</span></div></div></section>
            {error && <div className="alert" role="alert">{error}</div>}
            <section className="metrics" aria-label="System summary"><Metric label="Total requests" value={summary?.totalRequests ?? "--"} detail="All recorded traffic" /><Metric label="Active feeds" value={summary?.totalFeeds ?? "--"} detail={`${summary?.healthyFeeds ?? "--"} healthy`} accent /><Metric label="Unique clients" value={summary?.uniqueClients ?? "--"} detail="Distinct identifiers" /><Metric label="Published items" value={summary?.totalItems ?? "--"} detail={`${summary?.warningFeeds ?? 0} feeds need review`} warning={Boolean(summary?.warningFeeds)} /></section>
            <section className="content-grid"><div className="panel feeds-panel"><div className="panel-heading"><div><p className="eyebrow">CONTENT SOURCES</p><h2>RSS feeds</h2></div><button className="primary" onClick={() => setShowForm(!showForm)}>+ Add feed</button></div>{showForm && <form className="feed-form" onSubmit={createFeed}><input name="name" placeholder="Feed name" required /><input name="slug" placeholder="feed-slug" required /><input name="sourceUrl" type="url" placeholder="https://example.com/feed.xml" required /><button className="primary" type="submit">Create feed</button></form>}<div className="feed-list">{metrics?.feeds.map((feed) => <button className="feed-row" key={feed.id} onClick={() => openFeed(feed)}><span className={`status ${feed.status}`} /><span className="feed-name"><strong>{feed.name}</strong><small>{feed.slug}</small></span><span className="item-count">{feed.itemCount ?? 0} items</span><span className="arrow">&#8599;</span></button>)}{!metrics?.feeds.length && !error && <p className="empty">No feeds found. Add one or run the seed script.</p>}</div></div><div className="panel traffic-panel"><div className="panel-heading"><div><p className="eyebrow">OBSERVABILITY</p><h2>Traffic by feed</h2></div><span className="time-range">Since launch</span></div><Bars rows={metrics?.requestsByFeed ?? []} /><div className="divider" /><div className="panel-heading compact"><h2>Top clients</h2><span className="time-range">Requests</span></div><Bars rows={(metrics?.requestsByClient ?? []).map((row) => ({ feed: row.client, requests: row.requests }))} /></div></section>
            <section className="panel activity"><div className="panel-heading"><div><p className="eyebrow">REQUEST LOG</p><h2>Recent activity</h2></div><span className="badge">{summary?.totalRequests ?? 0} tracked</span></div><div className="table-wrap"><table><thead><tr><th>Endpoint</th><th>Client</th><th>Feed</th><th>Status</th><th>Latency</th><th>Time</th></tr></thead><tbody>{metrics?.recentRequests.map((request) => <tr key={request.id}><td><code>{request.method} {request.path}</code></td><td>{request.clientId}</td><td>{request.feed?.name ?? "System"}</td><td><span className={`http-status ${request.status < 400 ? "ok" : "bad"}`}>{request.status}</span></td><td>{request.duration} ms</td><td>{new Date(request.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td></tr>)}</tbody></table></div></section>
            {selectedFeed && <div className="modal-backdrop" onClick={() => setSelectedFeed(null)}><article className="reader" onClick={(event) => event.stopPropagation()}><button className="close" onClick={() => setSelectedFeed(null)} aria-label="Close feed">x</button><p className="eyebrow">RSS READER</p><h2>{selectedFeed.name}</h2><p className="source">{selectedFeed.sourceUrl}</p>{selectedFeed.items?.map((item) => <div className="story" key={item.id}><p className="story-meta">{item.author} / {new Date(item.publishedAt).toLocaleDateString()}</p><h3>{item.title}</h3><p>{item.summary}</p><a href={item.link} target="_blank" rel="noreferrer">READ ORIGINAL POST &#8599;</a></div>)}</article></div>}
        </main>
    );
}

function Metric({ label, value, detail, accent, warning }: { label: string; value: string | number; detail: string; accent?: boolean; warning?: boolean }) { return <article className={`metric ${accent ? "accent" : ""}`}><span>{label}</span><strong>{value}</strong><small className={warning ? "warning-text" : ""}>{detail}</small></article>; }
function Bars({ rows }: { rows: { feed: string; requests: number }[] }) { const max = Math.max(...rows.map((row) => row.requests), 1); return <div className="bars">{rows.length ? rows.map((row) => <div className="bar-row" key={row.feed}><div><span>{row.feed}</span><strong>{row.requests}</strong></div><div className="bar-track"><i style={{ width: `${Math.max((row.requests / max) * 100, 4)}%` }} /></div></div>) : <p className="empty">No request data yet.</p>}</div>; }