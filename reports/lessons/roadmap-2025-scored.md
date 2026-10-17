---
draft: false
title: "The 2025 roadmap, scored: 22 promises, 5 kept, 9 dropped"
description: "Our January 2025 plan promised four bets and five chairs. In October 2026 I scored all 22 promises against our repos, databases and pages: 5 kept, 8 half kept and 9 dropped, each with its evidence."
slug: roadmap-2025-scored
kind: field-report
date: 2026-10-18
toc: true
authors:
  - tieubao
tags:
  - roadmap
  - retrospective
  - leading-chair
  - planning
redirect:
  - /org-roadmap-2025
  - /site/org/2025/roadmap-2025
  - /org/2025/roadmap-2025
  - /8ike6A
  - /arc
  - /arc/on-blockchain
  - /arc/on-platform
  - /arc/on-spatial
  - /org-learning-chair
  - /site/org/2025/learning-chair
  - /org/2025/learning-chair
  - /U4XMXQ
  - /org-partnership-chair
  - /site/org/2025/partnership-chair
  - /org/2025/partnership-chair
  - /sLJGew
  - /org/2025/delivery-chair
  - /AesypA
  - /org/2025/communication-chair
  - /oPwc3w
  - /org/2025/engagement-chair
  - /O2qaVQ
---

The 2025 roadmap still sits on this site in the future tense. "We're entering a pivotal year," it says, and then lists four bets and five chairs, 22 promises in all. It is October 2026. I went through every promise, looked for what happened to it, and scored it kept, half kept or dropped.

