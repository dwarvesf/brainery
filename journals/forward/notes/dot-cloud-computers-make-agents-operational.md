---
draft: true
title: 'Cloud computers make agents operational, not automatically better'
description: 'A short note on why Dot, Grok Bot, and Codex Cloud should be compared by workflow fit instead of launch-page promises.'
date: 2026-09-30
authors:
  - phucld
  - 0xlight
tags:
  - agents
  - developer-tools
  - cloud-computers
slug: dot-cloud-computers-make-agents-operational
---

## The finding

OpenAI's DevDay recap introduced Dots as always-on agents, and the #ai-tech thread immediately compared that shape with Grok Bot and Codex Cloud. phucld's first read was grounded: the Dot he got was "one cloud computer" with access to his own computer, and it did not feel very different from Codex Cloud yet. That is the useful signal. The product category is converging faster than the product promises are differentiating.

## Why it matters to us

For engineering work, an agent with a persistent machine can be more useful than a chat model because it can keep files, browser state, and tool sessions alive across tasks. Grok Bot's public positioning says the same thing in different words: a bot gets its own computer, can sign in to tools, and can run routines. The evaluation question should move away from "which vendor sounds more agentic" and toward operational fit: where does state live, how approvals work, how credentials are isolated, whether the agent can resume after failure, and whether the handoff back to a human is clear.

## Take it further

- Run the same small task through Dot, Grok Bot, and Codex Cloud: fetch context, edit a file, ask for approval, then resume after interruption.
- Compare the security model before comparing speed: machine isolation, browser sessions, credential storage, audit logs, and admin controls.
- Track the human handoff path. The winning tool may be the one that asks for review at the right boundary, not the one that acts the most autonomously.
- Revisit after one real workflow, because the first impression only says the category is similar, not whether the reliability is similar.

## Sources

- Discord, 0xlight sharing OpenAI DevDay recap and asking for a translation: https://discord.com/channels/462663954813157376/1284063844314120224/1554674810062118933
- OpenAI DevDay 2026 recap, Dots announcement: https://openai.com/index/devday-2026-recap/
- Discord, phucld asking whether OpenAI's new dots are better than Grok Bot: https://discord.com/channels/462663954813157376/1284063844314120224/1554677114668843100
- Grok Bot public page, bot computer and tool access positioning: https://dot.com
- Discord, phucld first read on Dot as a cloud computer with local-computer access, similar to Codex Cloud: https://discord.com/channels/462663954813157376/1284063844314120224/1554768071422640208
