---
draft: true
title: 'Bonsai 27B: a 27B-parameter model that fits on a phone'
description: PrismML shipped Bonsai 27B, the first 27B-class model to run on a phone
date: 2026-07-15
authors:
  - content-editor
tags:
  - local-ai
  - quantization
  - on-device-ml
  - open-source
slug: bonsai-27b-local-ai-draft
---

## TL;DR

PrismML shipped Bonsai 27B, the first 27B-class model to run on a phone. Through ternary and 1-bit quantization, they squeezed it to 5.9 GB (laptop-grade) and 3.9 GB (phone-grade) while keeping multi-step reasoning, tool use, and agentic loops intact. Everything is Apache 2.0.

## The announcement

On July 14, PrismML announced Bonsai 27B, a new flagship in their Bonsai family built on top of Qwen3.6 27B. The claim is straightforward: this is the first time a 27B-parameter model has been made practical for local deployment on a phone.

A 27B model in standard 16-bit precision eats roughly 54 GB of RAM. Even a aggressive 4-bit quantization still lands around 18 GB, too large for most laptops and far beyond any phone. Bonsai 27B attacks this with two aggressive quantization schemes:

| Variant            | Size   | Effective bits per weight | Target device |
| ------------------ | ------ | ------------------------- | ------------- |
| Ternary Bonsai 27B | 5.9 GB | 1.71                      | Laptops       |
| 1-bit Bonsai 27B   | 3.9 GB | 1.125                     | Phones        |

## Why the quantization matters

The jump from 4-bit to ternary (roughly 1.7-bit) and then to 1-bit is not just about shaving bytes. At these compression levels, the model architecture and the quantization method have to be co-designed. Ternary weights (values constrained to {-1, 0, +1} or similar schemes) let you replace expensive multiplies with simpler additions and subtractions, which matters on mobile NPUs with tight power budgets.

PrismML says the 1-bit variant is "optimized for phone-class footprint." That implies the quantization was chosen with mobile inference in mind, not just disk size. The ternary variant, at 5.9 GB, is aimed at laptops and likely preserves more of the original model's capability.

## What it can actually do

PrismML lists four capability tiers for Bonsai 27B:

- **Multi-step reasoning**: chains of thought that hold context across several reasoning steps.
- **Structured tool use**: calling APIs or functions with well-formed arguments, not just free-text generation.
- **Long-context workflows**: processing and reasoning over longer documents or conversation histories.
- **Coherent agentic loops**: running repeated observe-think-act cycles without drifting off mission.

These are exactly the capabilities that make large models useful for real work, and they are usually the first to degrade when you quantize aggressively. If the claims hold up, Bonsai 27B would be the first phone-runnable model that can act as a genuine agent, not just a chatbot.

## The open-source angle

Both variants are released under Apache 2.0. That is a deliberate choice in a space where many "local AI" offerings are either closed weights or come with restrictive licenses. For builders who want to ship on-device features without sending user data to the cloud, an Apache 2.0 27B model is a significant new option.

## What this means for builders

Until now, the practical choice for on-device AI has been a trade-off between model size (7B or smaller) and capability. Bonsai 27B, if it delivers on its benchmarks, breaks that trade-off. A 27B model with tool use and agentic loops running locally changes what kinds of apps are feasible:

- Privacy-first assistants that never leave the device.
- Offline coding helpers with real reasoning depth.
- Field tools for places with no connectivity.

The obvious caveat is that we have not seen independent benchmarks yet. PrismML's claims are specific, but the community will need to verify them.

## Open questions

- What is the downstream accuracy drop versus the base Qwen3.6 27B? PrismML has not published benchmark numbers yet.
- How does inference speed look on actual phone hardware (e.g., iPhone 16 Pro, Snapdragon 8 Gen 4)?
- Is the ternary/1-bit quantization method novel, or an application of an existing technique (e.g., BitNet, ternary weight networks)?
- What does "coherent agentic loops" mean in practice? Is there a concrete benchmark or demo?

## Sources

- PrismML announcement on X: https://x.com/prismml/status/2077084891284721827?s=46&t=1FgfJH4UsE1__1kZen59kw
- Discord share by 0xm: https://discord.com/channels/462663954813157376/1284063844314120224/1526801781554806894

## Residual risk

- Claims are unverified by independent evaluators at time of writing.
- The announcement is fresh; model files and technical report may not yet be fully available.
