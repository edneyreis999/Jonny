## markdown

## status: complete_structural_superseded_by_task_5_2

<task_context>
<domain>rpg-maker-mz/data-json/common-events</domain>
<type>bugfix</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-4.1</dependencies>
<prd_ref>../analise-integracao-corrida-dialogo.md</prd_ref>
<techspec_ref>./tasks.md</techspec_ref>
</task_context>

# Task 5.1: Harden Result-Screen Input Gating and Retry Confirmation

## Source References

- Target file: `Jhonny/data/CommonEvents.json`
- Confirmed runtime evidence: `CE19 EV_VitoriaCorrida` remained in `WAIT_INPUT` while evaluating `!Input.isTriggered('ok')`.
- Confirmed runtime evidence: directional inputs were still accepted during the victory/defeat result screen.
- Result-screen lifecycle: `CE19` turns `SW_INPUT_LOCKED` on while the result screen is active.

## Overview

Patch the result-screen input path so fast or held Space/OK cannot miss the confirmation frame, and so race directional input cannot reserve race input common events while the result screen is waiting.

<requirements>
- Create a saved mutation script at `builds/fase5/01_harden_result_screen_input.py`.
- Mutate only `CE13 EV_KeyInput` and `CE19 EV_VitoriaCorrida`.
- Keep `CE13` as the directional input parallel, but ignore directional input while `SW_INPUT_LOCKED` is ON.
- Keep the `CE19` `WAIT_INPUT` loop, but do not rely on the one-frame `Input.isTriggered('ok')` edge.
- Re-read `CommonEvents.json` after writing and assert the modified commands.
- Do not remove `CE3 EV_Preload` in this task.
</requirements>

## Subtasks

- [x] Add a saved mutation script under `builds/fase5/`.
- [x] Patch `CE13 EV_KeyInput` command 4 to skip arrow reservations while `SW_INPUT_LOCKED` is ON.
- [x] Patch `CE19 EV_VitoriaCorrida` command 30 from `!Input.isTriggered('ok')` to `!Input.isPressed('ok')`.
- [x] Restore `CommonEvents.json` indentation with a saved follow-up script to avoid unrelated diff noise.
- [x] Patch `CE19 EV_VitoriaCorrida` to turn `SW_RACE_ACTIVE` OFF at the start of the result screen, stopping race parallel events before `WAIT_INPUT`.
- [x] Mark the early `SW_RACE_ACTIVE OFF` patch as superseded after Playtest showed it broke Space/click continuation.
- [x] Re-parse `CommonEvents.json`.
- [x] Re-run the read-only race routing validation script.
- [ ] Confirm in RPG Maker MZ Playtest that fast/held Space advances the result screen exactly once.
- [ ] Confirm in RPG Maker MZ Playtest that arrow keys do not affect victory/defeat result screens.
- [ ] Confirm in RPG Maker MZ Playtest that losing Race 1, Race 2, and Race 3 never leaves a dead black screen.

## Implementation Details

`CE13 EV_KeyInput` remains parallel under `SW_RACE_ACTIVE`, but its script now checks `!$gameSwitches.value(101)` before reading directional input. Since `CE19` sets switch `101` ON while the result screen is active, directional input no longer reserves `CE11` or `CE12` during victory/defeat.

`CE19 EV_VitoriaCorrida` keeps the same label/wait/jump structure:

```text
WAIT_INPUT:
  if !Input.isPressed('ok')
    Wait 1 frame
    Jump WAIT_INPUT
```

This accepts Space/OK even if the key was already held when the result screen started waiting, which removes the one-frame miss caused by `Input.isTriggered('ok')`.

Follow-up Playtest showed that the directional-input bug persisted because `CE7 EV_RaceRenderer` could still toggle `SW_INPUT_LOCKED` while the result screen was open. This task then tried to stop the race parallel common events by turning `SW_RACE_ACTIVE` OFF immediately after locking input, before result rendering and `WAIT_INPUT`.

That follow-up is now superseded by `task-5.2`: Playtest confirmed the early `SW_RACE_ACTIVE OFF` stopped Space/click continuation on the result screen. The final Phase 5 fix keeps `SW_RACE_ACTIVE` ON while `CE19 WAIT_INPUT` runs and gates the delayed CE7 input unlock while `SW_PAUSED` is ON.

## Structural Validation

- `CommonEvents.json` parses successfully.
- `CE13` command 4 contains the `SW_INPUT_LOCKED` guard.
- `CE19` command 30 evaluates `!Input.isPressed('ok')`.
- The early `CE19` `SW_RACE_ACTIVE OFF` experiment was reverted by `task-5.2`.
- The Fase 4 validation script still confirms the configured entry routes, victory routes, defeat retry call to `CE5`, and retry-preload guard before `SW_RACE_ACTIVE ON`.

## Visual Validation

In RPG Maker MZ Playtest:

- On victory and defeat screens, hold Space before the prompt appears and confirm that the flow advances instead of getting stuck.
- Press Space repeatedly around the prompt and confirm only one continuation happens.
- Press arrow keys on victory and defeat screens and confirm they do not trigger race actions.
- Lose each race once and confirm retry returns to the same race without a dead black screen.
