# Flow Agent Prototype — Plan

## Overview

Build a static HTML/CSS/JS prototype of an agentic conversational experience called "Flow Agent". The prototype simulates a non-linear chat flow where:

- The agent sends pre-scripted messages with a 2–3 second typing delay to mimic agentic reasoning
- At defined branch points, the user is presented with options
- One branch ("Update the mapping") diverges and merges back into the main flow
- No framework, no backend — runs entirely in the browser as a static file set

The design source is screenshots exported from Figma. Fidelity is intentionally rough — the goal is to demonstrate the interaction logic, branching behavior, and agentic UX pattern, not pixel-perfect visuals.

---

## Architecture

```
index.html               — entry point, loads the shell
css/
  base.css               — reset, typography, layout shell
  chat.css               — chat bubble styles, option cards, agent states
js/
  flow-data.js           — all screens, agent messages, and branch definitions
  engine.js              — flow state machine: renders messages, handles transitions
  main.js                — bootstraps the app
```

### Flow State Machine

Each step has:
- `id` — unique step identifier
- `speaker` — "agent" or "user"
- `message` — text content (HTML allowed for formatted agent messages)
- `options` (optional) — array of user choices, each with `label` and `nextStepId`
- `nextStepId` (optional) — auto-advance to next step (no user choice required)
- `typing` (optional) — override typing delay in ms
- `sideEffect` (optional) — triggers a UI change e.g. "open_workspace", "open_business_view", "open_technical_view", "open_test_report", "open_file_picker", "update_mapping", "close_workspace"

---

## Complete Screen Inventory

### MAIN / HAPPY PATH

---

#### `step_welcome`
- **Type**: Agent greeting
- **Left panel**: Empty canvas
- **Agent message**: *"How can I help you today, Isaac?"*
- **Option cards** (3, decorative — not clickable):
  - "Learn what you can do" — *"Find out what you can and can't do in this chat."*
  - "Try sample prompts" — *"Use sample prompts to help you start building workflows."*
  - "Tips for better results" — *"Quick tips on creating prompts and getting better results."*
- **Input bar**: Pre-filled suggestion: *"Sync all Salesforce account with HubSpot CRM contacts if the account ACV is greater than $10M"* — clicking it sends the message
- **Next**: `step_user_prompt_sent` (user sends the pre-filled prompt)

---

#### `step_user_prompt_sent`
- **Type**: User message sent → agent reasoning state
- **Left panel**: Empty canvas
- **User bubble**: *"Sync all Salesforce account with HubSpot CRM contacts if the account ACV is greater than $10M"*
- **Agent**: Shows "Reasoning..." label with spinner + "↓ Interpreting core problem" + `•••` loading dots
- **Typing delay**: 2–3 seconds, then auto-advances
- **Next**: `step_agent_recommends_project`

---

#### `step_agent_recommends_project`
- **Type**: Agent recommendation — branch point
- **Left panel**: Empty canvas
- **Agent message** (with "Show reasoning ∨" toggle):
  > *"Both the Salesforce and HubSpot connectors are available in project_flow_service2, so that's the project I'd recommend using."*
  > *"Shall I proceed with it?"*
  > *"Alternatively, you can:*
  > *1. Choose from all available projects*
  > *2. Create a new project"*
- **Input bar**: Pre-filled suggestion: *"Use project_flow_service2"* — clicking sends it
- **Note**: Options 1 and 2 are visible in the message but NOT interactive in the prototype
- **Next**: `step_clarification_questions` (user sends "Use project_flow_service2")

---

#### `step_clarification_questions`
- **Type**: Agent asks clarifying question (show 1 of 3 only)
- **Left panel**: Empty canvas
- **User bubble**: *"Use project_flow_service2"*
- **Agent message**: *"I have a few questions about the logic — or you can share a document and I'll work from that."*
- **Clarification card** (below agent message):
  - Header: **"When you say 'sync', do you mean?"** + pagination **"1 of 3"** (arrows decorative)
  - Option 1: *"Upsert - create new and update existing records"*
  - Option 2: *"Create only - add new records and skip existing ones"*
  - Option 3: *"Other..."* (greyed out)
  - **Skip** link (blue, bottom right)
