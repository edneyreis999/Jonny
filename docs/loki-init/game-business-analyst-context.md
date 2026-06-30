---
title: "Loki Init - Game Business Analyst Context"
tipo: "agent-context"
status: "partial"
tags:
  - loki-init
  - agent-context
  - game-business-analyst
---

# Loki Init - Game Business Analyst Context

Data: 2026-06-30  
Agente: `game-business-analyst`  
Escopo: requisitos testaveis e rastreaveis para stories futuras.

## Facts With Sources

- Docs atuais misturam regras estaticas, comportamento esperado e notas historicas/futuras.
- Conflitos centrais: timeout, `Curva do Diabo`, "sem plugins" versus plugins ativos, safe-only versus thresholds.
- `ConcernScore`, VN e endings dependem de fonte narrativa nao catalogada/lida.

## Inferences And Hypotheses

- Stories futuras devem separar requisito, evidencia runtime, decisao humana e criterio de Playtest.
- Aceite de gameplay deve incluir resultado visivel, estado interno e retry.

## Gaps / Do Not Assume

- Nao assumir alcance de rota/endings sem `Roleta Paulista` ou fonte equivalente.
- Nao assumir que objetivos sao compreendidos sem playtest.

## Validators Recommended

- Matriz de requisitos com fonte, prioridade, conflito e gate.
- `technical-review` antes de tasks runtime.

## Context Budget Used

- Handoff sintetico do agente e docs de corrida/runtime.
