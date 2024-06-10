---
tags:
  - dwarves
  - work
  - home
title: Home
date: 2023-12-11
description: A collection of notes for everything we do and operate at Dwarves. This is where we keep our internal notes.
authors:
  - minhcloud
  - monotykamary
  - hnh
hide_frontmatter: true
hide_title: true
---
Welcome to Dwarves Notes, a collection of notes for everything we do and operate at Dwarves. Dwarves are a group of technology innovation advocates. This project is a part of our information engine, where we consolidate know-how and expertise from and for our team as part of our MMA system: **Mastery**, **Meaning**, and **Autonomy**.

We believe that behind every success comes great preparation, accumulation and compound every single day. This note repo contains our notes and studies for any upcoming challenges, new tech, hiring, bounty, etc.

![[information_flow.webp]]

View our list of amazing people who have contributed to our notes: [[contributor/_index|Contributors]]

## Upcoming Events
```dataview
LIST WITHOUT ID "[[" + file.path + "|" + title + "]] - " + event_date
FROM #event
LIMIT 3
WHERE event_date < date(today)
SORT event_date ASC
WHERE !contains(file.path, "_index") AND !contains(file.path, "_base")
```

## Open Bounty
```dataview
TABLE WITHOUT ID
	"[[" + file.path + "|" + title + "]]" as Title,
	"🧊 " + bounty as "Reward",
	status as Status,
  join(PICs) as PIC,
  functional as Function
FROM "careers/earn" AND !"career/searn/_index" AND !"career/earn/_base"
WHERE title != null AND (status = "Open")
SORT date DESC
```

---

## Contributing
At Dwarves, we encourage our people to read, write, share what we learn with others, and [[CONTRIBUTING|contributing to the Brainery]] is an important part of our learning culture. For visitors, you are welcome to read them, contribute to them, and suggest additions. We maintain a monthly pool of $1500 to reward contributors who support our journey of lifelong growth in knowledge and network.

## Love what we are doing?
- Check out our [products](https://superbits.co)
- Hire us to [build your software](https://d.foundation)
- Join us, [we are also hiring](https://github.com/dwarvesf/WeAreHiring)
- Visit our [Discord Learning Site](https://discord.gg/dzNBpNTVEZ)
- Visit our [GitHub](https://github.com/dwarvesf)