---
title: "Loki Init - Balance/Economy Inventory"
tipo: "inventario de balanceamento e economia"
status: "static-only"
agent: "balance-economy-designer"
tags:
  - loki-init
  - balance-economy
  - game-dev
  - rpg-maker-mz
---

# Loki Init - Balance/Economy Inventory

Data: 2026-06-30
Agente: `balance-economy-designer`
Escopo: inventario factual de progressao, atributos, recompensas, custos, recursos, sinks/sources, tabelas numericas, thresholds e lacunas de validacao de balanceamento para o projeto Jhonny.

## Status

Inventario completo para o envelope atual, com evidencia estatica somente. Nenhum Playtest, simulacao, runtime, editor RPG Maker MZ, plugin source, mapa, troop, item database, shop database ou asset foi executado ou alterado.

## Fontes lidas

| Fonte | Uso no inventario | Evidencia |
| --- | --- | --- |
| `docs/loki-init/project-inventory.md` | Escopo comum, superficies sensiveis e IDs previamente mapeados. | Documenta Jhonny como runtime RPG Maker MZ e alerta que runtime/data/assets sao somente leitura. |
| `docs/loki-init/technology-context.md` | Classificacao tecnica. | `selected_project_type: game-dev`; stack RPG Maker MZ; skills tecnicas candidatas. |
| `docs/index.xml` | Navegacao por catalogo. | Aponta `Corrida - Core Loop` para thresholds, variaveis, switches e tuning; aponta `Corrida - Runtime e Eventos` para Common Events e gates runtime. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Design numerico e intencao de economia interna. | Define Consciência, Pontos de Gloria, `P_cena`, risk/safe, timers, thresholds, riscos e decisoes de Playtest. |
| `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Contrato runtime documentado. | Define CEs 3, 5-7, 10-13, 16, 18 e 19, input lock, retry e tela de resultado. |
| `Jhonny/data/System.json` | Fonte estruturada de IDs e termos de sistema. | Parse JSON ok; variaveis/switches 100-121 e `currencyUnit` vazio. |
| `Jhonny/data/CommonEvents.json` | Fonte estruturada dos eventos de corrida. | Parse JSON ok; CEs e comandos de variaveis/scripts inspecionados estaticamente. |
| `docs/loki-init-inventory-contracts.md` | Contrato de conteudo do inventario. | Contrato universal e especifico de `balance-economy-designer`. |

## Cobertura

Inspecionado em detalhe:

- Recursos numericos da corrida em `System.json` e nos Common Events 5, 7, 10, 11, 12, 18 e 19.
- Tabelas de design documentadas em `Corrida - Core Loop.md`, incluindo thresholds, timers, scene counts e riscos de tuning.
- Presenca/ausencia de comandos RPG Maker MZ de ouro, item, equipamento, shop e parametro nos Common Events.

Apenas mapeado:

- Semantica de `JhonnyRace.rollSceneType()`, `JhonnyRace.rollPCena()`, `JhonnyRace.thresholdFor()` e `JhonnyRace.isVictory()`, porque o plugin source nao estava no envelope de fontes.
- Progressao apos transferencias de `EV_VitoriaCorrida`, porque mapas/eventos de destino nao estavam no envelope de fontes.

Nao encontrado nas fontes lidas:

- Lojas, moedas de compra, precos, drops, itens, armas, armaduras, EXP, nivel, classes, skills de combate ou tabelas de inimigos.
- Comandos de Common Event para gold/item/weapon/armor/shop/EXP/level/parameter/skill/state em `Jhonny/data/CommonEvents.json`.

Fora de escopo deste envelope:

- `Actors.json`, `Classes.json`, `Skills.json`, `Items.json`, `Weapons.json`, `Armors.json`, `Enemies.json`, `Troops.json`, `States.json`, `Map*.json`, `MapInfos.json`, `js/plugins.js`, `js/plugins/Jhonny_RaceHelper.js`, assets e saves.

## Mapa de localizacao

| Dominio | Onde procurar primeiro | Observacao |
| --- | --- | --- |
| IDs canonicos de recursos | `Jhonny/data/System.json` variaveis 100-121 e switches 100-105 | Editor ID coincide com indice de array, conforme docs. |
| Loop de inicializacao da corrida | `Jhonny/data/CommonEvents.json` CE5 `EV_RaceOrchestrator` | Reseta Consciência/Gloria, define cenas, meta e seed. |
| Geracao de cena e `P_cena` | CE7 `EV_RaceRenderer` | Usa `JhonnyRace.rollSceneType()`, `JhonnyRace.rollPCena()` ou fixa Curva do Diabo. |
| Timer e timeout | CE10 `EV_RaceTimer` | Decrementa `VAR_TIMER_FRAMES`; timeout chama CE11. |
| Acao safe | CE11 `EV_OnSafe` | Fonte de Consciência e Pontos de Gloria. |
| Acao risk | CE12 `EV_OnRisk` | Custo de Consciência, roll, reward de Gloria e crash. |
| Resultado/threshold | CE19 `EV_VitoriaCorrida` | Calcula `VAR_VITORIA_PASSOU` com thresholds ou helper plugin. |
| Contrato narrativo/numerico | `docs/02-Core-Loop/Corrida - Core Loop.md` | Fonte de intencao, riscos e perguntas de Playtest. |
| Contrato runtime | `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Fonte de invariantes, retry e gates antes de editar JSON. |

