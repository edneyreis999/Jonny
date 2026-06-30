---
title: "Loki Init - Gameplay Engineer Inventory"
tipo: "inventario gameplay engineering"
status: "static-only"
agent: "gameplay-engineer"
tags:
  - loki-init
  - gameplay-engineer
  - rpg-maker-mz
  - corrida
---

# Loki Init - Gameplay Engineer Inventory

Data: 2026-06-30
Consumer root: `/Users/edney/projects/coreto/summer26`
Inventory mode: `focused ownership` para mecanicas, estado, runtime surfaces, eventos, save/load e integracoes da corrida em Jhonny/RPG Maker MZ.

## Status

Este inventario e factual e estatico. Nenhum Playtest foi executado, nenhum runtime foi alterado e nenhum comportamento perceptivel, save/load, input, audio, UI, Common Event ou plugin foi declarado validado.

Evidence levels usados:

- `parse-valid`: arquivo estruturado aceito por parser local.
- `editor-structural`: dados parecem seguir estrutura RPG Maker MZ esperada.
- `static-risk`: evidencia local sugere risco ou implicacao tecnica, sem provar bug.
- `runtime-pending`: requer Playtest, engine/editor ou gate humano.

## Fontes lidas

| Fonte | Uso | Evidencia |
| --- | --- | --- |
| `docs/loki-init/project-inventory.md` | Contexto comum e limites de escrita. | Docs e runtime Jhonny identificados; runtime sensivel somente leitura. |
| `docs/loki-init/technology-context.md` | Stack e skills candidatas. | `selected_project_type: game-dev`, RPG Maker MZ, plugins ativos e gates humanos. |
| `docs/index.xml` | Catalogo duravel. | Docs de corrida catalogados como prioridade alta; entrada de gameplay-engineer existente no catalogo. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Spec mecanica e pseudo-codigo. | Loop safe/risk, RNG, thresholds, estado canonico e decisoes abertas. |
| `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Contrato runtime. | Invariantes de `SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `command117`, retry e tela de resultado. |
| `Jhonny/data/System.json` | IDs reais de switches/variaveis, start e autosave. | `parse-valid`; editor IDs 100-121 mapeados. |
| `Jhonny/data/CommonEvents.json` | Common Events e comandos da corrida. | `parse-valid`; grafo CE3, CE5-19 mapeado por command codes e scripts. |
| `Jhonny/data/MapInfos.json` | Lista estrutural de mapas. | `parse-valid`; 16 mapas nomeados, start map ID 11 `Prologo`. |
| `Jhonny/js/plugins.js` | Plugins ativos e parametros salvos. | Structured parse ok; 5 plugins ativos. |
| `Jhonny/js/plugins/Jhonny_RaceHelper.js` | Helper custom de corrida. | `node --check` sem erro; comandos/API mapeados estaticamente. |
| Package inventory contract | Contrato universal e `gameplay-engineer`. | Este arquivo cobre mecanicas implementadas, estado, runtime surfaces, callers, save/load, integracoes e fontes tecnicas. |

## Cobertura e limites

Inspecionado em detalhe:

- `System.json` para `gameTitle`, locale, resolucao, start map, autosave, switches e variaveis de corrida.
- `CommonEvents.json` para CEs de corrida, chamadas `code:117`, comandos de plugin `code:357`, scripts inline, pictures, audio, transfers e labels.
- `plugins.js` para ordem e parametros dos plugins ativos.
- `Jhonny_RaceHelper.js` para API global, input mapping, debug logging, thresholds e patch em `Scene_Map`.

Apenas mapeado:

- `MapInfos.json` lista mapas, mas nao prova quais map events chamam a corrida porque `MapXXX.json` nao estava no envelope de fontes.
- Assets referenciados por pictures foram identificados pelos nomes em Common Events, mas existencia/dimensoes nao foram auditadas neste agente.

Nao lido por escopo:

- `Jhonny/data/MapXXX.json`, `Jhonny/js/rmmz_*.js`, saves, assets binarios, audio real e docs fora da lista permitida.
- `Jhonny/CLAUDE.md`/`AGENTS.md`; o envelope desta chamada restringiu as fontes read-only a uma lista explicita.

