---
title: Approximating softmax learning - Second brain technical motivation
description: Explores how the MCP knowledge base design approximates the effect of learning by manipulating context fed into a frozen LLM, sidestepping catastrophic forgetting by not updating LLM parameters, and leveraging a database as an evolving external knowledge store.
date: 2025-05-08
authors:
  - monotykamary
tags:
  - catastrophic-forgetting
  - softmax
  - knowledge-base
  - attention-mechanism
  - llm
  - mcp
  - second-brain
---

Inside a **Transformer**, the **attention mechanism** is king. A crucial part of this is the **scaled dot-product attention**, often represented as:

$$
\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right) V
$$

Here, $Q$ **(Query)**, $K$ **(Key)**, and $V$ **(Value)** are projections of the input embeddings. The $QK^T$ operation calculates alignment scores between different parts of the input sequence; essentially, how relevant each 'Key' position is to the current 'Query' position. The scaling factor $sqrt(d_k)$ stabilizes gradients. The **softmax** function then takes these raw alignment scores and converts them into a probability distribution; a set of weights that sum to 1. These weights determine how much influence each 'Value' vector (representing input tokens) has on the output representation for the 'Query' position. **Softmax** is where the model decides *what to pay attention to* based on learned patterns embedded in its parameters (weights).

Traditional **LLM** "learning" (fine-tuning) involves adjusting the model's parameters through backpropagation based on training data. This directly modifies the weights used to compute Q, K, V, and within the feed-forward layers. Consequently, the **softmax** output changes; the model learns to attend to different patterns based on the fine-tuning task. However, this process is precisely what leads to **catastrophic forgetting (CF)**, as optimizing for new data can overwrite parameters crucial for retaining old knowledge.

Our **MCP knowledge base** design sidesteps this parameter modification entirely. The **LLM** itself remains a frozen asset; its internal weights, including those governing the **softmax** calculation, are *not* updated. Instead, we **approximate the *effect* of learning** by manipulating the *context* fed *into* the **LLM**, leveraging the database as an external knowledge store that evolves over time.

Here's how it works in relation to **softmax**:

1. **Externalized Memory & Context Filtering:** Rather than relying on the **LLM's** internal parameters (shaped by pre-training/fine-tuning) to recall *everything*, we store observations externally in the `observation_log`. The challenge shifts from *adjusting internal weights* to *selecting the right external context* to feed into the LLM's fixed attention mechanism.
2. **Aggregates as Statistical Significance Filters:** The **continuous aggregates** (e.g., `content_trends`, `entity_trends`) act as a first-pass filter based on statistical significance over time. They identify recurring patterns (high `mention_count` or `relation_count`) in the raw data stream. This pre-computation highlights information that is *likely* important; analogous to how **softmax** assigns higher weights to relevant tokens, but done *outside* the model based on historical frequency within the database.
3. **LLM Synthesis Creates Knowledge Anchors:** When the **LLM** analyzes these aggregates and coins a term like **"Vibe Coding"**, it synthesizes raw trends (**data/information**) into a compact concept (**knowledge**). This new `coined_term` is stored back into the `observation_log`. This explicit knowledge representation acts as a powerful anchor for future context retrieval.
4. **Approximating Learning via Context Curation:** The "learning" emerges from the cyclical interaction: new data accumulates -> aggregates track trends -> **LLM** synthesizes trends into coined terms -> coined terms enrich the database. While the internal **softmax** function of the **LLM** operates exactly as it did before (using frozen weights), the *input* it operates *on* becomes increasingly refined and contextually relevant over time. Future queries or tasks can leverage the `GIN` index on the `payload` to retrieve specific observations, potentially prioritizing those containing relevant `entities`, `tags`, or recently established `coined_terms`. This curated context, fed into the frozen **LLM**, allows its internal **softmax** to effectively focus attention on the most pertinent information for the task at hand, mimicking the *outcome* of learning without suffering the drawbacks of direct parameter updates like **CF**.

