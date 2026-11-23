---
title: "73 pull requests for a personal site"
description: "This site is six weeks old and has had 73 pull requests, nine of them one line long. Why I work on it that way."
date: 2026-11-23
draft: true
short: "This site is six weeks old and has had 73 pull requests, nine of them one line long, each through the same checks. It's more process than a personal site needs, and that's on purpose: the repo is public, and I want it to show how I work."
---

The first pull request on this site wasn't a page. It was a check: CI that fails when a page gets too heavy or adds JavaScript. Six weeks later the site has had 73 pull requests.

There were 38 of them in the first two days. Nine changed a single line, like centering the page column, reserving space for the scrollbar, or swapping the contact email. Each one still went through the same checks: a type check, a build, the page budget and, from the second day, Lighthouse. GitHub Actions has run 147 times.

An agent writes most of the code here. The pull requests are where I decide what goes in: one change each, a title that says what it does, and a real description.

That's more process than a personal site needs. I do it on purpose. The repo is public, and I want it to show how I work, not only what I built.

It also caught things. Once, a pull request merged while a check was failing, because the command waiting for it hid the result. That's why the [repo](https://github.com/djolex999/djmarkovic.com) now warms Chrome up before the Lighthouse run, and why I read the real exit code before merging.
