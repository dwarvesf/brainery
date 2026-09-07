---
draft: true
title: The Engelberg report, checked against our own docs
description: Nine learnings from the Thoughtworks Engelberg retreat report, each checked against what Dwarves has on paper, with the lines they were found in, what changed in the week after, and what it means for a developer here.
date: 2026-09-07
authors:
  - tieubao
tags:
  - ai
  - harness-engineering
  - verification
  - culture
  - strategy
slug: engelberg-report-audit
---

In June, Thoughtworks and Martin Fowler put forty CTOs and senior engineers in a room in Engelberg for three days and wrote up what they argued about. The report is sixteen pages. The sentence I keep coming back to is from the first of them: engineering is now distilled down to how do I describe the goal, and how do I verify I've reached it.

I listed every practice the report names, twenty-three of them, and had three audits run over our own repositories with one instruction: refute any claim that we already do something unless you can quote the line. Then I spent the week closing what could be closed. Nine of the practices were already in place. The rest are below, one at a time, in the order they matter for us.

![Nine learnings from the report against our own documents: what we had, what was missing, what changed this week](assets/engelberg-report-audit-fig1-matrix.svg)

_Fig. 1: Each row is a learning from the report; the columns are what we already had, what was missing on the day I looked, and what changed in the week after. Amber is shipped; an amber ring is open and named._

## 1. Verification is the bottleneck

**What the report says.** Agents now write code, tests, and infrastructure faster than anyone can trust it. The teams that win are the ones that got good at checking, and checking has an order: measure coverage; then have an agent actively try to break the code without breaking any test, because the input your tests forgot is the one that matters; then run mutation testing, which means breaking the code on purpose in small ways and confirming the suite notices, and only bother with that if the probe found nothing. The room also admitted that nobody there could cite data on how many defects manual code review actually catches. They called it a status quo illusion.

![The verification ladder from the report: coverage, break-it probe, mutation test, human review; rung two was the gap](assets/engelberg-report-audit-fig2-ladder.svg)

_Fig. 2: The order the report gives, page 11. We had rungs one and three. Rung two is the new lens; only if it finds nothing does mutation testing run._

**What we had.** Coverage in CI. A mutation ratchet on the Workers monorepo. A proof-of-done gate that refuses a push without a recorded green run and a negative control. A code review rubric that says, in its own words, agent-produced PRs are reviewed against the same rubric; agents do not get relaxed standards.

**What was missing.** The break-it step did not exist. And the same rubric, further down, says: sample 5 to 10 merged PRs per month for retrospective review. Did the review catch what should have been caught? We have never recorded a single one of those samples. We are in the room the report describes.

One more thing, from two weeks before the report landed. A monitoring alert on a money path had been green since August 1. The source it watched had been retired on August 1. The line count of audit entries it was reading was zero. Its proof-of-done had a negative control, and the control was vacuous: it proved the alert reacted to a fault in a source that no longer produced anything. We fixed it on August 30 with a staleness rule, zero rows for three weeks is itself an alarm, so it can never pass by reading nothing again.

**What changed.** The break-it prober is now a lens in the kit's review battery. Its job is to take a diff and its tests and find the input the tests forgot. To prove it worked, the spec shipped with two fixtures: a leaky implementation whose tests miss a real hole, and a tight one whose tests pin the boundary. On the first live run against the tight fixture, the prober reported that `impl.sh abc` printed `ok`. The fixture we wrote to be airtight accepted a non-integer, because both numeric tests exited with code 2 on non-integer input, the redirect hid the error, and control fell through to success. The fixture is tight now, and the case is pinned. The review calibration sample is still open: run it once, record the number.

**For you.** When an agent writes the tests, the green run is not the evidence. Ask what input the suite forgot before you trust it, and when the battery reports a probe finding on your branch, add the test or write down why you accept the gap.

## 2. The harness beats the model

**What the report says.** "Harness" is the industry's word for everything around the model: the rules it loads at the start of a session, the checks that run before and after each action, which tools it may call, which model does which job. The report's claim is that this scaffolding matters more than which model you picked. The numbers, each from one organization: a four-times cut in AI cost from a better harness; a smaller model with a good harness beating a larger one with a weak harness; and the cheapest improvement anyone reported, turning a linter's complaint ("this function is too long") into step-by-step instructions the agent can follow, which moved code-smell resolution from under half to about ninety percent.

**What we had.** About forty checks around the coding agent in my own settings, each born from an incident: one stops a password or API key from being printed into the conversation, one stops a push to the main branch, one refuses a "done" message when the agent ran nothing. Cheap-worker routing, measured earlier at about three times cheaper for the same result: a strong model plans and reviews, cheaper models do the routine work.

**What was missing.** The lint-to-instructions step. Our agents got the raw linter output and had to work out the fix each time.

**What changed.** A check now runs after every shell command the agent executes. When the output carries eslint, ruff, golangci-lint, tsc, or clippy diagnostics, it looks up each rule id in a table of sixteen house fixes and hands the agent the steps. An unknown rule id injects nothing. It logs which rules it explained and which were gone on the next run, so in two weeks we will know whether the report's number holds here.

