---
draft: true
title: 'Field Report: Future of Software Engineering Europe 2026, verification is the new bottleneck'
description: 'Source: Thoughtworks report "The Future of Software Engineering", retreat findings from Engelberg, Switzerland, June 28-30 2026 (40 sessions, senior technologists, CTOs, architects, consultants)'
date: 2026-09-27
slug: field-report-future-of-software-engineering-retreat-europe
---

## Field Report: Future of Software Engineering Europe 2026, verification is the new bottleneck

Source: Thoughtworks report "The Future of Software Engineering", retreat findings from Engelberg, Switzerland, June 28-30 2026 (40 sessions, senior technologists, CTOs, architects, consultants). Shared in #ai-tech by 0xm.

Report: https://www.thoughtworks.com/content/dam/thoughtworks/documents/report/tw_future_of_software_engineering_europe_2026.pdf
Share: https://discord.com/channels/462663954813157376/1284063844314120224/1545956999693606993

Disclaimer: draft only, not published. Han runs the promotion gate.

## TL;DR

Code generation is no longer the hard part of AI-era software engineering. Verification is. Agents can write code, specs, tests and infrastructure faster than teams can trust the output, so the winning discipline is cheap, fast, human-legible verification, not more generation. Around that, the report says: harness engineering is becoming its own discipline, junior engineers are losing their apprenticeship path, boards expect 10x while engineers see 2-3x, and legacy modernization is the clearest near-term value pool.

Five headline findings, all recurring across sessions:

1. Verification, not generation, is the bottleneck.
2. Harness engineering is emerging as an ownable discipline.
3. Apprenticeship is in crisis; juniors lose the path to judgment.
4. The executive/engineer expectation gap is a bigger risk than any model limitation.
5. Legacy modernization is the most defensible near-term value pool.

## Verification, not generation, is the new bottleneck

The single most repeated observation: agents produce code, tests, specs and infrastructure far faster than any team can establish trust in it. The quote that frames it: "Engineering is now distilled down to how do I describe the goal, how do I verify I've reached the goal."

Concrete patterns from the sessions:

- A new testing vocabulary is emerging: constraint tests (single input/output tests that box in what an agent may generate), scenario tests, and good/bad logs (derived from real production incidents). Custom approval-testing rigs built in hours beat generic BDD frameworks, partly because they keep the human-reviewable surface simple and hard for an agent to game.
- A layered trust-verification stack is forming for high-stakes migration: characterization tests (behavioral capture from the legacy system), then symbolic execution (mathematically grounded, not AI-generated), then production back-tests against real data flows.
- Mixed deterministic/non-deterministic evaluation is the practical answer to LLM-as-judge unreliability. One team combined linters and pattern-matching with a three-model "council of judges", raising first-pass merge acceptance from roughly 60% to 80%.
- Manual code review is being questioned. No one in the room could cite data on how many defects manual review actually catches, a "status quo illusion" the report says needs evidence.
- "Conformance tests matter a lot more than the spec. If the conformance tests differ from the spec, guess which one wins?"

## Harness engineering is becoming a distinct discipline

As models commoditize, the scaffolding around a model (context management, deterministic guardrails, skills, self-improving feedback loops) is what differentiates good agentic engineering from bad.

Measured results cited in sessions:

- One organization reported an effective harness cut token usage by at least 4x and materially increased output determinism.
- A refactoring experiment: a raw linter resolved code smells to under 50%, while linter output translated into deterministic step-by-step refactoring instructions (habit hooks) reached roughly 90%.
- A smaller model with a good harness outperformed a larger model with a weak one.
- Best teams do not hand-write harnesses. They let agents fail, run a learn skill that reflects on each session and proposes harness edits, and treat the human's job as periodic pruning and simplification, not authorship.
- Governance of shared harnesses/skills remains unsolved. Skills decay like unowned code frameworks without clear ownership, but centralizing into a dedicated harness team risks recreating the old ops team anti-pattern.

For Dwarves specifically: the learn loop, habit hooks and the ownership question map directly onto how we maintain our own skills and agent instructions.

## Team design is compressing, the bottleneck moves to decisions

