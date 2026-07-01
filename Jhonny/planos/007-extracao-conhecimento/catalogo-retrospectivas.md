# Catalogo de retrospectivas em `Jhonny/planos`

Gerado em: 2026-06-26

## Escopo

Catalogo de todos os arquivos Markdown de retrospectiva encontrados em `Jhonny/planos` por caminho/nome contendo `retrospect`, `retrospet` ou `retrospectives`.

Nao foram incluidos arquivos de task, atualizacao ou resumo que apenas mencionam retrospectivas no conteudo. A grafia original dos diretorios foi preservada, inclusive `retrospetivas`.

## Resumo numerico

| Plano | Quantidade | Linhas catalogadas | Observacao |
| --- | ---: | ---: | --- |
| `001-prototipo-core-loop` | 8 | 6252 | Retrospectivas do prototipo do core loop e debug de CE 12. |
| `003-bug-fix-round1` | 13 | 5568 | Maior volume de conhecimento reutilizavel sobre bugs, opcodes, HUD, thresholds e race conditions. |
| `004-merge-phase-b` | 2 | 764 | Retrospectivas de merge/release e restricoes de ambiente. |
| `005-integrar-corrida-ao-dialogo` | 7 | 2622 | Integracao corrida-dialogo, tela preta, retry, preload e lifecycle da result screen. |
| `006-joices-phase1` | 1 | 377 | Joices da corrida e padronizacao de comandos/eventos. |
| **Total** | **31** | **15583** |  |

## Temas transversais para extracao

| Tema | Arquivos mais relevantes | Conhecimento a extrair |
| --- | --- | --- |
| Edicao segura de dados RMMZ | R001, R002, R016, R017, R024, R025, R031 | Contratos para editar `data/*.json`, validar comandos de evento, preservar indent e evitar alteracoes destrutivas. |
| Common Events, switches e variaveis | R004, R006, R008, R015, R018, R019, R021 | Invariantes de `SW_RACE_ACTIVE`, CE 12/14/19, bindings, wait/input e ordem de comandos. |
| HUD, pictures e input lifecycle | R012, R014, R018, R026, R029, R030 | Timing de `TextPicture`, limpeza de HUD, tela de resultado, hardening de input e tela preta. |
| Thresholds e configuracao centralizada | R011, R020, R021 | Centralizacao de thresholds, remocao de literais magicos e validacao por scripts. |
| Planejamento e enriquecimento de tasks | R009, R017, R020 | Como enriquecer tasks com verificacoes antes da execucao e referencias canonicas. |
| Merge, release e ambiente | R022, R023 | Fluxo de merge, inventario nao commitado, restricoes do editor RPG Maker MZ e checks pos-merge. |
| Integracao corrida-dialogo | R024, R025, R026, R027, R028, R029, R030 | Entrada/saida entre mapas, rotas de vitoria/derrota, retry/preload e validacao manual. |

## Indice catalogado

### `001-prototipo-core-loop`

| ID | Arquivo | Linhas | Titulo | Foco principal | Prioridade de extracao |
| --- | --- | ---: | --- | --- | --- |
| R001 | `../001-prototipo-core-loop/fase1/retrospectiva.md` | 291 | Retrospectiva Tecnica - Fase 1: Setup MZ + Plugin Helper | Setup inicial do RPG Maker MZ, plugin helper e workflow basico. | Alta |
| R002 | `../001-prototipo-core-loop/fase2/retrospectiva.md` | 498 | Retrospectiva Tecnica - Fase 2: Pipeline de Assets | Pipeline de assets e implicacoes de importacao/organizacao. | Alta |
| R003 | `../001-prototipo-core-loop/fase3/retrospectiva.md` | 345 | Retrospectiva Tecnica - Debug Fase 3 | Debug de fase, uso de ferramentas e rotas minimas de diagnostico. | Media |
| R004 | `../001-prototipo-core-loop/fase4/retrospectiva.md` | 1948 | Fase 4 - Retrospectiva tecnica | Maior retrospectiva do core loop, com contratos RMMZ, plugins e validacoes. | Critica |
| R005 | `../001-prototipo-core-loop/fase5/retrospectiva.md` | 1573 | Retrospectiva Tecnica - Fase 5 (Logica de Estado e Resolucao) | Estado/resolucao da corrida, sincronizacao de comportamento e checklist operacional. | Critica |
| R006 | `../001-prototipo-core-loop/fase6/retrospectiva.md` | 1017 | Retrospectiva Tecnica - Fase 6 (Planejamento + Execucao) | Planejamento, execucao, sincronizacao de spec e conhecimentos reutilizaveis. | Alta |
| R007 | `../001-prototipo-core-loop/fase7/retrospectiva.md` | 323 | Retrospectiva Tecnica - Fase 7 | Fechamento do core loop e validacoes finais da fase. | Media |
| R008 | `../001-prototipo-core-loop/fase7/retrospectiva-bug-indent-skipbranch.md` | 257 | Retrospectiva - Debug bug indent/skipBranch em CE 12 | Bug de indentacao/skipBranch em Common Event 12. | Alta |

