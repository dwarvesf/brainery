---
title: Database migration
description: Checklist and tooling pointers for database migrations on mobile and backend projects, with a safe rollout sequence.
date: null
kind: reference
redirect:
  - /e5W9zg
authors:
  - neko-anon
type: playbook
topic: data
secondary_topics:
  - platform-ops
---

## Mobile

macOS / iOS:

- Use ObjectMapper cua CoreData de migrate: <https://williamboles.me/step-by-step-core-data-migration/>

Android

- <https://medium.com/flutter-community/migrating-a-mobile-database-in-flutter-sqlite-44ac618e4897>

## Backend

- Su dung migration tool tuy ngon ngu
  - Go: sql-migrate
  - Elixir: ecto

## Tips / best practices checklist

- Luon viet migrate up / down
- back up before migration
- data validation & repair
- Prefer ORM migration tool
- `Do not` deploy the code first: Do not deploy the code first that write to new columns, and then run the migration. It will only result in errors as the code might try to access non-existing column(s).
- Ensure the new changes work before you drop anything
- Use `Feature Flags` whenever possible

## Safe rollout sequence

For a schema change on a live system, split it into steps that each work with both the old and the new code. This is often called expand, migrate, contract.

```text
1. Expand            2. Deploy code        3. Backfill
add new column  -->  that writes both  -->  old rows
(nullable)           columns
                                              |
5. Contract          4. Deploy code           |
drop old column <--  that reads and   <-------+
(later release)      writes only the
                     new column
```

Each step is its own migration or deploy, so each can be rolled back on its own.

### Example: rename `users.name` to `users.full_name`

The SQL below is PostgreSQL. Adapt the syntax to your database.

```sql
-- 1. Expand (up)
ALTER TABLE users ADD COLUMN full_name text;

-- 3. Backfill (run in batches on large tables)
UPDATE users SET full_name = name WHERE full_name IS NULL AND id BETWEEN 1 AND 10000;

-- 5. Contract (a later release, after nothing reads or writes "name")
ALTER TABLE users DROP COLUMN name;
```

```sql
-- Down for step 1
ALTER TABLE users DROP COLUMN full_name;
```

### Before you run it

- [ ] Both an up and a down migration exist, and the down one was run on a copy of the data.
- [ ] A verified backup was taken, and you know how long a restore takes.
- [ ] Long locks were checked. On large tables, add indexes concurrently where the database supports it.
- [ ] The migration ran on a staging copy with production-sized data.
- [ ] The step after deploy is a data check (row counts, nulls), not just "no errors".
