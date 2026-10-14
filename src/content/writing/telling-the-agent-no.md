---
title: "Telling the agent no"
description: "A short note on Anthropic's post about rebuilding source control, and the one line from it I keep thinking about."
date: 2026-10-15
draft: false
---

Anthropic wrote about [rebuilding their source control](https://www.anthropic.com/engineering/redesigning-source-control). Their merges went from about 2,500 a day to over 30,000 in a few months, and git couldn't keep up. It's a scale I'll probably never work at, and most of the post is beyond what I know.

One line stayed with me, though. They write that very often, _"the role of the engineers was to tell Claude 'no.'"_ The agent writes the code, and the engineers decide what should go in.

I see a very small version of that on this site. Most of its code was written by an agent, and my part was deciding what to build and what to accept. A few rules I care about are checked automatically on every change, like page size and no extra JavaScript, so I don't have to remember them.

Those checks aren't enough on their own. Once, the agent merged a change while a check was failing, because the command it used to wait for the result hid the failure. It was a small mistake, and it showed me that a check only helps if nothing quietly goes around it.

Some things no check can catch, too. When I added card payments to a project here, the line made it sound like they were already live. They aren't yet, so now it says "in final testing." The sentence was fine. It just wasn't true.

I'm still learning where my "no" should go: what to automate, and what to keep reading myself. I suspect that question gets more important as the agents get better.
