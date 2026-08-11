# Meeting Summary: Flow Agent Daily Sync — 13 July 2026

## Meeting Overview
- **Date:** 13 July 2026
- **Attendees:** Jyotish Sonowal (Lead Designer), Thamizharasu Soundrapandian (PM), Prasad GSK, Sonal Mehta, Ramanarayanan Balasubramanian (Ramu, with Prasad), Biswa Bhusan Dalai, Santhosh Hari Sridhar, Ashok Kumar B M, Namita Maheshwari, Aleemullah Samiullah, Chethan Kumar V
- **Purpose:** Walkthrough of Jyotish's updated click-through prototype (based on Friday 10 July discussions). Goal was to conclude the design direction today and identify what is/isn't feasible for engineering to implement.

---

## Key Discussion Points

- **Prototype walkthrough:** Jyotish presented the updated click-through prototype consolidating all discussions from last week. The flow covered: prompt → artifact type recommendation → project selection → clarifying questions → business + technical view generation → create flow service → test → deploy.
- **Primary persona confirmed:** Jyotish opened by confirming the primary focus is **Isaac (integration expert / developer persona)** for the Flow Agent.
- **Business view + technical view — when to generate:** Major discussion on whether business view and technical view should be generated simultaneously or sequentially.
  - Jyotish proposed: both generated at the same time, once project is selected and clarifying questions are answered.
  - Tham pushed back: technical view requires custom actions and account setup, which need additional information — it may not be possible to generate both at the same time without those prerequisites.
  - Santhosh clarified: the technical view (Flow JSON) can be rendered if the backend API can provide it; but without account setup, custom action creation is blocked.
  - Ashok confirmed: accounts are required to create custom actions, so technical view cannot be generated without them.
  - Resolution: follow the **same pattern as workflow** — business view first, technical view generated only after accounts/custom actions are confirmed. This mirrors the workflow draft/active state model.
- **Workflow pattern as the reference:** Santhosh explained how workflow handles this: workflow is created in **draft state** in the background, the technical view is shown after the user activates it. Tham confirmed this is the model to follow for flow service as well.
- **Custom action creation — explicit vs implicit:** Discussion on whether custom action creation is explicit (user is told what will be created) or implicit (done in the background). In current Launchpad/workflow implementation, it is implicit. Tham flagged this needs validation with Sonal since the old design was explicit.
- **Precondition checks before business view:** Agreed that all prerequisite checks (project, account, custom action readiness, lookups) should happen **before the business view is generated** — as part of the Q&A/questioning phase. This is consistent with the workflow approach.
- **Validation step (from previous design):** Jyotish noted the current workflow design has a "validate configurations" button before the technical view is shown. Tham and Prasad agreed this should be handled internally/automatically rather than asking the user to trigger it.
- **Design gaps flagged by Aleemullah:**
  - **Execution history and test report** are missing from the prototype — these will differ from workflow and need to be designed. Jyotish needs reference material.
  - **Flow service input/output configuration** — flow services can accept inputs and configure outputs. This needs to be reflected in the design. Biswa noted the flow signature should be part of the DSL.
- **Happy path confirmed for engineering to start on:** Sonal asked if there's a confirmed happy path so the UI team can start building. Prasad confirmed Jyotish's prototype represents the happy path — engineering can begin on this while edge/corner cases are resolved in parallel.

---

## Decisions Made

### 1. Business and technical view NOT generated simultaneously — workflow pattern followed
**Decision:** The flow service technical view will only be generated after the user has provided project, account, and all required prerequisites (same as the workflow draft/activate pattern). The business view is shown first.
**Rationale:** Tham clarified that custom actions (which require account and project) are mandatory to generate the technical view. Without these, the technical view cannot be rendered.
**Owner:** Ramu / backend team, Jyotish (design update)
**Impact:** Jyotish's prototype needs to be updated — the simultaneous generation assumption is incorrect.

### 2. Prerequisite checks happen before business view generation
**Decision:** All required assets (project, account, custom actions, lookups) must be confirmed/created as part of the questioning phase **before** the business view is generated. This mirrors workflow behaviour.
**Rationale:** Consistent with existing workflow pattern; technically necessary.
**Owner:** Prasad, Sonal, engineering team
**Impact:** The clarifying question phase in the design should include prompts for any missing prerequisites, not just intent-related questions.

