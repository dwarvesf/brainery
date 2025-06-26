---
title: Build a MCP client for Discord
description: null
date: 2025-05-22
authors:
  - quanglm
  - tieubao
tags:
  - mcp
redirect:
  - /zgugkQ
---

diagram

1. (why) motivation to build discord mcp
    * The motivation behind building MCPilot stems from the desire to transform the bot from a fixed-function tool into a highly customizable and extensible platform. Users and communities have diverse needs, and MCPs make it possible to tailor the bot’s capabilities by integrating external APIs or running custom scripts. This flexibility empowers individuals and server administrators to directly control the tools and data sources the bot can access, eliminating the dependency on developers for every new feature or integration. MCPilot also encourages innovation by enabling users to create and share unique applications—whether for automation, data retrieval, or service interaction. Furthermore, it ensures the system remains future-proof; as new APIs and services emerge, MCPs offer a standardized method for integration without requiring continual updates to the bot’s core functionality.

2. architecture
3. scope for mcp: global (server), channel, user (tenant)? -> (why) tai sao lai thiet ke phan quyen kieu nay?
    * The granularity of MCP scopes—USER, CHANNEL, and GLOBAL—is designed to enable precise access control tailored to the nature of the tools and the sensitivity of the data involved. USER scope provides individuals with a secure space to manage personal API keys, private scripts, and configurations not meant for sharing. CHANNEL scope is ideal for community-specific tools, enabling server administrators to deploy utilities relevant to particular channels or moderation teams, keeping functionality organized and contextually appropriate. GLOBAL scope supports widely applicable tools accessible to everyone, such as public APIs or general-purpose utilities. This tiered structure not only enhances security and relevance but also helps reduce clutter by ensuring users see only the tools pertinent to them, mirroring how communities naturally organize information—privately, by team, or publicly.
    * Complementing this scope model is a permissions framework that combines Discord roles with MCP ownership to enforce secure and flexible access. This hybrid model adheres to the principle of least privilege, ensuring users and roles are granted only the permissions they truly need. It offers community administrators the oversight necessary to manage shared MCPs effectively, while still preserving full autonomy for individuals managing USER-scoped tools. Ownership clearly delineates responsibility for the configuration and security of each MCP. A particularly thoughtful design choice ensures that when an admin updates sensitive data in a shared MCP, they temporarily assume ownership—allowing decryption without violating the principle that only owners can access secure data. This model balances security, control, and usability in a nuanced and practical way.

4. (how) sandbox env (why) for mcp runtime isolation
    * Isolating command-based MCP execution in sandboxes is absolutely essential for security, stability, and scalability. Since these MCPs can run arbitrary user-defined code, executing them directly on the bot’s host system would pose a severe security risk—potentially allowing unauthorized file access, execution of malicious code, or disruption of core operations. E2B sandboxes mitigate this by providing isolated environments where code runs safely, shielded from the host system and other users. Beyond security, sandboxes offer better control over system resources, preventing excessive CPU or memory use that could destabilize the bot. They also resolve dependency conflicts by allowing each command to run in its own tailored environment and ensure that no command can interfere with another. Performance and cost-efficiency are additional considerations—sandbox pooling allows reuse of initialized environments, significantly speeding up execution while reducing the overhead and costs associated with constant sandbox creation. Similarly, health checks and retry logic for failed or expired sandboxes enhance the system’s resilience, enabling it to self-heal and continue operating smoothly. On the networking side, pooling applies to connections as well. Establishing new network connections for every MCP request introduces latency and consumes resources. Without pooling, the system risks sluggishness, resource exhaustion, and rate limit violations from both infrastructure and third-party services. By reusing warm connections and sandboxes, the bot maintains low latency, high throughput, and efficient resource use, ensuring it remains responsive and reliable even under high load.

5. security: encryption?
  encrypt cai gi?
  tai sao lai encrypt kieu nhu vay?
    * The encryption strategy for handling sensitive fields like headers and environment variables is built around strong, industry-standard practices to ensure both confidentiality and integrity. These fields often contain secrets such as API keys, authentication tokens, or database credentials, making encryption essential to protect against potential database breaches. AES-256-GCM is chosen for its strong symmetric encryption capabilities, with GCM mode providing authenticated encryption that not only secures the data but also ensures it hasn’t been tampered with. At the core of this encryption system lies the BOT_MASTER_SECRET, which serves as the foundation from which all user-specific encryption keys are derived. Because of its critical role, it must be stored with the utmost security. To further isolate each user’s data, the system incorporates per-user salts—random values that enhance key derivation security by preventing rainbow table attacks and ensuring that no two users share the same encryption key, even with similar input. The key derivation process itself is handled by HKDF, a cryptographically secure algorithm designed to transform the master secret and salt into strong encryption keys. Finally, the use of unique nonces for every encryption operation is a vital requirement of GCM mode; reusing a nonce can completely compromise data security, so the strategy mandates a new, random nonce each time to preserve both confidentiality and integrity. This layered approach ensures sensitive data is robustly protected across storage and transmission.

