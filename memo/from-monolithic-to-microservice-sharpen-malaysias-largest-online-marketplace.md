---
tags: 
  - case study
title: From Monolithic To Microservice Sharpen Malaysias Largest Online Marketplace
date: 2021-03-09
description: null
authors: null
menu: memo
toc: null
notice: null
type: null
show_frontmatter: true
author: null
created_time: 2021-07-23
created: 2021-03-09
---

![[6be4a77492fe56879670e7842673e411_MD5.webp]]

<span style='color:red'>In brief</span>

* Mudah.my is a Malaysian 12-years-old online marketplace. A product derives from a partnership between Telenor ASA of Norway and 701Search Singapore. 
* Currently holds 19.8% Internet share, Mudah meets the increase of customers demand, which led to an overload in the current system.
* We partnered to help migrating the monolithic architecture into microservices - Unlocking a scalable and feature-extendable platform
* We spent a month working on-site at Malaysia to directly participate in the work and speed up productivity

### <span style='color:red'>Technical Highlight</span>

---

* Massive migration from monolithic to microservice architecture.
* Combining Golang and Gin framework to fasten web performance.
* Next.JS for search-engine index, SEO-friendly and reusable components.
* Unit test that ensures at least 80% test coverage before deploying to production.
* Mobile app with MVC architecture for fast debugging and development speed.

### <span style='color:red'>The Context</span>

---

<!-- column_list 31c57d04-e8e5-4ca3-ab84-6e8f0309c73d -->

<!-- column b7711008-914f-4750-a848-156143f2e55a -->

Mudah.my’s site features various ads categories for different purchase demands. The data from customer and third-parties is massively huge to process.

With 12 years in the market, their system starts to slow down. It affects the data process, and drags down user experience.

<!-- column 2b30674a-782f-4eab-91b7-11071971be0b -->

![[78b9b340766e04c40cbb7e8aadf4be69_MD5.webp]]

The world develops, Mudah must targets a younger customer segment. The website interface and stagnant system are holding their goal back. 

They decided to go for a <span style='color:red'>massive refactoring in: Infrastructure</span>,<span style='color:red'> Codebase </span>and<span style='color:red'> Application UI</span>.


📍 "*Refactoring a whole system requires a high effort. There's no place for hiring plans and teammate training. I was in need of a workforces that gets the hang of the job*." 

said Prateek - Mudah's Product Manager

### <span style='color:red'>Engagement Model</span>

---

We took care of migrating the legacy PHP system to microservices in Go. It optimizes page load and tackle scaling problem. We decoupled the services one by one, starting with the Auth module (user's authentication flow). 

The server-side rendering concept with HTML data parsing makes the site indexable by search engine, optimizes SEO and boosts up user experience. 

We worked on shipping new features, refactoring the code and deep link manager in mobile app. MVC architecture ensures an upgrade in development pace, enable us to update and debug easier.

<!-- column_list 217d2920-ce30-4d13-acdb-9a4ee7d2743a -->

<!-- column 10e6b789-c77d-452d-8a16-0b378d9183e9 -->

<span style='color:red'>**Tech stacks**</span>

* Backend: Golang & Gin framework
* Frontend: Next.js
* Server-side rendering
* Database: PostgreSQL & RESTful API
* GRPC protocol 
* Mobile: Swift 4 and MVC

<!-- column d363cb28-929f-47f8-90d9-64629c9a46b4 -->

<span style='color:red'>**Collaboration**</span>

The Dwarves spent a month in Malaysia to directly work with Mudah team. 

It was a great working process and exciting experience. 

<span style='color:red'>**Delivery tooling**</span>

Slack chat, Jira card & Gitlab Merge Request for technical discussion. 

### <span style='color:red'>Outcome</span>

---

<!-- column_list 71a901e3-943f-4a4b-a4a1-aa6c27417e53 -->

<!-- column 8672973e-d0eb-4843-9790-ac9eb5bcf26e -->

Mudah remains one of our longest, tried-and-true collaborations. We have continuously worked with Mudah on various scopes of work and committed different engagement models. The system was flawlessly migrated, enabled Mudah to access their potential market for both desktop and mobile users.

It was amazing to facilitate their growth and contribute our best practices. The progress still evolves and we’re so excited to see what’s coming next.

<!-- column 9ce16f6a-34d8-4173-b703-c2816f72af00 -->

![[828660c66933d83b79c4f5ba817fd265_MD5.webp]]


💬 Completing the tech platform changing and stretching the revenue are two main goals that Mudah.my intends to follow. To maintain two biggest challenges at once is quite difficult. We got positive responses from the team, the skillset and the member were in high quality. That helped increase our confidence in the Dwarves and we're very interested in working with them.

— Prateek Roy, Mudah.my’s Product Manager
