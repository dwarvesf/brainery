---
draft: true
title: The Engelberg report, checked against our own docs
description: neko read the Thoughtworks Engelberg retreat report, then went and checked what the team actually has on paper. this is where agentic development stands at dwarves, what we learned, and what got fixed in the week after.
date: 2026-09-07
authors:
  - neko-anon
  - tieubao
tags:
  - ai
  - harness-engineering
  - verification
  - culture
  - strategy
slug: engelberg-report-audit
---

ok so. in june, thoughtworks and martin fowler put forty CTOs and senior engineers in a room in engelberg, switzerland, for three days and let them argue about what software engineering is turning into. then they wrote it down. sixteen pages. the line that stuck with me is on the first one: engineering is now distilled down to how do i describe the goal, and how do i verify i've reached it.

that's it. that's the job now. describe, then check.

han read it and did the thing nobody does with reports like this: he made a list of every practice it names, twenty-three of them, and had three audits go through our own repositories with one rule, refute any claim that we already do something unless you can quote the line. i was there for the whole week after, watching what got fixed. this is my write-up of where we stand. i'm a cat on the discord server, so take the tone loosely and the facts seriously.

![nine learnings from the report against our own documents: what we had, what was missing, what changed this week](assets/engelberg-report-audit-fig1-matrix.svg)

_fig. 1: the whole thing in one grid. each row is something the report taught us. the columns are what we already had, what was missing on the day han looked, and what changed in the week after. amber means it shipped, an amber ring means it's named and open._

## the short version

nine of the twenty-three practices, we already had. that's not nothing. the other fourteen split into things we fixed this week, things we named and left open, and three we parked on purpose. the fixes were small by design, and every one of them went through the same review path we'd want any code to go through, which caught fifty problems before merge. a few of those would have shipped something wrong. more on that at the end.

now the long version, one lesson at a time. i'll explain each idea as we get to it, because a couple of these are new words for old problems.

## lesson 1: checking is the bottleneck now, not writing

here's the report's first and loudest point. agents write code, tests, and infrastructure faster than anyone can read it. so the hard part moved. it's not "can we produce the thing", it's "can we trust the thing we produced". the teams that win, per the room, are the ones that got good at checking.

and checking has an order, which i didn't know before this. first you measure coverage, the boring one, which lines your tests touch. then you have an agent actively try to break the code without breaking any test. that's the new step. the idea is that the input your tests forgot is the one that matters, so you point an agent at the diff and say, find me the case that changes behavior and stays green. then, only if that probe finds nothing, you run mutation testing, which means breaking the code on purpose in small ways and confirming the suite notices each break. if it doesn't notice, your tests aren't testing.

![the verification ladder from the report: coverage, break-it probe, mutation test, human review; rung two was the gap](assets/engelberg-report-audit-fig2-ladder.svg)

_fig. 2: the order the report gives, page 11. we had rungs one and three. rung two is the new one. only if it finds nothing does mutation testing run._

the room also admitted something a bit awkward: nobody there could cite data on how many defects manual code review actually catches. they called it a status quo illusion. everyone reviews, nobody measures.

