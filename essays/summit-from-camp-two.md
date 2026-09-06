---
draft: true
title: What the summit looks like from camp two
description: What the Thoughtworks Engelberg retreat teaches about AI-assisted engineering, what Dwarves already follows, what was missing, and what we changed in one week.
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

Reports like this are easy to nod at and forget. So I did the thing I would ask any of us to do. I took every practice the report names, checked each against what Dwarves actually has on paper, wrote down what was missing, and closed what could be closed in a week. This post is that record, in four parts: what the report teaches, what we already follow, what was missing, and what we changed.

![The route: four camps and a summit, with an amber marker at camp two](assets/summit-from-camp-two-fig1-route.svg)

_Fig. 1: The report's findings as a climb. Generating code is the valley floor, the scaffolding around the AI is the camp we stand in, checking output at the speed it is produced is the next pitch, and the summit is a team where humans keep only the goal, the calls, and the acceptance._

## 1. What the report teaches

Nine things, ranked by how much they matter for a company like ours.

1. **Verification is the bottleneck, not generation.** Agents write code, tests, and infrastructure faster than anyone can trust it. The discipline that wins builds cheap, fast checks: coverage, then an agent that tries to break the code without failing a test, then mutation testing. Nobody in the room could cite data on how many defects manual code review catches.
2. **The harness beats the model.** The rules, checks, and routing around the AI matter more than which model you picked. One team turned linter output into step-by-step fix instructions and moved code-smell resolution from under half to about ninety percent. A smaller model with a good harness beat a larger model with a weak one.
3. **The harness should improve itself.** Agents propose changes to their own rules and skills; humans prune. Shared skills decay like unowned code unless someone owns them and tests whether they still help.
4. **The two clocks.** Code time collapsed. Delivery time did not move, because decisions and unclear specs are now the constraint. Fix the decision process, not the pipeline.
5. **The apprenticeship problem.** If seniors pair only with agents, juniors never learn judgment. A senior leads design out loud while the junior drives the agent; some checkpoints happen with no model in the room; watch the seven to ten year cohort, whose skill a model now often matches.
6. **Governance has not caught up.** Tier AI use by risk (personal, team, client-facing). Detect over prevent. Wait fourteen days on new library versions. Screen for packages that do not exist, because attackers publish under the names models invent.
7. **AI spend is a governance problem.** Budgets burned a year in three months, undetected. Name an owner and review on a cadence, as with cloud spend.
8. **Legacy modernization is the clearest value in the market.** Characterization tests, symbolic checks, production back-tests. Add nothing, change nothing, delete what you can. Preserve known bugs by the client's written decision.
9. **The expectation gap.** Boards expect a requirements doc in and working software out. Realistic gain across the whole lifecycle is two to three times, and the "10x" story resets within twelve to eighteen months.

## 2. What the team follows today

I checked the delivery and people documents, the kit every repo adopts, and my own coding-agent setup. Nine of the report's practices were already in place, which is worth saying plainly, because a report like this makes you feel behind.

| Learning | What we already follow |
|---|---|
| 1 Verification | Coverage in CI. Mutation testing on the main Workers codebase. A proof-of-done gate that refuses a push without a recorded green run and a negative control. A code review rubric that holds agent pull requests to the same bar as human ones. |
| 2 Harness | About forty checks around the coding agent, each born from a real incident. Cheap-worker routing measured at about three times cheaper, same result. A benchmark contract that says a claim with no metric row is marketing. |
| 3 Self-improving harness | A prune gate where proposed skills are approved or rejected. |
| 4 Two clocks | Nothing. |
| 5 Apprenticeship | A junior role that budgets sixteen to twenty hours a week of mentored project work and rejects "just don't hire juniors". |
| 6 Governance | Bots tiered by risk, with tool allow-lists, an egress allow-list, and container pins. Sandboxing for untrusted code. Autonomy tiered by lane. |
| 7 AI spend | Cost telemetry per session and per model on my own setup. |
| 8 Modernization | Four case studies in exactly this shape. |
| 9 Expectation gap | An anti-hype line in the AI readiness one-pager. |

## 3. What was missing

| Learning | The gap on the day I looked |
|---|---|
| 1 Verification | No break-it step between coverage and mutation. The rubric prescribes a monthly review-calibration sample; we had never recorded one. One monitoring alert had been green for a month while its source had been shut down. |
| 2 Harness | No lint-to-instructions step. |
| 3 Self-improving harness | The half that grows proposals was never switched on; the prune gate had nothing to prune. No way to test whether a skill earns its context. |
| 4 Two clocks | Cycle time unmeasurable: a close date on 2 of 62 projects. No view of how long a decision had waited on me. |
| 5 Apprenticeship | No named design format. No no-model checkpoint. No view of the mid-career cohort. |
| 6 Governance | No AI-tool policy for people. The security overview we send clients and our data processing agreement did not mention AI. No dependency-age rule. No guard against installing a package that does not exist. |
| 7 AI spend | No named owner. Gateway fronting for the bot fleet blocked. |
| 8 Modernization | Nothing in the service packages selling it. |
| 9 Expectation gap | The two to three times line existed only in an internal hiring draft. No case study with a measured multiplier. |

## 4. What we changed

Each change is the smallest thing that closes the gap, with the number it must produce. Most shipped within the week; the rest are named as open.

| Gap | Resolution | Status |
|---|---|---|
| Break-it step | An adversarial prober in the review battery: given the diff and its tests, find the input the suite forgot. On its first live run it found a hole in a fixture we had written to be airtight. | Shipped |
| Lint to instructions | A check that turns eslint, ruff, golangci-lint, tsc, and clippy output into house fix steps, logging rules explained vs rules gone for a two-week read. | Shipped |
| Self-improving harness | The session-end step that drafts skill proposals switched on; humans keep pruning. | Shipped |
| Two clocks | A command that lists every board row waiting on a human call, oldest first, with a weekly median. First run: nine rows, three days. | Shipped |
| AI-tool policy | Three tiers: anything on your own scratch work, approved tools on internal repos, named tools with stated data handling on client code. A paragraph in the client security overview. A clause in the DPA. | Shipped |
| Dependencies | A fourteen-day release age on dependency updates in the two ops repos, and a guard that blocks installing a package that does not exist and warns on anything under fourteen days old. | Shipped |
| Modernization | A service package with the three-tier verification stack as the method and the four case studies as proof. | Shipped |
| Review data | Run the monthly calibration sample once and record defects caught, with n. | Open |
| Apprenticeship | Name the weekly group slot a design quorum, add a no-model walkthrough at each advancement review, add a tenure column to the annual cohort retro. | Open |
| AI spend | Name the owner, add an AI-providers line to the monthly card-spend report, unblock the gateway. | Open |
| Close dates | Backfill close dates so cycle time computes. | Open |
| Measured case study | One engagement with the multiplier computed from tickets, hours, and defects, written at two to three times. | Open |

Three practices are parked with a named trigger: a with-and-without test for skills, scanning bot conversations for dangerous patterns, and the reverse-engineer-and-reimplement pattern for AI-written external pull requests.

## Where the argument leaks

Every number from Engelberg is one organization's story with no sample size. I have treated them as targets to measure against, and I would ask you to do the same with mine: the audit is one person reading our documents on one day, and "2 of 62" is one database.

The summit might not be reachable for judgment-shaped work. Checking output cheaper than producing it is a clear target for code. For a proposal, a hire, a pricing call, I do not know what cheap checking means, and those stay on the human clock for now. That is probably fine. Those are the calls the summit says a human keeps anyway.

We are at camp two. The next pitch is verification, starting with whether our own checks are reading anything.
