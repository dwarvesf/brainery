---
draft: true
title: What the summit looks like from camp two
description: Where AI-assisted engineering actually is in late 2026, told as a climb. Generating code is the valley floor, the scaffolding around the AI is the camp we stand in, and the summit is a team whose AI output gets checked for less than it cost to produce.
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

I read that the same week I found that one of our monitoring alerts had been "green" for a month while watching a data source that had been shut down on August 1. The alert was healthy. The thing it was supposed to watch was gone. Nobody noticed, because a green light looks the same whether or not anything is behind it.

So this is a post about where we are with AI-assisted engineering, and what I think the top looks like. I'm writing it for every developer at Dwarves, because the next few months of tooling work are being sequenced against this picture, and it's easier to argue with a picture than with a backlog.

![The route: four camps and a summit, with an amber marker at camp two](assets/summit-from-camp-two-fig1-route.svg)

_Fig. 1: The route as I see it. Four camps in the order you have to pass them, one marker for where our own audit put us, and a false summit drawn where the marketing lives._

## The summit

Here's my definition, and you're welcome to disagree. The summit is a team where AI agents do most of the building, and every piece of output gets checked for less than it cost to produce. The only work a human still does by hand is set the goal, make the calls the agents can't, and accept the result. Judgment inside the company, trust outside it. I wrote about why those two survive in [an earlier post](what-stays-valuable-when-anyone-can-build.md); this one is about the route.

The word that matters in that definition is cheaper. Any team can verify AI output if they're willing to read every line by hand. That's the valley floor with extra steps. The summit is when checking costs less than making, because that's the point where the agents' speed becomes the team's speed instead of the reviewer's.

Someone in Engelberg put it in one sentence: the only thing they refuse to outsource is the acceptance criteria. Everything else they're willing to hand over.

## Camp one: generating code

Everyone's here. It's the valley floor now. A model writes a module, a test file, a deployment config, faster than anyone in the room can read it. The report's first finding says code generation is no longer the bottleneck, and I don't know a working engineer who'd argue.

The trap at camp one is mistaking it for altitude. The team that ships the most generated code has the most unchecked code. The report describes a team where a product manager and a designer started shipping features on their own with agents, while the engineer was left cleaning up after them. Leadership called it highly productive and a disaster in the making, in the same breath.

## Camp two: the harness

"Harness" is the word the industry has settled on for everything around the model: the rules it loads at the start of a session, the checks that run before and after each action it takes, which tools it may call, which model handles which job. The report's second finding is that this scaffolding matters more than which model you picked, and that it's where teams will differ once models all look the same.

This is where we are, and I can say that with some evidence, because I counted.

My own coding-agent setup runs about forty of these checks. Nine of them run before an action and can refuse it: one stops a password or API key from being printed into the conversation, one stops a push to the main branch, one refuses to create a new script until the agent has checked whether one already exists. Four more run when the agent tries to end its turn and can send it back: one refuses a message that says "done" when the agent ran nothing, one refuses a message that shows you a shell command instead of running it.

Every one of those exists because something went wrong first. The push guard's own error message explains why it's there: on August 26, eight pushes reached the main branch from inside a script, where a text-matching check couldn't see the branch name. That's what harness engineering looks like from the inside, most days.

The report has numbers from other teams. One cut its AI usage cost by at least four times with a better harness. Another found a smaller model with a good harness beat a larger model with a weak one. We measured the same shape on our side: a strong model planning and reviewing, with cheaper models doing the routine work, came out about three times cheaper than running the expensive model for everything, with the same result. When we last looked at our own bill, 58% of it was the model re-reading context we had already sent it, which is a harness problem, and one we can fix.

Camp two is real altitude. It's also where I think most serious teams will be stuck for a while, because the next pitch is steeper.

## Camp three: checking the output as fast as it's produced

The first thing to admit is that we thought we were higher than we are.

We run mutation testing on our main Workers codebase. Mutation testing means deliberately breaking the code in small ways, one at a time, and checking that the test suite notices each break. If it doesn't, the tests aren't really testing. It's a good check. It also took 47 minutes per merge, burned 5,101 GitHub Actions minutes in ten days, and used up the whole organization's monthly allowance by the sixth. Actions got switched off org-wide for part of August. The check runs on a Mac Mini in Da Nang now, at no extra cost, and it's advisory. It warns. It doesn't stop a merge.

Then there's the green alert I opened with. That alert had a proof-of-done, a written record that we tested it, including a test that it fires when something is wrong. The test was hollow: it proved the alert reacted to a fault in a source that no longer produced anything. We fixed it on August 30 by adding a rule that zero data for three weeks is itself an alarm, so the alert can never again pass by reading nothing. That's one alert. I'm sure there are others.

The report describes what camp three needs, and it's more specific than I expected. Check coverage first. Then have an agent actively try to break the code without breaking any test. Then run mutation testing, only if that probe found nothing. We had the first and the third. The middle step, an agent whose job is to find the input your tests forgot, is the one that tells you whether your suite means anything. As of this week it exists in our review pipeline. On its first live run it found a hole in a test fixture we had written to be airtight.

The other camp-three finding is uncomfortable. Nobody in the Engelberg room could cite data on how many defects manual code review actually catches. They called it a status quo illusion. Our own code review rubric says to sample five to ten merged pull requests a month and check whether review caught what it should have. I went looking for the numbers this week and found that we had never recorded one.

