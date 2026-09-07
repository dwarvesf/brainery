---
draft: true
title: The Engelberg report, checked against our own docs
description: Twenty-three practices from the Thoughtworks Engelberg retreat report, checked against what Dwarves has on paper, with the lines they were found in and what changed in the week after.
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

I listed every practice the report names, twenty-three of them, and had three audits run over our own repositories with one instruction: refute any claim that we already do something unless you can quote the line. Then I spent the week closing what could be closed.

![Nine learnings from the report against our own documents: what we had, what was missing, what changed this week](assets/engelberg-report-audit-fig1-matrix.svg)

_Fig. 1: Each row is a learning from the report; the columns are what we already had, what was missing on the day I looked, and what changed in the week after. Amber is shipped; an amber ring is open and named._

## What I found in our own documents

Some of it was good news. Our code review rubric already says agent-produced pull requests are reviewed against the same rubric, and agents do not get relaxed standards. Our junior contractor role already budgets 16 to 20 hours a week on mentored project work and 10 to 12 on deliberate learning, and it says outright that Dwarves rejects the "stop hiring juniors" answer to the agentic shift. Our bots run behind tool allow-lists, an egress allow-list, and a deploy gate that fails any profile granting shell access without a container pin. Nine of the twenty-three practices were already in place.

The rest was less comfortable, and I'd rather quote it than summarize it.

The review rubric, further down: sample 5 to 10 merged PRs per month for retrospective review. Did the review catch what should have been caught? We have never recorded a single one of those samples. The Engelberg room said nobody there could cite data on how many defects manual review catches, and called it a status quo illusion. We're in that room.

Our go-to-market analysis, in its own words: project duration unmeasurable. Closed Date set on 2 of 62 projects. Cannot derive throughput or cycle time. The report's sharpest finding is what it calls the two clocks: code time collapsed, delivery time didn't move, because decisions and unclear specs became the constraint. We can't even read the second clock.

The security overview we send to clients, and our data processing agreement template: a search for AI, LLM, or model returns nothing in either. We had no written rule on which AI tools may touch client code. The AI fluency census we ran is a survey, and says so.

My own coding-agent settings, the file that decides what runs around the model every session: `"PreCompact": []` and `"SessionEnd": []`. Those two events are where the kit's session-end review is supposed to fire, the one that looks at what went wrong and drafts a proposed skill or rule change for me to approve or reject. I had built the approve-or-reject gate months ago. Nothing had ever reached it, because the producer was never wired in.

![The learn loop: a session ends, a reviewer reads what went wrong, drafts a proposal, a human prunes; the first arrow was never wired](assets/engelberg-report-audit-fig3-loop.svg)

_Fig. 2: The loop the report describes. The gate on the right had existed for months. The dashed amber arrow is the one that was missing._

And one incident, from two weeks before the report landed. A monitoring alert on a money path had been green since August 1. The source it watched had been retired on August 1. The line count of audit entries it was reading was zero. Its proof-of-done had a negative control, and the control was vacuous: it proved the alert reacted to a fault in a source that no longer produced anything. We fixed it on August 30 with a staleness rule, zero rows for three weeks is itself an alarm, so it can never pass by reading nothing again.

## The comparison

The source column names the document or pull request behind each cell.

| The report says                                                                                                                                             | What we had                                                                                                                                      | What was missing                                                           | Source                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Verification is the bottleneck. Coverage, then an agent tries to break the code without failing a test, then mutation testing. Measure what review catches. | Coverage in CI. A mutation ratchet on the Workers monorepo. The proof-of-done gate.                                                              | The break-it step. The monthly review sample, never run.                   | code-review rubric; workers STATE doc                                                                    |
| The harness beats the model. Lint output rewritten as step-by-step fixes moved one team from under 50% to about 90% resolution.                             | About forty checks around the agent, each born from an incident. Cheap-worker routing, measured earlier at about 3x cheaper for the same result. | The lint-to-instructions step.                                             | my settings file; the routing note in my global rules                                                    |
| The harness should improve itself. Agents propose edits, humans prune. Skills decay without an owner.                                                       | The prune gate.                                                                                                                                  | The producer, unwired. Any test of whether a skill earns its context.      | `PreCompact: []`                                                                                         |
| The two clocks.                                                                                                                                             | Nothing.                                                                                                                                         | Cycle time, and any view of decisions waiting on me.                       | gtm analysis, 2 of 62                                                                                    |
| Apprenticeship. Senior leads design out loud, junior drives the agent. Checkpoints with no model in the room. Watch the 7 to 10 year cohort.                | The junior role's mentored hours.                                                                                                                | A named format. A no-model checkpoint. Any view of the mid-career cohort.  | junior contractor role doc; annual cohort retro template                                                 |
| Governance. Tier AI use by risk. Wait 14 days on new library versions. Screen for packages that don't exist.                                                | Bots tiered and fenced.                                                                                                                          | A policy for people. Any dependency rule.                                  | S25 security overview, S22 DPA, both with zero AI mentions; no renovate or dependabot config in any repo |
| AI spend is governance. Name an owner, review on a cadence.                                                                                                 | Per-session cost telemetry on my own setup.                                                                                                      | A named owner. Gateway fronting for the bot fleet, blocked at phase three. | the gateway verification note                                                                            |
| Legacy modernization is the clearest value pool.                                                                                                            | Four case studies in exactly this shape: Kafi, Mudah, CIMB, Neutronpay.                                                                          | Nothing in the service packages selling it.                                | S17 service packages                                                                                     |
| The expectation gap. Realistic gain is 2 to 3x, not 10x.                                                                                                    | The 2 to 3x line, in an internal hiring draft.                                                                                                   | A case study with a measured multiplier.                                   | talent acquisition draft                                                                                 |

