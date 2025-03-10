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

## Upcoming Events
```dsql-list
WITH sorted_vault AS (
    SELECT
        short_title,
        title,
        file_path,
        md_content,
        ROW_NUMBER() OVER () AS item_number
    FROM vault
    WHERE ['ogif'] && tags
    ORDER BY date DESC
    LIMIT 5
)
SELECT
    '<div id="upcoming-events" class="memo-list" data-placement="horizontal">' || 
    GROUP_CONCAT(
        '<div id="memo-' || item_number || '" class="memo-item">' || 
        '<a href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '" class="memo-link">' || 
        '<h3 class="memo-title">' || REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') || '</h3>' || 
        '</a>' || 
        '<img class="memo-image" src="' || COALESCE(
            REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1),
            'https://placehold.co/600x400'
        ) || '" alt="Memo Image" />' || 
        '</div>',
        ''
    ) || 
    '</div>' AS latest_ogifs_html
FROM sorted_vault;
```

## New Memos
```dsql-list
WITH sorted_vault AS (
    SELECT
        short_title,
        title,
        file_path,
        md_content,
        ROW_NUMBER() OVER () AS item_number
    FROM vault
    ORDER BY date DESC
    LIMIT 5
)
SELECT
    '<div id="new-memos" class="memo-list" data-placement="vertical">' || 
    GROUP_CONCAT(
        '<div id="memo-' || item_number || '" class="memo-item">' || 
        '<a href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '" class="memo-link">' || 
        '<h3 class="memo-title">' || REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') || '</h3>' || 
        '</a>' || 
        '<img class="memo-image" src="' || COALESCE(
            REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1),
            'https://placehold.co/600x400'
        ) || '" alt="Memo Image" />' || 
        '</div>',
        ''
    ) || 
    '</div>' AS latest_memos_html
FROM sorted_vault;
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
SELECT markdown_link(COALESCE(short_title, title), file_path)
FROM vault
WHERE ['weekly-digest'] && tags
ORDER BY date DESC
LIMIT 5
```

## Open positions

```dsql-list
SELECT markdown_link(title, file_path)
FROM vault
WHERE ['hiring'] && tags
  AND hiring = true
ORDER BY date DESC
LIMIT 5
```
