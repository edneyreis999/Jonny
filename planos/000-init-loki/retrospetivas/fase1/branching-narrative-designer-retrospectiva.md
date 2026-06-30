---
title: "Retrospectiva Tecnica - branching-narrative-designer"
tipo: "retrospectiva-tecnica"
status: "complete"
tags:
  - loki-init
  - retrospectiva
  - branching-narrative-designer
---

# Retrospectiva Tecnica - branching-narrative-designer

Data: 2026-06-30
Agente: `branching-narrative-designer`
Target retrospective: `planos/000-init-loki/retrospetivas/fase1/branching-narrative-designer-retrospectiva.md`

## Objetivo E Resultado

Objetivo: produzir inventario factual estatico de escolhas, flags, condicoes, rotas, endings, consequencias, fontes de rota e lacunas de evidencia para `loki:init`, sem escrever runtime.

Resultado entregue: `docs/loki-init/branching-narrative-designer/inventory.md`.

Status: completo para o envelope fornecido; parcial como inventario de branching total do jogo porque `CommonEvents.json`, `System.json`, `Roleta Paulista`, runtime e Playtest ficaram fora das fontes permitidas.

## Artefatos

Criados:

- `docs/loki-init/branching-narrative-designer/inventory.md`
- `planos/000-init-loki/retrospetivas/fase1/branching-narrative-designer-retrospectiva.md`

Consultados:

- `docs/loki-init/project-inventory.md`
- `docs/loki-init/technology-context.md`
- `docs/index.xml`
- `docs/02-Core-Loop/Corrida - Core Loop.md`
- `Jhonny/data/MapInfos.json`
- Mapas selecionados: `Map001`, `Map005`, `Map006`, `Map007`, `Map008`, `Map009`, `Map010`, `Map011`, `Map012`, `Map013`, `Map014`, `Map015`, `Map016`
- Contratos e skills Loki: `loki:init`, contrato de inventario, `loki-rpg-maker-mz-project-inventory`, `loki-index-navigator`, `obsidian-markdown`, `loki-retrospectiva-tecnica`

Descartados/bloqueados:

- Leitura direta de `System.json` e `CommonEvents.json`, por nao constarem no envelope de fontes desta tarefa.
- Qualquer Playtest ou editor/runtime RPG Maker MZ.

## Validacoes

Feitas:

- Confirmado que as escritas ficaram dentro de `docs/loki-init/branching-narrative-designer/**` e no target retrospective exato.
- Parsing JSON estruturado dos mapas selecionados.
- Separacao explicita entre evidencia estatica, fonte documental, lacuna e runtime pendente.

Nao feitas:

- Validacao de alcance de rota, save/load, execucao de Common Events, plugins, UI, audio, timing ou endings.
- Auditoria completa de todos os mapas e Common Events.

Dependentes de gate humano:

- `human-validation` por Playtest antes de declarar rota, ending, pacing ou estado persistido validado.
- `technical-review` antes de transformar este inventario em plano de edicao de dados.

## Atritos Materiais

### script-command

What Happened: usei snippets Node read-only para parsear `MapInfos.json` e mapas selecionados.
Expected Behavior: obter sumarios compactos de choices, variaveis, transfers e comentarios.
Actual Behavior: a primeira tentativa com template string dentro de comando shell falhou por interpolacao do `zsh`; as tentativas seguintes geraram output truncado quando `Map013` revelou grande volume de escolhas.
Evidence: erro `bad substitution`; outputs truncados com 192k, 82k e 524k tokens brutos.
Cause: quoting inadequado no primeiro comando e granularidade inicial grande demais para `Map013`.
Resolution Or Outcome: reexecutei com heredoc e usei os dados agregados mais relevantes no inventario, sem salvar artefatos intermediarios.
Was Useful: sim.
Waste Impact: medium.
Reuse Guidance: para mapas VN grandes, agregue primeiro por contagem de grupos unicos, efeitos de estado e transfers; nao imprima texto/branch stack completo.
Avoid Next Time: usar heredoc Node desde o primeiro comando e aplicar limite por mapa/efeito antes de imprimir.
Minimum Next Step: se retomar, criar parser temporario read-only que exporte apenas `choices_unique`, `state_ops`, `transfers`, `page_conditions` e `route_comments_unique`.

