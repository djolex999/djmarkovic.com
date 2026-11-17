---
title: "Most of my rules are prose"
description: "Lauren Tan's talk on reliable AI coding felt familiar. It also showed me which layer most of my own setup sits on."
date: 2026-11-17
draft: false
short: "I got to some of the same habits with AI agents on my own: rules files, lessons, reviewer agents. Lauren Tan's talk showed me most of it sits at the top of her pyramid, as prose, the layer nothing enforces. In her skills, a repeated mistake becomes a type, a lint rule or a test, and prose comes last."
---

I went through Lauren Tan's talk [All Code Is Slop (Except Mine)](https://www.youtube.com/watch?v=O_zcc6Xl12g), about getting reliable code out of AI agents. A lot of it felt familiar. I got to some of the same habits on my own, mostly by correcting the same agent mistakes again and again: rules in CLAUDE.md, a lessons file in most projects, reviewer agents that see only the diff and the spec, and [vir](https://virwiki.dev), which turns my sessions into notes the agent reads next time.

Her talk also put those in their place. She describes a pyramid: types, lint rules and tests at the bottom, then verification, and prose rules at the very top, because they are the least reliable. Most of what I built sits in that top layer.

Some of it is lower. This site's CI fails on any extra JavaScript or a page over budget, and Fulcrum has 199 tests and an attack suite. But vir still writes lessons down as prose. In her [pstack](https://github.com/cursor/plugins/tree/main/pstack) skills, a mistake that happens twice gets fixed in the architecture or the types first, then with a lint rule whose error names the fix, then a test. Docs come last, only for judgment calls.

That's the part I want to borrow.
