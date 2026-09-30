---
draft: true
title: 'Forward engineering September 2026'
description: 'September notes converged on toolchain control, AI-assisted build loops, and the cloud-computer shape of agent workflows.'
date: 2026-10-01
authors:
  - monotykamary
  - phucld
  - vincent.console
  - baddeed
  - 0xm
  - 0xlight
slug: forward-2026-09
---

September's notes kept circling the same engineering question: when tools get easier to adopt, where does control move? The month covered hardware toolchains, AI-made games, model routing for coding agents, and cloud computers for persistent agent work. The through-line is practical: test for workflow fit, escape hatches, and the loop after the demo.

## Tech radar

### Hackable 3D printers as a toolchain-control test

**Assess**

A #build-club printer-buying thread turned into a concrete version of a familiar dependency question: how much of the toolchain do we control after the purchase? monotykamary pointed toward Creality SPARKX i7, or Creality generally, for hackable and OSS-leaning printing, while the Bambu side of the discussion exposed the real issue behind the IP-rights hyperbole: cloud gates, firmware controls, third-party slicer paths, and accessory breakage. The useful next step is not a brand verdict yet. Trial a SPARKX i7 or K2, check root access, firmware source, slicer independence, and Creality's GPL standing before we recommend it as the default lab printer. [read the note](/build-club-hackable-3d-printer-note-2026-09-27)

### AI-built mini-games move the bottleneck to art and retention

**Trial**

The build-club team shipped several playable mini-games with AI, including a Gunbound-style clone, Hanoi Road Crash, tiltclub, and pixelrocket. The thread's useful finding was not that AI can make a game demo. It was that implementation stopped being the long pole: vincent.console said core gameplay came fast and most effort moved to art finetuning, then the team shifted to retention and monetization mechanics. The next useful experiments are small and measurable: test extra turns against cosmetics, implement the fixed-RNG variant that lets players alter outcomes instead of rerolling, and compare retention-led launches against acquisition-led ones. [read the note](/ai-games-art-bottleneck)

### Cheaper capable models point agent systems toward worker fleets

**Assess**

The Sonnet 5.5 thread framed model choice as a routing problem. phucld shared Max Blade's game-demo claim, then the team compared where a cheaper capable model might sit relative to premium frontier models. The useful architecture is a two-tier agent system: cheaper models handle implementation loops, while more expensive models plan, review, and catch integration risk. Before moving budget or defaults, run the same small product task through Sonnet 5.5, Opus 5.5, and the current default coding model; compare cost, wall time, human interventions, and final diff quality, with separate scoring for greenfield demos and existing-code maintenance. [read the note](/sonnet-5-5-worker-models)

### Cloud computers make agents operational, not automatically better

**Assess**

The Dot, Grok Bot, and Codex Cloud discussion showed the category converging faster than the marketing claims can differentiate it. OpenAI's DevDay recap described always-on Dots, Grok Bot positions a bot as having its own computer and tool access, and phucld's first read of Dot was that it looked like one cloud computer with access to his machine, not yet clearly different from Codex Cloud. The evaluation should move from vendor promise to operating model: state, approval flow, credential isolation, resume-after-failure behavior, audit logs, and the handoff back to a human. Run one small task across the tools before calling a winner. [read the note](/dot-cloud-computers-make-agents-operational)

## Open threads

- Build a control checklist for dev-tooling purchases: cloud dependency, forced updates, third-party interoperability, firmware or source access, and escape hatch.
- Repeat the AI-mini-game workflow once more in a week: core loop, art pass, shipping path, and whether the same template still works with a different builder.
- Define a model-routing threshold before testing worker fleets: what defect rate, review load, or repair time makes a cheaper worker a false economy?
- Compare Dot, Grok Bot, and Codex Cloud on one real workflow with interruption and resume, not on launch-page capability lists.