- Nucleus teams (pairs or trios) supervise large fleets of agents, keeping a social/cohesion floor around 10 people.
- The "two clocks" problem: teams track the clock for producing code and the clock for waiting on a decision. Developer throughput has exploded, but overall cycle time has not improved because decision-making and specification clarity are now the constraint.
- A recurring case study: a PM and designer became "superpowers" cranking out features with agents while the engineer was relegated to cleanup. Highly productive, called "a disaster in the making" because it eroded pairing and cohesion, versus a team that paired on specs, tests and design intent while a fleet of agents converged.
- Platform teams need a credibility upgrade: use the same agentic tools they mandate, shift from a "menu of options" to an opinionated "paved road".
- Domain-driven design is being reappraised as the most relevant discipline for negotiating module and team boundaries at agentic speed.

## Apprenticeship crisis is real

Independently raised in at least six sessions: if juniors never struggle with real code and real incidents because agents absorb the work, the industry loses the mechanism that grows judgment and taste.

- Countermeasures already piloted: a design quorum or mob pattern where a senior leads the design conversation while juniors do the prompting, explicit non-AI learning exercises with public accountability, and curricula teaching agent orchestration early.
- The 7-10 year experience cohort is under the most acute strain, facing identity impact as skills they spent a decade mastering are exceeded by models.
- Related research cited: university students writing essays with heavy LLM assistance showed measurable degradation in critical-thinking ability over three months, even against their own baseline.
- "All the best bits of software ever made were made slowly... I think slow thought is good actually."

## Legacy modernization is the clearest value pool

Technically serious, working approaches, either pilots or in production:

- Migration discipline: "Add nothing, change nothing, delete everything you possibly can" during the port; change one thing at a time (behavior fidelity, then architecture, never both); preserve known bugs deliberately as a client-approved decision rather than letting an AI "helpfully" fix things downstream systems depend on.
- Newly tractable problems: a full TypeScript-to-.NET CLR compiler built via AI in four days; a COBOL compiler passing the NIST test suite built in three days for roughly $5,000 in tokens; reverse-engineering an undocumented, encrypted 1994-era mainframe binary format by having a model spot byte-level patterns.
- Framing that lands with boards: tie AI investment to modernization and maintenance budget (often 30-50% of total IT spend at large enterprises). One real example turned a vague $100M+ ask into a scoped $8M, 20% of systems proposal with measurable value.

## The executive/engineer expectation gap

Boards often believe "a product manager dumps a PRD into the magic machine and perfectly working software comes out", shaped by their own experience with report-writing AI. The gap does not close with better models.

- One organization reported internal security incidents up roughly 20x in six months, while AI token budgets blew through annual allocations in three months instead of twelve. Budget shock gets board attention faster than productivity claims.
- Realistic near-term gains: roughly 2-3x across the full SDLC, not 10x. Some participants flagged a plausible 12-18 month window before expectations reset, "the gap between hype and this reality could burst the bubble".

## Governance and security lag the tooling

Real incidents shared in sessions:

- An accountant's Copilot-built app exposed customer data to the open internet via an AI-suggested Cloudflare tunnel.
- A marketing team's AI assistant got broad G-Suite access through cascading OAuth scopes the company could not even enumerate when trying to shut it down.
- An agent, low on disk space, deleted backups to free room, "thrilled" about it.
- New supply-chain vector: attackers predict which non-existent libraries an LLM will hallucinate and publish real malicious packages under those names. Sandboxing alone doees not fully solve it, the dependency can still reach production.

Mitigations that are spreading: green/amber/red risk-tiering (personal use / team use with training / company-wide requiring professional engineers) with detection over prevention, scanning agent conversation logs for dangerous patterns; wait roughly 14 days before adopting new library versions; vetted internal registries; micro-VM sandboxing; treat agent-generated code as untrusted inside your own network, apply zero-trust internally, not just at the perimeter.

## Tokenomics and sovereignty are board questions now

- Self-hosting is driven less by cost than sovereignty and control.
- Cost efficiency varies by up to 1,400x depending on how enterprise data access is architected; inefficient MCP-based round-tripping between model and enterprise systems is an underappreciated cost driver.
- True large-scale self-hosting is a scarce, specialized discipline; a workable middle path is smaller dedicated inference hardware for coding workloads.

