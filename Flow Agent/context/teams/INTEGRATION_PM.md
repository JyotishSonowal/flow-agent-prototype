# Integration PM

**Type**: Product Management
**Focus**: Integration use cases — flow service and workflow as used for integration scenarios

**PM**: Thamizharasu Soundrapandian (`[TODO: add Slack/email]`)

---

## Role and Responsibilities

The Integration PM owns the **product strategy and prioritization** for integration use cases within Flow Agent. This includes:

- Defining the integration use case roadmap
- Prioritizing features for flow service and workflow in the integration context
- Translating user needs (from Isaac and similar personas) into requirements
- Aligning with stakeholders on scope, timeline, and success metrics
- Working with the Lead Product Designer on requirements → design → delivery

---

## Current Priorities

> Last updated from WB-2701 epic — Jul 2026

- **Flow Agent private preview** in lower environment — target was end of June 2026
- Flow service authoring via agent (WB-2701) — spike in progress, 2026 Q3 Sep fix version
- Scope decision needed for Q2/Q3 to achieve private preview for Flow Agent

---

## Integration Use Cases in Scope

These are the integration use cases the agent should support. Confirm and expand with the PM:

| Use Case | Description | Priority | Status |
|---|---|---|---|
| Create flow service (traditional wM Flow) | User describes integration, agent creates it via DSL → wM Flow pipeline | Critical | Spike in progress (WB-2701) |
| Multi-turn conversation for flow authoring | User refines flow via follow-up prompts | Critical | In scope for spike |
| Input to plan for flow | User reviews/approves agent's plan before generation | Critical | In scope for spike |
| Test / execute flow service | Run flow from within the agent and see results | High | API needed (blocker) |
| Create workflow | User describes a multi-step workflow, agent creates it | High | `[TODO: status]` |
| Edit existing flow service | User asks to change a created integration | High | `[TODO: status]` |
| Deploy flow / workflow | Deploy to environment from the agent | Medium | `[TODO: status]` |
| Clone / duplicate | Copy an existing integration as a starting point | Low | `[TODO: status]` |
| DAF authoring | Create DAF-based flow via agent | `[TODO]` | Deferred — not in current scope |
| Listener support | Flow with inbound listener trigger | Out of scope | Explicitly excluded |
| Custom actions for flow services | Non-standard connector actions | Out of scope | Explicitly excluded for Q1 |
| B2B integration setup | Guide user through B2B-specific configuration | `[TODO]` | `[TODO]` |
| Monitor integrations | View status and errors for running flows | `[TODO]` | `[TODO]` |

---

## Success Metrics

> What does success look like for the integration use cases?

- `[TODO: Primary metric — e.g. flow services created per session, task completion rate]`
- `[TODO: Secondary metric]`
- `[TODO: Qualitative goal — e.g. users feel the agent understands their intent]`

---

## Requirements and Specs

- Jira project: `WB` on `ibm-middleware.atlassian.net`
- Key epic: [WB-2701](https://ibm-middleware.atlassian.net/issues?filter=59557&selectedIssue=WB-2701)
- Confluence spec: [DAF authoring using AI](https://ibm-middleware.atlassian.net/wiki/spaces/PROMAN/pages/1112506390/DAF+authoring+using+AI)
- Aha link: https://bigblue.aha.io/features/WEBMIOI-500
- Architecture PPT (Prasad GSK SharePoint): [webMethods Integration AI.pptx](https://ibm-my.sharepoint.com/:p:/r/personal/prasad_gsk_ibm_com/Documents/PPTs/webMethods%20Integration%20AI.pptx)

---

## Current State / Open Items

- [ ] User journey for flow service creation — design team action; engineering has been asking since Dec 2025
- [ ] Use case refinement doc (presented Mar 2026) — get link from Thamizharasu or Madhumanti Ghosh
- [ ] Confirm full Q3 scope for Flow Agent private preview
- [ ] `[TODO: Add success metrics for flow service authoring]`
- [ ] `[TODO: Confirm which WAII epics on jsw.ibm.com correspond to WB-2701 — may be tracked under WAII project]`