## Mecanicas implementadas

### Loop safe/risk

Fatos atuais:

- A spec define uma corrida como QTE binario por cena: tipo `Sinal` ou `Curva`, cada uma com acao safe e risk.
- `EV_RenderSinal` (CE8) cria botoes/pictures e atribui Common Event de safe/risk por script a pictures 41/42.
- `EV_RenderCurva` (CE9) cria botoes/pictures e atribui safe/risk por script a pictures 43/44.
- `EV_KeyInput` (CE13, trigger 2, switch 100) usa `Input.isTriggered` para reservar CE11 ou CE12 via teclado quando `SW_INPUT_LOCKED` esta falso.
- `Jhonny_RaceHelper.js` estende `Input.keyMapper` para `A/D/S/W` alem das direcoes padrao.

Inferencias estaticas:

- Mouse/touch depende da integracao `ButtonPicture` + propriedade `mzkp_commonEventId` escrita nos objetos de picture.
- Teclado depende do helper para W/S/A/D e do runtime RPG Maker para `Input.isTriggered`.

Validacao pendente:

- Input feel, prioridade entre teclado e clique, duplo input, mobile/touch e ausencia de filas de Common Events exigem Playtest.

### Acao safe

Fatos atuais em `EV_OnSafe` (CE11):

- Recebe callers por timeout via CE10 e por input via CE8/CE9/CE13.
- Chama `EV_ResolucaoSafe` (CE14).
- Usa plugin command `Jhonny_RaceHelper.logRaceEvent` com `type: SAFE_CLICK`.
- Opera `VAR_CONSCIENCIA` (+10 e clamp defensivo para 100), `VAR_PONTOS_GLORIA` (+10), `VAR_SCENE_INDEX` (+1), `VAR_TIMER_TIMEOUT_FLAG` reset 0.
- Altera `SW_INPUT_LOCKED` e `SW_LAST_ACTION_SAFE`.
- Toca SE `freada` e `Up1`.

### Acao risk

Fatos atuais em `EV_OnRisk` (CE12):

- Recebe callers por scripts de input e ButtonPicture, nao por `code:117` direto.
- Calcula `VAR_TAXA_SUCESSO = clamp(VAR_CONSCIENCIA + VAR_P_CENA, 0, 100)`.
- Calcula `VAR_ROLL_RESULT = Math.floor(Math.random() * 100)`.
- Em sucesso, chama `EV_ResolucaoRiskOK` (CE15), incrementa cena e soma `VAR_P_CENA * 2` a `VAR_PONTOS_GLORIA`.
- Em falha, chama `EV_Crash` (CE18).
- Reduz `VAR_CONSCIENCIA` por `VAR_P_CENA` e faz clamp para 0.
- Usa `Jhonny_RaceHelper.logRaceEvent` com `RISK_SUCCESS` e `RISK_FAIL`.

### Timer e timeout

Fatos atuais:

- `EV_RaceTimer` (CE10, trigger 2, switch 100) decrementa `VAR_TIMER_FRAMES`, seta `VAR_TIMER_TIMEOUT_FLAG` e chama CE11 quando o tempo encerra.
- A spec de design diz que timeout executa safe automatico; a evidencia dos CEs confirma chamada para CE11.
- `EV_UpdateHud` (CE6, trigger 2, switch 100) calcula `VAR_TIMER_SECONDS` e atualiza TextPictures de HUD.

Validacao pendente:

- Frequencia real do tick, conversao frame/segundo, exibicao do timer e comportamento no frame limite exigem runtime.

### Renderer, RNG e sequencia

Fatos atuais:

