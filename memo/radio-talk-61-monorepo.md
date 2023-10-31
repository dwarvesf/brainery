---
author: 
created_time: 2023-03-27
tags: engineering, web
created: 2023-03-27
---

# Demystifying Monorepos: A Recap of Our Recent Sharing Session

During our [recent sharing session](https://www.youtube.com/watch?v=wgKssBAfih8&t=1s&ab_channel=DwarvesFoundation), we delved into the world of monorepos, exploring their benefits, challenges, and the tools available to manage them effectively. This recap aims to summarize the key points of the discussion and highlight some potential business outcomes of adopting monorepos.

## Introduction

A monorepo is a version control strategy where all the code for an organization's projects is stored in a single repository. This centralized approach simplifies code management and fosters greater collaboration across teams.

![*Source: https://www.endorlabs.com/blog/polyrepo-vs-monorepo-how-does-it-impact-dependency-management*](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/2a583fd7-6f20-4242-9964-034486a2db78/Untitled.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20231031%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20231031T202144Z&X-Amz-Expires=3600&X-Amz-Signature=66e7e8644f43a736db74a517f663d5efc8f3ed02debae3a99caa2f5315c50d3f&X-Amz-SignedHeaders=host&x-id=GetObject)

## Why choose a monorepo?

The motivation for adopting a monorepo primarily stems from the desire for autonomy and to address communication problems often associated with breaking monoliths into multiple repositories.

Benefits of monorepos include:

* Easy code sharing: Allows teams to reuse components and libraries seamlessly.
* Reduced code duplication: Encourages a DRY (Don't Repeat Yourself) approach.
* Cost-effective cross-repo changes: Simplifies refactoring and updating shared code.
* Consistency in standards and tooling: Ensures a unified approach to development across teams.

## Challenges with monorepos

However, monorepos are not without their difficulties:

* Dependencies management: Handling complex dependency chains can be challenging.
* CI/CD pipeline: Maintaining an efficient and scalable continuous integration and deployment pipeline.
* Development time: Potential for longer build times due to the size and complexity of the repository.

## Frontend monorepo tools

Several tools have emerged to help manage monorepos effectively:

* Yarn Workspaces: Provides shared node_modules and yarn.lock, as well as support for dependency symlinking.
* Lerna: Manages semantic versioning and offers a simple CLI interface for building workflows.

Despite these tools, challenges remain, such as handling affected changes upon code updates and issues with task runner queues.

### **Modern monorepo solutions**

Modern tools like [Turborepo](https://radar.d.foundation/Turborepo-0dd18b38468c4859a8beaae7bf6c511c) and [Nx](https://radar.d.foundation/nx-7abf6ad4f3044541afa649fd21238a80) address these challenges by incorporating local computation caching, task orchestration, and automatic handling of affected changes. They also provide remote caching capabilities for improved performance.

## Conclusion

Addopting a monorepo strategy and leveraging modern tools can lead to improved code management, reduced duplication, and streamlined development processes. In turn, this can result in better business outcomes, such as faster time-to-market, reduced costs, and increased developer productivity.
