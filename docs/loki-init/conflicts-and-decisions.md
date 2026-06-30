---
title: "Loki Init - Conflicts And Decisions"
tipo: "conflict-register"
status: "partial"
tags:
  - loki-init
  - conflitos
  - decisoes
---

# Loki Init - Conflicts And Decisions

Data: 2026-06-30

## Decisions Recorded

| Decisao | Status | Evidencia |
| --- | --- | --- |
| Classificar o workspace como `game-dev`. | Decidido para init. | `Jhonny/` e projeto RPG Maker MZ; docs duradouros sao de jogo. |
| Tratar o root como workspace, nao runtime. | Decidido para init. | `project-inventory.md`; `Jhonny/` contem `game.rmmzproject`. |
| Materializar handoffs por orquestrador. | Decidido para init. | Restricao: agentes nao tinham garantia de write scope file-specific. |
| Nao declarar runtime validado. | Decidido para init. | Nenhum Playtest executado. |

## Conflicts Open

| Conflito | Evidencia | Impacto |
| --- | --- | --- |
| Git state | Instrucao inicial dizia sem `.git/`; `git rev-parse` retornou `true`. | Futuros workflows podem usar git como evidencia, mas devem registrar a divergencia. |
| Timeout | Docs variam entre timeout como crash/reroll e timeout como safe automatico. | Bloqueia requisitos precisos de UX/runtime. |
| `Curva do Diabo` | Algumas notas tratam como beat/finale; outras como reservado/post-MVP. | Bloqueia escopo de MVP e presentation design. |
| "Sem plugins" | Texto historico contrasta com plugins ativos: `TextPicture`, `ButtonPicture`, `Jhonny_RaceHelper`, VisuMZ. | Bloqueia claims de arquitetura e implementacao. |
| Safe-only | Thresholds 200/400/600 tornam risco necessario, mas expectativa all-safe aparece como possivel em leituras. | Bloqueia balance e criterio de vitoria. |
| Canon narrative source | `Roleta Paulista` e citado mas nao lido/catalogado neste init. | Bloqueia voz, endings, NPCs, route QA e `ConcernScore`. |
| Save/load policy | Sem decisao para race ativa/tela de resultado. | Bloqueia UX/runtime QA. |
| Audio scope | Timer ticks e novos assets nao tem decisao MVP. | Bloqueia cue sheet e asset work. |

## Required Gates

- `technical-review` antes de alterar data JSON, plugins, Common Events, scripts mutadores ou pacote Loki.
- `human-validation` por Playtest antes de validar comportamento perceptivel.
- Decisao humana de produto para timeout, all-safe, Curva do Diabo e audio MVP.
