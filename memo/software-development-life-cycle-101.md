---
author: 
created_time: 2021-07-21
tags: SDLC
created: 2020-05-19
---

This workshop contains the basic knowledge on Software Development Life Cycle, provides people with a step-to-step guideline and the artifacts which will be created on the way. We don't dive in the details. Instead, we treat it as an overview look on how to build software successfully.

### Table of Content

1. What is Software Project?
1. Software Development Life Cycle
1. SDLC Models

# What is Software Project?

We build software, and we need a planned undertaking. So call software project is “A specific plan or design” or “A planned undertaking”.

## Project Constraints

A software project has a lot of constraints. Cost, scope, quality, customer satisfaction, risk, resource, time, or anything in between.

But the most important ones are

* Quality
* Budget
* Time

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5c2d98a7-2b08-4d9d-8a95-021674ac5a05/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=658176b04745b4dbf3bf60b517bcbebf811b2f7c84484a0da546ddf3a201f123&X-Amz-SignedHeaders=host&x-id=GetObject)

## Why does a project fail

With a lot of constraints, the project is easy to fail. We could have plenty of reasons why a software project fails: team politics, overdue payment,... but three of them could be prevented easily with proper methodology, framework

* Unclear/misleading project requirements
* Wrongly defined tech stacks
* The wrong approach, develop practices

## Project success

If it's easy to fail, then what is a successful project?


> The project is complete on time, on budget and have low defects (high quality)


This is just a simple definition of what is a successful project based on 3 important constrains. In the end, we want to build software that "awesome" within time and budget.

But how 🤔

# Software Development Life Cycle

The secret sauce of a successful project lies in the answer to those questions:

* How to perform the step?
* Who is responsible for doing the step?
* Which artifacts will it produce?
* How long will it take?
* Which step should we do next?

So which steps are we talking about?
We're talking about the Software Development Life Cycle, which sounds familiar to all CS, CE folks.
For the rest of us who take a nap in class-time or for those who are new in the field, Software Development Life Cycle (SDLC) refers to a methodology with clearly defined processes for producing software with the highest quality and lowest cost in the shortest time possible.
SDLC provides a well-structured flow of phases that help an organization to quickly produce high-quality software which is well-tested and ready for production use.

In detail, the SDLC methodology focuses on the following phases of software development:

* Requirement analysis
* Planning
* System Design
* Implementation
* Testing
* Deployment
* (Maintenance)

Let's take a look back on what we have learned and how this methodology could guarantee project success.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/e7b63edd-ac2a-41c9-a689-1097f8542a5a/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=06f4b74a8224945d46493a3bb933ea0e5153b0716810190841f5b761a1bf6fab&X-Amz-SignedHeaders=host&x-id=GetObject)


## Requirement Analysis

“What are the current problems? What are we gonna build?” This stage of the SDLC means getting input from all stakeholders, including customers, salespeople, industry experts, and programmers. Learn the strengths and weaknesses of the current system with improvement as the goal.
Business-oriented is a key in this stage. There are plenty of technique being used **(Lean Canvas, AARRR Framework, Industry Research, User Research, Competitor Analysis, Personas, Problem Statement, User Journey Mapping)** and with a lot of deliverables to analyze requirements and validate the business model that the software aims to empower.


The two most important artifacts of this stage that need to be well-documented is

* **Lean Canvas:** a lean business model which defines problem - solution - market - cost - revenue of a digital product. Lean Canvas needs to be validated before moving to the next stage else we will develop software based on imaginary

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/09cdbbb9-30a3-4410-81d6-cb74cd8583c9/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=946458015443244f2bb9939d2b9b2cb5e856092f4f9dd299e0af55b3aef26142&X-Amz-SignedHeaders=host&x-id=GetObject)



* **AARRR Funnel**: after the Lean Canvas is validated, define funnel for each revenue stream. This artifact will be the foundation of the System Design Stage.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ba6592cb-f4d8-4426-ac8b-cd3dbc5a9f95/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=d5535bee1a037ee711d3430e305e59c91864d3568c9cf24a72f51a70ec465e92&X-Amz-SignedHeaders=host&x-id=GetObject)

Those two will be generated with the agreement between **Product Managers, UX researchers, and Clients.** This stage would take time, but with well-documented artifacts in-hand, we could save a lot of time later on.

## Planning

