---
tags:
  - tooling
title: "Tech radar status report"
date: 2023-06-30
description: 
authors:
  - thanh
menu: 
toc: false
notice: 
bounty: 60
due_date: 
status: Open
PICs:
  - thanh
type: tooling
---

Create a Discord bot to send notification to a channel when status of a radar item change or a new research or experiment has been made for the blip.

### Acceptance criteria

- Only apply for item with priority `FOCUS` or `NEW`
- Send the message `[Radar item]'s status has changed from [status A] to [status B]. Check out [link].` when a radar item has changed its status
- Send the message `[Radar item] [status]: [User] did [Task's name] at [Link]` when a new research or experiment has added to a radar timeline
- This bot can be easily embedded to any channel

Relevant links:

- Radar: https://radar.d.foundation/
- Adoption timeline: https://www.notion.so/dwarves/5870379592444a1b9d220f391eefa80d?v=ba229f279ac546f39c1bb11e7317481d