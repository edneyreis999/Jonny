## markdown

## status: complete_structural_pending_playtest

<task_context>
<domain>rpg-maker-mz/data-json/common-events</domain>
<type>bugfix</type>
<scope>core_feature</scope>
<complexity>low</complexity>
<dependencies>task-5.2</dependencies>
<prd_ref>../analise-integracao-corrida-dialogo.md</prd_ref>
<techspec_ref>./tasks.md</techspec_ref>
</task_context>

# Task 5.3: Add Paused Guard to Risk Action Executor

## Source References

- Target file: `Jhonny/data/CommonEvents.json`
- Suspect common event: `CE12 EV_OnRisk`
- Comparison common event: `CE11 EV_OnSafe`
- Runtime evidence: after the defeat screen is already visible, pressing `↑` logs `RISK_SUCCESS`, `RISK_FAIL`, and `CRASH` while `SW_PAUSED` and `SW_INPUT_LOCKED` are both ON.

## Overview

The Phase 5 input hardening now blocks the known renderer unlock path and keeps the result-screen wait alive, but Playtest still shows Risk actions firing on the defeat screen.

The latest evidence points to an asymmetry between the Safe and Risk action executors:

```text
CE11 EV_OnSafe:
  If SW_PAUSED is ON
    Exit Event Processing

CE12 EV_OnRisk:
  If SW_RACE_ACTIVE is OFF
    Exit Event Processing
  If SW_INPUT_LOCKED is ON
    Exit Event Processing
```

`CE12` is missing the `SW_PAUSED` early-exit guard that already protects `CE11`.

## Subtasks

- [x] Add a saved mutation script under `builds/fase5/`.
- [x] Insert a `SW_PAUSED ON -> Exit Event Processing` guard at the start of `CE12 EV_OnRisk`.
- [x] Preserve the existing `SW_RACE_ACTIVE OFF` and `SW_INPUT_LOCKED ON` guards in `CE12`.
- [x] Assert `CE11` and `CE12` both reject actions while `SW_PAUSED` is ON.
- [x] Re-parse `CommonEvents.json`.
- [x] Re-run the read-only race routing validation script.
- [ ] Confirm in RPG Maker MZ Playtest that pressing `↑` on the defeat screen does not log `RISK_SUCCESS`, `RISK_FAIL`, or `CRASH`.
- [ ] Confirm in RPG Maker MZ Playtest that normal Risk actions still work during the active race.

## Proposed Implementation

Do not add a new switch yet. `SW_PAUSED` already represents the result-screen paused state in the current race lifecycle, and `CE11` already uses it successfully.

The minimal change is to add the same guard to the top of `CE12`:

```text
If SW_PAUSED is ON
  Exit Event Processing
End
```

## Expected Result

Risk input can no longer mutate race state, play Risk SFX, award glory, reduce consciousness, or trigger crash events while the defeat/victory result screen is open.

## Structural Validation

- Mutation script: `builds/fase5/05_add_paused_guard_to_risk.py`.
- `CommonEvents.json` parses successfully.
- `CE11 EV_OnSafe` and `CE12 EV_OnRisk` both start with the same `SW_PAUSED ON -> Exit Event Processing` guard.
- `CE12` still preserves the existing `SW_RACE_ACTIVE OFF` and `SW_INPUT_LOCKED ON` guards immediately after the new pause guard.
- Tracked race variable write counts were unchanged by the script.
- `builds/fase4/03_validate_race_dialogue_integration.py` still confirms the configured route matrix and defeat retry bootstrap.
