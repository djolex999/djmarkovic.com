---
title: "A password reset, then and now"
description: "In 2022 a forgot-password API took me two weeks. This month I committed four features in an afternoon. What didn't change."
date: 2026-11-16
draft: true
short: "In 2022 my first forgot-password API took two weeks and many review rounds. This month I committed four features in one afternoon with Claude. The review didn't go away: back then a senior did it for me, now it's mine."
---

In July 2022, at my first backend internship, I wrote a forgot-password API in Node.js and Express. It took two weeks, from the first commit on 27 July to the merge on 10 August: around 160 lines, and round after round of fixes from review. The first version couldn't even be tested, because SendGrid only sent mail from registered domains.

A year later, on another project, a login bug I chased turned out to be one missing return statement.

On 5 November this year, between 12:59 and 17:42, I committed four features to TRAIN, an app I'm building. Each was about 800 lines, written with Claude.

It isn't a fair comparison. In 2022 I was learning, and a senior developer reviewed every pull request. But the review didn't go away. Back then someone else did it for me. Now it's mine, and it's most of the work.
