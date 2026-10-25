---
draft: false
title: "Composing the future, part 2: OpenAI's agent tools, MCP and fast-agent"
description: "How OpenAI's Swarm and newer agent tools work, why Model Context Protocol matters for tool access, and how fast-agent builds MCP-native agents."
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
slug: agent-frameworks-openai-mcp-fast-agent
announce: false
series: ai-agent-frameworks
series_part: 2
series_total: 5
type: writing
form: analysis
topic: ai-agents
secondary_topics:
  - architecture
fit: 3
---

This part covers three ways to build agents on top of tools: OpenAI's own toolkit (Swarm, the Responses API and the Agents SDK), the Model Context Protocol (MCP) that standardizes how agents reach tools, and fast-agent, a framework built on MCP from the start. Each section says what the piece does, how an agent gets defined, and where it fits. Part 1 sets out the vocabulary (agents, orchestration, composition) and covers LangGraph and Autogen.

> Part 2 of 5 in the AI agent frameworks series. Previous: [Composing the future, part 1: agent basics, LangGraph and Autogen](composing-the-future-ai-agent-architectures.md) | Next: [Composing the future, part 3: Mastra and CrewAI](agent-frameworks-mastra-crewai.md)

## OpenAI Swarm & new agent tools: OpenAI's own agent playbook

OpenAI isn't just sitting back; they're building tools to make agentic apps easier, moving from their experimental **Swarm SDK** to more solid APIs and a new **Agents SDK**. They clearly want you building agents on their side.

**Swarm ideas & the responses API**:
OpenAI's early thinking with Swarm was about **lightweight, controllable, and testable agent coordination**. Core bits:

- **Agent**: Instructions (goals, behavior) + functions/tools (what it can do).
- **Handoffs**: How one agent passes the baton to another (usually by a function returning another Agent object).

Building on this, they dropped the **Responses API**. This thing aims to mix the simplicity of Chat Completions with the smarter tool-use of the Assistants API. They do this by handling tasks with multiple tool uses and several model turns in one API call. Comes with built-in tools like web and file search.

**Orchestration via the agents SDK**:
To really streamline multi-agent workflows, OpenAI launched a new open-source **Agents SDK**. This gives you more structure:

- **Agents**: LLM instances you can easily configure with instructions and tools (theirs or yours).
- **Handoffs**: Formalized mechanism for smart, context-aware control transfer between agents.
- **Guardrails**: Configurable safety checks for input/output validation. Keeps your agents from going totally rogue.
- **Tracing & observability**: Tools to see what your agents are actually doing. Critical for debugging and tuning.

Features like Guardrails and Tracing show they're thinking about production readiness (safety, reliability, maintenance). That’s vital for enterprise adoption because businesses want agents that don’t just work, but work predictably and securely. Raw model power isn't enough; they're building out the whole ecosystem.

**Quick example: tiered customer support system**
A classic multi-agent play: different support tiers.

1.  **TriageAgent**: First contact. Instructions: "Figure out what the user wants. Shopping query? Hand off to ShoppingAgent. Returns/tech support? Hand off to SupportAgent." Has `handoffs=` capability.
2.  **ShoppingAgent**: Instructions: "Help find products, compare, use WebSearchTool."
3.  **SupportAgent**: Instructions: "Assist with support, refunds, tech issues. Use `submit_refund_request` tool (your custom backend interaction)."

User says, "Wanna return an item." TriageAgent gets it, sees "return," hands off to SupportAgent. SupportAgent takes over, gathers details (order number, why it sucked), uses its `submit_refund_request` tool. This nails the handoff concept, core to Swarm and the new Agents SDK, for routing tasks to the right specialist. Standard stuff in real customer service, now doable with these tools.

