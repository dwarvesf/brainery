---
title: Product principles for makers, focus, bedrock and soul
description: Three principles for building products that last, covering small sharp tools, the bedrock core that outlives feature cloning, and keeping soul while scaling.
slug: product-principles-make
kind: reference
date: 2024-12-19
authors:
  - tieubao
tags:
  - make
  - product
  - philosophy
  - focus
  - ai
pinned: true
redirect:
  - /research/topics/make/bedrock
  - /research/topics/make/soul
  - /research/topics/make/small-sharp-tool
---

Most products fail because they try to do everything. They become feature salad, bloated with features that confuse users. These notes collect three principles that push the other way. Do one thing well, so the product stays focused and composable. Keep a bedrock core that serves what users need, so feature cloning cannot wear it down. Protect the soul, so growth does not strip out the care that made people love the product.

## Do one thing well

The best products do one thing exceptionally well. This philosophy is the foundation of sustainable product development. It comes from the Unix tradition of small, sharp tools, and it offers an alternative to the bloated, everything-and-the-kitchen-sink approach that plagues modern software.

As agentic AI and fast-moving technology arrive, the principles behind `grep`, `curl` and `jq` matter more than before. These tools succeed because they focus, compose and integrate seamlessly. Your products and AI systems should too.

### The Unix way

Small, sharp tools are lightweight programs that excel at a single task. They embody Doug McIlroy's 1978 philosophy: "Write programs that do one thing and do it well." They share three characteristics:

- **Focused scope:** They solve one problem completely rather than many problems partially.
- **Composable design:** They work together through pipes, APIs or standard interfaces.
- **Clear boundaries:** They avoid feature creep and unnecessary complications.

### Why focus matters now

**Products stay maintainable.** When a note-taking app tries to be a calendar and task manager, everything suffers. When it focuses on fast, distraction-free writing, it excels.

**Teams move faster.** Small, scoped features ship quickly. You can validate assumptions and iterate without managing monolithic complexity.

**Users understand the value.** Stripe focuses on payments, not accounting. Calendly handles scheduling, not project management. Clear value propositions win.

**Systems integrate better.** Products designed as focused tools integrate through APIs and standard formats, so users can build custom solutions.

### Agentic AI applications

The same philosophy is crucial for AI systems:

- **Specialized agents:** Create focused agents that excel at specific tasks, rather than generalist AIs that do everything poorly.
- **Composable workflows:** Design agents to work together through clear interfaces, like Unix pipes for AI.
- **Clear failure boundaries:** A narrow scope makes AI limitations predictable and manageable.

### How to build this way

- **Define clear boundaries:** Use jobs-to-be-done frameworks to identify the core purpose.
- **Design for composition:** Build with APIs and standard formats for integration.
- **Resist scope creep:** Ask whether each new feature serves the core purpose.
- **Start minimal:** Launch with the smallest viable feature that delivers value.

The future belongs to products and AI systems that do one thing exceptionally well and compose well with others. In a world of infinite possibilities, focus is a competitive advantage.

