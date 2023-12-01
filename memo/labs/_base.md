---
tags:
  - dwarves
  - labs
  - home
title: Labs Team
date: 2023-11-30
description: This is our labs team homepage, where we list out the latest advances in our engineering team, our publications, events & workshops, as well as frequently asked questions on who and what team labs are.
authors:
  - monotykamary
menu: labs
toc: false
notice: 
type: memo
show_frontmatter: true
---
## Latest from Labs Team

```dataview
LIST
FROM #labs AND !"memo/labs/_index" AND !"memo/labs/_base"
SORT date DESC
LIMIT 10
```

## Forward Engineering Publications

```dataview
LIST
FROM #forward-engineering
SORT date DESC
LIMIT 3
```

## Events

### Upcoming

```dataview
LIST description
FROM #labs AND #event 
LIMIT 3
WHERE event_date >= date(today)
```

### Past Events

```dataview
LIST
FROM #labs AND #event 
LIMIT 3
WHERE event_date < date(today)
```

## Frequently Asked Questions (FAQ)

### Who we are

The Labs team are a group of engineers working together towards a common goal, introducing new tech to better help our requirements, engineering quality of life, developer experience, and so much more.

### [[Labs x Consulting Workflow|How we work]]

We essentially consolidate how new tech is introduced through the Labs team and how it gets processed to Consulting team to apply for projects and bring awareness of our tech expertise. We make sure that our team in particular needs to:
- Be able to introduce new tech to help enrich our engineers’ expertise
- Be able to understand what tech is trending and how we can use them

### What we are working towards

On top of understanding what our engineers' are good at, we want to foster a culture of continuous learning and improvement to enrich our engineers' tech expertise. This way, we can allow for pockets of innovation within our organization and allow us to better suit our engineers' skills to the right projects as well as for sales and advisory.

### [[Labs - New Member Onboarding|How to become a member?]]

New members joining our Labs team can be recommended either personally by an existing team member or through a development plan survey. Once onboarded, each new member is paired with a mentor who provides guidance on our operational practices within the team, specifically in relation to a chosen research topic. The initial probation period for new members is set to one month.

During this probation, we expect two main deliverables from the new team member:

- First, an assessment report which should include a use-case and a cost-benefit analysis. This report should be completed within two weeks.
- Second, the new member is expected to conduct a demonstration for the team labs, which should be prepared within a week.

### How to propose a topic?


### [[Reward Model & Nomination|How do we reward?]]

Our Tech Labs is a hub of continuous learning and application of advanced technologies. This program is designed to celebrate contributions at various levels, from enhancing knowledge to contributing to business growth.

- **Level 1: Knowledge Enrichment**: Team members enriching our knowledge base with notes, analysis, or demonstrations.
- **Level 2: Project Application**: Those implementing new technologies or solutions in projects, whether internal, open-source, or client-focused.
- **Level 3: Standardization**: Contributors whose methods or technologies become a standard in our Playbook, showcasing exemplary innovation.
- **Level 4: Deal Acquisition**: Members instrumental in securing new business deals, significantly aiding our growth.

---

![[_base-20231130183110925.webp]]