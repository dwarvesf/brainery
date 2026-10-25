---
title: "Engineering release checklists for production, UAT and frontend UI"
description: "Three pre-ship checklists in one place: production readiness for a service, user acceptance testing with the product team, and the frontend UI check before a design goes live."
slug: engineering-release-checklists
kind: playbook
date: 2026-10-17
authors:
  - tieubao
tags:
  - checklist
  - engineering
  - release
  - qa
  - frontend
redirect:
  - /playbook/engineering/production
  - /ZEmonw
  - /playbook/engineering/qa/uat
  - /JuuhaQ
  - /playbook/engineering/frontend/ui-checklist
  - /3HShrA
type: playbook
topic: engineering-practice
---

Three checklists guard what ships. The production checklist covers the service, the UAT checklist covers sign-off with the product team, and the frontend UI checklist covers what the user sees. Run each one before the matching step.

| Checklist   | Use it when                                                    |
| ----------- | -------------------------------------------------------------- |
| Production  | A service is about to go to production                         |
| UAT         | The product team starts user acceptance testing                |
| Frontend UI | You build a design or turn a design into code, before you ship |

For the general release flow, see the [release checklist](release.md).

## Production checklist

Related pages: [Logging system](log.md), [Application health checks and status pages](monitoring.md).

- [ ] Are long-running processes such as email delivery run in background jobs?
- [ ] Are there redundant (at least two) web and background processes running?
- [ ] Are we using SSL? Never send credentials unencrypted over public network. Always use encryption (such as HTTPS, SSL, etc.).
- [ ] Are API requests being made via a separate subdomain (api.example.com)? Even if the same app, this gives us architectural flexibility in the future.
- [ ] Are we monitoring performance and uptime?
- [ ] Are deploys done manually at a scheduled time when teammates are fresh and available if something goes wrong?
- [ ] Do deploys follow a well-documented script?
- [ ] A method exists for replicating the state of one environment in another (e.g. copy prod to QA to reproduce an error)
- [ ] All repeating release processes have been automated

**Variables**

- [ ] No secrets are stored in version control
- [ ] Is config stored in environment variables?
- [ ] Are new variables deployed?
- [ ] Server environments are up-to-date
- [ ] A plan for updating the server environments exists

**Back up**

- [ ] Are we backing up our production database?
- [ ] Backups are running
- [ ] Restoring from a backup has been tested
- [ ] Rolling back a deployment is possible

**Logging**

- [ ] Logging is turned on
- [ ] There is a well defined process for accessing and searching through logs
- [ ] Logging includes exceptions and stack traces where appropriate
- [ ] Are we sending logs to a remote logging service?

**Error Tracking**

- [ ] Are we tracking errors?
- [ ] Errors can be mapped to stack traces

## UAT checklist

User Acceptance Testing can be a daunting and frustrating experience. Too often, the exercise becomes an ordeal of tight deadlines, stress, and system issues. While UAT will always be a high-effort activity, good preparation, responsiveness, and follow-up will multiply your chances of success.

The bug loop during UAT keeps QC between the UAT team and developers:

```
 +--------------------------+     +-------------+  in scope  +-----------+     +-------------+
 | UAT team logs bug        | --> | QC reviews  | ---------> | DEV fixes | --> | QC verifies |
 | with the UAT label       |     +-------------+            +-----------+     +-------------+
 +--------------------------+            |                                            |
            ^                            | out of scope                               |
            |                            v                                            |
            |                  +----------------------+                               |
            |                  | Log as Change Request|                               |
            |                  +----------------------+                               |
            +---------------------- back to the UAT team to confirm <-----------------+
```

### Before UAT

- [ ] All features are completed by the development team.
- [ ] All features are fully tested by (internal) QC.
- [ ] All features are fully deployed to staging or UAT environment.
- [ ] UAT Plan (Schedule, Role, Communication method,...) should be agreed upon between the Product and Development team

### During UAT

- [ ] All the bugs need to be logged and tag with UAT labels.
- [ ] All the bugs logged by UAT team should be assigned to QC team to review before passing them to DEV.
- [ ] After DEV team have fixed the bugs it should be assigned back to QC to verify before going to UAT team.
- [ ] If the bugs found are not covered by Test Cases of QC team, a new Test Case should be added to the Test Case set.
- [ ] If the bugs found are not in the scope of the original requirements, it should be logged as Change Request.

### After UAT

- [ ] All non-cosmetic defects should be fixed
- [ ] Outstanding defects that are not fixed should be communicated to the UAT team and got their approval
- [ ] All parties need to Sign-off UAT officially via Email/Paper or Jira log...
- [ ] UAT test report should be conducted by UAT/QC team and sent out to all parties

## Frontend UI checklist

Frontend engineering is not just about producing high quality code but also attentive design. Whether you work on a design or transform a design to code, make sure the below checklist is done before you ship.

- Is relative spacing to UI elements as base unit of 4?
- Does your relative spacing match the relative spacing of similar UI elements?
- Does it look good on desktop, tablet, and mobile?
- Are you using existing elements / components where appropriate?
- Are you using the right colors from the design system?
- What happens to text when it gets too long? _(e.g. truncation, wrapping, etc)_
- Are all interactive states accounted for? _(e.g. default, touch, hover, disabled, etc)_
- Are empty states accounted for?
- Are error states accounted for?
- Are loading states accounted for?
- Are we using correct [writing styles](https://material.io/design/communication/writing.html#principles 'https://material.io/design/communication/writing.html#principles') to communicate?
- Are existing patterns being used for similar actions/items? _(e.g. text link vs. secondary button, back arrow vs. back link, tooltip vs. exposed helper copy)_
- Does your icon choice communicate effectively?

### State matrix

For every component that shows data, confirm each state has a design and has been seen in the browser:

| State                  | Check                                                   |
| ---------------------- | ------------------------------------------------------- |
| Default                | Matches the design at desktop, tablet and mobile widths |
| Loading                | Skeleton or spinner, no layout jump when data arrives   |
| Empty                  | Explains what is missing and what to do next            |
| Error                  | Says what went wrong and offers a retry or a way out    |
| Long content           | Truncates or wraps as designed                          |
| Hover, focus, disabled | Visible, and focus works from the keyboard              |

### Read on

- [Tech ecosystem](frontend/tech-ecosystem.md)
- [Code style](frontend/code-style.md)
- [Writting test](frontend/writing-test.md)
- [Logging and monitoring](frontend/logging-monitoring.md)
