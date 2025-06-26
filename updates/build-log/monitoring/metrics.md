---
title: Which metrics actually matter
description: A practical guide to choosing the right metrics for system health monitoring. We cut through the noise to focus on metrics that directly impact your users and business.
authors:
  - tieubao
date: 2025-05-14
tags:
  - monitoring
  - metrics
  - observability
redirect:
  - /qd1tcw
---

You could measure everything in your system, but should you? We've seen teams track hundreds of metrics while missing the ones that actually matter when things go wrong. The key isn't collecting more data, it's collecting the right data that helps you understand user impact and system health.

## Start with user experience metrics

Before diving into technical metrics, ask yourself: what do your users care about? They don't care about CPU usage or memory consumption. They care about whether your site loads quickly and works correctly.

### The RED method: Rate, Errors, Duration

This simple framework covers the metrics that matter most to users:

**Rate:** How many requests are you handling?

- `http_requests_total` - total requests per second
- `page_views_total` - user page loads
- `api_calls_total` - API endpoint usage

**Errors:** How many requests are failing?

- `http_requests_failed_total` - failed HTTP requests
- `error_rate` - percentage of requests that fail
- `5xx_errors_total` - server errors that affect users

**Duration:** How long do requests take?

- `http_request_duration_seconds` - response time percentiles
- `page_load_time_seconds` - full page load experience
- `database_query_duration_seconds` - backend performance

**Why this works:** If your rate drops, errors spike, or duration increases, users notice immediately. Everything else is secondary.

### Business impact metrics

Connect technical performance to business outcomes:

**User engagement:**

- `active_users_current` - current concurrent users
- `session_duration_seconds` - how long users stay
- `bounce_rate` - users who leave immediately

**Content performance:**

- `blog_post_views_total` - content popularity
- `time_on_page_seconds` - content engagement
- `conversion_rate` - users who take desired actions

**System availability:**

- `uptime_percentage` - overall system availability
- `successful_deployments_total` - deployment success rate
- `mean_time_to_recovery_seconds` - how quickly you fix issues

## Synthetic monitoring metrics

Your synthetic tests should measure what real users experience, not just whether your server responds to a ping.

### Core synthetic metrics

**Availability metrics:**

- `site_up` - basic reachability (0 or 1)
- `endpoint_availability` - per-page availability
- `api_endpoint_up` - API health checks

**Performance metrics:**

- `page_load_time_complete` - full page load including resources
- `time_to_first_byte` - server response speed
- `time_to_interactive` - when users can actually use the page

**User journey metrics:**

- `login_flow_success_rate` - can users sign in?
- `checkout_completion_time` - e-commerce flow health
- `search_results_returned` - core functionality testing

**Example for a blog system:**

```
# Synthetic test loading a blog post with on-chain data
blog_post_load_success{endpoint="/post/blockchain-analysis"} 1
blog_post_load_time{endpoint="/post/blockchain-analysis"} 2.3
arweave_data_fetch_success{post_id="123"} 1
arweave_data_fetch_duration{post_id="123"} 0.8
```

### Geographic performance metrics

Run synthetic tests from multiple locations to understand global user experience:

- `page_load_time_by_region{region="us-east-1"}`
- `page_load_time_by_region{region="eu-west-1"}`
- `page_load_time_by_region{region="ap-southeast-1"}`

This helps you identify regional performance issues and CDN problems.

## Application instrumentation metrics

Your application code should emit metrics that help you understand internal performance and behavior.

### HTTP service metrics

**Request patterns:**

- `http_requests_total{method="GET", endpoint="/api/posts"}`
- `http_request_duration_histogram{endpoint="/api/posts"}`
- `http_requests_in_flight` - current concurrent requests

**Error tracking:**

- `http_errors_total{status_code="500", endpoint="/api/posts"}`
- `database_errors_total{operation="select", table="posts"}`
- `external_api_errors_total{service="arweave"}`

**Resource usage:**

- `database_connections_active` - connection pool health
- `cache_hit_rate` - caching effectiveness
- `memory_usage_bytes` - application memory consumption