### `003-bug-fix-round1`

| ID | Arquivo | Linhas | Titulo | Foco principal | Prioridade de extracao |
| --- | --- | ---: | --- | --- | --- |
| R009 | `../003-bug-fix-round1/retrospetivas/fase-planning/2026-06-20-retrospectiva-fase3-enrich-tasks.md` | 463 | Retrospectiva tecnica - Revisao de tasks da Fase 3 (enrich-tasks) | Enriquecimento de tasks, dicionario de opcodes e contrato para CEs paralelos. | Alta |
| R010 | `../003-bug-fix-round1/retrospetivas/fase-planning/conhecimentos absorvidos/retrospectives/2026-06-19-race-feedback-impl-guide.md` | 414 | Retrospectiva - Race Feedback Implementation Guide | Guia retrospectivo de feedback de corrida, lifecycle de pictures e HUD dinamico. | Alta |
| R011 | `../003-bug-fix-round1/retrospetivas/fase-planning/conhecimentos absorvidos/retrospectives/2026-06-19-retrospectiva-busca-threshold-gloria.md` | 247 | Retrospectiva Tecnica - Busca do threshold de gloria | Descoberta/centralizacao de threshold de gloria. | Alta |
| R012 | `../003-bug-fix-round1/retrospetivas/fase-planning/conhecimentos absorvidos/retrospectives/2026-06-20-retrospectiva-bug-fix-round1-fase1-glory-fix-regression.md` | 372 | Retrospectiva Tecnica - Bug Fix Round 1, Fase 1 (regressao introduzida pelo Patch A) | Regressao de fix, opcodes RMMZ e checks preventivos. | Alta |
| R013 | `../003-bug-fix-round1/retrospetivas/fase-planning/conhecimentos absorvidos/retrospectives/2026-06-20-retrospectiva-fase1-glory-exploit-race-condition.md` | 405 | Retrospectiva tecnica - Fase 1 glory exploit (race condition CE 14) | Race condition em CE 14 e exploracao de gloria. | Alta |
| R014 | `../003-bug-fix-round1/retrospetivas/fase-planning/conhecimentos absorvidos/retrospectives/2026-06-20-retrospectiva-frame-debug-logs-throttle.md` | 392 | Retrospectiva tecnica: throttle configuravel para logs por frame | Throttle de logs por frame e seguranca operacional de debug. | Media |
| R015 | `../003-bug-fix-round1/retrospetivas/fase1/retrospectiva-fase1-ce19-wait-input-race-active.md` | 495 | Retrospectiva tecnica - CE19 WAIT_INPUT e SW_RACE_ACTIVE | Contrato de CE19, wait/input e `SW_RACE_ACTIVE`. | Critica |
| R016 | `../003-bug-fix-round1/retrospetivas/fase2/retrospectiva-fase2-opcode-inversion.md` | 326 | Retrospectiva - Fase 2 (opcode inversion) | Inversao de opcode e dicionario RMMZ verificado. | Critica |
| R017 | `../003-bug-fix-round1/retrospetivas/fase2/retrospectiva-fase2-revisao-tasks.md` | 589 | Retrospectiva tecnica - Revisao das tasks da Fase 2 | Revisao de tasks, verificacoes obrigatorias e melhoria de artefatos. | Alta |
| R018 | `../003-bug-fix-round1/retrospetivas/fase3/retrospectiva-fase3-textpicture-bake-timing.md` | 434 | Retrospectiva - Fase 3 (HUD Consciencia) + Bonus Fix (HUD Risco) | Timing de `TextPicture`, HUD de consciencia/risco e auditoria pre-flight. | Critica |
| R019 | `../003-bug-fix-round1/retrospetivas/fase4/retrospectiva-fase4-curve-event-binding.md` | 504 | Retrospectiva - Fase 4 (Curve Event Binding) | Binding de evento de curva e hipoteses canonicas para input binding. | Critica |
| R020 | `../003-bug-fix-round1/retrospetivas/fase5/2026-06-21-retrospectiva-fase5-enrich-tasks.md` | 482 | Retrospectiva Tecnica - enrich-tasks Fase 5 (THRESHOLDS refactor) | Enriquecimento de tasks para refatoracao de thresholds. | Alta |
| R021 | `../003-bug-fix-round1/retrospetivas/fase5/2026-06-21-retrospectiva-fase5-thresholds-refactor.md` | 445 | Retrospectiva Tecnica - Implementacao Fase 5 (THRESHOLDS refactor) | Implementacao do refactor de thresholds e validacao contra literais. | Critica |

### `004-merge-phase-b`