## Each item, in detail

The table is the summary. This is the same nine rows with the report's point spelled out in plain words, where we stand, and what it means for you day to day.

### 1. Verification is the bottleneck

**What the report says.** Agents now write code, tests, and infrastructure faster than anyone can trust it. The teams that win are the ones that got good at checking, and checking has an order. Measure coverage. Then have an agent actively try to break the code without breaking any test, because the input your tests forgot is the one that matters. Then run mutation testing, which means breaking the code on purpose in small ways and confirming the suite notices, and only bother with that if the probe found nothing. The room also admitted nobody there could cite data on how many defects manual code review actually catches.

**Where we stand.** Rungs one and three were ours: coverage in CI, a mutation ratchet on the Workers monorepo, and a proof-of-done gate that refuses a push without a green run and a negative control. Rung two, the break-it step, shipped this week and found a hole on its first run. Rung four is still faith: the monthly review sample our rubric prescribes has never been recorded.

**For you.** When an agent writes the tests, the green run is not the evidence. Ask what input the suite forgot before you trust it. When the review battery reports a probe finding on your branch, add the test or write down why you accept the gap.

### 2. The harness beats the model

**What the report says.** "Harness" is the industry's word for everything around the model: the rules it loads at the start of a session, the checks that run before and after each action, which tools it may call, which model does which job. The report's claim is that this scaffolding matters more than which model you picked. Their numbers, each from one organization: a four-times cut in AI cost from a better harness; a smaller model with a good harness beating a larger one with a weak harness; and the cheapest win anyone reported, turning a linter's complaint ("this function is too long") into step-by-step instructions the agent can follow, which moved code-smell resolution from under half to about ninety percent.

**Where we stand.** About forty checks around the coding agent, each born from an incident: one stops a password or API key from being printed into the conversation, one stops a push to the main branch, one refuses a "done" message when the agent ran nothing. Routing that puts a strong model on planning and review and cheaper models on routine work, measured at about three times cheaper for the same result. The lint-to-instructions step shipped this week: sixteen house fixes, an unknown rule injects nothing, and a log of rules explained versus rules gone so we can check the report's number in two weeks.

**For you.** Spend your effort on rules that run on every action, not on prompt wording the model may or may not remember. If you find yourself explaining the same fix to an agent twice, that is a row for the table.

### 3. The harness improves itself

**What the report says.** The best-performing teams do not hand-write their harness rules. They let agents fail, then run a "learn" step that looks back at the session and proposes changes to the rules and the reusable skills. The human's job becomes pruning those proposals, not authoring them. The warning attached: shared skills and rule files decay like any unowned code unless someone owns them and tests whether they still help as models improve.

**Where we stand.** We had the prune gate for months and never wired the events that feed it; that is the `PreCompact: []` line above. Wired this week, with a guard so a missing script cannot break a session. What we still cannot do is measure whether a skill that fires is worth the context it eats.

**For you.** When a session goes badly, the harness should learn from it without you writing the rule by hand. If you see a proposal in the queue that matches something you hit, approve it; if it is noise, reject it and say why.

### 4. The two clocks

**What the report says.** Teams measured two things: the time to produce code, and the time spent waiting for a decision or a clear specification. Code time collapsed. Total delivery time did not move, because the constraint had walked upstream to decisions and unclear specs, and the pipeline everyone kept optimizing was not where the time went. If throughput is up and cycle time is not, fix the decision process.

