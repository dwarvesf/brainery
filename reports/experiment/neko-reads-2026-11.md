---
title: 'neko reads monthly roundup November 2026'
description: 'what the dwarves den read and talked about in November 2026, picked and annotated by neko-anon'
date: 2026-11-05
authors:
  - neko-anon
tags:
  - community
  - reads
slug: neko-reads-2026-11
---

the past month of neko reads, distilled: 8 issues.

## 2026-10-08

ai model releases and inference tooling dominated, forcing teams to test new options against real agent workloads while big tech clamped down on usage. the angle is practical adoption under constraints, not hype cycles.

- [Claude Haiku 5.5](https://www.anthropic.com/claude-haiku-5-5): benchmarks claude haiku 5.5 speed for agent loops
- [Mistral Large 4](https://mistral.ai/news/mistral-large-4/): ships mistral large 4 weights for local deployment
- [OpenTPU – An open-source AI accelerator, developed by AI](https://github.com/FeSens/openTPU): releases open tpu design for custom inference hardware
- [Sharing AI progress in mathematics](https://openai.com/index/sharing-ai-progress-in-mathematics/): details llm gains on math benchmarks with code
- [Strands Decider 2B: a small, open-source, decision model](https://strandsagents.com/blog/introducing-strands-decider/): drops small open decision model for edge agents

## 2026-10-12

llm capability gaps and security traps dominated while practical tooling fixes surfaced. cloudflare agents and duckdb gains offered immediate value for agent work. shell quirks and vulns reminded teams that basics still break builds.

- [The gap in shared understanding of LLM capability is widening](https://twitter.com/karpathy/status/2109361546505966046): reveals llm gaps that derail agent engineering daily.
- [Talorys – A self-hosted personal AI agent on Cloudflare's free tier](https://github.com/rociiu/talorys): ships self-hosted ai agent on cloudflare free tier.
- [Telegram Desktop vulnerability allowed any user's file to be stolen](https://beaksec.github.io/posts/telegram-desktop-one-click-account-takeover/): details telegram flaw that exposed files to theft.
- [Why DuckDB 2.0 is faster](https://motherduck.com/blog/why-duckdb-20-is-faster/): breaks down duckdb 2.0 speedups for local queries.
- [The tilde in your PATH may not be your HOME](https://disconnect3d.pl//2026/10/02/dont-put-tilde-in-your-path/): fixes tilde path bugs that crash scripts unexpectedly.

## 2026-10-15

ai tooling and security dominated, with engineering stories exposing hidden risks in models and languages. the period highlighted practical advances in llms alongside real containment failures that affect agent work. focus sharpened on what devs can actually use or defend against now.

- [Gemini 4 Argon](https://deepmind.google/models/gemini/): introduces gemini 4 for direct llm agent testing.
- [Redesigning source control at Anthropic](https://www.anthropic.com/engineering/redesigning-source-control): details source control changes that scale ai codebases.
- [11 year old unsoundness bugs found in Rust borrow checker](https://github.com/rust-lang/rust/issues/164250): exposes long-standing rust borrow checker soundness issues.
- [Containment and monitoring failures are to blame for AI hacking reports: experts](https://www.csoonline.com/article/4234854/ai-agents-arent-going-rogue-frontier-labs-are-skipping-security-basics.html): pins ai hack reports on poor monitoring practices.
- [AI models can provably hide arbitrary capabilities](https://arxiv.org/abs/2610.13928): shows models can conceal capabilities during evaluation.

## 2026-10-22

supply chain attacks on LLM tooling and PHP engines dominated, alongside certificate authority failures exposing trust issues. AI driven discovery of RCEs and new inference frameworks signal shifting security and deployment landscapes for devs.

- [Compromised LiteLLM 1.107.0 on PyPI Installs a Credential Stealer and Backdoor](https://safedep.io/litellm-pypi-compromise-credential-stealer-backdoor/): credential stealer runs on every python start after liteLLM install, hit AI workflows first.
- [PHP2Shell: AI uncovers critical RCE in PHP](https://www.wiz.io/blog/php2shell-php-rce): core php engine flaws enable remote code execution across 70 percent of sites.
- [Eight Bits of Trust: eMudhra's CA keys cracked in milliseconds](https://scotthelme.co.uk/eight-bits-of-trust-emudhras-ca-keys-cracked-in-milliseconds/): private keys reduced to single digits like 4, cracking CA trust in milliseconds.
- [Tsrs: A Port of TypeScript to Rust](https://blog.cloudflare.com/typescript-rust-port/): typescript port to rust cuts memory use 70 percent and speeds execution eightfold.
- [DeepInfer: High-performance inference framework for DeepSeek models](https://github.com/deepseek-ai/DeepInfer): high performance inference framework scales deepseek models for production agents.

## 2026-10-26

AI hype collides with real limits outside tech while security holes and long-running systems keep delivering concrete results. the period highlights uneven tooling payoffs and persistent engineering wins over flashy announcements.

- [A 10-year-old CNN outperforms frontier LLMs for skin cancer diagnosis](https://lynchlab.net/llm-skin-cancer): dermatologist tests find decade-old cnn beats frontier LLMs on skin cancer cases.
- [Cerebras Deploys Trillion-Parameter AI Models](https://www.cerebras.ai/blog/how-we-deploy-trillion-parameter-frontier-models-on-cerebras): wse-3t wafers deliver 1000-2000 tokens per second on trillion-parameter models.
- [No signs of AI payoff outside the tech sector](https://www.apollo.com/wealth/insights-news/insights/daily-spark/no-signs-of-ai-payoff-outside-the-tech-sector): AI investments produce zero measurable profit gains outside the tech sector.
- [Broccoli2Shell: Brotli decoder RCE in Node.js, Python and more](https://broccoli2shell.com/): brotli decoder flaw triggers remote code execution in node.js python and others.
- [Twelve years of distributed SQLite](https://philipotoole.com/twelve-years-of-distributed-sqlite/): rqlite maintains sqlite consistency across nodes for twelve years without loss.

## 2026-10-29

surveillance leaks and AI training scandals dominated while firmware flaws reminded everyone of boot-time risks. dev tools kept shipping amid the usual model hype. den stayed quiet on local crypto and consent rules.

- [Apple's git still trusts the compromised eMudhra certificates](https://emudhra.we-have-a-problem.com/apple.html): Apple still ships git trusting the compromised eMudhra certs eleven days later.
- [Code-execution flaw in UEFI firmware threatens most servers on planet Earth](https://arstechnica.com/security/2026/10/code-execution-flaw-in-uefi-firmware-threatens-most-servers-on-planet-earth/): EDK2 flaw lets attackers execute code before the OS boots on most servers.
- [Anthropic trained Claude on illegally obtained Stanford professors' books](https://stanforddaily.com/2026/10/27/professors-books-pirated-to-train-claude/): Anthropic settled for 1.5 billion after pirating Stanford professors books for Claude.
- [AI promised less work. I've never worked more](https://oioannou.com/blog/ai-promised-less-work/): Agents made implementation cheap so the vp of tech returned to full-stack pace.
- [Ghostty 1.4](https://ghostty.org/docs/install/release-notes/1-4-0): Ghostty 1.4 ships with fixes that terminal users actually notice in daily work.

## 2026-11-02

security holes in AI tools and agents set the tone, with workers grabbing less capital than ever as quiet backdrop. prompt tricks and remote exploits kept surfacing while multi-model harnesses showed real coding gains.

- [Memdoor: A team of 5 Qwen3.8-27B models beats Fable 5 on LiveCodeBench Hard](https://github.com/guregodevo/memdoor/tree/main/examples/workflows/team-solve): five qwen models collaborate to top livecodebench hard via local CLI harness.
- [Do the math: How we took over ChatGPT accounts](https://www.parameter.ai/labs/we-found-a-gap-at-openai): sandbox bypass plus csp hole lets attackers hijack any ChatGPT account with one link.
- [TCP Use-After-Free: CVE-2026-98432 / CVSS 9.8](https://atlasum.net/blog/cve-2026-98432-linux-ipv4-tcp-uaf): remote use-after-free in ipv4 tcp handshake scores cvss 9.8 on linux.
- [Leaking Secrets from Air-Gap Computers by Spelling Radio Signals from RAM (2024)](https://arxiv.org/abs/2409.02292): ram signals exfiltrate secrets from air-gapped systems without touching networks.
- [Brazilian Court Sanctions Lawyers for Prompt Injection in Court Filing](https://jetstream.security/insights/brazilian-court-sanctions-prompt-injection-filing/): white-on-white prompt injection in court filing draws sixteen-thousand-dollar fine.

## 2026-11-05

AI security slips and model weight fiddling dominated, with consultancies watching their tooling and clients get exposed. north korean ops and silent plugin installs showed the real attack surface sits inside dev workflows. technical debt repayment via LLMs emerged as the quiet theme.

- [Postman silently auto-installs AI plugins and attempts to share all API data](https://github.com/postmanlabs/postman-app-support/issues/14370): postman now pushes codex plugins and shares API data without consent.
- [North Korean fake job interview led to $6.3B Binance heist](https://www.theregister.com/security/2026/11/03/north-korean-fake-job-interview-led-to-63b-binance-heist/5307398): north korean interview led to 6.3b binance withdrawal after devops compromise.
- [Qwen 3.8 27B on my laptop can interpret model weights, too](https://simonwillison.net/2026/Nov/3/qwen-can-interpret-model-weights/): 27b qwen model on laptop reads and edits raw neural weights directly.
- [Tell HN: Gemini trains on chat history, even for subscribers (personal accounts)](https://news.ycombinator.com/item?id=50363461): Gemini keeps training on subscriber chats despite paid account settings.
- [AI is forcing us to pay off 40 years of technical debt](https://spectrum.ieee.org/ai-in-cybersecurity-php2shell-vulnerability): AI now forces cleanup of forty years of legacy code across production systems.

8 issues, 40 picks, 0 den-shared
