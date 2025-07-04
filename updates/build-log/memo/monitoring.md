---
title: How we monitor our systems at memo.d.foundation
description: "Learn about our dual approach to monitoring at memo.d.foundation, combining synthetic and instrumental monitoring to ensure system health and community engagement."
date: 2025-07-05
authors:
  - quang
tags:
  - memo
  - monitoring
  - github-actions
---

## Our monitoring philosophy

To ensure the operational reliability and data integrity of the **memo.d.foundation** platform, we have developed a comprehensive, dual-mode monitoring system. This system addresses the core problem of managing a complex NFT content pipeline by combining proactive **synthetic monitoring** with reactive **instrumental alerts**. This integrated strategy provides complete, end-to-end visibility into platform health, from high-level business metrics down to real-time system events.

This approach offers several advantages over traditional, single-strategy monitoring:

* **Proactive and Reactive Coverage**: We combine scheduled "scout" checks for landscape-level health with event-driven "messenger" alerts for immediate issue notification, leaving no gaps in our visibility.
* **Early Issue Detection**: Synthetic monitoring identifies potential data quality or pipeline bottlenecks before they impact the user experience or downstream processes.
* **Real-Time Event Awareness**: Instrumental monitoring provides immediate feedback on critical events, such as NFT mints and CI/CD pipeline status, enabling rapid response from the engineering team.
* **End-to-End Data Integrity**: Our checks span the entire data lifecycle, from Markdown content ingestion and **Parquet** file health to database consistency and AI embedding generation.

### Proactive health audits: Synthetic monitoring

Our synthetic monitoring platform operates on a fixed schedule, executing a series of checks against our core data assets and business logic. It serves as our early warning system, providing a regular pulse on the health of the entire **memo.d.foundation** ecosystem and catching issues before they escalate.

#### NFT ecosystem reporting (`memo-nft-report.ts`)

This daily report provides a comprehensive overview of our minting pipeline and NFT collection activity. It leverages **DuckDB** to execute federated queries across both our canonical **Parquet** vault and our production **PostgreSQL** database, unifying disparate data sources into a single, coherent view.

**Federated Data Integration:**
The system joins data from a remote Parquet file and a PostgreSQL table to generate a holistic report.

```typescript
// Dual-source data integration with DuckDB
const vaultMetrics = await connection.runAndReadAll(`
  SELECT
    COUNT(CASE WHEN should_mint = true THEN 1 END) as mintable_total,
    COUNT(CASE WHEN should_mint = true AND minted_at IS NOT NULL THEN 1 END) as minted_count
  FROM read_parquet('https://memo.d.foundation/db/vault.parquet')
`);

const collectionMetrics = await connection.runAndReadAll(`
  SELECT
    COUNT(*) as total_events,
    SUM(amount) as total_collected
  FROM memo_nft_db.memo_nft.memo_minted_events
`);
```

This daily audit, running via a `cron` schedule in **GitHub Actions**, tracks key performance indicators, including:

* **Minting Pipeline Health**: Monitors success rates, queue depth, and pending content.
* **Collection Activity**: Analyzes total collection events, revenue, and unique collectors.
* **Author and Content Trends**: Identifies top contributors and popular content tags.

#### Data vault integrity (`monitor-vault-parquet.ts`)

This check is designed to verify the completeness and quality of our core knowledge vault. It provides a quick, color-coded health status that allows us to assess data integrity at a glance.

**Data Quality Metrics:**
Our script assesses the vault based on a predefined set of quality metrics.

```typescript
interface VaultMetrics {
  totalRecords: number;
  missingDates: number;
  missingAuthors: number;
  missingEmbeddings: number;
  pendingMint: number;
  pendingArweave: number;
}
```

**Health Status Logic:**
The system uses tiered thresholds to classify the vault's health, ensuring we prioritize critical issues effectively.

```typescript
const hasWarnings = metrics.missingDatesPercent > 25 || metrics.missingAuthorsPercent > 40;
const hasCritical = metrics.pendingMint > 20 || metrics.missingEmbeddings > 100;
const healthStatus = hasCritical ? '🔴 Critical' : hasWarnings ? '🟡 Warning' : '🟢 Healthy';
```

This provides **actionable insights** by immediately flagging which specific metrics have crossed their warning or critical thresholds, enabling focused remediation.

### Real-time event notifications: Instrumental monitoring

Where synthetic monitoring is proactive, our instrumental monitoring is reactive. It operates across several integration layers to provide immediate notifications based on specific system events.

#### NFT minting alerts

When a new article is successfully minted as an NFT, our `notify-discord-minted-articles.ts` script is triggered. This process handles community communication by sending a rich, formatted Discord notification. We leverage the **Model Context Protocol (MCP)** to generate context-aware messages that are more informative and engaging than standard text.

**MCP Integration for Rich Notifications:**

```typescript
await mcpDiscord.callTool({
  name: "discord-send-embed",
  arguments: {
    username: "Memo NFT",
    webhookUrl: process.env.DISCORD_WEBHOOK_URL,
    content: generatedMessage,
    title: "📢 New notes minted in the Memo",
    autoFormat: true,
  }
});
```

This system ensures both optimal performance and high reliability through:

* **Connection Resilience**: Implements a retry mechanism for establishing the initial connection.
* **Exponential Backoff**: If a notification fails, the system waits progressively longer before retrying, preventing API rate-limiting issues.
* **Graceful Error Handling**: Failures are logged without crashing the parent workflow.

#### CI/CD workflow monitoring

We have integrated instrumental monitoring directly into our **GitHub Actions** workflows. This provides real-time status updates on deployments and other critical automated processes, sending success or failure notifications to a dedicated Discord channel.

**Standardized Notification Steps:**

```yaml
- name: Notify Discord on Success
  if: success()
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK_URL }}
    title: '✅ Deployment Completed Successfully'
    color: 0x00ff00

- name: Notify Discord on Failure
  if: failure()
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK_URL }}
    title: '❌ Deployment Failed'
    description: 'Please check workflow logs for details.'
    color: 0xff0000
```

### System architecture and implementation

Our monitoring platform is built on a modern, flexible technology stack chosen for its performance, ease of integration, and alignment with our team's expertise.

#### The DuckDB analytics engine

We selected **DuckDB** as our core data processing engine due to its unique capabilities for in-process analytics. It allows us to perform complex analytical queries on local and remote data sources without the overhead of a traditional data warehouse.

**Key Advantages:**

* **Federated Queries**: Natively queries remote Parquet files and connects to our live **PostgreSQL** database in a single session.
* **High Performance**: Columnar-vectorized query execution is highly optimized for analytical workloads.
* **Zero-Dependency**: Runs entirely in-memory, simplifying our CI/CD environment setup.

**PostgreSQL Integration:**
The connection process involves loading the `postgres` extension and attaching our remote database as a read-only source.

```typescript
async function setupDuckDBConnections(): Promise<DuckDBConnection> {
  const instance = await DuckDBInstance.create(':memory:');
  const connection = await instance.connect();
  
  // Load extensions and attach remote database
  await connection.runAndReadAll('LOAD postgres;');
  await connection.runAndReadAll(`
    ATTACH '${process.env.DB_CONNECTION_STRING}' AS memo_nft_db (TYPE postgres, READ_ONLY);
  `);

  return connection;
}
```

### Security and compliance framework

We designed the monitoring system with security and privacy as first-class citizens, ensuring all operations are secure and respectful of community data.

#### Secrets management

All credentials, API keys, and webhook URLs are managed as **GitHub Secrets**. They are securely injected into our workflows as environment variables at runtime and are never hardcoded in the repository.

**Secure Environment Configuration:**

```yaml
env:
  MEMO_NFT_DB_CONNECTION_STRING: ${{ secrets.MEMO_NFT_DB_CONNECTION_STRING }}
  DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL_MEMO_LOGS }}
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

Our security posture is reinforced by:

* **Principle of Least Privilege**: Secrets are scoped to only the workflows that require them.
* **Read-Only Database Access**: The monitoring system connects to our database using a dedicated user with read-only permissions.
* **Environment Isolation**: We use separate secrets and webhooks for development and production environments.

#### Compliance and privacy

We handle all data, especially community-related information, with strict adherence to privacy best practices. This involves data minimization and anonymization in all public-facing reports.

**Address Truncation for Privacy:**
To protect collector privacy, we truncate wallet addresses before they are included in any public notification.

```typescript
const topCollectors = collectorsResult.map((row) => ({
  address: String(row.address || '').substring(0, 8) + '...', // Truncated for privacy
  totalAmount: Number(row.total_amount)
}));
```

### Operational management and performance

We have established clear metrics and processes to ensure our monitoring system runs smoothly and delivers tangible value.

#### Success metrics

We track a set of key performance indicators to measure the effectiveness of our monitoring infrastructure:

* **Monitoring Uptime**: Target success rate of >99.9% for all scheduled checks.
* **Alert Latency**: Average delivery time for critical alerts is under 2 minutes.
* **Data Freshness**: Reports leverage data that is never more than 6 hours old.
* **Query Performance**: Complex analytical reports complete in under 30 seconds.

#### Alert handling and escalation

Our automated workflow escalates alerts based on a tiered severity model:

* **Critical (Red)**: An emergency requiring immediate attention, triggering multi-channel notifications.
* **Warning (Yellow)**: An issue that needs attention, triggering a standard alert in Discord.
* **Healthy (Green)**: A routine status update delivered via a standard report.

### Core design principles and learnings

Our development process was guided by several key principles that we believe are critical for building effective monitoring systems.

**Align Monitoring with Business Outcomes**
Our primary insight was that technical metrics are only valuable when tied to a business goal. Our most effective monitors answer key stakeholder questions, such as "Is the minting process working correctly?"

**Design for Resilience**
A monitoring system must be more reliable than the systems it observes. We built ours with robust retry logic, graceful degradation, and connection resilience to ensure it is always available when we need it most.

### Future roadmap

While we are proud of the current system, our work is never done. We are actively exploring several enhancements to make our monitoring even more intelligent and proactive.

* **Predictive Analytics with AI**: We plan to leverage machine learning to analyze historical trends and predict potential failures before they occur.
* **Automated Remediation**: For common, well-understood issues, we will explore self-healing capabilities to reduce manual intervention.
* **Executive Dashboards**: We will create higher-level dashboards that distill technical metrics into clear business insights for leadership.
