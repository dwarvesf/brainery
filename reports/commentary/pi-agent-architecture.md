---
draft: true
title: 'How Pi Structures a Coding Agent: A Field Report'
description: Alejandro AO published a walkthrough of Pi, a minimalist terminal-based coding agent
date: 2026-07-14
slug: pi-agent-architecture
---

## TL;DR

Alejandro AO published a walkthrough of Pi, a minimalist terminal-based coding agent. The architecture is not revolutionary, but it is unusually clean: a tight core loop, explicit separation between agent runtime and TUI, pluggable extensions, session compaction, and reusable skills. For anyone building agentic tools, it is a readable reference implementation worth studying.

## Why This Matters Now

Terminal-based coding agents are becoming the default interface for AI-assisted development. The Dwarves team runs Hermes in a similar shape: a core agent loop wrapped in a CLI/TUI, with tool execution, session state, and skill loading. Pi's architecture offers an independent validation of the same design choices, plus a few details worth stealing.

datnguyennnx surfaced the post in #ai-tech while comparing Pi against OpenCode, which suggests the team is already evaluating where to land on agent stack decisions.

## The Two-Layer Split

Pi separates cleanly into:

1. **Agent core** — the loop that talks to the model, executes tools, and manages state.
2. **Pi Interactive** — the terminal UI, chat input, session management, and user-facing commands.

This matters because the core can be called programmatically or embedded elsewhere. The TUI is a consumer of the core, not the other way around. Most agent frameworks blur this boundary; Pi keeps it sharp.

## The Core Agent Loop

The loop is exactly what you would expect:

1. Initialize context.
2. Send state to the model.
3. Receive an answer or tool calls.
4. Execute tool calls.
5. Append results back into the conversation.
6. Repeat until the model finishes.

The interesting part is not the loop itself, but what gets placed into context before each turn. Pi assembles:

- Base system prompt (intentionally small)
- Project-specific instructions
- Available tools
- Session history
- User messages
- Skill or extension instructions

This layered prompt system is what lets Pi stay general while adapting to specific codebases without changing the global implementation.

## Tools as the Bridge

Pi exposes file reading, shell commands, code editing, and search as tools. The model requests a tool call; Pi executes it; the result feeds back into the conversation. The tools are part of the model's prompt and schema, so the model knows inputs, outputs, and semantics.

Once you see tools this way, the agent stops being a chatbot and becomes a planning engine that acts through function calls.

## Extensions Without Bloat

Extensions add capabilities without hardcoding them into the core. An extension can contribute:

- Additional tools
- Custom commands
- Modified prompts
- Project-specific integrations

The pattern is: keep the core small, create extension points for everything optional. This is the same principle behind Hermes' skill system, and seeing it validated in another codebase is useful confirmation.

## Compaction: Fighting Context Limits

Long coding sessions generate huge histories. Pi handles this by summarizing or compressing older conversation state into a compact representation. Good compaction keeps:

- The user's goal
- Important decisions
- Files that were changed
- Current blockers
- Relevant commands and results

And it drops noisy details that are no longer needed. Without this, any serious coding agent hits a wall after a few dozen turns.

## Skills as Operational Instructions

Pi's skills are not documentation for humans; they are instructions for the agent. A skill defines a repeatable procedure: what files to read, what commands to run, what checks to perform, and where the approval gates are.

This is useful for complex workflows. Instead of forcing the model to rediscover the same process every time, a skill encodes it so the agent follows it consistently.

## Takeaways for Agent Builders

1. **Keep the core loop minimal.** The value is in context assembly and tool execution, not in elaborate orchestration logic.
2. **Separate TUI from runtime.** The same core should work headless, in a CLI, or inside another application.
3. **Layer your prompts.** Base behavior, global instructions, project instructions, skill instructions, user request — in that order.
4. **Invest in compaction early.** Context limits are the bottleneck for real coding tasks.
5. **Treat skills as code, not docs.** If a skill is not precise enough for an agent to execute, it is not done.

## Sources

- Alejandro AO, "How Pi Works: Agent Architecture, Tools, TUI, and Skills" (2026-07-14): https://alejandro-ao.com/pi-architecture/
- Pi coding agent repository: https://github.com/earendil-works/pi-coding-agent
- Discord discussion (#ai-tech): https://discord.com/channels/462663954813157376/1284063844314120224/1526405899646926848

## Open Questions

- Has the Dwarves team already evaluated Pi against Hermes' current architecture? If so, what gaps emerged?
- Pi uses npm-based distribution. How does its extension loading mechanism compare to Hermes' skill/plugin system in practice?
- The post mentions compaction but does not describe the algorithm. Is it summarization-based, window-based, or something else?
- Pi's session state format is not documented. How does it handle concurrent sessions or session recovery after crashes?

## Residual Risk

- The Pi architecture post is a tutorial, not a primary source. Some details may be simplified for pedagogical clarity.
- The project is relatively new (npm package exists, but star count and community size are unknown). Durability is unproven.
- No direct performance benchmarks are provided in the post. Claims about compaction or tool efficiency are architectural, not measured.
