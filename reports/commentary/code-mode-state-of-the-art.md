---
title: "One tool, one program: inside pi-fabric's code mode"
description: "What code mode is, how pi-fabric runs one program per turn, what a real ten-turn run cost, and when the pattern pays."
date: 2026-10-24
toc: true
draft: true
authors:
  - tieubao
tags:
  - commentary
  - ai
  - agents
  - mcp
slug: code-mode-state-of-the-art
series: harness-engineering
series_part: 10
---

## TL;DR

Code mode is a way of running an agent where the model writes a short program against its tools instead of calling them one at a time. Two loops do the work: an outer loop where the model thinks and writes a program, and an inner loop where a sandbox runs it with no model in it and only the return value comes back. We read the sharpest implementation we know, replayed one of its real runs turn by turn, and traced the same six steps through the versions Cloudflare, Anthropic, OpenAI and two research groups built. Nothing in the inner loop judges whether the code is right; the compiler, the sandbox and the tests the model chooses to run catch what they can, and the model reading the result catches the rest. When a task fans out over many results the saving is large and stays flat as the data grows; on a small code edit it was a tie or a loss. The sandbox contains the program, not the tools it calls, so set approvals first.

## The problem

Agents call tools one at a time through the model, and both the tool list and the data grow with the job. Every request carries both, so cost, latency and error rate grow with them.

