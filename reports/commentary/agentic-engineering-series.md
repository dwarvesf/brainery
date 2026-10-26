---
title: "Agentic engineering: the series map and how to read it"
description: "A series on building agentic software for engineers who know the classic lifecycle, and how its pillars, deep dives and reading paths fit together."
date: 2026-10-27
toc: true
authors:
  - tieubao
tags:
  - commentary
  - ai
  - agents
  - architecture
slug: agentic-engineering-series
series: agentic-engineering
series_part: 1
announce: false
type: writing
form: analysis
topic: ai-agents
fit: 3
abstract: "This post opens a series on building agentic software: 13 pillars in reading order, from modeling to the software factory, and 29 deep dives that each take one algorithm apart. Every part carries one firsthand measurement from our own estate, a white-paper sweep and an honest limits section. Newcomers can read it in order with an on-ramp per part, and senior engineers can jump to the pillar that matches the problem on their desk."
---

## What is this series, and who is it for?

This series is about building software where a model picks some of the steps. ==It is written for engineers who already know the classic lifecycle and are new to agents==, with an on-ramp in each part for readers who are new to both.

If you can draw a domain model, a state machine and a sequence diagram, and you have shipped services with APIs, tests and on-call, you are the main reader. You know how to build software. What you may not know yet is which of those habits still hold when part of the system decides its own next move, and which ones break.

I'm writing it because we run agents in our own estate at Dwarves, and the first audit was humbling. In the prequel, [Owner agents, plain functions](owner-agents-and-functions.md), our lab register came to 163 jobs, LLM steps and agents, and only [21 of them]{.accent} needed an agent loop at all. The rest stayed plain code. I want a written map of what actually changes, built from papers and our own measurements, so the next engineer who joins an agent project doesn't have to rebuild it from blog posts.

Writing it is also how I learn it. Each part pairs with a learning Day that I work through before the article ships.

## What changes when you build agentic software?