## Fatos atuais de progressao e recursos

`System.json` registra `gameTitle: Bye Bye Jhonny`, `locale: pt_BR`, `currencyUnit: ""`, `optDisplayTp: false`, `optSlipDeath: false` e `optFloorDeath: false`. O inventario nao encontrou uma economia monetaria ativa nas fontes permitidas.

Recursos e atributos de corrida registrados em `System.json`:

| Editor ID | Nome | Papel de balance/economia |
| --- | --- | --- |
| 100 | `VAR_RACE_ID` | Corrida atual, documentada como 1, 2 ou 3. |
| 101 | `VAR_SCENE_INDEX` | Progresso dentro da corrida. |
| 102 | `VAR_SCENE_TYPE` | Tipo de cena: doc define 0=Sinal, 1=Curva, 2=Curva do Diabo/reservado. |
| 103 | `VAR_P_CENA` | Peso/custo/recompensa potencial da cena. |
| 104 | `VAR_CONSCIENCIA` | Recurso central visivel, 0-100. |
| 105 | `VAR_PONTOS_GLORIA` | Pontuacao usada no threshold de vitoria. |
| 106 | `VAR_TAXA_SUCESSO` | Taxa calculada da acao risk. |
| 107 | `VAR_ROLL_RESULT` | Roll 0-99 documentado e implementado por script inline. |
| 108 | `VAR_TIMER_FRAMES` | Timer em frames; CE7 usa 240 para sinal e 210 para curva. |
| 110 | `VAR_SEED` | Seed gerada no inicio da corrida. |
| 111 | `VAR_RACE_N_CENAS` | Numero de cenas: 6, 8 ou 10 por corrida. |
| 112 | `VAR_ATTEMPT_N` | Numero de tentativa. |
| 117 | `VAR_VITORIA_PASSOU` | Resultado do threshold check. |
| 119 | `VAR_GLORIA_META` | Meta/threshold visivel ou interna, definida no CE5 por helper/fallback. |
| 120 | `VAR_TIMER_SECONDS` | Variavel presente no sistema; CE5 seta 0. |
| 121 | `VAR_SCENE_DISPLAY` | Variavel presente no sistema; CE5 seta 1. |

Switches relevantes registrados em `System.json`:

| Editor ID | Nome | Papel |
| --- | --- | --- |
| 100 | `SW_RACE_ACTIVE` | Lifecycle da corrida. |
| 101 | `SW_INPUT_LOCKED` | Bloqueio de input durante setup/resolucao/resultado. |
| 102 | `SW_CRASH_FLAG` | Flag de crash/derrota forcada. |
| 103 | `SW_LAST_ACTION_SAFE` | Ultima acao safe/risk para feedback. |
| 104 | `SW_PAUSED` | Pausa. |
| 105 | `SW_IS_CURVA_DIABO` | Reservada/acionada pela cena especial no CE7, embora docs digam pos-MVP/intocada para MVP. |

## Tabelas numericas encontradas

