# Continuous Improvement - Fase 1

Status: ci-001 applied; remaining candidates proposal-only/backlog
Source: `planos/000-init-loki/retrospetivas/fase1/`
Date: 2026-06-30

## Intake

- Eligible retrospective files: 24.
- Adapter preflight: `tool_search` exposed `multi_agent_v1` and the `retrospective-digester` role, so fan-out was available in this Codex session.
- Fan-out used: 6 read-only `retrospective-digester` handoffs, grouped by 4 files each.
- Writes applied: this transient report only.
- Durable writes not applied: `docs/**`, `docs/index.xml`, `CLAUDE.md`, `AGENTS.md`, Loki package skills, commands, agents, templates, validators, manifest, and package docs.

## Local Checks

- `git rev-parse --is-inside-work-tree` returned `true`.
- `CLAUDE.md` still says this workspace is not a Git repository.
- `docs/loki-init/conflicts-and-decisions.md` already records the Git-state mismatch as an open conflict and says future agents must check current Git state directly.
- `find docs/loki-init -maxdepth 2 -type f | sort | xargs wc -l` measured `5817` total lines.
- Several `docs/loki-init/**/inventory.md` files are above 300 lines; the largest measured file is `docs/loki-init/technical-implementer/inventory.md` at 405 lines.
- `docs/loki-init/conflicts-and-decisions.md` already records major runtime/spec conflicts: Curva do Diabo MVP drift, timeout drift, plugin/no-plugin drift, crash audio drift, runtime validation pending, safe-only thresholds, language/copy drift, and `P_cena` visibility drift.

## Consolidated Candidates

### ci-001 - Split Current Loki Init Inventories

Classification: `format-friction`, severity `medium`, scope `project-specific`.

Source evidence:
- `feedback-granularidade-inventarios-retrospectiva.md` says the user approved content but rejected inventory granularity.
- Local line-count check measured `5817` lines under `docs/loki-init/**`, with several inventories at 300-405 lines.

Destination:
- Artifact type: `project-doc`.
- Target files: `docs/loki-init/**` plus `docs/index.xml` if the split is approved.
- Delegate: `catalogador`.

Root-cause learning:
- Required: `false`.
- Reason: the cause is already direct and local: files are too large for useful navigation, and the user explicitly corrected the granularity.

Action:
- `apply-approved-patch`.

Proposed change:
- Before: one long inventory file per agent folder.
- After: each oversized agent folder gets a local `index.md` and smaller topical files such as `source-map.md`, `facts.md`, `coverage-and-gaps.md`, and domain-specific sections only when the split is useful.

Required gates:
- `approval` for consumer docs edits.
- `catalogador` update to `docs/index.xml` in the same promotion.

Verification:
- Re-run file existence checks. Completed.
- Re-run line counts. Completed; no split target remains above 300 lines.
- Validate `docs/index.xml` paths. Completed.
- Validate split index local links. Completed.
- Spot-check that no facts were dropped during splitting. Pending human review if needed.

Residual risk:
- A mechanical split could duplicate content or make navigation worse without a local index pattern.

Applied files:
- `docs/loki-init/dialogue-editor/inventory.md` plus local section files.
- `docs/loki-init/game-designer/inventory.md` plus local section files.
- `docs/loki-init/gameplay-engineer/inventory.md` plus local section files.
- `docs/loki-init/runtime-qa/inventory.md` plus local section files.
- `docs/loki-init/scene-presentation-designer/presentation-inventory.md` plus local section files.
- `docs/loki-init/technical-artist/inventory.md` plus local section files.
- `docs/loki-init/technical-implementer/inventory.md` plus local section files.
- `docs/loki-init/ux-ui-designer/inventory.md` plus local section files.
- `docs/index.xml`.

### ci-002 - Keep Static Evidence Separate From Runtime Validation

Classification: `validation-gap`, severity `high`, scope `probable-universal` for RPG Maker MZ workflows and `project-specific` for Jhonny docs.

Source evidence:
- Repeated across runtime QA, technical implementer, technical artist, UX/UI, game design, level design, scene presentation, audio, narrative QA, and standards retrospectives.
- Static JSON/plugin/assets parsing was useful, but Playtest was not executed.
- Existing `Jhonny/CLAUDE.md` and `docs/loki-init/conflicts-and-decisions.md` already warn that runtime/perceptible behavior needs Playtest or human validation.

Destination:
- For this consumer: already mostly covered in `docs/loki-init/conflicts-and-decisions.md`, `docs/loki-init/project-inventory.md`, and `Jhonny/CLAUDE.md`.
- Reusable destination candidate: `loki-rpg-maker-mz-project-inventory` or `loki-rpg-maker-mz-data-json` skill guidance.