Here is the classic loop on one question. An ops person asks: "Of my Cloudflare DNS zones, which don't have [DNSSEC](#ref-4) active?" The [agent](#ref-1) has 102 [tools](#ref-2) and the account has 30 zones.

1. The agent sends the model all 102 tool schemas, about 29,000 tokens, plus the question. The model answers: list the zones.
2. The agent sends the 102 schemas again, plus the 30 zone objects that came back (20 KB of JSON). The model answers: fetch the DNSSEC status for each of these 30 ids.
3. The agent sends the 102 schemas a third time, plus 30 status results (14 KB). The model reads all of them and names the three zones whose status is not active.

![The classic loop at N=30 {#fig-menu-and-loop}](assets/code-mode-state-of-the-art-fig1-menu-and-loop.svg 'The classic loop at N=30. Three requests, each carrying the whole 29k-token menu and every raw result. Every zone object and every status result passes through the model. Numbers from our bench trace.')

What the model reads over the whole task is roughly @eq-loop-cost: every request carries the menu again, plus everything returned so far.

$$
I_{\text{classic}} = \sum_{r=1}^{R} \Big( M + \sum_{k<r} D_k \Big)
$$ {#eq-loop-cost}

where:

- $I_{\text{classic}}$ is the input [tokens](#ref-5) the model reads, summed over the task.
- $R$ is the number of requests, three in the example above.
- $M$ is the menu: every [tool schema](#ref-3), sent on every request.
- $D_k$ is the data request $k$ returned, which rides along on every later request.

Both terms grow with the job. The data grows with the account: in our bench [20] this task took 101,545 input tokens at 10 zones and 233,719 at 100. The menu grows with the product: the 100-tool catalog costs about 29,000 tokens on every request, and the model needed two of those tools.

Code mode, which @sec-what-code-mode-is-two-loops explains, changes the sum to @eq-code-cost: the menu shrinks to one tool and the data never comes back.

$$
I_{\text{code}} \approx R \cdot (M_1 + V)
$$ {#eq-code-cost}

where:

- $M_1$ is one tool's schema plus its guidance, the same size whatever the tool count.
- $V$ is the program's return value, a few lines whatever N is.

As a sanity check, our N=30 runs: the classic loop read 131,236 input tokens, about 87,000 of them the menu three times over; code mode read 6,724.

The error rate grows too. The status result carries no zone id, so the model has to pair 30 results with 30 requests by position. Across our 9 plain runs it got the final answer right 3 times; when we made the result echo its zone id, it went 4 of 4.

So the question: what happens when the model writes the loop once, as a program, and the data never comes back through it?

## What code mode is: two loops

[Code mode](#ref-8) splits an agent's turn into two loops. The outer loop has the model in it. The inner loop does not.

![Two loops: the model thinks, the sandbox runs {#fig-two-loops .live}](assets/code-mode-state-of-the-art-fig2-two-loops.svg 'Two loops: the model thinks, the sandbox runs. The outer loop costs tokens and takes seconds: the model reads the history plus the last result, thinks, and writes one program. The inner loop costs no tokens: a sandbox runs that program, tool calls and all, and only the return value goes back.')

The outer loop is the one you already know. The model gets the conversation so far plus the last result, thinks, and writes one program. This is where the tokens go and where the seconds pass.

The inner loop has no model in it. A [sandbox](#ref-17) runs the program exactly as written: each tool call, each if/else, each for loop. When the program returns, only its return value goes back to the model; everything it read along the way stays in the sandbox. The implementation we read [21] puts the rule in one line of its guidance to the model:

```text {file="fabric-exec-tool.ts" hl="1"}
Return only the compact final value; intermediate results stay in the sandbox.
```

Put the DNSSEC question through it. The model writes, once: list the zones, then for each zone fetch its status, then return the ones that aren't active. The sandbox runs the 30 fetches and hands back three names. The 30 zone objects and 30 status results never pass through the model; in our bench, input tokens stayed near 6,700 at 10, 30 and 100 zones.

**Does the program call other models?** No, by default. One model writes the program, the sandbox runs plain code, and the tools are ordinary: read a file, grep, run a shell command, call an HTTP API. The one exception is a tool that is itself an agent. pi-fabric, the implementation this piece reads [21], lets a program start a [child agent](#ref-14) and wait for it, and a tool you write yourself could call a model inside. The run in @sec-watch-it-work-one-real-run started no child agent, so all ten of its turns ran one model.

Hold on to one more thing. The sandbox is fast and exact, and it is literal. It has no opinion about whether the program is right.

## Who checks the work, who picks the next step

Nothing in the inner loop knows whether the logic is right. Four layers catch mistakes, and only the last one has judgment.

| Layer | When | What it catches | In the defu run |
|---|---|---|---|
| 1. The compiler | before the program runs | code that does not compile: unknown names, wrong argument shapes, syntax slips | no program tripped it; all nine compiled first time |
| 2. The sandbox | while the program runs | exceptions, timeouts, memory overrun | none fired |
| 3. Tests the model runs | inside the program | wrong logic that a test or a type covers | turn 8: tests, 24 of 24; turn 9: type check |
| 4. The model reading the result | after the program returns | what the tests miss | turn 6 found the flag missing in the recursive calls; turn 7 fixed it |

Layers 1 and 2 are mechanical and free. The compiler stops a program that cannot run; the sandbox stops one that runs away. Neither knows what the program was for.

Layer 3 only exists if the model decides to run it. Code mode makes that cheap: the program can run the whole test suite inside the sandbox and return a one-line summary, so the log never costs tokens. In the run below the model did that for the tests and then, unprompted, for the [type check](#ref-10). Across our four code-mode runs the type check ran in 2 of 4; in four plain runs, 0 of 4.

![Turn 8: the test log stays in the sandbox {#fig-output-filter}](assets/code-mode-state-of-the-art-fig3-output-filter.svg 'Turn 8: the test log stays in the sandbox. Layer 3 at work. The program runs the tests and slices the output inside the sandbox; the model reads a 218-character summary, not a log.')

Layer 4 is the only one with judgment, and it is the same judgment the model had before code mode. In the run below the tests passed at turn 8, but the bug that mattered was caught at turn 6, when the model asked for the edited file back and read it. No test covered nesting depth yet. The model did.

So code mode makes running cheap and exact. It does not make the model smarter. A program that implements the wrong idea runs the wrong idea perfectly; only layer 4 stands between that and a wrong answer.

**Who decides what to do next?** Still the model, every time. But there are two kinds of decision. Decisions the model can write down ahead of time go into the program: "for each zone, if its status is not active, keep it". The sandbox runs that decision 30 times, or 100, without asking the model. That is the whole saving. Decisions that need judgment cannot be written ahead: "I have now read this file; what do I change?" needs the program to return so the model can think, and each of those costs an outer-loop turn, exactly as before.

Our two benches sit at the two ends. The DNSSEC question is all pre-decidable, so code mode took 3 model turns at 10, 30 and 100 zones alike. Fixing a library needs judgment at nearly every step, so the defu run took 10 turns and code mode came out roughly a tie: a third fewer turns on the mean of four runs, at 18% more cost.

## Watch it work: one real run

Here is one real session, ten turns, nine programs, every one of which ran. The task: add a named export to a small open-source library so that arrays on both sides of a merge are joined with duplicates removed, at every nesting depth; add a test and a README line; change no existing behavior; run the test suite. A held-out test the agent never saw had to pass afterwards.

The run is from our own bench [22], inside a container that was offline except for the model call. The model was `deepseek-v4-flash` and the library was unjs/defu. The "what the model decided" column is our reading of each program.

![Ten turns: what each program called and how much came back {#fig-turn-strip .live}](assets/code-mode-state-of-the-art-fig4-turn-strip.svg 'Ten turns: what each program called and how much came back. Each turn is one program; the bar is how much text came back into context. Turns 3, 5, 8 and 9 return under 220 characters each because the program filtered its own output.')

| Turn | What the model decided | What the program did | What came back |
|---|---|---|---|
| 1 | Look at the repo | Listed the directory, read the package file and the source, printed all three | 4,011 characters |
| 2 | Read the tests, the types and the README | Read three files and printed them whole | 16,700 characters |
| 3 | Does the README have an API section? How long is it? | One grep (no match) and a line count | 70 characters |
| 4 | Implement the feature | One edit call, four blocks: helper, flag, factory wiring, export | The diff, 4,312 characters |
| 5 | Add the test and the README line | Two edit calls, returned two booleans | 27 characters |
| 6 | Verify the edit | Re-read the source and printed it | 2,584 characters |
| 7 | The flag is not forwarded where the function calls itself; fix that | One edit call, two replace blocks | 1,260 characters |
| 8 | Run the tests | Ran the suite, kept the last 3,000 characters of output | 218 characters: 2 files, 24 tests, passed |
| 9 | Run the type check too | Ran it, printed one word on success | 53 characters: types OK |
| 10 | Done; report | No program | |

Turn 2 is where code mode bought nothing. The model wanted three files in its context, so the program printed them, and 16,700 characters came back. The saving only appears when the program chooses to filter.

Turn 7 decided pass or fail. At turn 4 the model added a flag to the core merge function but did not pass it on in the two places that function calls itself, so dedup would have worked at the top level only, and the held-out test checks nesting depth. The model found this by reading the file at turn 6, not by running a test. The fix was two lines, the two highlighted below:

```ts {file="turn-7.ts" hl="5,7"}
const fix = await pi.edit({
  path: '/work/defu/src/defu.ts',
  edits: [
    { old: '    return _defu(baseObject, {}, namespace, merger);',
      new: '    return _defu(baseObject, {}, namespace, merger, uniqueArray);' },
    { old: '        merger,\n      );',
      new: '        merger,\n        uniqueArray,\n      );' },
  ],
});
```

Turn 8 is the mechanism at its clearest. The program runs the whole test suite inside the sandbox and returns a slice, the highlighted line:

```ts {file="turn-8.ts" hl="2"}
const result = await pi.bash({ cmd: 'cd /work/defu && pnpm vitest run 2>&1', timeout: 180 });
console.log(result.output.slice(-3000));
```

Totals: 19,006 input tokens, 7,014 output tokens, $0.0053 billed, 44.5 seconds. The held-out test passed in a fresh container, 30 tests, exit 0. The type check passed.

Now the same task and model with Pi's ordinary tools and no code mode.

| | Plain Pi | pi-fabric |
|---|---|---|
| Turns | 8 | 10 |
| Tool calls | 9 (read 4, shell 2, edit 3) | 9 programs |
| Tokens in / out | 10,037 / 3,229 | 19,006 / 7,014 |
| Billed cost | $0.0026 | $0.0053 |
| Repo suite and held-out test | pass | pass |
| Type check | fail, never run by the agent | pass, run by the agent |
| Mean of 4: turns / cost | 10 / $0.0039 | 6.5 / $0.0046 |
| Mean of 4: type check | 0 of 4 | 2 of 4 |

![Plain Pi against pi-fabric on the same task {#fig-s1-vs-s2}](assets/code-mode-state-of-the-art-fig5-s1-vs-s2.svg 'Plain Pi against pi-fabric on the same task. Turns and billed cost, this pair of runs and the mean of four. Code mode cut turns by about a third and cost about 18% more on average; on this pair it cost 2x.')

Plain Pi wrote the feature a different way, as a custom merger passed to the factory, and that left a type error it never checked for. The code-mode run threaded a flag through the core function and ran the type check on its own.

Be clear about what did not happen. Over the four code-mode runs there were no child agents, no speculative reads and no compaction requests. On a two-file task the program is mostly a wrapper around one or two tool calls, and the wrapper costs output tokens: 7,014 against 3,229. Wall time swung 3x between runs from provider load, so we don't compare time.

## How pi-fabric builds it

[pi-fabric](#ref-21) is an extension for Pi, a terminal coding agent. Install it and the model's tool list collapses to one entry, named `fabric_exec`, whose argument is a program. Everything else is what happens to that program between the model writing it and the model reading the result, in six steps (@fig-six-steps).

![The six steps of one program, model to model {#fig-six-steps .live}](assets/code-mode-state-of-the-art-fig-six-steps.svg 'The six steps of one program, model to model. The model streams one program. It is checked, run in a sandbox, its tool calls cross one bridge to the host, and one result string comes back. A program that fails the type check returns as text and never runs.')

**Step 1: what the model sees.** One tool. Every other tool, Pi's own and any [MCP](#ref-7) server's, is hidden from the model and exposed instead as a function inside the program. The prompt carries six lines of guidance, a usage paragraph, and a bare list of tool names, about 1,900 tokens; the program fetches descriptions and schemas on demand. Text that changes per turn rides in a message, so the system prefix stays stable for [prompt caching](#ref-6).

**Step 2: repair and type-check.** A repair pass fixes small slips such as an unquoted path, and a repeat guard blocks a program that arrives identical six times in a row. Then the program is compiled with the real TypeScript compiler against a generated declaration of every tool surface. If there are errors nothing runs, and the model gets them back as text:

```text
Type errors; code was not executed:
Line 3:14 - Cannot find name 'pi_read'. Did you mean 'pi'?
```

The gate catches unknown names, wrong argument counts and syntax errors. It does not catch a wrong type by default; that surfaces at runtime instead (appendix).

**Step 3: a fresh sandbox.** Each program gets a new context in [QuickJS](#ref-9), a small JavaScript engine compiled to [WebAssembly](#ref-11) and running inside the Pi process, thrown away when the program ends. It has a memory limit, a stack limit and a deadline. It has no process object, no require, no filesystem, no network and no way to spawn anything; its globals are the tool namespaces, a print function, and timers that are really host timers.

**Step 4: one bridge.** Inside the sandbox the tool namespaces are a [Proxy](#ref-12). A read call in the program becomes one call to a single host function, carrying the tool's name and its arguments as JSON; the host hands back a promise at once, does the work, and resolves the promise with the result as JSON. Only text ever crosses the boundary, and only through that one function. A program that starts several calls at once gets several promises, and the host runs those tools concurrently.

![The call stack of one read {#fig-callstack-single .live}](assets/code-mode-state-of-the-art-fig6-callstack-single.svg 'The call stack of one read. One read from turn 6 of the run above, as a sequence: the model hands over a program, the gate checks it, the sandbox runs it, and the read crosses the sandbox boundary twice, out to the host and back. 2,584 characters come back the same way. Press Step through to follow the messages in order.')

![Three reads in flight {#fig-callstack-fanout .live}](assets/code-mode-state-of-the-art-fig7-callstack-fanout.svg 'Three reads in flight. A sibling run reading three files at once. The sandbox parks on one await; three host pipelines finish out of order at 18, 26 and 32 ms, and the program gets the results in the order it asked for.')

This is the shape Cloudflare argued for when it named the pattern [23]: the sandbox gets a [binding](#ref-18), an object that already knows how to make the call, in place of network access. The credential lives on the host, and the program reaches the shell only through that one function.

**Step 5: the host pipeline.** Every call goes through one pipeline on the host: resolve the name, validate the arguments against the live schema, check the approval rule for the call's risk class, run the real tool, bound the result, write an audit record. Only after the approval check does anything real happen. The defaults surprised us here: there are five risk classes, and all five ship set to allow everything without asking.

**Step 6: what comes back.** The host builds one string for the model: the print logs, then the return value rendered as [YAML](#ref-13), then any runtime error, capped at 50,000 characters. Over the cap, the full text goes to a temp file and the result ends with its path, so the next program can read a range of it. Results the program did not return are never exposed. If a later call fails after earlier ones succeeded, the error names the calls that completed, so the model does not repeat side effects.

**Beyond one call.** On top of that loop sit tool discovery from inside the program, child agents, a speculation tap that starts read-only calls while the program is still streaming in, and model-requested [compaction](#ref-16). None of these fired in the run above.

## How the others build it

Every other code mode we could find walks the same six steps, with different answers at each. The differences that matter are where the code runs and who holds the credentials.

| Step | pi-fabric | Cloudflare Code Mode SDK | Cloudflare Code Mode MCP | Anthropic tool search | Anthropic PTC | OpenAI PTC | smolagents CodeAgent | CodeAct |
|---|---|---|---|---|---|---|---|---|
| 1. What the model sees | one tool; prose guidance; a names-only index (about 1,900 tokens) | one code tool; generated TypeScript declarations in its description | search and execute tools, each taking code (about 1,100 tokens) | a search tool; deferred definitions stay out of the prompt | a code-execution tool; your tools as Python functions | a hosted program tool; your tools as JavaScript functions | a long system prompt; every tool as a Python stub | a ten-line prompt plus Python signatures |
| 2. Discovery | search, describe and call from inside the program | runtime path only: search and describe | model JavaScript filters the OpenAPI spec in the sandbox | regex or BM25, server side; up to 10,000 deferred tools | not documented | top-level search only; not from a running program | none; every tool in every prompt | none; the model may install packages |
| 3. Where the code runs | QuickJS in WebAssembly, in the Pi process; memory, stack and time limits | a V8 isolate on Cloudflare; network blocked; 60 s default | a fresh isolate per call; no filesystem, environment or network | no code | Anthropic container: Python 3.11, 5 GiB, 1 CPU, no internet; 90 s per cell | an OpenAI-hosted V8; no Node, network, filesystem or subprocess | a local AST interpreter ("not a security sandbox") or a remote executor | a Jupyter kernel in Docker, one per session |
| 4. How a call crosses back | a Proxy makes one host call with JSON; the host resolves a promise | a Proxy over Workers RPC to a host dispatcher; JSON back | plain fetch; an outbound handler allows one host and injects the token | no code | the API pauses; your client runs the tool and replies with the result | the same pause and resume; you return the output with the caller copied | local: an in-process Python call; remote: the tool source ships into the sandbox | none; tools are functions in the same interpreter |
| 5. What returns into context | print logs plus the return value as YAML; 50,000-character cap | result and logs; no cap by default; opt-in truncation near 6,000 tokens | the return value as text; about a 6,000-token cap | matching tool definitions, expanded inline | stdout, stderr and return code; intermediate results excluded | a program output with result and status | execution logs plus the last output; 20,000-character truncation | the execution output as the next observation |
| 6. Errors | type errors return without running; runtime errors mapped to model line numbers | a host error rethrown in the sandbox; uncaught means a failure message; no retry | an error flag; scope step-up only when every request was a read | error codes; no match is an empty array | the tool's error string returns into the code; timeout near 4 minutes | guidance only; throw semantics not documented | a retry prompt; 20 steps max | the traceback is the observation |

![The same six steps across eight implementations {#fig-lifecycle-grid}](assets/code-mode-state-of-the-art-fig8-lifecycle-grid.svg 'The same six steps across eight implementations. Where the code runs and how a call crosses back, per implementation. Three families: a local sandbox with a host bridge, a hosted runtime with API pause and resume, and no boundary at all.')

**Cloudflare Code Mode SDK** [23] is the closest cousin: one code tool, a Proxy in the sandbox, a host-side dispatcher, JSON back. The differences: the tool surface is a generated TypeScript declaration in the tool description, so it grows with tool count; the sandbox lives on Cloudflare; no compile gate; no output cap unless you turn one on [24].

**Cloudflare Code Mode MCP** [25] drops the binding. The model's JavaScript calls the network directly, and an outbound handler allows only the Cloudflare API and injects the credential on the way out, so the token "never enters the user code isolate". The one thing pi-fabric lacks is its replay-safe flag: the server tracks whether every request in the program was a read, and offers an automatic scope step-up only then.

**Anthropic tool search** [26] solves half the problem with no code at all: deferred tool definitions stay out of the prompt, the model searches, the API expands the matches inline. The data path through the model is untouched, which is why its saving shrinks with N in @sec-when-it-pays-and-when-it-does-not.

**Anthropic programmatic tool calling** [27] moves the sandbox to Anthropic and leaves the tools with you. When the model's Python calls one of your tools, the response pauses; you run the tool and reply with the result; the final response carries stdout, stderr and a return code. So every inner call is a network round trip to your client, and the intermediate results are never billed as tokens.

**OpenAI programmatic tool calling** [28] is the same pause-and-resume shape in JavaScript. A running program cannot call tool search, so deferred tools must be loaded before the program starts, and the error path is guidance to the developer ("Retry transient failures at most [R] times") with the throw semantics left undocumented.

**smolagents CodeAgent** [29] renders every tool as a Python stub in a long system prompt and runs the model's Python in a local AST interpreter whose own docstring says "It is not a security sandbox". With a remote executor the tools' source ships into the sandbox, so nothing crosses and no credential stays on the host. The error message is a prompt: "Now let's retry: take care not to repeat previous errors!"

**CodeAct** [30] is where the lineage starts: a Jupyter kernel in a Docker container, tools as functions in the same namespace, the traceback as the next observation. No discovery, no boundary, no cap. Everything the later systems added answers one of those three absences.

## What others say about code mode

The public argument is two years old and splits the way our data does. Fourteen voices, grouped by position; quotes are verbatim from the linked pages, entries 31 to 44 in the references.

### Why people favor it

The founding claim is about what models are trained on. Kenton Varda and Sunil Pai, Cloudflare [for](#pill-ok), opened the post that named the pattern (2025-09-26) with "It turns out we've all been using MCP wrong." [31] Pai, principal systems engineer at Cloudflare [for](#pill-ok), sharpened it by 2026-03-13: "models are often better at writing code to use a system than they are at playing the bespoke tool-calling game we built for them". Of the token savings he writes "I do not think it is the most interesting story"; code is the better interface, which makes a safe sandbox the missing primitive [32].

The research line agrees on outcomes. Xingyao Wang and co-authors, CodeAct [for](#pill-ok) (2024-02-01): "CodeAct outperforms widely used alternatives (up to 20% higher success rate)", because JSON or text actions have an "inability to compose multiple tools in a single action" [33]. Ishan Patel, Sahil Sen, Elias Lumer and Vamse Kumar Subbiah [for](#pill-ok) (2026-08-06), on BFCL v4 across 14 models: "programmatic tool calling is a viable and robust alternative to JSON tool calling", matching or beating native calls in 11 of 14 [34].

Practitioners who already distrust MCP like it for a different reason. Simon Willison, independent developer [for](#pill-ok) (2025-11-04), called Anthropic's design "a sensible way to take advantage of the strengths of coding agents" that would "address some of the major drawbacks of MCP as it is usually implemented today", while noting Anthropic "provide no code to execute on it" [35]. Armin Ronacher, developer [for](#pill-ok) (2025-08-18), had already proposed "MCP servers exposing a single tool, that accepts programming code as tool inputs", a stateful interpreter rather than a typed API, and called the idea "not so novel" [36].

### Why people push back

The pushback is about what the savings cost. Anthropic's own engineering post [nuanced](#pill) (2025-11-04) states it plainly: "Running agent-generated code requires a secure execution environment with appropriate sandboxing, resource limits, and monitoring", overhead "that direct tool calls avoid" [37].

Three writers argue the security boundary moves to the wrong place. "Guy", writing for the AWS Heroes publication [against](#pill-warn) (2026-04-27): "sandboxing is not the primary security boundary for code mode", because code allowed to run a destructive call already has the power; code mode is "a long-tail escape hatch", not the front door [38]. David, founder of ContextBolt (AI productivity and SEO tools) [against](#pill-warn) (2026-08-18): "You trade a named, reviewable tool call for a block of code, so the approval prompt gets harder to read, not easier", and the Cloudflare 1.17M-token baseline is "the theoretical cost" of a setup nobody ran [39]. The CodeAct paper's own limits section warns an agent "may potentially break free of the sandbox restriction" [33].

Two argue the problem has a cheaper fix. Mario Zechner, developer [against](#pill-warn) (2025-11-02): "Agents can run Bash and write code well. Bash and code are composable", and he replaced a 21-tool Playwright MCP (13.7k tokens by his count) with a few scripts and a README [40]. David Soria Parra, MCP co-creator [against](#pill-warn), as quoted by ShiftMag (2026-04-16): "People continuously complain about context bloat in MCP and end up blaming MCP for it"; the fix he names is progressive discovery, which is tool search, and the article never mentions code mode [41].

### Where they agree

The vendors' own docs converge on the same cautions. The MCP project's client best practices [nuanced](#pill) (spec 2026-07-28): "Approving the script does not grant blanket approval for every tool call it makes at runtime" [42]. OpenAI's guide [nuanced](#pill): "Use direct tool calling when one call is sufficient, each result requires fresh model judgment, or the work requires approval ...", and keep writes direct "to preserve a clear authorization boundary" [43]. Rizel Scarlett, Staff Developer Advocate at goose, now under the Agentic AI Foundation [nuanced](#pill) (2026-02-06), after her own single-run measurement of 23,339 vs 33,648 tokens: "For simple, single-tool tasks, this overhead is not worth it." [44]

### Our position against theirs

On Varda and Pai's "better at writing code": our DNSSEC bench supports it on correctness, 9 of 9 right in both code modes against 3 of 9 native, because the pairing problem becomes a variable. On the defu run the model also batched four edits into one call and filtered its own test output.

On CodeAct's and Patel's "fewer steps, equal or better success": our code-mode mean was 6.5 turns against 10 for plain Pi, and 2 of 4 type checks passed against 0 of 4. The claim holds here; so does their caveat, since we ran one model.

On Anthropic's "overhead direct tool calls avoid": agreed, and it is bigger than a sandbox. In pi-fabric it is a compile gate, a bridge, a pipeline, an output budget, a trace format, and defaults you must change.

On Guy's and ContextBolt's "the boundary moves": agreed. pi-fabric ships every approval class open, the sandbox contains the JavaScript and not the shell command it asks for, and turn 2 shows a program can still put whatever it likes into context. The approval prompt for a program is harder to read than one for a named delete call; we have no counter to that.

On Zechner's "fewer tools plus scripts": for a coding agent with a shell, we think he is right, and the defu numbers are the evidence. For an agent over an HTTP API with 2,500 endpoints and no shell, the script has to live somewhere, and code mode is where.

On Soria Parra's "tool search is the fix": for the menu, yes. Our bench shows what it leaves behind: 0.75x native cost at N=100, the same mispairing errors, every result still through the model. On Scarlett's "not worth it for simple tasks": our number is 18% on the mean of four and 2x on the pair we showed. Agreed.

## When it pays and when it does not

Code mode pays when a task reads many results to produce a small answer, and it costs when every step needs a fresh judgment. Our two benches are the two cases.

The DNSSEC bench [20] is the easy case: one question, a wide fan-out, a tiny answer. A mock Cloudflare account with N zones, 100 distractor tools, the model `claude-sonnet-5-5`, three repeats per cell, and four ways to expose the same two tools.

| Mode | Input tokens, N=10 | Input tokens, N=100 | Cost USD, N=10 | Cost USD, N=100 | Correct, 9 runs |
|---|---|---|---|---|---|
| native | 101,545 | 233,719 | 0.211 | 0.551 | 3 of 9 |
| tool search | 26,212 | 159,424 | 0.061 | 0.415 | 6 of 9 |
| Anthropic PTC | 10,305 | 10,536 | 0.023 | 0.023 | 9 of 9 |
| DIY code mode | 6,732 | 6,729 | 0.016 | 0.016 | 9 of 9 |

![Input tokens against zone count for the four modes {#fig-tokens-vs-n}](assets/code-mode-state-of-the-art-fig9-tokens-vs-n.svg 'Input tokens against zone count for the four modes. Input tokens per task against zone count, log scale. Native and tool search climb with N; both code modes are flat. Means over 3 runs; the full matrix is in the appendix.')

Three readings. Tool search cuts the menu and nothing else, so its saving shrinks as results dominate: 0.29x native cost at N=10, 0.75x at N=100. The two code modes are flat because the zone data never enters the model. The six wrong answers in 36 runs all came from the two modes where the model reads the results itself. And Anthropic's [PTC](#ref-19) was flat in tokens, not in requests: a sequential loop at N=100 took 102 requests and about 150 seconds, since each inner call is a round trip to the client.

Now the costs, four of them.

**The sandbox is not the boundary you think.** The sandbox contains the program's JavaScript. The tools it calls run with the host's rights: a shell call is a real shell, an MCP server runs with its own privileges, a child agent is a real process. pi-fabric's architecture doc says this plainly: "Hiding a tool schema optimizes context. It does not sandbox anything", and "Type checking improves reliability. It is not a security boundary" [21]. Its README does not. The MCP guidance adds the exfiltration angle: "Tool results from one server are untrusted input to another ... output truncation alone does not prevent exfiltration" [42]. With approvals shipped open, a poisoned tool result can steer the next program, and that program can chain many effects before anyone looks.

**Debugging moves inside the program.** A failed native call is one structured error. A failed program is a runtime error mapped to the model's line numbers, and the inner calls are invisible unless you open the trace. Budget for reading those before the first incident.

**Tiny tasks lose.** On the defu task code mode cost 2x on the pair we showed and 18% more on the mean of four. Anthropic's PTC cost 8% more on τ²-bench [27]. Code mode wins when the data that would otherwise pass through the model is large relative to the answer; a two-line edit has no such data.

**Sequential loops don't shrink.** A dependent chain still needs one model turn per decision, and in a hosted runtime each inner call is a network round trip to your client. Our sequential PTC run at N=100 took about 150 seconds against 5 for the local sandbox.

## Verdict and checklist

For an agent that fans out over an API, code mode is the right default and the six steps in @sec-how-pi-fabric-builds-it are the ones to copy. For a coding agent on small tasks, pi-fabric buys batching, output filtering and a self-check loop, at a cost in output tokens and with its headline features idle. Turn the approvals on before the model does.

Which approach for my agent:

- [ ] Under 10 tools and small results: stay native.
- [ ] A long tool list: turn on tool search. It fixes the menu and nothing else.
- [ ] Tasks that read many results to produce a small answer: code mode.
- [ ] Results that don't echo their identifier: native fan-out has a pairing risk; a program doesn't.
- [ ] A real isolate with credentials outside it: build or adopt a local code mode. Otherwise a hosted one, with a round trip per inner call.
- [ ] Before shipping: approvals per risk class, inner calls logged, output capped and validated.
- [ ] One or two small calls: skip it.

## Appendix: Source notes

Everything source-level the body leaves out, as tables. Identifiers live in the Where column; a fenced block shows actual code.

### Bench setup

| Setting | The defu run | The DNSSEC bench |
|---|---|---|
| Harness | `pi-stack-trial` Phase 2 [22] | `code-mode-bench` [20] |
| Task | add `defuUniqueArray` to `unjs/defu` at v6.1.7 (commit `82632b6`), test, README line, run `pnpm vitest run` | find zones without DNSSEC active in a mock Cloudflare account answering instantly |
| Model | `deepseek-v4-flash` via NeuralWatt | `claude-sonnet-5-5` |
| Versions | Pi 1.0.4, pi-fabric 0.109.3 | DIY sandbox on `node:vm`, a convenience and no boundary |
| Environment | Apple container, offline except the model call | 100 distractor tools; PTC distractors deferred, PTC container time not costed |
| Runs | S1-baseline and S1-rep1 to rep3 (plain Pi); S2-fabric and S2-rep1 to rep3 (pi-fabric); the run shown is S2-fabric | three repeats per cell, N in 10, 30, 100, four modes; 36 main-matrix runs |
| Acceptance | held-out test in a fresh container: 3 files, 30 tests, exit 0; type check `tsgo --noEmit`, exit 0 | correct zone list |
| Cost | $0.0053 billed for S2-fabric; 122,880 cache-read tokens | $5.38 total |
| Trace source | `README.md` and session traces in `lab/runs/`; fan-out timings from the S2-rep1 trace | `README.md`, `results/summary.md` and four `results/trace-*-n30.md` files |

### The defu run, per turn

| Turn | Tokens in | Tokens out | Characters back | Note |
|---|---|---|---|---|
| 1 | 3,782 | 136 | 4,011 | three sequential reads |
| 2 | 1,691 | 142 | 16,700 | whole files printed |
| 3 | 5,591 | 1,816 | 70 | 9.3 s of model time, the design turn |
| 4 | 277 | 2,580 | 4,312 | one edit, four blocks |
| 5 | 3,984 | 706 | 27 | two edits, two booleans |
| 6 | 870 | 79 | 2,584 | re-read, the read in @fig-callstack-single |
| 7 | 839 | 587 | 1,260 | the recursion fix |
| 8 | 1,086 | 95 | 218 | vitest, last 3,000 chars kept |
| 9 | 249 | 351 | 53 | type check, `settle: true` so a nonzero exit would not throw |
| 10 | 637 | 522 | none | final report, no program |

Turn 4, trimmed to the two blocks that matter:

```ts
const src = await pi.edit({
  path: '/work/defu/src/defu.ts',
  edits: [
    { old: 'function _defu<T>(baseObject: T, defaults: any, namespace = ".", merger?: Merger): T {',
      new: 'function unique<T>(array: T[]): T[] {\n  return array.filter((item, index) => array.indexOf(item) === index);\n}\n\nfunction _defu<T>(\n  baseObject: T,\n  defaults: any,\n  namespace = ".",\n  merger?: Merger,\n  uniqueArray = false,\n): T {' },
    { old: '      object[key] = [...value, ...object[key]];',
      new: '      object[key] = uniqueArray\n        ? unique([...value, ...object[key]])\n        : [...value, ...object[key]];' },
    /* createDefu gains a uniqueArray parameter */
    /* export const defuUniqueArray = createDefu(undefined, true) */
  ],
});
```

Turn 9:

```ts
const t = await pi.bash({ cmd: 'cd /work/defu && pnpm test:types 2>&1', timeout: 180, settle: true });
console.log(t.exitCode === 0 ? 'types: OK' : t.output.slice(-2000));
```

| Run | Reads | Started at | Finished at | Turns | Type check |
|---|---|---|---|---|---|
| S2-fabric | sequential awaits | +4, +15, +25 ms | in order | 10 | pass |
| S2-rep1 | `Promise.all` of three reads, turns 1 and 2 (@fig-callstack-fanout) | +5, +5, +6 ms | +18 (test), +26 (src), +32 (README) ms | 6 | pass |
| S1-baseline | plain Pi tools | | | 8 | fail, `TS2322`, never run by the agent |

Trace drops: 3 to 5 values per program.

### pi-fabric source, per lifecycle step

Read at commit [`ee558be9`](https://github.com/fabric-runtime/pi-fabric/tree/ee558be9ed9d3483a119d7d1772c3d1efa106ced) (v0.120.0, 2026-10-23); the bench ran v0.109.3 at `b74d6fd9`. The six steps are the same in both.

| File | Change between v0.109.3 and v0.120.0 |
|---|---|
| `quickjs-runtime.ts` | +21 / -2 |
| `execution-service.ts` | +25 / -11 |
| `fabric-exec-tool.ts` | +3 / -3 |
| `system-guidance.ts`, `type-checker.ts`, `speculation/*`, `compact-controller.ts`, `output-budget.ts` | unchanged |

**Step 1: what the model sees**

| What we checked | What the source does | Where |
|---|---|---|
| The one tool | registers a single model-visible tool whose argument is a program | [fabric-exec-tool.ts:152](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/fabric-exec-tool.ts#L152) |
| Default mode | "full code mode" is the shipped default | [config.ts:486](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/config.ts#L486) |
| Where other tools go | every other registered tool moves under a hidden-declarations list; inside the program Pi's tools are `pi.read`, `pi.bash`, `pi.edit` and so on, MCP servers are `mcp.<server>.<tool>`, other extensions are `extensions.<name>` | [tool-ownership.ts:23-47](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/core/tool-ownership.ts#L23-L47) |
| Schema shape | a code string plus a few scalars (`payloads`, `resultFormat`, `timeoutMs`, `maxOutputTokens`, `display`), no extra properties allowed; a comment says strong models "can invent trailing keys at the highest-entropy point of a nested escaped-JSON field", so there are no nested arrays of objects | [fabric-exec-tool.ts:203-264](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/fabric-exec-tool.ts#L203-L264) |
| The guidance text | six guideline lines, a usage paragraph, a names-only roster; the comment says "the standing prompt cost is a bare name index. Descriptions and schemas are on demand through tools.list/search/describe." | [system-guidance.ts:74-114](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/core/system-guidance.ts#L74-L114) |
| The one-line rule quoted in @sec-what-code-mode-is-two-loops | "Return only the compact final value; intermediate results stay in the sandbox." | [fabric-exec-tool.ts:176](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/fabric-exec-tool.ts#L176) |
| The 1,900-token figure | our count of the static string literals at those lines, about 7.5 KB at the 4-characters-per-token estimate the repo uses; the dynamic parts (names roster, folded guidelines from hidden tools) grow with your setup; we did not run Pi to measure the live prompt | same lines |
| Cache stability | turn-varying text rides a message, not the system prompt | [extension.ts:1096-1122](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/extension.ts#L1096-L1122) |

**Step 2: repair and type-check**

| What we checked | What the source does | Where |
|---|---|---|
| Repair pass | fixes unquoted paths and Unicode quotes before compiling | [guest-code-repair.ts:325-335](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/guest-code-repair.ts#L325-L335) |
| Repeat guard | warns at three identical programs in a row, blocks at six; the comment says it was written after a model burned a session on 220 identical no-op shell calls | [repeat-guard.ts:5-12](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/repeat-guard.ts#L5-L12) |
| Compile | wraps the body in an async main function and compiles with the real TypeScript program API against a generated declaration file covering every tool surface, live MCP schemas included; emits JavaScript plus a source map used to remap runtime traces | [type-checker.ts:114-160](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/type-checker.ts#L114-L160) |
| Error return | errors go back as text flagged as an error; nothing runs | [fabric-exec-tool.ts:970-993](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/fabric-exec-tool.ts#L970-L993) |
| What the gate filters | a set of type-correctness diagnostics (property-missing 2339, assignability 2322 and 2345, null checks, implicit-any) is dropped unless a flag is set, and the tool passes it off; strict mode is off | [type-checker.ts:35-40](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/type-checker.ts#L35-L40), [typescript-kernel.ts:31](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/typescript-kernel.ts#L31) |
| Runtime fallback | a method call on a result envelope is caught at runtime by a Proxy that throws a readable TypeError | [quickjs-runtime.ts:204-228](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/quickjs-runtime.ts#L204-L228) |

![The gate: repair, type-check, transpile {#fig-type-gate}](assets/code-mode-state-of-the-art-figa1-type-gate.svg 'The gate: repair, type-check, transpile. Code that fails to compile returns as text and never runs. The gate checks names and shapes; type mismatches are filtered out by default.')

**Step 3: the sandbox**

| What we checked | What the source does | Where |
|---|---|---|
| Lifetime | a fresh context per call, disposed in a finally block | [quickjs-runtime.ts:884](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/quickjs-runtime.ts#L884), [:1277](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/quickjs-runtime.ts#L1277) |
| Memory limit | 64 MiB | [config.ts:499](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/config.ts#L499) |
| Stack limit | 256 KiB | [quickjs-runtime.ts:899](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/quickjs-runtime.ts#L899) |
| Deadline | 120 s default, 900 s max; enforced by an engine interrupt handler and a host timer racing the program promise; it can only grow (a per-call timeout, known slow host calls, a paused approval prompt) | [config.ts:494-495](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/config.ts#L494-L495), [quickjs-runtime.ts:900-909](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/quickjs-runtime.ts#L900-L909) |
| No process object | a test asserts it is undefined inside the guest | [quickjs-runtime.test.ts:427-434](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/tests/quickjs-runtime.test.ts#L427-L434) |
| Bridge removal | the injected host function is deleted from the guest global object once captured | [quickjs-runtime.ts:82](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/quickjs-runtime.ts#L82) |
| Guest globals | `pi`, `tools`, `mcp`, `extensions`, `memory`, `state`, `compact`, `agents`, `mesh`, `print`, `π` for payloads, and `setTimeout` shims that are host timers | same file |

![A fresh QuickJS context with limits and no escape {#fig-quickjs-box}](assets/code-mode-state-of-the-art-figa2-quickjs-box.svg 'A fresh QuickJS context with limits and no escape. The guest has memory, stack and time limits, a fixed set of globals, and no filesystem, network or process. The bridge function is removed after capture.')

**Step 4: the bridge**

| What we checked | What the source does | Where |
|---|---|---|
| The Proxy | normalizes arguments (aliases, positional forms, numeric strings) and forwards one call with a string ref and JSON | [quickjs-runtime.ts:98-103](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/quickjs-runtime.ts#L98-L103), [:229-267](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/quickjs-runtime.ts#L229-L267) |
| The host function | reads the ref, dumps the arguments out of the engine as JSON, creates an engine promise and returns its handle at once; on success serializes the result, parses it inside the guest, resolves, and pumps pending jobs; on failure builds a guest error and rejects | [quickjs-runtime.ts:1003-1077](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/quickjs-runtime.ts#L1003-L1077) |
| Serialization | JSON only: dates, maps, functions and undefined inside objects do not survive; non-finite numbers become null | same function |
| Concurrency | several pending handles become concurrent host tasks in a task set; a test proves the fan-out | [quickjs-runtime.test.ts:56-81](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/tests/quickjs-runtime.test.ts#L56-L81) |

The guest-side path of one call:

```text
pi.read(x)  →  Proxy get "read"  →  __call("pi.read", args)
            →  await __fabricBridge("pi.read", args)  →  __fabricHostCall(ref, JSON)
```

The call stack behind @fig-callstack-single, nine frames in push order, with what happens as each pops:

| Frame | Pushed | Popped |
|---|---|---|
| 1 | the model emits the tool call; Pi validates and repairs the arguments | the model sees one result string |
| 2 | the tool's execute function begins ([fabric-exec-tool.ts:844](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/fabric-exec-tool.ts#L844)) | logs and YAML value formatted under the 50,000-character cap |
| 3 | repair and type-check | hands JavaScript plus a source map onward, pops at once |
| 4 | the runtime opens a fresh context | the context is disposed |
| 5 | the transpiled main function starts inside the guest | the program ends |
| 6 | the read call hits the Proxy | the await returns, the program runs its second line |
| 7 | the host function carries ref and JSON across the WASM boundary, returns a promise handle | the text crosses back as JSON and the job queue resumes the guest |
| 8 | the registry runs the host pipeline | the result is bounded to 2,000,000 characters |
| 9 | Pi's own read tool reads the file | the file text returns |

In @fig-callstack-fanout, three handles exist before any host work finishes, the guest parks on a single await, each completion resolves its own promise and pumps the job queue, and the combined promise settles on the third with the results in call order.

**Step 5: the host pipeline**

| What we checked | What the source does | Where |
|---|---|---|
| One pipeline | resolve, guard, prepare, validate, approve, invoke, post, for every kind of tool | [action-registry.ts:850-1157](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/core/action-registry.ts#L850-L1157) |
| Pi tools | the provider builds Pi's own tool definitions and replays Pi's native tool lifecycle | [pi-tools-provider.ts:288-297](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/providers/pi-tools-provider.ts#L288-L297) |
| MCP and agents | MCP goes through mcporter; an agent call spawns a child process | same registry |
| Failure semantics | a failed core call throws into the guest; a nonzero shell exit throws unless the program asked to settle | same registry |
| Approval classes | five risk classes (read, write, execute, network, agent), each allow, ask, auto or deny; shipped default allow for all five | [config.ts:504-510](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/config.ts#L504-L510) |
| The two sentences quoted in @sec-when-it-pays-and-when-it-does-not | "Hiding a tool schema optimizes context. It does not sandbox anything" and "Type checking improves reliability. It is not a security boundary" | [architecture.md:129-132](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/docs/architecture.md#L129-L132) |

```text
resolve   parse "pi.edit", find the descriptor, suggest near names on a miss
guard     full-code-mode check, per-execution agent budget
prepare   provider fixes + learned argument repairs
validate  JSON-schema check of args against the live schema
approve   allow | ask | auto | deny
invoke    speculation hit? serve it : run the real tool
post      result middleware, bound to 2,000,000 chars, audit record
```

![The host pipeline every call passes through {#fig-host-pipeline}](assets/code-mode-state-of-the-art-figa3-host-pipeline.svg 'The host pipeline every call passes through. Resolve, validate, approve, invoke, bound. The approve stage defaults to allow for every risk class.')

**Step 6: what comes back**

| What we checked | What the source does | Where |
|---|---|---|
| Result string | print logs, then the return value as YAML, then any runtime error line; multiline strings hoisted out of the YAML under path headers | [fabric-exec-tool.ts:921-1010](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/fabric-exec-tool.ts#L921-L1010) |
| Cap | 50,000 characters, or four times the requested output tokens if smaller; 20,000 on failure | [config.ts:500](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/config.ts#L500) |
| Overflow | the full text goes to a mode-0600 temp file; the visible text keeps head and tail and ends with the path | same function |
| Partial failure | the error text lists the completed refs so the model does not repeat side effects | same function |

```text
[Full output (183,402 chars) saved to: /tmp/pi-fabric-output-….txt]
```

![The return path: logs, YAML value, a 50k cap, overflow to a file {#fig-return-path}](assets/code-mode-state-of-the-art-figa4-return-path.svg 'The return path: logs, YAML value, a 50k cap, overflow to a file. Only what the program prints or returns comes back, capped at 50,000 characters. Overflow lands in a file the next program can read by range.')

**Beyond one call**

| Feature | What the source does | Where |
|---|---|---|
| Namespaces | search, describe and call for discovery; recall over past sessions; hypothesize, verify and commit for evidence-gated edits; a mesh of shared topics; workflow and parallel helpers over child agents | [quickjs-runtime.ts:439-735](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/quickjs-runtime.ts#L439-L735) |
| Child agents | run is spawn then wait: a separate Pi process in RPC mode with its own program tool, reporting back through files the manager polls | [manager.ts:1500-1520](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/agents/manager.ts#L1500-L1520) |
| [Speculation](#ref-15) | a stream tap watches the code field as it arrives and launches any completed literal-argument call from a closed set of 21 read-only actions; take-once store, 180 s TTL, invalidated by any effectful call; on by default | [eligibility.ts:9-31](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/speculation/eligibility.ts#L9-L31) |
| Compaction | the program records an intent and touches nothing; the host commits it when the agent settles; "The model cannot compact the running context directly. It can only ask." | [compact-controller.ts:111-132](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/core/compact-controller.ts#L111-L132) |
| Entropy and repairs | a silent spell-checker for tool arguments, bounded by "the result must pass the original schema"; neither hides a tool nor narrows a schema | [entropy.md](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/docs/entropy.md) |

### Doc-vs-source findings

| Docs say | Source does | Where |
|---|---|---|
| README: "TypeScript is statically checked before execution" | true in the narrow sense: type-correctness diagnostics are filtered out and strict mode is off, so a wrong type passes the gate and fails at runtime | [type-checker.ts:35-40](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/runtime/type-checker.ts#L35-L40) |
| README: "Guardrails: Approvals, isolation, timeouts", reading as protective by default | all five approval classes ship as allow; nothing prompts until you tighten | [config.ts:504-510](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/config.ts#L504-L510) |
| Default config sample: output cap 100,000 characters | the source default and the architecture doc both say 50,000 | [config.ts:500](https://github.com/fabric-runtime/pi-fabric/blob/ee558be9ed9d3483a119d7d1772c3d1efa106ced/src/config.ts#L500), `docs/configuration.md` |

### Lifecycle grid, identifiers behind the plain-words cells

Read from source files and API docs fetched on 2026-10-24 ([23] to [30]); "not documented" means we looked and the page or repo does not state it. Cells the grid shortens: prompt size is not documented for the Cloudflare SDK, Anthropic tool search, Anthropic PTC and OpenAI PTC; runtime limits are not documented for the two Cloudflare sandboxes, OpenAI PTC, remote smolagents executors and CodeAct; output caps are not documented for Anthropic PTC, OpenAI PTC and CodeAct; the Cloudflare MCP console channel is not documented.

| Implementation | Identifiers | Source |
|---|---|---|
| Cloudflare Code Mode SDK | the docs say the single-tool pattern "works well when the generated type declarations fit comfortably"; the opt-in cap is `truncateResult`; files read: `src/shared.ts`, `src/executor.ts`, `src/run-code.ts` | [23] |
| Cloudflare Code Mode MCP | tools `search` and `execute` (now also `docs`, `whoami`); outbound handler `globalOutbound`; flag `replaySafe`; cut marker `--- TRUNCATED ---`; files read: `src/tools/search.ts`, `src/tools/execute.ts`, README | [25] |
| Anthropic tool search | result blocks `tool_reference`; error type `tool_search_tool_result_error` | [26] |
| Anthropic PTC | tool `{"type": "code_execution_20260120", "name": "code_execution"}`; tools marked `"allowed_callers": ["code_execution_20260120"]`; pause as a `server_tool_use` block plus a `tool_use` block tagged `caller: {type: "code_execution_20260120", tool_id: "srvtoolu_…"}` and a top-level `container: {id}`; the reply may hold only `tool_result` blocks; result `code_execution_tool_result`; about 4 min gives `TimeoutError` in stderr | [27] |
| OpenAI PTC | a `program` item with an opaque `fingerprint`; `function_call` items tagged `caller: {type: "program"}`; `function_call_output` with the `caller` copied; `program_output {result, status}`; "An already-running program cannot invoke tool search" | [28] |
| smolagents | print buffer 50,000; `max_steps` 20; executors e2b, modal, docker, blaxel; files read at `main` on 2026-10-24: `src/smolagents/prompts/code_agent.yaml`, `local_python_executor.py`, `remote_executors.py`, `agents.py`, `memory.py` | [29] |
| CodeAct | Jupyter in Docker per session | [30] |

### The DNSSEC bench, full matrix

Means over 3 runs per cell. Anthropic's PTC overhead figure in @sec-when-it-pays-and-when-it-does-not, 8% on τ²-bench, is from its own docs [27].

| Mode | N | API requests | Model turns | Input tokens | Cost USD | Correct |
|---|---|---|---|---|---|---|
| native | 10 | 3.0 | 3.0 | 101,545 | 0.211 | 0/3 |
| native | 30 | 3.0 | 3.0 | 131,236 | 0.293 | 1/3 |
| native | 100 | 3.0 | 3.0 | 233,719 | 0.551 | 2/3 |
| tool search | 10 | 3.0 | 3.0 | 26,212 | 0.061 | 1/3 |
| tool search | 30 | 3.0 | 3.0 | 56,362 | 0.146 | 2/3 |
| tool search | 100 | 3.0 | 3.0 | 159,424 | 0.415 | 3/3 |
| Anthropic PTC | 10 | 9.0 | 2.0 | 10,305 | 0.023 | 3/3 |
| Anthropic PTC | 30 | 22.3 | 2.0 | 10,430 | 0.023 | 3/3 |
| Anthropic PTC | 100 | 69.0 | 2.0 | 10,536 | 0.023 | 3/3 |
| DIY code mode | 10 | 3.0 | 3.0 | 6,732 | 0.016 | 3/3 |
| DIY code mode | 30 | 3.0 | 3.0 | 6,724 | 0.016 | 3/3 |
| DIY code mode | 100 | 3.0 | 3.0 | 6,729 | 0.016 | 3/3 |

### Limitations

| Area | Limit |
|---|---|
| pi-fabric read | one commit, a shallow clone; prompt bytes counted from source strings, the live prompt never measured |
| Lifecycle grid | docs and source read on one day; "[not documented](#pill-warn)" cells may be documented elsewhere or change next release |
| The defu run | one run per cell, one small task, one model; wall times swung 3x on provider load |
| The DNSSEC bench | one task, one model, three repeats; a mock that answers instantly; PTC distractors deferred, container time not costed; the DIY sandbox is no boundary |
| Voices | quotes what each page says; not a survey |
| Reproducibility | both harnesses live in a private Dwarves repository (`experiments/pi-stack-trial`, `experiments/code-mode-bench`); no public URL |

## References

1. **Agent**: A program that puts a language model in a loop: the model reads a goal, chooses an action (usually a tool call), the program runs it and feeds the result back, until the model answers.
2. **Tool**: A function the agent's host can run on the model's behalf: read a file, call an API, run a shell command. The model asks for it by name with JSON arguments.
3. **Tool schema**: The definition sent to the model for one tool: name, description, and a JSON Schema of its input. Every schema in the `tools` array is serialized into the prompt.
4. **DNSSEC**: DNS extensions that cryptographically sign zone data so resolvers can verify it. A zone has it active, pending, or disabled.
5. **Token**: The unit a model API bills by, roughly four characters of English or code. Input tokens are everything sent on a request; output tokens are what the model writes.
6. **Prompt caching**: A provider feature that reuses the processed prefix of a prompt across requests at a lower price. Changing the prefix invalidates it.
7. **MCP**: Model Context Protocol, an open protocol for connecting tools and data sources to a model host. A server exposes tools via `tools/list`; a host calls them via `tools/call`.
8. **Code mode**: Exposing tools to a model as a programming API and letting it write and run a program against them, in place of one tool call per step. Named by Cloudflare in 2025.
9. **QuickJS**: A small, embeddable JavaScript engine. pi-fabric runs a WebAssembly build of it inside the Pi process, one fresh context per program.
10. **Type check**: Compiling TypeScript without running it, to catch unknown names, wrong argument shapes and syntax errors before execution.
11. **WebAssembly (WASM)**: A portable binary format that runs in a sandboxed virtual machine; here it hosts the QuickJS engine inside Node.
12. **Proxy**: A JavaScript object that intercepts property reads and calls. pi-fabric uses one so that `pi.read(...)` becomes a call to the host bridge.
13. **YAML**: A human-readable data format. pi-fabric renders a program's return value as YAML by default so the model reads structure, not JSON punctuation.
14. **Child agent**: A separate agent process started by a program, given a task, and awaited. In pi-fabric a child is another Pi process with its own `fabric_exec`.
15. **Speculation**: Starting a read-only tool call before the program that contains it has finished arriving from the model, so tool latency overlaps generation time.
16. **Compaction**: Summarizing the conversation so far to free context-window space. Model-requested compaction lets the program ask for it at the next safe point.
17. **Sandbox**: An isolated execution environment for untrusted code, with no access to the host's filesystem, network, or secrets unless explicitly provided.
18. **Binding**: A live object handed into a sandbox that performs an action on the host's behalf. The sandbox calls it like a function; the host holds the credentials.
19. **Programmatic tool calling (PTC)**: Anthropic's and OpenAI's name for provider-side code mode: the model writes code in a provider-hosted runtime, and tool calls made by that code are routed back to your client.
20. **code-mode-bench**: Our DNSSEC harness, `experiments/code-mode-bench` in a private Dwarves repository with no public URL. Settings, run counts and result files are in the appendix bench-setup table.
21. **pi-fabric source**: [fabric-runtime/pi-fabric at commit ee558be9](https://github.com/fabric-runtime/pi-fabric/tree/ee558be9ed9d3483a119d7d1772c3d1efa106ced) (v0.120.0, 2026-10-23). The bench ran v0.109.3 at `b74d6fd9`; the file-level diff between the two is in the appendix.
22. **pi-stack-trial**: Our Phase 2 bench, `experiments/pi-stack-trial` in the same private repository. Task on `unjs/defu` at commit `82632b6`; runs, model and trace sources are in the appendix bench-setup table.
23. **Cloudflare Code Mode SDK**: [Cloudflare blog: Code Mode, the better way to use MCP](https://blog.cloudflare.com/code-mode/) (2025-09-26); [the codemode package in cloudflare/agents](https://github.com/cloudflare/agents/tree/main/packages/codemode). Files read are listed in the appendix.
24. **Cloudflare Code Mode API reference**: [Code Mode API reference](https://developers.cloudflare.com/agents/tools/codemode/api-reference/), the documented options of the SDK, including its opt-in output truncation.
25. **Cloudflare Code Mode MCP**: [Cloudflare blog: Code Mode MCP](https://blog.cloudflare.com/code-mode-mcp/) (2026-02-20); [cloudflare/mcp server source](https://github.com/cloudflare/mcp). Files read are listed in the appendix.
26. **Anthropic tool search tool**: [Claude docs: Tool search tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/tool-search-tool); launch post [Anthropic engineering: Advanced tool use](https://www.anthropic.com/engineering/advanced-tool-use) (2025-11-24).
27. **Anthropic programmatic tool calling**: [Claude docs: Programmatic tool calling](https://platform.claude.com/docs/en/agents-and-tools/tool-use/programmatic-tool-calling) (status `ga`); container limits from [Claude docs: Code execution tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool). The background essay is entry 37.
28. **OpenAI programmatic tool calling**: [OpenAI docs: Programmatic tool calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling); [OpenAI docs: Tool search](https://developers.openai.com/api/docs/guides/tools-tool-search).
29. **smolagents**: [huggingface/smolagents](https://github.com/huggingface/smolagents), read at `main` on 2026-10-24. Files read are listed in the appendix.
30. **CodeAct**: Wang et al., [Executable Code Actions Elicit Better LLM Agents, arXiv 2402.01030](https://arxiv.org/abs/2402.01030), ICML 2024; [reference implementation xingyaoww/code-act](https://github.com/xingyaoww/code-act).
31. **Kenton Varda and Sunil Pai**: Cloudflare, 2025-09-26. [Code Mode, the better way to use MCP](https://blog.cloudflare.com/code-mode/).
32. **Sunil Pai**: principal systems engineer at Cloudflare, 2026-03-13. [sunilpai.dev: after WIMP](https://sunilpai.dev/posts/after-wimp/).
33. **Xingyao Wang and co-authors**: the CodeAct paper, 2024-02-01. [Executable Code Actions Elicit Better LLM Agents, arXiv 2402.01030](https://arxiv.org/abs/2402.01030).
34. **Ishan Patel, Sahil Sen, Elias Lumer and Vamse Kumar Subbiah**: the BFCL v4 study across 14 models, 2026-08-06. [arXiv 2608.06370, programmatic tool calling on BFCL v4](https://arxiv.org/abs/2608.06370).
35. **Simon Willison**: independent developer, 2025-11-04. [Code execution with MCP](https://simonwillison.net/2025/Nov/4/code-execution-with-mcp/).
36. **Armin Ronacher**: developer, 2025-08-18. [Your MCP doesn't need 30 tools: it needs code](https://lucumr.pocoo.org/2025/8/18/code-mcps/).
37. **Anthropic engineering**: the vendor's engineering blog, 2025-11-04. [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp).
38. **"Guy"**: writer for the AWS Heroes publication on dev.to, 2026-04-27. [Code Mode for MCP: the long-tail escape hatch, not the front door](https://dev.to/aws-heroes/code-mode-for-mcp-the-long-tail-escape-hatch-not-the-front-door-40ga).
39. **David**: founder of ContextBolt, AI productivity and SEO tools, 2026-08-18. [ContextBolt: Code Mode MCP](https://contextbolt.com/blog/code-mode-mcp/).
40. **Mario Zechner**: developer, 2025-11-02. [What if you don't need MCP at all?](https://mariozechner.at/posts/2025-11-02-what-if-you-dont-need-mcp/).
41. **David Soria Parra**: MCP co-creator, as quoted by ShiftMag, 2026-04-16. [MCP co-creator explains why MCP needs more than the protocol to scale](https://shiftmag.dev/mcp-co-creator-explains-why-mcp-needs-more-than-the-protocol-to-scale-9041/).
42. **The MCP project**: client best practices, spec 2026-07-28. [Client best practices](https://modelcontextprotocol.io/docs/2026-07-28/develop/clients/client-best-practices).
43. **OpenAI**: the programmatic tool calling guide. [Programmatic tool calling](https://developers.openai.com/api/docs/guides/tools-programmatic-tool-calling).
44. **Rizel Scarlett**: Staff Developer Advocate at goose, now under the Agentic AI Foundation, 2026-02-06. [8 things you didn't know about Code Mode](https://goose-docs.ai/blog/2026/02/06/8-things-you-didnt-know-about-code-mode/).
