---
title: "Retrospectiva Tecnica - source-researcher - loki:init fase 1"
tipo: "retrospectiva tecnica"
status: "concluida"
tags:
  - loki-init
  - source-researcher
  - retrospectiva
  - game-dev
---

# Retrospectiva Tecnica - source-researcher

## Objetivo

Mapear, em modo local e sem pesquisa externa, a qualidade das fontes lidas, conflitos, lacunas e proximas leituras minimas para workflows Loki posteriores no consumidor `/Users/edney/projects/coreto/summer26`, classificado como `game-dev` e `init_support_only`.

## Resultado e status

Status: concluido.

Resultado entregue ao orquestrador: handoff estruturado de suporte com fatos, inferencias, conflitos, lacunas, riscos e caminho minimo. Nenhuma solucao tecnica foi escolhida e nenhum runtime foi validado.

Unica escrita realizada: `planos/000-init-loki/retrospetivas/fase1/source-researcher-retrospectiva.md`.

## Fontes lidas

- `docs/loki-init/project-inventory.md`: inventario comum do init, superficies sensiveis, stack observada, lacunas e conflito de Git.
- `docs/loki-init/technology-context.md`: classificacao `game-dev`, stack RPG Maker MZ, plugins ativos, agentes requeridos e gates.
- `docs/index.xml`: catalogo navegavel de docs duradouros e artefatos Loki init.
- `docs/02-Core-Loop/Corrida - Core Loop.md`: spec mecanica da corrida, thresholds, timers, Curva do Diabo, variaveis e decisoes abertas.
- `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`: contratos runtime, grafo de Common Events, tela de resultado, retry, tela preta e gates antes de editar JSON.
- `docs/03-Tech/RPG Maker MZ - Debug Playtest.md`: procedimento de Playtest/debug e snapshot minimo para bugs perceptiveis.
- `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md`: regras para auditar ou reutilizar scripts historicos de `Jhonny/planos`.
- `Jhonny/CLAUDE.md`: roteamento do projeto RPG Maker MZ, execucao local, dados, plugins, docs duradouros e regras de modificacao.
- `skills/loki-retrospectiva-tecnica/SKILL.md`: formato/substancia esperada para a retrospectiva tecnica.

## Validacoes feitas

- Confirmado por leitura que o trabalho usou apenas fontes locais e nao acionou pesquisa web.
- Confirmado por leitura que o runtime real do jogo e `Jhonny/`, enquanto o root consumidor tambem e workspace de agentes e vault Obsidian.
- Confirmado por leitura que alteracoes futuras em `data/*.json`, Common Events, plugins, input, audio, pictures, save/load e deploy exigem gates e/ou Playtest humano.
- Confirmado que o diretorio permitido da retrospectiva existia antes da escrita.

## Validacoes nao feitas

- Nenhum Playtest foi executado.
- Nenhum servidor local foi iniciado.
- Nenhum JSON, plugin, asset, save, engine ou arquivo sob `Jhonny/**` foi alterado.
- Nenhum script historico em `Jhonny/planos/**` foi executado.
- Nenhuma consistencia runtime foi verificada diretamente em `Jhonny/data/*.json` nesta execucao, pois a tarefa pediu suporte read-only a partir das fontes fornecidas.

## Atritos de execucao

### source-friction

- What Happened: a spec `Corrida - Core Loop` mistura visao completa, MVP, estado runtime validado e decisoes abertas.
- Expected Behavior: fonte de design distinguir claramente canon atual, futuro pos-MVP e hipoteses de Playtest.
- Actual Behavior: a Curva do Diabo aparece como final fixo em varios trechos, mas o callout inicial e a tabela de switches dizem que a fase especial esta adiada e `SW_IS_CURVA_DIABO` fica reservada/intocada no MVP.
- Evidence: trechos de `Corrida - Core Loop.md` sobre MVP, parametros globais, decisoes abertas e switches.
- Cause: provavel acumulacao historica de spec e atualizacoes de fase.
- Resolution Or Outcome: registrar conflito e exigir leitura de fonte runtime ou decisao humana antes de transformar isso em plano.
- Was Useful: sim.
- Waste Impact: low.
- Reuse Guidance: para tarefas de corrida, sempre ler `Corrida - Runtime e Eventos.md` junto do core loop antes de planejar.
- Avoid Next Time: nao tratar uma unica secao da spec como verdade isolada.
- Minimum Next Step: ler os docs de conflitos/open questions do init ou auditar `Jhonny/data/System.json`, `CommonEvents.json` e `plugins.js` em proximo workflow aprovado.

### source-friction

