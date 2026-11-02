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

In the [first post](/orchestrator-attention-cap) I measured myself running about five agent sessions at peak when my own loops allowed fewer than two. The obvious next question is how to raise that limit instead of just obeying it. I had two guesses going in: make agents work longer before they need me, and keep a note so I can catch up faster when I come back. Both held up in the data, and each needed a second half I hadn't planned.

This post sorts the tricks by which part of the limit they move and how good the evidence behind them is. I checked two of them against our own logs, and the last sections turn the winners into harness changes we're building.

## Which knob moves the cap?

The cap comes from one formula, and every trick works by moving one of its three terms.

$$ FO = \frac{NT}{IT + WT} + 1 $$ {#eq-fanout}

where:

- $FO$ is fan-out, how many agents one person can keep moving.
- $NT$ is neglect time, how long an agent works before it needs you.
- $IT$ is interaction time, how long a review or decision takes.
- $WT$ is the extra time you spend getting back into a thread and waiting your turn.

Raising NT means agents need you less often. IT and WT share the denominator, so a cheaper visit or a quicker return lifts the cap as well. One more lever sits outside the formula: holding fewer open loops in your head protects the working memory every term draws on [1].

The terms aren't equal. My own median loop is two minutes alone and two and a half waiting, so a small NT gain moves my cap more than any polish on re-entry. Somebody whose agents already run for an hour gets more from cutting review cost. ==Find your smallest term first, because the same trick can double one person's cap and barely move another's.==

## How do you make agents run longer alone?

Give them a bigger, checkable job. Of all the levers, raising NT has the clearest evidence, and our own logs back it.

Models can already work much longer than most of us let them, and in most coding sessions the brief runs out before the model does. METR's measure of how long a task frontier agents can finish reached around twelve hours at even odds in early 2026, though if you want four successes in five the horizon shrinks to about three hours [2].

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

Length alone doesn't help, though. A long run is only worth having if you can trust where it ends, and that starts with a done-check the agent can't fake. Anthropic's long-running harness gives the agent a JSON feature list where the only thing it may touch is a "passes" field, backed by end-to-end tests, and that stopped agents from declaring victory early [3].

The brief matters as much as the check, and the cheapest way to fix a vague one is to let the agent ask before it starts. Left alone, agents rarely ask: in our logs they did it in 3.8% of turns. Yet on underspecified tasks, an agent that asked first scored almost as well as one handed the full spec, so one round of questions up front beats being pulled back mid-run [4].

Permission prompts are the other thing that stops a long run for no good reason. In our logs, pure go-ahead replies such as "proceed" and "approve" were only 5% of my prompts, so the gain there is real but smaller than I expected. Anthropic saw a bigger effect: people approved about 93% of permission prompts, which it reads as fatigue, and sandboxing cut those prompts by 84% [5].

Supervisory-control research found the same pattern with robots and drones. Operators handled four to five drones when they approved every step and eight to twelve when the drones only called on exceptions [6].

The same field adds a caution, so raise NT on reversible work and keep a consent gate on anything you can't undo. In a small drone study, operators did better approving each step than handling exceptions only, and other work ties exception mode to complacency and lost awareness [7].

## How do you make each review cheaper?

Make every result arrive in the same shape, small enough to judge, with the evidence attached. Review is where AI coding speed currently stalls.

A working paper on firms adopting AI found that code added rose about 30% while resolved issues didn't move, and the time from pull request to merge went up 49%. Teams produce more and land the same amount, because review absorbs the difference. Cutting IT is how you win that 30% back [8].

The strongest evidence for a fixed shape comes from hospitals. When children's hospitals adopted I-PASS, a structured handoff format, medical errors fell 23% [9].

==A result card only speeds review if every agent writes it the same way, every time.== Experts read a familiar structure as one unit, and that advantage disappears once the structure changes [10].

The other review tricks rest on thinner evidence. Stacked pull requests have only vendor data behind them, and reviewing the plan instead of the code is untested practitioner advice. AI first-pass review is the one I'd be most careful with: vendor benchmarks put its catch rate anywhere from 6% to 82% depending on the tool, so I treat it as an advisory pass and never as the merge gate [11].

## How do you get back into a thread faster?

Write down your next step before you leave, and let the agent write down what it did. This is the trick behind my "keep a note" guess, and it needs both halves.

Our logs show why re-entry matters. When I switched sessions, I landed on a thread that had been idle 5.4 minutes at the median, against 1.6 minutes when I stayed. Nearly a quarter of switches landed on a thread idle more than thirty minutes. Every one of those is a cold start.

![Switching lands on a cold thread {#fig-staleness}](assets/raising-orchestrator-cap-fig3-staleness.svg 'Switching lands on a cold thread. How long a thread had been idle when I came back to it, after a switch and when I stayed.')

The research is consistent about what helps, and the work starts before you leave. People warned ahead of an interruption spent those seconds planning what they'd do on return, and they resumed faster [12].

After you're back, it helps to have the context in view. Programmers with a task list or problem view open resumed within a minute 35% of the time, against 10% overall [13].

The closest test to our setting is a 2026 lab study of developers returning to their own work. With an LLM summary of what they'd done, they resumed in 45 seconds, against 69 with only a note they wrote themselves. They also said the summary missed the one thing their own notes had: what they meant to do next [14].

So the right re-entry card has two authors. The agent writes what it did, what changed and what it needs. You write one line: what you'll check or decide next, before you leave the thread. The Leroy and Glomb ready-to-resume plan from the first post is the same move [15].

## When should agents interrupt you?

Only when they need a decision, and through one queue you check at moments you choose. Batching alerts calms you down; a triage view is what raises throughput.

ParallelPilot is the closest direct test. Developers supervising parallel agents got a plan interface, a run log and a triage dashboard that sorted sessions into those needing input and those ready for review. Throughput rose 63%, and the number of agents they could supervise comfortably went from under three to four. Even with the tool, peak concurrency stayed close to three, which fits the cap from the first post, and the most common miss without it was a clarification request left waiting [16].

Timing helps less than it seems. Deferring alerts to natural breakpoints cut frustration but didn't shorten the time to resume [17]. Batching phone notifications three times a day improved attention and mood, where hourly batching didn't [18]. I read both as a wellbeing gain more than a capacity gain.

Robot research says wait is the term to attack. When Crandall and Cummings grew a robot team, review time per robot stayed flat while time spent waiting for the operator rose from 9 seconds to 68, and performance stopped improving at six robots [19].

That line of work also shows how to cut the wait. Operators noticed a stuck robot significantly later when nothing alerted them, and an alarm removed the delay, which is why a push beats polling [20].

The queue itself should be visible. Showing every pending request beat showing one at a time, and serving the shortest job first matched the best result [21].

One aid backfired. Operators given a forecast of their future attention needs did worse than those given none, because they chased a global optimum, so I'd skip the prediction dashboard [22].

## Can automation take decisions off you?

Yes, for low-risk decisions with a clear rule, and only with a check you didn't write. Automation shifts the cap furthest when it changes which decisions reach you at all.

The drone research calls this delegation by play. The operator picks a named play, such as "search this area", and the automation fills in the steps. In agent terms, a play is a packaged skill with a fixed brief, and our logs already show skill turns running five times longer alone. In a NASA and Air Force study, the playbook interface beat both manual control and a set of separate tools, but performance still fell at five drones, so plays help at the margin [23].

Hand off decisions by risk tier and keep the risky ones yours. The automation bias warning from the first post still applies, and the classifiers that approve actions for you miss things too. Anthropic's own auto-approval classifier misses about 17% of overeager actions [5]. An independent stress test reported a much higher miss rate on ambiguous work [24].

## Does a lead agent raise your cap?

Not on current evidence. A supervising agent moves your queue one level up and adds cost and merge risk on the way.

A large study of parallel sub-agents found they helped on some long tasks and hurt badly on others, cutting Claude Code's SWE-bench pass rate by 24 points on one, while using up to 3.3 times the tokens [25]. A third of the failures came from shared state and merge conflicts. Declaring each agent's write scope up front mostly fixes that problem [26].

The bigger setups point both ways. Cursor's long-running experiment ended up removing its planner and judge layers in favor of something simpler [27]. Anthropic's multi-agent research system went the other way, beating a single agent by 90% on breadth-first research rather than code, at about fifteen times the tokens [28].

A second human is better supported than a supervising agent. Queueing math predicts that two operators sharing one queue can each handle up to 50% more vehicles than they would with two separate queues [29].

The human studies are mixed, and they suggest pooling only helps when ownership of each item is explicit. In one, a single operator with good tools stabilized a mission in 3.5 minutes against 13 for a team of three, and the team filed duplicate reports three times as often [30].

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

## How do you set this up yourself?

Most of it is already in your tools. Claude Code ships the loop, the hooks and the status line; your terminal or editor supplies the place where waiting work shows up. What's missing is the wiring between them, and that is an afternoon of config.

The table maps each lever to what your tools already have, what you set up, and how we did it. Rows marked planned are the ones we are wiring now.

Table: Levers, built-in features and what to set up {#tbl-setup}

| Lever           | Built in                  | You set up                       | Our setup                         |
| :-------------- | :------------------------ | :------------------------------- | :-------------------------------- |
| Longer runs     | /goal loop, skills        | Brief with a test to stop on     | Briefs carry a Done line          |
| Fewer stops     | Permission modes, deny    | Allow routine, deny irreversible | Prompts off, deny rules, guards   |
| One queue       | Notification hook         | Send "needs input" to one place  | Hook marks the Orca board (tested)|
| Quiet when done | Notification settings     | Alert on input, not on done      | Sounds on input only (planned)    |
| Re-entry        | SessionStart hook         | Next-step line before a switch   | /park writes it (planned)         |
| Cheaper review  | Stop and SubagentStop     | Fixed result card, checked       | Card lint on workers (planned)    |
| Thread cap      | Status line, agent view   | Show live threads, warn above 3  | Count in status line (planned)    |

Start with the first three rows. They need no new code, and our logs say longer runs and a single queue carry most of the gain.

The queue row is two hooks. When Claude Code needs input, the first hook marks the workspace on Orca's board with the ask as a comment; when you reply, the second clears it. We ran both hook commands exactly as written here against our own board, and wiring them into every session ships with our next setup batch. If you use tmux or a plain terminal, swap the board command for a desktop notification or a line appended to one file.

```json {file="~/.claude/settings.json"}
{
  "hooks": {
    "Notification": [
      { "hooks": [ { "type": "command",
        "command": "msg=$(jq -r '.message // \"needs input\"'); orca worktree set --worktree current --workspace-status in-review --unread --comment \"$msg\" >/dev/null" } ] }
    ],
    "UserPromptSubmit": [
      { "hooks": [ { "type": "command",
        "command": "orca worktree set --worktree current --workspace-status in-progress --read >/dev/null" } ] }
    ]
  }
}
```

Then check the board at moments you choose, with one command across every worktree:

```bash
orca worktree ps --agent-wait
```

## How are we upgrading our harness?

We are turning the top tricks into defaults, so they happen without anyone remembering them. Most of the parts already exist in our setup; the gaps are the glue between them.

![The harness loop after the upgrades {#fig-harness}](assets/raising-orchestrator-cap-fig4-harness.svg 'The harness loop after the upgrades. Work reaches the human only through a verified result card in one queue, and leaves with a written next step.')

1. **A verifier gate before a worker reports back**: a worker's final message is held until a fresh-context acceptance check passes, so the human only sees verified results. Moves NT and IT.
2. **A result card as a schema**: the card becomes a fixed structure (result, changes, proof, not done, decisions, needs from you), checked by a linter, and a worker cannot mark itself done without a valid card. Moves IT.
3. **One "needs me" queue**: when an agent needs input, a hook marks its workspace on the board our terminal app already has, with the ask as a comment, and finished work goes there silently. Today agent state lives in tab titles and sounds. Moves WT.
4. **A next-step line on park**: parking a thread prompts for one line on what to check next, and the re-entry view shows that line above the agent's summary. Moves WT.
5. **Brief templates with a done-check**: dispatch refuses a worker brief that has no test or acceptance line. Moves NT.
6. **Hard stops only where it counts**: we already skip routine permission prompts, so the work runs the other way. Deny rules and guard hooks keep a consent gate on the few actions we cannot undo. Protects NT without the complacency risk.
7. **A stall watchdog**: an idle or looping worker gets nudged or flagged into the queue instead of waiting silently. Moves NT and WT.
8. **A live-thread counter**: a new dispatch warns when more than three threads are live. Holds the cap instead of raising it.

We'll rerun the session measurement after a few weeks with these in place. The test is simple: median time alone should rise, staleness on return should fall, and peak live threads should stay near three.

## Where this evidence is thin

The strongest re-entry and handoff results come from hospitals and lab tasks, not agent supervision. ParallelPilot is the only study of the exact setting, and it used twenty-minute tasks and sixteen people. Vendor numbers on review tools and stacked pull requests aren't independent.

Our own numbers are observational and come from one person on one machine. Longer briefs go with bigger tasks, so the NT gap overstates what a longer prompt alone would buy. The harness upgrades are planned, not measured, and some won't pay off.

## References

1. **Working memory capacity**: Cowan, working memory holds about three to five chunks, 2001. [The magical number 4 in short-term memory](https://philpapers.org/rec/COWTMN).
2. **Agent time horizons**: METR data, task-length horizon of frontier agents and its doubling time, 2026. [METR time horizons in 2026](https://agitracker.io/blog/metr-time-horizons-2026/).
3. **Long-running agent harness**: Anthropic engineering, harness patterns for long-running coding agents, 2025. [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents).
4. **Clarifying questions up front**: arXiv preprint, clarifying underspecified tasks before execution, 2026. [Ask or Assume?](https://arxiv.org/abs/2603.26233).
5. **Auto-approval and sandboxing**: Anthropic engineering, auto mode, approval rates and sandboxing, 2026. [Claude Code auto mode](https://www.anthropic.com/engineering/claude-code-auto-mode).
6. **Automation architecture**: Cummings, vehicles per operator by automation architecture. [Automation architecture for single operator, multiple UAV command and control](http://www.dodccrp.org/files/IC2J_v1n2_01_Cummings.pdf).
7. **Consent and exception automation**: Ruff, Narayanan and Draper, consent and exception automation with several drones, 2002. [Human interaction with levels of automation and decision-aid fidelity](https://www.semanticscholar.org/paper/Human-Interaction-with-Levels-of-Automation-and-in-Ruff-Narayanan/98be4f42ebf95843365467af8cfad0079ef261da).
8. **Code review bottleneck**: Chen and Stratton, AI coding agents and the code review bottleneck, 2026. [Harvard researchers find AI coding agents shifted the bottleneck to code review](https://complexdiscovery.com/harvard-researchers-find-ai-coding-agents-shifted-the-bottleneck-to-code-review/).
9. **Structured handoffs**: Starmer and colleagues, the I-PASS handoff program and medical errors, 2014. [Changes in medical errors after implementation of a handoff program](https://www.nejm.org/doi/full/10.1056/NEJMsa1405556).
10. **Expert chunking**: Gobet and Simon, expert memory relies on templates of familiar structure, 1998. [Expert chess memory: revisiting the chunking hypothesis](http://www.chrest.info/Fribourg_Cours_Expertise/Articles-www/II%20Donnees%20empiriques/Gobet%20&%20Simon-1998-Memory.pdf).
11. **AI code review benchmarks**: Greptile, vendor benchmark of AI code review catch rates. [AI code review benchmarks](https://www.greptile.com/benchmarks).
12. **Preparing for an interruption**: Trafton and colleagues, preparing for an interruption speeds resumption, 2003. [Preparing to resume an interrupted task](https://www.interruptions.net/literature/Trafton-IJHCS03.pdf).
13. **Programmer resumption strategies**: Parnin and Rugaber, resumption strategies of 86 programmers, 2011. [Resumption strategies for interrupted programming tasks](https://link.springer.com/article/10.1007/s11219-010-9104-9).
14. **LLM summaries for resumption**: Lill and colleagues, LLM summaries, timelines and notes for developer resumption, 2026. [TaCoS preprint](https://hasel.dev/wp-content/uploads/2026/01/TACOS-pre-print.pdf).
15. **Ready-to-resume plan**: Leroy and Glomb, a ready-to-resume plan removes the residue penalty, 2018. [Tasks interrupted](https://www.semanticscholar.org/paper/Tasks-Interrupted:-How-Anticipating-Time-Pressure-a-Leroy-Glomb/eeeab9fec8439ae2821ba127ef5d398b4f7f5d4a).
16. **Triage for parallel agents**: ParallelPilot study, a triage view for developers running parallel agents, 2026. [ParallelPilot](https://arxiv.org/html/2609.33113v1).
17. **Notifications at breakpoints**: Iqbal and Bailey, deferring notifications to breakpoints, 2008. [Effects of intelligent notification management on users and their tasks](https://interruptions.net/literature/Iqbal-CHI08.pdf).
18. **Batched notifications**: Fitz and colleagues, randomized trial of batching smartphone notifications, 2019. [Batching smartphone notifications can improve well-being](https://www.kushlev.com/s/2019-Fitz-Batching.pdf).
19. **Wait time as teams grow**: Crandall and Cummings, neglect, interaction and wait times as a team grows, 2007. [Developing performance metrics for the supervisory control of multiple robots](https://faculty.cs.byu.edu/~crandall/papers/CrandallCummingsHRI2007.pdf).
20. **Alerts for stuck robots**: Goodrich and colleagues, operator detection of stuck robots with and without alerts, 2007. [Managing autonomy in robot teams](https://faculty.cs.byu.edu/~mike/mikeg/papers/GoodrichHRI2007.pdf).
21. **Operator request queues**: Chien and colleagues, request queues and scheduling aids for multi-robot operators, 2012. [Scheduling operator attention for multi-robot control](https://www.ri.cmu.edu/pub_files/2012/10/Chien_IROS12_Final_Version.pdf).
22. **Schedule prediction displays**: Cummings and Mitchell, schedule prediction displays for drone operators, 2005. [Management of multiple dynamic human supervisory control tasks](https://scholars.duke.edu/display/pub1108379).
23. **Delegation by play**: NASA and AFRL, playbook, tools and manual control of several drones, 2018. [NASA TP-2018-219875](https://ntrs.nasa.gov/api/citations/20180003961/downloads/20180003961.pdf).
24. **Auto-approval stress test**: Independent arXiv preprint, classifier misses on ambiguous workloads, 2026. [Stress testing agent auto-approval](https://arxiv.org/html/2604.04978v1).
25. **Parallel sub-agents**: arXiv preprint, cost and failure modes of parallel sub-agents, 2026. [When sub-agents work in parallel](https://arxiv.org/html/2610.10263).
26. **Declared write scope**: Claim Plane preprint, declared write scope for concurrent agents, 2026. [Claim Plane](https://arxiv.org/abs/2608.00947).
27. **Long-running autonomous coding**: Cursor, long-running autonomous coding experiment, 2026. [Self-driving codebases](https://cursor.com/blog/self-driving-codebases).
28. **Multi-agent research**: Anthropic, lead and worker agents for research, 2025. [How Anthropic built a multi-agent research system](https://blog.bytebytego.com/p/how-anthropic-built-a-multi-agent).
29. **Shared operator queues**: Nehme and Cummings, multiserver queueing for supervisory control. [Multiserver queueing for supervisory control of autonomous vehicles](https://ieeexplore.ieee.org/document/6314967/).
30. **Team against solo supervision**: Frontiers in Psychology study, a single operator against a team in multi-vehicle control, 2016. [Supervisory control of multiple vehicles, team and solo](https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2016.00568/full).
