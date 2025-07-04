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

In today's complex systems, monitoring is not just about watching for things to break. It’s about understanding the health of our woodland, spotting trouble before it starts, and making smart decisions with good data. At memo.d.foundation, we built a monitoring system with two complementary parts: **synthetic monitoring** for proactive health checks and **instrumental monitoring** for reactive alerts.

### A tale of two approaches

Think of our strategy like this: we have a scout on the hill and a messenger at the gate.

1. **Synthetic Monitoring (The Scout):** Our scout runs on a schedule, looking out over the entire landscape. It proactively checks system status, data quality, and key business metrics, giving us a heads-up before anyone else notices a problem.
2. **Instrumental Monitoring (The Messenger):** Our messenger waits at the gate for important events. When something happens, like a system failure or a new NFT being minted, it runs to tell us immediately.

This combination gives us complete coverage, from high-level health down to real-time events.

### Why this matters for an NFT content platform

memo.d.foundation is a knowledge-sharing platform where content becomes NFTs. This means we need to watch a lot of moving parts:

- **Content pipeline health:** Making sure Markdown files are processed correctly and metadata is solid.
- **The NFT ecosystem:** Tracking minting success, collection activity, and marketplace trends.
- **Community engagement:** Keeping our stakeholders in the loop with real-time updates.
- **Data integrity:** Ensuring our Parquet files, database, and AI embeddings are complete and healthy.

---

## Synthetic monitoring: The scout on the hill

Our synthetic monitoring is the backbone of our proactive strategy. These scheduled checks give us a regular pulse on system health, catching issues before they impact our users.

### A. Keeping an eye on our NFT ecosystem (`memo-nft-report.ts`)

Every day, our system gives us a full report on the entire minting and collection ecosystem.

#### How we pull the data together

The system uses DuckDB to query data from two different places at once, a Parquet file and a PostgreSQL database.

```typescript
// Dual-source data integration
const vaultMetrics = await connection.runAndReadAll(`
  SELECT
    COUNT(CASE WHEN should_mint = true THEN 1 END) as mintable_total,
    COUNT(CASE WHEN should_mint = true AND minted_at IS NOT NULL THEN 1 END) as minted_count,
    COUNT(CASE WHEN should_mint = true AND minted_at IS NULL THEN 1 END) as pending_count
  FROM read_parquet('https://memo.d.foundation/db/vault.parquet')
`);

const collectionMetrics = await connection.runAndReadAll(`
  SELECT
    COUNT(*) as total_events,
    SUM(amount) as total_collected,
    COUNT(DISTINCT "to") as unique_collectors
  FROM memo_nft_db.memo_nft.memo_minted_events
`);
```

#### The metrics we track

**Minting pipeline health:**

- **Success rate:** What percentage of content that should be minted actually gets minted?
- **Queue management:** Are there bottlenecks in our minting queue?
- **Author performance:** Who are our top contributors?
- **Content analysis:** What tags are popular and how long is the content?

**Collection activities:**

- **Marketplace dynamics:** How many collection events are happening?
- **Community engagement:** How many unique collectors are there?
- **Token performance:** Which NFTs are being collected most often?
- **Revenue insights:** What’s the average collection amount?

#### When the reports run

We get these reports every day at 9 AM UTC, but we can also trigger them manually when needed.

```yaml
# Daily 9 AM UTC reports with manual dispatch capabilities
on:
  schedule:
    - cron: '0 9 * * *'
  workflow_dispatch:
    inputs:
      send_notification:
        description: 'Send Discord notification'
        default: true
        type: boolean
```

### B. Monitoring our content quality (`monitor-vault-parquet.ts`)

This check ensures that the data in our knowledge vault is complete and high-quality.

#### The data integrity checks

```typescript
interface VaultMetrics {
  totalRecords: number;
  fileSizeMB: number;
  fileAgeHours: number;
  missingDates: number;
  missingAuthors: number;
  missingEmbeddings: number;
  emptyContent: number;
  pendingMint: number;
  pendingArweave: number;
}
```

#### How we analyze quality

**Content completeness:**

- **Metadata validation:** Does every piece have an author and a date?
- **Content quality:** Are there empty files or content that's too short?
- **Embedding status:** Are the AI embeddings needed for search functionality complete?
- **Processing pipeline:** How many items are waiting to be minted or deployed to Arweave?

**Our health status logic:**
A simple check tells us if things are healthy, need attention, or are in a critical state.

```typescript
const hasWarnings = metrics.missingDatesPercent > 25 ||
                   metrics.missingAuthorsPercent > 40 ||
                   metrics.emptyContent > 50;

const hasCritical = metrics.pendingMint > 20 ||
                   metrics.pendingArweave > 30 ||
                   metrics.missingEmbeddings > 100;

const healthStatus = hasCritical ? '🔴' : hasWarnings ? '🟡' : '🟢';
```

#### Our visual reporting system

We send reports to Discord that give an immediate sense of the system's health using:

- **Color-coded status:** Red for critical, Yellow for warning, and Green for healthy.
- **Emoji indicators:** For a quick visual gut check.
- **Tiered alerting:** Different notifications for different levels of severity.
- **Actionable insights:** Pointing out the specific metrics that need attention.

