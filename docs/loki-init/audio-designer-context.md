---
title: "Loki Init - Audio Designer Context"
tipo: "agent-context"
status: "partial"
tags:
  - loki-init
  - agent-context
  - audio-designer
---

# Loki Init - Audio Designer Context

Data: 2026-06-30  
Agente: `audio-designer`  
Escopo: musica, ambience, SFX, cues, mix e feedback sonoro.

## Facts With Sources

- Sinal tem intencao sonora documentada: freio/RPM para Parar, motor+pneu para Furar, impacto+silencio para crash.
- `EV_VitoriaCorrida` faz fade de BGM e toca ME de resultado.
- `Jhonny/CLAUDE.md` recomenda preferir SE default do RPG Maker antes de gerar/baixar audio placeholder.

## Inferences And Hypotheses

- O projeto precisa de cue sheet por canal RPG Maker: BGM, BGS, ME e SE.
- Timer ticks podem ajudar urgencia, mas podem cansar em retries repetidos.

## Gaps / Do Not Assume

- Nao assumir arquivos de audio existentes, mixados ou tocando.
- Nao assumir que silencio apos crash sera lido como intencional.

## Validators Recommended

- Playtest com janela visivel para playback, timing, mix, fade e confirmacao.
- Auditoria estatica de triggers, canal, arquivo, volume, pitch e fallback visual.

## Context Budget Used

- 7/8 fontes permitidas lidas pelo agente; sem audio/runtime.
