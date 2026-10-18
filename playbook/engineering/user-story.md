---
title: Agile requirement - user story
description: How to write agile user stories, with the INVEST test, epics and themes, and common myths.
date: null
redirect:
  - /6v6jrw
authors: []
credit: Dwarves Foundation
---

## What is user story?

In the traditional software development method, requirements are noted as a handful of documentations, specifications...

In Agile, they are User Story is requirement. User Story is:

- A convenient format for expressing the desired business value
- Crafted in a way that makes them understandable to both business people and technical people
- Used to provide a great placeholder for a conversation
- Written at various levels of granularity and are easy to refine
- Often used with the template:
  `As a <role>, I want <feature> so that <reason>`

Example:

- As a **User**, I want to **login into the system** so that **I can use other useful features**
- As an **Admin**, I want **the system to log the login information** so that **I can monitor who accesses the system**

**Epic**: A very large user story that will not fit into a single iteration, does not pass the test for inclusion in an iteration, and will need to be subdivided to be considered.

**Theme**: A collection of features, epics, & stories that describe a broad business purpose.

### Example: from epic to stories

Epic: "Customers can pay for an order online". It is too big for one iteration, so split it into thin vertical slices, each one usable on its own:

- As a **customer**, I want to **pay with a saved card** so that **I do not retype card details**
- As a **customer**, I want to **receive an email receipt** so that **I have proof of payment**
- As a **finance officer**, I want to **export paid orders as CSV** so that **I can reconcile them with the bank**

Each story carries acceptance criteria, the conditions that make it done. A common format is Given / When / Then:

```text
Given a customer with a saved card and a cart worth 50 USD
When they confirm the payment
Then the order status becomes "paid"
And a receipt email is sent within 1 minute
```

Quick INVEST check on the first story: it does not depend on the receipt story (Independent), the card flow is open to discussion (Negotiable), customers get value (Valuable), the team can size it (Estimable), it fits in one sprint (Small), and the criteria above can be tested (Testable). If a story fails any letter, split or rewrite it.

## What else does user story have?

![](assets/user-story_6513e3c6180031dc47efb8c4a0d05fcf_md5.webp)

Sometimes the User Story will also include the design/wireframe for the screen and other extra information and will be logged as an item in the backlog (Like Trello card, Gitlab issue,...)

## What defines good user story?

INVEST is an acronym which encompasses the following concepts which make up a good user story:

- **I**ndependent
- **N**egotiable
- **V**aluable
- **E**stimable
- **S**mall (appropriately sized)
- **T**estable

## Some myths about user story that you should know

- User Stories are NOT a final requirement but rather a conversation starter between all roles
- User Stories do not always result in a feature that end-user could use, like [Spike User Story](https://www.leadingagile.com/2016/09/whats-a-spike-who-should-enter-it-how-to-word-it/)
- User Stories are a requirement and also Change Request - because we are living in an Agile world with rapid change, a user story is also a change request, an enhancement, a new feature... and it all should be treated the same and developers should NOT be scared of it
