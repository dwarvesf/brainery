---
draft: false
title: "Five layers to tune before you fork your agent"
description: "What makes AI agentic, how to split a deterministic core from an agentic edge, and the five layers you can tune without rebuilding the harness. Real numbers from circle and Hermes."
date: 2026-10-08
toc: true
authors:
  - tieubao
tags:
  - ai
  - agents
  - mcp
  - context-engineering
  - architecture
slug: agent-tuning-layers
---

## TL;DR

We built circle, a relationship tracker on Cloudflare, and wired it into Hermes over MCP. Then I asked the obvious next question: if I want better tool calls and better context management, do I have to rebuild the agent? The answer is no. The harness already runs the loop and manages the window. What you control sits in five layers outside it, and the two cheapest ones (your MCP tools and your skills) move quality the most. This post starts with the difference between agentic and non-agentic AI, which comes down to who decides the next step. It splits a system into a deterministic core and an agentic edge, and names the three parts of any integration: brain, know-how, and hands with memory. Then it maps the five layers, with real token costs from a system we run.

![](assets/agent-tuning-layers-fig1-ladder.svg)

_Fig. 1: the five layers you can tune, cheapest at the top. Layers 1 and 2 live in your own code, so start there._

## The question

circle stores one record per person across every channel: notes, meetings, promises, a warmth score that decays with silence. It runs as a Cloudflare Worker with D1 and R2. Collectors feed it, and a Hermes desk reads it so I can type "brief me on An" in chat and get one screen back.

The design looked like a normal software system: a database, a REST API, some cron jobs. That made me uneasy. Where is the "agentic" part? If I later want a Grok bot to read circle too, do I hook it through MCP, through a skill, or both? And what do people mean by a "long-running agent", given that nobody defines it the same way twice?

Those three questions have short answers once the vocabulary is straight, so I'll start there.

## The vocabulary, in one loop

Figure 2 walks one real ask through the system. Read it left to right, then watch the window on the right fill up.

![](assets/agent-tuning-layers-fig2-loop.svg)

_Fig. 2: one "brief me" request. Every step appends to the context window, and the model sees nothing outside it._

Each term maps to one piece of that picture:

| Term               | What it means                                                                                                                      | In the figure    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| Tool call          | The model writes a JSON request. Your code runs it and returns the result. The model executes nothing itself.                      | steps 2 and 5    |
| Agent loop         | Tool calls repeated until the task is done. An agent is a model plus tools plus a loop.                                            | steps 1 to 6     |
| Harness            | The program that runs the loop, holds the tools, and enforces limits.                                                              | Hermes           |
| Context window     | The only text the model sees on a turn. It has a hard size limit.                                                                  | the right column |
| Context management | Deciding what goes into the window and what comes out: which skill loads, how big a tool result is, when old turns get summarized. | the block sizes  |
| Memory             | State kept outside the window that the agent reads back on demand.                                                                 | circle's D1      |

Once I saw it this way, "context management" stopped being abstract. It is a budget. Every tool description, every skill, every result, and every old turn spends from the same fixed pot.

## Agentic or not: who decides the next step

"Agentic" was the word that confused me most. circle already uses a model in several places, yet only some of them are agents. The difference has nothing to do with how smart the model is. It comes down to one question: who picks the next step, your code or the model?

![](assets/agent-tuning-layers-fig3-spectrum.svg)

_Fig. 3: three kinds of work. The dashed line is where control passes from your code to the model._

**Plain code.** Your code decides every step and no model runs. The same input gives the same output every time. In circle that covers the warmth score (a decayed sum of weighted touches over 365 days), the daily radar, the tier cadence (a tier A person is overdue after 30 days of silence), and the lookup that turns a name into a list of matching people.

**A model on a fixed path.** Your code still decides the steps. At one fixed spot it calls a model, asks for a fixed output shape, and moves on. People call this a workflow; Anthropic's "Building effective agents" draws the same line. circle's fact extraction works this way: a note goes in, a structured list of facts comes out, and each fact lands as `proposed`. The model can't decide to do anything else. Refreshing a person's profile doc from confirmed facts is the same shape.

