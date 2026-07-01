---
title: "Loki Init - Conflicts and Decisions"
tipo: "registro de decisoes"
status: "concluido"
tags:
  - loki-init
  - decisions
  - conflicts
---

# Loki Init - Conflicts and Decisions

Data: 2026-06-30

## Decisions

- `selected_project_type` is `game-dev`.
- `Jhonny/` is the runtime root for game work. The consumer root remains an agent workspace and Obsidian vault.
- `docs/index.xml` is the navigation catalog for durable docs.
- `catalogador` replaced stale init catalog entries with the current per-agent folder layout.
- No runtime, data JSON, plugin, asset, save, build output, `.agents/**`, `.codex/**`, `.claude/**`, `AGENTS.md` or `CLAUDE.md` was written by final cataloging.
- Next workflow should be `loki:tech-analysis` before any implementation plan.

## Conflicts And Drift

| Conflict | Evidence | Decision status |
| --- | --- | --- |
| Stale prior index/docs | `docs/index.xml` listed old `docs/loki-init/*-context.md` and `docs/loki-init/inventories/*` entries that were absent from the validated init layout. | Resolved for catalog navigation by replacing stale init entries with current folders. |
| Git-state mismatch | Workspace instructions said the repo was not a Git repository, while `project-inventory.md` records a valid Git worktree and deleted init artifacts observed by `git status --short`. | Open. Future agents must check current Git state directly. |
| Curva do Diabo MVP conflict | Product/design docs mark Curva do Diabo as future or out of MVP, while runtime/static inventories observed switch/branch/assets/preload references. | Open. Requires product decision and focused tech analysis before edits. |
| Timeout semantics drift | Some doc sections say timeout crashes/restarts; TL;DR, edge cases and static Common Event evidence point to safe automatic. | Open. Static evidence favors safe automatic, but product/design canon and Playtest are still required. |
| Plugin/no-plugin drift | Older implementation text says "sem plugins"; actual runtime uses `TextPicture`, `ButtonPicture`, `Jhonny_RaceHelper`, `VisuMZ_0_CoreEngine` and `VisuMZ_2_VNPictureBusts`. | Open. Future implementation must treat plugins as active runtime dependencies unless a refactor is explicitly approved. |
| Crash audio drift | Docs mention crash impact or `Shock1`; audio inventory observed `Shock1.ogg` and `crash_metal.ogg`, but Common Events read did not confirm direct crash cue and result defeat uses `Defeat1`. | Open. Needs audio/product decision plus Playtest. |
| Runtime validation pending | Inventories are static; no Playtest validated input, audio, UI, timing, Common Events, save/load or deploy. | Open human gate. Do not declare behavior validated. |
| Safe-only and thresholds | Thresholds 200/400/600 make safe-only insufficient under documented scoring, while some risk text implies safe-only acceptability or planning ambiguity. | Open. Requires tuning decision and Playtest. |
| Language/copy drift | System locale is `pt_BR`; docs and UI terms are mostly Portuguese, but some runtime result TextPictures and route terms appear in English. | Open. Requires product/localization decision. |
| `P_cena` visibility drift | Spec says probability should not be shown numerically; presentation and UX inventories observed `\V[103]%` TextPicture in static Common Event evidence. | Open. Requires UX/design decision and Playtest. |
| RNG determinism drift | Docs mention deterministic seed; gameplay inventory observed helper calls tied to `Math.random` behavior rather than proven `VAR_SEED` determinism. | Open. Requires plugin/code analysis if determinism matters. |
| Save/load risk | Autosave and transient race state may restore during race/result/crash with pictures, audio or reservations out of sync. | Open. Requires focused technical analysis and smoke test. |

## Required Gates

- `approval` before any write outside explicitly scoped workflow targets.
- `technical-review` before changing Common Events, plugin activation, helper plugin, data IDs, save/load behavior or Loki package contracts.
- `human-validation` before declaring gameplay, UI, input, audio, pictures, Common Events, save/load, deploy or runtime behavior valid.
