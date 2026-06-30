---
title: "Loki Init - Level Designer Inventory"
tipo: "inventario de level design"
status: "parcial"
tags:
  - loki-init
  - level-design
  - rpg-maker-mz
  - jhonny
---

# Loki Init - Level Designer Inventory

Data: 2026-06-30
Agente: level-designer
Modo de inventario: focused ownership, leitura estatica de mapas, navegacao e ritmo espacial/temporal

## Escopo

Este inventario cobre mapas/areas, navegacao, gating, encounters, ritmo espacial e temporal, pontos de interesse, fontes de layout e lacunas de validacao para o projeto RPG Maker MZ `Jhonny/`.

O trabalho foi somente leitura para runtime. Nenhum mapa, evento, tileset, database, plugin, asset, save, `docs/index.xml`, `.claude/**`, `.codex/**`, `.agents/**`, `AGENTS.md` ou `CLAUDE.md` foi alterado.

## Fontes Lidas

| Fonte | Uso no inventario | Evidencia |
| --- | --- | --- |
| `docs/loki-init/project-inventory.md` | Contexto comum, start map, System IDs ja inventariados, Common Events relevantes e limites de validacao. | Documento duradouro do init. |
| `docs/loki-init/technology-context.md` | Classificacao `game-dev`, stack RPG Maker MZ e plugins ativos. | Documento duradouro do init. |
| `docs/index.xml` | Catalogo navegavel e indicacao de docs relevantes. | XML existente em `docs/`. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Design documentado do loop da corrida, cenas temporizadas, thresholds, restart e pacing. | Spec mecanica da corrida. |
| `Jhonny/data/MapInfos.json` | Lista de mapas, nomes, hierarquia e ordem. | JSON parseado. |
| `Jhonny/data/Map001.json` a `Jhonny/data/Map016.json` | Dimensoes, eventos, paginas, triggers, transfers, Common Event calls, plugin commands, encounters e autorun/parallel surfaces. | JSON parseado. |
| `docs/loki-init-inventory-contracts.md` | Contrato universal e contrato `level-designer`. | Contrato do pacote Loki. |

Fontes importantes nao lidas diretamente neste inventario: `Jhonny/data/CommonEvents.json`, `Jhonny/data/System.json`, tilesets, assets visuais, plugins e saves. Quando citados, esses fatos vieram dos documentos comuns do init ou do core loop, nao de nova auditoria direta nesta etapa.

## Mapa de Localizacao

| Informacao | Onde procurar |
| --- | --- |
| Lista canonica de mapas | `Jhonny/data/MapInfos.json` |
| Eventos, transfers e triggers de um mapa | `Jhonny/data/MapNNN.json` |
| Start map e variaveis/switches da corrida | `docs/loki-init/project-inventory.md` e, em analise tecnica futura, `Jhonny/data/System.json` |
| Loop temporal da corrida | `docs/02-Core-Loop/Corrida - Core Loop.md` |
| Runtime da corrida por Common Events | `docs/loki-init/project-inventory.md` e, em analise tecnica futura, `Jhonny/data/CommonEvents.json` |
| Plugins que afetam apresentacao VN/corrida | `docs/loki-init/technology-context.md` e, em analise tecnica futura, `Jhonny/js/plugins.js` |

## Areas e Papeis dos Mapas

