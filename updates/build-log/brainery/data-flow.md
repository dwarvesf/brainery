---
title: Data flow in Brainery
description: How data flows through Brainery's second brain system, from Discord, Memo Blog, and GitHub sources to TimescaleDB via MCP, with an LLM-powered interface for natural language queries.
date: 2025-05-08
authors:
  - monotykamary
aliases:
  - /share/brainery-data-flow
tags:
  - brainery
  - data-flow
  - timescaledb
  - llm
  - discord
  - gcp-s3
  - mcp
  - second-brain
redirect:
  - /alm7fQ
---

> **tl;dr**
>
> Brainery gets data from sources like Discord and GitHub into a **Landing Zone**, processes it via **MCP** and **LLMs**, and stores it in the **TimescaleDB observation_log**. **MCP** also lets you query this data easily.

This guide explains how the Brainery system processes and queries data across multiple sources. We'll explore two main flows: data ingestion and query processing. The system leverages **Model Context Protocol (MCP)** for structured data handling and **TimescaleDB** for efficient time-series storage.

## Data ingestion flow

The ingestion pipeline processes data from multiple sources into a structured, queryable format. Here's how it works:

```mermaid
sequenceDiagram
    participant D as Discord (#tech)
    participant M as Memo Blog
    participant G as GitHub
    participant LZ as Landing Zone (GCP S3)
    participant BI as Background Interface (LLM)
    participant MCP as MCP Server
    participant TS as TimescaleDB

    D->>LZ: Posts message in #tech (e.g., "Devs using AI to code")
    M->>LZ: Logs user action (e.g., "0x1234 subscribed")
    G->>LZ: Records commit (e.g., "AI-generated code added")
    Note over LZ: Raw data stored as JSON/CSV in GCP S3 buckets
    LZ->>BI: Triggers batch or stream processing
    BI->>MCP: Sends MCP request (e.g., "parse_and_store", raw data)
    Note over MCP: Executes function: parses data into payload
    MCP->>TS: Inserts into observation_log (append-only)
    TS-->>MCP: Confirms insertion
    MCP-->>BI: Returns success response
```

### System components

```mermaid
graph TD
    D[Discord<br>#tech] -->|Messages| LZ[Landing Zone<br>GCP S3]
    M[Memo Blog<br>subscribe, mint, etc.] -->|User Actions| LZ
    G[GitHub<br>Commits, Issues] -->|Repo Activity| LZ
    LZ -->|Raw Parquet| BI[Background Interface<br>LLM]
    BI -->|MCP Request: parse_and_store| MCP[MCP Server<br>Model Context Protocol]
    MCP -->|Structured Payload| TS[TimescaleDB<br>observation_log]

    subgraph Data Sources
        D
        M
        G
    end
    subgraph Ingestion Pipeline
        LZ
        BI
        MCP
        TS
    end
```

### How it works

1. **Data collection**: Raw data flows into the system from three primary sources:
   - **Discord**: Technical discussions and insights from #tech channel
   - **Memo Blog**: User actions like subscriptions and content interactions
   - **GitHub**: Repository activities including commits and issues

2. **Landing zone**: All raw data is initially stored in **GCP S3** buckets in JSON/CSV format, acting as a reliable buffer for incoming data.

3. **Processing pipeline**:
   - The **Background Interface** (an LLM instance) monitors the landing zone
   - When new data arrives, it triggers processing through **MCP requests**
   - The **MCP Server** parses raw data into structured payloads
   - Data is stored in TimescaleDB's **observation_log** hypertable

4. **Storage**: TimescaleDB maintains an **append-only** observation log, ensuring data integrity and auditability.

## Query flow

The query flow enables external services to interact with the stored data through an LLM-powered chatbot interface.

```mermaid
sequenceDiagram
    participant C as MCP Client (Chatbot LLM)
    participant MCP as MCP Server
    participant TS as TimescaleDB

    C->>MCP: Sends MCP request (e.g., "query_db", "SELECT * FROM coined_term_trends...")
    Note over MCP: Executes function: runs SQL query
    MCP->>TS: Queries observation_log/aggregates
    TS-->>MCP: Returns results (e.g., "Vibe Coding, mention_count: 20")
    MCP-->>C: Delivers raw result set
    C->>C: Formats response (e.g., "Vibe Coding is trending...")
    Note over C: Chatbot presents response to user
```

### Query architecture

```mermaid
graph TD
    C[MCP Client<br>Chatbot LLM] -->|MCP Request: query_db| MCP[MCP Server]
    MCP -->|SQL Query| TS[TimescaleDB<br>observation_log + aggregates]

    subgraph Query Interface
        C
        MCP
    end
    subgraph Database Interaction
        TS
    end
```

### Query process

1. **Request handling**:
   - External services send natural language queries to the **MCP Client** (chatbot)
   - The LLM interprets the request and generates appropriate SQL queries

2. **Query execution**:
   - The **MCP Server** receives and validates the query request
   - Queries are executed against TimescaleDB's **observation_log** or **aggregates**
   - Results are returned to the MCP Client

3. **Response formatting**:
   - The LLM formats raw data into natural language responses
   - Responses are delivered directly to the requesting service

## Key benefits

- **Structured data flow**: The MCP protocol ensures consistent data handling across the system
- **Scalable storage**: TimescaleDB's hypertable architecture enables efficient time-series data management
- **Intelligent interface**: LLM-powered chatbot provides natural language access to complex data
- **Reliable processing**: Append-only logs maintain data integrity and auditability

## Implementation notes

- The **Background Interface** operates as an LLM that uses MCP for data ingestion
- The **MCP Server** acts as a protocol layer between LLMs and TimescaleDB
- The system maintains **append-only** logs for data integrity
- All data transformations are handled through **MCP requests** for consistency

---

> Next: [Promote data to insight](promote-data-to-insight.md)