Source: [Small, Sharp Tools](https://brandur.org/small-sharp-tools) by Brandur Leach, December 12, 2014. Additional insights from _The Art of Unix Programming_ by Eric S. Raymond and modern Unix tool communities.

## Bedrock

Bedrock is a way to build products that stick by focusing on what matters to users.

### What bedrock means

Bedrock is your product's core foundation. It is the essential stuff that delivers real value to users, stripped of all the noise. Many products end up with a mess of features driven by internal politics or stakeholder whims. Bedrock stays laser-focused on user needs.

It connects directly to the Unix philosophy above. Just as `grep` excels at pattern matching and `curl` handles data transfer, your product should do one thing exceptionally well. The magic happens when simple, focused tools work together seamlessly.

Bedrock is an ongoing process of refinement. You keep gathering user feedback, run A/B tests, and use your own product to find pain points. The goal is to keep the core simple and user-focused while everything else changes around it.

### Bedrock vs MVP

An MVP is your starting point. It is lean, quick to build, and designed to test assumptions fast. Think of a finance app's MVP with basic expense tracking and one simple report.

Bedrock is broader and more enduring. An MVP might pivot or fail based on early feedback. Bedrock commits to a user-centric core that evolves without bloating. Your MVP can become bedrock, but only through disciplined iteration that maintains simplicity and stability.

### The AI challenge and opportunity

AI changes the picture. Competitors can now clone your features almost instantly. Generative AI automates UI design and replicates functionality, which floods markets with look-alike products. User expectations are rising too.

This makes bedrock more valuable:

**When features get commoditized, experience wins.** AI can copy functionality, but it struggles to replicate authentic user trust or emotional connection.

**Simplicity stands out in noisy markets.** While competitors add AI features everywhere, a bedrock product stays clear and focused.

**Data becomes your moat.** A well-crafted bedrock collects user insights ethically and creates feedback loops that strengthen over time.

### How to build bedrock today

**Use AI to understand users better.** Machine learning can analyze behavior in real time and help you identify which core features matter.

**Focus on emotional connection.** Build trust and safety into your core. This separates lasting products from AI-generated clones.

**Design for modularity.** Like Unix tools that pipe together, your bedrock should be flexible enough for AI-driven updates without losing simplicity.

**Speed up your feedback loops.** AI can accelerate A/B testing and user research, so you refine your bedrock faster than competitors can copy it.

### Why bedrock matters now

When AI commoditizes features, products win through trust and simplicity. Start with what users need, iterate with AI, and stay focused on real value. The key insight is to sacrifice short-term growth for long-term stability. In a world of infinite AI possibilities, focus becomes your competitive advantage.

Source: Adapted from [From Beta to Bedrock: Build Products that Stick](https://alistapart.com/article/from-beta-to-bedrock-build-products-that-stick/) by Liam Nugent, A List Apart, April 23, 2025. Additional insights from the Unix philosophy and small, sharp tools principles.

## Soul vs scale

The market rewards scale, but users fall in love with soul. These two forces often pull in opposite directions.

Soul is what happens when you pour care, love and attention into every detail of what you build. Scale is what happens when market pressures demand growth, profitability and predictable outcomes. Most companies think they have to choose one. Steve Jobs showed you can have both.

### What soul means

Soul is the tangible result of caring deeply about your product. Jobs captured it with his carpenter analogy: even the back panel of a chest of drawers, which nobody sees, gets a beautiful piece of wood instead of cheap plywood. "You'll know it's there," he said. That hidden craftsmanship is soul.

In product terms, soul shows up as thoughtful details, a consistent vision, quality beyond the minimum requirements, and genuine care for user experience over internal metrics.

### The scale pressure

Markets have different priorities. Investors want growth. Competitors force you to move fast. This creates predictable tensions: feature bloat, quality compromises, metric optimization over value, and lost focus.

Look at Uber's journey. It started as a premium ride experience with nice cars and smooth UX. After its IPO it became cluttered with ads and inconsistent quality. The market reshaped it into something efficient and soulless.

### Getting it right

**Apple** kept its soul while becoming the world's most valuable company. Jobs insisted on hiring people who "want to make the best things in the world." Even at massive scale, Apple prioritizes design excellence over quick wins.

**Airbnb** faced this tension during 100x growth and doubled down on trust and community. It created the $1 million Host Guarantee and had employees personally visit unreviewed listings. That is care at scale.

### How to maintain both

- **Hire for passion:** Skills can be taught, but genuine care cannot be faked.
- **Protect core values:** Make them non-negotiable when market pressures demand compromises.
- **Sweat invisible details:** Like Jobs' carpenter, put quality in unseen places.
- **Stay close to users:** Fight the distance that scale creates between builders and users.
- **Say no more than yes:** Every feature should align with your core mission.

### Why soul matters now

In an era of rapid change and AI, soul creates the emotional connection that keeps users loyal through transitions. Anyone can build features quickly. Soul makes products irreplaceable.

The choice is yours: build something users love that happens to scale, or build something that scales that users happen to tolerate. Only one creates lasting value.

Source: Insights from the [Stanford Commencement Address 2005](https://news.stanford.edu/stories/2005/06/youve-got-find-love-jobs-says) and [Soul vs Scale](https://hvpandya.com/soul-vs-scale).
