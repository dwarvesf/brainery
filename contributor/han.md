---
social: 
  - https://twitter.com/abaddeed
  - https://bsky.app/profile/han.bsky.social
  - https://github.com/tieubao
github: https://github.com/tieubao
website: https://note.d.foundation/
avatar: https://cdn.discordapp.com/avatars/151497832853929986/a_5d05b5a57ec0dfbc2e06ff82420ab1fb
discord_id: 151497832853930000
hide_title: true
title: null
description: null
aliases: 
  - han
  - neko-san
  - tieubao
  - Han 🐸
---
<div class="profile"/>

| han                                                                                                          | contact                                                                                                |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| ![](assets/han_a_5d05b5a57ec0dfbc2e06ff82420ab1fb.gif) | https://twitter.com/abaddeed<br>https://bsky.app/profile/han.bsky.social<br>https://github.com/tieubao |

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
  WHERE ['han', 'neko-san', 'tieubao', 'Han 🐸'] && authors
)
ORDER BY date DESC
```
