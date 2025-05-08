---
title: Brainery Data Flow
description: Illustrates the data ingestion and query flows for the Brainery system, detailing how data from sources like Discord, Memo Blog, and GitHub is processed via MCP and stored in TimescaleDB, and how it's queried by an LLM-powered chatbot.
date: 2025-05-08
authors:
  - monotykamary
aliases:
  - /share/brainery-data-flow
tags:
  - brainery
  - data-flow
  - mcp
  - timescaledb
  - llm
  - discord
  - github
  - gcp-s3
  - architecture
  - second-brain
---

## 1. Sequence data flow: from Discord/... -> Landing zone -> TimescaleDB

This diagram illustrates how data from Discord, Memo Blog, and GitHub is ingested into TimescaleDB via the MCP server, with the background interface acting as an LLM leveraging the MCP protocol.

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

## Explanation

The flow begins with Discord (e.g., a message in #tech), Memo Blog (e.g., a subscription), and GitHub (e.g., a commit) depositing raw data into the landing zone (GCP S3). The background interface, an LLM instance, monitors the landing zone and initiates processing by sending an MCP request to the MCP server. This request invokes a function (e.g., “parse_and_store”), passing the raw data as input. The MCP server, adhering to the Model Context Protocol, interprets the request, parses the data into a structured payload (e.g., with entities, relations, and tags), and inserts it into the observation_log hypertable in TimescaleDB. The append-only nature is preserved, and the MCP server confirms the insertion back to the background interface, completing the pipeline.

## 2. Sequence query flow: from external services/platform -> MCP -> Timescaledb

This diagram depicts how an external service queries the database through the MCP client (chatbot), an LLM that uses the MCP server to execute actions against TimescaleDB.

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

The sequence starts when an external service or platform (e.g., a user’s chat app) sends a natural language request to the MCP client, a chatbot powered by an LLM. For instance, a user asks, “What’s trending in #tech?” The MCP client interprets this request and constructs an MCP request (e.g., a function call like “query_db”) with a generated SQL query, such as “SELECT * FROM coined_term_trends WHERE bucket >= NOW() - INTERVAL '1 month'”. The MCP server receives this request, executes the specified function, and queries TimescaleDB—either the raw observation_log or a continuous aggregate like coined_term_trends. The database returns the results (e.g., trend data), which the MCP server relays back to the MCP client. The MCP client then uses its LLM capabilities to format the raw data into a natural language response (e.g., “Vibe Coding is trending with 20 mentions this week”) and sends it to the external service, bypassing a traditional frontend.

In the data flow, the background interface operates as an LLM that interacts with the MCP server using the Model Context Protocol. It processes raw data from the landing zone (GCP S3) and relies on the MCP server to handle the insertion logic, ensuring structured payloads are written to TimescaleDB. This aligns with Anthropic’s MCP vision of enabling LLMs to call functions and manage context, here applied to data ingestion.

In the query flow, the MCP client (chatbot) is another LLM instance that uses the MCP server to execute database queries. The MCP server acts as a protocol layer, interpreting function calls from the MCP client and interfacing with TimescaleDB. The chatbot handles both query generation and response formatting, leveraging the MCP protocol to abstract the database interaction.
