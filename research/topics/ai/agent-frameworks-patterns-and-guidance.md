---
draft: false
title: "Composing the future, part 5: agent patterns, open problems and how to choose"
description: "The common agent composition patterns, the problems that remain unsolved, where the field is heading, and guidance for picking a framework."
date: "2025-06-02"
authors:
  - monotykamary
tags:
  - ai
  - agentic-ai
  - architecture
  - frameworks
  - multi-agent-systems
  - langgraph
  - autogen
  - openai-agents
  - mcp
  - fast-agent
  - mastra
  - crewai
  - llamaindex
  - software-engineering
toc: true
slug: agent-frameworks-patterns-and-guidance
announce: false
series: ai-agent-frameworks
series_part: 5
series_total: 5
---

After the individual frameworks, this part steps back. It lists the composition patterns that show up across all of them, names the problems that remain hard, and looks at where the field is heading. It ends with the key findings and a set of questions to ask before committing to a framework.

> Part 5 of 5 in the AI agent frameworks series. Previous: [Composing the future, part 4: LlamaIndex and the framework face-off](agent-frameworks-llamaindex-comparison.md)

## Architectural blueprints - common agent composition patterns

While frameworks bring their own syntactic sugar, the multi-agent systems they build often follow some battle-tested architectural patterns. These are the fundamental ways to organize agents, control their chatter, and divvy up the work. Understanding these patterns helps you see the forest for the trees, regardless of which shiny new framework you're playing with.

### Foundational patterns: the building blocks

These keep popping up everywhere:

- **Vertical/hierarchical pattern**: (The Boss Hog)
  - **Description**: A leader/supervisor agent calls the shots, overseeing sub-agents or sub-tasks. Clear chain of command.
  - **Pros**: Accountability is clear. Easy to break down tasks. Central control keeps things aligned.
  - **Cons**: Leader can be a bottleneck. Single point of failure. Sub-agents might feel micromanaged (less autonomy).
  - **Seen in**: LangGraph (Supervisor, Hierarchical), Autogen (hierarchical chat), OpenAI Agents SDK (TriageAgent example), Mastra (Publisher-Worker), CrewAI (Hierarchical process), LlamaIndex (supervisor-like workflows).

- **Horizontal/decentralized/network pattern**: (The Round Table)
  - **Description**: Agents are peers. Decisions are often group-driven. Freer interaction.
  - **Pros**: Fosters dynamic problem-solving, innovation. Good for parallel work.
  - **Cons**: Coordination can be a beast, leading to slowdowns. Group decisions can take forever.
  - **Seen in**: LangGraph (Network), Autogen (Dynamic Group Chat).

- **Sequential/pipeline pattern**: (The Assembly Line)
  - **Description**: Agents in a line. Output of one is input for the next. Each agent owns a stage.
  - **Pros**: Simple to grasp, build, and debug. Good audit trail because the flow is linear.
  - **Cons**: Can be rigid. A failure at one stage kills the whole line.
  - **Seen in**: LangGraph (explicit edges), fast-agent (`@fast.chain`), CrewAI (Sequential process), Mastra (sequential workflow with `.then()`).

- **Orchestrator-Worker (master-worker) pattern**: (The General Contractor)
  - **Description**: Central orchestrator doles out tasks to worker agents, manages execution. Often a specific type of hierarchical setup.
  - **Event-driven twist**: Use something like Apache Kafka. Orchestrator drops command messages on topics. Worker agents (as consumer groups) grab tasks. Decouples orchestrator from direct worker nagging.
  - **Pros**: Efficient task delegation, central coordination. Workers can specialize. Event-driven adds resilience, scalability.
  - **Cons**: Orchestrator can be a bottleneck if not built for speed or if it gets too complex.

- **Router pattern**: (The Traffic Cop)
  - **Description**: A dedicated router agent gets tasks/messages, sends them to specialized agents based on content, rules, or learned logic.
  - **Pros**: Manages complexity by getting tasks to the right specialist. Organizes the system.
  - **Cons**: Router can be a bottleneck or single point of failure. Routing logic better be solid.
  - **Seen in**: fast-agent (`@fast.router`), LangGraph (conditional edges can do this).