```python
# OpenAI Agents SDK Code Snippet: Tiered Customer Support (Conceptual)
# NOTE: This is based on described features of the OpenAI Agents SDK.
# Actual implementation details may vary. Ensure you have the SDK installed and configured.

# from openai_agents import Agent, Runner # Or similar imports based on actual SDK
# from openai_agents.tools import WebSearchTool # Example built-in tool
# from openai_agents.tools.custom import function_tool # For custom tools

# Placeholder for actual SDK imports if they differ
class Agent:
    def __init__(self, name, instructions, tools=None, handoffs=None, model=None):
        self.name = name
        self.instructions = instructions
        self.tools = tools or []
        self.handoffs = handoffs or []
        self.model = model
        print(f"Conceptual Agent '{self.name}' initialized.")

class Runner:
    def __init__(self, starting_agent):
        self.starting_agent = starting_agent
        print(f"Conceptual Runner initialized with '{self.starting_agent.name}'.")

    def run_sync(self, input_text):
        print(f"Runner received: {input_text}")
        # Simplified logic: direct to first handoff or a tool based on keywords
        # This would be an LLM call in reality, guided by TriageAgent's instructions
        if "shop" in input_text.lower() and self.starting_agent.handoffs:
            target_agent = next((h for h in self.starting_agent.handoffs if "Shopping" in h.name), None)
            if target_agent:
                print(f"Handing off to {target_agent.name}")
                # Simulate agent execution
                if any("WebSearchTool" in str(t) for t in target_agent.tools):
                    return type('obj', (object,), {'output_text': f'{target_agent.name} used WebSearchTool for: {input_text}'})
            return type('obj', (object,), {'output_text': f'{self.starting_agent.name} processed: {input_text}'})
        elif ("return" in input_text.lower() or "support" in input_text.lower()) and self.starting_agent.handoffs:
            target_agent = next((h for h in self.starting_agent.handoffs if "Support" in h.name), None)
            if target_agent:
                print(f"Handing off to {target_agent.name}")
                # Simulate agent execution with a custom tool
                if any("submit_refund_request" in str(t.name) for t in target_agent.tools):
                     return type('obj', (object,), {'output_text': f'{target_agent.name} used submit_refund_request for: {input_text}'})
            return type('obj', (object,), {'output_text': f'{self.starting_agent.name} processed: {input_text}'})
        else:
            return type('obj', (object,), {'output_text': f'{self.starting_agent.name} handled: {input_text}'})

def function_tool(func):
    func.is_tool = True
    func.tool_name = func.__name__
    return func

class WebSearchTool:
    def __str__(self):
        return "WebSearchToolInstance"

# Define a custom tool (conceptually)
@function_tool
def submit_refund_request(item_id: str, reason: str) -> str:
    """Submits a refund request. Returns 'success' or 'failure'."""
    print(f"Conceptual: Refund for item '{item_id}', reason: '{reason}'")
    return "success" if item_id == "123" else "failure: item not found"
```

```python
# OpenAI Agents SDK Code Snippet: Tiered Customer Support (Conceptual - Continued)

# Define specialized agents (conceptually)
support_agent = Agent(
    name="Support_and_Returns_Agent",
    instructions="You are a support agent. Help with product issues and submit refund requests using the 'submit_refund_request' tool.",
    tools=[submit_refund_request], # Custom tool
    model="gpt-4o" # Example model
)

shopping_agent = Agent(
    name="Shopping_Assistant_Agent",
    instructions="You are a shopping assistant. Search the web for product info using 'WebSearchTool'.",
    tools=[WebSearchTool()], # Built-in tool instance
    model="gpt-4o"
)

# Define a triage agent that hands off
triage_agent = Agent(
    name="Triage_Agent",
    instructions="You are a triage agent. Understand user queries and route to Shopping_Assistant_Agent for shopping or Support_and_Returns_Agent for support/refunds. Ask clarifying questions if unsure.",
    handoffs=[shopping_agent, support_agent], # Other agents it can hand off to
    model="gpt-4o"
)

# Initialize the Runner with the starting agent
# runner = Runner(starting_agent=triage_agent)

# Example conceptual runs (commented out):
# user_query_shopping = "I'm looking for new running shoes, can you find some top-rated ones?"
# response_shopping = runner.run_sync(input_text=user_query_shopping)
# print(f"User: {user_query_shopping}")
# print(f"Final Conceptual Response: {response_shopping.output_text}")

# user_query_support = "I want to return item 123 because it's faulty."
# response_support = runner.run_sync(input_text=user_query_support)
# print(f"User: {user_query_support}")
# print(f"Final Conceptual Response: {response_support.output_text}")
```

---

## A side-note → Model Context Protocol (MCP): The universal translator for AI tools

The **Model Context Protocol (MCP)** is an open shot at standardizing how your apps feed context; tools, resources, prompts; to LLMs and AI agents. Think of it as trying to create a common language for AI systems to tap into external powers.

**MCP Guts**:
It’s a client-server dance:

