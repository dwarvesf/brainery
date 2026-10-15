---
title: Pair programming
description: How we pair program, with driver and navigator roles, what to agree before, during and after a session, and what to avoid.
date: 2026-10-15
redirect:
  - /Ql8wug
---

We encourage pair programming between all levels of experience. Nobody is required to pair program for a certain amount of time, but it is a great tool to help solve complex problems quickly and more efficiently with an extra set of eyes.

Code that is written by two people who sit next to each other at the same computer is [pair-programmed](http://www.extremeprogramming.org/rules/pair.html) code. The best way to pair program is to just sit side by side in front of the monitor. Slide the key board and mouse back and forth. Both programmers concentrate on the code being written. The programmers undertake one of two parts ,  the Driver and the navigator. The driver in the process is responsible for diligently drafting code, while the navigator’s job is to review and concentrates on the plan of action.

That code is considered high quality and should result in cost savings due to less maintenance. The matter of fact is, pair programming technique can take around 15% longer, yet produces 15% lesser defects. In the long run, this style of development saves money because fewer bugs are written and therefore do not need to be fixed later.

Generally we use it for complex pull requests review and coaching and fixing

```text
 +------------------------------+   timer or finished test   +------------------+
 | Driver types, navigator      |--------------------------->| Switch roles     |
 | reviews and explains         |<---------------------------|                  |
 +--------------+---------------+                            +------------------+
                |
                v
        Break and feedback
```

## How?

- When pair programming, one person should “drive” while the other “navigates.” The navigator will assist the driver with the code they should write and explain the reasoning behind any code that they might dictate

- The driver should be implementing the code that the navigator recommends, while frequently pausing to ask questions about the code. When the pair programming session is over, both parties should have a deep understanding of the code that they have committed

- Generally the one responsible for typing is known as the ‘Driver’, while the other one called the ‘Navigator’ continually revise and review what is being coded or typed. During the whole of their time with each other, the duo invariably keeps in touch, enabling the other partner to participate and help outline the code direction.

- The objective is to share the workload between both the participants in order to maintain the constant development stream and also to help spread knowledge over the team.

The driver and the reviewer should constantly interact with each other as it will add to the knowledge and efficiency for both the members.

**Before:**

- Agree Scope (Pairing for two hours? Until the ticket is complete? Just get past the bug?)
- Agree Physical/Virtual Location ("Will we both be comfortable here?")
- Agree Working Environment (Two keyboards? Text editor and other tools)
- Agree Pairing Style (Time-based? Ping pong?)

**During:**

- Keep the chat going (Think aloud. Encourage/support)
- Keep switching (Follow the pairing style)
- Keep both involved ("Could we do this another way?")
- Keep breaking
- Keep checking in ("Could we search for a guide separately?")

**After:**

- Ask for Feedback (What did we do well? What could we have done better? It’ll feel weird, do it anyway)

## Do

Communication is what that makes all the difference.

#### Strong-type pairing

For an idea to go from your head to the computer it must go through someone else’s hands.
Whenever the driver requires pitching in the idea, he must handover the system to his partner and then carryout the control from the observer position

## Don't

That’s possibly because the person in charge of typing isn’t communicating, or perhaps the reviewer doesn’t want to bother him. Many times I’ve observed where the driver put forth ‘just a minute, I’ve got an idea’ and keep on working, the navigator check their social accounts or do some other irrelevant tasks.

## Pros

Paired programmers are only 15% slower than two independent individual programmers, but produce 15% less mistakes
Around 96% of the pair programmers reported in an online survey that they enjoyed their work in a pair programming environment than working alone.
Establishing a senior-junior combo might be a great step to refine the junior’s skills and proficiency.

## Significant pair programming Markers

Some notes that we should consider applying

#### During pairing

- Let me drive
- Could you assist me?
- Let’s do it together
- Here’s my plan
- What plan do you have in mind?
- How does this code block work? Let’s perform unit test
- I’m tired? What’s up?
- I don’t get the point. Draw me a design
- Did we overlook something?

#### Take a short break

- Can we take a break?
- Can we switch roles?
- Let’s go out for a cup of coffee

#### Remember

- Don’t force it
- Give your partner an opportunity to drive at the RIGHT time
- Encourage open communication
- Don’t ignore breaks
- Trust
- Identify your mistakes
- Criticize yourself first
- Slow down

## Take away

- Sync
- Communicate to sync

## Example: a 90-minute pairing session

A generic plan for fixing a bug in an unfamiliar module:

1. **Before (5 min)**: agree the goal ("reproduce the bug and get a failing test"), the stop condition (ticket done, or 90 minutes), and the style (switch every 25 minutes).
2. **Round 1 (25 min)**: A drives and writes the failing test. B navigates, reads the code paths aloud and asks questions.
3. **Switch and short break**: B drives and writes the fix, A navigates.
4. **Round 3 (25 min)**: both clean up, run the full test suite and write the pull request description together.
5. **After (5 min)**: each person says one thing that went well and one thing to change next time.

If one person has not spoken for several minutes, switch roles. That is usually the sign the pairing has become one person coding and one person watching.
