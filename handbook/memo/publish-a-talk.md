---
title: How to publish a talk on memo
description: A talk post puts each slide beside what you said over it, so a reader can skim the deck and still get your argument.
date: 2026-11-03
authors:
  - tieubao
tags:
  - memo
  - contributing
  - guide
slug: publish-a-talk
kind: playbook
draft: true
type: company
topic: company
layout: talk
image: /content/handbook/memo/assets/publish-a-talk/og.png
talk:
  deck: assets/publish-a-talk/deck.pdf
  source: assets/publish-a-talk/deck-src/
  ratio: "16:9"
  speaker: "Han Ngo"
---

This is a talk about the talk format, built in that format. Each slide below sits beside the words that go with it. Read the slides alone for the argument, or read the notes for the evidence. The deck is the reference implementation that [Contribute to memo](/contribute-to-memo) links to, so every file named here exists in this post's folder.

## Why a talk page

![Title slide: How to publish a talk on memo, by Han Ngo, CTO at Dwarves, with a sketch of a page that pairs each slide with its notes](assets/publish-a-talk/slides/slide-01.webp)

![Speaker profile: Han Ngo, backend and AI systems engineer and CTO at Dwarves, with what he built, what he works on now, and his links](assets/publish-a-talk/slides/slide-02.webp)

Every deck of mine opens with this slide, a habit from my 2019 decks: the audience should know who is talking before the argument starts. The slide is not hand-made. It reads one data file, the speaker file in the talk template, at every build, so a new role or link changes every deck on its next build. The photo is a headshot stored beside the deck source, so the slide never hotlinks it, and the memo note count is read live from my contributor page.

![Three cards compare a PDF deck, a recording and a talk page; only the talk page keeps both the slides and the words and stays skimmable](assets/publish-a-talk/slides/slide-03.webp)

A deck shared as a PDF keeps the bullets and drops the explanation that went with them, because that part was spoken. The recording has the explanation, but a reader who wants one number from minute 31 has to scrub for it. A talk page puts the slide and the spoken part side by side, and the reader scrolls to the number they want.

![A wide page with the slide on the left at 58 percent and the notes on the right at 42 percent, and a phone layout with the notes under the slide](assets/publish-a-talk/slides/slide-04.webp)

The layout comes from [Geoffrey Litt's talk page](https://www.geoffreylitt.com/2026/07/02/understanding-is-the-new-bottleneck.html): the slide on the left, the notes on the right, one segment per slide. On memo the grid is wider than the 704 pixel reading column, about 1,200 pixels, because a slide squeezed into the column is too small to read. That is the one place memo breaks its single-measure rule, and the media standard says so in writing.

## The files

![A folder tree: the post file, then assets with slides slide-01 to slide-13 as webp, deck.pdf, og.png and an optional deck-src folder](assets/publish-a-talk/slides/slide-05.webp)

Everything for a talk lives in one folder named after the post. The slides are webp rasters with a long edge of 1600 pixels at the deck's own ratio, 16:9, 16:10 or 4:3, and they stay under the 200 KB cap at quality 80. The PDF is the file people download and present from, so its page count must equal the slide count. After the merge, media-sync moves the rasters and the PDF to the storage bucket, and the site keeps serving them at the same address.

![The frontmatter block: layout talk and talk.deck are required; event, given, source and video are optional](assets/publish-a-talk/slides/slide-06.webp)

Only an explicit `layout: talk` turns the layout on. The deck path is the one required field under talk. Add where and when you gave it, a link to the editable source, and a YouTube id when there is a recording. Point the image field at og.png, or the share card falls back to the site default.

![A Markdown sample mapped to the parts it renders: a section heading, a slide image that starts a segment, the notes, and a rule that starts the outro](assets/publish-a-talk/slides/slide-07.webp)

There is no new syntax. A paragraph that holds only one slide image starts a segment, and everything after it, up to the next slide, the next section heading or the closing rule, is that slide's notes. Paragraphs before the first slide are the intro. A plain Markdown reader, a feed or an agent sees images and paragraphs in order, which still reads fine.

## Two ways to build

![Path A: a stack of slide HTML files goes through Chrome into deck.pdf, which is rasterized into slide webp files](assets/publish-a-talk/slides/slide-08.webp)

I wrote this deck as 13 HTML files on the memo deck theme, which `talk-build.mjs --init` copies into a new deck-src folder. The theme takes its colors and faces from the memo design tokens: paper and ink, Source Serif 4 for titles, IBM Plex for labels, and crimson only for the dither rule. My first version used a dark blueprint look, and it read as a different publication, so I rebuilt it on the tokens. Each file sets a print page of 1600 by 900 pixels, so headless Chrome prints it to exactly one PDF page.

![Path B: Keynote, Google Slides, Canva and PowerPoint each export a PDF, and talk-build splits it into slides and a share card](assets/publish-a-talk/slides/slide-09.webp)

A guest speaker should not have to learn HTML to publish a talk. Export the deck you already have to PDF, put it at deck.pdf in the talk folder, and run the same script. It splits each page into a slide file at the page's own ratio, never cropped or stretched, and writes that ratio into the frontmatter. Your own template stays as it is; the memo theme is only a default.

![talk-build runs deck-src through deck.pdf, slides and og.png, then the T1 to T8 checks](assets/publish-a-talk/slides/slide-10.webp)

The script uses tools that were already on my Mac: Chrome or Edge, poppler and cwebp. It installs nothing, and it names any binary it cannot find. Two things bit me while writing it. Headless Chrome writes the PDF and then never exits, so the script polls for the file and stops the browser itself. And slide 1 is 16:9 while a share card is 1200 by 630, so the card is letterboxed in the slide's own background color instead of cropping the speaker's name.

## Stay in shape

![The eight mechanical checks T1 to T8, from deck pages matching slides to the share card size, with T6 notes length highlighted](assets/publish-a-talk/slides/slide-11.webp)

The post checker runs these eight only when the layout is talk. The first run on this post flagged every slide with the figure rules: a slide image has no caption title and no figure id, and it should not, because the notes are its caption. So the checker now hands slide images to the talk checks and keeps the figure rules for real figures. A worse bug came next: the checker crashed on its first talk run, the build script read the empty output as a pass, and only the fixture tests caught it. The build now fails when the checker fails. The notes check keeps a talk page honest. Under 15 words, the slide is unexplained. Over 150, it is an essay with pictures.

![The six editor checks J1 to J6, with J1, the skim test that the slides alone carry the argument, highlighted](assets/publish-a-talk/slides/slide-12.webp)

No script can tell whether a deck makes sense, so the editor answers six questions. The skim test comes first: read only the slides, and the argument should still land. Then one idea per slide, notes that add what the slide cannot, one visual language, a first slide that says who is speaking, and a last slide with the takeaway. The last check is fit. A playbook or a data-heavy report stays prose, because a talk works only when the argument runs in a line.

![Takeaway slide: put the argument on the slides and the evidence in the notes, with Han Ngo's memo and GitHub handles](assets/publish-a-talk/slides/slide-13.webp)

---

The rules behind this deck live in three places. The [post rubric](/memo-post-rubric) has the talk checks T1 to T8 and the editor table J1 to J6. The [media standard](/memo-media-standard) has the slide, deck and share-card budgets. [Contribute to memo](/contribute-to-memo) has the file layout and both build paths. The editable source of this deck sits in this post's deck-src folder.
