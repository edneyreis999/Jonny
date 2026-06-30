---
title: "Loki Init - README"
tipo: "consolidacao"
status: "concluido"
tags:
  - loki-init
  - game-dev
  - jhonny
---

# Loki Init - README

Data: 2026-06-30
Selected project type: `game-dev`
Consumer root: `/Users/edney/projects/coreto/summer26`

## Outcome

`loki:init` catalogou este workspace como um projeto de game-dev com runtime real em `Jhonny/`, um jogo RPG Maker MZ chamado "Bye Bye Jhonny", e documentação duradoura em `docs/`.

O init produziu inventários estáticos e consolidados para o subsistema de corrida, sem editar runtime, dados JSON, plugins, assets, saves, `.agents/**`, `.codex/**`, `.claude/**`, `AGENTS.md` ou `CLAUDE.md`.

## Where To Start

Para retomar o contexto:

1. Leia `docs/index.xml` como catálogo principal.
2. Leia `docs/loki-init/project-inventory.md` para limites, fontes e superfície sensível.
3. Leia `docs/loki-init/technology-context.md` para classificação, stack e agentes requeridos.
4. Leia `docs/loki-init/conflicts-and-decisions.md` antes de transformar qualquer achado em plano.
5. Leia o inventário de domínio relevante em `docs/loki-init/<agent-name>/`.

## Current Boundaries

- `Jhonny/` é o root runtime do jogo; o root do consumidor é um workspace de agentes e vault.
- O init fez análise estática. Nenhum Playtest validou gameplay, input, UI, audio, Common Events, save/load, deploy ou comportamento perceptível.
- Edits futuros em `Jhonny/data/*.json` exigem workflow RPG Maker MZ data JSON.
- Edits futuros em `Jhonny/js/plugins/**` ou `Jhonny/js/plugins.js` exigem workflow RPG Maker MZ plugin.
- `docs/index.xml` foi atualizado para o layout materializado atual de `docs/loki-init/<agent-name>/...`.

## Next Recommended Command

Próximo comando recomendado: `loki:tech-analysis`.

Foco sugerido: corrida runtime ownership, timeout, retry, Curva do Diabo, plugin/no-plugin drift, crash audio, save/load e matriz mínima de Playtest antes de qualquer `loki:generate-action-plan` ou `loki:run-plan`.
