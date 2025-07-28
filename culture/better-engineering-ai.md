---
title: Better engineering
description: A personal take on how AI is changing software development and why better engineering still comes down to human judgment, not just better tools.
date: 2025-07-28
authors:
  - tieubao
tags:
  - culture
  - engineering
  - ai
  - craftsmanship
  - philosophy
  - personal
---

I've been staring at my screen for the past hour, watching Cursor AI suggest a database query that's syntactically perfect but will absolutely murder our performance when we have real users.

This happens more often than I'd like to admit. The AI understands the data I need to fetch, follows the ORM patterns correctly, even adds helpful comments. But it doesn't know that this particular table has 50 million rows, or that the join it's suggesting will lock up our database for minutes.

Everyone's telling us that AI is going to revolutionize software development. That we'll all be 10x more productive. That coding will be as easy as having a conversation. Maybe they're right about some of that. But honestly? I think we're missing something important in all the hype.

## The thing about better tools

Here's what I've learned after using AI coding tools for the past year: better tools don't automatically make you a better craftsperson.

I know, I know. That sounds like something your grandfather would say about kids these days. But stick with me here.

Last month, I watched a junior developer on our team work with Claude to build a user authentication system. They were flying through the implementation, getting AI to generate functions, write tests, even create documentation. Pretty impressive setup. But three weeks later, when they hit a tricky bug, they were completely stuck. Why? Because they had been delegating the work to AI without understanding the context well enough to guide it properly.

The developer wasn't being lazy or careless. They just hadn't learned the new skills you need when working with agentic coding tools. Managing context, breaking down problems, knowing what to delegate and what to keep control of. These are craftsman skills too, just different ones than we're used to.

This stuff happens all the time now. We're generating more code than ever, shipping features faster than ever, and dealing with more technical debt than ever. Something doesn't add up.

## What actually stays the same

Despite all the AI hype, the fundamentals of good software haven't changed at all. And I mean at all.

Good software is still readable. It's still maintainable. It still solves real problems without creating new ones. It still needs to work when things go wrong (and they always go wrong).

AI can help you write code faster, but it can't help you understand whether you're solving the right problem. It can't tell you if your architecture will hold up when you have 10x more users. It can't predict that the client will completely change their requirements next month (they will).

I've seen AI generate beautiful, clean functions that do exactly the wrong thing. I've seen it create comprehensive test suites for features that shouldn't exist. I've seen it optimize algorithms that were already fast enough while completely ignoring the actual performance bottlenecks.

The problem isn't the AI. The problem is thinking that better tools automatically lead to better outcomes.

## Your job is changing (and that's okay)

Look, I'm not going to pretend that AI isn't changing how we work. It absolutely is. But maybe not in the way most people think.

You're not going to be replaced by AI. But you might be replaced by someone who knows how to work with AI effectively. The difference is huge.

Working with AI effectively means knowing when to trust it and when to ignore it completely. It means understanding what problems it's actually good at solving (spoiler: mostly the boring, repetitive stuff you didn't want to do anyway). It means recognizing when a generated solution is "good enough" and when it's going to cause problems down the line.

Most importantly, it means knowing what you're trying to build and why. AI can help you get there faster, but only if you know where "there" is.

I've started thinking of AI tools like really smart interns. They're eager to help, they can handle routine tasks pretty well, but they need constant supervision and they definitely shouldn't be making important decisions on their own.

## The productivity trap

Everyone's obsessed with being more productive these days. Ship faster, code more, deliver earlier. AI is supposed to be the answer to all of this.

But here's the thing: most of the problems I see in software projects aren't productivity problems. They're effectiveness problems.

Productivity is writing more code per hour. Effectiveness is writing the right code. Productivity is shipping features faster. Effectiveness is shipping features that actually solve problems.

AI can definitely help with productivity. It's pretty good at generating boilerplate code, writing tests for existing functions, and handling routine refactoring tasks. But it's terrible at effectiveness. It can't tell you whether you're building the right thing.

