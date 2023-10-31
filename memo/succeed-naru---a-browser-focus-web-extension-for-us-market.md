---
author: 
created_time: 2021-07-26
tags: case study
created: 2021-04-18
---

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/327cf611-a3b8-4246-9ddd-a0840d412417/naru.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202317Z&X-Amz-Expires=3600&X-Amz-Signature=76b3dc1395bb7fdc5bb2c145321232101583fb33f5d8f12ab181d0546cf99c0b&X-Amz-SignedHeaders=host&x-id=GetObject)

### <span style='color:purple'>In brief</span>

* Being a digital designer who looks for inspiration and digital trends, Matt hopes for a productivity tool that could lend well to his browsing habit. 
* Matt got in contact with us via a connection of a friend. We were surprised by the opportunity he provides: <span style='color:purple'>A browser extension for works management</span>. We did explore web extension - but never had an opportunity for real trial. 
* We take the chance to help bring it to market. A great working experience with US timezone and a notable milestone for turning web extension into viable-type product.

### <span style='color:purple'>Highlight</span>

---

* Naru demands a render mechanism right into user's web browser. We adopt ShadowDOM for encapsulation and make the component reusable.
* Customized script for auto-release to remove manual release work 
* First time trial GraphQL instead of typical RESTful API - gave us the flexibility to query exactly what we need and nothing more. 
* Async Communication practices to decide what's important based on current timeline, roadmap and release plan. It avoids quickly jump and redundant features. 

### <span style='color:purple'>The Context</span>

---

<!-- column_list a385b6ec-838d-4636-b83d-0e464bbea198 -->

<!-- column 7e8f78e3-843f-47f1-835b-f45ba129cf47 -->

Naru's goal is to supercharge user workflows on web browsers. 

An enhanced version of to-do list - but acts as a widget within user's browser.

<!-- column 23773448-de02-418d-a6f5-31ef6362038d -->

⚛️ Keeping the open state for the task board across tabs is the highest priority. Naru must boost the productivity.


![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d7049820-3bf2-4ebb-a25d-c029c27044cc/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202317Z&X-Amz-Expires=3600&X-Amz-Signature=02626f6aea6f83494dbcf2f3bc062aa861847689f208f4b2ed9cad73a4f0cab0&X-Amz-SignedHeaders=host&x-id=GetObject)


### <span style='color:purple'>Engagement Model</span>

---

<!-- column_list 2b3565c4-e957-47a2-9629-2f5d7034b1dc -->

<!-- column 11dace72-3268-4d9e-a536-754d4f3f9028 -->

Making a web extension behaves like an application (says Trello) is nontrivial. A web extension work by attach and execute) its own `<script>` tag to the current web page. After that, it boot up with a UI for user interaction.

<!-- column aa1ad5ac-c48c-4f85-a875-4c12cf59415a -->

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/16110442-f373-4d18-9e93-df59bfb6c39d/na-ex.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202322Z&X-Amz-Expires=3600&X-Amz-Signature=beb588f5d76020a7991a91c96179180342dac2269b565e439c0023e4ac11c7f3&X-Amz-SignedHeaders=host&x-id=GetObject)


<span style='color:purple'>**Collaboration**</span>

Matt resides in the U.S. It's 11 hours away from us. He had to stay up at 9pm and we woke up at 8am for our daily catchup. We quickly realize such a schedule won't work in the long run. 

After 2 sprints, we proposed "<span style='color:purple'>Async Communication</span>". Daily calls became daily check-in writeup.  Meeting turns to 15' quick calls: Sprint planning, Mid-sprint adjustment and Sprint retrospective. 

Daily check-in forces us to define the daily focus. It removes unnecessary ideas. It sticks us on the right track.

<!-- column_list 508bb3d9-207e-4e4d-a5af-c33600583f46 -->

<!-- column 492b3fbf-492a-4ae3-96bf-a519d050f81c -->

As we partner, more product ideas & features come up from payment plans, team collaboration and analytics. The ideas are unorganized. 

It leads us to 2 todo "list": "<span style='color:purple'>Icebox</span>" and "<span style='color:purple'>Client feedback</span>". This drives a sense in separating feedback and idea contribution. 

The team meet up twice a week to go through the lists, modify each item to structured software requirements, and propose for clarification. 

Once those requirements became new features. We either put to future sprints or the backlog

<!-- column 48acddc0-5db0-449d-8215-814279de69a9 -->

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2a50af54-b7c2-4c99-8d2d-3b7418c1f44d/na-wf1.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202323Z&X-Amz-Expires=3600&X-Amz-Signature=9343aee748c823424f565e2d4a95d35977bb6bd67d9f1d13fc162e2b4d03b088&X-Amz-SignedHeaders=host&x-id=GetObject)


<span style='color:purple'>**Release-schedule**</span>

* Prerelease (sideload version) every Monday morning: This gives us a week ahead to test the release. 
* Web store releases: We wrap-up a prerelease a week in advance. All features are frozen. We spend the next sprint for prerelease testing. It must be stable before deployed on the web store.

<!-- column_list fa73905b-910d-459f-8ceb-2acf5eb8f2e1 -->

<!-- column 0c8177ba-db9b-492b-917c-92c7b4e6ac86 -->

<span style='color:purple'>**Tech stacks**</span>

* Backend: Elixir
* Framework: Phoenix
* Frontend: React, Typescript, Redux
* API query: GraphQL
* Infras: GCP

<!-- column a5d1a1b2-ba5b-4049-bf9c-fdf2ed020084 -->

<span style='color:purple'>**Tooling**</span>

* Basecamp: Team discussion and client advisory
* Tracked: Task management
* Async communication: Team sync-up

### <span style='color:purple'>Outcome</span>

---

<!-- column_list 590a9680-99b1-4e39-97cd-086fbe452c8e -->

<!-- column a7b0906e-d6c7-48a5-9dd2-6909d757f39f -->

After 3 months, the very first stable version of <span style='color:purple'>[Naru.app](https://naru.app/)</span> hit the web store - indicating our very first success in web extension development. 

Moving forward, we head for advanced features: team collaboration, team space and activity dashboard.

<!-- column 0894036e-0b47-4fbb-ba0d-51299517d610 -->

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/d88687b2-a682-4b57-a15f-286ac4602a12/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202324Z&X-Amz-Expires=3600&X-Amz-Signature=9cc37b915efb4126771e6fb3cadc5d5844b1887fe5d7fc7f7678d3a399455cef&X-Amz-SignedHeaders=host&x-id=GetObject)

It's going to be a busy and an exciting year. Currently, the beta-user is getting invited through <span style='color:purple'>[Typeform](https://naruappco.typeform.com/to/d3hurf)</span>. 

<!-- column_list ca403362-39f6-4809-b204-c9aaec5b49fa -->

<!-- column 672e0736-fd2d-49d6-9fcd-71a183ff1c33 -->

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/5f7cc736-302c-4dd0-9b18-0a221e351a10/na-beta.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202325Z&X-Amz-Expires=3600&X-Amz-Signature=f646b0c02a96f5c2af9ea3a744dd7e05b5c04061413524973345362e09d0eaea&X-Amz-SignedHeaders=host&x-id=GetObject)

<!-- column 9c6dc8fa-5369-4183-9651-f670e5f08f04 -->

![](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/6c1ee2d9-ab87-4e98-b3dd-13385dc312cd/na-ux.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202325Z&X-Amz-Expires=3600&X-Amz-Signature=a65c655885d6eda4f732f8c9b88b549536ed9bab9d26adecb7060a2d6f9a6cca&X-Amz-SignedHeaders=host&x-id=GetObject)
