---
title: "Loki Init - Branching Narrative Inventory"
tipo: "inventario de branching narrativo"
status: "parcial-estatico"
tags:
  - loki-init
  - branching-narrative
  - game-dev
  - rpg-maker-mz
  - jhonny
---

# Loki Init - Branching Narrative Inventory

Data: 2026-06-30
Agente: `branching-narrative-designer`
Escopo: escolhas, flags, condicoes, rotas, endings, consequencias e fontes de ramificacao narrativa encontradas estaticamente.

## Status

Inventario factual estatico produzido para `loki:init` em modo `init_inventory_domain_writer`.

Este documento nao valida alcancabilidade, pacing, compreensao narrativa, execucao de Common Events, save/load ou comportamento runtime. Qualquer afirmacao de rota jogavel, ending alcancavel ou estado persistido correto requer `human-validation` por Playtest ou gate equivalente.

## Fontes Lidas

| Fonte | Uso no inventario | Evidencia |
| --- | --- | --- |
| `docs/loki-init/project-inventory.md` | Contexto comum, limites de escrita, surfaces RPG Maker MZ ja mapeadas. | Projeto Jhonny em RPG Maker MZ; `System.json`, `CommonEvents.json`, `MapInfos.json`, plugins e docs de corrida ja identificados pelo inventario comum. |
| `docs/loki-init/technology-context.md` | Stack, selected project type, skills candidatas e gates. | `selected_project_type: game-dev`; RPG Maker MZ; gates de Playtest para runtime. |
| `docs/index.xml` | Catalogo navegavel de docs duradouros. | `Corrida - Core Loop.md` catalogado como spec principal; entrada do proprio agente declara flags/escolhas/endings ainda nao mapeados. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Fonte documental principal para escolhas de corrida, estados, consequencias e finais previstos. | Corridas 1-3, safe/risk, `ConcernScore`, `Consciência`, `Pontos de Glória`, `Curva do Diabo`, thresholds e decisao de MVP. |
| `Jhonny/data/MapInfos.json` | Mapa de mapas candidatos a rota/VN/finais. | 16 mapas nomeados; mapas narrativos/finais incluem `Prologo`, `Estrada_VN1`, `Quarto_VN2`, `Estrada_VN3`, `FIM_TRUE_Estrada_VN4_SABOTAGEM`, `FIM_FALSE_Formatura_False`, `Batida`, `Celular`, `CelularVazio`. |
| `Jhonny/data/Map001.json` | Mapa selecionado por ser destino das VNs antes das corridas. | Evento `Init Corrida` com paginas condicionadas por variavel 100 valores 1, 2 e 3; cada pagina chama Common Event 5. |
| `Jhonny/data/Map005.json` | Mapa selecionado por conter VN com escolhas e progressao para corrida 2. | 15 grupos de escolhas; paginas condicionadas por variavel 2; define variavel 100 como 2 e transfere para `Map001`. |
| `Jhonny/data/Map006.json` | Mapa selecionado por nome de ending true/sabotagem. | Cena linear que transfere para `Map007`. |
| `Jhonny/data/Map007.json` | Continuidade de final true. | Cena linear que transfere para `Map008`. |
| `Jhonny/data/Map008.json` | Continuidade de final true. | Cena linear que transfere para `Map015`. |
| `Jhonny/data/Map009.json` | Continuidade de final false/celular. | Cena linear sem choices ou transfer extra detectado no evento lido. |
| `Jhonny/data/Map010.json` | Mapa selecionado por ser VN antes da corrida 1. | Duas paginas; pagina 2 condicionada por variavel 1 valor 1; define variavel 100 como 1 e transfere para `Map001`. |
| `Jhonny/data/Map011.json` | Start/prologo narrativo. | Cena linear que transfere para `Map010`. |
| `Jhonny/data/Map012.json` | Mapa selecionado por nome de ending false. | Cena linear que transfere para `Map009`. |
| `Jhonny/data/Map013.json` | Mapa selecionado por conter VN antes da corrida 3 e escolha final de sabotagem. | 446 grupos de escolhas totais, 12 grupos unicos; escolha "Slash the Opala's tire..." transfere para `Map006`; fim do evento define variavel 100 como 3 e transfere para `Map001`. |
| `Jhonny/data/Map014.json` | Continuidade de celular vazio. | Evento sem texto/choice/transfer relevante. |
| `Jhonny/data/Map015.json` | Continuidade de final true. | Mensagem "New message received." e transfer para `Map014`. |
| `Jhonny/data/Map016.json` | Mapa selecionado por nome `Batida`. | Cena linear: Jonny diz "I won... but it doesn't change a thing." e transfere para `Map012`. |

