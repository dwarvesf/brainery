---
title: Dwarves Consulting
short_title: § Dwarves Consulting 💼
description: "We're a team combining tech skills, problem-solving, and clear communication. We help businesses overcome challenges by finding root causes, creating practical solutions, and working closely with clients to implement them effectively."
date: 2023-12-21
authors:
  - tieubao
  - monotykamary
  - nikkingtr
tags:
  - consulting
redirect:
  - /YnApuQ
---

The Consulting team is a strategic spin-off built on the foundation of our Tech Research team. While Tech Research explores emerging technologies and builds innovative solutions, we take those insights and apply them directly to real business challenges.

This unique setup gives us a competitive edge - we're practitioners backed by cutting-edge research, bridging the gap between innovation and practical application.

## Latest from consulting team

```dsql-list
SELECT markdown_link(COALESCE(short_title, title), file_path)
FROM vault
WHERE file_path ILIKE '%consulting%'
  OR ['partners', 'consulting'] && tags
ORDER BY date DESC
LIMIT 5;
```

## Series

- [Navigate framework](./navigate): Comprehensive guide to our navigation changes methodology.
- [Case studies](./case-study): Learn from our practical consulting experiences.
- [Arc](/updates/arc): Deep dive into our research methodology and findings.

## Key articles for consultants

### Overview

- [Organize consultant team](build-consultant-team.md): How to set up and run the team well.
- [The adjacent possible](adjacent-possible.md): Understanding innovation and possibilities.
- [Market players](market-players.md): Identifying key players in the market.

### Sales process

- [Leads generation](leads-generation.md): Strategies for finding potential clients and new business.
- [Inefficiency arbitrage](inefficiency-arbitrage.md): Find and make money from things that aren't working right in the market.
- [Apply as a squad](apply-as-a-squad.md): How to work as a squad to land deals.
- [Engagement models](engagement-models.md): Different ways to work with clients.
- [On deal making](deal-making.md): Tips for closing deals successfully.
- [Setting the budget](setting-the-budget.md): How to figure out and handle project money.
- [Fixed-budget, Scope-controlled](fixed-budget-scope-controlled.md): Managing fixed budget and scope.
- [Understanding billing by hours](bill-by-hours.md): Understanding billing by hours.
- [A pilot run](pilot-run.md): Experience our services firsthand.

### Start the project

- [Client onboarding](client-onboarding.md): How to onboard client.
- [Project delivery and soft skills](client-delivery.md): How to do great work for clients and get along with people.
- [Required dev skills](dev-skill-required.md): Required skills for developers working with clients.
- [Client-side and Agency-side](client-side-agency-side.md): What it's like being a client vs. being an agency.
- [Service feedbacks](service-feedbacks.md): How to get and use feedback from clients to get better.

### Others

- [Partner network](partners-network.md): Build connections with others you work with.
- [Navigate through changes](navigate/README.md): Help the team deal with changes.

---

> Next: [Organize consultant team](build-consultant-team.md)
