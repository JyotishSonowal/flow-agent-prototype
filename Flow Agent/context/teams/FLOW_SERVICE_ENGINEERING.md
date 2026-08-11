# Flow Service Engineering Team

**Type**: Engineering (AI Engineers)  
**Focus**: Flow Service capability — AI-powered creation and management of flow services within the IWHI platform

---

## What This Team Does

This team builds the **Flow Service** capability — the core integration-building feature of Flow Agent. They own the AI layer that powers flow service creation, editing, and deployment through conversation.

Key responsibilities:
- AI model for understanding integration intent and generating flow service definitions
- Flow service schema, structure, and execution
- Tool definitions exposed to the agent for flow operations
- Integration with the ARIA framework
- Connection adapters, transformations, and mapping logic

---

## Flow Service Capability Overview

Flow Services are the primary integration artifact in IWHI — they connect systems, transform data, and automate processes. Through Flow Agent, users describe what they want in natural language and the agent generates the flow service.

| Aspect | Detail |
|---|---|
| Primary user | Integration developers (Isaac persona) |
| Complexity | Low to high — single-step API calls to multi-step transformations |
| Execution | Typically synchronous or event-driven |
| Key operations | Create, edit, test, deploy, clone, delete flow service |

---

## What Design Needs to Know

- **Tool definitions**: What can the agent actually do? (e.g. `create_flow_service`, `add_step`, `set_connector`, `test_flow`) — get confirmed list from this team
- **Supported connectors/adapters**: All CloudStreams connectors + Adapters in scope (not custom actions, not listeners)
- **Artifact type recommendation**: Agent classifies prompt and recommends flow service vs workflow — design must handle this routing moment
- **Iteration model**: User can iterate on the generated flow in the chat before confirming creation

## Design Touchpoints (from 11 July Figma)

The latest designs (11 July section) define the following flow:

| Step | Screen | What Happens |
|---|---|---|
| 1 | Agent blank state (frame 147) | Agent opens from **any page on the platform**. Greeting: "How can I help you today, Isaac?" with 3 onboarding cards: Learn what you can do / Try sample prompts / Tips for better results. User types prompt in chat input. |
| 2 | Reasoning state (frame 148) | User message sent. Agent shows reasoning trace: "Reasoning… Interpreting core problem" with streaming dots. Background: left side shows whatever platform page user came from. |
| 3 | Artifact type recommendation (frame 149) | Agent responds: interprets intent, recommends flow service ("This is a structured, rules-based integration… I recommend creating a flow service"). Quick action buttons: **"Continue with flow service"** / **"Use workflow instead"** |
| 4 | Project selection (frame 150) | After user confirms flow service, agent asks: "Before I start, should I use **project_flow_service2** since both connectors are available?" Quick actions: Use project_flow_service2 / Pick from all available projects / Create a new project |
| 5 | Flow preview — compact (frame 152) | Agent shows a compact artifact card in the chat: flow name, "Preview" tag, mini pipeline view (Fetch Accounts → +3 → Map all Accounts), **"View details"** link, **"Create this flow service"** CTA |
| 6 | Flow preview — Business view (Business view frame) | Workspace opens: left = full flow service viewer (Business tab active), right = agent panel. Business tab shows numbered step list with title + description per step. Read-only. Total steps count shown. Agent message: "Here is a preview… feel free to iterate… let me know and I'll proceed to create it." CTA: **Create this flow service** |
| 7 | Flow preview — Technical view (frame 154) | User switches to Technical tab. Shows the actual flow editor (real wM Flow visual with steps, conditions, connectors). Same chat panel. User can ask for changes via follow-up messages (e.g. "1. Upsert, 2. overwrite it, 3. skip and log"). |

**Key design decisions visible in the 11 July designs:**
- The agent panel is a **right-side panel**, approximately 342px wide, overlaid on the platform at all times
- The main workspace (left ~870px) shows the platform page OR the generated artifact depending on stage
- Business/Technical tabs toggle the artifact view — **Business is the default**
- The artifact card in chat is a compact preview; tapping "View details" / "expand" opens the full workspace view
- "Create this flow service" appears both in the compact card and in the full business view
- Agent reasoning traces are visible and collapsible ("Show reasoning" accordion)
- Artifact is tagged "Preview" (read-only) until created
- After creation, it becomes available in the product (flow service list)

---

## Current State — WB-2701 (Spike)

**Jira epic**: WB-2701 — [Spike] Create a wM Flow Service (DAF) using AI
**Parent epic**: WB-2698 — [AI for Integration] webMethods Flow (DAF) authoring using AI
**Status**: In Progress | **RAG**: 🔴 Red | **Fix version**: 2026 Q3 Sep
**Assignee**: Mohamed Naufal A | **Tech Owner**: Ramu Potuganti | **RnD Owner**: Santhosh Hari Sridhar
**Contributors**: Guruprasanth Arunachalam, Harshit Sinha, Madhumanti Ghosh, Pradeep Wadikar, Sunil Kumar Reddy Bheema, Vatsal Avasthi

### Capability Status
- This is a **spike** — the team is proving feasibility of Flow Service creation via the ARIA A2A framework
- ARIA learning curve is larger than anticipated; many agent implementation issues encountered
- Target: **private preview in lower environment by end of June 2026** (not a 12.0.3 deliverable)
- Must be behind a **feature toggle** — no impact on production code

### Scope Confirmed (from epic comments)
- **In scope**: Traditional webMethods Flow (not DAF — DAF deferred to later)
- Multi-turn conversation support (parity with workflow authoring)
- Input to plan (same model as workflow)
- Flow-specific DSL → wM Flow generation pipeline
- All CloudStreams connectors + Adapters (not custom actions)
- **Out of scope**: Listener support, custom actions for flow services, DAF

### Technical Blockers Identified (Jan 2026)
These APIs/infra items are required from the Flow Service backend team:
1. APIs to get **connector metadata** for flow services
2. Separate **Milvus retrieval flags** for: flow services / workflow / common connectors
3. API to **create a flow service** + dedicated agent tool
4. API to **test/execute a flow service** + dedicated agent operation

### Key Design Decision
> **"UX for flow will be the same as current workflow agent."**
> — Ramanarayanan Balasubramanian, Mar 2026

This means all workflow authoring patterns apply directly to flow service authoring. No separate UX needed at the shared agent surface level.

### Open Design Items
- [ ] User journey for flow service creation — requested by engineering (Dec 2025) and PM (Jan, Mar 2026) but not yet formally delivered; this is a design team action
- [ ] Use case refinement doc was presented Mar 2026 but not attached to epic — get link from Thamizharasu or Madhumanti
- [ ] Confluence spec: [DAF authoring using AI](https://ibm-middleware.atlassian.net/wiki/spaces/PROMAN/pages/1112506390/DAF+authoring+using+AI)
- [ ] Aha link: https://bigblue.aha.io/features/WEBMIOI-500

### Open Engineering Items
- [ ] Confirm which connector metadata format will be used (reuse workflow JSON or new format?)
- [ ] Confirm API availability for flow service creation, execution, and metadata
- [ ] Confirm Milvus retrieval flag separation is implemented
