---
status: pending
phase: 3
task_id: 3.1
---

# Task 3.1 — Locate HUD Picture ID and TextPicture Usage

## Objective

Identify the picture ID used for the awareness % HUD, confirm whether the
HUD uses TextPicture (the "bake once" plugin), and trace which CE creates
the HUD. Outputs feed task 3.2 (which writes the new `EV_UpdateHud` CE and
the INIT re-show).

## Dependencies

- task-2.3 — Phase 2 must be complete. CE 19 is in its final shape.

## References

- Implementation Guide §6.1 (Likely Root Causes) — four hypotheses.
- Implementation Guide §6.2 (The TextPicture Trap).
- Implementation Guide §7.1 (Lifecycle Analysis) — picture 1-60 owned by race.
- RMMZ `Game_Screen.showPicture(num, name, origin, x, y, ...)` — `num` is
  1-indexed; same `num` replaces existing picture.
- TextPicture plugin pattern (from fase7 retrospective): code 357 + 657 +
  231 with `name=""` (empty picture name).

## Step-by-step

1. Search for TextPicture usage in CommonEvents.json:
   ```
   rg -n "TextPicture|textPicture" Jhonny/data/CommonEvents.json
   ```
   Capture every CE that uses TextPicture.
2. Search for the awareness HUD text. Try multiple spellings:
   ```
   rg -n "Consci|consci|CONSCI|Taxa|taxa|TAXA" Jhonny/data/CommonEvents.json
   ```
3. For each CE that references TextPicture + awareness text, dump the full
   command list and identify:
   - The `Show Picture` (code 231) command and its `parameters[0]` (picture
     ID).
   - The TextPicture plugin command (code 357 with the TextPicture plugin
     name + 657 args) that bakes the text.
4. Confirm the HUD is created by which CE: typically `EV_RaceRenderer`
    (CE 7) or `EV_RaceOrchestrator` (CE 5). Look for the CE whose parallel
    trigger is `SW_RACE_ACTIVE` (switch 100) or that runs on race INIT.
5. Identify the CE that erases pictures 1-60 on crash (CE 18 EV_Crash per
   spec). Confirm the erase range covers the HUD picture ID.
6. Write findings to `fase3/hud-findings.md`:
   - HUD picture ID (likely 50, but verify).
   - HUD owner CE (creator).
   - Whether HUD uses TextPicture (yes/no).
   - Whether HUD is erased by EV_Crash (yes/no — should be yes if ID ≤ 60).
   - Current update path (does any CE refresh the HUD on variable change?).

## visual_validation

Discovery task — no game-visible change. Validation is `fase3/hud-findings.md`
existing with all five fields populated. If a field is "unknown," the next
task must add a sub-step to resolve it before writing the generator.

## Definition of Done

- [ ] `rg TextPicture` output captured.
- [ ] HUD picture ID identified.
- [ ] HUD owner CE identified.
- [ ] HUD lifecycle (created/erased/refreshed) mapped.
- [ ] `fase3/hud-findings.md` written.
