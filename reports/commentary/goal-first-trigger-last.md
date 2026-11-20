---
title: "Goal first, trigger last: how poteto teaches a bot a job"
description: "A close reading of Lauren's guide to automating work with Grok Bot, the beliefs under its seven steps, and how it compares with our desk bots."
date: 2026-11-20
toc: true
draft: true
authors:
  - tieubao
tags:
  - commentary
  - ai
  - agents
  - automation
slug: goal-first-trigger-last
type: writing
form: analysis
topic: ai-agents
fit: 2
abstract: "Lauren (poteto), who builds Grok Bot at xAI, wrote a beginner guide to automating work with a bot. Read closely, the order of its steps is a theory of delegation: agree the goal before the process, make the bot restate the job before it acts, let it interview you for the knowledge you don't know you have, give it the same feedback a person would get, and add the trigger last. This post walks through each step, names the beliefs underneath, lists what a team running bots in production has to add, and compares the method with how we charter our own desk bots."
---

On 18 November 2026, [Lauren (@poteto)](#ref-1), who builds Grok Bot at xAI and was on the React Compiler core team before that, posted a guide called "Automate Anything with Grok Bot". It's written for people who have never automated anything: small business owners, people who fill in the same form every week. The examples are apple pies, flat tires and a car repair shop.

I read it twice, mostly for the order of the steps. ==The guide only lets the bot act after the human has stopped talking==, and it only puts the bot on a schedule after a person has watched it get the job right. That order carries most of what I'd want a new teammate, human or bot, to learn about taking over a job. This post walks through the steps, then the beliefs that sit under them, then the parts a team running bots in production has to add, and ends with how it compares with the way we set up our own desk bots.

![The method in seven steps {#fig-method}](assets/goal-first-trigger-last-fig1-method.svg 'The method in seven steps. Steps 1 to 4 are talk, so a mistake costs a sentence. Steps 5 to 7 give the bot side effects and then repetition.')

## Two parts: a goal and a process

The guide opens with a definition anyone can hold: automation is a goal plus a process. The pie is the goal and the recipe is the process. A machine or code then runs the process so you don't have to do it yourself every time.

That split does a lot of work later. Once the goal and the process are separate things in the reader's head, the guide can ask you to hold the goal fixed and let the process move. Most people who try to automate do the opposite. They take the procedure they already follow, form by form, and ask a machine to copy it.

## Name the goal, not the form

The first mistake the guide names is confusing the process for the goal. Filling in a form is a step. Sending an email is a step. The goal is where the work fits in the business, and Lauren gives two plain tests: does it raise revenue (processing a sale, building a feature) or cut cost (ordering the right amount of stock)? If you can't tell, ask your manager, a colleague or the bot.

The bot then gets the goal as a responsibility, in so many words:

> "Hi Potato, this is the goal I want you to be responsible for: \<goal\>. Pick out a name and picture for yourself based on it."

If you can't put the goal into words yet, the guide turns the bot into an interviewer:

> "I'd like you to be responsible for a goal, but I'm not sure how to best describe it. Can you ask me some questions and interview me until we have a goal that I'm happy with?"

Two small choices here are easy to skip past. The starter name is Potato, which takes the weight off a blank form. And the bot names itself after the goal, so from the first message the bot is defined by what it's for. The starter goals in the guide all read as results: save for a car, schedule customer bookings, get good reviews, hire an employee.

## Talk the process out

With the goal agreed, you describe how you'd reach it yourself. The guide recommends voice dictation and says outright that a stream of consciousness is fine. The bot does the organising. You cover six things:

- the steps you usually take;
- what you watch out for;
- the apps and tools you use;
- how you check the work was done right;
- where the information comes from (email, chat, a ticket, a website);
- where you hear how it went (customer reviews, colleagues).

The last two items are the ones most hand-written job descriptions miss. A list of steps tells the bot what to do. The inputs and the feedback channels tell it where reality comes from and how it will find out it was wrong.

## Restate before anything runs

This is the step I'd keep even if I threw the rest away. The prompt ends with an explicit stop:

> "Before you begin, restate what you think my goal and process is in simple English so I can give you feedback and confirm it. I don't want you to start executing on this yet, let's focus on getting the process planned first."

You read the restatement, correct it, and repeat. The guide expects several rounds. Only then do you tell the bot to proceed and connect the apps it needs. An ambitious version adds one more pass, where the bot reviews the process against the original goal and suggests a shorter path.

The economics are simple. While the job is only words, a misunderstanding costs one sentence to fix. Once the bot has run it, the same misunderstanding has a booking, an email or a payment attached to it.

## Dig out what you don't know you know

The longest section of the guide is about the knowledge experts stop noticing. If you book customers for a living, you know which services run long, who can do which job, and when to leave a gap between appointments. None of that feels worth saying, which is exactly why it never gets said.

Lauren's booking example packs three rules into a paragraph:

- **Source of truth**: when the email and the booking system show different times, the bot needs to know which one wins.
- **Done means the end state is true**: a booking isn't finished because an email went out. The appointment is saved correctly and the customer has a confirmation.
- **Pending work is tracked**: if details are still missing, the bot keeps track so it can pick the booking up later without creating a second one.

Anyone who has run production systems will recognise these as conflict resolution, outcome checks and idempotency. The guide never uses those words.

The method for drawing out the rest is case-based. Start with a few real examples, including ones that went wrong or where you did something unusual. Ask the bot how it would handle each one, then correct it. Then hand the gap-finding to the bot:

> "Help me figure out what I haven't told you about this process yet. Ask me questions about how I make decisions, where I get my information, how I check the work, and when you should ask me for help. Ask one question at a time, then walk me through a few examples so I can give you feedback before we automate this."

"One question at a time" matters. A list of twenty questions gets skimmed and half-answered. One question gets a real answer, and the next question can build on it.

## Give the bot the feedback a person would get

Once the bot runs the workflow, the guide wants it to improve without the owner relaying every complaint. Lauren's test is to ask what you'd do yourself if you wanted to get better at the task, and then give the bot the same access.

For the booking bot, that means reading email, social media and Google or Yelp reviews. A customer writes on Yelp that they waited a long time to be seen. If the bot can read that review and look up that customer's records for the day, it can work out what went wrong and propose a change to the process.

The guide follows this to its conclusion: the more of the business that is recorded, the more the bot can improve it. The bot can even build the recording tool. For a car repair shop, it could build a small app to log when the customer arrived, when they spoke to a service rep, when the shop took their keys, and when the service started and finished. With those timestamps, "waited too long" turns into a number with a cause.

The last piece is shared IDs. A customer ID, an email address, an order number, a part number or a barcode lets the bot join records across apps. Without one, every source is an island.

## Add the trigger last

Only now does the guide ask when the work should happen: when an email arrives, when a message comes in, or on a schedule. In Grok Bot that is a routine. Before it exists, the bot works only when you ask it to, and the guide says plainly that's fine while you're starting out.

A trigger multiplies whatever the process does, mistakes included, and it fires while nobody is watching. That's why the guide holds it back until a person has seen the bot do the job right on request.

## Put the method in a bot

The guide ends by pointing at Dr Eggbot, a bot that designs bots. Lauren says it holds everything the guide's author knows about automating work. That's the same move the whole guide teaches, applied to itself: the method is a process with a goal, so it can be handed to a bot too.

One limit for this reading: the guide doesn't publish Dr Eggbot's instructions, so the deeper version of the method may live there. Everything in this post comes from the guide's own text.

## The beliefs under the steps

Each step rests on a belief about how delegation works. Pulled out, they read like advice for onboarding a person.

| Belief | Where it shows | What it buys |
|---|---|---|
| Goal over process | "It's important not to be too attached to a specific process" | The bot may find a shorter path, and nobody automates a bad procedure faithfully |
| Ownership | "The goal I want you to be responsible for", and the bot names itself | You brief it like a new hire, with context and judgment |
| Cheap start | Potato, voice dumps, "don't worry about getting it right on the first pass" | Beginners don't stall on a perfect spec |
| Hidden know-how | The bot interviews you, one question at a time, through real cases | Rules that nobody would list unprompted come out |
| Words before action | "I don't want you to start executing on this yet" | Mistakes get fixed while they're still words |
| Data drives improvement | Read the reviews, log the timestamps, share the IDs | The owner stops being the only channel for feedback |
| Automate last | Routines come after the bot works on request | A trigger never scales an unproven process |

The fourth belief deserves a name. It's the curse of knowledge: once you know something well, you can't easily imagine not knowing it, so you leave it out when you explain. Interviewers who study expert decisions get around it by asking about specific past cases, because people remember what they noticed in a real case far better than they can list rules in the abstract. The guide makes that interview self-serve by giving the questions to the bot.

## What the guide leaves out

The audience is people automating a small business from their phone, so the guide is light on everything that goes wrong after the bot works once. A team running bots on shared data has to add these:

- **Limits.** What the bot may read, what it may change and what it must never do. Anything irreversible, anything sent in the owner's name, any money and any secret needs a person first.
- **Untrusted input.** The feedback sources in step 5 are text written by strangers. A review or an email can carry instructions. The bot has to treat that text as data and never as a command.
- **One writer per record.** If two bots can both update the same field, the "which source wins" rule from step 4 breaks down across bots.
- **Knowing it ran.** A routine that stopped firing looks the same as a quiet week. Each run should report what it did and what it skipped, and something outside the bot should notice when the reports stop.

None of this contradicts the method. It slots into step 4 (limits are part of what you'd tell a new hire) and step 6 (a trigger ships with a way to see it ran).

## How it compares with our desk bots

We run a set of desk bots for Dwarves operations: a front desk for contractors, an ops desk, a finance desk, a sales desk and a few more. I wrote about the model behind them in [Owner agents, plain functions](#ref-2). Set side by side with Lauren's method, the back half matches and the front half doesn't.

| Step | Lauren's method | Our desk bots |
|---|---|---|
| Charter | Starts from the goal | Starts from access and limits |
| Teaching | The bot interviews the owner | The owner writes the bot's charter by hand |
| Data rules | Taught by example | Enforced by checks |
| Feedback | Reviews and its own records | Mostly the owner's corrections |
| Triggers | A routine, added last | Jobs with owners and liveness checks |

The match on the back half isn't a surprise. Source of truth, outcome checks and triggers are the parts that break loudly, and we learned each one from an incident. The front half is quieter. Every desk charter I checked opens with its role and scope. None of them states the result the desk exists for, or where it hears how a run went. Our ops orchestrator already demands a one-sentence goal and acceptance criteria on every ticket it files, so we're goal-first per ticket and scope-first per bot.

The feedback gap costs the most. Our bots get better when a person corrects them, which keeps that person in the loop for every improvement even when the work itself runs alone. Lauren's step 5 points the bot at the world instead. For us that means reading member messages and disputes, which is untrusted text, so it needs the input gate above before any desk reads it.

We're adding the cheap part of the method to our new-bot playbook: before a desk is built, its charter will answer what outcome it's for, how a run is known to have worked, and where the desk hears how it went. "Only from the owner" is an allowed answer to the last question, and it marks the desk as one to fix.

## References

1. **Lauren (poteto)**: builds Grok Bot at xAI, 18 November 2026. [Automate Anything with Grok Bot](https://x.com/poteto/status/2123159537016533493).
2. **Owner agents, plain functions**: our model for desk bots and the functions they call, 25 October 2026. [Owner agents, plain functions](owner-agents-and-functions.md).
