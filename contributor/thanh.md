---
social: 
  - https://github.com/zlatanpham
github: https://github.com/zlatanpham
website: null
avatar: https://cdn.discordapp.com/avatars/790170208228212766/2eb726f8baa632a90eb7600fabd804d8?size=1024
discord_id: 790170208228212700
hide_title: true
title: null
description: null
aliases: 
  - thanhpham
  - thanhpd
  - zlatanpham
  - thanh
---
<div class="profile"/>

| thanh                                                                                                                | contact                       |
| -------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| ![](assets/thanh_2eb726f8baa632a90eb7600fabd804d8.webp) | https://github.com/zlatanpham |

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
  WHERE ['thanhpham', 'thanhpd', 'zlatanpham', 'thanh'] && authors
)
ORDER BY date DESC
```
