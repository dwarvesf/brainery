---
title: "Engineers in the AI landscape: architects, tinkerers, planners, and the vibers"
description: "Exploring the new archetypes of software engineers in the age of AI: architects, tinkerers, planners, and vibers."
date: 2025-06-09
authors:
  - monotykamary
tags:
  - culture
  - ai
  - engineering
  - archetypes
redirect:
  - /6oKjKw
---

The ground is shifting beneath our feet. If you're a software engineer and you're not feeling it, you're either lying or you're already obsolete. The introduction of powerful large language models is not just another tool; it's a fundamental paradigm shift that is cleaving the engineering world into distinct archetypes. I've noticed a few patterns emerge from the chaos. Understanding where you and your team fit in is the difference between building the future and getting buried by it.

This isn't just about who can prompt an AI the best. It's about workflow, mindset, and the cognitive structures we use to build things. Your team is likely a mix of these new roles, and the friction you feel is the system trying to self-correct. Let's break them down.

## The AI-augmented architect

![pepe architect](assets/pepe-architect.png)

This is the distinguished engineer who gets it. The architect sees AI not as a replacement but as a massive force multiplier, a ghostwriter for the tedious parts of creation. They operate at a high level of abstraction, feeding the model a well-defined structure and then reviewing the flood of code that comes back. They can manage this because they hold a mental map of the entire system in their head. Their value isn't in writing boilerplate; it's in their taste, their architectural vision, and their ability to conduct rapid, high-level code reviews.

Their weakness: cognitive overload. The sheer volume of code an AI can produce is staggering. Reviewing tens of thousands of lines of code, even good code, is mentally taxing in a way writing it never was. It's a new flavor of burnout, born from the immense cognitive load of constant validation. They risk becoming a bottleneck, the sole validator of an AI's torrential output.

How to cover for it: Aggressive automation and delegation are key. Architects need to offload the initial review process to automated systems. This means robust continuous integration/continuous deployment (CI/CD) pipelines with extensive automated testing suites - unit tests, integration tests, end-to-end tests. They must also empower other team members to become better reviewers by enforcing strict coding standards and documentation, potentially even using a linter AI to check for style and basic errors before the code ever reaches a human. They need to build a system of trust, but that trust must be verified programmatically.

## The tinkerer-turned-creator

![pepe tinkerer](assets/pepe-tinkerer.png)

This is the person who always had great ideas but couldn't write the code to make them real. Now they can. The tinkerer uses AI as a manifestation engine. They are less concerned with the elegance of the codebase and more with the functionality of the output. They are masters of prompt engineering and rapid iteration, treating the AI as a black box and judging it solely by its results. They are bringing a flood of new, functional products and solutions to life that otherwise would have died as ideas on a whiteboard.

Their weakness: technical debt and scalability. While their creations work, they often lack the robust architecture needed to scale or be maintained. They don't know what they don't know about design patterns, security vulnerabilities, or efficient database queries. Their projects are often a single bug away from total collapse, a house of cards built on "vibe-coded" slop.

How to cover for it: Pair them with an architect or a methodical planner immediately. The tinkerer is an incredible source of innovation, but their output needs to be refined and hardened by someone with deep systems knowledge. Implement a mandatory architectural review before any project by a tinkerer goes into production. Give them a "sandbox" environment where they can build and break things without consequence, but have a formal handoff process to a senior engineer who can rebuild the prototype correctly for production. The goal is to harness their creativity without inheriting their technical debt.

## The methodical planner

![pepe planner](assets/pepe-planner.png)

This engineer is the antithesis of the "move fast and break things" mantra. They understand that with AI, moving fast is easy, but moving in the right direction is hard. They spend an enormous amount of time on planning, structuring, and testing before they even let the AI start generating code. They build intricate scaffolding of requirements and tests that forces the AI's output to conform to a high-quality standard. They are building massive, stable systems by treating the AI not as a creator but as a hyper-efficient subordinate that executes a very detailed plan.

Their weakness: analysis paralysis. The methodical planner can become so obsessed with creating the perfect plan that they slow down innovation to a crawl. They can miss market opportunities or fail to pivot quickly because their entire workflow is built around a rigid, upfront structure. They risk designing a perfect system for a problem that no longer exists by the time they're finished.

How to cover for it: Force them into an agile framework. Planners need to work in sprints with concrete, unmovable deadlines. Their detailed plans should be for the next two weeks, not the next two years. Pair them with a tinkerer to inject a sense of urgency and user-centric chaos into their process. The goal is to get the planner to build the minimum viable plan necessary to get started, and then iterate. Celebrate shipping a functional 80% solution over planning a perfect 100% solution that never gets built.

## The "vibe coder"

![pepe viber](assets/pepe-viber.png)

This is the most dangerous archetype. This engineer is seduced by the promise of fully autonomous agentic code generation. They point the AI at a problem, press "go," and hope for the best. They are thrilled by the initial burst of activity but quickly find themselves with a sprawling, incomprehensible codebase that is impossible to debug. They have completely abdicated their responsibility as an engineer and have no mental map of the project. They are not managing the AI; they are being managed by it, stuck in a frustrating loop of generating, testing, and failing.

Their weakness: everything. They produce unmaintainable, buggy, and insecure code. They have no understanding of the systems they are creating and are a massive liability to any serious project. This isn't a workflow; it's a slot machine.

How to cover for it: This is a rescue mission. The unguided vibe coder needs immediate, intensive re-training. They must be banned from using agentic workflows and forced back to basics. Mandate that they write code manually, or at the very least, use AI in a co-pilot capacity where they are writing and reviewing every single line. Pair them with a methodical planner to learn the discipline of structured development. Their access to AI tooling should be restricted until they can demonstrate a fundamental understanding of the systems they are building. Sometimes the best way to use a new tool is to first remember how to work without it.

## A balanced system

The critical skill now is not just mastering AI tools, but mastering yourself. You need to honestly assess whether you're an architect, a tinkerer, or a planner and then aggressively mitigate the inherent weaknesses of that archetype.

The real goal isn't to become some mythical, perfect engineer who embodies all of these traits. That person doesn't exist. The goal is to build a team that does. A team composed of a planner to lay the foundation, a tinkerer to drive rapid innovation, and an architect to ensure it all scales is a force of nature. The unguided vibe coder serves as a cautionary tale of what happens when you let the tool become the master.