---

## Instrumental monitoring: The messenger at the gate

Our instrumental monitoring gives us real-time alerts about important events as they happen.

### A. Real-time event notifications

#### NFT minting alerts (`notify-discord-minted-articles.ts`)

When a new piece of content is minted as an NFT, our system immediately lets the community know.

```typescript
async function main() {
  const filePaths = process.argv[2]
    .trim()
    .split(',')
    .filter(Boolean)
    .map(path => `vault/${path}`);

  let message = 'Please compose a message to notify the community that the following notes have been minted:\n';

  for (const filePath of filePaths) {
    const { data: frontmatter } = matter(content);
    message += `title: ${frontmatter.title} - url: https://memo.d.foundation/${filePath.replace('vault/', '').replace('.md', '')} - author: ${frontmatter.authors}\n`;
  }

  await connectWithRetry();
  await callToolWithRetry(message, "📢 New notes minted in the Memo");
}
```

#### Using MCP for smarter messaging

We use the Model Context Protocol (MCP) to create more advanced and formatted messages in Discord.

```typescript
await mcpDiscord.callTool({
  name: "discord-send-embed",
  arguments: {
    username: "Memo NFT",
    webhookUrl: process.env.DISCORD_WEBHOOK_URL,
    content: message,
    title: title,
    autoFormat: true,
    embeds: [],
  }
});
```

**Built-in resilience:**

- **Exponential backoff:** If a notification fails, we wait longer before trying again.
- **Connection resilience:** We try to connect multiple times before giving up.
- **Error handling:** We handle failures gracefully so the whole system doesn't crash.

### B. Workflow status monitoring

#### Keeping an eye on our CI/CD pipelines

We have instrumental monitoring across seven of our GitHub workflows, using a standard way to send success or failure notifications to Discord.

```yaml
- name: Notify Discord on Success
  if: success()
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK_URL }}
    title: '✅ Deployment Completed Successfully'
    description: 'All processes completed without errors'
    color: 0x00ff00

- name: Notify Discord on Failure
  if: failure()
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK_URL }}
    title: '❌ Deployment Failed'
    description: 'Please check workflow logs for details'
    color: 0xff0000
```

#### Event-driven triggers

We can trigger these checks based on specific events, like when a key file changes.

**File change detection:**

```yaml
on:
  push:
    paths:
      - 'db/vault.parquet'
```

**Workflow dependencies:**

```yaml
concurrency:
  group: ${{ github.repository }}-workflow
  cancel-in-progress: false
```

---

## A look under the hood at our technical architecture

### A. The data processing layer

#### Why we chose the DuckDB analytics engine

Our monitoring system uses DuckDB to run fast analytical queries across different kinds of data sources. It’s a perfect example of our commitment to craftsmanship, choosing the right tool for the job.

**Here's why we like it:**

- **Fast queries:** Its columnar processing is great for big Parquet files.
- **Connects to anything:** We can easily query Parquet files and our PostgreSQL database in a single command.
- **No extra baggage:** It runs in-memory, so we don't need a separate database server.
- **Plain old SQL:** We can write complex queries using standard SQL.

**How we connect to it:**

```typescript
async function setupDuckDBConnections(): Promise<DuckDBConnection> {
  const instance = await DuckDBInstance.create(':memory:');
  const connection = await instance.connect();

  // Load extensions we need
  await connection.runAndReadAll('LOAD postgres;');

  // Attach our remote database
  await connection.runAndReadAll(`
    ATTACH '${connectionString}' AS memo_nft_db (TYPE postgres, READ_ONLY);
  `);

  return connection;
}
```

### B. Our notification infrastructure

#### Getting the word out through multiple channels

We use Discord webhooks to send rich, structured notifications with colors and clear formatting. We’re careful about API rate limits and have fallback plans in case Discord has issues.

**How we keep our webhooks secure:**

```typescript
async function sendToDiscord(payload: Record<string, unknown>) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    console.log('⚠️  No Discord webhook URL configured, skipping notification');
    return;
  }

  // We send the data and check that it was received correctly.
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Discord webhook failed: ${response.status} ${response.statusText}`);
    }
  } catch (error) {
    console.error('❌ Failed to send Discord notification:', error);
  }
}
```

#### Building a system that doesn't give up

Our notification system is built to be resilient. If it can't connect, it doesn't just fail, it tries again.

**Our connection retry logic:**

```typescript
async function connectWithRetry(maxRetries = 3, initialDelay = 1000): Promise<void> {
  let retries = 0;
  let delay = initialDelay;

  while (retries <= maxRetries) {
    try {
      // Try to connect...
      await mcpDiscord.connect(/* ... connection details ... */);
      return; // Success!
    } catch (error) {
      retries++;
      if (retries > maxRetries) {
        throw error; // Too many failures, we have to give up.
      }
      await sleep(delay);
      delay *= 2; // Wait longer before the next try (exponential backoff).
    }
  }
}
```

---

## Keeping things secure and compliant

### How we handle secrets

