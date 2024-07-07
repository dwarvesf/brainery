---
social: 
  - https://github.com/huynguyenh
github: https://github.com/huynguyenh
website: null
avatar: https://cdn.discordapp.com/avatars/567326528216760320/608ffce140ad8830f6e2308763c7a127
discord_id: 567326528216760300
hide_title: true
title: null
description: null
aliases: 
  - hnh
  - huynguyenh
---
<div class="profile"/>

| hnh                                                                                                        | contact                       |
| ---------------------------------------------------------------------------------------------------------- | ----------------------------- |
| ![](assets/hnh_608ffce140ad8830f6e2308763c7a127.webp) | https://github.com/huynguyenh |

## Contributed Notes

```dsql-list
SELECT '[' || 
  COALESCE(title, '/' || processed_path) || 
  '](/' || processed_path || ')' AS markdown_link
FROM (
  SELECT 
    file_path,
    title,
    date,
    REGEXP_REPLACE(LOWER(REGEXP_REPLACE(REPLACE(REPLACE(file_path, '.md', ''), ' ', '-'),'[^a-zA-Z0-9/_-]+', '-')), '(^-|-$)', '') AS processed_path
  FROM vault
  WHERE ['hnh', 'huynguyenh'] && authors
)
ORDER BY date DESC
```
