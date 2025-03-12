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
        md_content,date,
        ROW_NUMBER() OVER () AS item_number
    FROM vault
    WHERE ['ogif'] && tags
    ORDER BY date DESC
    LIMIT 3
)
SELECT
    '<div id="upcoming-events" class="upcoming-events" data-placement="horizontal">' || 
    GROUP_CONCAT(
        '<a id="memo-' || item_number || '" class="event" href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '">'  || 
       
      
        '<div class="event-image"><img class="no-zoom" src="' || 
    (CASE 
        WHEN LEFT(COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL), 1) = '/' 
        OR LEFT(COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL), 4) = 'http' 
        THEN COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL)
        WHEN COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL) IS NULL 
        OR COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), '') = '' 
        THEN 'assets/home_cover.webp'
        ELSE REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REGEXP_REPLACE(file_path, '/[^/]+\.md$', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') ||'/' || COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL)
    END) 
|| '" alt="Memo Image" />' || '</div>' || '<div class="event-body">' || '<div  class="event-title">' || 
        REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') ||'</div>' || '<div class="event-time">' || 
REPLACE(REPLACE(REPLACE(
    strftime('%B %d, %Y', date), 
    '&', '&'), 
    '<', '<'), 
    '>', '>'
) || '</div>' ||  '</div>' || 
        '</a>',
        ''
    ) || 
    '</div>' AS latest_ogifs_html
FROM sorted_vault;
```

<div><a class="all-events" href="/updates/ogif/">View all events</a></div>


## ✨ New memos

```dsql-list
WITH sorted_vault AS (
    SELECT
        short_title,
        title,
        file_path,
        description,
        authors,
        md_content,
        ROW_NUMBER() OVER () AS item_number
    FROM vault
    ORDER BY date DESC
    LIMIT 3
)
SELECT
    '<div id="new-memos" class="memo-list" data-placement="vertical">' || 
    GROUP_CONCAT(
        '<a id="memo-' || item_number || '" class="memo" href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '">' || 
       '<div class="memo-image"><img class="no-zoom" src="' || 
    (CASE 
        WHEN LEFT(COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL), 1) = '/' 
        OR LEFT(COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL), 4) = 'http' 
        THEN COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL)
        WHEN COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL) IS NULL 
        OR COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), '') = '' 
        THEN 'assets/home_cover.webp'
        ELSE REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REGEXP_REPLACE(file_path, '/[^/]+\.md$', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') ||'/' || COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL)
    END) 
|| '" alt="Memo Image" />' || '</div>'
||'<div class="memo-body">'||
        '<h3 class="memo-title">' || REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') || '</h3>' || 
         '<div class="memo-desc">' || REPLACE(REPLACE(REPLACE(description, '&', '&'), '<', '<'), '>', '>') || '</div>' || 
       '<div class="memo-author">' || 
REPLACE(REPLACE(REPLACE(
    ARRAY_TO_STRING(authors, ', '), -- Convert array to string (comma-separated)
    '&', '&'), 
    '<', '<'), 
    '>', '>'
) || '</div>'
        '</div>',
        ''
    )|| 
    '</a>' || 
    '</div>' AS latest_memos_html
FROM sorted_vault;
```

## 🤝 Open positions

```dsql-list
WITH sorted_vault AS (
    SELECT
        short_title,
        title,
        file_path,
        description,
        ROW_NUMBER() OVER () AS item_number
    FROM vault
    WHERE ['hiring'] && tags
  AND hiring = true
    ORDER BY date DESC
    LIMIT 3
)
SELECT
    '<div id="open-positions" class="memo-list" data-placement="vertical">' || 
    GROUP_CONCAT(
        '<div id="memo-' || item_number || '" class="memo no-image" >' 
||'<div class="memo-body">'||
        '<a class="memo-title" href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '">' || REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') || '</a>' || 
         '<div class="memo-desc">' || REPLACE(REPLACE(REPLACE(description, '&', '&'), '<', '<'), '>', '>') || '</div>' || 
        '</div>'
        '</div>',
        ''
    )|| 
    '</a>' || 
    '</div>' AS open_positions_html
FROM sorted_vault;
```




## 🌺 Life at Dwarves

```dsql-list
WITH sorted_vault AS (
    SELECT
        short_title,
        title,
        file_path,
        description,date,
        ROW_NUMBER() OVER () AS item_number
    FROM vault
    WHERE ['team'] && tags

    ORDER BY date DESC
    LIMIT 3
)
SELECT
    '<div id="open-positions" class="memo-list" data-placement="vertical">' || 
    GROUP_CONCAT(
        '<div id="memo-' || item_number || '" class="memo no-image" >' 
||'<div class="memo-body">'||
        '<a class="memo-title" href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '">' || REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') || '</a>' || 
         '<div class="memo-desc">' || REPLACE(REPLACE(REPLACE(description, '&', '&'), '<', '<'), '>', '>') || '</div>' || 
          '<div class="memo-time">' || 
REPLACE(REPLACE(REPLACE(
    strftime('%B %d, %Y', date), 
    '&', '&'), 
    '<', '<'), 
    '>', '>'
) || '</div>'||
        '</div>'
        '</div>',
        ''
    )|| 
    '</a>' || 
    '</div>' AS team_html
FROM sorted_vault;
```

## 📡 What’s on our Radar
<div class ="radar-list">
<a class="radar" href="https://zustand-demo.pmnd.rs/">
<div class="radar-image" ><img class="no-zoom" src="/assets/icons/zustand.png"/></div>
<p class="radar-title">Zustand</p>
</a>
<a class="radar" href="https://zod.dev">
<div class="radar-image" ><img class="no-zoom" src="https://zod.dev/logo.svg"/></div>
<p class="radar-title">Zod</p>
</a>
<a class="radar" href="https://github.com/jquense/yup">
<div class="radar-image" ><img class="no-zoom" src="/assets/icons/yup.png"/></div>
<p class="radar-title">Yup</p>
</a>
<a class="radar" href="https://webflow.com">
<div class="radar-image" ><img class="no-zoom" src="/assets/icons/webflow.png"/></div>
<p class="radar-title">Webflow</p>
</a>
<a class="radar" href="https://webdriver.io">
<div class="radar-image" ><img class="no-zoom" src="/assets/icons/webdriverio.png"/></div>
<p class="radar-title">Webdriverio</p>
</a>
</div>

## 📝 Changelog

```dsql-list
WITH sorted_vault AS (
    SELECT
        short_title,
        title,
        file_path,
        date,
        ROW_NUMBER() OVER () AS item_number
    FROM vault
   WHERE ['weekly-digest'] && tags
ORDER BY date DESC
    LIMIT 3
)
SELECT
    '<div id="changelog" class="changelog-list" data-placement="vertical">' || 
    GROUP_CONCAT(
        '<div id="memo-' || item_number || '" class="changelog" >' 
||
        '<a class="changelog-title" href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '">' || REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') || '</a>' || 
        '<span class="changelog-time"> - '  || 
REPLACE(REPLACE(REPLACE(
    strftime('%B %d, %Y', date), 
    '&', '&'), 
    '<', '<'), 
    '>', '>'
) || '</span>'
        '</div>',
        ''
    )|| 
    '</a>' || 
    '</div>' AS open_positions_html
FROM sorted_vault;
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
