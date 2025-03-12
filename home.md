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

## 🩷 Upcoming events
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
    '<div id="upcoming-events" class="upcoming-events" data-placement="horizontal">' || 
    GROUP_CONCAT(
        '<a id="memo-' || item_number || '" class="event" href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '">'  || 
       
      
        '<div class="event-image"><img class="no-zoom" src="' || COALESCE(
    NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''),
    'https://placehold.co/600x400'
) || '" alt="Memo Image" />' || '</div>' || '<div class="event-body">' || '<div  class="event-title">' || 
        REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') ||'</div>' || '<div class="event-time">December 13, 2023 </div>' || '</div>' || 
        '</a>',
        ''
    ) || 
    '</div>' AS latest_ogifs_html
FROM sorted_vault;
```

<div><a class="all-events" href="/updates/ogif/">View all events</a></div>


## ✨ New memos

```dsql-list
SELECT markdown_link(COALESCE(short_title, title), file_path)
FROM vault
ORDER BY date DESC
LIMIT 5
```

## 🩷 OGIFs

```dsql-list
SELECT markdown_link(COALESCE(short_title, title), file_path)
FROM vault
WHERE ['ogif'] && tags
ORDER BY date DESC
LIMIT 5
```

## 💰 Open bounties

```dsql-table
SELECT
  markdown_link(title, file_path) as Title,
  bounty as '💰 Bounty',
  status as Status
FROM vault
WHERE ['bounty'] && tags
  AND status = 'Open'
LIMIT 5
```

## 📝 Changelog

```dsql-list
SELECT markdown_link(COALESCE(short_title, title), file_path)
FROM vault
WHERE ['weekly-digest'] && tags
ORDER BY date DESC
LIMIT 5
```

## 🤝 Open positions

```dsql-list
SELECT markdown_link(title, file_path)
FROM vault
WHERE ['hiring'] && tags
  AND hiring = true
ORDER BY date DESC
LIMIT 5
```

---

<div class="love-what-we-are-doing">
  <h6>Love what we are doing?</h6>
  <ul>
    <li>
      <a href="https://discord.gg/dwarvesv">🩷 Join our Discord Network →</a>
    </li>
    <li>
      <a href="https://github.com/dwarvesf/playground">🔥 Contribute to our Memo → </a>
    </li>
    <li>
      <a href="https://careers.d.foundation/">🤝 Join us, we are hiring →</a>
    </li>
    <li>
      <a href="http://memo.d.foundation/earn/"> 🙋 Give us a helping hand →</a>
    </li>
  </ul>
</div>
