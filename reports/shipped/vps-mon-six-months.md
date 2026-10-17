---
draft: false
title: "Five sources made 72% of our 5,068 pages: six months of a Worker that watches our jobs"
description: "A Cloudflare Worker has watched our hosts and 193 live job heartbeats since April 2026. This report counts its 5,068 pages, traces each spike to its cause, and records the incidents the monitor taught us."
slug: vps-mon-six-months
kind: field-report
date: 2026-10-18
toc: true
authors:
  - tieubao
tags:
  - monitoring
  - alerting
  - cloudflare
  - incidents
  - operations
---

On 24 April 2026, one day after its first agent went live, our monitor broke itself. Its rate limiter spent the daily Cloudflare KV quota, the ingest path started answering 500, and the host it watched looked silent for 47 minutes. Six months later the same Worker, called vps-mon inside Dwarves, has paged us 5,068 times. Five of its 259 alert sources made 72% of those pages.

![One Worker, three ways in, and who hears the alert](assets/vps-mon-six-months-fig1-hero.svg 'The monitor as it ran on 18 October 2026. The amber box is the part that does most of the work: every job calls home when it finishes, and silence is the alert.')

vps-mon is internal. It lives in a private repository and has no public page, so this report links to none. The pattern is small enough to rebuild, and the last section gives the pieces. What follows is what I learned by reading every alert row the Worker wrote.

## TL;DR

The Worker watches three hosts and about 190 background jobs on two Cloudflare accounts. Its core idea is the heartbeat: a job calls a URL when it finishes, and the Worker pages when the call is late. That idea was right from the start. Several early parts broke on a quota, a probe or a list of names.

Pages concentrate. Five alert sources produced 3,668 of the 5,068 pages: three copies of a log feed that started shipping on 31 August, a host whose daemon list drifted, and a ten-minute cron job with 60 seconds of grace.

| What | Number, as of 18 October 2026 |
| ---- | ----------------------------- |
| Cloudflare accounts running the Worker | 2, each pings the other |
| Host agents | 3: a VPS, a Mac Mini, a laptop |
| Heartbeat rows, enabled | 193 of 267 |
| Heartbeat pings received | about 1.49 million |
| Rows in the job catalog | 185: 134 scheduled, 42 daemons, 9 on-demand |
| Alert rows written | 6,475: 5,068 pages and 1,407 recovery notices |
| Rule firings behind those rows | 61,074 |
| Distinct rules that fired | 133 |
| Incident write-ups | 11 |
| Tool commits, 5 May to 18 October | 858, of which 712 after 1 August |

A page here means a new CRIT or WARN alert row. A row opens at the first firing and absorbs repeats inside the dedup window, which is why 61,074 firings became 6,475 rows. Rows are not incidents: one bad night can write dozens.

Where it runs, from the serving side: when I queried the database for this report, the two always-on hosts had posted a snapshot under two minutes earlier, and the newest ping on the enabled heartbeats was nine seconds old on one account and 64 seconds old on the other.

## What it watches, and how it got there

Three paths feed one Worker. Agents on three hosts post a signed snapshot every two minutes: disk, memory, listeners, daemon state. Each background job gets a heartbeat, a URL it calls at the end of a run. And the Worker pulls: a five-minute cron probes hosts and URLs from Cloudflare's edge and sweeps the heartbeat table for silence, a six-hour pull lists the Worker crons on both accounts, and the agent on the Mac Mini (the Mini below) pushes its launchd inventory once a day.

State lands in D1. KV holds dedup markers and probe counters, and Analytics Engine keeps per-host metrics for 90 days. Alerts go to Discord, one channel per tenant. The second copy of the Worker runs on the company's Cloudflare account and watches company cron jobs and HTTP checks. The two pings each other's liveness heartbeat, so if one dies the other says so. The design stays inside the Cloudflare free plan, and the config budgets its cron triggers against the plan's limit of five. <!-- confirm: both accounts are still on the free plan -->

The build went in layers. Dates come from git history and the database:

| Date, 2026 | Change |
| ---------- | ------ |
| 22 to 23 April | Agent skeleton, then the first host posting end to end |
| 29 April | Second role: the Mac Mini |
| 5 May | Code moved into the tools monorepo |
| 30 May | Company checks and cron heartbeats moved in; the old uptime service retired: 34 monitors, 16 moved, 18 already dead |
| 1 June | Discovery catalog: the Worker lists jobs instead of me listing them |
| 17 August | Agent tick interval doubled, 60 to 120 seconds, to cut traffic |
| 24 August | The laptop joined as a third host |
| 31 August | Agent runtime log lines began shipping as alerts |
| 5 September | Mini jobs regrouped into five stage runners |
| 10 September | Auto-park: a retired job's heartbeat stops paging by itself |

Most of the work came late. Of 858 commits to the tool since the move into the monorepo, 712 landed after 1 August, when the estate grew faster than the monitor's habits.

## Three kinds of job

A background job is scheduled, a daemon, or on-demand, and the kind decides what turns it green.

![Three kinds of job and the signal that turns each one green](assets/vps-mon-six-months-fig2-kinds.svg 'A scheduled job goes green through a heartbeat, a daemon through a launchd pin, probe or link, and an on-demand job needs nothing.')

The rule I wish I had started with: reconcile by kind, never by name alone. A scheduled job matches a heartbeat by its normalized name (lowercase, every non-alphanumeric character stripped). An exact match is green, a near match is amber, and no match is a red gap. A daemon never matches a heartbeat at all. It matches a launchd label the agent read from disk, because a heartbeat on something that runs forever says nothing.

The kind comes from the plist. A timer is scheduled, `KeepAlive` is a daemon, and a plist with neither is on-demand. That last rule has a trap. A job set to run at load and then exit is a one-shot, and a monitor that scores a label up only while it runs would read it down forever once it finishes. On 10 August a daemon was about to become a one-shot, and the change would have paged a false CRIT until its monitor was repointed. Converting a daemon changes what its monitor can see, so the monitor moves in the same commit.

On the Mini, scheduled jobs are stages of five LaunchAgent runners that tick every 300 seconds. Each stage keeps its own cadence through a stamp file and pings its own heartbeat. The catalog rolls a runner up to its worst stage: 61 stage rows today. I got the grouping wrong once. On 5 September I put the stages into one bucket per owner, and I threw that out the same day for five groups by function, because grouping by owner hid which function had broken.

## From a missed beat to a page

The rule is one line of arithmetic. A heartbeat is silent when `now - last_ping > interval + grace`, and the five-minute sweep evaluates it. Detection time is a setting, and measurement only confirms it.

