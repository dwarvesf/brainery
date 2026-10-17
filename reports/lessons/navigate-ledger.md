---
draft: false
title: "We called ten technology arcs in June 2025. eight of the 60 experiments we planned got built."
description: "Sixteen months after ten thesis notes, a scored ledger of what we built, which clients paid and what the market did, plus the five-step method that produced the calls."
date: 2026-10-18
kind: field-report
toc: true
authors:
  - tieubao
tags:
  - strategy
  - consulting
  - market-thesis
  - navigate
  - ai
slug: navigate-ledger
redirect:
  - /consulting/navigate
  - /consulting/navigate/README
  - /pzEL0g
  - /consulting/navigate/business-correction
  - /XqSkkA
  - /consulting/navigate/competency-check
  - /BpQtqA
  - /consulting/navigate/consulting-model
  - /wzPT5A
  - /consulting/navigate/cycle
  - /yARSZA
  - /consulting/navigate/experiment
  - /EspRAQ
  - /consulting/navigate/forming-market-thesis
  - /GZAm9w
  - /consulting/navigate/growth-engine
  - /6rFhXA
  - /consulting/navigate/keep-sharp
  - /j6w42w
  - /consulting/navigate/market-thesis-method
  - /45ARoA
  - /consulting/navigate/talent-pool
  - /DQ0QEw
  - /consulting/navigate/test-the-water
  - /qZq5ZQ
  - /reports/commentary/arc-convergence
  - /arc-convergence
  - /4PldLw
  - /reports/commentary/on-agent
  - /arc-on-agent
  - /Bg60FM
  - /arc/on-agent
---

On 13 and 14 June 2025 I wrote ten technology theses with our five-step method: agentic AI, LLM, platform ops, spatial computing, zero-knowledge proofs, DeFi, DeFAI, stablecoins, algorithmic stablecoins and Bitcoin. Each thesis ended with six experiments, so we planned 60. It is now 18 October 2026, and this week I counted what exists.

Eight experiments exist as proposed. Nine exist in another shape. Forty-three never started.