**An agent.** The model decides the next step: which tool, with what arguments, whether to ask the user, and when to stop. Your code only runs the loop and executes the tools. circle has two. The investigate job lets a model choose what to search and fetch until it has enough to call `submit_dossier`. And Hermes, steered by circle's skills, runs every chat request.

The same task shows the difference. Take "brief me on An" from Fig. 2. Written as a fixed path, code looks up An, finds two matches, and has to fail or guess. Written as an agent, the model sees two candidates in the result and decides to ask which one. Nobody wrote that branch as code. The skill told the model it was allowed to ask, and the model chose to.

That freedom has a price. An agent's path changes from run to run, so it's harder to test. It spends more tokens, because every step goes back through the window. It can get stuck repeating a failing call, which is why harnesses ship loop guards. And because the model chooses the tool calls, every permission has to be enforced by the tools themselves. My rule now is to use the least agency that solves the task. Promote something to an agent only when you can't know the steps in advance.

## The deterministic core and the agentic edge

Fig. 3 gives you the three kinds. Deciding which kind a feature should be takes four questions, asked in order:

1. Must the same input give the same answer tomorrow? Scores, money, dates, and permissions say yes. That's the core.
2. Can you write the rule down exactly? Then write it as code, even if a model could also do it.
3. Is the input messy human language, or does the task need judgment over open-ended content? That's where a model earns its place.
4. Is a wrong answer cheap to catch and undo? If yes, the model may act. If no, the model proposes, and a person or the core commits.

Here is how circle's pieces sort out:

| Piece                        | Kind                     | Why                                                                     |
| ---------------------------- | ------------------------ | ----------------------------------------------------------------------- |
| Warmth score, radar, cadence | Plain code               | Must match tomorrow, and the rule fits in a formula                     |
| Name lookup                  | Plain code               | Exact matching. Ambiguity comes back as `candidates` instead of a guess |
| Stage and rating changes     | Plain code that proposes | The rule spots fresh evidence or long silence, and I accept or reject   |
| Facts from notes             | Model, fixed path        | Messy language in, fixed shape out, every fact lands as `proposed`      |
| Investigate                  | Agent, bounded           | Open-ended search. It reads untrusted pages, so it gets no write tools  |
| Chat, brief wording, openers | Agent                    | Open-ended asks. Wrong wording is cheap, and nothing is sent on its own |

Two patterns fall out of that table. First, the seam between the edge and the core is always a proposal. Nothing a model produces becomes a fact, a stage, or a sent message until a person or a rule commits it. Second, some features split down the middle. Name lookup is code, and the conversation about which An you meant is the agent. When a feature feels half deterministic, it usually is, so cut it at that line.

The biggest decision is the one circle doesn't make: it has no agent loop of its own. I was tempted to build one inside the Worker. That would have meant writing prompt assembly, tool dispatch, retries, and compaction from scratch, all of which Hermes already does. circle is the core, and the loop belongs to whoever is calling.

## Brain, know-how, hands and memory

Once the core and the edge were separate, every agent integration I looked at had the same three parts. Most of my design confusion came from mixing them up.

![](assets/agent-tuning-layers-fig4-parts.svg)

_Fig. 4: the harness is the brain, skills are the know-how, and circle supplies the hands and the memory._

**The brain** is the model plus the harness that runs the loop. It decides the next step, reads results, talks to the user, and manages the window. It owns no facts and enforces no rules. In circle's case the brain is Hermes, and the model inside it is swappable by config. A good test: swap the model, and only answer quality should change. If anything else breaks, something that belongs in another part leaked into the brain.

**The know-how** is the skills: written judgment the brain loads into its window when a task matches. It covers which tool fits which ask, the order of steps, how to render the answer, and edge cases such as an ambiguous name. Our `circle-brief` skill says: call `circle_brief`; if the result carries `candidates`, ask which person instead of guessing; render one screen; never draft a message or change a stage from here. Know-how is advice, and a model can ignore advice. So anything that must never happen also has to be enforced by the hands.

