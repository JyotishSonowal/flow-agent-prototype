# Meeting Summary: Flow Agent Daily Sync — 10 July 2026

## Meeting Overview
- **Date:** 10 July 2026
- **Attendees:** Jyotish Sonowal (Lead Designer), Thamizharasu Soundrapandian (PM), Prasad GSK, Sonal Mehta, Ramanarayanan Balasubramanian (Ramu, present with Prasad), Biswa Bhusan Dalai, Santhosh Hari Sridhar, Namita Maheshwari, Pradeep Wadikar
- **Purpose:** Follow-up design review of the updated Flow Agent DAF authoring UX; continued from 9 July. Jyotish shared revised designs incorporating feedback from the previous day.

---

## Key Discussion Points

- **Click-through prototype requested:** Tham asked Jyotish to create a click-through Figma prototype to tell the story clearly — similar to what another designer (Ankit) had done for a different feature. Jyotish agreed.
- **Connector authentication for new projects:** Santhosh raised that if a user creates a new project during the flow, connectors would not yet be set up. Resolved as: redirect user to the product to set up connectors first, then return. This already has precedent in Launchpad.
- **Account selection behaviour:** Tham confirmed that when more than one account is available, the same account selection pattern used in workflow should be reused. Jyotish to add notes in designs to make this clear (so reviewers don't re-raise the question).
- **"Continue with assumptions" option:** Jyotish proposed that after the agent asks clarifying questions, the user can say "continue with assumptions" to skip answering and let the agent proceed with defaults. Team confirmed this is valuable and should be in scope.
- **Business view layout — horizontal vs. vertical:** Discussion on whether the business view (plan) should be shown horizontally (left to right, matching workflow) or vertically (top to bottom, better for longer flows). Jyotish presented both options.
  - Vertical was agreed as better for flow — flow services are typically multi-step and complex; vertical scrolling is more natural.
  - Tham acknowledged flow is designed for complex problems (unlike workflow which is simpler).
  - Business view confirmed as: numbered steps with a one-liner plain-English description per step — simple, readable, no if/else/try-catch construct representation.
- **Business view content — what to show:** Aligned that the business view is a "plan" — a numbered list of steps in plain English, dynamically generated from the prompt and Q&A. If/else conditions and try-catch blocks are described as text within the relevant step description, not as separate structural nodes.
  - Tham confirmed: "Check if account ACV is greater than $10M. Skip if condition not met." is the right format for a conditional step.
  - Try-catch described similarly: "In case of exception, do [x]" as secondary description text on the relevant step.
- **Technical view:** Confirmed as a replica of the existing flow service Design Editor — generated only after the user reviews the business view and proceeds.
- **Auto-generate flowchart / DSL idea parked:** Biswa suggested generating YAML/DSL syntax to produce a flowchart render. Tham parked this for future consideration — out of scope for Q3/Q4.
- **Persona for Flow Agent:** Brief debate on whether the target persona is specifically technical/developer or open to anyone. Tham's view: the experience should be self-explanatory and should lower the barrier for anyone to build a flow service, not limited to technical users. Prasad suggested defaulting to "developer persona" to avoid the persona debate consuming discussion time (as happened with workflow). Agreement: primary persona is developer, but the experience should be inclusive enough for others.

---

## Decisions Made

### 1. Business view layout is vertical (top to bottom)
**Decision:** The business view (plan preview) for Flow Agent DAF will be rendered vertically — numbered steps stacked top to bottom.
**Rationale:** Flow services are complex and can have many more steps than workflow. Vertical scrolling is more natural than horizontal scrolling in the agent workspace. Also avoids horizontal overflow in the chat/workspace panel.
**Owner:** Jyotish Sonowal
**Impact:** Design update required; differs from the horizontal approach used for workflow.

### 2. Business view = plain-English numbered steps only (no structural constructs)
**Decision:** The business view shows numbered steps with one-liner plain-English descriptions. If/else conditions, try-catch, and loops are described as secondary text within the relevant step — not represented as separate UI constructs or nodes.
**Rationale:** Tham confirmed this is readable and sufficient. Structural detail is available in the technical view. Keeps the business view simple and aligned with the "plan" concept.
**Owner:** Ramu (backend output), Jyotish (design)
**Impact:** Business view design can be finalised; backend team knows the expected output format (step + description per step).

### 3. Technical view = replica of flow service Design Editor
**Decision:** The technical view is the actual flow service as it would appear in the Design Editor — generated after user confirms the plan.
**Rationale:** Consistent with workflow pattern; leverages existing tooling.
**Owner:** Ramu / backend team
**Impact:** No new UI required for technical view — iframe or embed of existing editor.

### 4. Connector auth for new projects = redirect to product
**Decision:** If a user creates a new project during DAF authoring, they are redirected to the product to set up connectors, then return to the agent flow.
**Rationale:** Connector setup cannot happen inside the agent; same pattern already exists in Launchpad.
**Owner:** Jyotish Sonowal (design notes), engineering
**Impact:** Design needs a note/annotation clarifying this path; no new agent flow needed.

### 5. Account selection = reuse workflow pattern
**Decision:** When multiple accounts are available, the account selection experience should follow the same pattern as workflow.
**Rationale:** Pattern reuse; reduces design and engineering work; keeps the experience consistent.
**Owner:** Jyotish Sonowal (add notes to designs)
**Impact:** No new design work needed for account selection.

### 6. Primary persona = developer (with inclusive design intent)
**Decision:** The primary target persona is the integration developer. However, the experience should be self-explanatory and accessible enough that others can use it — no persona-gating.
**Rationale:** Avoids repeating the months-long persona debate from workflow. Tham's goal: lower the barrier for anyone to build a flow service via the agent.
**Owner:** Jyotish Sonowal, product team
**Impact:** Design should not assume deep technical knowledge for the conversational/business view layer.

---

## Action Items

| Action | Owner | Due Date | Dependencies |
|--------|-------|----------|--------------|
| Create click-through Figma prototype for DAF authoring flow | Jyotish Sonowal | TBD | Design updates below |
| Update business view to vertical layout (top to bottom) | Jyotish Sonowal | TBD | None |
| Add design annotation: new project creation → redirects to product to set up connectors | Jyotish Sonowal | TBD | None |
| Add design annotation: account selection follows existing workflow pattern | Jyotish Sonowal | TBD | None |
| Confirm max number of steps the agent can generate for a flow service (to validate business view layout assumptions) | Biswa / Ramu / Prasad | TBD | Backend clarity |
| Offline discussion: catalog of actions/intents possible within a flow service (fetch, validate, iterate, condition, transform etc.) | Prasad + Tham + Biswa | TBD | Requested by Ramu; Tham to clarify scope |

---

## Follow-up Required

- **Max step count:** Biswa flagged the agent could theoretically generate hundreds of steps. The team needs to agree on a maximum step count for the business view, or confirm that vertical scroll handles it adequately. This affects layout decisions.
- **DSL/flowchart idea (parked):** Biswa suggested generating YAML/DSL to produce a flow chart render. Tham parked for future. Worth tracking as a potential Q4/future item.
- **Catalog of flow service actions/intents:** Ramu previously requested a list of all possible actions within a flow (fetch, validate, iterate, condition, transform, etc.) to inform the backend model. Prasad suggested this be created as an internal reference. Follow-up offline between Prasad, Tham, and Biswa.
- **DSL / code view for technical users:** Sonal raised the question of whether integration specialists who want to view/approve the generated DSL code should have that option. Tham's answer was directionally that the experience should be self-explanatory for anyone — but the code view question was not fully resolved. May need design consideration.

---

## Key Risks or Blockers

- **Risk:** Business view step count could be unbounded — if an agent generates 50+ steps, even a vertical layout may be overwhelming.
  - **Mitigation:** Confirm step count expectations with backend team; consider collapsing/grouping for complex flows.
- **Risk:** Designs are being reviewed without the full engineering team present — some questions (e.g. connector sync, account lookup) keep re-surfacing.
  - **Mitigation:** Add notes/annotations in Figma for all such decisions; build click-through prototype to make story clear without verbal explanation.

---

## Next Steps

1. Jyotish updates business view to vertical layout and adds design annotations for connector auth and account selection paths
2. Jyotish creates a click-through Figma prototype for the full DAF authoring journey
3. Prasad/Tham/Biswa discuss offline: catalog of possible flow service intents/actions
4. Backend team (Ramu/Biswa) confirms expected max step count for the business view
5. Continue daily sync — Jyotish to share updated prototype in next session
