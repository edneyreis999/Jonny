# Loki Init - Agent Fan-out Plan

Data: 2026-06-30  
Orquestrador: main  
Adapter: Codex with `multi_agent_v1`

## Preflight

- Capability discovery: `tool_search` for multi-agent/subagent/delegation tools.
- Compatible tool namespace found: `multi_agent_v1`.
- Adapter role evidence: `multi_agent_v1.spawn_agent` roles and symlinks under `.agents/agents/*.md` and `.codex/agents/*.toml`.
- Catalog source: `/Users/edney/projects/coreto/loki-framework/manifest.yaml`.
- Supported project types: `game-dev`, `software-development`.
- Selected project type: `game-dev`.
- Base tag: `core`.
- Selection rule: ordered union of agents tagged `core` plus agents tagged `game-dev`, with no duplicates.
- Batch ceiling: 6, using the documented default when no lower `agents.max_threads` is known.
- Write mode: selected agents are read-only/proposal-only. The orchestrator writes final documents, inventories and retrospectives.
- Retrospective limitation: direct per-agent writes are not used because file-specific write restrictions are not enforceable through the current agent prompt alone; each agent returns a `RETROSPECTIVE_HANDOFF`.

## Inventory Required

| Agent | Tags | Reason | Target document | Target inventory | Target retrospective |
| --- | --- | --- | --- | --- | --- |
| `standards-curator` | `core` | Base inventory agent from manifest. | `docs/loki-init/standards-curator-context.md` | `docs/loki-init/inventories/standards-curator-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/standards-curator-retrospectiva.md` |
| `retrospective-digester` | `core` | Base inventory agent from manifest. | `docs/loki-init/retrospective-digester-context.md` | `docs/loki-init/inventories/retrospective-digester-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/retrospective-digester-retrospectiva.md` |
| `runtime-qa` | `core` | Base inventory agent from manifest. | `docs/loki-init/runtime-qa-context.md` | `docs/loki-init/inventories/runtime-qa-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/runtime-qa-retrospectiva.md` |
| `execution-context-reader` | `core` | Base inventory agent from manifest. | `docs/loki-init/execution-context-reader-context.md` | `docs/loki-init/inventories/execution-context-reader-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/execution-context-reader-retrospectiva.md` |
| `source-researcher` | `core` | Base inventory agent from manifest. | `docs/loki-init/source-researcher-context.md` | `docs/loki-init/inventories/source-researcher-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/source-researcher-retrospectiva.md` |
| `technical-implementer` | `core` | Base inventory agent from manifest. | `docs/loki-init/technical-implementer-context.md` | `docs/loki-init/inventories/technical-implementer-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/technical-implementer-retrospectiva.md` |
| `bibliotecario` | `core` | Base inventory agent from manifest. | `docs/loki-init/bibliotecario-context.md` | `docs/loki-init/inventories/bibliotecario-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/bibliotecario-retrospectiva.md` |
| `catalogador` | `core` | Base inventory agent from manifest. | `docs/loki-init/catalogador-context.md` | `docs/loki-init/inventories/catalogador-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/catalogador-retrospectiva.md` |
| `game-product-owner` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/game-product-owner-context.md` | `docs/loki-init/inventories/game-product-owner-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/game-product-owner-retrospectiva.md` |
| `game-business-analyst` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/game-business-analyst-context.md` | `docs/loki-init/inventories/game-business-analyst-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/game-business-analyst-retrospectiva.md` |
| `game-designer` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/game-designer-context.md` | `docs/loki-init/inventories/game-designer-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/game-designer-retrospectiva.md` |
| `narrative-designer` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/narrative-designer-context.md` | `docs/loki-init/inventories/narrative-designer-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/narrative-designer-retrospectiva.md` |
| `ux-ui-designer` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/ux-ui-designer-context.md` | `docs/loki-init/inventories/ux-ui-designer-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/ux-ui-designer-retrospectiva.md` |
| `gameplay-engineer` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/gameplay-engineer-context.md` | `docs/loki-init/inventories/gameplay-engineer-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/gameplay-engineer-retrospectiva.md` |
| `narrative-qa` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/narrative-qa-context.md` | `docs/loki-init/inventories/narrative-qa-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/narrative-qa-retrospectiva.md` |
| `level-designer` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/level-designer-context.md` | `docs/loki-init/inventories/level-designer-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/level-designer-retrospectiva.md` |
| `balance-economy-designer` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/balance-economy-designer-context.md` | `docs/loki-init/inventories/balance-economy-designer-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/balance-economy-designer-retrospectiva.md` |
| `branching-narrative-designer` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/branching-narrative-designer-context.md` | `docs/loki-init/inventories/branching-narrative-designer-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/branching-narrative-designer-retrospectiva.md` |
| `scene-presentation-designer` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/scene-presentation-designer-context.md` | `docs/loki-init/inventories/scene-presentation-designer-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/scene-presentation-designer-retrospectiva.md` |
| `audio-designer` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/audio-designer-context.md` | `docs/loki-init/inventories/audio-designer-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/audio-designer-retrospectiva.md` |
| `quest-content-designer` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/quest-content-designer-context.md` | `docs/loki-init/inventories/quest-content-designer-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/quest-content-designer-retrospectiva.md` |
| `dialogue-editor` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/dialogue-editor-context.md` | `docs/loki-init/inventories/dialogue-editor-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/dialogue-editor-retrospectiva.md` |
| `tools-pipeline-engineer` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/tools-pipeline-engineer-context.md` | `docs/loki-init/inventories/tools-pipeline-engineer-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/tools-pipeline-engineer-retrospectiva.md` |
| `technical-artist` | `game-dev` | Game-dev inventory agent from manifest. | `docs/loki-init/technical-artist-context.md` | `docs/loki-init/inventories/technical-artist-inventory.md` | `planos/000-init-loki/retrospetivas/fase1/technical-artist-retrospectiva.md` |

## Planned Batches

- Batch 1: `standards-curator`, `retrospective-digester`, `runtime-qa`, `execution-context-reader`, `source-researcher`, `technical-implementer`.
- Batch 2: `bibliotecario`, `catalogador`, `game-product-owner`, `game-business-analyst`, `game-designer`, `narrative-designer`.
- Batch 3: `ux-ui-designer`, `gameplay-engineer`, `narrative-qa`, `level-designer`, `balance-economy-designer`, `branching-narrative-designer`.
- Batch 4: `scene-presentation-designer`, `audio-designer`, `quest-content-designer`, `dialogue-editor`, `tools-pipeline-engineer`, `technical-artist`.
