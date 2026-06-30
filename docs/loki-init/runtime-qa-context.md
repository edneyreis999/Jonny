---
title: "Loki Init - Runtime QA Context"
tipo: "agent-context"
status: "partial"
tags:
  - loki-init
  - agent-context
  - runtime-qa
---

# Loki Init - Runtime QA Context

Data: 2026-06-30  
Agente: `runtime-qa`  
Escopo: gates de validacao perceptivel para o projeto RPG Maker MZ.

## Facts With Sources

- `docs/03-Tech/RPG Maker MZ - Debug Playtest.md` define Playtest como gate para tela preta, input, pictures, plugins e Common Events.
- `project-inventory.md` lista gameplay, input, UI, audio, pictures, save/load e deploy como superficies que nao podem ser declaradas validadas neste init.
- Nenhum Playtest foi executado durante o init.

## Inferences And Hypotheses

- Validadores estaticos podem reduzir risco de corrupcao, mas nao provam comportamento jogavel.
- Result screen, retry, timeout, input lock e save/load precisam de teste humano futuro.

## Gaps / Do Not Assume

- Nao assumir audio, visual, input ou timing corretos.
- Nao assumir que JSON/JS sem erro valida Common Events em runtime.

## Validators Recommended

- Human Playtest com janela visivel.
- Snapshot minimo de switches, variaveis, pictures, tint/fade, interpreter e reserva de eventos.
- Registro explicito de status: static-only, playtest-pending ou validated.

## Context Budget Used

- Handoff sintetico do agente e docs de debug/runtime.
