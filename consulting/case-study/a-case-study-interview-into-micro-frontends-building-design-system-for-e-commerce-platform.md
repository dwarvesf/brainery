---
tags: 
  - web
  - engineering
  - frontend
  - case-study
title: A Case Study Interview Into Micro Frontends Building Design System For E Commerce Platform
date: 2023-04-03
description: null
authors: null
menu: consulting
type: null
hide_frontmatter: false
---
Previously on [Why Micro-Frontend](https://memo.d.foundation/Why-micro-frontend-6d5df5b9b71e4f248a7740bc51e096a4), we took a look into what is Micro-Frontend architecture, as well as some core concepts behind it. For some of you that have missed the memo, here’s a tl;dr:

> *Micro frontend architecture is an approach to building web applications by splitting the user interface into smaller, independent, and reusable parts. Each part is owned and developed by a separate team, and they are brought together in the browser to create a single, seamless user experience.*

In this article, we'll dive deeper into the practice of applying micro frontend architecture at Swift - an e-commerce company and long-term partner of Dwarves Foundation. We'll take a closer look at one specific use case - **development & integration of a shared design system** - and explore some of the challenges and outcomes of using micro frontend architecture.

*For privacy’s sake, we will refer to our client company as “Swift”. The information discussed here is from a real interview based on real-world events.*

## Case Study Interview: Building a shared design system
![[88ee17472ae46934b5dcf3be218aba09_MD5.webp]]

### What's the reason behind choosing micro-frontend as the main architecture?
At Swift, we wanted to make our development process more efficient, and we found that breaking down large projects into smaller chunks was the way to go. 

This led us to micro-frontend architecture, where we split the project into smaller chunks so that each team could be in charge of a chunk. This made development, testing, and delivery much easier.

### How did you split the projects?
The projects at Swift are split vertically by page and sub-domain. We have at least ten apps in total, each assigned to a specific team. A sample breakdown of our current system would include:
* Authentication (Login)
* Profile Dashboard
* Ads Management Dashboard
* Chat
* Design System

… and so on.

This approach has allowed us to have a more focused development process, which has ultimately led to better results.

### What challenges did you face while building a shared design system?
We realized that having a UI library that all our apps could use would reduce code duplication and make the development process smoother. To achieve this, we opted for a stack of React, Storybook, and pure CSS that gets bundled together with the component.

One of the significant challenges we faced was following the design with sufficient leeway for all possible variants and customizations. We also encountered technical issues, ensuring the components can integrate nicely into multiple different apps and environments. Last but not least, we had to focus on building good documentation that allowed for fast and accurate collaboration.

### How did the shared design system fit into the architecture?
The process of consuming this app is relatively straightforward. We build and publish the package to npm, and consumers install it and import the components they need to use.

We have started applying this design system to our existing apps, such as Ads Management Dashboard, and we are expecting to integrate it further into other projects in the near future.

### What if the apps have to use different versions of the package?
Since this is a UI-focused package, we believe it is unlikely that the apps will face difficulty upgrading to the newest version. 

Initially, we recommend implementing the UI independently in each app, and only after everything is stable should we gather the components that can be shared. By this point, the cost of upgrading the package for all apps should be relatively low because the risk is also low - considering that we have ensured all the components are working in a stable way.

### Did the shared design system meet your initial expectation?
Our expectation was to build an internal design system that all our apps could share, and we have achieved our goal. We have released the first version of the package, which can be applied to some of our production apps.

In conclusion, at Swift, we have found that micro-frontend architecture and a shared design system have been beneficial to our development process. While we encountered some challenges along the way, we believe that the benefits have been worth it, and we are now reaping the rewards of a more efficient and streamlined development process.

## Conclusion
In this case study, we explored how the Micro-Frontend architecture was applied across Swift’s e-commerce platform - how the system looks, and how it makes integrating a new app much more efficient. Vertically splitting the apps by sub-domains is an effective approach to Swift’s use cases - and it looks like they will keep going strong with this.

Alas, Swift is not the only one among our partners that are utilizing a Micro-Frontend architecture, and we are reaching out to others for even more insights.