# Implementation Task Plan - Race Dialogue Integration

## Source References

- Technical analysis: [analise-integracao-corrida-dialogo.md](../analise-integracao-corrida-dialogo.md)
- Project guidance: [Jhonny/CLAUDE.md](../../../../CLAUDE.md)
- RPG Maker MZ data workflow: `rpg-maker-mz-data-json` skill, `references/workflow.md`

This plan integrates the isolated race minigame on `Map001` with the narrative maps. The race map must own the active race loop, narrative maps must only choose the correct `VAR_RACE_ID` and transfer into `Map001`, and victory must be the only path that exits the race. Each phase is designed for visible RPG Maker MZ Playtest validation before the next phase begins.

## Phases

### Phase 1 - Map001 Race Containment

**Objective:** Stop `Map001` from transferring the player out immediately after starting `EV_RaceOrchestrator`.

**Visual validation:** entering `Map001` with `VAR_RACE_ID` set to `1`, `2`, or `3` starts the race loop and keeps the player on the race map instead of instantly transferring to `Map005`, `Map013`, or `Map012`.

**Implementation status:** complete structurally; RPG Maker MZ Playtest confirmation is still required.

- [x] task-1.1 - Audit and patch `Map001` race containment

### Phase 2 - Race 1 and Race 2 Narrative Entries

**Objective:** Route confirmed narrative entry points from `Map010` and `Map005` into `Map001` with the correct race ID.

**Visual validation:** the known dialogue marker on `Map010` starts Race 1 on `Map001`, and the known dialogue marker on `Map005` starts Race 2 on `Map001`; in both cases the player remains in the race loop.

**Implementation status:** complete structurally; RPG Maker MZ Playtest confirmation is still required.

- [x] task-2.1 - Wire `Map010` Race 1 entry
- [x] task-2.2 - Wire `Map005` Race 2 entry

### Phase 3 - Victory, Defeat, and Cleanup Lifecycle

**Objective:** Move race exit ownership to `EV_VitoriaCorrida`, keep defeat inside `Map001`, and clean race side effects before any narrative transfer.

**Visual validation:** losing a race restarts the same race on `Map001`; winning Race 1 transfers to `Map005`, winning Race 2 transfers to `Map013`, and no race HUD/buttons/audio continue on the narrative map.

**Implementation status:** complete structurally; RPG Maker MZ Playtest confirmation is still required.

- [x] task-3.1 - Update `EV_VitoriaCorrida` victory and defeat routing
- [x] task-3.2 - Add and validate race cleanup before narrative transfer

### Phase 4 - Race 3 Map013 Integration

**Objective:** Fix the confirmed defeat-retry dead end on `Map001`, including the retry bootstrap stall inside `EV_Preload`, convert confirmed `Map013` race markers into Race 3 entries, and verify the final post-victory transfer to `Map012`.

**Visual validation:** losing Race 1, Race 2, or Race 3 never leaves the player on a dead black screen on `Map001`; the retry path does not stall inside preload before `SW_RACE_ACTIVE` turns on again; confirmed `Map013` markers start Race 3 on `Map001`; winning Race 1 transfers to `Map005`, winning Race 2 transfers to `Map013`, and winning Race 3 transfers to `Map012`, with no race state leaking into the dialogue map. Race 1 and Race 2 victories do not jump directly into Race 3 during this phase.

**Implementation status:** retry-preload patch and `Map013` marker patch are applied structurally; the read-only routing validation was rerun after Phase 5 and still passes structurally. RPG Maker MZ Playtest confirmation is still required.

- [x] task-4.1 - Audit and patch `Map013` Race 3 markers
- [ ] task-4.2 - Validate full race routing matrix

### Phase 5 - Result Screen Input Hardening

**Objective:** Fix the intermittent black screen caused by fast input on the victory/defeat result screen and prevent race directional inputs from firing while the result screen is waiting for confirmation.

