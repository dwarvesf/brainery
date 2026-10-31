---
title: 'Forward Engineering October 2026'
description: 'October''s notes connect game prototype judgment, practical launch surfaces, and more deliberate AI-assisted production workflows.'
date: 2026-11-01
authors:
  - baenv
  - tuanddd
  - vdhieu
  - minhluuquang
  - phucld
  - quanghuynguyen1902
  - tieubao
  - monotykamary
  - datnguyennnx
  - toanbku
  - zlatanpham
slug: forward-2026-10
---

October's work clustered around three themes. Small game prototypes exposed where product judgment still matters, launch experiments brought distribution into the design loop, and AI-assisted workflows shifted attention toward pipeline cost and review.

## Tech radar

### Intentional friction in niche games

**Trial**

The 9T prototype keeps genre-specific mechanics, random character rolls, and slow discovery because those choices carry the cultivation theme. The next useful test is whether new players can discover the core loop without a walkthrough, and where that discovery turns into boredom. [read the note](/9t-cultivation-game-friction)

### Handmade polish for playable prototypes

**Trial**

Hand-tuned pixels and repeated play-throughs gave one small game prototype its visual and interaction polish. A before-and-after capture would make the next pass easier to judge and show which changes improved readability, timing, or feedback. [read the note](/handmade-polish-in-small-game-prototypes)

### Progression through player choices

**Trial**

The Vô Vi prototype separates martial manuals, realms, factions, and professions into distinct progression levers. One complete path should come first so the team can see whether each layer changes a decision or merely adds another stat. [read the note](/wu-wei-progression-skill-trees)

### Mac control across awkward system states

**Trial**

Continuo focuses on the moments where multi-device control utilities often fail: sleep, restart, operating system updates, and the login screen. A small device and macOS test matrix can show which dependencies survive those transitions and whether setup cost is justified by daily use. [read the note](/continuo-mac-control-after-restart)

### Reference video as rigging input

**Assess**

A surfaced Opus workflow uses video reference to separate a character, split body parts, and prepare a motion skeleton. The claim needs a local trial on both a clean clip and a difficult clip, with cleanup time compared against manual segmentation and rigging. [read the note](/reference-video-rigging-shortcut)

### Distribution planning before store submission

**Assess**

A Vietnam-focused indie game may need to choose between web, mobile stores, PC stores, and direct community distribution before store paperwork begins. A release-path checklist should cover review lead time, payments, ratings, entity requirements, and questions that need legal review. [read the note](/2026-10-07-game-distribution-vietnam-launch-surface)

### Landing pages as playable launch surfaces

**Trial**

The Little Da Nang landing page became a lightweight product surface through a hidden bar and small games. Measuring repeat visits, shares, and interaction completion would show whether this web surface can validate demand before a heavier store launch. [read the note](/2026-10-08-little-danang-landing-page-as-build-surface)

### Economy loops before monetization

**Assess**

A game economy needs clear sources, sinks, exchanges, progression pressure, and status incentives before recurring revenue can emerge. The team can map that loop, then test which existing communities produce retained players rather than relying on broad audience size. [read the note](/2026-10-09-game-monetization-starts-with-the-economy-loop)

### Compositing in AI video pipelines

**Trial**

An AI video experiment showed that pipeline design can move work from repeated generation into rendering and compositing. Cost per minute and turnaround time should be tracked across several runs so reusable layers and feedback loops can be judged against fresh generation. [read the note](/2026-10-10-ai-tech-compositing-ai-video-costs)

### Layered feedback for playable prototypes

**Trial**

Feedback on a browser game separated first-session clarity and core feel from retention and distribution ideas. Tagging comments by layer can keep the next build focused on lobby state, countdown timing, and aiming cues before campaign and referral systems expand. [read the note](/2026-10-12-lobshot-prototype-feedback)

### Active play during turn-based downtime

**Assess**

Turn-based artillery games leave each player inactive for much of a multiplayer match. A bounded defensive action or ghost-mode choice could reduce perceived waiting, while bot matches can double as campaign onboarding when the player pool is still small. [read the note](/turn-downtime-into-play)

### A filter for generated prototype breadth

**Trial**

AI-assisted prototyping made quests, rankings, events, metrics, rewards, and operational tools cheap to sketch. The team still needs a smallest playable loop, progression simulation, and an explicit cut list so generated breadth does not quietly become product scope. [read the note](/2026-10-14-build-club-prototype-scope-note)

### An overpowered prologue before progression

**Assess**

Starting at full power and then resetting to level one can teach the destination before normal progression begins. A short playable version should be compared with a cutscene version, with attention to whether players read the reset as a clear story trigger or an unwanted loss. [read the note](/overpowered-prologue-reset)

### Routing expiring model credits

**Assess**

Time-limited model credit can support a focused agent-tool comparison when the task, expected output, and stop condition are set first. The team should verify the terms, run the same input through the credited and default routes, and record quality, latency, and credit use. [read the note](/2026-10-17-expiring-model-credits-routing)

### Review in terminal-first agent workflows

**Trial**

A terminal-first coding workflow moves effort from editing toward task framing and inspection of risky changes. The next step is to name the changes that always need human review and record which mistakes pass tests but still appear during code inspection. [read the note](/terminal-agent-code-review)

## Open threads

- Define a shared way to separate first-session clarity, core-loop feel, retention, and distribution feedback before expanding a prototype.
- Build a release-path checklist for small Vietnam-focused games, then mark the questions that require legal review.
- Track AI media cost per minute across a small batch and identify which stages can move into deterministic rendering or compositing.
- Compare tightly scoped and broad agent prompts on similar coding work, including review time and mistakes that survive tests.
- Keep a cut list beside every AI-generated feature list, and simulate the core progression or workload before accepting more scope.
