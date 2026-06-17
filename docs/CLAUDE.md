# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this directory is

This is an **Obsidian vault** (open it via *Open folder as vault* → this `docs/` folder). There is no application here — only Markdown notes, canvases, and bases owned by the user. Treat it as a knowledge base, not a codebase.

## CRITICAL: Always load Obsidian skills before touching files

**Before creating, editing, renaming, moving, or deleting ANY file inside `docs/`** (`.md`, `.canvas`, `.base`, or anything under `.obsidian/`), you MUST first invoke the relevant Obsidian skill(s) via the `Skill` tool. Do not hand-roll syntax. Do not rely on memory of Obsidian conventions. Load the skill, then act.

| Action                                          | Skill to invoke first                       |
| ----------------------------------------------- | ------------------------------------------- |
| Create / edit / delete a `.md` note             | `obsidian-markdown` (then `obsidian-cli`)   |
| Any vault operation via CLI (read, create, search, move, rename, manage properties, tags) | `obsidian-cli` |
| Create / edit a `.base` file (table/card views, filters, formulas) | `obsidian-bases`                            |
| Create / edit a `.canvas` file (nodes, edges, groups) | `json-canvas`                               |
| Diagrams inside notes                           | `obsidian-visual-skills:mermaid-visualizer` or `obsidian-visual-skills:excalidraw-diagram` |
| Canvas built from notes                         | `obsidian-visual-skills:obsidian-canvas-creator` |

**Why:** Obsidian Flavored Markdown differs from CommonMark (wikilinks `[[...]]`, embeds `![[...]]`, callouts `> [!note]`, frontmatter properties, tag inheritance). The skills encode the current, correct syntax; guessing produces broken links, malformed frontmatter, or corrupt canvases/bases that Obsidian will refuse to open.

**How to apply:** The trigger is *any* write operation under `docs/`. Even a one-line typo fix in a `.md` should be preceded by `obsidian-markdown` if you are not 100% sure of the syntax around it. When in doubt, load the skill.

## Vault conventions

### Folder structure — prefix ordering is load-bearing

Folders use **numeric prefixes** (`00-`, `01-`, `02-`, … `99-`) so Obsidian's file explorer sorts them in a deliberate order, not alphabetically by name. When creating a new top-level folder:

- Pick the next free prefix that reflects intended ordering (e.g., `00-Inbox/` lands first, `99-Meta/` lands last).
- Never create an unprefixed folder at the root of the vault.
- Match the existing prefix style (two digits, dash, PascalCase or Title Case).

Current top-level layout:

- `01-Notes/` — permanent, curated notes. Each topic gets its own subfolder (e.g., `01-Notes/Roleta Paulista/`) holding the main note plus sibling artifacts (pitch deck, art direction, inspiration).
- `02-Core-Loop/` — reserved for the project's core-loop design notes (currently empty).
- `.obsidian/` — vault config. **Do not edit `workspace.json`** (it is machine state, rewritten on every Obsidian launch). Other files (`app.json`, `appearance.json`, `core-plugins.json`, community plugin configs) may be edited when intentionally changing vault settings.

### Note anatomy (follow the existing pattern)

Notes in this vault use YAML frontmatter with these conventions (see `01-Notes/Roleta Paulista/Roleta Paulista.md` for the canonical example):

- `title` — human-readable, often with a version suffix (`"Roleta Paulista — Pitch v2"`).
- Free-form metadata keys use **snake_case** (`gamejam`, `theme_interpretation`, `pivo_v2`) — not camelCase. This project's global code rules use camelCase for *code*; vault metadata uses snake_case to keep frontmatter readable and grep-friendly.
- `tags` — kebab-case, lowercased (`rpg-maker-mz`, `visual-novel`, `saude-mental`).
- A single H1 (`# Title`) opens the body.
- Long notes use `---` horizontal rules to separate major sections.

### Wikilinks and embeds

- Link to other notes with `[[Note Name]]` (Obsidian resolves by basename, no path or `.md` needed).
- Embed another note or image with `![[Note Name]]` or `![[image.png]]`.
- Use wikilinks **preferentially** over `[label](relative/path.md)` Markdown links — they survive renames and show up in the graph view / backlinks.

### Binary artifacts inside the vault

Pitch decks (`.pptx`), images, and other binaries are first-class citizens of a topic subfolder — keep them next to the note that references them (e.g., `Roleta Paulista/Roleta Paulista - Pitch.pptx` lives beside `Roleta Paulista.md`). When a `.pptx` needs to be created or modified, invoke the `pptx` skill.

### Enabled Obsidian features (from `.obsidian/core-plugins.json`)

These are ON: `bases`, `canvas`, `templates`, `daily-notes`, `bookmarks`, `properties`, `tag-pane`, `backlink`, `outgoing-link`, `graph`, `sync`. Use them. Notably:

- **Bases (.base)** — preferred over hand-maintained tables for cross-note views (e.g., "all pitches by status").
- **Canvas (.canvas)** — preferred over Mermaid for free-form spatial layout, mood boards, relationship maps.
- **Templates** — when adding a reusable note shape, place it under a `99-Meta/templates/` folder (the convention in the parent workspace) and register it as a template folder in Obsidian settings before referencing it.

## Things that do NOT belong here

- Session artifacts, handoffs, plans, logs — those live in `.agents/` at the project root and are gitignored. Do not create a `.agents/` inside `docs/` (if one exists from a sub-agent, treat it as ephemeral scratch).
- Source code, build output, dependencies.
