---
title: "Loki Init - Scene Presentation Designer Inventory"
tipo: "inventario de apresentacao de cena"
status: "parcial"
agent: "scene-presentation-designer"
date: 2026-06-30
tags:
  - loki-init
  - scene-presentation
  - corrida
  - rpg-maker-mz
---

# Loki Init - Scene Presentation Designer Inventory

## Escopo

Inventario factual de apresentacao de cena para o projeto `Jhonny`, com foco na corrida documentada e nos Common Events/pictures lidos. A cobertura inclui cenas, staging, camera, transicoes, sprites/busts, backgrounds, CGs, timing, cues, ownership de pictures e lacunas de validacao perceptivel.

Modo de inventario RPG Maker MZ: `focused ownership`, limitado a apresentacao de cena da corrida. Nenhum runtime, asset, data JSON, plugin, save ou mapa foi alterado.

## Fontes Lidas

| Fonte | Uso no inventario |
| --- | --- |
| `docs/loki-init/project-inventory.md` | Escopo comum, stack, superficies sensiveis e limites do init. |
| `docs/loki-init/technology-context.md` | Classificacao `game-dev`, RPG Maker MZ, plugins ativos e gates. |
| `docs/index.xml` | Navegacao: apontou `Corrida - Core Loop` e `Corrida - Runtime e Eventos` como fontes duradouras prioritarias. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Esqueleto de cena, feedback visual/audio, timing, HUD, resultado e decisoes abertas. |
| `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Contratos de Common Events, input lock, tela de resultado, retry e gates. |
| `Jhonny/data/CommonEvents.json` | Parsing estruturado dos Common Events de corrida e auxiliares de render/resolucao. |
| `Jhonny/data/MapInfos.json` | Lista estrutural de mapas e possiveis superficies VN/corrida. |
| `Jhonny/img/pictures/race/**` listing | Existencia estatica dos assets de pictures da corrida. |
| Contrato de inventario do pacote Loki | Requisitos universal e especifico de `scene-presentation-designer`. |

## Mapa de Localizacao

- Documentacao de intencao e pacing: `docs/02-Core-Loop/Corrida - Core Loop.md`.
- Contratos runtime de cenas da corrida: `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`.
- Implementacao estatica de apresentacao por eventos: `Jhonny/data/CommonEvents.json`.
- Ordem e nomes de mapas: `Jhonny/data/MapInfos.json`.
- Assets de corrida: `Jhonny/img/pictures/race/`.
- Catalogo duradouro: `docs/index.xml`.

## Cenas e Staging Inventariados

| Cena/superficie | Evidencia estatica | Staging atual ou previsto |
| --- | --- | --- |
| Cena de Sinal | Spec define sinal vermelho, decisoes `Parar`/`Furar`, timer de 4,0s. CE8 `EV_RenderSinal` mostra `race/bg_sinal`, `race/opala_pov`, `race/sinal_red`, barras e botoes. | Fundo full-screen, Opala em POV, sinal vermelho em `(560, 0)`, botoes `Parar` e `Furar` embaixo. |
| Cena de Curva | Spec define decisoes `Esquerda`/`Direita`, timer de 3,5s. CE9 `EV_RenderCurva` mostra `race/bg_curva`, `race/opala_pov`, barras e botoes. | Fundo full-screen, Opala em POV, botoes de curva embaixo. Placa da Curva do Diabo so aparece quando switch 105 esta ON. |
| Curva do Diabo | Spec marca como visao completa/futura e fora do MVP; `SW_IS_CURVA_DIABO` 105 reservado. CE9 tem branch condicional por switch 105 mostrando `race/curva_do_diabo_placa`. | Staging condicional com placa em `(308, 80)`. A leitura dramatica, audio diferenciado e clmax continuam pendentes de Playtest e decisao de escopo. |
| HUD da corrida | CE5 mostra barra de consciencia IDs 20/21. CE6 `EV_UpdateHud` mostra ranking, tentativa, consciencia, timer e progresso por TextPicture. | HUD sobreposto a cena: consciencia no topo/esquerda, ranking e textos de status em picture IDs altos. |
| Tela de resultado | Doc runtime declara `EV_VitoriaCorrida` como tela canonica. CE19 mostra TextPictures 53/56/54/55, toca ME e limpa pictures. | Tela textual de `VICTORY!` ou `DEFEAT!`, score e prompt de continuar. Picture 5 e apagada defensivamente, mas nenhum asset de fundo de resultado foi encontrado nos comandos lidos. |
| Crash/retry | CE18 `EV_Crash` chama CE19 e loga evento. Spec descreve crash visual com shake/fade, mas no JSON lido CE18 nao contem Show Picture/audio direto. CE15 `EV_ResolucaoRiskOK` contem shake, wait e SE para sucesso de risco. | Cleanup/restart e resultado existem como fluxo; composicao visual completa de crash descrita no spec nao foi confirmada no CommonEvent lido. |
| Preload | CE3 `EV_Preload` faz `Show Picture -> Wait 1 frame -> Erase Picture` para assets de corrida. | Aquecimento estatico de backgrounds, botoes, barras, overlays, placa e sinal. |

## Camera, Movimento e Transicoes

Fatos estaticos:

- O spec define camera/feedback como zoom-out em safe, zoom-in em risk-sucesso, motion blur, shake de 0,3s em crash, fade para preto de 0,4s e transicao de 0,2s entre cenas.
- Nos Common Events lidos, comandos de tint/shake/wait aparecem como command codes `223`, `225` e `230` em CEs de orquestracao/resolucao.
- CE14 `EV_ResolucaoSafe` tem dois `Tint Screen` e `Wait 12`.
- CE15 `EV_ResolucaoRiskOK` tem tint, shake, `Wait 18` e SE `pneu_cantando`.
- CE5 `EV_RaceOrchestrator` toca BGM `darkeletronic`, usa tint/fade waits de 72 e 18 frames e chama preload.
- CE7 `EV_RaceRenderer` apaga pictures de cena antes de renderizar nova cena e chama CE8/CE9 ou CE19 conforme estado.

Lacuna: o inventario estatico nao valida enquadramento, suavidade, sincronizacao, foco visual, duracao percebida, blend de tint, motion blur real ou ausencia de tela preta.

## Sprites, Busts, Backgrounds e CGs

| Categoria | Evidencia encontrada | Status |
| --- | --- | --- |
| Sprites/busts de personagens | O contexto tecnico informa plugin ativo `VisuMZ_2_VNPictureBusts`, mas as fontes lidas para corrida nao continham busts de personagem. `MapInfos` lista mapas VN (`Estrada_VN1`, `Quarto_VN2`, `Estrada_VN3`), mas mapas nao foram deep-read por este envelope. | Parcial; fora do foco lido. |
| Veiculo/POV | `race/opala_pov` referenciado por CE8 e CE9; `race/!opala_pov` existe no listing mas nao foi referenciado por Common Events lidos. | Estaticamente presente; render/escala pendentes. |
| Backgrounds | `race/bg_sinal`, `race/bg_curva`, `race/bg-ranking` existem e sao referenciados. | Estaticamente presente. |
| CGs | Nenhum CG narrativo separado foi identificado nas fontes lidas. Tela de resultado usa TextPicture; Curva do Diabo usa placa condicional. | Nao encontrado no escopo lido. |
| Overlays | `overlay_risk_low`, `overlay_risk_med`, `overlay_risk_high` e `timer_bar` existem e sao preloaded; `overlay_flash_white` existe no listing mas nao foi referenciado por Common Events lidos. | Parcial; ownership runtime a confirmar. |

## Picture Ownership

| Picture ID | Owner/uso observado | Asset/texto | Fonte |
| --- | --- | --- | --- |
| 1 | Background de cena e preload temporario | `race/bg_sinal`, `race/bg_curva` e outros no preload | CE3, CE8, CE9 |
| 5 | Resultado/cleanup defensivo | Apagado por CE19; spec menciona fundo de vitoria/derrota, mas asset nao apareceu nos comandos lidos | CE19, doc core loop |
| 10 | Opala POV | `race/opala_pov` | CE7, CE8, CE9 |
| 11 | Sinal vermelho | `race/sinal_red` | CE7, CE8 |
| 12 | Placa Curva do Diabo condicional | `race/curva_do_diabo_placa` quando switch 105 ON | CE7, CE9 |
| 20 | Barra de consciencia fundo | `race/bar_consciencia_bg` | CE5 |
| 21 | Barra de consciencia fill | `race/bar_consciencia_fill` | CE5 |
| 41 | Botao safe do sinal | `race/btn_parar`, script atribui CE11 | CE7, CE8 |
| 42 | Botao risk do sinal | `race/btn_furar`, script atribui CE12 | CE7, CE8 |
| 43 | Botao risk da curva | `race/btn_direita`, script atribui CE12 | CE7, CE9 |
| 44 | Botao safe da curva | `race/btn_esquerda`, script atribui CE11 | CE7, CE9 |
| 51 | Painel/ranking HUD | `race/bg-ranking` | CE6 |
| 52 | Tentativa | TextPicture `TRIAL \V[112]` | CE6 |
| 53 | Resultado vitoria | TextPicture `\C[6]VICTORY!` | CE19 |
| 54 | Pontos | TextPicture `Glory Score: \V[105]` | CE19 |
| 55 | Prompt | TextPicture `Press [SPACE] to continue` | CE19 |
| 56 | Resultado derrota | TextPicture `\C[18]DEFEAT!` | CE19 |
| 57 | Score HUD | TextPicture `GLORY: \V[105]/\V[119]` | CE6 |
| 58 | Barra de luck/probabilidade fundo | `race/bar_luck_bg` | CE8, CE9 |
| 59 | Barra de luck/probabilidade fill | `race/bar_luck_fill` | CE8, CE9 |
| 60 | Consciencia textual | TextPicture `\V[104]%` | CE5, CE6 |
| 61 | `P_cena` textual | TextPicture `\V[103]%` | CE8, CE9 |
| 62 | Timer textual | TextPicture `TIMER: \V[120]s` | CE6 |
| 63 | Progresso de cena | TextPicture `\V[121]/\V[111]` | CE6 |

Observacoes:

- Picture IDs 41-44 tambem sao superficie de input por script inline `mzkp_commonEventId`.
- O spec diz que `P_cena` nao deve ser mostrado numericamente, mas CE8/CE9 mostram `\V[103]%` no Picture 61. Isso e drift factual entre intencao documentada e runtime estatico, nao validacao de UX.
- Todos os assets de picture referenciados por comandos `Show Picture` em Common Events existem no listing de `Jhonny/img/pictures/race/`.
- Assets listados mas nao referenciados nos Common Events lidos: `race/!opala_pov` e `race/overlay_flash_white`.

## Assets de Race Pictures

Referenciados e existentes no listing:

- `race/bar_consciencia_bg`
- `race/bar_consciencia_fill`
- `race/bar_luck_bg`
- `race/bar_luck_fill`
- `race/bg-ranking`
- `race/bg_curva`
- `race/bg_sinal`
- `race/btn_direita`
- `race/btn_esquerda`
- `race/btn_furar`
- `race/btn_parar`
- `race/curva_do_diabo_placa`
- `race/opala_pov`
- `race/overlay_risk_high`
- `race/overlay_risk_low`
- `race/overlay_risk_med`
- `race/placa_curva_dir`
- `race/sinal_red`
- `race/timer_bar`

Listados e nao referenciados nos Common Events lidos:

- `race/!opala_pov`
- `race/overlay_flash_white`

## Timing e Cues

| Superficie | Timing/cue documentado | Evidencia estatica em eventos |
| --- | --- | --- |
| Setup | 0,3s, fundo + botoes imediatamente | CE8/CE9 mostram background, POV, barras e botoes sem wait interno. |
| Input Sinal | 4,0s | Doc core loop; timer runtime em CE10, valor exato nao validado neste inventario. |
| Input Curva | 3,5s | Doc core loop; timer runtime em CE10, valor exato nao validado neste inventario. |
| Resolucao safe | 0,4s no spec | CE14 tem `Wait 12` frames e tints. |
| Resolucao risk sucesso | 0,4s no spec | CE15 tem shake, SE `pneu_cantando` e `Wait 18` frames. |
| Transicao | 0,2s no spec | CE7 apaga pictures de cena; CE5/CE14/CE15 usam waits/tints. Sincronia nao validada. |
| Resultado | Aguarda confirmacao | CE19 aguarda input no proprio CE, usa `SW_INPUT_LOCKED`, toca ME e limpa pictures. |
| Preload | 1 frame por asset | CE3 alterna Show Picture, `Wait 1`, Erase Picture. |

Audio cues observados:

- CE5: BGM `darkeletronic`, volume 90, pitch 100.
- CE11: SE `freada` e `Up1`.
- CE15: SE `pneu_cantando`.
- CE19: fadeout BGM, ME `Victory1` e `Defeat1`.

Audio cues documentados mas nao confirmados como comandos nos CEs lidos: motor subindo/caindo RPM, impacto metalico, ticks finais do timer, respiracao de restart, baixo caindo na Curva do Diabo.

## Mapas e Superficies de Cena

`MapInfos.json` lista 16 mapas. Superficies com nome de cena/VN ou final incluem `Prologo` (ID 11), `Estrada_VN1` (ID 10), `Quarto_VN2` (ID 5), `Estrada_VN3` (ID 13), `Batida` (ID 16), `FIM_TRUE_Estrada_VN4_SABOTAGEM` (ID 6), `Formatura_True` (ID 7), `JonnyFormando` (ID 8), `FIM_FALSE_Formatura_False` (ID 12), `Celular` (ID 9), `CelularVazio` (ID 14) e `Formatura_True2` (ID 15).

Cobertura: esses mapas foram apenas mapeados por nome/ID. Nenhum `MapXXX.json` foi lido neste envelope, entao staging VN, busts, backgrounds de mapas, entradas/saidas de personagem e CGs narrativos continuam fora de cobertura.

## Cobertura

Inspecionado em detalhe:

- Docs de corrida e runtime citados pelo catalogo.
- Common Events 3, 5-16, 18 e 19 para pictures, waits, audio, chamadas e plugins.
- Picture IDs e assets de `img/pictures/race` referenciados por Common Events.

Apenas mapeado:

- Mapas em `MapInfos.json`.
- Existencia de plugin VN busts informada por contexto tecnico.
- Assets de race por listing, sem dimensao, preview visual ou carregamento.

Nao encontrado nas fontes lidas:

- Inventario de CGs narrativos.
- Busts/sprites VN concretos.
- Cue sheet completa de audio.
- Background de resultado como asset real em Common Events.
- Validador de composicao visual, legibilidade, contraste, mix ou pacing.

Fora de escopo por envelope:

- Deep-read de `MapXXX.json`, plugins, `System.json`, audio folders, imagens binaras, Playtest, editor RPG Maker MZ e runtime browser.

## Riscos e Lacunas de Validacao

- `P_cena` aparece como TextPicture (`\V[103]%`) nos CEs de render, enquanto o spec diz que nao deve ser mostrado numericamente. Requer decisao de UX/design e Playtest.
- A Curva do Diabo esta descrita como pos-MVP, mas ha branch condicional e asset no renderer. Requer confirmar se o switch 105 deve permanecer sempre OFF no MVP.
- O spec descreve efeitos visuais/audio que nao foram confirmados nos Common Events lidos; pode ser backlog, doc-runtime drift ou implementacao em superficies nao lidas.
- A tela de resultado e baseada em TextPicture e ME; o fundo de resultado mencionado no spec nao foi confirmado como `Show Picture` nos CEs lidos.
- Input por pictures 41-44 depende de script inline e comportamento de plugin/input; inventario estatico nao valida clique/tap, hover, lock ou fila de Common Events.
- Preload confirma referencias estaticas, mas nao valida cache, decode, timing, fade-in, memoria ou tela preta.
- Nenhum timing, composicao, readability, camera, audio mix, input feel, contraste, acessibilidade ou cleanup foi validado por Playtest.

## Required Validations

- `technical-review` antes de qualquer plano que edite `CommonEvents.json`, plugins, mapas, pictures ou docs canonicos.
- `human-validation`/Playtest antes de declarar validos pacing, leitura, apresentacao visual, audio, input, tela de resultado, retry ou Curva do Diabo.
- `loki-rpg-maker-mz-data-json` para edicoes futuras em `Jhonny/data/*.json`.
- `loki-rpg-maker-mz-plugin-workflow` para edicoes futuras em plugins ou `plugins.js`.

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
