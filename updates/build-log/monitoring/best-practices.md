---
title: Monitoring best practices
description: Hard-learned lessons from building monitoring systems in production. We share common mistakes to avoid and practical strategies for growing your monitoring capabilities over time.
authors:
  - tieubao
date: 2025-05-14
tags:
  - monitoring
  - best-practices
---

Building effective monitoring systems is full of traps. We've fallen into most of them, and we've learned valuable lessons along the way. Here are the biggest mistakes we've encountered and the practices that actually work in production.

## Common mistakes we've learned from

Every monitoring system starts with good intentions. But certain patterns tend to cause problems down the road. Here's what to watch out for.

### Monitoring everything

More metrics don't automatically mean better monitoring. Too many metrics create noise that hides the important signals. Focus on metrics that directly relate to user experience or system health.

**Rule of thumb:** If you can't explain why a metric matters in one sentence, you probably don't need it.

We've seen dashboards with hundreds of charts that nobody looks at. Meanwhile, the critical metrics get buried in the noise. Start with what matters most to your users, then add complexity only when you need it.

### Alerting on everything

Alert fatigue is real. When every minor blip triggers an alert, people start ignoring all alerts. Reserve alerts for conditions that require immediate human intervention.

**Good alert:** "Website is down for all users"
**Bad alert:** "CPU usage exceeded 70% for 30 seconds"

The test for a good alert: would you be okay getting woken up at 3 AM for this? If not, it's probably not alert-worthy.

### Building for the wrong scale

Don't over-engineer your monitoring system. A simple log file might be perfectly adequate for your current needs. You can always upgrade later when you actually need the complexity.

**Build for your current scale, not your imagined future scale.**

We've seen teams spend months setting up complex distributed monitoring for applications that get 100 requests per day. Start simple and evolve based on actual need.

### Ignoring the correlation problem

Collecting metrics, logs, and traces separately is only half the battle. The real value comes from connecting related data during an incident. Plan for correlation from the beginning by including request IDs and other identifiers in all your telemetry.

Without correlation, you're solving puzzles with pieces from different boxes. When something goes wrong, you want to quickly connect the dots between different data sources.

### Forgetting about the human element

Monitoring systems are only as good as the people using them. If your team doesn't understand how to interpret the data or what actions to take, even the best monitoring setup won't help.

**Good monitoring includes training and documentation.** Make sure everyone knows how to use your monitoring tools and what to do when alerts fire.

![](assets/monitoring-common-mistake.png)
## Practices that actually work

Based on our experience, here are the practices that lead to successful monitoring systems:

### Start with what breaks most often

Your first monitoring efforts should focus on your most common failure modes. If your database usually breaks first, start there. If network issues are your biggest problem, monitor network health.

**Monitor your actual pain points, not theoretical ones.**

### Use the 80/20 rule

Focus on the 20% of metrics that give you 80% of the insight you need. For most applications, this includes:

- Uptime and availability
- Response times
- Error rates
- Resource utilization (CPU, memory, disk)

Everything else can wait until you have a solid foundation.

### Make dashboards tell a story

Good dashboards guide you through an investigation. They should answer questions in logical order:

1. Is there a problem?
2. How big is the problem?
3. Where is the problem?
4. What might be causing it?

Arrange your visualizations to follow this flow.

### Plan for integration from day one

Monitoring tools work best when they work together. Before choosing a tool, consider how it will integrate with your existing setup. Can you correlate data between tools? Do you need to maintain multiple dashboards?

**Avoid tool sprawl.** Three tools that integrate well beat six tools that work in isolation.

### Test your monitoring system

Your monitoring system is critical infrastructure. Test it regularly to make sure it's working correctly. This includes:

- Verifying that alerts fire when they should
- Checking that dashboards show accurate data
- Confirming that log searches return expected results

**If your monitoring system breaks, you won't know your application is broken either.**

## Technical implementation practices

When you're ready to build or improve your monitoring system, these technical practices will save you time and headaches.

### Design for modularity and loose coupling

A modular architecture allows you to scale, maintain, and extend your system easily. Each component should operate independently and communicate through well-defined interfaces.

**Key components to separate:**

- **Test runners** that execute synthetic tests (like Playwright scripts)
- **Data storage** for metrics and detailed history
- **Visualization layer** for dashboards and charts
- **API layer** that connects everything together

**Example:** Your test runner pushes metrics to Prometheus via HTTP, Grafana queries Prometheus for charts, and everything communicates through APIs rather than direct database connections.

### Choose the right storage for each data type

Different types of monitoring data have different storage requirements. Don't try to force everything into one database.

**Time-series databases** (like Prometheus) excel at storing metrics with timestamps. They're optimized for the queries you'll actually run: "Show me response times over the last 24 hours."

**Relational databases** (like PostgreSQL) work well for detailed event history and complex queries. Use them when you need to store rich context about test results or incidents.

**Log aggregation systems** (like Loki) are designed for searching and correlating text-based events.

**Match your storage to your query patterns.** If you're mostly looking at trends over time, use a time-series database. If you need to search detailed event data, use a logging system.

### Standardize metrics and labels

Consistent naming makes your monitoring system much easier to use. Follow established conventions and stick to them.

**Use Prometheus naming conventions:**

- `http_request_duration_seconds` for timing metrics
- `http_requests_total` for counters
- `active_connections` for gauges

**Add context with labels:**

