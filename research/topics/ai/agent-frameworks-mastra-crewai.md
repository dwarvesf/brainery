---
draft: false
title: "Composing the future, part 3: Mastra and CrewAI"
description: "Two frameworks with opposite instincts: Mastra for TypeScript teams building web-native agents, and CrewAI for role-playing crews of Python agents."
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
slug: agent-frameworks-mastra-crewai
announce: false
series: ai-agent-frameworks
series_part: 3
series_total: 5
type: writing
form: analysis
topic: ai-agents
secondary_topics:
  - architecture
fit: 3
---

Mastra and CrewAI sit at opposite ends of the style spectrum. Mastra gives TypeScript developers workflows, memory and tools that feel native to the web stack. CrewAI casts agents as members of a crew with roles, goals and tasks. This part walks through how each one defines an agent, coordinates work and handles memory, and who should reach for it.

> Part 3 of 5 in the AI agent frameworks series. Previous: [Composing the future, part 2: OpenAI's agent tools, MCP and fast-agent](agent-frameworks-openai-mcp-fast-agent.md) | Next: [Composing the future, part 4: LlamaIndex and the framework face-off](agent-frameworks-llamaindex-comparison.md)

## Mastra: TypeScript agents for the web-native world

**Mastra** rolls in as a "batteries-included" **TypeScript framework** for building, testing, and deploying your agentic apps. It’s gunning for a smooth ride from local dev to production, all on a single stack to dodge that nasty "glue code" headache. If your world is web and Node.js, Mastra wants to be your agent HMFIC (Head M*****F***** In Charge).

**Agent and workflow definition in typescript**:
Mastra's heart is its `Agent` class. You set 'em up with a name, instructions (what to do), the model (OpenAI, Anthropic, take your pick), tools, and workflows they can run. A neat trick: instructions, model, tools, and workflows can be dynamic, set by functions that get a `runtimeContext`. This means your agents can adapt on the fly based on what's happening around them.

Workflows in Mastra are for your multi-step dances and complex agent collabs. Primitives like `createStep` and `createWorkflow` help you define these, with schema validation often handled by Zod (a popular TypeScript validation library). This heavy TypeScript focus and a workflow syntax built to feel natural for JavaScript devs is a big play for the massive web dev community. It could seriously speed up how agentic AI gets jammed into web apps and enterprise systems already on the JS/TS stack, potentially opening the floodgates for devs who aren't Python gurus.

**Hierarchical and sequential multi-agent moves**:
Mastra handles common multi-agent patterns:

- **Sequential workflows**: `createWorkflow` plus chaining steps with `.then(nextStep).commit()`. If the output schema of one step matches the input of the next, data flows automatically. Clean.
- **Hierarchical multi-agent systems**: The classic supervisor-sub-agent setup. Sub-agents get wrapped as "tools" that the supervisor agent calls. Mastra's `createTool` function can wrap a whole agent, making it callable by another boss agent.

**Quick example: hierarchical blog post factory**
This is straight from Mastra's playbook: a Publisher agent bosses around a Copywriter and an Editor by treating them as tools.

1.  **Define sub-agents** (`CopywriterAgent`, `EditorAgent`): Each is an `Agent` instance with its own instructions and model.
2.  **Wrap sub-agents as tools** (`copywriterTool`, `editorTool`):
    - Use `createTool` for each.
    - Define `id`, `description`, `inputSchema` (e.g., for `copywriterTool`, `{ topic: z.string() }`), and `outputSchema` (e.g., `{ copy: z.string() }`).
    - The `execute` function of the tool calls the respective agent's `.generate()` method with the input.
3.  **Define supervisor agent** (`PublisherAgent`):
    - An `Agent` instance.
    - Instructions: "First, call copywriter to write copy on a topic. Then, call editor to edit it. Return final edited copy."
    - Its `tools` property includes `copywriterTool` and `editorTool`.

**Flow**:
PublisherAgent gets a topic ("Future of AI Agents"):

- Its LLM, guided by instructions, knows it needs content. Calls `copywriterTool` with the topic.
- `copywriterTool` runs, calling `copywriterAgent.generate()`. Draft blog post comes back.
- PublisherAgent's LLM takes this draft, calls `editorTool`.
- `editorTool` runs, calling `editorAgent.generate()`. Edited post comes back.
- PublisherAgent returns the final, polished copy.
  This clearly shows Mastra building hierarchies where a supervisor runs the show by calling specialized sub-agents as tools. Powerful stuff for breaking down big jobs.

```typescript
// Mastra Code Snippet: Hierarchical Blog Post Generation (Conceptual TypeScript)
// Based on Mastra's documentation. Requires Mastra, AI SDK (e.g., @ai-sdk/anthropic), and Zod.

// --- File: src/mastra/agents/copywriter.ts (Conceptual) ---
// import { Agent } from "@mastra/core";
// import { anthropic } from "@ai-sdk/anthropic"; // Or your preferred model provider

// Mock Agent class for conceptual clarity if @mastra/core is not available
class Agent {
//   constructor(config: { name: string; instructions: string; model: any; tools?: any }) {
//     console.log(`Conceptual Mastra Agent '${config.name}' created.`);
//   }
//   async generate(prompt: string): Promise<{ text: string }> {
//     console.log(`[${this.name}] Generating for prompt: ${prompt.substring(0,30)}...`);
//     return { text: `Generated content for: ${prompt}` };
//   }
// Allow any config for conceptual example
  constructor(config: any) {
    this.name = config.name;
    console.log(`Conceptual Mastra Agent '${config.name}' created.`);
  }
  async generate(prompt: string): Promise<{ text: string }> {
    console.log(`[${this.name}] Generating for prompt: ${prompt.substring(0,30)}...`);
    return { text: `Generated content for: ${prompt}` };
  }
  name: string; // Add name property for the conceptual example
}

const copywriterAgent = new Agent({
    name: "Copywriter",
    instructions: "You are a copywriter agent that writes blog post copy.",
    model: anthropic("claude-3-5-sonnet-20241022") // Example model
});

// --- File: src/mastra/agents/editor.ts (Conceptual) ---
// import { Agent } from "@mastra/core"; // Re-import or ensure scope
// import { openai } from "@ai-sdk/openai";

const editorAgent = new Agent({
    name: "Editor",
    instructions: "You are an editor agent that edits blog post copy.",
    model: openai("gpt-4o-mini") // Example model
});

// Export them for use in tool definitions (conceptual)
// export { copywriterAgent, editorAgent };
```

```typescript
// Mastra Code Snippet: Hierarchical Blog Post Generation (Conceptual TypeScript - Continued)

// --- File: src/mastra/tools/copywriterTool.ts (Conceptual) ---
// import { createTool } from "@mastra/core/tools";
// import { z } from "zod";
// import { copywriterAgent } from "../agents/copywriter"; // Actual import

// Mock createTool and Zod for conceptual clarity
const z = {
    object: (schema: any) => ({ describe: (desc: string) => ({ ...schema, _description: desc }) }),
    string: () => ({ _type: "string", describe: (desc: string) => ({ _type: "string", _description: desc }) })
};

const createTool = (config: any) => {
    console.log(`Conceptual Mastra Tool '${config.id}' created.`);
    return {
        ...config,
        // Mock execution for conceptual flow
        async execute({ context }: { context: any }) {
            console.log(`[${config.id}] Tool execute called with context:`, context);
            if (config.id === "copywriter-agent") {
                const agentResult = await copywriterAgent.generate(`Create a blog post about ${context.topic}`);
                return { copy: agentResult.text };
            }
            if (config.id === "editor-agent") {
                const agentResult = await editorAgent.generate(`Edit the following: ${context.copy}`);
                return { copy: agentResult.text }; // outputSchema wants 'copy'
            }
            return {};
        }
    };
};

const copywriterTool = createTool({
    id: "copywriter-agent",
    description: "Calls the copywriter agent to write blog post copy.",
    inputSchema: z.object({ topic: z.string().describe("Blog post topic") }),
    outputSchema: z.object({ copy: z.string().describe("Blog post copy") }),
    // execute: async ({ context }: { context: { topic: string } }) => { // More specific context type
    //     const result = await copywriterAgent.generate(`Create a blog post about ${context.topic}`);
    //     return { copy: result.text };
    // },
});

// --- File: src/mastra/tools/editorTool.ts (Conceptual) ---
// import { createTool } from "@mastra/core/tools"; // Re-import or ensure scope
// import { z } from "zod"; // Re-import or ensure scope
// import { editorAgent } from "../agents/editor"; // Actual import

const editorTool = createTool({
    id: "editor-agent",
    description: "Calls the editor agent to edit blog post copy.",
    inputSchema: z.object({ copy: z.string().describe("Blog post copy to be edited") }),
    outputSchema: z.object({ copy: z.string().describe("Edited blog post copy") }), // Changed from 'edited_copy' to 'copy'
    // execute: async ({ context }: { context: { copy: string } }) => {
    //     const result = await editorAgent.generate(`Edit the following blog post only returning the edited copy: ${context.copy}`);
    //     return { copy: result.text }; // Ensure output key matches schema
    // },
});

// Export tools (conceptual)
// export { copywriterTool, editorTool };
```

```typescript
// Mastra Code Snippet: Hierarchical Blog Post Generation (Conceptual TypeScript - Final Part)

// --- File: src/mastra/agents/publisher.ts (Conceptual) ---
// Assume Agent, anthropic, copywriterTool, editorTool are imported or available in scope
// Previous conceptual definitions:
// const copywriterAgent = new Agent({ name: "Copywriter", ... });
// const editorAgent = new Agent({ name: "Editor", ... });
// const copywriterTool = createTool({ id: "copywriter-agent", ... });
// const editorTool = createTool({ id: "editor-agent", ... });

const publisherAgent = new Agent({
    name: "PublisherAgent",
    instructions: "You are a publisher. First, use the copywriterTool to write blog copy. Then, use the editorTool to edit it. Return only the final edited copy.",
    model: anthropic("claude-3-5-sonnet-20241022"),
    tools: { copywriterTool, editorTool } // Assigning the conceptually defined tools
});

// --- Conceptual Invocation ---
async function generateBlogPost(topic: string) {
    console.log(`
--- Conceptual Mastra Workflow for Topic: ${topic} ---
`);
    // In a real Mastra app, you'd use the agent's generate method or a workflow runner.
    // This is a simplified simulation of the PublisherAgent's logic based on its instructions and tools.

    console.log(`[PublisherAgent] Instructed to process topic: "${topic}"`);

    // 1. Call copywriterTool (which internally calls copywriterAgent)
    const draft = await copywriterTool.execute({ context: { topic } });
    console.log(`[PublisherAgent] Received draft from copywriterTool: "${draft.copy.substring(0, 50)}..."`);

    // 2. Call editorTool (which internally calls editorAgent)
    const finalEditedCopy = await editorTool.execute({ context: { copy: draft.copy } });
    console.log(`[PublisherAgent] Received final from editorTool: "${finalEditedCopy.copy.substring(0, 50)}..."`);

    console.log(`
--- Final Edited Blog Post (Conceptual) ---
${finalEditedCopy.copy}
-------------------------------------------
`);
    return finalEditedCopy.copy;
}

// To run the conceptual example (e.g., in a test file or main script):
// generateBlogPost("The Future of AI Agents");
```

## CrewAI: For orchestrating role-playing, autonomous AI agent crews

**CrewAI** is all about making your AI agents wear different hats and work together like a well-oiled (or sometimes chaotic) team. You define agents with distinct **roles**, **goals**, and even **backstories**, then assemble them into "crews" to get complex tasks done. If you like thinking about agent collaboration like a director casting actors for a play, CrewAI will click with you.

**Core bits (agents, tasks, crew) & the role-goal-backstory vibe**:
CrewAI stands on three legs:

- **Agents**: Your individual AI workers. Each gets:
  - `role`: Their job title (e.g., 'Market Researcher', 'Code Ninja').
  - `goal`: What they're trying to achieve.
  - `backstory`: A bit of flavor text to shape their behavior and perspective. Surprisingly effective.
  - `llm`: The brain (your chosen LLM).
  - `tools` (optional): What they can use.
  - `allow_delegation` (optional): Can they pass the buck to other agents in the crew?
- **Tasks**: The actual assignments. Each includes:
  - `description`: Detailed orders.
  - `expected_output`: What success looks like (format, content).
  - `agent`: Who's doing it.
  - `dependencies` (optional): Other tasks that gotta be done first. Builds your sequence.
- **Crew**: Brings agents and tasks together. Manages the collaboration and workflow.

The **role-goal-backstory** thing is central to CrewAI. It pushes you to give your agents personas. The idea? Clear roles, motivating goals, and contextual backstories make agents behave more coherently and effectively. It's an interesting way to map AI collaboration to human team dynamics, potentially making it easier for non-AI-experts to design agent systems.

**Sequential vs. hierarchical action**:
CrewAI lets tasks flow in a couple of ways:

- **Sequential process**: Tasks run one after another, dictated by order or dependencies. Good for linear jobs where output of one feeds the next.
- **Hierarchical process**: A designated manager agent runs the crew. This boss can delegate, monitor, and even sign off on work before the crew moves on. More complex coordination and oversight.

**Quick example: market research report (sequential grind)**
A team of specialists building a market report, step-by-step.

1.  **Define Agents**:
    - `research_agent`: Role: 'Market Researcher', Goal: 'Find latest AI market trend articles/data for 2025', Backstory: 'Experienced web-surfing analyst'. Has a web search tool.
    - `analysis_agent`: Role: 'Data Analyst', Goal: 'Analyze research data for key insights, growth, challenges', Backstory: 'Quantitative guru'.
    - `report_writer_agent`: Role: 'Business Report Writer', Goal: 'Write concise report from analyzed insights', Backstory: 'Pro writer, makes complex stuff clear'.
2.  **Define Tasks**:
    - `research_task`: Description: 'Find 5 recent articles, 3 data points on 2025 AI market trends', Expected Output: 'List of URLs, data summary', Agent: `research_agent`.
    - `analysis_task`: Description: 'Analyze findings for top 3 insights, 2 growth areas, 1 challenge', Expected Output: 'Structured summary of insights/growth/challenges', Agent: `analysis_agent`, Dependencies: `[research_task]`.
    - `writing_task`: Description: 'Write 500-word report (intro, insights, growth, challenges, conclusion)', Expected Output: 'Formatted 500-word Markdown report', Agent: `report_writer_agent`, Dependencies: `[analysis_task]`.
3.  **Assemble the crew**:
    - `market_research_crew`: Agents: `[research_agent, analysis_agent, report_writer_agent]`, Tasks: `[research_task, analysis_task, writing_task]`, Process: `Process.sequential`.

**Flow**:
When `market_research_crew.kickoff()` is called:

- `research_task` runs (research_agent uses web search).
- Its output (articles, data) feeds `analysis_task` (thanks to dependency).
- `analysis_agent` chews on it, extracts insights.
- Its output (insights summary) feeds `writing_task`.
- `report_writer_agent` drafts the final report.
  Boom. A clear pipeline, specialized agents contributing in sequence. That's CrewAI for structured, multi-step teamwork.

```python
# CrewAI Code Snippet: Market Research Report (Conceptual)
# Requires CrewAI, an LLM library (e.g., langchain_openai), and potentially tools like SerperDevTool.

from crewai import Agent, Task, Crew, Process
# from langchain_openai import ChatOpenAI # Example LLM
# from crewai_tools import SerperDevTool # Example tool, formerly from crewai.tools

# --- Conceptual Setup (Replace with your actual initializations) ---
# print("Conceptual: Initializing LLM and Tools...")
# llm = ChatOpenAI(model="gpt-4-turbo", api_key="YOUR_OPENAI_API_KEY") # Replace with your key/setup
# search_tool = SerperDevTool(api_key="YOUR_SERPER_API_KEY") # Replace with your key/setup

# For conceptual execution without live keys/dependencies:
class MockLLM:
    def __init__(self, name="mock_llm"): self.name = name
    def __repr__(self): return f"MockLLM({self.name})"

class MockTool:
    def __init__(self, name="mock_tool"): self.name = name; self.description = "A mock tool."
    def __repr__(self): return f"MockTool({self.name})"
    def run(self, query):
        return f"Mock tool results for: {query}"

llm = MockLLM()
search_tool = MockTool(name="WebSearchTool")
# --- End Conceptual Setup ---

# Define Agents with Roles, Goals, and Backstories

research_agent = Agent(
    role='Market Researcher',
    goal='Find the latest articles and data points on AI market trends for 2025',
    backstory='An experienced analyst skilled in web research and data gathering. Your insights are crucial.',
    llm=llm,
    tools=[search_tool],
    verbose=True,
    allow_delegation=False # This agent works alone on its tasks
)

analysis_agent = Agent(
    role='Data Analyst',
    goal='Analyze the provided research data to identify key insights, growth areas, and potential challenges in the AI market',
    backstory='A quantitative analyst specializing in market trend identification and statistical analysis. Precision is key.',
    llm=llm,
    verbose=True,
    allow_delegation=False
)

report_writer_agent = Agent(
    role='Business Report Writer',
    goal='Write a concise and compelling market research report based on the analyzed insights and data',
    backstory='A professional business writer skilled in communicating complex information clearly and effectively to an executive audience. Clarity and impact are paramount.',
    llm=llm,
    verbose=True,
    allow_delegation=False
)
```

```python
# CrewAI Code Snippet: Market Research Report (Conceptual - Continued)

# Define Tasks for the Agents

research_task = Task(
    description=(
        'Conduct thorough web research to find at least 5 recent (last 6 months) articles'
        ' and 3 significant data points regarding AI market trends projected for 2025.'
        ' Focus on credible sources and quantifiable data.'
    ),
    expected_output=(
        'A list of URLs for the articles and a concise summary of the data points found, including their sources.'
        ' Example: 1. url1 (Source: Forbes), 2. url2 (Source: Gartner)... Data: Metric X grew Y% (Source: Statista).'
    ),
    agent=research_agent,
    # human_input=False # Not typically set directly on task, managed by agent or execution params
)

analysis_task = Task(
    description=(
        'Analyze the research findings (articles and data points) provided by the Market Researcher.'
        ' Identify the top 3 key insights, 2 major growth areas, and 1 potential challenge for the AI market in 2025.'
        ' Provide brief justifications for each point.'
    ),
    expected_output=(
        'A structured summary in bullet points: \n'
        '- Key Insight 1: [Insight] (Justification: ...) \n'
        '- Growth Area 1: [Area] (Justification: ...) \n'
        '- Potential Challenge 1: [Challenge] (Justification: ...)'
    ),
    agent=analysis_agent,
    dependencies=[research_task] # Depends on the research_task's output
)

writing_task = Task(
    description=(
        'Write a 500-word market research report. The report should incorporate the analyzed key insights, growth areas, and potential challenges.'
        ' Structure: Introduction, Key Findings (Insights, Growth, Challenges), Conclusion. Maintain a professional tone.'
    ),
    expected_output=(
        'A well-formatted 500-word market research report in Markdown format. Ensure all sections are covered and the tone is appropriate for executives.'
    ),
    agent=report_writer_agent,
    dependencies=[analysis_task] # Depends on the analysis_task's output
)

# Assemble the Crew with a Sequential Process
market_research_crew = Crew(
    agents=[research_agent, analysis_agent, report_writer_agent],
    tasks=[research_task, analysis_task, writing_task],
    process=Process.sequential, # Tasks will be executed in the defined order based on dependencies
    verbose=2 # 0 for no logging, 1 for basic, 2 for detailed
)

# Kick off the Crew's work (Conceptual Execution)
# print("\n--- Kicking off Conceptual CrewAI Market Research --- ")
# result = market_research_crew.kickoff()
# print("\n--- Conceptual CrewAI Market Research Completed ---")
# print("Final Report (Conceptual):")
# print(result) # The result of the last task in the sequence
```
