---
title: "Map013 - Dialogue and Route Baseline"
type: "technical-reference"
status: "pending-runtime-validation"
scope: "Map013 dialogue routing and duplicate dialogue consolidation"
source_ci: "CI-004"
validation_state: "static-passed; runtime-playtest-pending"
updated: "2026-07-07"
tags:
  - map013
  - rpg-maker-mz
  - dialogue-baseline
  - route-flow
---

# Map013 - Dialogue and Route Baseline

## Purpose

Use this note before editing or reviewing `Jhonny/data/Map013.json` dialogue ranges, VN3 Common Event calls, route transfers or S276 behavior.

This is the durable baseline for the approved Map013 dialogue consolidation. It records the outcome and invariants, not every replaced dialogue range.

## Approved Rewrite Scope

Approved repeated dialogue blocks were replaced with finite Common Event calls:

| Common Event | Name | Use |
| --- | --- | --- |
| 25 | `VN3_RaceGoodbye` | Race-goodbye dialogue segment. |
| 26 | `VN3_CourageSip` | Courage-sip dialogue segment. |
| 27 | `VN3_RefuseKeysGoodbye` | Refuse-keys goodbye dialogue segment. |

The rewrite should be treated as a structural dialogue consolidation. It does not approve unrelated route rewrites, new dialogue edits or deferred duplicate candidates.

## Static Baseline

Static validation after the approved rewrite recorded:

- Map013 event list size changed from `11402` to `7706` commands.
- `734` approved duplicate ranges were replaced.
- `command117` targets for the new VN3 Common Events:
  - `25 = 262`
  - `26 = 236`
  - `27 = 236`
- Choice structure counts were preserved.
- Direct transfer count to Map012 is `0`.

Use [[Corrida - Runtime e Eventos]] for Common Event runtime contracts and [[RPG Maker MZ - Scripts de Plano]] for structured JSON edit gates.

## Route Exit Invariant

S276 was fixed by adding `Exit Event Processing` after the transfer to Map006.

Static validation after the fix recorded:

- `934` total sequences.
- `915` Map001 race-flow sequences.
- `19` Map006 clean exits.
- `0` static missing-exit exceptions.

Future audits should preserve the clean-exit invariant for sabotage/Map006 branches unless a new approved route design says otherwise.

## Pending Validation

Runtime and Playtest remain `pending-human-validation`.

Do not claim perceptual VN flow, message timing, choice feel, transfer feel, bust state, child-interpreter behavior or route reachability as human-validated from the static checks alone.

## Future Rewrite Rule

Future Map013 range rewrites must use the latest current file state.

Do not apply stale range indices from prior analysis, old build artifacts or pre-S276 snapshots without recomputing or shifting them against the current `Map013.json`.

CI-005 deferred duplicate candidates are not approved by this baseline.
