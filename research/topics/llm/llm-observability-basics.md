---
title: LLM observability and tracing basics
description: Why LLM-powered systems need observability, what the three pillars (metrics, logs, traces) cover, which metrics to track, and which tools support tracing.
slug: llm-observability-basics
kind: reference
announce: false
draft: true
date: 2024-09-11
authors:
  - datnguyennnx
  - tienan92it
tags:
  - ai
  - llm
  - observability
redirect: []
type: research
topic: applied-llm
---

Observability means understanding what happens inside a complex system. For LLM-powered applications it relies on three signals: metrics, logs and traces. This page covers why such applications need it, what each pillar records, which metrics to watch, the benefits and challenges, and the tools that support tracing.

## Why LLM applications need observability

Observability in AI systems, especially LLMs, is about knowing what happens behind the scenes. It helps keep operations smooth, build user trust and meet compliance standards. You get there by monitoring performance, spotting issues and staying accountable. As AI becomes more central to daily life, observability directly affects system stability and performance.

Traditional software and LLM-powered applications differ in a basic way:

- **Traditional software**: Deterministic, based on explicit instructions written by programmers.
- **With LLMs**: Probabilistic, based on neural networks with weights determined through training.

![Architecture of an LLM-powered application](assets/llm-tracing-architecture.webp)

That difference creates seven needs:

1. **Unpredictable outputs**: LLMs can produce different outputs for the same input because they are probabilistic.
2. **Black box nature**: The decision-making process of an LLM is opaque.
3. **Complex interactions**: LLMs often interact with multiple components (retrieval systems, filters, classifiers, external APIs) in ways that are not immediately obvious.
4. **Performance variability**: Performance can vary significantly with input complexity, model size and hardware.
5. **Evolving behavior**: LLMs can change behavior through fine-tuning or in response to different prompts.
6. **Error diagnosis**: "Errors" in LLMs can be subtle, like hallucinations or biased responses.
7. **Continuous improvement**: LLMs improve through better prompts, fine-tuning or model updates, and you need data to guide them.

### Integrate early

Add observability tools at the start of the project. Delaying them causes worse issues later. Early integration catches issues before they escalate and lays a foundation for scaling as the system grows more complex.

## The three pillars

![The three pillars of observability: metrics, logs and traces](assets/observability-circle.webp)

Each pillar plays a different role in the overview of your LLM application.

### Metrics

[Metrics](/research/topics/llm/metric-pillar) are the foundation of AI observability. They include system-level and model-specific indicators. System indicators such as throughput and hardware usage are common. Model metrics such as accuracy and hallucination rate are AI-specific. Cost tracking covers query volumes and token usage. A mix of spot checks and extensive checks gives complete monitoring.

### Logs

[Logging](/research/topics/llm/logs-pillar) keeps detailed records, which makes monitoring and debugging effective across the system's operation. The golden rule is to record everything: system parameters, queries, outputs and component lifecycles. Effective logging needs consistent tagging and identifiers for traceability.

### Traces

[Tracing](/research/topics/llm/trace-pillar) gives a full picture of the execution path, from query to response. It includes document retrieval, prompting and model interactions, plus time and cost estimates for each step. Visualization tools such as LangSmith show simple trace representations.

Building software with LLMs involves several steps, from planning to deployment. Tracing is the final step in that process. It provides ongoing insight and enables continuous improvement of the application.

![Steps of building software with LLMs, ending with tracing](assets/llm-tracing-build-steps.webp)

## Key metrics

| **Basic**                                                                            | **Evaluating**                                                                                         |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Latency<br>Throughput<br>Error Rate<br>Resource Utilization<br>Execution Time<br>... | Factual Accuracy<br>Relevance<br>Bias Detection and Fairness<br>Hallucination Rate<br>Coherence<br>... |

Basic metrics like latency and throughput measure operational performance. Evaluative metrics dig into the actual output and behavior of the LLM.

## Benefits of LLM observability

- **LLM performance**: Ongoing monitoring helps fine-tune LLMs, improving speed and accuracy.
- **Faster problem diagnosis**: Detailed logs and metrics make problems easier to spot and fix, which reduces downtime.
- **Cost savings**: Early detection of inefficiencies and better resource management can lower operating expenses.
- **Better explainability**: A clearer view of how LLMs work helps companies explain decisions, especially in regulated industries.
- **Increased reliability**: Proactive monitoring catches issues early, so LLMs become more dependable.

## Challenges

- **Model complexity**: LLMs are costly and complex, which makes them hard to monitor and optimize.
- **Third-party rate limits**: Many LLMs use third-party APIs with rate limits. These can slow monitoring and make real-time data harder to get.
- **Dynamic workloads**: LLM performance changes with shifting demand, so monitoring must adapt.
- **Data privacy**: Businesses must meet legal requirements without losing insight, so monitoring has to protect data privacy.

## Tools

Popular tools that support various aspects of LLM tracing:

- [LangSmith](https://docs.smith.langchain.com/)
- [Phoenix (by Arize)](https://arize.com/)
- [Traceloop](https://www.traceloop.com/)
- [OpenTelemetry](https://opentelemetry.io/blog/2024/llm-observability/)
- [Portkey](https://portkey.ai/)

## References

- https://arize.com/blog-course/llm-evaluation-the-definitive-guide/
- https://docs.smith.langchain.com/how_to_guides/tracing
- https://karpathy.medium.com/software-2-0-a64152b37c35
- https://theblue.ai/blog/llm-observability-en/
- https://medium.com/@aiswaryasomanathan4/logging-traces-and-metrics-whats-the-difference-c796ea276c98
- Demo: https://colab.research.google.com/gist/tienan92it/490dd65748518a9abc73cdf4bd84583d/welcome-to-colab.ipynb
