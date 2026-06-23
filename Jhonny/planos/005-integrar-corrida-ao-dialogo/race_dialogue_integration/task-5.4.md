## markdown

## status: complete_structural_pending_playtest

<task_context>
<domain>rpg-maker-mz/data-json/common-events</domain>
<type>bugfix</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-5.3</dependencies>
<prd_ref>../analise-integracao-corrida-dialogo.md</prd_ref>
<techspec_ref>./tasks.md</techspec_ref>
</task_context>

# Task 5.4: Keep Defeat Retry Alive After Result Cleanup

## Source References

- Target file: `Jhonny/data/CommonEvents.json`
- Target common event: `CE19 EV_VitoriaCorrida`
- Parent common event: `CE7 EV_RaceRenderer`
- Runtime evidence: after a loss, the black-screen snapshot showed `Map001`, no pictures, normal tint, `SW_RACE_ACTIVE OFF`, `SW_PAUSED OFF`, no running interpreter, no common event reservation, and `Init Corrida` erased.

## Overview

The black-screen state was not a wait-loop stall. The interpreter had already been destroyed before the defeat retry could restart the race.

`CE19 EV_VitoriaCorrida` is called from `CE7 EV_RaceRenderer`, a parallel common event gated by `SW_RACE_ACTIVE`. The RPG Maker MZ engine clears a parallel common event interpreter when its trigger switch is no longer active. Therefore, turning `SW_RACE_ACTIVE` OFF globally in `CE19` before the victory/defeat branch can destroy the `CE7` interpreter chain before the defeat branch reaches `Call Common Event 5`.

## Subtasks

- [x] Confirm the runtime snapshot has no running interpreter and no reserved common event.
- [x] Confirm `Game_CommonEvent.refresh()` clears the interpreter when its switch-gated common event becomes inactive.
- [x] Add a saved mutation script under `builds/fase5/`.
- [x] Remove the global `SW_RACE_ACTIVE OFF` command before the CE19 victory/defeat routing branch.
- [x] Add `SW_RACE_ACTIVE OFF` inside each victory transfer branch only.
- [x] Preserve the defeat retry branch as `CE19 -> CE5` without turning `SW_RACE_ACTIVE` OFF first.
- [x] Re-parse `CommonEvents.json`.
- [x] Re-run the read-only race routing validation script.
- [ ] Confirm in RPG Maker MZ Playtest that losing Race 1, Race 2, and Race 3 never leaves a dead black screen.
- [ ] Confirm in RPG Maker MZ Playtest that winning Race 1, Race 2, and Race 3 still transfers to the configured narrative maps.

## Impact Analysis

Variables are not changed by this patch. The mutation script asserts tracked variable write counts are unchanged for `VAR_RACE_ID`, `VAR_SCENE_INDEX`, `VAR_CONSCIENCIA`, `VAR_PONTOS_GLORIA`, `VAR_ATTEMPT_N`, `VAR_LAST_RENDERED_INDEX`, and `VAR_VITORIA_PASSOU`.

The switch impact is intentionally limited to `SW_RACE_ACTIVE`:

- Before: `CE19` turned `SW_RACE_ACTIVE` OFF once before deciding victory or defeat.
- After: `CE19` turns `SW_RACE_ACTIVE` OFF only inside victory transfer branches.
- Defeat retry keeps `SW_RACE_ACTIVE` ON until `CE5 EV_RaceOrchestrator` restarts the same race.

This avoids destroying the parent `CE7` parallel interpreter before `CE19` executes the defeat retry call.

## Structural Validation

- Mutation script: `builds/fase5/06_move_race_stop_to_victory_branch.py`.
- `CommonEvents.json` parses successfully.
- `CE19` now has `SW_RACE_ACTIVE OFF` immediately before the Race 1, Race 2, and Race 3 victory transfers.
- `CE19` defeat branch reaches `Call Common Event 5` with no `SW_RACE_ACTIVE OFF` command in the defeat path.
- `builds/fase4/03_validate_race_dialogue_integration.py` still confirms the configured entry routes, victory routes, and defeat retry bootstrap.
