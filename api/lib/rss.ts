import Parser from "rss-parser";

const parser = new Parser();

export type ImportedFeedItem = {
    title: string;
    author: string;
    summary: string;
    link: string;
    publishedAt: Date;
};

export async function importFeedItems(sourceUrl: string): Promise<ImportedFeedItem[]> {
    const response = await fetch(sourceUrl, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Feed returned HTTP ${response.status}`);
    const parsed = await parser.parseString(await response.text());

    return parsed.items
        .filter((item) => item.link && item.title)
        .slice(0, 25)
        .map((item) => ({
            title: item.title ?? "Untitled",
            author: item.creator ?? item.author ?? "Unknown author",
            summary: item.contentSnippet ?? item.content ?? item.summary ?? "",
            link: item.link as string,
            publishedAt: item.isoDate ? new Date(item.isoDate) : item.pubDate ? new Date(item.pubDate) : new Date(),
        }));
}