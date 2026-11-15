---
title: "Why an agent shouldn't be able to stop an A/B test"
description: "An agent that checks a test every hour will find a fake winner sooner or later. What Fulcrum does about it, on the hackathon's synthetic data."
date: 2026-11-20
draft: true
short: "If you check an A/B test every week and stop the first time p < 0.05, you'll call a fake winner in about 22% of tests where nothing changed. An agent checks far more often than a person. Fulcrum only lets it stop a test past a boundary that brings that down to about 5%, on the metric the test was set up to measure, after a human approves."
---

At Adapty's First Commit hackathon I built [Fulcrum](https://github.com/djolex999/fulcrum), a guard between an AI agent and Adapty A/B tests. I wrote about the weekend in [My first hackathon](/writing/my-first-hackathon). This post is about the one thing it refuses to do.

## The problem is peeking

An agent that checks a test every hour is the perfect machine for a classic mistake: looking at the result again and again, and stopping the moment one arm looks ahead.

Each look is another chance for noise to look like a winner. In a simulation of 200,000 A/A tests, where both arms are the same, checking weekly and stopping at p < 0.05 found a "winner" in 22.7% of them.

## A boundary that gets stricter early

Fulcrum doesn't use a flat 0.05. At look k of K, an arm only wins if its z-score is at least c·√(K/k). Early looks need much stronger evidence than late ones. With K = 15 looks, I calibrated c = 2.1 by simulation, and the fake-winner rate drops to 5.2%.

On the hackathon's synthetic Lumen app, the replay shows why it matters. On 16 August the Settings paywall looked like a winner: p 0.045, z 2.00. Fulcrum's boundary at that look was 3.32, so the stop was blocked. By the end of the test, the other arm was ahead.

It also works the other way. Onboarding was set up to measure 60-day revenue, so at week 2 Fulcrum says "not yet". Week 9 is the first valid look, the boundary is crossed there (z 4.34 against 2.71), and the stop is allowed.

## Only the metric you declared

The second way to fool yourself is to keep looking at other metrics until one of them wins. Fulcrum judges a test only on the goal written down before it started, in a checked-in test plan, because Adapty doesn't store a goal metric. Asking to stop Settings on payer rate instead of revenue returns `METRIC_NOT_GOAL`.

## And a human says yes

Even a stop that passes both checks only becomes a request. A person approves it on a page the agent can't reach, and only the Fulcrum process holds the Adapty token. A reviewer agent that saw only the diff found that the first approval page let the agent approve its own request with `curl`. I patched it with a single-use login, a session cookie, CSRF and Origin/Host checks, and a test.

The statistics weren't immune either. My planned demo scene was a Settings "winner" on 2 September. A subagent that saw only the raw CSV recomputed it: p 0.26, not significant. I dropped the scene.

All numbers here come from the hackathon's synthetic dataset, not from real revenue.
