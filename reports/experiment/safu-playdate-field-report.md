---
draft: true
title: 'SAFU: Building a crank-native Playdate game with Claude as the solo dev'
description: 'A community builder (vincent.console) spent a few days in early September building SAFU, a Playdate game about cracking safes with the crank, using Claude Opus 5 as effectively the entire development …'
date: 2026-09-27
slug: safu-playdate-field-report
---

## SAFU: Building a crank-native Playdate game with Claude as the solo dev

A community builder (vincent.console) spent a few days in early September building SAFU, a Playdate game about cracking safes with the crank, using Claude Opus 5 as effectively the entire development team. The game is a short prototype, but the method is the story: the whole build, including the failed attempts and the performance numbers, is documented in a public repo with a design spec that the agent is forced to keep in sync with the code.

## The game

SAFU is a one-mechanic Playdate game. The player cranks a safe dial, finds three sweet spots in alternating directions, and pulls the handle before the three-minute timer runs out. Each run rolls three random modifiers (blackout, guard, too loud, and friends) that change how the dial behaves. The whole screen is the safe door: timer plate, dial well, and modifier plates drawn as one surface.

The design bar is feel, not content. From the spec: "The prototype succeeds if simply turning the crank for a few minutes feels satisfying." Slow rotation should give mechanical detents, fast rotation a satisfying rip, and a graze must be instantly distinguishable from a hit. The author's stated design question is not "is there enough content?" but "does turning this dial feel good?"

## How it was built

The interesting part is the workflow, because the author explicitly does not know the Playdate SDK. `CLAUDE.md` in the repo sets the agent up as the game designer: read `game.md` before any gameplay change, keep the spec and the code in sync, deploy to the connected device after every iteration without waiting for confirmation, and keep simulator hygiene (screenshots for debugging, close one simulator before launching the next). The repo also curates the reference material the agent should use: the Ditherpunk explainer, Playdate art guides, icon and font registries built for the device, and a comic-panel library.

The key discipline is the living spec. `game.md` is 56 KB and is the source of truth for the concept, the core rules, the tuning constants, and the screens. The instruction is explicit: "Always update game.md in the same pass as any change to the game... it must never describe a build that no longer exists." That turns the design document into a contract between the human and the agent, and it is what makes the repo readable as a record of the process rather than just a pile of commits.

The repo is the receipt. First commit September 1, steady "progress" commits through September 4, a compiled `Safu.pdx`, art, fonts, sound FX, and a 56 KB spec that documents what changed and why. Failed ideas are in there too: a planned intro sequence using Neko IP as the main character was abandoned because, in the author's words, Claude Code image generation was "so ass." The write-up links to the prompt sessions where the core mechanic and the modifiers were discussed with the model.

## Engineering notes from the spec

The spec records one real performance pass. The whole frame was 44.32 ms (22 fps); after the fix it is 15.70 ms (50 fps). The cost was three concave-polygon modifier cards plus pure-Lua text layout (`drawTextInRect`, `getTextSizeForMaxWidth`) re-run every frame. The fix: bake everything static (the door, the dial well, the timer plate chrome, the modifier cards) into a background image once at `startGame()`, and leave only the rotating dial, timer digits, and prompts live. The stated rule: "nothing static gets drawn per frame." The measurement method is also documented: wrap `pd.update` with `pd.resetElapsedTime()` / `pd.getElapsedTime()`, write the average to a file, and read it back from the device's data partition.

Crank tuning is exposed as constants. `DEG_PER_UNIT = 3.6` means one full crank revolution equals one dial revolution; sweet-spot tolerance is 4.4 dial units (about 7.9 degrees); the dial latches below 90 degrees per second and progress resets if it moves faster than 288 degrees per second. The device-deploy loop is a documented pipeline: `pdc`, `pdutil datadisk`, `rsync`, `diskutil eject`, `pdutil run`, including the gotchas that the Playdate port is always `cu.usbmodemPDU1_*` and that piping `pdutil` into `tail` hides its exit code.

## Why it matters

This is close to a repeatable recipe for agent-built software on constrained hardware, with receipts. Standing agent instructions, a forced-sync living spec, a simulator loop with screenshots, and an on-device deploy loop are all documented and public, and the failed attempts are preserved instead of scrubbed. Niche hardware is a good test bed for this: the scope is small, the feedback loop is crisp, and the Playdate's built-in record-to-GIF output (noted in the channel discussion) makes demoing cheap.

It also sanity-checks a common worry: that a fluent AI dev loop means nobody is steering the design. Here the human's job was design intent and taste (the crank should feel indispensable, the dial should feel physically attached), while the model handled SDK mechanics, iteration, and deployment. That division of labor, documented rather than claimed, is the useful takeaway.

## Open questions

- A release plan is not stated: no itch.io or Playdate Catalog listing was announced, so this may stay a prototype.
- Assets come from commercial-friendly sources (Pixabay, Uppbeat) per the write-up, but individual licence compliance was not verified.
- Whether this loop generalizes beyond a one-mechanic, three-day prototype is unknown; the spec itself argues the single-mechanic scope is exactly why iteration was fast.

## Sources

- Write-up with process detail and failed attempts: https://log.console.so/experiments/playdate-safu/
- Repo with spec, CLAUDE.md, source, and commit history: https://github.com/tuanddd/playdate-safu
- Agent instructions (CLAUDE.md): https://raw.githubusercontent.com/tuanddd/playdate-safu/master/CLAUDE.md
- Game spec (game.md, performance and tuning sections): https://raw.githubusercontent.com/tuanddd/playdate-safu/master/game.md
- Demo video share by the author: https://x.com/vincentzepanda/status/2095809683240198418
- Channel share and hardware sponsorship thank-you: https://discord.com/channels/462663954813157376/1280726623414390805/1545355672734928940
- Record-to-GIF note: https://discord.com/channels/462663954813157376/1280726623414390805/1545366236660113429
- Interaction suggestion (tagging): https://discord.com/channels/462663954813157376/1280726623414390805/1545366376804253726

## Residual risk

This is the author's own account of the process, and we did not run the game or reproduce the numbers; the 22-to-50 fps figures come from his spec. The write-up is intentionally jokey in tone, which makes it easy to misread the engineering content as unserious. The repo and posts are personal and could be renamed or removed. No client or commercial details are involved, and no claims here depend on unverifiable revenue or traction numbers.
