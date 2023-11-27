---
tags:
  - dwarves
  - work
title: Dwarves Memo
date: 2023-11-27
description: 
authors: 
menu: 
toc: false
notice: 
type: 
show_frontmatter: true
---

```dataview
LIST WITHOUT ID "[[" + file.path + "|" + title + "]]"
FROM "memo" AND !"memo/index"
WHERE title != NULL
SORT title
```