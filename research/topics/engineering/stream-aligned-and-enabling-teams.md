---
title: "Team Topologies: stream-aligned teams and the enabling teams that support them"
description: "Notes on two Team Topologies team types: what a stream-aligned team owns and needs, and how an enabling team closes capability gaps for it."
slug: team-topologies-stream-aligned-and-enabling-teams
kind: essay
date: 2022-09-19
authors:
  - zlatanpham
tags:
  - team-topologies
  - team
  - engineering
redirect:
  - /research/topics/engineering/stream-aligned-team
  - /2fZP2w
  - /research/topics/engineering/enabling-team
  - /fMa08g
---

Team Topologies, by Manuel Pais and Matthew Skelton, sorts software teams into four types. Two of them matter most to how we work: the stream-aligned team, which delivers, and the enabling team, which helps it learn. These notes restate the book's definitions in our own words. For the full model, see [Team Topologies](team-toplogies.md) and [the key concepts on teamtopologies.com](https://teamtopologies.com/key-concepts).

## Stream-aligned team

### What it is

A stream is a continuous flow of work tied to a business domain or an organizational capability. It needs clear goals and clear responsibilities, so that several teams can run side by side, each with its own flow.

A stream-aligned team works on one stream of valuable work. The stream can be a product or service, a set of features, or a user persona. The team owns that work from start to finish and needs no hand-offs from other teams for any part of it. Because it covers the full spectrum of delivery, it can respond quickly to customer feedback and watch its software in production. It is the primary team type in an organization, and the other fundamental types exist to support it.

### Capabilities it needs

To move work from first exploration to production, the team needs these capabilities:

- Application security
- Commercial and operational viability analysis
- Design and architecture
- Development and coding
- Infrastructure and operability
- Metrics and monitoring
- Product management and ownership
- Testing and quality assurance
- User experience (UX)

### What to expect from it

- It delivers a steady stream of features.
- It adapts quickly to change.
- It experiments and learns from its mistakes.
- It hands almost nothing off to other teams.
- It is judged on the sustainable flow of change it produces, plus a few technical and team-health metrics.
- It has time and space to improve code quality, so that changing the code stays safe and easy.
- It reaches out regularly to the supporting team types: complicated subsystem, enabling and platform.
- Its members feel they are on the path to autonomy, mastery and purpose.

## Enabling team

### The problem it solves

A stream-aligned team has to keep improving its capabilities to stay competitive. Under constant pressure to deliver and to react to change, it struggles to find time to research new skills, practice them and fold them into its delivery.

### What it is

An enabling team is made of experts who close the capability gap between the stream-aligned teams and a technical or product domain. It gives those teams advice and input, so they can acquire and grow capabilities without spending as much time and effort themselves.

Enabling teams collaborate closely. They work to understand the problems and shortcomings of the stream-aligned teams so that their guidance is useful. Our note also calls them "Technical Consulting Teams", because they give guidance and do not do the work for others, whether they sit inside or outside the organization.

An enabling team often supplies the tools a stream-aligned team needs. It can map to any of the stream-aligned capabilities, such as user experience, architecture or testing. In practice it often focuses on build engineering, continuous delivery, deployments or test automation for a given client technology: desktop, mobile or web. For example, it might set up a skeleton deployment pipeline, or a basic test framework built from automation tools plus a few starter scenarios and samples.

Knowledge transfer can be temporary, when a stream-aligned team adopts a new technology such as containerization. It can also be long-term, for aspects that keep improving, such as faster builds or faster test runs. Pairing works well for some practices, such as defining Infrastructure-as-Code.

### What to expect from it

- It works with stream-aligned teams to understand their needs, sets regular checkpoints and agrees when more collaboration is needed.
- It keeps up with new approaches, tools and practices in its area before the stream-aligned teams need them.
- It carries both good news and bad news to the organization. Good news might be a new UI automation framework that cuts custom test code by 50%. Bad news might be that a JavaScript framework the teams use heavily is no longer maintained. Either one helps management follow the technology life cycle.
- It sometimes acts as a proxy for services that stream-aligned teams cannot yet use directly.
- It spreads learning beyond itself, across the stream-aligned teams, and curates knowledge sharing in the organization. It should see itself as the key learning function of the organization.

### Limits

The goal is to help stream-aligned teams deliver working software in a sustainable, responsible way. Enabling teams do not exist to fix problems caused by poor practices, poor prioritization or poor code quality inside a stream-aligned team. A stream-aligned team should expect to work with an enabling team for weeks or months, long enough to build capability in a new technology, concept or approach. Once the new skills are embedded in the team, the enabling team moves on to a different one.

## How the two fit

|                        | Stream-aligned team                           | Enabling team                                   |
| ---------------------- | --------------------------------------------- | ----------------------------------------------- |
| Job                    | Delivers a stream of valuable work end to end | Raises the capabilities of stream-aligned teams |
| Owns                   | The product, service, feature set or persona  | Guidance, tools and learning, not delivery      |
| Time with a given team | Ongoing                                       | Weeks or months, then it moves on               |

## References

- Manuel Pais and Matthew Skelton, _Team Topologies: Organizing Business and Technology Teams for Fast Flow_
- [Key concepts](https://teamtopologies.com/key-concepts) on teamtopologies.com