- **Aggregator pattern**: (The Synthesizer)
  - **Description**: Multiple agents do their thing independently. Their outputs are collected and combined by an aggregator agent into one final result.
  - **Pros**: Blends diverse perspectives or processing results. Good when you need multiple viewpoints or parallel work followed by integration.
  - **Cons**: Aggregation logic can be tricky, especially with conflicting or varied outputs.
  - **Seen in**: fast-agent (`@fast.parallel` with a `fan_in` agent).

- **Blackboard pattern**: (The Shared Whiteboard)
  - **Description**: Agents collaborate indirectly by reading/writing to a shared knowledge base (the "blackboard"). No direct agent-to-agent chat needed.
  - **Event-driven twist**: Blackboard can be a data streaming topic (Kafka again). Agents produce/consume messages representing shared info.
  - **Pros**: Loose coupling between agents. Good for problems solved incrementally by diverse specialists.
  - **Cons**: Keeping the blackboard consistent and avoiding write-wars can be tough.

- **Market-based pattern**: (The Auction House)
  - **Description**: Models a marketplace. Agents negotiate, bid, or compete for tasks/resources. For dynamic resource allocation, distributed decisions.
  - **Event-driven twist**: Separate topics for bids and asks. A market maker service matches them, publishes deals.
  - **Pros**: Highly adaptive, can lead to efficient resource use.
  - **Cons**: Designing good bidding/negotiation protocols is complex.

### How frameworks enable these patterns

The frameworks we’ve dissected give you the lego bricks to build these patterns:

- **LangGraph**: Its explicit graph (nodes as agents/functions, edges as control flow, conditional edges for routing) directly builds Sequential, Hierarchical (Supervisor), Router, and Network patterns. State management is key for passing info.
- **Microsoft Autogen**: `ConversableAgent` and dynamic group chats are prime for Horizontal/Decentralized/Network. Nested chats and function calling let you whip up Hierarchical and Orchestrator-Worker structures in a conversational style.
- **OpenAI swarm/agents SDK**: The handoff mechanism is a straight shot to Sequential flows (A to B to C) and Hierarchical/Router patterns (TriageAgent sending to specialists).
- **fast-agent**: Its decorators (`@fast.chain`, `@fast.parallel`, `@fast.router`, `@fast.orchestrator`, `@fast.evaluator_optimizer`) are high-level maps to Sequential, Aggregator (with fan-in), Router, Orchestrator-Worker, and even iterative refinement loops.
- **Mastra**: Workflows with `.then()` make Sequential easy. Treating agents as tools enables Hierarchical (supervisor-worker) setups, like its Publisher-Copywriter-Editor example.
- **CrewAI**: Explicit `process='sequential'` or `process='hierarchical'` for crews directly implements these. Task dependencies also force sequential execution.
- **LlamaIndex**: `AgentWorkflow` (with its root agent and tool-based handoffs) builds Sequential and Hierarchical pipelines of agents acting on shared state.

Here’s the kicker: many "framework-specific" multi-agent patterns are just fancy versions of these fundamental blueprints. LangGraph’s "Supervisor"? Clear Hierarchical/Orchestrator-Worker. fast-agent’s `@fast.router`? That’s the Router pattern. Knowing this helps you cut through the framework jargon, understand the core architectural choices, and maybe even translate designs between frameworks. This is about principled design, not just picking the shiniest tool.

## The bleeding edge - challenges and what's next

So, we've got all these cool frameworks and patterns. Are we living in an AI agent utopia yet? Keep dreaming. Building robust, scalable, and reliable multi-agent systems is still a knife fight. And the future? It's a mix of exciting and terrifying.

### Current headaches: why this is still hard

Deploying real multi-agent systems means wrestling with some serious demons:

- **Standardization & interoperability**: Or lack thereof. It's a Tower of Babel. Agents from different frameworks or providers can't easily chat. Kills reusability, cripples scalability of big, diverse agent networks. MCP is a good try for tools, but we need more.
- **Scalability**: More agents, crazier interactions? Performance and resource management become a nightmare. Think communication overhead, state syncing, bottlenecked central agents.
- **Debugging & observability**: LLM agents are autonomous, often non-deterministic. Multi-agent setups? Exponentially harder to debug. Tracing interactions, finding root causes, monitoring performance across a distributed mess; it's brutal.
- **Evaluation**: Current benchmarks are mostly crap. They look at task completion, ignore cost, reproducibility, robustness, safety, real-world practicality. We need holistic, standard, _realistic_ ways to measure these things.
- **Reasoning flaws & context amnesia**: LLMs still suck at complex logic, causality, math. Agents forget crucial info over long chats or many turns, losing coherence.
- **Tool use fumbles**: Frameworks offer tool integration, but agents still struggle to pick the right tool, format inputs correctly, interpret outputs reliably, and handle tool failures or changes.
- **Security & privacy**: Agents touch sensitive data, external systems. Robust security, access control, user privacy are non-negotiable. Preventing misuse, breaches, rogue agent actions is critical.
- **Ethics & alignment**: Making sure agent goals and actions line up with human values? Yeah, that's a big one. Designing for fairness, transparency, accountability, and actual benefit is an ongoing war.

These problems are all tangled up. No standards? Harder to build debug tools. Reasoning errors in a complex agent web? Good luck finding the source without solid tracing. This means solutions need to be multi-pronged. Fix one area, and it might help others. But it's a slog.

### Emerging trends & future stargazing: where this madness is headed

The agent composition field is a blur, but some trends are emerging from the chaos:

- **Evolvable & layered protocols**: Static, rigid communication rules are out. We need protocols that adapt as agents get smarter. Layered architectures for transport, messaging, semantics.
- **Agent mesh / network protocols**: Think Agent Network Protocol (ANP), Agent-to-Agent (A2A). Designing for seamless, scalable collaboration between diverse agents from different creators, forming an "agent mesh."
- **Privacy-preserving tech**: Agents + sensitive data = need for federated learning for agents, secure multi-party computation, differential privacy baked into communication and design.
- **Smarter reasoning architectures**: Hybrid systems (neural + symbolic), specialized reasoning modules (math, legal), meta-reasoning (agents reflecting on their own thinking) to bust through current LLM limits.
- **Long-Term memory & next-level context**: Hierarchical memory, episodic memory (like humans), better retrieval-augmented setups so agents can remember what they did last week and why.
- **Human-agent collaboration that doesn't suck**: Mixed-initiative models (humans and AI fluidly sharing control), explainable AI (XAI for agents so we know _why_ they did that), personalized agent behavior.
- **Collective intelligence infrastructures**: The big dream. Massive networks of specialized agents tackling systemic problems too big for individual agents or even human teams. Needs robust discovery, coordination, knowledge sharing.
- **Real-World evaluation**: Standardized, holistic benchmarks that measure agents on accuracy, cost, safety, robustness, and if they're actually useful in the wild.
- **Event-driven architectures for MAS**: Using event-driven principles (often with Kafka) for resilient, scalable, decoupled multi-agent systems. Agents react to events asynchronously. Cleaner, faster.

The writing's on the wall: this isn't just about smarter individual agents. It's about building a more robust, interconnected, intelligent _ecosystem_ for them. Standardized communication, better building tools, and ensuring they learn, adapt, and operate safely and ethically. The goal? Moving from collections of agents to actual **collective intelligence** that can tackle problems we can't even imagine yet. This needs new theories, badass tools, and rock-solid infrastructure.

## The bottom line - wrapping this up & getting tactical

We've ripped apart the guts of AI agent architecture frameworks. It's a wild, fast-moving space, crucial for pushing AI beyond simple task-doers into autonomous, collaborative systems that can actually chew on complex, multi-step problems. If you're not thinking about this, you're already behind.

### Key findings: what we've learned (or should have)

Dissecting LangGraph, Autogen, OpenAI's new toys, MCP-based systems like fast-agent, Mastra, CrewAI, and LlamaIndex has hammered home a few truths:

