---
title: "Loki Init - Technical Artist Context"
tipo: "agent-context"
status: "partial"
tags:
  - loki-init
  - agent-context
  - technical-artist
---

# Loki Init - Technical Artist Context

Data: 2026-06-30  
Agente: `technical-artist`  
Escopo: sprites, pictures, animacao/VFX, atlases, memoria e fronteira asset-runtime.

## Facts With Sources

- A corrida e principalmente picture-driven: backgrounds, HUD, botoes, flashes, tint, shake e TextPictures.
- Result screen usa Picture `5`, Picture `52` para tentativa e TextPictures `53`-`56`.
- `EV_Preload` aquece pictures com Show Picture, Wait 1 frame e Erase Picture.

## Inferences And Hypotheses

- Ownership de Picture IDs e constraint tecnica central.
- 816x624 RPG Maker versus shell 1280x720 pode criar risco de escala/composicao.

## Gaps / Do Not Assume

- Nao assumir existencia, dimensoes, textura, atlas, performance ou cache de assets.
- Nao assumir layers de plugins sem inventario.

## Validators Recommended

- Inventario de assets `img/pictures/race/`, dimensoes e custo RGBA.
- Cross-reference de Picture IDs em `data/CommonEvents.json`, `System.json` e plugins.
- Playtest de HUD, hover, result, crash/retry e preload.

## Context Budget Used

- 7/8 fontes permitidas lidas pelo agente.