- `EV_RaceRenderer` (CE7, trigger 2, switch 100) chama `EV_VitoriaCorrida` (CE19) quando `VAR_SCENE_INDEX >= VAR_RACE_N_CENAS`.
- CE7 chama `EV_RenderSinal` (CE8) e `EV_RenderCurva` (CE9).
- CE7 usa scripts `JhonnyRace.rollSceneType()`, `JhonnyRace.rollPCena()` e `Graphics.frameCount`.
- `Jhonny_RaceHelper.rollSceneType()` retorna Sinal 60% / Curva 40%.
- `Jhonny_RaceHelper.rollPCena()` retorna multiplos de 10 entre 0 e 100.
- `Jhonny_RaceHelper.createPRNG(seed)` existe, mas esta marcado como reservado para v2 e CE7 usa `Math.random` por helper.

Drift estatico:

- A spec descreve seed deterministica por corrida via `VAR_SEED`; o runtime atual seta `VAR_SEED`, mas o sorteio observado em CE7 usa helper baseado em `Math.random`, nao `createPRNG(seed)`. Isso e drift de implementacao a validar/decidir, nao bug runtime confirmado.

### Resultado, vitoria, derrota e retry

Fatos atuais:

- `EV_VitoriaCorrida` (CE19) recebe chamadas de CE7 e CE18.
- CE19 apaga pictures, faz fadeout de BGM, toca ME `Victory1` ou `Defeat1`, usa TextPicture para `VICTORY!`, `DEFEAT!`, `Glory Score: \V[105]` e `Press [SPACE] to continue`.
- `Jhonny_RaceHelper.Config.THRESHOLDS` define `{1: 200, 2: 400, 3: 600}` e `DEFAULT_THRESHOLD = 60`.
- `Jhonny_RaceHelper.isVictory(pontosGloria, raceId)` compara `VAR_PONTOS_GLORIA` contra threshold.
- CE19 chama CE5 para progredir para nova corrida quando aplicavel e transfere para mapas 5, 13 ou 16 conforme branches observados.
- CE18 chama CE19 para caminho de crash/resultado.

Drift estatico:

- `Corrida - Core Loop.md` diz em um trecho que risk action falha e timer expira causam crash/restart imediato, mas em secoes posteriores e nos CEs atuais timeout vai para safe automatico. A evidencia runtime atual favorece timeout como safe automatico, mas Playtest ainda e necessario.
- A spec contem aviso de que Curva do Diabo esta fora do MVP e `SW_IS_CURVA_DIABO` fica reservado. Common Events mostram referencias a `SW_IS_CURVA_DIABO`, tipo 2 e assets de Curva do Diabo em preload/render; isto e superficie a revisar antes de qualquer conclusao de produto.

## Estado e IDs

### Switches de corrida

Fonte: `Jhonny/data/System.json`, editor IDs 100-105.

| ID | Nome | Uso observado |
| --- | --- | --- |
| 100 | `SW_RACE_ACTIVE` | Ativa CEs paralelos de corrida: CE6, CE7, CE10, CE13 e CE16. |
| 101 | `SW_INPUT_LOCKED` | Bloqueia input durante resolucao/tela de resultado; consumido por CE13 e contratos runtime. |
| 102 | `SW_CRASH_FLAG` | Usado para forcar derrota/crash e reset defensivo. |
| 103 | `SW_LAST_ACTION_SAFE` | Marca ultima acao safe/risk para feedback/resolucao. |
| 104 | `SW_PAUSED` | Existe no System; uso profundo nao auditado. |
| 105 | `SW_IS_CURVA_DIABO` | Reservado/futuro segundo spec, mas aparece em operacoes de CE5/CE7/CE18. |

### Variaveis de corrida

Fonte: `Jhonny/data/System.json`, editor IDs 100-121.