- **Input bar**: *"Or type your response here..."*
- **Next**: `step_clarification_answered` (user clicks any option or Skip)

---

#### `step_clarification_answered`
- **Type**: User answered → agent reasoning state again
- **Left panel**: Empty canvas
- **User bubble**: Summary card showing:
  - *"When you say 'sync', do you mean?"* → selected answer
  - *"What is the error handling strategy?"* → *Overwrite it*
  - *"You mentioned 'ACV' as a filter condition. What is the exact field name in the connector?"* → *Skip and log*
- **Agent**: "Reasoning..." + "↓ Interpreting core problem" + `•••` dots
- **Typing delay**: 2–3 seconds, then auto-advances
- **Next**: `step_flow_service_ready`

---

#### `step_flow_service_ready`
- **Type**: Agent presents generated flow service
- **Left panel**: Empty canvas
- **Agent message** (with "Show reasoning ∨"):
  > *"Here's the flow service — both the business logic and technical view with mapping are ready. Review and let me know if anything needs changing."*
  > *"If you're happy with it, I can save this flow service."*
- **Flow service card** (inline in chat):
  - Title: *"Sync Salesforce accounts to HubSpot contacts by ACV"* + `AI` badge
  - Status: **Draft** (grey)
  - Description: *"Automates the sync of high-value Salesforce Accounts (ACV > $10M) to HubSpot CRM Contacts, ensuring consistent and prioritized data alignment between platforms."*
  - **"View details →"** link (blue) + expand ↗ button
- **Next**: `step_workspace_business_view` (user clicks "View details →" or ↗)

---

#### `step_workspace_business_view`
- **Type**: Workspace panel opens — Business view (default first tab)
- **Left panel OPENS**: Titled *"Sync Salesforce accounts to HubSpot contacts by ACV"* + **Draft** badge
  - Top-right controls: `i/o` | download | expand | × close
  - Tabs: **"Business view"** (active, underlined) | "Technical view"
  - Numbered plain list (no accordion):
    1. Get all accounts from Salesforce — *"Retries automatically if Salesforce doesn't respond."*
    2. Check the accounts have the fields this flow needs — *"Stops and logs a warning if no accounts come back."*
    3. Go through the accounts one at a time — *"Carries on with the rest if a single account fails."*
    4. Keep only accounts above $10M ACV — *"Leaves out any account with no ACV value."*
    5. Copy every account field into HubSpot's contact format — *"Skips and logs any account whose fields can't be matched."*
    6. Create or update contacts in HubSpot — *"Logs any contact that fails to save and continues with the rest."*
    7. Lorem ipsum transform to HubSpot format — *"Lorem ipsum map Salesforce fields to $transformedAccounts structure."*
    8. Lorem ipsum transform to HubSpot format — *"Lorem ipsum map Salesforce fields to $transformedAccounts structure."*
- **Chat panel**: Flow service card updates — description replaced by eye icon + *"Viewing"*
- **Next**: `step_workspace_technical_view_open` (user clicks "Technical view" tab)

---

#### `step_workspace_technical_view_open`
- **Type**: Technical view tab — step 1 expanded (default)
- **Left panel**: Same header + **Draft** badge
  - Tabs: "Business view" | **"Technical view"** (active)
  - Accordion — **Step 1 open** by default (single-expand, one open at a time):
    - **1. Get Document By ID from Adobe Sign** ∧ (open)
      - "Mapped data" section + "View full mapping ↗" link
      - 4-column mapping table: Pipeline Input | Input - Put Object | Output - Put Object | Pipeline - Output
      - Colour-coded tags: `obj` (pink), `str` (yellow), `doc` (green)
      - Blue connector lines between fields
    - 2. Put Object from Amazon Simple Storage Service (S3) ∨
    - 3. Get Document By ID from Adobe Sign ∨
    - 4. If (/getObjectOutput/responseHeaders/Content-Length is greater than or equal to 502000)
    - 5. fn Flow logCustomMessage (indented)
    - 6. Else
    - 7. Exit 'Flow service' signaling 'Failure' "uploaded not happened" (indented)
    - 8. Get Agreement Combined Document from Adobe Sign ∨
    - 9. IO streamToString ∨
