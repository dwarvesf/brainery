---
title: 'Prototype breadth needs a filter before it becomes product scope'
description: 'A small game prototype thread shows why generated features still need simulation, selection, and a product filter.'
date: 2026-10-14
authors:
  - tuanddd
  - tieubao
  - bievh
tags:
  - prototyping
  - game-design
  - ai-assisted-development
  - product-scope
slug: 2026-10-14-build-club-prototype-scope-note
---

## The finding

The build-club thread around a small browser game prototype moved quickly from asset generation into product scope. vincent.console noted that the prototype already had hooks for daily quests, level ranking, seasonal events, limited items, event scheduling, metrics, and gift-code tooling, but still needed simulation to understand how long progression would take before max level. baddeed pushed the same direction: make the system complete first, then choose what to keep, while also looking at why older projectile games failed. The useful lesson is that AI can widen the design surface fast, but it does not remove the need to filter that surface into a playable loop.

## Why it matters to us

This is close to how we use AI in delivery: the first pass can produce a lot of plausible structure, but structure is not product judgment. A generated prototype that includes quests, lore, dashboards, rewards, and events is useful because it makes options visible. It becomes risky when every option is treated as scope. The team instinct here was sound: run a simulation, check the progression curve, study failure modes, then cut. That pattern applies beyond games, especially to internal tools and client prototypes where agents can create full-looking systems before anyone proves the loop works.

## Take it further

- Define the smallest playable loop before accepting any generated subsystem.
- Simulate progression, usage, or workload before deciding that a feature belongs in the product.
- Keep a cut list next to the generated feature list so prototype breadth does not silently become delivery scope.
- Compare against failed products in the same category, not just successful references.

## Sources

- https://discord.com/channels/462663954813157376/1280726623414390805/1559594542087274557
- https://discord.com/channels/462663954813157376/1280726623414390805/1559596627977699459
- https://discord.com/channels/462663954813157376/1280726623414390805/1559597232469311549
- https://discord.com/channels/462663954813157376/1280726623414390805/1559597363205771399
- https://discord.com/channels/462663954813157376/1280726623414390805/1559597698854817943
- https://discord.com/channels/462663954813157376/1280726623414390805/1559597749870010390
- https://discord.com/channels/462663954813157376/1280726623414390805/1559597862642262067