## Cobertura

Inspecionado em detalhe:

- Documentacao duradoura da corrida em `Corrida - Core Loop.md`.
- Catalogo `docs/index.xml` para identificar fontes duradouras relevantes.
- `MapInfos.json` completo.
- Mapas selecionados por nomes narrativos, finais, prologo, VNs e destino de corrida: `Map001`, `Map005`, `Map006`, `Map007`, `Map008`, `Map009`, `Map010`, `Map011`, `Map012`, `Map013`, `Map014`, `Map015`, `Map016`.

Apenas mapeado por fonte indireta:

- `CommonEvents.json`: usado via `project-inventory.md` e `Corrida - Core Loop.md`, nao relido diretamente neste envelope.
- `System.json`: nomes de variaveis/switches usados a partir dos docs e do inventario comum; IDs crus dos mapas foram mantidos quando a fonte lida era mapa.
- Plugins `TextPicture`, `ButtonPicture`, `Jhonny_RaceHelper`, `VisuMZ_2_VNPictureBusts`: identificados como surfaces, sem auditoria de semantica de comando.

Nao inspecionado:

- Todos os mapas de corrida/teste (`Map002`, `Map003`, `Map004`) e event data fora do conjunto selecionado.
- `Jhonny/data/CommonEvents.json`, `Jhonny/data/System.json`, `Jhonny/js/plugins.js`, plugin files, assets e saves, por limite do envelope de fontes.
- Playtest, editor RPG Maker MZ e runtime NW.js/browser.

## Mapa De Localizacao

| Tipo de informacao | Onde procurar |
| --- | --- |
| Promessa e regras da corrida | `docs/02-Core-Loop/Corrida - Core Loop.md` |
| Catalogo de docs duradouros | `docs/index.xml` |
| Nome e hierarquia de mapas | `Jhonny/data/MapInfos.json` |
| Entrada de corrida por ID | `Jhonny/data/Map001.json`, evento `Init Corrida`, paginas condicionadas por variavel 100 |
| VN antes da corrida 1 | `Jhonny/data/Map010.json` |
| VN antes da corrida 2 | `Jhonny/data/Map005.json` |
| VN antes da corrida 3 | `Jhonny/data/Map013.json` |
| Ending true/sabotagem | `Jhonny/data/Map006.json` -> `Map007` -> `Map008` -> `Map015` -> `Map014` |
| Ending false | `Jhonny/data/Map016.json` -> `Map012` -> `Map009`, e comentarios de `Map013` apontando para `FIM_FALSE` |
| Implementacao da corrida | Common Events CE5, CE7, CE18, CE19 citados em docs; `Map001` chama CE5 |

## Registro De Estado Narrativo

