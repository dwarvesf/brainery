---
title: "Publish a post on Dwarves Memo, from choosing a folder to the pull request"
description: Step-by-step guide to writing, reviewing and publishing a post on Dwarves Memo, covering the folder, metadata, local preview, review and pull request.
slug: publish-a-memo-step-by-step
kind: playbook
date: 2024-06-12
authors:
  - minhcloud
  - ooohminh
  - innnotruong
tags:
  - guide
  - memo
redirect: []
draft: true
---

This guide takes you from a blank file to a pull request on the Memo repository. The steps run in order: pick a folder, set up and sync your environment, write, preview, get a review, commit and open the pull request.

## 1. Choose the right directory

First decide which field you are writing in. Whether you write about blockchain, communication, design, engineering, market, security or writing, there is a directory for it in `playground`.

![](assets/memo-publication-workflow-choose-topic.webp)

If you are unsure where your content fits, message our supporters on Discord. If you still do not know where to place the note, leave it in `vault/playground/00_fleeting`.

## 2. Set up and sync

Before you create a post, make sure you have finished setting up the environment for editing Memo, as described in [this post](https://memo.d.foundation/playground/01_literature/how-to-set-up-environment-for-editing-memo/). Make sure you also have the right access to edit the `memo.d.foundation` repository.

Every time you edit or create a post, update your local files first. Go to Source Control and sync all changes in the `memo.d.foundation` repository.

![](assets/how-to-push-content-on-note-d_how-to-push-content-on-memo-1.webp)

## 3. Create the post

1. Choose the folder to nest your post in (see step 1).
2. Click the New file icon and enter the file name. Add the `.md` suffix so the file is typed as Markdown.

![](assets/how-to-push-content-on-note-d_how-to-push-content-on-memo-5.webp)

3. Insert the metadata at the top of the post:

```md
---
title: [The title]
date: yyyy-mm-dd
description: [your description]
authors: [your name]
tags:
  - [tag1]
  - [tag2]
  - [tag3]
---
```

Every article needs these **mandatory fields**: title, description, author, date and tags.

![](assets/memo-publication-workflow-metadata.webp)

4. Write your post below the metadata.
5. Save the file with `Cmd+S`.

Follow these rules while you write:

- Name your files in kebab case, for example `how-to-write-a-memo.md`.
- Verify all links in your article by running the repository locally.
- Upload any images to the `assets` folder and reference them from there.
- For image and screenshot guidelines, read [this guide](../guides/take-better-screenshots-on-mac.md).

![](assets/memo-publication-workflow-images-format.webp)

![](assets/memo-publication-workflow-format.webp)

## 4. Preview locally

To preview your changes on the website, open Devbox by running `devbox shell` in Terminal. Then run `make watch-run` and open the localhost link.

![](assets/how-to-push-content-on-note-d_how-to-set-up-environment-for-editing-memo-2.webp)

## 5. Get a review

Tell a reviewer whether your article is a draft or the final version. Capture the whole page of your post on the local link and send it to your supervisor and @anna to review. We suggest the Scrolling Capture feature of [Cleanshot](https://cleanshot.com/).

- **Content:** our experts review and improve your work. For example, @tom handles engineering and @nikki focuses on communications.
- **Format and design:** @anna oversees the visual and structural aspects. When you are done, take a screenshot, upload it to our server and ping @anna for feedback.

Gather all the feedback and work through it. For detailed instructions, read [Life cycle of a publication](publication-life-cycle.md).

## 6. Commit your changes

Until you commit, your post exists only in local files. To publish it, you create a request for an administrator to approve. Commit all changes first:

1. Go to the Source control section.
2. Sync all changes in `memo.d.foundation` and in the branch you edited.
3. Stage all changes of the branch you edited.
4. Name the commit and press Commit.

![](assets/how-to-push-content-on-note-d_how-to-push-content-on-memo-2.webp)

## 7. Create the pull request

Go to your [GitHub](https://github.com/) and log in. Then:

1. Open the profile dropdown and open the Your repositories section.

![](assets/how-to-push-content-on-note-d_how-to-push-content-on-memo-3.webp)

2. Choose the branch you edited.
3. Open the pull request list.

![](assets/how-to-push-content-on-note-d_how-to-push-content-on-memo-4.webp)

4. Choose the commit and create the pull request.

Now wait for an admin to review your request.