**Confirmed runtime evidence:** during the failure, `CE19 EV_VitoriaCorrida` remained in the `WAIT_INPUT` loop at commands `29-32`, repeatedly evaluating `!Input.isTriggered('ok')`; `Map001` later ended with `SW_RACE_ACTIVE` off, no running interpreter, no common event reservation, and `Init Corrida` erased. `CE13 EV_KeyInput` is a parallel common event gated only by `SW_RACE_ACTIVE` and currently reserves `CE11/CE12` from directional input without checking `SW_INPUT_LOCKED`.

**Required behavior:** once the result screen appears, only the confirmation input may advance the flow. Directional race inputs must be ignored until the next race bootstrap explicitly unlocks input. Holding or pressing Space quickly around the result screen must not strand the player on a dead black screen.

**Implementation status:** complete structurally; RPG Maker MZ Playtest confirmation is still required. `builds/fase5/01_harden_result_screen_input.py` added the `CE13` guard and robust `CE19` OK check. Follow-up `builds/fase5/03_stop_race_parallels_on_result_screen.py` blocked directional inputs by turning `SW_RACE_ACTIVE` OFF at the start of `CE19`, but this broke Space/click continuation on the result screen. `builds/fase5/04_revert_ce19_and_gate_ce7_unlock.py` reverted the early `SW_RACE_ACTIVE OFF`, preserved the later cleanup, and gated `CE7 EV_RaceRenderer` so it only unlocks `SW_INPUT_LOCKED` while `SW_PAUSED` is OFF. `builds/fase5/05_add_paused_guard_to_risk.py` adds the missing `SW_PAUSED` guard to `CE12 EV_OnRisk`, matching `CE11 EV_OnSafe`. Latest fix `builds/fase5/06_move_race_stop_to_victory_branch.py` moves the post-result `SW_RACE_ACTIVE OFF` out of the shared victory/defeat path and into victory transfer branches only, so defeat can reliably reach `CE5` retry.

- [x] task-5.1 - Harden result-screen input gating and retry confirmation
- [x] task-5.2 - Revert early `SW_RACE_ACTIVE OFF` and gate `CE7` input unlock during result screens
- [x] task-5.3 - Add `SW_PAUSED` guard to `CE12 EV_OnRisk`
- [x] task-5.4 - Keep defeat retry alive after result cleanup

## Task Matrix

| ID | Title | Phase | Dependencies | Estimate |
| --- | --- | --- | --- | --- |
| task-1.1 | Audit and patch `Map001` race containment | 1 | none | 2-4h |
| task-2.1 | Wire `Map010` Race 1 entry | 2 | task-1.1 | 2-4h |
| task-2.2 | Wire `Map005` Race 2 entry | 2 | task-1.1 | 2-4h |
| task-3.1 | Update `EV_VitoriaCorrida` victory and defeat routing | 3 | task-2.1, task-2.2 | 2-4h |
| task-3.2 | Add and validate race cleanup before narrative transfer | 3 | task-3.1 | 2-4h |
| task-4.1 | Fix defeat retry bootstrap and patch `Map013` Race 3 markers | 4 | task-3.2 | 3-5h |
| task-4.2 | Validate full race routing matrix | 4 | task-4.1 | 2-4h |
| task-5.1 | Harden result-screen input gating and retry confirmation | 5 | task-4.1 | 2-4h |
| task-5.2 | Revert early `SW_RACE_ACTIVE OFF` and gate `CE7` input unlock during result screens | 5 | task-5.1 | 1-3h |
| task-5.3 | Add `SW_PAUSED` guard to `CE12 EV_OnRisk` | 5 | task-5.2 | 1-2h |
| task-5.4 | Keep defeat retry alive after result cleanup | 5 | task-5.3 | 1-2h |

## Recommended Execution Order

