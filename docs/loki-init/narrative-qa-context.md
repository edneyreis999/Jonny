---
title: "Loki Init - Narrative QA Context"
tipo: "agent-context"
status: "partial"
tags:
  - loki-init
  - agent-context
  - narrative-qa
---

# Loki Init - Narrative QA Context

Data: 2026-06-30  
Agente: `narrative-qa`  
Escopo: QA narrativo para rotas, flags, escolhas e continuidade.

## Facts With Sources

- A rota completa, `ConcernScore` e endings dependem de fonte narrativa nao lida.
- Docs indicam retry sem replay de VN em certos fluxos.
- `Curva do Diabo`, timeout e thresholds criam riscos de continuidade.

## Inferences And Hypotheses

- QA narrativo deve validar alcance de rotas e coerencia entre score, derrota, retry e progressao.
- A matriz de rotas nao pode ser derivada apenas dos docs da corrida.

## Gaps / Do Not Assume

- Nao assumir endings, flags ou intervencao final.
- Nao assumir que retry preserva contexto emocional.

## Validators Recommended

- Matriz rota/flag/ending apos leitura de fonte canonica.
- Playtest com caminhos de vitoria, derrota e retry.

## Context Budget Used

- Handoff sintetico do agente e docs de corrida.
