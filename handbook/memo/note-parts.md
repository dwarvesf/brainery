---
title: Write memo notes that lay out as parts
description: The plain Markdown and frontmatter that memo turns into term peeks, step rails, checklists, definition grids, avoid and prefer pairs, case study fields, a status line, an age line, an abstract box and the Once a Dwarf story fields.
date: 2026-10-23
authors:
  - tieubao
tags:
  - memo
  - style-guide
  - guide
slug: memo-note-parts
kind: reference
draft: false
---

Memo lays a note out from the Markdown you already write. There is no new syntax to learn and no block to import. If your note has the shape a part looks for, the part appears. If it does not, the note reads as plain prose, which is fine.

Each part below names the note types it applies to. The type comes from the folder. A `type:` line in the frontmatter overrides the folder when the value is valid. [Contribute to memo](/contribute-to-memo) covers folders and frontmatter. The [media standard](/memo-media-standard) covers figures.

## Term peek

Use it when a reader may not know a word. Link the word to a numbered entry in your References list. Hover, focus or a first tap opens a small card with the term and its definition.

```md
A [vector database](#ref-1) stores embeddings.

## References

1. **Vector database**: A database that stores embeddings and answers nearest-neighbour queries over them.
```

- The link is `[word](#ref-n)`, where `n` is the entry's position in the list.
- The list is an ordered list straight under a `## References` heading.
- An entry that opens with a bold or italic lead gives that lead as the term. The rest is the definition. An entry with no lead uses the link text as the term.
- A link to an entry that does not exist stays an ordinary link.
- Put the link inside a sentence. A link that opens a paragraph or a list item reads as navigation and does not peek.
- Define a term once, at its first use.
- A plain `[1]` in prose is a citation. It links to the entry and the entry gets a "Cited in" line. A term link looks different: a dotted underline.

A note can also be a definition. Add `term:` to its frontmatter.

```yaml
term: Vector database
```

Every link to that note from another note then reads as a term. The card shows the `term` value and the note's first sentence. Write that first sentence as the definition. A page carries at most 80 peeking note links.

## Step rail

Types: playbook and program.

An ordered list of three or more items, where every item starts with bold text, becomes numbered circles on a rail.

```md
1. **Back up the vault**: Copy it before you touch anything.
2. **Run the lint**: `./pre-commit-hook.sh install`, then commit.
3. **Open the pull request**: Draft first.
```

- The bold text is the step title. The text after the colon is the step body and starts with a capital letter.
- A code block or an image indented under a step stays inside that step.
- If one item does not start with bold, the whole list stays a plain numbered list.
- A task list is never a rail.

## Checklist

Types: playbook and company.

A task list of three or more items becomes a card with the title and an "n of m done" count. Readers can tick the boxes. Their ticks stay in their own browser and nobody else sees them.

```md
Before you merge:

- [ ] The lint is green
- [ ] The preview loads
- [ ] The description is one sentence
```

The title comes from the paragraph just above the list. That paragraph either ends with a colon or is one bold label. With no such paragraph, an `###` heading directly above works. With neither, the card reads "Checklist". Items of 40 characters or fewer run in two columns.

## Definition grid

A definition grid sets a term on the left and its text on the right. Three shapes make one.

Company notes. A bullet list of three or more items, each opening with a bold term. An emoji before the bold is fine. An item with a nested block does not qualify.

```md
- **Ship small**: One change per pull request.
- **Show the number**: A claim without a command is an opinion.
- **Name the owner**: Every task has one person.
```

Case studies. The same bullet list, placed under an `## Technical highlights` heading. Also a run of two or more groups, where each group is an `###` heading (or a bold label that ends in a colon, such as `**For customers:**`) followed by only a bullet list.

Puzzles (type writing, form puzzle). An ordered list of three or more items under a heading that contains "principle", "pillar" or "goal". Each item is `**Name**: text`.

## Avoid and prefer pairs

Types: research and playbook.

Pairs show a weak form next to a strong one. Two shapes make them.

A two-column table where every body cell holds exactly one inline code span. The two header cells become the column labels.

```md
| Weak               | Strong                        |
| ------------------ | ----------------------------- |
| `git add .`        | `git add <file>`              |
| `git push --force` | `git push --force-with-lease` |
```

In a playbook, a `**Bad**` paragraph followed straight away by a `**Good**` paragraph. Each can carry its text after a colon, or stand alone with a fenced code block under it. Repeat the pair as often as you like. The labels read Avoid and Prefer.

```md
**Bad**: Commit with the message "fix".

**Good**: Commit with the message "fix(lint): quote a numeric tag".
```

## Case study fields

Type: case study.

