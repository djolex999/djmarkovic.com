---
title: "73 pull requests for a personal site"
description: "This site is almost seven weeks old and has had 73 pull requests, nine of them one line long. Why I work on it that way."
date: 2026-11-23
draft: true
short: "This site is almost seven weeks old and has had 73 pull requests, nine of them one line long. It's more process than a personal site needs, and that's on purpose: the repo is public, and I want it to show how I work."
---

The first pull request on this site wasn't a page. It was a check: CI that fails when a page gets too heavy or adds JavaScript. Almost seven weeks later the site has had 73 pull requests.

There were 38 of them in the first night. Nine changed a single line, like centering the page column, reserving space for the scrollbar, or swapping the contact email. Each one still went through the same checks: a type check, a build, the page budget and, from the 28th pull request on, Lighthouse. CI has run 147 times, about half on pull requests and half on main after each merge.

An agent writes most of the code here. The pull requests keep that readable: one change each, a title that says what it does, and a real description.

That's more process than a personal site needs. I do it on purpose. The repo is public, and I want it to show how I work, not only what I built.

It didn't always work. Once, a pull request merged while a check was failing, because the command waiting for it hid the result. I wrote about that in [Telling the agent no](/writing/telling-the-agent-no). The failure itself was a false alarm: Lighthouse's first run on a cold Chrome scored low. So the [repo](https://github.com/djolex999/djmarkovic.com) now warms Chrome up first, and the real exit code gets read before merging.
