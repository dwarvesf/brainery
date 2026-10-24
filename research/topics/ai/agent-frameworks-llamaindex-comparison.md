---
draft: false
title: "Composing the future, part 4: LlamaIndex and the framework face-off"
description: "LlamaIndex's agent features for document-heavy work, then a side-by-side comparison of the frameworks on differentiators, strengths and ease of development."
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
slug: agent-frameworks-llamaindex-comparison
announce: false
series: ai-agent-frameworks
series_part: 4
series_total: 5
type: writing
form: analysis
topic: ai-agents
secondary_topics:
  - architecture
fit: 3
---

LlamaIndex started as a data framework for retrieval and grew agent features on top. This part covers those, then closes the tour with a side-by-side comparison: what sets each framework apart, where each one is strong or weak, and how fast a team can build and scale with it. The comparison table covers the frameworks from parts 1 to 3 as well.

> Part 4 of 5 in the AI agent frameworks series. Previous: [Composing the future, part 3: Mastra and CrewAI](agent-frameworks-mastra-crewai.md) | Next: [Composing the future, part 5: agent patterns, open problems and how to choose](agent-frameworks-patterns-and-guidance.md)

## LlamaIndex (Agentic Capabilities): For when your agents need to read... a lot

**LlamaIndex**, born from the fires of Retrieval Augmented Generation (RAG), has beefed up significantly. It's not just for RAG anymore; it's a full-blown framework for data-centric AI apps, and that includes **multi-agent systems**. Its agent features are laser-focused on workflows that wrestle with data and documents. If your agents need to be paper-pushers (in the digital sense), LlamaIndex is your huckleberry.

**AgentWorkflow architecture: the guts**
LlamaIndex's multi-agent game revolves around its **AgentWorkflow** architecture. Two main parts:

- **Agent module**: Base classes for agents.
  - `FunctionAgent`: For LLMs that do function calling. Has methods like `take_step` (decide next action/tool), `handle_tool_call_results` (process tool output), `finalize` (end turn).
  - `ReActAgent`: For the ReAct (Reasoning and Acting) pattern, good for LLMs without native function calling. Thinks, acts, observes, repeats.
  - Both come from `BaseWorkflowAgent`.
- **AgentWorkflow module**: The conductor. Orchestrates agents and task flow.
  - `init_run`: Sets up context and memory.
  - `setup_agent`: Figures out who's on duty, preps their system prompt and chat history.
  - `run_agent_step`: Calls current agent's `take_step` to see what tools to hit next.
  - `parse_agent_output`: Translates agent's desires into actions.
  - `call_tool`: Runs the tools.
  - `aggregate_tool_results`: Gathers tool results, decides next move (continue, handoff, or finish).

A slick move here: **handoff between agents is just another tool**. Agent wants to pass the baton? It calls the "handoff tool," which tells the workflow who's up next.

LlamaIndex didn't just stumble into agents. It evolved from a RAG powerhouse to a multi-agent framework with a serious focus on **"Agentic Document Workflows" (ADW)**. This carves out a killer niche: automating complex knowledge work that's all about document interaction; legal analysis, medical records, financial audits. By building on its strengths in data indexing, parsing (LlamaParse is a beast), and retrieval (LlamaCloud), LlamaIndex is aiming to own the enterprise AI space where structured and unstructured document smarts are king. If your agents need to _really_ understand and manipulate documents, LlamaIndex might offer more specialized firepower than general-purpose agent frameworks.

**Agentic Document Workflows (ADW): Beyond basic ocr**
ADW isn't just glorified OCR or simple RAG. It’s about agents doing complex, multi-step knowledge work _on top of_ your documents. Document agents in an ADW setup typically:

1.  Extract and structure info from docs (often via LlamaParse).
2.  Keep track of document context and where they are in a business process (state).
3.  Fetch and analyze relevant reference material from knowledge bases (like LlamaCloud).
4.  Generate recommendations or take actions based on business rules and what they've read.
    Think contract review: agent extracts clauses, checks against regulations, flags risks, generates compliance reports. Heavy-duty stuff.

**Quick example: multi-agent research and report generation (research-write-review)**
LlamaIndex docs show this off: AgentWorkflow managing three specialized `FunctionAgent`s that hand off tasks sequentially, sharing state.