- **Clicking a collapsed step**: Opens it, closes the previously open one
- **Clicking ∧ on open step**: Collapses it
- **Next options**:
  - User clicks "View full mapping ↗" → `step_workspace_full_mapping_view`
  - User clicks ∧ on step 1 → `step_workspace_technical_view_all_collapsed`

---

#### `step_workspace_technical_view_all_collapsed`
- **Type**: All accordion steps collapsed
- **Left panel**: Same as above but step 1 now shows ∨ (collapsed), all steps visible in list
- **Next**: User clicks any step to expand → `step_workspace_technical_view_open` (with that step open)

---

#### `step_workspace_full_mapping_view`
- **Type**: Full mapping view for step 1
- **Left panel**: Replaces accordion with full mapping view
  - Header: **"← Return to technical view"** (back navigation)
  - Toggle: **"Mapped data only"** (off)
  - Full 4-column mapping table (all fields, no truncation)
- **Next**: User clicks "← Return to technical view" → `step_workspace_technical_view_open`

---

#### `step_flow_service_saved`
- **Type**: User saves flow service — agent confirms
- **Trigger**: User types anything with "save" intent in the input bar (free text)
- **User bubble**: whatever the user typed
- **Left panel**: Technical view, **Active** badge (green, replaces Draft)
- **Agent message** (with "Show reasoning ∨"):
  > *"I've saved your flow service successfully on design runtime. You can continue refining it, and once you're ready, you can run a test to validate the setup."*
- **Flow service card**: Status updates to **Active** (green) + eye icon + *"Viewing"*
- **Agent follow-up**:
  > *"If you prefer I can help you with two additional things:*
  > *1. Update the mapping*
  > *2. Test with sample data"*
- **Input bar**: Free text (*"Type something..."*)
- **Next options**:
  - User types "update" / "mapping" intent → `step_update_mapping_intent` (branch)
  - User types "test" intent → `step_test_intent`

---

#### `step_test_intent`
- **Type**: User intends to test — input pre-filled state
- **Left panel**: Technical view unchanged, **Active** badge
- **Input bar**: *"Test with sample data"* pre-filled + green send button highlighted
- **Next**: `step_test_triggered` (user sends)

---

#### `step_test_triggered`
- **Type**: User sends test request → agent posts result
- **User bubble**: *"Test with sample data"*
- **Left panel**: Technical view unchanged, **Active** badge
- **Agent message**:
  > *"I have tested your flow service."*
  > **Status:** ✅ Success
  > **Duration:** 2.289 seconds
  > **Requested at:** Today at 3:27:44 PM IST
- **Test report card** in chat:
  - Title: *"Test report"* + `AI` badge
  - Subtext: *"Created on: 12/10/26"*
  - **"View details →"** link (blue) + expand ↗ button
- **Next**: `step_test_report_open` (user clicks "View details →" or ↗)

---

#### `step_test_report_open`
- **Type**: Test report panel opens on left
- **Left panel**: Replaces technical view with **Test report panel**
  - Header: *"Test report"* + *"Created on: 12/10/26"*
  - Top-right: download | expand | × close
  - **✅ Run Successful** — *Aug 05, 2026 | 11:31:11 PM PDT*
  - DETAILS tree (all expanded):
    - `doc` GetDocumentByID_invalidInput → id: *invalidid*, documentId: *documentid*, object: *agreements*
    - `doc` GetAuditTrialInput → id: *InvalidID*, object: *agreements*
    - `doc` GetFormDataInput → id: *invalidformid*, object: *agreements*, inputStream: *java.io.ByteArrayInputStream*
    - `doc` getAgreementCombinedDocumentInput → object: *agreements*, id: *invalidid*
