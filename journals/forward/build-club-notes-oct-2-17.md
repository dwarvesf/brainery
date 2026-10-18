---
title: "Build club notes, Oct 2 to 17"
description: "Twelve short findings from #build-club threads on game design, launch channels, AI video cost, and agent tooling, with credits and source links."
date: 2026-10-18
kind: digest
authors:
  - bievh
  - hieuvd
  - minhluuquang
  - phucld
  - huymaius
  - tieubao
  - monotykamary
  - datnguyennnx
  - tuanddd
  - zlatanpham
tags:
  - build-club
  - game-dev
  - prototyping
  - ai-workflow
slug: build-club-notes-oct-2-17
redirect:
  - /journals/forward/notes/9t-cultivation-game-friction
  - /9t-cultivation-game-friction
  - /journals/forward/notes/continuo-mac-control-after-restart
  - /continuo-mac-control-after-restart
  - /journals/forward/notes/reference-video-rigging-shortcut
  - /reference-video-rigging-shortcut
  - /journals/forward/notes/2026-10-07-game-distribution-vietnam-launch-surface
  - /2026-10-07-game-distribution-vietnam-launch-surface
  - /journals/forward/notes/2026-10-08-little-danang-landing-page-as-build-surface
  - /2026-10-08-little-danang-landing-page-as-build-surface
  - /journals/forward/notes/2026-10-09-game-monetization-starts-with-the-economy-loop
  - /2026-10-09-game-monetization-starts-with-the-economy-loop
  - /journals/forward/notes/2026-10-10-ai-tech-compositing-ai-video-costs
  - /2026-10-10-ai-tech-compositing-ai-video-costs
  - /journals/forward/notes/2026-10-12-lobshot-prototype-feedback
  - /2026-10-12-lobshot-prototype-feedback
  - /journals/forward/notes/turn-downtime-into-play
  - /turn-downtime-into-play
  - /journals/forward/notes/2026-10-14-build-club-prototype-scope-note
  - /2026-10-14-build-club-prototype-scope-note
  - /journals/forward/notes/overpowered-prologue-reset
  - /overpowered-prologue-reset
  - /journals/forward/notes/2026-10-17-expiring-model-credits-routing
  - /2026-10-17-expiring-model-credits-routing
---

Twelve short notes from #build-club threads between Oct 2 and 17, folded into one page. Each section covers one thread: the finding, why it matters to a small team, who said it, and where to read the original.

## Intentional friction makes a niche game feel native

bievh shared 9T, a cultivation game prototype that keeps its genre friction on purpose. Players read the character menu, learn that sitting near a rock cultivates faster, fight monsters, sell the drops, buy rice, and spend spirit stones after level 3. Spiritual roots, random character rolls, and monsters that run from a stronger player give the world its xianxia flavor.

bievh cut the in-game guide from 15 tabs to 4 and estimates 20 to 30 hours of play without cheats. Boredom and easy cloning stay open risks. Easier onboarding can erase what makes a niche game recognizable, so a copyable game has to build its moat from feel and content depth.

Credit: bievh. Oct 2.

