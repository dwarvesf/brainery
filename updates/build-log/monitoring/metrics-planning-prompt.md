---
title: LLM prompt for metrics planning
description: A comprehensive prompt template to get tailored metrics recommendations for any system. Use this with ChatGPT, Claude, or other LLMs to design monitoring that actually matters.
authors:
  - tieubao
date: 2025-05-14
tags:
  - monitoring
  - metrics
  - llm-prompts
  - planning
redirect:
  - /LR6wVw
---

When building a new system, use this prompt template to get comprehensive metrics recommendations tailored to your specific use case. This structured approach ensures you get consistent, actionable advice that scales with your system's growth.

## The complete prompt template

```
You are a monitoring expert helping design metrics for a new system. Please analyze the system I describe and recommend specific metrics following these guidelines:

## System Description
**System Type:** [e.g., blog platform, e-commerce API, microservices, mobile app backend]
**Architecture:** [e.g., monolith, microservices, serverless, static site + API]
**Tech Stack:** [e.g., Node.js + PostgreSQL, React + Next.js, Python + Redis]
**User Journey:** [describe the main user flow, e.g., "users browse posts → click to read → engage with content"]
**Current Scale:** [e.g., 100 users/day, 10k requests/hour, 50GB data]
**Expected Growth:** [e.g., 10x growth in 6 months, seasonal traffic spikes]

## Metrics Requirements
Please provide metrics recommendations in these categories:

### 1. User Experience Metrics (Priority 1)
- Apply the RED method (Rate, Errors, Duration) to user-facing operations
- Focus on metrics that directly correlate with user satisfaction
- Include end-to-end user journey metrics

### 2. Synthetic Monitoring Metrics
- External availability checks
- Performance monitoring from user perspective
- Critical user flow validation
- Geographic performance if relevant

### 3. Application Instrumentation Metrics
- Internal service health and performance
- Business-specific metrics relevant to this domain
- Resource utilization and efficiency
- Error tracking and debugging metrics

### 4. Infrastructure Metrics (only those that predict user impact)
- System resources that correlate with performance
- Service health indicators
- Capacity planning metrics

### 5. Scale-Appropriate Recommendations
Please organize recommendations by system maturity:

**Stage 1 (MVP/Early): 5-10 essential metrics**
- Absolute minimum for basic health monitoring
- Focus on preventing major outages

**Stage 2 (Growth): 15-25 metrics**  
- Add performance optimization metrics
- User experience improvements
- Capacity planning basics

**Stage 3 (Scale): 30-50 metrics**
- Business intelligence metrics
- Advanced performance optimization
- Predictive monitoring

## Output Format
For each metric, provide:
- **Metric name:** (following Prometheus naming conventions)
- **Description:** What it measures and why it matters
- **Alert threshold suggestion:** When to take action
- **Collection method:** How to instrument/collect it
- **Priority level:** Critical/Important/Nice-to-have

## Additional Context
- We use Prometheus for metrics storage
- Grafana for visualization  
- We prefer structured logging with correlation IDs
- Team has [beginner/intermediate/advanced] monitoring experience

## Constraints
- Avoid vanity metrics that don't predict user impact
- Focus on actionable metrics that drive specific responses
- Consider our team's ability to maintain the monitoring system
- Prioritize leading indicators over lagging indicators

Please analyze this system and provide specific, actionable metrics recommendations.
```

## Example usage scenarios

Here are some example system descriptions you might use:

### For a blog platform with on-chain data

```
**System Type:** Technical blog platform with blockchain data integration
**Architecture:** Static site (Next.js) + API services + on-chain data fetching
**Tech Stack:** Next.js, Node.js APIs, Arweave storage, Base blockchain
**User Journey:** Users browse posts → click to read → view on-chain data visualizations → share/bookmark
**Current Scale:** 1k daily users, 10k page views, 100 on-chain queries/day
**Expected Growth:** 5x growth as content library expands
```

### For a microservices e-commerce API

```
**System Type:** E-commerce backend API
**Architecture:** Microservices with API gateway
**Tech Stack:** Node.js services, PostgreSQL, Redis, Docker/Kubernetes
**User Journey:** Browse products → add to cart → checkout → payment processing
**Current Scale:** 10k users, 100k API calls/day, $50k monthly transactions
**Expected Growth:** Black Friday traffic spikes (10x normal volume)
```

### For a real-time chat application

```
**System Type:** Real-time messaging platform
**Architecture:** WebSocket servers + message queue + user management API
**Tech Stack:** Node.js, Redis, PostgreSQL, Socket.io
**User Journey:** Login → join channels → send/receive messages → file sharing
**Current Scale:** 500 concurrent users, 10k messages/hour
**Expected Growth:** Targeting 5k concurrent users within 3 months
```

### For a data processing pipeline

