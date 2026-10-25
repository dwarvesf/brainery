---
title: "Owner agents, plain functions: where the model sits in our ops estate"
description: "Give each domain one owner agent that reports back, keep the steps as plain functions, and add autonomy to a running platform one gated decision at a time."
date: 2026-10-25
toc: true
authors:
  - tieubao
tags:
  - commentary
  - ai
  - agents
  - automation
slug: owner-agents-and-functions
type: writing
form: analysis
topic: ai-agents
fit: 3
abstract: "Papers, vendor guides and public deployments from 2024 to 2026 mostly agree that an agent should own the outcome, the judgment and the report, while deterministic functions own known steps, long chains and every side effect. The split holds from incident response to sales, the public pullbacks cut staff before anyone measured quality, and our own estate of about 88 scheduled jobs and 10 LLM agents showed the failures the evidence predicts, including 12 processes writing ticket state with no owner. This post gives a ladder for picking the right rung for a job and a seven-step path for bringing agents into a platform you already run."
---

I wanted to run our operations the way I run a team. I hand a goal to someone who owns it, they come back with a report, and I never read the steps. With LLM agents that idea is tempting, because an agent with a role and its own tools looks a lot like a staff member. So before we turned more of our scripts into agents, I read what the papers, the vendor guides and the framework authors say about when that works.

The short answer is that delegation to agents is right at the edge and wrong in the middle. Each domain gets one agent that owns the outcome and reports back to me. The work inside that domain stays as deterministic functions the agent calls. The evidence punishes agents split along an org chart, several writers on one artifact, and a model running where a script would give the same answer. We had all of those in our own estate.

