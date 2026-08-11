# Meeting Summary: Flow Agent Daily Sync — 9 July 2026

## Meeting Overview
- **Date:** 9 July 2026
- **Attendees:** Jyotish Sonowal (Lead Designer), Thamizharasu Soundrapandian (PM), Prasad GSK, Sonal Mehta, Ramanarayanan Balasubramanian (Ramu), Ashok Kumar B M, Pradeep Wadikar
- **Purpose:** Design review of early-stage DAF authoring flow via the Flow Agent; walkthrough of Jyotish's draft UX designs covering the full user journey from prompt to flow service creation

---

## Key Discussion Points

- **Design walkthrough:** Jyotish presented an early draft of the Flow Agent UX for DAF authoring, using the three sample prompts from Tham's PM spec (P2P → P2P with conditions → Multi-point). Designs were borrowed from Ramu's earlier demo as a starting point — explicitly framed as a conversation starter, not a final design.
- **Alignment on shared UX shell:** The team confirmed the overall experience (agent panel, workspace, chat) will be aligned with the existing Bifrost UI — no new shell patterns. This is a ground rule.
- **Agent type disambiguation (flow service vs. workflow):** Major discussion on how the agent decides whether to create a flow service or a workflow when a user doesn't explicitly say. Currently, only workflow exists; flow service is coming.
- **Business view vs. technical view:** Discussion on what the business view (plan/preview) should show, how linear vs. graphical it should be, whether if/else and try-catch constructs should be represented, and when the technical view gets generated.
- **Plan approval before technical view generation:** Ramu proposed that the agent should ask the user to approve the proposed plan (business view) before doing the heavy lifting of generating the technical view. This pattern also enables a feedback loop for model improvement.
- **Frontend implementation involvement:** Tham requested that the UI developer(s) implementing this should be included in these design discussions (not discovered after the fact). Ashok Kumar was confirmed as aware; recording to be shared with anyone not present.
- **UAC integration for connector intelligence:** Sonal flagged that connector data is being pushed to UAC and that both workflow agent and flow agent need to integrate with UAC to resolve connector availability.

---

## Decisions Made

### 1. UX shell stays aligned with Bifrost
**Decision:** The Flow Agent DAF authoring experience must not deviate from the existing Bifrost/Launchpad agent shell patterns.
**Rationale:** Consistency across the platform; pattern reuse.
**Owner:** Jyotish Sonowal
**Impact:** Design is constrained to the shared shell — no new navigation or interaction patterns.

### 2. Flow service is the primary persona for DAF — not business user
**Decision:** Flow service authoring targets the technical user (developer), not the business user. Business view should therefore remain high-level — a confirmation/plan view, not a deep technical representation.
**Rationale:** Tham clarified that workflow targets business users; flow service targets technical/integration developers. The business view serves as a high-level intent check before the technical view is generated.
**Owner:** Jyotish Sonowal (design), Ramu (backend)
**Impact:** Business view does not need to show all construct details — just enough for the developer to confirm intent.

### 3. Business view first, technical view on user confirmation
**Decision:** The agent generates a business view (plan), waits for the user to review/modify conversationally, then generates the technical view only after the user proceeds. This mirrors the existing workflow pattern.
**Rationale:** Avoids expensive technical view generation before user intent is confirmed; enables feedback loop (Ramu).
**Owner:** Ramu (backend), Jyotish (design)
**Impact:** Requires a clear UX moment where the user signals readiness to proceed — implicit (user selects a suggested action) rather than an explicit approve/reject button.

### 4. Implicit plan approval (no explicit approve/reject button)
**Decision:** The plan approval is implicit — user proceeds by selecting one of the suggested next actions. There is no explicit "Approve / Reject" prompt.
**Rationale:** Tham's preference; keeping conversation natural.
**Owner:** Jyotish Sonowal
**Impact:** Design must clearly communicate suggested next actions after the business view is shown.

