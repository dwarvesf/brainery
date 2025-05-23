---
title: Build a brain that never forgets
description: Explore how we solved the catastrophic forgetting problem in LLMs by building an external knowledge system that mimics learning through context manipulation, without touching the model's parameters.
date: 2025-05-08
authors:
  - monotykamary
tags:
  - brainery
  - second-brain
  - knowledge-base
  - catastrophic-forgetting
  - attention-mechanism
  - softmax
  - llm
  - mcp
redirect:
  - /s/ti2s0A
---

> **tl;dr**
>
> Our system prevents LLM **catastrophic forgetting** by using an **append-only TimescaleDB database** as external memory. Instead of retraining the LLM, we manipulate the context using database structures like **continuous aggregates** and **coined terms**, allowing the model to learn without overwriting past knowledge.

Let's talk about how **Transformers** work. At their core, they rely on something called the **attention mechanism**. The key player here is **scaled dot-product attention**, which you can express mathematically as:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) V
$$

Here's what's happening under the hood:

- **Q (Query)**, **K (Key)**, and **V (Value)** are projections of your input embeddings
- The $QK^T$ operation calculates how relevant each position is to your current query
- The $sqrt(d_k)$ scaling keeps your gradients stable
- The **softmax** function converts raw scores into probabilities, telling the model what to focus on

## The problem with traditional learning

When you fine-tune an **LLM**, you're adjusting its internal parameters through backpropagation. This changes how the model computes Q, K, V, and everything in between. The **softmax** output shifts, and the model learns to pay attention to different patterns. Sounds good, right?

Not exactly. This is where **catastrophic forgetting (CF)** comes in. When you optimize for new data, you risk overwriting parameters that were crucial for old knowledge. It's like trying to learn a new language and forgetting your native tongue in the process.

## Our solution: Learning without forgetting

We took a different approach with our **MCP knowledge base** design. Instead of modifying the **LLM's** parameters, we keep it frozen. The learning happens by manipulating the *context* we feed into the model, using our database as an evolving external knowledge store.

Here's how it works with **softmax**:

1. **External memory and context filtering**
   - We store observations in the `observation_log`
   - Instead of adjusting internal weights, we focus on selecting the right external context
   - This feeds into the **LLM's** fixed attention mechanism

2. **Statistical significance through aggregates**
   - Our **continuous aggregates** (like `content_trends`, `entity_trends`) act as first-pass filters
   - They identify recurring patterns based on `mention_count` or `relation_count`
   - Think of it as pre-computing what's likely important, similar to how **softmax** assigns weights

3. **Knowledge synthesis and anchoring**
   - When the **LLM** analyzes aggregates and coins terms like **"Vibe Coding"**, it's turning raw trends into compact concepts
   - These `coined_term`s get stored back in the `observation_log`
   - They become powerful anchors for future context retrieval

4. **Context-based learning**
   The learning cycle works like this:
   - New data comes in
   - Aggregates track trends
   - **LLM** synthesizes trends into coined terms
   - Coined terms enrich the database
   - Future queries use the `GIN` index on `payload` to find relevant observations

## Why this approach works

Think of **softmax** as a **"focus amplifier"**. It takes raw relevance scores and turns them into a probability distribution. The most relevant items get high weights, while less relevant ones get near-zero weights. The total attention budget always sums to 1.

Our database design achieves something similar through its structure:

### The echo chamber analogy

- **Raw observations** (`observation_log`): Every voice in a massive echo chamber
- **Frequency counting** (`continuous aggregates`): Microphones counting how often specific phrases are uttered
- **Identifying trends** (`LLM querying aggregates`): Checking which phrases have the highest "loudness scores"
- **Knowledge synthesis** (`coined_terms`): The **LLM** recognizing and naming significant themes

### The popularity contest analogy

- **Raw observations** (`observation_log`): Every interaction and event
- **Trend tracking** (`continuous aggregates`): Systems monitoring likes, shares, and mentions
- **Pattern recognition** (`LLM querying aggregates`): Spotting rapidly increasing or consistently high scores
- **Concept labeling** (`coined_terms`): Giving names to viral trends

## The technical payoff

The `observation_log` holds raw potential. The **continuous aggregates** provide scoring based on historical frequency. The **LLM** interprets high scores and synthesizes them. Together, they model the *outcome* of **softmax**: highlighting and prioritizing statistically significant information from a vast dataset.

We're not changing how the **Transformer** calculates attention. Instead, we're building an external system that learns by structuring, summarizing, and synthesizing information over time. This allows us to feed more relevant and distilled context into the **LLM's** existing attention mechanism.

The learning lives in the evolving state of our **TimescaleDB** database and the explicit knowledge artifacts generated by the **LLM**, not in the **LLM's** weights. It's learning by curating memory, not by retraining the brain.

---

> Next: [Brainery architecture design](architecture.md)