1.  **Define Tools**: `search_web` (e.g., via Tavily), `record_notes` (writes to shared state), `write_report` (writes to shared state), `review_report` (writes review to shared state). These are Python functions wrapped with `FunctionTool`.
2.  **Define Agents**:
    - `ResearchAgent`: System prompt: "Search web, record notes. Satisfied? Handoff to WriteAgent." Tools: `search_web`, `record_notes`. Can handoff to `WriteAgent`.
    - `WriteAgent`: System prompt: "Write Markdown report from notes. Grounded in research. Done? Get feedback from ReviewAgent (at least once)." Tools: `write_report`. Can handoff to `ReviewAgent`.
    - `ReviewAgent`: System prompt: "Review report. Approve or request changes for WriteAgent." Tools: `review_report`. Can handoff to `WriteAgent`.
3.  **Setup AgentWorkflow**: Provide the list of agents, name the `root_agent_name` (e.g., "ResearchAgent"), and set up an `initial_state` dictionary (e.g., `{"research_notes": {}, "report_content": "", "review": ""}`).

**Flow**:
User wants a report on internet history.

- Workflow starts with `ResearchAgent`.
- `ResearchAgent` searches, records notes into shared state. Hands off to `WriteAgent`.
- Workflow makes `WriteAgent` current. It uses notes from state, writes report to state. Hands off to `ReviewAgent`.
- `ReviewAgent` checks report from state, saves review to state. Might hand back to `WriteAgent` for fixes or, if happy, workflow ends.
  This nails how AgentWorkflow guides specialized agents through a multi-stage task, managing state and handoffs for complex jobs like research and writing.

```python
# LlamaIndex Code Snippet: Research-Write-Review Workflow (Conceptual)
# Requires LlamaIndex core, and an LLM integration (e.g., llama-index-llms-openai)

import os
from llama_index.core.tools import FunctionTool
from llama_index.core.agent.types import Context # For tool context
# from llama_index.llms.openai import OpenAI # Example LLM
# from llama_index.tools.tavily_research import TavilyToolSpec # Example external tool

# --- Conceptual Setup: Mock LLM and Context for standalone execution ---
class MockLLM_LlamaIndex:
    def __init__(self, model="mock_llama_model"): self.model = model
    def __repr__(self): return f"MockLLM_LlamaIndex(model='{self.model}')"
    # Add predict or chat methods if FunctionAgent internally calls them during init or planning
    async def achat(self, messages, tools=None, tool_choice="auto"):
        # Simulate LLM deciding to use a tool or respond
        # This is highly simplified for conceptual flow
        user_query = messages[-1].content.lower()
        if "search" in user_query and tools and any(t.metadata.name == "search_web" for t in tools):
            return type('obj', (object,), {
                'message': type('obj', (object,), {
                    'tool_calls': [type('obj', (object,), {'id': 'call_123', 'function': type('obj', (object,), {'name': 'search_web', 'arguments': '{"query": "internet history"}'})})]
                })
            })
        # Add more mock logic for other tools/handoffs if needed for deeper simulation
        return type('obj', (object,), {'message': type('obj', (object,), {'content': 'LLM fallback response', 'tool_calls': []})})


llm = MockLLM_LlamaIndex() # Replace with actual LLM: e.g., OpenAI(model="gpt-4-turbo")

async def mock_get_state(key):
    if key == "state":
        # Ensure state is initialized conceptually for tools
        if not hasattr(mock_get_state, '_shared_state'):
             mock_get_state._shared_state = {"research_notes": {}, "report_content": "", "review": ""}
        return mock_get_state._shared_state
    return None

async def mock_set_state(key, value):
    if key == "state":
        mock_get_state._shared_state = value

MockContext = type('MockContext', (object,), {'get': mock_get_state, 'set': mock_set_state})
ctx_instance = MockContext()
# --- End Conceptual Setup ---

# --- Tool Definitions ---
def search_web_func(query: str) -> str:
    print(f"[TOOL search_web_func] ACTION: Searching web for: '{query}'. (Mocked)")
    return f"Mocked search results for: {query}"
search_web = FunctionTool.from_defaults(fn=search_web_func, name="search_web", description="Searches the web for information on a given topic.")

async def record_notes_func(notes: str, notes_title: str, ctx: Context = ctx_instance) -> str:
    print(f"[TOOL record_notes_func] ACTION: Recording notes titled '{notes_title}'.")
    current_state = await ctx.get("state") # type: ignore
    if "research_notes" not in current_state:
        current_state["research_notes"] = {}
    current_state["research_notes"][notes_title] = notes
    await ctx.set("state", current_state) # type: ignore
    return f"Notes '{notes_title}' recorded successfully."
record_notes = FunctionTool.from_defaults(fn=record_notes_func, name="record_notes", description="Useful for recording notes on a given topic into shared state.")

async def write_report_func(report_content: str, ctx: Context = ctx_instance) -> str:
    print(f"[TOOL write_report_func] ACTION: Writing report content.")
    current_state = await ctx.get("state") # type: ignore
    current_state["report_content"] = report_content
    await ctx.set("state", current_state) # type: ignore
    return "Report content written successfully to shared state."
write_report = FunctionTool.from_defaults(fn=write_report_func, name="write_report", description="Useful for writing a report on a given topic to shared state.")

async def review_report_func(review: str, ctx: Context = ctx_instance) -> str:
    print(f"[TOOL review_report_func] ACTION: Submitting review.")
    current_state = await ctx.get("state") # type: ignore
    current_state["review"] = review
    await ctx.set("state", current_state) # type: ignore
    return "Report review submitted successfully to shared state."
review_report = FunctionTool.from_defaults(fn=review_report_func, name="review_report", description="Useful for reviewing a report and providing feedback into shared state.")
```