```
**System Type:** Data analytics and processing platform
**Architecture:** Event-driven microservices with message queues
**Tech Stack:** Python, Apache Kafka, PostgreSQL, Redis, Docker
**User Journey:** Upload data → configure processing → monitor jobs → download results
**Current Scale:** 100GB processed/day, 50 concurrent jobs, 500 users
**Expected Growth:** 10x data volume, real-time processing requirements
```

### For a mobile app backend

```
**System Type:** Social media mobile app backend
**Architecture:** REST API + push notification service + file storage
**Tech Stack:** Node.js, MongoDB, AWS S3, Firebase Push, GraphQL
**User Journey:** Register → create profile → post content → engage with others
**Current Scale:** 10k MAU, 100k API calls/day, 50GB media storage
**Expected Growth:** Viral growth potential (100x users possible)
```

## Prompt optimization tips

### Be specific about your system

The more context you provide, the better the recommendations. Include:

- Specific technologies and versions
- Integration patterns (REST, GraphQL, WebSockets)
- Data storage and caching strategies
- Third-party services and dependencies

### Include business context

Mention what matters most to your users and business:

- **Performance requirements:** "Sub-second response times critical"
- **Reliability needs:** "99.9% uptime SLA with customers"
- **Cost constraints:** "Running on tight budget, prefer cost-effective solutions"
- **Compliance:** "Must meet SOC2 requirements for data handling"

### Specify your constraints

Help the LLM give realistic recommendations:

- **Team size:** "3-person engineering team"
- **Technical expertise:** "Strong in backend, learning DevOps"
- **Time constraints:** "Need basic monitoring in 2 weeks"
- **Tool preferences:** "Already using AWS, prefer staying in ecosystem"

### Ask for implementation guidance

Request specific details for your stack:

- "Show code examples for Express.js instrumentation"
- "Provide Kubernetes deployment configs for monitoring"
- "Include Terraform configs for cloud monitoring setup"

### Iterate and refine

Use the initial recommendations to ask follow-up questions:

- "Which 5 metrics should we implement first?"
- "How do we instrument WebSocket connections specifically?"
- "What's the maintenance overhead for these recommendations?"

## Follow-up prompts for deeper analysis

Once you have initial metrics recommendations, use these prompts for more specific guidance:

### Implementation details

```
"For the metrics you recommended, please provide:
1. Specific Grafana dashboard layouts with panel configurations
2. Prometheus alerting rules with realistic thresholds
3. Implementation code examples for [your language/framework]
4. Common troubleshooting scenarios for each metric
5. Testing strategies to validate metrics are working correctly"
```

### Prioritization guidance

```
"Help me prioritize these metrics based on:
1. Development effort required to implement (hours/days estimate)
2. Value for detecting user-impacting issues (high/medium/low)
3. Maintenance overhead for our team size
4. Which metrics should we implement first for maximum impact
5. Dependencies between metrics that affect implementation order"
```

### Mistake prevention

```
"What are the most common mistakes teams make when implementing these specific metrics for [your system type]? Please provide:
1. Anti-patterns to avoid in instrumentation
2. Alert threshold mistakes that cause fatigue
3. Dashboard design errors that hide important signals
4. Metric naming conventions that cause confusion later
5. How to avoid over-monitoring or under-monitoring"
```

### Cost and performance optimization

```
"For each recommended metric, analyze:
1. Performance impact of collection on the application
2. Storage costs in Prometheus over time
3. Query performance implications for dashboards
4. Network overhead for metric transmission
5. Strategies to reduce monitoring costs while maintaining value"
```

### Team onboarding

```
"Help me create a monitoring playbook for my team that includes:
1. Step-by-step setup instructions for each metric
2. How to interpret dashboard readings during incidents
3. Standard operating procedures for different alert types
4. Training materials for junior developers
5. Maintenance schedules and responsibilities"
```

## Advanced prompt techniques

### Scenario-based planning

Ask the LLM to consider specific failure scenarios:

```
"For this system, what metrics would help us detect and respond to:
1. Database connection pool exhaustion
2. Memory leaks in long-running processes  
3. Third-party API rate limiting or failures
4. Gradual performance degradation over time
5. Security issues like unusual access patterns"
```

### Comparative analysis

Get recommendations relative to similar systems:

```
"Compare the monitoring approach for our system versus:
1. A similar system at 10x our current scale
2. A competitor with similar architecture
3. Industry standard practices for [your domain]
4. What monitoring would we need if we moved to [different architecture]"
```

### Evolution planning

Plan for system growth:

```
"Create a monitoring evolution roadmap that shows:
1. What metrics to add as we reach 10x, 100x current scale
2. When to introduce more sophisticated monitoring tools
3. How our alerting strategy should evolve with growth
4. What monitoring changes are needed for multi-region deployment
5. Transition plan from current monitoring to enterprise-grade solutions"
```

Remember: The goal isn't perfect monitoring from day one. Use these prompts to build monitoring that grows with your system and actually helps your team ship better software.

---

> Next: [Understanding the metrics that matter most](metrics.md)