- **Hosts**: Your LLM apps (IDEs like Cursor, desktop apps, custom agent setups). They run and manage connections.
- **Clients**: Live in the host app, chat one-on-one with an MCP server. They handle protocol negotiation, message routing, and subscriptions.
- **Servers**: Lightweight programs exposing specific powers (tools, resources, prompts) via MCP. Can be local or remote, focused on doing one thing well.

Communication is layered: a protocol layer (JSON-RPC 2.0 for message framing, request/response) and a transport layer (stdio for local, HTTP with Server-Sent Events for remote). Messages are Requests, Results, Errors, or Notifications (one-way pings).

**How MCP makes tool & context sharing less of a nightmare**:
MCP wants to standardize how agents grab and use outside functions. Servers shout out their capabilities (tools, resources, prompt templates) during an initial handshake. Client agents can then find and call these. Key ideas: make servers easy to build and stack like LEGOs, keep servers on a need-to-know basis (they don’t see the whole chat history, host keeps that), and let clients and servers add new tricks over time. The dream? MCP as the "USB-C for AI." If it catches on, you could mix and match LLMs, agent frameworks, and tool providers like a DJ. Less vendor lock-in, more innovation. This is the kind of thinking behind ideas like the "Agent Mesh"; diverse agents and services all talking nice through standard interfaces.

**Architectural patterns MCP enables**:
MCP itself is just the protocol, but it lights up various agent system designs:

- **Single-agent MCP**: One LLM agent calls tools from MCP servers. Simple, direct, but can bottleneck or overload context if the agent juggles too many tools.
- **Multi-agent orchestrated MCP**: Many specialized agents collaborate, each using MCP clients to get tools for their specialty. Better for parallel work and resilience.
- **Hierarchical MCP agents**: Agents in layers; planners up top, executors below. Each might use MCP tools. Good for breaking down big tasks.
- **Event-driven MCP agents**: Agents react to events, often asynchronously. MCP tools could be called on events, or MCP servers might fire off events themselves.

**Quick example: agent tapping an mcp server for file system access**
Agent needs to read a log file.

1.  **Host app**: Your Python script running the AI agent.
2.  **Agent component**: The AI agent (could be simple LLM loop) gets a request: "Summarize critical errors in 'application.log' today."
3.  **MCP client component**: Part of the agent, talks to MCP servers.
4.  **FileSystemMCPServer**: Separate local process. Speaks MCP, offers tools like `readFile(path)`, `writeFile(path, content)`, `listFiles(directory)`.

**Flow**:

- User asks agent.
- Agent's LLM decides it needs to read `application.log`.
- Agent tells MCPClient to call `readFile(path='application.log')` on FileSystemMCPServer.
- MCPClient sends JSON-RPC request (e.g., via stdio).
- FileSystemMCPServer gets request, reads file, sends MCP Result with content (or Error).
- Response goes to MCPClient, then to Agent.
- Agent uses LLM to process log, summarize errors for user.

This shows MCP's core value: letting an AI agent securely and standard-ly use external powers (like local file access) not built into the LLM, by chatting with a specialized server. No custom integration per tool; that's the promise.

---

## fast-agent: MCP-native agents with a need for speed (and decorators)

**fast-agent** jumps in as a framework for building and playing with AI agents and workflows, proudly waving the **Model Context Protocol (MCP)** flag. It's an **MCP-native** solution, meaning its bones are built around MCP ideas. It supports the full MCP toolkit: Tools, Prompts, Resources, Sampling, and Roots. A cool trick? **Multi-modal support**, letting agents chew on images and PDFs in prompts, resources, and MCP tool results.

