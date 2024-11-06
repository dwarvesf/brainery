---
tags: 
  - data-engineering
  - etl
  - bounty
title: Project Slack Data Collection Bounty
product: null
date: 2024-10-30
description: A bounty to develop a privacy-conscious data collection system for Slack messages and metrics into our data warehouse.
due_date: null
status: Open
PICs: null
completion_date: null
bounty: 
hide_frontmatter: null
function: "🛠️ Tooling"
🔺_priority: null
reward_🧊: 
remark: null
requester: null
ranking: null
pi_cs: null
start_date: null
progress: null
---

This bounty focuses on developing a privacy-first data collection system for Slack, ensuring we can gather valuable insights while respecting user privacy and workspace policies.

## TL;DR

**Objective**: Develop a privacy-first system to collect Slack data from project channels for analytics purposes.

**Key Points**:
- Runs on engineer's machine (no bots)
- Only collects from project channels that are available to the engineer
- Removes PII and sensitive content where reasonable
- Includes monitoring and audit capabilities

**Privacy Focus**:
- Hashes user identifiers
- Respects user preferences
- Zero PII exposure

## Core Requirements

The system will be designed to crawl project messages on Slack through the engineer's machine. This approach mimics a user manually collecting messages, thereby avoiding the creation of bots and potential administrative issues. The collection process will be integrated seamlessly into the engineer's workflow, ensuring that it operates as if a user is manually accessing and collecting the data.

## Technical Specifications

The collection system will utilize the engineer's machine to access Slack messages. This will involve setting up a local application that can authenticate using the engineer's credentials, ensuring that the data collection process is indistinguishable from normal user activity. The application will be responsible for gathering messages from project channels, extracting relevant metrics, and securely transmitting this data to our data warehouse.

## Privacy Measures

The data collection process will be designed with privacy as a top priority. It will only collect necessary data from public project channels, explicitly avoiding private channels and direct messages. User preferences will be respected, and any personal identifiable information (PII) will be removed during processing. User identifiers will be hashed, and sensitive content will be filtered out before storage.

## Implementation Details

The ETL pipeline will be structured to support this user-centric collection method. Scheduled tasks on the engineer's machine will initiate API calls to Slack, simulating manual data retrieval. The collected data will undergo transformation processes, including PII removal, standardization, and aggregation, before being loaded into our data warehouse in a secure and efficient manner.

## Monitoring System

A robust monitoring system will be implemented to track the usage and success of the data collection process. This will include monitoring API usage, collection success rates, and processing metrics. Privacy compliance will be ensured through PII detection alerts, access pattern monitoring, and enforcement of data retention policies.

## Deliverables

The deliverables for this project include a fully functional collection system that integrates with the engineer's machine, a processing pipeline with anonymization tools, and a comprehensive monitoring setup. Detailed documentation will be provided, covering the architecture, privacy considerations, and operational guidelines.

## Success Metrics

The success of this project will be measured by its ability to maintain zero PII exposure, achieve 100% compliance with retention policies, and provide a complete audit trail. Technical metrics will include minimal collection failures, efficient API usage, and real-time processing capabilities.

## Implementation Suggestions

The technology stack will include Python for collection, Modal for orchestration, DuckDB for processing, and S3 for storage. The development will be phased, starting with basic collection capabilities, followed by enhanced anonymization, monitoring and alerts, and concluding with documentation and review.

## Additional Considerations

The system will be designed to handle growing message volumes, adapt to changes in the Slack API, and maintain clear code and documentation. Cost efficiency will be a priority, with a focus on optimizing resource usage.

This bounty aims to create a privacy-conscious data collection system for Slack that provides valuable insights while ensuring user privacy and compliance with workspace policies. The system should be built with a strong focus on data protection while still enabling meaningful analytics capabilities.