6. memory; thread
  what? memory
  --> support multiple thread --> separate memory
  --> how
    * Conversation memory plays a critical role in making bot interactions more natural, intelligent, and user-friendly. By retaining context, the bot can understand follow-up questions, references to earlier messages, and evolving user intent, enabling it to engage in coherent, multi-turn conversations rather than treating each message in isolation. This not only supports more complex workflows but also gives users a sense of personalization and continuity, even if the memory is only session-based. The /newthread command complements this system by giving users explicit control over their conversation state. It allows them to start a fresh discussion at any time—particularly useful when shifting to a new topic or when old context might confuse the model or no longer be relevant. It also mitigates issues in long-running chats where accumulated context can become bloated or outdated. Importantly, /newthread doesn’t delete the previous conversation; it archives it, preserving a referenceable history while ensuring the current interaction begins with a clean slate. This design supports clarity, efficiency, and user autonomy in navigating bot interactions.

---

1. Motivation: Why Build MCPilot? Why enable users to manage and utilize MCPs?

* Extensibility & Customization: To move beyond a fixed set of bot functionalities. Users and communities have diverse needs, and MCPs allow them to tailor the bot's capabilities by integrating with virtually any external API or running custom scripts. This transforms the bot from a static tool into a dynamic platform.
* Empowerment: To give users (from individuals to server admins) direct control over the tools and data sources the bot can access, rather than relying solely on the bot developers to add new integrations.
* Innovation: To foster a creative ecosystem where users can develop and share novel uses for the bot by defining new MCPs for various tasks (data retrieval, automation, interaction with other services).
* Future-Proofing: As new APIs and services emerge, MCPs provide a standardized way to integrate them without needing core bot updates for every new service.

2. MCP Scopes (USER, CHANNEL, GLOBAL): Why This Granularity?

2.1. Why provide different levels of accessibility?

* Tailored Access Control: Different tools and configurations have different audiences and sensitivity levels.
* USER: Protects personal API keys, private scripts, or configurations that are not meant for sharing. It gives individuals a secure space.
* CHANNEL: Facilitates community-specific tools. A server admin might want a tool for their moderation team or a utility relevant only to discussions in that specific server/channel. It keeps tools organized and contextually relevant.
* GLOBAL: Allows for widely applicable utilities that anyone can benefit from, like a public API for weather or a general information lookup tool.
* Reduced Clutter: Prevents users from being overwhelmed by a massive list of irrelevant MCPs. Scoping helps filter what's visible and usable.
* Organizational Structure: Mirrors how information and tools are often organized in communities (private, team-specific, public).

2.2. Permissions (RBAC & Ownership): Why This Model?

* Why combine Discord roles with MCP ownership/type for authorization?
* Principle of Least Privilege: Ensures users and roles only have the permissions they absolutely need.
* Flexibility & Control for Admins: Admins/moderators (via Discord roles) need oversight and the ability to manage shared resources (CHANNEL, GLOBAL MCPs) for their communities.
* Autonomy for Individuals: MCP owners have full control over their USER-scoped MCPs and the sensitive data within any MCP they own.
* Clear Responsibility: Ownership clearly defines who is responsible for an MCP's configuration and the security of its credentials.
* Secure Sensitive Data Handling: The rule that an admin updating sensitive data on a shared MCP effectively takes ownership (for decryption purposes) is a clever way to maintain the "only owner decrypts" principle while still allowing administrative changes.

3. Encryption Strategy: Why AES-256-GCM, HKDF, Master Secret & Salts?

* Why encrypt headers and env at all?
  * Data Sensitivity: These fields are prime candidates for storing secrets like API keys, auth tokens, database passwords, etc. Storing them in plaintext in the database would be a severe security risk if the database were compromised.
* Why AES-256-GCM?
  * Strong Confidentiality: AES-256 is a widely adopted, strong symmetric encryption standard.
  * Authenticity & Integrity (AEAD): GCM mode provides Authenticated Encryption with Associated Data. This means it not only encrypts the data but also generates an authentication tag. This tag allows the system to verify that the ciphertext has not been tampered with during storage or transit. This is crucial because an attacker might try to modify encrypted credentials.
* Why BOT_MASTER_SECRET?
  * Central Secret Anchor: Acts as the ultimate secret from which all user-specific encryption keys are derived. Its compromise would be catastrophic, hence the emphasis on storing it very securely.
* Why Per-User Salts?
  * Prevent Rainbow Table Attacks: Salts make pre-computed hash tables (rainbow tables) ineffective against password/key guessing.
  * Unique Keys per User: Ensures that even if two users somehow had inputs that would lead to the same intermediate key before salting (highly unlikely with a strong master secret), the salt guarantees their final user_specific_keys will be different. This isolates the security of one user's encrypted data from another's.
  * Strengthens Key Derivation: Adds another layer of randomness to the key derivation process.
* Why HKDF (HMAC-based Key Derivation Function)?
  * Secure Key Derivation: Specifically designed to derive cryptographically strong keys from a master secret and other inputs (like a salt). It "stretches" and "mixes" the input entropy to produce keys suitable for encryption algorithms.
