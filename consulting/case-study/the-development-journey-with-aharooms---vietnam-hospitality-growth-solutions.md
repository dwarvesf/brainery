---
tags: 
  - case study
  - design
title: The Development Journey With Aharooms Vietnam Hospitality Growth Solutions
date: 2020-12-01
description: null
authors: null
menu: memo
toc: null
notice: null
type: null
hide_frontmatter: false
author: null
created_time: 2021-07-20
created: 2020-12-01
---

![[a8e6908312ad0eeb1a4dc8e9c6cd287a_MD5.webp]]

### <span style='color:green'>In brief</span>

* Aharooms wants to be a remarkable Vietnamese brand in franchised hotel chains. They look to enter the affordable hotel market to support business owners. 
* Their vision was to build an MVP for market testing in no time. Aharooms's system had almost 2 years in development. It demands high effort to balance new feature development with technical debt.
* We step in as product team and venture builder. We take on the development stage that supercharges their product development.

### <span style='color:green'>Technical Highlight</span>

---

* Monolithic architecture & Monorepo for consistent code-base
* Cloud-based infrastructure for data isolation with Docket Containers, GCP and k8s
* Netlify deployment to avoid bottleneck situation.
* Gitflow, Early PR, Code Review and Releasing by tag for effective deployment process
* Automated & end-to-end integration tests with CI pipeline.
* PostgreSQL and Metabase for data and report summary on business-centric metrics
* Developer Portal with Open API for external devs to build tools in Aharooms ecosystem.
* Staah CMS for inventory management in OTA channels.
* Customized-module for users retention & business needs.
* Integrated-extensible engine for 3rd-party systems.

### <span style='color:green'>The Context</span>

---

<!-- column_list 66ed5082-0891-41d7-9895-2ff1f0c7250a -->

<!-- column c322b9cf-81f1-4c67-843e-34a9fa24f9c6 -->

Providing growth solutions, Aharooms aims to support 2-3 star Hotels with multiple sale channels, property management, and extra services

They wish to access, understand and localize a Vietnamese product, for Vietnamese people.

<!-- column a295822b-66b2-4b70-aa77-c859fef5bdc7 -->

![[2b6b4cbc18bc22e8663f711e821a4d78_MD5.webp]]


The affordable hotel segment(2-3 stars) is a potential market. But the services standard still run with  a lack of uniformity. Traditional business operations is blocking them from better quality. 

The hit of Covid pushed hospitality industry with severely affects. It was tough to maintain the current business state. Diversify services is the only way to reach new clients. 


✅ Aharooms equips with growth solutions, management center, booking channel, customer services and optimize revenue for affordable hotel market. 


### <span style='color:green'>Engagement Model</span>

---

<span style='color:green'>**Solution Design**</span>

<!-- column_list 43ecc2fe-c8df-47d2-bc47-147d19165b31 -->

<!-- column b0a99936-9095-4fc9-a912-2029a787104a -->

Aharooms delivers a full package of services. 

With selective technology and business insights, we provide high-level architecture with 

* Integrated Booking Engine
* Admin Panel dashboard 
* and customized modules for:

<!-- column 82d521de-f2be-430c-a706-f7c58b1df910 -->

![[470979fc905480eb099b9672f7035296_MD5.webp]]

<span style='color:green'>**1. Efficient Business Operations**</span>

<!-- column_list f3f7a444-ee31-4a35-9d6e-f979e1ee9b48 -->

<!-- column a7cdae4f-90c9-42f8-a67d-2f5e184b8bf9 -->

* <span style='color:green'>Direct-booking Platform</span>: Built as a Hotel-Shopify for different booking types. Chatbot-integration for end-to-end solutions.

<!-- column 23ddfb16-9c86-4433-843c-a72b2834ab3f -->

* <span style='color:green'>Management Systems</span>**:** Applying technology in building operations management, budgeting, and promotion applications.

<!-- column_list 4aa18f4f-7c38-4876-8a53-e4490023bb55 -->

<!-- column 5050a1b7-9ad3-4a24-87cd-bea8d2e0ded1 -->

* <span style='color:green'>The Property Management System (PMS)</span>: To manage bookings via different channels with front-office capabilities for room services management. 

