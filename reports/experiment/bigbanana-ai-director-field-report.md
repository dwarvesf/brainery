---
draft: true
title: 'BigBanana AI director: keyframe-driven video as an industrial workflow'
description: 'A look at shuyu-labs/BigBanana-AI-Director, a source-available AI short-drama platform that replaces single-shot ''draw-card'' generation with a script-to-asset-to-keyframe pipeline for shot control and character consistency.'
date: 2026-09-03
authors:
  - content-editor
tags:
  - ai-video
  - keyframes
  - generative-workflow
  - ai-agents
  - tooling
slug: bigbanana-ai-director-field-report
---

## BigBanana AI director: keyframe-driven video as an industrial workflow

Most text-to-video tools still work like slot machines: you type a prompt, pull the lever, and hope the shot matches the one in your head. BigBanana AI Director (GitHub: `shuyu-labs/BigBanana-AI-Director`, roughly 1.7k stars since January 2026) is an attempt to replace that loop with something closer to an animation studio pipeline: script first, assets second, keyframes third, and only then the video. The README describes the approach as "Script-to-Asset-to-Keyframe", aimed at AI short dramas and motion comics. It is worth a look even if you never touch the tool, because it is a concrete answer to the two problems every AI video pipeline hits: shot control and character consistency.

## The workflow: script, assets, keyframes, delivery

The project is organized as five phases instead of one generation call:

1. **Narrative planning**: an outline, novel excerpt, or episode idea is turned into a structured screenplay with roles, scenes, props, and shots. A "full-auto plan review" step shows the whole production scheme up front, and lets you pick, per shot, between a nine-grid storyboard path and a start/end-frame path before anything is generated.
2. **Consistency assets**: characters get a standard reference image ("定妆照") plus a wardrobe system for multiple looks; scenes and reusable props become their own prompt, reference image, and shape references. Missing assets can be batch-generated in one pass.
3. **Shot workbench**: a grid manages every shot with its narrative action, character, scene, and prop context. Start and end frames can be generated, uploaded, inherited, and edited; a nine-grid preview offers 9 candidate camera angles so you can confirm composition before committing.
4. **Delivery center**: a timeline editor for reordering, trimming, filters, and export checks; exports master video, clip packages, or raw sources for Premiere/Resolve; episode-level backup for migration.
5. **Prompt management**: central search and edit across template, character, scene, prop, keyframe, and video prompts, with version rollback so instability can be traced upstream.

## Keyframe-driven generation

The design decision at the core is borrowed from animation, and it is the interesting part. Plain text-to-video struggles to control camera movement and exact start/end states. BigBanana instead:

- generates a precise **start frame** and **end frame** for each shot,
- interpolates the movement between the two frames (the README cites Veo-class models for the interpolation),
- constrains all image generation with the character's reference sheet and the scene concept art, so faces and sets do not drift mid-shot.

This "先画后动" (draw first, move later) framing is a clean separation of composition from motion, and it is the pattern most worth stealing for any AI video pipeline that needs reproducible shots.

## Consistency as an asset problem

Character drift is usually solved with prompt engineering, which is fragile. Here it is solved as an asset problem: a stable reference image, a wardrobe catalog, reusable scene and prop assets, and worldview anchors (map, regions, locations, music style) that get injected into later narrative, asset, and shot generation. Whether the enforcement actually holds is unverified, but the architecture is the right shape: consistency lives in a graph of references, not in one long prompt.

## Distribution and licensing: check before adopting

- The public repo no longer tracks the live source. Per the README, recent versions ship only as an official Docker image due to unattributed copying; the GitHub repository keeps documentation, `docker-compose.yaml`, and historical reference. Full source is delivered to commercial licensees only.
- License is CC BY-NC-SA 4.0: ok for personal and non-commercial use, requires commercial authorization otherwise.
- Model access is routed through the AntSK API aggregator (text, image, and video models behind one OpenAI-compatible interface). Pricing claims (e.g. sub-official pricing, 99.9% SLA) are vendor-stated and unverified.
- Project data is stored mainly in the local browser environment, aimed at individual creation and light collaboration.

## Limitations worth knowing

- Every capability claim above is vendor-authored from the README; there are no independent benchmarks, and the repo is open in documentation only, so code-level verification is not possible from the public repository.
- Output quality is bounded by the models you route through. The pipeline's structure helps planning and consistency, but a weak video model still yields weak footage.
- Documentation is Chinese-first (Chinese, English, and Japanese READMEs exist; the interface is Chinese-oriented).
- The vendor's own notes push back on any expectation of "permanent free" usage, which is worth reading as a product-context signal.

## Why it matters

Even if short-drama production is not your domain, the pipeline generalizes for generative media teams: structure generation around asset references and explicit start/end states instead of one-shot prompting; treat consistency as a first-class asset graph rather than a prompt hack; insert a human reviewable plan step before tokens are spent. That is the part worth taking away.

## Sources

- Shared by 0xm on Discord: https://discord.com/channels/462663954813157376/1284063844314120224/1544712049119199373
- GitHub repository: https://github.com/shuyu-labs/BigBanana-AI-Director

## Open questions

- The repo no longer tracks live source, so code review and independent benchmark verification are impossible from the public surface.
- Exactly how the start/end frame pair is fed to interpolation models, and which model names actually run in production, is README-stated only.
- Docker-image deployment means reproducible self-hosting without the vendor image is unverified.
- Multi-user collaboration limits and import/export scope beyond "browser-local" are not detailed.

## Residual risk

This draft rests on a single vendor README plus GitHub metadata (stars, forks, license, creation date). Structure claims are verified from the fetched page; quality claims ("fully automatic from a sentence", "precise control", API SLA and pricing) are vendor-stated and unverified. Notes should emphasize the workflow pattern, not the product's marketing claims, and keep the "source-available but docker-only distribution" caveat up front.