* Why Nonces unique per encryption?
  * GCM Security Requirement: Reusing a nonce with the same key in GCM mode is catastrophic and can lead to a complete loss of confidentiality and authenticity. The design correctly emphasizes generating a fresh, random nonce for every encryption.

4. E2B Sandbox Environment for Command-Based MCPs: Why So Crucial?

4.1. Why isolate command-based MCP execution in sandboxes?

* Security (Paramount): This is the primary driver. Command-based MCPs, by their nature, could execute arbitrary code defined by users. Running these directly on the bot's host system would be a massive security vulnerability, potentially allowing:
  * Unauthorized access to the host's file system.
  * Execution of malicious code (malware, data exfiltration scripts).
  * Interference with the bot's core operations or other users' data.
* E2B sandboxes provide a contained environment, limiting the potential damage.
* Resource Control & Stability: Unconstrained commands could consume excessive CPU, memory, or network bandwidth, destabilizing the host system or degrading performance for all users. Sandboxes allow for better resource limiting (though E2B's specific controls aren't detailed, it's a common sandbox feature).
* Dependency Management: Different commands might have conflicting software dependencies. Sandboxes can provide isolated environments with specific dependencies for each command, preventing conflicts.
* Preventing Interference: Ensures that one command-based MCP cannot read data from or interfere with the execution of another, even if run by the same user.
* Why reuse sandboxes (pooling, shared sandboxes)?
  * Performance: Initializing a new sandbox for every command execution can be slow due to the overhead of setting up the environment. Reusing existing, warm sandboxes significantly speeds up execution for subsequent identical or compatible commands.
  * Cost Efficiency: Cloud-based sandbox services like E2B often have costs associated with runtime or instance creation. Reusing instances minimizes these costs.
  * Reduced Resource Churn: Constantly creating and destroying sandboxes creates resource churn on both the host and the E2B infrastructure. Pooling smooths this out.
* Why health checks and 502 error retry logic?
  * Resilience & Reliability: E2B sandboxes can expire or be terminated by the infrastructure. Without health checks, the bot might try to use a dead sandbox URL, leading to failures. The retry logic, which includes removing the stale sandbox and creating a new one, allows the system to self-heal and makes it more robust against these transient issues.
  
4.2 Connection & Sandbox Pooling: Why Necessary?

* Why not create new connections/sandboxes for every request?
  * Performance Overhead:
    * Connections: Establishing new network connections (e.g., TCP handshakes, TLS negotiations for HTTPS MCPs) takes time and consumes resources.
    * Sandboxes: As mentioned, sandbox initialization is a relatively heavy operation.
* Repeatedly doing this for every user interaction or MCP use would make the bot feel sluggish.
  * Resource Exhaustion: Each connection and sandbox consumes system resources (memory, file descriptors, CPU for initialization). Without pooling, a moderate number of concurrent users could quickly exhaust the host system's or E2B's quota.
  * Rate Limiting: External services or the E2B platform might impose rate limits on connection/sandbox creation. Pooling helps stay within these limits.
* What are the direct benefits of pooling?
  * Improved Latency: Reusing warm connections and sandboxes dramatically reduces the time taken to interact with MCPs.
  * Increased Throughput: The bot can handle more concurrent requests because it's not bottlenecked by constant setup and teardown.
  * Efficient Resource Utilization: Resources are shared and reused, leading to lower overall consumption.

5. Conversation Memory & /newthread: Why These Features?

* Why is conversation memory important for a bot?
  * Contextual Understanding: Allows the bot to understand follow-up questions, references to previous parts of the dialogue, and the user's ongoing intent. Without memory, each interaction is isolated and "stateless," making conversations feel disjointed and unnatural.
  * More Complex Interactions: Enables multi-turn dialogues where the bot can gather information over several messages or guide a user through a process.
  * Personalization (Implicit): Remembering context, even if just for a session, makes the interaction feel more personalized.
* Why the guildId_channelId_userId structure for threadId?
  * Precise Context Isolation: This structure ensures that a user's conversation is unique to:
    * Themselves (userId).
    * The specific channel they are in (channelId).
    * The specific server they are in (guildId).
  * This prevents context from leaking between DMs, different channels on the same server, or different servers, which is essential in a multi-tenant environment like Discord.
* Why the need for a /newthread command?
  * User Control Over Context: Sometimes, a user wants to start a completely fresh conversation, even if they are in the same channel with the same user ID. The previous context might be irrelevant or might even negatively influence the AI's responses for a new topic.
  * Avoiding Contextual Bleed: For long-running conversations, the accumulated context might become too large or confusing for the LLM, or might contain outdated information. /newthread provides a clean slate.
  * Organizing Interactions: Users might want to mentally (and now systemically) separate different tasks or topics of discussion with the bot.
  * Preserving History: Importantly, /newthread archives the old thread rather than deleting it. This allows users to maintain a record of past interactions for reference while still getting a fresh start.

---

> mcp management

### Motivations

why we made this?

MCP allows us to access tools and resources that are public by dev community or by other teams/companies

we heavily use

not all text intef

... diagram

### Feature list

list of MCPs
and features

### ERD

### Data flow

### Connection pool

how we control connections in the pool

### Authorization

how we setup authorization for mcp (as resources)
and do data encryption
