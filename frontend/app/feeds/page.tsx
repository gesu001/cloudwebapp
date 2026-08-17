"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Item = { id: number; title: string; author: string; summary: string; link: string; publishedAt: string };
type Feed = { id: number; name: string; slug: string; sourceUrl: string; description?: string; items: Item[] };
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4080";

export default function FeedsPage() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [error, setError] = useState("");
  const [slugFilter, setSlugFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  useEffect(() => { fetch(`${API_URL}/api/feeds`, { headers: { "x-client-id": "rss-client" } }).then(async (response) => { if (!response.ok) throw new Error(); setFeeds(await response.json()); }).catch(() => setError("The RSS Server is unavailable. Start the API service and refresh the page.")); }, []);
  const filteredPosts = feeds.flatMap((feed) => feed.items.filter((item) => {
    const publishedDate = item.publishedAt.slice(0, 10);
    return (!slugFilter || feed.slug === slugFilter) && (!fromDate || publishedDate >= fromDate) && (!toDate || publishedDate <= toDate);
  }).map((item) => ({ feed, item })));
  const pageSize = 6;
  const pageCount = Math.max(1, Math.ceil(filteredPosts.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const visiblePosts = filteredPosts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const clearFilters = () => { setSlugFilter(""); setFromDate(""); setToDate(""); setPage(1); };
  return <main className="subpage shell"><p className="eyebrow">RSS CLIENT</p><h1>Feeds / Posts</h1><p className="subpage-lede">A learner-friendly reading view powered by the RSS Server API.</p>{error && <p className="alert" role="alert">{error}</p>}<section className="filter-panel" aria-label="Filter posts"><div className="filter-field"><label htmlFor="feed-slug">Feed slug</label><select id="feed-slug" value={slugFilter} onChange={(event) => setSlugFilter(event.target.value)}><option value="">All feeds</option>{feeds.map((feed) => <option value={feed.slug} key={feed.id}>{feed.slug}</option>)}</select></div><div className="filter-field"><label htmlFor="from-date">From date</label><input id="from-date" type="date" value={fromDate} onChange={(event) => setFromDate(event.target.value)} /></div><div className="filter-field"><label htmlFor="to-date">To date</label><input id="to-date" type="date" value={toDate} onChange={(event) => setToDate(event.target.value)} /></div><button className="filter-clear" type="button" onClick={clearFilters}>Clear filters</button><span className="filter-count">{filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}</span></section><div className="posts-grid">{visiblePosts.map(({ feed, item }) => <article className="post-card" key={item.id}><p className="story-meta">{feed.name} / {new Date(item.publishedAt).toLocaleDateString()}</p><h2>{item.title}</h2><p>{item.summary}</p><p className="post-author">Posted by {item.author}</p><div className="post-actions"><Link className="feed-link" href={`/feeds/${feed.slug}`}>View feed &#8599;</Link><a className="primary post-source" href={item.link} target="_blank" rel="noreferrer">Read original post &#8599;</a></div></article>)}{!feeds.length && !error && <p className="empty">Loading posts from the RSS Server...</p>}{feeds.length > 0 && !filteredPosts.length && <p className="empty">No posts match the selected filters.</p>}</div>{filteredPosts.length > 0 && <Pagination page={page} pageCount={pageCount} onPrevious={() => setPage((current) => current - 1)} onNext={() => setPage((current) => current + 1)} />}</main>;
}

function Pagination({ page, pageCount, onPrevious, onNext }: { page: number; pageCount: number; onPrevious: () => void; onNext: () => void }) { return <nav className="pagination" aria-label="Pagination"><button type="button" onClick={onPrevious} disabled={page === 1}>Previous</button><span>Page {page} of {pageCount}</span><button type="button" onClick={onNext} disabled={page === pageCount}>Next</button></nav>; }
