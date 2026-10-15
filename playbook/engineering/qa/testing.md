---
title: Test plans, test cases and closure
description: What a test plan and test case contain, plus a test closure checklist and agile QA practices.
date: 2026-10-15
redirect:
  - /HRkHHw
---

## Testing materials

### Test plan

Make sure these items included in your test plan:

- [ ] The components and functions to be tested.
- [ ] The components and functions NOT to be tested.
- [ ] The risks of the project that might impact the test plan.
- [ ] Resource planning and responsibilities.
- [ ] External testing team (For example: UAT).
- [ ] Communication method.

### Test suite/ test case

Test case should includes those information:

| Name                               | Pre-condition                                                     | Test Steps                   | Expected Result              | Requirement Ref                           |
| ---------------------------------- | ----------------------------------------------------------------- | ---------------------------- | ---------------------------- | ----------------------------------------- |
| Brief about TC                     | Pre-condition steps before executing TC                           | Test Case Steps              | Expected result for the step | User Story # or requirement specification |
| Ex: Login successfully with google | User is at login page (<https://staging.fort.d.foundation/login>) | Hit Login with Google button | Login successfully           | User Story 001                            |

An unhappy-path case for the same login page:

| Name                                | Pre-condition                  | Test Steps                                            | Expected Result                         | Requirement Ref |
| ----------------------------------- | ------------------------------ | ----------------------------------------------------- | --------------------------------------- | --------------- |
| Login is refused for a blocked user | User is at login page, blocked | Hit Login with Google button with the blocked account | Error message shown, no session created | User Story 001  |

### Example test plan outline

An illustrative outline for a login feature, following the items above:

- **In scope:** login with Google, logout, session expiry.
- **Out of scope:** password reset (not part of this release).
- **Risks:** the identity provider is unavailable in staging, so use a stubbed provider and say so in the report.
- **Resources:** one QC engineer, one developer for triage.
- **External testing:** UAT with the product team after QC sign-off (see [UAT checklist](UAT.md)).
- **Communication:** defects in the tracker, a daily summary in the project channel.

### Defect

Defect/issue template that we should use: [Issue Template](defect-template.md)

## Test closure checklist

- [ ] 100% Test Scripts executed.
- [ ] 95% pass rate of Test Scripts.
- [ ] No open Critical and High severity defects.
- [ ] 95% of Medium severity defects have been closed.
- [ ] All remaining defects are either cancelled or documented as Change Requests for a future release.
- [ ] All expected and actual results are captured and documented with the test script.
- [ ] All test metrics collected based on reports from defect tracking system.
- [ ] All defects logged in defect tracking system (Jira, Trello,...).
- [ ] Test Closure Memo completed and signed off.

## Best practices for an agile QA process

- [ ] Define an agile QA process (Keep QA result-oriented)
- [ ] Risk analysis
- [ ] Test early and test often (Make Testing an ongoing activity)
- [ ] Do WHITE-BOX vs. BLACK-BOX
- [ ] Automate when feasible
- [ ] As a Development Team (Arrange for demonstrations from developers)
