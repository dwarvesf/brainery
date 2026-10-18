---
title: Vault taxonomy
description: "How the brainery vault is organized: one axis per folder, what each register holds, and the frontmatter rules for placement, series, credit and moves."
date: 2026-08-21
---

One axis per folder. A second classification goes in frontmatter (`tags`, `series`), never a new folder. A series is `series: <kebab-slug>` plus `series_part: N` on each part; editors may also define one in the site code. URL identity = frontmatter `slug` (flat, unique vault-wide); the folder is storage and nav only.

## Registers

| Folder                | Holds                                                                        | Test                                                                         |
| --------------------- | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `reports/shipped/`    | Tier 1 production field reports                                              | live deployment 2+ weeks, real quantitative metrics                          |
| `reports/experiment/` | Tier 2 lab reports                                                           | internal R&D or benchmark, controlled and reproducible, honest limitations   |
| `reports/lessons/`    | Tier 3 retrospectives                                                        | hindsight on a past Dwarves project, 3+ months, verified from records        |
| `reports/commentary/` | Tier 4 analysis                                                              | practitioner take on external sources, cited, with an original Dwarves angle |
| `journals/<series>/`  | dated recurring series (digest, forward, ogif, changelog, wala, labs-digest) | remove the date and the piece loses meaning                                  |
| `essays/`             | standalone perspective pieces                                                | remove the date and it still reads                                           |
| `case-studies/`       | client project outcomes                                                      |                                                                              |
| `consulting/`         | consulting methodology (navigate, program)                                   |                                                                              |
| `site/`               | website function pages (services, org, earn, token, contributor-adjacent)    |                                                                              |

## Rules

- `evidence` NEVER appears in frontmatter; the build derives the tier from the path.
- Reports stay flat: `reports/<tier>/<name>.md`. No nesting.
- A report that cannot meet its tier's evidence bar gets reclassified down or held, never mislabeled.
- Journal vs essay: date-anchored entry in a cadence series is a journal; a standalone argument is an essay.
- Publishing bar (GEO): a page earns existence only if it can win an AI-retrieval query, i.e. firsthand data, a real verdict, or a unique angle.
- `featured: true` marks a note for its author's "Selected work" on the contributor page (max 3 shown, newest first; none flagged means the newest 3 show under "Latest").
- `credit: <source>` with `authors: []` marks a note with no individual author (adapted from outside work, or no recoverable author: use `credit: Dwarves Foundation`). It counts for nobody's contributor page. Never stamp a curator as author by default.
- `draft: true` hides a page entirely in production. The pre-migration `updates/` archive is draft-flagged pending triage; un-draft per file, never in bulk.
- Moving a file: slug stays (URL frozen); append the old path-derived URL to `redirect:` (`_meta/scripts/add-old-url-redirects.py` automates this for a batch), move the folder WITH its sibling `assets/`.
