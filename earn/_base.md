---
tags: 
  - dwarves
  - work
title: Dwarves Community Earn
product: null
date: 2023-10-19
description: null
authors: 
  - monotykamary
  - hnh
menu: main
toc: null
notice: null
due_date: null
status: null
PICs: null
completion_date: null
bounty: null
show_frontmatter: null
type: null
---
The Dwarves bounty program is the means through which both company peeps and the community can contribute to our daily activities. This includes tasks like building internal tools, engaging in new technology research and development, or sharing knowledge session.

**→ Apply for research team:** open ticket in [our Discord](https://discord.com/invite/dwarvesv) 
**→ To contribute**: open ticket in [our Discord](https://discord.com/invite/dwarvesv) and give @hnh a ping 

```dataview
TABLE WITHOUT ID
	"[[" + file.path + "|" + title + "]]" as title,
	bounty + " ICY" as bounty,
	status
FROM "earn" AND !"earn/_index" AND !"earn/_base"
WHERE title != null AND status != "Done"
SORT status DESC
```