| Parametro | Valor atual documentado ou observado | Fonte |
| --- | --- | --- |
| Corrida 1 | 6 cenas, threshold 200 | `Corrida - Core Loop.md`; CE5 seta `VAR_RACE_N_CENAS = 6`; CE19 fallback `{1:200}`. |
| Corrida 2 | 8 cenas, threshold 400 | `Corrida - Core Loop.md`; CE5 seta `VAR_RACE_N_CENAS = 8`; CE19 fallback `{2:400}`. |
| Corrida 3 | 10 cenas, threshold 600 | `Corrida - Core Loop.md`; CE5 seta `VAR_RACE_N_CENAS = 10`; CE19 fallback `{3:600}`. |
| Safe | +10 Consciência, +10 Pontos de Gloria | `Corrida - Core Loop.md`; CE11 incrementa `VAR_CONSCIENCIA` e `VAR_PONTOS_GLORIA`. |
| Risk success | Taxa `clamp(Consciência + P_cena, 0, 100)`, roll 0-99, reward `P_cena * 2` | `Corrida - Core Loop.md`; CE12 scripts setam `VAR_TAXA_SUCESSO`, `VAR_ROLL_RESULT` e somam Gloria. |
| Risk cost | `P_cena` em Consciência, minimo 0 | `Corrida - Core Loop.md`; CE12 subtrai `VAR_P_CENA` de `VAR_CONSCIENCIA` ou zera quando insuficiente. |
| `P_cena` padrao | Docs dizem U{0,10,...,100}; CE7 chama `JhonnyRace.rollPCena()` | Semantica do helper nao confirmada porque plugin source nao foi fonte permitida. |
| Curva do Diabo | Race 3, scene index 9, `VAR_SCENE_TYPE=2`, `VAR_P_CENA=100` | CE7 fixa esses valores quando `VAR_RACE_ID === 3 && VAR_SCENE_INDEX === 9`. |
| Timer Sinal | 240 frames, doc equivalente 4,0s | CE7 seta `VAR_TIMER_FRAMES=240` quando cena tipo 0. |
| Timer Curva | 210 frames, doc equivalente 3,5s | CE7 seta `VAR_TIMER_FRAMES=210` nos demais casos. |
| Timeout | Executa safe automatico | CE10 seta `VAR_TIMER_TIMEOUT_FLAG=1` e chama CE11. |
| Threshold fallback inesperado | 60 | CE5/CE19 scripts usam fallback `(fallback[raceId] || 60)` / `(thresholds[raceId] || 60)`. |

Observacao: `Corrida - Core Loop.md` registra que thresholds historicos `60/100/150` nao devem ser reintroduzidos sem decisao explicita. Este inventario confirma fallback `60` para race id inesperado nos scripts inline, mas nao encontrou `100/150` nos Common Events lidos.

## Sources e sinks

| Recurso | Sources | Sinks/custos | Reset/gate |
| --- | --- | --- | --- |
| `VAR_CONSCIENCIA` | CE11 safe: +10 ate cap 100. | CE12 risk: subtrai `VAR_P_CENA` ou zera. | CE5 inicializa 0. CE18 nao contem `Control Variables` para reset nas fontes lidas. |
| `VAR_PONTOS_GLORIA` | CE11 safe: +10. CE12 risk success: `P_cena * 2`. | Threshold check exige 200/400/600 para passar; derrota reinicia fluxo. | CE5 inicializa 0. |
| `VAR_P_CENA` | CE7 fixa 100 na Curva do Diabo; caso normal chama `JhonnyRace.rollPCena()`. | Alimenta custo de Consciência e reward risk. | Recalculado por cena quando `VAR_SCENE_INDEX` muda. |
| `VAR_TIMER_FRAMES` | CE7 seta 240 ou 210. | CE10 decrementa 1 por tick. | Ao chegar a 0, CE10 chama CE11 como safe automatico. |
| `VAR_ATTEMPT_N` | CE5 incrementa +1 no init. | Sem sink economico. | Usado como feedback/controle de tentativa; runtime nao validado. |
| `VAR_GLORIA_META` | CE5 usa `JhonnyRace.thresholdFor(raceId)` ou fallback 200/400/600/60. | Nao ha sink direto. | Fonte visual/estado de meta; uso posterior nao confirmado fora do CE5. |

## Recompensas, custos e lojas

Recompensas ativas encontradas:

- Safe: avanca 1 cena, +10 Consciência e +10 Pontos de Gloria.
- Risk success: avanca 1 cena, +`P_cena * 2` Pontos de Gloria e paga `P_cena` em Consciência.
- Vitoria por threshold: CE19 transfere para mapas diferentes conforme `VAR_RACE_ID`; progressao narrativa final nao foi confirmada porque mapas/eventos de destino nao estavam nas fontes permitidas.

Custos/sinks ativos encontrados:

- Risk: custo em Consciência igual a `P_cena`.
- Thresholds: Pontos de Gloria funcionam como requisito de progressao, nao como moeda gasta.
- Timeout: converte falta de input em safe automatico; isso evita crash, mas remove oportunidade de reward risk.
- Derrota/crash: CE12 chama CE18 em risk fail; CE18 chama CE19 e ativa fluxo de derrota/resultado.

Lojas/economia externa:

- `System.json` tem `currencyUnit` vazio.
- `CommonEvents.json` nao contem comandos de gold, item, weapon, armor, shop processing, EXP, level, parameter, skill ou state em nenhum Common Event.
- Nenhuma fonte permitida demonstrou loja, preco, drop, inventario de compra, item consumivel, power-up, arma, armadura ou EXP ativo.

## Achados de risco e lacunas

| Tipo | Achado | Evidencia | Status |
| --- | --- | --- | --- |
| `difficulty` | Thresholds 200/400/600 tornam risk matematicamente necessario; safe-only maximo documentado e 60/80/100. | `Corrida - Core Loop.md`; CE19 fallback 200/400/600. | Static-risk; requer Playtest para dificuldade percebida. |
| `tuning` | Distribuicao normal de `P_cena` e declarada uniforme nos docs, mas implementacao real esta atras de `JhonnyRace.rollPCena()`. | CE7 chama helper; plugin source nao permitido. | Lacuna de fonte. |
| `progression` | CE19 nas fontes lidas transfere conforme `VAR_RACE_ID`, mas nao mostra incremento de `VAR_RACE_ID`. | CE19 list contem transfers para mapas 5, 13 e 16; sem `Control Variables` de `VAR_RACE_ID`. | Progressao entre corridas depende de mapas/eventos fora do envelope ou doc-runtime drift. |
| `reward` | CE19 usa textos em ingles (`VICTORY!`, `DEFEAT!`, `Glory Score`) enquanto docs descrevem pt_BR. | CE19 TextPicture commands; `System.json` locale `pt_BR`. | Localizacao/UX, nao tuning numerico. |
| `cost` | CE18 documentado como reset de variaveis no runtime doc, mas Common Event lido nao tem `Control Variables`; CE5 faz reset no novo init. | CE18 list; CE5 list. | Lacuna/conflito estatico; nao declarar bug sem Playtest/source map de fluxo. |
| `exploit` | Timeout vira safe automatico. | CE10 chama CE11 ao timer zerar. | Pode reduzir pressao se jogador evitar risco; docs tratam como risco de balanceamento. |
| `exploit` | Fallback threshold `60` para race id inesperado pode facilitar vitoria se `VAR_RACE_ID` sair de 1-3. | CE5/CE19 scripts inline. | Static-risk; precisa analise tecnica se race id puder escapar. |
| `difficulty` | Curva do Diabo `P_cena=100` tem sucesso garantido pelo clamp, mas zera Consciência. | Docs e CE7. | Hipotese narrativa/tuning pendente de Playtest; docs tambem dizem pos-MVP em callout, enquanto CE7 implementa branch. |
| `open-question` | `VAR_GLORIA_META`, `VAR_TIMER_SECONDS` e `VAR_SCENE_DISPLAY` existem no sistema; uso completo nao foi rastreado fora dos CEs permitidos. | `System.json`; CE5. | Map/event/plugin pass futuro. |

## Validacoes feitas

- `jq empty Jhonny/data/System.json`: passou.
- `jq empty Jhonny/data/CommonEvents.json`: passou.
- Query estruturada em `CommonEvents.json` nao encontrou comandos de gold, item, weapon, armor, shop, EXP, level, parameter, skill ou state em nenhum Common Event.
- Nenhum arquivo runtime, data JSON, plugin, asset, save, `.agents/**`, `.codex/**`, `.claude/**`, `AGENTS.md`, `CLAUDE.md` ou `docs/index.xml` foi alterado por este agente.

## Validacoes ainda requeridas

- `technical-review` antes de transformar estes achados em task de edicao de data/plugin/runtime.
- `human-validation`/Playtest antes de declarar dificuldade, pacing, feedback, compreensao de `P_cena`, fairness de thresholds, tensao do timeout, Curva do Diabo, retry ou progressao como validos.
- `loki-rpg-maker-mz-data-json` antes de qualquer edicao futura em `Jhonny/data/*.json`.
- `loki-rpg-maker-mz-plugin-workflow` antes de qualquer edicao futura em `Jhonny/js/plugins/**` ou `Jhonny/js/plugins.js`.
- Analise tecnica focada se o proximo passo depender de confirmar `JhonnyRace.rollPCena()`, `thresholdFor()`, `isVictory()`, maps de transferencia ou incremento real de `VAR_RACE_ID`.

## Handoff estruturado

