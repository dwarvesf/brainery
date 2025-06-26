---
title: How to be a good planner
description: A guide to effective planning in software development, winning with AI-assisted workflows.
date: 2025-05-27
authors:
  - monotykamary
tags:
  - planning
  - software-development
  - vibe-coding
  - productivity
redirect:
  - /OKIkoA
---

Effective planning is a cornerstone of successful software development. It's not just about outlining steps; it's about deeply **understanding the problem**, the existing landscape, and the **desired outcome**.

## The core principles of good planning

Good planning, especially in the context of modern development practices that may involve AI agents, revolves around a few key ideas. These principles help ensure clarity, reduce wasted effort, and lead to more robust and well-integrated solutions.

---

### Deep discovery

![Searching](assets/searching.gif)

Before any code is written or even a detailed plan is formulated, a thorough understanding of the current state is crucial. This "deep discovery" phase involves:

- **Understanding the existing system:** For AI and human developers alike, this means exploring the current codebase, architecture, and any relevant documentation. The AI can assist by summarizing existing modules, data flows, and dependencies.
- **Relaying the state:** The AI should articulate its understanding of the project back to the human developer. This ensures both parties are on the same page and have a shared, accurate picture of where to start. This is similar to the "Plan Mode" described by Cline, where the agent builds a map of the repository.

This initial investment in understanding prevents misinterpretations and ensures that any subsequent planning is built on a solid foundation.

---

### Feature fit

Once the current state is well understood, the next step is to determine how the new feature or change fits into the existing structure. This involves asking:

- **Where does this new functionality belong?** Identify the modules, services, or components that will be affected or extended.
- **Is there a necessary flow or boilerplate?** Consider if there are established patterns or required files for the type of change being made (e.g., specific file structures in a Go project, or standard components in a frontend framework).

Understanding the "feature fit" helps in creating a more targeted and efficient implementation plan. It's about knowing not just *what* to build, but *where* and *how* it integrates.

![Puzzle pieces](assets/puzzle-pieces.gif)

---

### Vibe plan the first document

With a good feel for the project and where the new feature fits, the initial plan can be drafted. This "vibe plan" is a first pass, often high-level, that outlines a possible implementation strategy.
- **AI as a brainstorming partner:** Allow the AI to propose an initial plan based on its understanding. This leverages the AI's ability to quickly process information and suggest potential paths.
- **Focus on the core logic:** At this stage, the plan might not cover every edge case but should capture the essence of the solution.

This approach is akin to the "Architect" model described by Aider, where a reasoning model first describes *how* to solve the problem.

![Planning](assets/planning.gif)

---

### Iterate on the plan

The initial "vibe plan" is rarely perfect. The next crucial step is to iterate and refine it through a collaborative process. We're playing on a chessboard that hasn't even started.

![Big brain chess play](assets/big-brain-chess-play.gif)

- **Sparring with the AI:** Use the AI as a sounding board. Discuss the proposed plan, ask clarifying questions, and challenge assumptions.
- **Identify overlooked aspects:** This iterative discussion helps uncover missing pieces, potential roadblocks, or alternative approaches that might be more efficient or robust.
- **Refine the details:** Gradually flesh out the plan, adding more specific steps, considering edge cases, and defining interfaces.

This iterative refinement is where the "battles" of coding and refactoring are fought at the planning stage. The goal is to anticipate challenges and make informed decisions before committing to code, thereby "winning the war once with code."

---

### Winning

Then, you just tell the AI to code the plan. 8/10 times, the plan will be sufficient enough to **one-shot** your desired implementation. Behind the scenes, you've already *won the war*.

![Context winning](assets/context-winning.gif)

---

## The planning mindset

This planning methodology is a shift from diving headfirst into coding. It emphasizes that the intellectual work of understanding, structuring, and refining a solution is as important, if not more so, than the act of writing code itself. By frontloading this effort, and by leveraging AI as a collaborative partner in the planning process, development becomes more focused, efficient, and ultimately, more successful. The aim is to keep the struggles and iterations within the realm of thought and planning, leading to a smoother and more direct path to a well-crafted final product.

## Must reads

- https://cline.bot/blog/plan-smarter-code-faster-clines-plan-act-is-the-paradigm-for-agentic-coding
- https://aider.chat/2024/09/26/architect.html