Frontmatter fills the Engagement box and the line above the title.

| Field                            | Where it shows                                                |
| -------------------------------- | ------------------------------------------------------------- |
| `client`                         | The client name above the title. Falls back to `short_title`. |
| `client_logo`                    | The client mark beside the name.                              |
| `industry`, `capability`         | The facts line.                                               |
| `context`, `solution`, `outcome` | Business context, Solution and Outcome in the Engagement box. |
| `region`                         | Location in the Engagement box.                               |
| `services`                       | Services in the Engagement box. A list or one string.         |

`client_logo` is an `https://` address or a path that starts with `/`. Anything else is ignored. With no logo, memo draws the first letter of the client name on a plain tile. Never paste a logo you do not have the right to use.

A leading run of bold labels in the body (Industry, Location, Business context, Solution, Outcome, Our service) fills the same box, and memo removes the run from the body. Frontmatter wins when both exist.

Two body shapes also lift. Two or more images, each alone in its paragraph and back to back, become a gallery. Headings named "What we did" (or "The problem"), "How we built it" and "What we achieved" give a short story nav at the top. It needs at least two of the three.

## Status line

Use it for a decision record such as an RFC. A note tagged `rfc`, or with a slug that starts `rfc-`, shows "Proposed" with its date and the line "No decision recorded on memo yet."

Set `status` once it is decided.

```yaml
status: accepted
decided_at: 2026-10-20
```

The values are `proposed`, `accepted`, `rejected` and `superseded`. For a decided status the line shows the label and the `decided_at` date. With no `decided_at`, it uses the note's `date`. A note with a valid `status` gets the line even without the `rfc` tag.

## Age line

Research notes carry a line under the description once they are two whole years old: "Written 3 years ago. Check versions before you rely on it." Memo counts from the note's `date`. It applies to type research only, and it is worked out when the site builds. If you reread an old note and it still holds, say so in the text. If it does not, fix it.

## Abstract

An `abstract:` in the frontmatter sets a short summary in a boxed block labelled "Abstract", above the opening of the note. Paper layouts, which cover research notes and reports, set it in the header box. Keep it to two or three sentences that state the result.

```yaml
abstract: "We cut the publish step from 110 to 78 seconds by skipping unchanged workers. The change held for two weeks."
```

## Once a Dwarf stories

Type: program, for the stories at [/once](/once).

A story is one person's piece in the Once a Dwarf program. The program registry in foundation-apps (`apps/memo/src/data/programs.ts`) lists every story, and the story's number comes from its date there. Add a story in this order:

1. **Register it first**: Add a child to the registry with the slug `<person>/<topic>`, the title `<Name> on <topic>`, the date the piece first ran, and the vault path. Merge that before the note.
2. **Write the note**: Repeat the registry slug as `program_path` in the frontmatter, so the URL never follows the title. A piece imported from an older source sets `announce: false`.
3. **Pick a chapter and a pearl**: Fill the three fields below, then build and check `/once/lessons`.

Seven chapters sort the stories: `craft`, `turns`, `leading`, `learning`, `how-we-work`, `community` and `life-and-drive`. Each chapter page opens with one question that starts "If you knew then what you know now". A new interview opens with its chapter's question.

```yaml
chapter: learning
chapters_also:
  - leading
pearl: "Some training topics don't appear in my daily work, so I prefer to focus on those I apply almost every day"
```

- `chapter` is the one primary chapter.
- `chapters_also` is optional and holds at most one other chapter.
- `pearl` is one sentence copied word for word from the story: the most portable advice in it. You may cut words from the start or the end. Never reword it, and put no double quotes inside it. Skip a sentence that needs the one before it, names a colleague, or is private.
- The pearl shows on the chapter page and on `/once/lessons`, never on the story page. The story shows a "Chapter" link instead.
- The build fails on an unknown chapter, a second `chapters_also` entry, or a pearl that is not in the story text.

## Layout families

The note type picks one of three layouts. You do not choose it.

| Layout | Notes that get it                                                                                                                      |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Paper  | Research, reports, and writing that is an analysis, a puzzle or a market report. A 640 px column, numbered sections, a centered title. |
| Blog   | Essays, playbooks and company notes. A 680 px column with the writer up front.                                                         |
| Press  | Case studies and program notes. A facts band across the top, over a centered story.                                                    |

## Check before you open the pull request

- Does the note have the shape the part wants? A list of two items is never a rail.
- Open the preview and look. A part that did not fire means the shape was off by one detail, usually a missing bold lead or a table cell with two code spans.
- Keep the plain-prose version readable. A reader on a feed or an agent that strips layout sees only the Markdown.
