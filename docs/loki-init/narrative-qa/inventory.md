---
title: "Loki Init - Narrative QA Inventory"
tipo: "inventario narrative-qa"
status: "estatico-parcial"
agent: "narrative-qa"
date: "2026-06-30"
tags:
  - loki-init
  - narrative-qa
  - game-dev
  - rpg-maker-mz
  - jhonny
---

# Loki Init - Narrative QA Inventory

## Escopo

Inventario factual de QA narrativo para `/Users/edney/projects/coreto/summer26`,
com foco em continuidade, flags narrativas, rotas, regressao de conteudo,
alcancabilidade documentada, fontes de QA e lacunas de validacao.

Este inventario usa somente evidencia estatica. Nao valida route reachability,
leitura humana, pacing, save/load, comportamento de Common Events, UI,
audio, input ou finais em runtime.

## Fontes lidas

| Fonte | Uso neste inventario |
| --- | --- |
| `docs/loki-init/project-inventory.md` | Inventario comum, superficies sensiveis, stack, System IDs e lacunas gerais. |
| `docs/loki-init/technology-context.md` | Classificacao `game-dev`, stack RPG Maker MZ e gates de validacao. |
| `docs/index.xml` | Catalogo duravel e entradas existentes para `narrative-qa`, branching e docs de corrida. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Fonte principal de continuidade da corrida, estados, progressao e decisoes narrativas pendentes. |
| `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Contratos de retry, tela de resultado, input lock e Common Events relevantes a regressao narrativa. |
| `Jhonny/data/MapInfos.json` | Lista estatica de mapas e nomes de cenas/finais. |
| `docs/loki-init-inventory-contracts.md` do package Loki | Contrato universal e contrato especifico de `narrative-qa`. |

Nao foram lidos mapas individuais, `CommonEvents.json`, `System.json`,
dialogos, plugins, assets, saves ou planos historicos alem do que foi
resumido nas fontes autorizadas.

## Fatos Atuais

### Continuidade documentada

- A corrida e documentada como uma cadeia procedural de tres corridas fixas na
  narrativa: `Lenda` com 6 cenas, `Rachadura` com 8 cenas e `Abismo` com 10
  cenas.
- `Consciência` e o recurso visivel da corrida e e separado de `ConcernScore`,
  que e descrito como variavel oculta acumulada nas cenas VN e usada para
  finais.
- A documentacao de core loop declara que cenas VN, `ConcernScore`, finais e
  direcao de arte vivem fora do documento de corrida, em `Roleta Paulista`,
  que nao estava entre as fontes permitidas desta execucao.
- O retry documentado preserva `ConcernScore`, flags narrativas e o indice da
  corrida atual, mas reseta sequencia procedural, `P_cena`, `Consciência` e
  indice da cena da corrida.
- O retry nao deve repetir VN nem preload completo quando o fluxo validado pula
  esse trecho por tentativa. Essa regra e narrativa e tecnica: evita regressao
  de pacing por repeticao de VN entre tentativas.
- A tela canonica de fim de corrida e `EV_VitoriaCorrida`; o fluxo nao deve
  pular essa tela ao terminar as cenas da corrida.
- No MVP documentado, vencer a Corrida 3 leva a tela `"FIM" + "Obrigado por jogar!"`;
  modo endless/NG+ fica para v2.

### Flags e variaveis narrativas

| Estado | Evidencia estatica | QA narrativo |
| --- | --- | --- |
| `VAR_RACE_ID` | Identifica corrida 1, 2 ou 3; preservado entre restarts. | Estado chave para rota linear Lenda -> Rachadura -> Abismo. |
| `VAR_SCENE_INDEX` | Indice de cena da corrida; resetado no crash. | Define avanco local, mas nao prova reachability sem auditar eventos. |
| `VAR_RACE_N_CENAS` | 6, 8 ou 10 conforme corrida. | Deve permanecer coerente com progressao narrativa das tres corridas. |
| `VAR_ATTEMPT_N` | Incrementado em crash/init segundo docs. | Superficie de feedback narrativo de tentativa; requer Playtest para clareza. |
| `VAR_VITORIA_PASSOU` | Resultado 0/1 da tela de fim; reset defensivo no crash e no init. | Flag critica para evitar avancos ou retries errados. |
| `VAR_CONSCIENCIA` | Recurso visivel da corrida; resetado por corrida/retry. | Nao deve ser confundido com `ConcernScore`. |
| `VAR_PONTOS_GLORIA` | Pontuacao usada para thresholds 200/400/600. | Determina vitoria/derrota de corrida, nao final narrativo global. |
| `SW_RACE_ACTIVE` | Lifecycle da corrida. | Desligamento errado pode cortar handoff narrativo da tela de resultado. |
| `SW_INPUT_LOCKED` | Bloqueio de input em resultado/resolucao/transicoes. | Regressao pode permitir safe/risk consumir input da tela de resultado. |
| `SW_CRASH_FLAG` | Disparo de crash/retry. | Pode causar repeticao ou perda de continuidade se mal limpo. |
| `SW_IS_CURVA_DIABO` | Reservado para fase especial pos-MVP. | Nao deve ser tratado como feature MVP ativa. |

Observacao de consistencia: `Corrida - Core Loop.md` lista Editor IDs 100-117
para variaveis e 100-105 para switches, enquanto `project-inventory.md`
resume faixas como switches 101-106 e variaveis 101-122. Antes de qualquer
edicao futura, a fonte de verdade deve ser `System.json` impresso na faixa
afetada, conforme o proprio doc de core loop exige.

### Rotas e branches documentados

| Branch documentado | Pre-estado | Resultado documentado | Status QA |
| --- | --- | --- | --- |
| Corrida 1 passou | `VAR_RACE_ID == 1` e `VAR_VITORIA_PASSOU == 1` | Incrementa para Corrida 2 e chama `EV_RaceOrchestrator`. | Estrutura documentada; reachability pendente. |
| Corrida 1 falhou | `VAR_RACE_ID == 1` e `VAR_VITORIA_PASSOU == 0` | `EV_Crash`, retry da Corrida 1, incremento de tentativa. | Estrutura documentada; comportamento pendente. |
| Corrida 2 passou | `VAR_RACE_ID == 2` e `VAR_VITORIA_PASSOU == 1` | Incrementa para Corrida 3 e chama `EV_RaceOrchestrator`. | Estrutura documentada; reachability pendente. |
| Corrida 2 falhou | `VAR_RACE_ID == 2` e `VAR_VITORIA_PASSOU == 0` | Retry da Corrida 2. | Estrutura documentada; comportamento pendente. |
| Corrida 3 passou | `VAR_RACE_ID == 3` e `VAR_VITORIA_PASSOU == 1` | Tela `"FIM" + "Obrigado por jogar!"`. | MVP documentado; nao equivale a matriz de finais. |
| Corrida 3 falhou | `VAR_RACE_ID == 3` e `VAR_VITORIA_PASSOU == 0` | Retry da Corrida 3. | Estrutura documentada; comportamento pendente. |
| Intervencao por `ConcernScore` alto | `ConcernScore` alto no pitch | Substitui Curva do Diabo por sabotagem do Opala. | Referenciada, mas fonte canonica e runtime nao lidos. |
| Final 1/2/3 por `ConcernScore` | Pos-Corrida 3, conforme pitch | Final varia por `ConcernScore`. | Referenciado, nao inventariado nesta rodada. |

## Alcancabilidade Documentada

O inventario so encontrou alcancabilidade documentada, nao comprovada:

- O grafo de corrida documentado e linear por vitoria e cíclico por derrota.
- Os thresholds atuais documentados sao 200/400/600; a spec avisa para nao
  reintroduzir 60/100/150 sem decisao explicita de balanceamento.
- O catalogo declara que `narrative-qa` deve ser usado antes de QA narrativo
  ou route matrix, e que route matrix validada nao esta coberta.
- `MapInfos.json` lista 16 mapas, incluindo `Prologo`, `Estrada_VN1`,
  `Quarto_VN2`, `Estrada_VN3`, `FIM_TRUE_Estrada_VN4_SABOTAGEM`,
  `FIM_FALSE_Formatura_False`, `Formatura_True`, `Formatura_True2`,
  `JonnyFormando`, `Celular`, `CelularVazio` e `Batida`.
- Nomes de mapas sugerem superficie de finais true/false, sabotagem,
  celular e batida, mas `MapInfos.json` nao contem transferencias, condicoes
  de pagina, dialogos, comandos ou predicados de rota. Portanto nenhum desses
  mapas deve ser marcado como alcancavel ou inalcancavel com base neste
  inventario.

## Regressao de Conteudo

Riscos estaticos de regressao narrativa identificados nas fontes:

| Risco | Evidencia | Severidade |
| --- | --- | --- |
| Repetir VN em retry | Docs dizem que VN nao deve replayar entre tentativas e retry nao deve repetir preload completo. | Alta |
| Pular tela cerimonial | Runtime doc exige `EV_VitoriaCorrida` ao fim de corrida e branch pos-input. | Alta |
| Estado de vitoria persistir errado | `VAR_VITORIA_PASSOU` precisa reset defensivo em crash e init. | Alta |
| Consumir input de resultado como input de gameplay | `EV_KeyInput`, safe, risk, hover e timer devem respeitar `SW_INPUT_LOCKED`. | Alta |
| Tratar Curva do Diabo como MVP ativo | Core loop declara fase especial como pos-MVP e `SW_IS_CURVA_DIABO` reservado. | Media |
| Confundir `Consciência` com `ConcernScore` | Docs separam explicitamente recurso visivel de finalizador oculto. | Alta |
| Alterar thresholds como "fix" incidental | Docs alertam que 200/400/600 sao estado atual e 60/100/150 sao historicos. | Media |
| Declarar finais sem fonte canonica | Finais 1/2/3 e intervencao sao referenciados, mas pitch/rotas nao foram lidos. | Alta |

## Fontes De QA Narrativo Encontradas

- `docs/02-Core-Loop/Corrida - Core Loop.md`: fonte mais rica para continuidade
  do subsistema de corrida, relacao com VN, flags, thresholds e decisoes
  pendentes.
- `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`: fonte de contrato para
  regressao de tela de resultado, retry, input lock e Common Events.
- `docs/index.xml`: roteia para `narrative-qa`, `branching-narrative-designer`
  e docs de corrida, mas registra que route matrix e endings canonicos nao
  estao cobertos.
- `Jhonny/data/MapInfos.json`: evidencia estatica de superficies de mapa que
  devem entrar em auditoria futura de rotas/finais.

## Lacunas De Validacao

Itens que exigem Playtest, auditoria tecnica focada ou fonte canonica adicional:

- Route matrix completa com cenas VN, escolhas, `ConcernScore`, intervencao,
  finais e mapas finais.
- Auditoria de `MapXXX.json` para transferencias, paginas condicionais,
  self-switches, labels, chamadas de Common Events e conteudo inalcancavel.
- Confirmacao real de System IDs em `Jhonny/data/System.json` antes de qualquer
  alteracao em flags/variaveis.
- Verificacao de `CommonEvents.json` para garantir que CE5, CE7, CE18 e CE19
  implementam os contratos documentados.
- Save fixtures: antes da escolha/rota, durante corrida, tela de resultado,
  retry apos derrota, pos-vitoria de cada corrida e antes de finais.
- Playtest cego para pacing de retry sem VN, legibilidade de tentativa,
  comunicacao de `P_cena`, releitura narrativa de `Consciência`, e clareza de
  final MVP versus finais futuros.
- Revisao humana/sensivel caso a rota de batida, sabotagem ou finais trate
  dano, morte, culpa, luto ou conteudo emocionalmente sensivel.

## Mapa De Localizacao

| Informacao | Local atual |
| --- | --- |
| Spec de corrida, continuidade e thresholds | `docs/02-Core-Loop/Corrida - Core Loop.md` |
| Contratos de Common Events, retry e resultado | `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` |
| Catalogo navegavel de docs | `docs/index.xml` |
| Inventario comum do init | `docs/loki-init/project-inventory.md` |
| Contexto tecnico e gates | `docs/loki-init/technology-context.md` |
| Nomes de mapas e superficies de finais | `Jhonny/data/MapInfos.json` |
| Fonte de verdade futura para IDs | `Jhonny/data/System.json`, nao lido diretamente nesta rodada |
| Fonte futura para reachability | `Jhonny/data/Map*.json` e `Jhonny/data/CommonEvents.json`, nao lidos diretamente nesta rodada |

## Handoff Estruturado

```yaml
parallel_agent_response:
  agent: "narrative-qa"
  mode: "scoped-writer"
  summary: "Inventario estatico de QA narrativo criado para continuidade, flags, rotas documentadas, regressao de conteudo, alcance documentado e lacunas."
  affected_files:
    - "docs/loki-init/narrative-qa/inventory.md"
    - "planos/000-init-loki/retrospetivas/fase1/narrative-qa-retrospectiva.md"
  write_scope:
    mode: "init_context_scoped_writer"
    target_files:
      - "docs/loki-init/narrative-qa/**"
      - "planos/000-init-loki/retrospetivas/fase1/narrative-qa-retrospectiva.md"
    allowed_writes:
      - "docs/loki-init/narrative-qa/**"
      - "planos/000-init-loki/retrospetivas/fase1/narrative-qa-retrospectiva.md"
    scoped_write_domains:
      - "narrative-qa-reports"
      - "task-local-evidence"
    validators:
      - "static-source-review"
      - "no-runtime-validation-claimed"
    human_gates:
      - "human-validation"
  affected_runtime_surfaces:
    - "Jhonny/data/System.json"
    - "Jhonny/data/CommonEvents.json"
    - "Jhonny/data/MapInfos.json"
    - "Jhonny/data/Map*.json"
    - "RPG Maker MZ Playtest"
  affected_domain_ids:
    - "VAR_RACE_ID"
    - "VAR_SCENE_INDEX"
    - "VAR_RACE_N_CENAS"
    - "VAR_ATTEMPT_N"
    - "VAR_VITORIA_PASSOU"
    - "VAR_CONSCIENCIA"
    - "VAR_PONTOS_GLORIA"
    - "SW_RACE_ACTIVE"
    - "SW_INPUT_LOCKED"
    - "SW_CRASH_FLAG"
    - "SW_IS_CURVA_DIABO"
    - "ConcernScore"
  evidence:
    - "docs/02-Core-Loop/Corrida - Core Loop.md"
    - "docs/02-Core-Loop/Corrida - Runtime e Eventos.md"
    - "docs/loki-init/project-inventory.md"
    - "docs/loki-init/technology-context.md"
    - "docs/index.xml"
    - "Jhonny/data/MapInfos.json"
  findings:
    - type: "continuity"
      detail: "Tres corridas lineares por vitoria e retry por derrota estao documentados; VN nao deve repetir entre tentativas."
    - type: "flag"
      detail: "VAR_VITORIA_PASSOU, SW_INPUT_LOCKED e SW_RACE_ACTIVE sao flags criticas para evitar regressao de resultado/retry."
    - type: "route"
      detail: "Rotas globais por ConcernScore e finais 1/2/3 sao referenciados, mas nao estavam nas fontes autorizadas."
    - type: "ending"
      detail: "MVP documentado termina em tela FIM apos Corrida 3; finais true/false aparecem como nomes de mapas, nao como reachability validada."
    - type: "unreachable-content"
      detail: "Nenhum conteudo foi marcado como inalcancavel; MapInfos nao contem predicados de rota."
    - type: "regression"
      detail: "Riscos principais: repetir VN no retry, pular EV_VitoriaCorrida, persistir VAR_VITORIA_PASSOU, consumir input de resultado."
    - type: "open-question"
      detail: "Necessaria matriz futura de rotas com Map*.json, CommonEvents.json, System.json e Playtest/human validation."
  risks:
    - "Route reachability nao validada."
    - "IDs de System devem ser confirmados diretamente antes de edicoes."
    - "Curva do Diabo tem conflito de visao completa versus MVP e nao deve ser tratada como ativa sem decisao."
  confidence: "medium"
  model_class: "frontier_reasoning"
  effort: "high"
  required_validations:
    - "technical-review"
    - "human-validation"
  proposed_next_step: "Executar loki:tech-analysis focado em route matrix narrativa com System.json, CommonEvents.json e amostra dirigida de Map*.json antes de qualquer plano de correcao."
```
