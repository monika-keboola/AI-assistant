# Product Requirements Document (PRD)

## Keboola AI Assistant - In-Platform Chat Prototype
**Version:** 1.0  
**Date:** 2025-03-01

---

## 1. Product Overview

The Keboola AI Assistant is a **context-aware chat assistant embedded into the Keboola platform**, designed to:

- Guide users through onboarding and flow creation.
- Provide contextual help, documentation links, and example configurations.
- Assist with error troubleshooting and flow optimization.
- Adapt to different user roles (new vs experienced).

---

## 2. Goals & Objectives

- Improve **onboarding and first-time user experience**.
- Increase **successful flow creation rates**.
- Reduce support requests by **surfacing help contextually**.
- Improve **visibility into AI-driven flow creation steps**.
- Provide **flexible, non-intrusive UI behavior**.

---

## 3. Target Users

| Role               | Needs                                                                 |
|-------------------|------------------------------------------------------------------------|
| Data Engineers    | Rapid flow creation, reuse existing components, inline error checks   |
| Business Analysts | Simple guidance for no-code flow setup, plain language help           |
| New Users         | Onboarding assistance, discoverability of features, contextual docs   |

---

## 4. Key Features & Requirements

### 4.1 Floating, Draggable AI Chat

| Feature              | Description |
|---------------------|-------------|
| Default Position     | Bottom-right corner |
| Modes                | Collapsed bubble, Small floating chat, Full right-side panel |
| Dragging             | Move to any corner (top-right, top-left, bottom-right, bottom-left) |
| Resizing             | Small (default), Medium (side panel), Large (wide side panel) views |
| Resize Handle        | Visible corner handle for user-initiated resizing |
| Collapse Option      | Minimizes to circular chat bubble with AI icon |
| Persistent Position  | Remembers position & size per session |
| Snap-to-Corner       | When dragged near a corner, assistant snaps into place |
| Smooth Transitions   | All resizing, collapsing, and dragging animations occur within 200-300ms for fluid interaction |

#### Resizing and Dragging Behaviour
- Users can **drag the assistant window** to any corner of the screen.
- When dragged close to any screen edge, the assistant automatically **snaps** into place (ensuring consistent alignment).
- Users can **resize the assistant** by dragging the lower-right corner, smoothly transitioning between:
    - Small chat window (approx. 400px wide)
    - Medium side panel (30% of screen width)
    - Large side panel (50% of screen width)
- Assistant **remembers the last position and size** for the session, persisting across screen refreshes and navigation events.
- Collapsing reduces the assistant to a **floating circular button** that stays visible and can be dragged to any part of the screen.
- When **expanding from collapsed state**, the assistant **returns to its last size and position**.

#### Visual Style
- **Colors:** Light gray background for chat window, with Keboola’s primary blue for headers, buttons, and active elements.
- **Typography:** Uses Keboola’s standard sans-serif font (consistent with platform UI).
- **Message Bubbles:**
    - AI Messages: White background, rounded corners, light gray outline.
    - User Messages: Blue background, white text, rounded corners.
- **Icons:** Minimal icons for actions (close, expand, collapse), using simple line-based designs matching Keboola’s visual language.
- **Buttons:** Rounded corners, blue primary action buttons, light gray secondary buttons.
- **Links:** Inline links in chat responses underlined and blue, matching Keboola’s hyperlink style.
- **Animations:** Subtle fade-in/fade-out for messages, smooth sliding transitions when resizing or expanding the assistant.

---

### 4.2 Context-Aware Guidance

| Feature              | Description |
|---------------------|-------------|
| Context Detection    | Detects user screen (Flow Builder, Transformations, Component Config) |
| Contextual Prompts   | Suggests help tailored to user action (e.g., "Need help mapping inputs?") |
| Dynamic Links        | Direct links to relevant documentation |
| Inline Examples      | Provides sample configurations for transformations, mapping, etc. |

---

### 4.3 Inline Tips & Visual Cues on Canvas

| Feature              | Description |
|---------------------|-------------|
| Component Tips       | Inline guidance when adding or editing components |
| Connector Tips       | Explanation of data flow between components |
| Hover Hints          | Persistent tooltips on hover |
| AI Origin Badge      | "AI Suggested" label on AI-generated components |
| Animated Highlights  | Pulsing or flashing effect when AI adds/edits a component |

---

### 4.4 Persistent Chat History (Per Project/Flow)

| Feature              | Description |
|---------------------|-------------|
| History Per Project  | Each project/flow gets its own history |
| Timeline View        | Timestamped conversation log |
| Searchable           | Search by keyword (table name, transformation type) |
| Decision Log         | Automatically summarizes key decisions |
| Export               | Export conversation to Markdown, PDF |

---

### 4.5 Step Indicator & Progress Control

| Feature              | Description |
|---------------------|-------------|
| Visual Progress      | Horizontal or vertical progress bar showing flow creation steps |
| Step Highlights      | Current step highlighted |
| Completed Steps      | Checkmarks for completed steps |
| Backtracking         | Click to return to previous step |
| Final Review         | Confirmation screen summarizing flow |

---

### 4.6 Error Handling & Inline Debugging

| Feature              | Description |
|---------------------|-------------|
| Pre-run Validation   | Check configurations before running |
| Inline Warnings      | Errors shown within assistant + component itself |
| Suggested Fixes      | AI provides specific fixes with links to relevant settings |
| Retry Guidance       | AI confirms fixes and offers to re-run |

---

## 5. UX Flow Example

### 5.1 Example - Flow Creation Journey

| Step | Action                           | Assistant Behavior                                   |
|-----|----------------------------------|----------------------------------------------------|
| 1   | User opens Flow Builder         | AI Assistant opens, offers "Need help creating your flow?" |
| 2   | User accepts help                | AI starts **step-by-step flow setup**               |
| 3   | Select Data Source               | AI highlights data source block, suggests tables    |
| 4   | Configure Mapping                | Inline tips explain input/output mapping            |
| 5   | Add Transformation               | AI recommends transformations, offers examples      |
| 6   | Select Destination               | AI suggests optimal destinations                    |
| 7   | Review & Confirm                  | AI lists all configured steps for review            |
| 8   | Run & Monitor                     | AI provides live status, catches errors inline      |

---

### 5.2 Example - Error Handling Journey

| Step | Action                | Assistant Behavior                                                |
|-----|------------------|------------------------------------------------------------------|
| 1   | User runs flow       | Flow fails                                                        |
| 2   | Error Detected      | AI opens automatically with: “There was an error. Let’s debug.” |
| 3   | Error Analysis     | AI pulls relevant logs, suggests common fixes                       |
| 4   | Inline Fix Links   | Direct links to configuration points                                 |
| 5   | Retry Guidance    | AI confirms fixes and offers to re-run                               |