Sources: [bienvh.itch.io](https://bienvh.itch.io/9t), [Discord 1](https://discord.com/channels/462663954813157376/1280726623414390805/1555245198466879650), [Discord 2](https://discord.com/channels/462663954813157376/1280726623414390805/1555251288785158357), [Discord 3](https://discord.com/channels/462663954813157376/1280726623414390805/1555251416556114044), [Discord 4](https://discord.com/channels/462663954813157376/1280726623414390805/1555251915628085258), [Discord 5](https://discord.com/channels/462663954813157376/1280726623414390805/1555252426456571924), [Discord 6](https://discord.com/channels/462663954813157376/1280726623414390805/1555254896834642043), [Discord 7](https://discord.com/channels/462663954813157376/1280726623414390805/1555255678136746085), [Discord 8](https://discord.com/channels/462663954813157376/1280726623414390805/1555255797888450661), [Discord 9](https://discord.com/channels/462663954813157376/1280726623414390805/1555418773568098395), [Discord 10](https://discord.com/channels/462663954813157376/1280726623414390805/1555420454536093719), [Discord 11](https://discord.com/channels/462663954813157376/1280726623414390805/1555420689949925387), [Discord 12](https://discord.com/channels/462663954813157376/1280726623414390805/1555421085980303443), [Discord 13](https://discord.com/channels/462663954813157376/1280726623414390805/1555421383964762143), [Discord 14](https://discord.com/channels/462663954813157376/1280726623414390805/1555421707362242561)

## Mac control tools must survive restart and sleep

hieuvd is building Continuo, a Mac control app, after pausing a separate database project. The pain that started it: sharing a keyboard across machines gets tedious when every machine must be opened before control can begin. Continuo aims to keep control working through sleep and restart, even at the login screen.

Developer tools tend to fail in the transitions around the main workflow. iCloud continuity covers a fully awake, signed-in Mac, and the rough moments are wake, restart, OS update, and login. The thread also mentions a purchase before any download, which suggests interest and says nothing yet about retention.

Credit: hieuvd. Oct 5.

Sources: [Discord 1](https://discord.com/channels/462663954813157376/1284063844314120224/1556495921498296401), [Discord 2](https://discord.com/channels/462663954813157376/1284063844314120224/1556497460392632420), [Discord 3](https://discord.com/channels/462663954813157376/1284063844314120224/1556497602055250083), [Discord 4](https://discord.com/channels/462663954813157376/1284063844314120224/1556497858343997522), [Discord 5](https://discord.com/channels/462663954813157376/1284063844314120224/1556498080851959899), [Discord 6](https://discord.com/channels/462663954813157376/1284063844314120224/1556498234413813801), [Discord 7](https://discord.com/channels/462663954813157376/1284063844314120224/1556498546524688395), [Discord 8](https://discord.com/channels/462663954813157376/1284063844314120224/1556498657216565269)

## Reference video can shortcut character rigging

minhluuquang surfaced a workflow where a reference video is enough for Opus to separate a character, split the body into parts, and build a skeleton for motion work. The video acts as structured setup material instead of a passive visual guide.

If it holds up, a builder reaches motion experiments before hand-cutting every body part, which suits small game, mascot, and interaction prototypes. It stays a candidate until we run it on our own footage. Try one simple clip and one messy clip, and watch for occluded limbs, loose clothing, and fast camera motion.

Credit: minhluuquang. Oct 5.

Sources: [Discord 1](https://discord.com/channels/462663954813157376/1280726623414390805/1556562054494822462)

## Pick the launch surface before store paperwork

phucld suggested that distributing a game in Vietnam may be easier through the web. minhluuquang pointed at the risk of a fine before the game has proven it can earn money, and tieubao asked phucld to keep checking the store publishing path. The thread never verified the legal threshold, so treat it as a product question and take no fine amount as fact.

For a small team, distribution is architecture. A web build lets players try the game before anyone commits to store review, age rating, and payment setup. Choose the channel early and test the riskiest part first.

Credit: phucld, minhluuquang, huymaius, tieubao. Oct 7.

Sources: [Discord 1](https://discord.com/channels/462663954813157376/1280726623414390805/1556927016140275793), [Discord 2](https://discord.com/channels/462663954813157376/1280726623414390805/1556927429694455840), [Discord 3](https://discord.com/channels/462663954813157376/1280726623414390805/1556928546629222531), [Discord 4](https://discord.com/channels/462663954813157376/1280726623414390805/1556936048846700586), [Discord 5](https://discord.com/channels/462663954813157376/1280726623414390805/1556937272085979209), [Discord 6](https://discord.com/channels/462663954813157376/1280726623414390805/1557003031785246781)

## A landing page can be the first playable surface

Following the distribution question, tieubao said the team was reworking the Little Da Nang landing page with a hidden bar and small games, then shared the link. A playful page tests tone and retention hooks without an install. A static page can only collect clicks.

That fits the web-first path from the previous thread. Define the smallest signal worth measuring before store submission, such as repeat visits or shares. Keep the mini-games cheap to change so the page teaches the team and never becomes another product to maintain.

Credit: tieubao, phucld, minhluuquang. Oct 8.

Sources: [Discord 1](https://discord.com/channels/462663954813157376/1280726623414390805/1556927429694455840), [Discord 2](https://discord.com/channels/462663954813157376/1280726623414390805/1557333926526189581), [Discord 3](https://discord.com/channels/462663954813157376/1280726623414390805/1557368513369473054), [littledanang.oryzen.cloud](https://littledanang.oryzen.cloud/)

## Design the economy loop before monetization

A thread on an offline-to-online game build described players farming items, selling them back into the game economy, using resources to level up, and spending hardest once guild ranking turns competitive. monotykamary compressed the market side into one line: a game that wants recurring revenue needs an exchangeable marketplace.

Any marketplace or community product hits the same problem. Activity turns into revenue only when the loop creates scarcity and status that bring players back. The team also discussed seeding into existing fandom groups, an offline App Store wrapper if online compliance blocks launch, and older role-playing game communities that already know multi-account farming and guild competition.

Credit: bievh, tieubao, monotykamary, datnguyennnx. Oct 9.

Sources: [Discord 1](https://discord.com/channels/462663954813157376/1280726623414390805/1557729945319506100), [Discord 2](https://discord.com/channels/462663954813157376/1280726623414390805/1557730597198364704), [Discord 3](https://discord.com/channels/462663954813157376/1280726623414390805/1557730763598733353), [Discord 4](https://discord.com/channels/462663954813157376/1280726623414390805/1557730884495482982), [Discord 5](https://discord.com/channels/462663954813157376/1280726623414390805/1557730926216224811), [Discord 6](https://discord.com/channels/462663954813157376/1280726623414390805/1557731390340993035), [Discord 7](https://discord.com/channels/462663954813157376/1280726623414390805/1557732258486685707), [Discord 8](https://discord.com/channels/462663954813157376/1280726623414390805/1557732412979413024), [Discord 9](https://discord.com/channels/462663954813157376/1280726623414390805/1557734053598470305), [Discord 10](https://discord.com/channels/462663954813157376/1280726623414390805/1557734439016996955), [Discord 11](https://discord.com/channels/462663954813157376/1280726623414390805/1557734785626144829), [Discord 12](https://discord.com/channels/462663954813157376/1280726623414390805/1557934163825393675), [apps.apple.com](https://apps.apple.com/us/app/underguild-offense/id6752882356), [ezyplatform.com](https://ezyplatform.com/blog/huong-dan-dang-ky-chi-phi-phat-hanh-game-online-tai-viet-nam)

## Compositing makes AI video experiments cheaper

monotykamary shared an AI video experiment and unpacked its stack: h3 for the app layer, max for feedback loops, and Modal for rendering and compositing. The last experiment cost about $50 for three minutes of output, and the cost drops when more of the work moves into compositing instead of fresh generations.

Pipeline design moves the bill more than model choice does. Feedback loops, reusable layers, and batch rendering are engineering decisions for demos, marketing assets, and simulations. Track cost per minute across a small batch of runs, since one impressive clip proves little.

Credit: monotykamary. Oct 10.

Sources: [Discord 1](https://discord.com/channels/462663954813157376/1284063844314120224/1558036401042235473), [Discord 2](https://discord.com/channels/462663954813157376/1284063844314120224/1558036629254447256), [Discord 3](https://discord.com/channels/462663954813157376/1284063844314120224/1558037429577850882), [Discord 4](https://discord.com/channels/462663954813157376/1284063844314120224/1558037607819124760), [Discord 5](https://discord.com/channels/462663954813157376/1284063844314120224/1558037700077162579), [fixupx.com](https://fixupx.com/GaryLau0101/status/2108121004614857197)

## Sort prototype feedback by layer

A thread on Lobshot, a playable browser game prototype, split feedback in two. tieubao flagged what blocks a first session: lobby state, countdown timing, and the wind angle reference. tuanddd pushed the longer loop: background music, campaign bulletins, referral rewards, rank progression, and an extra resource for items or weapon gems. The thread also raised naming risk and visual identity.

Mixing the layers too early hides the real blocker. A wizard hat reward means nothing if the first minute is unclear. Tag each piece of feedback as first-session clarity, core-loop feel, retention, or distribution, and fix the first two before adding systems. Treat catalog approval for the name as a launch constraint, and compare seeding channels against retention instead of group size.

Credit: tuanddd, tieubao, bievh, hieuvd. Oct 12.

Sources: [Discord 1](https://discord.com/channels/462663954813157376/1280726623414390805/1558850925412749344), [Discord 2](https://discord.com/channels/462663954813157376/1280726623414390805/1558854370404339803), [Discord 3](https://discord.com/channels/462663954813157376/1280726623414390805/1558854698906157109), [Discord 4](https://discord.com/channels/462663954813157376/1280726623414390805/1558854859166326901), [Discord 5](https://discord.com/channels/462663954813157376/1280726623414390805/1558855357575471235), [Discord 6](https://discord.com/channels/462663954813157376/1280726623414390805/1558861526449000582), [Discord 7](https://discord.com/channels/462663954813157376/1280726623414390805/1558861876916396054), [Discord 8](https://discord.com/channels/462663954813157376/1280726623414390805/1559029936440737845), [Discord 9](https://discord.com/channels/462663954813157376/1280726623414390805/1559041089992786001), [Discord 10](https://discord.com/channels/462663954813157376/1280726623414390805/1559052176599425045), [Discord 11](https://discord.com/channels/462663954813157376/1280726623414390805/1559052379716976742), [Discord 12](https://discord.com/channels/462663954813157376/1280726623414390805/1559063519989735487)

## Turn dead time into play in turn-based games

The thread opened with ideas for a Gunbound-style game: stronger weapon effects, story mode, new maps, and unlockable weapons. tieubao moved it to the core loop. In a match of length T with N players, each player is active for roughly T/N unless the game gives them something to do off turn.

That reframes retention as less dead air between turns and after death. Wrap bots as story mode so early matches double as tutorial. Give waiting players a defensive action such as a shield, or a bounded ghost mode, so living players never feel punished by dead ones. Test each of those against measured waiting time.

Credit: tieubao, tuanddd, datnguyennnx. Oct 13.

Sources: [Discord 1](https://discord.com/channels/462663954813157376/1280726623414390805/1559399374247821313), [Discord 2](https://discord.com/channels/462663954813157376/1280726623414390805/1559403363660071057), [Discord 3](https://discord.com/channels/462663954813157376/1280726623414390805/1559403449630588942), [Discord 4](https://discord.com/channels/462663954813157376/1280726623414390805/1559404156224274493), [Discord 5](https://discord.com/channels/462663954813157376/1280726623414390805/1559404273681309800), [Discord 6](https://discord.com/channels/462663954813157376/1280726623414390805/1559404414811377675), [Discord 7](https://discord.com/channels/462663954813157376/1280726623414390805/1559404642129940604), [Discord 8](https://discord.com/channels/462663954813157376/1280726623414390805/1559404681988542537), [Discord 9](https://discord.com/channels/462663954813157376/1280726623414390805/1559405277433036923), [Discord 10](https://discord.com/channels/462663954813157376/1280726623414390805/1559405785124048897)

## Filter generated breadth before it becomes scope

In a thread on a small browser game prototype, tuanddd noted that it already had hooks for daily quests, level ranking, seasonal events, limited items, event scheduling, metrics, and gift codes. Nobody had yet simulated how long progression takes before max level. tieubao pushed to make the system complete first, then choose what to keep, and to study why older projectile games failed.

AI widens the design surface fast and leaves the filtering to people. The same pattern shows up in internal tools and client prototypes, where agents produce full-looking systems before anyone proves the loop. Define the smallest playable loop, simulate progression or workload, and keep a cut list next to the generated feature list.

Credit: tuanddd, tieubao, bievh. Oct 14.

Sources: [Discord 1](https://discord.com/channels/462663954813157376/1280726623414390805/1559594542087274557), [Discord 2](https://discord.com/channels/462663954813157376/1280726623414390805/1559596627977699459), [Discord 3](https://discord.com/channels/462663954813157376/1280726623414390805/1559597232469311549), [Discord 4](https://discord.com/channels/462663954813157376/1280726623414390805/1559597363205771399), [Discord 5](https://discord.com/channels/462663954813157376/1280726623414390805/1559597698854817943), [Discord 6](https://discord.com/channels/462663954813157376/1280726623414390805/1559597749870010390), [Discord 7](https://discord.com/channels/462663954813157376/1280726623414390805/1559597862642262067)

## Start overpowered, then lose it

While the thread discussed a game's visual update, tuanddd proposed opening with the player at full power: a celestial figure with complete equipment and magic who causes havoc and is cast down to restart as an ordinary level-one character.

The fall gives the familiar level-one reset an explicit narrative cause, and the prologue shows the destination before normal progression begins. Prototype a short playable prologue, decide which power or item survives the fall, and compare it with a cutscene-only version. Reject the idea if players read the reset as punishment.

Credit: tuanddd. Oct 16.

Sources: [Discord 1](https://discord.com/channels/462663954813157376/1280726623414390805/1560530413175312536), [Discord 2](https://discord.com/channels/462663954813157376/1280726623414390805/1560507981802766488), [Discord 3](https://discord.com/channels/462663954813157376/1280726623414390805/1560509347967148065)

## Give expiring model credits a routing plan

minhluuquang flagged a Claude plan credit and suggested using it with pi, omp, or Hermes. zlatanpham asked whether the credit carries over and suggested spending the remainder before the next reset. Credit expiry works as a deadline for a focused agent-tool trial.

A short window helps compare routing choices only if the team fixes the task, the expected output, and the stop condition first. Otherwise the credit disappears and leaves no evidence for the default setup. Verify the terms, reset date, and eligible usage, then compare the credited model against the current default on the same inputs.

Credit: minhluuquang, zlatanpham. Oct 17.

Sources: [Discord 1](https://discord.com/channels/462663954813157376/1280726623414390805/1560932258582634497), [Discord 2](https://discord.com/channels/462663954813157376/1280726623414390805/1560932736766574613), [Discord 3](https://discord.com/channels/462663954813157376/1280726623414390805/1560932932070285357)
