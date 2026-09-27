---
draft: true
title: 'The critic-agent loop: how to get long autonomous builds that don''t stop at "good enough"'
description: '**Field Report | 2026-09-07 | source: Dwarves #ai-tech**'
date: 2026-09-27
slug: ai-tech-2026-09-07-field-report-critic-agent-loop
---

## The critic-agent loop: how to get long autonomous builds that don't stop at "good enough"

**Field Report | 2026-09-07 | source: Dwarves #ai-tech**

> Draft-only. Not published. For review by Han before any promotion.

## TL;DR

The most reusable trick to come out of GPT-6 Astra week is not the model itself
but a three-line prompting pattern: give the builder a hard target score, spawn
a*separate critic agent to grade its own output*, and loop until the critic's
score clears the bar. Used on two long builds in the community this week it
turned "mediocre first pass" into "working, revisable artifact" in 30 minutes
to 4 hours of autonomous run time. Cheap to adopt on any agentic setup, works
regardless of which model you pair it with.

## What happened this week

Baddeed shared a hands-on review of GPT-6 Astra (OpenA's current frontier
model, released 2026-09-03) that demonstrates the pattern twice, on two hard
generative tasks:

1. A **ray-traced water balloon** simulation (bullet piercing a balloon, water
   bursting and deforming), coded from scratch in the browser with no
   three.js/external libs. Ran 32 minutes.
2. A **procedural 3D game in Unbeal Engine** (third-person, articulated
   character, Mixamo animations, Blender-MCP asset generation). Ran ~4 hours.

Each task used the same loop:

- the _builder_ agent produced a version;
- a**separate critic agent* took its own screenshots at several angles and
  scored them (0-10 for the sim, 0-8.5 "AAA-quality" for the game);
- below the bar, the critic returned a _ranked list of issues_, the builder
  revised, and the loop repeated up to a hard cap (3 rounds sim, 4 rounds game).

Author's reported results:

| Task                     | Run time | Rounds | Final critic score | Outcome                                 |
| ------------------------ | -------- | ------ | ------------------ | --------------------------------------- |
| Ray-traced water balloon | ~32 min  | 3      | 6.5 / 10           | working, revisable app (target was 8)   |
| Unbeal Engine 3D game    | ~4 h     | 4      | 6.3 / 8.5 target   | playable, iterate-able (target not hit) |

The key observation the author makes: without the critic agent, the builder
stops at the "pretty mediocre" first pass. With it, the output keeps
improving because there is an explicit, external grader forcing revision, and
a ranked issue list telling the builder _what_ to fix.

## Why this is useful (the takeaway)

The pattern is model-agnostic. You do not need GPT-6 Astra to use it. It is a
control-flow decision: split _generation_ from _evaluation_ so that the thing
judging the output is not the same process that produced it, and make the
feedback concrete (ranked, scored) rather than generic ("make it better").

Three implementation notes from the video:

- The critic must be **separate** from the builder. The point is an outside
  grader, not self-assessment.
- The critic grades **screenshots / artifacts**, not prose. It looks at the
  actual render or build and scores realism, physics, aesthetics.
- Always set a **round cap**. Both examples hit the cap before reaching the
  target score; a cap keeps cost bounded.

Rough cost signal (PLS plan, author-reported, unverified): ~3-4% of a weekly
usage limit for the 32-minute build; ~10% for the 4-hour run.

## Context: why this is possible now

The compute behind it matters for anyone sizing agent workloads. Jensen Huang
posted that GPT-6 Astra was trained on ~100K+ NVIDIA Grace Blackwell NVLink72,
and that 400K GPUs are "coming online next." He described it as reaching
"AGI has arrived." Whether or not you accept the AGI framing, the takeaway for
an engineering audience is: this class of long, self-correcting autonomous
build is now practical, and the hardware to run more of it is upstream.

## Sources

- Baddeed, "GPT-6 Astra is a freak" (YouTube), shared to #ai-tech 2026-09-07
  - discord.com/channels/462663954813157376/1284063844314120224/1546426943371485246
  - youtu.be/Ji4amrxrzVM
- 0xm, Jensen Huang post ("GPT-6 Astra, trained on ~100K+ NVIDIA Grace
  Blackwell NVLink72 ... AGI has arrived ... 400K GPUs coming online next"),
  shared to #ai-tech 2026-09-07
  - discord.com/channels/462663954813157376/1284063844314120224/1546356139862663188
  - x.com/jensenhuang/status/2096700264569090384

## Open questions

- Exact critic-loop prompt text is author's paraphrase in the video; the
  fully verbatim prompt was not transcribed here.
- Token/usage percentages are the author's own guess, not API metrics (the app
  does not surface usage stats).
- Whether the 400K-GPU""coming online" claim is confirmed capacity or an
  aspirational figure is not independently verified.

## Not published / for Han

This is a draft for the promotion gate. Sanitized: no client or contractor
details appear because none were in the source thread. All claims carry a
receipt above.
