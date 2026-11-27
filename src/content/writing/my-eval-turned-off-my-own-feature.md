---
title: "My eval turned off my own feature"
description: "vir shipped with MMR reranking on by default for almost five months. When I rebuilt its retrieval eval, it showed the default made search worse."
date: 2026-11-27
draft: false
short: "In May I made MMR reranking the default in vir's search. When I rebuilt vir's retrieval eval in October, it showed MMR made results worse with both embedding models, so it's off by default now. The same eval caught a second ranking choice of mine."
---

In May I added MMR to [vir](https://virwiki.dev)'s search. It reranks results so they don't all say the same thing: a little less relevance for a little more variety. I made it the default, and `vir init` wrote it into every new config.

In October I rebuilt vir's retrieval eval: 54 queries, with a model (Claude Sonnet 5) grading how relevant each result was. MMR made results worse with both embedding models vir supports, nomic and bge. The score for the top eight results (nDCG@8, on a 0 to 1 scale) fell by 0.089 with nomic and 0.079 with bge. That's from 0.50 to 0.41 and from 0.62 to 0.54. With nomic it also pulled off-topic notes into the top results, because they were unlike everything else, and that is what MMR rewards.

The first version of the eval, in September, had already shown a smaller drop with nomic: 0.037 over 30 queries. The default stayed on until the rebuild.

So since 0.29.0 it's off by default, and existing installs were migrated once from the old value.

The same eval caught a second ranking choice of mine. Notes I had approved got a fixed boost, and one of them ended up first or second for almost every query, including unrelated ones. Now the boost only applies to notes that already rank near the top.

MMR is still there. Setting `retrievalDiversity` in the config turns it back on.
