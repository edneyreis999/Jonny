---
title: "Retrospectiva Tecnica - scene-presentation-designer"
tipo: "retrospectiva tecnica"
status: "concluida"
agent: "scene-presentation-designer"
date: 2026-06-30
tags:
  - loki-init
  - retrospectiva
  - scene-presentation-designer
---

# Retrospectiva Tecnica - scene-presentation-designer

## Objetivo e Resultado

Objetivo: produzir inventario factual de apresentacao de cena para `loki:init`, cobrindo cenas, staging, camera, transicoes, sprites/busts, backgrounds, CGs, timing, cues, ownership de pictures e lacunas de validacao.

Resultado entregue: `docs/loki-init/scene-presentation-designer/presentation-inventory.md`.

Criterio de conclusao: pasta de inventario materializada dentro do `target_inventory_dir`, com fontes lidas, fatos atuais, mapa de localizacao, cobertura, lacunas e handoff estruturado; retrospectiva propria escrita no `target_retrospective` exato.

Restricoes relevantes:

- Escrita permitida somente em `docs/loki-init/scene-presentation-designer/**` e neste arquivo.
- Escrita proibida em runtime, `Jhonny/**`, `docs/index.xml`, `.agents/**`, `.codex/**`, `.claude/**`, `AGENTS.md` e `CLAUDE.md`.
- Validacao perceptivel, runtime, audio, timing e staging dependem de gate humano/Playtest.

## Artefatos

Criados:

- `docs/loki-init/scene-presentation-designer/presentation-inventory.md`
- `planos/000-init-loki/retrospetivas/fase1/scene-presentation-designer-retrospectiva.md`

Consultados:

- `docs/loki-init/project-inventory.md`
- `docs/loki-init/technology-context.md`
- `docs/index.xml`
- `docs/02-Core-Loop/Corrida - Core Loop.md`
- `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`
- `Jhonny/data/CommonEvents.json`
- `Jhonny/data/MapInfos.json`
- listagem de `Jhonny/img/pictures/race/**`
- contratos dos skills `loki-init`, `loki-rpg-maker-mz-project-inventory`, `loki-index-navigator`, `obsidian-markdown` e `loki-retrospectiva-tecnica`

Descartados:

- Deep-read de mapas `MapXXX.json`, plugins, audio folders e imagens binarias, por estarem fora das fontes permitidas neste envelope.

## Validacoes

Feitas:

- Parsing JSON estruturado de `CommonEvents.json` e `MapInfos.json` via Node.
- Cross-check estatico entre picture assets referenciados por Common Events e listing de `Jhonny/img/pictures/race/**`.
- Conferencia de existencia previa da pasta-alvo e da retrospectiva antes de escrever.
- Separacao explicita entre evidencia estatica, drift documental e validacao pendente.

Nao feitas:

- Playtest.
- Preview no editor RPG Maker MZ.
- Validacao de contraste, legibilidade, audio mix, timing percebido, foco visual, input ou save/load.
- Parse de plugins ou leitura de `MapXXX.json`.

Dependentes de gate humano:

- Pacing, leitura visual, staging, audio, camera, transicoes, input, Curva do Diabo e tela de resultado.

## Decisoes e Pendencias

Decisoes humanas recebidas no envelope:

- Projeto selecionado como `game-dev`.
- Escrita escopada no diretorio do agente e retrospectiva exata.
- Fontes read-only limitadas a docs, CommonEvents, MapInfos e listing de race pictures.

Pendencias:

- Confirmar se `P_cena` deve aparecer numericamente, pois o spec nega e CE8/CE9 mostram `\V[103]%`.
- Confirmar se `SW_IS_CURVA_DIABO` deve permanecer sempre OFF no MVP.
- Confirmar se efeitos descritos no spec mas nao observados nos CEs lidos sao backlog, drift ou implementacao em superficie nao lida.

## Rastro Operacional

Leituras uteis:

- Contrato `loki:init` e contrato universal de inventario para confirmar writes e conteudo minimo.
- `docs/index.xml` antes dos docs duradouros para selecionar menor leitura suficiente.
- `Corrida - Core Loop` e `Corrida - Runtime e Eventos` para separar intencao de cena de contrato runtime.
- Parsing de Common Events para picture IDs, comandos de audio, waits, chamadas e plugin commands.

Comandos/scripts relevantes:

- `sed` para leituras escopadas de docs e contratos.
- `rg` para localizar linhas de feedback, picture, timing e resultado nos docs.
- `find Jhonny/img/pictures/race -maxdepth 3 -type f | sort` para listing permitido.
- Snippets Node read-only para parsear JSON e gerar mapas de CEs, picture IDs, audio cues, MapInfos e referencias de assets.

## Atritos

### source-friction

