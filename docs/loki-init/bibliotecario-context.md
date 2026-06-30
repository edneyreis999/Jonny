---
title: "Loki Init - Bibliotecario Context"
tipo: "agent-context"
status: "complete"
tags:
  - loki-init
  - agent-context
  - bibliotecario
---

# Loki Init - Bibliotecario Context

Data: 2026-06-30  
Agente: `bibliotecario`  
Escopo: menor leitura suficiente via `docs/index.xml`.

## Facts With Sources

- `docs/index.xml` cataloga `Corrida - Core Loop`, `Corrida - Runtime e Eventos`, `RPG Maker MZ - Debug Playtest` e `RPG Maker MZ - Scripts de Plano`.
- Para design/balance da corrida, a leitura minima e `Corrida - Core Loop`.
- Para Common Events, retry, input lock e tela de resultado, a leitura minima e `Corrida - Runtime e Eventos`.
- Para Playtest/debug, a leitura minima e `RPG Maker MZ - Debug Playtest`.

## Inferences And Hypotheses

- O index deve continuar sendo o primeiro ponto de entrada para futuros workflows.
- Docs de init devem ser catalogados para reduzir custo de retomada.

## Gaps / Do Not Assume

- Nao assumir documentos fora do index como canonicos sem leitura.
- Nao assumir que `Roleta Paulista` esta catalogado.

## Validators Recommended

- Atualizar `docs/index.xml` com os novos docs duradouros.
- Usar `loki-index-navigator` em proximas leituras de docs.

## Context Budget Used

- Handoff sintetico do agente e index existente.
