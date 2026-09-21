---
draft: true
title: 'XiaoZhi ESP32: When MCP Meets Voice AI on a $5 Chip'
description: This morning, 0xm dropped a link in #build-club with a casual note: he spotted a Facebook group of people actively building XiaoZhi ESP32 devices
date: 2026-07-12
tags:
  - ai-hardware
  - esp32
  - mcp
  - voice-ai
  - open-source
slug: xiaozhi-esp32-field-report
---

## What 0xm Found

This morning, 0xm dropped a link in #build-club with a casual note: he spotted a Facebook group of people actively building XiaoZhi ESP32 devices. The repo behind it, [78/xiaozhi-esp32](https://github.com/78/xiaozhi-esp32), sits at **28k stars** and **6.3k forks** as of July 2026. That is not a niche side project; that is a community.

## What It Is

XiaoZhi is an open-source voice AI chatbot that runs on ESP32 microcontrollers. Think of it as a smart speaker you can build yourself, but one that speaks Chinese, English, and Japanese, wakes up to offline voice commands, and pipes everything through modern LLMs like Qwen or DeepSeek.

The architecture is straightforward but well-executed:

- **Offline wake word** detection via ESP-SR
- **Streaming ASR + LLM + TTS** for real-time conversation
- **OPUS audio codec** for efficient compression
- **Dual transport**: WebSocket or MQTT+UDP
- **Speaker recognition** to know who is talking

## The MCP Angle

What makes XiaoZhi stand out from other voice assistant firmware is its use of the **MCP (Model Context Protocol)**. On the device side, MCP controls hardware — speakers, LEDs, servos, GPIO pins. On the cloud side, MCP extends the LLM's reach into smart home control, desktop automation, email, and knowledge search.

MCP is usually discussed in the context of desktop AI agents and IDEs. Seeing it on a $5 ESP32 chip is a signal that the protocol is maturing beyond demos and into real embedded deployments.

## Hardware Ecosystem

The project supports **70+ open-source hardware boards**, from breadboard-friendly modules to polished commercial kits:

- Espressif ESP32-S3-BOX3
- M5Stack CoreS3 / AtomS3R
- Waveshare ESP32-S3-Touch-AMOLED
- LILYGO T-Circle-S3
- SenseCAP Watcher
- And dozens more from the Chinese maker community

This breadth matters. It means the firmware is not locked to one vendor's dev kit; it is a genuine platform.

## Self-Hosting Options

If you do not want to use the official xiaozhi.me cloud service, the community has built alternative servers in Python, Java, and Go. The firmware itself is MIT-licensed and flashable without setting up a full ESP-IDF environment, which lowers the barrier for hobbyists.

## Why We Care

Voice AI on microcontrollers has been "almost ready" for years. XiaoZhi feels like the first open-source stack where the pieces actually fit: cheap hardware, offline wake words, streaming LLM inference, and a protocol (MCP) that lets the AI actually *do* things. The 28k stars suggest a lot of people agree.

If you are in Hanoi or Saigon and want to build something tangible with AI, this is a solid weekend project. The Facebook groups 0xm found are proof that people are already doing it.

## Sources

- [Discord message, #build-club, 2026-07-12](https://discord.com/channels/462663954813157376/1280726623414390805/1525779959745085530)
- [78/xiaozhi-esp32 on GitHub](https://github.com/78/xiaozhi-esp32)
- [XiaoZhi documentation](https://xiaozhi.dev/en/docs)
- [Adafruit coverage, June 2025](https://blog.adafruit.com/2025/06/09/xiaozhi-esp32-is-an-mcp-based-chatbot)
