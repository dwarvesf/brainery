---
tags:
  - dwarves
  - work
  - home
title: Home
date: 2023-12-11
description: A collection of notes for everything we do and operate at Dwarves. This is where we keep our internal notes.
authors:
  - minhcloud
  - monotykamary
  - hnh
hide_frontmatter: true
hide_title: true
---

![](assets/home_cover.webp)

Welcome to the Dwarves Memo.

This site is a part of our continuous learning engine, where we want to build up the 1% improvement habit, learning in public.

Written by Dwarves for product craftsmen.

Learned by engineers. Experimented by engineers.

## Latest Memos
```dsql-list
SELECT markdown_link(title, file_path)
FROM vault
ORDER BY date DESC
LIMIT 5;
```

## Upcoming Events
```dsql-list
SELECT markdown_link(title, file_path)
FROM vault
WHERE ['ogif'] && tags
ORDER BY date DESC
LIMIT 5;
```

## Open Bounty

```dsql-table
SELECT
  markdown_link(title, file_path) as Title,
  bounty as '💰 Bounty',
  status as Status,
  PICs,
  function as Function
FROM vault
WHERE ['bounty'] && tags
  AND status = 'Open'
```

## Team Digest

```dsql-list
SELECT markdown_link(title, file_path)
FROM vault
WHERE ['weekly-digest'] && tags
ORDER BY date DESC
LIMIT 5;
```

## Open positions

```dsql-list
SELECT markdown_link(title, file_path)
FROM vault
WHERE ['hiring'] && tags
  AND hiring = true
ORDER BY date DESC
LIMIT 5;
```
