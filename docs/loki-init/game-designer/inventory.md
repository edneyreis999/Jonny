---
title: "Loki Init - Game Designer Inventory"
tipo: "inventario factual de game design"
status: "parcial"
agent: "game-designer"
init_class: "init_inventory_domain_writer"
tags:
  - loki-init
  - game-designer
  - game-dev
  - rpg-maker-mz
  - corrida
---

# Loki Init - Game Designer Inventory

Data: 2026-06-30
Consumer root: `/Users/edney/projects/coreto/summer26`
Escopo: core loop, regras, mecanicas, feedback, progressao, sistemas, tuning,
balance surfaces e fontes de design do projeto Jhonny.

## Status

Inventario factual produzido em modo `focused ownership` para a corrida de
Jhonny/RPG Maker MZ. Este documento separa:

- `evidencia estatica`: fontes locais lidas ou parseadas;
- `inferencia de design`: leitura do proposito jogavel a partir das specs;
- `pendente de Playtest`: feel, ritmo, clareza, balanceamento, input, audio,
  feedback visual, save/load e comportamento perceptivel.

Nenhum runtime, JSON de jogo, plugin, asset, save, indice de docs ou arquivo de
configuracao foi alterado.

## Fontes lidas

| Fonte | Uso no inventario | Evidencia |
| --- | --- | --- |
| `docs/loki-init/project-inventory.md` | Contexto comum do init, limites de escrita e superficies sensiveis. | Documento lido; classifica `Jhonny/` como runtime RPG Maker MZ e lista docs principais. |
| `docs/loki-init/technology-context.md` | Stack, classificacao `game-dev`, plugins ativos por inventario comum e gates. | Documento lido; confirma RPG Maker MZ, projeto HTML5 1280x720 e skills tecnicas candidatas. |
| `docs/index.xml` | Catalogo navegavel para escolher menor leitura suficiente. | Documento lido; aponta `Corrida - Core Loop` e `Corrida - Runtime e Eventos` como fontes de alta prioridade. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Fonte primaria de intencao de design, regras, parametros, feedback e riscos. | Documento lido. |
| `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Fonte primaria de contratos runtime, Common Events e invariantes. | Documento lido. |
| `Jhonny/data/System.json` | IDs reais de switches, variaveis, titulo, locale e resolucao. | Parse JSON valido via `python3 -m json.tool`; campos relevantes extraidos por script read-only. |
| `Jhonny/data/CommonEvents.json` | Common Events, command codes, callers, variaveis, switches, plugin commands e scripts inline. | Parse JSON valido via `python3 -m json.tool`; CEs relevantes extraidos por script read-only. |
| Contrato de inventario do package | Cobertura universal e contrato do `game-designer`. | Lido em `/Users/edney/projects/coreto/loki-framework/docs/loki-init-inventory-contracts.md`. |
| Skill `loki-rpg-maker-mz-project-inventory` | Separacao entre evidencia estatica e comportamento pendente de runtime. | Lida com referencias `core-inventory-checklist.md` e `game-dev-domain-inventories.md`. |

## Cobertura

Inspecionado em detalhe:

- Docs duradouros catalogados da corrida.
- `System.json`: titulo, locale, resolucao, mapa inicial, switches 100-105 e
  variaveis 100-121.
- `CommonEvents.json`: CEs 3, 5, 6, 7, 10, 11, 12, 13, 16, 18 e 19, alem do
  mapa geral de Common Events 1-24.
- Command codes relevantes: `117` Call Common Event, `357` plugin command,
  `121` switches, `122` variaveis, `355` scripts inline e condicionais.

Apenas mapeado por inventario comum:

- Plugins ativos `TextPicture`, `ButtonPicture`, `Jhonny_RaceHelper`,
  `VisuMZ_0_CoreEngine` e `VisuMZ_2_VNPictureBusts`.
- Assets visuais `img/pictures/race/**`.

Nao inspecionado nesta passada:

- Mapas `MapXXX.json`, eventos de mapa chamadores, assets binarios, audio,
  saves, plugin files e engine source `js/rmmz_*.js`.
- `Roleta Paulista`, direcao de arte e pitch completo, porque nao estavam na
  lista de fontes read-only aprovada para este agente.
- Playtest, editor RPG Maker MZ, browser/NW.js, input real, audio e render.

## Mapa de localizacao

| Informacao de design | Onde encontrar |
| --- | --- |
| Intencao do core loop, regras e parametros | `docs/02-Core-Loop/Corrida - Core Loop.md` |
| Contratos runtime, retry, resultado e gates antes de JSON | `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` |
| IDs reais de switches e variaveis | `Jhonny/data/System.json` |
| Implementacao atual por Common Events | `Jhonny/data/CommonEvents.json` |
| Plugins e stack ativa | `docs/loki-init/technology-context.md` e `docs/loki-init/project-inventory.md` |
| Proximos gates e limites de validacao | `docs/loki-init/technology-context.md` e este inventario |

## Core loop factual

Evidencia estatica de design:

- A corrida e especificada como minigame roguelite timer-based de decisoes
  binarias, nao como steering racing.
- Unidade jogavel: cena com timer, tipo de cena, acao safe e acao risk.
- Tipos de cena documentados: `Sinal` e `Curva`.
- Safe documentado: `Parar` no sinal ou `Esquerda` na curva, sempre avanca,
  soma `+10` Consciência e soma `+10` Pontos de Gloria.
- Risk documentado: `Furar` no sinal ou `Direita` na curva, rola `0..99`
  contra `clamp(Consciência + P_cena, 0, 100)`, consome `P_cena`, avanca em
  sucesso e crasha em falha.
- `P_cena` documentado: valor por cena em `{0,10,20,...,100}`.
- Corridas documentadas: Lenda com 6 cenas, Rachadura com 8, Abismo com 10.
- Progressao documentada: vencer corrida atual avanca `VAR_RACE_ID`; derrota
  ou falha reinicia a mesma corrida.

Evidencia estatica implementada:

- `System.json` define `VAR_RACE_ID` em 100, `VAR_SCENE_INDEX` em 101,
  `VAR_SCENE_TYPE` em 102, `VAR_P_CENA` em 103, `VAR_CONSCIENCIA` em 104,
  `VAR_PONTOS_GLORIA` em 105, `VAR_TAXA_SUCESSO` em 106, `VAR_ROLL_RESULT` em
  107, `VAR_TIMER_FRAMES` em 108, `VAR_SEED` em 110, `VAR_RACE_N_CENAS` em
  111, `VAR_ATTEMPT_N` em 112, `VAR_VITORIA_PASSOU` em 117, `VAR_GLORIA_META`
  em 119, `VAR_TIMER_SECONDS` em 120 e `VAR_SCENE_DISPLAY` em 121.
- `System.json` define `SW_RACE_ACTIVE` em 100, `SW_INPUT_LOCKED` em 101,
  `SW_CRASH_FLAG` em 102, `SW_LAST_ACTION_SAFE` em 103, `SW_PAUSED` em 104 e
  `SW_IS_CURVA_DIABO` em 105.
- CE5 `EV_RaceOrchestrator` inicializa meta de Gloria por corrida, zera
  Consciência/Pontos/scene index, incrementa tentativa, gera seed e liga
  `SW_RACE_ACTIVE`.
- CE7 `EV_RaceRenderer` chama CE19 quando `VAR_SCENE_INDEX >=
  VAR_RACE_N_CENAS`, renderiza sinal/curva, define timer 240 frames para sinal
  e 210 frames para curva, e possui branch especial para corrida 3 cena 9 com
  `VAR_SCENE_TYPE=2`, `VAR_P_CENA=100` e `SW_IS_CURVA_DIABO=ON`.
- CE10 `EV_RaceTimer` decrementa `VAR_TIMER_FRAMES`; quando chega a zero,
  seta `VAR_TIMER_TIMEOUT_FLAG=1` e chama CE11 `EV_OnSafe`.
- CE11 `EV_OnSafe` aplica ganho de Consciência ate 100, soma `+10` Pontos de
  Gloria, seta ultima acao safe e avanca uma cena.
- CE12 `EV_OnRisk` calcula taxa, rola resultado, aplica custo de Consciência,
  soma `P_cena * 2` Pontos de Gloria em sucesso, avanca cena em sucesso e chama
  CE18 em falha.
- CE13 `EV_KeyInput` reserva CE11/CE12 por setas conforme tipo de cena quando
  `SW_INPUT_LOCKED` esta off.
- CE19 `EV_VitoriaCorrida` calcula vitoria por threshold 200/400/600 ou helper
  `window.JhonnyRace`, mostra texto de vitoria/derrota e decide progressao.

Inferencia de design:

- O jogo força uma economia de risco: safe e confiavel, mas sua pontuacao maxima
  documentada fica abaixo das metas atuais; risk e necessario para vencer.
- A profundidade pretendida vem da leitura de risco, da opacidade parcial de
  `P_cena` e do custo narrativo de gastar Consciência, nao de destreza de
  direcao veicular.
- O loop busca restart curto e iterativo: falhas devem devolver o jogador ao
  minigame da mesma corrida sem replay de VN.

Pendente de Playtest:

- Se a decisao safe/risk e clara sem mostrar `P_cena` numericamente.
- Se timers de 240/210 frames comunicam pressao sem parecer injustos.
- Se a necessidade matematica de risk para vencer e legivel e justa.
- Se restart, input por setas, feedback de hover e tela de resultado funcionam
  como experiencia perceptivel.

## Regras e mecanicas

| Superficie | Estado factual | Tipo de evidencia |
| --- | --- | --- |
| Cena `Sinal` | Safe = Parar; Risk = Furar; timer documentado 4,0s; CE7 usa 240 frames. | Design doc + CommonEvents parse-valid. |
| Cena `Curva` | Safe = Esquerda; Risk = Direita; timer documentado 3,5s; CE7 usa 210 frames. | Design doc + CommonEvents parse-valid. |
| Risk formula | `taxa = clamp(Consciência + P_cena, 0, 100)`; roll `0..99`; sucesso se roll < taxa. | Design doc + CE12 script inline. |
| Safe reward | `+10` Consciência, `+10` Pontos de Gloria, avanca cena. | Design doc + CE11 variables. |
| Risk reward | Sucesso soma `P_cena * 2` Pontos de Gloria; falha chama crash/result flow. | Design doc + CE12 script inline. |
| Resource reset | Consciência e Pontos de Gloria zeram no init da corrida; retry incrementa tentativa. | CE5 parse-valid. |
| Thresholds | Metas atuais 200, 400, 600 por `VAR_RACE_ID` 1, 2, 3. | Core loop + CE5/CE19 scripts inline. |
| Curva do Diabo | Documentada como visao completa e adiada no MVP, mas CE7 contem branch para corrida 3 cena 9 com `P_cena=100`. | Drift entre docs + CommonEvents parse-valid. |
| Timeout | TL;DR e edge cases indicam safe automatico; secao 7.1 ainda diz erro fatal; CE10 chama CE11 safe. | Conflito documental + CommonEvents parse-valid. |

## Feedback inventariado

Feedback documentado:

- Barra de Consciência sempre visivel no topo durante a corrida.
- Timer como barra horizontal fina ou texto/HUD, conforme evolucao do runtime.
- Hover em risk deve mostrar custo visual em niveis discretos, sem revelar
  numero exato de `P_cena`.
- Safe possui feedback visual/sonoro leve; risk sucesso possui aceleracao e
  custo de Consciência; crash possui shake/fade/ME.
- Tela de resultado usa VITORIA/DERROTA, Pontos de Gloria e prompt de
  confirmacao.

Feedback implementado em eventos:

- CE6 `EV_UpdateHud` cria TextPictures para `GLORY: \V[105]/\V[119]`,
  `TRIAL \V[112]`, `\V[104]%`, `TIMER: \V[120]s` e `\V[121]/\V[111]`.
- CE16 `EV_HoverRiskButton` zera `VAR_HOVER_LEVEL` e apaga pictures 22-24.
- CE19 usa TextPictures em ingles: `VICTORY!`, `DEFEAT!`,
  `Glory Score: \V[105]` e `Press [SPACE] to continue`.
- CE5, CE11, CE12, CE18 e CE19 invocam `Jhonny_RaceHelper.logRaceEvent` para
  eventos de debug/telemetria local.

Pendente de Playtest:

- Legibilidade do HUD, fit de texto, idioma misto PT/EN, timing de feedback,
  audio real, hover real, input real e clareza da tela de resultado.

## Progressao

Evidencia estatica:

- `VAR_RACE_ID` guarda corrida atual.
- CE5 define `VAR_RACE_N_CENAS` como 6 para corrida 1, 8 para corrida 2 e 10
  para corrida 3.
- CE5 calcula `VAR_GLORIA_META` por helper `window.JhonnyRace.thresholdFor` ou
  fallback 200/400/600.
- CE19 decide `VAR_VITORIA_PASSOU` usando `window.JhonnyRace.isVictory` ou
  fallback `pontos >= thresholds[raceId]`.
- CE19 chama CE5 no final do fluxo, preservando o papel de orquestrador.

Inferencia de design:

- A progressao entre corridas e linear e de escalada: mais cenas e metas maiores.
- A tela cerimonial transformou fim de corrida em checkpoint explicito, nao em
  transicao invisivel.
- `VAR_ATTEMPT_N` torna retry perceptivel/debugavel e pode reforcar leitura de
  repeticao roguelite.

Pendente de Playtest:

- Se as metas 200/400/600 produzem curva de dificuldade aceitavel.
- Se derrota por pontuacao apos completar cenas e compreendida como derrota
  legitima, nao bug.

## Sistemas afetados e superficies de balanceamento

| Sistema | Superficie de tuning | Estado atual |
| --- | --- | --- |
| Dificuldade temporal | Timer sinal 240 frames, curva 210 frames; sugestoes de encurtar na corrida 3 marcadas como Playtest. | Configurado em CE7; ajuste futuro exige Playtest. |
| Economia de risco | Safe `+10/+10`; risk `taxa=C+P`, custo `P`, recompensa `P*2`. | Implementado em CE11/CE12. |
| Distribuicao procedural | Tipo via `JhonnyRace.rollSceneType()`; `P_cena` via `JhonnyRace.rollPCena()`. | Chamadas existem em CE7; sem leitura do plugin nesta tarefa. |
| Thresholds | 200/400/600, `VAR_GLORIA_META` em 119. | Implementado por CE5/CE19; fairness pendente. |
| Restart | Nova seed no CE5; `EV_Crash` chama CE19 segundo parse atual. | Fluxo exato de retry requer runtime/tech-analysis. |
| Curva do Diabo | Switch 105 e branch CE7 para corrida 3 cena 9. | Conflito com nota de MVP adiado; precisa decisao antes de mexer. |
| UI/HUD | Pictures/TextPictures, ids 22-24, 52-56, 5 e HUD. | Inventariado parcialmente; assets nao foram lidos. |
| Input | CE13 usa setas; docs tambem citam W/S/A/D e mouse. | Teclado por setas confirmado; mouse/WASD dependem de surfaces nao lidas. |

## Conflitos e drift doc-runtime

- O core loop historico diz "sem plugins", mas o inventario comum e
  `CommonEvents.json` mostram uso atual de `TextPicture` e `Jhonny_RaceHelper`.
- A Curva do Diabo aparece no topo da spec como fora do MVP, mas CE7 contem
  implementacao estatica para corrida 3 cena final.
- Timeout tem conflito textual: uma secao fala em crash por expirar, enquanto
  TL;DR/edge cases e CE10 apontam para safe automatico.
- A tabela de riscos diz que vencer sem risk seria aceitavel/planejado em um
  ponto, mas thresholds atuais 200/400/600 tornam safe-only insuficiente.
- Documentacao usa termos em PT-BR; tela runtime inventariada via CE19 usa
  `VICTORY!`, `DEFEAT!`, `Glory Score` e `Press [SPACE] to continue`.
- `EV_Crash` chama CE19 no parse atual; isso pode representar derrota
  cerimonial em crash, mas o comportamento perceptivel e o retry real precisam
  de analise tecnica/runtime antes de conclusao.

## Open questions de design

- Curva do Diabo deve estar ativa no MVP ou permanecer reservada?
- Timeout canonico e safe automatico ou crash?
- O idioma da UI final deve ser PT-BR, EN ou misto intencional?
- `P_cena` deve continuar oculto numericamente ou o jogo precisa de leitura
  mais explicita para evitar percepcao de injustica?
- Os thresholds 200/400/600 sao meta final de balanceamento ou snapshot
  temporario de implementacao?
- A tela de derrota por pontuacao deve diferir de crash por risk falho?

## Validacoes exigidas

Antes de aceitar mudancas futuras de design como validadas:

- `technical-review` para qualquer plano que altere Common Events, plugins,
  data JSON, flow de retry ou thresholds.
- `human-validation`/Playtest para feel, timing, clareza de risk, legibilidade
  do HUD, audio, input, balanceamento, pacing, retry, curva de dificuldade e
  compreensao da derrota.
- Skill `loki-rpg-maker-mz-data-json` antes de editar `Jhonny/data/*.json`.
- Skill `loki-rpg-maker-mz-plugin-workflow` antes de editar
  `Jhonny/js/plugins/**` ou `Jhonny/js/plugins.js`.

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
