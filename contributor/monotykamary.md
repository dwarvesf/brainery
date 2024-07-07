---
social: 
  - https://www.linkedin.com/in/nguyenxuananh/
  - https://twitter.com/monotykamary
github: https://github.com/monotykamary
website: https://monotykamary.hashnode.dev/
avatar: https://cdn.discordapp.com/avatars/184354519726030850/52f29f100864cb28552e935aaa4ad7f0
discord_id: 184354519726030850
hide_title: true
title: null
description: null
aliases: 
  - monotykamary
  - tom
---
<div class="profile"/>

| monotykamary                                                                                               | contact                                                                        |
| ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| ![](assets/monotykamary_52f29f100864cb28552e935aaa4ad7f0.webp) | https://www.linkedin.com/in/nguyenxuananh/<br>https://twitter.com/monotykamary |

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
  WHERE ['monotykamary', 'tom'] && authors
)
ORDER BY date DESC
```