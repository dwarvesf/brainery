---
title: Memo post rubric for writers and their agents
description: The checks a draft must pass before review on Dwarves Memo, a list of mechanical rules with a script to run and a scored list of judgment questions.
date: 2026-10-25
authors:
  - tieubao
tags:
  - memo
  - contributing
  - style-guide
slug: memo-post-rubric
kind: playbook
draft: false
---

This page is the rubric for a new memo post. Run it on your draft before you open a pull request, whether you are staff, alumni or a guest. An agent can run it for you, and the last section says how.

The rubric has two parts. The mechanical checks come first: a script finds each problem and says where it is. The judgment checks come second: you answer yes or no and fix what fails. Both parts apply to every path. The [media standard](/memo-media-standard) holds the file-level rules for images and SVG. [Contribute to memo](/contribute-to-memo) holds the paths.

## Mechanical checks

Run the checker on your note. It needs Node 18 or newer and nothing else.

```bash
node _meta/scripts/post-check.mjs path/to/your-note.md
```

It prints `PASS <file>` or one `WARN <id> <file:line> <message>` per problem. It exits 0 by default, so it never blocks a commit. Add `--strict` to exit 1 on any warning. The pre-commit hook runs it in the warning-only mode on the notes you stage.

Fix every warning, or know why you keep it. A warning you keep goes in the pull request body in one line.

