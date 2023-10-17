---
tags:
  - tooling
title: "wagmi website, fork xkcd, with crm for img uploading"
date: 2023-08-18
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
  - hieuphq, antran
type: tooling
---
## Background

Developers working on Javascript Applications often face the challenge of enforcing type safety between the client and server. One effective solution is to automatically generate an OpenAPI Spec file from server code. This can then be used with the OpenAPI generator to produce a client-side library for making typesafe API calls to the backend. Our existing workflow has adopted the typesafe approach using Swagger for API documentation. We aim to upgrade this approach by automating the generation of API methods.

![example](https://earn.d.foundation/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F253796f1-4519-4b43-8aa3-de3a394cbbfa%2FUntitled.png?table=block&id=50136ddf-415f-4412-9f3a-1fbd38d9f899&spaceId=498ebd7b-383c-459f-a9ad-b74073208ddd&width=2000&userId=&cache=v2)
## **Objective**

Demonstrate a type-safe approach by integrating the backend Golang boilerplate with the NextJS boilerplate from the web team.

### Golang boilerplate

- [ ]  Auth API
- [ ]  CRUD APIs for users
- [ ]  Standard swagger document
- [ ]  Server deployment

### NextJS boilerplate

- [ ]  Be able to generate API methods with auth flow integration from backend swagger
- [ ]  Change `Data fetching` page to `API integration` and integrate a full CRUD flow
![example](https://earn.d.foundation/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2Fd9f8ed45-3bde-49bc-9b27-1588126e8887%2FUntitled.png?table=block&id=ee0c492e-b6b3-48a4-92a6-0e85090a6cca&spaceId=498ebd7b-383c-459f-a9ad-b74073208ddd&width=2000&userId=&cache=v2)
