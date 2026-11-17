---
title: "A lesson without its outcome"
description: "My lessons files keep the problem and the fix. A new Google paper suggests that's only part of what's worth keeping."
date: 2026-11-18
draft: true
short: "My lessons files keep what went wrong and what fixed it. A new Google paper on agents that improve their own setup found that keeping only the problem gave mixed results; what helped was also keeping why each change was made, what it was expected to do, and what it actually did."
---

I keep a lessons file in most of my projects. When something goes wrong, the session ends with a short note: what happened and what fixed it, so the next session doesn't repeat it.

A new paper from Google, [Self-Improvement Memory Enables Continual Recursive Self-Improvement](https://arxiv.org/abs/2611.18856), tests something close to that. An optimizer keeps editing an agent's harness, its prompts and checks, and then has to carry on with a new benchmark or a new model. The question is what it should remember from the earlier rounds.

They compare three options: keep only the evolved harness; keep the harness plus the problems that came up; or keep a fuller memory that groups edits by recurring problem and records why each edit was made, what it was predicted to change, what actually changed, and where it was evaluated.

Keeping only the problems gave mixed results, from 1.82 points worse than the harness alone to 2.40 points better. The fuller memory came out ahead in all six cross-dataset settings, and when moving from Claude Opus to Gemini it beat the harness alone by 3.60 to 11.33 points.

The paper also has an example worth knowing. A run without that memory inherited a completion check, edited it four times, twice to fix deadlocks, and then described the check as something it had added itself.

My lessons files are mostly the middle option: the problem and the fix. What's missing is the prediction and the evidence: "this should stop X", and later, whether X actually stopped.

I haven't changed anything yet. Next I want to go through the paper more carefully and see what could turn into new additions to my own projects, starting with how my lessons are written down.