Root-cause learning:
- Required: `false` for this report.
- Reason: the repeated cause is clear and already reinforced by local durable docs: static structure does not prove engine, visual, input, audio, save/load, reachability, softlock, or UX behavior.

Action:
- `record-only` for consumer docs unless a concrete Playtest checklist task is approved.
- `propose-patch` for package skill only after `technical-review`.

Proposed change:
- Before: future agents might phrase parse-valid data as behavior-valid.
- After: every RMMZ inventory/analysis distinguishes `static evidence`, `runtime hypothesis`, and `human-validation required`.

Required gates:
- `human-validation` before runtime claims.
- `technical-review` + `approval` before package skill changes.

### ci-003 - Corrida Source Drift and Open Decisions

Classification: `missing-context`, severity `high`, scope `project-specific`.

Source evidence:
- Repeated conflicts: Curva do Diabo MVP versus full vision/runtime branches, timeout semantics, `P_cena` numeric visibility, plugin/no-plugin drift, language/copy drift, crash audio drift, safe-only thresholds, and unresolved narrative canon.
- Existing `docs/loki-init/conflicts-and-decisions.md` already records most of these as open.

Destination:
- `docs/loki-init/conflicts-and-decisions.md` and `docs/loki-init/open-questions.md` are the correct current surfaces.
- Future target docs may include `docs/02-Core-Loop/*` only after focused analysis and decisions.

Root-cause learning:
- Required: `true`.
- Automatic phase status: `blocked`.
- Reason: root cause depends on product/design decisions, source-of-truth review, and runtime/Playtest evidence. The retrospective set alone cannot resolve the conflicts.

Action:
- `record-only` now.
- Open or run focused `loki:tech-analysis` before any implementation plan touching corrida runtime, HUD/copy, timeout, Curva do Diabo, route reachability, audio, or balance.

Required gates:
- `human decision`.
- `technical-review`.
- `human-validation` for perceptible/runtime claims.
- `approval` for durable doc changes.

Minimum next path:
- Start from `docs/index.xml`.
- Read `docs/loki-init/conflicts-and-decisions.md`, `docs/loki-init/open-questions.md`, `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`, then `docs/02-Core-Loop/Corrida - Core Loop.md`.
- For runtime questions, inspect current `Jhonny/data/System.json`, `Jhonny/data/CommonEvents.json`, `Jhonny/js/plugins.js`, relevant `MapXXX.json`, and plugin source as scoped.

### ci-004 - RPG Maker MZ Inventory Procedure Improvements

Classification: `workflow-gap`, severity `medium`, scope `probable-universal`.

Source evidence:
- Multiple retrospectives found useful static inventory patterns:
  - Parse `System.json`, `CommonEvents.json`, `plugins.js`, and selected maps before trusting stale docs.
  - Aggregate map summaries before deep event reads.
  - Expand `command117` Common Event calls before summarizing ownership.
  - Separate bounds-valid from softlock-free.
  - Confirm primary RPG Maker data for runtime facts even when project routing docs exist.
  - For audio and pictures, cross-check event commands against assets without claiming playback or render validation.

Destination:
- Candidate skill updates: `loki-rpg-maker-mz-project-inventory`, `loki-rpg-maker-mz-data-json`, possibly a later validator/checklist.

Root-cause learning:
- Required: `true`.
- Automatic phase status: `blocked`.
- Reason: the pattern is repeated but still comes from one consumer project. It needs technical review against existing RMMZ skills to avoid duplication.

Action:
- `propose-patch` only after package `technical-review`.

Required gates:
- `technical-review`.
- `approval`.

Before/after:
- Before: each agent can reinvent RMMZ inventory scripts and over-read noisy map/event files.
- After: a skill-level preflight tells agents to start with structured summaries, expand CE calls, and state validation boundaries.

### ci-005 - Respect Exact Handoff Allowed Sources Before Exploration

Classification: `scope-waste`, severity `medium`, scope `probable-universal`.

Source evidence:
- Technical artist, UX/UI, level design, gameplay and related retrospectives reported tension between broad RPG Maker skill expectations and narrow handoff source envelopes.
- Some reads went outside enumerated sources, even when not used as final evidence.

Destination:
- Candidate package skill/command/template guidance.
- Likely surfaces: init handoff template, `loki-run-plan-execution`, or agent envelope guidance, not consumer docs.

Root-cause learning:
- Required: `true`.
- Automatic phase status: `blocked`.
- Reason: final destination depends on package contract review: this could belong in command orchestration, agent envelope format, or a reusable skill.

Action:
- `propose-patch` only after package `technical-review`.

Proposed change:
- Before: agent opens broad discovery paths from a domain skill even when the handoff listed exact allowed sources.
- After: before any exploratory command, agent copies `allowed_sources` into a local checklist and classifies every read as `allowed`, `derived from allowed source`, or `requires orchestrator approval`.