**Where we stand.** Neither clock was readable. Cycle time cannot be derived from our projects database, close date set on 2 of 62. The decision clock exists as of this week: a list of every board row waiting on a human call, oldest first, with an age. First reading, nine rows, median three days, one of the three I checked by hand a false positive. The close-date backfill is still open.

**For you.** If you are blocked on a decision, write it on the board with the words "waits on" and a date. The list only sees what is written, and the waiting is now the expensive part.

### 5. Apprenticeship

**What the report says.** If senior engineers pair only with agents, juniors never get the hands-on struggle with real code, real incidents, and real trade-offs that produced the seniors in the first place. Six separate sessions raised it. The countermeasures: a design quorum where the senior leads the design conversation out loud while the junior drives the agent; explicit checkpoints where someone works through a change with no model in the room and explains their reasoning; and a watch on engineers with seven to ten years of experience, whose decade of skill a model now often matches, and who are usually the delivery leads.

**Where we stand.** The junior role budgets 16 to 20 hours a week of mentored project work and rejects the "stop hiring juniors" answer. The named format, the no-model checkpoint, and any view of the mid-career cohort are missing. Nothing shipped on this yet; the three doc edits are named and open.

**For you.** If you are senior, think out loud in design conversations while a junior drives the agent. If you are junior, expect to be asked to walk through a change without a model in the room; that is the part of the job that makes you senior.

### 6. Governance and dependencies

**What the report says.** The incidents are real: an accountant's AI-built app that exposed customer data through a tunnel the AI suggested; a marketing assistant granted access scopes the company could not enumerate when it tried to revoke them; an agent low on disk space that deleted the backups and was pleased about it. The pattern that works is tiering AI use by risk, green for personal use, amber for team use with training, red for anything company-wide or client-facing, and detection over prevention, because training cannot keep pace with weekly model releases. Two cheap rules on dependencies: wait about fourteen days before adopting a new library version, since most compromised releases are caught in that window, and screen for packages that do not exist, because attackers publish malicious packages under the names models tend to invent.

**Where we stand.** The bots were already tiered and fenced. The people side had no policy and the client documents did not mention AI. This week: a three-tier policy (anything on your scratch work, approved tools on internal repos, named tools with stated data handling on client code, a human signing every merge), a paragraph in the client security overview, a clause in the DPA, and a guard that blocks installing a package that does not exist and warns on anything under fourteen days old. The Renovate half is merged but inert, by my decision.

**For you.** Know which tier your work is in before you open an AI tool: your scratch work is green, our repos are amber, client code is red. If the dependency guard blocks an install, the package name is probably wrong; check the registry before overriding.

### 7. AI spend is governance

**What the report says.** Organizations reported token budgets burning a year's allocation in three months, undetected until it was a crisis. This needs the same discipline as cloud spend: a named owner and a review cadence, set up early.

**Where we stand.** Cost telemetry per session and per model exists on my own setup. No named owner, and the gateway that would give one view of the bot fleet's spend is blocked. Open.

**For you.** Nothing to do today. When the line appears in the monthly card-spend report, that is where to look if agent usage spikes.

### 8. Legacy modernization

**What the report says.** The clearest value in the market right now. Working, verified approaches to mainframe and monolith migration exist, with a discipline worth memorizing: add nothing, change nothing, delete what you can during the port; fix behavior first and architecture second, never both at once; preserve known bugs by the client's written decision rather than letting an AI helpfully fix something a downstream system depends on. Verification in three tiers: characterization tests captured from the real system's behavior, symbolic checks where a model cannot help, production back-tests against real data flows as the final gate.

**Where we stand.** Four case studies in exactly this shape and nothing selling it. A Legacy Modernization package is in the service catalog as of this week, with the three-tier stack as the method and the four case studies as proof.

**For you.** If you are on a migration, the three rules above are the standard now. A bug you find in the old system is a client decision, not a fix.

### 9. The expectation gap

**What the report says.** Boards believe a requirements doc goes into the machine and working software comes out, because their own AI experience is report-writing tools that genuinely work that way. The room's realistic estimate across the whole delivery lifecycle was two to three times, and they gave the gap between that and "10x" twelve to eighteen months before it resets. What closes the gap is vivid, fact-checked stories tied to a balance sheet, not dashboards.

**Where we stand.** The two-to-three-times line lives in an internal hiring draft. No case study carries a measured multiplier. Open: one engagement, the multiplier computed from tickets, hours, and defects.

**For you.** When a client says 10x, do not argue; ask which part of the lifecycle they mean. Code generation, yes. Delivery, two to three.

## What we changed

