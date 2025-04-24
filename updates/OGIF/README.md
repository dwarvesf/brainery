---
tags:
  - culture
  - performance
  - software
  - engineer
title: OGIF - Oh God It's Friday
date: 2023-12-11
description: OGIF (Oh God It's Friday) is our weekly casual office hours meeting, where team members unwind, share updates, and connect in a relaxed environment at the end of each work week.
authors:
  - monotykamary
  - innnotruong
---

OGIF, or 'Oh God It's Friday,' is our team's weekly technical deep-dive. It's a dedicated time for engineers to present complex problems, discuss potential solutions, and explore emerging technologies relevant to our work.

During these sessions, we often dissect challenging bugs, analyze system performance issues, or evaluate new tools and frameworks. It's an opportunity to leverage the collective expertise of the team, fostering collaborative problem-solving and knowledge sharing.

While the format is informal, the content is substantive. We've had sessions covering everything from optimizing database queries to implementing machine learning models in production environments. OGIF has become an essential part of our continuous learning process, helping us stay current with industry trends and best practices.

## Latest OGIFs

Stay up to date with our Latest OGIFs:

```dsql-list
SELECT markdown_link(COALESCE(short_title, title), file_path)
FROM vault
WHERE ['ogif'] && tags
ORDER BY date DESC
LIMIT 10
```