The page lands between about one and four intervals after the last ping, depending on the grace. I took the first silence alert of every episode (the job's first, or one that follows a recovery) and read how long the job had been quiet:

| Job interval | Episodes | Median silence before the page | As a multiple of the interval |
| ------------ | -------- | ------------------------------ | ----------------------------- |
| 5 minutes, my jobs | 38 | 18 minutes | 3.7 |
| 10 minutes, company jobs | 787 | 13 minutes | 1.3 |
| 30 minutes, my jobs | 167 | 63 minutes | 2.1 |
| 1 hour, my jobs | 51 | 2.0 hours | 2.0 |
| 1 day, my jobs | 58 | 28 hours | 1.2 |

The half-hour jobs I set up mostly carry a grace of one full interval, so they page after an hour. The company's ten-minute jobs carry little grace and page at 13 minutes, though most of those 787 episodes belong to the one noisy job in the next section. For a host, the agent-silent rule waits 10 minutes plus the sweep, and the first row of the 11 May incident below landed 14.5 minutes after the last post.

Three more rules keep a page from becoming a flood. The first firing posts. Repeats inside 15 minutes only bump a counter. Absence rules (a silent job, a silent host) wait 23 hours before they post again, one hour short of the daily nag. A laptop that sleeps is an intermittent host: absence is normal, and its jobs are judged only after it has stayed awake for a streak.

Here is the whole contract for a job, which anyone can rebuild:

```bash
# last line of the job, after the work succeeded
curl -fsS -m 10 "$HEARTBEAT_URL" >/dev/null
```

```sql
-- the Worker's silence check, in the sweep (D1 is SQLite)
SELECT hb_id FROM heartbeats
 WHERE enabled = 1 AND last_ping_at IS NOT NULL
   AND unixepoch() - last_ping_at > interval_sec + grace_sec;
```

## Where the 5,068 pages came from

![New paging alert rows per week, all pages against silence pages {#fig-weekly .live}](assets/vps-mon-six-months-fig4-weekly.svg 'Weekly new CRIT and WARN rows across both instances, 26 ISO weeks. The amber point is the week log lines started shipping. The shaded band between the two lines is log lines and other rules.')

The chart has one broad hump and one spike, and each traces to a single source.

**May: a list of names that drifted.** The Mac Mini agent checks a hand-kept list of launchd labels that must be running. May wrote 298 daemon-down rows and 4,282 firings for it. The two biggest days, 94 rows on 28 May and 42 on 29 May, came from a service that had been folded into another one: the list kept the old name, and the rule fired for a daemon that no longer existed. June wrote one row. The list is now six supervisor daemons, and the catalog's discovery covers everything else.

**June: one cron job.** A single ten-minute job on the company instance wrote 603 silence rows in June and 830 overall, 47% of every heartbeat-silent row in the database. Its heartbeat had 60 seconds of grace on a 600-second cadence, so one late tick paged. The records do not settle whether the job was failing or the grace was too tight. The heartbeat was disabled later.

**31 August: a new feed.** Agent runtime log lines began shipping as alerts: WARN and ERROR lines from the agents that answer in our chat rooms. The week of 31 August wrote 726 pages, 567 of them log lines. Silence rows that week were 122, close to the 109 of the week before. The spike came from new coverage, and the log feed for the company's agents alone wrote 1,494 pages, 1,172 of them in September.

**Six weeks down.** By the week of 12 October the total was 192: 90 log lines, 74 silence rows and 28 from everything else. Part of the fall is filters in the shipper. It now drops retry loops that heal themselves in seconds (a websocket reconnect, a fallback address walk) and holds a Discord reconnect storm until the gateway's state file says it recovered. I did not date each filter, so I cannot split the fall between them. The same weeks carried the 8 September hygiene sweep, the 10 September auto-park and the 19 September empty-tick guard, all covered below. Meanwhile the number of heartbeat rows nearly doubled, from 138 on 31 August to 267 on 18 October, and weekly silence rows went from 109 to 74.

| Source | Pages | What it was |
| ------ | ----- | ----------- |
| Log feed, the company's agents | 1,494 | Started 31 August, one rule per logger |
| The Mac Mini itself | 896 | 375 daemon-down, 176 disk-crit, 173 agent-silent, 71 memory pressure |
| One ten-minute cron job | 830 | 603 of them in June |
| Log feed, my own agents | 282 | Same shipper, second tenant |
| Log feed, a third tenant | 166 | Same shipper, third tenant |

By kind, the 5,068 pages split into 2,296 silence pages (45%), 1,922 log-line pages (38%) and 850 from everything else: disk, memory, HTTP checks, job-reported events (17%).

## Eleven incidents, six lessons

![The eleven incident write-ups on a dated axis](assets/vps-mon-six-months-fig3-incidents.svg 'Letters match the paragraphs below. Amber marks E, the one that silenced both hosts at once.')

Each write-up has a timeline, the hypotheses I ruled out and the fix. Six lessons survive across them.

**A quota is a design input (A, F).** The first rate limiter wrote one KV counter per accepted ingest. At one request a minute that is about 1,440 puts a day per host against a free-tier ceiling of 1,000. Cloudflare emailed on 24 April, KV answered 429, and the ingest path turned that into 500s for 47 minutes. The fix was the Workers rate-limit binding, which writes nothing to KV. Then on 2 June I did it again: a rule persisted the reported daemon labels on every ingest, about 1,484 writes a day for a value that almost never changed. The second fix was write-on-change. Any per-ingest write is a quota hazard, and I now treat the free-tier numbers as part of the spec.

**A retry buffer fights a replay gate (B).** The agent buffered failed posts and drained them on later ticks. The Worker rejects any post older than 120 seconds, as replay protection. On 24 April the buffer sent up to eleven posts per tick into a limit of three a minute, entries aged past the gate, every one came back 401, and the drain loop stopped on the first failure. The buffer sat at its cap of 60 and the host looked silent for two hours. I capped the flush and discarded stale entries. Then on 17 August I doubled the tick to 120 seconds, so a buffered entry could never arrive young enough, and on 6 September I deleted the buffer. A lost tick costs one data point. The silence rule is the safety net.

**One neighbor can spend your quota (E).** Both hosts went silent within 20 seconds of each other on 11 May and stayed silent for about 9.5 hours. The cause was a forgotten Worker from 2021 on the same account, drawing about 298,000 requests a day from scrapers. The free plan caps requests to workers.dev subdomains at 100,000 a day across the whole account, so the edge answered 429 to every agent before my Worker ran. Deleting the forgotten Worker dropped the daily baseline from about 307,000 to about 9,000. The monitor survived the way I hoped: its cron path is metered separately, so the sweep still ran, saw nothing arriving and paged. D1 holds the first agent-silent row 14.5 minutes after the last post. The write-up says I saw the page nine hours later, and the records do not say whether the first Discord posts were delivered. <!-- confirm: were the 14:25 UTC Discord posts delivered? --> Two unrelated hosts failing within seconds of each other points upstream of both.

**Probe from where the probe can see (C, G).** I seeded a Tailscale address (a private range) as one host's probe target. The Worker probes from Cloudflare's edge, which cannot route there, so `host-unreachable` re-fired every 15 minutes for a healthy host. The provisioner now refuses private ranges, and the prober refuses them too. On 10 June the same flaw ran the other way: a single five-second connect attempt turned packet loss on the edge-to-VPS path into two failures in a row, and the host that had 36 days of uptime paged as down. The fix was one more attempt inside the same cycle, shipped the same day.

**Empty is not absent (H, J).** On 15 July, two container-down CRITs fired on healthy containers. The agent runs as a daemon account whose home directory holds no Docker context, so `docker ps` failed, the collector returned an empty list, and the rules read empty as missing. It surfaced when the container runtime restarted two days earlier and removed the socket the fallback context had used. The fix pinned the Docker socket in the daemon's environment, and the agent now sends a separate `docker_reachable` flag, which suppresses the per-container rules and fires one CRIT of its own. On 19 September one tick came back with every shell-out empty: five daemons read not-loaded, Docker read unreachable, and a retired log counter diffed its lifetime total against a fresh baseline. Three CRITs came from one envelope and the next tick was clean. When five unrelated probes fail together, suspect the runner before the services. A retry inside the tick fixed it. My own tooling had the same bug: an audit script read the empty output of a failed query as a pass and called a whole instance clean. The query helper now exits 3 and says BLOCKED when it could not run, so a failed query never reads as zero rows.

**Default-deny looks like an outage (D).** The dashboard stopped answering on 6 May. Its Cloudflare Access app existed with zero policies, which Access treats as deny for everyone. I now create every Access artifact through the API, one request each, from a table of stable IDs.

## Pages that told the truth about the wrong thing

Two write-ups are about alerts that were right and still useless.

On 8 September I went after three flappers that were training me to ignore the channel. Only one was a monitor defect: a macOS DarkWake (a brief, screen-off wake) defeated the laptop's intermittent-host gate and produced 28 alerts in 48 hours. The second came with a brief that said the job's interval was half its real cadence. The data refuted it. The job ticked every 900 seconds as scheduled (258 ticks, median gap 906) and skipped its ping whenever a fetch failed. With grace equal to one interval, one failed tick paged after 31 minutes, and 10 failures on 7 September made eight pages. I did not widen the grace, because that would have hidden a real 10% failure rate. The better fix is to ping on run and report health as a separate event, since liveness and health are two questions. The third flapper had been called by design three times by a triage agent. It was a second heartbeat that nobody had provisioned, a real gap that the verdict would have muted.

On 9 to 11 October about 20 tickets traced to drift and not to outages. A job moved hosts and its heartbeat stayed behind. Two retired jobs kept live rows and fired more than 300 times each. A new stage shipped without a heartbeat and showed as a gap for the whole runner. Two rules were miscalibrated: the never-pinged WARN fired after 7 days even for a monthly job, and an hourly job with 1,800 seconds of grace paged after one missed tick. The rest healed on their own, mostly short egress blips and one scheduled router reboot that dropped every agent gateway's Discord connection at once. A move or a retirement is not finished until its heartbeat moves or parks. The verbs for it already existed (`retire-job`, `retire-heartbeat`, `wire-daemon-pin`), and the moves skipped them. A grace window needs the job's own cadence, and a fixed constant cannot supply that.

## What not to build again

- **A retry buffer behind a replay gate.** Covered above. The silence rule does the job for free.
- **A hand-kept list as the roster.** It wrote 298 daemon rows in May, and two days of them were for a service that no longer existed. Discovery from the plists, the Cloudflare API and the stage roster is the roster now, and a reconcile rule says what each job needs.
- **Grouping jobs by owner.** I built it on 5 September and dissolved it the same day. Function is the grouping that survives.
- **Ping only on success.** It collapses liveness and health into one bit. A failed run that still pings, plus a WARN event, says what broke.
- **A write on the per-minute path.** Twice was enough.
- **Trusting empty output.** Every tool I own that reads a command or a query now has a separate way to say "could not run".

## Limits

- **Silence is the only signal a heartbeat carries.** A job that pings and does nothing stays green. Health needs the event route, and few of my jobs use it yet.
- **I have no false-positive rate.** An alert row does not record whether a human found a real fault. The closest proxy was silence pages that recovered within an hour, but the recovery rule changed over the six months, so the series does not compare across them.
- **Detection delay is configured.** The table above is median behavior of settings I chose, so I would not quote it as the Worker's speed.
- **Cloudflare is the single vendor.** The two accounts guard each other against an account-level fault, such as the cap in incident E. A Cloudflare-wide outage would silence both, and I run no watcher outside it. <!-- confirm: no third-party watcher outside Cloudflare -->
- **Free-plan numbers are the envelope.** KV writes, cron triggers and workers.dev requests all have daily caps, and three of the eleven incidents came from hitting one.

## Rebuild the pattern

vps-mon is internal and I have published no tool to clone. The pieces above are the whole design: a table of heartbeats with an interval and a grace, a URL per job, one sweep every five minutes, a dedup marker per alert, and a place to send the page. This checklist is the part I would hand to the next person:

```text
[ ] Every scheduled job calls its heartbeat as the last line of a successful run.
[ ] Grace = one full missed tick plus the job's slowest normal run. Never a default.
[ ] Health problems go out as events. A failed run still pings.
[ ] A daemon is watched by label or by probe, never by heartbeat.
[ ] A one-shot is on-demand. If something depends on it, link it to that something.
[ ] Moving or retiring a job moves or parks its heartbeat in the same change.
[ ] No write to a free-tier store on the per-minute path unless the value changed.
[ ] A checker that cannot run says BLOCKED, never zero rows.
[ ] When two unrelated hosts go quiet together, check the shared upstream first.
```

The generic monitoring notes this vault once carried are gone on purpose, and this report replaces them. The one that stays is a prompt template for metrics planning, [LLM prompt for metrics planning](../commentary/metrics-planning-prompt.md). The publish pipeline that serves this page has its own reports: [Memo, rebuilt](memo-rebuilt.md) and [the deploy pipeline formula](deploy-pipeline-formula.md).
