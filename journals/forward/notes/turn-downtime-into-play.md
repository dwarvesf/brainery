---
draft: true
title: 'Turn downtime into play in turn-based artillery games'
description: 'A small product-design note on reducing dead time in Gunbound-style multiplayer loops.'
date: 2026-10-13
authors:
  - tieubao
  - tuanddd
  - datnguyennnx
tags:
  - game-design
  - retention
  - prototyping
  - multiplayer
slug: turn-downtime-into-play
---

## The finding

The thread started with ideas for a Gunbound-style game: stronger weapon effects, story mode, new maps, and unlockable weapons. baddeed pushed the discussion toward the core loop: in a turn-based multiplayer match with duration `T` and `N` players, each player only actively plays for roughly `T/N` unless the game gives them something meaningful to do outside their turn.

That reframes the retention problem. The fix is not only more content or better effects, but less dead air between turns and after death.

## Why it matters to us

For small game prototypes, the first users often arrive before matchmaking liquidity, content depth, or polished art. The thread points to a useful design pattern: wrap bots as story mode so early matches double as tutorial, then keep inactive players engaged with defensive actions, ghost-mode choices, or small timing-based interactions while they wait. That gives the prototype more chances to teach the loop before users churn.

## Take it further

- Prototype one defensive action during another player's turn, such as raising a shield, and measure whether it reduces perceived waiting.
- Test a ghost mode for eliminated players, but keep its impact bounded so living players do not feel punished by dead ones.
- Treat bot matches as campaign onboarding, not as a fake multiplayer queue.
- Separate cosmetic weapon effects from loop changes; the former improves feel, the latter changes retention.

## Sources

https://discord.com/channels/462663954813157376/1280726623414390805/1559399374247821313
https://discord.com/channels/462663954813157376/1280726623414390805/1559403363660071057
https://discord.com/channels/462663954813157376/1280726623414390805/1559403449630588942
https://discord.com/channels/462663954813157376/1280726623414390805/1559404156224274493
https://discord.com/channels/462663954813157376/1280726623414390805/1559404273681309800
https://discord.com/channels/462663954813157376/1280726623414390805/1559404414811377675
https://discord.com/channels/462663954813157376/1280726623414390805/1559404642129940604
https://discord.com/channels/462663954813157376/1280726623414390805/1559404681988542537
https://discord.com/channels/462663954813157376/1280726623414390805/1559405277433036923
https://discord.com/channels/462663954813157376/1280726623414390805/1559405785124048897
