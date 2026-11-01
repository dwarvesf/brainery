---
title: "Raising the orchestrator cap: which tricks the evidence supports"
description: "Longer agent runs, cheaper reviews and better re-entry notes each raise how many agents one person can run, by different amounts."
date: 2026-11-02
toc: true
authors:
  - tieubao
tags:
  - commentary
  - ai
  - agents
  - productivity
  - management
slug: raising-orchestrator-cap
type: writing
form: analysis
topic: ai-agents
fit: 3
abstract: "One person can supervise only a few parallel agents, and the limit follows a formula with three terms you can change. We sorted the tricks people use by which term they move and how strong the evidence is, checked two of them against our own session logs, and turned the winners into harness upgrades. Longer, verified agent runs and a re-entry card with a self-written next step have the best support; a lead agent that supervises the others has the weakest."
---

![Three knobs on one formula {#fig-knobs}](assets/raising-orchestrator-cap-fig1-knobs.svg 'Three knobs on one formula. Each trick raises the cap by moving one term: longer runs alone, cheaper reviews, or faster re-entry.')

In the [first post](/orchestrator-attention-cap) I measured myself running about five agent sessions at peak when my own loops allowed fewer than two. The obvious next question is how to raise that limit instead of just obeying it. I had two guesses going in: make agents work longer before they need me, and keep a note so I can catch up faster when I come back. Both held up in the data, and each needed a second half I had not planned.

This post sorts the tricks by which part of the limit they change, grades the evidence behind each, tests two against our own logs, and ends with the harness changes we are building.

## Which knob moves the cap?

The cap comes from one formula, and every trick works by moving one of its three terms.

$$ FO = \frac{NT}{IT + WT} + 1 $$ {#eq-fanout}

where:

- $FO$ is fan-out, how many agents one person can keep moving.
- $NT$ is neglect time, how long an agent works before it needs you.
- $IT$ is interaction time, how long a review or decision takes.
- $WT$ is the extra time you spend getting back into a thread and waiting your turn.

There are three ways up. Raise NT so agents need you less often. Cut IT so each visit is cheaper. Cut WT so coming back costs less. A fourth lever sits beside the formula: hold fewer open loops in your head, which protects the working memory that every term draws on [16].

The terms are not equal. My own median loop is two minutes alone and two and a half waiting, so a small NT gain moves my cap more than any polish on re-entry. Somebody whose agents already run for an hour gets more from cutting review cost. ==Find your smallest term first, because the same trick can double one person's cap and barely move another's.==

## How do i make agents run longer alone?

Give them a bigger, checkable job. Of all the levers, raising NT has the clearest evidence, and our own logs back it.

Models can already work much longer than most of us let them. METR's measure of how long a task an agent can finish at 50% success went from minutes in 2024 to around twelve hours for frontier models in early 2026, doubling every four to seven months [1]. The catch is reliability: at 80% success the horizon is closer to three hours. For most coding sessions, the brief runs out before the model does.

Our transcripts show it plainly. I bucketed 3,351 turns from thirty days of sessions by the length of the prompt that started them.

![Bigger briefs, longer runs {#fig-nt-by-brief}](assets/raising-orchestrator-cap-fig2-nt-by-brief.svg 'Bigger briefs, longer runs. Median time an agent worked alone, by prompt length and by whether the turn ran a skill.')

Table: How long agents ran alone, by the size of the brief {#tbl-nt}

| Prompt that started the turn | Turns | Median alone | p75 alone |
| :--------------------------- | :---- | :----------- | :-------- |
| Under 50 characters          | 1,358 | 1.4 min      | 7.4 min   |
| 50 to 200 characters         | 1,433 | 2.0 min      | 7.9 min   |
| 200 to 1,000 characters      | 460   | 3.9 min      | 12.2 min  |
| Over 1,000 characters        | 100   | 9.4 min      | 28.5 min  |
| Turn ran a skill or command  | 349   | 7.9 min      | 23.1 min  |
| Turn ran neither             | 3,002 | 1.6 min      | 7.2 min   |

A thousand-character brief bought nearly seven times the unattended time of a one-liner, and a turn that ran a packaged skill bought five times. The data is observational, and big briefs go with big tasks, so part of the gap is the task and not the brief. The direction still matches every other source.

Length alone is not the point. A long run is only useful if you can trust where it ends, and three things make that true:

1. **A done-check the agent cannot fake**: Anthropic's long-running harness gives the agent a feature list in JSON where it may only flip a "passes" field, plus end-to-end tests, and reports that this stopped agents from declaring victory early [2]. Huntley's Ralph loop calls the same idea backpressure: tests, types and lints push back until the work is real [3].
2. **The questions asked before the run**: an agent that asks about an underspecified task before it starts reached 69.4% on those tasks, close to the 70.8% it scored with a full spec [4]. Left alone, agents ask in only about 3% of turns [5], and in our logs they asked in 3.8%. Asking once, up front, is cheaper than being asked mid-run.
3. **Fewer permission stops**: Anthropic found people approved about 93% of permission prompts, which it reads as fatigue, and that sandboxing cut prompts by 84% [6]. In our logs pure go-ahead replies such as "proceed" and "approve" were only 5% of prompts, so the gain there is real but smaller than I expected.

Supervisory-control research found the same thing about robots and drones. Operators handled four to five drones when they approved every step and eight to twelve when the drones only called on exceptions [7]. In Olsen and Goodrich's driving study, giving each robot goal-seeking autonomy raised measured fan-out from 0.93 to 2.2 robots [32]. The same field adds a caution. In a small drone study, operators did better approving each step than handling exceptions only [33], and other work ties exception mode to complacency and lost awareness. Raise NT on reversible work, and keep a consent gate on anything you cannot undo.

## How do i make each review cheaper?

Make every result arrive in the same shape, small enough to judge, with the evidence attached. Review is where AI coding speed currently stalls.

A working paper covering 718 firms found that code added rose about 30% after AI adoption while resolved issues did not move, and the time from pull request to merge rose 49% [8]. Teams produce more and land the same amount, because review absorbs the difference. Cutting IT is how you get the 30% back.

The strongest evidence for a fixed shape comes from hospitals. When nine children's hospitals adopted I-PASS, a structured handoff format, medical errors fell 23% and preventable adverse events fell 30% [9]. The WHO surgical checklist cut complications from 11% to 7% [10]. In software, a randomized experiment found that a checklist made code review more effective [11]. Fixed formats work through chunking: experts read a familiar structure as one unit, and the advantage vanishes when the structure changes [12]. ==A result card only speeds review if every agent writes it the same way, every time.==

Three more tricks have weaker support:

- **Small diffs and stacked pull requests**: vendor data reports faster merges and less reviewer time, with no independent study behind it [13].
- **An AI first-pass review**: catch rates in vendor benchmarks range from 6% to 82% across tools [14]. Use it as an advisory pass, never as the merge gate.
- **Review the plan instead of the code**: approve the plan up front, then check only that the code matches it [15]. This is practitioner advice, untested.

## How do i get back into a thread faster?

Write down your next step before you leave, and let the agent write down what it did. This is the trick behind my "keep a note" guess, and it needs both halves.

Our logs show why re-entry matters. When I switched sessions, I landed on a thread that had been idle 5.4 minutes at the median, against 1.6 minutes when I stayed. Nearly a quarter of switches landed on a thread idle more than thirty minutes. Every one of those is a cold start.

![Switching lands on a cold thread {#fig-staleness}](assets/raising-orchestrator-cap-fig3-staleness.svg 'Switching lands on a cold thread. How long a thread had been idle when I came back to it, after a switch and when I stayed.')

The research is consistent about what helps:

- **Rehearse the next step before you leave**: people warned before an interruption used the seconds to plan what they would do on return, and resumed faster [17]. Cues present just before an interruption shorten the time to resume [18].
- **Keep the context visible**: programmers with a task list or problem view open resumed within a minute 35% of the time, against 10% overall [19].
- **Combine a generated summary with your own note**: in a 2026 lab study, developers resumed in 45 seconds with an LLM summary of their work and 69 seconds with only a note they wrote themselves [20]. They also said the summary missed the one thing their own notes had: what they meant to do next.
- **Offload the intention**: setting an external reminder removed the memory cost that interruptions otherwise caused [21].

So the right re-entry card has two authors. The agent writes what it did, what changed and what it needs. You write one line: what you will check or decide next, before you leave the thread. The Leroy and Glomb ready-to-resume plan from the first post is the same move [22].

## When should agents interrupt me?

Only when they need a decision, and through one queue you check at moments you choose. Batching alerts calms you down; a triage view is what raises throughput.

ParallelPilot is the closest direct test. Developers supervising parallel agents got a plan interface, a run log and a triage dashboard that sorted sessions into those needing input and those ready for review. Throughput rose 63%, the number of agents they could supervise comfortably rose from 2.6 to 4.0, and tracking effort fell sharply [23]. Peak concurrency with the tool was still only 3.25, which fits the cap from the first post. The most common miss without the tool was a clarification request left waiting.

Timing helps less than it seems. Deferring alerts to natural breakpoints cut frustration, but it did not shorten the time to resume [24]. Batching phone notifications three times a day improved attention and mood, while hourly batching did not [25]. Read that as a wellbeing gain more than a capacity gain.

Robot research says wait is the term to attack. When Crandall and Cummings grew a team from two robots to eight, review time per robot stayed flat at 16 to 18 seconds, while time spent waiting for the operator rose from 9 seconds to 68 [34]. Performance stopped improving at six robots. Three findings from that line of work carry over to agents:

- **Push beats polling**: operators noticed a stuck robot significantly later when nothing alerted them, and an alarm removed the delay [35].
- **Show the whole queue**: displaying every pending request beat showing one at a time, and serving the shortest job first matched the best result [36]. Shortest-first scheduling alone cut robot downtime by only 2 to 16% [37].
- **Skip the prediction dashboard**: operators given a forecast of future attention needs did worse than those given none, because they chased a global optimum [38].

## Can more automation take decisions off me?

Yes, for low-risk decisions with a clear rule, and only with a check you did not write. Automation shifts the cap furthest when it changes which decisions reach you at all.

The drone research calls this delegation by play. The operator picks a named play, such as "search this area", and the automation fills in the steps. In a NASA and Air Force study with three and five drones, the playbook interface scored 66% on a composite measure, against 61% for manual control and 48% for a set of separate tools [39]. Workload did not change and performance still fell at five drones, so plays help at the margin. Adaptive automation, which takes on more work when the operator is overloaded, beat fixed automation on change detection and workload [40]. In agent terms, a play is a packaged skill with a fixed brief, and our logs already show skill turns running five times longer alone.

The warning from the first post still applies. Automation bias appears in experts and does not fade with practice [26]. Anthropic's own auto-approval classifier misses about 17% of overeager actions [6], and an independent stress test reported a much higher miss rate on ambiguous work [27]. Hand off decisions by risk tier, and keep the risky ones yours.

## Does a lead agent raise my cap?

Not on current evidence. A supervising agent moves your queue one level up and adds cost and merge risk on the way.

A study of 2,124 runs found parallel sub-agents raised pass rates on some long tasks by up to 14 points, cut Claude Code's SWE-bench pass rate by 24 points on another, used 1.4 to 3.3 times the tokens, and traced a third of failures to shared state and merge conflicts [28]. Declaring each agent's write scope up front raised integration success from 66% to 97% [29]. Cursor's long-running experiment ended up removing its planner and judge layers in favor of a simpler setup [30]. Anthropic's multi-agent research system did beat a single agent by 90%, on breadth-first research rather than code, at about fifteen times the tokens [31].

A second human is better supported than a supervising agent. Queueing math predicts that two operators sharing one queue can handle up to 50% more vehicles per person than two separate queues [41]. Human studies are mixed: pooled pairs reported lower workload [42], but in another study a single operator with good tools stabilized a mission in 3.5 minutes against 13 for a team of three, and the team filed duplicate reports three times as often [43]. Pooling helps when ownership of each item is explicit.

## Which tricks are worth it?

Start with the two-author re-entry card and longer verified runs. The card has the strongest lab evidence, the runs have our own logs behind them, and both cost little.

Table: Tricks ranked by evidence and fit {#tbl-ranked}

| Trick                     | Moves       | Evidence | Cost   |
| :------------------------ | :---------- | :------- | :----- |
| Bigger brief with a test  | NT          | Moderate | Low    |
| Ask questions up front    | NT          | Moderate | Low    |
| Two-author re-entry card  | WT          | Strong   | Low    |
| Fixed result card format  | IT          | Moderate | Low    |
| Push alert when blocked   | WT          | Moderate | Low    |
| Needs-input triage queue  | WT          | Moderate | Medium |
| Packaged plays (skills)   | NT, IT      | Moderate | Medium |
| Exception-only escalation | NT          | Moderate | Medium |
| Sandbox and risk tiers    | NT          | Moderate | Medium |
| Small diffs, stacked PRs  | IT          | Weak     | Medium |
| AI first-pass review      | IT          | Weak     | Low    |
| Alert batching            | wellbeing   | Mixed    | Low    |
| Shared queue, two humans  | WT          | Mixed    | Medium |
| Shortest review first     | WT          | Weak     | Low    |
| Lead agent over workers   | moves queue | Weak     | High   |

## How are we upgrading our harness?

We are turning the top tricks into defaults, so they happen without anyone remembering them. Most of the parts already exist in our setup; the gaps are the glue between them.

![The harness loop after the upgrades {#fig-harness}](assets/raising-orchestrator-cap-fig4-harness.svg 'The harness loop after the upgrades. Work reaches the human only through a verified result card in one queue, and leaves with a written next step.')

1. **A verifier gate before a worker reports back**: a worker's final message is held until a fresh-context acceptance check passes, so the human only sees verified results. Moves NT and IT.
2. **A result card as a schema**: the card becomes a fixed structure (result, changes, proof, not done, decisions, needs from you), checked by a linter, and a worker cannot mark itself done without a valid card. Moves IT.
3. **One "needs me" queue**: a hook writes one line per blocked thread, with its age and the ask, into a single list, and one command opens the oldest. Today agent state lives in tab titles and sounds. Moves WT.
4. **A next-step line on park**: parking a thread prompts for one line on what to check next, and the re-entry view shows that line above the agent's summary. Moves WT.
5. **Brief templates with a done-check**: dispatch refuses a worker brief that has no test or acceptance line. Moves NT.
6. **Wider safe auto-approval**: writes inside a worker's own worktree and its named test command run without a prompt. Moves NT.
7. **A stall watchdog**: an idle or looping worker gets nudged or flagged into the queue instead of waiting silently. Moves NT and WT.
8. **A live-thread counter**: a new dispatch warns when more than three threads are live. Holds the cap instead of raising it.

We will rerun the session measurement after a few weeks with these in place. The test is simple: median time alone should rise, staleness on return should fall, and peak live threads should stay near three.

## Where this evidence is thin

The strongest re-entry and handoff results come from hospitals and lab tasks, not agent supervision. ParallelPilot is the only study of the exact setting, and it used twenty-minute tasks and sixteen people. Vendor numbers on review tools and stacked pull requests are not independent.

Our own numbers are observational and come from one person on one machine. Longer briefs go with bigger tasks, so the NT gap overstates what a longer prompt alone would buy. The harness upgrades are planned, not measured, and some will not pay off.

## References

1. **METR time horizons**: task-length horizon of frontier agents and its doubling time, 2026. [METR time horizons in 2026](https://agitracker.io/blog/metr-time-horizons-2026/).
2. **Anthropic engineering**: harness patterns for long-running coding agents, 2025. [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).
3. **Geoffrey huntley**: the Ralph loop and test backpressure, 2025. [How to Ralph Wiggum](https://github.com/ghuntley/how-to-ralph-wiggum).
4. **Ask or assume?**: clarifying underspecified tasks before execution, 2026. [Ask or assume?](https://arxiv.org/abs/2603.26233).
5. **SWE-chat**: how often real coding agents ask questions, 2026. [SWE-chat](https://arxiv.org/html/2604.20779v1).
6. **Anthropic engineering**: auto mode, approval rates and sandboxing, 2026. [Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode).
7. **Cummings**: vehicles per operator by automation architecture. [Automation architecture for single operator, multiple UAV command and control](http://www.dodccrp.org/files/IC2J_v1n2_01_Cummings.pdf).
8. **Chen and stratton**: AI coding agents and the code review bottleneck, 2026. [Harvard researchers find AI coding agents shifted the bottleneck to code review](https://complexdiscovery.com/harvard-researchers-find-ai-coding-agents-shifted-the-bottleneck-to-code-review/).
9. **Starmer and colleagues**: I-PASS handoff program and medical errors, 2014. [Changes in medical errors after implementation of a handoff program](https://www.nejm.org/doi/full/10.1056/NEJMsa1405556).
10. **Haynes and colleagues**: WHO surgical safety checklist, 2009. [A surgical safety checklist to reduce morbidity and mortality](https://www.nejm.org/doi/full/10.1056/NEJMsa0810119).
11. **Gonçalves and colleagues**: checklists in code review, randomized experiment, 2022. [Do explicit review strategies improve code review performance?](https://link.springer.com/article/10.1007/s10664-022-10123-8).
12. **Gobet and simon**: expert memory relies on templates of familiar structure, 1998. [Expert chess memory: revisiting the chunking hypothesis](http://www.chrest.info/Fribourg_Cours_Expertise/Articles-www/II%20Donnees%20empiriques/Gobet%20&%20Simon-1998-Memory.pdf).
13. **Graphite**: vendor case study on stacked pull requests at Asana. [Asana customer story](https://graphite.com/customer/asana).
14. **Greptile**: vendor benchmark of AI code review catch rates. [AI code review benchmarks](https://www.greptile.com/benchmarks).
15. **Pocus engineering**: reviewing the plan alongside the code. [Rethinking code reviews](https://i0exception.substack.com/p/rethinking-code-reviews).
16. **Cowan**: working memory holds about three to five chunks, 2001. [The magical number 4 in short-term memory](https://philpapers.org/rec/COWTMN).
17. **Trafton and colleagues**: preparing for an interruption speeds resumption, 2003. [Preparing to resume an interrupted task](https://www.interruptions.net/literature/Trafton-IJHCS03.pdf).
18. **Altmann and trafton**: task interruption and resumption lag, 2004. [Task interruption: resumption lag and the role of cues](https://www.interruptions.net/literature/Altmann-CogSci04.pdf).
19. **Parnin and rugaber**: resumption strategies of 86 programmers, 2011. [Resumption strategies for interrupted programming tasks](https://link.springer.com/article/10.1007/s11219-010-9104-9).
20. **Lill and colleagues**: LLM summaries, timelines and notes for developer resumption, 2026. [TaCoS preprint](https://hasel.dev/wp-content/uploads/2026/01/TACOS-pre-print.pdf).
21. **Gilbert**: offloading intentions to external reminders, 2015. [Strategic offloading of delayed intentions into the external environment](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4448673/).
22. **Leroy and Glomb**: a ready-to-resume plan removes the residue penalty, 2018. [Tasks interrupted](https://www.semanticscholar.org/paper/Tasks-Interrupted:-How-Anticipating-Time-Pressure-a-Leroy-Glomb/eeeab9fec8439ae2821ba127ef5d398b4f7f5d4a).
23. **ParallelPilot**: a triage view for developers running parallel agents, 2026. [ParallelPilot](https://arxiv.org/html/2609.33113v1).
24. **Iqbal and bailey**: deferring notifications to breakpoints, 2008. [Effects of intelligent notification management on users and their tasks](https://interruptions.net/literature/Iqbal-CHI08.pdf).
25. **Fitz and colleagues**: batching smartphone notifications, randomized, 2019. [Batching smartphone notifications can improve well-being](https://www.kushlev.com/s/2019-Fitz-Batching.pdf).
26. **Parasuraman and manzey**: complacency and automation bias, 2010. [Complacency and bias in human use of automation](https://www.semanticscholar.org/paper/Complacency-and-Bias-in-Human-Use-of-Automation:-An-Parasuraman-Manzey/b0e5a85803bb959ed2cbd47c51009cc48059c02c).
27. **Independent stress test of auto mode**: classifier misses on ambiguous workloads, 2026. [Stress testing agent auto-approval](https://arxiv.org/html/2604.04978v1).
28. **When sub-agents work in parallel**: cost and failure modes of parallel sub-agents, 2026. [When sub-agents work in parallel](https://arxiv.org/html/2610.10263).
29. **Claim Plane**: declared write scope for concurrent agents, 2026. [Claim Plane](https://arxiv.org/abs/2608.00947).
30. **Cursor**: long-running autonomous coding experiment, 2026. [Self-driving codebases](https://cursor.com/blog/self-driving-codebases).
31. **Anthropic multi-agent research system**: lead and worker agents for research, 2025. [How Anthropic built a multi-agent research system](https://blog.bytebytego.com/p/how-anthropic-built-a-multi-agent).
32. **Olsen and Goodrich**: metrics for one person driving several robots. [Metrics for human driving of multiple robots](http://byu.danrolsenjr.org/paperPDFs/FanoutIEEE.pdf).
33. **Ruff, narayanan and draper**: consent and exception automation with several drones, 2002. [Human interaction with levels of automation and decision-aid fidelity](https://www.semanticscholar.org/paper/Human-Interaction-with-Levels-of-Automation-and-in-Ruff-Narayanan/98be4f42ebf95843365467af8cfad0079ef261da).
34. **Crandall and Cummings**: neglect, interaction and wait times as a team grows, 2007. [Developing performance metrics for the supervisory control of multiple robots](https://faculty.cs.byu.edu/~crandall/papers/CrandallCummingsHRI2007.pdf).
35. **Goodrich and colleagues**: operator detection of stuck robots with and without alerts, 2007. [Managing autonomy in robot teams](https://faculty.cs.byu.edu/~mike/mikeg/papers/GoodrichHRI2007.pdf).
36. **Chien and colleagues**: request queues and scheduling aids for multi-robot operators, 2012. [Scheduling operator attention for multi-robot control](https://www.ri.cmu.edu/pub_files/2012/10/Chien_IROS12_Final_Version.pdf).
37. **Mau and dolan**: scheduling operator attention across robots, 2007. [Scheduling for humans in multirobot supervisory control](https://www.ri.cmu.edu/pub_files/pub4/mau_sandra_2007_2/mau_sandra_2007_2.pdf).
38. **Cummings and mitchell**: schedule prediction displays for drone operators, 2005. [Management of multiple dynamic human supervisory control tasks](https://scholars.duke.edu/display/pub1108379).
39. **NASA and AFRL**: playbook, tools and manual control of several drones, 2018. [NASA TP-2018-219875](https://ntrs.nasa.gov/api/citations/20180003961/downloads/20180003961.pdf).
40. **Parasuraman, cosenzo and de visser**: adaptive automation for supervising several vehicles, 2009. [Adaptive automation for human supervision of multiple uninhabited vehicles](https://www.researchgate.net/publication/247503506_Adaptive_Automation_for_Human_Supervision_of_Multiple_Uninhabited_Vehicles_Effects_on_Change_Detection_Situation_Awareness_and_Mental_Workload).
41. **Nehme and Cummings**: multiserver queueing for supervisory control. [Multiserver queueing for supervisory control of autonomous vehicles](https://ieeexplore.ieee.org/document/6314967/).
42. **Gao, Cummings and bertuccelli**: pooled and split teams supervising 24 robots, 2012. [Teamwork in controlling multiple robots](https://dl.acm.org/doi/10.1145/2157689.2157703).
43. **Frontiers in psychology**: single operator against a team in multi-vehicle control, 2016. [Supervisory control of multiple vehicles, team and solo](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00568/full).
