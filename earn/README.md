---
title: Open Bounties
date: 2024-01-05
description: The Dwarves bounty program is the means through which both company peeps and the community can contribute to our daily activities. This includes tasks like building internal tools, engaging in new technology research and development, or sharing knowledge session
authors:
  - monotykamary
  - hnh
tags:
  - earn
  - bounty
hide_frontmatter: true
---

The Dwarves bounty program is the means through which both company peeps and the community can contribute to our daily activities. This includes tasks like building internal tools, engaging in new technology research and development, or sharing knowledge session.

**→ To contribute**: open ticket in [our Discord](https://discord.gg/dfoundation) and give @hnh a ping

```dsql-table
SELECT
  markdown_link(title, file_path) as Title,
  bounty as '💰 Bounty',
  status as Status,
  PICs,
  function as Function
FROM vault
WHERE ['bounty'] && tags
  AND status = 'Open'
```