**The hands and memory** are the tools the brain can call and the durable state behind them. In circle they're one Worker: 32 MCP tools for an admin key, 10 for a reader key, and D1 and R2 holding people, notes, facts, and history. The hands own what's possible, who may do it, input validation, and every deterministic calculation. circle's MCP layer is a thin adapter: each tool call becomes a request to the matching REST route with the caller's key. So the CLI, the web UI, and every agent pass through the same rules. The tools are the only way in, which means no model ever writes to the memory directly.

| Part             | What it is             | Owns                                          | Never owns                | Change it by                               |
| ---------------- | ---------------------- | --------------------------------------------- | ------------------------- | ------------------------------------------ |
| Brain            | Model plus harness     | The next step, the window, the conversation   | Facts, rules, permissions | Config: model, compression, guards         |
| Know-how         | Skills (markdown)      | Procedure, judgment, rendering                | Enforcement               | Edit text, redeploy, start a fresh session |
| Hands and memory | MCP tools plus storage | What's possible, who may do it, facts, scores | Open-ended judgment       | Code and schema changes                    |

The rule I'd keep from this: know-how is a suggestion, and hands are a guarantee. "Never write from a brief" belongs in the skill so the model behaves well. The reader key belongs in the hands so it can't misbehave anyway.

## MCP ships the hands, skills ship the know-how

With the parts named, my second question answered itself. MCP is how you ship the hands to any brain: circle serves a stateless Streamable HTTP endpoint at `POST /mcp`, and any agent that speaks MCP connects with a URL and a key. A skill is how you ship the know-how.

So the answer for Grok is both, and there are two ways in. The cheapest is to make Grok the model inside Hermes. One of our Hermes instances already has a Grok profile, and switching to it changes nothing about tools or skills, because the loop, MCP connection, and skills all belong to the harness. The other way is a separate bot. A bot built on the xAI API can register a remote MCP server as a tool source, so it reaches circle the same way Hermes does. It won't read our `SKILL.md` format, though, so the skill's rules go into its system prompt by hand. The consumer Grok inside X can't attach a custom tool server at all; you need your own bot on the API. Whichever bot you build, give it its own reader-role key. You can revoke one bot alone, and the audit trail shows which bot wrote what.

## The five layers

Now the actual question. I wanted to get better at tool calls and context management, and my first instinct was that this meant opening up Hermes. It doesn't. Here is the stack from cheapest to most expensive.

### Layer 1: MCP tools

The model reads every tool definition on every turn, before the user has typed a word. Tool design is context management from the server side.

I measured ours by calling circle's real `tools/list` handler once per role. An admin key sees 32 tools, and the list costs about 3,300 tokens on every turn. A reader key sees 10 tools for about 760. Least privilege turns out to be a context saving too: the reader list is 76% smaller.

![](assets/agent-tuning-layers-fig5-cost.svg)

_Fig. 5: what circle puts in the window before the user types. Tool definitions stay resident; skill bodies load one at a time._

The breakdown surprised me. Descriptions, the part I'd been polishing, are only 27% of the admin list. Input schemas are 59%. The three largest tools (`circle_profile_add`, `circle_update`, `circle_media_update`) are all schema-heavy update tools with many optional fields. If I wanted to cut the list, I'd split those into narrower tools or move rarely used fields out, before I touched a single description.

The second half of this layer is result size. A `circle_brief` that returns one compact screen keeps the window small. Returning the whole person row, every note, and every fact would flood it on the first call. When a tool result is large, the fix is almost always a narrower tool or a summary field.

### Layer 2: skills

A skill loads only when its trigger matches, so the window carries the playbook for the task at hand and nothing else. The harness keeps just the one-line description of every skill in context, then pulls the full body on demand.

circle ships 13 skills, about 114 KB of markdown or roughly 28,500 tokens if they all loaded at once. The descriptions that stay resident come to about 2,000 tokens. On-demand loading is doing real work here: it keeps a 28k-token playbook down to a 2k-token index. One skill, `circle-due`, is 19% of the whole set on its own, which makes it the first candidate for a split.

