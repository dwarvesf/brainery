---
title: 'Terminal agent workflows move attention from typing to review'
description: 'A team discussion shows why agent-driven coding still needs deliberate checks on important changes.'
date: 2026-10-30
authors:
  - toanbku
tags:
  - ai-agents
  - code-review
  - developer-workflow
slug: terminal-agent-code-review
---

## The finding

toanhq said he has stopped opening VS Code and now codes from the terminal. He still checks important code because a weak prompt can produce a result that needs another pass. That review can feel like micromanagement, yet it gives him confidence in the change. The observation came from the team's discussion of interface choices for AI-assisted work ([terminal workflow](https://discord.com/channels/462663954813157376/1284063844314120224/1565657894182068316), [review habit](https://discord.com/channels/462663954813157376/1284063844314120224/1565664415209099307)).

## Why it matters to us

A terminal-first agent can remove much of the mechanical work of editing files. The engineer's attention then moves toward framing the task, inspecting risky changes, and deciding when the output is trustworthy. The discussion points to a practical review model: spend scrutiny where the consequence of a bad change is high, and treat prompt quality as one input to that decision.

## Take it further

- List the kinds of changes the team always reviews by hand, such as permissions, migrations, and boundary conditions.
- Compare review time for a tightly scoped prompt against a broad prompt on similar work.
- Record which agent mistakes survive tests but are caught during code inspection.
- Try a short pre-change plan from the agent and see whether it reduces corrective review.

## Sources

- https://discord.com/channels/462663954813157376/1284063844314120224/1565657894182068316
- https://discord.com/channels/462663954813157376/1284063844314120224/1565664415209099307
