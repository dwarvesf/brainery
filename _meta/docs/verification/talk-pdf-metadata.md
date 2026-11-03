---
title: "Verification: talk deck.pdf carries Title, Author and Subject"
description: "Proof that talk-build.mjs writes the post title, the speaker name and the description into deck.pdf, that the media-sync compression keeps them, and the rebuilt pilot deck."
date: 2026-11-04
---

`talk-build.mjs` joined the slide pages with pdfunite or qpdf, which drops all document info. A downloaded deck had no Title or Author. The script now stamps them after the deck exists, from the post frontmatter and the speaker file.

## What changed

- `stampMeta()` in `_meta/scripts/talk-build.mjs` writes `/Title` (post title), `/Author` and `/Subject` (post description) with a Ghostscript pdfmark, in both build paths (from `deck-src` HTML and from a PDF).
- Author is the `name` in `_meta/talk-template/speakers/<handle>.json` for the first `authors` handle when that file exists, else the handle.
- Text goes in as UTF-16BE hex, so accents, "Đ", quotes and parentheses survive.
- `writeSpeaker()` also writes `talk.speaker` into the post frontmatter from the same `name`, for the first author, the way `talk.ratio` is written. It never overwrites a value set by hand, and writes nothing when the handle has no speaker file. The foundation-apps Download button reads it for the file name.
- Without `gs` the build prints a warning and leaves the fields out. Nothing is installed.
- The compression is not in this script. `compress-media.sh` runs Ghostscript `/ebook` on every PDF during media-sync, after merge. It keeps document info, shown below, so the stamp survives the upload.

## Green run

```text
Command: node --test _meta/scripts/talk-build-meta.test.mjs
Exit: 0
Output:
  # tests 7
  # pass 7
  # fail 0
Verdict: PASS
```

```text
Command: node --test _meta/scripts/post-check-talk.test.mjs
Exit: 0
Output:
  # tests 19
  # pass 19
  # fail 0
Verdict: PASS
```

Seven cases in total. The three `talk.speaker` cases: written from the speaker file, a hand-set value kept across two builds, and no speaker file leaves the field absent. The first four read the built `deck.pdf` back with `pdfinfo`: Title, Subject and the speaker-file Author; the handle as Author when no speaker file exists; a Vietnamese title with quotes and parentheses; two builds on the same deck keep the fields and the page count.

## Pilot rebuild

Command: `TALK_CHROME=/Applications/Helium.app/Contents/MacOS/Helium node _meta/scripts/talk-build.mjs handbook/memo/publish-a-talk.md` (headless, rebuilt from `deck-src`, post-check `T1 to T8 PASS`).

```text
$ pdfinfo handbook/memo/assets/publish-a-talk/deck.pdf
Title:           How to publish a talk on memo
Subject:         A talk post puts each slide beside what you said over it, so a reader can skim the deck and still get your argument.
Author:          Han Ngo
Producer:        GPL Ghostscript 10.08.0
Pages:           13
```

The live deck had 13 pages and no Title or Author. Only `deck.pdf` is committed. The rebuilt slides and `og.png` are unchanged inputs and stay out of the PR.

The pilot frontmatter after `talk-build.mjs` ran on it:

```text
talk:
  deck: assets/publish-a-talk/deck.pdf
  source: assets/publish-a-talk/deck-src/
  ratio: "16:9"
  speaker: "Han Ngo"
```

## Survives the media-sync compression

```text
$ gs -q -sDEVICE=pdfwrite -dPDFSETTINGS=/ebook -dNOPAUSE -dBATCH -o ebook.pdf deck.pdf
$ pdfinfo ebook.pdf
Title:           How to publish a talk on memo
Subject:         A talk post puts each slide beside what you said over it, so a reader can skim the deck and still get your argument.
Author:          Han Ngo
Pages:           13
```

## Negative control

```text
Command: negctl.sh <worktree> "node --test _meta/scripts/talk-build-meta.test.mjs" "sed -i '' 's/^  stampMeta()$/  \/\/ stampMeta()/' _meta/scripts/talk-build.mjs"
Exit: 1 (under mutation, RED expected)
Output:
  # tests 4
  # pass 0
  # fail 4
Restore: git checkout HEAD -- _meta/scripts/talk-build.mjs
Exit: 0 (green after restore)
Verdict: PASS
```

The first control ran when the file held its first four cases, so it shows 4 of 4. Second control, for `talk.speaker`: with the `writeSpeaker()` call commented out, 6 of 7 pass and 1 fails (the written-from-speaker-file case); green after restore.

## Not proven

- Ghostscript on the CI runner is a different version from 10.08 here. The `/ebook` path is the same command `compress-media.sh` runs.
- The R2 object is replaced by media-sync after merge. Check `curl -s https://memo.d.foundation/content/handbook/memo/assets/publish-a-talk/deck.pdf` with `pdfinfo` once the strip commit lands.