```python
# LlamaIndex Code Snippet: Research-Write-Review Workflow (Conceptual - Agent Definitions)
# Assumes tools (search_web, record_notes, etc.) and llm (MockLLM_LlamaIndex instance)
# are conceptually available from the previous snippet.

from llama_index.core.agent.workflow import FunctionAgent # Core import

# --- Agent Definitions ---
# llm = MockLLM_LlamaIndex() # Conceptually, llm is already defined.
# Tools like search_web, record_notes, write_report, review_report are also assumed defined.

ResearchAgent = FunctionAgent(
    name="ResearchAgent",
    description="Useful for searching the web for information on a given topic and recording notes on the topic.",
    system_prompt=(
        "You are the ResearchAgent. Your job is to search the web for information on a given topic "
        "and then use the record_notes tool to save your findings. "
        "Once notes are recorded and you are satisfied, you MUST hand off control to the WriteAgent."
    ),
    llm=llm, # Using the conceptually defined mock LLM
    tools=[search_web, record_notes],
    can_handoff_to=["WriteAgent"],
    verbose=True
)

WriteAgent = FunctionAgent(
    name="WriteAgent",
    description="Useful for writing a report on a given topic from research notes stored in shared state.",
    system_prompt=(
        "You are the WriteAgent. Your task is to write a report in markdown format using the research notes. "
        "The content should be grounded in those notes. Once the report is written using the write_report tool, "
        "you MUST hand off to the ReviewAgent to get feedback at least once."
    ),
    llm=llm,
    tools=[write_report],
    can_handoff_to=["ReviewAgent"],
    verbose=True
)

ReviewAgent = FunctionAgent(
    name="ReviewAgent",
    description="Useful for reviewing a report and providing feedback, then saving the review to shared state.",
    system_prompt=(
        "You are the ReviewAgent. Review the report provided in shared state. Use the review_report tool to submit your feedback. "
        "Your feedback should either approve the current report or request specific changes for the WriteAgent to implement. "
        "If changes are needed, hand off back to WriteAgent. If approved, the workflow can conclude."
    ),
    llm=llm,
    tools=[review_report],
    can_handoff_to=["WriteAgent"], # Can hand back for revisions
    verbose=True
)

# print("Conceptual LlamaIndex Agents (ResearchAgent, WriteAgent, ReviewAgent) defined.")
```

```python
# LlamaIndex Code Snippet: Research-Write-Review Workflow (Conceptual - Workflow Setup)
# Assumes Agents (ResearchAgent, WriteAgent, ReviewAgent) are conceptually defined.

from llama_index.core.agent import AgentWorkflow

# --- AgentWorkflow Setup ---
# Agents ResearchAgent, WriteAgent, ReviewAgent are assumed to be defined from previous snippet.
# llm and initial_state_dict are also assumed to be conceptually available.

initial_state_dict = {"research_notes": {}, "report_content": "", "review": ""} # As per example

workflow = AgentWorkflow(
    agents=[ResearchAgent, WriteAgent, ReviewAgent],
    root_agent_name="ResearchAgent", # First agent to run
    initial_state=initial_state_dict,
    # llm=llm # Workflow might take an LLM for its own decisions if any
)

print("Conceptual LlamaIndex AgentWorkflow defined.")

# --- Conceptual Invocation ---
async def run_llama_workflow():
    print("\n--- Kicking off Conceptual LlamaIndex Workflow ---")
    # In a real scenario, you'd call workflow.run() or an async equivalent
    # with the initial input/task.
    # E.g., response = await workflow.arun(input="Write a report on internet history")
    print(f"Conceptual workflow response: {response}")
    print(f"Final state: {workflow.get_state()}") # To inspect final shared state
    print("Conceptual LlamaIndex workflow finished (mocked). Inspect mock_get_state._shared_state to see results.")

# To run conceptually (if using asyncio for async tools/agents):
import asyncio
asyncio.run(run_llama_workflow())

# For a simpler synchronous conceptual idea, you might imagine triggering the root agent:
ResearchAgent.run_step(task_id="task123", input="Write report on internet history")
# ... but AgentWorkflow handles this orchestration.
```

