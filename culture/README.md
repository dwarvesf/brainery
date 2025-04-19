---
title: Notes on our culture
date: 2024-04-29
description: A collection of thoughts, principles, and experiences that define our culture beyond what's written in the handbook. These articles explore different aspects of how we work, make decisions, and build a community of exceptional engineers.
authors:
  - tieubao
tags:
  - culture
  - overview
pinned: true
---

## Beyond the handbook

While our [handbook](../handbook/what-we-value.md) outlines our core values of **Craftsmanship**, **Teamwork**, and **Sustainability**, culture is more than just a document or a set of rules. It's the living, breathing essence of how we work together every day.

This collection of articles represents our ongoing exploration of what makes Dwarves culture unique. Each piece captures thoughts, experiences, and principles that have emerged from our journey building a company where engineers thrive.

## Latest from culture dir

```dsql-list
SELECT markdown_link(COALESCE(short_title, title), file_path)
FROM vault
WHERE file_path ILIKE '%culture%'
  OR ['culture', 'culture'] && tags
ORDER BY date DESC
LIMIT 20;
```

## What you'll find here

The writings in this folder cover a range of topics:

- **Decision making and leadership** - How we distribute power, make choices, and handle responsibility
- **Team dynamics** - Building high-performing teams, providing constructive feedback, and fostering trust
- **Work approach** - Focusing on delivery, avoiding distractions, and maintaining sustainable pace
- **Personal growth** - Going beyond titles, avoiding burnout, and embracing continuous learning
- **Company culture** - Transparency, meritocracy, and creating an environment where innovation flourishes

## Culture as a Practice

Our culture isn't static. It evolves as we grow, learn, and adapt to changes in our industry and the world. These articles represent specific moments and perspectives along that journey.

We encourage everyone at Dwarves to contribute their thoughts and experiences. The best cultures are shaped by the collective wisdom and diverse perspectives of everyone involved.

## Start exploring

Browse through these articles to gain deeper insights into how we think about work, collaboration, and building software together. Whether you're a new team member or have been with us for years, there's always something new to discover about what makes our culture special.

![](assets/the-dwarves-culture-handbook_464cd6715a58d2bd2f0f97ab9e8adeac_md5.webp)