| ID | Nome | Uso observado |
| --- | --- | --- |
| 100 | `VAR_RACE_ID` | Corrida atual, usada para tamanho e thresholds. |
| 101 | `VAR_SCENE_INDEX` | Indice da cena atual e condicao de fim. |
| 102 | `VAR_SCENE_TYPE` | Tipo de cena: Sinal/Curva e possivel tipo reservado. |
| 103 | `VAR_P_CENA` | Valor de risco/recompensa da cena. |
| 104 | `VAR_CONSCIENCIA` | Recurso principal, 0-100 por clamp. |
| 105 | `VAR_PONTOS_GLORIA` | Pontuacao da corrida, comparada com `VAR_GLORIA_META`. |
| 106 | `VAR_TAXA_SUCESSO` | Chance calculada de risk. |
| 107 | `VAR_ROLL_RESULT` | Roll 0-99 para risk. |
| 108 | `VAR_TIMER_FRAMES` | Timer em frames. |
| 109 | `VAR_SCENE_START` | Frame de inicio de cena. |
| 110 | `VAR_SEED` | Seed registrada no init da corrida; nao confirmada como fonte do RNG atual. |
| 111 | `VAR_RACE_N_CENAS` | Tamanho da corrida: 6/8/10 conforme race id. |
| 112 | `VAR_ATTEMPT_N` | Tentativa, incrementada no orchestrator. |
| 113 | `VAR_LAST_RENDERED_INDEX` | Controle para renderer. |
| 115 | `VAR_HOVER_LEVEL` | Nivel de hover/risco visual. |
| 116 | `VAR_TIMER_TIMEOUT_FLAG` | Flag de timeout. |
| 117 | `VAR_VITORIA_PASSOU` | Resultado da corrida, reset defensivo. |
| 119 | `VAR_GLORIA_META` | Threshold corrente exibido no HUD. |
| 120 | `VAR_TIMER_SECONDS` | Valor de timer para UI. |
| 121 | `VAR_SCENE_DISPLAY` | Display de cena atual no HUD. |

## Runtime surfaces

| Surface | Evidencia | Risco/validacao |
| --- | --- | --- |
| Common Events paralelos | CE6, CE7, CE10, CE13, CE16 usam trigger 2 e switch 100. | Ordem de execucao, starvation, fila e locks sao `runtime-pending`. |
| Common Event child calls | `code:117` liga CE5->CE3, CE7->CE19/8/9, CE10->CE11, CE11->CE14, CE12->CE15/18, CE18->CE19, CE19->CE5. | `command117` sincronico e citado como invariante nos docs; sem engine source nesta execucao. |
| Script calls inline | CEs usam scripts para helper, variables, picture callback, input e clear reservation. | Syntax de JSON parse ok; sem execucao runtime. |
| Pictures/UI | Preload CE3, renderer CE8/CE9, HUD CE6, resultado CE19 usam Show/Move/Erase Picture e TextPicture. | Visual fit, layers, cleanup e loading exigem Playtest. |
| Audio | CE5 BGM `darkeletronic`; CE11 SE `freada`/`Up1`; CE15 SE; CE19 ME `Victory1`/`Defeat1`. | Playback/mix/timing nao validado. |
| Input | ButtonPicture picture IDs e `EV_KeyInput`; helper W/S/A/D. | Input lock e prioridade de eventos nao validados. |
| Transfers | CE19 transfere para map IDs 5, 13 e 16; start map e ID 11 `Prologo`. | Reachability e coordenadas nao validadas sem Map JSON/Playtest. |
| Debug/logging | `EnableDebugLogs: true`; helper usa `console.log`, `console.warn`, `console[level]`. | Util para Playtest; release readiness depende de decisao futura. |

## Eventos e callers

