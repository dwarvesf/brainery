---
social: null
github: https://github.com/ngolapnguyen
website: null
avatar: https://cdn.discordapp.com/avatars/397044011883429908/f0d08954055177e85a76365684c446a8?size=1024
discord_id: 397044011883429908
hide_title: true
title: null
description: null
aliases: 
  - mashiro5951
  - ngolapnguyen
---
<div class="profile"/>

| mashiro5951                                                                                               | contact                                                                        |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![](https://cdn.discordapp.com/avatars/397044011883429908/f0d08954055177e85a76365684c446a8) | https://github.com/ngolapnguyen |

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
  WHERE ['mashiro5951', 'ngolapnguyen'] && authors
)
ORDER BY date DESC
```