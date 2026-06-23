## markdown

## status: pending

<task_context>
<domain>rpg-maker-mz/data-json/common-events</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>task-3.1</dependencies>
<prd_ref>../analise-integracao-corrida-dialogo.md</prd_ref>
<techspec_ref>./tasks.md</techspec_ref>
</task_context>

# Task 3.2: Add and Validate Race Cleanup Before Narrative Transfer

## Source References

- Technical analysis: [Confirmed Side Effects](../analise-integracao-corrida-dialogo.md#efeitos-colaterais-confirmados)
- Target file: `Jhonny/data/CommonEvents.json`
- Target common event: CE19 `EV_VitoriaCorrida`
- Parallel race common events: CE6 `EV_UpdateHud`, CE7 `EV_RaceRenderer`, CE10 `EV_RaceTimer`, CE13 `EV_KeyInput`, CE16 `EV_HoverRiskButton`
- Race picture range observed in analysis: `1..61`
- ButtonPicture queue risk: `$gameTemp.reserveCommonEvent(...)`

## Overview

Ensure all race state is stopped and cleaned before transferring to narrative maps, so race HUD, buttons, audio, and queued input cannot leak out of `Map001`.

<requirements>
- Create a saved Python mutation script at `builds/fase3/02_add_race_cleanup_before_transfer.py`.
- Ensure cleanup happens before every victory transfer added in task-3.1.
- Turn off `SW_RACE_ACTIVE` before leaving `Map001`.
- Keep race input locked or paused while the transfer is being prepared.
- Erase race pictures through ID `61`, not only `1..60`.
- Reset tint/audio if CE19 currently applies those effects.
- Clear queued race common events only if a safe existing event command/script pattern is confirmed; otherwise document the gap in `interaction/fase3/`.
</requirements>

## Dependencies

- task-3.1

## Subtasks

- [ ] Audit CE19 cleanup commands before each transfer.
- [ ] Add or confirm `SW_RACE_ACTIVE` is turned off before transfer.
- [ ] Add or confirm picture cleanup covers IDs `1..61`.
- [ ] Add or confirm tint/audio reset runs before narrative transfer.
- [ ] Investigate whether `$gameTemp.clearCommonEventReservation()` can be safely called from an event script command.
- [ ] If safe, add queue clearing before transfer; if not, document the residual risk.
- [ ] Re-read `CommonEvents.json` and print cleanup command summaries.

## Implementation Details

The cleanup sequence should be placed before narrative busts can render on the destination map. Avoid late cleanup after transfer because narrative maps use picture IDs `1` and `2`.

Expected cleanup intent:

```text
lock race input
turn SW_RACE_ACTIVE OFF
pause/stop race loop state
erase race pictures 1..61
reset tint/audio as needed
clear queued race common event if a safe command pattern is confirmed
Transfer Player according to VAR_RACE_ID
```

## visual_validation

In RPG Maker MZ Playtest:

- Win Race 1 and observe the arrival on `Map005`.
- No race HUD, race buttons, race text, or race overlays should remain visible.
- Narrative bust pictures should not be erased after they appear.
- Repeat for Race 2 arrival on `Map013`.
- Try clicking near the victory transfer and confirm no delayed race action triggers on the narrative map.

## Success Criteria

- [ ] `CommonEvents.json` parses after the script runs.
- [ ] `SW_RACE_ACTIVE` is off before narrative transfer.
- [ ] Race pictures through ID `61` are erased before narrative transfer.
- [ ] No race Common Event keeps running on the narrative map in Playtest.
- [ ] User confirms `visual_validation` in RPG Maker MZ Playtest.

## Out of Scope

- Do not change race scoring or thresholds.
- Do not change narrative bust systems.
- Do not wire `Map013` race markers.