```text
task-1.1
  -> task-2.1
  -> task-2.2
  -> task-3.1
  -> task-3.2
  -> task-4.1
  -> task-5.1
  -> task-5.2
  -> task-5.3
  -> task-5.4
  -> task-4.2
```

`task-2.1` and `task-2.2` are independent after `task-1.1`, but both should be completed before the Phase 3 lifecycle work.

## Global Implementation Rules

- Do not edit `data/*.json` directly.
- Every JSON mutation must be made by a saved Python script under `builds/faseN/`.
- Each mutation script must load UTF-8 JSON, assert current preconditions, mutate only intended records, write with stable formatting, re-read the file, and print validation output.
- Leave every mutation script on disk as an audit artifact.
- Runtime behavior is not fully validated until the user confirms RPG Maker MZ Playtest results.
- Result-screen input fixes must be validated with fast repeated Space presses and directional key presses during victory/defeat screens.

## Latest Structural Validation

- `builds/fase5/01_harden_result_screen_input.py` patched `CommonEvents.json` and re-read the file successfully.
- `builds/fase5/02_restore_common_events_indent.py` restored the prior JSON indentation while preserving the Phase 5 patch.
- `builds/fase5/03_stop_race_parallels_on_result_screen.py` patched `CE19` to turn `SW_RACE_ACTIVE` OFF before the result screen waits for Space, but Playtest confirmed this is a bad side effect: Space/click no longer advance the result screen.
- `builds/fase5/04_revert_ce19_and_gate_ce7_unlock.py` reverted that early `SW_RACE_ACTIVE OFF`, preserved the later `CE19` race cleanup after result confirmation, and wrapped the `CE7` delayed input unlock in a `SW_PAUSED OFF` branch.
- `CommonEvents.json` parses successfully after the final Phase 5 correction.
- `builds/fase4/03_validate_race_dialogue_integration.py` was rerun after the Phase 5 patch and still confirms the configured route matrix and defeat retry bootstrap.
- Latest Playtest still logs `RISK_SUCCESS`, `RISK_FAIL`, and `CRASH` after the defeat screen is visible when pressing `↑`; the logs show `SW_PAUSED: true` and `SW_INPUT_LOCKED: true` during those Risk events.
- Read-only inspection shows `CE11 EV_OnSafe` starts with a `SW_PAUSED ON -> Exit Event Processing` guard, but `CE12 EV_OnRisk` starts with only `SW_RACE_ACTIVE OFF` and `SW_INPUT_LOCKED ON` guards.
- `builds/fase5/05_add_paused_guard_to_risk.py` added the missing `SW_PAUSED ON -> Exit Event Processing` guard to `CE12 EV_OnRisk`, preserving the existing `SW_RACE_ACTIVE OFF` and `SW_INPUT_LOCKED ON` guards.
- `CE11 EV_OnSafe` and `CE12 EV_OnRisk` now both reject action execution while `SW_PAUSED` is ON.
- Latest black-screen snapshot showed `Map001`, normal tint, no pictures, `SW_RACE_ACTIVE OFF`, `SW_PAUSED OFF`, no running interpreter, no common event reservation, and `Init Corrida` erased. This means the result flow was not waiting; it had been killed before retry.
- `builds/fase5/06_move_race_stop_to_victory_branch.py` removed the shared post-result `SW_RACE_ACTIVE OFF` before CE19 routing and inserted `SW_RACE_ACTIVE OFF` inside each victory transfer branch only.
- `CE19` defeat routing now reaches `Call Common Event 5` without turning `SW_RACE_ACTIVE` OFF first, preventing the parent `CE7` parallel interpreter from being cleared before retry.
- `interaction/fase5/result-screen-input-hardening-summary.md` records the input hardening changes and pending Playtest checks.

## Phase 5 Impact Analysis