### 5. Flow service / workflow disambiguation — static intelligence for Q3, epic for Q4
**Decision:** For Q3, use static intelligence to decide flow service vs. workflow (e.g. based on connector metadata indicating which integration flavor is supported). Create a separate epic for dynamic/ML-based intelligence targeting Q4.
**Rationale:** Dynamic intelligence layer (master integration agent) doesn't exist today; building it is out of scope for the immediate milestone.
**Owner:** Prasad GSK (epic creation), AICS team (implementation)
**Impact:** For Q3, the disambiguation may require the user to explicitly select or be shown a choice if intent is ambiguous.

### 6. Else condition shown as secondary text under the If node in business view
**Decision:** In the business view, the else branch of an if/else construct will be shown as secondary text below the if node (not as a separate branch).
**Rationale:** Keeps the business view linear and readable while still communicating the else condition. Tham confirmed this gives a clear enough picture.
**Owner:** Ramu (backend output), Jyotish (visual design)

---

## Action Items

| Action | Owner | Due Date | Dependencies |
|--------|-------|----------|--------------|
| Revisit the flow service / workflow disambiguation UX — find a design solution for when intent is ambiguous | Jyotish Sonowal | TBD | Q3 scope decision |
| Create a Jira epic for AICS team to handle dynamic flow vs. workflow routing intelligence | Prasad GSK | TBD | Tham alignment (done) |
| Design the business view for flow service, including icon strategy (connector icons where available, placeholders elsewhere) | Jyotish Sonowal | TBD | Alignment with Sonal on workflow business view patterns |
| Add a "technical view" frame to the design walkthrough — convert the current business view example to a technical view so Ramu and team have design reference | Jyotish Sonowal | TBD | None |
| Share meeting recording with UI implementors not on the call (Santhosh, Aleemullah) | Prasad GSK | ASAP | None |
| Align on whether the business view should be more graphical (non-linear) for flows with branching — review Sonal's concern about loops and conditionals | Jyotish Sonowal + Sonal Mehta | TBD | Design follow-up |

---

## Follow-up Required

- **Icon strategy for business view:** Flow service nodes don't have connector icons the way workflow does. Needs resolution: use connector icons where available (e.g. Salesforce logo), text-only for structural nodes (loop, if, try-catch)?
- **Linear vs. graphical business view:** Current design shows steps linearly. For complex flows with branching (if/else, loops), a purely linear list may not be sufficient. Needs further design exploration — may require updating workflow business view too for consistency.
- **"Validation" step terminology:** Ramu flagged that "validation" in the current design is ambiguous — it could mean account/precondition validation (internal, done before questions are asked) or user plan confirmation (explicit). Jyotish needs to clarify and rename this step.
- **Two developer personas for the technical view:** Ramu raised that there are two developer archetypes: (1) SDLC-oriented developers who prefer step-by-step confirmation before seeing output, and (2) output-first developers who want to see the result immediately and iterate. Jyotish to consider whether the design needs to accommodate both.
- **UAC integration scope:** Sonal flagged that UAC integration (for connector intelligence) needs to be in both the workflow agent and flow agent. Needs follow-up with the relevant teams to ensure this is scoped.

---

## Key Risks or Blockers

- **Risk:** No dynamic intelligence layer exists today to route between flow service and workflow — user disambiguation may be a poor experience if the agent can't infer intent.
  - **Mitigation:** Static intelligence (connector metadata-based routing) for Q3; dedicated epic for Q4.
- **Risk:** Business view may mislead technical users if it's too simplified (misses if/else, try-catch constructs) or too complex (duplicates the technical view).
  - **Mitigation:** Else shown as secondary text; try-catch representation still to be designed.
- **Risk:** UI implementors (Santhosh, Aleemullah) not yet included in design reviews — risk of implementation surprises.
  - **Mitigation:** Recording to be shared; ongoing inclusion requested by Tham.

---

## Next Steps

1. Jyotish updates the business view design — icon strategy, else as secondary text, technical view frame added
2. Prasad creates Jira epic for AICS team (flow vs. workflow routing intelligence, target Q4)
3. Prasad shares meeting recording with Santhosh and Aleemullah
4. Jyotish revisits disambiguation UX — design options for when user intent is ambiguous (explicit selection vs. agent recommendation)
5. Follow-up design session between Jyotish and Sonal to align business view patterns across flow service and workflow
