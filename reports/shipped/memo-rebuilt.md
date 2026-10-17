---
draft: false
title: "Memo, rebuilt: Elixir and DuckDB out, Cloudflare and D1 in"
description: "Memo's May 2025 build notes described Elixir, DuckDB and GitHub Pages. This report sets them beside today's Workers, D1, R2 and two-repo publish, with the dates, PRs and incidents behind each change."
slug: memo-rebuilt
kind: field-report
date: 2026-10-17
toc: true
authors:
  - tieubao
tags:
  - memo
  - architecture
  - build-log
  - cloudflare
  - migration
redirect:
  - /memo-architecture
  - /reports/shipped/memo-architecture
  - /xjy9aQ
  - /build-pipeline
  - /reports/shipped/build-pipeline
  - /5DMXfw
  - /memo-deployment
  - /reports/shipped/deployment
  - /g1ps9w
  - /duckdb-as-intermediary-storage
  - /reports/shipped/duckdb-as-intermediary-storage
  - /IozGyw
  - /multi-git-submodules
  - /reports/shipped/multi-git-submodules
  - /ntTPfA
  - /single-makefile
  - /reports/shipped/single-makefile
  - /7dL67w
  - /onchain-permanent-storage
  - /reports/shipped/onchain-permanent-storage
  - /IW9O6A
  - /static-site-by-choice
  - /reports/shipped/static-site-by-choice
  - /xh2uZA
---

memo.d.foundation still serves a page called Memo architecture. It says the content pipeline runs on Elixir and keeps its data in DuckDB, and a sibling note says the site deploys to GitHub Pages. I curled the live page while writing this, and it still says Elixir. CI stopped using the Elixir compiler on 12 August 2026, and the site now runs as a Cloudflare Worker.

