"use client";

import { useEffect, useState } from "react";

type Item = { id: number; title: string; author: string; summary: string; link: string; publishedAt: string };
type Feed = { id: number; name: string; slug: string; sourceUrl: string; description?: string; items: Item[] };
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4080";

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [error, setError] = useState("");
  useEffect(() => { fetch(`${API_URL}/api/feeds`, { headers: { "x-client-id": "rss-client" } }).then(async (response) => { if (!response.ok) throw new Error(); setFeeds(await response.json()); }).catch(() => setError("The RSS Server is unavailable. Start the API service and refresh the page.")); }, []);
  return <main className="subpage shell"><p className="eyebrow">RSS CLIENT</p><h1>Feeds / Posts</h1><p className="subpage-lede">A learner-friendly reading view powered by the RSS Server API.</p>{error && <p className="alert" role="alert">{error}</p>}<div className="posts-grid">{feeds.flatMap((feed) => feed.items.map((item) => <article className="post-card" key={item.id}><p className="story-meta">{feed.name} / {new Date(item.publishedAt).toLocaleDateString()}</p><h2>{item.title}</h2><p>{item.summary}</p><p className="post-author">Posted by {item.author}</p><a href={item.link} target="_blank" rel="noreferrer">Read more &#8599;</a></article>))}{!feeds.length && !error && <p className="empty">Loading posts from the RSS Server...</p>}</div></main>;
}