![The ledger: ten arcs, six planned experiments each, client pull, market outcome and a verdict {#fig-ledger}](assets/navigate-ledger-fig1-ledger.svg 'Each square is one planned experiment. The three AI arcs hold 6 of the 8 experiments built as proposed. The six crypto arcs hold 2 of 36.')

**TL;DR.** Agentic AI is the only arc that cleared all three tests: we built for it, clients paid for it, and the market moved the way I said. LLM, platform ops, stablecoins and Bitcoin held in part. Zero-knowledge proofs are too early to call. DeFi, DeFAI, algorithmic stablecoins and spatial computing missed. The method itself had two faults the ledger exposes: a template chose 40 of the 60 experiments, and nothing in the method ever asked whether a plan paid off. The second half of this page is the method, merged from twelve short notes.

## How the ledger was scored

The theses were drafts. I wrote them with an LLM following our own method, they never went public, and they were removed in August 2026 as template output. I score the calls anyway, because the 2025 roadmap named focus areas from this list and the experiments were meant to steer the work.

An arc earns a verdict from three tests:

| Test                       | Evidence I used                                                                   |
| -------------------------- | --------------------------------------------------------------------------------- |
| We built for it            | Repos, merged pull requests, memo posts, services pages, dated 2025-06 to 2026-10 |
| A client paid for it       | Notion project records, case studies, aggregate counts only                       |
| The market moved as called | Public data opened on 18 October 2026, each source linked below                   |

The verdict scale is simple. **Held** means all three tests passed. **Partly held** means the market moved as called but our work landed in another shape, or only inside our own operations. **Missed** means the market contradicted the call, or we never acted on it. **Too early** means the premise is plausible and not yet testable.

For each of the 60 experiments I asked one question: does something exist that does this job? Built as proposed means yes. Another shape means something exists that serves the same purpose in a different form. Never started means nothing exists. I made those calls, and one artefact can satisfy several rows. ICY, our community token, covers the tokenized reward experiment in four theses.

| Arc                    | Verdict     | Built / other shape / never | Client pull since mid-2025          | Market since June 2025                                                      |
| ---------------------- | ----------- | --------------------------- | ----------------------------------- | --------------------------------------------------------------------------- |
| Agentic AI             | Held        | 2 / 1 / 3                   | 4 projects with agent-heavy updates | MCP went to a neutral foundation; Gartner still expects heavy cancellations |
| LLM                    | Partly held | 2 / 3 / 1                   | 5 projects                          | Spend tripled; the labs hold the value                                      |
| Platform ops           | Partly held | 2 / 1 / 3                   | No AI-ops client                    | Adopted everywhere; incumbents shipped the agents                           |
| Stablecoin             | Partly held | 0 / 2 / 4                   | 2 projects, in-app balances only    | Supply up 23 percent; size far below the thesis                             |
| Bitcoin                | Partly held | 1 / 0 / 5                   | None since June 2025                | ETF assets held; price down 22 percent                                      |
| ZKP                    | Too early   | 0 / 0 / 6                   | None                                | Proving cost collapsed; apps did not follow                                 |
| DeFi                   | Missed      | 1 / 1 / 4                   | None                                | TVL down 19 percent                                                         |
| DeFAI                  | Missed      | 0 / 1 / 5                   | None                                | The sector is worth under $1B                                               |
| Algorithmic stablecoin | Missed      | 0 / 0 / 6                   | None                                | The leading synthetic dollar lost two thirds of its peak                    |
| Spatial computing      | Missed      | 0 / 0 / 6                   | None                                | Headsets stalled; glasses grew                                              |

## The three AI arcs paid, mostly inside other people's products

**Agentic AI: held.** Two experiments exist as proposed: a community companion on our Discord and an ops assistant for a lean team. A third exists in another shape. The multi-agent orchestration framework became the [dwarves-kit](https://github.com/dwarvesf/dwarves-kit) workflow, public since March 2026, with 965 merged pull requests, plus a small fleet of desk agents that each own one job. Four Notion projects carry agent-heavy updates (MCP, LangGraph, multi-agent planners). They hold about a fifth of the hours we log, as an upper bound, because we log hours per project and not per feature.

The market confirmed the direction. Anthropic [donated MCP to a Linux Foundation fund in December 2025](https://anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation), citing more than 10,000 active public servers and 97 million monthly SDK downloads. It also confirmed the risk. [Gartner expects over 40 percent of agentic projects to be canceled by the end of 2027](https://theregister.com/2025/06/29/ai_agents_fail_a_lot/).

The scars are on our side. All 15 repos behind the 2025 agent and LLM experiments are archived. A desk agent that logged one user turn in 30 days was retired in September. The IP verification experiment has no trace anywhere. A sales package for agent deployment, written in February 2026, rests on a runtime we have since retired. I can find no client who bought it.

**LLM: partly held.** Two experiments exist as proposed (a support chatbot and internal documentation tooling) and three exist in another shape. The compliance framework for fintech never started. Five Notion projects show LLM work, and together with the agent projects the AI-tagged projects carry about a third of logged hours since November 2025. Of the 49 projects logged before the theses, 11 carry the AI tag, so the demand predated my notes. The thesis followed the client pull.

[Menlo Ventures counts enterprise generative AI spend at $37B in 2025, up from $11.5B in 2024](https://menlovc.com/perspective/2025-the-state-of-generative-ai-in-the-enterprise/), and 76 percent of it was bought, not built. That is the problem for four of my six experiments: a workflow framework, a content curator, a documentation tool and a support bot are what the labs and the coding-agent vendors ship next.

Our own chatbot shows the cost. In shadow mode, keyword retrieval returned a relevant passage for 10 percent of English questions and 14 percent of Vietnamese ones. A topic-pick and rerank design raised that to 40 and 36 percent. We switched it on for real on 6 October 2026, because traffic during the shadow deploy had stayed close to zero. The last public AI case studies, Plot and Discovery Inloop, are dated July 2025.

**Platform ops: partly held.** CI/CD with agents is the best-built experiment in all ten arcs. The platform deploys about twenty Workers, and deploys run all day: [754 production deploy jobs in 88 days, a median of 5 a day](/deploy-pipeline-formula). Agents write many of the commits, and an operator account dispatches every deploy, so I count it as agent-assisted and not autonomous.

The AI triage half failed. An alert-triage agent ran for about 50 days, from 18 August to 7 October 2026, and we retired it. We also tried to cut its calls with a gate. On 190 real alerts from 60 days, never skipping scored 74.7 percent, and no gate threshold beat that. One setting saved 18 calls and missed 57 alerts that needed one.

[The 2025 DORA report](https://cloud.google.com/blog/products/ai-machine-learning/announcing-the-2025-dora-report) found 90 percent of respondents use AI at work and that AI adoption "continues to have a negative relationship with software delivery stability". Datadog [shipped its own SRE agent in December 2025](https://www.datadoghq.com/about/latest-news/press-releases/datadog-launches-bits-ai-sre-agent-to-resolve-incidents-faster/). Adoption matched the thesis. Incumbents captured the layer. Predictive IP security and cloud-scaling orchestration never started, and our cloud footprint shrank over the year.

## One system carried all six crypto arcs

I find one crypto system in 16 months: ICY and the Bitcoin swap behind it. Our contracts repo has no original contract commit between February 2025 and August 2026, and the work after that is audit and consolidation. Across 8,688 Notion project updates since August 2025, not one mentions DeFi, algorithmic stablecoins, Bitcoin or zero-knowledge proofs. Client web3 work continues. Projects tagged blockchain carry about one hour in seven that we logged since November 2025, and that work is wallets, authentication and contracts for consumer apps.

**Bitcoin: partly held.** ICY floats on a Bitcoin reserve, and the swap works. The public [icy.so](https://icy.so) feed shows 82 completed swaps from 26 wallets, the first on 18 March 2025 and the last on 27 September 2026. That is small. One experiment exists as proposed. The five Lightning and escrow experiments never started, and I find no Lightning code in any system we run. Our one Lightning delivery is the [Neutronpay case study](/neutronpay) from December 2024, before the thesis.

Bitcoin fell from about $106,000 on 13 June 2025 to about $82,000 on 16 October 2026, 35 percent below its October 2025 high, [per CoinGecko](https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin). Spot ETF assets stand near $104 billion. The public Lightning network lost about 10 percent of its capacity and 20 percent of its channels between June 2025 and August 2026, [per mempool.space](https://mempool.space/api/v1/lightning/statistics/2y). The thesis expected Lightning to carry payments. Volume grew, but the public network got smaller.

**Stablecoin: partly held.** [Supply rose from $249B to $305B](https://stablecoins.llama.fi/stablecoincharts/all), up 23 percent, and the US signed the GENIUS Act on 18 July 2025. The thesis quoted $2.8 trillion by 2028 and nine times today's supply is not on a path I can see. We built no stablecoin product. We moved the other way: in March 2025 ICY dropped its fixed 1.5 USDC value for a floating Bitcoin one, and the public guide says this "reduces our dependency on stablecoins". We use stablecoins instead of building them. Since August 2026 a small batch of contractor payouts settles in USDC on-chain, while the rest runs on bank rails.

**DeFi: missed.** [Total value locked fell from $109.8B to $88.8B](https://api.llama.fi/v2/historicalChainTvl) between mid-June 2025 and mid-October 2026, and DEX volume is down 15 percent. The thesis projected $500 billion by 2030 from a $150 billion peak in 2024. Our contractor payment protocol never started: payouts run on Airwallex bank rails. The one experiment that exists is IP tokenization. We minted 13 memo notes as NFTs between March and May 2025, and the jobs have been dormant since 22 October 2025, as [the memo rebuild report](/memo-rebuilt) notes.

**DeFAI: missed, and the page that taught the method got it wrong.** My worked example in the market-thesis note said DeFAI would be a "$10B market by 2025" with no source. [CoinGecko's DeFAI category](https://api.coingecko.com/api/v3/coins/categories) sits at $777 million today. Virtuals Protocol's token lost 66 percent and AIXBT lost 89 percent since June 2025. The same note and the experiment note also said we started DeFAI with AI-integrated smart contracts for our own treasury. I cannot find that work. The only artefact is a read-only chat skill that answers questions about the ICY pool. I removed both claims from this page.

**Algorithmic stablecoin: missed, and skipping it was right.** The thesis filed DAI and Frax under algorithmic. Ethena's USDe peaked at $14.8 billion on 4 October 2025, printed $0.65 on Binance six days later, and now stands near $4.8 billion, [per DefiLlama](https://stablecoins.llama.fi/stablecoincharts/all?stablecoin=146). In November 2025 [Stream's xUSD and Elixir's deUSD collapsed](https://pharos.watch/learn/case-studies/stream-elixir-contagion-2025/). We built nothing, and I count that as the one good outcome in this cluster.

**ZKP: too early.** We built nothing, so "too early" describes the market and "missed" describes us. [Proving cost on Ethereum fell from $1.69 to under a cent per proof](https://hackmd.io/@willcorcoran/S1A840ZMZg), and four teams reached real-time proving. [World reports more than 18 million Orb-verified users](https://www.coindesk.com/business/2026/07/24/sam-altman-backed-world-network-secures-fresh-funding-to-fight-online-ai-deepfakes). The consumer experiments I proposed (anonymous voting, private transactions) did not turn into a market, and the EU's age-check wallet has its zero-knowledge features [not yet turned on outside a closed demo](https://www.eff.org/deeplinks/2026/08/zkps-arent-age-verification-silver-bullets), per the EFF.

## Spatial computing: we never went in

Spatial has zero repos, zero posts and zero projects after June 2025. It appeared in the public roadmap as one of four focus areas, and its arc page redirects to that roadmap page. It is the only 2025 focus area with no services page, case study, open role or repo.

The market gave no reason to regret skipping it. Apple's Vision Pro [shipped about 390,000 units in 2024 and an estimated 45,000 in the fourth quarter of 2025](https://www.macrumors.com/2026/01/02/vision-pro-still-failing-to-catch-on/). Headsets fell from 27 percent of XR units in the second quarter of 2025 to 15 percent a year later, [per IDC](https://mixed-news.com/en/idc-smart-glasses-shipments-q2-2026-vr-headsets-decline/), while display-less glasses grew 167 percent in the first quarter of 2026. Meta's Reality Labs still lost $4.6 billion in the second quarter of 2026. My six experiments were AR and VR apps, and none was about glasses.

## What the ledger says about the method

**A template chose 40 of the 60 experiments.** Each thesis had to include one experiment per vertical (productivity, community, liquidity, IP) plus two more. That rule produced the same ideas across arcs: a tokenized reward platform in five theses, an escrow contract in four, a cross-chain bridge in three. Ten out of ten theses carry an IP experiment, including "brand voice check API" for LLMs and "predictive IP security" for platform ops. The template filled slots and never tested demand.

**The signals measured buzz.** The growth engine watches funding rounds, hackathon activity, KOL chatter and hiring trends. Crypto prices peaked in October 2025, four months after I wrote the theses. The AI arcs held because clients were already asking, which I could have read in Notion. Of 63 projects in our records, 14 carry the AI tag and 14 the blockchain tag, and only 3 AI and 3 blockchain projects were logged after the theses.

**No experiment had an owner or a review date.** The method says to schedule a review. None of the ten theses names an owner or a date. The only review in sixteen months is this page.

**The pipeline went quiet within weeks.** The method runs News, Arc, Experiment, Build-log, Forward issue. The last forward issue shipped on 27 June 2025. Case studies end on 7 August 2025. Our four services pages date from January 2025 and the open roles from May 2025. The convergence page I wrote in January carried 15 lines reading "Achievement examples to be documented". Fig. 3 shows the gap in memo posts.

![Dated memo posts per month, June 2025 to October 2026 {#fig-quiet}](assets/navigate-ledger-fig3-quiet.svg 'Whole vault, bulk re-stamps excluded. No dated post appears from October 2025 to July 2026.')

## How we pick a bet

The method has five steps. Fig. 2 walks one thesis through them and then through the pipeline that came after. I wrote the notes behind this section between April and June 2025. The older bets they draw on are real: mobile apps in the 2010s, the move from Ruby to Go, the infrastructure path from Ansible to Docker to Kubernetes. Fuchsia OS and Elixir did not work out, and we skipped Rust. Go is the one thesis with a long enough record to score. I helped build the Golang Vietnam community, which gave real-world signals, and Go delivered: we built a strong team and worked with top companies.

![The five-step method, the pipeline after it, and the missing ledger step {#fig-method .live}](assets/navigate-ledger-fig2-method.svg 'Walk one thesis from pulse to score. Toggle to see which stages thinned out after June 2025.')

1. **Spot the pulse.** Combine hard signals (funding, hiring, hackathon activity) with what niche communities build and say. Data tells you what happened. The gut is pattern recognition from earlier bets, and it matters most when data is thin.
2. **Dig into the tech.** Where it came from, how it works, what it does well, what it does badly, its limits.
3. **Find the people.** Choose industries and pain points where the tech creates value, and tie each to one of our four verticals.
4. **Match solutions to problems.** Use the tech on our own work first, then map what it can do to each group's pain.
5. **Generate ideas and make plans.** Three to five ideas per industry, filtered on revenue, fit and build effort, each with an MVP plan.

Six questions sit under every pulse: does it solve a real problem, does it fit our strengths, is there a market, how crowded is it, is the ecosystem ready, and what does it cost in time and people. I would add a seventh now: which client asked.

## Signals and the cycle

The growth engine is a content flywheel: build a small project, write the case study, share it, take the feedback as a new idea, and feed it all into a tech radar on our Discord. Social listening, memos and brainery sessions feed the radar. The signals are funding rounds, hackathon activity, KOL buzz and hiring trends.

Technology moves in cycles of funding in and funding out, and each wave builds on the adjacent possible: Go on cloud, blockchain on networking, LLMs on a decade of machine learning. The first signs of a shift show up in niche groups on X, Reddit and GitHub, before the mainstream press. That window is when R&D is cheap. A market has already shifted when KOLs sell courses on it, when consumers trade tips, and when the team finds the new work boring. One odd tell is silence: less noise about a technology that used to be loud.

The ledger puts this advice to a test. The arcs where I leaned on funding figures and chatter, DeFAI above all, are the ones that missed.

## Choosing what to build

Experiments come in priority order. First, internal operations, because if we cannot use the tech ourselves, convincing a client is harder. Second, technology the startup ecosystem is adopting. In June 2025 about 80 percent of our revenue came from staffing and co-building with startups, and 10 to 20 percent from custom builds for traditional businesses. Third, long-term assets that compound with little upkeep. Fourth, spin-off potential.

Each experiment should fit 8 to 12 weeks, teach something even if it fails, and have a scoped definition, learning goals, a build-log plan and a review date. The ledger shows how that went. Most of the experiments that exist serve our own operations: the project assistant, the documentation tooling, the agent-assisted deploys.

## Testing the water

Once a service exists, test it on five to ten early clients in one to three months, using the cheapest channels first: the community around the tech, sales partners who are technologists, VCs with portfolio companies, super connectors, and last a small campaign. Make a one-page benefit sheet for everyone you bring in. The note names three things that stall this step: fear of failure, doubt in the thesis, and a lead who is not committed. I find no record of this test for most arcs, and the client pull column in Fig. 1 shows where clients came anyway.

## The team half of the method

A thesis fails when the team cannot build it, so the method has a people side.

- **Consulting model.** Funding and owners start an engagement, and we deliver design, build and manual guides through an account team and a production team. Agents automate more of that flow each quarter, and the human edge shifts to complex problem solving, change management and judgment.
- **Competency check.** Ask forward-looking questions every quarter. Is there a new paradigm to learn? Can we build the latest software with confidence? What share of the team can jump on the next wave? Hiring passionate learners keeps that number up.
- **Keep it sharp.** Distill know-how after every experiment, join hackathons and open source to build use cases, then pair a newcomer with someone who has done it. Shadowing beats training sessions.
- **Talent pool.** When training does not close the gap, hire for passion through internships, apprenticeships and community referrals, and put them in a labs team that tests new tech first. Recognition, feedback and growth paths keep them.
- **Business correction.** Teams run a life cycle from forming to adjourning. When demand, profit or the technology fades, assess each member's skills, adaptability and energy, support before downsizing, then pivot the team to the next goal.

## What shipped and what we dropped, per vertical

The convergence page promised that every arc feeds four verticals. Here is what actually landed.

| Vertical     | Shipped                                                | Dropped                              |
| ------------ | ------------------------------------------------------ | ------------------------------------ |
| Productivity | The dwarves-kit workflow; a fleet of desk agents       | 15 archived 2025 agent and LLM repos |
| Community    | ICY rewards for memo guest writers, since October 2026 | DAO reward platforms                 |
| Liquidity    | The ICY-to-Bitcoin swap                                | Lending, escrow, bridges             |
| IP           | 13 memo notes minted as NFTs                           | AI-verified IP protection            |

## Changes for the next ledger

- **One experiment per thesis, with an owner and a date.** Sixty unowned experiments are a wish list.
- **A named client conversation before six experiments.** If nobody has asked, the thesis waits.
- **Put pull in the signal step.** Count Notion projects and case studies by arc, next to funding and KOL buzz.
- **Score every quarter.** The numbers on this page come from counts I can rerun, so the next ledger takes an afternoon.
- **Skip the template.** A rule that forces one idea per vertical forces weak ideas.

## Limits

The 60-experiment classification is mine, and one artefact can satisfy several rows. Hours are logged per project, so every share above is an upper bound for the arc. Notion project text starts in August 2025 and timesheet hours in November 2025, so earlier work does not appear, and arc tagging is by keyword and approximate. Memo post dates come from page front matter, because the vault history was squashed in August 2026, and the August 2026 cleanup deleted drafts that might have covered the quiet months. Market figures were read from public pages and APIs on 18 October 2026. Several come through a secondary source, linked where used. The platform repos are private, so the pull request numbers behind these counts stay out of this page, and only Dwarves staff can check them.
