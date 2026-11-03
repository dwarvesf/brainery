# Verification: media-sync strip lands through a pull request

The Media sync to R2 workflow no longer pushes its strip commit to protected main. It pushes a `media-sync/<run>` branch, opens a PR and squash-merges it, falling back to the dwarves-ops-bot App token if the default token cannot merge.

## Green run

Extracted the upload-and-strip `run:` block from the changed workflow and ran it in a scratch repo (bare remote under `/private/tmp`) with `sudo`, `npm`, `wrangler` and `gh` stubbed. The stub `gh pr merge` fails a set number of times first.

```text
Command: sim.sh media-sync.yml 0     (merge succeeds first try)
Exit:    0
Output:  pr=https://github.com/dwarvesf/brainery/pull/999
         merged=true
         remote branches: main, media-sync/111-1
         remote main head: feat: seed (unchanged, no direct push)
         media-sync branch tree: _meta/scripts/compress-media.sh, post/note.md (a.png, b.jpg stripped)
         merge attempts: 1
Verdict: PASS

Command: sim.sh media-sync.yml 2     (merge refused twice, then ok)
Output:  merged=true, merge attempts: 3
Verdict: PASS (retry covers async mergeability)

Command: sim.sh media-sync.yml 99    (default token refused every time)
Output:  merged=false, merge attempts: 5, ::warning:: fallback line
Verdict: PASS (the Mint ops-bot token and App merge steps gate on merged == 'false')
```

Static checks on both changed workflows:

```text
actionlint media-sync.yml publish-on-push.yml   -> rc 0 (shellcheck clean)
ruby YAML load + bash -n on every run: block    -> all ok
```

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
- The App fallback is unexercised. It needs dwarves-ops-bot installed on `brainery` with contents and pull-requests write; the org install carries both permissions, repo selection is not readable from here.
- The 15 rasters under `handbook/memo/assets/publish-a-talk/` stay in git until the workflow runs once after merge (`workflow_dispatch`).

## Test plan on GitHub

1. Merge this PR, then run `gh workflow run "Media sync to R2" -R dwarvesf/brainery --ref main`.
2. Expect: upload step green, a `media-sync/<run>-1` PR opened and squash-merged, branch deleted, a commit on main titled `chore: media synced to R2 and stripped from the repo`, and `handbook/memo/assets/publish-a-talk/` rasters gone from the tree.
3. Expect no `Publish memo.d.foundation on content push` run for that commit (default-token merge fires no workflow; if the App path ran, the subject guard skips it).
4. Check a live asset URL under `/content/handbook/memo/assets/publish-a-talk/` still returns 200.
5. If the log shows the `::warning::` fallback line, the App path ran; confirm the Mint ops-bot token step passed.