| CE | Nome | Trigger/switch | Callers observados | Chama | Papel |
| --- | --- | --- | --- | --- | --- |
| 3 | `EV_Preload` | trigger 0 | CE5 | nenhum | Preload estatico de pictures de corrida. |
| 5 | `EV_RaceOrchestrator` | trigger 0 | CE19 | CE3 | Inicializa corrida, thresholds, seed, tentativa e estado base. |
| 6 | `EV_UpdateHud` | trigger 2 / switch 100 | paralelo por switch | nenhum | Atualiza HUD via TextPicture e move barra. |
| 7 | `EV_RaceRenderer` | trigger 2 / switch 100 | paralelo por switch | CE19, CE8, CE9 | Renderiza cena e detecta fim. |
| 8 | `EV_RenderSinal` | trigger 0 | CE7 | nenhum | Mostra sinal e liga pictures aos CEs 11/12. |
| 9 | `EV_RenderCurva` | trigger 0 | CE7 | nenhum | Mostra curva e liga pictures aos CEs 11/12. |
| 10 | `EV_RaceTimer` | trigger 2 / switch 100 | paralelo por switch | CE11 | Decrementa timer e timeout safe. |
| 11 | `EV_OnSafe` | trigger 0 | CE10, CE8/CE9/CE13 por input | CE14 | Resolve acao safe. |
| 12 | `EV_OnRisk` | trigger 0 | CE8/CE9/CE13 por input | CE15, CE18 | Resolve acao risk. |
| 13 | `EV_KeyInput` | trigger 2 / switch 100 | paralelo por switch | reserva CE11/CE12 via script | Input teclado. |
| 14 | `EV_ResolucaoSafe` | trigger 0 | CE11 | nenhum | Resolucao visual/timing safe. |
| 15 | `EV_ResolucaoRiskOK` | trigger 0 | CE12 | nenhum | Resolucao risk bem-sucedido. |
| 16 | `EV_HoverRiskButton` | trigger 2 / switch 100 | paralelo por switch | nenhum | Limpa/atualiza hover de risco. |
| 18 | `EV_Crash` | trigger 0 | CE12 | CE19 | Cleanup e rota de crash/derrota. |
| 19 | `EV_VitoriaCorrida` | trigger 0 | CE7, CE18 | CE5 | Tela de resultado, threshold e progressao/retry. |

## Integracoes

### Plugins ativos

Fonte: `Jhonny/js/plugins.js`.

| Ordem | Plugin | Status | Relevancia gameplay |
| --- | --- | --- | --- |
| 1 | `TextPicture` | ativo | Renderiza textos de HUD e resultado como pictures. |
| 2 | `ButtonPicture` | ativo | Base para picture clickable usada por safe/risk. |
| 3 | `Jhonny_RaceHelper` | ativo | Helper custom de RNG, input, debug, threshold e transicao. |
| 4 | `VisuMZ_0_CoreEngine` | ativo | Core plugin; parametros observados incluem console/F6 em Playtest e ModernControls. |
| 5 | `VisuMZ_2_VNPictureBusts` | ativo | VN/presentation; sem ownership direto de corrida confirmado neste recorte. |

### `Jhonny_RaceHelper`

Fatos atuais:

- Declara `@command logRaceEvent`.
- Registra `PluginManager.registerCommand(pluginName, "logRaceEvent", logRaceEvent)`.
- Expoe `window.JhonnyRace` com `rollSceneType`, `rollPCena`, `rollD100`, `clamp`, `createPRNG`, `playRaceStartEffect`, `logger`, `logRaceEvent`, `captureRaceState`, `isVictory` e `thresholdFor`.
- Patches `Input.keyMapper` para A/D/S/W.
- Patches `Scene_Map.prototype.update` para `updateJhonnyRaceStartEffect`.
- Captura variaveis 100-121 e switches 100-105 em logs.
- Usa `console.log`/`console.warn`/`console[level]` quando debug esta ativo.

Observacao:

- O header diz que nao implementa logica de jogo, mas thresholds e `isVictory` estao no helper. Isso e uma integracao de regra/tuning a preservar em futuras analises.

## Save/load implications

Fatos estaticos:

