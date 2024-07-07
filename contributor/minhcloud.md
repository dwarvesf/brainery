---
social: 
  - https://github.com/minhcloud
github: https://github.com/minhcloud
website: null
avatar: https://cdn.discordapp.com/avatars/1007496699511570503/ecf51b8fe204d894b1ef5328983cfd31
discord_id: 1007496699511570600
hide_title: true
title: null
description: null
aliases: 
  - minh_cloud
  - minhcloud
---
<div class="profile"/>

| minhcloud                                                                                                   | contact                      |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------- |
| ![](assets/minhcloud_ecf51b8fe204d894b1ef5328983cfd31.webp) | https://github.com/minhcloud |

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
  WHERE ['minh_cloud', 'minhcloud'] && authors
)
ORDER BY date DESC
```