- What Happened: o spec e o runtime estatico divergem em pontos de apresentacao: `P_cena` numerico, fundo de resultado e alguns efeitos/audio.
- Expected Behavior: docs e Common Events refletirem a mesma superficie de apresentacao.
- Actual Behavior: docs descrevem intencoes que nao aparecem integralmente nos CEs lidos.
- Evidence: CE8/CE9 mostram TextPicture `\V[103]%`; spec afirma que `P_cena` nao e mostrado numericamente.
- Cause: provavel drift entre design docs e implementacao ou fontes runtime nao lidas.
- Resolution Or Outcome: registrado como lacuna, nao como bug confirmado.
- Was Useful: sim.
- Waste Impact: low.
- Reuse Guidance: em tarefas futuras, comparar doc + JSON antes de planejar alteracao visual.
- Avoid Next Time: buscar primeiro por `TextPicture`, `Show Picture` e picture IDs nas fontes runtime.
- Minimum Next Step: `loki:tech-analysis` focado em drift de apresentacao da corrida.

### validation-friction

- What Happened: a tarefa pede apresentacao, pacing, camera e audio, mas o envelope permite apenas inventario estatico.
- Expected Behavior: validacao perceptivel exigiria Playtest/editor/runtime.
- Actual Behavior: somente evidencias estaticas puderam ser verificadas.
- Evidence: skill RPG Maker MZ e contrato do agente proíbem declarar pacing/leitura/audio como validados sem gate humano.
- Cause: limite correto do workflow de init.
- Resolution Or Outcome: todas as validacoes perceptiveis foram marcadas como pendentes.
- Was Useful: sim.
- Waste Impact: low.
- Reuse Guidance: tratar scene-presentation no init como ownership map, nao QA perceptivel.
- Avoid Next Time: declarar `runtime-pending` cedo para impedir conclusoes de UX.
- Minimum Next Step: Playtest com checklist de pictures, input lock, resultado e retry.

### inference-good

- What Happened: CE7 chamava CEs auxiliares 8/9/14/15, entao o inventario inicial dos CEs principais seria incompleto.
- Expected Behavior: seguir chamadas `command117` antes de fechar ownership de pictures.
- Actual Behavior: parsing adicional revelou `EV_RenderSinal`, `EV_RenderCurva`, `EV_ResolucaoSafe` e `EV_ResolucaoRiskOK`.
- Evidence: CE7 calls 8/9/19; CE11 calls 14; CE12 calls 15/18.
- Cause: grafo de Common Events precisa incluir auxiliares de render/resolucao.
- Resolution Or Outcome: auxiliares incluidos no inventario.
- Was Useful: sim.
- Waste Impact: low.
- Reuse Guidance: para apresentacao de cena em RMMZ, sempre expandir calls diretos dos CEs de renderer e input.
- Avoid Next Time: gerar grafo `command117` antes do resumo narrativo.
- Minimum Next Step: se houver tech-analysis, expandir tambem callers de mapas.

## Caminho Minimo Recomendado

1. Ler `docs/index.xml`, `project-inventory.md` e `technology-context.md`.
2. Ler apenas os docs `Corrida - Core Loop` e `Corrida - Runtime e Eventos`.
3. Parsear `CommonEvents.json` para CEs 3, 5-19 e expandir `command117` auxiliares.
4. Listar `Jhonny/img/pictures/race/**` e cruzar com refs de `Show Picture`.
5. Produzir mapa de picture IDs, drift doc-runtime e lacunas de Playtest.
6. Escrever somente no `target_inventory_dir` e `target_retrospective`.

## Aprendizados Reutilizaveis

- Validado nesta execucao: o ownership de apresentacao da corrida esta concentrado em Common Events e picture IDs altos, com CE8/CE9 como renderizadores de cena.
- Validado nesta execucao: o listing de race pictures cobre todos os assets referenciados por `Show Picture` nos CEs lidos.
- Hipotese: `overlay_flash_white` pode ser asset planejado/backlog, pois existe no listing mas nao apareceu nos CEs lidos.
- Falha a evitar: nao assumir que o spec "sem plugins" esta atualizado; o contexto tecnico informa plugins ativos e CEs usam `TextPicture` e scripts de picture input.

## Riscos Residuais

- Sem leitura de mapas e plugins, busts VN e cenas narrativas permanecem parcialmente desconhecidas.
- Sem Playtest, nao ha prova de composicao, timings, audio, input, cleanup ou resultado visual.
- Drift entre doc e runtime pode afetar decisao de produto/UX antes de qualquer implementacao.

## Proximo Passo

Executar `loki:tech-analysis` focado em apresentacao da corrida se o objetivo for corrigir drift ou preparar um plano de Playtest; caso contrario, usar este inventario como fonte para consolidacao do `loki:init`.
