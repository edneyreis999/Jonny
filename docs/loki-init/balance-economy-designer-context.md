---
title: "Loki Init - Balance Economy Designer Context"
tipo: "agent-context"
status: "partial"
tags:
  - loki-init
  - agent-context
  - balance-economy-designer
---

# Loki Init - Balance Economy Designer Context

Data: 2026-06-30  
Agente: `balance-economy-designer`  
Escopo: progressao numerica, recompensas, custos e economia interna.

## Facts With Sources

- Safe concede +10 Consciência e +10 Pontos de Glória.
- Risk bem-sucedido concede `P_cena * 2` e consome `P_cena` Consciência.
- Thresholds atuais 200/400/600 tornam a rota all-safe insuficiente.

## Inferences And Hypotheses

- A economia força risco e comunica pressao moral.
- Se all-safe deve ser viavel, thresholds ou recompensas precisam decisao de design.

## Gaps / Do Not Assume

- Nao assumir balanceamento aprovado ou divertido.
- Nao assumir pesos de `P_cena` sem simular todas as sequencias.

## Validators Recommended

- Simulacao de caminhos safe/risk por race.
- Playtest cego para tensao, frustracao e clareza de perda.

## Context Budget Used

- Handoff sintetico do agente e docs de core loop.
