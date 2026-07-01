# Loki Init - Scene Presentation Designer Inventory - Handoff

Source index: [presentation-inventory.md](presentation-inventory.md)

## Handoff

```yaml
parallel_agent_response:
  agent: "scene-presentation-designer"
  mode: "scoped-writer"
  summary: "Inventario factual de apresentacao da corrida criado a partir de docs, CommonEvents.json, MapInfos.json e listing de race pictures; nenhuma validacao perceptivel foi declarada."
  affected_files:
    - "docs/loki-init/scene-presentation-designer/presentation-inventory.md"
    - "planos/000-init-loki/retrospetivas/fase1/scene-presentation-designer-retrospectiva.md"
  write_scope:
    mode: "init_context_scoped_writer"
    target_files:
      - "docs/loki-init/scene-presentation-designer/**"
      - "planos/000-init-loki/retrospetivas/fase1/scene-presentation-designer-retrospectiva.md"
    allowed_writes:
      - "docs/loki-init/scene-presentation-designer/**"
      - "planos/000-init-loki/retrospetivas/fase1/scene-presentation-designer-retrospectiva.md"
    scoped_write_domains:
      - "scene-scripts"
      - "beat-timing"
      - "presentation-cues"
      - "cutscene-blocking"
    validators:
      - "static JSON parse of CommonEvents.json and MapInfos.json"
      - "race picture reference/listing cross-check"
    human_gates:
      - "human-validation"
  affected_runtime_surfaces:
    - "Jhonny/data/CommonEvents.json"
    - "Jhonny/data/MapInfos.json"
    - "Jhonny/img/pictures/race/**"
    - "RPG Maker MZ picture stack"
    - "TextPicture/ButtonPicture style picture input"
  affected_domain_ids:
    - "CE3 EV_Preload"
    - "CE5 EV_RaceOrchestrator"
    - "CE6 EV_UpdateHud"
    - "CE7 EV_RaceRenderer"
    - "CE8 EV_RenderSinal"
    - "CE9 EV_RenderCurva"
    - "CE10 EV_RaceTimer"
    - "CE11 EV_OnSafe"
    - "CE12 EV_OnRisk"
    - "CE13 EV_KeyInput"
    - "CE14 EV_ResolucaoSafe"
    - "CE15 EV_ResolucaoRiskOK"
    - "CE16 EV_HoverRiskButton"
    - "CE18 EV_Crash"
    - "CE19 EV_VitoriaCorrida"
    - "SW105 SW_IS_CURVA_DIABO"
    - "Picture IDs 1,5,10-12,20-21,41-44,51-63"
  evidence:
    - "docs/index.xml catalog entries for corrida docs"
    - "docs/02-Core-Loop/Corrida - Core Loop.md"
    - "docs/02-Core-Loop/Corrida - Runtime e Eventos.md"
    - "structured parse of Jhonny/data/CommonEvents.json"
    - "structured parse of Jhonny/data/MapInfos.json"
    - "listing of Jhonny/img/pictures/race/**"
  findings:
    - type: "staging"
      detail: "Sinal and Curva scenes use full-screen race backgrounds, Opala POV, buttons, HUD bars and TextPictures."
    - type: "camera"
      detail: "Spec describes zoom/shake/fade beats; Common Events show tint/shake/wait commands but runtime camera readability is unvalidated."
    - type: "transition"
      detail: "Renderer erases scene pictures before rendering next scene; result and retry depend on CE19/CE18 lifecycle."
    - type: "sprite"
      detail: "No character bust/sprite inventory was found in read race sources; VN maps were only mapped by MapInfos."
    - type: "background"
      detail: "race/bg_sinal, race/bg_curva and race/bg-ranking are referenced and exist in the race picture listing."
    - type: "cg"
      detail: "No separate narrative CG surface was identified in the read sources."
    - type: "timing"
      detail: "Spec timings are 4.0s signal, 3.5s curve, 0.3s setup, 0.4s resolution and 0.2s transition; static CEs include waits but no Playtest validation."
    - type: "audio-cue"
      detail: "Observed cues include darkeletronic BGM, freada, Up1, pneu_cantando, Victory1 and Defeat1; several spec cues are not confirmed in CEs read."
    - type: "open-question"
      detail: "Spec says P_cena should not be numeric, but CE8/CE9 show TextPicture \\V[103]%; requires design/UX decision."
  risks:
    - "Doc-runtime drift around P_cena visibility, result background and unconfirmed feedback effects."
    - "Curva do Diabo has conditional renderer support while product docs mark it post-MVP."
    - "Picture input and timing remain runtime-pending without Playtest."
  confidence: "medium"
  model_class: "frontier_reasoning"
  effort: "high"
  required_validations:
    - "technical-review"
    - "human-validation"
  proposed_next_step: "Use this inventory as source for a focused loki:tech-analysis on race presentation drift and Playtest checklist before editing runtime."
```
