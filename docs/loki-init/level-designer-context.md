---
title: "Loki Init - Level Designer Context"
tipo: "agent-context"
status: "partial"
tags:
  - loki-init
  - agent-context
  - level-designer
---

# Loki Init - Level Designer Context

Data: 2026-06-30  
Agente: `level-designer`  
Escopo: ritmo espacial, mapas, encounters, gating e navegacao.

## Facts With Sources

- A superficie de "level" atual parece temporal e cenica, nao exploracao de mapa.
- Races Lenda, Rachadura e Abismo tem comprimentos 6, 8 e 10.
- Maps, Common Events e `System.json` nao foram lidos profundamente neste init.

## Inferences And Hypotheses

- O pacing de level design deve considerar sequencia de cenas, descansos, retry e tela de resultado.
- Mapas provavelmente servem como entry points/gates, mas isso exige inventario runtime.

## Gaps / Do Not Assume

- Nao assumir mapas de entrada, transfer events ou encounters.
- Nao assumir que ritmo de cenas funciona sem Playtest.

## Validators Recommended

- Inventario read-only de maps e Common Events antes de editar.
- Playtest de fluxo completo race-to-result-to-next.

## Context Budget Used

- Handoff sintetico do agente e docs de corrida/runtime.
