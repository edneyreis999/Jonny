# Loki Init - Agent Fan-out Plan

Data: 2026-06-30
Orquestrador: main
Adapter: Codex with `multi_agent_v1`

## Preflight

- Capability discovery: `tool_search` for multi-agent/subagent/delegation tools.
- Compatible tool namespace found: `multi_agent_v1`.
- Adapter role evidence: `multi_agent_v1.spawn_agent` exposes Loki roles for
  the required agents.
- Installed consumer adapter files checked: `.agents/agents`, `.codex/agents`,
  `agents` and `codex/agents` were absent or empty in this project.
- Catalog source: `/Users/edney/projects/coreto/loki-framework/manifest.yaml`.
- Supported project types: `game-dev`, `software-development`.
- Selected project type: `game-dev`.
- Base tag: `core`.
- Selection rule: ordered union of agents tagged `core` plus agents tagged
  `game-dev`, with no duplicates.
- Batch ceiling: 6, using the documented default because no lower
  `agents.max_threads` value was found.
- Inventory contract source:
  `/Users/edney/projects/coreto/loki-framework/docs/loki-init-inventory-contracts.md`.

## Init classes

`init_inventory_domain_writer`:

- `runtime-qa`
- `technical-implementer`
- `game-product-owner`
- `game-business-analyst`
- `game-designer`
- `narrative-designer`
- `ux-ui-designer`
- `gameplay-engineer`
- `narrative-qa`
- `level-designer`
- `balance-economy-designer`
- `branching-narrative-designer`
- `scene-presentation-designer`
- `audio-designer`
- `quest-content-designer`
- `dialogue-editor`
- `tools-pipeline-engineer`
- `technical-artist`

`init_support_only`:

- `standards-curator`
- `retrospective-digester`
- `execution-context-reader`
- `source-researcher`
- `bibliotecario`

`init_final_cataloger`:

- `catalogador`

## Allowed write envelopes

Every invoked `init_inventory_domain_writer` receives:

- `target_inventory_dir`: `docs/loki-init/<agent-name>/`
- `target_retrospective`:
  `planos/000-init-loki/retrospetivas/fase1/<agent-name>-retrospectiva.md`
- allowed writes:
  - `docs/loki-init/<agent-name>/**`
  - exact own `target_retrospective`

Every invoked `init_support_only` receives no `target_inventory_dir` and may
write only its own exact `target_retrospective`.

`catalogador` runs once after domain inventory validation. It receives validated
domain inventory folders as sources, exact cataloging destinations, and its own
exact `target_retrospective`.

## Planned batches

- Batch 1 support/domain mix: `standards-curator`, `retrospective-digester`,
  `runtime-qa`, `execution-context-reader`, `source-researcher`,
  `technical-implementer`.
- Batch 2 domain: `game-product-owner`, `game-business-analyst`,
  `game-designer`, `narrative-designer`, `ux-ui-designer`,
  `gameplay-engineer`.
- Batch 3 domain: `narrative-qa`, `level-designer`,
  `balance-economy-designer`, `branching-narrative-designer`,
  `scene-presentation-designer`, `audio-designer`.
- Batch 4 domain: `quest-content-designer`, `dialogue-editor`,
  `tools-pipeline-engineer`, `technical-artist`.
- Serial final: `catalogador`, only after domain inventory validation.

## Required source packet

Agents may read:

- `docs/loki-init/project-inventory.md`
- `docs/loki-init/technology-context.md`
- `docs/index.xml`
- `docs/02-Core-Loop/Corrida - Core Loop.md`
- `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`
- `docs/03-Tech/RPG Maker MZ - Debug Playtest.md`
- `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md`
- relevant read-only files under `Jhonny/**`, without editing them
- the package inventory contract listed above

Agents must not write outside their exact allowed writes.

## Retrospective requirement

Every invoked agent must run the substance of `loki:retrospectiva-tecnica`
before completion and write its own retrospective with:

- objective, result and status;
- artifacts written, consulted or blocked;
- validations made and not made;
- execution frictions and useful or bad inferences;
- residual risks and minimum next path.
