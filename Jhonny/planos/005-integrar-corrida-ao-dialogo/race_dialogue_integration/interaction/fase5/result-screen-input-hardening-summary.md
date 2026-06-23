# Result Screen Input Hardening Summary

## Implemented

- Patched `CE13 EV_KeyInput` so directional input is ignored while `SW_INPUT_LOCKED` (`101`) is ON.
- Patched `CE19 EV_VitoriaCorrida` so the result-screen wait loop uses `Input.isPressed('ok')` instead of the one-frame `Input.isTriggered('ok')`.
- Reverted the early `CE19 EV_VitoriaCorrida` `SW_RACE_ACTIVE OFF` command after Playtest confirmed it broke Space/click continuation on the result screen.
- Patched `CE7 EV_RaceRenderer` so its delayed `SW_INPUT_LOCKED OFF` command only runs while `SW_PAUSED` (`104`) is OFF.
- Patched `CE12 EV_OnRisk` so Risk execution exits immediately while `SW_PAUSED` (`104`) is ON, matching `CE11 EV_OnSafe`.
- Patched `CE19 EV_VitoriaCorrida` so `SW_RACE_ACTIVE` is turned OFF only inside victory transfer branches, not in the shared post-result path before defeat retry.
- Kept `CE3 EV_Preload` unchanged.

## Files

- Mutated data file: `/Users/edney/projects/coreto/summer26/Jhonny/data/CommonEvents.json`
- Mutation script: `builds/fase5/01_harden_result_screen_input.py`
- Format-restoration script: `builds/fase5/02_restore_common_events_indent.py`
- Superseded parallel-stop script: `builds/fase5/03_stop_race_parallels_on_result_screen.py`
- Final correction script: `builds/fase5/04_revert_ce19_and_gate_ce7_unlock.py`
- Risk guard script: `builds/fase5/05_add_paused_guard_to_risk.py`
- Defeat retry lifecycle script: `builds/fase5/06_move_race_stop_to_victory_branch.py`
- Task artifact: `task-5.1.md`
- Task artifact: `task-5.2.md`
- Task artifact: `task-5.3.md`
- Task artifact: `task-5.4.md`

## Key Commands

- `CE13[4]`: wraps directional reservations in `if (!$gameSwitches.value(101))`.
- `CE7[39..41]`: wraps delayed input unlock in `If SW_PAUSED is OFF`.
- `CE13[4]`: wraps directional reservations in `if (!$gameSwitches.value(101))`.
- `CE19[1]`: `[104, 104, 0]`, keeping `SW_PAUSED` ON while the result screen is active.
- `CE19[30]`: `[12, "!Input.isPressed('ok')"]`.
- `CE19` victory route: `SW_RACE_ACTIVE OFF` now appears immediately before each configured victory transfer.
- `CE19` defeat route: reaches `Call Common Event 5` without turning `SW_RACE_ACTIVE` OFF first.
- `CE11 EV_OnSafe`: exits when `SW_PAUSED` is ON.
- `CE12 EV_OnRisk`: now also exits when `SW_PAUSED` is ON before checking `SW_RACE_ACTIVE` and `SW_INPUT_LOCKED`.

## Validation Run

- `CommonEvents.json` parsed successfully after mutation.
- The mutation script re-read `CommonEvents.json` and asserted the modified `CE13` and `CE19` commands.
- The format-restoration script preserved the patched commands and restored the prior 4-space JSON indentation.
- The parallel-stop script was superseded after Playtest exposed the Space/click side effect.
- The final correction script re-read `CommonEvents.json`, removed the early `CE19` race stop, preserved the later cleanup, wrapped the `CE7` unlock under `SW_PAUSED OFF`, and asserted that tracked race variable write counts were unchanged.
- Follow-up Playtest still logs `RISK_SUCCESS`, `RISK_FAIL`, and `CRASH` after the defeat screen is visible when pressing `↑`, with `SW_PAUSED: true` and `SW_INPUT_LOCKED: true`.
- Read-only Common Event inspection found that `CE11 EV_OnSafe` has a `SW_PAUSED ON -> Exit Event Processing` guard, while `CE12 EV_OnRisk` does not.
- The Risk guard script added the missing `SW_PAUSED` guard to `CE12`, preserved the existing `SW_RACE_ACTIVE OFF` and `SW_INPUT_LOCKED ON` guards, and confirmed tracked race variable write counts were unchanged.
- A later black-screen snapshot showed there was no running interpreter, no reserved common event, no pictures, `SW_RACE_ACTIVE OFF`, `SW_PAUSED OFF`, and `Init Corrida` erased. This ruled out an active wait-loop stall.
- Engine inspection confirmed `Game_CommonEvent.refresh()` clears the parallel common event interpreter when its switch-gated common event becomes inactive.
- The defeat retry lifecycle script removed the shared CE19 `SW_RACE_ACTIVE OFF`, inserted it only inside victory transfer branches, preserved `CE19 -> CE5` for defeat retry, and confirmed tracked race variable write counts were unchanged.
- `builds/fase4/03_validate_race_dialogue_integration.py` still confirms:
  - Race 1 entry: `Map010 -> Map001`
  - Race 2 entry: `Map005 -> Map001`
  - Race 3 entries: `Map013 -> Map001`
  - Victory routes: Race 1 -> `Map005`, Race 2 -> `Map013`, Race 3 -> `Map012`
  - Defeat retry branch: `CE19 -> CE5`
  - Retry preload guard: `V[112] <= 1`, then `SW_RACE_ACTIVE ON`

## Pending Playtest

- Hold Space before the result prompt appears and confirm the flow advances.
- Press Space rapidly around the result prompt and confirm it advances once.
- Press arrow keys on victory/defeat screens and confirm they are ignored.
- Press `↑` on the defeat screen and confirm no `RISK_SUCCESS`, `RISK_FAIL`, or `CRASH` logs appear.
- Confirm normal Risk actions still work during the active race.
- Lose Race 1, Race 2, and Race 3 and confirm no dead black screen appears.
- Win Race 1, Race 2, and Race 3 and confirm victory transfers still happen.
