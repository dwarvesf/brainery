---
tags:
  - dwarves
  - labs
  - home
title: Labs Team
date: 2023-11-30
description: 
authors: 
menu: 
toc: false
notice: 
type: 
show_frontmatter: true
---
## Latest from Labs Team

```dataview
LIST description
FROM #labs AND !"memo/labs/_index" AND !"memo/labs/_base"
SORT date DESC
LIMIT 10
```

## Forward Engineering Publications

```dataview
LIST description
FROM #forward-engineering
SORT date DESC
LIMIT 3
```

## Events

### Upcoming

```dataview
LIST description
FROM #labs AND #event 
LIMIT 3
WHERE event_date >= date(today)
```

### Past Events

```dataview
LIST description
FROM #labs AND #event 
LIMIT 3
WHERE event_date < date(today)
```

## FAQ

### Who we are


### How we work


### What we are working towards


![[_base-20231130183110925.webp]]