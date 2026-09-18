---
title: The good copy is on their laptop
description: Discord has no record button, and capturing from the call leaves you a 720p copy of work someone spent a week on. We record two tracks now, and the twenty seconds that matter belong to the presenter.
date: 2026-09-18
authors:
  - tieubao
tags:
  - culture
  - sharing
  - remote
slug: good-copy-on-their-laptop
---

Five minutes before Vincent went on, I asked how we were going to record him.

He was about to walk the team through his prototype for UI planning: flow designs, Mobbin references, the whole loop, live on our Discord stage. Ten or fifteen minutes of someone explaining a thing they had actually built. The sort of session you want to keep.

Five minutes is late to be asking. It is also when the question usually arrives, which is why I want to write the answer down once.

## Discord has no record button

There isn't one. Not hidden in a menu, not behind a server setting. Voice and stage channels carry audio and video and then let them go.

So the reflex is to capture the call from the outside: point OBS at the Discord window, grab whatever comes through. That works, and it produces a copy of a copy.

Here is the part that costs you. A free Discord account streams Go Live at [720p and 30fps](https://support.discord.com/hc/en-us/articles/360040816151-Go-Live-and-Screen-Share). Nitro Classic raises that to 1080p60, full Nitro up to 4K60. Most people on a work call have never bought Nitro. Their screen leaves their machine at a quarter of the pixels they are looking at, and everything downstream inherits that number.

![](assets/good-copy-on-their-laptop-fig1-two-paths.svg)

_Fig. 1: One talk leaves the machine twice. The call path re-encodes once and every later copy carries the loss._

Vincent's session was design tooling, which means small labels and numeric fields, the kind of screen where the content is 11px type. So I tested the resolution half of this. I rendered a properties panel at 1440p, pushed it down to 720p and back up, and cut the same crop out of both.

![](assets/good-copy-on-their-laptop-fig2-resolution.png)

_Fig. 2: The same crop, shown 1:1. A 720p round trip discards three quarters of the pixels._

Softer, and less bad than I expected. The labels survive it. What goes is edge definition, the crispness that makes a screen full of numbers comfortable to read rather than work. And the test only models the resampling. Discord's encoder adds compression on top, at whatever bitrate the network allowed that minute, which I did not reproduce.

## The twenty seconds belong to the presenter

The copy worth keeping never touches the call encoder. It comes off the presenter's own machine, at whatever resolution their screen actually runs.

On a Mac that is `Cmd+Shift+5`, pick Record Entire Screen, hit record. Windows has `Win+Alt+R` through Game Bar. Nothing to install on either, which matters when you are asking someone to do it five minutes before they go on.

There is one trap in it. The macOS capture bar has an Options menu with a Microphone setting, and it defaults to None. Miss it and the recording looks perfect and plays silent. You cannot recover the audio afterwards. It is gone.

So the instruction we send is four steps, and the third one is the microphone. We send it by DM before the session rather than explaining it during, because a presenter about to speak has no attention to spare for a settings menu.

## One track is never the whole session

The presenter's file has their screen and their voice. It does not have the room.

Questions come in over the call, from other people's microphones, and they never reach the local recording. Often the questions are the best part. Someone pushes back on a decision, the presenter explains the reasoning they left out of the walkthrough, and that exchange is the thing a new joiner needs six months later.

![](assets/good-copy-on-their-laptop-fig3-coverage.svg)

_Fig. 3: The presenter's track wins on quality for everything it holds. It simply does not hold the discussion._

That gives us the rule. The presenter records themselves, always, because that file is the master. The host records the call in OBS when the Q&A is worth keeping, which is most of the time for a session anyone asked a real question in. Two files, cut together afterwards if the session earns the edit.

## What this is really about

We have been running [OGIF](/ogif-intro) since 2023. Friday sharing, broad topics, whoever has something to show. The sessions happen, people learn things, and then most of them exist only in the memory of whoever was in the room.

Nobody runs a sharing session for the recording. Still, the difference between a talk that helps eight people and one that helps every person who joins over the next two years is a file, and that file costs twenty seconds of setup from the person already doing the hard part.

The failure mode here is quiet. Nobody sets it up, the session runs, and the decision gets made by default in the direction of losing it.

## The honest limits

The 720p number is Discord's published cap. Figure 2 measures what that resolution alone does to a panel of small type, and stops there. I never captured our own stage next to Vincent's local file, so the compression Discord layers on top of the resampling stays an assumption in this post. If you want the real answer for your setup, record the same screen both ways once and open the two files side by side.

Game Bar on Windows records one window, not the whole screen. A talk that moves between a browser, an editor and a terminal needs OBS on the presenter's side too, which is more than twenty seconds and worth flagging when you invite them.

And none of this touches consent. Say the session is being recorded before it starts. Some people will speak differently, and a few would rather not be on it at all, which is their call to make and not one to discover afterwards.

## The four steps, for pasting

```
1. Cmd+Shift+5
2. Record Entire Screen
3. Options > Microphone > your mic    <- the one people miss
4. Record. Stop from the menu bar. File lands on the Desktop.
```

Windows: `Win+Alt+R` to start and stop, `Win+Alt+M` for the mic, file lands in `Videos\Captures`.

Send it before they go on, not while they are talking.