| Estado | Fonte | Evidencia estatica | Persistencia/reset documentado | Status |
| --- | --- | --- | --- | --- |
| `ConcernScore` | `Corrida - Core Loop.md` | Variavel oculta acumulada nas cenas VN; define qual final/intervencao o jogador acessa; independente de `Consciência`. | Preservado entre restarts de corrida segundo secao de restart. | Fonte documental; ID runtime nao encontrado nas fontes permitidas. |
| `Consciência` / `VAR_CONSCIENCIA` | `Corrida - Core Loop.md` | Barra visivel 0-100 dentro da corrida; safe +10; risk consome `P_cena`. | Resetada para 0 no inicio e em crash/restart. | Fonte documental; runtime pendente. |
| `Pontos de Glória` / `VAR_PONTOS_GLORIA` | `Corrida - Core Loop.md` | Pontuacao de corrida; safe +10; risk-sucesso `P_cena * 2`; thresholds 200/400/600. | Resetada no crash e INIT corrida. | Fonte documental; runtime pendente. |
| `VAR_RACE_ID` / variavel 100 nos mapas | `Corrida - Core Loop.md`, `Map001`, `Map005`, `Map010`, `Map013` | Seleciona corrida 1, 2 ou 3. `Map001` tem paginas por valor 1/2/3 chamando CE5; VNs setam 100 para 1, 2 ou 3 antes de transferir para `Map001`. | Preservado entre restarts segundo doc; incrementado por vitoria no doc. | Evidencia documental + mapas selecionados. |
| Variavel 1 | `Map010` | `Map010` pagina 1 seta variavel 1 para 1; pagina 2 exige variavel 1 >= 1. | Reset/persistencia nao evidenciados no envelope. | ID sem nome; ownership incompleto. |
| Variavel 2 | `Map005` | `Map005` usa paginas condicionadas por variavel 2 valores 1 e 2; pagina 1 seta 2=1, pagina 2 seta 2=2. | Reset/persistencia nao evidenciados no envelope. | ID sem nome; ownership incompleto. |
| `VAR_VITORIA_PASSOU` | `Corrida - Core Loop.md` | CE19 seta 0/1 por threshold; branch pos-input avanca corrida, finaliza MVP ou chama crash. | Reset defensivo em CE18 e CE5 segundo doc. | Fonte documental; Common Events nao relidos. |
| `SW_IS_CURVA_DIABO` | `Corrida - Core Loop.md` | Reservado para fase especial futura, intocado no MVP. | Nao aplicavel ao MVP. | Fonte documental; runtime pendente. |

## Matriz De Escolhas E Consequencias

### Escolhas Da Corrida

| Choice ID | Cena | Opcoes | Condicoes | Efeitos documentados | Consequencia/rota | Evidencia | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `race-signal-safe-risk` | Sinal | `Parar` (safe) / `Furar` (risk) | Cena ativa, input nao bloqueado, timer ativo. | Safe: avanca, `Consciência += 10`, `Pontos de Glória += 10`. Risk: roll contra `Consciência + P_cena`, consome `P_cena`; sucesso avanca e soma `P_cena * 2`; falha crash. | Avanco de cena ou restart da mesma corrida. | `Corrida - Core Loop.md` secoes 4, 7, 8. | Estatico; runtime pendente. |
| `race-curve-safe-risk` | Curva | `Esquerda` (safe) / `Direita` (risk) | Cena ativa, input nao bloqueado, timer ativo. | Mesmo padrao de safe/risk; `Direita` e risk. | Avanco de cena ou restart da mesma corrida. | `Corrida - Core Loop.md` secao 5. | Estatico; runtime pendente. |
| `race-timeout` | Sinal/Curva | Sem input ate timer expirar | Timer chega a 0. | Documento tem conflito: TL;DR e edge cases indicam safe automatico; secao 7.1 lista timer expira como erro fatal/restart. | Ambiguo: safe automatico ou crash/restart. | `Corrida - Core Loop.md` secoes TL;DR, 4/5 edge cases, 7.1. | Contradicao documental; precisa decisao/tech-analysis. |
| `curva-do-diabo` | Corrida 3, ultima cena futura | `Esquerda` (safe) / `Direita` (risk) | Visao completa: corrida 3, indice final, `P_cena = 100`; MVP: fase especial adiada. | Direita seria sucesso garantido e zera `Consciência`; Esquerda sobrevive. | Climax futuro; no MVP a Corrida 3 tem 10 cenas normais. | `Corrida - Core Loop.md` callout de MVP e secao 6.4. | Futuro/fora do MVP; nao implementado como rota atual pelo doc. |

### Escolhas VN Inspecionadas

