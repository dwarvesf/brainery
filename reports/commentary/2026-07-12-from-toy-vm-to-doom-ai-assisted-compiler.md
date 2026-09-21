---
draft: true
title: 'From toy VM to Doom: what AI-Assisted compiler engineering actually looks like'
description: Maxime Chevalier-Boisvert used Claude Opus 4.8 to build a clang backend for her custom bytecode VM (UVM), compiled Doom from source, and got it running at 86 FPS, up from an initial 27 FPS
date: 2026-07-12
authors:
  - never__settle
  - maximecb (Maxime Chevalier-Boisvert)
tags: ai, compiler, vm, clang, doom, vibe-coding
slug: 2026-07-12-from-toy-vm-to-doom-ai-assisted-compiler
---

## TL;DR

Maxime Chevalier-Boisvert used Claude Opus 4.8 to build a clang backend for her custom bytecode VM (UVM), compiled Doom from source, and got it running at 86 FPS, up from an initial 27 FPS. The whole port took about an hour of AI-assisted work, plus a few days for the backend itself. It is a rare example of "vibe coding" producing something that sits at the intersection of compiler engineering, systems programming, and retro computing, with receipts.

## The starting point: a half-finished VM

Back in early 2023, Chevalier-Boisvert started UVM, a minimalistic stack-based bytecode virtual machine with floating-point support, multi-threading, and simple framebuffer/audio APIs. She documented the progress on her blog, then shelved it. Like many hobby projects, it sat unfinished until the recent wave of agentic AI tools made her wonder what was now possible.

The biggest weakness of UVM was its toolchain. You either wrote assembly by hand or used `ncc`, a toy C compiler she wrote herself. The name stands for "not a C compiler," and the limitations showed. Existing software could not be compiled out of the box.

## The core problem: Clang does not target VMs

The natural thought was: add a clang backend. Clang is designed for physical hardware, register files, sub-registers (AX, EAX, RAX on x86). A stack-based bytecode VM is a mismatch. Clang backends are also non-trivial engineering work.

The workaround: skip the backend and consume textual LLVM IR directly. Clang can emit LLVM IR as text. If you can parse it and translate it to your VM's bytecode, you get a compiler without writing a full backend.

## The AI assist: 20 minutes for a parser

Chevalier-Boisvert compiled PureDOOM (a single-header Doom implementation designed for easy porting) with clang and dumped the LLVM IR. The problem was parsing it in Rust. The two available crates were either a full LLVM dependency (massive) or a pure-Rust parser that was already out of date for clang 21.

She asked Claude Opus 4.8 to write a textual LLVM IR parser in Rust. It took about 20 minutes. The code looked good enough to build on. Over a few more days, she built out a backend/wrapper that supports most of the C standard library and a pthread-compatible threading API.

The main weakness: the parser is sensitive to the installed clang version. LLVM IR is not guaranteed stable across releases.

## The Doom port: one hour, then optimization

At a StartupFest hackathon, she decided to try the full experiment: compile Doom for UVM. With Claude Code, the port took just over an hour to get running. Initial performance: ~27 FPS on a MacBook Air M5. Playable, but underwhelming for a game originally designed for a 486.

Optimization rounds brought it to ~86 FPS. Two notable wins:

1. **Palette lookup table**: modified PureDOOM to use a lookup table instead of computing palette indices on the fly.
2. **Memcpy row copies**: improved framebuffer upsampling to copy entire pixel rows with `memcpy` rather than writing individual pixels repeatedly.

She also used Fable to generate a MIDI synth so the soundtrack plays, because "the game is not the same without it."

The result is open source: [uvm-doom](https://github.com/maximecb/uvm-doom).

## What this actually means

This is not a "AI will replace engineers" story. It is a "AI changes what a single engineer can prototype in a week" story. The hard parts (parsing LLVM IR, understanding UVM's instruction set, optimizing framebuffer code) still required domain expertise. The AI accelerated the parts that were tedious but well-scoped: parser boilerplate, API wiring, iteration loops.

The project also raises a real engineering question: should UVM move from a stack-based to a register-based instruction set? Stack-based interpreters are intuitive and good teaching tools, but they leave performance on the table. If you are building a VM today, this is worth weighing.

## Sources

- Original blog post: https://pointersgonewild.com/2026-07-07-building-a-clang-backend-and-porting-doom-to-my-custom-bytecode-vm/
- UVM Doom repository: https://github.com/maximecb/uvm-doom
- UVM repository: https://github.com/maximecb/uvm
- PureDOOM: https://github.com/Daivuk/PureDOOM
- Discord message link (original share): https://discord.com/channels/462663954813157376/1284063844314120224/1525521262594756628

## Open questions

- How stable is the LLVM IR parser across clang versions in practice? The author notes sensitivity but has not quantified the breakage surface.
- Would a register-based instruction set actually yield meaningful gains for UVM's use cases, or is the stack-based design a deliberate simplicity/performance tradeoff?
- How much of the performance gap between 27 FPS and 86 FPS came from the PureDOOM modifications versus UVM-level optimizations? The breakdown is not detailed.

## Residual risk

- The "MacBook Air M5" detail is taken from the blog post at face value. This is an unreleased/future Apple Silicon SKU in our current timeline. The post itself may be partially speculative or the author may be using pre-release hardware. This does not affect the technical claims but is worth noting if we want to cite the hardware baseline.
- The project is a hobby/experimental effort. Performance numbers should not be compared against production compilers or VMs.
