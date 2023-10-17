---
tags:
  - tooling
title: "Brainery metrics report"
date: 2023-06-30
description:
authors:
  - thanh
menu: earn
toc: false
notice:
bounty: 100
due_date:
status: Done
PICs:
  - thangnguyen
type: tooling
---

Collect & persist brainery post in discord channel.

—

Create a discord bot and a command to display weekly report from our Brainery. Following are the data we want to see:

- Weekly count for new posts
- Weekly tags
- Weekly contributors
- Weekly new contributors

### Acceptance criteria

- A bot reports the numbers to our #metrics channel and any channel we want to config (#aa for example)
- A command with a default option to show weekly metrics (open to change the param to monthly,…). For example, `brainery reports`

Note: in the past, Tom wrote a plugin to sum up the data in https://brain.d.foundation/Latest+Notes. This can be a good starting point for this task.
