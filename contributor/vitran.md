---
social: 
  - https://github.com/tranthiaivi266
github: https://github.com/tranthiaivi266
website: null
avatar: https://cdn.discordapp.com/avatars/977461299996930089/d9e13e896c0fc626b062e492eaaf9ce3
discord_id: 977461299996930000
hide_title: true
title: null
description: null
aliases: 
  - vitran
  - tranthiaivi
  - tranthiaivi266
---
<div class="profile"/>

| vitran                                                                                                     | contact                           |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------- |
| ![](assets/vitran_d9e13e896c0fc626b062e492eaaf9ce3.webp) | https://github.com/tranthiaivi266 |

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
  WHERE ['vitran', 'tranthiaivi', 'tranthiaivi266'] && authors
)
ORDER BY date DESC
```