Less than the demos suggest. An agent is a model plus a [harness](#ref-1), and ==most of a working system is still ordinary code around one stochastic step==.

The working definition the series uses is Simon Willison's: an agent is a model running "tools in a loop to achieve a goal" [4]. In classic work you write the path. In agentic work you build the task environment the model acts in: the goal, the constraints, the tools, the information, the authority and a test for done. The model picks the path at runtime, inside that environment.

Five ideas carry the rest of the series.

- **The harness is everything except the model.** The generic part, the loop and tool calling and sessions, comes off the shelf. The domain harness, your tools, context sources, memory, skills, gates, triggers and evals, is the product. Nobody sells it, because it encodes your data and your definition of done.
- **A deterministic shell surrounds a stochastic core.** Code decides what loads into context, which tools exist, the budget, the gates on side effects, retries, logging and the done-test. The model chooses only inside that box. The reason is arithmetic: a chain of 20 steps at 95% each succeeds [36% of the time]{.accent}, so any rule that must hold every time belongs in code.
- **One owner per artifact.** One agent owns a domain's outcome and is the only writer to its board, ledger or memory. Every other process is a tool it calls or a proposal it reviews.
- **Rungs before autonomy.** The series sorts jobs onto five [rungs](#ref-2), R0 to R4: a plain function, a workflow with one typed LLM step, one owner agent, an owner with read-only helpers, and peer agents that write and negotiate, which we avoid. A rung names an architecture shape. Autonomy is a separate dial, set per tool. The prequel labeled the same rungs L0 to L4; the series uses R.
- **Most work stays plain code.** Backups, probes, data loads and anything that touches money stay deterministic. The model gets judgment and text.

Your classic skills apply to the shell unchanged, and it is where most of the engineering lives.

## How is the series organised?

The series runs as 13 pillars, P0 to P12, in reading order. Each pillar answers one question an engineer asks on an agent project, and the pillars group into four stages (@fig-map).

![Series map {#fig-map}](assets/agentic-engineering-series-fig1-map.svg 'Series map. The hub P0 at the top, then pillars P1 to P12 in reading order across four stages, each with its count of deep dives, and the optional business pillar dimmed.')

P0 is the hub: the vocabulary, the rungs, the harness and the figure conventions every later part assumes.

Foundations come first, because they define the system and what "works" means:

- **P1, modeling.** How do you draw and specify an agentic system before you build it, so another engineer can review it?
- **P2, tool design.** How do you design tools so a model picks the right one and calls it correctly?
- **P3, quality.** How do you know an agentic system is right when each run can differ?
- **P4, failure modes.** How do agents fail in practice, and which failures does design prevent?

Runtime covers how the loop acts and what it reads:

- **P5, execution.** Should the agent act through one tool call per step, or write a small program against a tool API?
- **P6, context and memory.** What should the model read, in what order and at what size, and where does memory live?
- **P7, cost and performance.** What does an agent cost per task, and which levers cut it without losing quality?
- **P8, durable execution.** How do you keep agent work alive and correct across crashes, restarts and hours of runtime?

Production covers running it with real users and real risk:

- **P9, security.** How do you keep an agent safe when its inputs are hostile and its tools are powerful?
- **P10, operations.** How do you run an agent in production, see what it did, and respond when it goes wrong?
- **P11, people in the loop.** Where should a person approve, interrupt or take over, and how do you keep approval from becoming a rubber stamp?

The factory stage closes the series:

- **P12, software factory.** How do agents build software inside a team, with lanes, gates and clear roles?

An optional pillar on product strategy and pricing sits outside the path. It ships only if the series earns it.

Each pillar becomes one article of 2,500 to 3,500 words, paired with a newcomer on-ramp and a learning Day.

## What is a deep dive?

A [deep dive](#ref-3) takes one algorithm or technique and walks it from the problem to our own measurement. Each one runs the same order: problem, intuition, math, a toy example, an interactive board, our number, and its limits.

The order matters for a reader. The problem comes first, with one concrete failure. The intuition comes next as an everyday picture, plus one sentence on where the picture stops being true. Then the math, with every assumption stated. The toy example is small enough to work by hand, and the interactive board runs that exact input, so the numbers on the page and on the board match. After that come where the technique runs in a real system, one firsthand measurement, and the cases where it loses.

There are [29 deep dives]{.accent}, each attached to the pillar it serves. Context and memory has the most with six, and quality has five. A few examples, by technique:

- **pass^k and chain reliability.** With per-try success p, all k tries pass with probability p to the k. On tau-bench retail, one try passed about 61% of the time and all eight passed together about 25% of the time [5]. This one opens the quality pillar.
- **Heat-kernel diffusion over a code graph.** Relevance spreads from a few seed files through a typed graph of files and symbols, the way heat spreads through a plate, to decide what the model should read first.
- **Deterministic context compaction without a model call.** A long transcript shrinks by fixed rules: stable sections first, volatile ones last, raw tool output dropped. The same input gives the same output, which keeps the cacheable prefix long.
- **Property proofs for agent-written code.** You state the laws a component must obey, and a prover either finds a counterexample or certifies that every input satisfies them.
- **Error amplification by topology.** Independent agents amplified errors 17.2 times in one study, while a central orchestrator cut that to 4.4 times [6]. The shape of the system changes how far one mistake travels.
- **Exactly-once commit over at-least-once execution.** Work may run twice, but the commit is idempotent on the task id, so the first durable commit wins and a duplicate is acknowledged, never applied.

Several of these techniques come from open-source agent runtimes that other people built. Each deep dive credits its source by name in the article itself, and this post names only the techniques. Where the math is sound but a tool lost in our own test, the deep dive says so in its limits section, with the number.

## How is each part built, and why trust it?

Every part goes through the same eight stages. ==The stage that earns trust is one firsthand measurement in our own estate==, and the claim check that follows it (@fig-pipeline).

![How each part is built {#fig-pipeline}](assets/agentic-engineering-series-fig2-pipeline.svg 'How each part is built. Eight stages from brief to publish, with the firsthand experiment marked, and two outputs per part: the memo article and the learning Day with its on-ramp.')

The brief fixes the reader questions and the scope. The white-paper sweep builds a sources table, with an arXiv ID for every paper or a plain "to find" line when we have not confirmed one yet. The experiment produces one dated number from our own systems, with the command that produced it and a negative control where one applies. A rerun has to give the same number within its stated noise.

Then the draft, and then the claim check: every number traces to a source, vendor claims about their own products say "reports" or "claims", and blog claims we could not check are marked secondary. The voice and rubric pass strips private detail. We publish aggregate numbers only, with no hostnames, client names or household detail. Before review, I run the part's 30-minute exercise and its learning Day board myself.

A requirements ledger sits under all of it. Every task in the series reads it first. It pins the vocabulary (we say "tool", and rungs run R0 to R4), the dating and sourcing of numbers, and the privacy rules.

The honest-limits section is the other half of the trust case. No source we have found compares an agent and a pipeline on the same business task, head to head. So every number in the series is domain-specific, and each part says where its evidence runs out.

## How should you read it?

There are two paths. ==Newcomers read in order with the on-ramps; senior engineers jump straight to the pillar that matches the problem on their desk.==

The newcomer path starts with the prequel, then the hub, then each pillar in order. Before each article, read its on-ramp and do its [30-minute exercise]{.accent}. The learning Day behind each part has an interactive board, so you can push on the idea before you read the math.

The senior path starts at @fig-map. Pick the pillar that matches what is hurting now. Evals that pass on Tuesday and fail on Wednesday point to P3. Jobs that die halfway through a long run point to P8. A bill that grows faster than usage points to P7. Approvals that everyone clicks through point to P11. Read that pillar, then the deep dives that hang off it.

Deep dives publish after their pillar, unless the pillar links forward to them.

## What is out, and what comes next?

The prequel is out. ==Next comes P3 on quality, opening with the pass^k deep dive==, and the full hub guide follows as the P0 entry.

The prequel, [Owner agents, plain functions](owner-agents-and-functions.md), covers when an agent beats a workflow, how the split holds across domains, and how our own lab sorted onto rungs. It is the evidence base the series starts from.

The hub guide exists as a working draft: the glossary, the mental model, the harness in detail and the C4 figure conventions. It publishes as the series entry point once it passes the same pipeline.

Quality ships first among the pillars, ahead of reading order, because every later part needs a definition of "works" that holds when runs differ. Everything else is planned as of October 2026, and I won't promise dates for parts that have not passed their own experiment yet.

## References

1. **Harness**: everything in an agent system except the model, including the loop, tools, context, memory, gates and evals. The generic part comes off the shelf, and the domain part is the product you build.
2. **Rung**: one of five architecture shapes, from R0 (a plain function) to R4 (peer agents that write and negotiate). A rung names a shape, not an autonomy level.
3. **Deep dive**: an article on one algorithm or technique, from the problem and its math to a toy example, an interactive board and our own measurement.
4. **Willison**: Simon Willison, working definition of an agent as tools in a loop, 2025-09. [I think agent may finally have a widely enough agreed upon definition to be useful jargon now](https://simonwillison.net/2025/Sep/18/agents/).
5. **tau-bench**: Yao et al., tool-agent benchmark with the pass-all-k consistency metric, 2024. [arXiv 2406.12045](https://arxiv.org/abs/2406.12045).
6. **Kim**: Kim et al., Google and MIT, controlled study of multi-agent gains and losses by task type, 2025-12. [arXiv 2512.08296](https://arxiv.org/abs/2512.08296).
