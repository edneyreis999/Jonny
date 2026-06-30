---
title: "Loki Init - Quest Content Designer Context"
tipo: "agent-context"
status: "partial"
tags:
  - loki-init
  - agent-context
  - quest-content-designer
---

# Loki Init - Quest Content Designer Context

Data: 2026-06-30  
Agente: `quest-content-designer`  
Escopo: objetivos, NPCs, recompensas, flags, ritmo e conteudo de quests.

## Facts With Sources

- A cadeia jogavel vista e composta por tres corridas: Lenda, Rachadura e Abismo.
- Objetivo: completar cenas sem crash e atingir thresholds de Pontos de Glória.
- Recompensas e custos usam safe/risk, Consciência e `P_cena`.

## Inferences And Hypotheses

- A Corrida pode ser tratada como quest chain para init, mas os docs a descrevem como core loop/minigame.
- A clareza de objetivo provavelmente vive em UI/result feedback, nao em quest log formal.

## Gaps / Do Not Assume

- Nao assumir NPCs, quest log, VN flow, endings ou roles sem fonte narrativa.
- Nao assumir `Curva do Diabo` como MVP implementado.

## Validators Recommended

- Confirmar se Corrida e a quest chain ou apenas um subsistema.
- Playtest de pacing, objetivo, retry e comprehension.

## Context Budget Used

- 5/8 fontes permitidas lidas pelo agente.