![Owner agent and its tools {#fig-owner}](assets/owner-agents-and-functions-fig1-owner-and-tools.svg 'Owner agent and its tools. I delegate a goal to one owner agent per domain, it calls functions and read-only helpers, and the shared boards, ledgers and files hold the memory.')

## Actors that report, or functions that run

The actor model treats each agent as a colleague with its own role and memory: you delegate, it decides, it reports back. The function model keeps the work as deterministic workflows that do the same thing on every run, with a model called only where a step needs judgment.

Each model makes a bet. The actor model bets that the agent remembers what happened last month, gets each step right often enough to be left alone, and coordinates cleanly with the other actors. The function model bets that someone can write the steps down, that the inputs fit a schema, and that a change in the work is a code edit.

The actor picture holds up well at the edge of a domain:

- **Ownership.** One named agent answers for an outcome, which is how a manager already thinks about work.
- **Judgment.** Messy input, unclear rules and open-ended search are where a model beats a rule set [6].
- **Reporting.** A plain-language summary of what happened is the most natural interface a person can get.

It breaks in the middle, where the work happens:

- **Memory.** Agent memory systems lose about 30% on long interactions [20], and every tested model degrades as its context grows [18].
- **Reliability.** Small per-step error rates compound over long chains, which @sec-when-a-workflow-wins works through.
- **Multiple writers.** Agents that each write to the same artifact are the most repeated failure in the multi-agent literature [7] [16].

So I keep the actor at the edge and functions in the middle: the owner agent is the actor, and everything it calls is a function.

## What separates an agent from a workflow

A workflow runs a path someone wrote down in advance. An agent picks its own path, one tool call at a time, in a loop, and decides when it is done.

That is the line Anthropic draws in its guide to building agents [1], and Simon Willison's working definition says the same thing in fewer words: an agent is a model running "tools in a loop to achieve a goal" [3]. Harrison Chase at LangChain points out that real systems sit on a spectrum between the two ends [2]. I found it useful to name the rungs, because "should this be an agent" is too coarse a question to answer.

- **L0, function.** A cron script or plain function. Same input, same output.
- **L1, workflow with one typed LLM step.** Code runs the path, and one step asks a model for structured output that code then validates and writes.
- **L2, owner agent.** One agent with tools and a bounded loop, owning one domain.
- **L3, owner plus read-only helpers.** The owner spawns helpers that search or review in a clean context and return a summary. Only the owner writes.
- **L4, peer agents.** Several agents that each write and negotiate with each other. Nothing we run should sit here.

## What each model costs you

The owner agent buys flexibility and a natural interface for a manager. The function buys repeatability, a near-zero cost per run, and failures that announce themselves.

Table: Owner agent against function or workflow {#tbl-pros-cons}

| Property                | Owner agent                       | Function or workflow        |
| :---------------------- | :-------------------------------- | :-------------------------- |
| Handles new situations  | Yes                               | No, fails loudly            |
| Same input, same output | No                                | Yes                         |
| Cost per run            | High, grows with context          | Near zero                   |
| Debugging               | Read traces                       | Read code and logs          |
| Interface for a manager | Delegate, get a report            | Read a dashboard            |
| Failure mode            | Silent and confident              | Loud and specific           |
| Memory                  | Weak inside; strong in files      | State in a store by design  |
| Audit                   | Only what you log                 | Event history, replayable   |

The audit row is the one teams notice last. A durable workflow engine records every step and can replay a run from its history [40]. An agent leaves a trace only if you built the logging around it, which is one more reason to keep its side effects inside functions that log by design.

## When an agent earns its cost

An agent earns its cost when the next step depends on what the last step found, when the work spreads wide and only reads, or when the input is messy enough that rules would be unwieldy. Outside those cases you are paying for flexibility you don't use.

The open path is the defining case. If I can't tell you the steps before the run starts, a fixed workflow has nothing to encode [1]. OpenAI's practical guide reserves agents for complex decisions, unwieldy rule sets and unstructured data, and says plainly that otherwise "a deterministic solution may suffice" [6].

Breadth-first research is where the biggest number comes from. Anthropic's lead agent with parallel subagents beat a single agent by 90.2% on its internal research eval [4]. Read the cost line in the same post before copying the design: the multi-agent system used about 15 times the tokens of a chat, and token use alone explained 80% of the variance in performance [4].

Decomposable work also gains. Kim and colleagues at Google and MIT measured multi-agent setups gaining up to 80.8% on finance tasks that split into independent parts [5].

A clean-context reviewer is the cheapest win I found. Cognition reports that a reviewer agent with fresh context finds about two bugs per pull request from their coding agent, and about 58% of those are severe [7]. The reviewer reads and reports. It never writes the code it reviews.

## When a workflow wins

A workflow wins when you can write the steps down today or when the chain is long, and it should always own money and irreversible state. Fixed flows cost less and fail loudly where an agent fails quietly.

The accuracy result surprised me most. Agentless solved 32% of SWE-bench Lite at an average of $0.70 per issue with no agent loop at all [8]. AlphaCodium's fixed flow nearly doubled GPT-4's accuracy on competitive programming [9]. Kumar and colleagues found hand-built workflows beat dynamically planned ones on both cost and accuracy [10].

Reliability is the stronger argument, and it is plain arithmetic. If each step succeeds with probability p and the task needs H steps in a row, the whole chain succeeds with probability:

$$ P_{\text{chain}} = p^{H} $$ {#eq-chain}

where:

- p is the chance that one step succeeds on its own
- H is the number of steps that must all succeed
- P chain is the chance that the whole run succeeds

At 95% per step, a 20-step task finishes 36% of the time. At 99% per step it finishes about 82% of the time, and at 90% it drops to about 12% (@fig-chain). Steps are rarely independent in practice, and the dependence runs the wrong way: errors grow once the model sees its own earlier mistakes in context [11].

![Chain reliability by step count {#fig-chain}](assets/owner-agents-and-functions-fig3-chain-reliability.svg 'Chain reliability by step count. Success of a chain of H steps at three per-step rates, with 20 steps at 95% marked at 36%.')

Benchmarks that demand consistency show the same shape. On the retail half of tau-bench, success fell from about 61% on one try to about 25% when all eight tries had to pass [12]. METR puts the public frontier at about 12 hours of human-equivalent work at 50% success, but only about 1.5 hours at 80% success [13]. If your job has to work every night, the 80% line is the one that matters.

Sequential, tightly coupled work is the clearest loss for multi-agent designs. In the same Kim study that found the finance gain, every multi-agent variant lost between 39% and 70% on sequential planning [5]. CooperBench found two coding agents working together succeed about 30% less often than one agent alone [14]. Fu and colleagues compared six multi-agent systems against a single agent, and five of them trailed it, one while using 4.34 times the tokens [15].

## Why multi-agent setups fail

Multi-agent setups mostly fail by design: unclear specifications, agents that disagree about who does what, and nobody checking the result. The model's raw ability is rarely the bottleneck.

MAST, from Berkeley, sorted more than 1,600 multi-agent traces into 14 failure modes under three groups: specification, misalignment between agents, and verification [16]. That framing changed how I read our own incidents.

Unchecked chains amplify errors. Kim and colleagues measured independent agents amplifying errors 17.2 times, while a central orchestrator cut that to 4.4 times [5].

Parallel writers are the failure everyone repeats. Cognition argued in 2025 against building multi-agent systems at all [17], and their 2026 follow-up keeps the core of it: setups work when writes stay single-threaded and extra agents add intelligence rather than actions [7].

![Evidence scoreboard {#fig-evidence}](assets/owner-agents-and-functions-fig4-evidence-scoreboard.svg 'Evidence scoreboard. Change from adding agents, by task type: gains on breadth-first research and decomposable finance, losses on sequential planning and two-agent coding.')

The gains in @fig-evidence come from read-heavy work that splits cleanly. The losses come from work where each step depends on the last, or where two agents edit the same thing.

Context and memory are weaker than the "agent as staff member" picture assumes. Chroma tested 18 models and every one degraded as input grew, even on easy retrieval [18]. Multi-turn conversations lose 39% on average against the same task given in one turn [19]. Memory that matters belongs in files, boards and ledgers the agent reads, where you can inspect it.

Tool overload is the last trap. Shopify found tool choice turning unclear somewhere past a few dozen tools [21], and Anthropic now lists tool confusion as one of the few good reasons to split an agent at all [22].

## How to decide for your own job

Walk your job down the ladder in @fig-ladder and stop at the first rung that holds. Most jobs stop at L0 or L1.

![Decision ladder {#fig-ladder}](assets/owner-agents-and-functions-fig2-decision-ladder.svg 'Decision ladder. Questions route a job to a rung from L0 function to L3 owner plus helpers, with L4 peer agents dimmed as the rung to avoid.')

The rules underneath come straight from the sources. Start with one LLM call, then one agent with tools, and add agents only after a measured gain [1] [6] [21]. Split an agent only for context isolation, tool overload or conflicting instructions [6] [22]. Keep one writer per artifact [7] [23]. Verify with rules before you reach for an LLM judge [24].

Copy this list and run it against the job you're thinking of turning into an agent:

- [ ] Can I write the steps down today? If yes, this is a workflow. Go to the next question; otherwise skip to the money question.
- [ ] Is any input free text, or does any step need a judgment call? If no, it is an L0 function or cron job. If yes, it is an L1 workflow with one typed LLM step that code validates.
- [ ] Does it touch money or irreversible state? If yes, the agent proposes and code plus a human execute.
- [ ] Does the work fit in one context, with no read-only parts that could run in parallel? If yes, it is an L2 owner agent.
- [ ] Does it overflow one context, or split into parallel parts that only read? Then it is L3, an owner with read-only helpers that return summaries.
- [ ] Does anything other than the owner write to its board, ledger or files? If yes, turn that writer into a tool the owner calls.
- [ ] Does it run often, and is the usual answer "nothing changed"? Then a script watches and wakes the agent only on a change.
- [ ] Is a second agent planned because of a new role name or topic? Fold it back in unless context size, tool count or a trust boundary forces the split.
- [ ] Do I have an eval that shows the agent beats the script on this job? If not, run the script and build the eval first.

## Does this hold outside ops?

Yes, as far as the public cases go. In every domain I checked, the agent owns the search, the draft or the recommendation, and code or a person owns the step with a side effect.

Table: Who owns what, by domain {#tbl-domains}

| Domain               | Agent owns                       | Stays deterministic              | Case                   |
| :------------------- | :------------------------------- | :------------------------------- | :--------------------- |
| Incident response    | Hypotheses, root-cause drafts    | Paging, escalation, runbook runs | Datadog, PagerDuty     |
| IT ops               | Routine ticket triage and fixes  | Change policy, approvals, audit  | ServiceNow             |
| Customer support     | Routine answers                  | Refunds, policy, human handoff   | Klarna, CBA            |
| Finance, back office | Invoice coding, approval advice  | Matching, limits, ledger posting | Ramp                   |
| Sales and HR         | Research, qualification, drafts  | Sending, CRM writes, rejections  | Vercel, McHire         |
| Software engineering | The code change                  | CI, tests, merge gate            | Stripe                 |

**Incident response.** Datadog's SRE agent forms root-cause hypotheses and tests each one against telemetry, and Datadog evaluates it on real incidents its teams labeled, without publishing an accuracy number [27]. PagerDuty's SRE agent runs diagnostics and suggests remediation, and runs the fix on approval [28]. incident.io's guide tells teams to backtest on 5 to 10 closed incidents and aim for precision above 80% with recall near 60% [29].

**IT ops.** ServiceNow says about 90% of its own internal IT tickets now resolve with no human, and that 85% of the people who did that work moved to other teams [30]. Those are a vendor's numbers about its own product. Change policy, approvals and the audit trail stay in the platform.

**Customer support.** This is the mixed one. Klarna's launch release claimed 2.3 million chats in the first month, the work of 700 agents, resolution time down from 11 minutes to under 2, and repeat inquiries down 25%, all company numbers [31]. In May 2025 its CEO reportedly told Bloomberg that cost had been weighted too heavily and quality had dropped, and Klarna disputes calling that a reversal. Commonwealth Bank of Australia cut 45 call-centre jobs after launching a voice bot, then reversed the cut within weeks and called its own decision an error [32].

**Finance and back office.** Ramp's AP agent codes invoices and recommends approvals, and Ramp claims about a 90% acceptance rate on those recommendations without defining acceptance [33]. The three-way match, payment limits and posting to the ledger stay in code.

**Sales and HR.** Vercel took its inbound sales development team from 10 people to 1, after six weeks of shadow mode in which its top rep reviewed every output [34]. The agent drafts and a person presses send. HR shows the other risk: McDonald's hiring chatbot exposed up to 64 million applicant records because an admin account around it used the password "123456" [35]. The failure was in the plumbing around the agent.

**Software engineering.** Stripe merges over 1,000 agent-written pull requests a week, every one reviewed by a person [36]. Fixed git, lint and test steps sit between the agent's steps, CI gets at most two rounds before the run stops, and each agent works in an isolated dev box.

The wins that lasted all keep an approval or a deterministic gate at the point where the side effect happens. The two pullbacks share the opposite shape: headcount went first, and quality got measured after.

## What we changed in our own estate

Our estate already had the failures the papers describe, and the fix was to give every board one owner and push everything else down to functions. Our working rule, which the evidence backs, is that jobs own detection, money, state and scheduling, and agents own judgment and text.

For scale, our home lab plus the Dwarves ops estate runs about 88 scheduled job labels, 24 Worker crons, and about 10 LLM agents: a set of desk agents and one orchestrator. Most of the jobs are plain L0 scripts: backups, probes, tunnels, data loads. Those stay as they are.

Two findings hurt.

The first was ticket state. A live audit found 12 processes that could change the state of a ticket on our boards, and none of them owned it. A sweep revived a ticket I had already dropped, and a sync job archived tickets addressed to an agent. In MAST terms that is a misalignment failure with no verification step [16]. The move is one owner per board. A recovery job that closes incidents on its own will propose a close instead, and the owner agent decides. The other writers become tools the owner calls, or they lose write access.

The second was cost. A sweep ran the orchestrator's model every 15 minutes, and each tick spent between 15,000 and 90,000 tokens, including the ticks where nothing had changed. That is a model running where a script gives the same answer. The move is a script that polls the inbox and wakes the agent only when a new ticket arrives.

One pattern worked well enough to become the template for new work. Our triage crews run as L1 workflows: code gathers the input, the model returns JSON against a schema, and code validates and writes the result. This is the 12-factor shape, "mostly deterministic code, with LLM steps sprinkled in" [23], and it is the easiest of our model-backed jobs to debug.

The rest of the mapping is smaller:

- The orchestrator stays a hub with spokes. It is the central checker that cut error amplification in the Kim study [5].
- The finance desk proposes payments and never executes them. The money path stays in code with a human gate.
- Each desk split gets checked against the rule. A split for a different audience or a different data boundary stays. A split by topic alone folds back in.
- Our log-sweep session writes fixes in an isolated branch. It gets a fresh-context review pass before merge, the pattern Cognition measured [7].

I should be honest about status. These moves are decided and partly in flight, and I don't have before and after numbers yet. When the sweep runs on a trigger instead of a timer, the token count per day is the number I'll report.

## How to bring agents into a platform you already run

Grow the agent around the old system one decision at a time, and keep the legacy path in charge until the numbers say otherwise. Autonomy goes up a level only when an eval shows the current level works.

The shape is the strangler fig pattern from Microsoft's architecture guidance: a facade routes each request either to the legacy path or to the new one, and rollback stays possible until the legacy part is retired [37]. For agents, the tool layer is that facade.

The autonomy levels come from Feng, McDonald and Zhang at the Knight First Amendment Institute, who name each level after the human's role [39]. Autonomy rises in this order. As operator the human decides and the agent assists. As collaborator the two share the work. As consultant the agent leads and consults the human. As approver the agent acts and asks for approval on high-risk steps. As observer the human only watches, and the agent runs with full autonomy. Read-only and shadow runs sit at operator. One gated action is approver. Observer comes last, and only on evidence. The authors warn that the approver level fails quietly when people rubber-stamp what they are shown.

![Migration path {#fig-migration}](assets/owner-agents-and-functions-fig5-migration-path.svg 'Migration path. A legacy workflow gains an agent one decision at a time, from read-only and shadow runs at operator level to one gated action at approver level, with observer reached only on evidence.')

The sequence the sources support:

1. **Pick one decision point**: choose one narrow decision inside a workflow you already run, and keep the legacy path as the authority for it [37].
2. **Wrap what you have as tools**: turn existing scripts and APIs into typed, least-privilege tools the agent calls. Stripe routes its agents through one shared tool server with more than 400 tools [36].
3. **Build the eval set first**: collect closed cases with known answers and set precision and recall targets before the agent runs, as incident.io's backtest guide does [29].
4. **Run read-only, then shadow**: stay at operator level while a person grades every output for a fixed period and compares it with what people decided. Vercel ran six weeks of shadow mode [34].
5. **Enable one reversible action behind a gate**: move that one action to approver level, gate every irreversible action, and cap retries. PagerDuty runs a fix on approval [28], and Stripe stops after two CI rounds [36].
6. **Keep orchestration deterministic**: the agent is one node that returns control, and durability, audit and replay stay in the engine. Camunda calls the agent "a process step with brains" [38], and Temporal runs model calls as activities inside deterministic workflow code [40].
7. **Expand only on measured evidence**: track false approvals and rubber-stamping, and hold headcount until quality is proven. Klarna and Commonwealth Bank show what happens in the other order [31] [32].

The sweep change in our estate is step 6 in miniature: a script owns the schedule and hands the agent control only when there is work.

## Where the evidence is thin

No source I read compares an agent against a pipeline on the same business task, head to head. Every number above comes from a specific benchmark in a specific domain, and the multi-agent results flip sign depending on whether the task decomposes. Use them to pick what to test on your own job.

Much of the practitioner evidence comes from vendors, and vendors have a stake. Anthropic sells the tokens a multi-agent system burns, Cognition sells a coding agent, and LangChain sells a framework. The domain cases lean the same way: ServiceNow, Klarna, Ramp and Vercel report their own results, and Datadog publishes no accuracy number at all. I weighted those below the papers and kept them where an independent result points the same way.

The sources also disagree on the default. LangChain now tells builders to start with an agent harness and drop down to graphs only when they need control [25]. The 12-factor authors and OpenAI say start deterministic [23] [6]. Dex Horthy described shutting down an unreviewed agent coding setup after four months of production breaks [26]. I lean toward the deterministic default because our jobs run unattended and touch money, and a team doing mostly interactive research might reasonably lean the other way.

Our own numbers are aggregate and partial. Our estate is one team's lab, the fixes are recent, and the token figure is a range from one sweep. I'm publishing it with those gaps marked.

## What to read

If you read one book on this, read Victor Dibia's *Designing Multi-Agent Systems* (2025). It treats workflows as a first-class option and covers when a single agent wins. Dibia built AutoGen, so expect that lean.

The rest of the shelf, in the order I'd read it:

- **Chip Huyen, *AI Engineering* (O'Reilly, 2025)**: evals, cost and latency. Without evals you can't tell whether an agent beats a script.
- **Sinan Ozdemir, *Building Agentic AI* (Addison-Wesley, 2025)**: runs from workflows to agents, the same order as this question. Few reviews yet.
- **Matthew Skelton and Manuel Pais, *Team Topologies*, 2nd edition (IT Revolution, 2025)**: narrow roles, clear interfaces and cognitive load, the best template I know for the "agents as staff" idea.
- **Michael Nygard, *Release It!*, 2nd edition (Pragmatic, 2018)**: timeouts, circuit breakers and bulkheads, which is where the deterministic guardrails go.

## References

1. **Anthropic, Building effective agents**: engineering guide that separates workflows from agents, 2024-12. [Building effective agents](https://www.anthropic.com/engineering/building-effective-agents).
2. **Harrison Chase, LangChain**: essay placing agentic systems on a spectrum, 2025-04. [How to think about agent frameworks](https://blog.langchain.com/how-to-think-about-agent-frameworks/).
3. **Simon Willison**: working definition of an agent as tools in a loop, 2025-09. [I think agent may finally have a widely enough agreed upon definition to be useful jargon now](https://simonwillison.net/2025/Sep/18/agents/).
4. **Anthropic, multi-agent research system**: lead agent with parallel subagents, 90.2% gain and token costs, 2025-06. [How we built our multi-agent research system](https://www.anthropic.com/engineering/built-multi-agent-research-system).
5. **Kim et al., Google and MIT**: controlled study of multi-agent gains and losses by task type, 2025-12. [arXiv 2512.08296](https://arxiv.org/abs/2512.08296).
6. **OpenAI, practical guide**: when to build an agent and when a deterministic solution suffices, 2025. [A practical guide to building agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf).
7. **Walden Yan, Cognition**: single-threaded writes and clean-context review in production, 2026-04. [Multi-Agents: What's Actually Working](https://cognition.com/blog/multi-agents-working).
8. **Xia et al., Agentless**: fixed pipeline on SWE-bench Lite with no agent loop, 2024. [arXiv 2407.01489](https://arxiv.org/abs/2407.01489).
9. **Ridnik et al., AlphaCodium**: flow engineering for code generation, 2024. [arXiv 2401.08500](https://arxiv.org/abs/2401.08500).
10. **Kumar et al.**: hand-built against dynamically planned workflows on cost and accuracy, 2026. [arXiv 2606.00189](https://arxiv.org/abs/2606.00189).
11. **Sinha et al.**: long-horizon execution and errors that grow from self-conditioning, ICLR 2026. [arXiv 2509.09677](https://arxiv.org/abs/2509.09677).
12. **Yao et al., tau-bench**: tool-agent benchmark with the pass-all-k consistency metric, 2024. [arXiv 2406.12045](https://arxiv.org/abs/2406.12045).
13. **METR, frontier risk report**: time horizons at 50% and 80% success, 2026-05. [Frontier Risk Report](https://metr.org/blog/2026-05-19-frontier-risk-report/).
14. **CooperBench, Stanford**: two cooperating coding agents against one, 2026-01. [arXiv 2601.13295](https://arxiv.org/abs/2601.13295).
15. **Fu et al.**: six multi-agent systems compared with a single agent on accuracy and tokens, 2026. [arXiv 2606.05670](https://arxiv.org/abs/2606.05670).
16. **Cemri et al., MAST**: taxonomy of 14 multi-agent failure modes from 1,600+ traces, 2025. [arXiv 2503.13657](https://arxiv.org/abs/2503.13657).
17. **Walden Yan, Cognition**: the case against parallel multi-agent writers, 2025-06. [Don't Build Multi-Agents](https://cognition.ai/blog/dont-build-multi-agents).
18. **Chroma, context rot**: 18 models tested on retrieval as input length grows, 2025. [Context Rot](https://research.trychroma.com/context-rot).
19. **Laban et al.**: LLMs get lost in multi-turn conversation, ICLR 2026. [arXiv 2505.06120](https://arxiv.org/abs/2505.06120).
20. **Wu et al., LongMemEval**: benchmark for long-term memory in chat assistants, 2024. [arXiv 2410.10813](https://arxiv.org/abs/2410.10813).
21. **Shopify Engineering, Sidekick**: lessons on tool count and multi-agent timing from a production agent, 2025-08. [Building production-ready agentic systems](https://shopify.engineering/building-production-ready-agentic-systems).
22. **Anthropic Applied AI**: when to fold subagents into one agent loop and when a split still pays, 2026-10. [When to fold subagents into your main agent loop](https://claude.com/resources/articles/building-agents-when-to-fold-subagents-into-your-main-agent-loop).
23. **HumanLayer, 12-factor agents**: principles for production LLM software, 2025. [12-factor agents](https://github.com/humanlayer/12-factor-agents).
24. **Anthropic, Claude Agent SDK**: agent loop design and rule-based verification before LLM judges, 2025-09. [Building agents with the Claude Agent SDK](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk).
25. **LangChain**: guidance to start with an agent harness and add graphs for control, 2026-08. [Deep Agents vs LangChain vs LangGraph](https://www.langchain.com/blog/deep-agents-vs-langchain-vs-langgraph).
26. **Gergely Orosz with Dex Horthy, The Pragmatic Engineer**: an unreviewed agent coding setup shut down after production breaks, 2026-07. [Context engineering with Dex Horthy](https://newsletter.pragmaticengineer.com/p/context-engineering-with-dex-horthy).
27. **Datadog, Bits AI SRE**: hypothesis-test loop over telemetry, evaluated on labeled real incidents, 2026-01. [How we built an AI SRE agent that investigates like a team of engineers](https://www.datadoghq.com/blog/building-bits-ai-sre/).
28. **PagerDuty, SRE Agent**: diagnostics and suggested remediation that runs on human approval, 2025-10. [PagerDuty H2 2025 release](https://www.pagerduty.com/blog/product/product-launch-2025-h2/).
29. **incident.io**: backtesting AI root-cause analysis on closed incidents with precision and recall targets, 2026-02. [AI root cause analysis: accuracy testing guide](https://incident.io/blog/ai-root-cause-analysis-accuracy-testing-guide).
30. **CX Today, ServiceNow**: a vendor running agentic AI on its own IT and HR service desks, 2026-05. [ServiceNow ran agentic AI on itself](https://cxtoday.com/servicenow-ran-agentic-ai-on-itself-heres-what-happened).
31. **Klarna**: company launch numbers for its AI customer service assistant, 2024-02. [Klarna AI assistant handles two-thirds of customer service chats in its first month](https://www.klarna.com/international/press/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month/).
32. **ABC News, Commonwealth Bank**: 45 call-centre job cuts after a voice bot, reversed and called an error, 2025-08. [Commonwealth Bank backtracks on AI job cuts](https://www.abc.net.au/news/2025-08-21/cba-backtracks-on-ai-job-cuts-as-chatbot-lifts-call-volumes/105679492).
33. **Ramp, AP agents**: vendor launch of invoice coding and approval recommendation agents, 2025-10. [AP just became autonomous](https://ramp.com/blog/ramp-ap-agents-announcement).
34. **SaaStr, Vercel**: inbound sales development team moved from 10 people to 1 behind a lead agent, 2026-01. [Vercel took a 10-person SDR team down to 1](https://www.saastr.com/vercel-took-a-10-person-sdr-team-down-to-1-the-whole-thing-costs-5000-a-year-with-vercels-coo-jeanne-dewitt-grosser/).
35. **TechCrunch, McHire**: hiring chatbot admin account protected by the password 123456, 2025-07. [AI chatbot's simple 123456 password risked exposing data of McDonald's job applicants](https://techcrunch.com/2025/07/11/ai-chatbots-simple-123456-password-risked-exposing-personal-data-of-millions-of-mcdonalds-job-applicants/).
36. **Alistair Gray, Stripe**: unattended coding agents with deterministic steps, human review and isolated dev boxes, 2026-02. [Minions: Stripe's one-shot, end-to-end coding agents](https://stripe.dev/blog/minions-stripes-one-shot-end-to-end-coding-agents).
37. **Microsoft Azure Architecture Center**: the strangler fig pattern for incremental migration behind a facade. [Strangler Fig pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/strangler-fig).
38. **Joyce Johnson, Camunda**: deterministic process logic with the agent as one bounded step, 2026-01. [Guardrails and best practices for agentic orchestration](https://camunda.com/blog/2026/01/guardrails-and-best-practices-for-agentic-orchestration/).
39. **Feng, McDonald and Zhang, Knight First Amendment Institute**: five autonomy levels named after the human's role, 2025-07. [Levels of Autonomy for AI Agents](https://knightcolumbia.org/content/levels-of-autonomy-for-ai-agents-1).
40. **Temporal**: deterministic workflow code with model and tool calls as replayable activities, 2025-11. [Of course you can build dynamic AI agents with Temporal](https://temporal.io/blog/of-course-you-can-build-dynamic-ai-agents-with-temporal).
