---
title: "Loki Init - Technical Implementer Context"
tipo: "agent-context"
status: "partial"
tags:
  - loki-init
  - agent-context
  - technical-implementer
---

# Loki Init - Technical Implementer Context

Data: 2026-06-30  
Agente: `technical-implementer`  
Escopo: viabilidade tecnica futura sem implementar ou tocar runtime.

## Facts With Sources

- `technology-context.md` detecta RPG Maker MZ 1.10.0, PixiJS 5.3.12 e plugins ativos.
- `project-inventory.md` marca `Jhonny/data/*.json`, `js/plugins/**`, assets, audio, save e planos historicos como sensiveis.
- `Jhonny/CLAUDE.md` exige parser/writer para data JSON e Playtest para comportamento perceptivel.

## Inferences And Hypotheses

- Proximas tarefas de runtime devem ser precedidas por `loki:tech-analysis`.
- Edicoes em data JSON e plugins exigem skills RPG Maker especificas.

## Gaps / Do Not Assume

- Nao assumir IDs de switches, variables, Common Events ou maps sem leitura estruturada.
- Nao assumir que plugin helper e livre de efeitos colaterais.

## Validators Recommended

- `loki-rpg-maker-mz-data-json` para data JSON.
- `loki-rpg-maker-mz-plugin-workflow` para plugins.
- `node -c`, parser JSON, diff restrito e Playtest humano.

## Context Budget Used

- Handoff sintetico do agente e contexto tecnico.
