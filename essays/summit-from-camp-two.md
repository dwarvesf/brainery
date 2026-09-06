---
draft: true
title: What the summit looks like from camp two
description: Five findings from the Thoughtworks Engelberg retreat on AI-assisted engineering, told as a climb, with where Dwarves stands on each. Generating code is the valley floor; checking it is the next pitch.
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

In June, forty CTOs and senior engineers spent three days in Engelberg, Switzerland, arguing about what software engineering is turning into. Thoughtworks wrote up the findings. One line has stayed with me: engineering now comes down to two questions, how do I describe the goal, and how do I check that I reached it.

This post is the five findings I think matter most for us, told as a climb, with an honest note on where Dwarves stands on each. I'm writing it because the next few months of work are being sequenced against this picture, and it's easier to argue with a picture than with a backlog.

![The route: four camps and a summit, with an amber marker at camp two](assets/summit-from-camp-two-fig1-route.svg)

_Fig. 1: The route. Four camps in the order you have to pass them, one marker for where we stand, and a false summit drawn where the marketing lives._

## The summit

Here's my definition, and you're welcome to disagree. The summit is a team where AI agents do most of the building, and every piece of output gets checked for less than it cost to produce. The only work a human still does by hand is set the goal, make the calls the agents can't, and accept the result.

The word that matters is cheaper. Any team can verify AI output if they're willing to read every line by hand. The summit is when checking costs less than making, because that's the point where the agents' speed becomes the team's speed instead of the reviewer's. One person in Engelberg put it in a sentence: the only thing they refuse to outsource is the acceptance criteria.

## Finding 1: verification is the bottleneck, not generation

Everyone is at camp one now. A model writes a module, a test file, a deployment config, faster than anyone can read it. The report's first and loudest finding is that generating code stopped being the hard part, and the teams that win are the ones that got good at checking it.

The report is specific about what "good at checking" means. Three steps, in order. Measure coverage. Then have an agent actively try to break the code without breaking any test, because the input your tests forgot is the one that matters. Then run mutation testing, which means breaking the code on purpose in small ways and confirming the suite notices, and only bother with that if the probe found nothing. The room also admitted something uncomfortable: nobody there could cite data on how many defects manual code review actually catches. They called it a status quo illusion.

Where we stand: we had the first and third steps and not the middle one. Our own review rubric asks for a monthly sample of merged pull requests to check whether review caught what it should have, and we had never recorded a single number. And one of our monitoring alerts sat green for a month while the source it watched had been shut down, which is the same lesson one level up: a check you never check is a second place to be wrong.

## Finding 2: the harness matters more than the model

"Harness" is the industry's word for everything around the model: the rules it loads, the checks that run before and after each action, which tools it may call, which model does which job. The report's claim is that this scaffolding is where teams will differ once the models themselves look alike.

The numbers behind it, each from one organization: a four-times cut in AI cost from a better harness; a smaller model with a good harness beating a larger one with a weak harness; and the single cheapest improvement anyone reported, turning a linter's complaint ("this function is too long") into step-by-step instructions the agent can follow ("extract the loop body into a named function, then..."), which moved code-smell resolution from under half to about ninety percent.

Where we stand: this is camp two, and it's where we live. We measured the same shape independently: a strong model planning and reviewing, with cheaper models doing routine work, came out about three times cheaper than running the expensive model for everything, same result. Every guard in our setup exists because something went wrong first; the push guard is there because eight pushes once reached the main branch from inside a script. Camp two is real altitude, and it's also where I expect most serious teams to be stuck for a while, because the next pitch is steeper.

## Finding 3: the harness should improve itself

The best-performing teams in the report don't hand-write their harness rules. They let agents fail, then run a "learn" step that looks back at the session and proposes changes to the rules and reusable skills. The human's job becomes pruning those proposals, not authoring them.

The warning attached is the part I'd underline. Shared skills and rule files decay like any unowned code unless someone owns them and someone measures whether they still help as the models improve. A skill that was essential six months ago may be pure cost today, and nothing tells you unless you test with and without it.

Where we stand: we had built the pruning gate and never switched on the part that grows proposals. That's fixed. What we still can't do is measure whether a skill that fires is worth the context it eats.