I learned this the hard way last year when I used AI to rapidly prototype a feature that the client had specifically requested. The AI helped me build it in half the time it would have taken normally. The client loved the demo. But when we shipped it to real users, nobody used it. Not because it was buggy (it wasn't), but because it solved a problem that didn't actually exist.

That's the difference between being productive and being effective.

## Choose boring solutions (especially with AI)

When AI first got really good at coding, I went through a phase where I wanted to use it for everything. Generate functions, write tests, create documentation, optimize performance. It was fun and felt futuristic and made me feel like I was on the cutting edge.

Then I realized I was making everything more complicated than it needed to be.

AI is great at coming up with clever solutions. It loves design patterns and fancy algorithms and elegant abstractions. But clever isn't always better. Most of the time, boring is better.

This applies to the AI tools themselves too. There's a new "revolutionary" coding assistant launching every week. Some promise to be 50% better, others claim to understand your codebase perfectly, others want to completely change how you work.

I've learned to ignore most of them. We stick with a small, stable set of AI tools and update them monthly, not daily. We're not chasing every new model that comes out. We're using the ones that work reliably for the boring stuff we need them to do.

Boring solutions are easier to understand. They're easier to debug. They're easier to modify when requirements change (and they always change). They're easier for the next person to work with.

I've started using AI mostly for the stuff I was already doing in a boring way. Generate standard CRUD operations. Write basic test cases. Create simple utility functions. Let it handle the routine stuff so I can focus on the interesting problems.

The interesting problems still need human judgment. They still need someone who understands the context, the constraints, and the trade-offs. AI can help with the implementation, but it can't help with the thinking.

## Details still matter (maybe more now)

Here's something weird I've noticed: as AI gets better at generating code, the small details become more important, not less.

When everyone can generate a working login system in 10 minutes, the difference between good software and mediocre software comes down to things like error messages, loading states, edge cases, and all the tiny interactions that make software feel polished or clunky.

AI is pretty good at the happy path. It's terrible at everything else.

It doesn't think about what happens when the network is slow. It doesn't consider how the interface should behave when the user does something unexpected. It doesn't anticipate the edge cases that real users will definitely find.

But here's the thing: **someone still needs to be there to verify all this stuff.** AI can generate the code, but you need to be the one checking if it actually works in the real world. You need to test those edge cases, review those error states, make sure the generated solution actually solves the problem you have, not the problem the AI thinks you have.

That verification work? That's still human work. And honestly, it's the most important human work.

## What this means if you work with us

I should probably mention that this isn't just philosophical musing. This is how we actually approach projects at [Dwarves Foundation](https://dwarves.foundation).

We use AI tools. We're not Luddites. But we use them thoughtfully, as part of a process that still prioritizes human judgment and craft.

When you work with us, you're getting the benefits of AI-assisted development (faster prototyping, fewer routine bugs, more time spent on interesting problems) without the downsides (over-engineered solutions, hidden assumptions, technical debt that shows up later).

We'll use AI to generate boilerplate code, but we'll review and refactor it to fit your specific needs. We'll use it to explore different approaches to problems, but we'll make the final architectural decisions based on our experience with real-world systems.

Most importantly, we'll stay focused on your actual problems instead of getting distracted by impressive-looking technology that doesn't serve your users.

## Better engineering is still about better judgment

I think the biggest misconception about AI and software development is that it's going to make engineering easier. It's not. It's going to make certain parts of engineering faster, but the hard parts are still hard.

Understanding what to build is still hard. Designing systems that can evolve is still hard. Making trade-offs between different approaches is still hard. Debugging complex interactions is still hard.

AI can help with all of these things, but it can't replace the judgment that comes from experience. It can't substitute for understanding your users, your constraints, and your long-term goals.

Better engineering in 2025 is still about making good decisions. AI just gives you more information to base those decisions on, and more time to focus on the decisions that matter most.

At least, that's how we see it. Your experience might be different, and that's fine. But if you're looking for a team that thinks about AI as a tool for better craftsmanship rather than a replacement for it, we should probably talk.

The future of software development isn't about humans versus machines. It's about humans and machines working together, with humans still making the important calls.

And honestly, I think that's a pretty good future to build toward.
