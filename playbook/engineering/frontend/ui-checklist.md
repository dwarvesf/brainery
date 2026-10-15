---
title: Frontend UI checklist
description: A pre-ship checklist for spacing, responsiveness, states, copy and icons when building or implementing a design.
date: 2026-10-15
redirect:
  - /3HShrA
---

Frontend engineering is not just about producing high quality code but also attentive design. Whether you work on a design or transform a design to code, make sure the below checklist is done before you ship.

- Is relative spacing to UI elements as base unit of 4?
- Does your relative spacing match the relative spacing of similar UI elements?
- Does it look good on desktop, tablet, and mobile?
- Are you using existing elements / components where appropriate?
- Are you using the right colors from the design system?
- What happens to text when it gets too long? _(e.g. truncation, wrapping, etc)_
- Are all interactive states accounted for? _(e.g. default, touch, hover, disabled, etc)_
- Are empty states accounted for?
- Are error states accounted for?
- Are loading states accounted for?
- Are we using correct [writing styles](https://material.io/design/communication/writing.html#principles 'https://material.io/design/communication/writing.html#principles') to communicate?
- Are existing patterns being used for similar actions/items? _(e.g. text link vs. secondary button, back arrow vs. back link, tooltip vs. exposed helper copy)_
- Does your icon choice communicate effectively?

## State matrix

For every component that shows data, confirm each state has a design and has been seen in the browser:

| State                  | Check                                                   |
| ---------------------- | ------------------------------------------------------- |
| Default                | Matches the design at desktop, tablet and mobile widths |
| Loading                | Skeleton or spinner, no layout jump when data arrives   |
| Empty                  | Explains what is missing and what to do next            |
| Error                  | Says what went wrong and offers a retry or a way out    |
| Long content           | Truncates or wraps as designed                          |
| Hover, focus, disabled | Visible, and focus works from the keyboard              |

## Read on

- [Tech ecosystem](tech-ecosystem.md)
- [Code style](code-style.md)
- [Writting test](writing-test.md)
- [Logging and monitoring](logging-monitoring.md)