- `System.json` tem `optAutosave: true`.
- A corrida usa switches e variaveis globais do jogo (`SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `VAR_SCENE_INDEX`, `VAR_CONSCIENCIA`, `VAR_PONTOS_GLORIA`, `VAR_TIMER_FRAMES`, etc.).
- Pictures, audio, reservations de Common Event, estado do helper em `Scene_Map` e input transient aparecem como superficies runtime.
- Nenhum save file, `DataManager`, `StorageManager`, `makeSaveContents` ou `extractSaveContents` foi lido neste envelope.

Implicacoes:

- Se o jogador salvar/autosave durante corrida, tela de resultado, input lock, crash ou transicao, ha risco estatico de restaurar estado intermediario sem que pictures/audio/reservations/transient plugin state estejam coerentes.
- `SW_RACE_ACTIVE` e `SW_INPUT_LOCKED` sao superficies criticas: restaurar com locks ligados pode bloquear input; restaurar com corrida ativa pode religar CEs paralelos no meio do fluxo.
- `VAR_ATTEMPT_N`, `VAR_SEED`, `VAR_SCENE_INDEX`, `VAR_LAST_RENDERED_INDEX`, `VAR_VITORIA_PASSOU` e `VAR_GLORIA_META` precisam de smoke matrix antes de qualquer mudanca de save/load.

Validacao pendente:

- Testar title/continue, antes de escolha, durante timer, durante resultado, apos derrota, apos vitoria e apos transfer.
- Confirmar engine source local de save/load em uma futura `loki:tech-analysis` se compatibilidade de saves virar requisito.

## Mapa de localizacao

- Mecanica e tuning: `docs/02-Core-Loop/Corrida - Core Loop.md`.
- Contratos runtime e invariantes: `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`.
- IDs canonicos de estado: `Jhonny/data/System.json`.
- Implementacao por eventos: `Jhonny/data/CommonEvents.json`.
- Mapas conhecidos e start: `Jhonny/data/MapInfos.json`.
- Plugins ativos: `Jhonny/js/plugins.js`.
- Helper custom: `Jhonny/js/plugins/Jhonny_RaceHelper.js`.
- Catalogo navegavel: `docs/index.xml`.

## Validators executados

- Parse JSON: `Jhonny/data/System.json`, `Jhonny/data/CommonEvents.json`, `Jhonny/data/MapInfos.json`.
- Structured parse de `Jhonny/js/plugins.js` removendo comentario gerado e lendo array `$plugins`.
- `node --check Jhonny/js/plugins/Jhonny_RaceHelper.js`.
- Leitura estatica de docs de corrida e contrato de inventario.

Nao executados:

- Playtest, editor RPG Maker MZ, browser/NW.js, engine source semantic pass, asset existence pass, audio pass, save/load smoke test.

## Riscos e proximos gates

| Risco | Evidencia | Gate necessario |
| --- | --- | --- |
| Drift `sem plugins` vs runtime com TextPicture/ButtonPicture/helper. | Spec de implementacao diz sem plugins; `plugins.js` e CEs usam plugins. | `loki:tech-analysis` antes de refactor ou deploy. |
| Seed declarada vs RNG atual nao deterministico por `VAR_SEED`. | CE5 seta seed; CE7 usa `JhonnyRace.rollSceneType/rollPCena` baseados em `Math.random`. | Decisao tecnica/design + Playtest se determinismo importa. |
| Curva do Diabo reservada vs referencias runtime. | Spec diz fora do MVP; CEs manipulam switch/tipo/assets relacionados. | Revisao de escopo e Playtest de Corrida 3. |
| Save/load em estado intermediario. | `optAutosave: true` + CEs paralelos + locks + transient pictures/audio. | Save/load smoke test e possivel analise com engine source. |
| Input lock e fila de CEs. | CE13 e ButtonPicture podem reservar CE11/12; CE19 limpa reservations. | Playtest focado em duplo input, resultado e retry. |
| Debug logs ativos. | `EnableDebugLogs: true`; helper loga no console. | Decisao release/debug antes de build publico. |

## Required validations

- `technical-review` antes de qualquer plano que altere `CommonEvents.json`, plugin helper, plugin order, data IDs ou save/load.
- `loki-rpg-maker-mz-data-json` antes de editar `Jhonny/data/*.json`.
- `loki-rpg-maker-mz-plugin-workflow` antes de editar `Jhonny/js/plugins/**` ou `Jhonny/js/plugins.js`.
- `human-validation` antes de declarar gameplay, UI, input, audio, timer, result/retry, Common Events ou save/load como validos.

## Proposed next step

Executar `loki:tech-analysis` focado em "corrida runtime ownership e save/load/input lock" se a proxima fase for alterar Common Events, helper plugin, thresholds, Curva do Diabo, retry, tela de resultado ou compatibilidade de saves.
