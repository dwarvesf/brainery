---
title: Definition of done (DoD)
description: The checklist a story must pass before the team calls it done, for software work and for services work.
date: null
kind: reference
redirect:
  - /t42LFg
authors:
  - neko
---

Definition of done also known as **DoD** is a list of criteria which must be met before a product increment (story) is considered "done".

**In software, Done means**

- [ ] coded to standards
- [ ] reviewed
- [ ] implemented with unit test
- [ ] well documented

**In a services context, Done means**

- [ ] every task under the User Story has been completed
- [ ] and any work created is attached to the User Story
- [ ] so the Product Owner can review it
- [ ] and it meets his or her expectations.

The Definition of Done ensures everyone on the Team knows exactly what is expected of everything the Team delivers. It ensures transparency and quality fit for the purpose of the product and organization. Getting stories done can double a Teams Velocity.

## Worked example

Story: "As a customer, I can reset my password by email."

| DoD item                 | Evidence for this story                                           |
| ------------------------ | ----------------------------------------------------------------- |
| Coded to standards       | Lint and format checks pass in CI                                 |
| Reviewed                 | Pull request approved by one other engineer                       |
| Unit tested              | Tests cover token expiry, reused token and unknown email          |
| Documented               | README and API docs describe the new endpoint and its error codes |
| Product Owner can review | Link to the staging build and the PR sits on the story            |

If one row has no evidence, the story is not done. Move it back instead of closing it with a follow-up ticket.

## Tips

- Agree on the DoD with the team before the first sprint, and review it when the team retrospects.
- Keep it short enough to check in a minute. Put story-specific conditions in the acceptance criteria, not in the DoD.
- Add items only when a past defect shows a gap, for example "migration tested on a copy of production data".