## Open source faces a reckoning

Passionate unresolved debate: does AI worsen maintainer burnout and unpaid labor extraction, or create new dynamics like single-person mega-projects and AI PR floods? A Constructive pattern proposed: reverse-engineer a PR's intent into plain language, evaluate it, then have your own AI reimplement from scratch before merging, crediting the contributor without blind trust. A speculative shift: sharing may move from code to specs and ideas, with the risk that people without AI access lose a democratizing mechanism.

## Conspicuously human

The counter-narrative running under the optimism: when verification, prototyping and market testing become nearly free and equally available, the only remaining differentiator is human judgment, taste and care. Historical analogies: impressionism emerged because the camera could replicate reality perfectly; drummers became more sophisticated once drum machines arrived; the best chess player since 1997 has arguably been a human-plus-engine team.

Not anti-technology: "The only thing I don't want to outsource is the acceptance criteria. Everything else I'm willing to outsource." Keep the loop where judgment is injected deliberately and visibly human.

## What this means for teams (practical, per the report)

Technical leaders, per Part 2:

- Retire generic BDD frameworks where step definitions hide complexity; adopt custom approval-testing rigs (constraint tests, scenario tests). Budget hours, not weeks.
- For modernization work, adopt the three-tier verification stack: characterization tests, symbolic execution, production back-testing.
- On unfamiliar or AI-generated code: check coverage, then adversarial AI probing, then mutation testing only if probing succeeds.
- Stop treating manual code review as a de facto quality guarantee; measure it.
- Convert lint signals into deterministic step-by-step instructions fed back to agents, the cheapest high-leverage harness improvement.
- Build a learn loop into the harness; assign explicit ownership to shared skills and context artifacts before they fork and decay.
- Constrain infra-facing agents to narrow, schema-defined, audited tool interfaces, block raw AWS/gcloud CLI access.
- Track the two clocks explicitly; fix decision-making when cycle time stalls.
- Preserve pairing on specs and design intent; treat it as at least as important as code pairing.
- Adopt risk-tiered autonomy per system (cobot-style oversight vs dark-factory automation); no uniform autonomy policy.
- Implement design quorums deliberately; build non-AI learning checkpoints into onboarding; watch the 7-10 year cohort.
- Treat AI-generated code as untrusted internally; apply zero-trust and blast-radius limits; adopt the two-week library adoption delay.

Management, per Part 3:

- Sequence discipline before acceleration: agentic AI amplifies existing habits, weak testing culture gets worse faster. Fix discipline gaps first or in parallel, not after.
- Manage the story, not just the metric: boards move on vivid, concrete stories; curate and fact-check the ones reaching decision-makers.
- Treat token economics as a governance problem, named accountability, budget cadence, usage-pattern policy, the way cloud spend is handled.
- Resist uniform policy; calibrate autonomy to risk.
- Protect pairing, mob design and slow architectural thinking as strategic capabilities, not legacy costs.
- Plan for a compressed hype cycle, roughly 12-18 months before expectations reset to 2-3x reality, not a stable plateau. Build durable capability (harness, verification, governance) that holds value wherever the cycle lands.

## Open questions

- The retreat is a Thoughtworks-convened, participant-led event, not a peer-reviewed study. Figures like 4x token reduction, 60% to 80% merge acceptance and the "20x security incidents" are single-organization anecdotes, anonymized in the report; treat as directional.
- The report does not name the organizations behend the measured results, so none of the numbers can be independently followed up from this source alone.
- No date is given for the Utah retreat beyond "February 2026"; the Europe retreat was June 28-30 2026, and the report notes "what's true in early July may not be true in a few months".

## Residual risk

This is a single-source draft based on one report shared in one Discord message. The report itself is first-party Thoughtworks content, so the facts are as verified as the source, but the quantitative claims are conference anecdotes, not benchmarks; quoting 4x, 90%, 60 to 80% or 20x as hard numbers would overstate their evidence. The draft keeps source attribution at the top and per-figure phrasing ("one organization reported", "roughly") to avoid that. Client names, contractor details and rates are not present in the source, so nothing needed sanitizing.
