# Flow Agent — Shared Product Context

> This is the primary context file for the IWHI Flow Agent product team.
> Bob should read this before helping with any design, product, or engineering task related to Flow Agent.
> Last updated: July 2025

---

## What Is Flow Agent?

Flow Agent is an AI agent built on the IWHI (IBM Webmethods Hybrid Integration) platform. It enables business and technical users to create integrations through a conversational, agentic interface.

The agent supports multiple **capability areas**:
- **Integration use cases** — create flow services and workflows via natural language
- **B2B use cases** — support for business-to-business integration patterns
- **MFT (Managed File Transfer)** — file-based integration use cases
- **Monitoring** — visibility into running integrations and their health

Previously, each capability had its own separate agent. These have now been consolidated into a **single unified agent** — Flow Agent. The agent surface (shell, patterns, interactions) is shared across all capabilities.

---

## Platform Context

- **Platform**: IWHI — IBM Webmethods Hybrid Integration
- **AI layer**: Built on Watsonx (IBM's enterprise AI platform)
- **Backend capabilities**: Flow Service, Workflow
- **Agent protocol**: A2A (Agent-to-Agent) using the ARIA A2A framework
- **Interaction model**: Conversational chat UI with workspace view; users describe what they want and the agent creates or modifies integrations

---

## Users

| Persona | Description |
|---|---|
| Integration Developer (e.g. Isaac) | Builds and manages flow services and workflows; may range from no-code to code-first depending on task |
| Business User | Uses the agent to configure B2B or MFT use cases; less technical |
| Technical Architect | Oversees integration architecture; wants visibility and control |
| Operations/Monitor User | Monitors running integrations; focused on health, errors, and alerts |

> **Note**: Exact persona details should be maintained in [`personas/PERSONAS.md`](./personas/PERSONAS.md). Add full persona cards there.

---

## Key Capabilities

### DAF (Designer's Application Flow) Service — AI Authoring
- The primary integration authoring use case for Flow Agent
- Users describe integrations in natural language; the agent generates a DAF service
- **Three levels of complexity** are supported:
  - **P2P (Point-to-Point)** — simple two-app sync with auto data mapping
  - **P2P with Conditions** — adds if/else constructs and conditional logic
  - **Multi-Point (Complex)** — multiple nodes, loops, conditions, try-catch, logging; built via multi-turn conversation
- Both **explicit** (user names the construct) and **implicit** (agent infers from business language) prompting are supported
- **DRT (Design Runtime)** is the default and implicit runtime — not surfaced to users
- Connectors are auto-synced to DRT from WPR based on the prompt
- Auto data mapping is included; explicit mapping requests via prompt are also supported
- DAF is saved even with incomplete mapping or construct errors — user can fix post-creation
- Only available for **DADA-enabled tenants**
- See [`USE_CASES.md`](./USE_CASES.md) for full PM spec, all complexity levels, and example prompts

### Flow Service
- Create and edit flow services through conversation
- The agent generates, previews, and deploys integrations
- Owned by the Flow Service engineering team and PM (integration use cases)

### Workflow
- Create and manage workflows (longer-running, multi-step processes)
- Owned by the Workflow engineering team
- Shares the same agent surface as Flow Service

### Shared Agent Surface
Because all capabilities share the same agent, these UI/UX patterns are **common across all capabilities**:
- Chat interface (conversation history, input, streaming responses)
- Workspace view (side-by-side view of chat + generated artifact)
- Navigation and context switching between capabilities
- Empty/blank states and onboarding
- Error handling, clarification, and recovery flows
- Settings, user preferences, and profile

> These shared patterns are the responsibility of the **Agent Pattern team** in collaboration with the **UI team** and **Lead Product Designer**.

---

## Design Philosophy

- Patterns designed for one capability should be **reusable** across all capabilities
- The design team across capabilities aligns on shared patterns before building capability-specific variations
- The agent surface is a **platform**, not a one-off feature — decisions here affect all capabilities
- Designs live in Figma. Reference designs before making assumptions.

---

## Key Design Decisions

- **Agent is platform-wide**: The agent is accessible from any page on the IWHI platform — not limited to any specific product or capability page
- **UX for flow = UX for workflow**: Confirmed by Ramanarayanan Balasubramanian (Mar 2026). All shared agent patterns designed for workflow apply directly to flow service
- **Agent recommends artifact type**: When a user describes an integration use case, the agent classifies it and recommends flow service vs. workflow (e.g. "This is a rules-based integration — I recommend a flow service")
- **Workspace is a split view**: Left = platform page context (wherever the user came from), Right = agent panel + generated artifact (Business/Technical tabs)
- **Preview before create**: Agent generates a preview of the flow service with "Create this flow service" as a CTA — user iterates before committing
- **Business + Technical views**: The flow service artifact has two tabs — Business (numbered step list, human-readable) and Technical (actual flow editor view with connectors, conditions, logic)

---

## Key Files and Links

| Resource | Location / Link |
|---|---|
| This context file | `/Users/jyotishsonowal/Documents/Bob/Flow Agent/context/CONTEXT.md` |
| **DAF authoring use cases (PM spec)** | [`USE_CASES.md`](./USE_CASES.md) — full complexity levels, example prompts, key behaviors |
| Team context files | `/Users/jyotishsonowal/Documents/Bob/Flow Agent/context/teams/` |
| Persona cards | `/Users/jyotishsonowal/Documents/Bob/Flow Agent/context/personas/PERSONAS.md` |
| **Figma — Flow Agent exploration (latest)** | [IA \| DAF via Agent Q2FY2026](https://www.figma.com/design/7Ap2ZwIfNFkuoOdRooOjmB/IA-%7C-DAF-via-Agent_Q2FY2026?node-id=4-17) — read sections **10 July** and **11 July** only; these are the latest designs |
| Figma — Workflow user journey reference | See section **11 May — Integration Agent + Launch Pad** in the same file |
| Team index | `/Users/jyotishsonowal/Documents/Bob/Flow Agent/context/TEAMS.md` |
| Jira project key | `WB` on `ibm-middleware.atlassian.net` |
| Key epic | [WB-2701 — [Spike] Create a wM Flow Service via AI](https://ibm-middleware.atlassian.net/issues?filter=59557&selectedIssue=WB-2701) |
| Confluence spec | [DAF authoring using AI](https://ibm-middleware.atlassian.net/wiki/spaces/PROMAN/pages/1112506390/DAF+authoring+using+AI) |
| Design system | Carbon Design System (IBM) + Carbon for AI components |
| Slack channels | `[TODO: Add relevant channel names]` |

---

## Open Design Action Items

- [ ] **Business view** — Simplify the language; make it less technical and more human-readable for non-developer users
- [ ] **Technical view** — Create a simplified design for the technical view (current wM Flow editor is too complex for the agent context)
- [ ] **Technical view — Mapping** — Design an easy-to-use mapping experience; must include support for static/constant value mapping
- [ ] **Flow service testing** — Define and design the use case for testing/executing a flow service from within the agent

## Open Questions / Things to Fill In

- [ ] Add Slack channel names
- [ ] Add persona cards for Business User, Technical Architect, Operations User in `personas/PERSONAS.md`
- [ ] Confirm exact supported capability list (Integration, B2B, MFT, Monitoring — anything else?)
- [ ] Add release timeline / current sprint milestone
- [ ] Clarify which agent patterns have been formally aligned across capabilities vs. still in progress
