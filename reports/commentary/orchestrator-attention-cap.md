---
title: "The orchestrator attention cap: how many agents one person can run"
description: "One person can supervise about three parallel agents well, and the evidence for that limit is older than AI."
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
slug: orchestrator-attention-cap
type: writing
form: analysis
topic: ai-agents
fit: 3
abstract: "Running several AI agents at once makes the human the bottleneck, and the human behaves like a single-server queue. Fifty years of supervisory-control, queueing and interruption research put the useful cap near three live threads and the healthy load near 70% busy. We pair that research with our own session logs and turn it into agent settings, operator habits and a do and don't list."
---

![One human server {#fig-one-server}](assets/orchestrator-attention-cap-fig1-one-server.svg 'One human server. Every agent queues for the same reviewer, so the reviewer sets the pace.')

I run a lead agent in one terminal tab and workers in the others. While a worker thinks, I jump to another tab so I don't sit idle. On a median day that means seventeen sessions and six or seven session switches an hour. I stopped wasting time on waiting, and I lost the ability to stay on one problem.

So I went looking for the limit. The question sounds new, but it is old. Robot teleoperators, drone pilots, air traffic controllers, judges and engineering managers have all hit the same wall, and researchers have measured it. This post collects that evidence, adds our own session data, and ends with the changes we are making.

## What is the attention cap?

The attention cap is the number of parallel work threads one person can keep moving without quality or speed falling apart. For most people it sits near three, and often lower.

The model behind it is simple. Agents are cheap and many. You are one reviewer. Every agent eventually needs you to read, judge or steer, so they all queue at the same server. ==Once you see yourself as the server, the goal flips: keep the server healthy, and let the cheap customers wait.==

Four separate limits set the cap, and the lowest one wins. Fan-out compares how long an agent runs alone with how long it needs you. Open loops are the unfinished threads you can hold in your head, about three to five of them. Review rate is how fast you can read output honestly. And energy runs out: experienced practitioners report three to four hours of supervision before they're spent.

## How many agents can one person run?

Human-robot interaction research answered this for robots twenty years ago, with a formula called fan-out. Fan-out is the number of robots one operator can keep at acceptable performance. It depends on two times: how long a robot can be ignored before it drifts (neglect time), and how long the operator needs to service it (interaction time). Cummings later added a third term for waiting and lost awareness [2].

$$ FO = \frac{NT}{IT + WT} + 1 $$ {#eq-fanout}

where:

- $FO$ is fan-out, the number of agents one person can supervise.
- $NT$ is neglect time, how long an agent works alone before it needs you.
- $IT$ is interaction time, how long you spend reviewing and steering it.
- $WT$ is wait time, the queueing and re-orientation cost on top of the review.

The plus one is the agent you are serving right now. Plug in numbers from a normal coding day:

Table: Fan-out for typical agent loops {#tbl-fanout}

| Loop                 | NT     | IT    | WT    | Fan-out |
| :------------------- | :----- | :---- | :---- | :------ |
| Quick back-and-forth | 3 min  | 2 min | 0     | 2.5     |
| Ten-minute task      | 10 min | 3 min | 0     | 4.3     |
| Same, re-orient      | 10 min | 3 min | 1 min | 3.5     |
| Spec'd long task     | 40 min | 5 min | 2 min | 6.7     |

Short interactive loops cap you at two or three agents no matter how disciplined you are. A long, well-specified task is the only way past four.

![Three agents, one human {#fig-timeline}](assets/orchestrator-attention-cap-fig2-timeline.svg 'Three agents, one human. With ten minutes alone, three of review and one to re-orient, three agents keep the human almost fully busy, and the third agent waits longest.')

The formula is a ceiling. When researchers checked fan-out predictions against real operators, people managed four to six robots, and every prediction method missed, mostly because waiting and lost awareness ate into capacity. Drone studies landed in the same range when the operator approved each step. Operators only got to eight to twelve vehicles when the vehicles called them on exceptions alone [3].

That second number is the hopeful part: the cap rises when the automation calls you less often.

## Why does running yourself at full load backfire?

Because a queue's waiting time explodes as its server gets busy. In the textbook single-server queue, the average wait in units of service time is $\rho / (1 - \rho)$, where $\rho$ is the share of time the server is busy.

![Wait explodes past 70% busy {#fig-queue-knee}](assets/orchestrator-attention-cap-fig3-queue-knee.svg 'Wait explodes past 70% busy. At 95% busy, each agent waits about nineteen review-lengths for you.')

At 50% busy an agent waits one review-length for you, and at 90% it waits nine. That's why filling every gap with another thread feels productive while it slows everything down. You're the server, and a server near 100% turns every queue into a backlog.

Navy operators supervising cruise missiles showed the same knee, with performance and awareness falling once they were busy more than about 70% of the time. The threshold is soft, and later work found that too little load hurts as well. Reinertsen made the same argument for product teams: queues grow nonlinearly with utilization, so the thing worth managing is queue size, whatever people's calendars look like [4].

## What does a switch cost the human?

More than the switch itself. In the lab, switching between simple tasks costs a fraction of a second, and that cost never drops to zero even with time to prepare. The expensive part comes after, when you try to get back into the work you left [9].

A two-week field study shows where that time goes. People who followed an email or chat alert spent about ten minutes on the diversion, then another ten to fifteen before they were focused on the original task again. Part of the drag is that the old task doesn't let go. Leroy called it attention residue, the share of attention an unfinished task keeps while you work on the next one. Memory research sees the same thing from the goal's side: a suspended goal decays and needs a cue to come back, which is why resuming at a natural break is cheaper than resuming mid-step [15].

Fast switching can also look efficient while it drains you. People interrupted every two minutes finished an email task faster, with no more errors, and reported more stress and effort [13].

Two popular numbers deserve retirement. "Twenty-three minutes to refocus" comes from a 2006 interview, and it measured the time until people returned to the interrupted task, with other work in between [14]. "Multitasking costs 40% of productivity" is a press extrapolation from millisecond lab data, never a measurement.

The useful finding is the cheap fix. In Leroy and Glomb's studies, writing a short plan for where you stopped and what comes next removed the residue penalty, and a specific plan for an unfinished goal also kept it from intruding on unrelated work [11].

## Is this only an agent problem?

No. Agents make an old management problem visible, because they produce work faster than any team member and need review sooner.

The cleanest evidence comes from Italian courts. Judges get cases by lottery, so Coviello, Ichino and Persico could compare judges with the same workload who juggled different numbers of cases at once. ==The judges who worked on more cases in parallel took longer to finish each one, and their decisions were no better on appeal.== [18]

Software shows the same shape. Developers spread across many projects were more productive when they touched few projects per day, and kanban teams that held work in progress lower had shorter lead times. Little's Law turns this into arithmetic: average lead time equals work in progress divided by throughput, so at the same throughput every extra open item makes each item take longer [7].

Weinberg's well-known table claims that two projects cost 20% of your time to switching and five cost 75%. It's a consultant's estimate and was never measured, but its shape matches the judges and the queue curve. Paul Graham names the same cost from the other side with his split between the maker's schedule and the manager's schedule, where one meeting in the middle of an afternoon breaks it into pieces too small for hard work [20].

Andy Grove supplies the delegation half. How closely you supervise depends on the delegate's task-relevant maturity: a newcomer to the task gets step-by-step direction, and an expert gets an objective and periodic checks. Monitoring falls as maturity rises, but it never reaches zero, because delegation without follow-through is abdication [22].

The analogy breaks in two places. Agents don't tire, so the whole cost sits on the human side of the queue. And agents don't report trouble the way a mature colleague does, so a confident wrong answer looks the same as a right one.

## What do our own sessions show?

They show me running at well over twice my own fan-out. I parsed thirty days of Claude Code transcripts on my main machine, 3 October to 2 November 2026: 348 sessions with at least one prompt I typed, 3,485 prompts, 295 active hours.

Table: Thirty days of my Claude Code sessions {#tbl-mine}

| Measure                    | Median  | p90      |
| :------------------------- | :------ | :------- |
| Sessions touched per day   | 17      | 26       |
| Peak live sessions per day | 5       | 8        |
| Agent works alone (NT)     | 2.0 min | 32 min   |
| Agent waits for me (WT)    | 2.5 min | 15.8 min |
| Session switches per hour  | 6.6     | 10.1     |

The median turn is short. The agent works two minutes, then waits two and a half for me, and with those in the formula my fan-out is about 1.8 before I spend a single second reading.

Yet my daily peak is five live sessions, and on the worst day it hit fourteen. Almost two-thirds of my active time runs at two or more live sessions, which is already above that fan-out, and 61% of my prompts go to a different session from the one before.

![Thirty days of my sessions {#fig-my-sessions}](assets/orchestrator-attention-cap-fig4-my-sessions.svg 'Thirty days of my sessions. Almost two-thirds of my active time runs above the fan-out my own loops allow.')

The surprise was the wait. Agents didn't wait longer for me when more sessions were live: the median was 2.6 minutes with one session and 2.7 with three or more. ==I kept response time flat by switching faster, so the cost landed on me and not on the agents.== The time between prompts also held at about two minutes whether I switched or stayed, so I was answering every session at the same shallow tempo. It's the interrupted-email result again, where people under constant interruption worked faster and paid for it in stress [13].

The numbers carry caveats. About a third of the sessions have two prompts or fewer, many of them dispatched workers, so concurrency is overstated. The data covers one machine and leaves out my laptop, so real switching is probably higher. I didn't measure interaction time either, which puts the true fan-out somewhere below 1.8.

## What do other practitioners report?

The people who write most about parallel agents land in the same low range, and most of them describe the limit as review and focus rather than tooling.

Table: Parallel agent counts practitioners report {#tbl-practitioners}

| Who                 | Count  | Conditions               |
| :------------------ | :----- | :----------------------- |
| Hashimoto, Beck     | 1      | One deep task, one loop  |
| ParallelPilot study | 2 to 4 | Most common: 3           |
| Osmani, Willison    | 3 to 4 | Crisp briefs, time-boxed |
| Anthropic team tips | 3 to 5 | Separate worktrees       |

Simon Willison draws the line at review. He can land only one significant change at a time, so his other parallel slots go to research, explanation and chores. Addy Osmani puts the ceiling at three or four threads for the same reason, and calls review throughput the bottleneck [28].

Others hit the limit as focus. Mitchell Hashimoto turns off agent notifications because switching is expensive, and runs one background agent at a time. Kent Beck said two agents on one codebase made his head explode, because he was holding state the system should have held. The Hacker News thread on Willison's post reads the same way, with commenters running two, sometimes five, and several saying they can't focus while an agent runs [29].

The studies agree on the human cost. In ParallelPilot's formative study every participant reported a monitoring burden, and a status and triage view raised their throughput without making them trust the output more. METR's randomized trial is the sharpest result: experienced developers were 19% slower with AI while they believed they were 20% faster. That gap matters here, because how busy you feel turns out to be a poor gauge of throughput [25].

Practitioners split on notifications. Some rely on them, and ParallelPilot's gain came from helping people notice finished agents. Others turn them off. Our reading: pull status at moments you choose, and allow push only for "blocked, needs input".

## How should agents be set up?

Set agents up to need you less often and to cost less when they do. Both raise fan-out more than any personal discipline.

1. **Raise neglect time**: give each agent a brief with an acceptance test and a stop condition, so it can run longer before it needs a decision. My two-minute median turn is the single biggest reason my fan-out is under two. A forty-minute task with a test beats twenty two-minute check-ins.
2. **Shrink interaction time**: every agent ends with a result card that says what it did, what it needs from you, the next step and how to check it. Reading a card takes a minute; reconstructing a transcript takes ten.
3. **Write the resume plan for the human**: the result card doubles as the ready-to-resume note from the research. You stop holding that thread in your head.
4. **Batch the review queue**: use one status view, such as Claude Code's agent view, and check it at boundaries you choose. Silence per-agent completion alerts.
5. **Tier autonomy by task maturity**: a familiar, well-tested task gets an objective and a check; a new or risky area gets step-level review, as Grove prescribes.
6. **Verify with checks you did not write**: tests, a fresh-context verifier, and spot audits of output that looks obviously fine. Automation bias appears in experts and does not fade with practice.
7. **Run long work unattended**: send research, sweeps and long builds out in the evening, when your queue is empty anyway.

## What habits should the orchestrator keep?

Treat your own attention as the scarce resource and plan the day around it.

1. **Keep one foreground task**: hold one deep thread in your head. Everything else runs as background work you do not need to track.
2. **Cap live threads at three**: a live thread is one whose state lives in your head. A thread parked behind a written card does not count.
3. **Aim for 70% busy**: if agents never wait for you, you are over the cap. If you sit idle most of the hour, give the background longer tasks.
4. **Fill waits with low-residue work**: write the next brief, review a finished batch, think, or walk away. Opening another live thread to stay busy is the move that fragments you.
5. **Budget the day**: plan on three to four hours of high-quality supervision and put long unattended runs around them.
6. **Measure your own fan-out**: time a few real cycles per task type, compute fan-out, and run below it.

## Do and don't

Table: Do and don't for the human orchestrator {#tbl-dodont}

| Do                             | Don't                               |
| :----------------------------- | :---------------------------------- |
| One deep task in front         | Rotate through every tab            |
| Agents end with a result card  | Reread transcripts to recover state |
| Check status at chosen times   | React to every completion ping      |
| Let cheap agents wait for you  | Keep yourself 100% busy             |
| Longer briefs with tests       | Many short check-in loops           |
| Verify with independent checks | Approve "obviously fine" output     |
| Long runs overnight            | Start a new thread while waiting    |
| Measure your real throughput   | Trust how busy you feel             |

## Where this evidence is thin

No study measures the cap for coding agents directly. The fan-out formula, the queue curve and the court data come from neighbouring fields, and we assume the human side transfers. The number three rests on working-memory research and practitioner reports, with no controlled agent study behind it [16].

Several famous findings are weaker than their reputation. Weinberg's table is an estimate, and the 70% knee is soft. Our own session numbers come from one person on one machine, and unattended sessions inflate concurrency. Ego depletion, the usual story behind "decision fatigue", failed a 23-lab replication, so we don't lean on it at all [37].

The cost of this approach is real too. Running fewer threads means some agents sit idle, and that feels wasteful even when the numbers say it is cheaper. We have not yet run a controlled before-and-after on ourselves.

## Evidence table

The body cites the sources it argues from. This table holds the supporting claims and the numbers that sit behind them.

Table: Supporting claims and how strong they are {#tbl-evidence}

| Claim                               | Source | Strength  |
| :---------------------------------- | :----- | :-------- |
| Fan-out defined for robots          | [1]    | strong    |
| Wait term added to fan-out          | [3]    | strong    |
| Queues grow nonlinearly with load   | [8]    | moderate  |
| Refocus takes 10 to 15 min          | [12]   | strong    |
| A specific plan stops intrusions    | [17]   | moderate  |
| Lower WIP, shorter lead time        | [36]   | moderate  |
| One meeting splits an afternoon     | [21]   | essay     |
| Review throughput is the bottleneck | [31]   | opinion   |
| Wait cuts capacity up to 67%        | [5]    | moderate  |
| Lost awareness alone cut 36%        | [5]    | moderate  |
| Four to five drones, step approval  | [6]    | moderate  |
| Busy past 70% hurts performance     | [4]    | weak      |
| Attention residue after a switch    | [10]   | moderate  |
| Resuming at a break costs less      | [33]   | moderate  |
| Few projects a day, more output     | [19]   | moderate  |
| Interruption every two minutes      | [23]   | moderate  |
| Weinberg switching percentages      | [20]   | estimate  |
| Working memory holds three to five  | [16]   | strong    |
| Ceiling of three to four threads    | [30]   | weak      |
| One background agent at a time      | [29]   | weak      |
| Two agents on one codebase hurt     | [32]   | weak      |
| Commenters run two to five          | [34]   | weak      |
| All fourteen report monitoring load | [26]   | moderate  |
| Triage view lifts throughput 63%    | [26]   | moderate  |
| AI cuts time 22%, adds fatigue      | [27]   | moderate  |
| Developers 19% slower with AI       | [25]   | strong    |
| One status view for sessions        | [35]   | strong    |
| Automation bias persists in experts | [24]   | strong    |
| Planning removes residue penalty    | [11]   | moderate  |
| Ego depletion failed replication    | [37]   | contested |

## References

1. **Olsen and wood**: fan-out definition for multi-robot control, 2004. [Fan-out: measuring human control of multiple robots](https://www.researchgate.net/publication/221519367_Fan-out_Measuring_human_control_of_multiple_robots).
2. **Crandall, Goodrich, Olsen and Nielsen**: neglect tolerance and the NT/IT fan-out form, 2005. [Validating human-robot interaction schemes in multitasking environments](https://students.cs.byu.edu/~crandall/papers/CGON_SMCa_05.pdf).
3. **Crandall and Cummings**: fan-out with wait time and a user study of four to six robots, 2007. [Identifying predictive metrics for supervisory control of multiple robots](https://faculty.cs.byu.edu/~crandall/papers/CrandallCummingsTRO2007_Final.pdf).
4. **Cummings and Guerlain**: operator utilization and the 70% threshold, 2007. [Developing operator capacity estimates for supervisory control of autonomous vehicles](https://journals.sagepub.com/doi/10.1518/001872007779598109).
5. **Cummings and Mitchell**: wait times cut predicted capacity up to 67%, 2008. [Predicting controller capacity in supervisory control of multiple UAVs](https://www.researchgate.net/publication/3412769_Predicting_Controller_Capacity_in_Supervisory_Control_of_Multiple_UAVs).
6. **Cummings**: vehicles per operator by automation architecture. [Automation architecture for single operator, multiple UAV command and control](http://www.dodccrp.org/files/IC2J_v1n2_01_Cummings.pdf).
7. **Little**: lead time equals work in progress over throughput, 1961. [A proof for the queuing formula L = λW](https://pubsonline.informs.org/doi/10.1287/opre.9.3.383).
8. **Reinertsen**: queues, utilization and cost of delay in product development, 2009. [Principles of product development flow, summary](https://ttoss.dev/docs/product/product-development/principles).
9. **Monsell**: task-switching review and the residual switch cost, 2003. [Task switching](http://epa.psy.ntu.edu.tw/perception/pdf/Monsell_2003.pdf).
10. **Leroy**: attention residue between work tasks, 2009. [Why is it so hard to do my work?](https://www.researchgate.net/publication/46489122_Why_is_it_so_Hard_to_do_My_Work_The_Challenge_of_Attention_Residue_when_Switching_Between_Work_Tasks).
11. **Leroy and Glomb**: a ready-to-resume plan removes the residue penalty, 2018. [Tasks interrupted](https://www.semanticscholar.org/paper/Tasks-Interrupted:-How-Anticipating-Time-Pressure-a-Leroy-Glomb/eeeab9fec8439ae2821ba127ef5d398b4f7f5d4a).
12. **Iqbal and Horvitz**: field study of alert-driven switches and resumption, 2007. [Disruption and recovery of computing tasks](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/11/CHI_2007_Iqbal_Horvitz-1.pdf).
13. **Mark, Gudith and Klocke**: interrupted work is faster and more stressful, 2008. [The cost of interrupted work](https://ics.uci.edu/~gmark/chi08-mark.pdf).
14. **Gallup interview with Gloria Mark**: origin of the 23-minute figure, 2006. [Too many interruptions at work?](https://news.gallup.com/businessjournal/23146/Too-Many-Interruptions-Work.aspx).
15. **Altmann and Trafton**: the memory-for-goals model, 2002. [Memory for goals](https://philpapers.org/rec/ALTMFG).
16. **Cowan**: working memory holds about three to five chunks, 2001. [The magical number 4 in short-term memory](https://philpapers.org/rec/COWTMN).
17. **Masicampo and Baumeister**: a specific plan stops an unfinished goal from intruding, 2011. [Consider it done!](https://users.wfu.edu/masicaej/MasicampoBaumeister2011JPSP.pdf).
18. **Coviello, Ichino and Persico**: Italian judges who juggle more cases finish slower, 2014. [Time allocation and task juggling](http://tintin.hec.ca/pages/decio.coviello/research_files/continuous.pdf).
19. **Vasilescu and colleagues**: developer focus across many projects, 2016. [The sky is not the limit](https://cmustrudel.github.io/papers/icse16focus.pdf).
20. **Weinberg**: estimated time lost to switching between projects, 1992. [Wastes caused by context switching](https://chrisgagne.com/4619/wastes-caused-by-context-switching/).
21. **Paul Graham**: the maker's and manager's schedules, 2009. [Maker's schedule, manager's schedule](https://paulgraham.com/makersschedule.html).
22. **Andy Grove**: task-relevant maturity and monitoring delegated work, 1983. [High Output Management notes](https://robdix.com/high-output-management/).
23. **Microsoft work trend index**: interruption frequency from workplace telemetry, 2025. [2025: the year the frontier firm is born](https://www.microsoft.com/en-us/worklab/work-trend-index/2025-the-year-the-frontier-firm-is-born).
24. **Parasuraman and Manzey**: complacency and automation bias, 2010. [Complacency and bias in human use of automation](https://www.semanticscholar.org/paper/Complacency-and-Bias-in-Human-Use-of-Automation:-An-Parasuraman-Manzey/b0e5a85803bb959ed2cbd47c51009cc48059c02c).
25. **METR**: randomized trial of experienced developers using AI, 2025. [Measuring the impact of early-2025 AI on experienced open-source developer productivity](https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/).
26. **ParallelPilot**: formative and tool study of developers running parallel agents, 2026. [ParallelPilot](https://arxiv.org/html/2609.33113v1).
27. **When help hurts**: AI assistance, verification load and fatigue, 2026. [When help hurts](https://doi.org/10.1145/3772318.3791176).
28. **Simon Willison**: practitioner account of parallel coding agents, 2025. [Embracing the parallel coding agent lifestyle](https://simonwillison.net/2025/Oct/5/parallel-coding-agents/).
29. **Mitchell Hashimoto**: practitioner account of agent adoption, 2026. [My AI adoption journey](https://mitchellh.com/writing/my-ai-adoption-journey).
30. **Addy Osmani**: the cognitive limit on parallel agents, 2026. [Cognitive parallel agents](https://addyosmani.com/blog/cognitive-parallel-agents/).
31. **Addy Osmani**: review throughput as the orchestration bottleneck, 2026. [The orchestration tax](https://addyosmani.com/blog/orchestration-tax/).
32. **Kent Beck**: lessons from running coding agents, 2025. [Genie lessons nobody wants](https://newsletter.kentbeck.com/p/genie-lessons-nobody-wants-agents).
33. **Iqbal and Bailey**: interruption cost depends on the task boundary, 2006. [Leveraging characteristics of task structure to predict the cost of interruption](https://interruptions.net/literature/Iqbal-CHI06-p741-iqbal.pdf).
34. **Hacker News**: practitioner discussion of parallel coding agents, 2025. [Embracing the parallel coding agent lifestyle, discussion](https://news.ycombinator.com/item?id=45489884).
35. **Claude Code agent view**: one status view for parallel sessions, 2026. [Agent view](https://code.claude.com/docs/en/agent-view.md).
36. **Empirical study of WIP in kanban teams**: lower WIP and shorter lead time, 2018. [An empirical study of WIP in kanban teams](https://dl.acm.org/doi/10.1145/3239235.3239238).
37. **Hagger and colleagues**: 23-lab replication of ego depletion, 2016. [A multilab preregistered replication of the ego-depletion effect](https://journals.sagepub.com/doi/10.1177/1745691616652873).
