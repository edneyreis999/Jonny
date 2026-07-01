# Loki Init - Game Designer Inventory - Handoff estruturado

Source index: [inventory.md](inventory.md)

## Handoff estruturado

```yaml
parallel_agent_response:
  agent: "game-designer"
  mode: "scoped-writer"
  summary: "Inventario factual do design da corrida produzido com separacao entre intencao documentada, evidencia estatica de Common Events/System IDs e claims pendentes de Playtest."
  affected_files:
    - "docs/loki-init/game-designer/inventory.md"
  write_scope:
    mode: "init_context_scoped_writer"
    target_files:
      - "docs/loki-init/game-designer/inventory.md"
    allowed_writes:
      - "docs/loki-init/game-designer/**"
      - "planos/000-init-loki/retrospetivas/fase1/game-designer-retrospectiva.md"
    scoped_write_domains:
      - "gameplay-specs"
      - "mechanic-rules"
      - "progression-tuning"
      - "gameplay-content"
    validators:
      - "parse JSON read-only for System.json and CommonEvents.json"
      - "manual source contract check against loki-init inventory contract"
    human_gates:
      - "human-validation"
  affected_runtime_surfaces:
    - "Jhonny/data/System.json"
    - "Jhonny/data/CommonEvents.json"
    - "Jhonny/js/plugins.js"
    - "Jhonny/js/plugins/Jhonny_RaceHelper.js"
    - "Jhonny/img/pictures/race/**"
    - "Jhonny/audio/**"
  affected_domain_ids:
    - "corrida"
    - "VAR_RACE_ID"
    - "VAR_SCENE_INDEX"
    - "VAR_P_CENA"
    - "VAR_CONSCIENCIA"
    - "VAR_PONTOS_GLORIA"
    - "VAR_GLORIA_META"
    - "SW_RACE_ACTIVE"
    - "SW_INPUT_LOCKED"
    - "SW_IS_CURVA_DIABO"
    - "CE5 EV_RaceOrchestrator"
    - "CE7 EV_RaceRenderer"
    - "CE10 EV_RaceTimer"
    - "CE11 EV_OnSafe"
    - "CE12 EV_OnRisk"
    - "CE13 EV_KeyInput"
    - "CE16 EV_HoverRiskButton"
    - "CE18 EV_Crash"
    - "CE19 EV_VitoriaCorrida"
  evidence:
    - "docs/02-Core-Loop/Corrida - Core Loop.md"
    - "docs/02-Core-Loop/Corrida - Runtime e Eventos.md"
    - "Jhonny/data/System.json parsed successfully"
    - "Jhonny/data/CommonEvents.json parsed successfully"
  findings:
    - type: "loop"
      detail: "Corrida e um loop de decisoes binarias safe/risk com timer, recurso Consciência, Pontos de Gloria e retry por corrida."
    - type: "rule"
      detail: "Risk usa taxa clamp(Consciência + P_cena, 0, 100), roll 0..99, custo P_cena e recompensa P_cena*2 em sucesso."
    - type: "feedback"
      detail: "HUD e resultado usam TextPictures; clareza visual, audio e input seguem pendentes de Playtest."
    - type: "progression"
      detail: "Progressao linear 6/8/10 cenas com thresholds 200/400/600; safe-only nao alcança metas atuais."
    - type: "system-interaction"
      detail: "Docs de design e runtime cruzam Common Events, helper plugin, TextPicture, switches e variaveis."
    - type: "edge-case"
      detail: "Timeout, Curva do Diabo e safe-only possuem drift entre trechos de documentacao e evidencia estatica."
    - type: "open-question"
      detail: "Confirmar canon MVP para Curva do Diabo, timeout, idioma da UI e thresholds antes de tuning."
  risks:
    - "Static inventory cannot validate gameplay feel, input reliability, timing, audio, visual clarity, balance fairness, route reachability or save/load compatibility."
    - "Editing Common Events without resolving doc-runtime drift may change design intent accidentally."
  confidence: "medium"
  model_class: "frontier_reasoning"
  effort: "high"
  required_validations:
    - "technical-review"
    - "human-validation"
  proposed_next_step: "Run loki:tech-analysis focused on corrida timeout/retry/Curva do Diabo ownership before any data JSON or plugin change."
```