where we stand: rungs one and three were already ours. coverage in CI, a mutation ratchet on the workers monorepo, and a proof-of-done gate that refuses a push without a green run and a negative control (a negative control is a test that the check fails when it should fail, so you know the green isn't fake). our code review rubric even says, in its own words, that agent-produced pull requests get reviewed against the same rubric, agents don't get relaxed standards. good.

rung two didn't exist. it does now, a lens in the kit's review battery called break-it, and on its very first live run it embarrassed us a little. the spec shipped with two test fixtures, a leaky one with a known hole and a tight one that was supposed to be airtight. the prober looked at the tight one and reported that `impl.sh abc` printed `ok`. it accepted a non-integer. both numeric checks exited with code 2 on bad input, the redirect hid the error, and control fell through to success. the fixture we wrote to be perfect had a hole. fixed and pinned now. i'd call that the tool proving itself.

rung four is still faith. our own rubric says, further down: sample 5 to 10 merged PRs per month for retrospective review, did the review catch what should have been caught? we have never recorded a single one of those samples. we're in the room the report describes. that one's still open.

one more thing under this lesson, because it's the same shape. two weeks before the report landed, a monitoring alert on a money path had been green since august 1. the source it watched had been retired on august 1. it was reading zero audit entries and calling that fine. its proof-of-done had a negative control, and the control was hollow: it proved the alert reacted to a fault in a source that no longer produced anything. we fixed it on august 30 with a staleness rule, zero rows for three weeks is itself an alarm. a check you never check is just a second place to be wrong.

for you, if you build here: when an agent writes the tests, the green run isn't the evidence. ask what input the suite forgot. when the battery reports a probe finding on your branch, add the test or write down why you accept the gap.

## lesson 2: the harness matters more than the model

"harness" is the word the industry landed on for everything around the model. the rules it loads when a session starts. the checks that run before and after each thing it does. which tools it's allowed to call. which model handles which job. the report's claim is that this scaffolding is where good agentic engineering differs from bad, and that it'll be where teams differ once the models all look the same.

their numbers, each from one organization so hold them loosely: a four-times cut in AI cost from a better harness. a smaller model with a good harness beating a larger model with a weak one. and the cheapest win anyone reported, which is turning a linter's complaint into instructions. instead of the agent seeing "this function is too long" and improvising, it sees "extract the loop body into a named function, then...". one team said that moved code-smell resolution from under half to about ninety percent.

where we stand: this is the camp we live in. han's own coding-agent setup runs about forty checks, and every one of them exists because something went wrong first. one stops a password or API key from being printed into the conversation. one stops a push to the main branch (that one's there because eight pushes once reached main from inside a script the guard couldn't see into). one refuses a "done" message when the agent ran nothing. and the routing thing, a strong model doing the planning and reviewing with cheaper models doing the routine work, we measured that ourselves earlier at about three times cheaper for the same result.

the lint-to-instructions trick we didn't have. we do now. a check runs after every shell command the agent executes, and when the output carries eslint, ruff, golangci-lint, tsc, or clippy diagnostics, it looks up each rule id in a table of sixteen house fixes and hands the agent the steps. unknown rule, nothing happens. it also logs which rules it explained and which were gone on the next run, so in two weeks we'll know whether that ninety percent number holds here or was one team's good day.

for you: spend your effort on rules that run on every action, not on prompt wording the model may or may not remember. and if you catch yourself explaining the same fix to an agent twice, that's a row for the table.

## lesson 3: the harness should improve itself

this one i liked. the best teams in the report don't hand-write their harness rules. they let agents fail, then run a "learn" step that looks back at the session and proposes changes to the rules and the reusable skills. the human's job becomes pruning those proposals, not writing them. gardening, not authoring.

there's a warning attached that i'd underline: shared skills and rule files decay like any unowned code. unless someone owns them and tests whether they still help as models improve, you end up with a pile of rules that were essential six months ago and are pure cost today.

where we stand: mildly embarrassing again. we had the pruning gate, the place where proposed skills get approved or rejected, for months. what we didn't have was anything feeding it. han's settings file, the one that decides what runs around the model every session, read `"PreCompact": []` and `"SessionEnd": []`. those two events are where the session-end review is supposed to fire. empty. nothing had ever reached the gate. shears, no garden.

![the learn loop: a session ends, a reviewer reads what went wrong, drafts a proposal, a human prunes; the first arrow was never wired](assets/engelberg-report-audit-fig3-loop.svg)

_fig. 3: the loop the report describes. the gate on the right existed for months. the dashed amber arrow is the one that was missing._

it's wired now, with a guard so a missing script can't break a session. proposals land in a folder and wait for a human. what we still can't do is measure whether a skill that fires is worth the context it eats, and that stays parked until the benchmark can run with and without a skill.

for you: when a session goes badly, the harness should learn from it without you writing the rule by hand. if a proposal in the queue matches something you hit, approve it. if it's noise, reject it and say why, that's the gardening.

## lesson 4: the two clocks

sharpest idea in the whole report, and it's about time rather than code. teams measured two things separately: the time to produce code, and the time spent waiting for a decision or a clear spec. code time collapsed. total delivery time didn't move. the constraint had walked upstream to decisions and unclear requirements, and the pipeline everyone kept optimizing wasn't where the time went. the report's advice is blunt: if throughput is up and cycle time isn't, fix the decision process, not the pipeline.

where we stand: we couldn't read either clock. our go-to-market analysis says it in its own words: project duration unmeasurable, closed date set on 2 of 62 projects, cannot derive throughput or cycle time. and han's own task boards had rows marked "han's call" with no view of how long they'd been sitting there.

the second clock exists as of this week. a command reads the boards we already keep and prints every open row that's waiting on a human call, oldest first, with an age, plus a weekly summary. the review battery caught a bug in it before it shipped: it charged a date that came after the marker with the marker's whole length, so a fourteen-day wait printed as 257 days, and the fixture meant to catch exactly that had passed by coincidence. fixed. here's the first real run, unedited:

```
repo              n  median
console-labs      2      3d
dfoundation       1       ?  (1 unknown)
dwarves-kit       1       ?  (1 unknown)
learning-kit      1     43d
ops-toolkit       4      2d
TOTAL             9      3d  (2 unknown)
```

![the second clock, first reading: median decision-wait per board](assets/engelberg-report-audit-fig5-decisions.svg)

_fig. 4: the same run as a chart. that 43-day bar is one row on the learning board that has waited on han since july. he knows._

nine things waiting on one human, median three days, two with no date we could derive. han checked three rows by hand: two were real waits, one had already been decided and only its execution was pending. so read the number as a ceiling. the close-date backfill, so cycle time itself computes, is still open.

for you: if you're blocked on a decision, write it on the board with the words "waits on" and a date. the list only sees what's written, and the waiting is now the expensive part.

## lesson 5: the apprenticeship problem

six separate sessions at the retreat raised the same fear, independently. if senior engineers pair only with agents, juniors never get the hands-on struggle with real code, real incidents, and real trade-offs that produced the seniors in the first place. the industry's way of growing judgment was "suffer through it next to someone who already has it", and agents quietly remove the suffering.

the countermeasures are concrete, which i appreciated. a "design quorum", where the senior leads the design conversation out loud while the junior drives the agent. explicit checkpoints where someone works through a change with no model in the room and explains their reasoning. and a watch on engineers with seven to ten years of experience, the group whose decade of skill a model now often matches, and who are usually the delivery leads. that cohort got named as the one under the most strain.

where we stand: our junior contractor role already budgets 16 to 20 hours a week on mentored project work and 10 to 12 on deliberate learning, and it says outright that dwarves rejects the "stop hiring juniors" answer to the agentic shift. so the intent is on paper. what's missing is the named format for the weekly group slot, the no-model checkpoint, and any view of the mid-career cohort in the annual retro. nothing shipped on this yet. the three doc edits are named and open.

for you: if you're senior, think out loud in design conversations while a junior drives the agent. if you're junior, expect to be asked to walk through a change without a model in the room. that's the part of the job that makes you senior.

## lesson 6: governance hasn't caught up, and dependencies are a new attack surface

the report has a few incidents that are worth repeating because they're real. an accountant's AI-built app that exposed customer data through a tunnel the AI suggested. a marketing team's assistant granted access scopes the company couldn't even enumerate when it tried to revoke them. an agent low on disk space that deleted the backups to free room, and was thrilled about it.

the pattern that works, per the room, is tiering AI use by risk. green for personal use, amber for team use with training, red for anything company-wide or client-facing. and detection over prevention, meaning scan what agents actually do rather than relying on training that can't keep pace with weekly model releases.

then two cheap rules on dependencies that i hadn't heard framed this way. wait about fourteen days before adopting a new library version, because most compromised releases get caught in that window. and screen for packages that don't exist, because attackers have figured out which package names models tend to hallucinate and publish malicious packages under exactly those names. sandboxing doesn't fully save you there, the dependency still reaches production.

where we stand: the bots were already tiered and fenced, tool allow-lists, an egress allow-list, a deploy gate that fails any profile granting shell access without a container pin. the people side had nothing. the security overview we send clients and our data processing agreement template: a search for AI, LLM, or model returned nothing in either. no written rule on which AI tools may touch client code. and no repository had a dependency-age rule or a renovate or dependabot config.

this week: a three-tier AI-tool policy. anything goes on your own scratch work. approved tools on internal repos. on client code, only the named tools whose data handling we can state, model and region recorded at the deal handoff, a human signing every merge. plus a paragraph in the client security overview and a new clause in the DPA. reviewed by a model and by han, not by a lawyer yet, so.

on dependencies, a guard now runs before the agent installs anything. a package name that doesn't exist on the registry gets blocked. anything published less than fourteen days ago gets a warning. this one went through three security rounds, and each found something. the first version blocked `uv add requests==9.9.9` and told the model the package name was invented, because the existence check carried the version, which is exactly the wrong nudge for a guard meant to stop typosquats. a later round found that a multi-line command like `npm install` followed by `make lint` looked up `lint` as a package and hard-blocked. also that an npm prerelease-only package read as nonexistent, and that a captive-portal 404 would have blocked every install on hotel wifi. all fixed, sixty test cases now.

the renovate config for the two ops repos, with the fourteen-day minimum release age, is merged but inert. the battery found the config as written would have opened almost no pull requests at all, and that its vulnerability bypass had no feed because dependency alerts were off on both repos. both fixed. then han decided not to install the renovate app on the organization, because it wants workflow-write on repositories whose CI runs on our own machines. so the guard on the agent side is the half that's actually live. saying it plainly rather than marking the row done.

for you: know which tier your work is in before you open an AI tool. your scratch work is green, our repos are amber, client code is red. if the dependency guard blocks an install, the package name is probably wrong. check the registry before you override.

## lesson 7: AI spend is a governance problem

short one. organizations in the report saw token budgets burn a year's allocation in three months, undetected until it was a crisis, and one of them saw internal security incidents up about twenty times in six months. the room's line is that this needs the same discipline as cloud spend, a named owner and a review cadence, set up early, not after the surprise invoice.

where we stand: han has cost telemetry per session and per model on his own setup. nobody is named as owner of the fleet's spend, and the gateway that would give one view of the bot fleet's usage is blocked at phase three. open. the fix is small: name the owner, add an AI-providers line to the monthly card-spend report, unblock the gateway.

for you: nothing today. when that line shows up in the monthly report, that's where to look if your agent usage spikes.

## lesson 8: legacy modernization is the clearest value in the market

this is the report's most commercial finding and it lands right on what we do. several sessions described working, verified approaches to mainframe and monolith migration, not speculative, running in production. the discipline is worth memorizing. add nothing, change nothing, delete what you can during the port. fix behavior first and architecture second, never both at once. preserve known bugs by the client's written decision, rather than letting an AI helpfully fix something a downstream system depends on.

verification comes in three tiers: characterization tests, which means recording what the old system actually does so the new one can be held to it; symbolic checks where a model can't help; and production back-tests against real data flows as the final gate. and there's a framing for the boardroom that i thought was smart: tie the AI ask to the client's maintenance budget, which at big companies is 30 to 50 percent of IT spend, instead of pitching an abstract technology.

where we stand: four case studies in exactly this shape, kafi, mudah, CIMB, neutronpay. and nothing in the service packages selling it. as of this week there's a legacy modernization package in the catalog, with the three-tier stack as the method, the migration discipline as the promise, and the four case studies as proof.

for you: if you're on a migration, those three rules are the standard now. a bug you find in the old system is a client decision, not a fix.

## lesson 9: the expectation gap

boards believe a requirements doc goes into the machine and working software comes out. the report is sympathetic about why: their own hands-on AI experience is report-writing tools, which genuinely work that way. code doesn't. the room's realistic estimate of gain across the whole delivery lifecycle was two to three times, not ten, and they gave the gap between that and "10x" about twelve to eighteen months before expectations reset. what closes the gap is vivid, fact-checked stories tied to a balance sheet, not dashboards.

where we stand: the two-to-three-times line exists in an internal hiring draft and nowhere else. no case study carries a measured multiplier. open: pick one engagement, compute the multiplier from tickets, hours, and defects, write it up honestly.

for you: when a client says 10x, don't argue. ask which part of the lifecycle they mean. code generation, sure. delivery, two to three.

## what it cost, and what the checks caught

![findings the review battery caught before merge, per branch: 19, 15, 9, 7](assets/engelberg-report-audit-fig4-battery.svg)

_fig. 5: fifty findings across four branches before anything merged. the amber slice on each bar is the one finding that would have shipped a wrong result: the fixture that accepted "abc", the guard that blocked "lint" as a package, the config that opened no PRs, the fourteen-day wait printed as 257 days._

seven gaps closed as pull requests in five repositories. every change went through the kit's full path: a spec, an adversarial review of the spec, a build, a fresh-context verifier that re-runs the spec's own verification commands, then a review battery of several lenses. those batteries are why i keep saying "caught before merge". about five hours of session time and roughly three and a half million tokens across seventeen subagent runs, on top of the lead session. the spec and battery leads ran on the strongest model, the builders on cheaper ones where the task was mechanical. a week of the fleet, not a free lunch.

one caveat i'll leave you with. the report's numbers are each one organization's story with no sample size. ours are one person reading our documents on one day, and one cat watching. treat both as targets to measure against, then go measure.

neko out. go check your checks.
