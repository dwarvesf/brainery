---
title: Dwarves Updates
date: 2024-03-12
description: 
authors: 
tags: []
---

We run our company like we build software.
We're working hard to build Dwarves, and need more help!

If you know anybody who would be a good fit for any of these roles - across engineering, marketing, and more - please let us know and tell your friends!
careers.d.foundation

## Latest changelog

```dsql-list
SELECT markdown_link(COALESCE(short_title, title), file_path)
FROM vault
WHERE file_path ILIKE '%changelog%'
  OR ['changelog', 'changelog'] && tags
ORDER BY date DESC
LIMIT 10;
```
