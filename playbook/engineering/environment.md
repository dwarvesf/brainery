---
title: Environments
description: The five environments every project needs (local, CI, testing, staging, production) and what each one is for.
date: null
redirect:
  - /unCMng
authors:
  - neko
---

This section describes the environments you should have, at a minimum. It might sound like a lot, but there is a purpose for each one.

- [Local development](#local-development-environment)
- [Continuous integration](#continuous-integration-environment)
- [Testing](#testing-environment)
- [Staging](#staging-environment)
- [Production](#production-environment)

We use docker and docker-compose to set up our environments. Before getting more profound, we suggest you install our [dotfiles](https://github.com/dwarvesf/dotfiles), where we share the configuration and setting.

```
 Local development ─▶ Continuous integration ─▶ Testing ─▶ Staging ─▶ Production
```

A change moves left to right. Nothing reaches production without passing the stage before it.

## Local development environment

This is your device, where you write code. The product you're building can be run here, and any changes to it can be tested with minimal delay. Integrations to external services are replaced with mockups or stubs to avoid daily work being interrupted by network issues or server downtime. In particular, any databases are local. However, highly available public services may be used as such.

## Continuous integration environment

Continuous Integration (CI) builds your product and runs all automated tests as soon as anything changes in the codebase. Failures are reported immediately. CI also runs end-to-end integration tests.

## Testing environment

The Testing environment used by dedicated testers doubles as a production-like playground for developers. External integrations are by default set up to staging-level versions of other services. Developers can experiment with and try out new integrations here, this environment is also known as Integration Testing.

## Staging environment

Staging is set up precisely like production. No changes to the production environment happen before having been rehearsed here first. Any mysterious production issues can be debugged here.

## Production environment

The big iron. Logged, monitored, cleaned up periodically, squared away and secured.

This set helps developers to come up with the best technical solutions and resolve issues quickly, and users will only ever notice a new release by the product's increased awesomeness.

## At a glance

| Environment            | Who uses it                 | Data                                                                  | External services        |
| ---------------------- | --------------------------- | --------------------------------------------------------------------- | ------------------------ |
| Local development      | Developers                  | Local database, seed data                                             | Mocks or stubs           |
| Continuous integration | The pipeline                | Created and thrown away per run                                       | Mocks or stubs           |
| Testing                | Testers and developers      | Test data                                                             | Staging-level versions   |
| Staging                | Whole team, final rehearsal | Production-like, never real customer data unless access is controlled | Same setup as production |
| Production             | Users                       | Real data                                                             | Real services            |

## Example: one config shape, many environments

The same build runs everywhere. Only configuration changes, supplied through environment variables, never edited in code.

```bash
# .env.example (committed; copy to .env and fill in locally)
APP_ENV=local
DATABASE_URL=postgres://app:app@localhost:5432/app_dev
PAYMENT_API_URL=http://localhost:4010   # mock server
LOG_LEVEL=debug
```

In staging and production the same keys are set by the deploy system, with `APP_ENV=staging` or `APP_ENV=production` and real secrets kept out of the repo.
