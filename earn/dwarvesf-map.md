---
tags: 
  - earn
title: Dwarvesf Map
date: 2023-07-05
description: null
authors: 
  - hnh
  - tieubao
menu: earn
toc: null
notice: null
type: earn
show_frontmatter: true
bounty: 80
due_date: null
status: Open
PICs: null
---

👀 Imagine having a map flexing dwarves all around the globe

When onboarding new dwarves, we usually ask them for his info/hometown. The data has been recorded on Fortress DB or Notion.

This todo is to render those data to a map.

Data format for each record

- Discord name (tieubao 🧊)
- Location (name, long, lat)
- Discord avatar
- Role

Things to implement

1/ A webpage to view in map format, default zoom to Vietnam

- Each record map will display as a (blue, red, pink) dot

2/ A function to refetch/refresh data from discord ~ fortress

3/ A function on discord to upsert new record to dataset.
e.g. `?map-add “Han” “Saigon” “Programmer”`