This framework wants to get you building _fast_. It throws pre-built agent and workflow examples at you (many inspired by [Anthropic's agent-building insights](https://www.anthropic.com/engineering/building-effective-agents) and lets you string agents into complex workflows with a slick set of Python **decorators**. That decorator-based vibe for defining chains, parallel runs, routers, and orchestrators is a big deal. It massively lowers the bar for cooking up sophisticated multi-agent systems. You focus on _what_ you want (the logic, the agent skills) instead of the gnarly _how_ (managing chats, state, errors). This screams rapid prototyping and quick iteration. And because it's MCP-native, these easy-to-build workflows can plug into a wider, standardized world of MCP tools and services without a fuss.

**Key composition patterns (the decorator magic)**:
fast-agent gives you these workflow-building decorators:

- `@fast.agent`: Your basic building block. Defines an agent with instructions, request params, tools, etc.
- `@fast.chain`: Links agents in a sequence. Output of one feeds the next. Simple.
- `@fast.parallel`: Fan-out/fan-in. Message hits multiple agents at once. Optionally, a fan-in agent mops up the combined results.
- `@fast.evaluator_optimizer`: A duo: a generator (makes content/solutions) and an evaluator (judges it, gives feedback). They iterate, generator refines based on feedback, until a quality bar is met or it hits max tries.
- `@fast.router`: Uses an LLM to look at a message and send it to the right agent from a list, based on their instructions.
- `@fast.orchestrator`: For the big jobs. An LLM-powered orchestrator agent figures out a plan to spread work among available agents. Can plan it all upfront or go step-by-step.

**Quick example: multi-lingual content factory with quality control**
Let's say you want product descriptions in English, French, and Spanish, and you want them good.

1.  **English content writer agent** (`@fast.agent`): Takes product details, writes a compelling English description.
2.  **Translator agents** (`@fast.agent` for French, `@fast.agent` for Spanish): Each takes English text, translates accurately.
3.  **Translation aggregator agent** (`@fast.agent`): Takes French and Spanish translations, bundles them into a neat JSON object (`{'french_text': '...', 'spanish_text': '...'}`).
4.  **Parallel translation workflow** (`@fast.parallel`):
    - Fans out the English description to the French and Spanish translator agents simultaneously.
    - The `translation_aggregator_agent` is the fan-in, collecting and structuring their outputs.
5.  **Quality assurance evaluator agent** (`@fast.agent`): Reviews the structured translations. Rates them (e.g., POOR, FAIR, GOOD, EXCELLENT). If not EXCELLENT, it spits out specific feedback.
6.  **Content refinement workflow** (`@fast.evaluator_optimizer`):
    - The `generator` is our `parallel_translation_workflow`.
    - The `evaluator` is our `quality_assurance_evaluator_agent`.
    - It aims for a `min_rating` (e.g., "GOOD") with a `max_refinements` (e.g., 2 retries).

**Flow**:

- User gives product details.
- `english_writer_agent` (maybe first in a chain) makes the English version.
- This goes to `content_refinement_workflow`.
- Inside, `parallel_translation_workflow` runs: English text hits French and Spanish translators at the same time.
- Their outputs go to `translation_aggregator_agent`.
- This structured output is judged by `quality_assurance_evaluator_agent`.
- If quality is meh (below GOOD), the `evaluator_optimizer` logic (conceptually) feeds the feedback and original input back to `parallel_translation_workflow` for another shot. Rinse and repeat until quality is met or retries run out. The final, polished multi-lingual content (a dictionary) is the result.
  This shows fast-agent's declarative power: parallel processing for speed, an evaluator loop for quality, all strung together with decorators.

```python
# fast-agent Code Snippet: Multi-Lingual Content Factory (Conceptual)
# Heads-up: This is conceptual. You'll need the fast-agent library
# and an LLM provider set up for this to be more than just fancy text.

# import fast_agent as fast # Or however the library is actually imported

# --- Agent Definitions ---

# Let's imagine 'fast' is our imported library access point.
# These would be decorated functions if 'fast' was a real imported object.

# English Content Writer
@fast.agent(instruction="You are an expert marketing copywriter. Write a compelling product description for the given product details.")
def english_writer_agent(product_details: str) -> str:
    # Conceptual: LLM call to generate English description
    print(f"[english_writer_agent] ACTION: Generating content for {product_details[:30]}...")
    return f"Amazing English description for {product_details}!"

# French Translator
@fast.agent(instruction="Translate the provided English text accurately into French.")
def french_translator_agent(english_text: str) -> str:
    # Conceptual: LLM call for French translation
    print(f"[french_translator_agent] ACTION: Translating to French: {english_text[:30]}...")
    return f"Incroyable description en Français pour {english_text}"

# Spanish Translator
@fast.agent(instruction="Translate the provided English text accurately into Spanish.")
def spanish_translator_agent(english_text: str) -> str:
    # Conceptual: LLM call for Spanish translation
    print(f"[spanish_translator_agent] ACTION: Translating to Spanish: {english_text[:30]}...")
    return f"Increíble descripción en Español para {english_text}"

# Translation Aggregator
@fast.agent(instruction="Combine the French and Spanish translations into a structured JSON object with 'french_text' and 'spanish_text' keys.")
def translation_aggregator_agent(french_translation: str, spanish_translation: str) -> dict:
    print(f"[translation_aggregator_agent] ACTION: Aggregating translations.")
    return {"french_text": french_translation, "spanish_text": spanish_translation}

# Quality Assurance Evaluator
@fast.agent(instruction="Review the provided translations. Rate their quality as POOR, FAIR, GOOD, or EXCELLENT. If not EXCELLENT, provide specific feedback for improvement.")
def quality_assurance_evaluator_agent(translations: dict) -> dict:
    # Conceptual: LLM call to evaluate and provide feedback
    print(f"[quality_assurance_evaluator_agent] ACTION: Evaluating translations: {str(translations)[:50]}...")
    # Mocking a good review for simplicity in conceptual flow
    return {'quality_rating': "EXCELLENT", 'feedback': "Looks great!"}

```

```python
# fast-agent Code Snippet: Multi-Lingual Content Factory (Conceptual - Continued)

# --- Workflow Definitions ---

# Parallel Translation Workflow
@fast.parallel(
    name="multilingual_translation_service",
    fan_out=[french_translator_agent, spanish_translator_agent], # Would be actual agent objects or names
    fan_in=translation_aggregator_agent # Actual agent object or name
)
def parallel_translation_workflow(english_description: str) -> dict:
    # Conceptual: fast-agent handles the parallel execution and fan-in.
    # It would call french_translator_agent(english_description)
    # and spanish_translator_agent(english_description) concurrently.
    # Then, their results would be passed to translation_aggregator_agent.
    print(f"[parallel_translation_workflow] STARTING for: {english_description[:30]}...")
    french = french_translator_agent(english_description)
    spanish = spanish_translator_agent(english_description)
    aggregated = translation_aggregator_agent(french_translation=french, spanish_translation=spanish)
    print(f"[parallel_translation_workflow] COMPLETED. Result: {str(aggregated)[:50]}...")
    return aggregated

# Evaluator-Optimizer for Refinement
@fast.evaluator_optimizer(
    name="refined_multilingual_content_generator",
    generator=parallel_translation_workflow, # The parallel workflow is the generator
    evaluator=quality_assurance_evaluator_agent,
    min_rating="GOOD", # The rating to achieve from the evaluator_agent
    max_refinements=2  # Max number of retries
)
def content_refinement_workflow(english_description: str) -> dict:
    # Conceptual: fast-agent manages the loop.
    # 1. Calls parallel_translation_workflow(english_description).
    # 2. Passes its output to quality_assurance_evaluator_agent.
    # 3. If rating < GOOD and refinements < max_refinements, uses feedback
    #    (conceptually, by re-prompting or guiding the generator) and retries.
    print(f"[content_refinement_workflow] STARTING for: {english_description[:30]}...")
    attempts = 0
    max_refinements = 2 # From decorator
    min_rating_map = {"POOR": 0, "FAIR": 1, "GOOD": 2, "EXCELLENT": 3} # Example rating scale
    target_rating_score = min_rating_map["GOOD"] # From decorator

    current_input_for_generator = english_description
    final_result = {}

    while attempts <= max_refinements:
        print(f"  Attempt {attempts + 1}")
        generated_content = parallel_translation_workflow(current_input_for_generator)
        evaluation = quality_assurance_evaluator_agent(generated_content)

        current_rating_score = min_rating_map.get(evaluation['quality_rating'], -1)

        if current_rating_score >= target_rating_score:
            print(f"  Met quality target with rating: {evaluation['quality_rating']}")
            final_result = generated_content
            break
        else:
            print(f"  Quality target not met ({evaluation['quality_rating']}). Feedback: {evaluation['feedback']}")
            # Conceptual: In a real scenario, feedback would be used to modify input for the generator
            # For this simulation, we'll just re-run with original input if we haven't met quality.
            # current_input_for_generator = f"{english_description} (Refinement attempt {attempts + 1} based on feedback: {evaluation['feedback']})"
            final_result = generated_content # Store last attempt if all refinements fail
        attempts += 1
        if attempts > max_refinements:
            print("  Max refinements reached.")
            break

    print(f"[content_refinement_workflow] COMPLETED. Final result: {str(final_result)[:50]}...")
    return final_result

# --- Example Invocation (Conceptual) ---
# product_info = "Our new amazing SuperWidget 3000!"
# initial_english_content = english_writer_agent(product_info)
# final_multilingual_content = content_refinement_workflow(initial_english_content)
# print("\n--- FINAL OUTPUT ---")
# print(final_multilingual_content)
```
