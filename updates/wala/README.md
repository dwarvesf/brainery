---
title: WALA
short_title: § WALA 🍭
description: null
date: 2023-12-21
authors:
  - tieubao
  - nikkingtr
hide_title: true
tags:
  - wala
redirect:
  - /83O0Tg
---

**WALA: to walk around, learn around.**

In our line of work, we hear and talk about domain knowledge all the time. WALA aims for exactly that: we, people in tech, take a break from sitting in front of our computers, to go out, connect with new people, and get to understand other businesses.

Through stories collected from Techie WALAs, we hope our community members get the chance to learn from others' successes and failures, gain insights into what works and doesn't, and reflect on their own works and practices.

Besides, breaking away from the stereotype of "tech people are introverts" is always fun.

## Latest memo

```dsql-list
SELECT markdown_link(COALESCE(short_title, title), file_path)
FROM vault
WHERE file_path ILIKE '%wala%'
  OR ['wala', 'wala'] && tags
ORDER BY date DESC
LIMIT 10;
```
