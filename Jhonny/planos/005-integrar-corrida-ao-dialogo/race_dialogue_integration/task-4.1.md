## markdown

## status: complete_structural_pending_playtest

<task_context>
<domain>rpg-maker-mz/data-json/maps</domain>
<type>integration</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>task-3.2</dependencies>
<prd_ref>../analise-integracao-corrida-dialogo.md</prd_ref>
<techspec_ref>./tasks.md</techspec_ref>
</task_context>

# Task 4.1: Fix Defeat Retry Bootstrap and Patch Map013 Race 3 Markers

## Source References

- Technical analysis: [Entry Points Identified](../analise-integracao-corrida-dialogo.md#pontos-de-entrada-identificados)
- Target file: `Jhonny/data/Map013.json`
- Target file: `Jhonny/data/CommonEvents.json`
- Confirmed Playtest failure: after losing Race 1 or Race 2 and pressing Space on the result screen, the player can remain on a dead black screen on `Map001`
- Confirmed runtime evidence: the retry now reaches `CE5 EV_RaceOrchestrator`, but `RACE_INIT` still happens with `SW_RACE_ACTIVE = false`
- Confirmed runtime evidence: the retry path spawns a valid child interpreter for `CE5`, then stalls inside `CE3 EV_Preload` before the `CE5` command that turns `SW_RACE_ACTIVE` on again
- Confirmed marker text: `JOGADOR VAI PARA A CORRIDA`
- Current executable transfer evidence: command `7082` transfers to `Map006`; command `7107` transfers to `Map012`
- Required behavior: confirmed race markers set `VAR_RACE_ID = 3` and transfer to `Map001`

## Overview

Fix the confirmed defeat-retry dead end on `Map001`, including the retry preload stall after the post-result handoff into `CE5`, then audit every `Map013` marker that says the player goes to the race and patch confirmed executable Race 3 entry points so they enter `Map001`.

<requirements>
- Create a saved audit script at `builds/fase4/00_audit_defeat_retry_bootstrap.py`.
- Create a saved mutation script at `builds/fase4/01_fix_defeat_retry_bootstrap.py`.
- Create a saved audit script at `builds/fase4/01_audit_map013_race3_markers.py`.
- Create a saved mutation script at `builds/fase4/02_patch_map013_race3_markers.py`.
- The defeat audit must identify exactly how the CE19 defeat branch hands off to CE18 and how the race bootstrap is expected to reactivate on `Map001`.
- The defeat mutation must not rely on the existing `Init Corrida` autorun firing again on the same `Map001` load after `Erase Event`.
- After the defeat fix, losing a race must either reload `Map001` or explicitly restore an equivalent bootstrap path for restarting the same race.
- If the retry path reuses `CE5`, it must not stall inside `CE3 EV_Preload` before the command that enables `SW_RACE_ACTIVE`.
- The audit script must list every `JOGADOR VAI PARA A CORRIDA` marker with surrounding command indexes, indent, and nearby executable commands.
- Patch executable race markers to set `VAR_RACE_ID = 3` and transfer to `Map001`.
- Do not blindly insert commands at comment-only markers unless the audit script can identify an unambiguous insertion point.
- Preserve branch indentation and event command order.
</requirements>

## Dependencies

- task-3.2

## Subtasks

- [ ] Re-run the defeat audit and extend it with the retry preload stall inside `CE3 EV_Preload`.
- [ ] Patch the defeat retry path so losses on `Map001` do not end in a dead black-screen state.
- [ ] If `CE5` remains the retry bootstrap, patch the preload path so the child interpreter reaches the `SW_RACE_ACTIVE ON` command reliably.
- [ ] Re-read `CommonEvents.json` and print the final defeat bootstrap summary.
- [ ] Run the marker audit script and save its report to `interaction/fase4/map013-race3-marker-audit.md`.
- [ ] Confirm every marker has a safe executable insertion or replacement point.
- [ ] Patch known executable transfer points first.
- [ ] For comment-only markers, insert commands only where the audit identifies the exact branch and insertion index.
- [ ] Assert inserted commands set `VAR_RACE_ID = 3` before transferring.
- [ ] Re-read `Map013.json` and print every patched marker summary.

## Implementation Details

The mutation scripts must treat both `CE19/CE3/CE5/CE18` and `Map013` as high-risk. The defeat retry fix must start from the confirmed Playtest evidence that the retry already reaches `CE5`, but the child interpreter stalls inside `CE3 EV_Preload` before the `CE5` command that should enable `SW_RACE_ACTIVE`.

`Map013` remains high-risk because it has a large single event with many branches. If a marker's insertion point is ambiguous, leave it unchanged and document it in the audit report instead of guessing.

Expected defeat intent:

```text
on defeat from CE19:
  do not leave Map001 idle with SW_RACE_ACTIVE OFF
  either reload Map001 so Init Corrida can run again
  or explicitly re-bootstrap the race through a verified equivalent path
  if reusing CE5, ensure CE3 preload cannot block the retry before SW_RACE_ACTIVE is turned on
  remove transient black-screen residue such as race/overlay_flash_white
```

Expected command intent:

```text
near each confirmed "JOGADOR VAI PARA A CORRIDA" marker:
  Control Variables: VAR_RACE_ID = 3
  Transfer Player: Map001
```

## visual_validation

In RPG Maker MZ Playtest:

- Lose Race 1 and Race 2 after the result screen appears.
- Press Space to continue.
- The player should not remain on a dead black screen on `Map001`.
- The same race should restart on `Map001`.
- The retry should pass through preload without stalling before HUD/parallels come back.
- Reach a confirmed `Map013` marker that says the player goes to the race.
- The player should transfer to `Map001`.
- Race 3 should start and the player should remain on the race map.
- The player should not transfer directly to `Map006` or `Map012` before winning the race.

## Success Criteria

- [ ] `CommonEvents.json` parses after the scripts run.
- [ ] Defeat from Race 1 and Race 2 no longer leaves the player on a dead black screen on `Map001`.
- [ ] The retry path does not depend on the previously erased `Init Corrida` autorun firing again on the same map load unless the map is reloaded.
- [ ] The retry path does not stall inside `CE3 EV_Preload` before `SW_RACE_ACTIVE` is turned back on.
- [ ] `Map013.json` parses after the scripts run.
- [ ] Every patched marker sets `VAR_RACE_ID = 3`.
- [ ] Every patched marker transfers to `Map001`.
- [ ] Ambiguous comment-only markers are documented, not guessed.
- [ ] User confirms at least one Race 1 or Race 2 defeat retry works in Playtest.
- [ ] User confirms at least one Race 3 marker works in Playtest.

## Out of Scope

- Do not change Race 1 or Race 2 narrative entry markers.
- Do not change Race 1 or Race 2 victory destinations.
- Do not rewrite the full `Map013` event.

## Execution Notes

- The current defeat retry handoff from `CE19` into `CE5` is not sufficient yet.
- Runtime investigation confirmed that the retry reaches `CE5`, but the child interpreter stalls inside `CE3 EV_Preload` before `SW_RACE_ACTIVE` is turned back on.
- This task now includes a structural patch in `CE5` that skips `CE3` on retries by guarding preload behind `V[112] <= 1`.
- The `Map013` routing patch remains structurally relevant, but final acceptance still depends on Playtest revalidation of defeat retry and Race 3 entry.