- **Chat panel**: Test report card updates → eye icon + *"Viewing"* (no "View details" link)
- **End of flow** ✓

---

### UPDATE MAPPING BRANCH

---

#### `step_update_mapping_intent`
- **Type**: Branch starts — user wants to update mapping
- **Trigger**: User types anything with "update" / "mapping" intent
- **User bubble**: whatever the user typed
- **Left panel**: Technical view, **Active** badge, step 1 expanded — unchanged
- **Agent message** (with "Show reasoning ∨"):
  > *"You can update the mapping in a few ways:*
  > *1. Upload a mapping file — share a CSV*
  > *2. Edit locally — download the mapping, update it, upload it back*
  > *3. Edit in the product ↗ — open the canvas and change it directly"*
- **Input bar**: *"Update mapping using this file"* pre-filled + paperclip icon + `mapping_01.csv` attachment chip + green send button
- **Next**: `step_file_picker_open` (user clicks paperclip/attachment area — triggers real OS file picker)

---

#### `step_file_picker_open`
- **Type**: Native OS file picker opens
- **Left panel**: Technical view, **Active** badge — slightly dimmed behind dialog
- **Interaction**: Browser native `<input type="file">` — user can select any file from their system
- **After file selected**: Filename appears as chip in input bar → `step_file_attached`

---

#### `step_file_attached`
- **Type**: File selected — ready to send
- **Left panel**: Technical view, **Active** — unchanged
- **Input bar**: *"Update mapping using this file"* + selected filename as chip (with × to remove) + green send button active
- **Next**: `step_mapping_updated` (user clicks send)

---

#### `step_mapping_updated`
- **Type**: Agent confirms mapping updates — branch merges back
- **User bubble** (stacked):
  - *"Update mapping using this file"*
  - filename chip (attachment)
- **Left panel**: Technical view, **Active** badge — mapping data visually updated (additional connector line on step 1)
- **Agent message** (with "Show reasoning ∨"):
  > *"I have made the following updates"*
  >
  > *Change to step 1: Get Document By ID from Adobe Sign*
  > *— encoding → set to "UTF-8" (was: not mapped)*
  >
  > *Changes to step 3: Get Document By ID from Adobe Sign*
  > *— documentId → from pipeline.id (was: from GetDocumentByIDOutput.docId)*
  > *— inputStream → from getAgreementCombinedDocumentOutput.stream (was: from putObjectOutput.stream)*
- **Flow service card**: **Active** badge + eye icon + *"Viewing"*
- **Bottom of chat**: *"You can now test this with sample data"*
- **Input bar**: Free text (*"Type something..."*)
- **Next**: `step_test_intent` ← **merges back into happy path**

---

## Interaction Rules

| Rule | Detail |
|---|---|
| Typing delay | 2–3 seconds on all "Reasoning..." states before advancing |
| "Show reasoning" toggle | Decorative — clicking expands/collapses a placeholder reasoning text block |
| Accordion | Single-expand — opening one step closes the previously open one |
| Input pre-fill | Clicking a pre-filled suggestion sends it immediately |
| Free text input | Only "save"-intent advances to save; "test"-intent advances to test; "update/mapping"-intent goes to mapping branch. All other input is ignored |
| File picker | Real browser `<input type="file">` — filename captured and shown as chip, no actual upload |
| Left panel × close | Closes the workspace panel, canvas returns to empty |
| Tab switching | Business view ↔ Technical view tabs are clickable |
| Screen 1 option cards | Decorative — not clickable |

---

## Sub-Tasks

---

### Sub-Task 1 — Collect and Organize Design Screenshots
**Status**: [x] done — inventory complete, documented above

---

### Sub-Task 2 — Build the HTML/CSS Shell

**Intent**: Create the visual container and base styles for the two-pane layout and chat interface.

