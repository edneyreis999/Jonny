---
title: "Retrospectiva Tecnica - level-designer - loki:init fase 1"
tipo: "retrospectiva-tecnica"
status: "concluida"
tags:
  - loki-init
  - retrospectiva
  - level-designer
---

# Retrospectiva Tecnica - level-designer

Data: 2026-06-30
Fase: `loki:init` fase 1
Agente: `level-designer`
Target retrospective: `planos/000-init-loki/retrospetivas/fase1/level-designer-retrospectiva.md`

## Objetivo e Resultado

Objetivo: criar inventario factual de level design cobrindo mapas/areas, navegacao, gating, encounters, ritmo espacial/temporal, pontos de interesse, fontes de layout e lacunas de softlock/runtime, escrevendo somente nos destinos autorizados.

Resultado entregue:

- `docs/loki-init/level-designer/inventory.md`
- `planos/000-init-loki/retrospetivas/fase1/level-designer-retrospectiva.md`

Criterio de conclusao: pasta de inventario do agente materializada dentro de `docs/loki-init/level-designer/**`, retrospectiva propria escrita no destino exato, e nenhuma escrita em runtime, `docs/index.xml`, `.agents/**`, `.codex/**`, `.claude/**`, `AGENTS.md` ou `CLAUDE.md`.

## Artefatos Consultados

- `docs/loki-init/project-inventory.md`
- `docs/loki-init/technology-context.md`
- `docs/index.xml`
- `docs/02-Core-Loop/Corrida - Core Loop.md`
- `Jhonny/data/MapInfos.json`
- `Jhonny/data/Map001.json` a `Jhonny/data/Map016.json`
- `/Users/edney/projects/coreto/loki-framework/docs/loki-init-inventory-contracts.md`
- Skills lidas: `loki-init`, `loki-rpg-maker-mz-project-inventory`, `loki-retrospectiva-tecnica`, `obsidian-markdown`

## Validacoes

Feitas:

- Parsing JSON estruturado de `MapInfos.json` e dos 16 `MapNNN.json`.
- Resumo de dimensoes, eventos, triggers, condicoes, transfers, Common Event calls, plugin commands, encontros, batalhas e lojas por mapa.
- Checagem estatica de transfers: todos os destinos parseados apontam para mapas existentes e coordenadas dentro dos limites do mapa de destino.
- Conferencia de escopo antes de escrever: inventario dentro de `docs/loki-init/level-designer/**` e retrospectiva no caminho exato.

Nao feitas:

- Playtest.
- Validacao de passabilidade, colisao, camera, render, input, audio, timers, pictures, Common Events, plugins, save/load ou branch reachability.
- Leitura direta de `CommonEvents.json` e `System.json` nesta execucao, exceto por evidencias ja consolidadas nos documentos comuns do init.

## Atritos de Execucao

### source-friction

What Happened: o envelope permitia fontes especificas e tambem havia contexto global amplo do workspace.
Expected Behavior: usar somente fontes autorizadas para o agente.
Actual Behavior: foi necessario separar instrucoes globais ja fornecidas de fontes locais que poderiam estar fora do allowlist.
Evidence: leitura direta ficou limitada aos documentos e `Map*.json` permitidos.
Cause: confirmada, escopo de agente init e mais estreito que o workspace.
Resolution Or Outcome: mantive o inventario em evidencias permitidas e marquei Common Events/System como lacunas quando nao lidos diretamente.
Was Useful: sim.
Waste Impact: low.
Reuse Guidance: em proximos agentes, copiar o allowlist para a secao "Fontes lidas" antes de abrir arquivos.
Avoid Next Time: nao abrir docs tecnicos correlatos apenas porque aparecem em `docs/index.xml`.
Minimum Next Step: se uma claim depender de runtime, marcar `runtime-pending` ou pedir `loki:tech-analysis`.

### script-command