![Memo's build and host in the May 2025 notes beside the stack today](assets/memo-rebuilt-fig1-hero.svg 'Left: the stack the May 2025 notes describe. Right: the stack that serves the site today. The amber box is the new part: one push now starts two repos.')

Eight build notes from May 2025 made those claims. This report replaces them. It reads them as the "then", lines them up against what runs today, and records what changed and why, with the dates and PRs. Two of the three repos behind today's stack are private, so those PRs appear as numbers only.

## TL;DR

The static site stayed. Next.js still exports one page per Markdown file, 3,078 of them in the August 2026 read-back. Almost everything around it moved. The compiler went from Elixir to TypeScript, the DuckDB parquet disappeared, the site went from a Cloudflare Pages project to one Cloudflare Worker, and one repo became two. Those moves landed between 23 July and 21 August 2026.

The incidents carry most of the cost. On 19 August a build that compiled nothing exited 0, and memo answered 404 for about 13 minutes. On 20 August an unreviewed submodule bump would have deleted 742 of 1,224 search rows. Both failures lived in the seams between parts, and the 2025 notes never described a seam.

| Part     | May 2025 notes                       | October 2026                                                   | Why it changed                                                            |
| -------- | ------------------------------------ | -------------------------------------------------------------- | ------------------------------------------------------------------------- |
| Compiler | Elixir, `export_duckdb.ex`           | TypeScript, `export-markdown.ts`                               | One toolchain; the Elixir exporter silently skipped the 30 largest notes  |
| Store    | DuckDB table, `vault.parquet` in git | JSON from the compile, rows in D1, objects in R2               | Nothing read the vectors; the parquet drifted stale                       |
| Site     | Next.js static export                | Next.js static export, 3,078 pages                             | Unchanged                                                                 |
| Host     | GitHub Pages in the notes            | Cloudflare Pages from 23 July 2026, then one Worker, `df-memo` | Pages gives no same-origin backend and no private bindings                |
| Backend  | None; search ran in the browser      | `df-memo-api` on D1: search, identity, writer rows             | Search, wallet identity and author identity needed a server               |
| Repos    | One                                  | Two, split by plane                                            | The repo that held memo also holds code outside contributors must not see |
| Media    | Committed next to the post           | R2 bucket, vault holds text only                               | History carried about 660 MB of deleted media                             |

## The goal we set in 2025

The Memo architecture note opens with a goal: minimize maintenance costs. It names debugging, updates, server upkeep and dependency management as the costs to cut. The answer was a static site, Git as the source of truth and a single Makefile.

The goal was right, and the stack that served it worked against it. The same note lists ten technologies: Devbox, Git submodules, Elixir, Node.js and PNPM, DuckDB, Git, Make, Arweave, the Base chain and RainbowKit. A newcomer needed an Elixir toolchain, a DuckDB CLI and a Devbox shell before the first page rendered. The Makefile existed to hide that.

## Version 1, as the notes described it

The notes describe a pipeline that starts in Obsidian and ends in a browser.

1. Markdown lives in the brainery vault, assembled from Git submodules.
2. An Elixir compiler (`export_duckdb.ex`) extracts frontmatter and links, compresses each note with an SPR summary, and generates embeddings.
3. Everything lands in a DuckDB table named `vault`, then exports to `vault.parquet`.
4. Next.js builds one static page per note and a MiniSearch index that runs in the browser.
5. GitHub Actions publishes the result.

Five workflows did the publishing:

| Workflow             | Trigger                   | Job                                           |
| -------------------- | ------------------------- | --------------------------------------------- |
| `main.yml`           | push to `main`            | Build the Next.js app, deploy to GitHub Pages |
| `dispatch.yml`       | push to `dev`             | Update submodules, export to DuckDB           |
| `deploy-arweave.yml` | parquet changes on `main` | Upload flagged notes to Arweave               |
| `add-mint-post.yml`  | parquet changes on `main` | Mint flagged notes as NFTs                    |
| `backup.yml`         | daily                     | Back up the DuckDB file to S3                 |

The developer loop was `devbox shell`, then `make run` to preview and `make duckdb-export` after adding content. Adding a frontmatter key meant editing an `@allowed_frontmatter` list inside the Elixir file first. Files over 7,500 tokens got only the custom embedding.

## Version 1, as it actually ran

The notes were stale on the day they went up. They carry a date of 20 May 2025, and the deployment note says `main.yml` deploys to GitHub Pages. On 28 April 2025 the memo repo had already removed that publish step from `main.yml` (`42b48970`, 2 lines added, 48 removed). The same day it added a Dockerfile for the static export, a build experiment aimed at a Railway service (`e52f6280`, `72370803`). The page that taught readers "deployment means GitHub Pages" described a publish step the workflow no longer had, 22 days before its own date.

The repo history does not show where memo.d.foundation was served from after that day. It does not settle what served the domain before the Cloudflare Pages cutover on 23 July 2026 either. <!-- needs Han: where memo.d.foundation was served from between 28 April 2025 and 23 July 2026. The repo history does not show it. -->

The schema in the notes drifted too. The `vault` table lists an OpenAI embedding column of 1,536 floats. The August 2026 decision record for the AI stack names a Gemini column of 768 floats in that slot, and records that nothing in the site read either vector.

Three failures from this era taught more than the diagrams:

- **The exporter lost rows and exited 0.** The Elixir task built each DuckDB statement as one command-line argument. The 30 largest notes exceeded the OS argument limit, the call failed, the task logged it and moved on. The exit code said success (memo.d.foundation PR 330).
- **The reindex failed for weeks.** `dispatch.yml` ran only on manual dispatch and had been failing since 23 June 2026, because three nested submodule pointers returned 404. `make fetch` swallowed those failures and always returned 0. The Cloudflare migration work traced the failure back to those pointers (`docs/cf-migration/content-sot.md` in the archived repo).
- **The parquet went stale.** The reindex spent paid embedding calls on every run, so people avoided running it. The committed 22 MB parquet lagged the site by months (ADR 0017 in the archived repo).

## The permanent-storage bet

The notes give one reason for the Arweave and NFT half of the system: long-run cost. Keeping content on traditional infrastructure gets expensive, and onchain storage cuts future maintenance. It also helps build a verifiable onchain profile for authors. The mechanism was frontmatter flags. A note with `should_deploy_perma_storage: true` got uploaded by a workflow, and the Arweave transaction ID came back as `perma_storage_id`. A note that also had `should_mint: true` got an NFT, and the token ID came back the same way.

The vault's own frontmatter gives a partial count. At brainery main today, 14 notes carry an Arweave transaction ID and 13 carry a token ID. Token IDs run from 1 to 15 with two gaps (4 and 14), and the `minted_at` dates run from 27 March to 16 May 2025, ten of them on 12 May. The repos hold no AR spend and no record of what the bet returned. <!-- needs Han: AR spent, and the year-one return the note argued for. A funnel figure (selected, stored, minted) can use the counts above once the selected number exists. -->

The jobs have been idle since October 2025. In the archived memo repo, `deploy-arweave.yml` and `add-mint-post.yml` both last ran on 22 October 2025, the Arweave run cancelled and the mint run green, and the daily `memo-nft-report.yml` last ran on 22 December 2025. No workflow in foundation-workers, foundation-apps or brainery mentions Arweave or minting. foundation-apps still ships the scripts (`add-mint-post.ts`, `deploy-arweave.ts`, `memo-nft-report.ts`) and the mint UI, and the foundation-workers monitor still has an Arweave balance probe. Nothing triggers any of it. <!-- needs Han: do you want the mint and Arweave jobs revived, or retired for good? The page now says they are dormant. -->

What the repos do record is a decision. In July 2026 the migration plan looked at the mint and Arweave jobs and kept them in GitHub Actions. Two reasons carried it. A Cron Worker would need a signing key inside a Worker, and the foundation-workers repo had no precedent for that. And the account had no spare cron triggers. The Ponder indexer for the NFT contract stayed off Cloudflare, and both of its Fly apps already sat suspended with zero running machines. The decision kept the jobs in Actions, and the Actions workflows then went into an archived repo.

## Four moves in four weeks

![From April 2025 to the squashed vault, in dates](assets/memo-rebuilt-fig2-moves.svg 'The dated moves. Amber marks the day the frontend changed owner.')

**1. Cloudflare Pages, 23 July 2026.** PR 304 prepared the config, and the cutover record shows the run: a Pages project created and memo.d.foundation attached to it. Cloudflare Pages caps static redirects at 2,000 rules, so a Functions middleware carried the full 4,287-rule map, and a parity script confirmed 4,287 of 4,287 rules present with no target mismatches. The deploy uploaded 14,431 files in 263 seconds. Pages also rejects files over 25 MiB. Five asset paths broke that limit, all copies of two files, so they went to R2 and a small hand-kept map served them.

**2. Elixir to TypeScript, 12 August 2026.** PR 318 switched CI to a TypeScript port of the compiler, after checking the port against the original. Both compilers ran against 687 source files and the output trees compared byte for byte: 655 Markdown files, 1,222 assets and 5 database files, 1,882 files in all, identical. One Elixir-only cache file differed, and the port deliberately skips it. The comparison also found a bug in the path handling that Elixir's usual invocation never reached. PR 330 then ported the 1,907-line parquet exporter and fixed the silent row loss. The Elixir code stayed in the tree as a test oracle. The reason is in the ADR: the build ran on two toolchains, and the reindex needed Elixir, DuckDB and a devbox shell, so it ran only by hand and the parquet drifted.

**3. The build moves to foundation-workers, 14 August 2026.** foundation-workers PR 472 copied the pipeline. PR 497 removed DuckDB from it entirely, with five sibling PRs (492 to 496) clearing each script that read the parquet. The compile now writes a metadata file, `memos.json`, and the seeders write rows to D1. The host changed hands in the same days. The last Cloudflare Pages publish ran on 14 August, PR 513 swapped the Pages deploy for a Workers deploy on 15 August, and the first successful Worker publish ran on 16 August. The DNS record change itself is in no commit. The archive runbook (PR 474) lists it as a step, with "restore the Pages CNAME" as the rollback. The migration spec gives the reason this move happened: Cloudflare Pages offers no same-origin backend and no private Worker bindings, and the site wanted search, wallet identity, a shop and author identity.

**4. One repo becomes two, 19 to 20 August 2026.** The migration spec put the frontend inside foundation-workers. That repo also holds finance and identity code that outside contributors must not see, and designers and developers from outside needed to maintain the UI. So the frontend moved to foundation-apps, and foundation-workers kept the data plane. The repo boundary now follows who may see what. The handover began with a collision, covered below, and ended on 20 August when foundation-workers PR 633 deleted its `apps/` directory: 431 files and 64,291 lines.

## Version 2: two planes, one vault

A post merges in brainery. A workflow there (`publish-on-push.yml`, public) mints one short-lived token as the ops-bot GitHub App, scoped to the two publishing repos, and dispatches both. Each runs content-only, so a post publishes without minting a Release in either repo.

![One merged post through the two-plane publish {#fig-publish .live}](assets/memo-rebuilt-fig3-publish.svg 'One post, two publishers. Follow either lane, or show what each lane replaced.')

The **data plane** lives in foundation-workers, in `workers/platform/memo-api/publish/`. A shell script runs the stages: fetch the vault, install, compile Markdown, build eight content JSON files, then upload to R2 in parallel with seeding D1 and deploying `df-memo-api`. The seeders hash-gate rows, so an unchanged row is skipped. A prune guard refuses any run that would delete more than half the corpus. The script has a `--dry-run` mode that compiles for real and prints every credentialed call instead of making it.

The **frontend** lives in foundation-apps, in `apps/memo`. It builds the static export and deploys the `df-memo` Worker. At runtime that Worker does three jobs. It forwards `/api/*` to `df-memo-api` over a service binding. It checks `/writers/<domain>/<slug>` against writer rows, with a 60-second cache, returning 410 for a tombstoned post. And it serves everything else from its assets, falling back to the redirect-map overflow and then the SPA shell on a 404. It holds no D1 binding on purpose: the shared database has no read-only mode, so the Worker asks `df-memo-api` instead.

The overflow map is an idea from the Cloudflare Pages setup that survived. Static redirects still cap at 2,000 rules, so the full list lives in `redirect-map.json` and the Worker reads it at request time.

Media works differently now. The vault holds text. After a merge, brainery's `media-sync.yml` compresses each raster file, uploads it to the `memo-vault-assets` bucket under its vault path, and strips it from git in a follow-up commit. The Worker serves `/content/<path>` from that bucket when no static file matches, so URLs never change. SVG stays in git. The same workflow failed on 21 August and 7 September with "the following file has local modifications": compression had rewritten the working copy, so `git rm` refused it. PR 271 in brainery added the `-f`.

The vault is still a Git submodule of both repos, and brainery still pins five nested content repos by commit: playbook, handbook, research, careers and radar. The frontend build advances the vault to the tip of brainery's main, then checks out the five nested repos at the commits brainery pins. Content merged in one of them reaches the site only after a pointer-bump commit in brainery. That is why a bump counts as a content release.

The quality gates moved with the build and grew one rule. The linter still checks frontmatter, level-one headings and relative links, and the sentence-case formatter still runs. A `kind` rule is new: it warns when a note falls under the word floor for its kind. Brainery's own Markdown lint workflow downloads the CI script from memo.d.foundation and pushes formatting fixes to the PR branch, which matters in the 18 September incident below.

The guest-writer side of `df-memo-api` has its own report in [the guest-writer design](memo-guest-writers.md).

## What went wrong

<!-- needs Han: confirm the four incidents below are cleared for a public post. They come from private repo docs and PRs, and the 19 August outage names a time window. -->

![Four publish incidents on one axis](assets/memo-rebuilt-fig4-incidents.svg 'Four incidents between 19 August and 18 September 2026. Amber marks the one the prune guard caught.')

**19 August: a green build with no pages.** Both repos held a Worker config naming `df-memo`, and Cloudflare resolves a Worker by script name. A foundation-apps dispatch at 09:12 published a build with 14 pages. The site answered 404 with an empty body until a foundation-workers publish replaced it at 09:25. The deploy exited 0 because a build that compiles nothing still exits 0. The fixes are mechanical. A completeness gate compares the Markdown count in the vault to the HTML page count in the output and fails the run if the build is too small. Every deploy reads back which script Cloudflare holds and which commit it carries before it passes. Deploys default to a preview version that takes no traffic (foundation-apps PRs 23, 49). The deeper fix removed the second writer: foundation-workers lost its `apps/` directory, so one arrow reaches `df-memo`.

**20 August: the guard that earned its keep.** An unreviewed advance of the research submodule carried an upstream change that flagged the whole repo as draft. The D1 prune guard caught it: 742 of 1,224 search rows were about to be dropped. The site still lost its research section for 15 minutes before a revert. The owner then chose to ship that triage on purpose, and the guard had no sanctioned path through. foundation-workers PR 627 added an `allow-mass-prune` input, default off, that lets a deliberate mass unpublish proceed with a loud warning.

**7 September: a guard that locked itself.** The content-only publish used to refuse to run when the previous run failed. One transient 134-second vault fetch timeout failed a run, and the guard then refused five later content-only publishes until someone dispatched a full publish by hand. It happened twice that day. The guard could not tell a failed content-only run from a failed full publish, and only the second matters. foundation-workers PR 876 made it look back to the last run that could have left the API undeployed.

**18 September: no push, no publish.** When it fixes something, the formatting bot adds a `chore: automatic formatting ... [skip ci]` commit to the PR branch. Brainery squash-merged PR 272 with the commit messages in the body, so the `[skip ci]` text landed in the merge commit, and GitHub ran no push workflow. The only publish run on that commit is a manual dispatch 43 seconds after the merge. The repo now squashes with the PR title and body.

Three of the four share a shape: the checkmark was green and the site was wrong, or nothing ran at all (the 20 August guard is the one that worked). A run color tells you the runner finished. It says nothing about the page. The checks I run after a merge read the page instead:

```bash
# 1. a page-specific phrase, not a status code: a missing page 307s to /, and curl -L then answers 200
curl -s https://memo.d.foundation/memo-rebuilt | grep -c "Elixir and DuckDB out"

# 2. a retired note redirects to its replacement
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' https://memo.d.foundation/memo-architecture

# 3. the merge commit got a publish run
gh run list -R dwarvesf/brainery --workflow publish-on-push.yml --limit 1
```

The publish workflows in foundation-workers and foundation-apps are private, so this stays a recipe, and there is no tool to clone. The dispatch workflow and the media sync live in the public brainery repo.

## What a publish takes now

![Median publish time, one Cloudflare Pages job against the two lanes today](assets/memo-rebuilt-fig5-duration.svg 'Wall-clock seconds from run start to last update, from the GitHub Actions run lists. The comparison is not like for like.')

Seven successful Cloudflare Pages publish runs, between 12 and 14 August 2026, took 828 to 1,491 seconds, with a median of 1,349 (about 22 minutes). Over the 30 days to 17 October, the frontend deploy has a median of 181 seconds across 112 successful runs, and the data plane 160 seconds across 48. Those runs include previews and staging dispatches, so read them as typical.

The comparison flatters the new stack. The old job compiled the vault, built the whole site, uploaded to Pages and seeded D1 in one sitting, on a hosted runner. The new lanes run on separate self-hosted runners. The two lanes start together, so a full publish costs about the longer of the two plus queue time.

Just before the split, a single combined step went from 110 to 78 seconds, and reading its log turned up three silent bugs. That story has its own post: [the deploy pipeline formula](../../essays/deploy-pipeline-formula.md).

## What stays open

This section is my reading of the sources, and a few of the choices are open.

- **One compiler, one place.** The Markdown compile now exists in two repos. foundation-apps builds the pages with its copy, and foundation-workers keeps a vendored copy for the data plane. On 14 October foundation-workers needed PR 1105 to resync that copy for live figures. Two copies drift unless something diffs them, and this time no oracle does.
- **Treat a submodule pointer bump as a release.** The 20 August incident came from a pointer advance nobody read. Review `git diff --stat` inside the submodule before the bump, and dispatch the publish by hand afterwards.
- **Judge a publish by the page.** In three of the four incidents the run color said nothing useful. A phrase grep after merge takes seconds, and it would have caught the 404 on 19 August.
- **Keep the static site.** The decision from the 2025 notes that survived every move was static output. The Worker serves prebuilt pages from its assets, and only the writer paths call the API. That is the maintenance saving the notes were after.

What I could not verify: the cost in money, what Arweave storage cost, and the day the DNS record moved to the Worker.

## Where the eight notes went

The eight notes are now drafts, and their URLs, including the short codes, redirect here.

| Old note                                      | What survived here                                                                 |
| --------------------------------------------- | ---------------------------------------------------------------------------------- |
| Memo architecture                             | The "cheap to run" goal and the stack list                                         |
| The Memo build and content quality pipeline   | The build stages and the quality gates, now TypeScript in foundation-apps          |
| Automating static site deployment             | The five-workflow table, as the "then"                                             |
| DuckDB as intermediary storage                | The `vault` table, embeddings, upsert and the 7,500-token rule                     |
| Managing content with Git submodules          | The submodule layout, and the five pinned repos that make a pointer bump a release |
| Streamline development with a single Makefile | The Devbox and Make flow, as part of the "then"                                    |
| Onchain permanent storage                     | The flags, the workflows and the open question on results                          |
| Build a static site by choice                 | The reason for static output, which still holds                                    |
