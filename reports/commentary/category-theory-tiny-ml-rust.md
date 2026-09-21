---
draft: true
title: 'Category Theory Meets Tiny ML: A New Rust Book Bridges Abstract Math and Embedded AI'
description: 'A working draft titled **"Category Theory for Tiny ML in Rust"** has surfaced, aiming to do something unusual: teach machine learning through the lens of compositional mathematics while keeping the co…'
slug: category-theory-tiny-ml-rust
---

## Category Theory Meets Tiny ML: A New Rust Book Bridges Abstract Math and Embedded AI

A working draft titled **"Category Theory for Tiny ML in Rust"** has surfaced, aiming to do something unusual: teach machine learning through the lens of compositional mathematics while keeping the code small enough to run on microcontrollers. Co-authored by Paris-based AI architect Hamze Ghalebi and mathematician Farzad Jafarranmani, the book treats category theory not as academic decoration but as an engineering tool for building auditable, type-safe ML pipelines.

## What makes this different from the usual ML tutorial

Most tiny-ML guides focus on squeezing a quantized model onto a device. This book starts one layer of abstraction higher. It maps category-theory concepts directly to Rust's type system:

- **Domain objects** become Rust types.
- **Morphisms** become typed transformations.
- **Composition** becomes executable program structure.
- **Training** becomes repeated transformation of model state.

The pitch is that if you can express your pipeline as a composition of well-typed functions, you get correctness guarantees and audit trails almost for free, something regulators increasingly ask for in production AI systems.

## The authors' backgrounds

**Hamze Ghalebi** is a CTO and AI architect at Remo Lab in Paris. His recent work centers on production GenAI, regulated AI systems, and the jump from prototype to reliable architecture. In the book, he supplies the engineering perspective: how to turn mathematical ideas into maintainable Rust code.

**Farzad Jafarranmani** is a researcher at Huawei and the Lagrange Mathematics and Computing Research Center. He holds a PhD in Mathematics and Computer Science from Universite Paris Cite and has done postdoctoral work at LIP6 / CNRS. He provides the theoretical foundation: category theory, denotational semantics, proof theory, and the discipline to keep abstractions precise rather than merely fashionable.

## Why this matters now

Tiny ML is moving from demo to deployment. Devices at the edge now run inference for audio, vibration, and image sensors, but the tooling for *building* those systems still feels like early-days web development: lots of copy-paste, fragile pipelines, and silent failures. A typed, compositional approach could reduce the surface area for bugs in safety-critical or regulated contexts (medical, automotive, industrial).

The book is also a timely counterweight to the trend of treating AI as opaque statistical magic. By making the mathematical structure explicit and executable, it pushes back against the "black box" narrative.

## Current status and how to engage

The draft is public and open for feedback while it is still growing. The authors specifically welcome:

- Unclear explanations or awkward terminology
- Broken Rust examples or non-idiomatic code
- Missing references or overloaded mathematical language
- Places where the connection between Rust, ML, and category theory needs tightening

Suggested citation format:
```
Ghalebi, H., & Jafarranmani, F. Category Theory for Tiny ML in Rust. Working Draft, Public Feedback Edition.
```

## Related context from the team's radar

Separately, Kit Langton (creator of Effect and open-source tooling advocate) recently recommended *Conceptual Mathematics* by Lawvere and Schanuel as the best gentle introduction to category theory for programmers, even preferring it over the widely cited Milewski book. If the Rust book's abstraction feels steep, Langton's pick is a lower-friction on-ramp to the same conceptual territory.

tier: commentary
register: essay
tier: commentary
register: essay

**Sources**
- Discord discussion referencing the book: https://discord.com/channels/462663954813157376/1284063844314120224/1528364412287586465
- Public draft homepage: https://hghalebi.github.io/category_theory_transformer_rs/
- Kit Langton's recommendation of *Conceptual Mathematics*: https://discord.com/channels/462663954813157376/1284063844314120224/1528364270864306217 (links to https://x.com/kitlangton/status/2057552910867706107)

**Open questions**
- How many chapters are currently available, and is there a rough timeline for completion?
- Are there any public code repositories accompanying the book, or is the Rust code inline only?
- Has the approach been validated on any real-world tiny-ML hardware targets (e.g., ARM Cortex-M, ESP32, RISC-V)?
- What is the team's practical experience with Effect-style typed error handling in embedded Rust, and does the book borrow from that ecosystem?

**Residual risk**
- The book is an early working draft; claims about production readiness or regulatory auditability are aspirational rather than demonstrated.
- Category-theory-based programming can alienate readers who need practical results quickly; the balance between rigor and accessibility is still being calibrated.
- No independent reviews or third-party benchmarks have been found yet.
