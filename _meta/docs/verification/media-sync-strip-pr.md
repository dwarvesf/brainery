---
title: "Verification: media-sync strip lands through a pull request"
description: "Proof that the Media sync to R2 strip commit reaches protected main through a squash-merged PR, with the local harness cases and the post-merge test plan."
date: 2026-11-03
---

The Media sync to R2 workflow no longer pushes its strip commit to protected main. It pushes a `media-sync/<run>-<attempt>` branch, opens a PR and squash-merges it with the default token, then retries with the dwarves-ops-bot App token if the default one cannot open or merge. If both fail it closes the PR, deletes the branch and fails the job.

## Green run

Extracted the upload-and-strip `run:` block from the changed workflow and ran it in a scratch repo (bare remote under `/private/tmp`) with `sudo`, `npm` and `wrangler` stubbed and a token-aware `gh` stub (`GH_TOKEN` DEFAULT or APP). The stub controls which tokens fail `pr create` / `pr merge` and what `pr view --json state` returns.

| Case                              | Stub behavior                        | Step exit | Calls that matter                                                         | Remote after                   |
| --------------------------------- | ------------------------------------ | --------- | ------------------------------------------------------------------------- | ------------------------------ |
| 1 default merges                  | none                                 | 0         | create, merge (DEFAULT)                                                   | main unchanged, branch deleted |
| 2 merge errors, PR already merged | DEFAULT merge fails, state MERGED    | 0         | merge, view; no fallback, no warning                                      | main unchanged, branch deleted |
| 3 default merge refused           | DEFAULT merge fails, state OPEN      | 0         | 5 DEFAULT merge+view retries, then APP merge; `::warning::` fallback line | main unchanged, branch deleted |
| 4 default create fails            | DEFAULT create fails                 | 0         | DEFAULT create, then APP create + merge                                   | main unchanged, branch deleted |
| 5 both refused                    | DEFAULT and APP merge fail           | 1         | 5 retries per token, then `gh pr close`; `::error::` line                 | main unchanged, branch deleted |
| 6 refused, no App token           | DEFAULT merge fails, APP_TOKEN empty | 1         | 5 DEFAULT retries, `gh pr close`; `::error::`                             | main unchanged, branch deleted |

Static checks:

```text
actionlint media-sync.yml publish-on-push.yml   -> rc 0 (shellcheck clean)
ruby YAML load + bash -n on every run: block    -> all ok
job if (media-sync): main ref only; push events skip a head commit that starts with the strip subject; workflow_dispatch allowed
concurrency: group media-sync, cancel-in-progress false
```

## Negative control

The pre-change workflow (`origin/main`) run through the earlier harness:

```text
Output:  remote main head: "chore: media synced to R2 and stripped from the repo" on top of the seed
         no media-sync/* branch, no PR
Verdict: RED as expected. It commits and pushes straight to main, which is the step GH006 rejected on run 41652064568.
```

The scratch remote has no branch protection, so the harness shows the old path pushes to main; the live rejection is the recorded GH006.

## Negative control

The pre-change workflow (`origin/main`) run through the same harness:

```text
Command: sim.sh orig.yml 0
Output:  remote main head: "chore: media synced to R2 and stripped from the repo" on top of the seed
         no media-sync/* branch, no PR, no GITHUB_OUTPUT
Verdict: RED as expected. It commits and pushes straight to main, which is the exact step GH006 rejected on run 41652064568.
```

The stub remote has no branch protection, so the harness shows the old path pushes to main; the live rejection is the recorded GH006.

## Not proven

- Not run on GitHub Actions. Whether the default `GITHUB_TOKEN` is allowed to merge into main is proven only by the next raster push; settings checked: PR required with 0 approvals, `enforce_admins` off, Actions may create and approve PRs, auto-merge off, no required status checks.
- The App fallback is unexercised on GitHub. It needs dwarves-ops-bot installed on `brainery` with contents and pull-requests write; the org install carries both permissions, repo selection is not readable from here. The mint step is `continue-on-error`, so a missing install never breaks the default-token path.
- `gh pr merge` is used without `--delete-branch` (the runner has no local main for gh's post-merge switch); the harness stubs `gh`, so the real post-merge behavior is only seen on the live run.
- The 15 rasters under `handbook/memo/assets/publish-a-talk/` stay in git until the workflow runs once after merge (`workflow_dispatch`).

## Test plan on GitHub

1. Merge this PR, then run `gh workflow run "Media sync to R2" -R dwarvesf/brainery --ref main`.
2. Expect: upload step green, a `media-sync/<run>-1` PR opened and squash-merged, branch deleted, a commit on main titled `chore: media synced to R2 and stripped from the repo`, and `handbook/memo/assets/publish-a-talk/` rasters gone from the tree.
3. Expect no `Media sync to R2` or `Publish memo.d.foundation on content push` run for that commit (default-token merge fires no workflow; if the App path ran, both subject guards skip it).
4. Check a live asset URL under `/content/handbook/memo/assets/publish-a-talk/` still returns 200.
5. If the log shows the `::warning::` fallback line, the App path ran; confirm the Mint ops-bot token step passed.