```yaml
parallel_agent_response:
  agent: "balance-economy-designer"
  mode: "scoped-writer"
  summary: "Inventario static-only da economia interna da corrida: Consciência, Pontos de Gloria, P_cena, thresholds 200/400/600, timers, sources/sinks e lacunas de validacao."
  affected_files:
    - "docs/loki-init/balance-economy-designer/index.md"
    - "planos/000-init-loki/retrospetivas/fase1/balance-economy-designer-retrospectiva.md"
  write_scope:
    mode: "init_context_scoped_writer"
    target_files:
      - "docs/loki-init/balance-economy-designer/index.md"
      - "planos/000-init-loki/retrospetivas/fase1/balance-economy-designer-retrospectiva.md"
    allowed_writes:
      - "docs/loki-init/balance-economy-designer/**"
      - "planos/000-init-loki/retrospetivas/fase1/balance-economy-designer-retrospectiva.md"
    scoped_write_domains:
      - "balance-tables"
      - "economy-config"
      - "progression-data"
      - "tuning-docs"
    validators:
      - "jq empty Jhonny/data/System.json"
      - "jq empty Jhonny/data/CommonEvents.json"
      - "structured CommonEvents command query for economy/shop/database commands"
    human_gates:
      - "human-validation"
  affected_runtime_surfaces:
    - "read-only:Jhonny/data/System.json"
    - "read-only:Jhonny/data/CommonEvents.json"
    - "runtime-pending:race Common Events 5, 7, 10, 11, 12, 18, 19"
  affected_domain_ids:
    - "VAR_RACE_ID:100"
    - "VAR_SCENE_INDEX:101"
    - "VAR_SCENE_TYPE:102"
    - "VAR_P_CENA:103"
    - "VAR_CONSCIENCIA:104"
    - "VAR_PONTOS_GLORIA:105"
    - "VAR_TAXA_SUCESSO:106"
    - "VAR_ROLL_RESULT:107"
    - "VAR_TIMER_FRAMES:108"
    - "VAR_SEED:110"
    - "VAR_RACE_N_CENAS:111"
    - "VAR_ATTEMPT_N:112"
    - "VAR_VITORIA_PASSOU:117"
    - "VAR_GLORIA_META:119"
    - "SW_RACE_ACTIVE:100"
    - "SW_INPUT_LOCKED:101"
    - "SW_CRASH_FLAG:102"
    - "SW_LAST_ACTION_SAFE:103"
    - "SW_PAUSED:104"
    - "SW_IS_CURVA_DIABO:105"
    - "CE5:EV_RaceOrchestrator"
    - "CE7:EV_RaceRenderer"
    - "CE10:EV_RaceTimer"
    - "CE11:EV_OnSafe"
    - "CE12:EV_OnRisk"
    - "CE18:EV_Crash"
    - "CE19:EV_VitoriaCorrida"
  evidence:
    - "docs/02-Core-Loop/Corrida - Core Loop.md"
    - "docs/02-Core-Loop/Corrida - Runtime e Eventos.md"
    - "Jhonny/data/System.json"
    - "Jhonny/data/CommonEvents.json"
  findings:
    - type: "progression"
      detail: "Corridas documentadas como 6/8/10 cenas com thresholds 200/400/600; CE5/CE19 usam esses valores como fallback principal."
    - type: "reward"
      detail: "Safe concede +10 Consciência e +10 Pontos de Gloria; risk success concede P_cena*2 Pontos de Gloria."
    - type: "cost"
      detail: "Risk consome P_cena de Consciência, com piso 0."
    - type: "shop"
      detail: "Nenhuma loja, moeda de compra, item, drop, EXP ou database economy ativa foi encontrada nas fontes permitidas."
    - type: "exploit"
      detail: "Fallback threshold 60 para race id inesperado e timeout como safe automatico sao superficies de tuning/risk."
    - type: "tuning"
      detail: "Distribuicao real de P_cena e thresholds helper dependem de Jhonny_RaceHelper, nao lido neste envelope."
    - type: "open-question"
      detail: "Progressao real entre corridas depende de mapas/eventos de transferencia ou plugin/map logic fora das fontes permitidas."
  risks:
    - "Nao declarar balance validado sem Playtest."
    - "Nao editar thresholds ou formulas como refactor incidental."
    - "Nao assumir loja/database ausente globalmente sem ler database arrays e mapas em analise posterior."
  confidence: "medium"
  model_class: "frontier_reasoning"
  effort: "high"
  required_validations:
    - "technical-review"
    - "human-validation"
  proposed_next_step: "Se tuning for prioridade, rodar loki:tech-analysis focado em Jhonny_RaceHelper, Map events de progressao, CE18/CE19 reset/progressao e uma matriz de Playtest para thresholds 200/400/600."
```
