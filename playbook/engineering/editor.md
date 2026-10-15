---
title: Code editors
description: How the team picks a code editor, why to learn keybindings, and why Vim is worth trying.
date: null
redirect:
  - /I53IiA
---

Right now our team is scattered between VSCode and Emacs (Spacemacs).

> The VSCode gang enjoy pretty syntax themes, excellent auto-completion for most languages, fast integrated terminal and awesome Git integration.

> The Spacemacs gang live far from the human realm, with all 10 fingers moving constantly to ramp through everything they open, writing Elisp to change editor's behavior on-the-fly, switching projects or playing next Spotify song is just a keymap away. They ain't fear nothing.

![](assets/editor_8e380693a95223eb551446f9171e4c4a_md5.webp)

## Using the right tool for the job

_A well personalized (and configured) editor can signigficantly boost your productivity, pick one and make it yours._

Everyone has their own set of favorite tools, if you're unsure which tool to pick - just use the one that works for the task you're up to. In the end it all comes down to the result you deliver, not what you used to achieve it.

Some personal preferences (for starters) that might helps:

- For project-based development: VSCode
- For single file editting (.eg config files): VSCode/Vim

If you're in doubt, go with [VSCode](https://code.visualstudio.com/).

## Mouse vs keyboard

Learn your editor's keybindings - after you have gotten used to your editor, try to learn (and remember) useful shortcuts/keybindings such as switching between tabs, open project tree, open terminal, .etc. It feels easy enough to just use mouse/trackpad for those task, but once you got used to keybindings you will get things done much faster than hovering a mouse, in almost all circumstances.

### Should I learn Vim?

Yes, seriously. Maybe not now, maybe you will end up hating it and move back to VSCode (or turned into a [Spacemacs](http://spacemacs.org/) fanboy), but its a [big](https://pascalprecht.github.io/posts/why-i-use-vim/) [fat](https://www.quora.com/What-are-the-advantages-of-Vim-over-other-text-editors) [_YES_](https://www.quora.com/How-useful-is-learning-VI-VIM-for-a-new-programmer).

## Minimum setup in any editor

Whatever the editor, set these up once per project so everyone's output looks the same:

- [ ] Format on save with the project's formatter (for example Prettier, `gofmt`).
- [ ] Linter running inline, using the repo's config, not a personal one.
- [ ] `.editorconfig` committed, so indentation and line endings match.
- [ ] Integrated terminal and Git integration working in the project root.
- [ ] Shared workspace settings committed (`.vscode/settings.json` or the equivalent), kept small.