**For you.** Spend your effort on rules that run on every action, not on prompt wording the model may or may not remember. If you find yourself explaining the same fix to an agent twice, that is a row for the table.

## 3. The harness improves itself

**What the report says.** The best-performing teams do not hand-write their harness rules. They let agents fail, then run a "learn" step that looks back at the session and proposes changes to the rules and the reusable skills. The human's job becomes pruning those proposals, not authoring them. The warning attached: shared skills and rule files decay like any unowned code unless someone owns them and tests whether they still help as models improve.

**What we had.** The prune gate: a place where proposed skills are approved or rejected.

**What was missing.** The half that grows proposals. My own coding-agent settings, the file that decides what runs around the model every session, read `"PreCompact": []` and `"SessionEnd": []`. Those two events are where the session-end review is supposed to fire. I had built the approve-or-reject gate months ago. Nothing had ever reached it.

![The learn loop: a session ends, a reviewer reads what went wrong, drafts a proposal, a human prunes; the first arrow was never wired](assets/engelberg-report-audit-fig3-loop.svg)

_Fig. 3: The loop the report describes. The gate on the right had existed for months. The dashed amber arrow is the one that was missing._

**What changed.** The two events are wired, with a guard so a missing script cannot break a session. Proposals now land in a folder and wait for a human. What we still cannot do is measure whether a skill that fires is worth the context it eats; that stays parked until the benchmark can run with and without a skill.

**For you.** When a session goes badly, the harness should learn from it without you writing the rule by hand. If you see a proposal in the queue that matches something you hit, approve it; if it is noise, reject it and say why.

## 4. The two clocks

**What the report says.** Teams measured two things: the time to produce code, and the time spent waiting for a decision or a clear specification. Code time collapsed. Total delivery time did not move, because the constraint had walked upstream to decisions and unclear specs, and the pipeline everyone kept optimizing was not where the time went. If throughput is up and cycle time is not, fix the decision process.

**What we had.** Nothing.

**What was missing.** Both clocks. Our go-to-market analysis, in its own words: project duration unmeasurable. Closed Date set on 2 of 62 projects. Cannot derive throughput or cycle time. And my own task boards had rows marked "Han's call" with no view of how long they had waited.

**What changed.** A command now reads the boards we already keep and prints every open row waiting on a human call, oldest first, with an age, plus a weekly summary. The review battery found that it charged a date after the marker with the marker's whole length, so a fourteen-day wait printed as 257 days, and that the fixture meant to catch exactly that had passed by coincidence. Fixed. Its first real run, unedited:

```
repo              n  median
console-labs      2      3d
dfoundation       1       ?  (1 unknown)
dwarves-kit       1       ?  (1 unknown)
learning-kit      1     43d
ops-toolkit       4      2d
TOTAL             9      3d  (2 unknown)
```

![The second clock, first reading: median decision-wait per board](assets/engelberg-report-audit-fig5-decisions.svg)

_Fig. 4: The same run as a chart. The 43-day bar is one row on the learning board that has waited on me since July._

Nine things waiting on me, median three days, two with no date I could derive. I checked three rows by hand: two were real waits, one had already been decided and only its execution was pending. So the number is a ceiling. The close-date backfill, so cycle time computes, is still open.

**For you.** If you are blocked on a decision, write it on the board with the words "waits on" and a date. The list only sees what is written, and the waiting is now the expensive part.

## 5. Apprenticeship

**What the report says.** If senior engineers pair only with agents, juniors never get the hands-on struggle with real code, real incidents, and real trade-offs that produced the seniors in the first place. Six separate sessions raised it. The countermeasures are concrete: a design quorum where the senior leads the design conversation out loud while the junior drives the agent; explicit checkpoints where someone works through a change with no model in the room and explains their reasoning; and a watch on engineers with seven to ten years of experience, the group whose decade of skill a model now often matches, and who are usually the delivery leads.

**What we had.** Our junior contractor role budgets 16 to 20 hours a week on mentored project work and 10 to 12 on deliberate learning, and it says outright that Dwarves rejects the "stop hiring juniors" answer to the agentic shift.

**What was missing.** A named format for the weekly group slot. A no-model checkpoint. Any view of the mid-career cohort in the annual retro.

**What changed.** Nothing yet. This is open: name the slot a design quorum in the junior role, add a no-model walkthrough at each advancement review, add a tenure column to the annual cohort retro.

**For you.** If you are senior, think out loud in design conversations while a junior drives the agent. If you are junior, expect to be asked to walk through a change without a model in the room; that is the part of the job that makes you senior.

## 6. Governance and dependencies

**What the report says.** The incidents are real: an accountant's AI-built app that exposed customer data through a tunnel the AI suggested; a marketing assistant granted access scopes the company could not enumerate when it tried to revoke them; an agent low on disk space that deleted the backups and was pleased about it. The pattern that works is tiering AI use by risk, green for personal use, amber for team use with training, red for anything company-wide or client-facing, and detection over prevention, because training cannot keep pace with weekly model releases. Two cheap rules on dependencies: wait about fourteen days before adopting a new library version, since most compromised releases are caught in that window, and screen for packages that do not exist, because attackers now publish malicious packages under the names models tend to invent.

