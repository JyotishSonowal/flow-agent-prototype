# Agent Pattern Team

**Type**: Designers + Product Manager  
**Focus**: Shared agent-level patterns — common UX components and interactions that apply across all capabilities (Integration, B2B, MFT, Monitoring, and future capabilities)

---

## What This Team Does

The Agent Pattern team defines and governs the **shared design language and interaction patterns** for the Flow Agent. Because all capabilities share the same agent surface, decisions made here are high-impact — they affect every user of every capability.

Key responsibilities:
- Defining common patterns: chat history, workspace view, navigation, empty states, error handling
- Maintaining the agent pattern library in Figma
- Reviewing capability-specific designs for pattern compliance and reuse opportunities
- Working with the Lead Product Designer and capability designers to align on patterns
- Coordinating with the UI team on implementation of shared components

---

## Patterns in Scope

These are the patterns owned or co-owned by this team:

| Pattern | Status | Notes |
|---|---|---|
| Chat interface (message list, input, history) | Designed — Jul 2026 | Right-side panel ~342px; user + agent message bubbles with avatars and timestamps |
| Streaming / loading / typing indicator | Designed — Jul 2026 | Reasoning trace: "Reasoning… [step label]" + streaming dots; collapsible accordion |
| Workspace view (split pane) | Designed — Jul 2026 | Agent panel right, platform/artifact left (~870px); no dedicated agent "page" |
| Artifact preview card (in-chat compact view) | Designed — Jul 2026 | Compact card in chat: name, Preview tag, mini pipeline, View details, Create CTA |
| Artifact full view (Business / Technical tabs) | Designed — Jul 2026 | Full workspace panel with Business (step list) and Technical (flow editor) tabs; Read-only until created |
| Agent entry point | Designed — Jul 2026 | Accessible from **any page** on the platform via persistent agent panel trigger |
| Blank / empty state | Designed — Jul 2026 | "How can I help you today, [Name]?" + 3 onboarding cards: Learn what you can do / Try sample prompts / Tips for better results |
| Artifact type recommendation | Designed — Jul 2026 | Agent classifies intent and recommends flow service vs. workflow with quick-action confirmation |
| Project selection | Designed — Jul 2026 | Agent surfaces recommended project inline; quick actions: use suggested / pick from all / create new |
| Clarification — multi-option | Designed — Jul 2026 | Quick action buttons for disambiguation (not free-text) |
| "Show reasoning" trace | Designed — Jul 2026 | Collapsible accordion showing agent reasoning steps on each response |
| Error handling and recovery | `[TODO]` | Agent errors, backend errors, ambiguous input |
| Settings and preferences | `[TODO]` | User-level settings applicable across capabilities |
| Session and context management | `[TODO]` | Starting new sessions, switching context |
| Capability navigation / switcher | `[TODO]` | How users switch between Integration, B2B, MFT, Monitoring |

> **Figma reference for all patterns above**: [IA \| DAF via Agent Q2FY2026 — 10 July and 11 July sections](https://www.figma.com/design/7Ap2ZwIfNFkuoOdRooOjmB/IA-%7C-DAF-via-Agent_Q2FY2026?node-id=4-17)
> **Workflow user journey reference**: 11 May — Integration Agent + Launch Pad section in the same file

> Update the status column as patterns are designed, aligned, and built.

---

## How Capability Designers Work With This Team

1. **Before designing a new interaction**: Check this file and the Figma pattern library to see if a pattern already exists
2. **If a pattern doesn't exist**: Bring it to the Agent Pattern team — don't solve it alone if it could be common
3. **If a pattern needs to be extended**: Propose the extension, get alignment before building capability-specific variation
4. **During design reviews**: Agent Pattern team (or lead) should review any screen that touches shared patterns

---

## Figma Pattern Library

- `[TODO: Add link to Agent Pattern Figma file or library]`
- `[TODO: Add link to shared component documentation]`

---

## Current State / Open Items

- [ ] `[TODO: Add primary contact — designer and PM leads on this team]`
- [ ] `[TODO: Complete status column in the patterns table above]`
- [ ] `[TODO: Add link to Figma pattern library]`
- [ ] `[TODO: List patterns that are aligned vs. still in progress]`
- [ ] `[TODO: Note any pattern decisions already made that capability designers must follow]`