### source-friction

What Happened: a fonte documental principal menciona `ConcernScore`, finais e `Roleta Paulista`, mas essa fonte canonica nao estava liberada para leitura.
Expected Behavior: matriz de endings completa.
Actual Behavior: inventario conseguiu mapear rotas runtime observadas em mapas, mas marcou endings canonicos e thresholds de `ConcernScore` como missing evidence.
Evidence: `Corrida - Core Loop.md` referencia `Roleta Paulista`; envelope de usuario nao autorizou leitura desse doc.
Cause: escopo de fontes deliberadamente estreito.
Resolution Or Outcome: lacuna registrada no inventario e proposta de `loki:tech-analysis` com fonte minima adicional.
Was Useful: parcialmente.
Waste Impact: low.
Reuse Guidance: quando branching depende de pitch/canon externo, incluir esse doc no envelope do agente.
Avoid Next Time: no fan-out, passar documentos canonicos de narrativa junto com o core loop para agentes de rota.
Minimum Next Step: ler `Roleta Paulista` em uma tech analysis aprovada.

### validation-friction

What Happened: `Map013` contem transfer para final true dentro de branch e transfer final para corrida 3 fora do branch.
Expected Behavior: static parse indicaria uma rota simples.
Actual Behavior: sem runtime/engine-source/Playtest, nao e seguro afirmar se o transfer dentro do branch interrompe todos os comandos posteriores ou como o jogador percebe a transicao.
Evidence: parser estatico encontrou transfer para `Map006` no branch "Slash the Opala's tire..." e set `variavel 100 = 3` + transfer para `Map001` no fim do evento.
Cause: semantica runtime de transfer durante event list nao foi validada no envelope.
Resolution Or Outcome: registrado como risco de rota e `runtime-pending`.
Was Useful: sim.
Waste Impact: low.
Reuse Guidance: tratar transfers dentro de branches aninhados como risco ate Playtest ou leitura de semantica do interpreter.
Avoid Next Time: incluir `js/rmmz_objects.js` ou Common Event/runtime source quando a pergunta exigir semantica de interrupcao.
Minimum Next Step: Playtestar a escolha "Slash the Opala's tire..." e/ou inspecionar `Game_Interpreter.command201`.

## Inferencias Uteis

- `MapInfos.json` foi suficiente para selecionar mapas narrativos/finais sem varrer todo `Jhonny/data`.
- Variavel 100 aparece como `VAR_RACE_ID` por convergencia entre core loop e mapas: `Map001` condiciona paginas em 1/2/3, enquanto VNs setam 100 antes de transferir para `Map001`.
- A distincao "MVP atual" vs "visao futura Curva do Diabo" precisa ser preservada em qualquer plano.

## Inferencias A Evitar

- Nao inferir que `FIM_TRUE` e alcancavel apenas porque existe transfer estatico para `Map006`.
- Nao inferir que comentarios de mapa sao fonte de verdade final; eles sao evidencia de intencao local.
- Nao inferir nomes de variaveis 1 e 2 sem `System.json`.

## Caminho Minimo Para Proxima Execucao

1. Ler `docs/index.xml`, `project-inventory.md`, `technology-context.md` e `Corrida - Core Loop.md`.
2. Parsear `MapInfos.json`.
3. Selecionar mapas narrativos/finais por nome e incluir `Map001`.
4. Gerar resumo estruturado limitado a choices unicos, page conditions, var/switch ops, transfers e comentarios de rota unicos.
5. Registrar `runtime-pending` para alcance de rotas e propor `loki:tech-analysis` se `System.json`, `CommonEvents.json`, pitch canonico ou engine semantics forem necessarios.

## Riscos Residuais

- Matriz de endings incompleta sem `Roleta Paulista` e sem Common Events.
- Possivel drift entre docs, comentarios de mapa e runtime atual.
- `Map013` precisa de QA dedicado por volume de branches e repeticao.
- Save/load e persistencia das variaveis de pagina VN nao foram validados.

## Candidatos Para Melhoria Continua

Nenhum candidato de pacote deve ser promovido agora. A principal melhoria e local/processual: envelopes futuros de branching devem incluir a fonte canonica de narrativa e permitir leitura de `System.json`/`CommonEvents.json` quando o objetivo pede flags, route IDs e persisted state.