- What Happened: ha divergencia local sobre comportamento de timeout.
- Expected Behavior: timeout ter um unico contrato.
- Actual Behavior: o TL;DR e a secao de restart falam em crash por timeout, mas a visao geral, diagrama, edge cases e riscos de balanceamento falam em safe automatico.
- Evidence: `Corrida - Core Loop.md` linhas localizadas por busca de `Timer expira`.
- Cause: desconhecida; possivel atualizacao parcial da mecanica.
- Resolution Or Outcome: registrar conflito como bloqueador para plano de implementacao que altere timer/input.
- Was Useful: sim.
- Waste Impact: low.
- Reuse Guidance: antes de editar CE de timer/input, resolver timeout como decisao de design/runtime.
- Avoid Next Time: usar busca direcionada por termos de contrato antes de confiar em resumo.
- Minimum Next Step: comparar com `EV_RaceTimer`, `EV_OnSafe`, `EV_OnRisk` e `EV_KeyInput` em `CommonEvents.json` quando houver escopo tecnico.

### inference-good

- What Happened: usei `docs/index.xml` e os dois docs Loki init como fontes de roteamento antes dos docs mecanicos.
- Expected Behavior: reduzir leituras dispersas e localizar contratos de maior prioridade.
- Actual Behavior: a leitura confirmou as superficies sensiveis e os gates antes de qualquer hipotese de implementacao.
- Evidence: `docs/index.xml`, `project-inventory.md`, `technology-context.md`.
- Cause: catalogo navegavel estava presente e atualizado em 2026-06-30.
- Resolution Or Outcome: handoff pode recomendar um caminho minimo curto.
- Was Useful: sim.
- Waste Impact: low.
- Reuse Guidance: proximas LLMs devem comecar por `docs/loki-init/project-inventory.md`, `docs/loki-init/technology-context.md` e `docs/index.xml`.
- Avoid Next Time: evitar abrir muitos arquivos de dominio antes do catalogo.
- Minimum Next Step: usar `docs/index.xml` como roteador, nao como substituto das fontes primarias.

## Inferencias uteis

- O conjunto de fontes e suficiente para preparar analise tecnica ou plano, mas nao para declarar comportamento jogavel validado.
- As fontes tecnicas aprovadas (`Runtime e Eventos`, `Debug Playtest`, `Scripts de Plano`) sao mais confiaveis para gates e preflight do que trechos historicos soltos do core loop.
- `Jhonny/CLAUDE.md` contem dados potencialmente defasados sobre configuracao do jogo quando comparado ao inventario do init; futuras tarefas devem confirmar em `Jhonny/data/System.json` e `Jhonny/package.json` antes de usar numeros de resolucao/start map.

## Inferencias ruins evitadas

- Nao assumir que "Sem plugins" no core loop descreve o estado atual inteiro, porque o contexto tecnico informa plugins ativos como `TextPicture`, `ButtonPicture`, `Jhonny_RaceHelper` e VisuMZ.
- Nao assumir que `docs/index.xml` prova sincronia total do filesystem; o inventario registra stale entries no inicio do init.
- Nao assumir que validacao estrutural ou documentacao atualizada prova input, audio, pictures, Common Events ou UX.

## Riscos residuais

- Conflitos de design/runtime sobre timeout, Curva do Diabo e plugins podem contaminar action plans se nao forem resolvidos antes.
- Thresholds 200/400/600 aparecem como estado runtime validado por doc, mas a execucao atual nao auditou o JSON correspondente.
- O catalogo lista muitos artefatos `docs/loki-init/**`; esta execucao leu apenas os arquivos permitidos pelo chamador.
- A instrucao de workspace sobre Git nao bate com o inventario do init; qualquer workflow de commit precisa fazer novo preflight local.

## Caminho minimo recomendado

1. Para retomar init ou preparar `loki:tech-analysis`, ler `docs/loki-init/project-inventory.md`, `docs/loki-init/technology-context.md` e `docs/index.xml`.
2. Para qualquer tarefa de corrida, ler `Corrida - Runtime e Eventos.md` antes de `Corrida - Core Loop.md`.
3. Se a tarefa tocar bug perceptivel, ler `RPG Maker MZ - Debug Playtest.md` e planejar snapshot/Playtest humano.
4. Se a tarefa tocar scripts de `Jhonny/planos/**`, ler `RPG Maker MZ - Scripts de Plano.md` e tratar scripts historicos como evidencia, nao ferramenta reexecutavel.
5. Antes de escrever plano ou patch sobre timer, input, thresholds, Curva do Diabo ou plugins, auditar fontes primarias runtime em `Jhonny/data/System.json`, `Jhonny/data/CommonEvents.json`, `Jhonny/js/plugins.js` e, se necessario, `Jhonny/js/plugins/Jhonny_RaceHelper.js`.
