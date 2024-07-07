---
social: null
github: null
website: null
avatar: https://cdn.discordapp.com/avatars/788351441097195520/b5799a413a532ba4fbdcc53fcca65693
discord_id: 788351441097195500
hide_title: true
title: null
description: null
aliases: 
  - duy
  - mia
---
<div class="profile"/>

| duy                                                                                                        | contact |
| ---------------------------------------------------------------------------------------------------------- | ------- |
| ![](assets/duy_b5799a413a532ba4fbdcc53fcca65693.webp) | \-      |

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
  WHERE ['duy', 'mia'] && authors
)
ORDER BY date DESC
```