## Framework face-off - The nitty-gritty comparison

Alright, you've seen the contenders. Now, let's throw them in the ring. Picking a framework isn't just about cool features; it's about what fits your project, your stack, and your team's sanity. Each one of these bad boys has its own flavor, its own way of doing things.

### Key differentiators: What makes 'em tick

When you squint, a few big differences pop out:

- **Programming paradigm & language**: This is ground zero.
  - **Python-heavyweights**: LangGraph, Microsoft Autogen, OpenAI's SDKs, CrewAI, LlamaIndex. No surprise, Python owns the AI/ML space.
  - **TypeScript/JavaScript corner**: Mastra is waving this flag, targeting the web dev massive. Think agents in Node.js or even browsers.
  - **Declarative vs. code-first**: Some, like fast-agent (with its decorators) or CrewAI (with its YAML configs for agents/tasks), let you declare workflows at a high level. Others; LangGraph, Autogen (especially its Core layer), Mastra (core agent setup), LlamaIndex; are more about getting your hands dirty with code.

- **Orchestration style**: How do they herd the cats?
  - **Explicit graph-based**: LangGraph and LlamaIndex AgentWorkflow draw you a map. Clear flow, clear state changes.
  - **Event-driven/conversational**: Autogen is king here. Async messaging, dynamic group chats. Wild.
  - **Handoff-driven**: OpenAI Swarm and the new Agents SDK are big on agents explicitly passing the baton.
  - **Role-based & process-driven**: CrewAI wants you to think in terms of human-like roles and run plays (sequential or hierarchical).
  - **Workflow decorators**: fast-agent gives you high-level shortcuts for common patterns.
  - **Tool-based hierarchy**: Mastra likes supervisors using sub-agents as tools.

- **State management**: How do they remember stuff?
  - **Explicit state objects**: LangGraph is all about a defined state object that gets passed and tweaked.
  - **Message history & context passing**: Autogen, CrewAI, OpenAI Swarm lean on chat history as the main state carrier.
  - **Scoped/shared context**: LlamaIndex AgentWorkflow has a shared context/state agents read from and write to.
  - **Dedicated memory systems**: Mastra talks about more advanced memory systems.
    Don't kid yourself: orchestration style and state management are joined at the hip. Graph-based systems? Naturally lead to clean state objects that follow the graph. Dynamic, chatty systems? State is usually in the message history. You gotta evaluate these two together.

- **Tool integration**: How do they use external powers?
  - **Standardized via protocol**: MCP-based stuff like fast-agentms for plug-and-play with any MCP tool server. LangGraph also has MCP adapters. Good sign.
  - **Framework-specific tools**: Most have their own way. LangChain's huge toolset (for LangGraph), Autogen's function calling, OpenAI's built-in tool use, Mastra's tool definitions, CrewAI's tool assignments, LlamaIndex's tool abstractions. Lots of different wrenches.

### Strengths and weaknesses: picking your weapon for the job

No silver bullets here. Different frameworks for different fights:

- **LangGraph**: Best for complex, stateful workflows where you need to see every step (enterprise processes, finance). The explicitness can be a climb for simple agents.
- **Microsoft Autogen**: Shines for dynamic, multi-agent chats and collaboration (research buddies, brainstorming, co-coding). Managing super-strict, deterministic workflows needs careful design.
- **OpenAI Swarm & new agent tools**: Obvious choice if you're deep in the OpenAI cult. Streamlined integration, clear handoffs. Downside? Potential OpenAI ecosystem lock-in, though the new SDK says it'll play nice with others.
- **MCP & fast-agent**: Interoperability via MCP is the big win; tap into a standard tool ecosystem. fast-agent's decorators make defining complex workflows quick. Your fate depends on good MCP servers being available.
- **Mastra**: The go-to for TypeScript/JavaScript shops. Great for baking agents into web apps, Node.js backends. Good for structured workflows and agent-as-tool hierarchies.
- **CrewAI**: Intuitive if you think in human team structures (Role-Goal-Backstory). Good for users who want to define agent collaboration using familiar roles. Hierarchical process is a plus for managed delegation.
- **LlamaIndex (agentic capabilities)**: King of document-heavy agent workflows. Leverages its RAG, parsing (LlamaParse!), and indexing might. Perfect for automating knowledge work in legal, medical, finance. Overkill if your agents don't care about docs.

