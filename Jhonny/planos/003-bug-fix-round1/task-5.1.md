---
status: pending
phase: 5
task_id: 5.1
---

# Task 5.1 — Inventory THRESHOLDS Literal Sites (60 / 100 / 150)

## Objective

Find every site in `Jhonny_RaceHelper.js` and `CommonEvents.json` that
compares `VAR_PONTOS_GLORIA` (or any threshold-adjacent logic) against the
literal numbers 60, 100, 150 — the three race thresholds. Output feeds
task 5.3 (which replaces each literal with `window.JhonnyRace.isVictory`).

## Dependencies

- task-4.3 — Phase 4 must be complete. Cosmetic baseline is locked in.

## References

- Implementation Guide §2.4 (Migration Safety) — four-step migration table.
- Implementation Guide §2.3 (pseudo-code for `window.JhonnyRace` namespace).
- Spec `Corrida - Core Loop.md` §8.2 — THRESHOLDS table (60/100/150 per race).

## Step-by-step

1. Find every literal threshold reference:
   ```
   rg -n "\b(60|100|150)\b" Jhonny/data/CommonEvents.json Jhonny/js/plugins/Jhonny_RaceHelper.js
   ```
2. For each hit, manually classify:
   - **Threshold-related** (compare against `VAR_PONTOS_GLORIA` Editor ID 105
     or against `VAR_RACE_ID` Editor ID 100 in a victory check).
   - **Unrelated** (frame count, coordinate, opacity, etc.).
3. For each threshold-related hit, record:
   - File, line number.
   - Surrounding context (2-3 lines).
   - Current logic (e.g. `$gameVariables.value(105) >= 60`).
   - Replacement plan (e.g.
     `window.JhonnyRace.isVictory($gameVariables.value(105), $gameVariables.value(100))`).
4. Find every `threshold` keyword in the plugin:
   ```
   rg -n "threshold" Jhonny/js/plugins/Jhonny_RaceHelper.js
   ```
   If the plugin already defines `THRESHOLDS` inline (as a const or in a
   closure), record where. The Phase 5 refactor will move that block to
   `window.JhonnyRace.Config.THRESHOLDS`.
5. Write `fase5/sites-inventory.md` with the full table of sites to migrate.

## visual_validation

Discovery task. Validation is `fase5/sites-inventory.md` existing with
every threshold-related site catalogued. The inventory must include at
least one CE 19 site (the victory check in `EV_VitoriaCorrida`).

## Definition of Done

- [ ] `rg` output for both files captured.
- [ ] Every hit classified as threshold-related or unrelated.
- [ ] Each threshold-related site has a replacement plan.
- [ ] `fase5/sites-inventory.md` written.
- [ ] Existing `THRESHOLDS` definition in plugin located (if any).
