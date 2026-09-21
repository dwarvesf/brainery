---
draft: true
title: 'Can LLMs Actually Learn New Facts in Their Weights? A Baseten Research Experiment Says No — Not Reliably'
description: 'A team at Baseten, led by Charles O''Neill, ran a carefully controlled experiment to answer a deceptively simple question: can you write new facts into a language model''s weights after it has been trai…'
date: 2026-07-18
slug: continual-learning-weights-vs-context
---

## Can LLMs Actually Learn New Facts in Their Weights? A Baseten Research Experiment Says No — Not Reliably

A team at Baseten, led by Charles O'Neill, ran a carefully controlled experiment to answer a deceptively simple question: can you write new facts into a language model's weights after it has been trained, and have it actually use them later?

The short answer is no — at least not in any way that survives repeated writes or composes cleanly with other facts. The work makes a strong empirical case that, for continual learning, context (retrieval, compressed KV caches, in-context learning) is the more reliable channel than weight updates.

## What They Did

The team invented synthetic facts and wrote them into Qwen3 models, then tracked those facts through sequences of 20 to 100 later writes. They compared three conditions:

- **Floor**: the original model without the fact.
- **Ceiling**: the original model with the fact placed directly in its prompt.
- **Weight-written**: the model after training on the fact, tested against held-out questions.

They tested five question types, going beyond simple recitation to check whether the model could actually *use* the fact (deduction, composition, paraphrase, etc.).

## Key Findings

### 1. Training breadth matters more than the training objective

If you train on a bare statement of the fact, the model can recite it but cannot *use* it. The gap between recitation and usable knowledge was **27.4 percentage points**.

If you train on diverse restatements of the same fact, that gap collapses to **5.4 points** — without ever showing the model the test question during training.

### 2. Retention degrades quickly with repeated writes

After **20 sequential writes**:
- Bare-statement facts retained **~1% accuracy**.
- Facts written from diverse "study" data retained **~46% accuracy**.

Even the better-trained facts plateaued at **25–28% survival** after 100 writes. Earlier facts get progressively harder to reach.

### 3. Forgetting is stranger than erasure

Even after a fact fails every question the researchers can ask, **57–67% of the log-probability lift from its write is still sitting in the weights**. The content is there, but the model has lost the "address" for it.

Under bare-statement training, **70% of wrong answers** about a forgotten fact contain the *most recently written* fact instead. Later writes do not erase earlier knowledge; they hijack the queries that used to reach it.

### 4. Composition breaks almost immediately

Two facts, each individually usable when written into weights, support joint reasoning only **32% of the time** (versus **91%** when both facts are simply placed in the prompt). Weight writes store content but do not create proper compositional addresses.

### 5. Capability preservation is possible but not enough

Damage to unrelated abilities correlates strongly with KL divergence from the original model. Distilling each write against a frozen copy of the original model helps preserve capability, but even the safest method still loses nearly half the facts by the 20th write.

### 6. Context just works

A "forgotten" fact supplied back in the prompt recovers to **77–80% accuracy** instantly. In-context versions of the same facts show no extra erosion beyond normal capability loss. The channel with addresses — context — is robust.

## What This Means for Builders

The paper's conclusion is direct: all the training that creates a foundation model is engineered around crafting the best possible in-context learning mechanism. Further training degrades this mechanism. When facts must be composed or survive later writes, the reliable channel is context rather than the weights.

This has immediate architectural implications:

- **RAG and retrieval-augmented pipelines** are not just cheaper alternatives to fine-tuning; they may be structurally superior for knowledge that changes.
- **Compressed KV caches** (a related Baseten research thread) become more interesting as a way to extend what context can hold.
- **Fine-tuning for knowledge injection** should be viewed with skepticism if the knowledge needs to coexist with future updates.

## Open Questions

- The experiments used invented synthetic facts on Qwen3. Do the same dynamics hold for real-world factual updates on larger models?
- The paper tested up to 100 sequential writes. Production systems may see orders of magnitude more; the plateau behavior beyond 100 is unknown.
- More advanced continual-learning techniques (clever replay buffers, gradient conditioning, orthogonal subspace methods) were not tested and could shift the picture.
- The work focuses on factual knowledge, not skills or style. Weight updates may still be the right tool for behavioral or stylistic adaptation.

## Sources

- Discord harvest: https://discord.com/channels/462663954813157376/1284063844314120224/1527836340178387066
- X thread by Charles O'Neill: https://x.com/oneill_c/status/2077806411069988917
- Baseten research blog post: https://www.baseten.co/research/can-a-language-model-learn-facts-continually-in-its-weights
- arXiv paper (2607.11020): https://arxiv.org/abs/2607.11020

## Residual Risk

- The X thread and Baseten blog are from the same research group; independent replication has not yet appeared.
- The paper is fresh (July 2026) and has not yet been through peer review.
- The experiment uses a single model family (Qwen3); generalization to other architectures (Mixture-of-Experts, state-space models) is unverified.
