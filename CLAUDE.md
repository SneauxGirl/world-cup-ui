@AGENTS.md

## Additional Safety Overrides

- Apply all safety rules from `AGENTS.md` to every task.
- Never use destructive git commands or delete files/directories without explicit approval in the immediately preceding user message.
- If user asks to "undo", "revert", "reset", "clean up", or "remove", ask clarifying questions and propose safe alternatives first.

## Persistent Design Preferences

- Layout priority: use Flexbox first, then Grid, and use absolute positioning only when absolutely necessary.
- Design responsively by default.
- Design accessibly by default: semantic markup, needed ARIA attributes, proper heading structure, and keyboard/focus/tab support.
- Nav menus implemented as lists: default **`margin: 0`** and **`padding: 0`** on the `<ul>` / `<ol>` (see `AGENTS.md`) unless spacing is explicitly specified otherwise.
- Avoid unintended keyboard traps; intentional modal focus trapping while a modal is open is required.
- Prefer CSS variables/tokens over hardcoded styling values.
- Call out hardcoded values that should likely be promoted to variables.
- Use icons (SVG / icon components / assets), not Unicode emoji, in UI unless the user explicitly requests emoji in that text.
- Do not use `transform: scale()` for layout or sizing unless the user explicitly requests it (see `AGENTS.md` -- scale does not expand layout bounds and causes overlap).
- Fonts: do not use Geist; default to **Finlandica** (body/UI) and **Alumni Sans** (`h1`–`h6`) per `AGENTS.md`.
- When removing UI, also remove related styles, imports, links, and copy keys per `AGENTS.md` (no orphaned CSS or dead references).
