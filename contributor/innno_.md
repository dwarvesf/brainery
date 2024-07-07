---
social: 
  - https://github.com/innnotruong
github: https://github.com/innnotruong
website: null
avatar: https://cdn.discordapp.com/avatars/753995829559165044/8b291f806142f1191cdaac2ae993a819
discord_id: 753995829559165000
hide_title: true
title: null
description: null
aliases: 
  - innno_
  - mytruong
  - innnotruong
---
<div class="profile"/>

| innno_                                                                                                     | contact                        |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------ |
| ![](assets/innno__8b291f806142f1191cdaac2ae993a819.webp) | https://github.com/innnotruong |

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
  WHERE ['innno_', 'mytruong', 'innnotruong'] && authors
)
ORDER BY date DESC
```