**Expected Outcomes**:
- Browser-openable `index.html` with black nav bar, empty canvas pane (left), chat panel (right)
- Agent bubbles (left-aligned, avatar + name + timestamp) and user bubbles (right-aligned, grey pill)
- Option cards render as clickable cards with title, subtitle, arrow
- Clarification card with pagination renders correctly
- Flow service card and test report card render as inline chat cards
- Workspace panel (left pane) with tabs, accordion, mapping table renders correctly
- Typing indicator ("Reasoning..." + spinner + expandable section + dots)
- Input bar with pre-fill suggestion, paperclip icon, send button

**Todo List**:
1. Create `index.html` with two-pane layout structure
2. Create `css/base.css` — CSS custom properties for colors, layout, typography
3. Create `css/chat.css` — all chat UI components
4. Hardcode 2–3 static examples to validate layout visually

**Status**: [ ] pending

---

### Sub-Task 3 — Build the Flow Data File

**Intent**: Encode the complete branching flow as a JS data structure based on the inventory above.

**Expected Outcomes**:
- `js/flow-data.js` contains the complete `FLOW` map
- All steps, messages, options, sideEffects, and nextStepIds encoded
- Happy path + Update Mapping branch + merge point all present

**Todo List**:
1. Define step schema
2. Encode all happy path steps
3. Encode Update Mapping branch steps
4. Define merge point back to `step_test_intent`
5. Export `FLOW` and `START_STEP_ID`

**Relevant Context**: Full inventory in this file above

**Status**: [ ] pending

---

### Sub-Task 4 — Build the Flow Engine

**Intent**: JS engine that reads flow-data.js and drives the chat UI.

**Expected Outcomes**:
- Renders agent messages with 2–3s typing delay on reasoning steps
- Renders user bubbles on user steps
- Renders option cards, clarification cards, flow service cards, test report cards
- Handles sideEffects: opens/closes workspace panel, switches tabs, updates left panel state
- Free-text input with intent detection (save / test / update+mapping)
- Real file picker on paperclip click — filename shown as chip
- "Show reasoning" toggle works
- Accordion single-expand behaviour
- Tab switching works
- Auto-scroll on each new message

**Todo List**:
1. Create `js/engine.js` with FlowEngine module
2. Implement step renderer dispatcher
3. Implement agent message renderer with typing delay
4. Implement option/clarification card renderer
5. Implement inline card renderer (flow service card, test report card)
6. Implement sideEffect handler (workspace open/close, tab switch, left panel states)
7. Implement free-text intent detection
8. Implement file picker attachment flow
9. Create `js/main.js` — bootstraps engine on DOM ready

**Status**: [ ] pending

---

### Sub-Task 5 — Wire Up and End-to-End Test

**Intent**: Connect all parts, test every path, fix issues.

**Expected Outcomes**:
- Full prototype runs by opening `index.html` in browser (no server needed)
- Happy path works end-to-end
- Update Mapping branch works and merges back correctly
- No dead ends

**Todo List**:
1. Wire `index.html` to load all JS files in correct order
2. Run happy path end-to-end
3. Run Update Mapping branch end-to-end, verify merge back to test flow
4. Fix any broken step IDs, missing messages, styling issues

**Relevant Context**:
- No build step — plain `<script>` tags or ES modules with `type="module"`
- Test in Chrome/Safari

**Status**: [ ] pending

---

## Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | None | Zero-dependency, portable |
| Design source | Figma screenshots (images) | Avoids Figma MCP timeout failures |
| Flow logic | `flow-data.js` (data-only) | Clean separation, easy to edit |
| Branching | Flat step map with IDs | Simple, handles any graph shape |
| Typing simulation | JS timeout, 2–3s delay | Feels agentic |
| Accordion | Single-expand (Carbon default) | Focused, standard pattern |
| File upload | Native `<input type="file">` | Real OS picker, cosmetic only |
| Intent detection | Keyword match on free-text input | Simple, sufficient for prototype |
| CSS | Custom properties, no framework | Fast to write, easy to demo-tune |

---

## What This Prototype Does NOT Include

- Real AI or LLM backend
- Actual file upload or processing
- Authentication or session persistence
- Mobile layout
- Pixel-perfect Carbon styling
- Screen 3 branches (Choose all projects / Create new project) — not yet designed
