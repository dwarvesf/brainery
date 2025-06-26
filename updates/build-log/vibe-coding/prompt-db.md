---
title: Prompts
description: null
date: 2025-05-14
authors:
  - tieubao
tags:
  - vibe-coding
  - prompt
redirect:
  - /bPA4Jg
---

1/ prompt database
prompts are stored in github
we use prompt-db to store list of prompts that we use in daily ops
leverage git version to store them in git, also to track version.
they are system prompts or just part of an AI workflow
? they are classified into helpers, brainstorm, formatter, writer

list of prompt is as follow:

- development
- operations: payroll, accounting, icy etc.
- sales: proposal
- learn, knowledge discovery, etc.

2/ prompt gallery
from the database in github, we collect and render it via memo site
at <https://memo.d.foundation/prompts>
the UI looks like this
team members can click to read about it and then try it out
web will redirect it to latitude

3/ latitude: prompt eval env
latitude is an open source prompt gallery, where we evaluate prompt and it's also an environment for our member to try prompt from the prompt gallery.

4/ workflow & moderation

prompt creation
how to cook > chat-log

how to submit new prompt
  send a latitude link

how to browse/try new prompt
  via prompt gallery

how to use prompts in prompt-db
  via mcp-playbook

evaluation & versioning
  via latitude
  then save back to github > prompt-db

how to review new prompt?
  user send latitude link to review
  check and reward
  approve
  > alert to discord
  > sync to github

how to do versioning?
  if a prompt evolve into something new, we call it variant. and a variant should have different name.
  if a prompt just change it internal logic, we will make it a new version. and we upgrade the version.
  versioning <> variant
  latitude > self-solved as the tool already support it.
  github > in github we use metadata or frontmatter to mark it
