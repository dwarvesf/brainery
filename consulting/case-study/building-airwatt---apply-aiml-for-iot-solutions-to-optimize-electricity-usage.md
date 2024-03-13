---
tags: 
  - case study
  - design
title: Building Airwatt Apply Aiml For Iot Solutions To Optimize Electricity Usage
date: 2019-11-15
description: null
authors: null
menu: memo
type: null
hide_frontmatter: false
created: 2019-11-15
---

![[b1d2f4d32b1a3a8f8085bf8a5aebe92f_MD5.webp]]

### <span style='color:blue'>In brief</span>
* AirWatt is an IoT solution that integrates and monitors electricity usage using AI/ML. 
* AirWatt's vision is to help businesses track electric usage status of electrical equipment. Hence, they can save electricity and money, even avoid disaster.
* They seek for product development support, with insight on business to provide suitable product design
* The MVP must be done fast to prove the product's concept. <span style='color:blue'>We built Airwatt system from zero</span> with other teams: Business, Hardware, and AI.

### <span style='color:blue'>Technical Highlight</span>
---

* Microservices architecture
* Data structure and Infrastructure to centralize all data from Airwatt monitors on platforms.
* End-to-end data-flow from Monitor to AI servers for machine learning.
* MVP-centric: Rx-MVVM Inputs/Outputs to balance development's velocity by separating UI from business logic
* ESP Touch protocol for hardware WiFi connection
* A scalable platform with native mobile apps.

### <span style='color:blue'>The Context</span>
---
AirWatt is designed for quick installation and constant improvement. Hence, it should comes in multiple platforms

AI utilizes data to figure out which device is on or off. We must create analytics dashboard with tracking mechanism. 

The problem is hard to solve, yet, it's worthwhile and improved all the time.
![[cce56122290dff1fee0a827b148f1e41_MD5.webp]]

They have the capability to handle hardware production and Machine learning. But they face obstacle in building the MVP to visualize and nurture all the data structure. That's where we dive in to help, as technical partner and venture builder. 

### <span style='color:blue'>Engagement Model</span>
---

<span style='color:blue'>**Solution Design**</span>

**Onboarding**

AirWatt's system is taken with 4 aspects to meet its business demand

* <span style='color:blue'>Monitor Management</span>**: S**upports administration tasks at different places. Users can also switch on/off and view the detailed usage information of each monitor.
* <span style='color:blue'>Reporting</span>**: **Must-have features to track usage status of electrical equipment. On the mobile version, the report shows weekly or in the nearest three months.
* <span style='color:blue'>Mobile App</span>: The only way to bring the Monitors online and bind them to the corresponding user accounts. 
* <span style='color:blue'>Web App for B2B</span>**: **For business owners to track data provided by Airwatt monitors through weekly and monthly reports.

<span style='color:blue'>**Microservice Architecture**</span>
AirWatt processes a huge data volume at the same time. We build the architecture with two focus points: CRUD data and IoT data. 

All data must be synced to the AI system in real-time. AirWatt faces <span style='color:blue'>~ 17,280 records</span> per device every day. Going microservice is the ideal solution. 
![[c91a49d28d91773c00b3165feaaa9319_MD5.webp]]
* <span style='color:blue'>Airwatt System</span>: The core domain to manage device's life cycle.
* <span style='color:blue'>Landing Page</span>: Features solutions and pre-order for AirWatt's services.
* <span style='color:blue'>Admin Panel</span>: Administrative dashboard for AirWatt to access and update data. 
* <span style='color:blue'>Mobile</span>: iOS and Android version with dashboards, charts and report features.
* <span style='color:blue'>AI core</span>: is the most important part with 4 main features: Data synchronization, detect appliance, predict appliance, prepare report data. 
* <span style='color:blue'>IoT core</span>: Core data in the AirWatt system for IoT devices. This module helps to oversee and track the device's status.

<span style='color:blue'>**Different databases for different purposes**</span>
* <span style='color:blue'>MongoDB</span>: AirWatt system for data of IoT devices. Update device's status and electric consumption every 5 secs for real-time features and input to AI core.
* <span style='color:blue'>DynamoDB</span>: Stores the data related to the input for the AI core. We use data from the Airwatt system data to pre-process data for AI's main features.

<span style='color:blue'>**AI Model**</span>

AI models is built from real data with beta testing users, by the labeling data technique. AirWatt system collects the appliance's data in 2 weeks. These models are the input data to detect, predict appliances in real-time.

<span style='color:blue'>**Smart config Integration**</span>
Mobile apps must connect user's hardware to the server using wifi. It registers the hardware to the server and link it with the user account. 
We use smart config integration with ESP2866 as wifi protocol. This requires manual-press button to enable the smart config mode.

<span style='color:blue'>**Tech stacks**</span>
* Backend: Golang
* Frontend: React.js, Typescript, Swift, Kotlin
* Infras: Docker, k8s, AWS, GCP, Netlify
* Framework: Gin, TailwindCSS, Gastby
* Database: PostgreSQL, Redis, MongoDB, DynamoDB
* Monitoring: Grafana, Loki, Prometheus, Sentry
* Architecture: MVC, N-Tiers, Reactive, Microservices
* Library: RxJava, RxKotlin, RXSwift
* Reporting: Charts & MPAndroidCharts

<span style='color:blue'>**Collaboration**</span>

* Development: Figma, Git/Github, Insomnia, K9s
* Practices: Agile, Gitflow, CI/CD, Code Review, Automation

![[8d005fd066a63c376836e9440523ee69_MD5.webp]]

### <span style='color:blue'>Outcome</span>
---
After three months, we have accomplished the MVP development stage with necessary modules:

* <span style='color:blue'>Web App</span> for B2B support
* Native mobile apps on <span style='color:blue'>[iOS](https://apps.apple.com/us/app/airwatt/id1522009415)</span> and <span style='color:blue'>[Android](https://play.google.com/store/apps/details?id=com.dwarvesf.airwatt)</span><span style='color:blue'> </span>platform
* End-to-end system design that handles data from monitor devices to the central server, processed with AI/ML and visualize the nurtured data on cross-platform apps.
* Eye-catching & detailed data report 
![[98ff38b1521894691a908557706aedcc_MD5.webp]]

<span style='color:blue'>**Airwatt**</span>** **has successfully made its way to the problem-solution fit stage. And event marked itself at <span style='color:blue'>[Vietnam Zone Startup](https://vietnam.zonestartups.com/zone-startups-portfolio/)</span><span style='color:blue'>. </span>The next milestone customizing the web app for a specific domain: FnB. A spinoff to the energy monitor solution for FnB is Airwatt's nearest goal. 
![[cce56122290dff1fee0a827b148f1e41_MD5.webp]]
![[c371c2899128501e8f1ae7b28e17fa72_MD5.webp]]