| ID | Nome | Tamanho | Papel estatico observado | Eventos/triggers | Navegacao observada |
| --- | --- | ---: | --- | --- | --- |
| 1 | `MAP001` | 17x13 | Hub/staging da corrida. | 1 evento, 3 paginas autorun condicionadas por `V100>=1`, `V100>=2`, `V100>=3`; cada pagina chama CE5. | Sem transfer de saida no mapa; entradas vindas de mapas 5, 10 e 13. |
| 2 | `mapa-semaforo` | 26x15 | Mapa de estrada/teste ou POI de semaforo. | 5 eventos action vazios. | Sem transfer, sem Common Event call. |
| 3 | `mapa-atalho` | 26x15 | Mapa de estrada/teste ou POI de atalho. | 4 eventos action vazios. | Sem transfer, sem Common Event call. |
| 4 | `Mapa-fase2` | 17x13 | Staging/teste de fase. | 1 evento action `Init`; chama CE3, mostra/apaga picture e toca SE. | Sem transfer. |
| 5 | `Quarto_VN2` | 17x13 | Cena VN/staging narrativa. | 1 evento autorun com 3 paginas; condicoes `none`, `V2>=1`, `V2>=2`; escolhas e bust plugin. | Pagina 3 transfere para mapa 1 em `(4,5)` e seta `V100=2`. |
| 6 | `FIM_TRUE_Estrada_VN4_SABOTAGEM` | 17x13 | Ending/rota true staging. | 1 autorun com texto, CE20/21 e bust plugin. | Transfere para mapa 7 em `(2,1)`. |
| 7 | `Formatura_True` | 17x13 | Cena VN/ending true. | 1 autorun com texto. | Transfere para mapa 8 em `(0,0)`. |
| 8 | `JonnyFormando` | 17x13 | Transicao visual/ending true. | 1 autorun com wait. | Transfere para mapa 15 em `(0,0)`. |
| 9 | `Celular` | 17x13 | Cena final/telefone. | 1 autorun com texto longo e return-to-title command. | Sem transfer. |
| 10 | `Estrada_VN1` | 17x13 | Cena VN de estrada antes da corrida. | 1 autorun com 2 paginas; condicoes `none` e `V1>=1`; bust plugin. | Pagina 2 transfere para mapa 1 em `(3,2)` e seta `V100=1`. |
| 11 | `Prologo` | 27x15 | Cena inicial. | 1 autorun com texto curto. | Transfere para mapa 10 em `(0,0)`. Start map registrado no inventario comum: mapa 11 em `(13,6)`. |
| 12 | `FIM_FALSE_Formatura_False` | 17x13 | Ending/rota false staging. | 1 autorun com texto e wait. | Transfere para mapa 9 em `(0,0)`. |
| 13 | `Estrada_VN3` | 17x13 | Cena VN densa com ramificacao. | 1 autorun; 2.146 linhas de texto/scroll text, 446 escolhas, CE20/21 e bust plugin. | 19 transfers para mapa 6 em `(0,0)` e 1 transfer para mapa 1 em `(0,0)`; seta `V100=3` em um ponto observado. |
| 14 | `CelularVazio` | 17x13 | Cena terminal vazia/return-to-title. | 1 autorun com return-to-title command. | Sem transfer. |
| 15 | `Formatura_True2` | 17x13 | Cena VN/ending true curta. | 1 autorun com texto e SE. | Transfere para mapa 14 em `(0,0)`. |
| 16 | `Batida` | 27x15 | Cena de acidente/transicao para false ending. | 1 autorun com shake, wait, SE e texto. | Transfere para mapa 12 em `(0,0)`. |

## Navegacao Observada

Transfers estaticamente parseados apontam para mapas existentes e coordenadas dentro das dimensoes dos mapas de destino.

Fluxos principais observados:

- Inicio documentado: mapa 11 `Prologo` em `(13,6)` -> mapa 10 `Estrada_VN1` -> mapa 1 `MAP001` com `V100=1`.
- Entrada de corrida 2 observada em mapa 5: `Quarto_VN2` -> mapa 1 com `V100=2`.
- Entrada de corrida 3 observada em mapa 13: `Estrada_VN3` -> mapa 1 com `V100=3` em uma branch.
- Rota true observada: mapa 13 -> mapa 6 -> mapa 7 -> mapa 8 -> mapa 15 -> mapa 14.
- Rota false/acidente observada: mapa 16 -> mapa 12 -> mapa 9.
- Mapa 1 nao usa transfer de saida nas paginas inspecionadas; ele inicia CE5 por autorun conforme `V100`.

Lacuna: a navegacao completa entre corrida, VN seguinte, mapa 13, mapa 16 e endings depende de Common Events e branches nao auditados diretamente nesta etapa. A estrutura de transfers mostra destinos validos, mas nao prova alcancabilidade de cada branch em Playtest.

## Gating

Gates estruturais observados em mapas:

- `V100` gate no mapa 1: tres paginas autorun por `V100>=1`, `V100>=2`, `V100>=3`, todas chamando CE5. O inventario comum identifica `V100` como `VAR_RACE_ID`.
- `V1` gate no mapa 10: segunda pagina autorun de `Estrada_VN1` depende de `V1>=1` antes de transferir para mapa 1.
- `V2` gate no mapa 5: paginas 2 e 3 dependem de `V2>=1` e `V2>=2`; a pagina 3 seta `V100=2`.
- `V4` aparece em multiplas escritas no mapa 13; nome/semantica nao foram confirmados neste inventario.
- `V100=3` aparece no mapa 13 em uma escrita antes de fluxo de corrida 3, mas a branch exata nao foi validada em runtime.
- Nao foram encontrados gates por item, actor ou self-switch nas paginas de mapas inspecionadas.

