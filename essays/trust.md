---
title: "How trust works at Dwarves: from your team to the people we call first"
description: Trust grows in three circles, from your team to the people we call first in a crisis. What each circle gets, what membership costs, and how a person or a report loses it.
date: 2026-10-18
authors:
  - tieubao
kind: essay
tags:
  - culture
  - career
  - leadership
  - communication
  - soft-skill
  - trust
redirect:
  - /culture/trust
  - /PxbhVg
  - /the-inner-circle
  - /essays/the-inner-circle
  - /culture/the-inner-circle
  - /K91YtA
  - /as-your-last-delivery
  - /essays/as-your-last-delivery
  - /culture/as-your-last-delivery
  - /PXeiCw
slug: trust
---

When production breaks at 2 a.m., leadership calls a short list of engineers first. Nobody appointed them and nobody published the list. This page describes how people get on it, what it costs them, and what takes a name off. <!-- needs Han: the opening incident, anonymised, in one line: "When [incident] hit at [time], we called [N] people. Nobody had appointed them." -->

![Three circles of trust, from your team to the company {#fig-circles .live}](assets/trust-fig1-circles.svg 'Trust reaches outward in three circles. Amber marks the circle people are called from.')

## Three circles

Trust doesn't arrive all at once. It grows outward from the people who see your work every day.

**Your team.** Be reliable, ship quality work and help teammates succeed. When your manager needs someone for a critical task, they think of you first.

**Your organisation.** Other managers notice your work through cross-team projects, or because your manager mentions you in a leadership meeting. Directors learn your name and invite you to planning and strategy discussions.

**The company.** You become one of the go-to engineers across the whole organisation, and senior leadership pulls you into the highest-stakes projects. This is the circle we call the inner circle, the people who step up in a crisis.

Each circle vouches for the next one out. A director trusts you partly because your manager already did, so you can't skip a step.

## What the inner circle does and what it costs

Members take the first call in a crisis, whether it's an outage, a client problem or a change of direction. They give technical input on planning, mentor newcomers, sit in hiring decisions and carry information between the technical and business sides.

The price is real. Their work gets scrutinised more closely, so mistakes cost more. They take the assignments others can't or won't handle, which means longer hours and harder problems. They have less say in which project they work on, because the company points them at its highest priorities. And they stay reachable during a crisis, whatever the day.

An earlier version of this page said membership has no set criteria, then listed duties and costs, which are criteria. The criterion is visible in the list: the person kept shipping and kept being right about technical facts. Nobody is invited. A person gets called, and the calls repeat. <!-- needs Han: the entry trail, anonymised: for N people who entered, what each did and how long it took, plus one who left the circle -->

## The last piece of work counts most

People weigh your most recent delivery heavily. A strong history doesn't shield a shaky last release, and a solid next one can rebuild what the shaky one cost. We wrote this up once as a Lego tower: everyone talks about the last one you built. It sounds unfair. It also keeps every task a fresh chance to show what you can do.

## Confidentiality is a habit with a report attached

The usual advice is to keep what leaders tell you out of the public channel. Don't write "as I discussed with the CEO yesterday" where everyone can read it. That advice holds.

A quieter failure is a secret in a log. On 3 September 2026 an upstream error made two of our workers fail for 40 minutes. One of them carried our live provider API key inside its error message, and every log line and rethrow after it published that message, three or four times over. It was the third incident of that class in five weeks. A person reading a census of the logs found the leak. A scanner didn't. The production deploy of the redaction fix started at 01:47 the next morning, and the key was rotated at 09:19 that day. No misuse turned up.

What I weigh in a case like that is the report. It states the blast radius, says that rotation was still pending when it was filed, and says a person caught what the tooling missed. A person who files the full account promptly earns more trust than one whose record stays clean because nobody looked.

## Trust in a report works the same way

I now apply the same layers to agents, because I read their reports the way a director reads mine. A report earns trust by what it checked and how.

An alert-triage bot of ours once posted a verdict that proved right, with two false claims on the way to it. Its git lookups had failed silently in the wrong repository, and a stale context pack filled the gap with a tidy story. The verdict was right for the wrong reasons, which is no basis for trust. Trust attaches to the reasoning behind a verdict. The details are in [the delegation log](communication-overhead.md).

## When trust breaks

It rarely ends in a confrontation. You stop getting the direct questions. You aren't in the early planning discussions, and you aren't top of mind for high-visibility work. The relationship quietly ends. The cause is practical: if leadership can't rely on your judgment, they find someone they can. If you say something is impossible and it turns out to be doable, or you promise that something works and it doesn't, leaders can't check the details themselves, so they watch for signs your judgment is sound. <!-- needs Han: one anonymised case where trust broke and what the person lost -->

Remote work adds friction. Without a shared office, visibility stands in for trust: share progress before anyone asks, write your decisions down, answer within a reasonable time across time zones, and show up in cross-team discussions where your judgment can be seen.

## Where this is wrong

The criterion rewards what leadership can see. A person who prevents a crisis quietly never enters the room where crises get called. Work that nobody notices doesn't earn the first call.

An unwritten rule also excludes people. A newcomer learns the rule by watching, and watching favours people who already sit near the circle. I haven't measured who gets in and who doesn't, so I can't say how much this costs us.

The same few people get the first call each time, and the cost list above lands on them. I have no data on how long a person stays in the circle before burning out.