Seven of the gaps closed this week, as pull requests in five repositories. Every change went through the kit's full path: a spec, an adversarial spec review, a build, a fresh-context verifier that re-runs the spec's own verification commands, then a review battery of several lenses. The batteries caught fifty findings across the four branches before anything merged. These are the ones that mattered.

![Findings the review battery caught before merge, per branch: 19, 15, 9, 7](assets/engelberg-report-audit-fig4-battery.svg)

_Fig. 3: Fifty findings across four branches before anything merged. The amber slice on each bar is the one finding that would have shipped a wrong result._

![The verification ladder from the report: coverage, break-it probe, mutation test, human review; rung two was the gap](assets/engelberg-report-audit-fig2-ladder.svg)

_Fig. 4: The order the report gives, page 11. We had rungs one and three. Rung two is the new lens; only if it finds nothing does mutation testing run._

The break-it prober is a new lens in the review battery. Its job is to take a diff and its tests and find the input the tests forgot. To prove it worked, the spec shipped with two fixtures: a leaky implementation whose tests miss a real hole, and a tight one whose tests pin the boundary. On the first live run against the tight fixture, the prober reported that `impl.sh abc` printed `ok`. The fixture we wrote to be airtight accepted a non-integer, because both numeric tests exited with code 2 on non-integer input, the redirect hid the error, and control fell through to success. The fixture is tight now, and the case is pinned.

The dependency guard blocks an install of a package name that doesn't exist on the registry, and warns on anything published less than 14 days ago. It went through two security rounds in the build and a third in the battery. The build round found that the first version blocked `uv add requests==9.9.9` and told the model the name was invented, because the existence check carried the version, which is the exact wrong steer for a guard meant to stop typosquats. The battery round found that a multi-line command like `npm install` followed by `make lint` looked up `lint` as a package name and hard-blocked. Also that an npm prerelease-only package read as nonexistent, and that a captive-portal 404 would have blocked every install on hotel wifi. All fixed, sixty test cases now, and I've named the residue: a private scoped package that 404s on the public registry warns instead of blocks.

The decisions list is the smallest thing I could build for the two clocks. It reads the boards we already keep and prints every open row waiting on a human call, oldest first, with an age, plus a weekly summary. The battery found that it charged a date after the marker with the marker's whole length, so a fourteen-day wait printed as 257 days, and that the fixture meant to catch exactly that had passed by coincidence, because the marker phrase happened to be ten characters long. Fixed. Its first real run, unedited:

```
repo              n  median
console-labs      2      3d
dfoundation       1       ?  (1 unknown)
dwarves-kit       1       ?  (1 unknown)
learning-kit      1     43d
ops-toolkit       4      2d
TOTAL             9      3d  (2 unknown)
```

![The second clock, first reading: median decision-wait per board, learning-kit 43 days, console-labs 3, ops-toolkit 2, two boards with no derivable date](assets/engelberg-report-audit-fig5-decisions.svg)

_Fig. 5: The same run as a chart. The 43-day bar is one row on the learning board that has waited on me since July._

Nine things waiting on me, median three days, two with no date I could derive. I checked three rows by hand: two were real waits, one had already been decided and only its execution was pending. So the number is a ceiling, and the marker vocabulary needs work.

The Renovate configuration for the two operations repositories sets a 14-day minimum release age. The battery found that with caret ranges and lockfile maintenance off, the config as specced would have opened almost no pull requests at all, a no-op with a green validator. It also found that the vulnerability bypass had no feed, because dependency alerts were disabled on both repositories. Both fixed. Then I decided not to install the Renovate app on the organization, because it wants workflow-write on repositories whose CI runs on our own machines. So the config sits inert, and the dependency guard on the agent side is the half that's live.

The lint-to-instructions check, the learn loop switched on with a guard so a missing script can't break a session, the three-tier AI-tool policy with a paragraph in the client security overview and a new clause in the DPA, and a Legacy Modernization package in the service catalog with the report's three-tier verification stack as the method and the four case studies as proof: all merged. The policy and the DPA clause were reviewed by a model and by me, not by a lawyer yet.

Five things are open and named. Run the review calibration sample once and record the number. Name the weekly group slot a design quorum and add a no-model walkthrough at each advancement review. Name an owner for AI spend and put a line for it in the monthly card-spend report. Backfill the close dates so cycle time computes. Write one case study with the multiplier actually computed.

## What it cost

About five hours of session time and roughly three and a half million tokens across seventeen subagent runs, on top of the lead session. Every spec and battery lead ran on the strongest model; the builders ran on cheaper ones where the task was mechanical.

The report's numbers are each one organization's story with no sample size, and mine are one person reading our documents on one day. Treat both as targets to measure against.
