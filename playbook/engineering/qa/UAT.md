---
title: UAT checklist
description: A before, during and after checklist for running user acceptance testing with the product team.
date: null
redirect:
  - /JuuhaQ
---

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

## Before UAT

- [ ] All features are completed by the development team.
- [ ] All features are fully tested by (internal) QC.
- [ ] All features are fully deployed to staging or UAT environment.
- [ ] UAT Plan (Schedule, Role, Communication method,...) should be agreed upon between the Product and Development team

## During UAT

- [ ] All the bugs need to be logged and tag with UAT labels.
- [ ] All the bugs logged by UAT team should be assigned to QC team to review before passing them to DEV.
- [ ] After DEV team have fixed the bugs it should be assigned back to QC to verify before going to UAT team.
- [ ] If the bugs found are not covered by Test Cases of QC team, a new Test Case should be added to the Test Case set.
- [ ] If the bugs found are not in the scope of the original requirements, it should be logged as Change Request.

## After UAT

- [ ] All non-cosmetic defects should be fixed
- [ ] Outstanding defects that are not fixed should be communicated to the UAT team and got their approval
- [ ] All parties need to Sign-off UAT officially via Email/Paper or Jira log...
- [ ] UAT test report should be conducted by UAT/QC team and sent out to all parties
