---
draft: false
title: "Reusability in software development, part 1: benefits, problems and the reuse landscape"
description: "Why software teams reuse code, what goes wrong, and the landscape of reuse from single classes to complete systems."
date: 2020-05-05
authors:
  - neko
tags:
  - engineering
redirect:
  - /S0Kodw
series: software-reuse
series_part: 1
series_total: 2
---

## Introduction

In the previous century, when the software market was also **immature**, the economy was grown with a large scale lead to more and more new business problems appear that demands software to solve such as management, automatic. So a lot of new ideas about software were imagined and implement from the roots to resolve the corresponding matter. Because of this original, the reuse of software was uncommon.

Nowadays, after a long time for deeping in building something new to solve classic problems. The seniors in this software development field have concluded an engineering strategy that is called **Software reuse** where the development process is geared to reuse existing software. The move to reuse-based development has been in response to demand for lower software production and maintenance costs, faster delivery of systems, and increased software quality. There are also matters that are needed to solve when the answer to classic problems was completed increasingly.

So this strategy is now used extensively in the development of new business systems and the companies are promoting reuse of existing systems to increase their return on software investments.

There are many kinds of field Software reuse that is being available. The Open-source movement is a representation of reuse where a lot of code that is reuse like libraries or a part of other systems.

> Open-source: "Open source is a term that originally referred to open source software (OSS). Open-source software is code that is designed to be publicly accessible—anyone can see, modify, and distribute the code as they see fit."

> Open-source movement: "The open-source movement is based on a radical retake on copyright law to create high-quality software whose use and development are guaranteed to the public."

Another is the domain-specific application systems, such as ERP systems, are available that can be tailored and adapted to customer requirements. Some big companies have supplied the components that have the ability to be configured to demand each their specific customer.

Standards, such as web service standards, have made it easier to develop software services and reuse them across a range of applications.

Reuse-based software engineering is an approach to development that tries to maximize the reuse of existing software. The software units that are reused may be of radically different sizes. For example:

- Component reuse: Component is a scalable concept, it can be big like a subsystem or small as a class, function, or object and have the ability to reuse flexibly.
- Application reuse: An application can be reused by integrating without change into a system or re-configured for a specific customer.
- System reuse: A system that contains a number of application can be a part of another bigger system.

Each function or component that includes generic functionality is potentially reusable. However, sometimes, it is very expensive to modify them for a new situation. So, rather than reuse code, the idea is also a good thing to reuse. This way is called concept reuse.

In concept reuse, instead of component, you reuse ideas, working style, or algorithm. On the other hand, it means everything that is reused is represented in an abstract notation, which does not have an implementation detail. It can, therefore, be configured and adapted for a range of situations. A few methods that depend on concept reuse are design patterns, configurable system products, or program generator. The concept reuse process must contain an activity where the abstract concept is instantiated to create executable components.

**This series has 2 parts.** Each one reads on its own.

1. Benefits, problems and the reuse landscape (this page)
2. [Application frameworks and product lines](software-reuse-frameworks-product-lines.md)

## Few aspects of software reuse

### The benefits

The first thing that everyone thinks about the reuse, is the fast development speed when applying another existing component in our system. The reuse provides the ability to bring an application or system to the market as early as possible because both development and validation time may be reduced. It is very helpful when overall development cost is not more priority than delivery speed.

To the specialists, instead of doing the same work over and over again, they often develop reusable software that encapsulates their knowledge. It is very convenient for development and sharing source code.

Another advantage of the reuse in software development is available dependability. As you know, each reuse component, application, or system should be stable. It is the result of the long term tried and fixed the problems of the development team, and applied to the working system, or itself is well-working stuff. Almost all its design and implementation faults should have been found and fixed.

In the first paragraph, I mentioned the reuse as a good option when bringing a system to market as early as possible is often more important than overall development costs. But it is not mean this a waste strategy, vice versa, in another aspect, it makes development costs reduced. This advantage can be explained that development costs are proportional to the size of the software being developed and reuse help development team write fewer lines of code.

Apply the strategy software reuse also helps the development team reduced process risk because the cost of reuse component is already known, besides, the development cost is always intransparent. So, using software reuse is an effective method for project management by helping the development team reduces the margin of error in project cost estimation. This is especially true when large software components such as subsystems are reused.

A special point that is not noted, is a lot of standards being used in each engineer's routine is the software reuse, too. For example, when using user interface standards, component as the menu is implemented by using reusable components, all applications present the same menu formats to users. So users will make fewer mistakes when interacting with a familiar interface and application's dependability will raise.

There is a lot of benefits when using Software reuse in development, but I think the above reasons are convincing enough for us to think about applying the reuse strategy in our software development process.

