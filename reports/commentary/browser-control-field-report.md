---
draft: true
title: 'Browser Control: Let Agents Drive Your Real Browser'
description: A look at anomalyco/browser-control, a local relay that lets coding agents run Playwright against your actual Chromium profile, with guardrails, audit journals, and human handoff.
date: 2026-07-20
authors:
  - content-editor
tags:
  - agents
  - browser-automation
  - playwright
  - mcp
  - tooling
slug: browser-control-field-report
---

# Browser Control: Let Agents Drive Your Real Browser

Most agentic workflows that touch the web spin up a sterile headless browser. You lose your extensions, your logged-in sessions, and the visual context of a real tab. **browser-control** (GitHub: `anomalyco/browser-control`, 46 stars, TypeScript) takes the opposite approach: it attaches a small Chromium extension and a local relay to your existing browser so a trusted agent can run Playwright code against the profile you already use.

The project is young, one commit on main, but the design decisions are deliberate and worth studying if you are building agent surfaces that need to interact with the live web.

## How it works

The setup has three parts:

1. **A Chromium extension** (loaded unpacked at `chrome://extensions`) that opens a CDP-backed channel to a local relay.
2. **A local relay** (`127.0.0.1:19989`) that exposes a CLI and an MCP server. It starts automatically on the first command and reconnects if the extension reloads.
3. **A per-session sandbox** where the agent receives `browser`, `context`, `page`, and a persistent `state` object. Each session gets its own tab so concurrent agents do not collide.

Because the agent is talking to your real browser, it sees your cookies, your ad blockers, your password manager, and your SSO sessions. That is the point, but it is also the risk, so the relay ships with guardrails.

## Guardrails and audit

The relay blocks CDP commands that would destroy browser state: clearing cookies, clearing cache, or closing the browser. No matter what a script asks for, those commands are rejected at the relay layer.

Every execute is journaled per session, so you can review exactly what an agent did. There is also a **read-only session** mode (`--read-only`) that lets scripts navigate, read the DOM, and take screenshots but refuses any input-dispatching commands like click or type. That is useful for inspect-only tasks where you want the agent to see a page state but not change it.

## Human handoff

A script can pause and ask you to complete 2FA, a CAPTCHA, or a payment step. The in-page UI shows a completion control, and the toolbar badge flips from `RUN` to `WAIT`. Once you finish, the script resumes from where it left off. This matters because a lot of agentic browser work dies on auth walls that headless browsers cannot cross.

## MCP and skill integration

The project exposes both a CLI (`browser-control`) and an MCP server (`browser-control-mcp`). The MCP path is notable: it returns screenshot buffers as native image attachments without writing temp files, and restarting the MCP process does not interrupt an ongoing CLI session because the relay lives outside the MCP process.

There is also a **skill** installable via `npx skills add git@github.com:anomalyco/browser-control.git` that teaches OpenCode, Claude Code, Cursor, and similar agents how to drive the relay. The skill text is also printable with `browser-control skill` for agents that do not use the skills CLI.

## Recording and screenshots

You can capture tab activity to WebM or to a CDP frame directory for later review. A `screenshotWithLabels` helper annotates visible interactive elements with simple `e1`, `e2`, ... labels so an agent can reason about the UI and reference elements without fragile selectors.

## Limitations worth knowing

- **Downloads do not work** through the extension-backed tab because Chromium blocks the download-behavior CDP commands that Playwright needs. The workaround is to read the payload via fetch or API in the page context and write it with the sandbox's `fs` module.
- **Private repo**: the package is currently private, so installation is from a source checkout with `pnpm` and `bun`.
- **Beta stability**: the README warns that the tool is for "trusted agents" and recommends a two-phase approval flow for destructive work (inspect first, then run a second approved script).

## Why it matters

Headless browser automation is a solved problem. Running agents against your real browser profile is not. browser-control sits in a useful middle ground: it gives agents the context of a real user session while adding guardrails, audit trails, and human gates that headless setups do not need because they are assumed to be disposable. If you are building agent workflows that need to interact with SaaS dashboards, internal tools, or payment flows, the design patterns here, session isolation, relay-level permission filtering, and handoff checkpoints, are directly applicable.

## Sources

- monotykamary shares browser-control on Discord: https://discord.com/channels/462663954813157376/1284063844314120224/1528397805234688152
- GitHub repository: https://github.com/anomalyco/browser-control

## Open questions

- How does session isolation hold up under concurrent load from multiple agents? The README claims isolation but there is no stress-test data.
- What is the latency overhead of routing Playwright commands through the extension + relay versus a direct CDP connection?
- Is there a plan to support Firefox or Safari, or is the architecture tightly coupled to Chromium's `chrome.debugger` API?

## Residual risk

- The repository is private and has only one commit on main. Long-term maintenance is unproven.
- 46 stars is very early; the project could pivot or stall before reaching stability.
- Using a real browser profile for agent automation increases blast radius if the guardrails fail or the relay is misconfigured.
