# UI Team

**Type**: Engineering (Frontend)  
**Focus**: UI implementation for both Workflow and Flow Service capabilities

---

## What This Team Does

The UI team implements the frontend of the Flow Agent — the chat interface, workspace view, and all capability-specific UI for both Workflow and Flow Service. They work closely with the Lead Product Designer to bring Figma designs into production.

Key responsibilities:
- Implementing the shared agent shell (chat, workspace, navigation)
- Building capability-specific UI components (flow diagram view, workflow canvas, etc.)
- Consuming APIs from the backend and streaming responses from the agent
- Ensuring Carbon Design System compliance
- Accessibility (WCAG AA) in implementation

---

## Tech Stack

> Confirm with the team and fill in.

- **Framework**: `[TODO: React? Angular? Confirm]`
- **Design system**: Carbon Design System (IBM)
- **State management**: `[TODO]`
- **Build/bundler**: `[TODO]`
- **Repo**: `[TODO: Link to GitHub/GitLab repo]`

---

## Design-to-Dev Handoff Process

> Document your agreed process here so it's consistent.

- Designs are delivered in Figma — link: `[TODO: Add Figma file link]`
- Designs are marked **Ready for Dev** when: `[TODO: Define criteria — e.g. all states covered, annotations added, token usage confirmed]`
- Reviews happen in: `[TODO: Figma comments? Dedicated design review meeting?]`
- Implementation questions go to: `[TODO: Slack channel or tagged in Figma?]`

---

## Shared Pattern Implementation

Because the agent surface is shared across capabilities, the UI team implements **common components once** and reuses them. Design decisions made for one capability affect all capabilities — always flag potential shared-pattern changes to the Agent Pattern team before handoff.

Key shared components implemented by UI team:
- Chat message list (user + agent messages)
- Streaming message component (typing/loading indicator)
- Workspace panel (split-pane view)
- Empty/blank state
- Navigation / capability switcher
- `[TODO: Add others as they are built]`

---

## Current State / Open Items

- [ ] `[TODO: Add primary contact / team lead]`
- [ ] `[TODO: Add frontend repo link]`
- [ ] `[TODO: Add current implementation status — what's been built, what's in progress]`
- [ ] `[TODO: Confirm tech stack above]`
- [ ] `[TODO: Note any known frontend constraints that affect design — e.g. performance limits, browser support]`
- [ ] `[TODO: Define and document design-to-dev handoff criteria]`
