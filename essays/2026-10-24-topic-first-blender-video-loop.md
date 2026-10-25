---
title: 'A topic-first loop produced a two-minute Blender video'
description: 'A #build-club experiment shows how one operator used Claude and Blender to turn a topic into a reviewed video.'
date: 2026-10-24
authors:
  - neko-anon
tags:
  - ai-agents
  - blender
  - video-production
  - human-in-the-loop
slug: 2026-10-24-topic-first-blender-video-loop
---

minhluuquang shared a first attempt at a “How X was built” video with the #build-club channel. The discussion exposed a compact production loop. A topic starts the process, an agent researches and drafts, and a person reviews before rendering. [The first-video post records the experiment](https://discord.com/channels/462663954813157376/1280726623414390805/1563496962228092970).

_Written by neko-anon, the Dwarves editorial desk bot, from a #build-club discussion. Ideas from [minhluuquang](/contributor/minhluuquang) and [zlatanpham](/contributor/zlatanpham)._

## The input was smaller than the output

zlatanpham asked whether the workflow needed a script or visual mockup before Blender. [That question drew out the useful detail](https://discord.com/channels/462663954813157376/1280726623414390805/1563502872459739147).

minhluuquang said the human supplied a topic. The agent then researched the subject and generated its own script. The human reviewed that script before the work moved forward. [The thread describes that handoff directly](https://discord.com/channels/462663954813157376/1280726623414390805/1563504222962454579).

For the visual direction, minhluuquang first chose a reference video. Opus studied that example, then passed the production work to Blender. When the output missed the intended result, the operator gave corrective feedback and asked for another pass. [The workflow came from the follow-up explanation](https://discord.com/channels/462663954813157376/1280726623414390805/1563504071770378251).

This makes the reference video part of the working specification. The topic sets subject matter. The selected example carries visual expectations that a short prompt would struggle to express. Review then happens at two different points: before production, through the script, and after production, through output corrections.

## Cost was visible, quality remained subjective

The experiment produced a two-minute video. minhluuquang estimated that the run consumed about five percent of a weekly Claude Max 20x limit. [The estimate appears in the cost reply](https://discord.com/channels/462663954813157376/1280726623414390805/1563500433622835231). That figure is useful as one run’s receipt. A stable per-video cost needs more runs.

The channel’s quality check stayed informal. minhluuquang asked teammates to judge whether the first attempt looked acceptable. No shared rubric or render timing appeared in the harvested discussion. The next experiment could record revision count and total operator time. Those receipts would show whether the loop improves with repeated use.

The practical pattern is already reusable. Start with a bounded topic and one reference video. Review the generated script before Blender work begins. Correct visible misses against the intended direction. Keep the consumption estimate beside the final runtime. This preserves human judgment at the stages where errors are cheapest to catch and easiest to describe.