- **Orchestration is everything**: Coordinating specialized agents is job #1. Frameworks differ wildly, from explicit graphs (LangGraph, LlamaIndex) to dynamic chats (Autogen) and role-playing (CrewAI).
- **State management is king (or queen)**: Agents need to remember shit. How frameworks handle context and memory—explicit state objects, message histories, dedicated memory—is make-or-break for coherence and long tasks.
- **Tools unleash action**: Agents with tools are agents that can _do_ things in the real world (or at least, the digital one). Standardizing tool integration (looking at you, MCP) is a game-changer.
- **Modularity & specialization tame complexity**: Break down big problems for specialist agents. Hierarchies, teams; it’s how humans solve hard stuff, and it works for AI too. Makes systems easier to build and fix.
- **Dev experience & abstraction levels vary massively**: Python vs. TypeScript. Code-first deep dives vs. declarative decorators or visual UIs. Pick your poison based on your team and project.

The big trend? Multi-agent systems are the future. Single agents are for hobbyists. Real-world problems demand teams of specialized AI agents. This puts a massive spotlight on solid orchestration, clean communication, and smart state management.

### Guidance: how to pick your poison (wisely)

Choosing an agent composition framework is a big architectural bet. It’ll dictate your development speed, system power, and how much you’ll want to tear your hair out later. There's no magic bullet. The right choice comes from brutally honest assessment of your project's needs.

**Key factors to chew on before you commit:**

- **Project demands & complexity level**:
  - **Task nature**: Is it a super-structured, auditable beast (think LangGraph)? A dynamic, chatty free-for-all (Autogen)? A document-heavy slog (LlamaIndex)? Or does it map nicely to a human team (CrewAI)?
  - **Statefulness**: How vital is remembering complex state over long interactions? Frameworks with explicit, robust state management (LangGraph again) have the edge.
  - **Auditability vs. flexibility**: Need a clear paper trail (graphs)? Or more dynamic freedom?

- **Your team's DNA & existing stack**:
  - **Language wars**: Python is king, but Mastra is there for TypeScript/JavaScript crews.
  - **Dev skills**: Does your team get graph theory? Event-driven architectures? Specific LLM provider APIs?
  - **Existing infrastructure**: How well does the framework plug into your current databases, messaging systems, cloud crap?

- **Interoperability; can it play nice?**
  - If your system needs to talk to a zoo of external tools or agents from different vendors, frameworks built on or supporting standards like MCP (fast-agent, LangGraph with MCP adapters) are a smarter bet.

- **Scalability; will it choke?**
  - For systems that need to handle tons of agents or high traffic, look at async architectures (Autogen) or those built for distributed execution and smart state handling.

- **Lifecycle management & production readiness**:
  - Think beyond dev. How’s the support (or ecosystem) for deployment, monitoring, debugging, versioning, ongoing evaluation? Platforms like Orq.ai are trying to solve this. Guardrails and built-in tracing (OpenAI Agents SDK) are good signs of production focus.

**Specific gut-check recommendations:**

- **Highly stateful, auditable enterprise workflows needing tight control**: LangGraph.
- **Dynamic multi-agent collaboration, research, code-gen in a chatty style**: Microsoft Autogen.
- **Deep in the OpenAI ecosystem, need streamlined tools & clear handoffs**: OpenAI Agents SDK.
- **Rapid workflow building & MCP interoperability**: fast-agent with its decorators.
- **TypeScript-first development (web apps, Node.js)**: Mastra.
- **Tasks that map to human teams, needing role-based agent design**: CrewAI.
- **Document-heavy agent workflows needing deep interaction with structured/unstructured docs**: LlamaIndex & its ADW.

In complex fields like finance, start with **hybrid architectures** blending pattern strengths. Match patterns to business goals (e.g., sequential for audit trails, network for trading). **Build complexity slowly**. Prioritize **observability** for tracing. Design for **human-AI collaboration**. And balance agent autonomy with **strict controls and safeguards**; don't let your financial bots go rogue!

Picking an agent framework is a foundational move. Given how fast this field is changing and the different strengths of current frameworks, you might even need a **portfolio strategy**; different frameworks for different problems. The absolute crucial play? **Prioritize frameworks that are leaning into emerging interoperability standards.** That’s your ticket to future flexibility and avoiding a siloed, incompatible agent mess.

The road to truly intelligent, collaborative AI agent ecosystems is still being paved. Your choice of composition tools will massively shape how, and if, you get there. Choose wisely. Now, go build something that doesn't suck.
