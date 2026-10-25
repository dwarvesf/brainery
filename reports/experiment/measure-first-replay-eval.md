---
title: "Rediscovering pi-fovea blind: what a measure-first skill adds to an agent"
description: "A blind replay of pi-fovea's day-0 problem shows what a measure-first skill adds to an agent, and what the model already knew."
date: 2026-10-26
slug: measure-first-replay-eval
kind: field-report
toc: true
draft: true
authors:
  - tieubao
tags:
  - eval
  - ai-agents
  - claude-code
  - benchmark
  - llm-judge
type: report
form: field
topic: ai-agents
secondary_topics:
  - engineering-practice
abstract: "Four accurate agent-built tools share three loops: bootstrap the field's knowledge, build a frozen measure, then improve against it. A blind replay of pi-fovea's day-0 problem shows the model already holds the first loop; the gap between a raw model (9.0 of 14) and the same model with a measure-first skill (13.0) is all in the second and third."
---

Tom shipped [pi-fovea](https://github.com/fabric-runtime/pi-fovea) in August. It gives a coding agent a map of a large repo inside a fixed token budget, and it does it with [heat diffusion](#ref-1) on a code graph: put heat on the symbols near your question, let it spread along imports, calls and shared route strings, and show sharp detail where it is hot and a skeleton where it is cold. On the first commit the tool already beat a truncated outline at the same budget, recall 0.956 against 0.121 at 4,000 tokens.

I wanted two things from the repo. How did Tom get to heat diffusion, a tool from graph signal processing that I had no background in? And how did he know it worked, at an accuracy I can't reach when I build with AI, because I end up sitting in the loop checking outputs by hand? The git history answers only the second question. The heat kernel is complete in the first commit, with a Chebyshev expansion and a reference test to 1e-8, so whatever led Tom there happened before the repo existed. The measurement, though, is all in the history, and it is the part I could copy.

This post covers what I found in pi-fovea and three sibling repos, the skill I built from it, and a blind eval that replays pi-fovea's day-0 problem to check whether the skill does anything.

## What four agent-built repos share

I read three more repos with the same question: Tom's [gdp-wired](https://github.com/monotykamary/gdp-wired) (a prover for stateful rules) and pi-fabric (an agent runtime that measures tool-call friction it calls entropy), plus Tâm's [godev-vn-translator](https://github.com/tamnd/godev-vn-translator), which translates go.dev into Vietnamese and, in its own words, "refuses most of what comes back".

| | pi-fovea | pi-fabric | gdp-wired | godev-vn-translator |
|---|---|---|---|---|
| Idea | a user's LSP request | a repair KPI and an outside critique | gdp-ts, Handwired, Bend | 557 unchecked translations |
| Measure | 39 pinned repos, AST answer key | friction rate, paired benchmark | competition corpora, pinned rivals | 20 gates, each from a defect |
| Improve | before and after numbers in commits | weakest: a runtime replay gate | `bun bar` with baseline, reruns, noise band | repair per piece, review rounds, a person |
| Admitted limit | internal fidelity only | not task success | own harness | fluent wrong passes |

None of the four writes its own exam when it can borrow one. gdp-wired scores on the problem sets the field already competes on. pi-fabric's benchmark first reproduces the outside critic's numbers, 1,505 reads with 78.5% of them whole-file, before it claims anything, which calibrates the harness against a fact someone else measured. Tâm's README puts the rule for growing a measure better than I can: "A rule with no defect behind it spends its life refusing correct work." Every one of his gates names the file that broke.

They also measure the measure. gdp-wired has a script whose only job is to check whether the quick dev set predicts the full score, and it reruns any task where the candidate and the baseline disagree, three times each side, before calling a gain. One commit drops a feature that scored 101 against 102 on the dev set and 1,039 against 1,044 on the full run. ==The habit that makes these tools accurate is a measure that sits outside the thing being built, frozen while it runs, and allowed to grow only when reality shows it a miss.==

Two of my first readings were wrong, and I'll flag them because I'd have repeated them. pi-fabric's entropy does not measure whether the extension works; it is a rate of tool calls the runtime rejects, and the docs say so. Its first version used Shannon bits and could be lowered by deleting options from the tool surface, so version 3 was rebuilt so that "removing an enum member cannot improve this objective". And gdp-wired doesn't take an open-source library and beat it. It builds on gdp-ts and Handwired, then competes with solvers it shares no code with, on their home benchmarks. Its +5 and +6 leads on two of those benchmarks sit inside its own noise band.

## The method as three loops

![Three loops {#fig-loops}](assets/measure-first-replay-eval-fig1-three-loops.svg 'Three loops. Loop 1 draws the map from model knowledge, loop 2 freezes the answer key from reality, and loop 3 runs against it; a failure the metric missed adds a case and a new measure version.')

**Loop 1, bootstrap.** Restate the problem in the field's own terms, find the three to five fields that already have a name for it, and list how each field judges quality: its metrics, its public benchmarks, its common failure modes. End with one sentence of the form "given X, return Y; correct when Z", where Z is a command or a set of rubric lines. When I started I assumed this loop was the hard part, the place where Tom's background did the work. It turns out the model carries most of it, and the eval below backs that up.

**Loop 2, measure.** Build the yardstick before any solution work. Borrow a public benchmark if one fits and pin it. Build an answer key from something outside the system under test: a parser, a compiler, a spec, a recorded human decision. Split train from holdout, fingerprint it, call it v1. Then run today's method on it as the baseline, three times, to get a noise band, and write down the cheapest way a loop could raise the score without improving anything, plus the counter.

**Loop 3, improve.** Once the measure exists, this loop is input and output on a schedule. When a run is cheap and the metric is a command, it is Karpathy's [autoresearch](#ref-2) shape: mutate, score, keep only what beats the best by more than the noise band, and on a tie keep the simpler variant. When a run needs taste or takes hours (a video, a motion piece, how a game feels), it becomes a weekly practice loop scored with the same rubric.

The loops run at different speeds, and loop 2 is the one people skip. It also improves over time, but between runs, never during one: a dogfood failure the metric missed becomes a new case, the corpus gets a new version, and the baseline is rescored on it.

## Who sets the bar, and who scores

When I asked myself who decides whether an output is good, the answer from the four repos was the same each time. People own the criteria. Machines do the scoring.

- **The criteria** come from a person or from the field's public verdict. In my setup the agent drafts rubric lines and I approve each one.
- **Countable items** go to commands. Tâm's translation gates count headings, links, code blocks and glossary terms against the English source.
- **Taste items** go to a person, or to a judge model that has earned it. The judge grades 10 to 20 cases I graded by hand, and I trust it only at 80% agreement or better.
- **Before trusting any measure**, I run five checks: a known-good input scores above a known-bad one, a published number reproduces, three reruns give the noise band, judge and human agree, and a small dev subset predicts the full score.

Translation is the clearest case. Tâm's twenty gates catch broken anchors, dropped code blocks and escaped Markdown, and none of them can tell you the Vietnamese says the opposite of the English. That half goes to review rounds and then to a person.

## The skill

I wrote the three loops into a Claude Code skill called `frame-and-measure`. It lives in my private dotfiles, so here is the shape you can copy into your own:

- [ ] Ask the user for three concrete cases: the input, what happened, what should have happened. Mine candidates from incident notes when the user has none. For a new field with no cases yet, bootstrap first and turn the user's verdicts on three first attempts into cases.
- [ ] Draft the field map, quality bar and candidate measures (automatic metric, rubric, pairwise A/B) from model knowledge, and confirm every named benchmark by search.
- [ ] Ask at most five questions, one at a time, each with a recommended answer.
- [ ] Write the correct-when sentence. A vague verb with no command and no rubric line means loop 1 is still open.
- [ ] Build the frozen answer key, baseline, gates, noise band and cheapest-cheat counter, and run the five validation checks.
- [ ] Hand the card to the improve loop with a fixed budget, and log every kept change with its before and after number.

The job I give the user is narrow on purpose. I'm good at recognising a bad output when I see one, and poor at abstracting a problem from cold. So the skill asks me for cases and for yes or no on its recommendations, and does the abstraction itself.

## The replay eval

I didn't want to trust the skill because it read well. So I treated it like any other system under test and gave it a day-0 problem with a known answer.

**The problem.** I wrote pi-fovea's problem as it stood before the repo existed: an agent on a 2,000 to 6,000 file Go, TypeScript, OpenAPI and Python repo, three failures (a route lookup that greps 200 hits and reads 15 files, an edit that breaks a client nobody flagged, a whole-repo outline that overflows the budget), and a user asking for "a better LSP extension". No mention of graphs, heat or diffusion.

**The answer key.** Fourteen decisions Tom actually made, read from the pi-fovea history: a graph-proximity ranking family, one cross-language graph from static extraction, ranked output under a hard token budget, joins through shared route strings, git co-change as a signal, a naive baseline, recall at a fixed budget, several open-source repos pinned by commit, an answer key independent of the system, a gate against losing cases already correct, a noise band or paired runs, dogfood on real repos, thresholds set from corpus data, and keeping or dropping changes by measured effect. I pinned the problem and the rubric in a commit before the first run.

**The arms.** Each arm ran three times on Sonnet:

| Arm | Setup |
|---|---|
| A | my setup + skill |
| B | my setup, prompt asks how to know |
| C | my setup, no measure question |
| D | raw model, safe mode |
| E | raw model + skill text |

A and B were planned; C, D and E were added after I saw earlier results, and each addition is logged with its reason. B's answers all built the eval first, which made me suspect the measure question in the prompt. C removed it and still built the eval first, which made me suspect my own CLAUDE.md, since the subagents inherit it and it already tells the agent to turn vague tasks into verifiable goals. D and E take that file out of the picture. The rubric never changed.

**Grading.** One Opus judge read the rubric, the problem and all fifteen answers under shuffled ids, and wrote a pass or fail per item with a quoted line as evidence. A regex scorer ran on the eleven items that have a machine pattern, as a cross-check. Before trusting the regex I fed it a known-good file and a known-bad one; it scored them 6 and 1, so it separates them, and the same test showed that one pattern matched the problem text itself, which is why the judge's verdict counts and the regex only checks it. Regex and judge agreed on 82% of item verdicts.

## Results

![Rubric score by arm {#fig-scores}](assets/measure-first-replay-eval-fig2-scores.svg 'Rubric score by arm. Mean of three runs out of 14, range drawn as a line; the amber bar is the raw model with the skill text.')

| Arm | Mean of 14 | Range |
|---|---|---|
| D raw model | 9.0 | 9 to 9 |
| E raw + skill | 13.0 | 13 to 13 |
| B asks how to know | 10.7 | 10 to 11 |
| C no measure question | 12.3 | 11 to 14 |
| A setup + skill | 13.3 | 13 to 14 |

**Loop 1 is free.** Nearly every run in every arm, the raw model included, passed the eight items that describe Tom's design and his choice of metric: graph ranking (often as Aider's personalized PageRank repo map), cross-language extraction, the token budget, joins through route strings, co-change history, a baseline, recall at a budget, an independent key. A skill run also challenged the request itself: "A better LSP extension is a solution guess", because an LSP is per-language and has no budget. ==The knowledge I thought I lacked was already in the model; what it lacked was the discipline to build a measure that could prove anything.==

**The gap is all measurement.** The arms split on four items: a corpus of several public repos pinned by commit, a gate against regressing correct cases, a measured noise band, and dogfooding that turns failures into cases. The raw model passed none of those four in any run. With the skill text pasted in, it passed nearly all of them.

**Inside my own setup the skill adds about a point.** C scored 12.3 with a range of 11 to 14, and A scored 13.3. That difference sits inside C's own spread. My CLAUDE.md already pushes an agent to define a check before it builds, so for me the skill's value is consistency and the card it leaves behind. For a teammate without that file, the D-to-E gap is the number that matters.

**Asking "how would I know it works" didn't help.** B scored lower than C. With three runs per arm I read that as noise.

## The skill's own improve loop

The eval also found a hole in the skill. Arm A passed the "thresholds from corpus data" item in one run of three. Tom set pi-fovea's route-discovery threshold at the gap between junk shapes (below 0.27) and real routes (above 0.75) across eight repos, and my skill never asked for anything like that.

So I ran loop 3 on the skill itself. I added one sentence: every weight, threshold and cap in the design comes from the corpus, placed inside the gap between known-bad and known-good scores and confirmed on holdout. Arm F ran the revised skill on the raw model, and a fresh judge graded E and F together, re-shuffled.

F fixed the threshold item, three runs of three against two of three. It also lost the pinned-corpus item, zero of three against two of three, because every F run answered its own corpus question with "the user's repo plus one public repo". Net, 12.7 against 13.0, inside the noise. By the skill's own rule, a change has to beat the best by more than the noise band, and a tie keeps the simpler version. The sentence didn't ship. The validation step that went into the same revision did ship, because it answers a requirement rather than chasing a score.

That result is the most useful thing the eval produced. One problem is a training set of one, and tuning the skill until it matches Tom's rubric would teach it to copy Tom's path. The next round needs more day-0 problems with their own answer keys, gdp-wired's and Tâm's first, held out from any tuning.

## Reading anyone's benchmark

The four repos and this eval left me with five questions I now ask of any claim, including my own:

- [ ] Who set the problems?
- [ ] Who graded the answers?
- [ ] Did the rivals run under the same conditions?
- [ ] Is the gap bigger than the noise?
- [ ] Can I rerun it?

gdp-wired passes the first two, since the problems and most verdicts come from the competitions, and is weaker on the third and fourth. This eval passes the first two, reports its noise, and is partly rerunnable, as the last section explains.

## Limits

- Three runs per arm, and the arms differ by a point or two near a ceiling of 14. A, E and F can't be separated further by this rubric.
- Blinding is partial. Skill answers come out as a filled card, and the judge can see that shape.
- The rubric scores one proven path. A sound design that differs from Tom's scores lower here without being wrong.
- Skill arms answered their own clarifying questions with their recommended answers. A real person answering could move the result in either direction.
- No human calibration sample yet. The judge is checked against the regex, not against me.

## Rerunning it

The experiment lives in our private ops-toolkit repo: the pinned problem and rubric, all eighteen answers, both judges' evidence files with quotes, and two scripts. One runs the raw-model arms through `claude -p --safe-mode` with file tools denied. The other is the regex half of the rubric. The skill lives in my private dotfiles; the checklist above is its full shape. pi-fovea, gdp-wired and godev-vn-translator are public, and every commit cited here can be checked against them.

## Appendix: evidence

| Claim | Where to check |
|---|---|
| Heat kernel on day one | pi-fovea `129f1c1` |
| Drop by dev and full | gdp-wired `41d8c96` |
| Threshold at the gap | pi-fovea `952bdb0` |
| 39-repo pinned corpus | pi-fovea `docs/coverage-corpus.md` |
| Entropy v3 objective | pi-fabric `docs/entropy.md` |
| Gates from defects | godev-vn-translator README |

## References

1. **Heat diffusion**: Spreading an initial "heat" vector over a graph with the heat kernel e^(-tL), where L is the graph Laplacian and t sets how far the heat travels; nodes near the seed along strong edges end up warmest.
2. **Autoresearch**: Andrej Karpathy's loop in which an agent edits one file, runs a short fixed-budget experiment, keeps the change only if a single validation metric improves, and repeats overnight.
