---
title: We stopped testing engineers on speed
description: Dwarves cut the weight of timed algorithm problems in its technical interview from 60% to 15%. The dates, the weights, and the new hour.
date: 2026-10-18
authors:
  - tieubao
kind: essay
tags:
  - hiring
  - ai
  - soft-skill
  - critical-thinking
  - culture
redirect:
  - /culture/capability-cliff
  - /8QzdeQ
  - /weak-engineer
  - /essays/weak-engineer
  - /culture/weak-engineer
  - /63gjpg
slug: capability-cliff
type: writing
form: essay
topic: engineering-practice
fit: 2
---

Until February 2026 our technical interview scored engineers on how fast they solved algorithm problems. The problems ran 40 minutes under time pressure and carried 60% of the score. Then we rewrote the hour. The candidate now works a realistic problem with AI tools switched on, and raw coding is 15% of the score.

This page gives the dates, the weights, and what the new hour tests. It reports no hiring outcomes.

![Three ways a problem gets solved as time passes {#fig-cliff}](assets/capability-cliff-fig1-slope-cliff.svg 'Schematic, not measured data.')

The idea behind the change is Sean Goedecke's. In December 2024 he wrote that the real measure of an engineer is "the capability to do tasks that other engineers can't" ([What can strong engineers do that weak engineers can't?](https://www.seangoedecke.com/weak-engineers/)). We published two pages on that idea in June 2025. The first gave him no credit. The second put the credit in its last line. This page replaces both, and the credit belongs here.

## Why speed is the wrong clock

A timed test assumes the dashed line in Figure 1: give a person more time and they get more done. Goedecke's claim is that for some problems the line is flat. An engineer who lacks the mental model for a race condition across services doesn't get closer by the hour. An engineer who has the model finishes in an afternoon. A speed test samples the dashed line and never sees where the cliff is.

I have one clean case from my own records, and it's about me.

On 12 October 2026 the router in my home office started failing every DNS lookup. A Mac mini behind it runs our team's bots, so everything that needed a name lookup went dark: monitoring, bot gateways, backups. The first failed lookup in the logs is at 02:01. By 07:22 I had tried four resets: the router, its WAN link, the Mini's network paths, the Mini itself. Each takes minutes and each feels like progress. None changed the symptom.

At 09:06 pinning the Mini to a public resolver brought that one machine back. The cause was still unknown. The first useful comparison in my notes is at 22:20, about 20 hours after the first failure: the same query with DNSSEC validation switched off succeeded. The router validates answers against a root key that had rotated the day before, and it rejected every one. Turning its validation off at 09:12 the next day fixed name lookups for every device that used the router.

![One outage on a timeline, from the first failed lookup to the fix {#fig-outage}](assets/capability-cliff-fig2-outage.svg 'Hours since the first failed lookup. The highlighted point is the one comparison that located the failing layer.')

That night I was missing one idea: a resolver can reject answers its upstream serves correctly. Resets don't test that idea, so more resets never got me closer.

That's one night, and I wouldn't build a hiring theory on it. It does bear on a claim I disagree with. Goedecke writes that someone great at one of the capabilities he lists, such as solving very difficult bugs, is likely to be great at most of the others. My night says capability is lumpier. I run this infrastructure myself and still spent a night on the wrong layer. A loop that ranks people on a single axis misses that lumpiness in both directions.

## What the old loop measured

In March 2022 we published the shape of our loop: a 20-minute form, a 30-minute phone screen and a one-hour technical interview, 1 hour 50 minutes in all. Tech capability was the north star, and other engineers sat in the interview beside the hiring manager. We also wrote that an interview should never leave a candidate feeling they are begging for a job.

A hiring note from February 2026 described the technical hour as 40 minutes of algorithm problems under time pressure, with 60% of the score on them. Its verdict was that this format measures the skill agents are replacing.

## The loop, then and now

The table lists what I can date.

| When                | What                     | What it looked like                                                                                                                                                    |
| ------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| March 2022          | Whole loop, as published | A 20-minute form, a 30-minute phone screen and a one-hour technical interview: 1 hour 50 minutes in all                                                                |
| Until February 2026 | Technical interview      | 40 minutes of algorithm problems under time pressure, 60% of the score                                                                                                 |
| February 2026       | Technical interview      | 60 minutes in three sections: AI-augmented problem solving (25 min), architecture and tradeoffs (20 min), communication (15 min). Raw coding 15%, domain knowledge 10% |
| February 2026       | Rollout rule             | Pilot the new format on the next 3 to 5 candidates beside the old one, with a checkpoint at week 6                                                                     |
| By April 2026       | Screening                | A 10-question AI-fluency census of 3 to 5 minutes for every contractor, and a revised design challenge, both on file                                                   |

![Interview score weights before and after the February 2026 rewrite {#fig-weights .live}](assets/capability-cliff-fig3-weights.svg 'The algorithm and raw-coding share fell from 60% to 15%. Sections A, B and C take 25, 20 and 15 minutes.')

Two details of the guide matter more than the weights.

First, section A is built to overflow. The guide tells the interviewer that the problem is more than one person can finish in 25 minutes, so completeness isn't the score. A candidate who finishes 60% and catches a critical bug in the generated code beats one who finishes 100% and ships broken code. The interviewer says: "Use whatever AI tools you normally work with. Share your screen."

Second, the follow-up questions. "Walk me through your approach before you start coding." "I see the AI generated this. Why did it choose that pattern?" "What edge cases is the AI missing here?" Each one asks for the mental model behind the output. Section B moves from the code to the situation around it: "The client wants to add feature X. You think it's a bad idea. How do you handle that conversation?" and "You inherited a codebase from the previous team. It works but the architecture is fragile. What do you do first?" Speed survives as one of five listening cues, the speed of the prompt, review and iterate loop. It lost its veto.

## Why agents sharpen the question

An agent finishes a well-defined task and stalls on an ambiguous one. "Make the app faster" is the standing example: someone has to decide what faster means before any tool can help. In my own logs that ambiguity shows up as follow-ups. Of 3,016 subagents I dispatched in 24 days, 14.5% needed a second message before the job was done, and the share rose with the length of the brief. The numbers are in [the delegation log](communication-overhead.md). The person who can name what done means saves the follow-up. Section C tests the same skill from the other side: explain your decision to a product manager who asks why it takes three sprints.

I dropped two things from the June 2025 pages. The strong, regular and weak labels went, because we don't use them in hiring and I have no case from our own team that earns them. The catalogue of "ghost engineering" habits went too. It described colleagues, on a company site, with no evidence.

## Where this is wrong

**No outcome data.** I can't show that the new hour picks better people. This page reports no hiring outcomes from either format.

**Tool fluency became a filter.** The guide classifies a candidate who avoids AI tools as "AI resistant" and calls that a red flag for 2026 placements unless they show willingness to learn. We swapped one filter for another. The bet is that the new one tracks the work clients pay for, and we haven't tested the bet.

**Interviewers vary.** Section A depends on the interviewer noticing the edge case the model missed. Two interviewers can score the same hour differently, and we haven't measured how much.
