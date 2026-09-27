---
draft: true
title: 'Field Report: The Codex DX Guide to Pruning Agent Instructions'
description: 'On September 4, Eric Provencher (pvncher, Codex DX at OpenAI) posted a thread arguing that coding-agent instruction files have accumulated bloat over the past year, and that GPT-6 Astra makes revisiti…'
date: 2026-09-05
tags:
  - coding-agents
  - astra
  - skills
  - agents-md
  - prompts
  - openai
slug: field-report-agent-instruction-hygiene
---

## Field Report: The Codex DX Guide to Pruning Agent Instructions

On September 4, Eric Provencher (pvncher, Codex DX at OpenAI) posted a thread arguing that coding-agent instruction files have accumulated bloat over the past year, and that GPT-6 Astra makes revisiting them more important than ever. "What used to require a lot of handholding and scaffolding no longer does," he writes, and the instructions teams stacked up to steer older models now get in the way.

The thread covers the three places instructions live: skill files, AGENTS.md, and task prompts.

## Skill files

Skill files are prompts stored as markdown, sometimes with bundled scripts, and they are loaded into the model's context so it knows when to use them. That loading is exactly where the bloat bites:

- Too many skills, or descriptions that are too long, and Codex starts shortening descriptions to fit. The model sees less of each description and cannot pick the right skill.
- Descriptions can contradict each other or carry too much "pick me" energy, so the model loads instructions that do not help the task.
- A bad description can push the model to use a skill any time it touches anything related to a database, instead of only when it has to handle a migration.

Provencher says OpenAI recently updated the $skill-creator skill to mitigate the failure modes seen in practice, with three pieces of guidance:

1. Skill descriptions should be as short as possible while making it clear when to use the skill.
2. The marker of a useful skill is progressive disclosure: for multi-workflow skills, make the root document a minimal router that points to supporting docs and scripts. Reading a skill consumes context, so do not dump everything in the root.
3. Many skills were written as elaborate itineraries or recipes. Models have gotten much better at nuance, so overly specific guidance can now hinder results where it previously helped.

One more note from the thread: repository skills also guide other contributors' agents, which may run different models. Guidance that helps Sol or Luna may overconstrain GPT-6 Astra, so consider which models will actually read the instructions you leave behind.

## AGENTS.md

Because AGENTS.md applies whenever the model works in your repository, every instruction in it should be revisited and asked whether the task still needs it. Provencher's example: requiring a stack of docs or a full repo map before every edit is excessive for a typo fix. GPT-6 Astra can work out what it needs to read without being pushed to review the whole project before every change.

## Why it matters

The thread is a practitioner's checklist for the current generation of coding agents, from the person who owns Codex's developer experience. The pattern it describes applies beyond OpenAI: instruction files are context lines, and context is the scarce resource. Keeping roots small, descriptions short, and guidance model-aware is a transferable hygiene rule for any agent harness.

## Caveats

- Single practitioner's guidance from an OpenAI employee; product bias toward Astra is possible. No measurements are attached to the claims.
- The capture of the thread was partial: the intro promises coverage of task prompts alongside skills and AGENTS.md, but the retrieved text covered skills and AGENTS.md only. The task-prompts section may exist in the un-captured remainder.

## Open Questions

1. Does OpenAI publish any measurements of how instruction bloat changes pass rates or token spend?
2. What is the full updated $skill-creator guidance (the thread summarizes three points)?

## Related Reading

- pvncher thread: https://x.com/pvncher/status/2095991462416490862
- Share by 0xm in Dwarves #ai-tech, 2026-09-05 07:16: https://discord.com/channels/462663954813157376/1284063844314120224/1545694164665114704