See the pattern? **No single framework rules them all, at least not yet.** It's all about specialization. LlamaIndex is great for document-centric agents. Autogen is the conversational wizard. This means big projects might need a franken-stack of frameworks. Which screams for **interoperability standards** (like MCP) so these different agent systems can actually talk to each other.

### Ease of dev & scalability: how fast can you build, how big can you go?

- **Ease of development**:
  - **Abstraction level**: fast-agent (decorators), Autogen Studio, CrewAI UI Studio offer higher abstraction. Faster for common patterns or less techy users. Code-first like LangGraph gives more control but steeper learning curve.
  - **Language & ecosystem**: Python comfort? Mastra for TypeScript fans? Richness of surrounding ecosystem (e.g., LangChain's integrations for LangGraph) matters.
  - **Docs & community**: Good docs and an active community save your ass when you're stuck.

- **Scalability**: Can it handle more agents, crazier interactions, bigger data, faster throughput?
  - **Architectural design**: Async architectures (like Autogen) are built for scale; handle many ops without choking.
  - **State management**: Efficient state is vital. Frameworks that can offload state to scalable stores or have smart in-memory management win. Sloppy state handling is a bottleneck.
  - **Distributed execution**: Spreading agents across processes/machines is key for real scale. Autogen's `GrpcWorkerAgentRuntime` is one example of this thinking.

Bottom line on scalability: frameworks built for async ops, distributed execution, and serious state/memory management (especially with external scalable storage) are your enterprise-grade bets. Scalability isn't just agent count; it's the complexity and length of their chats and the data they chew on.

### Table: Comparative overview of agent composition frameworks

to boil it all down, here’s a cheat sheet. don't take it as gospel; your mileage _will_ vary.

| Feature                      | LangGraph                                | Microsoft Autogen                             | OpenAI Swarm/Agents SDK            | fast-agent                                 | Mastra                                   | CrewAI                                        | LlamaIndex (Agentic)                 |
| :--------------------------- | :--------------------------------------- | :-------------------------------------------- | :--------------------------------- | :----------------------------------------- | :--------------------------------------- | :-------------------------------------------- | :----------------------------------- |
| **Primary Language**         | Python                                   | Python, .NET                                  | Python (SDK initially)             | Python                                     | TypeScript                               | Python                                        | Python                               |
| **Core Orchestration**       | Explicit Graph, State Machine            | Event-Driven, Conversational                  | Handoff-driven                     | Workflow Decorators (MCP-native)           | Programmatic, Tool-based Hierarchy       | Role-based, Process-driven (Seq/Hier)         | Explicit Graph (AgentWorkflow)       |
| **State Management**         | Explicit State Object                    | Message History, Context                      | Context Variables, Message History | MCP-managed (implicit)                     | Memory Systems, Context                  | Context Passing between Tasks                 | Shared Context/State in Workflow     |
| **Tool Integration**         | LangChain Tools, Custom, MCP Adapters    | Function Calling, Custom, MCP Workbench       | OpenAI Tools, Custom Functions     | MCP Servers (native)                       | Custom Tools, MCP (planned/possible)     | Custom Tools                                  | Function Calling, Custom Tools       |
| **Key Multi-Agent Patterns** | Supervisor, Hierarchical, Network, Swarm | Dynamic Group Chat, Nested Chat, Hierarchical | Handoffs, Tiered Delegation        | Chain, Parallel, Router, Orchestrator      | Sequential, Hierarchical (Agent-as-Tool) | Sequential, Hierarchical                      | Sequential Handoffs, Supervisor-like |
| **Primary Strengths**        | Stateful, auditable enterprise workflows | Dynamic multi-agent collaboration, code-gen   | OpenAI ecosystem, clear handoffs   | Interoperability (MCP), rapid workflow dev | TypeScript/Web env, structured workflows | Intuitive role-based design, human-like teams | Document-intensive workflows (ADW)   |

This table gives you the high-altitude view. The "best" framework is the one that gets _your_ job done without making you want to flip your desk.
