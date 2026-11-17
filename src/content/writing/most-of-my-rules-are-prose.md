---
title: "Most of my rules are prose"
description: "Lauren Tan's talk on reliable AI coding felt familiar. It also showed me which layer most of my own setup sits on."
date: 2026-11-17
draft: true
short: "I got to a similar way of working with AI agents on my own: rules files, lessons, reviewer agents. Lauren Tan's talk showed me most of it sits at the top of her pyramid, as prose, the layer nothing enforces. Her answer is to turn a repeated mistake into a lint rule or a test."
---

I watched Lauren Tan's talk [All Code Is Slop (Except Mine)](https://www.youtube.com/watch?v=O_zcc6Xl12g), about getting reliable code out of AI agents. A lot of it felt familiar. I got to a similar way of working on my own, mostly by correcting the same agent mistakes again and again: rules in CLAUDE.md, a lessons file in every project, reviewer agents that see only the diff, and [vir](https://virwiki.dev), which turns my sessions into notes the agent reads next time.

Her talk also put those in their place. She describes a pyramid: types, lint rules and tests at the bottom, then verification, and prose rules at the very top, because nothing fails when an agent ignores them. Most of what I built sits in that top layer.

Some of it is lower. This site's CI fails on any extra JavaScript or a page over budget, and Fulcrum has 199 tests and an attack suite. But vir still writes lessons down as prose. In her [pstack](https://github.com/cursor/plugins/tree/main/pstack) skills, a mistake that happens twice becomes a lint rule or a test whose error names the fix, and docs are kept for judgment calls.

That's the part I want to borrow.
