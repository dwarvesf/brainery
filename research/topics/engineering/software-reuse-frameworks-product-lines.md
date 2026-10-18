---
draft: false
title: "Reusability in software development, part 2: application frameworks and product lines"
description: "How object-oriented application frameworks package reuse, and how software product lines reuse a common core across a family of related products."
date: 2020-05-05
authors:
  - neko-anon
tags:
  - engineering
slug: software-reuse-frameworks-product-lines
announce: false
series: software-reuse
series_part: 2
series_total: 2
---

Part 1 set out why teams reuse software and the landscape of ways to do it. This part looks at two larger-scale forms: application frameworks, which package a reusable skeleton in object-oriented code, and software product lines, which reuse a common core across a family of related products.

> Part 2 of 2 in the software reuse series. Previous: [Reusability in software development, part 1: benefits, problems and the reuse landscape](reusability-in-software-development.md)

## Application framework

Before explore about Application framework, let's revise object-oriented development. Following is an difinition of OOD that i see on [Quora](https://www.quora.com/). I think this is really good sentence for mentioning to it

> Object-oriented Development (OOD) a group of methodologies that sees real world entities as objects and classes. For example, hospital is a real world entity, becomes hospital class and later multiple hospital objects are created, each with unique property values.

For a long time, some enthusiasts for object-oriented development suggested that one of the key advantages when using an object-oriented approach is reusing previous work. That means you can use the same object for different systems. However, to me, in my work, when coding and developing a system, I see a truth is that we need specified objects or classes for a particular component or application. Another bad thing is that we often spent more time to understand and adapt the object than reimplement it.

So, instead of using OOD directly, we have an object-oriented development process that is the best support for object-oriented reuse through larger-grain abstractions called frameworks.

> Framework is an integrated set of software artifacts (such as classes, objects and components) that collaborate to provide a reusable architecture for a family of related applications.

The first characteristic that is bounced off when I think about the framework is framework provides support for generic features of the domain that is focused on this framework. For example, in my primary programing language - [Golang](https://github.com/dwarvesf/radar/blob/master/software-reuse/Documents), it has a web framework being named [Echo](https://github.com/dwarvesf/radar/blob/master/software-reuse/Documents) - a high performance, extensible, minimalist web framework for Go. Besides a lot of salient features, it has generic features of a web framework such as routing, database integration, authentication, data rendering.

Another example is [Unity](https://github.com/dwarvesf/radar/blob/master/software-reuse/Documents) that is known as a game engine or game framework, it also has a lot of generic features that always exists on each game engine such as audio system, graphic, animation, UI widgets or hardware event handling... Depend on their features, tools, each engineer can comfortingly creative. For web engineers, this is extending APIs, integrating the third party, implementing new web services by using existing functions for method. For game developer, it also drags and drops UI object to defines game scene layouts or handle mouse event to make an NPC (non-player character) does few animations. More and more.

As you see, the framework helps us have a lot of things to reuse. It can ether skeleton architecture for building from bottom to top of a system or only a method that is used for integration of an external component. Although existing in different scales, but framework components always support each other or being reuse to construct another bigger. It is easy to see that the architecture is implemented by the object classes and their interactions. Classes are reused directly and maybe extended using features such as inheritance and polymorphism.

Another fact is a framework can contain others. It begins from common sense that a framework can big or small and can be used to implement a complete system or also a small part of an application. For example, in Unity, the above stuff that I called a framework, has a lot of nested frameworks such as Unity2D, Unity3D, and a lot of external stuff for doing specific things. It can be an action Framework for increased performance and ease of development, game object distance/time weighting framework, or a full 2D runner framework and game sample.

Finally, we can consider a few class of framework.

I saw a few types of framework in [Sommerville software engineering 10th edition](https://dinus.ac.id/repository/docs/ajar/Sommerville-Software-Engineering-10ed.pdf), see the following:

- System infrastructure frameworks: tools for doing everything in infrastructures layer such as communications, user interfaces, and compilers.
- Middleware integration frameworks: line of frameworks that support construct an ideal environment for an application works. For example, there are Microsoft’s .NET and Enterprise Java Beans (EJB). What is the ideal environment? This is a location that allows each component of your system to communicate with each other and with OS and exchange data easily.
- Enterprise application frameworks: specified frameworks for the specified domains, such as telecommunications or financial systems. It doesn't only support the development, but also contains this domain's deep knowledge. This kind of framework is the key of the product line that is considered in the next section.

To me, I prefer another way to classify frameworks that looks more specific and practical.

- Web Application framework
- Application framework
- Multimedia Framework
- Game Framework
- More and more, I don't think it's mandatory to naming as long as you feel comfortable and understand what is under the hood.

Summary, framework is used for the reuse purpose, so, an application is constructed base on frameworks that can be reused, too, and the product line is a representation of this application, will be considered later.

Be a very effective approach to reuse but the framework approach also has corresponding disadvantages. Introducing a framework for another engineer or development team is expensive. I saw a lot of good framework being spanked until someone digs it up randomly. On the development team, it is difficult to approach a new framework and hard to debug if this framework's source code is not available.

## Software product lines

In real life, when going to the hospital, we see the medical management application on the doctor's desktop similarly. In the cafeteria, store management applications with the same features all time. Have you ever wonder why are they always like that? In short, these are the representations of product lines.

What is product line?

As above, we can understand that is the application when a company wants to serve a few kinds of customers that have their own characteristics, or a software development team is required to create an application with similar features for different customers. Instead of developing software for each case, the development team can create one that has the ability to being configured to suit unidentical requirements. On the other hand, this is a system with a common architecture in core and shared components with a few features that is can be configured flexibly. That configuration can relate to the configuration of some components, implementing additional components, and modifying some of the components to reflect new requirements.

Generally, product line derives from an exist application that is called base application of product line. Base application is usually designed to simplify reuse and reconfiguration. Generally, a base application includes three kinds of component as following image:

[The organization of a base system for a product line](https://github.com/dwarvesf/radar/blob/master/software-reuse/Documents/software-reuse.md#3-4-7-8-%22software-engineering%22-httpsdinusacidrepositorydocsajarsommerville-software-engineering-10edpdf)

- Core components that provide infrastructure support. These are often immutable when developing other instances of the product line.
- Configurable components that may be modified and configured to specialize them in a new application. Sometimes it is possible to reconfigure these components without changing their code by using a built-in component configuration language.
- Specialized, domain-specific components some or all of which may be replaced when a new instance of a product line is created.

On the other hand, we can distinguish the components of the product line into 4 layers that are as following:

1. Interaction layer: User interface is located here. Users can visualize intuitive information being sent from the system and interact backward.
2. I/O management layer: handle event or signal with information from the user interface, validate and preprocess data such as authenticate, map output, route planning, provide a mechanism to communicate with the lower layer.
3. Resource management layer: core logic that handles data, process, the query to the database and normalizes data to render to user.
4. Database management layer: build database's components and this related logic such as database function, trigger...

Besides, depending on these component's type, we have various types of specialization of a software product line may be developed:

1. Platform specialization: Depend on the platforms where the system is built on such as MacOS, Linux, or Windows, we have corresponding versions of the application in the product line. In order to do that, the component that interfaces with the hardware and operating system is modified.
2. Environment specialization: This environment is the operating environment. It can be peripheral devices or communication environments of different hardware in the system. So we need different versions of the application to fit the environment.
3. Functional specialization: This a more popular specialization in the product line. You can see every banking application of different banks with a lot of generic features, but in a bank, you need at least 50$ to do a transaction, another can be 150$.
4. Process specialization: Make an application of product line fit with specific business processes.
