---
title: "The one script I said I wouldn't add"
description: "This site was built with no JavaScript and no analytics. This week I added one analytics script, and changed the footer to say so."
date: 2026-10-17
draft: false
---

This site started with one rule: no JavaScript, no analytics. The footer said "0 KB of JavaScript," and CI failed any change that added a script.

This week I added one. I had no idea if anyone read anything here, and the free hosting plan only showed total requests, bots included. So I added Vercel's analytics: one small script, no cookies, loaded from this site's own domain.

I kept the exception narrow. CI still blocks every other script, and the footer now says "no JavaScript except analytics." Leaving "0 KB" up would have been a small lie on every page.

I still like the original rule. I'd just rather bend it in the open.
