---
draft: true
title: 'Cheaper capable models move agent design toward worker fleets'
description: 'Sonnet 5.5 sparked a useful design question: when a cheaper model can produce polished app work, agent systems may shift more work to workers and reserve premium models for orchestration.'
date: 2026-09-29
authors:
  - phucld
  - 0xm
  - vincent.console
tags:
  - ai-agents
  - coding-models
  - model-routing
slug: sonnet-5-5-worker-models
---

## The finding

The #ai-tech thread clustered around Claude Sonnet 5.5 as a cheaper, capable worker model for app generation. phucld shared Max Blade's demo claim that Sonnet 5.5 produced an Overcooked-style browser game with "triple aaa level polish" at much lower cost than Opus 5.5, then 0xm and vincent.console compared the model against the current frontier stack and expected follow-up releases.

The useful signal is not the hype phrase. It is the architecture implied by the thread: cheaper models may become the default workers, while expensive models sit above them as reviewers, planners, or orchestrators.

## Why it matters to us

For coding-agent systems, model choice is becoming a routing problem rather than a single-model bet. If a mid-priced model can handle most implementation loops, we should test where it fails: task decomposition, UI taste, long-context repair, review depth, and integration with existing code. That gives us a practical way to decide when to spend on a premium model and when to run cheaper parallel workers.

## Take it further

- Run the same small product task through Sonnet 5.5, Opus 5.5, and our current default coding model; compare cost, wall time, number of human interventions, and final diff quality.
- Test a two-tier setup: premium model writes the plan and acceptance checks, cheaper worker model implements, premium model reviews.
- Track failure modes separately for greenfield demos and existing-code changes. A game demo does not prove repository maintenance ability.
- Decide the routing threshold in advance: what defect rate or human-review load makes the cheaper worker false economy?

## Sources

- Discord, phucld sharing Max Blade's Sonnet 5.5 game demo: https://discord.com/channels/462663954813157376/1284063844314120224/1554320073991135242
- Discord, phucld quoting "triple aaa level polish at 20x cheaper than opus 5.5": https://discord.com/channels/462663954813157376/1284063844314120224/1554320159374708958
- Discord, 0xm comparing Astra, Fable, and Sonnet: https://discord.com/channels/462663954813157376/1284063844314120224/1554322369194098729
- Discord, vincent.console expecting Anthropic to release Fable 5.5: https://discord.com/channels/462663954813157376/1284063844314120224/1554330085899894795
- X post lookup for Max Blade's demo, ID 2104704696967368758: https://x.com/i/status/2104704696967368758
