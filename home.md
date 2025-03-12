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
    '<div id="upcoming-events" class="h-list" data-placement="horizontal">' || 
    GROUP_CONCAT(
        '<a id="memo-' || item_number || '" class="h-list-item" href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '">'  || 
       
      
        '<div class="h-list-item-image"><img class="no-zoom" src="' || 
    (CASE 
        WHEN LEFT(COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL), 1) = '/' 
        OR LEFT(COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL), 4) = 'http' 
        THEN COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL)
        WHEN COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL) IS NULL 
        OR COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), '') = '' 
        THEN 'assets/home_cover.webp'
        ELSE REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REGEXP_REPLACE(file_path, '/[^/]+\.md$', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') ||'/' || COALESCE(NULLIF(REGEXP_EXTRACT(md_content, '!\[.*?\]\((.*?)\)', 1), ''), NULL)
    END) 
|| '" alt="Memo Image" />' || '</div>' || '<div class="h-list-item-body">' || '<div  class="h-list-item-title">' || 
        REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') ||'</div>' || '<div class="h-list-item-time">' || 
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

<div><a class="list-view-all-btn" href="/updates/ogif/">View all events</a></div>


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
    '<div id="new-memos" class="v-list" data-placement="vertical">' || 
    GROUP_CONCAT(
        '<a id="memo-' || item_number || '" class="v-list-item" href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '">' || 
       '<div class="v-list-item-image"><img class="no-zoom" src="' || 
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
||'<div class="v-list-item-body">'||
        '<h3 class="v-list-item-title">' || REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') || '</h3>' || 
         '<div class="v-list-item-desc">' || REPLACE(REPLACE(REPLACE(description, '&', '&'), '<', '<'), '>', '>') || '</div>' || 
       '<div class="v-list-item-author">' || 
REPLACE(REPLACE(REPLACE(
    ARRAY_TO_STRING(authors, ', '), 
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
    '<div id="open-positions" class="v-list" data-placement="vertical">' || 
    GROUP_CONCAT(
        '<div id="memo-' || item_number || '" class="v-list-item no-image" >' 
||'<div class="v-list-item-body">'||
        '<a class="v-list-item-title" href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '">' || REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') || '</a>' || 
         '<div class="v-list-item-desc">' || REPLACE(REPLACE(REPLACE(description, '&', '&'), '<', '<'), '>', '>') || '</div>' || 
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
    '<div id="open-positions" class="v-list" data-placement="vertical">' || 
    GROUP_CONCAT(
        '<div id="memo-' || item_number || '" class="v-list-item no-image" >' 
||'<div class="v-list-item-body">'||
        '<a class="v-list-item-title" href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '">' || REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') || '</a>' || 
         '<div class="v-list-item-desc">' || REPLACE(REPLACE(REPLACE(description, '&', '&'), '<', '<'), '>', '>') || '</div>' || 
          '<div class="v-list-item-time">' || 
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
<div class ="icon-h-list">
<a class="icon-h-list-item" href="https://dify.ai">
<div class="icon-h-list-item-image" ><img class="no-zoom p-1" src="https://framerusercontent.com/images/KWDRAMQLGjoMFBAjNjoCFMP7XI.png"/></div>
<p class="icon-h-list-item-title">Dify</p>
</a>
<a class="icon-h-list-item" href="https://elevenlabs.io/">
<div class="icon-h-list-item-image" ><img class="no-zoom" src="https://elevenlabs.io/icon.svg"/></div>
<p class="icon-h-list-item-title">Elevenlabs</p>
</a>
<a class="icon-h-list-item" href="https://www.langchain.com/">
<div class="icon-h-list-item-image" ><img class="no-zoom" src="https://cdn.prod.website-files.com/65b8cd72835ceeacd4449a53/65c50ca94c9fe4ac7c52b415_webClip.png"/></div>
<p class="icon-h-list-item-title">LangChain</p>
</a>
<a class="icon-h-list-item" href="https://www.cursor.com/">
<div class="icon-h-list-item-image" ><img class="no-zoom" src="https://www.cursor.com/apple-touch-icon.png"/></div>
<p class="icon-h-list-item-title">Cursor</p>
</a>
<a class="icon-h-list-item" href="https://mcp.so/">
<div class="icon-h-list-item-image" ><img class="no-zoom" src="https://mcp.so/logo.png"/></div>
<p class="icon-h-list-item-title">MCP server</p>
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
    '<div id="changelog" class="link-v-list" data-placement="vertical">' || 
    GROUP_CONCAT(
        '<div id="memo-' || item_number || '" class="link-v-list-item" >' 
||
        '<a class="link-v-list-item-title" href="/' || REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'), '[^a-zA-Z0-9/_-]+', '-')), '(-/|-$|_index$)', '') || '">' || REPLACE(REPLACE(REPLACE(COALESCE(short_title, title), '&', '&'), '<', '<'), '>', '>') || '</a>' || 
        '<span class="link-v-list-item-time"> - ' || 
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