| Fonte | Volume de escolhas | Padrao observado | Efeito de estado/rota encontrado | Status |
| --- | ---: | --- | --- | --- |
| `Map005` (`Quarto_VN2`) | 15 grupos totais, 10 unicos | Escolhas de resposta sobre escola, relacionamento e corrida; varios ramos reconvergem para os mesmos textos. | Paginas encadeadas por variavel 2: pagina 1 seta `2=1`, pagina 2 seta `2=2`; pagina 3 seta `VAR_RACE_ID`/variavel 100 para 2 e transfere para `Map001`. | Branching de dialogo com reconvergencia; efeitos de afinidade/ConcernScore nao encontrados nas fontes lidas. |
| `Map013` (`Estrada_VN3`) | 446 grupos totais, 12 unicos | Dialogo altamente aninhado com muitas repeticoes; escolhas recorrentes pressionam Jonny a correr/beber ou tentam intervir. | Um ramo especifico da escolha "Slash the Opala's tire and stop Jonny from racing." transfere para `Map006`; ao fim do evento, ha set de variavel 100 para 3 e transfer para `Map001`. Comentarios indicam ramos "NAO SALVAR", "TENTAR SALVAR, MAS NAO CONSEGUIR" e `FIM_FALSE`. | Branching complexo; alcance real dos transfers precisa Playtest, especialmente porque ha transfer dentro de branch e transfer final no mesmo evento. |
| `Map010` (`Estrada_VN1`) | 0 grupos | VN linear em duas paginas controladas por variavel 1. | Pagina 1 seta `1=1`; pagina 2 seta variavel 100 para 1 e transfere para `Map001`. | Linear com gate de pagina por variavel. |
| `Map011` (`Prologo`) | 0 grupos | Prologo linear. | Transfere para `Map010`. | Linear. |

## Manifesto De Rotas Encontrado

| Route ID | Fonte de entrada | Pre-estado estatico | Mutacao/destino observado | Outcome/endings relacionados | Evidencia | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `route-prologo-to-race1` | `Map011` -> `Map010` -> `Map001` | Nenhuma condicao em `Map011`; `Map010` usa variavel 1 para pagina 2. | `Map010` seta variavel 100 para 1 e transfere para `Map001`; `Map001` pagina valor 1 chama CE5. | Inicia Corrida 1. | Mapas selecionados + core loop. | Estatico; runtime pendente. |
| `route-vn2-to-race2` | `Map005` -> `Map001` | `Map005` usa variavel 2 para paginas 2 e 3. | `Map005` seta variavel 100 para 2 e transfere para `Map001`; `Map001` pagina valor 2 chama CE5. | Inicia Corrida 2. | Mapas selecionados + core loop. | Estatico; runtime pendente. |
| `route-vn3-to-race3` | `Map013` -> `Map001` | Final do evento de `Map013` sem condicao de pagina. | Seta variavel 100 para 3 e transfere para `Map001`; `Map001` pagina valor 3 chama CE5. | Inicia Corrida 3. | Mapas selecionados + core loop. | Estatico; runtime pendente. |
| `route-sabotage-true` | Branch de `Map013` | Stack observado inclui respostas de intervencao e escolha "Slash the Opala's tire and stop Jonny from racing." | Transfer dentro do branch para `Map006`. | Cadeia `Map006` -> `Map007` -> `Map008` -> `Map015` -> `Map014`; nomes indicam `FIM_TRUE`/sabotagem. | Mapas selecionados. | Estatico; alcance real pendente. |
| `route-race3-false-or-crash` | `Map016` e `Map012` | Entrada em `Map016` nao foi encontrada nas fontes permitidas; comentarios de `Map013` apontam para `FIM_FALSE` apos corrida. | `Map016` transfere para `Map012`; `Map012` transfere para `Map009`. | Nomes indicam `Batida` e `FIM_FALSE_Formatura_False`. | Mapas selecionados + comentarios de `Map013`. | Parcial; fonte de entrada ausente. |
| `route-race-progression` | CE19 descrito no core loop | `VAR_SCENE_INDEX >= VAR_RACE_N_CENAS`; `VAR_PONTOS_GLORIA` contra thresholds 200/400/600. | Se passou e `VAR_RACE_ID < 3`, incrementa corrida e chama CE5; se passou corrida 3, tela "FIM"; se nao passou, CE18 restart. | Progressao de corridas e tela FIM do MVP. | `Corrida - Core Loop.md`; Common Events nao relidos. | Documental; runtime pendente. |
| `route-concernscore-intervention` | Core loop referencia `Roleta Paulista` | `ConcernScore` alto segundo pitch. | Intervencao substituiria Curva do Diabo. | Rota/intervencao macro fora do core loop. | `Corrida - Core Loop.md` secao 6.4. | Fonte canonica nao lida neste envelope; missing evidence. |

## Endings E Outcomes