Table: Mechanical checks, with the id the script prints {#tbl-checks}

| Id                   | Rule                                                                                                                    | How to fix                                                                    |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| `dash`               | No em dash or en dash, in the body or the frontmatter.                                                                  | Use a comma, colon, semicolon, brackets or a new sentence.                    |
| `dek-long`           | The description is the dek: one light sentence, under 30 words.                                                         | Cut it to the one thing the reader gets.                                      |
| `heading-number`     | A heading carries no number or "Part 2" label.                                                                          | Drop the number. Link with `@sec-<heading-slug>`.                             |
| `sec-ref`            | Prose never says "section 4".                                                                                           | Write `@sec-<heading-slug>`.                                                  |
| `fig-line`           | No separate `_Fig. N_` caption line under a figure.                                                                     | Put the caption in the image title.                                           |
| `fig-prose`          | Prose never says "Fig. 6".                                                                                              | Write `@fig-<id>`.                                                            |
| `inline-code`        | At most one inline code span in a body paragraph.                                                                       | Say it in words, or move the detail into a fence or the appendix.             |
| `hash-body`          | No commit hash in the body.                                                                                             | Move it to the appendix table.                                                |
| `version-body`       | No version string in the body.                                                                                          | Move it to the appendix table.                                                |
| `fileline-body`      | No `file:line` reference or `#L12` link in the body.                                                                    | Move it to the appendix table.                                                |
| `url-bare`           | No bare URL in prose.                                                                                                   | Link it as `[Title](url)`, or move it to References.                          |
| `ai-tell`            | No phrase from the short tell list, such as "here's the thing" or "in conclusion".                                      | Rewrite the sentence. The judgment checks cover the rest of the tells.                    |
| `ascii-art`          | No box-drawing diagram in a code fence.                                                                                 | Make it a figure.                                                             |
| `fence-lang`         | Every code fence sets a language.                                                                                       | Add one. Use `text` when nothing fits.                                        |
| `eq-id`              | Display math is `$$ ... $$ {#eq-id}`.                                                                                   | Add the id after the closing `$$`.                                            |
| `eq-where`           | A numbered equation is followed by a `where:` list.                                                                     | List each symbol under the formula.                                           |
| `id-dup`             | Each `{#fig-...}`, `{#tbl-...}` or `{#eq-...}` id is used once.                                                         | Rename one.                                                                   |
| `ref-missing`        | Every `@fig-`, `@tbl-`, `@eq-` and `@sec-` points at an id that exists. The build fails on a miss.                      | Fix the id or add the target.                                                 |
| `fig-alt`            | Every image has alt text.                                                                                               | Write what the figure shows.                                                  |
| `fig-embed`          | Every image uses the head-figure form, with a title and a `{#fig-id}`.                                                  | `![Title {#fig-id}](assets/x.svg 'Short title. Caption sentence.')`           |
| `fig-title`          | The caption's first sentence is the same short title as the alt text.                                                   | Start the caption with the title.                                             |
| `asset-missing`      | Every image path exists.                                                                                                | Add the file or fix the path.                                                 |
| `asset-case`         | Asset paths are lowercase, because production is case-sensitive.                                                        | Rename the file and the link.                                                 |
| `live-twin`          | A `.live` figure has a figkit `.fig.html` file beside its SVG.                                                          | Add the twin, or drop `.live`.                                                |
| `svg-viewbox`        | The SVG viewBox is 760 wide.                                                                                            | Redraw on a 760 wide plate.                                                   |
| `svg-fixed-size`     | No fixed `width`, `height` or `min-width` in the SVG.                                                                   | Delete them and keep the viewBox.                                             |
| `svg-font-size`      | Text is 9 to 10.5 in a plate, or about 11 to 13.5 in a dense live diagram. The script flags anything outside 9 to 13.5. | Resize the text.                                                              |
| `svg-font-family`    | The SVG font includes `ui-monospace`.                                                                                   | Set `font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"`. |
| `svg-dasharray-attr` | `stroke-dasharray` is set in `style`, never as an attribute.                                                            | `style="stroke-dasharray:5 4"`.                                               |
| `svg-smil`           | No SMIL (`<animate>`, `<set>`).                                                                                         | Use a figkit `.fig.html` for motion.                                          |
| `svg-script`         | No script or event handler in an SVG.                                                                                   | Remove it.                                                                    |
| `table-cell`         | Wide comparison tables use few words per cell.                                                                          | Cut cells to a few words; move prose out.                                     |
| `table-label`        | Row labels in the first column are short.                                                                               | Shorten them to six words or fewer.                                           |
| `ref-section`        | A post that cites `[n]` ends with one `## References` list.                                                             | Add the list.                                                                 |
| `ref-format`         | Each entry reads `n. **Term or Name**: definition or role, date. [Title](url).`                                         | Rewrite the entry.                                                            |
| `ref-order`          | Entries are numbered 1, 2, 3 with no gap.                                                                               | Renumber.                                                                     |
| `ref-bare-url`       | No bare URL in an entry.                                                                                                | Wrap it as `[Title](url)`.                                                    |
| `ref-multi`          | One source per entry: at most a source and one companion link, and under 450 characters.                                | Split it into entries.                                                        |
| `ref-sublist`        | No list nested inside an entry, such as a list of files read.                                                           | Keep one definition and one link. The file list goes in the appendix.         |
| `ref-unused`         | Every entry is cited somewhere, as `[n]` or `[term](#ref-n)`.                                                           | Cite it or delete it.                                                         |
| `cite-missing`       | Every `[n]` has an entry.                                                                                               | Add the entry.                                                                |

The script reads the note and the SVG files it links. It cannot judge a figure's content, so the judgment checks still apply.

### What the script does not check

The script does not decide whether a rule is worth breaking once. A hash in the body is fine when the post is about that commit. Use your judgment, then say so in the pull request. It flags the bad examples quoted on this page too, because it cannot tell a quote from a mistake. It also skips a missing raster image on a note that is already merged and unchanged, because `media-sync` moves rasters out of git after the merge.

## Judgment checks

Answer each question yes or no. A "no" means rework, not rewording. The weakest items are usually 1, 2 and 11.

1. **Do the sections follow the reader's questions?**
   - Good: a reader who stops after any section got a full answer to the question that section's heading asks.
   - Bad: sections follow the order you did the work in. Good: "Why it costs so much", then "How it works", then "When it pays".

2. **Does each section open with its answer, in one or two plain sentences?**
   - Good: the first lines answer. Detail follows.
   - Bad: "To understand this, we first need to look at how requests flow." Good: "The agent pays for the tool list on every request, so cost grows with the tool count."

3. **Is the dek one light sentence?**
   - Good: it names the reader's question or the result, with no setup.
   - Bad: "A deep dive into agent costs, with benchmarks and a framework." Good: "An agent that writes one program costs less than one that calls tools one by one."

4. **Is the core mental model stated before the mechanism?**
   - Good: one sentence of "what this is" comes before any stage, step or internals.
   - Bad: the pipeline stages arrive in section two and the idea in section five.

5. **Are the headings plain words, and do the cross-references use ids?**
   - Good: a heading names a topic or question, and prose links with `@sec-...`.
   - Bad: "4. Implementation details" and "see section 4".

6. **Is each paragraph one idea at body density?**
   - Good: identifiers, hashes, versions and file locations live in appendix tables with the columns What we checked, What it does, Where.
   - Bad: "`fabric_exec` calls `bridge.ts:212` on `v0.109.3`" in a body paragraph. Good: "The tool call crosses one bridge to the host", with the file and version in the appendix.

7. **Does each figure earn its place, and is it complete without motion?**
   - Good: one idea per figure, one accent color, text readable at phone width, and a caption that says what to look at.
   - Bad: an ASCII diagram in a fence, or a figure that repeats the paragraph above it. A live figure's static SVG must tell the whole story.

8. **Do figures sit at column width, with `.wide` only for content that is wider?**
   - Good: a small diagram or a chart stays at column width.
   - Bad: `.wide` on a four-box diagram.

9. **Do tables read at a glance?**
   - Good: a `Table:` title line where the table needs a name, short row labels, and a few words per cell.
   - Bad: an eight-column comparison with full sentences. Good: three to five columns of two to six words, with the prose above it.

10. **Does every fence the prose discusses name its file and highlight its lines?**
    - Good: `{file="turn-8.ts" hl="2"}` on the fence the paragraph walks through.
    - Bad: a code block the text refers to as "the snippet above" with no file name.

11. **Does every claim carry evidence?**
    - Good: a number names its run, a claim names its source, and a source is in References.
    - Bad: "Code mode is much cheaper." Good: "Code mode used 4,100 input tokens against 29,000 on the same task, mean of three runs, source cited."

12. **Are the references useful?**
    - Good: a term peek (`[term](#ref-n)`) exists only for a word the reader may not know, defined once at first use. Each entry is one source.
    - Bad: a peek on every noun, or one entry that bundles five links and a file list.

13. **Does it read like a person who did the work wrote it?**
    - Good: it holds a firsthand fact, a position a peer could dispute, and one thing that went wrong. See the [voice gate](/ai-writing-tells).
    - Bad: corrective negation ("it is not X, it is Y"), three parallel items in a row, and a tidy closing line that restates the point.

14. **Is every sentence free of filler and em or en dashes?**
    - Good: short sentences, concrete nouns, and no summary paragraph at the end.
    - Bad: "In today's fast-moving landscape, it is worth noting that..."

15. **Did you check the render?**
    - Good: you ran the note locally, took screenshots at 1440, 1100 and 390 pixels wide in light and dark, and saw no sideways page scroll, legible figures, and margin notes that do not crowd the right rail.
    - Bad: "the build passed". A passing build does not show a clipped figure or a wall of margin notes.
    - How: run the memo app against your branch (see `apps/memo/README.md` in `dwarvesf/foundation-apps`), or ask an editor for a preview.

### Verdict format

Return this at the end of the check, in this shape.

```text
Mechanical: PASS | N warnings (list the ids and counts)
Judgment:   1 pass, 2 fail, 3 pass, ... 15 pass
Weakest:    one sentence naming the single weakest spot and where it is
Blocking:   the failing items that must be fixed before review (empty if none)
```

An item is blocking when it is 1, 2, 11 or 13, or when `ref-missing` fires (the build fails on it). Every other failure is a fix before review that an editor may waive.

## For writers' agents

Fetch this page and run both parts before you open a pull request.

1. Fetch the rubric with `curl`, and read it whole. A summary drops the rules. The page is at `https://memo.d.foundation/memo-post-rubric`, and the source is `handbook/memo/post-rubric.md` in `dwarvesf/brainery`.
2. Run the checker from a clone of `dwarvesf/brainery`: `node _meta/scripts/post-check.mjs <your note>`. Fix every warning, or write one line in the pull request body for each one you keep. A guest writer without a clone applies the mechanical checks by hand from the table.
3. Answer the fifteen judgment questions, and return the verdict block above. Put it in the pull request body.
4. Do the render check from item 15 and attach the screenshots, or say that you could not.
5. Stop and ask the human when the weakest spot needs facts only the author has, such as a number, a decision date, or something that broke. Never invent evidence to pass an item.
