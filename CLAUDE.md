# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is **not a software project** — it is a personal AI-agent workspace. There is no application to build, lint, test, or run. The repo holds:

1. **Obsidian vault** at `docs/` — Zettelkasten-lite notes (`00-Inbox/`, `01-Notes/`, `99-Meta/templates/`). Open it in Obsidian via *Open folder as vault* → `docs/`.
2. **Claude Code configuration** at `.claude/` — agents, slash commands, rules, skills, templates, scripts, settings.
3. **AgentOps-style session artifacts** at `.agents/` — handoffs, environment, logs, learnings, plans.

Treat the workspace as a config root, not a codebase. Most "work" here is reading/editing markdown, JSON, YAML inside these three trees.

## Project routing: `Jhonny/`

`Jhonny/` is an exception to the workspace-level "not a software project" rule: it is a real RPG Maker MZ game project. When a task targets `Jhonny/`, follow `Jhonny/CLAUDE.md` first and treat that folder as the project root.

For RPG Maker MZ work, prefer loading the matching skill before implementation:
- `rpg-maker-mz-data-json` for edits to `data/*.json`, Database IDs, switches, variables, Common Events, and RPG Maker command lists.
- `rpg-maker-mz-plugin-workflow` for creating or editing plugins under `js/plugins/`.

Keep project-specific conventions in `Jhonny/CLAUDE.md` rather than in global skills. Use skills for RPG Maker MZ mechanics that would apply across projects.

## Critical: `.agents/` is deny-by-default

`.agents/.gitignore` is `*` with only itself allowed. **Never stage, commit, or copy artifacts from `.agents/`** into git history or other directories. Session handoffs, logs, environment snapshots, learnings, and plans under `.agents/` are ephemeral and local-only.

## Git state

The repo is **currently not a git repository** (no `.git/`). If initializing/committing later, follow the global `~/.claude/CLAUDE.md`:
- Author: `Edney <edney_reis999@hotmail.com>`
- **Never add `Co-authored-by` lines** (no Claude attribution, no exceptions).
- Use Conventional Commits format.

## Settings & environment

- `.claude/settings.json` — shared config. Points the Anthropic client at the **z.ai GLM proxy** (`ANTHROPIC_BASE_URL=https://api.z.ai/api/anthropic`): opus/sonnet → `glm-5.1`, haiku → `glm-4.5-air`. Hooks run `bd prime` on `SessionStart` and `PreCompact` (refreshes the beads dependency graph).
- `.claude/settings.local.json` — local allowlist of pre-approved bash permissions (`npm test/run`, `rg`, `find`, `grep`, `npx eslint/tsc`, `python3 *`, `bd memories *`, plus the `sequential-thinking` and `context7` MCP tools). Don't move these to shared settings without reason.
- `.claude/ativa-glm.md` — instructions to add GLM env vars to `settings.local.json` (a one-off note, not a live config file).
- `skills-lock.json` — pinned skill sources. Currently locks `pptx` from `anthropics/skills` on GitHub. Other skills under `.claude/skills/` are local (not locked).

## MCP servers available

- **serena** — semantic code navigation (`find_symbol`, `find_referencing_symbols`, `get_symbols_overview`). For real codebases only.
- **pal** — multi-model chat/council/consensus/thinkdeep/debug/codereview. When the user names a model, pass it through verbatim.
- **perplexity** — `perplexity_ask` (quick cited answers), `perplexity_reason` (step-by-step), `perplexity_research` (slow multi-source), `perplexity_search` (URL list).
- **context7** — current library/framework docs. Use for any library question, even familiar ones (training data may be stale). Resolve library ID first, then query.
- **chrome-devtools / playwright / claude-in-chrome** — browser automation (three alternatives; pick what the task needs).

## Skills-First pattern (load-bearing convention)

Agents in `.claude/agents/` are explicitly instructed to **invoke skills via the `Skill` tool rather than re-derive domain knowledge**. When implementing anything that touches a skill's domain (NestJS, Next.js, PixiJS, TypeScript, tests, git commits, RPG Maker MZ), invoke the matching skill first.

Skill families under `.claude/skills/`:
- **Process / standards**: `standards` (library tier — loaded by other skills), `shared`, `git-commit-helper`, `task-onboarding`, `post-mortem`, `council`, `find-skills`, `skill-creator`, `skill-description-generator`.
- **Backend**: `nestjs-architect`, `docker-nestjs-dev`, `MODE_Backend_TDD`, `fakebuilder-generator`, plus test-layer skills (`test-core-layer`, `test-service-layer`, `test-controller-layer`, `test-integration`, `test-e2e-playwright`) and `test-orchestrator`.
- **Frontend**: `nextjs-architect`, `typescript-expert`, `react-electron-code-health`, plus the full `pixijs-*` family (v8).
- **RPG Maker MZ ("Daratrine")**: `brainstorm-character`, `notetag-filler`, `visustella-analyst`, `state-tooltip-generator`, `skill-description-generator`.
- **RPG Maker MZ project workflow**: `rpg-maker-mz-data-json`, `rpg-maker-mz-plugin-workflow`.
- **Tracker**: `beads` (graph-based issue tracker via the `bd` CLI — pairs with the `bd prime` hook).
- **External**: `pptx` (locked via `skills-lock.json`).

