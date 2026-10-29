---
title: "My benchmark was wrong before the models were"
description: "I built serbeval to test how well language models handle Serbian. The first thing it caught was mistakes in my own answer key."
date: 2026-10-29
draft: false
---

One of the recommendations in my thesis was to check how well AI handles Serbian instead of assuming it matches English. [serbeval](https://github.com/djolex999/serbeval) is my small attempt at that: a benchmark for things translated English tests can't check, like the aorist, jat, č/ć and pravopis.

The first problems it found were mine.

Early on, a model that always answered "A" scored between 60 and 80 percent. My correct answers weren't spread evenly across the options. Now the build fails if they drift.

Then the answer key itself. Some of my gold answers contradicted their own explanations. I fixed them by rule, then checked every changed answer against the text of Pravopis 2010 and every spelling against its dictionary. That reversed part of my own fix.

And some of what looked like model mistakes weren't mistakes. The best models kept "failing" on words where the authorities themselves disagree, like *foto-aparat* and *fotoaparat*. Now both count.

The most useful thing I noticed: every error in my answer key so far sat where strong models disagreed with each other. So that disagreement became the list I check by hand.

I still don't fully trust the key, and I've written that into the README. A benchmark is a claim about what's right, and mine needed checking as much as the models did.
