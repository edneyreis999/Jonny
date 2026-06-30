---
title: "Loki Init - Scene Presentation Designer Context"
tipo: "agent-context"
status: "partial"
tags:
  - loki-init
  - agent-context
  - scene-presentation-designer
---

# Loki Init - Scene Presentation Designer Context

Data: 2026-06-30  
Agente: `scene-presentation-designer`  
Escopo: staging, backgrounds, sprites, transicoes, timing e cues de cena.

## Facts With Sources

- Race scenes usam janelas de input de 4.0s para Sinal e 3.5s para Curva.
- Apresentacao depende de pictures, TextPicture, ButtonPicture, audio, input lock e Common Events.
- `EV_VitoriaCorrida` limpa pictures, faz fade BGM, toca ME e mostra TextPictures de resultado.

## Inferences And Hypotheses

- O maior risco de apresentacao e sobrecarga cognitiva em janelas curtas.
- Uma cue sheet visual/audio e uma tabela de picture IDs devem preceder implementacao.

## Gaps / Do Not Assume

- Nao assumir assets, layer order, busts, CGs ou expressoes existentes.
- Nao assumir timeout decidido entre crash e safe automatico.

## Validators Recommended

- Playtest humano para timing, foco visual, audio e input feel.
- Inventario de picture IDs, TextPicture/ButtonPicture e cleanup.

## Context Budget Used

- 6/8 fontes permitidas lidas pelo agente; sem runtime/assets.
