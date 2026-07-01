---
title: "Loki Init - Game Business Analyst Inventory"
tipo: "inventario de requisitos"
status: "parcial"
agent: "game-business-analyst"
tags:
  - loki-init
  - game-business-analyst
  - requisitos
  - game-dev
  - rpg-maker-mz
---

# Loki Init - Game Business Analyst Inventory

Data: 2026-06-30
Agente: `game-business-analyst`
Escopo: inventario factual de objetivos de produto, publico, requisitos, criterios de aceite, restricoes, fontes de decisao, conflitos e lacunas testaveis para o projeto game-dev `Jhonny`.

> [!warning] Limite de validacao
> Este inventario e estatico. Ele nao valida gameplay, input, UI, audio, Common Events, plugins, save/load, pacing, balanceamento, compreensao do jogador ou narrativa. Esses itens requerem Playtest ou outro gate humano aprovado.

## Escopo Inventariado

Especialidade inventariada: analise de negocio para jogo, com foco em requisitos testaveis e rastreaveis.

Superficie examinada:

- Documentacao duradoura em `docs/index.xml`.
- Inventario comum e contexto tecnico de `loki:init`.
- Especificacao da corrida em `docs/02-Core-Loop/Corrida - Core Loop.md`.
- Contrato runtime da corrida em `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`.
- Procedimentos de debug, Playtest e scripts historicos em `docs/03-Tech/**`.
- Roteamento tecnico do projeto RPG Maker MZ em `Jhonny/CLAUDE.md`.

Fora do escopo por contrato desta execucao:

- Leitura profunda direta de `Jhonny/data/*.json`, `Jhonny/js/plugins.js`, mapas, plugins, assets, saves ou scripts historicos.
- Qualquer escrita em runtime, `Jhonny/**`, `.agents/**`, `.codex/**`, `.claude/**`, `AGENTS.md`, `CLAUDE.md` ou `docs/index.xml`.
- Validacao perceptivel em browser, editor RPG Maker MZ ou Playtest.

## Fontes Lidas