We need a plan (obviously) after the requirement analysis phase complete.

“What do we want?” In this stage of the SDLC, the team determines the required cost and resources for implementing the analyzed requirements. It also details the risks involved and provides sub-plans for softening those risks.
In other words, the team should determine the feasibility of the project and how they can implement the project successfully with the lowest risk in mind.

> #Why: To manage project constraints :) (or we will fail real damn fast)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/13013814-c3c3-4a5d-81f8-fac84630ccb0/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=f871c4b5dba3b70e159df8f4cb65c79d5ee80a025a8e449d2e3a21a4d5d4f0f4&X-Amz-SignedHeaders=host&x-id=GetObject)


We have a validated business model, few funnels of revenue streams. We have things that need to be built. Now we need a plan to build it at top-quality within budget and time.

Product Manager and Technical Architecture need to sit down with Clients to define some sweet things

* **Project Charter** (Product Roadmap, Milestone Release, People in charge...)

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b0b9c8eb-c5c1-4201-bca0-4ca04c6aa1a2/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=d5f0add15533cf1f4ca4fdc91dc2588326b9d93d75986cb49b3527e7b835018c&X-Amz-SignedHeaders=host&x-id=GetObject)

* **Work Breakdown Structure** (Job need to be done)
* **Tech Stacks**

Some minor things will be defined at this stage as well such as Communication channel, Tooling..., etc.

## System Design

Based on the produced artifacts (AARRR Funnel, Project scope, Product roadmap...), the foundation of the system will be built at this stage.

“How will we get what we want?” This phase starts by turning the software specifications into a design plan called the Design Specification. All stakeholders then review this plan and offer feedback and suggestions. It’s crucial to have a plan for collecting and incorporating stakeholder input into this document. Failure at this stage will almost certainly result in cost overruns at best and the total collapse of the project at worst.

The list below is just as general as possible but those artifacts are the least we could have after finishing System Design stage

* **Information Architecture Design** **(IA): the** foundation of information which will be presented to connect the user to the content they're looking for when using the software.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6ea4451f-82a5-42fa-b2c2-622672e1c697/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=71d2a02665a570cc6dc30e1227993b8ff1f7f8e0903a738f019a784c18a6cf73&X-Amz-SignedHeaders=host&x-id=GetObject)

* **Software Modeling** (Usecase Diagram, State Machine Diagram, Activity Diagram, High-level Architecture Diagram, ERD...)
* **User flows, User stories, Wireframe**
* **Design System**
* **User Interface, User Interaction Design**

The roles

* UX Designer
* Technical Architecture (Software Engineer)
* Visual Designer

## Implementation

> #“Let’s create what we want.”

At this stage, the actual development starts. Every developer must stick to the agreed blueprint. Also, make sure you have proper guidelines in place about the code style and practices.

This is the longest stage of SDLC Process. Work is divided into units or modules and assigned to various Software Engineering. The **project quality** is set by this phase. There're knowledge areas that Software Engineer could dig deeply to improve and understand Software Craftsmanship.

Make it count and share with the team what you have learned recently.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ccbf179e-4034-447c-b85a-ebf586852b83/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=5d77565b718951e8d4e2e03afb09d51d31448cde09c79fea8ea1d42dfb0f4111&X-Amz-SignedHeaders=host&x-id=GetObject)

## Testing

“Did we get what we want?” In this stage, we test for defects and deficiencies. We fix those issues until the product meets the original specifications.

In short, we want to verify if the code meets the defined requirements.
Provide stakeholders information about the **project quality** then sign off application deliverable to release it to end-user.

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/0985ab99-aa1f-4d2f-9e6a-5baa1e041292/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202402Z&X-Amz-Expires=3600&X-Amz-Signature=f2978d91b07ab54166d3315ee947c724850b9c9c5fd8b00b15c87edad1058a88&X-Amz-SignedHeaders=host&x-id=GetObject)


## Deployment

> #“Let’s start using what we got.”

Now, the goal is to deploy the software to the production environment so users can start using the product. However, many organizations choose to move the product through different deployment environments such as a testing or staging environment.

This allows any stakeholders to safely play with the product before releasing it to the market. Besides, this allows any final mistakes to be caught before releasing the product.

Job needs to be done

* Setup infrastructure (server, domain, database, ...)
* Automation process (CI/CD)