This layer has the sharpest edge I've hit. Hermes bakes the list of available skills into a session's system prompt when the session starts, and never rebuilds it on resume. When we retired an MCP integration across our Dwarves desks, 17 chat sessions across 4 desks kept the old roster. The model kept reaching for a capability that no longer existed and burned its whole iteration budget before it gave up. Restarting the daemon did nothing, because the stale prompt lived in the session store. Deleting those sessions fixed it. A skill change is a context change, and a context change only reaches new sessions.

### Layer 3: harness config

This is where the dials for "context management" in the textbook sense live. Our Dwarves Hermes config sets them like this:

```yaml
compression:
  enabled: true
  threshold: 0.5        # compact when the window is half full
  target_ratio: 0.2     # squeeze old turns to about a fifth
  protect_last_n: 20    # never compact the newest 20 messages
```

The same file carries `tool_loop_guardrails`. It warns after 3 failures of the same tool or 2 calls that make no progress, and it would hard-stop at 8 and 5. Reading the file for this post, I found `hard_stop_enabled: false`, so in practice the guard only warns. That's a decision we should make on purpose rather than discover. Our other Hermes instances carry the same compression values but no loop guard at all.

Model choice, enabled toolsets, and the MCP server list live here too, and compaction can run on a cheaper model than the main loop (ours does). None of it needs a rebuild, only a redeploy, and per the layer 2 lesson, a fresh session.

### Layer 4: engine patch

When the config key you need doesn't exist, you change the loop code. We keep a small patch stack against upstream Hermes for exactly this: Discord mention handling, dispatch dedup, treating kanban reads as untrusted input. Each patch has to survive every upstream upgrade, which is real ongoing cost. Reach for this layer only after layers 1 to 3 have run out.

### Layer 5: your own harness

A bare agent loop on a model SDK is about a hundred lines: send messages, get a tool-use block back, run the tool, append the result, repeat. Writing one is the fastest way to understand what a harness does for you. Running production on it means re-solving compaction, retries, approval flows, and session storage. I'd build one to learn and keep it out of the serving path.

## So what is a "long-running agent"?

The term is fuzzy because two different ideas share it. One is task length: an agent that works for hours or days across many steps. The other is durability: an agent that survives its context window filling up and its process restarting. People tend to say "long-horizon" for the first and "durable" for the second.

The test I now use is blunt. If a crash mid-task loses the work, the agent isn't long-running yet; it's a long chat. A long-running agent keeps its real state outside the window, in a database or files, and reloads it after every compaction or restart. Compaction alone doesn't get you there. In Fig. 2 the window crosses the 0.5 threshold on a short task, and whatever the summary drops is gone from the model for good unless it lives somewhere the agent can read back.

By that test, circle is the durable memory a long-running agent would lean on, with no agent of its own. If we build one, the natural shape is a weekly steward that reads the radar, drafts proposals and openers, leaves them for review, and sends nothing.

## A checklist you can run

Copy this against your own agent integration before you touch the harness:

```
[ ] For each AI feature, name who decides the next step. Use the least agency that works.
[ ] Anything that must match tomorrow (scores, money, permissions) is plain code.
[ ] Count the tokens your tool definitions cost per role. Trim the biggest description first.
[ ] Check your largest tool result. Can a narrower tool or a summary field replace it?
[ ] Every write tool returns a proposal, or a human confirms it.
[ ] Untrusted-input agents (web readers) get no write tools.
[ ] Each external bot has its own least-privilege key.
[ ] Each skill description names when it should not fire as well as when it should.
[ ] After a skill or toolset deploy, start fresh sessions; resumed ones keep the old prompt.
[ ] Read your harness's compression and loop-guard settings before you assume you need a patch.
[ ] Durable state lives outside the window, so a restart loses nothing.
```

## Limitations

circle is internal, not public, so you can't run it; the patterns transfer, the code doesn't. Token figures are measured on our tool table on the date above and will drift as tools change. The Grok paths reflect the xAI API as I understand it; check their current docs for the exact MCP field. And everything here assumes a harness like Hermes or Claude Code that already does compaction well. On a thin harness, layer 3 may not exist, and you'll hit layer 4 sooner.