Gates documentados no core loop:

- Corridas fixas narrativas: Lenda, Rachadura e Abismo, com 6, 8 e 10 cenas.
- Vitoria por threshold de `VAR_PONTOS_GLORIA`: 200, 400 e 600 para corridas 1, 2 e 3, conforme spec atual.
- Restart por crash ou derrota de threshold retorna para a mesma corrida, sem repetir VN entre tentativas.
- `SW_IS_CURVA_DIABO` esta documentada como reservada/futura para pos-MVP; nao tratar como gate ativo sem analise tecnica.

## Encounters e Pressao

Superficies estaticas:

- Nenhum dos 16 mapas inspecionados possui random encounter configurado (`encounterList` vazio).
- Nenhum evento de mapa inspecionado usa Battle Processing.
- Nenhum evento de mapa inspecionado usa Shop Processing.
- A pressao jogavel principal documentada e temporal/QTE, nao encontro de mapa: cenas de Sinal e Curva com timer, escolha safe/risk, roll e crash/restart.
- Mapas 2 e 3 parecem areas de estrada/teste com eventos action vazios; nao ha encounter ativo nesses eventos pelo JSON parseado.
- Mapa 4 chama CE3 por evento action e pode ser staging/teste de uma fase, mas a semantica de CE3 nao foi auditada diretamente neste inventario.

Lacuna: encounters da corrida sao Common Event/plugin/picture driven. Sem ler `CommonEvents.json` nesta etapa ou executar Playtest, este inventario nao valida timers, inputs, rolls, crash, retry, tela de resultado ou feedback.

## Ritmo Espacial e Temporal

Ritmo espacial estatico:

- A maioria dos mapas e 17x13, proximo de uma tela/staging fixo, com um unico autorun em `(0,0)`. Isso indica fluxo VN/transicao mais do que exploracao livre.
- Os mapas 2 e 3 sao maiores, 26x15, com multiplos eventos action, mas sem comandos. Eles funcionam como layout visual/teste ate que eventos reais sejam adicionados.
- Mapas 11 e 16 sao 27x15 e tambem usam autorun de cena, nao navegacao livre validada.
- O mapa 1 e um staging pequeno para iniciar a corrida por variavel, nao uma pista fisica navegada por tiles.

Ritmo temporal documentado:

- Cenas de Sinal: timer de 4,0s.
- Cenas de Curva: timer de 3,5s.
- Setup de cena: 0,3s.
- Resolucao: 0,4s.
- Transicao: 0,2s.
- Corrida 1: 6 cenas, duracao estimada no spec de cerca de 28s.
- Corrida 3: 10 cenas, duracao estimada no spec de cerca de 47s.
- Restart desejado: menor que 1s, sem replay de VN entre tentativas.

Interpretacao de level design: o "layout" jogavel principal da corrida e uma sequencia temporal de micro-cenas, nao uma pista espacial. A legibilidade depende de UI/pictures/timer/audio e da clareza de safe/risk por cena, nao de leitura de tiles.

## Pontos de Interesse

| POI | Fonte | Observacao factual |
| --- | --- | --- |
| Start do jogo | Inventario comum | Mapa 11 `Prologo`, coordenada `(13,6)`. |
| Hub de corrida | `Map001.json` | Evento `Init Corrida` em `(8,6)`, autorun por `V100`. |
| Semaforo/teste | `Map002.json` | 5 eventos action em coordenadas `(12,6)`, `(10,13)`, `(16,13)`, `(24,12)`, `(16,8)`, sem comandos. |
| Atalho/teste | `Map003.json` | 4 eventos action em coordenadas `(9,9)`, `(15,9)`, `(24,12)`, `(15,6)`, sem comandos. |
| Fase/teste com picture e CE3 | `Map004.json` | Evento `Init` em `(8,7)`, action trigger, CE3, picture show/erase, waits e SE. |
| Entrada corrida 1 | `Map010.json` | `Estrada_VN1` seta `V100=1` e transfere para mapa 1 em `(3,2)`. |
| Entrada corrida 2 | `Map005.json` | `Quarto_VN2` seta `V100=2` e transfere para mapa 1 em `(4,5)`. |
| Entrada corrida 3 | `Map013.json` | `Estrada_VN3` contem escrita `V100=3` e transfer para mapa 1 em `(0,0)` em uma branch. |
| Rota true | `Map006`, `Map007`, `Map008`, `Map015`, `Map014` | Cadeia de transfers ate cena terminal/return-to-title. |
| Rota false | `Map016`, `Map012`, `Map009` | Cadeia de acidente/formatura false/celular. |
| Curva do Diabo | Core loop | Fase especial documentada como pos-MVP/reservada; `SW_IS_CURVA_DIABO` nao deve ser tratada como ativa sem decisao posterior. |

