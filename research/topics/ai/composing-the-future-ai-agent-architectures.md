---
draft: false
title: "Composing the future, part 1: agent basics, LangGraph and Autogen"
description: "What makes a system agentic, why multi-agent beats single-agent, how orchestration works, and a close look at LangGraph and Microsoft Autogen."
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
series: ai-agent-frameworks
series_part: 1
series_total: 5
type: writing
form: analysis
topic: ai-agents
secondary_topics:
  - architecture
fit: 3
---

## So you want to build real AI agents, huh?

The AI hype train is roaring, and "agentic AI" is the latest gold rush. But, really, let's cut the crap. Most of what people are calling agents are just glorified scripts with an LLM bolted on; at best an LLM with tools and a for-loop. If you're serious about building systems that think, adapt, and actually _do_ complex stuff, you need to understand the guts of **agent architecture composition**. This isn't about prompt engineering for your chatbot; this is about architecting the future.

**This series has 5 parts.** Each one reads on its own.

1. Agent basics, LangGraph and Autogen (this page)
2. [OpenAI's agent tools, MCP and fast-agent](agent-frameworks-openai-mcp-fast-agent.md)
3. [Mastra and CrewAI](agent-frameworks-mastra-crewai.md)
4. [LlamaIndex and the framework face-off](agent-frameworks-llamaindex-comparison.md)
5. [Agent patterns, open problems and how to choose](agent-frameworks-patterns-and-guidance.md)

### Agentic AI: more than just a buzzword

**Agentic AI** means systems where AI agents get shit done, autonomously. They're not just waiting for your click; they're navigating messy, dynamic environments to hit their targets. The **agentic architecture** is the skeleton that makes this possible; it shapes the workflow, marshals the AI models, and basically defines the agent's playground.

At its core, an **intelligent agent system** has a few key parts:

- **Perception/profiling**: How it sees the world (data acquisition).
- **Memory**: Where it stashes its knowledge.
- **Planning**: The brains of the operation; strategy and decision-making.
- **Action**: How it executes.
- **Learning strategies**: How it gets less dumb over time.

These bits directly fuel an agent's **agency**: its **intentionality** (planning), **forethought** (thinking ahead), **self-reactiveness** (course correction), and critically, **self-reflectiveness** (learning from its screw-ups and successes). That last part is key. We're not just automating tasks; we're aiming for systems that evolve. Big difference.

### Single-agent vs. multi-agent systems (MAS)

Sure, **single-agent architectures** are simple. Predictable. Fast for some baby tasks. But try scaling them or throwing a multi-step workflow their way, and they choke. They're rigid, narrow, and frankly, boring.

The real action, the future, is in **multi-agent systems (MAS)**. Think a crew of specialized AI agents, each a rockstar in its domain, working together on problems that would make a single agent cry. MAS means more accuracy, better adaptability, and the muscle to tackle massive problems. They pool resources, optimize workflows through collaboration, and generally kick single-agent butt in any complex scenario. There is a growind demand for **distributed intelligence**. So, if a framework can't handle composing and managing multi-agent systems effectively, it's almost considered obsolete.

### Agent orchestration & composition

**Agent orchestration** is the art and science of making your network of specialized AI agents play nice together to automate complex shit. The **orchestrator**; whether it's a central AI agent or the framework itself, is the conductor, making sure the right agent hits the right note at the right time.

The lifecycle usually looks like this:

1.  Assess and plan.
2.  Pick your specialist agents.
3.  Slap in an orchestration framework (LangChain, watsonx Orchestrate, Power Automate, etc).
4.  The orchestrator dynamically picks and assigns agents.
5.  Coordinate and execute.
6.  Manage data and context (the messy part).
7.  Continuously optimize and learn (hopefully with a human keeping an eye on things).

Common orchestration flavors:

- **Centralized**: One boss agent. Simple, but that boss better be good.
- **Decentralized**: Agents figure it out amongst themselves.
- **Hierarchical**: Layers of bosses. Management, AI style.
- **Federated**: Independent agents/orgs collaborating without oversharing.

These aren't just fancy terms. They're how you solve the real headaches of MAS: coordination, conflict resolution (because agents have opinions too), and smart task allocation. **Agent composition frameworks**, then, are not just about building individual agents. They're about defining the spiderweb of their interactions and the rules of engagement. "Composition" _is_ the implementation of badass orchestration.

## The contenders - a deep dive into key agent composition frameworks

The AI agent framework scene is exploding. Everyone's got a new way to build these critters. Let's rip apart some of the major players: LangGraph, Microsoft Autogen, OpenAI's new toys, MCP and its crew (like fast-agent), Mastra, CrewAI, and the agentic side of LlamaIndex.

### LangGraph: For the control freaks (in a good way)

**LangGraph**, an offshoot of the ever-present LangChain, is for those who like their agent workflows stateful and with clear lines of command. Think complex, multi-actor applications where LLMs need to remember what happened last Tuesday. This is your jam if you're building systems that need to be auditable and debuggable, because its graph-based state machine approach lays everything bare. No black boxes here.

**Core Idea**: Workflows are **directed graphs**. Nodes are tasks, functions, or your AI agents. Edges are the connections and conditional jumps. This structure means you can actually _see_ and manage the logic. It's built on layers that handle state, agent wrangling, running the graph (often with a Pregel-inspired model), and talking to the outside world. The big wins? **Stateful processing** (agents remember stuff), **modular agent architecture** (specialists do their thing), and **dynamic workflow management** (decision trees with branching paths).

**Playing with multiple agents (LangGraph Style)**:

- **Supervisor**: The classic boss pattern. A main agent dishes out tasks to worker bees and pulls the results together. A common twist is the **tool-calling supervisor**, where sub-agents are just tools the boss LLM decides to use. We use this, and everyone's grandma does it too.
- **Swarm**: Less defined in the docs they provided, but hints at more distributed, hive-mind style collaboration.
- **Hierarchical**: Bosses managing other bosses or teams. For when your problem is a Russian doll of complexity.
- **Network**: Any agent can ping any other agent. Total freedom, potential for total chaos if you're not careful.
- **Custom Workflows**: Roll your own logic. Either pre-defined flows or let the LLMs decide the next step dynamically.

**Chatting and remembering**:
It’s all about a **shared state object** (often just a list of messages) that gets passed around. Agents can "handoff" control or data, or a supervisor can treat other agents like tools it calls. Smart cookies will use **scoped agent memory** and distinct state setups for sub-graphs to avoid **context pollution**; basically, one agent scribbling over another's important notes. You decide if agents share their messy thought process (scratchpad) or just the clean final answer.

**Quick example: a supervised research team**
Imagine building a report:

1.  **SupervisorAgentNode**: Gets the query (e.g., "Impact of quantum computing on crypto"). Breaks it into sub-tasks ("find papers," "summarize algorithms," "draft summary"). Decides who does what next.
2.  **LiteratureSearchAgentNode**: A tool. Supervisor says "go find papers on X," it uses a search API, returns snippets.
3.  **SummarizationAgentNode**: Takes snippets, boils them down.
4.  **DraftingAgentNode**: Gets summaries, drafts a section.
    The **graph's state** tracks the query, sub-tasks, snippets, summaries, drafts, and whose turn it is. **Conditional edges** go from the Supervisor to specialists based on the current sub-task. Specialists report back to the Supervisor, who updates state and picks the next move. Classic top-down control.

```python
# LangGraph Code Snippet: Supervisor & Workers
# Heads up: This is conceptual. You'll need LangChain, LangGraph,
# and an LLM provider (like OpenAI) properly set up.

from typing import Literal
from langchain_openai import ChatOpenAI # Assuming OpenAI
from langgraph.graph import StateGraph, MessagesState, START, END
from langgraph.types import Command

# model = ChatOpenAI(model="gpt-4-turbo") # Placeholder: Initialize your LLM

# Define the state for our graph
# MessagesState conveniently stores a list of messages
class SupervisorState(MessagesState):
    next_agent: str # Who's up next?

# Supervisor Agent: The Brains
def supervisor_node(state: SupervisorState) -> dict:
    print("---SUPERVISOR NODE---")
    # Real supervisor logic: LLM call based on state['messages'] to decide next_agent or END.
    # Simplified for brevity:
    if len(state['messages']) > 5: # Arbitrary end condition
        next_action = END
    elif "task for agent 1" in state['messages'][-1].content.lower():
        next_action = "agent_1"
    else:
        next_action = "agent_2"
    return {"next_agent": next_action}

# Worker Agent 1
def agent_1_node(state: SupervisorState) -> dict:
    print("---AGENT 1 NODE---")
    # Agent 1 does its thing. Could be an LLM call, tool use, etc.
    # Simplified: Process the last message
    processed_message = f"Agent 1 reporting: Processed '{state['messages'][-1].content}'"
    return {"messages": [("ai", processed_message)]} # Add its output to state

# Worker Agent 2
def agent_2_node(state: SupervisorState) -> dict:
    print("---AGENT 2 NODE---")
    processed_message = f"Agent 2 reporting: Handled '{state['messages'][-1].content}'"
    return {"messages": [("ai", processed_message)]}
```

```python
# LangGraph Code Snippet: Supervisor & Workers (Continued)

# Let's build the graph
builder = StateGraph(SupervisorState)

builder.add_node("supervisor", supervisor_node)
builder.add_node("agent_1", agent_1_node)
builder.add_node("agent_2", agent_2_node)

# Wire it up
builder.add_edge(START, "supervisor") # Kick things off with the supervisor

# Conditional routing from supervisor to workers or end
def route_to_agent(state: SupervisorState):
    return state["next_agent"] # The supervisor decided this

builder.add_conditional_edges(
    "supervisor",
    route_to_agent,
    {
        "agent_1": "agent_1",
        "agent_2": "agent_2",
        END: END
    }
)

# Workers report back to the supervisor
builder.add_edge("agent_1", "supervisor")
builder.add_edge("agent_2", "supervisor")

# Compile the graph and it's ready to go!
graph = builder.compile()

# Example of how you might run this thing:
# initial_input = {"messages": [("user", "Start with a task for agent 1, then agent 2")]}
# for event in graph.stream(initial_input, {"recursion_limit": 10}):
#     for key, value in event.items():
#         print(f"{key}: {value}")
#     print("---")
```

### Microsoft Autogen: for the chatty, collaborative swarms

Microsoft's **Autogen** is built for crafting AI agents that love to talk; to each other. It's strong on **multi-agent conversational systems** and wrangling complex agentic workflows. If you envision your agents brainstorming, debating, or collaboratively coding, Autogen is worth a hard look.

**Architectural breakdown**:
Autogen's got layers:

- **Core**: The foundation. Think event-driven agent machinery, asynchronous messaging (key for agents not stepping on each other's toes).
- **AgentChat**: Sits on Core, gives you a nicer, task-driven API. Group chat management, code execution, pre-built agent types. This is where most people start.
- **Extensions**: Integrations with the outside world; Azure code executors, OpenAI models, and even MCP workbenches.

The big deal with Autogen v0.4+ is its **asynchronous, event-driven architecture**. Agents communicate via async messages, supporting both event-driven and request/response patterns. This makes it robust and extensible, ready for proactive, long-running agents. It's modular, so you can plug in custom agents, tools, memory, and models. Plus, built-in metrics, tracing, and OpenTelemetry support mean you can actually see what your agent swarm is up to. This async, event-driven heart is what lets Autogen handle crazy dynamic multi-agent chats; think nested chats, agents jumping in and out of groups. More fluid than strictly sequential graph systems if you need that flexibility.

**The multi-agent conversation framework**:
Autogen revolves around **"conversable" agents**:

- **ConversableAgent**: The base class for any agent that can send and receive messages to get tasks done.
- **AssistantAgent**: Your typical LLM-powered brain. Writes text, code, processes results. Usually doesn't need human hand-holding or execute code by default.
- **UserProxyAgent**: Your human stand-in. Can ask for input, run code (like Python scripts from an AssistantAgent), and call tools.

This setup lets you automate chats between multiple agents, letting them tackle tasks solo or with human guidance. Autogen supports dynamic conversation patterns like **hierarchical chat**, **dynamic group chat** (a manager agent plays traffic cop), **FSM-based transitions** (control who talks next), and **nested chat** (chats within chats for modular problem-solving).

**Quick example: collaborative code gen & debugging**
User wants a Python function for Fibonacci numbers, unit tests, and wants it all run.

1.  **UserProxyAgent**: Kicks off with the prompt.
2.  **PlannerAgent** (custom AssistantAgent): Breaks it down: "Define function, implement logic, write tests, prep execution script."
3.  **CoderAgent** (AssistantAgent for code): Writes the Python for the function and tests.
4.  **ExecutorAgent** (UserProxyAgent with code execution enabled): Runs the script, captures output/errors.
5.  **DebuggerAgent** (another AssistantAgent): If errors, it analyzes them, suggests fixes to CoderAgent.
    They all yak it out in a group chat. The Planner plans, Coder codes, Executor runs. Errors? Loop between Coder, Executor, Debugger until tests pass or they give up. The UserProxyAgent watches, clarifies, or gives the thumbs up. This shows Autogen's muscle for conversational agents tackling iterative tasks like coding.

```python
# Microsoft Autogen Code Snippet: Assistant & User Proxy
# Disclaimer: Requires Autogen installed and an LLM configuration.
# Set up your OAI_CONFIG_LIST (json file or env var) or define config_list manually.

import os
import autogen

# LLM Configuration (Example using OpenAI GPT-4 Turbo)
# Option 1: From OAI_CONFIG_LIST
try:
    config_list_gpt4 = autogen.config_list_from_json(
        "OAI_CONFIG_LIST", # Ensure this points to your config
        filter_dict={
            "model": ["gpt-4", "gpt-4-turbo", "gpt-4-32k"], # Add your model variants
        },
    )
except FileNotFoundError:
    print("OAI_CONFIG_LIST not found. Attempting manual config.")
    # Option 2: Manual Configuration (if OAI_CONFIG_LIST isn't set)
    # IMPORTANT: Make sure OPENAI_API_KEY environment variable is set if using this.
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        print("OPENAI_API_KEY not found. Cannot configure LLM.")
        config_list_gpt4 = [] # Empty list, will cause issues if not handled
    else:
        config_list_gpt4 = [
            {
                'model': 'gpt-4-turbo',
                'api_key': api_key,
            }
        ]

# Create an AssistantAgent (the LLM-powered workhorse)
assistant = autogen.AssistantAgent(
    name="CoderAssistant",
    llm_config={
        "config_list": config_list_gpt4,
        "temperature": 0, # For more predictable outputs
    }
)
```

```python
# Microsoft Autogen Code Snippet: Assistant & User Proxy (Continued)

# Create a UserProxyAgent (acts as the user, can execute code)
user_proxy = autogen.UserProxyAgent(
    name="UserProxy",
    human_input_mode="NEVER",  # "ALWAYS" to require human input, "TERMINATE" to stop on human input
    max_consecutive_auto_reply=10, # Avoid infinite loops
    is_termination_msg=lambda x: x.get("content", "").rstrip().endswith("TERMINATE"),
    code_execution_config={ # Configuration for code execution
        "work_dir": "autogen_coding_dir",  # Directory to save and run code
        "use_docker": False,  # Set to True or a Docker image name to use Docker (safer!)
    },
    llm_config={ # Can also have its own LLM for deciding replies/actions
        "config_list": config_list_gpt4,
        "temperature": 0,
    }
)

# Kick off the conversation!
# The user_proxy sends the initial task to the assistant.
# This is commented out to prevent execution without a live API key & full setup.

# if config_list_gpt4: # Only attempt if LLM config is present
#     user_proxy.initiate_chat(
#         assistant,
#         message="""What date is it today? Then, tell me the year-to-date performance
#         for META and compare it against TESLA. Finally, plot a chart and save it to a file."""
#     )
# else:
#     print("LLM configuration is missing. Skipping Autogen chat initiation.")
```
