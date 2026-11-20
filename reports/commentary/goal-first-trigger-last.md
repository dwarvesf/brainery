---
title: "Goal first, trigger last: how poteto teaches a bot a job"
description: "The cycle, the beliefs and the method in Lauren's guide to automating work with Grok Bot, in seven diagrams."
date: 2026-11-20
toc: true
draft: true
authors:
  - tieubao
tags:
  - commentary
  - ai
  - agents
  - automation
slug: goal-first-trigger-last
type: writing
form: analysis
topic: ai-agents
fit: 2
abstract: "Lauren (poteto), who builds Grok Bot at xAI, wrote a beginner guide to automating work with a bot. Its steps form a cycle: agree the goal, talk the process out, make the bot restate it, let the bot interview you, connect the tools, feed it real-world data, and add the trigger last. The order is the method. This post draws the cycle, the beliefs under it and the reason for its order, then compares it with how we set up our own desk bots."
---

On 18 November 2026, [Lauren (@poteto)](#ref-1), who builds Grok Bot at xAI, posted a guide on automating work with a bot. It's written for beginners, with apple pies and a car repair shop as examples. ==The order of its steps is a full method for handing a job to a bot==, and it reads well as diagrams.

## The cycle

![The cycle {#fig-cycle}](assets/goal-first-trigger-last-fig1-cycle.svg 'The cycle. Steps 1 to 4 are talk. Steps 5 to 7 let the bot act. Then the process goes back to be checked against the goal.')

The cycle has seven steps:

1. **Goal**: say what the work is for.
2. **Process**: talk through how you do it today.
3. **Restate**: the bot says the job back to you, and nothing runs yet.
4. **Tacit**: the bot interviews you for what you left out.
5. **Connect**: the bot gets its apps and tools.
6. **Feedback**: the bot gets the data it needs to see how it did.
7. **Trigger**: the work starts on an event or a schedule.

The guide then asks the bot to "review our process against my original goal", which closes the loop.

## Hold the goal, let the process move

![Goal versus process {#fig-goal}](assets/goal-first-trigger-last-fig2-goal-vs-process.svg 'Goal versus process. Two processes reach the same goal. The bot may replace yours with a shorter one.')

The first mistake the guide names is treating a step as the goal. Filling in a form is a step. The goal is where the work fits in the business: does it bring in money, or cut a cost?

The bot gets the goal as a responsibility: "this is the goal I want you to be responsible for". Once the goal is fixed, the process becomes a means, and the bot is free to find a shorter one.

## Teach it what you know

![What you tell the bot {#fig-teach}](assets/goal-first-trigger-last-fig3-teach-the-bot.svg 'What you tell the bot. Six things in a voice dump, then an interview that digs out the rules you follow without noticing.')

You brain-dump the process by voice, with no tidying, covering six things. The last three are the ones most job notes miss: how you check the work, where the information comes from, and where you hear how it went.

Then the bot interviews you. Experts stop noticing what they know, so the guide hands the questions to the bot: "Ask one question at a time, then walk me through a few examples". Real cases, failures included, surface the hidden rules. They cover which source wins when two disagree, what "done" really means, and how to resume without doing the work twice.

## Talk is cheap, so talk first

![Cost to fix a mistake {#fig-cost}](assets/goal-first-trigger-last-fig4-cost-to-fix.svg 'Cost to fix a mistake. An illustrative shape: while the job is words, a fix is one sentence. Once the bot acts, a fix means undoing real work, and a trigger repeats it every run.')

This is why the order matters. The restate prompt ends with "I don't want you to start executing on this yet". A misunderstanding found while the job is still words costs one sentence. Found after the bot has acted, it has a booking or a payment attached.

The trigger comes last for the same reason. A trigger repeats whatever the process does, mistakes included, while nobody is watching. The guide is happy for the bot to work only on request until the owner has seen it do the job right.

## Let the bot hear the world

![Feedback from the world {#fig-feedback}](assets/goal-first-trigger-last-fig5-feedback-loop.svg 'Feedback from the world. Reviews and records reach the bot, shared IDs join them, and the bot proposes a change for the owner to approve.')

The guide wants the bot to improve without the owner passing on every complaint. The test is simple: what would you read if you wanted to get better at this job yourself? Give the bot the same access, such as reviews, email and the shop's own records.

Two habits make this work. Record the moments that matter, like when a customer arrived and when service started (the bot can build the logging app). Use shared IDs, like a customer number or an email, so the sources can be joined.

## The beliefs under the steps

![The beliefs {#fig-beliefs}](assets/goal-first-trigger-last-fig6-beliefs.svg 'The beliefs. Each step rests on one belief about delegation.')

Each step rests on a belief about how delegation works:

- **Goal over process**: the process is a means, so don't get attached to it.
- **Ownership**: the bot names itself after its goal, and you brief it like a new hire.
- **Cheap start**: "just call it Potato", talk instead of writing, and don't expect the first pass to be right.
- **Experts forget**: people can't list rules they follow without thinking, but they can walk through a real case.
- **Words before action**: fix the plan before anything has side effects.
- **Data over prompts**: a bot improves from what it can observe, more than from better instructions.
- **Automate last**: earn trust by hand before adding a schedule.
- **Teach the method once**: the guide closes by pointing at Dr Eggbot, a bot that designs bots. The method is itself a process with a goal, so a bot can run it.

## How it compares with our desk bots

![The guide versus our desk bots {#fig-compare}](assets/goal-first-trigger-last-fig7-comparison.svg 'The guide versus our desk bots. We match or exceed the back half. The guide leads on the front half and on feedback.')

We run desk bots for Dwarves operations, using the model in [Owner agents, plain functions](#ref-2). The back half of the cycle matches ours, and we enforce more of it: one writer per record, outcome checks, and jobs that alert when they stop.

The front half is where the guide leads. Our desk charters open with access and limits, and none states the result the desk exists for. Our bots also improve mostly when a person corrects them, which keeps that person in every improvement.

The guide is light on what production adds. A bot needs explicit limits on money, sending and secrets. It must treat review and email text as data, never as instructions. It also needs a way to show it has stopped running. We're adding the guide's front half to our new-bot playbook: each charter will state its goal, its done check and where it hears how a run went.

## References

1. **Lauren (poteto)**: builds Grok Bot at xAI, 18 November 2026. [Automate Anything with Grok Bot](https://x.com/poteto/status/2123159537016533493).
2. **Owner agents, plain functions**: our model for desk bots and the functions they call, 25 October 2026. [Owner agents, plain functions](owner-agents-and-functions.md).
