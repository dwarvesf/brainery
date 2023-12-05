---
tags:
  - dwarves
  - work
title: Community Earn
product: 
date: 2023-10-19
description: The Dwarves bounty program is the means through which both company peeps and the community can contribute to our daily activities. This includes tasks like building internal tools, engaging in new technology research and development, or sharing knowledge session
authors:
  - monotykamary
  - hnh
menu: main
toc: 
notice: 
due_date: 
status: 
PICs: 
completion_date: 
bounty: 
show_frontmatter: false
type:
---

The Dwarves bounty program is the means through which both company peeps and the community can contribute to our daily activities. This includes tasks like building internal tools, engaging in new technology research and development, or sharing knowledge session.

**→ Apply for research team:** open ticket in [our Discord](https://discord.com/invite/dwarvesv)
**→ To contribute**: open ticket in [our Discord](https://discord.com/invite/dwarvesv) and give @hnh a ping

```dataview
TABLE WITHOUT ID
	"[[" + file.path + "|" + title + "]]" as Title,
	"🧊 " + bounty as "💰 Bounty",
	status as Status,
  join(PICs) as PIC,
  functional as Function
FROM "earn" AND !"earn/_index" AND !"earn/_base"
WHERE title != null AND (status = "Open" OR status = "Doing")
SORT date DESC
```

