# ARIA Framework Team

**Type**: Engineering  
**Focus**: A2A (Agent-to-Agent) framework — the infrastructure layer that all Flow Agent capabilities run on top of

---

## What This Team Does

The ARIA Framework team owns the **ARIA A2A framework** — the protocol and runtime that enables agents to communicate, delegate tasks, and coordinate across the IWHI platform. This is a foundational engineering team; they do not build capability-specific features but provide the scaffolding all capabilities depend on.

Key responsibilities:
- Defining and maintaining the A2A protocol
- Agent registration, discovery, and routing
- Tool/skill invocation framework
- Inter-agent communication and delegation
- Framework stability, versioning, and upgrades

---

## Relationship to Design

As a designer, you rarely work directly with this team day-to-day, but their decisions constrain what is possible in the agent experience:

- **What the agent can do** is gated by what tools/skills the framework supports
- **Streaming, partial responses, multi-turn context** — all framework-level concerns
- **Error states and fallbacks** — partially owned here (protocol errors vs. capability errors)

If you're designing a new interaction pattern that requires a new agent capability (e.g. multi-agent handoff, background tasks), flag it with this team early.

---

## Key Technical Concepts (for Design Reference)

| Concept | What It Means for Design |
|---|---|
| A2A protocol | Agents talk to each other — one agent can call another as a sub-agent |
| Tool invocation | Agent calls specific backend tools to do work (create flow, run test, etc.) |
| Turn / message | One round of user input + agent response = one turn |
| Streaming | Agent can send partial responses progressively (affects loading/streaming UX) |
| Context window | What the agent "remembers" in a session — has limits |

---

## Current State / Open Items

- [ ] `[TODO: Add current framework version]`
- [ ] `[TODO: Add known framework limitations relevant to UX — e.g. max context length, streaming support]`
- [ ] `[TODO: Add primary contact / team lead]`
- [ ] `[TODO: Add link to ARIA framework docs or internal wiki]`
- [ ] `[TODO: Any upcoming framework changes that affect agent UX]`
