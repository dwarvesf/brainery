---
draft: true
title: "Elixir's second act: types, then production agents"
description: "In 2026 Elixir became a gradually typed language and the BEAM became the default home for production AI agents. A snapshot of the ecosystem, and the three bets that define its next year."
date: 2026-08-15
toc: true
authors:
  - tieubao
tags:
  - elixir
  - phoenix
  - liveview
  - agents
  - arc
---

# Elixir's second act: types, then production agents

In 2026 Elixir crossed two lines at once. The language graduated to a gradually typed language. The runtime became the default home for production AI agents. Both shifts took years. Both landed within months of each other. This post is a snapshot taken from the August meeting circuit. It names the moves, the receipts, and where the story is overstated.

## The type system went live

Elixir has been moving toward types for years. The work shipped in June with v1.20. The compiler now infers a set-theoretic type for every program. It runs without annotations. It reports two kinds of signal: verified bugs, which are typing violations that fail at runtime, and dead code. The false positive rate is low. Teams report dropping Dialyzer.

The chain is visible in the release history. v1.19 checked protocols and anonymous functions in late 2025. v1.20 drew the whole language into inference this June. v1.21, targeted for November, adds recursive and parametric types, then user-facing type signatures. The direction is steady. The risk is the same risk every gradual type system faces in production: false positives must stay low at scale, or teams stop trusting the checker.

## The web core held

Phoenix and LiveView remain the center of gravity. LiveView 1.2 shipped in June with colocated CSS: styles live next to the component that uses them, extracted at compile time for the bundler. It rounds out the colocation story that 1.1 started with hooks and JavaScript. The patches after 1.2 were mostly security and navigation work. Phoenix sits at 1.8.x. The pace is mature, not frantic.

## The BEAM became the agent runtime

Here is the thing that changed the argument for Elixir this year. OpenAI open-sourced Symphony, a reference implementation for orchestrating autonomous coding agents. It manages issue trackers, spawns isolated agent runs, and runs multi-turn work to pull requests. Its reference implementation is about 96 percent Elixir and OTP. The choice was not ceremonial. The BEAM supervises concurrent, long-running processes, isolates failures, and hot-reloads code. Those are exactly the primitives agent orchestrators need.

The rest of the ecosystem rushed to meet the moment. Livebook runs full Python cells with zero-copy Arrow transfers and distributes Python over Erlang distribution. The Nx stack, Axon, Bumblebee, and Explorer, keep maturing. Voyager, a new Observer replacement, exposes live BEAM nodes to assistants over MCP. WeaveScope traces agent runs natively on the BEAM with token and cost waterfalls. The MCP connector appears everywhere. Figure 1 shows the shape of the ecosystem by adoption.

![GitHub stars of the leading Elixir-language repositories, August 2026](assets/fig1-ecosystem-stars.png)

**Fig. 1.** Leading Elixir-language repositories by GitHub stars, August 2026. The web, realtime, and analytics core dominates the top; the network effect of Phoenix and LiveBook is visible below it. Data: GitHub topic search, 2026-08-15.

## The durable base

The story is not only agents. Ash keeps a sprint cadence, three point releases already this month, two of them security patches. It positions itself as declarative and agent friendly, with generated manifests to call across BEAM nodes. Background jobs gained a contender. Belay runs durable jobs as memoized step sequences, so a crash mid-flight resumes without re-running paid work. Oban remains the default and stays close.

Embedded Elixir is steady with Nerves, and AtomVM keeps the tiny VM alive. Local-first has a real champion. Hologram runs pure Elixir in the browser, and its latest release even runs Elixir regexes on the client with matching server semantics. The VM hobbyists are alive: PON-BEAM re-architects the runtime, and LING runs Erlang with no operating system at all.

## What the community is arguing about

The conferences this autumn will argue the AI question directly. ElixirConf US runs in Chicago in September, with keynotes from Jose Valim on set-theoretic types and Zach Daniel from Ash. Goatmire, in Sweden in October, pairs the main event with NervesConf EU and warns this is its last year until 2027.

The honest skeptic notes are security. The supply chain hardened: HexDocs moved to per-package subdomains after an audit, and Elixir ships attested software bills of materials. Yet the community warns about AI-generated SEO posts that label critical Elixir remote code execution as safe. On vulnerability claims, read the primary source.

## Where the argument leaks

Three claims need a check. First, verified bugs with low false positives is the promise; the production record is still young, and v1.21 signatures do not exist yet. Second, the agent story is mostly orchestration and operations, not Elixir becoming a better model layer. That is a real but narrow win. Third, the security marketing noise means trust must be earned per advisory, not inherited.

## What to watch next

1. Typing adoption in production. Watch false positives and whether v1.21 signatures land.
2. Agent orchestration on the BEAM. OpenAI's choice plus distributed Python plus MCP integration is the strongest signal of the year.
3. Local-first with Hologram and native-compile Elixir with Aura, both contrarian flanks.
4. Supply chain hardening through 2027.
5. The jobs and durability competition, Belay against Oban Pro.

The shape is coherent. The language got a type system. The runtime became the operational model for agents. The base for both, web, realtime, and fault tolerance, never stopped shipping. That is a rare position for a language to hold at once.

Related: [On agentic AI](on-agent.md), and the [arc series](README.md).
