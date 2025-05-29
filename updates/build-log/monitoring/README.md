---
title: § How we build our monitoring system
description: null
authors:
  - tieubao
date: 2025-05-14
tags:
  - monitoring
---

As a tech research-first team, how do we ensure our platform operates reliably while we push the boundaries of innovation? We are tasked with building, or selecting, a monitoring stack to gain visibility into our system's performance, catch issues early, and drive data-informed decisions. What does it take to create an effective monitoring system? In this opening article of our series, we will explore the essentials of monitoring and outline the journey ahead.

## Why monitoring matters for our team

Our platform powers cutting-edge research, integrating complex components like distributed processes and external APIs. Without monitoring, how can we know if a service is down, a process is lagging, or an integration is failing? A monitoring system provides the insights we need to maintain reliability, optimize performance, and ensure our research isn't disrupted by preventable issues. Whether we build a custom stack or adopt existing tools, this series will guide us through the key considerations.

## What is ahead in this series?

We have broken down the exploration into focused topics, each addressing a critical aspect of monitoring systems:

- **[Components](components.md)**: What are the core pieces of a monitoring system, and how do they fit together?
- **[Approach to build](approach-to-build.md)**: How do we design and implement a monitoring stack that meets our needs?
- **[Implementation guide](implementation-guide.md)**: Practical steps for monitoring everything from application logic to team performance
- **[Best practices](best-practices.md)**: What practices ensure our monitoring system is scalable and reliable?
- **[Correlation layer](correlation-layer.md)**: How do we connect metrics, logs, and traces to debug issues quickly?
- **[Metrics](metrics.md)**: Which metrics should we track to measure system health effectively?
- **[Metrics planning prompt](metrics-planning-prompt.md)**: LLM prompt template to get tailored metrics recommendations for any system
- **[Scale considerations](scale.md)**: Does the need for monitoring depend on your system's scale?
- **[Synthetic monitoring approach](synthetic-only.md)**: Can you rely mostly on synthetic monitoring when instrumentation isn't possible?
- **[Trace and request IDs](request-and-trace.md)**: Why use trace_id versus request_id, and when to combine them?

## Let's get started

Monitoring isn't just about tools, it is about understanding our system deeply. What is the first thing we need to monitor in our platform? Join us in the next article as we dive into the components of a monitoring system and start building our foundation.

---

> Next: [Monitoring system components](components.md)
