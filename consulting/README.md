---
title: Dwarves Consulting 💼
description: "We're a team combining tech skills, problem-solving, and clear communication. We help businesses overcome challenges by finding root causes, creating practical solutions, and working closely with clients to implement them effectively."
date: 2023-12-21
authors:
  - tieubao
  - monotykamary
  - nikkingtr
hide_title: true
tags:
  - consulting
---

The Consulting team is a strategic spin-off built on the foundation of our Tech Research team. While Tech Research explores emerging technologies and builds innovative solutions, we take those insights and apply them directly to real business challenges. This unique setup gives us a competitive edge - we're practitioners backed by cutting-edge research, bridging the gap between innovation and practical application.

## Latest from consulting team

```dsql-list
SELECT markdown_link(COALESCE(short_title, title), file_path)
FROM vault
WHERE file_path ILIKE '%consulting%'
  OR ['partners', 'consulting'] && tags
ORDER BY date DESC
LIMIT 10;
```