## Riscos e Lacunas de Softlock

Achados estaticos:

- Autoruns dominam o fluxo narrativo e de transicao. Autorun sem cleanup ou condicao terminal e superficie classica de softlock, mas este inventario nao auditou cada comando interno ate prova de encerramento.
- Transfers para `(0,0)` sao validos em bounds, mas podem ser problemáticos se a tile de destino for impassavel, invisivel ou nao preparada para spawn; passabilidade e camera nao foram validadas.
- Mapa 13 tem evento autorun muito grande, muitas escolhas e multiplos transfers repetidos para mapa 6; isso pede route matrix/playtest para garantir que branches pretendidas sao alcancaveis e reconvergem corretamente.
- Mapa 1 depende de `V100` e chama CE5 por autorun; se CE5 nao limpar/avancar estado corretamente, o jogador pode ficar preso em reentrada ou loop. Sem ler CE5 nesta etapa, isso permanece `runtime-pending`.
- Mapas 9 e 14 terminam por return-to-title sem transfer; isso pode ser intencional para finais, mas precisa gate humano para confirmar UX de encerramento.
- Mapas 2 e 3 tem eventos action vazios; eles nao causam softlock diretamente pelo JSON parseado, mas tambem nao implementam navegacao/atalho/encounter verificavel.
- Mapa 4 chama CE3 por action e nao transfere; sem semantica de CE3, nao ha evidencia de saida, retry ou continuidade.

Validacoes nao feitas:

- Passabilidade de tiles, colisao, camera e enquadramento.
- Execucao de autoruns em ordem real no RPG Maker MZ.
- Semantica de CE3, CE5, CE20 e CE21.
- Input, timer, QTE, pictures, audio, crash/restart e tela de resultado.
- Save/load antes, durante ou depois de corrida/VN/ending.
- Legibilidade espacial ou temporal por jogador.

## Cobertura

Inspecionado em detalhe:

- Todos os 16 `MapNNN.json` existentes por parsing estruturado.
- Todos os transfers de mapas e validade basica de destino por ID e bounds.
- Triggers, condicoes de pagina, Common Event calls, plugin commands, text/choice volume, battle/shop/random encounter presence e BGM autoplay por mapa.

Apenas mapeado:

- Semantica de Common Events chamados por mapas.
- Relacao entre branches narrativas e finais.
- Semantica de variaveis `V1`, `V2` e `V4`.
- Layout visual real dos tiles e assets.

Nao encontrado nas fontes lidas:

- Random encounters por mapa.
- Battle Processing em mapas.
- Shop Processing em mapas.
- Gates por item/actor/self-switch nas paginas de mapa inspecionadas.
- Parallel map events nos 16 mapas.

## Evidence Status

| Claim | Status |
| --- | --- |
| `MapInfos.json` e `Map001`-`Map016` foram parseados como JSON valido. | `parse-valid` |
| Os mapas seguem estrutura esperada de RPG Maker MZ para dimensoes, eventos, paginas, comandos e transfers. | `editor-structural` |
| Todos os transfers parseados apontam para mapas existentes e coordenadas in-bounds. | `parse-valid` |
| O fluxo de corrida e temporal/QTE conforme doc de core loop. | `static-risk`, baseado em doc e inventario comum |
| Runtime da corrida, softlock, pacing perceptivel e legibilidade de rota estao validados. | `runtime-pending` |

## Required Validations

- `technical-review` antes de aceitar este inventario como base de planejamento de implementacao.
- `human-validation`/Playtest antes de declarar valido ritmo espacial, dificuldade percebida, leitura de safe/risk, input, timer, retry, route reachability, finais ou softlock-free behavior.
- `loki:tech-analysis` focado em `CommonEvents.json` e mapas de entrada da corrida antes de qualquer plano que edite CE3, CE5, CE18, CE19, CE20, CE21, `Map001`, `Map004`, `Map005`, `Map010` ou `Map013`.