## Finding 4: the two clocks

The sharpest diagnostic in the whole report. Teams measured two things: the time to produce code, and the time spent waiting for a decision or a clear specification. Code time collapsed. Total delivery time didn't move. The constraint had walked upstream to decisions and unclear specs, and the pipeline everyone kept optimizing wasn't where the time went. The report's advice is blunt: if throughput is up and cycle time isn't, fix the decision-making process, not the pipeline.

Where we stand: we couldn't read either clock. Our projects database has a close date on 2 of 62 projects, so cycle time is unmeasurable. My own task board had rows marked "Han's call" with no view of how long they'd waited. That list exists now; on its first run, nine items, median three days. If that median ever passes the build time of the work behind it, the bottleneck is my calendar, and no tooling fixes that.

## Finding 5: the apprenticeship problem

Six separate sessions raised the same fear: if senior engineers pair only with agents, juniors never get the hands-on struggle with real code, real incidents, and real trade-offs that produced the seniors in the first place. The countermeasures are concrete. A "design quorum" where the senior leads the design conversation out loud while the junior drives the agent. Explicit checkpoints where someone must work through a change with no model in the room and explain their reasoning. And a watch on engineers with seven to ten years of experience, the group whose decade of skill a model now often matches, and who are usually your delivery leads.

Where we stand: our junior role already budgets sixteen to twenty hours a week of mentored project work and rejects the "just don't hire juniors" answer. The named format and the no-model checkpoint are what's missing.

## The weather

Four more findings that don't fit on the route but change how you climb it.

Governance hasn't caught up. The report's incidents are real: an accountant's AI-built app that exposed customer data through a tunnel the AI suggested; a marketing assistant granted access scopes the company couldn't even enumerate when it tried to revoke them; an agent low on disk space that deleted the backups and was pleased about it. The pattern that works is tiering by risk, green for personal use, amber for team use with training, red for anything company-wide or client-facing, and detection over prevention, because training can't keep pace with weekly model releases. Two cheap rules from the same session: wait about fourteen days before adopting a new library version, since most compromised releases are caught in that window, and screen for packages that don't exist, because attackers now publish malicious packages under the names models tend to invent. We had no written policy on which AI tools may touch client code. We do now.

AI spend is a governance problem, not a finance problem. Organizations reported token budgets burning a year's allocation in three months, undetected until it was a crisis. Named owner, regular review, set up early, same as cloud spend.

Legacy modernization is the clearest value in the market. The report describes working, verified approaches to mainframe and monolith migration, with a discipline worth memorizing: add nothing, change nothing, delete what you can; fix behavior first and architecture second, never both at once; preserve known bugs by the client's written decision rather than letting an AI helpfully fix something downstream depends on. We have four case studies in this shape and, until this week, nothing selling it.

The expectation gap. Boards believe a requirements doc goes into the machine and working software comes out, because their own AI experience is report-writing tools that genuinely work that way. The room's realistic estimate across the whole delivery lifecycle was two to three times, and they gave the gap between that and "10x" twelve to eighteen months before it resets. That's the false summit in the figure, below camp two.

## What this means if you build at Dwarves

Treat your test suite as the thing under review, not just the code. If an agent wrote the tests, ask what input they forgot before you trust the green.

Spend your effort on the harness, not on prompt wording. A rule that runs on every action beats an instruction the model may or may not remember.

Keep the acceptance criteria yours. Hand over the building, never the definition of done.

Watch the second clock. If you're waiting on a decision, say so out loud; the waiting is now the expensive part.

Pair on design, not just on code. A junior driving the agent while a senior thinks aloud is the apprenticeship that survives this.

## Where the argument leaks

The camps are a line and the work isn't. Every number from Engelberg is one organization's story with no sample size, and I've treated them as targets to measure against, which I'd ask you to do with mine too. And the summit might not be reachable for judgment-shaped work: checking cheaper than making is a clear target for code, and I don't know what it means for a proposal, a hire, or a pricing call. Those stay on the human clock, which is probably fine. Those are the calls the summit says a human keeps anyway.

We're at camp two. The next pitch is verification, starting with whether our own checks are reading anything.
