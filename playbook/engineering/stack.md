---
title: Technology stack
description: How we evaluate technology with a tech radar, and the tools, techniques, platforms and languages we use.
date: null
redirect:
  - /h2928Q
authors: []
credit: Dwarves Foundation
---

### Our perspective on technology

#### New technology needs to provide actual value over existing solutions

Software is changing the world every day. Software moves fast. The technology you used yesterday may be deprecated today. New technology has enabled us to create new things.

The world is running by the goodwill of people who try to make it a better place. With the existing set of problems, new solutions will come out along with new technologies. When we look at new tech, we think about the movement of the market & society on which the new tech could fit in. The main idea is to see if the new tech could help to make anything better than before in the long run and also serve our development direction.

#### Make sure you understand both the old technology and the new one before buying into the next new thing

We continuously evaluate new technologies using our tech radar. They are classified into topics: Techniques, Tools, Platforms, Languages & Frameworks with category:

- Adopt: We feel strongly that the industry could be adopting these items. We use them approriate on our projects.
- Trial: Worth pursuing. It is important to understand how to build up this capability. We could try those technologies on a project that can handle the risk.
- Assess: Worth exploring with the goal of understanding how it will affect the company.
- Hold: The items that need to proceed with caution.

#### How an item moves on the radar

```text
 +--------+     +-------+     +-------+
 | Assess |---->| Trial |---->| Adopt |
 +---+----+     +---+---+     +---+---+
     |              |             |
     +--------------+-------------+
                    |
                    v
               +--------+
               |  Hold  |
               +--------+
```

Typically, a new technology starts at Assess. It moves to Trial when a project that can absorb the risk uses it, and to Adopt once the team knows how to build with it. Anything that proves a poor fit, or ages out, goes to Hold. A short note on each move (what we tried, what we learned) keeps the radar useful to the next team.

### Technology index

#### Tools

- Basecamp: Project management and team communication software by 37signals.
- Gitlab: Git is like a time machine. We have our self-host source version control.
- VSCode & Vim: Our popular editor of choice to be productive. There are a few members who prefer to use emacs, but our point is always the right tool for the right job.
- Sketch & Figma: A primary design tool for UI Design and collaboration between the development team.

#### Techniques

- Scrum: an agile framework for team collaboration
- Docker-centered: our workflow that uses Docker container in every phase of the development lifecycle. It ensures the runtime isolation and eases the development/deployment process.
- CI/CD: a practice to integrate, build, and deploy source code efficiently.
- Gitflow: a branching model for git which helps save time and organize development team activity on the codebase.
- Code Review: a part of our software QA activity that helps identify bugs and defects before the testing phase.

#### Platforms

- Docker: the engine enables containerized applications to run anywhere consistently on any infrastructure.
- AWS: Cloud computing services by Amazon
- GCP: Cloud computing services by Google
- Istio: An open platform to connect, manage, and secure microservices by Google
- Netlify: All-in-one platform for modern web development

#### Languages

- Golang
- Elixir
- Rust
- React.js
- Vue.js
- Kotlin
- Swift

### Note on currency

The technology index above is a snapshot from when this page was written. Tools and platform names change, and the radar ratings are not kept in sync here. Check with the project team for the current choice before treating an entry as a recommendation.
