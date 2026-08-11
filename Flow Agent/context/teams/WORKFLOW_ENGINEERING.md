# Workflow Engineering Team

**Type**: Engineering (AI Engineers + Technical Architects)  
**Focus**: Workflow capability — the AI-powered creation and management of workflows within the IWHI platform

---

## What This Team Does

This team builds the **Workflow** capability on top of the ARIA A2A framework. They own the AI models, technical architecture, and backend integration that powers workflow creation, execution, and management through the Flow Agent interface.

Key responsibilities:
- AI model selection and fine-tuning for workflow understanding
- Workflow schema, structure, and execution engine
- Tool definitions exposed to the agent for workflow operations
- Technical architecture decisions for the workflow capability
- Integration with the ARIA framework

---

## Workflow Capability Overview

Workflows in IWHI are **longer-running, multi-step processes** that coordinate multiple services, decisions, and actions over time. They differ from flow services in complexity and duration.

| Aspect | Detail |
|---|---|
| Primary user | Integration developers and architects |
| Complexity | Higher than flow services — multi-step, conditional logic, human-in-the-loop possible |
| Execution | Async / long-running |
| Key operations | Create, edit, test, deploy, monitor workflow |

---

## What Design Needs to Know

- **Tool definitions**: What operations can the agent perform? (e.g. `create_workflow`, `add_step`, `test_workflow`) — get this list from this team
- **Response formats**: How does the agent return a workflow? (JSON, visual diagram, plain text?) — affects workspace view design
- **Error types**: What can go wrong? — affects error state design
- **AI confidence / ambiguity**: Does the model express uncertainty? How? — affects clarification UX

---

## Design Touchpoints

- Workspace view showing a created/edited workflow
- Workflow preview and diff (before/after edits)
- Step-by-step creation UX (if agent walks through building a workflow)
- Error and recovery flows specific to workflow operations

---

## Current State / Open Items

- [ ] `[TODO: Add current capability status — in progress, GA, beta?]`
- [ ] `[TODO: Add list of supported workflow operations the agent can perform]`
- [ ] `[TODO: Add primary contact / team lead]`
- [ ] `[TODO: Add known UX constraints from the AI layer — e.g. what the model can't do yet]`
- [ ] `[TODO: Add any upcoming milestones relevant to design handoff]`