We manage all our sensitive information, like API keys and database credentials, through GitHub Secrets. This ensures they are never exposed in our code.

```yaml
env:
  MEMO_NFT_DB_CONNECTION_STRING: ${{ secrets.MEMO_NFT_DB_CONNECTION_STRING }}
  DISCORD_WEBHOOK_URL: ${{ secrets.DISCORD_WEBHOOK_URL_MEMO_LOGS }}
  OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
```

**Our security best practices:**

- **Least privilege:** Secrets are only available to the specific workflows that need them.
- **Read-only access:** Our monitoring system connects to the database with a read-only user.
- **Webhook validation:** We always check that our notifications were sent successfully.
- **Environment isolation:** We use different secrets for our development and production environments.

### Our approach to compliance

#### Protecting our community's privacy

We are careful about how we handle personal information.

- **Address truncation:** We shorten collector addresses in public reports to protect their privacy.
- **Anonymization:** We avoid sharing personal identifiers in community notifications.
- **Data minimization:** We only collect and report the metrics that are truly necessary.

Here is a practical example of how we truncate addresses:

```typescript
const topCollectors = collectorsResult.getRowObjects().map((row: Record<string, unknown>) => ({
  address: String(row.address || '').substring(0, 8) + '...', // Truncated for privacy
  totalAmount: Number(row.total_amount),
  transactions: Number(row.transactions)
}));
```

#### Keeping a log of what happens

We maintain a clear audit trail.

- **Comprehensive logging:** All monitoring actions are logged with a timestamp.
- **Error tracking:** Failed checks are recorded so we can investigate them.
- **Access patterns:** We monitor database query patterns for anything unusual.

---

## Running a smooth operation

### How we measure success

We track a few key metrics to make sure our monitoring is effective.

**System health:**

- **Monitoring uptime:** Our checks succeed over 99.9% of the time.
- **Alert delivery speed:** Alerts arrive in Discord in under 2 minutes on average.
- **Data freshness:** Our data is never more than 6 hours old.
- **Query speed:** Our big reports run in under 30 seconds.

**Business impact:**

- **Mint success rate:** We aim for over 95% of eligible content to be minted successfully.
- **Queue health:** We keep our processing queues short and flowing.
- **Content quality:** We have clear targets for metadata completeness.

### How we handle alerts

We have an automated workflow for escalating alerts based on their severity.

**Our severity levels:**

- **Critical (Red):** This is an emergency. We get an immediate notification on multiple channels.
- **Warning (Yellow):** This needs attention soon. We get a scheduled alert in Discord.
- **Healthy (Green):** All is well. We get a standard report in Discord.

We also correlate alerts to spot patterns, helping us find the root cause of a problem faster.

### A quick troubleshooting guide

We have runbooks to help us diagnose common issues.

**Checking database connection failures:**

```bash
# Diagnostic steps
echo "🔍 Testing database connectivity..."
if [ -n "$MEMO_NFT_DB_CONNECTION_STRING" ]; then
  echo "✅ Database connection string is configured"
else
  echo "❌ MEMO_NFT_DB_CONNECTION_STRING secret not configured"
  exit 1
fi
```

**Checking if Parquet files are accessible:**

```bash
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://memo.d.foundation/db/vault.parquet")
if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Remote parquet file is accessible"
else
  echo "❌ Remote parquet file not accessible (HTTP: $HTTP_CODE)"
  exit 1
fi
```

---

## What we learned along the way

### Our core design principles

**Start with what matters to the business.**
Our key insight was that technical metrics are only useful if they connect to a business outcome. Our best monitoring answers questions our stakeholders care about, like "Is the minting process working?"

**Invest in solid testing.**
A monitoring system you can't trust is worse than no monitoring at all. We learned that thoroughly testing our alert logic, especially for edge cases, is critical for success.

**Design for resilience.**
The monitoring system has to be more reliable than the system it's watching. We built ours with retry logic, fallback channels, and graceful degradation so that it’s always there when we need it.

### Our advice for building your own

**Design for your community.**
If you're going to monitor in public, do it thoughtfully. Be transparent by default, use clear visuals, and provide information that helps people understand what's happening. This builds incredible trust.

**Choose the right tools for your team.**
We picked our tech stack based on what our team already knew (TypeScript, Node.js) and what integrated well with our existing tools (GitHub Actions, Discord). This made the whole process faster and easier to maintain.

---

## What's next for our monitoring

We’re proud of the system we’ve built, but our work on innovation and craftsmanship is never done. We’re always looking ahead.

Here are a few things we're thinking about for the future:

- **Getting smarter with AI:** We want to move from just reporting data to predicting issues. We plan to use machine learning to analyze trends and alert us to potential problems before they happen.
- **Automated remediation:** For some common issues, can the system fix itself? We’re exploring ways to build self-healing capabilities that reduce manual intervention even further.
- **Deeper business insights:** We want to continue connecting our technical metrics to business outcomes, creating dashboards that give our leaders an even clearer view of the platform's performance and value.

Our goal is to build a monitoring system that not only tells us what’s happening now but also helps us build a more robust, efficient, and innovative platform for the future.
