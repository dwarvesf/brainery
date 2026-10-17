---
title: "3,016 delegations to agents: the long briefs cost the most"
description: "Median brief 289 words, median run 6.4 minutes, 14.5% needed a follow-up. What 24 days of Claude Code subagent logs say about briefing agents, and where a brief cost more than the work."
date: 2026-10-18
authors:
  - tieubao
kind: essay
tags:
  - ai
  - agents
  - delegation
  - communication
  - productivity
  - management
redirect:
  - /culture/communication-overhead
  - /Tyz5fw
slug: communication-overhead
---

In early October a brief of mine told a worker agent to time our test suites by running the full suite five times. Each run takes 15 to 20 minutes on our Mac mini. The worker spent over an hour doing exactly that, and it set an environment variable that walked past a guard built to stop full runs, because the brief told it to.

This page is about that kind of cost. Between 24 September and 17 October 2026 my Claude Code sessions dispatched 3,016 subagents. I measured what each brief looked like, how long each run took, and how often I had to send a follow-up.

An earlier version of this page said agents finish routine work 3 to 5 times faster than human delegation, and backed it with a table of 27 figures. None of those figures had a source. They are gone. I did not time delegations to people, so this page makes no comparison between people and agents.

![Median run time and follow-up share by brief length {#fig-briefs .live}](assets/communication-overhead-fig1-briefs.svg 'Briefs split into thirds by word count. The longest third ran 13.7 minutes at the median, and 23.8% of its agents needed a follow-up message.')

## What the log shows

Claude Code keeps a transcript for every subagent. For each one I took the first message as the brief, the span from first to last event as the run, and any later message I sent to that agent as a follow-up. I kept only the agents my own sessions launched, not the ones those agents launched in turn.

| Phase     | What the log can show               | Result                                                            |
| --------- | ----------------------------------- | ----------------------------------------------------------------- |
| Setup     | Words in the brief                  | Median 289 words, middle half 164 to 427                          |
| Execution | First to last event of the agent    | Median 6.4 minutes, middle half 2.7 to 14.8, 90th percentile 31.2 |
| Review    | Not logged                          | Not measured                                                      |
| Rework    | Agents that got a follow-up message | 437 of 3,016 (14.5%), 785 messages in all                         |

I rarely write these briefs myself. My sessions held 2,701 typed messages in this window, with a median of 13 words, and the opening message of a session had a median of 20. The orchestrating model expands those into briefs of about 290 words. The setup cost I pay is a short instruction plus the reading of the brief afterwards, which the log doesn't capture.

## Longer briefs, longer runs

Figure 1 splits the 3,016 briefs into thirds by length. The shortest third, up to 209 words, ran a median 3.2 minutes and 7.0% needed a follow-up. The longest third, 377 words or more, ran 13.7 minutes and 23.8% needed one.

Bigger tasks need longer briefs, so the figure shows a correlation and no cost of length. I still use it as a smell: when a brief runs past roughly 375 words, I check whether it holds two tasks. <!-- confirm: the 375-word check is my reading of the data, not a tested rule -->

![How long 3,016 delegations ran {#fig-runs}](assets/communication-overhead-fig2-runs.svg 'Run time per agent, first to last event. Most runs finish within ten minutes.')

Most delegations are short. 1,923 of the 3,016 (63.8%) finished within 10 minutes, and 541 within two. The 317 runs past 30 minutes are where a wrong brief costs the most wall-clock time.

## When the brief cost more than the work

The test-suite brief is the cleanest example. It asked for each suite's 95th-percentile time, measured from five full runs. The suites already record their timings in a history file, and reading that file is one command.

The worker followed the brief literally. It ran the suite, hit the guard, set the variable the guard checks, and kept going. Since 4 October every brief to a worker carries a test budget: affected suites only, timings read from history, and a wall-clock limit such as 30 minutes. When a worker passes its limit, it cuts scope instead of waiting the budget out.

## Fast and wrong

Two August 2026 cases show what a plausible wrong answer costs.

On 23 August an alert-triage bot posted two false claims about a production alert: that the deploy named in the alert belonged to another service, and that no change lined up with the errors. The cause was the tooling. Its git commands ran in a mirror of the wrong repository, so the lookup of the deploy failed without a message, and a stale context pack then supplied a tidy explanation for the gap. Settling it took the error events themselves: two of the four errors came from the version before the deploy, which ruled the deploy out. The bot's final no-action verdict was right, for the wrong reasons. The fix was three changes to the tool, a table mapping each service to the repository it ships from, an evidence file that shows route and script version, and a rewritten context pack.

In the same month I dispatched an estate-wide audit with a line telling it to skip two items as already handled. It came back clean. One of the two held the only real gap: an earlier fix had covered about a tenth of what was owed. I found it when I questioned the count.

## Rules from the log

- **Name what to check, never what to skip.** Let the audit re-derive the items you think are handled.
- **Put a budget in the brief.** Affected suites only, timings from history, and a wall-clock limit.
- **Land the shared surface first.** Two parallel workers once built the same slug rule from a prose description. They diverged on percent-escapes and on the empty-path fallback. A later pair worked from a schema merged first, with the exact column names in both briefs, and came back with zero mismatch.
- **Resume a stalled agent, don't respawn it.** Four of about 25 agents in one long session died on API errors. Each still held a worktree with uncommitted work. A message to the same agent id finished all four. A fresh agent would have been a second writer on one branch.

The last rule explains a caveat on the 14.5%. A follow-up counts any message I sent to a running or stalled agent, so it includes resumptions that had nothing to do with a bad brief.

## Who did the work

I route the cheapest model that can do the job. Sonnet ran 2,002 of the 3,016 agents (66%) and Opus 879 (29%). Haiku, Fable and agents that inherited my session's model make up the rest.

| Model     | Agents | Median run (min) | Median brief (words) | Follow-up share |
| --------- | ------ | ---------------- | -------------------- | --------------- |
| Sonnet    | 2,002  | 6.8              | 312                  | 13.7%           |
| Opus      | 879    | 5.9              | 258                  | 15.5%           |
| Inherited | 78     | 2.6              | 134                  | 20.5%           |
| Haiku     | 29     | 1.4              | 145                  | 3.4%            |
| Fable     | 28     | 21.6             | 490                  | 35.7%           |

Read the table as a map of the jobs I give each model. I reach for Fable when the job needs the most intelligence, which is why its follow-up share runs highest, on only 28 agents. It says nothing about which model is better.

By week the pattern held steady, with 11.6% to 16.1% of agents needing a follow-up.

| Week starting          | Agents | Median run (min) | Median brief (words) | Follow-up share |
| ---------------------- | ------ | ---------------- | -------------------- | --------------- |
| 21 Sep (from the 24th) | 561    | 8.4              | 313                  | 11.6%           |
| 28 Sep                 | 1,548  | 5.3              | 272                  | 16.1%           |
| 5 Oct                  | 680    | 7.5              | 293                  | 12.9%           |
| 12 Oct (to the 17th)   | 227    | 4.9              | 302                  | 15.4%           |

## Limits

- **No review time.** The log shows when an agent finished. It doesn't show how long I spent reading its result, and that's the phase where fast and wrong cost me most.
- **No human baseline.** I did not time 20 delegations to people. A fair comparison needs that log. <!-- needs Han: if you want the people-versus-agents comparison, a log of about 20 delegations to people over one month, with brief minutes, execution, review and rework -->
- **24 days.** My session logs start on 24 September, so this window is one stretch of work, including large fan-out batches. The week of 28 September alone holds 1,548 agents.
- **Follow-ups undercount rework.** I sometimes dispatch a fresh agent instead of messaging the old one, and the log can't tell a redo from a new task.

## Log your own

1. Collect every subagent transcript and its metadata from your Claude Code project folder.
2. Run time is the last timestamp minus the first.
3. Brief length is the word count of the first message.
4. A follow-up is a later message from the parent session addressed to that agent's id.
5. Count only agents your session launched directly.

`session observe subagents --days 30` prints spawns per day and the agent-type mix. The medians above come from a short script over the same files. The script isn't public, and the five steps rebuild it. <!-- confirm: public status of the session reader and the script -->
