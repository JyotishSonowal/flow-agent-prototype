# DAF Authoring via AI — Use Cases

> Source: PM spec by Thamizharasu Soundrapandian (Confluence: DAF authoring using AI)
> Related Jira epic: WB-2701

---

## Summary

Enable integration developers / specialists to author a DAF (Designer's Application Flow) service using AI — so that integrations can be built quickly and efficiently through natural language prompts.

---

## Goals

- DAF authoring via AI is **only supported for DADA-enabled / supported tenants**
- **Design Runtime (DRT)** is the default runtime for authoring DAF via AI — runtime selection is **implicit and not visible to users**
- Connectors are **automatically synced to DRT from WPR** based on the given prompt
- The **custom action functionality** built for Workflow is re-purposed for DAF; the created custom action is synced to DRT (the default runtime)
- **Multi-turn conversation** is supported for constructing complex DAF use cases
- DAF constructs can be **explicit** or **implicit** — both forms are supported:
  - **Explicit** → User specifies the construct directly (e.g. "Add if-else loop for the following…", "Wrap the block with try-catch")
  - **Implicit** → User describes the business logic and the agent infers the right constructs (e.g. "If the revenue of the Salesforce prospect is greater than $20M, then update HubSpot…")
- **Automated data mapping and suggestion** are available while authoring; user can also explicitly request mapping via prompt (e.g. "Map the Salesforce prospect type with HubSpot customer type")
- **Transformations and utilities** are supported
- **Partial DAF generation** is possible — user can make changes after the AI creates it
- **DAF should be saved even if it has mapping or construct errors** — missing configuration can be fixed by the user after creation
- Clarification can be asked by the agent if something is unclear

## Non-Goals

- Not a replacement for the manual DAF authoring experience

---

## Integration Complexity Levels

The PM has defined three levels of integration complexity that DAF authoring via AI must support:

### Level 1 — Point-to-Point (P2P)

Simple integration connecting two applications with no conditions.

**Example prompt:**
> Sync all Salesforce accounts with Gainsight persons

**What the agent should do:**
1. Get all accounts from Salesforce
2. Loop through the accounts
3. Create a person in Gainsight for each Salesforce account
4. Auto-identify and map data fields between source and target

**Key expectation:** Automatic data mapping — the agent identifies and maps the right fields without user instruction.

---

### Level 2 — Point-to-Point with Conditions (P2P + Conditions)

P2P integration with conditional logic (if/else constructs).

**Example prompt:**
> Sync all Salesforce accounts with Gainsight person if the account ACV is greater than $10M

**What the agent should do:**
1. Get all accounts from Salesforce
2. Loop through the accounts
3. Check ACV for each account
4. If ACV ≥ $10M → create a person in Gainsight
5. If not → exit

**Key expectations:**
- If/else constructs are added correctly
- Data mapping is done based on source and target
- The value `$10M` is properly parsed and placed into the condition

---

### Level 3 — Multi-Point (Complex Scenario)

Advanced integrations involving multiple nodes, conditions, loops, exception handling, and logging. Typically constructed through **multi-turn conversation**.

**Example prompt (can be issued in one shot or across multiple turns):**
> Sync all Salesforce accounts with Gainsight person if the account ACV is greater than $10M. Do the following:
> - Sync with Gainsight if ACV > $10M
> - If not, put them into a CSV file
> - Finally upload the CSV file to the given FTP location
> - Add proper error handling to the flow
> - Add proper logging information for debugging

**What the agent should do:**
1. Retain conversation context across multiple turns
2. Arrive at a complete DAF authoring plan from the conversation
3. Place multiple constructs (loops, conditions, try-catch, logging) in the correct positions
4. Auto-suggest default data mapping
5. Handle error conditions via try-catch blocks
6. Ask clarifying questions if something is unclear

**Key expectations:**
- Multi-turn context is retained throughout the session
- All constructs are placed correctly
- Error handling is scaffolded properly
- Agent asks clarifying questions when needed
- DAF is saved even with incomplete mapping/constructs — user fixes remaining config manually

---

## Explicit vs. Implicit Construct Examples

| Mode | User prompt | Expected agent action |
|---|---|---|
| Explicit | "Add if-else loop for the following: if prospect revenue > $20M then update HubSpot account with customer type = 'potential buyer', else 'future buyer'" | Add if-else construct with specified condition and values |
| Explicit | "Wrap the block with try-catch" | Add try-catch exception handler around the selected block |
| Implicit | "If the revenue of the Salesforce prospect is greater than $20M, update HubSpot and mark the customer type as a potential buyer. Otherwise mark as a future buyer" | Infer if-else construct from business language |
| Implicit | "Add a proper error handling to this flow" | Infer try-catch placement based on flow structure |
| Explicit | "Map the Salesforce prospect type with HubSpot customer type" | Perform explicit field mapping between two connectors |

---

## Key Behaviors the Agent Must Support

| Behavior | Description |
|---|---|
| Auto data mapping | Agent automatically identifies and maps fields between source and target connectors |
| Explicit data mapping | User can request specific mappings via prompt |
| Transformations & utilities | Agent supports data transformation and utility operations within the DAF |
| Multi-turn context | Conversation context is retained throughout a session to build up complex flows |
| Partial generation | User can modify AI-generated DAF after creation |
| Save with errors | DAF is saved even if mapping or construct errors exist — user fixes later |
| Clarification prompts | Agent asks clarifying questions when the prompt is ambiguous |
| Connector auto-sync | Relevant connectors are automatically synced to DRT from WPR based on the prompt |
| Runtime implicit | DRT selection is automatic and invisible to the user |

---

## References

- Confluence spec: [DAF authoring using AI](https://ibm-middleware.atlassian.net/wiki/spaces/PROMAN/pages/1112506390/DAF+authoring+using+AI)
- Jira epic: [WB-2701 — [Spike] Create a wM Flow Service via AI](https://ibm-middleware.atlassian.net/issues?filter=59557&selectedIssue=WB-2701)
