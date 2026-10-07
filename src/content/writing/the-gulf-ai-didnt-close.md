---
title: "The gulf AI didn't close"
description: "AI made writing code almost free. It did nothing for the harder part: knowing whether the code is right."
date: 2026-10-07
draft: false
---

A few years ago, the slow part of building software was getting the thing to exist. You knew roughly what you wanted, and then you spent days turning that intent into working code.

That part is almost gone now. I describe a feature, and a minute later there is a diff. Most days I write more code before lunch than I used to write in a week.

What hasn't changed is how long it takes me to know whether that code is right.

## Two gulfs

In *The Design of Everyday Things*, Don Norman describes two gaps that sit between a person and any system they use.

The **gulf of execution** is the distance between what you want and getting the system to do it. How do I make this happen? Which button, which command, which line of code?

The **gulf of evaluation** is the distance between what the system did and your ability to tell whether it's what you wanted. Did it work? Is the state what I think it is? Is this right?

Good design narrows both. A light switch has almost no gulf of execution (flip it) and almost no gulf of evaluation (the light is on or it isn't).

I wrote about these gulfs in my thesis, mostly in the context of AI interfaces on the web. I didn't expect to end up feeling them this strongly in my own daily work.

## What AI changed

AI coding tools have nearly closed the gulf of execution for software. The distance between "I want an endpoint that does X" and an endpoint that does X is now a sentence.

The gulf of evaluation didn't get that treatment. If anything it got wider, for three reasons.

**There is more to evaluate.** When code was expensive to write, there was less of it, and every line passed through my head on the way in. Now code arrives in blocks of hundreds of lines that I didn't type and didn't have to think through.

**It looks right.** Generated code is clean, consistently formatted and confidently named. The surface signals I used to rely on to spot a careless line are gone. Plausible and correct now look identical at a glance.

**The speed is persuasive.** When features land in minutes, reviewing them carefully feels like the bottleneck. It's tempting to accept the diff, check that the page loads, and move on. The work feels fast, and fast feels like progress.

None of these is the tool's fault. They're what happens when one gulf collapses and the other stays where it was. All the effort that used to go into execution now has to go into evaluation, and if it doesn't, nobody is doing it.

## What drift looks like

I've noticed a few patterns in my own work when I let speed win:

- Accepting a change because the tests pass, when the same model wrote the tests and the code.
- Being able to say *what* a piece of my code does, but not *why* it's built that way, or what I'd change.
- Asking the model to fix a bug the model introduced, three or four times in a row, without ever reading the code closely myself.
- Feeling confident about a system mostly because I shipped it quickly.

Each of these feels fine in the moment. Together they add up to software I own but don't fully understand, which is a strange position for the person responsible for it.

## What I'm trying instead

I don't think the answer is to stop using AI. I use it every day and I'm not going back to writing boilerplate by hand. The answer, for me, is to move my effort to where the gulf still is.

**Read every diff before it's committed.** Not skim, read. If I can't explain a change to someone else, it doesn't go in yet.

**Pen and paper, for some things.** I'm trying to go back to working through problems by hand: tracing logic, sketching a data model before I open the editor. It's slower and honestly harder than I expected, which is how I know it's doing something.

**Practice without the tools.** A small block of time most days where I solve problems with no AI at all. Not because I'll work that way, but because evaluation is a skill, and you can't judge code you couldn't have written.

**Make decisions reviewable.** Part of why I built [vir](https://virwiki.dev) was that my agent kept rediscovering the same fixes across sessions. Writing decisions down where both the agent and I can see them turns "the model did something" into "we decided something, here's why."

**Only feature what I can defend.** If I can't walk someone through how a project works and what I'd do differently, it's not ready to be called finished.

## The real work

Writing code is easy now. That's genuinely good news: it frees up time for the parts of engineering that were always the hard ones, like understanding the problem, choosing the right shape for a system, and knowing when something is wrong.

But that time only helps if you spend it there. The gulf of execution closed on its own. The gulf of evaluation is still ours to cross, one diff at a time.