<!-- column 5055ce3f-7391-4c86-bdc6-5af7048e61d8 -->

* <span style='color:green'>The Revenue Management System (RMS)</span>: To maximize sales and revenue.  RMS works to evaluate and control revenue with the best cost efficiency.

<span style='color:green'>**2. Boost up Customer Retention**</span>

* <span style='color:green'>Loyalty System</span>: Cashback system using Ahacoin as a reward to increase Customer Loyalty.
* <span style='color:green'>Production Report</span>: Data visualization to analyze the business efficiency through core metrics.
* <span style='color:green'>Cancellation Report</span>: Overview ratio on canceled booking indicated by relevant factors

<span style='color:green'>**Tech stacks**</span>

<!-- column_list 57de88d5-1392-47e7-b24c-5de8d6943b33 -->

<!-- column ea50b07e-c434-41cb-be2e-8734abc62a19 -->

* Backend: Golang, Elixir
* Frontend: React.js, JavaScript, TypeScript
* Infras: Docker, Google Cloud, k8s, Netlify
* Monitoring/ Alerting: Prometheus, Grafana, Loki, Sentry
* Email services: SendGrid

<!-- column 4ff6b1e9-35be-4ef4-b926-c47467cd8fbd -->

* Architecture: MVC, Monolith, N-Tiers, Reactive, Monorepo
* Database: PostgreSQL, Redis
* CMS: Staah
* Tools: Figma, Storybook, Git/Github, Insomnia, k9s
* Framework: Gin, Tailwind, Phoenix, Next.js

<span style='color:green'>**Cloud-based Infrastructure**</span>

We apply Docker and k8s for <span style='color:green'>data isolation & context separation</span>. With Singapore node-based, we're risk-free in major cloud security issues. Deploy our React.js sites to Netlify helps us deal with the bottle-neck traffic incidents.

<!-- column_list 57e50581-2ada-45a4-8bca-2412d3f41593 -->

<!-- column 70b74f2d-4f44-4b4d-949a-d3af07f21099 -->

Our dev environments are 4 separate ones: Local, CI, Staging and Production. 

Users will get noticed on a new release. Meanwhile, we're able to resolve issues quickly. 

<span style='color:green'>docker and docker-compose</span> made quite a useful pack. 

<!-- column 9e28bd1a-41db-4178-8ef1-3cd31300a46a -->

![[memo/assets/the-development-journey-with-aharooms---vietnam-hospitality-growth-solutions/fa32c5b22664bf943dd7d4314b012a83_MD5.webp]]


### <span style='color:green'>Outcome</span>

---

<!-- column_list 84b3b008-e12b-4e37-9c7e-4e2753c82aab -->

<!-- column 9f1820cb-c159-42de-bddb-ce894a3ceb41 -->

Our solutions reflects the end result. 

With a landing page for booking site, PMS and RMS, Aharooms was able to equip business owners with tactical growth solutions. 

We're confident to shift the focus on expanding sales channels, increasing the product's inventory (Hourly and Nighttime booking, Corporate partner bookings)

<!-- column 28fe66a5-8f0a-46a2-8223-d7e53d8d5a62 -->

![[dc3d4963dc8979095979e7b5a0c94dc0_MD5.webp]]

The collaboration brought great impacts on our partnership. Aharooms has <span style='color:green'>[made its way to the market](https://doanhnghiep.quocgiakhoinghiep.vn/en/doanhnghiep/aharooms/)</span> and created <span style='color:green'>[significant achievement](https://baodautu.vn/doanh-nhan-ngo-duc-nguyen-ceo-aharooms-giac-mo-chuoi-khach-san-dai-ca-thap-ky-d115045.html)</span>.

As a technical partner and a venture builder, the Dwarves contribute to the product design stage to maximize Aharooms's revenue streams at critical moments to quickly response to COVID pandemic.


<!-- column_list 0678e5ef-8651-4c0b-aade-be459f9da6e0 -->

<!-- column 5ad3de1b-f26d-4988-8373-12b4576d32d1 -->

![[bfa13c61855eb878f62c9deaa5638cde_MD5.webp]]

<!-- column 12f9232a-81fb-444c-a934-81ce71a35072 -->

![[9c6f4c4f116f9f8ae4ea80f98e649720_MD5.webp]]
