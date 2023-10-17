---
tags:
  - tooling
title: "?trend command"
date: 2023-08-17
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
  - tom
type: tooling
---
## Requirements

### `?trend` command

The idea is to create a `?trend` Discord command that will list the top 15 trending repositories on GitHub.

We can reference https://github.com/trending to make our list. Otherwise, we will need to identify what should count as trending on our end (stars/day, commits/day, etc).

There are no particular design requirements for this command, but it should use an embed and look similar to the outputs of our other commands.

![example](https://earn.d.foundation/image/https%3A%2F%2Fprod-files-secure.s3.us-west-2.amazonaws.com%2F498ebd7b-383c-459f-a9ad-b74073208ddd%2F7520df9b-0957-42b3-a0b0-9e957f156b08%2FUntitled.png?table=block&id=985742a1-78f9-4e8f-853f-2aee8f2e1177&spaceId=498ebd7b-383c-459f-a9ad-b74073208ddd&width=380&userId=&cache=v2)

### Filters

Not all repositories are relevant to everyone. We need to support some kind of filtering scheme on Discord to filter by, but not limited to:

- Programming Language (Python, JavaScript, Go)
- Time Range (Today, Week, Month)
- Spoken Language (English, Vietnamese, Dutch, …)

### Implementation

There are no restrictions on how to implement this command and where to get the data. Scraping from  https://github.com/trending is also a viable approach.

We do mostly code our Discord bots in Go, but there are no hard requirements in programming language for this Discord command as of the time of this writing.
