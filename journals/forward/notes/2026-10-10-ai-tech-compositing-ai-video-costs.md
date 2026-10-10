---
draft: true
title: 'Compositing can make AI video experiments cheaper'
description: 'A short note on why AI video prototypes can spend less on generation when more of the work moves into rendering and compositing.'
date: 2026-10-10
authors:
  - monotykamary
tags:
  - ai-video
  - rendering
  - modal
  - prototyping
slug: 2026-10-10-ai-tech-compositing-ai-video-costs
---

## The finding

monotykamary shared an AI video experiment, then unpacked the stack behind it: h3 for the app layer, max for feedback loops, and Modal for rendering and compositing. The useful part was not the clip itself, but the production trade-off around it: the last experiment landed around $50 for a three-minute output, and the cost can move down when more of the work is handled through compositing instead of fresh generations.

## Why it matters to us

AI media work is easy to frame as model choice, but the thread points at a more practical lever: pipeline design. If we treat generation as the expensive primitive, then feedback loops, reusable layers, batch rendering, and compositing become engineering decisions, not post-production polish. That matters for prototypes we may build around product demos, marketing assets, simulation, or data storytelling, where cost and iteration speed decide whether the workflow survives past a one-off experiment.

## Take it further

- Map which parts of an AI video workflow need generation, and which can be deterministic rendering or compositing.
- Track cost per minute across a small batch of experiments, not just a single impressive clip.
- Compare turnaround time when feedback loops happen in the UI layer versus inside the generation prompt cycle.
- Write down the minimum pipeline that makes this repeatable for a startup demo without needing a bespoke render farm.

## Sources

- https://discord.com/channels/462663954813157376/1284063844314120224/1558036401042235473
- https://discord.com/channels/462663954813157376/1284063844314120224/1558036629254447256
- https://discord.com/channels/462663954813157376/1284063844314120224/1558037429577850882
- https://discord.com/channels/462663954813157376/1284063844314120224/1558037607819124760
- https://discord.com/channels/462663954813157376/1284063844314120224/1558037700077162579
- https://fixupx.com/GaryLau0101/status/2108121004614857197
