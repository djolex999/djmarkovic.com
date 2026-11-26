---
title: "My eval turned off my own feature"
description: "vir shipped with MMR reranking on by default for five months. When I rebuilt its retrieval eval, it showed the default made search worse."
date: 2026-11-26
draft: true
short: "In May I made MMR reranking the default in vir's search. When I rebuilt vir's retrieval eval in October, it showed MMR made results worse with both embedding models, so it's off by default now. The same eval caught a second default I'd chosen."
---

In May I added MMR to [vir](https://virwiki.dev)'s search. It reranks results so they don't all say the same thing: a little less relevance for a little more variety. I made it the default, and `vir init` wrote it into every new config.

In October I rebuilt vir's retrieval eval: 54 queries, each with its results judged for relevance. MMR made results worse with both embedding models vir supports. The score for the top eight results (nDCG@8) fell by 0.089 with one and 0.079 with the other. With nomic it also pulled off-topic notes into the top results, because they were unlike everything else. That's what diversity rewards.

So since 0.29.0 it's off by default, and existing installs were migrated once from the old value.

The same eval caught a second default. Notes I had approved got a fixed boost, and an accepted rule ended up first or second for almost every query, including unrelated ones. Now the boost only breaks near-ties.
