---
draft: true
title: What the summit looks like from camp two
description: The Thoughtworks Engelberg retreat findings on AI-assisted engineering, ranked by what they mean for Dwarves and checked against our own documents, with what we already had and what we are adopting.
date: 2026-09-07
authors:
  - tieubao
tags:
  - ai
  - harness-engineering
  - verification
  - culture
  - strategy
slug: summit-from-camp-two
---

In June, forty CTOs and senior engineers spent three days in Engelberg, Switzerland, arguing about what software engineering is turning into. Thoughtworks wrote it up. One line has stayed with me: engineering now comes down to two questions, how do I describe the goal, and how do I check that I reached it.

Reports like this are easy to nod at and forget. So I did the thing I'd ask any of us to do: I took every practice the report names, twenty-three of them, and checked each against what Dwarves actually has on paper, in three places: the delivery and people documents, the kit every repo adopts, and my own coding-agent setup. What follows is the result. The findings are ranked by how much they matter for us, each with where we stood on the day I looked.

![The route: four camps and a summit, with an amber marker at camp two](assets/summit-from-camp-two-fig1-route.svg)

_Fig. 1: The report's findings as a climb. Generating code is the valley floor, the scaffolding around the AI is the camp we stand in, checking output at the speed it is produced is the next pitch, and the summit is a team where humans keep only the goal, the calls, and the acceptance._

## What to focus on

| # | Finding from Engelberg | Where Dwarves stood |
|---|---|---|
| 1 | Verification is the bottleneck, not generation. Check coverage, then have an agent try to break the code without failing a test, then run mutation testing. Nobody in the room could cite data on how many defects manual code review catches. | We had coverage and mutation testing. The break-it step was missing. Our code review rubric asks for a monthly sample of merged pull requests to check whether review caught what it should have; we had never recorded one. |
| 2 | The harness beats the model. The rules, checks, and routing around the AI matter more than which model you picked. One team turned linter output into step-by-step fix instructions and moved code-smell resolution from under half to about ninety percent. | We had measured this ourselves: a strong model planning and reviewing over cheaper models doing routine work came out about three times cheaper, same result. The lint-to-instructions trick was missing. |
| 3 | The harness should improve itself. Agents propose changes to their own rules and skills; humans prune. Skills decay like unowned code unless someone owns them and measures whether they still help. | We had the prune gate and had never switched on the half that grows proposals. No way to measure whether a skill earns its context. |
| 4 | The two clocks. Code time collapsed, delivery time did not move, because decisions and unclear specs are now the constraint. | Cycle time was unmeasurable: a close date on 2 of 62 projects in our projects database. No view of how long a decision had been waiting on me. |
| 5 | The apprenticeship problem. If seniors pair only with agents, juniors never learn judgment. Fix: a senior leads design out loud while the junior drives the agent; checkpoints with no model in the room; watch the seven to ten year cohort. | Our junior role budgets sixteen to twenty hours a week of mentored work and rejects "just don't hire juniors". The named format, the no-model checkpoint, and any view of the mid-career cohort were missing. |
| 6 | Governance. Tier AI use by risk (personal, team, client-facing), detect over prevent, wait fourteen days on new library versions, screen for packages that do not exist. | Our bots were tiered and fenced. The people side had no AI-tool policy at all; the security overview we send clients and our data processing agreement did not mention AI. No dependency policy in any repo. |
| 7 | AI spend is a governance problem. Budgets burned a year in three months, undetected. Name an owner, review on a cadence. | Gateway fronting for the bot fleet blocked at phase three; nobody named as spend owner. |
| 8 | Legacy modernization is the clearest value in the market: characterization tests, symbolic checks, production back-tests; add nothing, change nothing, delete what you can; preserve known bugs by client decision. | Four case studies in exactly this shape. Nothing in the service packages selling it. |
| 9 | The expectation gap. Boards expect a requirements doc in, working software out. Realistic gain across the whole lifecycle is two to three times, and the "10x" story resets in twelve to eighteen months. | The two to three times line existed only in an internal hiring draft. No case study with a measured multiplier. |

Two things the report also names that we had already settled: autonomy tiered by risk (our lanes, our when-to-ask rules, the guard hooks on the bots) and the platform team using the same tooling it asks of everyone else (the kit is the paved road and our ops code is built with it).

## What we already had

Nine of the twenty-three practices were in place before the report, which is worth saying plainly, because the temptation with a report like this is to feel behind. The proof-of-done gate that refuses a push without a recorded green run and a negative control. The understanding gate that quizzes the human before a merge they did not write. Risk-tiered lanes. Allow-lists and container pins on the bots. Sandboxing for untrusted code. Cheap-worker routing with a measurement behind it. A benchmark contract that says a claim with no metric row is marketing.

## What we are adopting

Ten practices, each as the smallest thing that closes the gap, each with a number attached or it does not count.

| Gap | What closes it | Number |
|---|---|---|
| Break-it step (finding 1) | An adversarial prober in the review battery: given the diff and its tests, find the input the suite forgot | Probe findings converted to tests per ten runs |
| Review data (finding 1) | Run the monthly review-calibration sample the rubric already prescribes, once, and record it | Defects caught by review, with n |
| Lint to instructions (finding 2) | A check that turns eslint, ruff, golangci-lint, tsc, and clippy output into house fix steps | Rules explained vs rules gone on the next run, read after two weeks |
| Learn loop (finding 3) | Switch on the session-end step that drafts skill proposals; humans keep pruning | Proposals accepted vs rejected |
| Two clocks (finding 4) | A command that lists every board row waiting on a human call, oldest first; backfill close dates so cycle time computes | Median decision-wait per week (first run: nine rows, three days) |
| Apprenticeship (finding 5) | Name the weekly group slot a design quorum; add a no-model walkthrough at each advancement review; add a tenure column to the annual cohort retro | Hours logged in the format |
| AI-tool policy (finding 6) | Three tiers: anything on your own scratch work, approved tools on internal repos, named tools with stated data handling on client code; a paragraph in the security overview; a clause in the DPA | Engagements with model and region recorded at handoff |
| Dependencies (finding 6) | A fourteen-day release age on dependency updates; a guard that blocks installing a package that does not exist | Blocked installs, held updates |
| AI spend (finding 7) | Name the owner; add an AI-providers line to the monthly card-spend report | One line, monthly |
| Modernization (finding 8) | A service package with the three-tier verification stack as the method and the four case studies as proof | Proposals sent |

Three practices are parked with a named trigger: a with-and-without test for skills (when the benchmark can toggle modules), scanning bot conversations for dangerous patterns (after the open boundary findings on the bots close), and the reverse-engineer-and-reimplement pattern for AI-written external pull requests (the first time a public repo of ours gets a flood of them).

## Where the argument leaks

Every number from Engelberg is one organization's story with no sample size. I have treated them as targets to measure against, and I would ask you to do the same with mine: the audit is one person reading our documents on one day, and "2 of 62" is one database.

The summit might not be reachable for judgment-shaped work. Checking output cheaper than producing it is a clear target for code. For a proposal, a hire, a pricing call, I do not know what cheap checking means, and those stay on the human clock for now. That is probably fine. Those are the calls the summit says a human keeps anyway.

We are at camp two. The next pitch is verification, starting with whether our own checks are reading anything.
