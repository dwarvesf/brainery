---
draft: true
title: 'Mac control tools need to survive restart and sleep'
description: 'A small note on turning a personal Mac workflow pain into a sharper control utility.'
date: 2026-10-05
authors:
  - hieuvd
tags:
  - macos
  - workflow-tools
  - product-design
slug: continuo-mac-control-after-restart
---

## The finding

Hieuvd shared Continuo, a Mac control app he is building after pausing work on a separate database project. The initial need was practical: sharing a keyboard across machines becomes annoying when every machine has to be opened before control can start. The feature edge he called out is control that still works after sleep, after restart, and even at the login screen, instead of only inside a fully awake session.

## Why it matters to us

A lot of developer tooling fails in the transitions around the main workflow, not in the happy path. For multi-device Mac setups, iCloud-based continuity can be enough once every device is awake and signed in, but the rough moments are wake, restart, operating system update, sleep, and login. The useful product lesson is to design for the state before the user is ready to work. That is where a small utility can feel much bigger than its feature list.

## Take it further

- Test the restart, sleep, and login-screen path on a small matrix of Mac models and macOS versions before treating the feature as reliable.
- Write down which parts depend on iCloud, local network discovery, permissions, or a helper running before login.
- Compare the first-time setup friction against the saved daily friction. The trade should be clear enough that a developer will finish setup once.
- Track the early buyer signal separately from usage. A purchase before download suggests interest, but retention will say whether the workflow pain is real.

## Sources

- https://discord.com/channels/462663954813157376/1284063844314120224/1556495921498296401
- https://discord.com/channels/462663954813157376/1284063844314120224/1556497460392632420
- https://discord.com/channels/462663954813157376/1284063844314120224/1556497602055250083
- https://discord.com/channels/462663954813157376/1284063844314120224/1556497858343997522
- https://discord.com/channels/462663954813157376/1284063844314120224/1556498080851959899
- https://discord.com/channels/462663954813157376/1284063844314120224/1556498234413813801
- https://discord.com/channels/462663954813157376/1284063844314120224/1556498546524688395
- https://discord.com/channels/462663954813157376/1284063844314120224/1556498657216565269
