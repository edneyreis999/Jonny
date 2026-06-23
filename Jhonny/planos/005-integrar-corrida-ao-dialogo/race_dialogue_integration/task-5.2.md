## markdown

## status: complete_structural_pending_playtest

<task_context>
<domain>rpg-maker-mz/data-json/common-events</domain>
<type>bugfix</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-5.1</dependencies>
<prd_ref>../analise-integracao-corrida-dialogo.md</prd_ref>
<techspec_ref>./tasks.md</techspec_ref>
</task_context>

# Task 5.2: Revert Early Race Stop and Gate CE7 Input Unlock

## Source References

- Target file: `Jhonny/data/CommonEvents.json`
- Regression source: `builds/fase5/03_stop_race_parallels_on_result_screen.py`
- Final mutation script: `builds/fase5/04_revert_ce19_and_gate_ce7_unlock.py`

## Overview

The previous Phase 5 follow-up stopped directional inputs by turning `SW_RACE_ACTIVE` OFF at the start of `CE19 EV_VitoriaCorrida`, but Playtest confirmed that this broke Space/click continuation on the result screen.

This task restores the result-screen lifecycle so `CE19` can keep running while it waits for Space, and blocks the confirmed directional leak at the source that reopens input: `CE7 EV_RaceRenderer`.

## Subtasks

- [x] Add a saved mutation script under `builds/fase5/`.
- [x] Remove the early `CE19` command that turned `SW_RACE_ACTIVE` OFF before `WAIT_INPUT`.
- [x] Preserve the later `CE19` `SW_RACE_ACTIVE OFF` cleanup after the result screen has accepted confirmation.
- [x] Wrap the `CE7` post-render `SW_INPUT_LOCKED OFF` command in a `SW_PAUSED OFF` conditional branch.
- [x] Assert tracked race variable write counts are unchanged.
- [x] Re-parse `CommonEvents.json`.
- [x] Re-run the read-only race routing validation script.
- [ ] Confirm in RPG Maker MZ Playtest that Space/click advances victory and defeat result screens.
- [ ] Confirm in RPG Maker MZ Playtest that arrow keys do not affect victory/defeat result screens.
- [ ] Confirm in RPG Maker MZ Playtest that losing Race 1, Race 2, and Race 3 never leaves a dead black screen.

## Implementation Details

`CE19 EV_VitoriaCorrida` now starts with:

```text
SW_INPUT_LOCKED ON
SW_PAUSED ON
```

It no longer disables `SW_RACE_ACTIVE` before drawing the result screen and entering `WAIT_INPUT`. The existing cleanup command still turns `SW_RACE_ACTIVE` OFF after the Space/OK confirmation is accepted.

`CE7 EV_RaceRenderer` still locks input around a render update, but its delayed unlock is now gated:

```text
SW_INPUT_LOCKED ON
Wait 18 frames
If SW_PAUSED is OFF
  SW_INPUT_LOCKED OFF
End
```

Because `CE19` turns `SW_PAUSED` ON while the result screen is visible, `CE7` can no longer reopen directional input during the victory/defeat screen.

## Structural Validation

- `CommonEvents.json` parses successfully.
- `CE7[39..41]` wraps the input unlock in a `SW_PAUSED OFF` branch.
- `CE13[4]` still ignores directional reservations while `SW_INPUT_LOCKED` is ON.
- `CE19[30]` still evaluates `!Input.isPressed('ok')`.
- `CE19` no longer turns `SW_RACE_ACTIVE` OFF before the result-screen `WAIT_INPUT` loop.
- `CE19` still turns `SW_RACE_ACTIVE` OFF after result-screen confirmation, before routing to victory transfer or defeat retry.
- The Fase 4 validation script still confirms the configured entry routes, victory routes, defeat retry call to `CE5`, and retry-preload guard before `SW_RACE_ACTIVE ON`.

## Playtest Checklist

- On defeat screen, press arrow keys and confirm no glory changes and no left/right/up/down race SFX play.
- On victory screen, press arrow keys and confirm no race action triggers.
- On defeat screen, press Space and click after the prompt appears and confirm the flow continues.
- Hold or spam Space around the result prompt and confirm the result screen advances exactly once.
- Lose each race once and confirm retry returns to the same race without a dead black screen.
