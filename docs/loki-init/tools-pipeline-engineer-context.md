---
title: "Loki Init - Tools Pipeline Engineer Context"
tipo: "agent-context"
status: "partial"
tags:
  - loki-init
  - agent-context
  - tools-pipeline-engineer
---

# Loki Init - Tools Pipeline Engineer Context

Data: 2026-06-30  
Agente: `tools-pipeline-engineer`  
Escopo: riscos de scripts, import/export, automacao e validadores.

## Facts With Sources

- `RPG Maker MZ - Scripts de Plano.md` trata scripts historicos como nao automaticamente reutilizaveis.
- `Jhonny/scripts/merge_pr4_data_resolution.py` muta `data/Map001.json`, le `System.json` e assume `startMapId == 11`.
- O script nao oferece dry-run, backup, diff report ou rollback.

## Inferences And Hypotheses

- Qualquer automacao sobre `Jhonny/data/*.json` deve ser pipeline sensivel.
- Scripts historicos devem ser evidencia, nao ferramenta atual, ate auditoria.

## Gaps / Do Not Assume

- Nao assumir scripts idempotentes ou atuais.
- Nao assumir que parser success valida comportamento RPG Maker.

## Validators Recommended

- Dry-run, precondition report, structured parse/write/reload, diff restrito e rollback.
- Playtest humano para qualquer comportamento perceptivel.

## Context Budget Used

- 6/8 fontes permitidas lidas pelo agente.