What Happened: foram usados snippets Node read-only para parsear mapas e gerar resumo estrutural.
Expected Behavior: obter evidencia estruturada sem alterar runtime.
Actual Behavior: o primeiro resumo era verboso e truncou por volume de eventos VN.
Evidence: saida inicial com listas grandes de CE calls e texto; segunda execucao resumiu metricas.
Cause: mapas VN, especialmente mapa 13, concentram muitos comandos repetidos.
Resolution Or Outcome: reduzi a extracao para dimensoes, triggers, condicoes, transfers, contagens e bounds check.
Was Useful: sim.
Waste Impact: low.
Reuse Guidance: para inventarios de mapas RMMZ, usar resumo agregado primeiro e so depois abrir eventos especificos.
Avoid Next Time: nao imprimir listas completas de `117`, texto ou choices em mapas VN densos.
Minimum Next Step: gerar tabelas por mapa com contagens e transfers deduplicados.

### validation-friction

What Happened: a checagem estatica confirmou JSON e bounds, mas nao pode validar passabilidade, autorun cleanup ou pacing perceptivel.
Expected Behavior: separar validacao estrutural de runtime.
Actual Behavior: inventario ficou `parcial` com `runtime-pending` para comportamento jogavel.
Evidence: mapa 13 tem muitas branches/transfers e mapa 1 depende de CE5; Common Events nao foram auditados diretamente.
Cause: confirmada, o agente nao recebeu Playtest nem leitura direta de todos os runtime owners.
Resolution Or Outcome: registrei gates de `technical-review`, `human-validation` e recomendacao de `loki:tech-analysis`.
Was Useful: sim.
Waste Impact: low.
Reuse Guidance: level-design inventory deve tratar autorun, transfer e QTE como superficies de risco ate Playtest.
Avoid Next Time: nao declarar "softlock-free" com base em JSON parseado.
Minimum Next Step: analisar Common Events CE3/CE5/CE18/CE19/CE20/CE21 e executar Playtest de rotas.

## Inferencias Uteis

- `Map001` funciona como staging de corrida porque tem autorun condicionado por `V100` e chama CE5; a ligacao com `VAR_RACE_ID` veio do inventario comum.
- O layout jogavel principal da corrida e temporal/QTE, nao uma pista tile-based, porque o core loop define cenas temporizadas e os mapas inspecionados nao tem encontros ou movimento de pista implementado.
- Mapas com 17x13 e autorun unico devem ser classificados como VN/staging/transition ate prova contraria.

## Inferencias Evitadas

- Nao inferir que transfer para `(0,0)` e seguro; apenas esta dentro dos limites.
- Nao inferir que CE5, CE20 ou CE21 executam corretamente; apenas foram chamados por mapas.
- Nao inferir que Curva do Diabo esta ativa no MVP; o core loop marca a fase especial como futura/reservada em partes do documento.

## Caminho Minimo Recomendado

1. Ler `docs/loki-init/project-inventory.md`, `technology-context.md`, `docs/index.xml` e o contrato de inventario.
2. Parsear `MapInfos.json` e todos os `MapNNN.json` com resumo agregado: dimensoes, triggers, condicoes, transfers, CE calls, plugin commands e encounter surfaces.
3. Checar bounds dos transfers.
4. Escrever inventario separando fatos parseados, inferencias, lacunas e gates.
5. Escrever retrospectiva propria antes de finalizar.

## Riscos Residuais

- Branch reachability e route matrix continuam nao validados.
- Softlock por autorun/Common Event continua pendente.
- Passabilidade e enquadramento de destinos, especialmente `(0,0)`, continuam pendentes.
- Pacing temporal da corrida e legibilidade de safe/risk dependem de Playtest.

## Proximo Passo

Executar `loki:tech-analysis` focado em mapas de entrada de corrida e Common Events CE3/CE5/CE18/CE19/CE20/CE21, seguido de Playtest com matriz minima: start -> corrida 1, retry, corrida 2, corrida 3, rota true, rota false e finais.
