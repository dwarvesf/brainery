---
title: Getting your post onto memo, whichever badge you hold
description: How staff, alumni and outside writers publish on Dwarves Memo, from the path chooser and the pull request to credit, agent prompts and the lint errors you will meet.
date: 2026-10-18
authors:
  - tieubao
tags:
  - memo
  - contributing
  - guide
slug: contribute-to-memo
kind: playbook
draft: true
redirect:
  - /publish-a-memo-step-by-step
  - /handbook/memo/publish-a-memo-step-by-step
  - /handbook/memo/publish-on-memo
  - /xyPMcA
  - /handbook/memo/publication-workflow
  - /cbnI7g
  - /handbook/memo/content-levels
  - /vYSR0A
  - /handbook/community/memo
  - /eFskmA
---

Memo has three doors, and the one you use depends on the badge you hold: team, fellow or guest. Staff with write access open a branch in `dwarvesf/brainery` and send a pull request. Staff without write access and alumni without a blog send the same pull request from a fork. A writer who owns a blog domain skips the repo: they prove the domain, an editor approves, and each approved post lands as a native note.

No outside writer has published on memo yet. The only guest note so far comes from truonghan.com, the maintainer's own blog, so the guest door works and has never been used by a stranger. The fork door has a similar record, covered in the fellow path below.

![](assets/contribute-to-memo-fig1-path-chooser.svg)

_Fig. 1: Find your badge, follow the branch. Each leaf names the chapter that walks it._

## Find your path in 30 seconds

