---
title: "The monthly delivery report: three questions, one table, three ratings"
description: How the Dwarves delivery team builds the monthly delivery report. One Notion table answers three questions and scores every project on client happiness, lead performance and account performance.
date: 2024-08-01
authors:
  - zlatanpham
tags:
  - delivery
  - report
redirect:
  - /GzOT4w
---

The report exists to answer three questions:

1. **Did we help the client achieve their targets?**
2. How did the team perform?
3. Are there any problems that need to be resolved?

The answers decide how we allocate people, who we assign to which project, and which problems we deal with first.

![A redacted delivery report: ten projects, the importance of each, and three ratings {#fig-delivery-report-sample .live}](assets/conduct-delivery-report-fig1-sample.svg 'A redacted delivery report table. Ten projects, three ratings each, and no rating above 4.')

## What the page looks like

The report is one Notion table with a row per project. The columns are:

- **Important:** High, Medium +, Medium - or Low.
- **Deal types:** Size+, New opportunity, Enterprise or Partnership, as many as apply.
- **Priority:** a flame on the projects that need a decision this month.
- **Client happiness, Lead rating, Account rating:** the three scores.
- **Issues and Resolutions:** a relation to the log of what went wrong and what we did.

The sample above has ten projects. Two are High, two are Medium +, five are Medium - and one is Low. The four flames sit on the four most important rows.

## How to read the ratings

The write-up of this process says the ratings run from 1 to 5. The sample uses half points, and one lead rating is 0. No cell in it reaches 5. Client happiness runs from 2 to 4 and averages 3.1. Lead rating averages 2.2 and account rating averages 2.2. One month and ten projects prove little, but the pattern is plain: we rate our leads and account managers nearly a point below how happy we judge the client to be, and a 3 is a good month.

The sample does not define the points. We read them this way <!-- confirm: proposed anchors, not recorded in the original page -->:

| Score | Client happiness                                                     | Lead and account rating                                    |
| ----- | -------------------------------------------------------------------- | ---------------------------------------------------------- |
| 1     | The client has raised an escalation or missed a target because of us | The lead or account manager missed a commitment this month |
| 3     | Targets met, no surprises                                            | Commitments met, nothing proactive                         |
| 5     | The client expanded scope or referred us                             | The lead or account manager changed the client's outcome   |

We read the 0 on lead rating as "no lead assigned or not rated". <!-- confirm: meaning of 0 -->

## Data gathering

### Artifact collection

Collect the proof of work each project team delivered during the month:

- Demo materials (videos, screenshots)
- Updated project charters, documents, diagrams, and source code
- Logs of roadblocks, issues, and technical debts

From this process, we also observe and gather potential problems, both technical and managerial.

### Team performance

Evaluate the team's performance based on the following criteria:

- Do account managers advocate for and ensure the interests of the client?
- Do tech leads and project managers consult with the client on development matters?
- Do tech leads and project managers ensure delivery quality and effective team management?
- Assess each team member's performance and workload, to be discussed with team leads.

### Project priority

Assess the importance of each project based on its deal size, its potential to open new opportunities and any strategic partnership. The sample shows these as the Important level and the Deal types tags rather than as a weighted formula. <!-- confirm: there is no numeric weighting behind Important -->

## Conducting the report

Once all data is collected, compile the table with highlights for:

- **Project sorting by importance:** rank projects by priority and significance to our overall goals.
- **Client happiness and performance ratings:** rate client satisfaction, lead performance and account performance.
- **Issues and resolutions logs:** document each issue and the resolution we applied.

<!-- needs Han: owner, hours to produce one report, and the decisions the last three reports triggered (reassign, escalate, cut) -->

The [project reports system](/ai-powered-monthly-project-reports) summarizes each project's Discord traffic every month and can feed the artifact collection step. <!-- confirm: that the delivery report uses its output today --> The original screenshot of this page is still available as [the Notion capture](assets/how-to-conduct-delivery-reports_delivery-report-sample.webp).
