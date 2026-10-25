---
draft: true
title: Software testing 101, when to stop, who tests in agile and user acceptance
description: Three practical questions about software testing, covering when testers should stop, whether agile teams need testers, and what user acceptance testing adds as the last test.
slug: software-testing-101
kind: reference
announce: false
authors:
  - "neko-anon"
date: 2026-10-18
tags:
  - "101"
  - engineering
  - testing
  - agile
  - uat
type: research
topic: engineering-practice
---

Testing is about balance, and three questions come up on almost every project. When do we stop? Who does the testing when the team works in an agile way? And what is the last test before the software goes to the customer? The sections below take them in that order.

_Merged and rewritten by neko-anon, the Dwarves editorial desk bot, from older notes in the research archive._

## When to stop testing

In theory, testers should stop only when every defect has been found and fixed. That is impossible, because no one can know whether all defects have been removed. So testers must stop at some point to deliver the software to the customer.

Testing keeps a balance between cost, time and quality. Management's view on the schedule often dictates it. The usual approach is to stop when the scheduled time or the budgeted cost is reached. Project managers often order testing to stop based on the delivery schedule, whether or not defects remain.

Management's view on quality can also decide it. Project managers order testing to stop when the software meets all requirements, or when the benefit of more testing cannot justify its cost. That usually takes several quality tests to evaluate the software. Quality tests include functional, reliability, performance, security and scalability tests, among others. Each one requires running the software and collecting data to make sure no failure or bad data occurred.

Perfect software, or zero defects, would need more testing and may take a very long time. For most software development it makes no sense to aim for it.

From a practical view, "zero defects" is an unattainable goal. Reaching it means every process and every step is designed so perfectly that producing a defect is impossible. As far as I know, no software company has ever achieved zero defects.

## Testing in agile projects

Do we need an independent test group for an agile project? Some people say that with agile you do not need testers anymore. Is it true?

Agile works well for small projects of four to ten people. Because the team is small, it may not need an independent test group. Developers can test their own software and check the results during the daily meeting. They must write unit tests to make sure their code works. As a team, they can also test each other's work, so a separate test group may be unnecessary. With agile, developers are also testers.

Companies usually run both small and large projects. For a larger project there is still a need for an independent test group, so the company still needs testers.

Regression testing matters a lot in agile. Changing code can introduce defects. Development is iterative, and each release is built by modifying the previous one. So regression testing must run in every iteration. It confirms that the new functionality works and that the functionality released earlier still works as expected.

To make sure the product meets the customer's requirements, testing must be sufficient and cover all scenarios. The final software may need to go through an independent test group before the project ends, to confirm everything works. In that case an independent test group is still important.

There is a lot of hype about agile replacing other approaches. That is not correct. Agile is a good way to build small software in a short time, when not all requirements are clearly defined. For larger projects that need more than ten or twenty people, agile is difficult to apply, and you may still need another approach.

Agile also needs developers and customers to communicate closely during development. If customers are too busy to take part in the project, you should not use agile. You build in short iterations and rely on customer feedback to improve the features of the next iteration, so customer involvement is critical.

## User acceptance testing

Today customers expect software companies to deliver quality software at the lowest cost and in a short time, to meet their business needs. Many companies focus only on the functional side, through tests such as unit, integration and system tests in their development environment. Few pay attention to how the software will work in the user's environment. Often the software meets all functional requirements but fails user acceptance testing because the testing environment was not compatible.

User Acceptance Testing (UAT) helps users assure themselves that the software meets their needs and runs well in their environment. It is designed to find out whether the software fulfills the acceptance criteria and is ready for use. UAT shows how well the software complies with the business requirements when it runs in the real business environment.

### Who takes part

UAT involves users, which sets it apart from system testing, where developers and testers do the work. Because users play a key role, the acceptance criteria should be defined with them in the early phases of the software life cycle. Business analysts or requirements engineers, who know the business processes, must help design the right requirements. Those requirements form the base for the testers' test cases. UAT should run in an environment that simulates production, or on the exact real-world usage of the software.

### What happens in it

By the time UAT starts, most technical defects should already be fixed through the unit, integration and system tests that testers ran earlier. UAT tests functionality and usability thoroughly. The testing team develops the test scenarios. An effective UAT plan must detail the key areas, and the user acceptance test cases must be prepared to test the software. Any defect found during UAT should be resolved as soon as possible.

UAT helps projects make sure the software implements the intended business processes and meets the requirements of users in various environments. It is the last test in the software development life cycle, and the most necessary one to prove that the software meets users' requirements.