| Fonte | Uso no inventario | Nivel de evidencia |
| --- | --- | --- |
| `docs/loki-init/project-inventory.md` | Escopo do workspace, superficies sensiveis, resumo tecnico inicial e lacunas do init. | `editor-structural`, `static-risk` |
| `docs/loki-init/technology-context.md` | Classificacao `game-dev`, stack detectada, plugins ativos, agentes requeridos e gates. | `editor-structural`, `static-risk` |
| `docs/index.xml` | Catalogo navegavel, prioridade e finalidade das fontes duradouras. | `editor-structural` |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Objetivos de produto da corrida, regras, parametros, thresholds, riscos e decisoes abertas. | `static-risk`, `runtime-pending` |
| `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Contratos runtime, grafo de Common Events, tela de resultado, retry e gates de edicao. | `static-risk`, `runtime-pending` |
| `docs/03-Tech/RPG Maker MZ - Debug Playtest.md` | Criterios para coletar evidencia perceptivel e limites de debug. | `runtime-pending` |
| `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md` | Restricoes para scripts historicos e validacao de patches em data JSON. | `static-risk` |
| `Jhonny/CLAUDE.md` | Regras locais do projeto RPG Maker MZ, stack, localizacao de docs e restricoes de modificacao. | `static-risk` |
| Contrato de inventario Loki | Conteudo minimo esperado para `game-business-analyst`. | `process-contract` |

## Mapa de Localizacao

| Tipo de informacao | Local atual |
| --- | --- |
| Catalogo de docs duradouros | `docs/index.xml` |
| Inventario comum do init | `docs/loki-init/project-inventory.md` |
| Contexto tecnico e agentes | `docs/loki-init/technology-context.md` |
| Regras e parametros da corrida | `docs/02-Core-Loop/Corrida - Core Loop.md` |
| Lifecycle runtime e Common Events da corrida | `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` |
| Procedimento de Playtest/debug | `docs/03-Tech/RPG Maker MZ - Debug Playtest.md` |
| Procedimento para scripts historicos | `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md` |
| Roteamento do runtime RPG Maker MZ | `Jhonny/CLAUDE.md` |

## Fatos - Objetivos de Produto Presentes

- O projeto selecionado para o init e `game-dev`.
- O runtime real identificado e `Jhonny/`, um projeto RPG Maker MZ chamado "Bye Bye Jhonny".
- O documento principal de produto/mecanica lido define a corrida como um roguelite timer-based de decisoes binarias, nao como steering racing.
- A promessa mecanica documentada e uma corrente procedural de cenas com timer, decisao safe/risk, recurso `Consciência`, pontuacao `Pontos de Glória`, crash/restart e tres corridas narrativas.
- A especificacao declara o principio de design: mecanica deliberadamente rasa, com profundidade vindo da leitura contextual e do arco emocional.
- O MVP documentado adia a Fase Especial da Curva do Diabo. Para o MVP, a Corrida 3 tem 10 cenas normais, sem tratamento especial de climax, e `SW_IS_CURVA_DIABO` fica reservada.
- O objetivo operacional da corrida, no estado documentado, e completar as cenas sem crash e atingir thresholds de `Pontos de Glória` por corrida.
- A documentacao declara que Playtest cego e necessario para validar se o tema e a experiencia emergem organicamente.

## Fatos - Publico Declarado

- As fontes lidas declaram contexto de gamejam: "Summer Tavern Games (Tavern Jam)".
- As fontes lidas declaram alvo tecnico web-playable HTML5 via RPG Maker MZ.
- As fontes lidas mencionam mouse, teclado e mobile/tap como entradas esperadas para a corrida.
- As fontes lidas nao declaram persona, faixa etaria, plataforma de distribuicao final, rating de conteudo, criterios de acessibilidade por publico, nem perfil esperado do jogador alem do contexto de gamejam/playtest.

## Fatos - Requisitos Existentes

| ID local | Requisito documentado | Fonte | Status de validacao |
| --- | --- | --- | --- |
| BA-REQ-001 | A corrida deve ter cenas binarias de `Sinal` e `Curva`. | `Corrida - Core Loop` | Estatico, runtime pendente |
| BA-REQ-002 | Cada cena deve ter uma acao safe e uma acao risk. | `Corrida - Core Loop` | Estatico, runtime pendente |
| BA-REQ-003 | Safe deve avancar uma cena, conceder `+10 Consciência` e `+10 Pontos de Glória`. | `Corrida - Core Loop` | Estatico, runtime pendente |
| BA-REQ-004 | Risk deve rolar `0-99` contra `Consciência + P_cena`, consumir `P_cena` e, em sucesso, conceder `P_cena x 2` pontos. | `Corrida - Core Loop` | Estatico, runtime pendente |
| BA-REQ-005 | Falha de risk deve disparar crash e restart da mesma corrida. | `Corrida - Core Loop` | Estatico, runtime pendente |
| BA-REQ-006 | `P_cena` deve ser sorteada por cena em `{0,10,...,100}`. | `Corrida - Core Loop` | Estatico, runtime pendente |
| BA-REQ-007 | O comprimento das corridas deve escalar em 6, 8 e 10 cenas. | `Corrida - Core Loop` | Estatico, runtime pendente |
| BA-REQ-008 | A vitoria por corrida exige fim das cenas e threshold minimo de pontos. | `Corrida - Core Loop` | Estatico, runtime pendente |
| BA-REQ-009 | Thresholds atuais documentados sao 200/400/600 para corridas 1/2/3. | `Corrida - Core Loop` | Estatico, runtime pendente |
| BA-REQ-010 | A tela canonica de resultado deve ser `EV_VitoriaCorrida` e deve decidir VITORIA/DERROTA antes de progredir ou reiniciar. | `Corrida - Runtime e Eventos` | Estatico, runtime pendente |
| BA-REQ-011 | `SW_INPUT_LOCKED` deve bloquear input de gameplay durante resultado, resolucao e transicoes. | `Corrida - Runtime e Eventos` | Estatico, runtime pendente |
| BA-REQ-012 | Retry nao deve repetir a VN nem preload completo quando o caminho validado pula esse trecho. | `Corrida - Runtime e Eventos` | Estatico, runtime pendente |
| BA-REQ-013 | Scripts historicos em `Jhonny/planos` nao devem ser reexecutados sem classificacao, preflight e autorizacao explicita. | `RPG Maker MZ - Scripts de Plano` | Processo documentado |
| BA-REQ-014 | Bugs perceptiveis devem coletar snapshot minimo antes de correcao. | `RPG Maker MZ - Debug Playtest` | Processo documentado |
| BA-REQ-015 | Qualquer comportamento visual, input, audio, pictures, plugins e Common Events requer Playtest humano como gate final. | `RPG Maker MZ - Debug Playtest` | Gate pendente |

## Fatos - Criterios de Aceite Existentes

As fontes nao usam um formato formal unico de "Given/When/Then". Existem, porem, criterios verificaveis ou contratos observaveis:

- Completar todas as cenas sem crash nao basta; o jogador precisa atingir o threshold de `Pontos de Glória`.
- Abaixo do threshold, a tela deve mostrar DERROTA e reiniciar a mesma corrida via `EV_Crash`.
- Acima do threshold em corridas 1 e 2, o jogo deve incrementar `VAR_RACE_ID` e iniciar a proxima corrida.
- Acima do threshold na corrida 3, o jogo deve mostrar "FIM" e "Obrigado por jogar!".
- Na tela de resultado, apenas uma entre as pictures de VITORIA e DERROTA deve aparecer.
- `VAR_VITORIA_PASSOU` deve ser resetada no `EV_Crash` e no INIT do `EV_RaceOrchestrator`.
- `SW_INPUT_LOCKED` deve impedir que setas ou CEs de gameplay consumam input durante a tela de resultado.
- Debug de bugs perceptiveis deve registrar ambiente, caminho executado, esperado/observado, logs/snapshots e itens ainda nao validados por Playtest.

## Fatos - Restricoes Documentadas

- O root do workspace nao e o root runtime; o runtime real e `Jhonny/`.
- O init nao pode escrever runtime, engine, assets, dados gerados, build outputs, dependencias ou codigo.
- Alteracoes futuras em `Jhonny/data/*.json` exigem workflow/skill de data JSON e parser estruturado.
- Alteracoes futuras em `Jhonny/js/plugins/**` ou `Jhonny/js/plugins.js` exigem workflow/skill de plugin.
- Validacao estrutural de JSON ou JavaScript nao prova comportamento jogavel.
- Scripts historicos em `Jhonny/planos/**` sao evidencia historica por padrao, nao ferramentas reexecutaveis automaticamente.
- `docs/index.xml` deve ser consultado antes de mudar runtime da corrida.
- `SW_IS_CURVA_DIABO` esta reservada para uso futuro no MVP documentado.
- `placa_curva_dir.png` existe como asset reservado e nao deve ser referenciado no MVP.

## Fontes de Decisao

| Decisao ou regra | Fonte declarada |
| --- | --- |
| `selected_project_type = game-dev` | `docs/loki-init/technology-context.md` |
| Runtime real em `Jhonny/` | `docs/loki-init/project-inventory.md`, `Jhonny/CLAUDE.md` |
| Corrida como core loop roguelite timer-based | `docs/02-Core-Loop/Corrida - Core Loop.md` |
| Curva do Diabo fora do MVP atual | Callout de escopo no topo de `Corrida - Core Loop` |
| Thresholds atuais 200/400/600 | Secao 8.2 de `Corrida - Core Loop` |
| `EV_VitoriaCorrida` como tela canonica de resultado | `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` |
| Playtest humano como gate final perceptivel | `docs/03-Tech/RPG Maker MZ - Debug Playtest.md` |
| Scripts de plano como evidencia historica | `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md` |

## Conflitos e Ambiguidades

| ID | Conflito | Evidencia | Impacto BA |
| --- | --- | --- | --- |
| BA-CONF-001 | A especificacao da corrida afirma em trechos que a implementacao e "sem plugins", mas o contexto tecnico registra plugins ativos e helper `Jhonny_RaceHelper`. | `Corrida - Core Loop`, `technology-context.md`, `project-inventory.md` | Historias futuras nao devem assumir "sem plugins" como verdade atual sem tech analysis. |
| BA-CONF-002 | A Curva do Diabo aparece como final fixo da Corrida 3 na visao completa, mas tambem esta explicitamente fora do MVP atual. | `Corrida - Core Loop` | Requisitos do MVP precisam excluir essa fase ou criar uma decisao humana antes de inclui-la. |
| BA-CONF-003 | Timer expirado aparece majoritariamente como safe automatico, mas uma secao de restart lista timer expirado como erro fatal/crash. | `Corrida - Core Loop` secoes TL;DR, 4/5 e 7.1 | Criterio de aceite de timeout esta inconsistente e bloqueia story testavel sem decisao. |
| BA-CONF-004 | Thresholds 200/400/600 tornam safe-only incapaz de vencer, mas um risco conhecido diz que vencer sem risk e "aceitavel e planejado". | `Corrida - Core Loop` secoes 8.2 e 10 | Objetivo de balanceamento precisa decidir se safe-only deve completar, vencer ou apenas sobreviver. |
| BA-CONF-005 | `Jhonny/CLAUDE.md` registra resolucao 816x624 em "Game Configuration", enquanto inventarios do init registram janela/UI 1280x720. | `Jhonny/CLAUDE.md`, `project-inventory.md`, `technology-context.md` | Requisitos de UI/HUD nao devem fixar resolucao sem confirmar fonte atual. |
| BA-CONF-006 | `Jhonny/CLAUDE.md` diz que arrays de `System.json` sao 0-based para Editor ID 101, enquanto `Corrida - Core Loop` diz que `_data[id]` acessa diretamente pelo Editor ID. | `Jhonny/CLAUDE.md`, `Corrida - Core Loop` | Qualquer criterio baseado em IDs deve exigir confirmacao tecnica em `System.json`. |
| BA-CONF-007 | `docs/index.xml` lista muitos artefatos `docs/loki-init/**` que o inventario comum declarou como stale no inicio da execucao. | `docs/index.xml`, `project-inventory.md` | Proximos agentes devem tratar o catalogo como guia, nao como prova de existencia atual. |

## Lacunas de Requisitos Testaveis

| ID | Lacuna | Evidencia ausente | Gate ou proximo passo |
| --- | --- | --- | --- |
| BA-GAP-001 | Publico-alvo nao esta definido de forma testavel. | Persona, plataforma final, rating, contexto de sessao e acessibilidade esperada. | Decisao de produto/human validation. |
| BA-GAP-002 | MVP nao tem Definition of Done consolidada em formato de aceite. | Lista fechada de features in/out, criterio de release e nao-regressao. | `loki:tech-analysis` ou `loki:generate-action-plan` com PO/design. |
| BA-GAP-003 | Timeout nao tem comportamento unico aceito. | Decisao entre safe automatico e crash/restart. | Decisao humana antes de story/runtime task. |
| BA-GAP-004 | Balanceamento dos thresholds nao tem criterio de sucesso de Playtest. | Taxa alvo de sucesso, numero de tentativas esperado, tolerancia de frustracao. | Playtest cego e analise de balanceamento. |
| BA-GAP-005 | Comunicacao de `P_cena` visual nao tem criterio observavel. | Como medir se o jogador entende baixo/medio/alto sem numero. | Playtest com roteiro de observacao. |
| BA-GAP-006 | Curva do Diabo nao tem aceite separado para MVP vs pos-MVP. | Story futura, criterio de entrada, impacto narrativo e validacao. | Decisao de escopo antes de implementar. |
| BA-GAP-007 | Save/load durante corrida, resultado e retry nao tem matriz de aceite de produto. | Estados salvos esperados e restauracao perceptivel. | Runtime QA + Playtest. |
| BA-GAP-008 | Mobile/touch e haptic sao mencionados, mas sem criterio de disponibilidade, fallback ou aceite. | Plataformas alvo, tamanho de toque, fallback sem vibracao. | UX/UI + Playtest em dispositivo alvo. |
| BA-GAP-009 | Conteudo sensivel, rating e seguranca narrativa nao aparecem como requisito testavel nas fontes lidas. | Politica de conteudo, warnings, limites de metodo/detalhe, gate especializado. | Revisao humana de narrativa/produto se o escopo exigir. |
| BA-GAP-010 | Integracao com `ConcernScore` e intervencao narrativa esta fora do core loop lido. | Fonte canonica completa de pitch/rotas e matriz de finais. | Narrative/branching inventory ou tech analysis focado. |

## Inferencias Separadas dos Fatos

- Inferencia: o MVP operacional atual parece centrado em estabilizar a corrida sem a Fase Especial da Curva do Diabo, porque o callout de escopo exclui essa fase e reserva o switch.
- Inferencia: thresholds 200/400/600 transformam risk em requisito de vitoria, nao apenas opcao de pontuacao.
- Inferencia: historias futuras devem partir de "contratos runtime + Playtest gate", nao apenas do spec mecanico, porque os docs registram divergencias entre visao, MVP e runtime atual.
- Inferencia: a falta de persona e criterio de release torna prematuro declarar aceite de produto final; e possivel escrever stories tecnicas da corrida, mas nao uma Definition of Done completa do jogo sem decisao humana.

## Riscos

- Reintroduzir valores historicos de threshold 60/100/150 como "correcao" sem decisao de balanceamento.
- Implementar Curva do Diabo por ler a visao completa e ignorar que ela esta fora do MVP.
- Aceitar comportamento de timeout sem resolver o conflito entre safe automatico e crash.
- Validar UI, audio, input ou Common Events por leitura estatica, sem Playtest.
- Usar `docs/index.xml` como prova de existencia atual de documentos do init que podem estar stale.

## Validacoes Requeridas

- `technical-review` antes de transformar este inventario em plano de alteracao runtime.
- `human-validation` antes de declarar validos gameplay feel, compreensao do jogador, pacing, UI, audio, balanceamento, narrativa, save/load ou comportamento perceptivel.
- `loki:tech-analysis` recomendado para qualquer story que toque Common Events, plugins, data JSON, timeout, tela de resultado, retry, thresholds ou Curva do Diabo.

## Cobertura

Inspecionado em detalhe:

- Docs duradouros de corrida e runtime listados no envelope.
- Inventario comum e contexto tecnico do init.
- Procedimentos documentados de Playtest/debug e scripts historicos.

Apenas mapeado:

- Superficies runtime citadas indiretamente: Common Events, switches, variaveis, plugins ativos, assets de corrida.

Nao inspecionado:

- `data/System.json`, `data/CommonEvents.json`, `Map*.json`, `js/plugins.js`, `Jhonny_RaceHelper.js`, assets, saves e scripts em `Jhonny/planos/**`, porque nao estavam no conjunto de fontes permitido para este agente.

## Agent Contract Snapshot

```yaml
parallel_agent_response:
  agent: "game-business-analyst"
  mode: "scoped-writer"
  summary: "Inventario factual de objetivos, publico, requisitos, criterios de aceite, restricoes, decisoes, conflitos e lacunas testaveis para Jhonny/corrida."
  affected_files:
    - "docs/loki-init/game-business-analyst/inventory.md"
    - "planos/000-init-loki/retrospetivas/fase1/game-business-analyst-retrospectiva.md"
  write_scope:
    mode: "init_context_scoped_writer"
    target_files:
      - "docs/loki-init/game-business-analyst/**"
      - "planos/000-init-loki/retrospetivas/fase1/game-business-analyst-retrospectiva.md"
    allowed_writes:
      - "docs/loki-init/game-business-analyst/**"
      - "planos/000-init-loki/retrospetivas/fase1/game-business-analyst-retrospectiva.md"
    scoped_write_domains:
      - "requirements"
      - "rules-specs"
      - "traceability-docs"
    validators:
      - "static source traceability"
      - "write-scope check"
    human_gates:
      - "human-validation"
  affected_runtime_surfaces:
    - "Jhonny runtime mentioned as read-only evidence only"
    - "race Common Events mentioned as runtime-pending"
  affected_domain_ids:
    - "BA-REQ-001..BA-REQ-015"
    - "BA-CONF-001..BA-CONF-007"
    - "BA-GAP-001..BA-GAP-010"
  evidence:
    - "docs/loki-init/project-inventory.md"
    - "docs/loki-init/technology-context.md"
    - "docs/index.xml"
    - "docs/02-Core-Loop/Corrida - Core Loop.md"
    - "docs/02-Core-Loop/Corrida - Runtime e Eventos.md"
    - "docs/03-Tech/RPG Maker MZ - Debug Playtest.md"
    - "docs/03-Tech/RPG Maker MZ - Scripts de Plano.md"
    - "Jhonny/CLAUDE.md"
  findings:
    - type: "requirement"
      source: "Corrida - Core Loop"
      detail: "Corrida definida como QTE roguelite timer-based com safe/risk, Consciência, Pontos de Glória, thresholds e restart."
    - type: "acceptance-criteria"
      source: "Corrida - Runtime e Eventos"
      detail: "Tela canonica de resultado e input lock formam contratos observaveis, mas dependem de Playtest."
    - type: "conflict"
      source: "Corrida - Core Loop"
      detail: "Timeout aparece como safe automatico e tambem como crash em secoes diferentes."
    - type: "gap"
      source: "Fontes lidas"
      detail: "Publico-alvo, Definition of Done do MVP e criterios de Playtest ainda nao estao formalizados."
  risks:
    - "Confundir visao completa com MVP atual."
    - "Declarar valido comportamento perceptivel sem human-validation."
    - "Planejar runtime sem resolver conflitos de timeout, plugins e thresholds."
  confidence: "medium"
  model_class: "frontier_reasoning"
  effort: "high"
  required_validations:
    - "technical-review"
    - "human-validation"
  proposed_next_step: "Resolver conflitos BA-CONF-002, BA-CONF-003 e BA-CONF-004 antes de gerar stories runtime; usar loki:tech-analysis para qualquer alteracao em Common Events, plugins ou data JSON."
```
