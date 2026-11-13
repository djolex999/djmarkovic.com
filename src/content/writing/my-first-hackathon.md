---
title: "My first hackathon"
description: "Fulcrum took 2nd place at First Commit, Adapty's first hackathon in Belgrade. It was my first hackathon too."
date: 2026-11-13
draft: false
short: "At my first hackathon, Adapty's First Commit in Belgrade, I built Fulcrum: a guard that lets an AI agent work with A/B tests without stopping one on noise. A test stops only past a statistical boundary, on its declared metric, after a human approves. We took 2nd place."
---

On 7 and 8 November I was at First Commit, Adapty's first hackathon, in Belgrade. It was my first hackathon.

I built [Fulcrum](https://github.com/djolex999/fulcrum), a guard layer between an AI agent and Adapty A/B tests. An agent that keeps checking a running test will sooner or later see a lead that is only noise, and want to stop it there.

The agent has no Adapty token and no CLI. Its only way to change anything is an MCP server that checks each action against a policy file. A test can be stopped only once it's past a statistical boundary, only on the metric it was set up to measure, and only after a human approves on a page the agent can't reach. Every attempt is written to a ledger, and if something can't be checked, it blocks. It stopped real throwaway tests on a live Adapty account, through that gate.

I was the engineer, and a teammate joined partway through to help. It has 199 tests and an attack suite, and I had fresh reviewer agents try to break it. One found a way for the agent to approve its own stop. I patched it.

We took 2nd place. There's a [short demo](https://www.youtube.com/watch?v=kvZbSLL6XP4) if you want to see it run.