```
http_request_duration_seconds{endpoint="/api/posts", region="us-east-1"}
site_up{endpoint="/", region="eu-west-1"}
```

Labels let you filter and aggregate data in powerful ways. You can show response times for specific endpoints or compare performance across regions.

### Plan for scale and reliability

Your monitoring system needs to be more reliable than the systems it monitors. If your monitoring breaks, you're flying blind.

**Horizontal scaling:** Use containerized platforms like Kubernetes to scale test execution across multiple nodes. This also provides redundancy if individual nodes fail.

**Geographic distribution:** Run synthetic tests from multiple locations to get a global view of performance and reduce false positives from local network issues.

**High availability storage:** Use replicated setups for critical data stores. Losing your monitoring history during an incident is particularly painful.

**Rate limiting:** Don't let your monitoring overwhelm the systems you're monitoring. Synthetic tests should simulate realistic user behavior, not stress test your infrastructure.

### Build user-friendly visualizations

Your monitoring data is only valuable if people can understand and act on it. Invest in clear, intuitive dashboards.

**Dashboard design principles:**

- Show the most important information prominently
- Use colors meaningfully (red for problems, green for healthy)
- Include both current status and historical trends
- Make it easy to drill down from overview to details

**Grafana best practices:**

- Create separate dashboards for different audiences (executives vs. engineers)
- Include links to relevant logs or traces in your charts
- Add annotations for deployments and known issues
- Use template variables to make dashboards flexible

### Implement proactive alerting

Alerts should help you catch problems before they impact users. But poorly designed alerts create more problems than they solve.

**Good alerting rules:**

- Focus on user-impacting issues
- Include enough context to start investigating
- Provide links to relevant dashboards
- Avoid alerting on temporary blips

**Example alert:** "API response time >5s for 3 minutes. Affects all users. Dashboard: <https://grafana.example.com/api-performance>"

**Alert routing:** Different types of issues need different responses. Route critical alerts to on-call engineers, but send capacity planning alerts to email during business hours.

### Secure your monitoring infrastructure

Monitoring systems often have access to sensitive data and broad system visibility. Treat security as a first-class concern.

**Access control:**

- Use authentication for all monitoring tools
- Implement role-based access (read-only for most users, admin for operators)
- Consider deploying behind VPN for sensitive environments

**Data protection:**

- Encrypt API keys and credentials used in synthetic tests
- Be careful about logging sensitive information
- Consider data retention policies for compliance

### Automate everything

Your monitoring system should be as automated and reliable as your production systems.

**Infrastructure as code:** Version control your monitoring configurations, dashboard definitions, and alerting rules. This makes changes reviewable and deployments repeatable.

**CI/CD for monitoring:** Test your synthetic test scripts and deploy monitoring updates through the same pipelines you use for application code.

**Self-monitoring:** Monitor your monitoring system. Track metrics like test execution rates, alert delivery success, and dashboard load times.

## Growing your monitoring system

Monitoring isn't a project you finish. It's a capability you build and evolve over time. As your system grows, your monitoring needs will change.

### Listen to your pain points

When debugging becomes painful in a specific way, that's usually a signal that your monitoring system needs to evolve. Common signs:

- Spending too much time correlating data between tools
- Missing alerts for issues that affect users
- Getting alerts for problems that fix themselves
- Unable to find the root cause of performance issues

**Let your actual experience guide your monitoring evolution.**

### Involve your whole team

The best monitoring systems are built by the people who will use them. Make sure everyone on your team can contribute to and benefit from your monitoring setup.

This means:

- Everyone can add new metrics when they ship features
- Everyone knows how to read the dashboards
- Everyone understands what different alerts mean
- Everyone can access the monitoring tools they need

### Evolve based on incidents

Every incident teaches you something about your monitoring gaps. After resolving an issue, ask:

- How could our monitoring have caught this earlier?
- What data would have helped us debug faster?
- Are there patterns we should be alerting on?

**Use post-mortems to improve your monitoring, not just your code.**

### Scale incrementally

Add monitoring capabilities based on your current needs, not future possibilities. A good progression might look like:

1. Basic uptime and error monitoring
2. Performance metrics and trends
3. Structured logging and search
4. Distributed tracing for complex workflows
5. Business metrics and user behavior tracking

Each stage should solve real problems you're experiencing.

### Document everything

As your monitoring system grows, documentation becomes critical. Document:

- What each metric means and why it matters
- How to interpret different dashboards
- What actions to take for different alerts
- How to add new monitoring for new features

**Good documentation turns monitoring from black magic into shared knowledge.**

## Building a sustainable monitoring culture

The most important best practice isn't technical, it's cultural. Sustainable monitoring requires a team that values observability and takes ownership of system health.

**Make monitoring everyone's responsibility.** When someone ships a feature, they should also ship the monitoring for that feature. When someone gets an alert, they should improve the monitoring based on what they learn.

**Celebrate monitoring wins.** When monitoring helps catch a problem early or speeds up debugging, make sure the team knows about it. This reinforces the value of investing in observability.

**Keep it simple.** The best monitoring system is the one your team actually uses effectively. Complexity for its own sake creates more problems than it solves.

Remember: monitoring is a means to an end. The goal isn't perfect visibility into everything, it's having enough confidence in your system's health that you can sleep well at night

---

> Next: [Trace IDs and request IDs that work](trace-id-and-request-id.md)
