## markdown

## status: pending

<task_context>
<domain>rpg-maker-mz/data-json/common-events</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>task-2.1,task-2.2</dependencies>
<prd_ref>../analise-integracao-corrida-dialogo.md</prd_ref>
<techspec_ref>./tasks.md</techspec_ref>
</task_context>

# Task 3.1: Update EV_VitoriaCorrida Victory and Defeat Routing

## Source References

- Technical analysis: [Post-Victory Outputs](../analise-integracao-corrida-dialogo.md#saidas-pos-vitoria)
- Technical analysis: [Surgical Proposal](../analise-integracao-corrida-dialogo.md#proposta-cirurgica)
- Target file: `Jhonny/data/CommonEvents.json`
- Target common event: CE19 `EV_VitoriaCorrida`
- Related common events: CE18 `EV_Crash`, CE5 `EV_RaceOrchestrator`
- Relevant variables/switches: `VAR_RACE_ID` 100, `VAR_VITORIA_PASSOU` 117, `SW_RACE_ACTIVE` 100, `SW_INPUT_LOCKED` 101, `SW_PAUSED` 104

## Overview

Make `EV_VitoriaCorrida` the authoritative exit point for the race. Victory transfers according to `VAR_RACE_ID`; defeat restarts the same race on `Map001` without advancing the race ID.

<requirements>
- Create a saved Python mutation script at `builds/fase3/01_update_victory_defeat_routing.py`.
- Assert the existing CE19 structure before modifying it.
- Remove the current behavior that increments `VAR_RACE_ID` after victory and calls CE5 for the next race.
- Remove or replace the infinite final victory loop for Race 3.
- On victory, branch by `VAR_RACE_ID`: `1 -> Map005`, `2 -> Map013`, `3 -> Map012`.
- On defeat, keep the player on `Map001` and restart the same race through the existing orchestrator/crash flow.
- Preserve branch indentation and command list terminators.
</requirements>

## Dependencies

- task-2.1
- task-2.2

## Subtasks

- [ ] Audit CE19 command flow and print a before summary to `interaction/fase3/`.
- [ ] Identify the branch that handles `VAR_VITORIA_PASSOU == 1`.
- [ ] Replace auto-advance behavior with explicit transfer routing by `VAR_RACE_ID`.
- [ ] Confirm the non-victory branch still calls CE18 or restarts the same race without transfer.
- [ ] Validate that no victory branch increments `VAR_RACE_ID`.
- [ ] Re-read `CommonEvents.json` and assert CE19 list ends with command code `0`.

## Implementation Details

This task is branch-sensitive. The executor should use nearby existing command schemas from CE19 when constructing conditional branches and transfer commands. If the current CE19 shape does not match the analysis, stop and write the mismatch to `interaction/fase3/ce19-routing-blocker.md` instead of guessing.

Expected routing:

```text
if VAR_VITORIA_PASSOU == 1:
  if VAR_RACE_ID == 1: cleanup handoff, Transfer Player Map005
  if VAR_RACE_ID == 2: cleanup handoff, Transfer Player Map013
  if VAR_RACE_ID == 3: cleanup handoff, Transfer Player Map012
else:
  call/continue defeat restart path for the same VAR_RACE_ID on Map001
```

## visual_validation

In RPG Maker MZ Playtest:

- Enter Race 1 from `Map010`, force or achieve a loss, and confirm the player remains on `Map001` and retries Race 1.
- Win Race 1 and confirm the player transfers to `Map005`.
- Enter Race 2 from `Map005`, force or achieve a loss, and confirm the player remains on `Map001` and retries Race 2.
- Win Race 2 and confirm the player transfers to `Map013`.

## Success Criteria

- [ ] `CommonEvents.json` parses after the script runs.
- [ ] CE19 no longer advances `VAR_RACE_ID` on victory.
- [ ] CE19 no longer traps Race 3 victory in an infinite loop.
- [ ] Defeat does not transfer out of `Map001`.
- [ ] User confirms Race 1 and Race 2 win/loss routing in Playtest.

## Out of Scope

- Do not wire `Map013` markers in this task.
- Do not change plugin code.
- Do not tune victory thresholds.