- `SW_RACE_ACTIVE` (`100`) must remain ON while `CE19 WAIT_INPUT` is running; turning it OFF at the start of `CE19` can stop the interpreter chain that owns the result-screen wait, leaving the screen unable to advance by Space or click.
- The directional-input leak is caused by `CE7 EV_RaceRenderer`, not by the lack of early `SW_RACE_ACTIVE OFF`. `CE7[37..39]` turns `SW_INPUT_LOCKED` ON, waits 18 frames, then previously turned it OFF even if `CE19` had already opened the result screen.
- `CE19` sets `SW_PAUSED` (`104`) ON during the result screen. The final fix makes `CE7` skip its `SW_INPUT_LOCKED OFF` command while `SW_PAUSED` is ON.
- Applied task-5.2 data changes:
  - Removed the inserted early `CE19` command `[100, 100, 1]`.
  - Initially preserved the later `SW_RACE_ACTIVE OFF` cleanup before victory transfer/retry routing; task-5.4 later moved this cleanup into victory branches only after Playtest produced a dead black-screen retry state.
  - Changed `CE7` so its post-render unlock of `SW_INPUT_LOCKED` only runs when `SW_PAUSED` is OFF.
  - Did not change race variable write counts for `VAR_RACE_ID` (`100`), `VAR_SCENE_INDEX` (`101`), `VAR_CONSCIENCIA` (`104`), `VAR_PONTOS_GLORIA` (`105`), `VAR_TIMER_FRAMES` (`108`), or `VAR_VITORIA_PASSOU` (`117`).
- Applied task-5.3 data changes:
  - Did not add a new switch.
  - Added the same early `SW_PAUSED` guard from `CE11 EV_OnSafe` to `CE12 EV_OnRisk`.
  - Prevented `CE12` from mutating `VAR_CONSCIENCIA`, `VAR_PONTOS_GLORIA`, `SW_CRASH_FLAG`, or calling Risk resolution common events while the result screen is paused.
  - Kept tracked race variable write counts unchanged.
- Applied task-5.4 data changes:
  - Moved `SW_RACE_ACTIVE OFF` out of the shared CE19 cleanup block.
  - Added `SW_RACE_ACTIVE OFF` immediately before each victory transfer branch only.
  - Kept defeat retry on `CE19 -> CE5` with `SW_RACE_ACTIVE` still ON.
  - Kept tracked race variable write counts unchanged.
  - Avoided changing `CE3 EV_Preload`; the latest evidence points to interpreter lifecycle, not preload.

## Final Acceptance Criteria

- [x] `CommonEvents.json` parses without JSON errors.
- [ ] RPG Maker MZ loads the project without JSON parse errors.
- [ ] Player start on `Map011` remains unchanged.
- [x] `Map010` marker structurally targets Race 1 on `Map001`.
- [x] `Map005` marker structurally targets Race 2 on `Map001`.
- [x] Confirmed `Map013` markers start Race 3 on `Map001`.
- [ ] Losing any race never transfers out of `Map001` and never advances `VAR_RACE_ID`.
- [ ] Winning Race 1 transfers to `Map005`.
- [ ] Winning Race 2 transfers to `Map013`.
- [ ] Winning Race 3 transfers to `Map012`.
- [ ] Losing Race 1, Race 2, or Race 3 never leaves `Map001` in a dead black-screen state with `SW_RACE_ACTIVE` off and no bootstrap path.
- [ ] The retry path never stalls inside `EV_Preload` before `SW_RACE_ACTIVE` is turned back on.
- [ ] Holding or pressing Space quickly on the result screen advances exactly once and never leaves `CE19` stuck in `WAIT_INPUT`.
- [ ] Directional inputs are ignored on the victory/defeat result screen; only Space/OK may continue.
- [ ] Pressing `↑` on the defeat screen does not log `RISK_SUCCESS`, `RISK_FAIL`, or `CRASH`.
- [ ] `SW_RACE_ACTIVE`, race pictures, race audio, and queued race inputs do not leak into narrative maps.