So, we are not changing the **Transformer's** internal mechanism for calculating attention via **softmax**. *We are building an external system that learns by structuring, summarizing, and synthesizing information over time*, allowing us to feed a much more relevant and distilled context *to* the **LLM's** existing attention mechanism. The learning is embodied in the evolving state of the **TimescaleDB** database and the explicit knowledge artifacts (**coined terms**) generated by the **LLM**, not in the **LLM's** weights. It's learning by curating memory, not by retraining the brain.

### Why does this work?

Think of **softmax** in the attention mechanism as a **"focus amplifier"**. It takes a bunch of raw scores indicating potential relevance (how much a query aligns with different keys) and transforms them into a probability distribution. This distribution highlights the few things that are *most* relevant right now, assigning them high weights (probabilities), while effectively suppressing the vast majority of less relevant things by assigning them near-zero weights. The total "attention budget" is normalized to 1.

Our database design achieves a similar outcome through its structure and the LLM interaction cycle:

1. **The Echo Chamber Analogy:**
    - **Raw Observations (`observation_log`):** Imagine every single voice and whisper in a massive echo chamber; raw, undifferentiated sound.
    - **Frequency Counting (`continuous aggregates`):** Installing microphones that count how often specific words or phrases are uttered over time. This gives you raw counts; a "loudness score" for each phrase. Some phrases might be consistently loud ("AI progress"), others fleeting whispers. These counts are like the raw `QK^T` scores before **softmax**.
    - **Identifying the Loudest Voices (`LLM querying aggregates`):** Periodically checking the microphone counts to see which phrases have the highest "loudness scores"; which voices are dominating the echo chamber *right now* or *consistently over time*.
    - **Summarizing the Main Topic (`coined_terms`):** The **LLM** recognizes that the phrase "AI progress" isn't just loud, but represents a significant, recurring theme. It coins a term or creates a summary encapsulating this dominant topic.
    - **The Softmax Parallel:** Just as **softmax** amplifies the highest raw scores into significant probabilities, this system amplifies the most frequent or trending observations (highest raw counts/scores from aggregates) by having the **LLM** potentially identify them or synthesize them into `coined_terms`. When retrieving context later, focusing on these high-frequency items or coined terms is like allocating most of your attention budget (probability weight) to the loudest, most persistent voices identified through the aggregation process, effectively ignoring the background noise (low-frequency observations). The database structure + LLM analysis performs the *function* of amplifying signal (high frequency/trends) over noise (infrequent observations).
2. **The Popularity Contest Analogy:**
    - **Raw Observations (`observation_log`):** Every single interaction, comment, or event happening online.
    - **Tracking Virality (`continuous aggregates`):** Systems constantly tracking likes, shares, mentions, or views for specific topics, entities, or content pieces over time windows (e.g., weekly trends via `time_bucket`). These are raw popularity scores.
    - **Identifying Trends (`LLM querying aggregates`):** Spotting which topics or items have rapidly increasing scores or consistently high scores.
    - **Labeling the Trend (`coined_terms`):** Giving a name to the viral trend, like "The Rise of Vibe Coding."
    - **The Softmax Parallel:** **Softmax** essentially runs an internal popularity contest for tokens based on context and learned weights, assigning high probability to the "winners." Our database *externalizes* this. The aggregates measure raw popularity (frequency, counts). The **LLM** identifies the winners. Retrieving context based on these winners (via `coined_terms` or direct frequency) means you're focusing on what the data itself has indicated is most important or "popular," mirroring how **softmax** distributes attention based on calculated importance scores.

In essence, the `observation_log` holds the raw potential. The **continuous aggregates** provide the raw scoring mechanism based on historical frequency or recency. The **LLM's** interaction acts as the interpreter identifying high scores and potentially synthesizing them. The overall system architecture thus models the *outcome* of **softmax**: dynamically highlighting and prioritizing the most statistically significant or conceptually synthesized information from a vast sea of raw data, allowing focus on signal rather than noise.