### 3. Engineering team to review design and report feasibility issues
**Decision:** The flow service engineering team (led by Prasad, with Sonal and Ramu) should review Jyotish's design proposal against what is technically feasible in the current workflow/flow implementation, then report back. If something isn't possible, the design or the code must change — one of the two.
**Rationale:** Repeated design discussions are not resolving technical questions; the engineering team needs to own this assessment.
**Owner:** Prasad (driving), Sonal + Ramu (reviewing), Jyotish (design reference)
**Due:** Report back at the next daily sync

### 4. Sonal + flow engineering team to have an alignment session
**Decision:** Sonal (who has deep workflow AI implementation knowledge) should have a dedicated sync with the flow engineering team (Ashok, Biswa, etc.) and Jyotish to review the design, identify gaps between workflow and flow, and agree on how to align.
**Rationale:** Sonal has workflow implementation context; the flow team has flow-specific knowledge. Both are needed to bridge the gap.
**Owner:** Prasad to drive setup; Sonal + flow team as participants; Jyotish included
**Due:** Before next daily sync

### 5. Happy path is confirmed — UI team can start building
**Decision:** Jyotish's prototype represents the confirmed happy path. The UI engineering team can begin implementation on this while edge/corner case decisions are resolved in parallel.
**Rationale:** Sonal asked for this explicitly to unblock UI development.
**Owner:** Prasad to communicate to UI team
**Impact:** Parallel-tracks development and design review of edge cases.

---

## Action Items

| Action | Owner | Due Date | Dependencies |
|--------|-------|----------|--------------|
| Review design proposal against workflow/flow implementation; identify what is/isn't feasible | Prasad + Sonal + Ramu | Before next sync (14 July) | Jyotish's prototype (done) |
| Schedule and run alignment session: Sonal + flow engineering + Jyotish | Prasad | ASAP | Sonal + Ashok availability |
| Update prototype to reflect correct technical view generation timing (not simultaneous with business view) | Jyotish Sonowal | TBD | Feasibility confirmation from engineering |
| Design execution history and test report for flow service (these differ from workflow) | Jyotish Sonowal | TBD | Reference material needed from Aleemullah/flow team |
| Provide Jyotish with reference on flow service execution history and test report | Aleemullah Samiullah | TBD | None |
| Clarify flow service input/output configuration and how this is reflected in the design | Jyotish Sonowal + Aleemullah | TBD | Biswa's input on flow signature/DSL |
| Communicate to UI team: happy path is confirmed, can start building | Prasad GSK | ASAP | None |

---

## Follow-up Required

- **Technical view generation gate:** Needs final confirmation from engineering on exactly what is required before the technical view can be generated. Is it: (a) project + account only, (b) project + account + custom actions pre-created, or (c) something else?
- **Custom action handling (explicit vs implicit):** Old workflow design was explicit (user told about custom action creation); Launchpad design is implicit. Need to confirm which model applies for flow service. Tham asked Ashok to look at the Launchpad workflow behaviour and sync with Sonal.
- **Validation step:** The "validate configurations" step from the current workflow design needs to be assessed — should it remain as a user-triggered step or be replaced with automatic background validation?
- **Flow service input/output / flow signature:** Aleemullah flagged that flow services can accept inputs and that the flow signature should be part of the DSL. Jyotish needs to incorporate this into the design.
- **Execution history + test report design:** Currently missing from the prototype. Jyotish needs reference from the engineering team to design these screens (they will differ from the workflow equivalent).

---

## Key Risks or Blockers

- **Risk:** Technical view cannot be generated simultaneously with the business view — this is a change to the current design assumption that may require a prototype revision.
  - **Mitigation:** Engineering team reviewing and reporting back before next sync.
- **Risk:** Without a dedicated Sonal ↔ flow engineering sync, the same technical questions will keep re-surfacing in daily syncs.
  - **Mitigation:** Prasad to set up dedicated session immediately.
- **Risk:** Jyotish's design is missing the execution history, test report, and input/output configuration screens — incomplete happy path.
  - **Mitigation:** Aleemullah to provide reference material; Jyotish to complete design.

---

## Next Steps

1. Prasad drives engineering feasibility review of design (before 14 July sync)
2. Prasad sets up Sonal + flow team + Jyotish alignment session
3. Engineering team reports back: what is possible, what isn't, what needs to change (design or code)
4. Jyotish updates prototype based on engineering feedback (especially technical view timing)
5. Aleemullah shares execution history and test report reference with Jyotish
6. Jyotish designs execution history, test report, and input/output screens for flow service
7. Prasad communicates happy path confirmation to UI team so implementation can begin
