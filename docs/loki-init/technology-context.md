---
title: "Loki Init - Technology Context"
tipo: "contexto tecnico"
status: "parcial"
tags:
  - loki-init
  - tecnologia
  - game-dev
  - rpg-maker-mz
---

# Loki Init - Technology Context

Data: 2026-06-30  
Agente: main orchestrator  
Escopo: classificacao e contexto tecnico para `loki:init`

---

## Classificacao

`selected_project_type`: `game-dev`

Confianca: alta.

Evidencias:

- `manifest.yaml` do Loki package suporta exatamente `game-dev` e `software-development`.
- `docs/index.xml` descreve a documentacao duradoura do projeto Jhonny.
- `Jhonny/game.rmmzproject`, `Jhonny/data/*.json`, `Jhonny/js/rmmz_*.js` e `Jhonny/js/plugins/**` identificam um projeto RPG Maker MZ real.
- Os docs catalogados tratam de core loop, Common Events, Playtest, scripts de plano e validacao perceptivel de jogo.

Observacao de escopo: o root `/Users/edney/projects/coreto/summer26` tambem e um workspace de agentes e Obsidian vault. A classificacao `game-dev` foi escolhida porque a documentacao duradoura e o unico runtime real identificado apontam para Jhonny/RPG Maker MZ.

## Stack detectada

| Camada | Evidencia | Observacao |
| --- | --- | --- |
| Engine | RPG Maker MZ `1.10.0` em `Jhonny/js/rmmz_core.js`. | Runtime sensivel; nao alterado neste init. |
| Render | PixiJS `5.3.12` em `Jhonny/js/libs/pixi.js`. | Base visual do RPG Maker MZ. |
| App shell | `Jhonny/package.json` aponta `index.html`. | Config NW.js/Electron-like. |
| Plugins ativos | `TextPicture`, `ButtonPicture`, `Jhonny_RaceHelper`, `VisuMZ_0_CoreEngine`, `VisuMZ_2_VNPictureBusts`. | Confirmado em `Jhonny/js/plugins.js`. |
| Vault | Obsidian docs com YAML frontmatter e wikilinks. | Novos docs em `docs/loki-init/**` seguem esse formato. |

## Skills tecnicas candidatas

Nao executadas pelo workflow core de init; devem ser passadas como contexto para agentes ou workflows posteriores:

- `loki-rpg-maker-mz-project-inventory`: inventario tecnico read-only de projeto RPG Maker MZ.
- `loki-rpg-maker-mz-data-json`: qualquer edicao futura em `Jhonny/data/*.json`, switches, variaveis, Common Events, mapas ou database arrays.
- `loki-rpg-maker-mz-plugin-workflow`: qualquer criacao/edicao futura em `Jhonny/js/plugins/**` ou `Jhonny/js/plugins.js`.
- `obsidian-markdown`: criacao/edicao de notas Markdown no vault `docs/`.
- `loki-index-navigator`: navegacao por `docs/index.xml` antes de ler docs duradouros.

## Agent catalog preflight

Fonte primaria estruturada:

- `/Users/edney/projects/coreto/loki-framework/manifest.yaml`.

Tipos suportados:

- `game-dev`
- `software-development`

Politica de tags:

- `agent_project_tag_policy.base_tag`: `core`.
- `selection_rule`: `inventory_required = agents tagged core + agents tagged selected_project_type`.
- `core` nao e tipo de projeto classificavel.

Adapter surfaces lidas como disponibilidade/capacidade, nao como fonte normativa:

- `.agents/agents/*.md` symlinks para agentes do package.
- `.codex/agents/*.toml` symlinks para agentes Codex do package.
- `multi_agent_v1` exposto por `tool_search` com roles compativeis.

## Agentes requeridos por tag

Base `core`:

- `standards-curator`
- `retrospective-digester`
- `runtime-qa`
- `execution-context-reader`
- `source-researcher`
- `technical-implementer`
- `bibliotecario`
- `catalogador`

Projeto `game-dev`:

- `game-product-owner`
- `game-business-analyst`
- `game-designer`
- `narrative-designer`
- `ux-ui-designer`
- `gameplay-engineer`
- `narrative-qa`
- `level-designer`
- `balance-economy-designer`
- `branching-narrative-designer`
- `scene-presentation-designer`
- `audio-designer`
- `quest-content-designer`
- `dialogue-editor`
- `tools-pipeline-engineer`
- `technical-artist`

`inventory_required` e a uniao ordenada das duas listas acima, sem duplicatas.

## Validadores e gates

Validadores estruturais para o init:

- Confirmar que writes finais ficaram em `docs/**` e `planos/000-init-loki/**`.
- Confirmar que `docs/index.xml` inclui documentos duradouros criados.
- Confirmar que todo agente selecionado possui documento, inventario e retrospectiva ou falha estruturada.
- Confirmar que `selected_project_type` pertence a `supported_project_types`.
- Confirmar que nenhum comportamento perceptivel ou runtime foi declarado validado.

Human gates pendentes:

- `human-validation` antes de validar gameplay, UI, audio, input, Common Events, save/load ou deploy.
- `technical-review` antes de alterar contratos Loki, package, agentes, skills, templates ou validators.
- `approval` para qualquer destino fora de `docs/**` e `planos/000-init-loki/**`.

## Do Not Assume

- Nao assumir que o root do workspace e o root runtime; o runtime real identificado e `Jhonny/`.
- Nao assumir que validacao estrutural em JSON ou JavaScript prova comportamento jogavel.
- Nao assumir que scripts historicos em `Jhonny/planos/**` sao reexecutaveis.
- Nao assumir que symlinks em `.agents/**` ou `.codex/**` autorizam escrita nesses caminhos.
