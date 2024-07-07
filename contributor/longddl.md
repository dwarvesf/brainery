---
social: 
  - https://longdatadevlog.wordpress.com/
  - https://blogs.longdatadevlog.com/blog/
  - https://github.com/longbuivan
github: https://github.com/longbuivan
website: https://longdatadevlog.wordpress.com/
avatar: https://cdn.discordapp.com/avatars/1157659003527106630/211766094de8ebfa08e49216f0710d5a
discord_id: 1157659003527106600
hide_title: true
title: null
description: null
aliases: 
  - longddl
---
<div class="profile"/>

| longddl                                                                                                     | contact                                                                                                          |
| ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| ![](assets/longddl_211766094de8ebfa08e49216f0710d5a.webp) | https://longdatadevlog.wordpress.com/<br>https://blogs.longdatadevlog.com/blog/<br>https://github.com/longbuivan |

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
  WHERE ['longddl'] && authors
)
ORDER BY date DESC
```