## Handoff

```yaml
parallel_agent_response:
  agent: "level-designer"
  mode: "scoped-writer"
  summary: "Inventario factual de mapas, navegacao, gating, encounters, ritmo e riscos de softlock para Jhonny/RPG Maker MZ. O layout jogavel principal observado e temporal/QTE, com mapas atuando majoritariamente como staging VN, entradas de corrida e endings."
  affected_files:
    - "docs/loki-init/level-designer/inventory.md"
  write_scope:
    mode: "init_context_scoped_writer"
    target_files:
      - "docs/loki-init/level-designer/inventory.md"
      - "planos/000-init-loki/retrospetivas/fase1/level-designer-retrospectiva.md"
    allowed_writes:
      - "docs/loki-init/level-designer/**"
      - "planos/000-init-loki/retrospetivas/fase1/level-designer-retrospectiva.md"
    scoped_write_domains:
      - "level-layouts"
      - "encounter-placement"
      - "map-data"
      - "spatial-design-docs"
    validators:
      - "JSON parse of MapInfos and selected MapNNN files"
      - "static transfer destination and bounds check"
    human_gates:
      - "human-validation"
  affected_runtime_surfaces:
    - "Jhonny/data/MapInfos.json"
    - "Jhonny/data/Map001.json"
    - "Jhonny/data/Map002.json"
    - "Jhonny/data/Map003.json"
    - "Jhonny/data/Map004.json"
    - "Jhonny/data/Map005.json"
    - "Jhonny/data/Map010.json"
    - "Jhonny/data/Map013.json"
    - "Jhonny/data/Map016.json"
    - "Jhonny/data/CommonEvents.json"
  affected_domain_ids:
    - "map:1 MAP001"
    - "map:2 mapa-semaforo"
    - "map:3 mapa-atalho"
    - "map:4 Mapa-fase2"
    - "map:5 Quarto_VN2"
    - "map:10 Estrada_VN1"
    - "map:11 Prologo"
    - "map:13 Estrada_VN3"
    - "map:16 Batida"
    - "common-event:3"
    - "common-event:5"
    - "common-event:20"
    - "common-event:21"
    - "variable:100 VAR_RACE_ID"
  evidence:
    - "docs/loki-init/project-inventory.md"
    - "docs/loki-init/technology-context.md"
    - "docs/index.xml"
    - "docs/02-Core-Loop/Corrida - Core Loop.md"
    - "Jhonny/data/MapInfos.json"
    - "Jhonny/data/Map001.json through Jhonny/data/Map016.json"
  findings:
    - type: "map-flow"
      detail: "16 maps exist. Most are autorun VN/staging maps; Map001 stages race entry by V100/VAR_RACE_ID; Map002 and Map003 are larger road/test maps with action events but no commands."
    - type: "gating"
      detail: "Map001 gates CE5 calls by V100>=1/2/3. Map010, Map005 and Map013 set V100 for race entries 1, 2 and 3 respectively."
    - type: "encounter"
      detail: "No random encounters, Battle Processing or shops were found in inspected maps. Race pressure is documented as timer/QTE/Common Event driven."
    - type: "navigation"
      detail: "All parsed transfers target existing maps and in-bounds coordinates, but branch reachability and passability were not runtime validated."
    - type: "pacing"
      detail: "Core loop pacing is temporal: Sinal 4.0s, Curva 3.5s, 6/8/10 scenes, restart target under 1s."
    - type: "softlock"
      detail: "Autorun-heavy flow, transfer-to-(0,0), large branching map 13 and CE-dependent race staging are runtime-pending softlock surfaces."
  risks:
    - "Autorun events may loop or lock input if Common Events/state cleanup fail."
    - "Map13 branch density requires route matrix and Playtest."
    - "Transfer coordinate bounds do not prove tile passability or visual framing."
    - "Core loop doc contains MVP/future drift around Curva do Diabo; do not implement it as active without decision."
  confidence: "medium"
  model_class: "frontier_reasoning"
  effort: "high"
  required_validations:
    - "technical-review"
    - "human-validation"
  proposed_next_step: "Run loki:tech-analysis focused on race entry maps plus CommonEvents CE3/CE5/CE18/CE19/CE20/CE21, then a Playtest route/softlock pass."
```
