---
title: Domain-driven design primer, from overview to entities and the domain model
description: Notes on domain-driven design after Eric Evans, covering what DDD is for, when to use it, how entities get identity and continuity, and how a domain model is built from events, commands, aggregates and bounded contexts.
slug: domain-driven-design-primer
kind: essay
date: 2022-07-02
authors:
  - R-Jim
tags:
  - ddd
  - architecture
  - domain-model
redirect:
  - /research/topics/architecture/overview-of-domain-driven-design
  - /rT8p8Q
  - /research/topics/architecture/entities-in-domain-driven-design
  - /DB2iSA
  - /research/topics/architecture/domain-model-in-domain-driven-design
  - /lDeHFw
---

These notes follow Eric Evans' _Domain-Driven Design_ and the book notes on herbertograca.com. They run in the order a newcomer needs: what DDD is and when it pays off, how entities are identified, and how a domain model is assembled.

## What domain-driven design is

Domain-driven design (DDD) is a software design approach that focuses on the **domain**, one of the keys to an application's success. It builds a rich, meaningful **domain model** using rules and conventions such as **ubiquitous language** and **event storming**.

Two effects follow from keeping the conversation on the domain:

- It removes _communication lag_ between **developers** and **domain or business experts**.
- It separates the important domain-specific components, which helps maintenance and scalability.

### Why teams use it

**Less vocabulary ambiguity.** The domain expert speaks in business terms and the developer in technical ones. DDD introduces the **ubiquitous language**, a common and rigorous medium built by both parties to define statements and software solutions without ambiguity. The word _rigorous_ is the point.

**Better understanding of the business domain.** The drawn-out **domain model** and **domain events** clarify the important aspects of the business. The team can speculate about potential features and issues and prioritize critical business flows for enhancement and scalability.

**Technology independence.** The core of DDD is the design decisions made while modeling the domain. Because the team is not tied to technical detail, it has more options for selecting or adopting new technology.

**Human aspects.**

- With the output diagrams and conversations, stakeholders and PMs get better evidence to measure the success of the project.
- On the resource side, newcomers learn the overall system faster. Most translation documents between business and technical terms are dropped, and discussion with others replaces them.
- For developers, it stays important to understand the problems that the technology is there to solve.

### When to use it

DDD is designed for complex business domains. It may not suit applications with minor domain complexity but high technical complexity. It also requires discipline and a dedicated development team plus domain experts.

Example projects that use DDD:

- [ibm-cloud-architecture/vaccine-solution-main](https://github.com/ibm-cloud-architecture/vaccine-solution-main), a vaccine distribution domain
- [ddd-by-examples/library](https://github.com/ddd-by-examples/library), a library booking domain

## Entities

An entity is an object that the model tracks over time. Two definitions apply.

**A) Defined by identity.** An ID tells apart two objects that have the same attributes, for example two persons with the same name and date of birth but different ID card numbers.

**B) Defined by a thread of continuity.** A set of fingerprints or traces of an object as it passes through multiple systems.

### Examples from the real world

- **Banking (A).** A banknote has an ID that identifies it on digital systems or in a physical log book, even if all its other attributes (value, printing date, printing batch) match another banknote.
- **Online shopping (a, b).** An order has an ID.
  - After checkout, the system sends the order ID to the payment service.
  - After payment completes, the system calls the shipping service API to generate a shipment with a tracking ID.
  - On the shopping website, the order detail page lets the user check payment and shipping status. The payment and shipping systems show the order ID and details. When the package arrives, the order ID, shipping fee, total items and prices can be viewed.

### Ways to implement identity in a system

- **Generated ID (a).**
- **Combination of attributes (A).** A batch of newspapers identified by name, city and publish date.
- **Request time (B).** A service logs each incoming call and identifies it by request time combined with an IP address. This is not recommended when the caller is a middleware service or gateway.

### The entity's role in DDD

An entity's job is to _establish continuity so that behavior is clear and predictable_. Focus on how the system revolves around the entity and decide the identifier from that, never the reverse.

Example: on an online furniture shop, the user compares brand name, model number, maybe design and color of chairs or tables. A separate ID for each physical item could distort the checkout design. If the item with that ID is sold out, the user has to find a similar item with a different ID.

## The domain model

In DDD, the domain model is the organized and structured **knowledge of the business problem**. It can take the form of a diagram, code examples or written documentation. It **must** be accessible and understandable by **everyone** on the project.

It holds the vocabulary and key concepts of the domain and the relationships among all the entities. These divide mainly into **domain events**, **commands**, **aggregates** and **bounded contexts**.

### Domain events

A domain event is _a statement in past tense_. It describes **something that happened** in a business system and changed the state of an entity. Examples: Order submitted, Shopping cart updated.

### Commands

A command is _a verb in present tense_. It describes the action that triggers the corresponding **domain event**, and it comes from a user or from the system.

- `Add product` (command) -> `Shopping cart updated` (domain event)

### Aggregates

An aggregate is a _minimal cluster_ of associated objects (domain events, commands and actors) treated as one unit for data change. Each aggregate has a boundary and exposes only its root, the **aggregate root**, which lets other objects reference it.

Example: a team updates a member's role per project.

- `Project, Update member role` (aggregate root) -> `Project's member role updated`

### Bounded contexts

A bounded context is a high-level structure that categorizes functionality. It is drawn as a circle or square that groups related entities. It can bound parts of an aggregate or several aggregates.

Example: in the aggregate for the shopping process, draw bounded contexts for **Shopping cart** and **Offers**.

- Shopping cart: `User` -> `Add product to cart` -> `Cart updated`
- Offers: `Promotional Offers Identified` -> `Offers added`

## References

- Evans, Eric. _Domain-Driven Design_.
- [Book notes on Domain-Driven Design by Eric Evans](https://herbertograca.com/category/development/book-notes/domain-driven-design-by-eric-evans/), herbertograca.com
- [Event storming](https://creately.com/blog/diagrams/event-storming/), Creately
- [Domain-driven design aggregates](https://www.jamesmichaelhickey.com/domain-driven-design-aggregates/), James Michael Hickey
- [Working with aggregates](https://serialized.io/java/working-with-aggregates/), Serialized
