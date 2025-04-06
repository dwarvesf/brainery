---
title: 👾 Open bounties
date: 2024-01-05
description: The Dwarves bounty program is the means through which both company peeps and the community can contribute to our daily activities. This includes tasks like building internal tools, engaging in new technology research and development, or sharing knowledge session
authors:
  - monotykamary
  - hnh
tags:
  - earn
  - bounty
---

The Dwarves bounty program is the means through which both company peeps and the community can contribute to our daily activities. This includes tasks like building internal tools, engaging in new technology research and development, or sharing knowledge session.

This program is part of our ICY initiative, which you can learn more about at [handbook](https://github.com/dwarvesf/handbook/blob/master/community/icy.md). ICY connects contributors with meaningful projects while rewarding valuable work across our ecosystem.

**→ To contribute**: open ticket in [our Discord](https://discord.gg/dfoundation) and give our mods a ping

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
