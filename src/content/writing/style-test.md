---
title: Style test
description: Every element the prose styles need to handle. Draft only, never published.
date: 2026-10-07
draft: true
---

This draft exists to check the prose and code styles in `npm run dev`. It is excluded from production builds, the RSS feed and the sitemap.

## A second-level heading

A paragraph with **bold text**, a [link to the homepage](/) and an external [link](https://astro.build), plus some `inline code` and a longer sentence that should wrap comfortably inside a measure of around sixty-five characters.

### A third-level heading

- An unordered list item
- Another item with `code`
  - A nested item

1. An ordered list item
2. A second item

> A blockquote. It should read as a quiet aside, not a callout.

```ts
interface Post {
  title: string;
  date: Date;
  draft: boolean;
}

export function isPublished(post: Post): boolean {
  return !post.draft; // comments should stay readable in both themes
}
```

```bash
npm run verify
```

---

A final paragraph after a horizontal rule.
