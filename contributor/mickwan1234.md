---
social: 
  - https://github.com/mickwan1234
github: https://github.com/mickwan1234
website: null
avatar: https://cdn.discordapp.com/avatars/383793994271948803/9f3042888d23b742411f6a45b4ba3b9c
discord_id: 383793994271948800
hide_title: true
title: null
description: null
aliases: 
  - mickwan1234
  - nguyenhieunghia
---
<div class="profile"/>

| mickwan1234                                                                                                | contact                        |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------ |
| ![](assets/mickwan1234_9f3042888d23b742411f6a45b4ba3b9c.webp) | https://github.com/mickwan1234 |

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
  WHERE ['mickwan1234', 'nguyenhieunghia'] && authors
)
ORDER BY date DESC
```
