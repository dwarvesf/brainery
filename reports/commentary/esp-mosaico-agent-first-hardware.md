---
title: "ESP-Mosaico: a $59 board whose first user is the coding agent"
description: "A buyer's read of Espressif's new modular AI board before it arrives, from its tiny battery to its agent-first software and the agents we plan to build on it."
date: 2026-11-12
toc: true
authors:
  - tieubao
tags:
  - "commentary"
  - "hardware"
  - "espressif"
  - "ai"
  - "agents"
slug: esp-mosaico-agent-first-hardware
type: writing
form: analysis
topic: ai-agents
secondary_topics:
  - product-engineering
fit: 2
draft: false
---

## TL;DR

Espressif shipped ESP-Mosaico [7] in October 2026. It's a palm-sized, modular dev board on its new ESP32-S31 chip, with a touch screen, a speaker, a mic, a camera module and an app store, for $59. I ordered one this week, so this is a buyer's read of the public material, written before the board is on my desk. My verdict: ==buy it as a desk device that an agent programs for you, and treat the battery as a convenience.== The built-in cell is 65 mAh, and one reviewer drained it in about 29 minutes. The interesting part is the software. Espressif ships a Claude Code workspace, an on-device agent runtime that talks to Claude and speaks [MCP](#ref-1) in both directions, and a store that installs apps with a six-digit code. That stack is why we'll try to port our Playdate voice agent to it, along with two new agent ideas.

![The ESP-Mosaico core unit in one hand {#fig-hand}](assets/esp-mosaico-agent-first-hardware-photo-hand.jpg 'The ESP-Mosaico core unit in one hand. A 480 by 480 touch screen on a square body that fits between thumb and fingers.')

Image: Espressif, [store.mosaico.ai](https://store.mosaico.ai/products/esp-mosaico), product photo used for commentary.

## What arrives in the box

The $59 "Vision Combo Kit" on the official store [10] holds three parts: the core unit, a camera module and an interaction module. The core unit is two boards stacked on a 60-pin connector. The CoreBoard on top carries the chip and the screen. The BaseBoard below carries the speaker, the battery and two 20-pin headers, one on each side, where modules plug in.

The numbers come from Espressif's user guide [8] and CNX Software's launch write-up [9].

| Part | What it is |
| --- | --- |
| Chip | ESP32-S31, dual-core RISC-V at 320 MHz, plus a low-power core |
| Memory | 512 KB SRAM, 16 MB [PSRAM](#ref-2), 16 MB flash, 128 MB NAND |
| Screen | 2.16 inch touch, 480 by 480, OLED per Espressif's site |
| Audio | One mic, ES8311 codec, 3 W amplifier, speaker |
| Sensors | BMI270 IMU, two BMM150 magnetometers, vibration motor |
| Power | 65 mAh Li-ion, TP4057 charger, BQ27220 [fuel gauge](#ref-3), USB-C |
| Radios | Wi-Fi 6, Bluetooth 5.4, [Thread](#ref-4) and Zigbee, [Matter](#ref-5) per CNX |
| Camera module | 3.2 MP or 1 MP sensor by board revision, 1024 by 768 output |
| Interaction module | Light sensor, PIR motion sensor, IR LED, six RGB LEDs |

Espressif's own site also shows an 8 by 8 RGB LED matrix module [11], so the module list will grow.

![The $59 kit with its two modules {#fig-kit}](assets/esp-mosaico-agent-first-hardware-photo-kit.jpg 'The $59 kit with its two modules. The core unit, the camera module with its front-facing mode, and the bare interaction board.')

Image: Espressif, [store.mosaico.ai](https://store.mosaico.ai/products/esp-mosaico), product photo used for commentary.

Price is where launch week got messy. I-Programmer quoted a $40 reference price on 14 October and reported early units heading toward $100 [12]. Espressif's own AliExpress link listed it at $80.68, and resellers asked $117 and up. The official store sells it at $59 as a pre-order. Buy there.

## The battery question

The first thing I checked after ordering was the battery, because 65 mAh sounded like a typo. It isn't. The user guide states it twice: "The board supports a 3.7 V / 65 mAh Li-ion battery," mounted on the BaseBoard and charged at a rated 65 mA [8]. That's roughly the cell in one wireless earbud.

The only real-world number I found comes from The Embedded Rustacean's unboxing [13]. The reviewer unplugged the board at 2:12 PM with the screen, Wi-Fi and an agent session running, and by 2:41 PM it was nearly empty. Their advice: "treat it as a desk board with a battery, not a portable one." They also flag that the figure came from one session, not a controlled test.

Espressif's answer is a $15 battery module, and it doesn't take a side slot. The back of the core unit has seven gold pads labelled GND, BOOT, RST, RX, TX, 5V and GND, and the battery module has seven [pogo pins](#ref-6) on its top face that line up with them. The module shares the core unit's footprint, so the device becomes a thicker square block. It adds its own USB-C port and a threaded brass insert on one side that looks like a camera tripod mount.

![The back pads of the core unit {#fig-back}](assets/esp-mosaico-agent-first-hardware-photo-back.jpg 'The back pads of the core unit. Seven labelled contacts, the ones the battery module presses against.')

Image: Espressif, [store.mosaico.ai](https://store.mosaico.ai/products/esp-mosaico), product photo used for commentary.

![The $15 battery module {#fig-battery-module}](assets/esp-mosaico-agent-first-hardware-photo-battery.jpg 'The $15 battery module. Same footprint as the core unit, seven pogo pins on top, a resin 3D-printed shell in white or black.')

Image: Espressif, [store.mosaico.ai](https://store.mosaico.ai/products/esp-mosaico), product photo used for commentary.

What nobody has published is the module's capacity. Neither the store listing, the docs, nor any review I found gives a mAh figure. So the chart below is arithmetic on one measured point. The reviewer's run implies a draw of about 130 mA under heavy use. Divide total capacity by that and you get a rough runtime.

![Hours of heavy use per battery {#fig-battery}](assets/esp-mosaico-agent-first-hardware-fig5-battery.svg 'Hours of heavy use per battery. Only the built-in 65 mAh bar is a measurement. The module bars assume capacities Espressif has not confirmed.')

| If the module holds | Total with the built-in cell | Heavy-use runtime (estimate) |
| --- | --- | --- |
| 300 mAh | 365 mAh | about 2.8 hours |
| 500 mAh | 565 mAh | about 4.3 hours |
| 1,000 mAh | 1,065 mAh | about 8 hours |

Those numbers ignore conversion losses, and an idle screen with Wi-Fi off will run far longer. Nobody has measured that case yet. When the board arrives, the BQ27220 fuel gauge reports voltage, current and state of charge, so I'll replace this table with measured draw.

## The software is the product

Here's the part that made me order one. Most dev boards ship a pinout and a blink example. ESP-Mosaico ships a workspace for a coding agent.

![The ESP-Mosaico ecosystem {#fig-ecosystem}](assets/esp-mosaico-agent-first-hardware-fig6-ecosystem.svg 'The ESP-Mosaico ecosystem. Claude Code builds and pushes apps from the desktop, the store installs from the cloud, and ESP-Claw on the board talks to LLM APIs and other MCP peers.')

The pieces live on GitHub [14].

- **ESP-Claw**: an on-device agent runtime under Apache-2.0. It works as both an MCP client and an MCP server, calls Anthropic-style and OpenAI-style APIs (its README names Claude), and turns confirmed behaviours into local Lua rules so the board doesn't ask the model the same thing twice. It also runs on S3, P4 and C5 boards. It has 906 commits and no tagged release.
- **esp-mosaico-claw**: the factory firmware and the "Chat Coding" app, where you describe a change in chat and the board's agent writes it. Its install code is 100000.
- **esp-mosaico-vibe**: the desktop side of "Vibe Coding". It ships a Claude Code instruction file, an AGENTS file, skills and an MCP config, plus a `mosaico.py` CLI that creates a project, runs it in a simulator, builds it and pushes it to the board. The simulator means an agent can iterate before the board is even plugged in. Its MCP servers point at Espressif's docs and component registry, so the agent drives the board through the CLI.
- **esp-mosaico-utils**: the ESP-Iris gateway, a browser Web Workbench for watching a run, and the recovery firmware.
- **esp-mosaico-bsp** and **esp-mosaico-matter**: board drivers, and a Matter hub I haven't read yet.

Underneath sits ESP-IDF 6, which ships its own MCP server, `idf.py mcp-server`. It lets Claude Code set a target, build, flash and clean a project [15]. That's the escape hatch: if the app framework gets in the way, an agent can flash raw firmware and own the whole board.

Then there's the store. The software page lists 12 community "Ideas", each an app you install by typing a six-digit code on the device [11]. They range from Espressif's "Hello, Mosaico" tour to a network diagnosis toolbox, a DJ drum pad, a radio and a small racing game. One of them, [esp-mosaico-webcam](https://github.com/eMUQI/esp-mosaico-webcam), turns the board into a USB camera that macOS QuickTime picks up at 640 by 480. Only a few list a source repo. You need a mosaico.ai account to publish, and none to install.

Espressif's press release also names "ESP ZeroCode AI" as the engine behind Vibe Coding [16]. Its site shows a tagline and little else, so I'm leaving it out until there's something to read.

## Why Espressif sells a dev board

A dev board has no mass market, so why would a chip company build a polished one with an app store? The answer sits in how Espressif makes money. It sells chips and modules to device makers by the reel. A kit is a way to get engineers comfortable with a new chip before they pick one for a product.

![Why a chip company sells a $59 kit {#fig-funnel}](assets/esp-mosaico-agent-first-hardware-fig7-funnel.svg 'Why a chip company sells a $59 kit. The kit seeds developers and their agents, products follow, and chip orders are the payoff. This is our read, not a statement from Espressif.')

Everything in this section from here is our inference. Espressif hasn't said it in these words.

The S31 is new, and ESP-Mosaico is its showcase. The homepage says "Built for Prototypes" and "Ready for Products", and its examples are desk objects: a lamp on a table, a stock tracker on a desk [11]. If a team prototypes a voice gadget on Mosaico with an agent writing the firmware, the path of least resistance to a product is an S31 module.

There's a precedent. The ESP32-S3-BOX became a common target for the community Xiaozhi voice firmware, and Espressif now ships Xiaozhi on its own ESP-Hi toy robot [17]. A kit seeded a community, and the community seeded products.

What's different this time is who does the coding. ==Espressif is courting the coding agent as much as the engineer==, with instruction files for Claude Code, a simulator an agent can loop on, and an MCP server in the SDK. If agents get good at S31 first, the humans steering them will stay. The store adds a second hook: once people publish apps in the Iris format, the format has a reason to survive.

## The rest of the Espressif shelf

While checking Mosaico I went through Espressif's devkit list [18] for anything worth pairing with it. Prices are Espressif's sample prices or the cheapest distributor listing I found in November 2026, so check before ordering.

| Kit | Chip | Key hardware | Good for | Approx. USD |
| --- | --- | --- | --- | --- |
| ESP-Mosaico | S31 | Touch screen, IMU, mic, speaker, modules | Agent-written desk devices | 59 |
| ESP32-S31-Korvo-1 | S31 | Dual mics, LCD, camera, TF card | Voice and vision on S31 | 59 |
| ESP-VoCat | S3 | Round screen, dual mics, wake word | Always-listening voice | 40 |
| ESP32-S3-BOX-3 | S3 | LCD, mics, speaker | Xiaozhi or Home Assistant voice | 49 |
| ESP-SensairShuttle | C5 | Bosch air and motion sensing, LCD, mic | Sensing on dual-band Wi-Fi 6 | 50 |
| ESP32-P4X-Function-EV | P4 + C6 | 7 inch touch, MIPI camera, Ethernet | Wall dashboards, edge vision | 56 |
| ESP32-P4X-EYE | P4 | MIPI camera, LCD, mic | Small vision camera | 33 |
| ESP32-C5-DevKitC-1 | C5 | Dual-band Wi-Fi 6, Thread, Zigbee | Cheap starter | 15 |
| ESP32-C6 / H2 DevKit | C6 / H2 | Wi-Fi 6 plus Thread, or Thread only | Matter sensor nodes | 9 to 10 |

Two gaps stood out. Espressif has no game handheld kit, and Mosaico's single mic with no documented wake word makes the $40 VoCat the stronger pick for always-listening voice. DigiKey shows the P4X-EYE back in stock around January 2027.

## Three agents we want to put on it

We already run agents on odd hardware. Our Playdate voice client lets you hold the A button, talk, and hear the Hermes agent answer through a Rust bridge. It graduated from an experiment into its own product repo in October. Mosaico has what the Playdate lacks: a colour touch screen, a speaker, a camera and Wi-Fi 6. Here are the candidates, in the order I'd try them.

1. **Playdate agent port**: move the hold-to-talk loop onto Mosaico. Press, speak, release, and Hermes answers on the speaker with text on screen. The Rust bridge and the Hermes side stay as they are. Only the device client changes, and ESP-Claw's MCP server could let Hermes call the board's screen and vibration motor as tools.
2. **Orb, a concept**: an ambient desk agent you glance at, tap, or talk to. It shows one state at a glance, such as an incident, a deploy or a calendar block. A tap acknowledges it and a press opens a voice turn. It sits on the desk on USB-C, which is the use the battery numbers point to anyway.
3. **Kid explainer, a concept**: a child points the camera at something and asks what it is. The board sends the frame and the question to Claude and reads the answer back in a warm voice. Our rule for kid-facing AI applies: the agent has no name and no persona, just a voice that explains.

The Playdate port is the cheapest test of the whole stack, so it goes first. If the Mosaico CLI plus Claude Code can get a voice round trip working in an afternoon, the other two are worth building.

## What could go wrong

- **Nothing is released.** ESP-Claw and the four esp-mosaico repos have commits and no stable release tags. Expect breaking changes.
- **Privacy is unaddressed.** The mosaico.ai privacy policy says nothing about audio, camera or LLM data [19]. Espressif says logic that doesn't need online services runs locally, and ESP-Claw sends model calls to whichever provider you configure. For the kid explainer, our own firmware will call the Claude API directly and skip third-party store apps.
- **Voice hardware is thin.** One mic, and no wake word in anything I read. Fine for push-to-talk, weak for an always-listening assistant.
- **Hardware quirks.** The camera works only in the left slot. Five GPIOs are shared with the audio codec. The first flash may need manual download mode, holding BOOT while powering on. The USB-C port shuts off above 1 A of load. Two board revisions use different camera sensors and pin assignments [8].
- **One hands-on review so far.** The Embedded Rustacean's reviewer spent about two hours across two models and didn't get a working light meter app out of the agent [13].

Next step, once the board lands: run the simulator loop from Claude Code, read the fuel gauge to replace the battery estimates, and start the Playdate port. I'll write up what breaks.

## References

1. **MCP**: Model Context Protocol, an open protocol that lets an AI agent call tools and read data exposed by a server. An MCP client asks, an MCP server answers.
2. **PSRAM**: Pseudo-static RAM, extra memory beside a microcontroller's small on-chip SRAM, used for screen buffers, audio and app data.
3. **Fuel gauge**: A chip that measures a battery's voltage, current and remaining charge, so firmware can report battery life accurately.
4. **Thread**: A low-power mesh network protocol used by smart-home devices.
5. **Matter**: A smart-home standard that lets devices from different brands work together over Wi-Fi, Thread or Ethernet.
6. **Pogo pins**: Spring-loaded contacts that press against flat pads, so two parts connect without a socket.
7. **ESP-Mosaico**: Espressif's modular AI dev board, launched October 2026. [mosaico.ai](https://mosaico.ai/en).
8. **ESP-Mosaico user guide**: Espressif's hardware reference for the board. [User guide](https://docs.espressif.com/projects/esp-dev-kits/en/latest/esp32s31/esp-mosaico/user_guide_v1.0.html).
9. **CNX Software**: launch write-up with specs and module details, 21 October 2026. [ESP-Mosaico on CNX](https://www.cnx-software.com/2026/10/21/esp-mosaico-an-esp32-s31-based-modular-development-platform-for-ai-assisted-hardware-creation/).
10. **Mosaico store**: official listing for the kit and the battery module. [store.mosaico.ai](https://store.mosaico.ai/products/esp-mosaico).
11. **Mosaico software page**: the community Ideas store and install codes. [mosaico.ai/en/software](https://mosaico.ai/en/software).
12. **I-Programmer**: launch news with the reference price, 14 October 2026. [ESP-Mosaico news](https://www.i-programmer.info/news/91-hardware/19212-esp-mosaico-the-one-smart-development-board-you-need.html).
13. **The Embedded Rustacean**: the first hands-on unboxing. [Unboxing the ESP-Mosaico](https://blog.theembeddedrustacean.com/unboxing-esp-mosaico-chatcoding-vibecoding).
14. **esp-mosaico on GitHub**: the board's firmware, workspace and tools. [esp-mosaico organisation](https://github.com/esp-mosaico), with [ESP-Claw](https://github.com/espressif/esp-claw).
15. **ESP-IDF MCP server**: Espressif Developer Portal, April 2026. [ESP-IDF tools local MCP server](https://developer.espressif.com/blog/2026/04/esp-idf-tools-mcp-server/).
16. **Espressif press release**: the ESP-Mosaico announcement. [ESP-Mosaico release](https://www.espressif.com/en/news/ESP_Mosaico_Release).
17. **ESP Techpedia**: Espressif's LLM solution boards, including ESP-Hi. [LLM solutions](https://docs.espressif.com/projects/esp-techpedia/en/latest/esp-friends/solution-introduction/ai/llm-solution.html).
18. **Espressif devkits**: the official kit list with sample prices. [Devkits](https://www.espressif.com/en/products/devkits).
19. **mosaico.ai privacy policy**: the site's data policy. [Privacy policy](https://mosaico.ai/en/legal/privacy-policy).