| ID | Arquivo | Linhas | Titulo | Foco principal | Prioridade de extracao |
| --- | --- | ---: | --- | --- | --- |
| R022 | `../004-merge-phase-b/retrospectivas/2026-06-21-retrospectiva-merge-phase-b.md` | 425 | Retrospectiva - Merge feat/release-phase-b -> main | Primeira retrospectiva de merge, ambiente e inventario nao commitado. | Alta |
| R023 | `../004-merge-phase-b/retrospectivas/2026-06-21-retrospectiva-merge-phase-b-sucesso.md` | 339 | Retrospectiva - Merge feat/release-phase-b -> main (Tentativa bem-sucedida) | Tentativa bem-sucedida de merge e checklist operacional. | Alta |

### `005-integrar-corrida-ao-dialogo`

| ID | Arquivo | Linhas | Titulo | Foco principal | Prioridade de extracao |
| --- | --- | ---: | --- | --- | --- |
| R024 | `../005-integrar-corrida-ao-dialogo/race_dialogue_integration/retrospetivas/fase1/retrospectiva-task-1.1-map001-race-containment.md` | 335 | Retrospectiva Tecnica - Task 1.1 Map001 Race Containment | Contencao da corrida em `Map001` e limites de edicao de mapas. | Alta |
| R025 | `../005-integrar-corrida-ao-dialogo/race_dialogue_integration/retrospetivas/fase2/retrospectiva-task-2.1-2.2-race-dialogue-entries.md` | 392 | Retrospectiva Tecnica - Tasks 2.1 e 2.2 Race Dialogue Entries | Entradas de dialogo da corrida e restricoes de edicao de mapas. | Alta |
| R026 | `../005-integrar-corrida-ao-dialogo/race_dialogue_integration/retrospetivas/fase3/retrospectiva-feedback-fase3-debug-interativo-tela-preta.md` | 450 | Retrospectiva Tecnica - Feedback Fase 3 Debug Interativo Tela Preta | Debug interativo de tela preta apos feedback. | Critica |
| R027 | `../005-integrar-corrida-ao-dialogo/race_dialogue_integration/retrospetivas/fase3/retrospectiva-task-3.1-3.2-victory-defeat-cleanup.md` | 475 | Retrospectiva Tecnica - Tasks 3.1 e 3.2 Victory Defeat Cleanup | Limpeza das saidas de vitoria/derrota e pos-vitoria. | Alta |
| R028 | `../005-integrar-corrida-ao-dialogo/race_dialogue_integration/retrospetivas/fase4/retrospectiva-task-4.1-4.2-retry-preload-race3-validation.md` | 309 | Retrospectiva Tecnica - Fase 4 Retry Preload e Corrida 3 | Retry, preload e validacao da corrida 3. | Alta |
| R029 | `../005-integrar-corrida-ao-dialogo/race_dialogue_integration/retrospetivas/fase5/retrospectiva-feedback-fase5-result-screen-input-hardening.md` | 296 | Retrospectiva Tecnica - Fase 5 Result Screen Input Hardening | Hardening de input da tela de resultado. | Critica |
| R030 | `../005-integrar-corrida-ao-dialogo/race_dialogue_integration/retrospetivas/fase5/retrospectiva-task-5.4-black-screen-lifecycle.md` | 365 | Retrospectiva Tecnica - Task 5.4 Black Screen Lifecycle | Lifecycle de tela preta, bootstrap e limpeza de estado. | Critica |

### `006-joices-phase1`

| ID | Arquivo | Linhas | Titulo | Foco principal | Prioridade de extracao |
| --- | --- | ---: | --- | --- | --- |
| R031 | `../006-joices-phase1/retrospectiva-tecnica.md` | 377 | Retrospectiva Tecnica: Joices da Corrida | Joices da corrida, comandos/eventos e padronizacao de fluxo. | Alta |

## Ordem recomendada para extracao de conhecimento

1. Extrair primeiro os contratos de seguranca RMMZ e opcodes: R004, R015, R016, R018, R019, R021.
2. Consolidar regras de lifecycle de corrida, HUD, pictures e input: R005, R010, R026, R029, R030.
3. Consolidar workflow de planejamento/enriquecimento/validacao: R006, R009, R017, R020.
4. Consolidar integracao corrida-dialogo: R024, R025, R027, R028.
5. Consolidar merge/release e restricoes de ambiente: R022, R023.
6. Revisar retrospectivas restantes para exemplos, prompts iniciais e checklists: R001, R002, R003, R007, R008, R011, R012, R013, R014, R031.

## Lacunas percebidas

- Nao ha retrospectiva catalogada em `006-padronizar-chance-player`.
- O diretorio `007-extracao-conhecimento` tinha apenas `draft.md` vazio no momento da catalogacao.
- Parte do conhecimento ja aparece dentro de `conhecimentos absorvidos/retrospectives`, mas ainda foi catalogada porque os arquivos seguem formato de retrospectiva e preservam decisoes tecnicas uteis.
