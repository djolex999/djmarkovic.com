import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"writing">;

const WORDS_PER_MINUTE = 230;

/** Published posts, newest first. Drafts are visible in dev only. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("writing", ({ data }) => !(import.meta.env.PROD && data.draft));
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function readingMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

/** ISO calendar date (UTC), e.g. 2026-10-07. */
export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
