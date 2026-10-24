---
draft: false
title: "The Go bet worked, then we tried to double the team"
description: "A hindsight report on Dwarves' Go bet: headcount from 2015 to 2024, 43 start dates in four quarters, who stayed past a year, and the hiring rules we changed afterwards. Aggregates from our own records."
slug: company-scaling
kind: field-report
date: 2026-10-18
toc: true
authors:
  - tieubao
tags:
  - management
  - hiring
  - golang
  - growth
  - lessons-learned
redirect:
  - /S2nKqG
  - /XqSkkA
  - /consulting/navigate/business-correction
---

In August 2022 our newsletter called Dwarves "a team of 80s". In January 2023 the summit write-up counted just over 100. In June 2024 a team-session summary counted 50. This report is about what sits between those three numbers.

I made the language bet in 2015 and it held. Go appears on 14 of the 50 projects in our Notion record that carry a stack tag, and none of those 14 closed as failed. The hiring around the bet is the part I would do differently. In 2022 we set out to double the team and reached 1.5 times. The contractor records carry 43 start dates in the four quarters from October 2021 to September 2022, 22 of them in a single quarter. Six of the 43 left inside a year. Of the 51 start dates before that window, none did, though 16 of those have no end date either.

![Headcount as we published it, 2015 to 2024 {#fig-headcount .live}](assets/company-scaling-fig1-headcount.svg 'Every dot is a headcount we printed at the time. The highlight marks the hiring window and the peak. The dashed stretches have no count we trust.')

## TL;DR

Go was the right bet and the Go hires were not the problem. The window hired across stacks: 11 of the 43 start dates carry a Go tag, and the six people who left early carry none. What hurt was volume. One quarter brought seven times the usual intake, into a hiring rule we had written 15 months earlier.

| Question                   | Answer                                                                                             | Where it comes from                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Did the language bet hold? | Yes. Go is on 14 of 50 tagged projects, 0 failed. Blockchain failed 3 of 14.                       | Notion projects record                                   |
| How big was the surge?     | 43 start dates in Oct 2021 to Sep 2022. The median quarter from 2019 to 2023 has 3.                | Notion contractor records, 114 of 275 carry a start date |
| Who left early?            | 6 of 43 inside a year, 5 inside six months. None carries a Go tag.                                 | same records                                             |
| Is that a lot?             | Against 0 of 51 before the window, yes. The 21 records with no end date keep the real figure open. | same records                                             |
| What did we change?        | Peer approval, a 60-day ramp, a four-stage interview, project screening.                           | our newsletters, 2021 to 2022                            |

## The bet

In 2015 the first technical choices at Dwarves were Go, Docker and Ansible, and we moved off Ruby. I was an engineer who studied languages. Go fixed many pain points and looked right for concurrent systems. I also helped build the Golang Vietnam community, and that gave me real-world signals. The 17th Golang meetup launched in July 2020, and in 2023 a free Go course drew about 90 registrations for 30 seats.

The market signal arrived as a client request. Our [beGroup case study](../../case-studies/begroup.md) says that in 2018 building an in-house team of experienced Golang developers on short notice was particularly challenging in Vietnam. We put an augmented team of six developers on their beCorporate product, and beGroup described itself as "one of the first teams in Vietnam that picked up Golang as the strategic language". Demand for Go engineers had outrun supply, and we had the engineers.

We later wrote the method down as [forming a market thesis](./navigate-ledger.md): use data, add informed gut, and watch the community. Go is the case I know best, and the Notion record lets me count the result.

| Stack tag  | Projects | Closed or done | Active | Failed |
| ---------- | -------: | -------------: | -----: | -----: |
| React      |       16 |             14 |      2 |      0 |
| Golang     |       14 |             13 |      1 |      0 |
| Blockchain |       14 |             10 |      1 |      3 |
| AI         |       14 |              9 |      3 |      2 |

Fifty of 63 projects carry a stack tag, and a project can carry several, so the rows overlap. Five of the 14 Go projects also carry Blockchain. Across all 63 projects, 9 failed, and none of the 9 is a Go project.

Two things temper the verdict. First, Go was never our only bet. In 2018 we also bet on blockchain, and by 2021 that squad had 20 people. Blockchain failed 3 of its 14 projects. Second, demand has moved. In October 2026, 1 of the 7 projects marked Active in Notion lists Go, against 3 of 12 in June.

## The surge in numbers

The table lists every headcount we published, in the words of the page that printed it.

| When        | Count                                                         | Source page              |
| ----------- | ------------------------------------------------------------- | ------------------------ |
| End of 2018 | about 30, up from 15                                          | 2018 in review           |
| End of 2019 | about 50                                                      | 2019 in review           |
| End of 2020 | "the 50s"                                                     | 2020 in review           |
| Dec 2021    | 60 engineers                                                  | 2021 in review           |
| Mar 2022    | 70 engineers and designers, plus a handful of operating staff | hiring stages newsletter |
| Aug 2022    | "a team of 80s", 46% growth                                   | the next leading chairs  |
| Jan 2023    | just over 100, 1.5x growth                                    | summit 2022 write-up     |
| Jun 2024    | 50 members                                                    | team-session summary     |

The first wave ran from 2018 to 2019. The team went from 15 to about 50 in two years, and the beGroup request landed in the first of them. Then March 2020 arrived. We called it survival mode, wrote "no layoffs on the ground", and decided it was not the right time to scale. In July 2020 we wrote the rule that matters here. Don't hire because you feel like it. Hire when quality has dropped and "things get hurt".

The second wave ran from late 2021 to 2022. Sixty engineers in December 2021 became 70 in March and the 80s in August. Our own year-end write-up for 2021 listed "scaling up" as a goal. The summit write-up later called doubling the team our 2022 goal, and recorded the funnel: more than 400 applications, 91 interviews, 29 people onboarded. The team grew 1.5 times and fell short of the goal.

Between January 2023 and June 2024 the count halved. I have no record of a single day of cuts. The records I can read show projects ending and people leaving.

## What the surge broke

![Start dates per quarter, 2019 to 2023 {#fig-starts}](assets/company-scaling-fig2-starts.svg 'Contractor records with a start date. The median quarter has 3. The highlighted bar is the second quarter of 2022.')

The Notion contractor table is the only roster I can query by date. It holds 275 records, and 114 carry a start date. Between 2019 and 2023 the median quarter has 3 of them. The fourth quarter of 2021 has 11 and the second quarter of 2022 has 22.

The window held 43 start dates. Fifteen carry a Backend position. By stack, 11 carry Go, 8 NodeJS, 8 React and 4 Blockchain. The Go share of dated starts fell as intake rose: 4 of 11 in 2019, 4 of 11 in 2020, 6 of 24 in 2021, 8 of 35 in 2022. The surge came from hiring in every direction at once.

![Who stayed past a year, by cohort {#fig-stayed}](assets/company-scaling-fig3-stayed.svg 'Two cohorts from the same table. The highlight marks people who left in under a year.')

| Cohort               | Starts | Left in under a year | Ended after a year or more | Still active | Ended, no end date |
| -------------------- | -----: | -------------------: | -------------------------: | -----------: | -----------------: |
| Before Oct 2021      |     51 |                    0 |                         24 |           11 |                 16 |
| Oct 2021 to Sep 2022 |     43 |                    6 |                         13 |            3 |                 21 |

Six of the 43 left inside a year, and five of those inside six months. Three left within 63 days, around the time the 60-day onboarding plan ends. The longest of the six stayed 289 days. They span six different roles, and none carries a Go tag. Four have no stack tag at all, so I cannot rule Go out for them.

The 11 Go hires in the window tell a different story. The six with an end date stayed at least 921 days, about two and a half years. One is still active and four have no end date. I read it as a volume problem across every stack, with the language bet intact.

Tenure only catches the people who left fast. A wrong hire who stayed three years and lowered a team looks like a success in this table. The 2025 note says quality dropped and "we spent months dealing with the aftermath". No field in Notion measures either claim. The months of cleanup, and any client issue it caused, are not in the records I can publish.

## The correction

In May 2025 we wrote the correction down as [business correction](../../consulting/navigate/business-correction.md), and that note now lives here. It starts from one idea: teams have a life. A team forms around a goal, fights, settles, performs, and ends when the goal stops being valid. Correction mostly happens at the end, and sometimes earlier when the market moves.

It names three signs that a goal has stopped being valid. The table sets each beside what our records show.

| Sign                 | What the note asks                     | What we saw                                                                                                                                                                                                        |
| -------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Demand shifts        | Are clients asking for something else? | An October 2024 team session recorded that blockchain "might have moved a bit out of the spotlight" and the market was going sideways. In 2024 the research lab began AI collaborations with three named partners. |
| Profitability dips   | Does the team cost more than it earns? | The records I can publish carry no margin figure.                                                                                                                                                                  |
| Tech relevance fades | Is the tech losing traction?           | Go is on 14 of 50 tagged projects. Blockchain failed 3 of 14.                                                                                                                                                      |

The note then asks two things of leaders. Check the team's competency honestly, on tech skill, adaptability and energy. And support people before you downsize: training, a mentor, a second chance. When downsizing is the answer, be transparent and respectful. The earlier [competency check](../../consulting/navigate/competency-check.md) asks the forward-looking questions that start this off, such as what share of the team can pick up the next wave.

![Ten dated decisions on hiring and intake {#fig-decisions}](assets/company-scaling-fig4-decisions.svg 'Each date is the date printed on the page that records the decision. The highlight is the rule from July 2020.')

The decisions run in order in Fig. 4. The rule from July 2020 sits fifteen months before the surge. Everything else landed during it or after. October 2021 added four tests for new projects. December 2021 added a 60-day plan for new hires. March 2022 fixed the interview at four stages and 1 hour 50 minutes of a candidate's time, with other engineers in the room. In August 2022 we moved probation approval to the team: three upvotes, as described in [You need 3 upvotes to pass probation](../../essays/passing-the-probation-get-3-upvotes.md). Our 2022 review says approval "happens when someone is accepted by the team, not by management".

## What changed in hiring

| Area           | What we do now                                                                                                  | Since    |
| -------------- | --------------------------------------------------------------------------------------------------------------- | -------- |
| Approval       | The team approves: 3 upvotes out of 4 groups (project, chapter, mentor, social)                                 | Aug 2022 |
| Interview      | Tech capability first, few stock questions, engineers in the room, candidates ask back; 1h50 in all             | Mar 2022 |
| New hires      | A 60-day plan. Before it, onboarding was not scheduled and new hires took too long to reach a project           | Dec 2021 |
| New projects   | Four tests, with engineers heard before we say yes. The old trap was taking any project that pays               | Oct 2021 |
| Late to a tech | Hire one person with the knowledge into the labs team and grow from there                                       | May 2025 |
| Calibration    | Research mindset, evidence of sharing, long-term thinking, as in [role strategy](../../essays/role-strategy.md) | May 2025 |

The first four rows come from our 2021 and 2022 newsletters. The labs-team row comes from [grow our talent pool](../../consulting/navigate/talent-pool.md).

## Three rules, and where each one fails

These are my rules today. I have not yet tested any of them across a second boom.

**Hire when quality drops, and hire for mindset.** Skills can be taught and curiosity is hard to teach. The rule fails on timing. Quality drops late, and a hire lands later still: our funnel took 400 applications down to 29 people, and the 60-day plan exists because new hires took too long to reach a project. By the time you hire, the market that hurt you may have moved.

**Let the team approve the hire.** Three upvotes protect the culture that made the company worth joining. They check fit and say nothing about skill. They also arrive late. Three of the six early leavers were gone within 63 days, which may be before a vote happened.

**Say no to the project that needs a surge.** Better to turn work down than to dilute a foundation, and the 2025 note says so. The price is the revenue we did not take, and I have not measured it.

The older note also held advice I still use. Scale research before the client-facing team, and turn insight into frameworks and tools that serve many clients, so growth does not mean more billable hours. When you fall into the trap, leadership has to name it and act on it quickly. I could not find the date leadership first named the problem. The first written change inside the window is October 2021, and the 2025 notes are the first place the problem has a name.

## A check you can run on your own roster

The same five checks work on any people table that has start and end dates.

| Check                                                               | What a problem looks like                                  |
| ------------------------------------------------------------------- | ---------------------------------------------------------- |
| Starts per quarter against your own median                          | One quarter above 3 times the median                       |
| Share of that cohort leaving inside a year, against earlier cohorts | A cohort that leaves where earlier ones stayed             |
| Share of the new stack in the cohort, against its earlier share     | A share that falls while intake rises                      |
| Applications, interviews and starts in the same period              | Starts far below the goal you set                          |
| Records with no end date                                            | Any count above zero, because they bound every other claim |

```sql
select date_trunc('quarter', start_date) as quarter,
       count(*) as starts,
       count(*) filter (where end_date < start_date + interval '12 months') as left_in_a_year,
       count(*) filter (where end_date is null and status = 'inactive') as no_end_date
from people
group by 1
order by 1;
```

## Limits

- **Coverage.** 114 of 275 contractor records carry a start date, and 57 carry an end date. Most records came from two imports, June 2021 and December 2025, so people who left before 2021 may be missing. The comparison with earlier cohorts leans on survivors.
- **Counts differ by source.** Our 2022 write-up counted 29 new teammates. The contractor records carry 35 start dates in 2022, and they include operations and design roles.
- **Two headcounts disagree.** A 2018 anniversary post gave 40. The contemporaneous year-end note said about 30. I used the second. In 2022 the "80th Dwarf" and "just over 100" appear in write-ups ten days apart, and I do not know the definition behind each.
- **The funnel.** The 2022 summit write-up gave the hire rate as 0.07%. Twenty-nine of 400 is about 7%.
- **Project dates.** The projects record carries no start dates, so Go cannot be charted over time. The Go counts are lifetime counts.
- **Failed.** I report the status as the record has it and do not know the exact test behind it.
- **A later cohort.** The 20 start dates after September 2022 show 11 leaving inside a year, almost all of them 2025 and 2026 starts who left between late 2025 and 2026. That is a different story, and it is not in this report.
- **Money.** I give no cost in currency.

## Where the notes went

The business correction note is now a draft, and its URLs, including the short code, redirect to this page. The forming market thesis note now lives inside the [navigate ledger](./navigate-ledger.md), which keeps the method; this page holds the Go case. Several navigate pages still link to the business correction note, and those links now land here.

| Old page                                      | What survived here                                                                      |
| --------------------------------------------- | --------------------------------------------------------------------------------------- |
| Scale smart: Grow big but stay research-first | The story, the traps and the three rules, now checked against records                   |
| Business correction                           | The team lifecycle, the three signs, the competency check and support before downsizing |
| Forming market thesis, the Golang case        | The 2015 bet, the signals and the verdict                                               |
