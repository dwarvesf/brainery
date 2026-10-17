---
title: "Waterfall, iterative or Agile: how to choose a software lifecycle for a project"
description: "Software 101 notes on when Waterfall, iterative and Agile each fit, where each one breaks, and why no single lifecycle suits every software project."
slug: choosing-waterfall-iterative-or-agile
kind: essay
date: 2026-10-18
authors:
  - tieubao
tags:
  - 101
  - engineering
  - process
  - waterfall
  - agile
redirect:
  - /research/notes/software-101/software-process/waterfall-iterative
  - /kGSuCQ
  - /research/notes/software-101/software-process/waterfall-agile
  - /YpULbg
---

Two Software 101 notes ask one question: which software lifecycle fits a given project? One compares Waterfall with the iterative approach, the other compares Waterfall with Agile. Han curated them into this page. The original notes name no author and no source.

## Waterfall or iterative

Both approaches follow a well-defined process with specific details. They differ in when they fit and what they risk.

| | Waterfall | Iterative |
|---|---|---|
| Choose it when | Requirements are well understood. The project must follow rules and regulations, such as a large critical project or a government one, and needs a high level of quality and documentation. | Requirements are unclear and still change. The product must reach customers quickly, even if it is not complete yet. |
| Release | You complete everything, then release the product to customers all at once. | You deliver fast, and customers use the product in small parts as they need it. |
| Main risk | If requirements change, much of the work has to be redone. If the project is too big and takes too long, the technology may change and make it obsolete. | The team can become too reactive to a stream of small changes. Too many changes make the product more complex and harder to maintain, and the speed of delivery can compromise quality. |

Each approach has strengths and weaknesses, and each should be used where it is strong. Knowing the weaknesses lets you plan risk mitigation ahead of time.

## Waterfall in practice

No single lifecycle fits every kind of development. Waterfall has advantages and disadvantages, and so does Agile, so you cannot say that one side is right and the other wrong.

### Why Waterfall is still around

Waterfall remains a popular approach in the industry, and most universities still teach it. It is simple, easy to understand, and used in many projects, especially large ones. For students without much experience it is a good model for learning how software development works. Once they understand it well, they can move on to Spiral, Incremental, Agile and others.

Waterfall organizes the work into distinct phases, so a manager can schedule each task within a set period. The next phase starts only when the current one is done, and phases never overlap. Progress moves in a sequential, linear way, which makes it easy to manage. Each phase ends with specific documents and products, so managers can track progress.

### Where it breaks

Waterfall assumes a perfect situation: clearly defined requirements and minimal change during development. In reality requirements are rarely clear and change often, so developers must go back and redo their work. That rework has several costs:

- The schedule slips.
- The project takes more effort and costs more.
- The system can end up badly structured and hard to maintain.
- A strict schedule can leave problems unsolved, so the released software still has defects.
- Requirements added late disrupt the work, and not all of them get built correctly.

The result is low-quality products and unhappy customers.

## Where Agile falls short

Agile is a good approach for **smaller projects**, and it has disadvantages too:

- **It needs active users.** Agile assumes users will take part and collaborate with developers. In reality users are often busy and may lack the time or skills. Without them, Agile may not work.
- **Welcoming change cuts both ways.** As changes pile up and the scope keeps shifting, the project may never finish on time (scope creep). Agile keeps adjusting to the customer's changes, so it is hard to plan the project budget.
- **It needs experienced developers.** Agile asks developers to take many roles: talk to customers, set priorities, write code and test continuously. Most companies lack enough of these people. Inexperienced developers often fail in Agile, especially without proper training and good Agile coaches.

## No perfect method

No "perfect method" or "perfect way" exists to develop software. Anyone who says Agile always beats Waterfall, or the reverse, is not looking at real projects. The better question is which approach fits this circumstance, this environment and this project, so that the software is good and meets the customer's expectations. That approach might be Waterfall, Agile or something else.