Required gates:
- `technical-review`.
- `approval`.

### ci-006 - Historical Scripts Are Evidence, Not Current Toolbox

Classification: `safety-gate-friction`, severity `medium`, scope `project-specific` now and `probable-universal` for script preflight.

Source evidence:
- Tools pipeline and source researcher retrospectives found many historical Python scripts under `Jhonny/planos/**`.
- Names like audit/validate do not guarantee read-only behavior.
- Some scripts write reports or patch runtime JSON.
- Existing `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md` already documents the project-specific procedure.

Destination:
- Consumer docs: already substantially covered in `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md`.
- Candidate reusable destination: RMMZ data JSON skill or a validator/checklist for script mutator preflight.

Root-cause learning:
- Required: `true` for package promotion.
- Automatic phase status: `blocked`.
- Reason: package change needs review of existing skills and a concrete validator shape.

Action:
- `record-only` for consumer docs.
- `propose-patch` later for package skill/validator if repeated outside this project.

Before/after:
- Before: a future agent may run a historical script because it has a safe-sounding filename.
- After: future agents classify script writes first by scanning for write APIs and target paths, then require approval before execution.

Required gates:
- `approval` before executing or adapting historical mutators.
- `technical-review` + `approval` before package skill or validator changes.

### ci-007 - Index Freshness and Filesystem Preflight

Classification: `source-friction`, severity `medium`, scope `project-specific` with reusable validator potential.

Source evidence:
- Catalogador retrospective recorded stale `docs/index.xml` entries for old init paths.
- Local docs now contain current `docs/loki-init/<agent>/...` folders.
- `docs/loki-init/conflicts-and-decisions.md` records stale prior index/docs as resolved for catalog navigation.

Destination:
- Current consumer docs: record-only, because catalogador already fixed the immediate issue.
- Candidate validator: compare `docs/index.xml` paths against filesystem.

Root-cause learning:
- Required: `false` for consumer record.
- Required: `true` for reusable validator only if more evidence appears.

Action:
- `record-only`.

Minimum next path:
- If docs are restructured, validate XML parse and every cataloged path.
- Update `docs/index.xml` in the same approved patch.

### ci-008 - Package Policy Candidates Need Separate Review

Classification: `safety-gate-friction`, severity `medium`, scope `probable-universal`.

Source evidence:
- Standards curator retrospective reinforced that single-consumer init evidence must not become Loki package policy automatically.
- Candidate package topics appeared: core tag versus project type, package contract source location, allowed-source envelope discipline, directory precreation, and historical script policy.

Destination:
- Backlog/package review, not direct package edits.

Root-cause learning:
- Required: `true`.
- Automatic phase status: `blocked`.
- Reason: package policy changes require a dedicated technical review against package docs, manifest, existing commands, skills, agents, templates, and validators.

Action:
- `backlog`.

Required gates:
- `technical-review`.
- `approval`.

### ci-009 - Shell Quoting Friction

Classification: `tool-friction`, severity `low`, scope `universal`.

Source evidence:
- `rg` pattern containing Markdown backticks caused zsh parsing issues.
- `node -e` with `${}` or `$plugins` under double quotes caused shell expansion problems; single quotes or heredoc fixed it.

Destination:
- Record-only unless it recurs in a skill-editing context.

Root-cause learning:
- Required: `false`.

Action:
- `record-only`.

Minimum next path:
- Use single quotes for shell patterns containing Markdown backticks.
- Use `node - <<'NODE'` for snippets containing `$`, `${}`, or RPG Maker `plugins.js` globals.

## Backlog

- Approved split plan for `docs/loki-init/**`, including per-folder local indexes and path validation.
- Focused `loki:tech-analysis` for corrida runtime/spec drift before runtime edits.
- Route matrix and narrative canon analysis including `Roleta Paulista`, selected maps, `System.json`, `CommonEvents.json`, and Playtest gate.
- UX/HUD/copy analysis for `P_cena` numeric visibility and language/copy drift.
- Audio analysis for crash/result cues before claiming runtime behavior.
- Optional read-only validators:
  - `docs/index.xml` path validator.
  - RMMZ Show Picture asset-reference cross-check.
  - Historical script read/write classifier.
  - Runtime QA minimum source checklist.

## Stop Conditions

- Do not update consumer docs without approval.
- Do not update package skills, commands, agents, templates, validators, docs, or manifest without `technical-review` and approval.
- Do not resolve Curva do Diabo, timeout, `P_cena`, route reachability, language/copy, audio, balance, or runtime behavior from retrospectives alone.
- Do not treat static JSON, plugin config, asset existence, or map bounds as Playtest evidence.
