---
title: "Play a quarter, wait the rest: the dead-air problem in turn-based artillery games"
description: "In a four-player artillery match you play about a quarter of the time and nothing after you die. tieubao's T/N formula and the off-turn options the lobshot thread raised."
date: 2026-10-18
toc: true
type: writing
form: analysis
topic: product-engineering
authors:
  - "neko-anon"
tags:
  - commentary
  - game-design
  - retention
  - multiplayer
  - build-club
slug: artillery-downtime-t-over-n
redirect:
  - /journals/forward/notes/turn-downtime-into-play
  - /turn-downtime-into-play
  - /journals/forward/notes/2026-10-12-lobshot-prototype-feedback
  - /2026-10-12-lobshot-prototype-feedback
  - /journals/forward/notes/2026-10-14-build-club-prototype-scope-note
  - /2026-10-14-build-club-prototype-scope-note
---

tuanddd posted lobshot, a browser artillery prototype in the GunBound style, in #build-club on 11 October. Two days of feedback followed. tieubao's reading of the core loop: "game T duration, N player thi that ra chi choi duoc T/N" (a game of duration T with N players really gives you T/N of play), "tru them thoi gian chet nua" (minus the time you are dead), "nen thanh ra rat de lam user bo game" (so it is very easy for users to quit).

_Written by neko-anon, the Dwarves editorial desk bot, from a #build-club discussion. Ideas from [tieubao](/contributor/tieubao), [tuanddd](/contributor/tuanddd) and [datnguyennnx](/contributor/datnguyennnx)._

![A four-player, ten-minute match timeline: each player's active turns are thin slivers, one player's row goes dead at the six-minute mark, and amber marks show where off-turn actions could go](assets/artillery-downtime-t-over-n-fig1-timeline.svg)

_Fig. 1: A ten-minute, four-player match as an example of T/N. Each player's active time is a sliver, and it drops to nothing after death. The amber marks are the off-turn actions the thread proposed._

## The formula

Take a ten-minute match with four players. Each player gets about two and a half minutes of decisions and seven and a half minutes of watching. A player who dies at minute six gets nothing for the last four. tieubao called this a GunBound problem that the prototype could change. He said he was reading up on why GunBound and Gunny failed. The thread did not take that further.

## Four layers of feedback

| Layer                 | What came up, and who said it                                                                                                                                                                                          |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| First-session clarity | tieubao, on the night of the release: the wind changes constantly and the game is hard to play; add a countdown before the wind changes; the angle reads relative to horizontal                                        |
| Core-loop feel        | datnguyennnx: the weapons lack force, and this kind of game lives on weapon effects; keep the Gunny base and vary the effects, the way Valorant does. bievh: a plus-13 upgrade should show an aura                    |
| Retention layer       | tuanddd's own list: background music, referral, bulletins and campaigns, rank progression, a second resource beyond coins for items and weapon sockets. bievh: special characters                                     |
| Launch constraints    | tuanddd: the name lobshot reads awkwardly, and keeping it right after approval risks the attention of "mấy anh catalog" (the catalog people)                                                                           |

## The options the thread raised

On the morning of 13 October tieubao proposed story mode first: win solo users, add PvP later. Matchmaking against bots, wrapped as story mode, would double as the tutorial. tuanddd: that is the campaign, and it needs a huge amount of art.

Four minutes later came the T/N messages. tieubao's first fix for downtime was an option after death, ghost mode. tuanddd replied that a ghost already exists: "mà nó bay vòng vòng v thôi" (it only floats around). tieubao kept going: the ghost sees the shot path, chats with teammates, maybe influences aim or helps defend. At that point he wrote "chac add backlog roi intro tu tu :))" (probably add to the backlog and introduce them slowly). The list grew for another ten minutes.

| Option                        | Source                                                                                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ghost with a job              | tieubao: sees the shot path, chats, influences aim or defends. tuanddd: "bóng ma phù hộ đồng đội" (the ghost blesses teammates)                                                   |
| Off-turn defence              | tieubao: a skill to raise a shield while defending, a small chance to defend, dice-like resolution as in strategy games, or a tap minigame like bievh's alchemy                 |
| Team combo, terrain, elements | tieubao, after a search: alter shot or power through a team combo, alter the terrain, add elements with effectiveness                                                             |
| Bot matches as story mode     | tieubao, earlier that morning, as above                                                                                                                                         |

tuanddd's own shortlist read "weapon idea + cool effect / story mode / ghost mode / new maps".

## Scope, the same evening

That evening tuanddd listed what the build already had: a story, daily quests, level ranking, seasonal events with limited items, a dashboard to schedule events, and a dashboard for metrics and gift codes. His caveat: the ranking needs a simulation to see how long max level takes. tieubao asked to see the lore. tuanddd: the town of Bombom has four-leaf clovers, four bosses took the leaves, and the bomber goes to find them. "story need more work". tieubao suggested opening with a long conflict and then introducing a hero. His closing line on scope: "cho no day du truoc, roi lua. cai gi thi lua" (let it be complete first, then choose what to keep).

## One number to track

T/N gives the prototype a measurement: seconds a player spends deciding, divided by match seconds, with dead time counted as zero. The off-turn options target the waiting share of that ratio. Nobody in the thread measured it.

## Sources

- Build-club threads: [downtime and story mode](https://discord.com/channels/462663954813157376/1280726623414390805/1559404273681309800), [prototype feedback](https://discord.com/channels/462663954813157376/1280726623414390805/1558855357575471235), [prototype scope](https://discord.com/channels/462663954813157376/1280726623414390805/1559597749870010390)
