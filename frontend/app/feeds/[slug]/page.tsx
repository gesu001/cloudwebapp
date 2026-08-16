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
    const [page, setPage] = useState(1);

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

    const pageSize = 5;
    const pageCount = Math.max(1, Math.ceil(feed.items.length / pageSize));
    const visibleItems = feed.items.slice((page - 1) * pageSize, page * pageSize);
    return <main className="subpage shell"><Link className="back-link" href="/feeds">&#8592; All feeds</Link><section className="feed-detail-header"><div><p className="eyebrow">RSS FEED</p><h1>{feed.name}</h1><p className="subpage-lede">{feed.description || `Posts from ${feed.name}.`}</p><a className="feed-source" href={feed.sourceUrl} target="_blank" rel="noreferrer">{feed.sourceUrl} &#8599;</a></div><a className="primary source-button" href={feed.sourceUrl} target="_blank" rel="noreferrer">Visit source &#8599;</a></section><section className="feed-detail-items"><div className="panel-heading"><div><p className="eyebrow">LATEST POSTS</p><h2>{feed.items.length} {feed.items.length === 1 ? "post" : "posts"}</h2></div><span className="badge">{feed.status}</span></div>{visibleItems.map((item) => <article className="feed-story" key={item.id}><p className="story-meta">{item.author} / {new Date(item.publishedAt).toLocaleDateString()}</p><h2>{item.title}</h2><p>{item.summary}</p><a href={item.link} target="_blank" rel="noreferrer">Read original post &#8599;</a></article>)}{!feed.items.length && <p className="empty">No posts are available for this feed.</p>}{feed.items.length > 0 && <Pagination page={page} pageCount={pageCount} onPrevious={() => setPage((current) => current - 1)} onNext={() => setPage((current) => current + 1)} />}</section></main>;
}

function Pagination({ page, pageCount, onPrevious, onNext }: { page: number; pageCount: number; onPrevious: () => void; onNext: () => void }) { return <nav className="pagination" aria-label="Pagination"><button type="button" onClick={onPrevious} disabled={page === 1}>Previous</button><span>Page {page} of {pageCount}</span><button type="button" onClick={onNext} disabled={page === pageCount}>Next</button></nav>; }