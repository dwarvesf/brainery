---
tags:
  - tooling
title: wagmi website, fork xkcd, with crm for img uploading
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
  - hieuphq
  - antran
type: tooling
---
## Background

Developers working on Javascript Applications often face the challenge of enforcing type safety between the client and server. One effective solution is to automatically generate an OpenAPI Spec file from server code. This can then be used with the OpenAPI generator to produce a client-side library for making typesafe API calls to the backend. Our existing workflow has adopted the typesafe approach using Swagger for API documentation. We aim to upgrade this approach by automating the generation of API methods.

![[15633e945a73cdfcf0123bbaac178372_MD5.webp]]
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
![[6a24c9abf40ecab4dbe975c9964619d8_MD5.webp]]