| Ending/outcome | Fonte | Evidencia atual | Lacuna |
| --- | --- | --- | --- |
| `FIM_TRUE_Estrada_VN4_SABOTAGEM` | `Map006`, `Map013` | `Map013` tem branch "Slash the Opala's tire..." que transfere para `Map006`; `Map006` inicia cadeia linear de final true/sabotagem. | Nao ha Playtest; nao foi confirmado se o transfer interrompe ou se comandos posteriores do evento ainda executam. |
| `FIM_FALSE_Formatura_False` | `Map012`, `Map016`, comentarios de `Map013` | `Map016` fala "I won... but it doesn't change a thing. This is where it ends for me." e transfere para `Map012`; `Map012` transfere para `Map009`. Comentarios de `Map013` repetem que certas escolhas vao para `FIM_FALSE`. | Fonte de entrada para `Map016` nao encontrada no envelope. |
| Tela "FIM" MVP | `Corrida - Core Loop.md` | Se `VAR_VITORIA_PASSOU == 1` e `VAR_RACE_ID == 3`, exibe "FIM" + agradecimento e loop infinito. | Common Event CE19 nao relido; nao confirmar runtime. |
| Intervencao por `ConcernScore Alto` | `Corrida - Core Loop.md` | Documento diz que intervencao substitui Curva do Diabo, especificada no pitch. | Documento `Roleta Paulista` nao estava em fontes permitidas; ID/threshold/implementacao nao encontrados. |

## Riscos E Lacunas De Branching

| Tipo | Detalhe | Evidencia | Risco |
| --- | --- | --- | --- |
| `missing-route-evidence` | `ConcernScore` e finais 1/2/3 sao citados, mas fonte canonica `Roleta Paulista` nao foi lida no envelope. | `Corrida - Core Loop.md` referencia `Roleta Paulista`. | Nao ha matriz completa de endings canonicos. |
| `missing-state-registry` | Variaveis 1 e 2 controlam paginas VN, mas nomes e reset/persistencia nao foram confirmados nas fontes permitidas. | `Map010`, `Map005`. | Risco de leakage de pagina ou replay incorreto em save/load. |
| `contradiction` | Timeout aparece como safe automatico em partes do core loop e como erro fatal/restart em outra parte. | `Corrida - Core Loop.md` TL;DR/edge cases vs secao 7.1. | Risco de criterio de aceite conflitante para corrida. |
| `route-risk` | `Map013` tem transfer para `Map006` dentro de um branch e tambem set de variavel 100/transfer para `Map001` no fim do evento. | Parser estatico de `Map013`. | Sem runtime, nao declarar que sabotagem alcanca final true; precisa Playtest/semantica de transfer. |
| `branch-density` | `Map013` tem 446 grupos de escolhas totais, 12 unicos, com muita repeticao aninhada. | Parser estatico de `Map013`. | Risco de conteudo duplicado, regressao de branch e dificuldade de QA. |
| `unreachable-content` | Nao foi feita auditoria completa de labels, jumps, Common Events e mapas nao lidos. | Escopo limitado. | Conteudo inalcancavel nao pode ser afirmado nem descartado. |
| `doc-runtime-drift` | Core loop diz Curva do Diabo e finais via ConcernScore, mas tambem declara fase especial fora do MVP. | `Corrida - Core Loop.md`. | Precisa separar MVP atual de visao futura em qualquer plano. |

## Validacoes Necessarias

- `technical-review`: revisar este inventario e qualquer matriz de rotas derivada antes de virar plano.
- `human-validation`: Playtest para declarar rotas, escolhas, endings, pacing, compreensao e estado persistido como validados.
- `loki:tech-analysis`: recomendado antes de editar rotas ou corrigir branching, com foco em `Map013`, CE5/CE18/CE19, variaveis 1/2/100, `ConcernScore`, transfers e save/load.
- Skill futura obrigatoria para edicao: `loki-rpg-maker-mz-data-json` antes de qualquer escrita em `Jhonny/data/*.json`.

## Proximo Passo Proposto

Executar `loki:tech-analysis` focado em matriz de rotas e estado narrativo, lendo como fontes minimas adicionais `Jhonny/data/System.json`, `Jhonny/data/CommonEvents.json`, `Jhonny/data/Map013.json`, `Jhonny/data/Map016.json`, `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` e o documento canonico `Roleta Paulista`, com Playtest como gate para alcance de endings.
