---
author: 
created_time: 2021-07-26
tags: case study
created: 2021-04-29
---

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/05c51f77-90a5-4642-b6de-76d7806446ab/relay-scrn.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202317Z&X-Amz-Expires=3600&X-Amz-Signature=39e5251fc3a579d89abeaef9fc3053c596cda94fae966cebd8bf9d70d6c2e34e&X-Amz-SignedHeaders=host&x-id=GetObject)

### <span style='color:blue'>In brief</span>

* Relay is an extension tool that decreases micromanagement by automating workflows.
* Relay's first engagement with Dwarves aims to ship their MVP to market as quick as possible for early user acquisition.
* We dive in with 2 quickly adapt engineers. We keep a stable pace of feature shipment and adjust along with the requirements. 

### <span style='color:blue'>**Highlights**</span>

---

* Slack app & Chrome extension.
* Custom semantic versioning for chrome extension.
* Combine flipper, sidekiq for A/B testing and gradually roll out new version.
* Action tracking system design.
* Monorepo source code.

### <span style='color:blue'>The Context</span>

---

Relay was in the early stage. Hetong, the PO, stated clearly she needed a viable version with basic features.

The MVP must be finished fast and clean for potential customer acquirement and seeding round.

It must be done fast. And the requirement can be changed as market demands. Due to that, Hetong wants a team to quickly pick up the product context and be ready to adjust along the way. Meanwhile, keeping a stable pace for feature shipment.


🔹 The context changes. We change accordingly


### <span style='color:blue'>**Engagement Model**</span>

---

At first, we were expected to join them for the first few months. As the product goes, the trustworthy collaboration escalated that we could involve more in the development process. They welcome us to contribute the idea instead of just getting the tasks done.


<span style='color:blue'>**Teck stacks**</span>

<!-- column_list 038f145e-4c23-4f87-a674-de90065491ce -->

<!-- column f578a490-632b-48b2-9567-bf1cc95f79ff -->

* Backend: Ruby on Rails
* Frontend: React + TailwindCSS, Storybook 
* Infra: AWS Amplify
* Real-time update: WebSocket
* EventTracking: Amplitude

<!-- column 1330b672-0d1e-4540-8715-3b38e6eefb3e -->

Relay places their effort on development pace and reuses what's helpful to speed up the development progress. 

The combo of React, TailwindCSS and Storybook allows us to get that done with no sweat.



<span style='color:blue'>**Communication**</span>

Slack is definitely for team communication, while Notion is perfect for documents management. 

We take Trello onboard for task management, while all the designs are stored in Figma. 


### <span style='color:blue'>**Outcome**</span>

---

Through months of development, we are able to roll out the first MVP. 

That comes with <span style='color:blue'>**a Google Extension**</span>, <span style='color:blue'>**a web app**</span>, <span style='color:blue'>**an Analytics Dashboard**</span> and <span style='color:blue'>**a Relay bot**</span> integrated straight into Slack workspace.

<!-- column_list 20cbae4a-4ebb-4f4c-a475-56ce8f7a9f42 -->

<!-- column b91d7f4d-86a0-4487-82d0-67183b50821a -->

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/c0216797-38c8-4314-8a90-9538ab861abc/relay-welcome.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202322Z&X-Amz-Expires=3600&X-Amz-Signature=a3dc069697ec9b7316c764e4b2ea1d6752c52497d6732746ecd5ce65221e2628&X-Amz-SignedHeaders=host&x-id=GetObject)

<!-- column 212e8fb1-17ad-4a84-80c5-c1800e65beab -->

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/8e4cccb1-6076-4bcd-9148-4e66f34a679e/relay-dashboard.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202322Z&X-Amz-Expires=3600&X-Amz-Signature=ab77160e2c2dcd65af9d8ae5a59130fdbd1ecf02f99a7ebb4f840c109517e28a&X-Amz-SignedHeaders=host&x-id=GetObject)


Relay starts to acquire paid users and prepares for their next funding seed. Followed by their <span style='color:blue'>**[May Product Updates](https://teamrelay.medium.com/relay-product-updates-may-2021-f7b3db7002c5)**</span>, we're delighted to be a part of this journey. The work evolves with two more features: Relay Sequence Chart and Relay Progress - both for team productivity boosting.

