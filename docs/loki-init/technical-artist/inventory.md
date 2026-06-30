---
title: "Loki Init - Technical Artist Inventory"
tipo: "inventario de arte tecnica"
status: "static-only"
agent: "technical-artist"
tags:
  - loki-init
  - technical-artist
  - rpg-maker-mz
  - corrida
---

# Loki Init - Technical Artist Inventory

Data: 2026-06-30
Escopo: inventario factual estatico de assets visuais, formatos,
animacoes/efeitos, surfaces de pictures/atlas/sprites, riscos aparentes de
memoria/performance e referencias asset-runtime do projeto Jhonny.

## Status

`partial`: o inventario cobre as fontes autorizadas e as superficies visuais da
corrida mapeadas nelas. Nao valida apresentacao, composicao, legibilidade,
carregamento, cache, timing, performance, memoria real, playback, input,
TextPicture, ButtonPicture, VisuMZ ou comportamento de Common Events.

Evidencia: `parse-valid` para `Jhonny/data/CommonEvents.json`,
`Jhonny/data/System.json` e parse estruturado de `Jhonny/js/plugins.js`;
`static-risk` para riscos de camada, preload, picture IDs e gaps de assets;
`runtime-pending` para qualquer comportamento perceptivel.

## Fontes lidas

| Fonte | Uso |
| --- | --- |
| `docs/loki-init/project-inventory.md` | Limites de escopo, root runtime real, stack e superficies sensiveis. |
| `docs/loki-init/technology-context.md` | `selected_project_type`, engine RPG Maker MZ, plugins ativos e gates. |
| `docs/index.xml` | Catalogo duradouro e caminhos dos docs de corrida. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Promessa visual da corrida, HUD, feedback, Curva do Diabo e resultado. |
| `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Contratos de pictures, preload, resultado, retry e gates antes de JSON. |
| `Jhonny/data/System.json` | Resolucao/UI 1280x720, switches e variaveis visuais da corrida. |
| `Jhonny/data/CommonEvents.json` | Comandos `Show Picture`, `Erase Picture`, `Tint Screen`, `Shake Screen`, `TextPicture`, `ButtonPicture` e callers. |
| `Jhonny/js/plugins.js` | Plugins ativos e parametros visuais relevantes. |
| `Jhonny/img/**` listagem | Familias de assets e existencia estatica de `img/pictures/race/*.png`. |
| Package inventory contract | Contrato universal e contrato `technical-artist` para esta pasta. |

Fontes importantes nao lidas por escopo: binarios PNG, dimensoes reais de
imagens, `Jhonny/effects/**`, `Jhonny/audio/**`, mapas, plugins fonte em
`Jhonny/js/plugins/**`, save files, runtime/editor RPG Maker MZ e Playtest.

## Mapa de localizacao

| Superficie | Onde procurar |
| --- | --- |
| Assets visuais gerais | `Jhonny/img/<familia>/` |
| Assets de corrida | `Jhonny/img/pictures/race/` |
| Referencias asset-runtime da corrida | `Jhonny/data/CommonEvents.json`, CEs 3, 5-9, 14-16, 18-19 |
| Picture IDs de corrida | `CommonEvents.json` comandos `231`, `235` e scripts que apagam `1..63` |
| TextPictures e UI textual | Plugin commands `TextPicture set` nos CEs 5, 6, 8, 9 e 19 |
| Click/tap de pictures | Plugin `ButtonPicture` ativo e scripts `mzkp_commonEventId` nos CEs 8 e 9 |
| Bust/VN picture states | Plugin commands `VisuMZ_2_VNPictureBusts` nos CEs 20-23 |
| Resolucao alvo | `System.json`: screen/UI 1280x720 |

## Assets e formatos observados

`Jhonny/img/**` contem estas familias por listagem estatica:

| Familia | Quantidade listada | Extensoes |
| --- | ---: | --- |
| `battlebacks1` | 52 | `png` |
| `battlebacks2` | 51 | `png` |
| `characters` | 52 | `png` |
| `enemies` | 105 | `png` |
| `faces` | 15 | `png` |
| `parallaxes` | 28 | `png` |
| `pictures` | 143 | `png` |
| `sv_actors` | 40 | `png` |
| `sv_enemies` | 105 | `png` |
| `system` | 12 | `png` |
| `tilesets` | 64 | `png`, `txt` sidecars |
| `titles1` | 20 | `png` |
| `titles2` | 2 | `png` |

Fato: o formato visual predominante listado e PNG. A listagem nao prova
dimensoes, transparencia correta, compressao, integridade, potencias de dois,
perfil de cor, custo de textura, legibilidade ou encaixe em tela.

## Assets de corrida

`Jhonny/img/pictures/race/` lista 21 PNGs:

- `!opala_pov.png`
- `bar_consciencia_bg.png`
- `bar_consciencia_fill.png`
- `bar_luck_bg.png`
- `bar_luck_fill.png`
- `bg-ranking.png`
- `bg_curva.png`
- `bg_sinal.png`
- `btn_direita.png`
- `btn_esquerda.png`
- `btn_furar.png`
- `btn_parar.png`
- `curva_do_diabo_placa.png`
- `opala_pov.png`
- `overlay_flash_white.png`
- `overlay_risk_high.png`
- `overlay_risk_low.png`
- `overlay_risk_med.png`
- `placa_curva_dir.png`
- `sinal_red.png`
- `timer_bar.png`

Cross-check estatico contra `Show Picture` em `CommonEvents.json`:

| Status | Assets |
| --- | --- |
| Referenciados e encontrados | `race/bar_consciencia_bg`, `race/bar_consciencia_fill`, `race/bar_luck_bg`, `race/bar_luck_fill`, `race/bg-ranking`, `race/bg_curva`, `race/bg_sinal`, `race/btn_direita`, `race/btn_esquerda`, `race/btn_furar`, `race/btn_parar`, `race/curva_do_diabo_placa`, `race/opala_pov`, `race/overlay_risk_high`, `race/overlay_risk_low`, `race/overlay_risk_med`, `race/placa_curva_dir`, `race/sinal_red`, `race/timer_bar` |
| Referenciados e ausentes | nenhum nas fontes lidas |
| Listados mas nao referenciados por `Show Picture` nos Common Events lidos | `race/!opala_pov`, `race/overlay_flash_white` |

Observacao: `placa_curva_dir.png` aparece em docs como asset criado para fase
futura/MVP adiado, mas o CE3 `EV_Preload` ainda referencia `race/placa_curva_dir`.
Isso e uma divergencia estatica entre doc de MVP e preload runtime, nao uma
falha visual validada.

## Referencias asset-runtime

Resumo de assets por callers de `Show Picture`:

| Asset runtime | Picture IDs | Callers |
| --- | --- | --- |
| `race/bg_sinal` | 1 | CE3 `EV_Preload`, CE8 `EV_RenderSinal` |
| `race/bg_curva` | 1 | CE3 `EV_Preload`, CE9 `EV_RenderCurva` |
| `race/opala_pov` | 1, 10 | CE3, CE8, CE9 |
| `race/sinal_red` | 1, 11 | CE3, CE8 |
| `race/curva_do_diabo_placa` | 1, 12 | CE3, CE9 |
| `race/btn_parar` | 1, 41 | CE3, CE8 |
| `race/btn_furar` | 1, 42 | CE3, CE8 |
| `race/btn_direita` | 1, 43 | CE3, CE9 |
| `race/btn_esquerda` | 1, 44 | CE3, CE9 |
| `race/bar_consciencia_bg` | 1, 20 | CE3, CE5 |
| `race/bar_consciencia_fill` | 1, 21 | CE3, CE5 |
| `race/bg-ranking` | 51 | CE6 |
| `race/bar_luck_bg` | 58 | CE8, CE9 |
| `race/bar_luck_fill` | 59 | CE8, CE9 |
| `race/timer_bar` | 1 | CE3 preload only |
| `race/overlay_risk_low/med/high` | 1 | CE3 preload only |
| TextPicture runtime-generated | 52, 53, 54, 55, 56, 57, 60, 61, 62, 63 | CE5, CE6, CE8, CE9, CE19 |

CE8 assigns `mzkp_commonEventId = 11` to picture 41 and `= 12` to picture 42.
CE9 assigns `mzkp_commonEventId = 12` to picture 43 and `= 11` to picture 44.
This creates a runtime boundary between button artwork and gameplay Common
Events via `ButtonPicture`/picture metadata.

## Picture stack and UI surfaces

Known picture ID bands from Common Events:

| Surface | IDs | Evidence |
| --- | --- | --- |
| Main race background | 1 | CE8/CE9, also reused by CE3 preload |
| Car/scene signage | 10-12 | `opala_pov`, `sinal_red`, `curva_do_diabo_placa` |
| Consciousness bar | 20-21 plus TextPicture 60 | CE5, CE6 |
| Risk overlays | 22-24 erased in CE16 but only preloaded as assets in CE3 | Potential ownership gap: no `Show Picture` found for IDs 22-24 in inspected Common Events |
| Action buttons | 41-44 | CE8/CE9 button pictures |
| Ranking/result/HUD | 51-63 | CE6 and CE19 TextPictures and `bg-ranking` |
| Cleanup | 1-63 | CE18 and CE19 scripts erase picture range defensively |

Static risk: the runtime uses many concurrent picture IDs on a 1280x720 screen,
including generated text pictures and image pictures. Without runtime capture,
layer order, overlap, input hitboxes, cleanup timing and readability remain
unknown.

## Animacoes, efeitos e feedback visual

Common Events do not contain `Show Animation` command `212` in the inspected
data. Visual feedback is represented by:

- `Show Picture` / `Erase Picture` for scene composition and cleanup.
- `Tint Screen` command `223`: startup fade, safe tint, risk tint, victory tint.
- `Shake Screen` command `225`: one inspected use in CE15 `EV_ResolucaoRiskOK`
  with parameters `[3, 5, 8, false]`.
- `Wait` command `230`: preload waits, transition waits and frame pacing.
- `TextPicture set`: HUD text, percentages, timer, scene count, victory/defeat
  copy and instructions.
- Plugin command `VisuMZ_2_VNPictureBusts`: CEs 20-23 apply tone and scale
  states to VN bust picture IDs 1-4.

Docs describe richer visual intent: signal pulse, risk hover red flash,
safe/risk flashes, motion blur, crash shake, particles/fume, fade to black,
Curva do Diabo plaque and visual communication of `P_cena`. Static data confirms
some tint/shake/picture infrastructure, but not the full authored motion,
particle or readability behavior.

## Plugin ownership

Active plugins from structured parse of `Jhonny/js/plugins.js`:

| Order | Plugin | Technical art relevance |
| ---: | --- | --- |
| 1 | `TextPicture` | Generates text as pictures for HUD/result/counter surfaces. |
| 2 | `ButtonPicture` | Makes picture buttons clickable; button art is runtime input surface. |
| 3 | `Jhonny_RaceHelper` | Helper/logging and race utilities; `EnableDebugLogs` is `true`. |
| 4 | `VisuMZ_0_CoreEngine` | `AntiZoomPictures=true`, `SubfolderParse=true`, `ImgLoad` only preloads `system` Balloon/IconSet by parameter. |
| 5 | `VisuMZ_2_VNPictureBusts` | VN bust tone/scale states, default scale 90%, anchor 0.5/0.95. |

Static risk: race picture preload is implemented in CE3, not in the VisuMZ
`ImgLoad` parameter. Any future preload/cache change crosses Common Events,
plugin parameters and runtime visual validation.

## Apparent memory/performance risks

These are static risk flags, not measured performance claims:

- The game runs at screen/UI 1280x720. If race backgrounds or overlays are
  full-screen, each visible full-screen RGBA texture can occupy about 3.5 MiB
  uncompressed (`1280 * 720 * 4`) before renderer overhead. Actual dimensions
  were not read because only `img/**` listings were authorized.
- CE3 preloads 16 race picture references with `Show Picture -> Wait 1 -> Erase`
  on picture ID 1. This is a deliberate cache-warming pattern but needs runtime
  validation for hitching and retry behavior.
- The same surface mixes bitmap PNGs and runtime-generated TextPictures.
  Generated TextPictures can create additional texture/cache churn depending on
  plugin behavior; plugin source was not read in this envelope.
- Picture cleanup uses broad ranges (`1..63`) in CE18/CE19. This is safe-looking
  as cleanup intent but can erase unrelated presentation if future features use
  overlapping IDs without a reservation registry.
- `overlay_risk_low/med/high` are preloaded but not shown by inspected
  `Show Picture` commands; CE16 erases IDs 22-24. The intended hover overlay
  pipeline appears incomplete or implemented outside inspected sources.
- `timer_bar` is preloaded but inspected HUD uses TextPicture `TIMER: \V[120]s`
  rather than an image bar. This conflicts with the doc intent of a horizontal
  timer bar unless implemented elsewhere.
- `curva_do_diabo_placa` is shown by CE9 `EV_RenderCurva` for curva scenes in
  inspected data. Static inventory did not prove the conditional gating that
  limits it to Curva do Diabo only.

## Validation gaps

Required gates before declaring valid:

- `human-validation`: visual composition, readability, timing, animation feel,
  hover states, input hitboxes, result screen, retry cleanup, cache behavior,
  frame pacing, flashes/shake comfort and Curva do Diabo presentation.
- RPG Maker MZ Playtest/debug pass: capture active pictures, positions, tint,
  switch/variable state, current Common Event/interpreter, plugin state and
  retry path.
- Asset technical pass: dimensions, transparency, file size, color profile,
  texture memory estimate, duplicate/unused assets and naming/case-sensitivity.
- Plugin technical pass if behavior matters: `TextPicture`, `ButtonPicture`,
  `Jhonny_RaceHelper`, `VisuMZ_0_CoreEngine` and `VisuMZ_2_VNPictureBusts`
  source/semantics.
- Editor/runtime validation: JSON parse is not proof that RPG Maker editor state
  or browser/NW.js rendering behavior is valid.

## Findings

- `picture`: Race picture references in inspected Common Events all resolve to
  listed `img/pictures/race/*.png` files.
- `ui-art-state`: TextPicture IDs 52-63 and image IDs 51, 58-59 form a
  substantial HUD/result layer that needs a picture-ID reservation map before
  future expansion.
- `vfx`: Static Common Events use tint and one shake command; no Show Animation
  command was found in `CommonEvents.json`.
- `atlas`: No atlas packing surface was found in authorized sources. Assets are
  loose RPG Maker image files.
- `memory`: Texture cost cannot be measured from listing-only assets; full-screen
  estimates remain hypothetical and require dimensions.
- `visual-performance`: CE3 preload warms race pictures manually; runtime hitch
  behavior is pending Playtest.
- `asset-runtime`: `ButtonPicture` connects button artwork to CE11/CE12 through
  picture metadata scripts in CE8/CE9.
- `open-question`: Why are `overlay_flash_white` and `!opala_pov` listed but not
  referenced by inspected Common Events?
- `open-question`: Are risk overlays IDs 22-24 intentionally disabled, or is
  hover feedback incomplete?
- `open-question`: Should `curva_do_diabo_placa` appear only in the future
  Curva do Diabo state, and if so where is the runtime condition enforced?

## Handoff

Recommended next path:

1. `runtime-qa`: Playtest the race boot, one sinal, one curva, hover/risk,
   result, crash/retry and picture cleanup with active picture snapshot.
2. `scene-presentation-designer`: compare visible staging against the doc
   promise for signal/curva, timer, result and Curva do Diabo.
3. `ux-ui-designer`: validate button hitboxes, text fit, timer readability,
   picture overlap and accessibility of flashes/shake.
4. `tools-pipeline-engineer`: propose a read-only asset dimension/case/unused
   validator for `img/pictures/race/**` under a future approved task.

## Agent response summary

```yaml
parallel_agent_response:
  agent: "technical-artist"
  mode: "scoped-writer"
  summary: "Static technical art inventory for RPG Maker MZ race assets, picture/runtime references, visual effects commands, plugin-owned surfaces, risks and validation gaps."
  affected_files:
    - "docs/loki-init/technical-artist/inventory.md"
  write_scope:
    mode: "init_context_scoped_writer"
    target_files:
      - "docs/loki-init/technical-artist/inventory.md"
    allowed_writes:
      - "docs/loki-init/technical-artist/**"
      - "planos/000-init-loki/retrospetivas/fase1/technical-artist-retrospectiva.md"
    scoped_write_domains:
      - "presentation-tech-notes"
      - "asset-pipeline-config"
    validators:
      - "structured JSON parse of System and CommonEvents"
      - "structured js/plugins.js parse via VM context"
      - "static img/pictures/race listing cross-check"
    human_gates:
      - "human-validation"
  affected_runtime_surfaces:
    - "Jhonny/data/CommonEvents.json"
    - "Jhonny/js/plugins.js"
    - "Jhonny/img/pictures/race/**"
  affected_domain_ids:
    - "CE3 EV_Preload"
    - "CE5 EV_RaceOrchestrator"
    - "CE6 EV_UpdateHud"
    - "CE8 EV_RenderSinal"
    - "CE9 EV_RenderCurva"
    - "CE14 EV_ResolucaoSafe"
    - "CE15 EV_ResolucaoRiskOK"
    - "CE16 EV_HoverRiskButton"
    - "CE18 EV_Crash"
    - "CE19 EV_VitoriaCorrida"
    - "Picture IDs 1,10-12,20-24,41-44,51-63"
  evidence:
    - "docs/loki-init/project-inventory.md"
    - "docs/loki-init/technology-context.md"
    - "docs/index.xml"
    - "docs/02-Core-Loop/Corrida - Core Loop.md"
    - "docs/02-Core-Loop/Corrida - Runtime e Eventos.md"
    - "Jhonny/data/System.json"
    - "Jhonny/data/CommonEvents.json"
    - "Jhonny/js/plugins.js"
    - "Jhonny/img/** listing"
  findings:
    - type: "sprite"
      detail: "Loose PNG race picture assets are listed under Jhonny/img/pictures/race; no atlas surface found."
    - type: "vfx"
      detail: "Visual effects in inspected Common Events are picture/tint/shake/TextPicture based; no Show Animation command found."
    - type: "memory"
      detail: "Texture memory cannot be validated because image dimensions were not read; full-screen texture cost remains an estimate."
    - type: "visual-performance"
      detail: "Manual CE3 preload warms race pictures but runtime hitch/cache behavior is pending Playtest."
    - type: "open-question"
      detail: "Risk overlays and Curva do Diabo plaque ownership need runtime/design confirmation."
  risks:
    - "Picture ID overlap and broad erase range risk future presentation conflicts."
    - "Generated TextPictures plus image pictures may affect cache churn without plugin/runtime validation."
    - "Doc-runtime drift around MVP Curva do Diabo and placa preload/reference."
  confidence: "medium"
  model_class: "coding"
  effort: "high"
  required_validations:
    - "technical-review"
    - "human-validation"
  proposed_next_step: "Run a focused Playtest/debug capture of race visual surfaces before changing assets or picture runtime."
```