## Camp four: the harness improves itself

The best-performing teams in the report don't hand-write their harness rules. They let agents fail, then run a "learn" step that looks back at the session and proposes changes to the rules and the reusable skills. The human's job becomes pruning those proposals, not authoring them.

We had built half of this. Our kit has a component that reviews a session as it ends and drafts skill proposals into a folder, and a gate where I approve or reject them. This week's audit found the first half was never switched on: the events that should trigger it were empty in my live settings, and the folder didn't exist. I had the pruning shears and nothing growing. That's a one-line settings change, which is the annoying kind of gap, and it's fixed now.

The report's warning about camp four is the one I'd underline. Shared skills and rule files decay like any unowned code unless someone owns them and someone measures whether they still help. We can list which skills never fire. We can't yet measure whether a skill that does fire is worth the context it eats.

## The weather: two clocks

The sharpest idea in the whole report is what they called the two clocks. Teams measured the time to produce code, and separately the time spent waiting for a decision or a clear specification. Code time collapsed. Total delivery time didn't move. The constraint had walked upstream to decisions and unclear specs, and the pipeline everyone kept optimizing wasn't where the time went.

I can confirm the first clock is broken on our side, and I couldn't read the second until this week. Our projects database has a close date on 2 of 62 projects, so cycle time is unmeasurable, which one of our own documents already admitted. My own task board had rows marked "Han's call" with no view of how long they'd sat there. Now there's a command that lists them, oldest first. On its first run: nine rows waiting on me, median three days. If that median ever passes the median build time of the work behind it, the bottleneck is my calendar, and no amount of tooling fixes that.

## Altitude sickness

Three things the report flags that I'd rather name now than discover later.

AI spend is a governance problem. One organization saw internal security incidents rise about twenty times in six months, while AI budgets burned through a year's allocation in three months. The report's line is that this needs the same discipline as cloud spend: a named owner and a regular review, set up early. We have neither yet for our bot fleet, and both are fixable this month.

Juniors stop learning if seniors only pair with agents. Six sessions raised this independently. Our junior role already budgets sixteen to twenty hours a week of mentored project work and rejects the "just don't hire juniors" answer. What we don't have is the format the report describes: a senior leading the design conversation out loud while the junior drives the agent, and a checkpoint where someone has to walk through a shipped change with no model in the room. The report singles out engineers with seven to ten years of experience as the group under most strain, the people whose decade of skill a model now often matches. They're usually your delivery leads.

The expectation gap. Boards are betting on a picture where a requirements doc goes into the machine and working software comes out, because their own experience of AI is report-writing tools that genuinely work that way. The room's estimate of realistic gain across the whole delivery lifecycle was two to three times, and they gave the gap between that and "10x" twelve to eighteen months before it resets. I've drawn that as the false summit in the figure, below camp two.

## What we're doing this period

I ran the report against what we actually have. Three audits, one per area: the kit every repo adopts, my personal coding-agent setup, and the Dwarves operations documents. Twenty-three named practices.

![Twenty-three practices: nine already in place, ten to absorb now, four parked or skipped](assets/summit-from-camp-two-fig2-audit.svg)

_Fig. 2: Where the report's practices landed after the audit. The nine we already had include the proof-of-done gate, the understanding gate, risk-tiered autonomy for agents, and allow-lists on our bots. The ten are this period's climb._

The ten are small on purpose, and most shipped within the week. A checker that turns a linter's complaint into step-by-step fix instructions the agent can follow, which one team in the report credited with moving code-smell resolution from under half to about ninety percent. A guard that stops an agent installing a package that doesn't exist, a real attack where people publish malicious packages under names AI models tend to invent, and warns on anything published less than fourteen days ago. The learn loop, switched on. The decisions list. The break-the-code step in review. On the Dwarves side, the gap that embarrassed me most: our client security overview and our data processing agreement didn't mention AI at all, and we had no written rule on which tools may see client code. That policy now exists, in three tiers: anything goes on your own scratch work, approved tools on internal repos, and named tools with stated data handling on client code. A legacy modernization service package is written, because the report calls it the clearest value in the market right now and we had four case studies and nothing selling it.

Each of those carries a number or it doesn't count. The lint checker logs which rules it explained and which were gone on the next run. The decisions list reports a median every week. If the report's numbers don't reproduce here, that's a finding too.

## Where the argument leaks

The camps are a line and the work isn't. We switched on camp four and built a camp three check in the same fortnight, and a good week at camp two still matters more than a bad week at camp three.

Every number I've quoted from Engelberg is one organization's story. The four-times cost cut, the ninety percent, the twenty-times incident rise. None came with a sample size. I've treated them as targets to measure against, and I'd ask you to do the same with mine: forty checks is one person's setup, and 2 of 62 is one company's database.

The summit might not be reachable for judgment-shaped work. Checking cheaper than making is a clear target for code. For a proposal, a hire, a pricing call, I don't know what cheap checking means, and the honest answer is that those stay on the human clock for now. That's probably fine. Those are the calls the summit says a human keeps anyway.

The room in Engelberg agreed on one more thing. They don't expect a plateau. They expect the cycles to get shorter, and they argued that the durable move is to build what holds its value wherever the hype lands: the harness, the checking discipline, the governance. We're at camp two. The next pitch is verification, starting with whether our own checks are reading anything.
