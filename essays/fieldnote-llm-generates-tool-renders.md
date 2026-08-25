---
draft: true
title: "We stopped asking the model to draw"
description: "Building fieldnote, a diagram tool for our memo posts, taught us to split the job: the LLM writes the drawing, a dumb tool renders it. That split is what makes an AI-made diagram trustworthy and on-brand."
date: 2026-08-25
authors:
  - tieubao
tags:
  - ai
  - tooling
  - writing
  - craftsmanship
slug: fieldnote-llm-generates-tool-renders
---

# We stopped asking the model to draw

![The LLM generates, the tool renders: a topic feeds the LLM, which picks an archetype and writes draw() JS; fieldnote renders it deterministically to SVG or PNG; a taxonomy feeds the archetype choice.](assets/fieldnote-fig1-pipeline.svg)

_Fig. 1. The split that made it work. The model writes the drawing; the tool only renders it._

I wanted our memo posts to carry the hand-drawn diagrams you have seen on this site, without me opening Excalidraw for each one. My first instinct was the obvious one: ask the model to generate the image. I doubted it out loud, because a model that redraws a picture from scratch every time gives you a different picture every time, and none of them look like ours.

So we built the tool the other way around. The model does not draw. It writes a short program that describes the diagram, and a small deterministic tool renders that program the same way every run. The tool cannot invent; it only draws what it was told, in our house style. That is `fieldnote`, and the split is the whole idea.

## Why the split is the point

A rendered diagram from a model is a slot machine. Same prompt, new pixels, off-brand half the time. Move the generation up into code and two things change. The output is reproducible: the same input yields the same bytes, which is how we caught our own regressions. And the style is fixed in the renderer, so every diagram inherits the house strokes and palette for free.

The receipt is boring and exact. Our example diagram renders to a PNG of 108,675 bytes. It stayed 108,675 bytes across a security refactor, a new drawing helper, and a font change. When a refactor is supposed to change nothing, a byte-identical render proves it changed nothing. A model-drawn image gives you no such handle.

## What the model still does

The model reads the topic and writes the drawing that fits its shape. We gave it a taxonomy for the deciding part: a table that maps a topic's shape to a diagram archetype. A process becomes a flowchart; a comparison becomes a matrix. The model consults the table, copies the nearest example, and fills in the real content. Generation stays dynamic, and the taxonomy keeps the choice consistent instead of ad hoc.

## The dead end, so you can skip it

We wanted Vietnamese labels, and the default hand font could not render them. I measured it before believing it: 2 of the 90 precomposed Vietnamese letters, and none of the tone marks. A fuller subset was never going to help, because the glyphs are simply not in that font. We swapped in a different hand font behind a flag, one that carries all 90 letters. The lesson we are keeping: check the coverage before you plan the fix.

One more scar worth naming. Headless Chrome writes the screenshot and then never exits, and a scale flag we tried hangs it outright. The tool now backgrounds the browser, waits for the file, and kills it. If you build anything that renders through headless Chrome, expect this.

## Where it leaks

The tool renders; it does not judge. A blank diagram passes every "is the file valid" check, so an empty drawing can ship green. We only found this because a fresh review pass looked for it, and now a broken drawing paints a visible error instead of a clean blank. The taxonomy is also ours, not a law: a topic with a shape the table does not name still needs a human to add the row. And the hand-drawn look is a choice with a cost. It reads as honest and personal on a blog; a formal venue may read it as unfinished.

## How to reproduce the thinking

When you want a model to make an artifact you will reuse, ask what part must be consistent and move that part into code. Let the model generate the variable part and let a dumb tool render the fixed part. Write down the choice the model has to make, so it makes the same one twice. Then keep a boring, exact receipt, a byte count, a checksum, a fixed test, so you can tell when a change that should do nothing actually did nothing.