### Custom business metrics

Track metrics specific to your application domain:

**For a blog/CMS system:**

```
# Content management
posts_published_total 156
posts_draft_total 23
media_uploads_total{type="image"} 89

# User engagement  
comments_posted_total 234
newsletter_signups_total 45
search_queries_total 1203

# On-chain operations
arweave_uploads_total 45
arweave_upload_size_bytes 123456789
base_transactions_total 67
```

**For an e-commerce system:**

```
# Sales and orders
orders_created_total{status="pending"} 23
orders_completed_total 156
revenue_total_cents 1234567

# Inventory and products
products_viewed_total{category="electronics"} 890
cart_abandonment_rate 0.23
payment_processing_duration_seconds 1.2
```

### Framework-specific metrics

**Node.js applications:**

- `nodejs_heap_size_used_bytes` - memory usage
- `nodejs_event_loop_lag_seconds` - performance bottlenecks
- `nodejs_active_handles_total` - resource leaks

**Database metrics:**

- `database_query_duration_seconds{operation="SELECT"}`
- `database_connections_total{state="active"}`
- `database_slow_queries_total` - performance issues

## Infrastructure and system metrics

While user experience metrics are most important, infrastructure metrics help you prevent problems before they affect users.

### Essential system metrics

**Compute resources:**

- `cpu_usage_percent` - processor utilization
- `memory_usage_percent` - RAM consumption
- `disk_usage_percent` - storage capacity
- `network_io_bytes_per_second` - network activity

**Service health:**

- `container_restart_count` - stability indicators
- `service_discovery_healthy_nodes` - cluster health
- `load_balancer_healthy_targets` - traffic distribution

### Don't over-monitor infrastructure

**Good infrastructure metrics** correlate with user experience:

- High CPU leading to slow response times
- Memory pressure causing service restarts
- Disk space affecting log writing or database performance

**Avoid vanity metrics** that don't predict user impact:

- CPU usage spikes that don't affect performance
- Memory usage within normal operating ranges
- Network metrics that don't correlate with user experience

## Log-derived metrics

Your logs contain valuable signals that you can extract as metrics.

### Error rate metrics from logs

Instead of just counting errors, extract meaningful patterns:

```
# From structured logs
log_errors_total{service="api", error_type="database_timeout"} 5
log_errors_total{service="api", error_type="validation_failed"} 12
log_warnings_total{service="frontend", warning_type="slow_render"} 8
```

### Performance insights from logs

Extract timing information that complements your instrumentation:

```
# Derived from log processing times
log_processing_duration_seconds{operation="markdown_to_html"} 0.15
log_processing_duration_seconds{operation="image_optimization"} 2.3
```

### User behavior metrics

Track user actions that don't trigger API calls:

```
# Frontend behavior from client-side logs
user_actions_total{action="scroll_to_bottom"} 123
user_actions_total{action="copy_code_block"} 45
user_interactions_total{element="search_box"} 234
```

## Choosing the right metrics for your system

Not every metric makes sense for every system. Here's how to choose wisely:

### Start with the critical path

Map out your user's most important journey and instrument every step:

**For a blog:**

1. User loads homepage → `page_load_time{page="home"}`
2. User clicks on post → `clicks_total{target="post_link"}`
3. Post loads with content → `post_load_complete_time`
4. User reads and engages → `time_on_page`, `scroll_depth`

**For an API:**

1. Request arrives → `http_requests_total`
2. Authentication → `auth_duration_seconds`, `auth_failures_total`
3. Data processing → `processing_duration_seconds`
4. Response sent → `response_size_bytes`, `response_time_seconds`

### Focus on leading indicators

Choose metrics that predict problems rather than just reporting them:

**Leading indicators** (predict issues):

- Response time increasing gradually
- Error rate trending upward
- Memory usage growing over time
- Cache hit rate declining

**Lagging indicators** (report issues after they happen):

- Service completely down
- All requests failing
- System completely out of memory

### Consider your service level objectives

Your metrics should help you measure against your SLOs:

**If your SLO is "99% of requests complete in <2 seconds":**

- Track `http_request_duration_seconds` percentiles
- Alert when 99th percentile exceeds 2 seconds
- Measure `availability_percentage` over time

**If your SLO is "Blog posts load in <3 seconds":**

- Track `blog_post_load_time` from synthetic tests
- Include all resources (images, fonts, on-chain data)
- Test from multiple geographic locations

## Common metric mistakes to avoid

We've seen these patterns cause more confusion than clarity:

### Too many metrics

The "measure everything just in case" approach sounds thorough, but it's actually counterproductive. You end up with hundreds of metrics that nobody looks at, while the important signals get lost in the noise.

**The better path:** Start with RED metrics (Rate, Errors, Duration), then add others only when you encounter specific problems that additional metrics would help solve.

### Vanity metrics

It's tempting to track metrics that make you feel good (total users, page views, database size) but these often don't predict when users will have problems. A growing user count is great for morale, but it won't tell you when your site is about to crash.

**Ask the crucial question:** For every metric you consider, ask "If this changes, will users notice?" If the answer is no, you probably don't need it.

### Missing context

A metric without context is like a smoke alarm without location, you know something's wrong, but you have no idea where to look. Raw numbers like "1234 requests" don't help you debug anything.

```
# This tells you nothing useful
requests_total 1234

# This gives you debugging context
http_requests_total{method="POST", endpoint="/api/posts", status="200"} 1234
```

Add relevant labels like endpoint, region, and user_type to make your metrics searchable and actionable.

### Inconsistent naming

When your team grows, different services start using different naming conventions. Some use `api_response_time`, others use `db_query_ms`, and someone else picked `external_latency`. Six months later, nobody remembers which metric lives where.

**Establish standards early:**

```
# Consistent naming that scales
api_request_duration_seconds
database_query_duration_seconds
external_call_duration_seconds

# Inconsistent naming that creates confusion
api_response_time
db_query_ms
external_latency
```

Document your naming conventions and enforce them during code reviews. Your future self will thank you.

## Metrics that scale with your system

As your system grows, your metrics needs will evolve:

### Stage 1: Basic health (single service)

- `http_requests_total`, `http_request_duration_seconds`
- `error_rate`, `uptime_percentage`
- Basic infrastructure metrics

### Stage 2: User experience (multiple services)

- `page_load_time`, `user_journey_completion_rate`
- `service_dependency_health`
- Geographic performance metrics

### Stage 3: Business intelligence (complex systems)

- `revenue_per_user`, `conversion_funnel_metrics`
- `feature_usage_rates`, `a_b_test_performance`
- `cost_per_transaction`, `efficiency_metrics`

### Stage 4: Predictive monitoring (mature systems)

- `capacity_utilization_trends`
- `anomaly_detection_scores`
- `predictive_failure_indicators`

## Making metrics actionable

The best metrics drive action. For every metric you track, document:

**What it measures:** User-facing page load time including all resources
**Why it matters:** Slow pages directly impact user satisfaction and SEO
**What's normal:** 95th percentile under 3 seconds
**When to act:** If 95th percentile exceeds 5 seconds for 5 minutes
**How to investigate:** Check Grafana dashboard, drill into logs by request_id

Remember: metrics are a means to an end. The goal isn't perfect visibility into everything, it's having enough information to keep your users happy and your system healthy.

---

## Need help choosing metrics for your system?

We've created a comprehensive LLM prompt template that helps you get tailored metrics recommendations for any system you're building. Whether you're working on a blog platform, e-commerce API, or real-time chat application, this structured approach ensures you get actionable guidance that scales with your system's growth.

**→ [LLM prompt for metrics planning](metrics-planning-prompt.md)**

The prompt template includes:

- Structured system description format
- Scale-appropriate recommendations (MVP → Growth → Scale)
- Example scenarios for different system types
- Follow-up prompts for implementation details
- Advanced techniques for specific use cases

Perfect for sharing with junior developers or using as a team planning resource.

---

> Next: [Best practices that actually work](best-practices.md)
