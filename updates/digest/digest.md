---
tags:
  - event
  - community
  - consulting
  - operations
  - learning
title: Digest
date: 2023-12-11
description: A collection of both our internal and external events, including the things we do with the Labs team, Consulting team, Operations, team, and the community.
authors:
  - monotykamary
  - innno_
---

This page holds a collection of both our internal and external events, including the things we do with the Labs team, Consulting team, Operations, team, and the community.

## Latest Digest

Stay up to date with our Latest Digest, your go-to source for the most recent updates and highlights. This curated collection brings you the freshest content, breaking news, and trending topics from across our platform. Whether you're looking for the newest articles, recent community discussions, or the latest industry insights, you'll find it all neatly packaged here. Our digest is regularly updated to ensure you never miss out on what's current and relevant. Dive in to quickly catch up on what matters most in your field of interest.

```dsql-list
SELECT markdown_link(title, file_path)
FROM vault
WHERE ['weekly-digest', 'community'] && tags
ORDER BY date DESC
LIMIT 10
```
