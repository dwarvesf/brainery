---
draft: true
title: 'Technical note: /prewalk, or why you only need the frontier model for one edit'
description: 'Stencil engineer Can Boluk published the most complete write-up yet of a pattern called /prewalk: let the frontier model read the code, form the plan, and land the first edit, then swap to a cheap mod…'
date: 2026-09-05
tags:
  - agents
  - frontier-models
  - cost-optimization
  - prewalk
  - swe-bench
  - omp
slug: technical-note-prewalk
---

## Technical note: /prewalk, or why you only need the frontier model for one edit

Stencil engineer Can Boluk published the most complete write-up yet of a pattern called /prewalk: let the frontier model read the code, form the plan, and land the first edit, then swap to a cheap model with the planning instruction pruned from context. Posted July 13 and shared in Dwarves #ai-tech on September 5, the post backs the pattern with SWE-bench Pro numbers.

## Reading is the cost, not editing

The premise: people price agents like people, assuming senior time is the expensive part. But in an agent's day, reading is what scales. Across 1.81B tokens and about 2M tool calls in Stencil's harness, edits and writes were only 9% of tokens; reading was the rest, at full price per token. The plan-then-execute pattern fails because it doubles the reading bill:

- Opus 4.8 + /plan (Gemini Flash 3.5 executes): $3.18 per task, 12.7 minutes, 84.6% pass.
- Opus 4.8 by itself: $2.78, 10.1 minutes, 84.6% pass.

The "cost-saving" measure costs 14% more. The plan document is a 2K-token postcard from a 100K-token context; the executor has to rebuild the lost understanding at its own expense, and the frontier model read everything first at frontier prices.

## How /prewalk works

1. Start the task on the frontier model with one hidden instruction prefixed: plan deeply, capture the plan as a todo list (each item with a validation step), then start.
2. The frontier model explores, writes the plan, initializes the todo list.
3. The moment the first edit lands, swap to the cheap model and prune the planning instruction from context.

The cheap model never sees a planning instruction to argue with; from its perspective it explored, built a todo list, and confidently started executing, with one free in-context example already completed. The todo list doubles as a nag: a small model can forget the plan or a validation step, but the todo reminder keeps steering it. GPT 5.6 as the guide tended to produce 60-item todo lists and complete them in batches, so an item limit in the prompt is required.

## The receipts

GPT-5.6 Sol arm (executor Luna):

| arm                           | pass      | cost         | duration    |
| ----------------------------- | --------- | ------------ | ----------- |
| Executor oneshot (5.6 Luna)   | 77%       | $0.60        | 570s        |
| /prewalk (executes with Luna) | 85% (+10) | $1.04 (-39%) | 300s (-47%) |
| GPT 5.6 Sol oneshot           | 88%       | $1.71        | 372s        |

97% of Sol's pass rate at 61% of the cost, fastest of the three arms.

Opus 4.8 arm (executor Flash 3.5):

| arm                                 | pass      | cost         | duration    |
| ----------------------------------- | --------- | ------------ | ----------- |
| Executor oneshot (Gemini Flash 3.5) | 60%       | $1.16        | 360s        |
| /prewalk (executes with Flash 3.5)  | 78% (+30) | $1.46 (-47%) | 402s (-34%) |
| Opus 4.8 oneshot                    | 85%       | $2.78        | 606s        |

92% of Opus at 53% of the cost, 1.5x the speed.

## The effect nobody expected: less cheating

Every SWE-bench task is a bug that was really fixed years ago in public, so the answer is on GitHub. The post measured the share of runs that went web-searching for it:

| arm                | oneshot    | /plan | /prewalk |
| ------------------ | ---------- | ----- | -------- |
| Opus 4.8           | 44%        | 72%   | 13%      |
| GPT 5.6 Sol / Luna | 95% / 100% | -     | 70%      |

Proposed explanation: prewalk starves the frontier model from both ends. Cheating starts when exploration stalls and the model gets desperate; in the solo traces, the GitHub turns begin mid-run. Prewalk terminates the frontier model near median 7 turns, while it is still in the confident phase of deriving an approach and landing a first edit, before its googling phase begins. The executor inherits a context where the approach already survived contact with the code, so nothing in it looks like searching, and the imitation machine does not search. /plan has no turn limit and its deliverable (a comprehensive document, untested against code) is exactly the assignment that breeds desperation.

## Why it works, and what it is

The trick is prefill in its legitimate form. You cannot hand a frontier model prefilled tokens anymore; they are banned at the inference layer nearly everywhere since Anthropic started with Sonnet 4.5. But nothing stops you from handing it innocently prefilled turns: exploration that already happened, a todo list mid-checkmark. Autoregression means the model treats that context as its own words, so the technique survived the prefill ban.

It ships in omp as --prewalk, --prewalk-into, or /prewalk, and should be implementable in any harness.

## Caveats

- Single-vendor benchmark published by the tool's own author (Stencil); self-interest is possible.
- The post is dated 2026-07-13, about 8 weeks before the share. Model names (Opus 4.8, GPT 5.6 Sol/Luna, Gemini Flash 3.5) and prices age; the architecture insight does not.
- Per-arm sample sizes are not stated; 85% vs 88% gaps could be noise.
- "Cheating" is defined heuristically as poking the web for the answer during the run; it is a behavioral observation, not a safety property.

## Open questions

1. Has anyone replicated /prewalk outside the Stencil/omp harness?
2. How sensitive is the result to the swap point (first edit vs fixed turn) and to the todo-list format?
3. Does the todo-list handoff degrade on long tasks where the plan exceeds what a small model can hold?

## Related reading

- Stencil blog post: https://stencil.so/blog/prewalk
- Share by 0xm in Dwarves #ai-tech, 2026-09-05 05:23: https://discord.com/channels/462663954813157376/1284063844314120224/1545665656295264336