**What we had.** Our bots were tiered and fenced: tool allow-lists, an egress allow-list, and a deploy gate that fails any profile granting shell access without a container pin.

**What was missing.** The people side had no AI-tool policy at all. The security overview we send to clients and our data processing agreement template: a search for AI, LLM, or model returns nothing in either. No repository had a dependency-age rule or a Renovate or Dependabot config.

**What changed.** A three-tier AI-tool policy: anything goes on your own scratch work; approved tools on internal repos; on client code, only the named tools whose data handling we can state, model and region recorded at the deal handoff, a human signing every merge. A paragraph in the client security overview and a new clause in the DPA. The policy and the clause were reviewed by a model and by me, not by a lawyer yet.

On dependencies, a guard now runs before the agent installs anything: a package name that does not exist on the registry is blocked, anything published less than fourteen days ago gets a warning. It went through two security rounds in the build and a third in the battery. The build round found that the first version blocked `uv add requests==9.9.9` and told the model the name was invented, because the existence check carried the version. The battery round found that a multi-line command like `npm install` followed by `make lint` looked up `lint` as a package name and hard-blocked, that an npm prerelease-only package read as nonexistent, and that a captive-portal 404 would have blocked every install on hotel wifi. All fixed, sixty test cases now.

The Renovate configuration for the two operations repositories, with the fourteen-day minimum release age, is merged but inert. The battery found the config as specced would have opened almost no pull requests, and that its vulnerability bypass had no feed because dependency alerts were disabled on both repositories; both fixed. Then I decided not to install the Renovate app on the organization, because it wants workflow-write on repositories whose CI runs on our own machines. So the guard on the agent side is the half that is live.

**For you.** Know which tier your work is in before you open an AI tool: your scratch work is green, our repos are amber, client code is red. If the dependency guard blocks an install, the package name is probably wrong; check the registry before overriding.

## 7. AI spend is governance

**What the report says.** Organizations reported token budgets burning a year's allocation in three months, undetected until it was a crisis, and security incidents up about twenty times in six months at one of them. This needs the same discipline as cloud spend: a named owner and a review cadence, set up early.

**What we had.** Cost telemetry per session and per model on my own setup.

**What was missing.** A named owner. Gateway fronting for the bot fleet, which would give one place to see spend, blocked at phase three.

**What changed.** Nothing yet. Open: name the owner, add an AI-providers line to the monthly card-spend report, unblock the gateway.

**For you.** Nothing to do today. When the line appears in the monthly report, that is where to look if your agent usage spikes.

## 8. Legacy modernization

**What the report says.** The clearest value in the market right now. Working, verified approaches to mainframe and monolith migration exist, with a discipline worth memorizing: add nothing, change nothing, delete what you can during the port; fix behavior first and architecture second, never both at once; preserve known bugs by the client's written decision rather than letting an AI helpfully fix something a downstream system depends on. Verification in three tiers: characterization tests captured from the real system's behavior, symbolic checks where a model cannot help, production back-tests against real data flows as the final gate.

**What we had.** Four case studies in exactly this shape: Kafi, Mudah, CIMB, Neutronpay.

**What was missing.** Nothing in the service packages selling it.

**What changed.** A Legacy Modernization package in the service catalog, with the three-tier verification stack as the method, the migration discipline as the promise, and the four case studies as proof.

**For you.** If you are on a migration, the three rules above are the standard now. A bug you find in the old system is a client decision, not a fix.

## 9. The expectation gap

**What the report says.** Boards believe a requirements doc goes into the machine and working software comes out, because their own AI experience is report-writing tools that genuinely work that way. The room's realistic estimate across the whole delivery lifecycle was two to three times, and they gave the gap between that and "10x" twelve to eighteen months before it resets. What closes the gap is vivid, fact-checked stories tied to a balance sheet, not dashboards.

**What we had.** The two to three times line, in an internal hiring draft.

**What was missing.** A case study with a measured multiplier.

**What changed.** Nothing yet. Open: one engagement, the multiplier computed from tickets, hours, and defects, written at two to three times.

**For you.** When a client says 10x, do not argue; ask which part of the lifecycle they mean. Code generation, yes. Delivery, two to three.

## What it cost

![Findings the review battery caught before merge, per branch: 19, 15, 9, 7](assets/engelberg-report-audit-fig4-battery.svg)

_Fig. 5: Fifty findings across four branches before anything merged. The amber slice on each bar is the one finding that would have shipped a wrong result._

Seven gaps closed as pull requests in five repositories. Every change went through the kit's full path: a spec, an adversarial spec review, a build, a fresh-context verifier that re-runs the spec's own verification commands, then a review battery of several lenses. About five hours of session time and roughly three and a half million tokens across seventeen subagent runs, on top of the lead session. Every spec and battery lead ran on the strongest model; the builders ran on cheaper ones where the task was mechanical.

The report's numbers are each one organization's story with no sample size, and mine are one person reading our documents on one day. Treat both as targets to measure against.
