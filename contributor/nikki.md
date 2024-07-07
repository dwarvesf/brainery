---
social: 
  - https://github.com/nikkingtr
github: https://github.com/nikkingtr
website: null
avatar: https://cdn.discordapp.com/avatars/796991130184187944/38fb62c883ac41d5781bda6b6c1142a8
discord_id: 796991130184187900
hide_title: true
title: null
description: null
aliases: 
  - nikki
  - ngoc
  - nikkingtr
---
<div class="profile"/>

| nikki                                                                                                      | contact                      |
| ---------------------------------------------------------------------------------------------------------- | ---------------------------- |
| ![](assets/nikki_38fb62c883ac41d5781bda6b6c1142a8.webp) | https://github.com/nikkingtr |

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
  WHERE ['nikki', 'ngoc', 'nikkingtr'] && authors
)
ORDER BY date DESC
```
