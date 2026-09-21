---
draft: true
title: 'Telegram serverless: bot backends without the backend'
description: 'Telegram launched Serverless, a platform that runs bot and Mini App backends directly on Telegram''s own infrastructure'
date: 2026-07-17
authors:
  - content-editor
tags:
  - telegram
  - serverless
  - bots
  - mini-apps
  - v8
slug: telegram-serverless
---

## TL;DR

Telegram launched Serverless, a platform that runs bot and Mini App backends directly on Telegram's own infrastructure. You write JavaScript modules, deploy with `npx tgcloud push`, and Telegram handles execution in a V8 sandbox with a built-in SQLite database. No servers, no containers, no scaling logic. It is the most integrated bot-hosting platform any messaging app has shipped to date.

## Why this matters

Running a Telegram bot has always required a server somewhere. Even a simple echo bot needs a VPS, a cloud function, or a hosting panel that stays online, handles webhooks, and stores state. That friction keeps a lot of useful bots from existing.

Telegram Serverless removes the entire hosting layer. Your code runs inside Telegram's own systems, next to the Bot API, with an SQLite database that persists between invocations. The platform manages the webhook, the scaling, and the sandbox. You write handlers and deploy.

For builders, this means you can ship a bot or Mini App backend in minutes instead of hours, and you never think about infrastructure again. For Telegram, it deepens the platform lock-in: once your bot's database and logic live inside their cloud, migrating away is harder.

## What it is

Telegram Serverless is a serverless runtime for the Bot API and Mini Apps. It consists of three pieces:

1. **A v8 sandbox** that executes your JavaScript modules on demand, close to Telegram's own systems.
2. **An SQLite-backed database** with a Drizzle-style schema DSL, accessible from any handler.
3. **A CLI (`tgcloud`)** that syncs your local project to the cloud atomically.

The model is simple. An update arrives — a message, a callback query, an inline request — and Telegram routes it to the matching handler file in your project. The handler talks to the Bot API and the database through an SDK, then returns. That is the entire loop.

## The developer workflow

A project has three kinds of files:

```
handlers/   # one file per Telegram update type
lib/        # shared code you import from handlers
schema.js   # database tables
```

You edit locally, run `npx tgcloud status` to see what changed, and `npx tgcloud push` to deploy atomically. Code deploys and database migrations are deliberately separate: `push` never touches your database, and `migrate` applies schema changes only after you review them.

The CLI also supports `npx tgcloud run`, which executes a handler against the platform using your local files, without publishing them. This lets you iterate on logic without waiting for a real message.

Every deploy bumps a monotonic revision. If two people deploy to the same bot, the second push is rejected rather than silently overwriting the first. You `pull`, merge, and push again.

## What you get out of the box

- **Bot API access** through the SDK, with no token wiring.
- **SQLite database** with a typed schema DSL (integer, text, primary keys, defaults, auto-increment).
- **Outbound HTTP** for calling third-party APIs.
- **Webhook management** handled automatically — the platform points Telegram's webhook at itself and keeps `allowed_updates` in sync with your deployed handlers.
- **V8 isolates** for fast, lightweight execution.

The database supports upserts with `onConflictDoUpdate`, returning clauses, and raw SQL expressions. That is enough for conversational state, per-user counters, leaderboards, and Mini App data storage.

## What this means for builders

1. **Bots become single-person projects.** A developer with no DevOps experience can write, deploy, and operate a stateful bot from a laptop. The barrier to entry drops to near zero.
2. **Mini App backends are now trivial.** Mini Apps need server-side logic for user data and dynamic content. Serverless gives them that without requiring a separate backend stack.
3. **The platform owns your data.** The SQLite database lives inside Telegram's infrastructure. There is no export mechanism mentioned, and no way to run the same code elsewhere. This is convenient until it is not.
4. **JavaScript only.** The runtime is V8, so TypeScript, Python, Go, and Rust bots are out. For teams already in those ecosystems, this is a hard boundary.
5. **Cold starts are unknown.** The documentation mentions "fast, isolated execution" but does not quote numbers. For bots with strict latency requirements, this is an open question.

## Sources

- Telegram Serverless documentation: https://core.telegram.org/bots/serverless
- Discord share by nhymxu: https://discord.com/channels/462663954813157376/1284063844314120224/1527509200891150406

## Open questions

- What are the cold-start and warm-invocation latency numbers? The docs claim "fast" but do not quantify.
- Are there execution time limits, memory limits, or concurrency caps? The V8 isolate model implies limits, but they are not documented.
- Is there any data export or migration path? If a bot outgrows the platform, can the database be moved?
- Will Telegram charge for this? The docs do not mention pricing. Free serverless usually means limits or future monetization.
- How does the SQLite database scale? SQLite is excellent for single-node workloads but struggles with high write concurrency. The docs do not clarify whether each bot gets its own database file or shares infrastructure.

## Residual risk

- The platform is new; edge cases around error handling, debugging, and observability are not yet visible.
- The documentation is thorough but has no independent third-party validation at time of writing.
- Vendor lock-in is real: bot logic, database schema, and data all live inside Telegram's ecosystem with no apparent exit path.
- The CLI access token is separate from the Bot API token, adding one more secret to manage. The docs note it is stored in `.tgcloud/` and git-ignored, but teams still need to handle rotation and CI injection.
