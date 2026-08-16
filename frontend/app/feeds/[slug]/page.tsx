"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Item = { id: number; title: string; author: string; summary: string; link: string; publishedAt: string };
type Feed = { name: string; slug: string; sourceUrl: string; description?: string; status: string; items: Item[] };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4080";

export default function FeedDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [feed, setFeed] = useState<Feed | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!slug) return;
        fetch(`${API_URL}/api/feeds/${slug}`, { headers: { "x-client-id": "rss-client" } })
            .then(async (response) => {
                if (!response.ok) throw new Error();
                setFeed(await response.json());
            })
            .catch(() => setError("This feed could not be loaded."));
    }, [slug]);

    if (error) return <main className="subpage shell"><Link className="back-link" href="/feeds">&#8592; All feeds</Link><p className="alert" role="alert">{error}</p></main>;
    if (!feed) return <main className="subpage shell"><Link className="back-link" href="/feeds">&#8592; All feeds</Link><p className="empty">Loading feed...</p></main>;

    return <main className="subpage shell"><Link className="back-link" href="/feeds">&#8592; All feeds</Link><section className="feed-detail-header"><div><p className="eyebrow">RSS FEED</p><h1>{feed.name}</h1><p className="subpage-lede">{feed.description || `Posts from ${feed.name}.`}</p><p className="feed-source">{feed.sourceUrl}</p></div><a className="primary source-button" href={feed.sourceUrl} target="_blank" rel="noreferrer">Visit source &#8599;</a></section><section className="feed-detail-items"><div className="panel-heading"><div><p className="eyebrow">LATEST POSTS</p><h2>{feed.items.length} {feed.items.length === 1 ? "post" : "posts"}</h2></div><span className="badge">{feed.status}</span></div>{feed.items.map((item) => <article className="feed-story" key={item.id}><p className="story-meta">{item.author} / {new Date(item.publishedAt).toLocaleDateString()}</p><h2>{item.title}</h2><p>{item.summary}</p><a href={item.link} target="_blank" rel="noreferrer">Read original post &#8599;</a></article>)}{!feed.items.length && <p className="empty">No posts are available for this feed.</p>}</section></main>;
}