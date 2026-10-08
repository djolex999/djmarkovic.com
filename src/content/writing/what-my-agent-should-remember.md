---
title: "410 of 1,386: deciding what my coding agent should remember"
description: "Most AI coding sessions aren't worth keeping. How vir filters 1,386 transcripts down to 410 notes without paying a model to read the noise."
date: 2026-10-08
draft: false
---

Claude Code deletes session transcripts after about 30 days. Every decision and every fixed gotcha goes with them, so next month the agent rediscovers the same fix.

I built [vir](https://virwiki.dev) to keep them. It turns my Claude Code and Codex transcripts into plain markdown notes and serves them back to the agent over MCP. The hard part wasn't writing notes. It was deciding what not to write.

## Most sessions aren't worth remembering

Sending every transcript to a model fails twice. It's expensive, because transcripts are mostly tool output. And it stores junk: ask a model what's worth remembering and it always finds *something*. Feed that back to the agent, and a weak note becomes a rule it trusts.

Of 1,386 transcripts on my machine:

- **562** were subagent runs, workflow phases or sidechains, skipped before any API call
- **361** had nothing durable in them
- **53** are in projects I've excluded
- **410** became notes

## Filter cheapest first

The stages run from cheapest to most expensive, so each one only sees what the cheaper ones let through:

1. **Structure:** free. Subagent and workflow transcripts are recognized and skipped.
2. **Heuristics:** free. Low-signal sessions drop out.
3. **Classify:** cheap. Haiku scores what's left and drops anything at 0.6 confidence or below.
4. **Distill:** expensive. Only survivors get here, sent to Haiku or Sonnet by category and size.

The biggest saving came from what the model sees, not which model. Stripping tool output cut one 517-call session from about 217k to 95k input tokens.

## Every note has to be checkable

Filtering keeps noise out. It doesn't make a note true. So nothing vir writes reaches the agent's instructions without me:

- every note carries its confidence score
- `vir review` lets me approve, edit or reject each one
- `CLAUDE.md` only changes after I see a diff and say yes
- a proposed rule must quote every note it came from, and invented quotes are thrown out

## The takeaway

In my [last post](/writing/the-gulf-ai-didnt-close) I wrote that AI made producing code cheap and left judging it hard. Memory works the same way. Any model can write a note. The work is deciding what's worth keeping, and making every kept thing quick to check.
