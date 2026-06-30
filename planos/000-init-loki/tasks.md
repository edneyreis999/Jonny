# Loki Init Tasks

```yaml
loki_init_state:
  consumer_project_root: "/Users/edney/projects/coreto/summer26"
  docs_root: "docs"
  plan_root: "planos/000-init-loki"
  current_phase: "fase1"
  status: "complete-static-init"
  created_or_audited_paths:
    - "docs/index.xml"
    - "docs/loki-init/"
    - "planos/000-init-loki/interaction/fase1/"
    - "planos/000-init-loki/builds/fase1/"
    - "planos/000-init-loki/retrospetivas/fase1/"
  inventory:
    files_scanned:
      - "docs/**"
      - "Jhonny/CLAUDE.md"
      - "Jhonny/package.json"
      - "Jhonny/data/System.json"
      - "Jhonny/data/CommonEvents.json"
      - "Jhonny/data/MapInfos.json"
      - "Jhonny/js/plugins.js"
      - "Jhonny/js/plugins/Jhonny_RaceHelper.js"
      - "Jhonny/img/**"
      - "Jhonny/audio/**"
      - "Jhonny/planos/**"
    files_deep_read:
      - "docs/index.xml"
      - "docs/02-Core-Loop/Corrida - Core Loop.md"
      - "docs/02-Core-Loop/Corrida - Runtime e Eventos.md"
      - "docs/03-Tech/RPG Maker MZ - Debug Playtest.md"
      - "docs/03-Tech/RPG Maker MZ - Scripts de Plano.md"
      - "Jhonny/CLAUDE.md"
      - "Jhonny/data/System.json"
      - "Jhonny/data/CommonEvents.json"
      - "Jhonny/data/MapInfos.json"
      - "Jhonny/js/plugins.js"
    ignored_patterns:
      - ".agents/** writes"
      - ".codex/** writes"
      - ".claude/** writes"
      - "Jhonny/** writes"
      - "runtime/assets/save/build outputs"
    project_areas:
      - "Obsidian docs"
      - "RPG Maker MZ runtime under Jhonny/"
      - "race core loop"
      - "runtime QA and Playtest gates"
      - "historical plans/scripts"
    detected_project_type:
      - "game-dev"
    selected_project_type: "game-dev"
    detected_engines:
      - "RPG Maker MZ"
    git_available: true
  agent_outputs:
    docs_index: "docs/index.xml"
    readme: "docs/loki-init/README.md"
    fanout_summary: "docs/loki-init/agent-fanout-summary.md"
    conflicts: "docs/loki-init/conflicts-and-decisions.md"
    open_questions: "docs/loki-init/open-questions.md"
  agent_fanout:
    capability_preflight: "tool_search discovered multi_agent_v1 subagent/delegation tools"
    discovery_method: "tool_search plus manifest.yaml; adapter role surface from multi_agent_v1"
    agent_catalog_source:
      - "/Users/edney/projects/coreto/loki-framework/manifest.yaml"
    supported_project_types:
      - "game-dev"
      - "software-development"
    agent_project_tag_policy:
      base_tag: "core"
      selection_rule: "inventory_required = agents tagged core + agents tagged selected_project_type"
    agent_project_tags:
      standards-curator: ["core"]
      retrospective-digester: ["core"]
      runtime-qa: ["core"]
      execution-context-reader: ["core"]
      source-researcher: ["core"]
      technical-implementer: ["core"]
      bibliotecario: ["core"]
      catalogador: ["core"]
      game-product-owner: ["game-dev"]
      game-business-analyst: ["game-dev"]
      game-designer: ["game-dev"]
      narrative-designer: ["game-dev"]
      ux-ui-designer: ["game-dev"]
      gameplay-engineer: ["game-dev"]
      narrative-qa: ["game-dev"]
      level-designer: ["game-dev"]
      balance-economy-designer: ["game-dev"]
      branching-narrative-designer: ["game-dev"]
      scene-presentation-designer: ["game-dev"]
      audio-designer: ["game-dev"]
      quest-content-designer: ["game-dev"]
      dialogue-editor: ["game-dev"]
      tools-pipeline-engineer: ["game-dev"]
      technical-artist: ["game-dev"]
    compatible_tools_found:
      - "multi_agent_v1.spawn_agent"
      - "multi_agent_v1.wait_agent"
      - "multi_agent_v1.close_agent"
    available:
      - "standards-curator"
      - "retrospective-digester"
      - "runtime-qa"
      - "execution-context-reader"
      - "source-researcher"
      - "technical-implementer"
      - "bibliotecario"
      - "catalogador"
      - "game-product-owner"
      - "game-business-analyst"
      - "game-designer"
      - "narrative-designer"
      - "ux-ui-designer"
      - "gameplay-engineer"
      - "narrative-qa"
      - "level-designer"
      - "balance-economy-designer"
      - "branching-narrative-designer"
      - "scene-presentation-designer"
      - "audio-designer"
      - "quest-content-designer"
      - "dialogue-editor"
      - "tools-pipeline-engineer"
      - "technical-artist"
    inventory_required:
      - "standards-curator"
      - "retrospective-digester"
      - "runtime-qa"
      - "execution-context-reader"
      - "source-researcher"
      - "technical-implementer"
      - "bibliotecario"
      - "catalogador"
      - "game-product-owner"
      - "game-business-analyst"
      - "game-designer"
      - "narrative-designer"
      - "ux-ui-designer"
      - "gameplay-engineer"
      - "narrative-qa"
      - "level-designer"
      - "balance-economy-designer"
      - "branching-narrative-designer"
      - "scene-presentation-designer"
      - "audio-designer"
      - "quest-content-designer"
      - "dialogue-editor"
      - "tools-pipeline-engineer"
      - "technical-artist"
    inventory_required_reasons:
      standards-curator: "project_tags: core"
      retrospective-digester: "project_tags: core"
      runtime-qa: "project_tags: core"
      execution-context-reader: "project_tags: core"
      source-researcher: "project_tags: core"
      technical-implementer: "project_tags: core"
      bibliotecario: "project_tags: core"
      catalogador: "project_tags: core"
      game-product-owner: "project_tags: game-dev"
      game-business-analyst: "project_tags: game-dev"
      game-designer: "project_tags: game-dev"
      narrative-designer: "project_tags: game-dev"
      ux-ui-designer: "project_tags: game-dev"
      gameplay-engineer: "project_tags: game-dev"
      narrative-qa: "project_tags: game-dev"
      level-designer: "project_tags: game-dev"
      balance-economy-designer: "project_tags: game-dev"
      branching-narrative-designer: "project_tags: game-dev"
      scene-presentation-designer: "project_tags: game-dev"
      audio-designer: "project_tags: game-dev"
      quest-content-designer: "project_tags: game-dev"
      dialogue-editor: "project_tags: game-dev"
      tools-pipeline-engineer: "project_tags: game-dev"
      technical-artist: "project_tags: game-dev"
    init_inventory_domain_writers:
      - "runtime-qa"
      - "technical-implementer"
      - "game-product-owner"
      - "game-business-analyst"
      - "game-designer"
      - "narrative-designer"
      - "ux-ui-designer"
      - "gameplay-engineer"
      - "narrative-qa"
      - "level-designer"
      - "balance-economy-designer"
      - "branching-narrative-designer"
      - "scene-presentation-designer"
      - "audio-designer"
      - "quest-content-designer"
      - "dialogue-editor"
      - "tools-pipeline-engineer"
      - "technical-artist"
    init_final_cataloger:
      - "catalogador"
    init_support_only_agents:
      - "standards-curator"
      - "retrospective-digester"
      - "execution-context-reader"
      - "source-researcher"
      - "bibliotecario"
    selected: "inventory_required minus bibliotecario support invocation"
    planned:
      - "batch1 standards-curator retrospective-digester runtime-qa execution-context-reader source-researcher technical-implementer"
      - "batch2 game-product-owner game-business-analyst game-designer narrative-designer ux-ui-designer gameplay-engineer"
      - "batch3 narrative-qa level-designer balance-economy-designer branching-narrative-designer scene-presentation-designer audio-designer"
      - "batch4 quest-content-designer dialogue-editor tools-pipeline-engineer technical-artist"
      - "serial catalogador"
    invoked:
      - "standards-curator"
      - "retrospective-digester"
      - "runtime-qa"
      - "execution-context-reader"
      - "source-researcher"
      - "technical-implementer"
      - "game-product-owner"
      - "game-business-analyst"
      - "game-designer"
      - "narrative-designer"
      - "ux-ui-designer"
      - "gameplay-engineer"
      - "narrative-qa"
      - "level-designer"
      - "balance-economy-designer"
      - "branching-narrative-designer"
      - "scene-presentation-designer"
      - "audio-designer"
      - "quest-content-designer"
      - "dialogue-editor"
      - "tools-pipeline-engineer"
      - "technical-artist"
      - "catalogador"
    blocked: []
    skipped:
      - "bibliotecario"
    skipped_reasons:
      bibliotecario: "Support-only role not invoked because docs/index.xml was read through loki-index-navigator and final catalogador handled catalog update."
    target_inventory_dirs:
      runtime-qa: "docs/loki-init/runtime-qa/"
      technical-implementer: "docs/loki-init/technical-implementer/"
      game-product-owner: "docs/loki-init/game-product-owner/"
      game-business-analyst: "docs/loki-init/game-business-analyst/"
      game-designer: "docs/loki-init/game-designer/"
      narrative-designer: "docs/loki-init/narrative-designer/"
      ux-ui-designer: "docs/loki-init/ux-ui-designer/"
      gameplay-engineer: "docs/loki-init/gameplay-engineer/"
      narrative-qa: "docs/loki-init/narrative-qa/"
      level-designer: "docs/loki-init/level-designer/"
      balance-economy-designer: "docs/loki-init/balance-economy-designer/"
      branching-narrative-designer: "docs/loki-init/branching-narrative-designer/"
      scene-presentation-designer: "docs/loki-init/scene-presentation-designer/"
      audio-designer: "docs/loki-init/audio-designer/"
      quest-content-designer: "docs/loki-init/quest-content-designer/"
      dialogue-editor: "docs/loki-init/dialogue-editor/"
      tools-pipeline-engineer: "docs/loki-init/tools-pipeline-engineer/"
      technical-artist: "docs/loki-init/technical-artist/"
    inventory_contracts:
      universal: "/Users/edney/projects/coreto/loki-framework/docs/loki-init-inventory-contracts.md"
    cataloger_outputs:
      docs_index: "docs/index.xml"
      readme: "docs/loki-init/README.md"
      fanout_summary: "docs/loki-init/agent-fanout-summary.md"
      conflicts: "docs/loki-init/conflicts-and-decisions.md"
      open_questions: "docs/loki-init/open-questions.md"
    target_retrospectives:
      standards-curator: "planos/000-init-loki/retrospetivas/fase1/standards-curator-retrospectiva.md"
      retrospective-digester: "planos/000-init-loki/retrospetivas/fase1/retrospective-digester-retrospectiva.md"
      runtime-qa: "planos/000-init-loki/retrospetivas/fase1/runtime-qa-retrospectiva.md"
      execution-context-reader: "planos/000-init-loki/retrospetivas/fase1/execution-context-reader-retrospectiva.md"
      source-researcher: "planos/000-init-loki/retrospetivas/fase1/source-researcher-retrospectiva.md"
      technical-implementer: "planos/000-init-loki/retrospetivas/fase1/technical-implementer-retrospectiva.md"
      game-product-owner: "planos/000-init-loki/retrospetivas/fase1/game-product-owner-retrospectiva.md"
      game-business-analyst: "planos/000-init-loki/retrospetivas/fase1/game-business-analyst-retrospectiva.md"
      game-designer: "planos/000-init-loki/retrospetivas/fase1/game-designer-retrospectiva.md"
      narrative-designer: "planos/000-init-loki/retrospetivas/fase1/narrative-designer-retrospectiva.md"
      ux-ui-designer: "planos/000-init-loki/retrospetivas/fase1/ux-ui-designer-retrospectiva.md"
      gameplay-engineer: "planos/000-init-loki/retrospetivas/fase1/gameplay-engineer-retrospectiva.md"
      narrative-qa: "planos/000-init-loki/retrospetivas/fase1/narrative-qa-retrospectiva.md"
      level-designer: "planos/000-init-loki/retrospetivas/fase1/level-designer-retrospectiva.md"
      balance-economy-designer: "planos/000-init-loki/retrospetivas/fase1/balance-economy-designer-retrospectiva.md"
      branching-narrative-designer: "planos/000-init-loki/retrospetivas/fase1/branching-narrative-designer-retrospectiva.md"
      scene-presentation-designer: "planos/000-init-loki/retrospetivas/fase1/scene-presentation-designer-retrospectiva.md"
      audio-designer: "planos/000-init-loki/retrospetivas/fase1/audio-designer-retrospectiva.md"
      quest-content-designer: "planos/000-init-loki/retrospetivas/fase1/quest-content-designer-retrospectiva.md"
      dialogue-editor: "planos/000-init-loki/retrospetivas/fase1/dialogue-editor-retrospectiva.md"
      tools-pipeline-engineer: "planos/000-init-loki/retrospetivas/fase1/tools-pipeline-engineer-retrospectiva.md"
      technical-artist: "planos/000-init-loki/retrospetivas/fase1/technical-artist-retrospectiva.md"
      catalogador: "planos/000-init-loki/retrospetivas/fase1/catalogador-retrospectiva.md"
    retrospective_write_capability:
      status: "available by prompt-scoped writes; verified by file existence"
    support_outputs:
      standards-curator: "retrospective includes support result"
      retrospective-digester: "retrospective includes digest result"
      execution-context-reader: "retrospective includes execution-context result"
      source-researcher: "retrospective includes source-research result"
    retrospective_outputs: "23 files under planos/000-init-loki/retrospetivas/fase1/"
    batch_limit_configured: null
    batch_limit_observed: 6
    write_mode_by_agent:
      support_only: "exact retrospective only"
      domain_writer: "exact target inventory dir plus exact retrospective"
      final_cataloger: "exact catalog/consolidation files plus exact retrospective"
  conflicts:
    - "Git-state mismatch: repo exists despite workspace instruction saying no .git."
    - "Stale previous init layout replaced in docs/index.xml."
    - "Curva do Diabo MVP scope conflict."
    - "Timeout semantics drift."
    - "Plugin/no-plugin drift."
    - "Crash audio drift."
    - "Runtime validation pending human Playtest."
  open_questions:
    - "See docs/loki-init/open-questions.md"
  validators_run:
    - "docs/index.xml XML parse"
    - "cataloged paths existence check"
    - "domain inventory folder existence check"
    - "agent retrospective existence check"
    - "git diff --check -- docs planos/000-init-loki"
    - "no missing catalog paths"
  blocked_by:
    - "human-validation for gameplay/UI/audio/input/Common Events/save-load/deploy"
  next_recommended_command: "loki:tech-analysis"
```

## Task List

- [x] `task-1.1` - Execute `loki:init` fase 1 static bootstrap.
- [ ] Future - Run `loki:tech-analysis` for race runtime ownership and unresolved conflicts.
