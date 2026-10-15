---
title: Writing a useful changelog
description: What makes a changelog useful to people, with a change-type convention, a worked entry and a template.
date: null
redirect:
  - /vMt0gg
---

Remember the last time you read over the changelog of your favorite app and found it sucks with useless information like they don't care about the product that they sell out. Something like below

> 2.11.4
>
> - Some bugs fixed
>
> or
>
> - Fix bugs and improve UI/UX

They are awkward, and the same thing happens for our end users. As a user, we care about what's news in the software that we use every day. The changelog is for humans, not machines. The changelog is a channel for us to communicate with our users. When you do a software project, big or small, it is a good idea to write a useful changelog.

Look at the release notes of those apps or the changelog of Go programming language: <https://tip.golang.org/doc/go1.12>.

They are not the standard but should capture what we want to deliver.

![](assets/changelog-sample.webp)

![](assets/changelog-go.webp)

#### What makes a good change log?

- [ ] Changelogs are for humans, not machines.
- [ ] Write all dates in YYYY-MM-DD format.
- [ ] Follow [Semantic Version](versioning.md).
- [ ] The same types of changes should be grouped
  - `Added` for new features.
  - `Changed` for changes in existing functionality.
  - `Deprecated` for soon-to-be removed features.
  - `Removed` for now removed features.
  - `Fixed` for any bug fixes.
  - `Security` in case of vulnerabilities.

## The template

> **1.0.1**
>
> 2018-12-28
>
> #### Added
>
> -
> -
>
> #### Removed
>
> -
> -

## A filled-in example

The product and changes below are illustrative. Each line says what changed for the user, not what changed in the code.

> **1.4.0**
>
> 2026-10-15
>
> #### Added
>
> - Export your order history as CSV from Settings > Account.
> - Dark mode follows the system setting.
>
> #### Changed
>
> - Search results now load as you type instead of after you press Enter.
>
> #### Fixed
>
> - Password reset emails arrive within a minute instead of sometimes taking an hour.
>
> #### Security
>
> - Sessions now expire after 30 days of inactivity.

Compare this with "Bug fixes and improvements". The entries above let a user decide whether to upgrade and where to look for the change.

### Keeping it current

- Add a line to an `Unreleased` section in the same pull request that makes the change. Writing it later means guessing.
- At release time, rename `Unreleased` to the version and date, and start a new empty `Unreleased`.
- Link the version heading to the diff or tag so a curious reader can see the code.