![The 22 promises of the 2025 roadmap, scored {#fig-scoreboard .live}](assets/roadmap-2025-scored-fig1-scoreboard.svg 'Each row is one promise from the roadmap and its chair pages. White is kept, a ring is half kept, amber is dropped. Light up one score, or hover a row for the promise as written.')

The tally is 5 kept, 8 half kept and 9 dropped. Every score has its evidence in the table below. Where the records cannot settle a score, the row says what I could not find.

## TL;DR

All five promises we kept became a page, a policy or a small script: two service pages, a delivery report, the hybrid-working policy and a Discord tipping flow. Five of the nine we dropped needed someone's weekly hours: an apprentice batch, a bigger delivery team, translations, partner workshops and a VC channel. The other four had other causes. Spatial computing never found demand. The chair model got replaced. The labs treasury never got a budget line, and the DFG earning design never got adopted.

The counts point the same way. Contractor hours logged peaked at 5,458 in March 2026 and fell 68% by September. Pull requests merged across the four vault repos fell 56% from 2024 to 2025. The last case study on this site is dated August 2025.

## What we said in January

The plan has two layers. Four bets: AI engineering and agentic systems, blockchain, platform engineering and spatial computing. Five chairs, each with its own initiatives. Learning promised a labs treasury, build-logs, an AI apprenticeship batch and AI as a copilot for everyone. Delivery asked three questions about growth, quality and measurement. Communication promised short video, Vietnamese translations and an IP character. Partnership promised WALA workshops, VC packages and retainers that lead to platform ops. Engagement promised hybrid working, a gossip protocol, DFG earning by contribution weight and a recognition framework. One more line promised to "formalize our chair-based leadership model."

That makes 22 promises: 21 initiatives and bets, plus the chair model itself. The pages carry two dates. The chair pages say 14 January 2025. The roadmap says 15 June 2025, and the archive shows the roadmap and all five chairs landing in one commit that day. The anniversary post [Ten years strong](../../journals/changelog/2025-01-15-ten-years-strong.md) had already named the four bets and five chairs in January. I scored against the year.

I scored a promise **kept** when the thing exists and works today, **half kept** when it exists but thinner, later or unmeasured, and **dropped** when I found no trace or an explicit replacement. The evidence comes from pages on this site, public repos, our Notion databases and the vault's own history. Where the records hold people data I used counts only.

## The scorecard

Hybrid working scores kept because it works, though it was policy before the roadmap named it. Take it out and the tally is four kept.

| Promise                                   | Score     | What I found                                                                                                                                                                                                                                                |
| ----------------------------------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **The plan**                              |           |                                                                                                                                                                                                                                                             |
| AI engineering and agentic systems        | Kept      | Service page live since 12 Jan 2025. Two of the five case studies published in 2025 are AI work. The homepage today sells an AI to production track and a fixed-fee Production Readiness Assessment.                                                        |
| Blockchain                                | Half kept | Web3 and Crypto is still a vertical on the homepage. The only 2025 case study in the area monitors our own ICY backend. The last case study for an outside blockchain client is dated Dec 2024.                                                             |
| Platform engineering                      | Kept      | Service page since 12 Jan 2025, a retainer offer for post-MVP teams on 27 Jun 2025, a public status page since 25 Mar 2025. The homepage now sells Run and Own.                                                                                             |
| Spatial computing                         | Dropped   | No service page, case study or repo. The one spatial note, a thesis dated 14 Jun 2025, was flagged draft in Jun 2026 and deleted in Aug 2026. The roadmap's own link for it looped back to the roadmap.                                                     |
| Formalize the chair model                 | Dropped   | The five chair pages landed in the vault together on 15 Jun 2025. Nine role manuals written in Apr 2026 carry no chair names. Three chair pages were deleted on 17 Aug 2026.                                                                                |
| **Learning chair**                        |           |                                                                                                                                                                                                                                                             |
| Treasury allocation for the labs team     | Dropped   | The handbook's revenue split already set aside a share of operating expense for labs before 2025. I found no new budget line.                                                                                                                               |
| A build-log for every experiment          | Half kept | 77 build-log entries are dated 2025, 62 of them in May. Ten are standalone and 67 sit in eight series. Today 25 are live, 10 are drafts and 42 are gone.                                                                                                    |
| AI Apprenticeship batch 2025              | Dropped   | The program page went up on 15 Dec 2024 and said applications open in late 2025. It still says stay tuned. The contractor database has no apprentice rows. A different senior-pipeline program reached draft in Sep 2026.                                   |
| Unlock: AI as copilot for everyone        | Half kept | Shared Claude configuration for the team (Mar 2026), a hardened Claude Code config with 38 stars and a proof-gated workflow kit, all public and all from 2026. The adoption measure the chair promised has no field in the contractor database.             |
| **Delivery chair**                        |           |                                                                                                                                                                                                                                                             |
| Grow the delivery team                    | Dropped   | Hours logged peaked at 5,458 in Mar 2026 and fell to 1,728 in Sep. Contractors reporting fell from 35 to 13. The active roster went from 27 on 21 Jul to 18 on 18 Oct.                                                                                      |
| Control quality at scale                  | Half kept | The tooling arrived in 2026: a public proof-of-done workflow kit and a written pipeline formula. I found no client score or defect series that shows quality moved.                                                                                         |
| Measure delivery wins                     | Kept      | A monthly delivery report with 1 to 5 ratings has sat in the playbook since Aug 2024. Hours moved to a progress form in Dec 2025. A project P&L has run monthly since May 2026.                                                                             |
| **Communication chair**                   |           |                                                                                                                                                                                                                                                             |
| Short video for TikTok, Facebook, YouTube | Half kept | A video pipeline write-up dated 10 Jul 2025 names YouTube Shorts, Instagram and Facebook reels as targets, and TikTok is not among them. The homepage links LinkedIn, X, Telegram, Discord and GitHub, and no video channel. I could not verify any output. |
| Vietnamese translations                   | Dropped   | I found no translated note among 1,302 Markdown files in the vault.                                                                                                                                                                                         |
| An IP character for content               | Half kept | A cat character, Neko, is the avatar of the site chat widget in code merged in Sep 2026. No content series runs on it. A 2025 brand refresh project is marked done.                                                                                         |
| **Partnership chair**                     |           |                                                                                                                                                                                                                                                             |
| WALA with established companies           | Dropped   | Four WALA visit notes exist, dated 2022 to 2024, and none came in 2025. A fifth episode, an interview with a startup CTO, went to its guest for review in Oct 2026. The assess-first idea lives on as the fixed-fee readiness assessment.                   |
| VC packages for AI startups               | Dropped   | No VC package, partner page or case. A sales plan from Apr 2026 still lists identifying five target VCs as a month-two task.                                                                                                                                |
| CTO and PM retainers into platform ops    | Half kept | The retainer offer page went up on 27 Jun 2025. In 2026 the idea became Run and Own. I could not count retainer contracts from the records I can read.                                                                                                      |
| **Engagement chair**                      |           |                                                                                                                                                                                                                                                             |
| Hybrid working                            | Kept      | Already true. The policy dates from Sep 2022 and was republished on 6 Sep 2024, with one to two office days a week as the norm. An office check-in bot built in Sep 2024 was last changed in May 2026.                                                      |
| Gossip protocol                           | Kept      | Handbook page dated 13 Jun 2025. A peer tips a useful share with /tip and the company vault pays, after ops review.                                                                                                                                         |
| DFG earning by contribution weight        | Dropped   | The June 2025 proposal (eleven token pages) was not adopted. ICY pays for notes, bounties and tips, and DFG stays a share token with staking.                                                                                                               |
| A talent recognition framework            | Half kept | A leveling framework with IC and M ranks was written in Feb 2026. The rank fields in the contractor database hold no values on 18 Oct 2026.                                                                                                                 |

## What the numbers say

### The delivery team shrank

The Delivery chair's first question was how to grow the team. I can measure the answer from December 2025, when every contractor started filing hours through a progress form.

![Hours logged per month and contractors reporting, December 2025 to September 2026](assets/roadmap-2025-scored-fig2-delivery.svg 'Hours logged peaked at 5,458 in March 2026 and fell to 1,728 in September. Contractors reporting fell from 35 to 13. Amber marks the peak.')

Logged hours rose from 4,456 in December to 5,458 in March, then fell every month after March. September logged 1,728 hours, 68% below the peak, from 13 contractors against 35 in March. The roster says the same. Our Notion database held 27 active contractors on 21 July, 24 on 27 August and 18 on 18 October.

The dated rows for earlier months are thin. Of 275 contractor rows, 114 carry a start date and 57 of the 257 inactive rows carry an end date. Those rows show 7 starts and 9 ends dated in 2025, and 3 starts and 27 ends so far in 2026. The dates are incomplete, and the direction is still not growth.

Two causes explain most of the decline: client roll-offs through summer 2026, and AI efficiency shrinking the billing per person.

### Output fell after 2024

The Communication chair wanted content to build an audience. Output fell in 2025.

![Content pull requests merged per year in four vault repos, and case studies dated per year](assets/roadmap-2025-scored-fig3-published.svg 'Left: PRs merged in research, brainery, handbook and playbook. Right: case studies by frontmatter date. Amber marks 2025, the year after the peak.')

Across research, brainery, handbook and playbook, 333 PRs merged in 2024 and 148 in 2025. Case studies went the other way before they stopped: 3 dated in 2024, 5 in 2025 and none in 2026. The last one, on monitoring our own ICY backend, is dated 7 August 2025.

The Learning chair promised a build-log for every experiment. The vault holds 77 build-log entries dated 2025, and 62 of them carry a date in May. Ten stand alone and 67 sit in eight series. Today 25 of the 77 are live, 10 are drafts and 42 are gone, cut in the two August 2026 triages. I matched the survivors by title, so treat the split as close but not exact.

### The pipeline we cannot score

The Partnership chair listed success metrics with no numbers: "Maintain efficient sales cycle for WALA engagements" and "Establish partnerships with multiple VC firms". The deals database could not have scored them anyway. It holds 28 deals. Nineteen were created between July 2022 and February 2023, seven have no create date, and one each was created in December 2025 and April 2026. In June 2026 one prospect was open. Nothing I could read records the 2025 pipeline.

## What happened to the three chairs we deleted

![The chair model on seven dates](assets/roadmap-2025-scored-fig4-chairs.svg 'The chair model, from the 2019 handbook to this scorecard. The dates are evenly spaced, not to scale. Amber marks the deletion.')

The delivery, communication and engagement pages are gone. [brainery PR 214](https://github.com/dwarvesf/brainery/pull/214) deleted them on 17 August 2026, among 609 files cut in one triage of low-value content. Its description lists them as "generic chair descriptions". The learning and partnership pages survived the same triage. I recovered the deleted three from the vault's history and read them against the roadmap.

All three ended with success metrics that carried no number: "Increase client satisfaction scores", "Grow total social media following significantly" and "Achieve high team satisfaction score in quarterly surveys". A promise with no number cannot be scored, so I scored the initiatives the roadmap page names. Here is where the chairs landed.

| Chair                           | Promises | Kept | Half kept | Dropped | Page today |
| ------------------------------- | -------- | ---- | --------- | ------- | ---------- |
| The plan (bets and chair model) | 5        | 2    | 1         | 2       | Live       |
| Learning                        | 4        | 0    | 2         | 2       | Live       |
| Delivery                        | 3        | 1    | 1         | 1       | Deleted    |
| Communication                   | 3        | 0    | 2         | 1       | Deleted    |
| Partnership                     | 3        | 0    | 1         | 2       | Live       |
| Engagement                      | 4        | 2    | 1         | 1       | Deleted    |

The triage kept the two pages that named specific programs. Those two scored worst: none of their seven promises counts as kept. The three deleted pages hold three of the five kept promises. Specifics on the page did not predict delivery. The roadmap page and the two surviving chair pages are drafts now, and their URLs redirect here.

## Why things stopped

This section is my reading of the records.

**The pipeline went quiet.** The bets that needed outside demand had nothing to hang on. Spatial computing, VC packages, WALA workshops and retainers all depend on a conversation with a buyer. The deals database holds no 2025 row before December, and the live homepage sells an assessment, hardening and Run and Own to finance and technology companies. It has no spatial offer and no VC package.

**AI changed the junior math.** The apprentice program planned six months on live client projects, with applications opening in late 2025. They never opened. A draft we wrote in September 2026 for a replacement reasons the other way: AI removes the paid junior work, so it removes the reps juniors used to get, and a program has to build those reps on purpose.

**A weekly cadence needs a name.** Video, translations and WALA all needed a person's hours every week. The roadmap named a chair for each and no person. Gossip tipping survived because ops reviews each tip and pays it from the vault.

## What 2026 inherited

The chair names gave way to nine role manuals in April 2026, written for a firm that works with AI agents. The apprentice batch became a drafted senior-pipeline program in September. The build-log habit became field reports with measured tables, such as [Memo, rebuilt](../shipped/memo-rebuilt.md) and [the deploy pipeline formula](../shipped/deploy-pipeline-formula.md). The positioning moved from four bets to a plain offer: assess a system, harden it, and run it.

## What to change next

A promise goes on the page with a number and a date, or it stays in the notes. A promise that needs weekly hours names the person who gives them. The next roadmap should carry both, plus a re-score date on the page itself, so the reader can see how the last one did.

## Limits

- **The scores are mine.** Nine rows rest on judgement the records cannot settle: blockchain, the chair model, the labs treasury, the apprentice batch, video, the IP character, VC packages, retainers and DFG earning.
- **Hours are estimates.** The progress form captures approximate effort per entry, and it went live in December 2025, so I cannot compare 2025's first half.
- **PR counts count PRs.** They do not count words, and 2026's brainery PRs mostly restructure the vault.
- **I could not read channel analytics.** The video row rests on a write-up and the absence of links.
- **I searched names, pages and databases.** Private client work or code under a different name could hold spatial or blockchain work I did not find.

## Where the three notes went

The three notes are now drafts, and their URLs redirect here, along with the URLs of the three chair pages deleted in August 2026.

| Old note          | What survived here                              |
| ----------------- | ----------------------------------------------- |
| 2025 Roadmap      | The 22 promises, quoted and scored              |
| Learning chair    | Its four initiatives and the build-log count    |
| Partnership chair | Its three partnerships and the pipeline finding |
