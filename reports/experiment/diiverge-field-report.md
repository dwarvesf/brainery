---
draft: true
title: 'Diiverge: an infinite point-and-click adventure where every image is a fork'
description: '*Field Report · 2026-09-03 · from #build-club discussion*'
date: 2026-09-27
slug: diiverge-field-report
---

## Diiverge: an infinite point-and-click adventure where every image is a fork

*Field Report · 2026-09-03 · from #build-club discussion*
*Sources: X posts by @charliie (launch, growth, stack), diiverge.co sponsors page*

## What it is

Diiverge is a persistent, infinite point-and-click adventure that launched Sep 2, 2026. The core mechanic: every picture in the game is a fork. Click something in a scene, the system generates what happens next, and the world grows in that direction. The world state is shared and persistent: 800+ scenes were generated in the first day, and the community can keep carving new ground.

It is an interesting case study for generative-game builders because it explicitly couples three patterns that are usually kept separate: a composable image-generation pipeline, a persistent scene graph as the source of truth, and a per-scene cost model paid by sponsors rather than by players.

## How the stack is assembled

The creator published the stack on the day after launch (X, Sep 3):

- **Nano Banana 2 (Google)** for keyframes
- **SAM 3 (Meta)** for segmentation
- **H3 Max via fal** for video transitions
- **GPT-5.6 (OpenAI)** for world building
- Hosted on **Vercel**

Reading the pipeline from the launch description: a scene is an image. Segmentation (SAM 3) makes regions clickable, the world-building model (GPT-5.6) decides what clicking a region leads to, a keyframe model (Nano Banana 2) generates the next scene's image, and video transitions (H3 Max) bridge between them. The "every picture is a fork" mechanic is therefore a scene-graph traversal problem, not a bespoke game engine problem: click target -> model call -> new node in the graph.

## Economics: carving scenes is the unit of cost

The sponsors page makes the cost model explicit:

- Carving new ground (an image, ten seconds of film, a map) costs about **50 cents a scene**
- Walking carved paths is free forever
- **$1 adds about 2 scenes** to a volume; once a volume's ground is carved, those scenes never expire
- Sponsors are credited in the corner of frames, weighted by contribution

Volume I ("The Lantern Cove") shows **1,817 scenes carved** with no limit set, and lists Relaximus as a supporter (Sep 2). The per-scene accounting is a useful reference point for anyone estimating unit economics of generation-heavy products: roughly $0.50 per generated scene when composed as image + short video + metadata.

## What's worth borrowing

Three design decisions stand out for builders:

1. **The scene graph is the product.** Instead of a linear generated narrative, the world is a tree (tree/map view at the ?map URL) where every player's click can add real, permanent ground. Persistence is the differentiator, not generation quality alone.
2. **Sponsorship instead of per-player paywalls.** Costs scale with world growth, so funding is attached to the shared world, not to individual players' sessions. Feedback in replies does flag a freemium paywall kicking in too early, so sponsorship is layered on top of existing monetization.
3. **Best-of-breed model composition.** The pipeline mixes Google, Meta, fal-hosted, and OpenAI models for different stages; no single vendor does all four jobs well.

## Caveats

- Stack details are creator-stated (single X post); no public docs or repo to verify against.
- Model names are as published; Nano Banana 2, SAM 3, H3 Max, and GPT-5.6 may move fast, and the post is a point-in-time snapshot.
- The $0.50/scene figure is vendor-stated, not independently measured.

## Sources

- Launch post (Sep 2): https://x.com/charliie/status/2095229968955441581
- Growth post, 800+ scenes (Sep 3): https://x.com/charliie/status/2095322758036979875
- Stack post (Sep 3): https://x.com/charliie/status/2095464525755547817
- Sponsors page: https://www.diiverge.co/sponsors
- Discord share (0xm, #build-club): https://discord.com/channels/462663954813157376/1280726623414390805/1544933284092452904
