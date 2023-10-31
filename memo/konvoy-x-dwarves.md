---
author: 
created_time: 2023-09-14
tags: case study
created: 2023-09-14
---

<!-- column_list d283d8e2-ff8c-4d30-a987-d4a95cf3df78 -->

<!-- column 98b5d81d-cbf4-4f42-b017-9a2d15c034b8 -->

<!-- table_of_contents 47e1d790-2756-49aa-bdc4-470d5ccce5b6 -->


<!-- column 8b465a34-968b-4d23-9c98-4f454640bc90 -->

**Industry: **

Logistics, Supply Chain Management

**Location:** 

Australia, 

**Business Context: **

An innovative company providing beverage industry with a unique keg rental solution, emphasizing sustainability and ease of use.

**Solution:** 

A tech-driven rental system with real-time keg tracking and analytics ensuring security and transparency.

**Outcome:** 

Increase the operational efficiency and profitability of breweries with a flexible, secure, and eco-friendly keg supply chain.

**Our Service:** 

Product Consulting, Staff Augmentation

![](https://prod-files-secure.s3.us-west-2.amazonaws.com/498ebd7b-383c-459f-a9ad-b74073208ddd/851c56c6-804e-4620-845b-fe9d543c4a0c/Screenshot_2023-09-14_at_10.19.04_AM.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202123Z&X-Amz-Expires=3600&X-Amz-Signature=20bc3a4ee528d05d8368002416754b2b363945b0c8b1558a75b131a10ccf9a1e&X-Amz-SignedHeaders=host&x-id=GetObject)


### In brief

**[Konvoy](http://konvoykegs.com/)**, a pioneering force in the keg management industry, first surfaced in Australia and New Zealand in October 2019. By October 2020, the company had integrated Keg Services into its framework, enhancing its cutting-edge, tech-based keg solutions with stellar service and deep industry expertise. Konvoy caters to the unique needs of breweries by offering both short-term rentals and long-term leasing options.

The short-term rental solution, an ideal fit for one-way trips, guarantees transparent costs and promotes sustainability. On the other hand, the leasing model lets you have your own kegs for a low monthly fee, freeing up your capital for business investment.

Driven by its mission to track every keg's location, Konvoy reduces losses and bolsters profit margins. Its top-tier service and maintenance ensure minimal downtime for your kegs. Currently a dominant entity in the ANZ market, Konvoy is powered by a dedicated team of 30 professionals.


---

### Challenge


---

### Solution


---


### Technology Stack

The deployed technology stack includes the following major components:

* **Kubernetes**: This was used to establish a PHP Symfony backend API for managing organizations, users, orders, kegs, and their related information like current location, historical routes, and more.
* **Symfony Commands**: Several Symfony commands were developed and deployed as cron jobs within Kubernetes. These commands processed keg location data, offering near-realtime keg location updates, ensuring a consistently updated system.
* A **Go-based Geolocation API**: This was deployed via Kubernetes, providing cost-effective geolocation based on a set of SSIDs, a more economical alternative to HERE maps or Google Maps.
* **Redis Caching**: This feature was employed with third-party services like HERE maps to cut costs and enhance latency response times.
* **GitOps Approach**: This strategy, in conjunction with ArgoCD, facilitated continuous deployment, enabling Konvoy to roll out new features and rectify bugs with zero downtime, maintaining system stability and security.
* **Error Monitoring and System Health**: Monitoring tools such as Sentry, Prometheus, Grafana, and Loki's logging features were used to promptly detect and address system errors, ensuring consistent system health.

In a nutshell, this technology stack bestowed Konvoy with a resilient, cost-effective solution that optimized operational efficiency while providing users with dependable and prompt services.


---

### Achievements

The strategic collaboration between **Dwarves Foundation** and **Konvoy** has resulted in remarkable achievements over two years:

* Smooth migration from a system based on EC2 to Kubernetes EKS, facilitated by a thorough system analysis, a strategic migration plan, a Kubernetes cluster build-out, containerization of the existing applications, resource management with Kubernetes, and the implementation of service discovery, load balancing, automated scaling, security, and monitoring/logging.
* Containerization and deployment of the existing applications on Kubernetes, leading to improved system efficiency and scalability.
* Implementation of robust monitoring and logging using the PLG stack, ensuring optimal application health and performance.
* A major revamp of the Admin Dashboard, leading to a more user-friendly, visually appealing, and intuitive interface.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/1108caf8-126a-46c1-9c14-cd279b2bbcce/Screenshot_2023-07-12_at_14.01.21.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202129Z&X-Amz-Expires=3600&X-Amz-Signature=5d042daabeb9cacb5dcca191727ed81821170f672e0e5200a1a2eac0bab935ff&X-Amz-SignedHeaders=host&x-id=GetObject)

* Dramatic speed enhancements in fetching keg history location and routes, reducing latency response time from tens of seconds to mere seconds – an improvement largely credited to Brad, the leader of the engineering team.

---


Dwarves Foundation is a team of design and development experts working closely with clients to craft software, build tech teams, and invest in people who create world's next favorite things.

**Love what we are doing?**

* Check out our **[products](https://superbits.co/)**
* Hire us to **[build your software](https://d.foundation/)**
* Join us, **[we are also hiring](https://github.com/dwarvesf/WeAreHiring)**
* Visit our **[Discord Learning Site](https://discord.gg/dzNBpNTVEZ)**