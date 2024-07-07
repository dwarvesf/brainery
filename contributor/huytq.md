---
social: 
  - https://twitter.com/0xLight
github: null
website: null
avatar: https://cdn.discordapp.com/avatars/361172853326086144/fc16986d5e0c3348454336ab48eb1f1e
discord_id: 361172853326086140
hide_title: true
title: null
description: null
aliases: 
  - huytq
  - 0xlight
---
<div class="profile"/>

| huytq                                                                                                      | contact                     |
| ---------------------------------------------------------------------------------------------------------- | --------------------------- |
| ![avatar\|100x100](https://cdn.discordapp.com/avatars/361172853326086144/fc16986d5e0c3348454336ab48eb1f1e) | https://twitter.com/0xLight |

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
  WHERE ['huytq', '0xlight'] && authors
)
ORDER BY date DESC
```