Each skill has its own `SKILL.md` with frontmatter declaring tier, dependencies, and output contract. Library-tier skills (`standards`, `shared`, `beads`) are loaded by other skills, not used standalone.

## Slash commands

Namespaced under `.claude/commands/`:
- **`zord:*`** — software-dev process: `criar-prd`, `criar-fdd`, `hld-generator`, `generate-technical-analysis`, `generate-action-plan`, `run-plan`, `enrich-tasks`, `catalogar`, `catalogar-doc-tecnica`, `code-health`, `doc-trace`, `entrevistador`, `prompt-otimizer`, `test-diagnose`, `test-health`, `troubleshoot`. These produce artifacts that belong in feature folders (PRD → TechSpec → HLD → tasks-xml → execution).
- **`loki:*`** — RPG Maker MZ / Daratrine: `brainstorm-phase-1-create-boss`, `brainstorm-phase-2-detail-boss`, `criar-nsd`, `tech-analysis`, `implementar-enemy`, `ai-enemy-optimizer`, `action-sequence-generator`, `visustella-add-postmortem`.

## Templates

`.claude/templates/` holds XML/markdown skeletons the slash commands render against: `prd` (via command), `techspec-template.xml`, `nsd-template.xml`, `nsd-technical-analysis-template.xml`, `base-action-sequence-template-v2.xml`, `task-template.md`, `tasks-template.md`, `task-xml-template.xml`, `tasks-xml-template.xml`, `task-completeness-model.xml`, `analysis-export-template.xml`.

## Coding rules (`.claude/rules/basci-rules.json`)

Apply these whenever writing or reviewing code in any project rooted here:
- **Language**: identifiers, error messages, and logs in English (no mixed idioms like `getUsuarioName`).
- **Naming**: `camelCase` for methods/functions/vars, `PascalCase` for classes/interfaces, `kebab-case` for files/dirs. Booleans start with `is/has/can/should/was`. Names ≤ 30 chars, no abbreviations.
- **Functions**: ≤ 50 lines, single responsibility, ≤ 3 params (else use a typed options object), no boolean flag params, no side effects in queries, declare variables near use.
- **Control flow**: ≤ 2 nesting levels (prefer early return), avoid `else` when return is clearer, don't use try/catch for normal flow.
- **Classes**: ≤ 300 lines, prefer composition over inheritance, apply DIP at use cases and interface adapters, constructors do no I/O, no exposed mutable state.
- **TypeScript**: `any` is banned (use `unknown` + narrowing), avoid `as` and `!`, prefer discriminated unions, validate external input at runtime before it enters the core.
- **Immutability**: `const` by default, never mutate function params or shared arrays/objects.
- **Imports**: external → internal → relative; avoid barrel `index.ts` if it creates cycles.
- **Logging**: `winston` only — **no `console.log`/`console.error`**, no sensitive data (names, addresses, cards, tokens), structured objects with consistent context (`requestId`, `userId`, `orgId`).
- **Async**: don't mix `.then/.catch` with `async/await`, avoid `forEach(async ...)` (use `for..of` or `Promise.all`), no fire-and-forget without explicit tracking.
- **Errors**: never swallow exceptions; log + rethrow or translate to a domain error.
- **Comments**: default to none. Comment only non-obvious contracts/decisions (in JSDoc). No comments inside function bodies, no blank lines inside methods.
- **Tests**: every bug fix gets a regression test that would have failed before. Test behavior, not implementation. Never disable lint rules without justification and scoped `eslint-disable-next-line`.
- **Magic numbers**: extract to named constants.

## Agents (`.claude/agents/`)

Subagents available via the Agent tool, each scoped to a role:
- `backend-nestjs-developer`, `frontend-nextjs-developer`, `typescript-pro`, `prompt-engineer` — implementation, skills-first.
- `nestjs`/`react-electron`/`test-e2e` analysts: `implementation-analyzer`, `test-analyzer`, `techspec-generator`, `test-orchestrator`.
- `Software Engineer` (CTO-facing reviewer, opus-tier), `Plan` (architect), `Explore` (fast read-only search), `general-purpose`, `claude-code-guide`, `statusline-setup`.
- Domain: `bibliotecario` + `catalogador` (doc-index navigation), `agentops:code-reviewer`, `agentops:researcher`.

## Obsidian vault editing

When editing `.md` files under `docs/` (or when the user mentions wikilinks, callouts, frontmatter, embeds, bases, or canvas): prefer the `obsidian-markdown`, `obsidian-cli`, `obsidian-bases`, and `json-canvas` skills over hand-rolling syntax. The vault uses prefix-ordered folders (`00-` to `99-`) for alphabetic ordering — match the existing convention when adding folders.
