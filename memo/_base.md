---
tags:
  - dwarves
  - work
title: Dwarves Memo
date: 2023-11-27
description: Learned by engineers. Experimented by engineers. Experienced by engineers. Written by Dwarves for product craftsmen.
authors: 
menu: 
toc: false
notice: 
type: 
show_frontmatter: true
---
## Our newest memos

This is where we keep our internal updates, learned and curated by our engineers.

```dataview
LIST WITHOUT ID "[[" + file.path + "|" + title + "]]: " + description
FROM "memo" AND !"memo/_index" AND !"memo/_base"
WHERE title != NULL
SORT date DESC
LIMIT 15
```