Summary, basically, we have six benefits of Software reuse:

- Accelerated development
- Effective use of specialists
- Increased dependability
- Lower development costs
- Reduced process risk
- Standards compliance

### The problems

Besides a lot of benefits, every tool has its own matter, Software reuse is no exception.

To the development team, it is a hard challenge to build a reusable component library that is favored by other software developers and ensure that the library is used. After building, maintaining this library is also a complex process that contains a few factors such as compatibility, comfortable, and easy to use.

On the user side of that reusable component, it takes a lot of time to find out a suitable library for their project. The rest is more and more time to understand and adapt this library in a new environment. To the engineer, they have to apply a new one into their development process uncomfortably.

The above matters are obvious and popular in the real life of every engineer. So I want to mention others with my experience.

In my recent project, I was required for updating the language version and its own dependencies. Almost all it that is open source projects, I can read line by line of the source code, but I have still had difficulty in doing the update, ensure any changes do not make code break. Have you ever wonder that if source code is not available, how difficult is maintaining the reuse with code broken ability. Yes, it is a difficult process, the reason why maintenance costs will increase.

Another bad stuff of reuse in software development is the lack of tool support. Some software tools do not support development with reuse. If it only makes difficulty, you can consider between the tradeoff and corresponding benefits. So, if it is impossible to integrate these tools with a component library system, in some situations, you will be obstructive.

The last one is called **“Not-invented-here” syndrome**, when you focus on cloning, rewriting, optimizing component with the belief that you will make it greater instead of trying to do another solution. This is partly to do with trust and partly to do with the fact that writing original software is seen as more challenging than reusing other people’s software.

### The reuse landscape

After time passed, the reuse in software development has been increasingly supported by a lot of new techniques. The base of these techniques is the fact that the system in the same application domain are similar and have the potential for reuse. There are many different ways of Software reuse, from simple components such as class, object to complete system, and that standards for reusable components facilitate reuse. You can see an overall picture of the “reuse landscape”—different ways of implementing software reuse below.

![](assets/reusability-in-software-development_ea401e3ee43cf4ee90e7edc92fe83900_md5.webp)

if you feel unclear and want to walk into details of each approach of Software reuse, you can see the following figure.

![](assets/reusability-in-software-development_54089293152bc5fd40b4e0ddb7dd69e7_md5.webp)

After having an overview of the reuse landscape, for sure, you will wonder “which is the most appropriate technique to use in a particular situation?”.

The answer to the above question depends on a lot of things such as system requirements, technology and available reusable assert, and the expertise of the development team. But there are a few key factors that you should consider when planning reuse will be mention below.

1. The development schedule for the software: In the context that you want to bring your system to the market as early as possible, reuse complete systems should be your choice instead of individual components. Although the system will not be fit with the requirement perfectly, this approach minimizes the amount of development required.
2. The expected software lifetime: Maintainability and scalability are the highest prioritizations when you develop a long-lifetime system. So choosing a reuse component whose source code can't be accessed is not wise. A personal component or open-source system can be a good solution for this situation. With the ability to access source code, you don't worry when suppliers may not be able to continue support for the reuse software.
3. The background, skills, and experience of the development team: In before [section](https://github.com/dwarvesf/radar/blob/master/software-reuse/Documents/software-reuse.md#22-the-problems), it takes a lot of time to find out a suitable library for their project. The rest is more and more time to understand and adapt this library in a new environment. Therefore, you should focus your reuse effort in areas where your development team has expertise.
4. The criticality of the software and its non-functional requirements: For a critical system that has to be certified by an external regulator, you may have to create a safety or security case for the system. This is difficult if you don’t have access to the source code of the software. If your software has stringent performance requirements, it may be impossible to use strategies such as model-driven engineering (MDE).
5. The application domain: In the market, many domains that require the same features for almost all their application such as manufacturing and medical information systems. So we can reconfigure an existed application to use in our place at a cheap cost instead of developing a new system.
6. The platform on which the system will run: Some components models are developed to using in a specified system such as .NET in Microsoft platform. The rest is the generic application that can be used in the multi-platforms. Every engineer needs to choose a reuse system that fits with development process designed.

Above is a few stuff that building and groundwork for making a decision for the questions such as when we need Software reuse, or what is the best solution for our project. Where or not reuse is applied, is often decision by manager instead of engineer. Sometime, they evaluate the risks within their choice incorrectly. Others may prefer known risks of development to unknown risks of reuse. So i think if you want to perform a decision making, you must have all of your solution on the table, the more you understand your solutions the more accuracy your decisions are. In this context, this is reuse-related decision.