| You are                                          | Your door                       | First move                          | Chapter                                         |
| ------------------------------------------------ | ------------------------------- | ----------------------------------- | ----------------------------------------------- |
| Dwarves staff or contractor with write access    | Branch and pull request         | `git clone`, then a branch          | [The member path](#the-member-path)             |
| Dwarves staff or contractor without write access | Fork and pull request           | `gh repo fork`                      | [The fellow path](#the-fellow-path), fork steps |
| Alumni with a blog                               | Guest writer flow               | Tell your agent to read `skill.md`  | [The fellow path](#the-fellow-path)             |
| Alumni without a blog                            | Fork and pull request, or email | Fork, or write to team@d.foundation | [The fellow path](#the-fellow-path)             |
| Outsider who owns a blog domain                  | Guest writer flow               | Tell your agent to read `skill.md`  | [The guest writer path](#the-guest-writer-path) |

Not sure about write access? One command answers it, and it prints `true` or `false`:

```bash
gh api repos/dwarvesf/brainery --jq .permissions.push
```

An outsider with no blog and no Dwarves history has no built door yet. Write to team@d.foundation and say what you want to write.

## Why write on memo

Memo publishes a page only when it can win a search against a generic one. That bar has a name, the GEO bar, short for generative engine optimization: would an AI assistant answering a question about your subject cite your page? A page earns that with one of three things: firsthand data, a real verdict, or an angle nobody else has. A definitional page ("what is a pull request") loses every retrieval race, and the editors do not publish it.

You can test your own draft before anyone else does. Delete every specific from it: the numbers you measured, the date you decided, the thing that broke. If the post still stands, it was generic, and no amount of polishing fixes that. A post that survives names a verdict a competent peer could dispute and admits one thing that did not work.

The folder tests in the next chapter show the bar for each kind of post. A report in `reports/shipped/` needs a deployment that has been live for two weeks, with real metrics. A report in `reports/lessons/` needs three months of hindsight, checked against records instead of memory.

What you get back depends on your door.

| Door              | Byline and badge                                                                                                  | Reward                                                                                       |
| ----------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Member            | A contributor page at `memo.d.foundation/contributor/<handle>`, badge team                                        | No per-post reward for member posts today                                                    |
| Fellow, fork path | The same page, badge fellow when the member profile marks you as alumni                                           | No per-post reward rule is published                                                         |
| Guest writer      | A contributor page with a guest badge and your verified domain, plus a `rel=canonical` link back to your own site | 5 to 20 ICY per published post, set by an editor, under a monthly cap the editors can change |

Dwarves has no rule that pays members for posts in the repo, so this page promises none. The ICY figures for guests come from the live join page, and chapter 5 covers them.

## Anatomy of a memo post

<!-- ch2: pending media standard -->

## The member path

You are Dwarves staff or a contractor and you can push to `dwarvesf/brainery`. This road is short, and it has fewer guard rails than most people assume.

The rules here are conventions. `main` has no branch protection and no ruleset, the repo has no CODEOWNERS file, and no check is required. A direct push to `main` works. Dwarves asks for a branch and a pull request anyway, because the pull request is the only place the lint and the formatting bot run before a page goes live. In 2026, 139 pull requests have merged into the repo. The same person opened and merged every one, with a median of 113 seconds from open to merge. Nobody assigns you a reviewer. If you want a second reader, ask a teammate yourself.

### Check your access

Run the `gh api` command from the chooser. Roughly ten people get `true`: the direct collaborators plus the members of the `leadership` and `community` teams. Dwarves does not hand out more push access, because with no branch protection every push right is also a push-to-main right. Staff who get `false` take the fork steps in chapter 4. Everything after the clone is identical.

### Clone and branch

```bash
git clone git@github.com:dwarvesf/brainery.git
cd brainery
git switch -c post/my-first-memo
```

The repo is text only and has no submodules, so the clone stays small. Branch names carry no rule. Pull request titles do follow a pattern: recent ones read `feat(commentary): ...` and `fix(content): ...`, which is conventional-commit style, and yours should match.

### Write the post

Chapter 2 covers the folder, the frontmatter and the voice. Three frontmatter fields are mandatory because the lint rejects a file without them: `title`, `description` and `date`. The date is optional only under `playbook/` and `handbook/`. Every new post also gets a `slug`, which becomes its URL.

If your post carries raster images, expect a follow-up commit after the merge. Brainery's `media-sync` workflow uploads raster images, video and PDF files to a storage bucket and strips them from git. The site keeps serving them at the same address. SVG stays in git.

### Lint before you commit

```bash
./pre-commit-hook.sh install
```

The script writes a `pre-commit` hook into `.git/hooks`. On every `git commit` the hook downloads the current `ci-lint.js` from `memo.d.foundation/tools/ci-lint.js` and runs it on your staged Markdown files. It needs `node` and either `curl` or `wget`. `./pre-commit-hook.sh status` shows whether the hook is installed, and `remove` takes it out.

The hook also fixes. On a test file with a double-spaced heading and star bullets, it ran prettier, rewrote the file to a single space and dash bullets, and staged the result. It does not run the sentence-case check without AI-gateway credentials. It prints `sentence-case: CF_AI_GATEWAY_URL/CF_AIG_TOKEN not set ... skipping`, and CI runs that check for you.

### Open the pull request

```bash
git push -u origin post/my-first-memo
gh pr create --title "feat(essays): what we measured on X" --body "Adds a field note on X to essays/. Figures are SVG."
```

The organization's default pull request template is a generic code form, with prompts like "What's this PR do? Add new routes for user". Overwrite it with two sentences about the post and where it sits. Never write `[skip ci]` in the body. Brainery squash-merges with the pull request title plus body as the commit message, and that string in the message makes GitHub skip the publish run for the merge.

### What runs on the pull request

<!-- ch3: screenshot pending until the article PR exists -->

![](assets/contribute-to-memo-fig3-shot-pr.png)

_Fig. 3: The article's own pull request, with the lint check and the "Automatic Formatting Applied" comment._

Any pull request that touches a `.md` or `.mdx` file runs the "Markdown-lint Check" job on the changed files only. When the job fixes something, it pushes a commit named `chore: automatic formatting (sentence case, prettier, lint fixes) [skip ci]` to your branch within about a minute and leaves a sticky comment headed "Automatic Formatting Applied". Run `git pull --rebase` before your next push, or the push is rejected as non-fast-forward. Do not force-push over the bot.

Read the bot's diff before you merge. It sentence-cases headings, and its proper-noun list is partial, so chapter 8 lists what it mangles. The check is not required, so a red lint does not block the merge button. Treat red as a stop anyway, because every error names a real defect in the page.

### Merge

Squash is the only merge method the repo allows. Merge commits and rebase merges are switched off.

```bash
gh pr merge --squash --delete-branch
```

The repo does not delete merged branches by itself, so the flag keeps the branch list short.

### Two halves publish

![](assets/contribute-to-memo-fig4-publish-pipeline.svg)

_Fig. 4: A merge to main fires two publishes. Median open-to-merge is 113 seconds; the formatting bot lands within about a minute; the publish pair takes 5 to 15 minutes._

A merge to `main` triggers the workflow "Publish memo.d.foundation on content push". It dispatches two other repos with one bot token. `dwarvesf/foundation-workers` publishes the data plane: the memo API, search index, menus, rollups and the media bucket. `dwarvesf/foundation-apps` publishes the `df-memo` frontend Worker that serves the site. A full pair takes 5 to 15 minutes, since each repo runs its publishes one at a time.

### Verify it is live

```bash
curl -s https://memo.d.foundation/<slug> | grep -c "a phrase only your post contains"
```

The count should be above zero. Grep the body for something specific to your post instead of trusting a status code alone. Then confirm the publish ran for your merge:

```bash
gh run list -R dwarvesf/brainery --workflow publish-on-push.yml --limit 1
```

The newest run must carry your merge commit. If it does not, fire the publish by hand:

```bash
gh workflow run "Publish memo.d.foundation on content push" -R dwarvesf/brainery --ref main
```

If the page is still absent after 15 minutes, tell the editors. A failed earlier publish run can make later content-only runs refuse, and an editor resets that with one full publish.

## The fellow path

A fellow is anyone who once worked at Dwarves, as staff or as a contractor. The programs page puts it as "once a Dwarf, always a fellow." Your road splits on one question: do you have a blog?

A fellow with a blog could use either door, and the choice decides where the post lives. The guest door keeps your own site as the source, with memo holding a mirrored copy that points back to it. A pull request makes memo the home of the post. Pick the guest door when your site should stay canonical. Pick the fork when you want the post to exist only on memo. The guest door also has an approval flow built for outsiders, while a first fork pull request waits on a manual click.

### You have a blog

Use the guest writer flow. The fellow program page's own "Write as a Fellow" button leads to `memo.d.foundation/writers/join`. Tell your agent to read `memo.d.foundation/skill.md` and get you onto Dwarves Memo, or fill in the form on the join page. Chapter 5 walks the flow.

Two points apply to fellows. If you already have a contributor handle from earlier posts, ask the editors at team@d.foundation to link your domain to it. The `dwarves.json` file you publish has an optional `native` field for that link, and memo treats it as a proposal that an admin confirms. After the link, your page is the member page, and the old contributor URL redirects there. The badge on a member page follows the member profile, which reads fellow for alumni. Posts that arrive through the guest flow follow the guest reward rule in chapter 5.

### You have no blog

Send a pull request from a fork. The repo is public, forking is allowed, and four forks exist today.

```bash
gh repo fork dwarvesf/brainery --clone
cd brainery
git switch -c post/my-first-memo
./pre-commit-hook.sh install
```

`gh repo fork --clone` makes your fork `origin` and keeps `dwarvesf/brainery` as `upstream`. Write and commit as in chapter 3, then push to your fork and name the target repo explicitly:

```bash
git push -u origin post/my-first-memo
gh pr create --repo dwarvesf/brainery --head <your-login>:post/my-first-memo --title "feat(essays): ..." --body "Two sentences about the post."
```

![](assets/contribute-to-memo-fig5-fork-flow.svg)

_Fig. 5: The fork flow. Two steps differ from the member path: a first-run approval, and no formatting bot._

Two things differ from the member path, and both come from how GitHub treats fork pull requests.

The first run needs an approval. The repo's contributor-approval policy is `first_time_contributors`, so the lint workflow stays idle until a maintainer clicks "Approve and run". Your pull request can sit with no check at all until someone does. No response time is published for this click.

The formatting bot does not run on forks. A fork's token cannot push to your branch, so the format step and the sticky comment are skipped by design. The lint itself still runs, and a missing title or an H1 in the body still fails it. The sentence-case check skips with a warning, because it needs credentials that fork runs do not receive. You get no automatic fixes. Run the local hook before every commit, and write headings and the title in sentence case by hand. Only a maintainer can merge, since you have no write access. After the merge, publishing and verification match chapter 3.

The fork door has a thin record. In the repo's history, all 17 fork pull requests came from a single contributor. Fifteen merged, the last on 2025-06-20, and the other three forks have never sent one. That contributor wrote internal handbook pages and appears in the author alias table, so they were most likely staff. I found no outsider fork pull request that merged. The door works for staff. How a stranger fares is untested.

### You have no GitHub account

Email the draft to team@d.foundation. Include the Markdown in the message, say which badge you hold, and say what the post is about. An editor takes it from there. No reply time is published, so plan around that.

### Staff without write access

The fork steps above are yours too. Your badge is team.

## The guest writer path

<!-- ch5: pending media standard -->
<!-- ch5 notes for the writer: Figs. 6 and 7 are reserved for the two guest-writer screenshots. They live at reports/shipped/assets/memo-guest-writers-shot-join.png and reports/shipped/assets/memo-guest-writers-shot-skill.png. From handbook/memo/ the relative path is ../../reports/shipped/assets/<file>.png; the renderer resolves it with path.resolve and the lint exempts raster links. -->

## Let your agent do it

Every door has a file an agent can read. You paste one sentence and the agent does the setup. A person still approves the steps that need one.

| Your path                            | What to tell your agent                                                                                                                             | The file                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| Guest writer, or fellow with a blog  | `Read https://memo.d.foundation/skill.md and get me onto Dwarves Memo.`                                                                             | `skill.md`, live                    |
| Member with write access             | `Read https://memo.d.foundation/contribute-skill.md and help me publish a post on memo. I have write access to dwarvesf/brainery, use branch mode.` | `contribute-skill.md`, not live yet |
| Staff or fellow without write access | `Read https://memo.d.foundation/contribute-skill.md and help me publish a post on memo. I do not have write access, use fork mode.`                 | `contribute-skill.md`, not live yet |

### What the guest skill does

`skill.md` is named `memo-guest-writer`. The agent asks you for a domain you control, an optional handle, a display name, a contact email and one of three consent scopes. It posts the join request, publishes the one-time code at `https://<domain>/.well-known/dwarves.json` on your site (or stops and tells you when it cannot write there), and checks the result with a read-only call until an editor approves or declines. Memo sends no email today, so that check is how you hear the outcome. It refuses to improvise: on a `409`, `422` or `429`, or an expired code, it reports the error to you. Anything outside the join flow ends with a pointer to team@d.foundation. It also refuses to tell you your contributor URL from memory. The page address can change after an editor links you to a member profile, so the agent reads it from the API.

### What the contributor skill will do

`contribute-skill.md`, named `memo-contributor`, is written for people who edit the repo. The file does not exist at its address yet; a request returns 404 today. It has two modes. In branch mode, the agent clones, branches, writes, installs the hook, opens a pull request with a body that replaces the template, and verifies the live page with the `curl` check from chapter 3. In fork mode, it forks first and then covers the same ground, and it warns you about the two fork differences: the first-run approval and the missing bot.

The skill treats chapter 8 as its list of hard stops. It will not push to `main`, will not write `[skip ci]` into a pull request body, will not put a Discord name in `authors`, and will not invent a date or a slug that collides with an existing one. It points at the taxonomy file for the folder choice instead of guessing.

<!-- ch6: screenshot pending until contribute-skill.md is live -->

![](assets/contribute-to-memo-fig8-shot-agent.png)

_Fig. 8: An agent session running `contribute-skill.md` end to end, in a real Terminal window._

The skills do not replace a person at the two steps that need one. An editor approves a guest join, and a maintainer clicks "Approve and run" on a first-time fork pull request. Your agent can report that the step is waiting.

## Getting credited

Put your GitHub-style handle in `authors:`, one entry per author:

```yaml
authors:
  - tieubao
```

Memo builds a contributor page for every author string it finds. The route is `/contributor/<slug>`, where the slug is the name lowercased and stripped to letters, digits and hyphens. A free-text name such as `Jane Doe` becomes `jane-doe`, and `jane` and `Jane D.` become separate pages. Nothing registers a page, so a mistyped handle gets a page of its own. The handle `tieubao` appears in 453 non-draft notes, all under one spelling, so the credit sits on one page.

A Discord username is the wrong value. Discord names create wrong pages, and the editors spent a pass cleaning them up: brainery #387 credited `minhluuquang` instead of the `0xm` alias, #388 credited `tuanddd` and `zlatanpham` instead of Discord aliases, and #389 credited `tieubao` instead of the `baddeed` alias. All three merged on 2026-10-18.

<!-- ch7: screenshot pending, headless browser capture only -->

![](assets/contribute-to-memo-fig9-shot-contributor.png)

_Fig. 9: A contributor page with its badge._

The page shows a name, an avatar, a bio and links when the contributor has a profile record. A handle with no profile still gets a page. It shows the handle as the name and no picture. The badge comes from who you are: team by default, fellow when the profile marks you as alumni, guest when the registry has badged you. Guest writers get a handle that memo assigns, so they never choose a byline in frontmatter.

If you are outside the Dwarves Discord and want to prove that a GitHub byline is yours, open `memo.d.foundation/claim`. You add one token to your GitHub profile README, and memo checks it. There is no account to create and no password to enter.

Two things live in code and have no frontmatter field. Merging two bylines into one needs a row in `dwarvesf/foundation-apps` for the redirect, and so does a request to have your Discord handle tagged when memo announces your post. The foundation-apps code keeps that directory by hand on purpose, because a wrong guess would tag the wrong person. Ask the editors, and attach the handle you want.

## When the lint says no

Run the hook before you push, and most of these never reach CI. The messages below come from running the live `ci-lint.js` against small test files.

| What you see                                                                   | Cause                                                                                                        | Fix                                                                                                                         |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| `H1 headings are not allowed in this document` (`markdown/no-heading1`, error) | A `# Title` line in the body. The frontmatter title already renders the page title, so a body H1 doubles it  | Delete the line, or demote it to `##`                                                                                       |
| `Required frontmatter field missing: 'title'` (also `description`, `date`)     | The field is absent or its value is empty. Legacy gaps in a file you touch block the lint too                | Fill it in. Take a missing date from `git log --diff-filter=A --format=%as -1 -- <file>`, and never invent one              |
| `Line 1 should contain exactly one colon outside quotes`                       | The frontmatter reader works line by line, not as YAML, so a second colon in `title: Why: a thing` breaks it | Quote the value: `title: "Why: a thing"`                                                                                    |
| `TypeError: e.replace is not a function`, no file reported                     | A numeric tag such as `- 101` crashes the lint                                                               | Quote it: `- "101"`                                                                                                         |
| Headline changed after the bot's commit, for example `What i'd do`             | The sentence-case bot lowercases a mid-heading `I` or a product name outside its short proper-noun list      | Rephrase the heading to avoid a mid-heading `I` or a product name                                                           |
| Publish skipped after a merge                                                  | `[skip ci]` in the pull request body ended up in the squash message                                          | Dispatch the manual publish from chapter 3, and keep the string out of future bodies                                        |
| A link renders as a short site path such as `/essays` and goes dead            | A link target ending in `.md` is rewritten as a vault-internal link                                          | For a GitHub file, add something after the extension: `https://github.com/<org>/<repo>/blob/<branch>/path/file.md?plain=1`  |
| A figure runs into the sidebar                                                 | A fixed-width SVG wider than the reading column                                                              | Drop the fixed `width` and `height`, keep `viewBox`, and add `style="width:100%;height:auto;max-width:<W>px;display:block"` |
| `git push` rejected as non-fast-forward                                        | The formatting bot pushed a commit to your branch                                                            | `git pull --rebase`, then push again. Do not force                                                                          |
| A fork pull request shows no checks                                            | First-time contributor approval is pending                                                                   | Wait for a maintainer to click "Approve and run"                                                                            |

Warnings do not fail the check, but two are worth reading. A `markdown/relative-link-exists` warning means a relative link points at a missing file; raster media is exempt because it lives in the bucket and not in git. A `markdown/kind` warning means the body is shorter than the floor for its kind, 400 words for a playbook.

## Pre-PR checklist

Copy this block into your pull request description or your notes and tick it off.

```markdown
- [ ] File lives in the folder that matches its test (taxonomy)
- [ ] Frontmatter has title, description, date and a unique slug
- [ ] Every tag is a quoted string, and no value has a stray second colon
- [ ] `authors:` holds a GitHub-style handle, not a Discord name
- [ ] No H1 in the body; headings are in sentence case
- [ ] Figures are SVG without a fixed width, or optimized raster; every image has alt text and a caption
- [ ] No link target ends in `.md` unless it has `?plain=1` after it
- [ ] `./pre-commit-hook.sh install` ran and the commit passed
- [ ] The pull request body is mine, and contains no `[skip ci]`
- [ ] Fork path only: I asked a maintainer to click "Approve and run"
- [ ] After the merge: the publish run shows my sha, and the curl check finds my phrase
```
