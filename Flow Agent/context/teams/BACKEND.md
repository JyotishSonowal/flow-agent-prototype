# Backend Team

**Type**: Engineering (Backend)  
**Focus**: Backend services for both Workflow and Flow Service capabilities

---

## What This Team Does

The backend team owns the server-side infrastructure, APIs, and data layer that support both the Workflow and Flow Service capabilities. They are distinct from the AI engineering teams — their focus is on reliable, scalable backend services rather than AI/ML.

Key responsibilities:
- REST/GraphQL APIs consumed by the UI and agent layer
- Persistence of flow services, workflows, and execution history
- Authentication, authorization, and multi-tenancy
- Background jobs (async execution, scheduling)
- Integration with IWHI platform infrastructure

---

## Relationship to Design

Backend constraints directly affect what the UI can show and how fast:

| Concern | Design Impact |
|---|---|
| API response times | Loading states, skeleton screens, streaming vs. fetch |
| Pagination / data limits | How many items can be shown in lists, workspace, history |
| Permissions model | What users can see/do — role-based UI differences |
| Error codes | Error messages must map to real backend error types |
| Data structure | What fields exist on a flow service or workflow — affects what can be displayed |

---

## APIs and Contracts

> Fill this section with actual API references as they become available.

- **Flow Service API**: `[TODO: Add link to API docs or Swagger]`
- **Workflow API**: `[TODO: Add link to API docs or Swagger]`
- **Auth model**: `[TODO: OAuth? IBM IAM? Other?]`
- **Environments**: `[TODO: Dev / Staging / Prod URLs or namespaces]`

---

## Current State / Open Items

- [ ] `[TODO: Add primary contact / team lead]`
- [ ] `[TODO: Add link to backend API documentation]`
- [ ] `[TODO: Note any known backend limitations that affect UX — e.g. no pagination on X, slow endpoint for Y]`
- [ ] `[TODO: Add any planned backend changes that will affect UI/design]`
- [ ] `[TODO: Clarify error code taxonomy — what errors can the UI surface vs. handle silently]`
