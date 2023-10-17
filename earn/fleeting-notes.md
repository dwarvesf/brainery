---
tags:
  - tooling
title: "A discord cmd to receive a link, and create a brainery fleeting note"
date: 2023-10-17
description:
authors:
  - han
menu: earn
toc: false
notice:
bounty: 60
due_date:
status: Open
PICs:
  - han
type: tooling
---

**Input**

?note \<url\> "elixir, programming, db" → auto parse title

?note \<url\> "elixir, programming, db" "how to xyz"

**splash format**

/note url:\<link\> tags: elixir, programming, db title:(optional)

**Response**

Added new fleeting note with tags: elixir, programming, db

title: \<url\> "test"

source: \<url\> "test"

collector: \<discord name\>

Here’s the brainery link: `brain.d.foundation/....`

### **Fleeting note content**

\>\> title:

\>\> meta:

tags: elixir, programming, db

author: \<discord\>

date: \<timestamp\>

source: \<url\>

\>\> content

\<article content\>
