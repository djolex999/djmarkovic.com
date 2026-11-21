---
title: "Why an agent shouldn't be able to stop an A/B test"
description: "An agent that checks a test every hour will find a fake winner sooner or later. What Fulcrum does about it, on the hackathon's synthetic data."
date: 2026-11-21
draft: false
short: "If you check an A/B test every week for 15 weeks and stop the first time p < 0.05, you'll call a fake winner in more than 1 in 5 tests where nothing changed. An agent would check far more often. Fulcrum only lets it ask to stop a test past a boundary that keeps that near 5%, on the metric the test declared, and a human approves."
---

At Adapty's First Commit hackathon I built [Fulcrum](https://github.com/djolex999/fulcrum), a guard between an AI agent and Adapty A/B tests. I wrote about the weekend in [My first hackathon](/writing/my-first-hackathon). This post is about the one thing it refuses to do.

## The problem is peeking

An agent that checks a test every hour is the perfect machine for a classic mistake: looking at the result again and again, and stopping the moment one arm looks ahead.

Each look is another chance for noise to look like a winner. In a simulation of 200,000 A/A tests, where both arms are the same, checking weekly for 15 weeks and stopping at p < 0.05 found a "winner" in 22.7% of them.

## A boundary that gets stricter early

Fulcrum doesn't use a flat 0.05. It uses an O'Brien-Fleming style boundary, a standard one, not mine. At look k of K, an arm only wins if the z-score of the difference is at least c·√(K/k). With c = 2.1 and 15 looks that is 8.1 at the first look and 2.1 at the last. I calibrated c = 2.1 by simulation, and the fake-winner rate drops to 5.2%. The agent can ask as often as it likes; only whole weeks count as looks, so asking every hour doesn't add chances.

On the hackathon's synthetic Lumen app, the replay shows why it matters. On 16 August the Settings paywall looked like a winner: p 0.045, z 2.00. It was the only look in that test where p went under 0.05. Fulcrum's boundary at that look was 3.32, so the stop was blocked. By the end the other arm was slightly ahead, and neither had won.

<figure>
  <picture>
    <source srcset="/img/writing/fulcrum-peeking-dark.svg" media="(prefers-color-scheme: dark)" />
    <img src="/img/writing/fulcrum-peeking-light.svg" width="760" height="400" alt="Settings test, weekly looks: on 16 August z reaches 2.00, past the naive 1.96 line (p 0.045) but under Fulcrum's boundary of 3.32. By the last look the other arm leads." />
  </picture>
  <figcaption>The Settings test, week by week, on the hackathon's synthetic data. Chart from the Fulcrum repo.</figcaption>
</figure>

It also works the other way. Onboarding was set up to measure 60-day revenue, and only users who installed at least 60 days earlier count, so at week 2 Fulcrum says "not yet". Week 9 is the first valid look, the boundary is crossed there (z 4.34 against 2.71), and the stop is allowed.

## Only the metric you declared

The second way to fool yourself is to keep looking at other metrics until one of them wins. Fulcrum judges a test only on the goal written down before it started, in a checked-in test plan, because Adapty doesn't store the goal in a form a program can read. Asking to stop Settings on payer rate instead of revenue returns `METRIC_NOT_GOAL`.

## And a human says yes

Even a stop that passes both checks only becomes a request. A person approves it on a local page behind a one-time login, and only the Fulcrum process holds the Adapty token. The first version of that page had a hole: the agent could approve its own request with `curl`. A reviewer agent found it and I patched it.

The statistics weren't immune either. My planned demo scene was a Settings "winner" on 2 September. A subagent that saw only the raw CSV recomputed it: p 0.26, not significant. We dropped the scene.

All numbers here come from a simulation and the hackathon's synthetic dataset, checked by a teammate, not from real revenue or real users.
