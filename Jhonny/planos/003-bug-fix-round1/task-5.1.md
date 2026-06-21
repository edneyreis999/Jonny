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

1. Verify the canonical variable ID map by inspecting
   `Jhonny/js/plugins/Jhonny_RaceHelper.js` around the `VAR_NAMES` block
   (currently near line 122). Confirm `RACE_ID = 100`,
   `PONTOS_GLORIA = 105`, and `VITORIA_PASSOU = 117` before citing these
   IDs anywhere in the inventory. If the mapping has drifted, record the
   current IDs and use them throughout Phase 5.
2. Find every literal threshold reference. The search MUST cover both the
   spec values and the values currently inlined in CE 19, since either set
   may appear at multiple sites:
   ```
   rg -n "\b(60|100|150|200|400|600)\b" Jhonny/data/CommonEvents.json Jhonny/js/plugins/Jhonny_RaceHelper.js
   ```
3. For each hit, classify using the variable IDs confirmed in step 1:
   - **Threshold-related** — adjacent to `value(105)` (PONTOS_GLORIA) or
     `value(100)` (RACE_ID), or part of a `{ 1: ..., 2: ..., 3: ... }`
     dict keyed by RACE_ID, or used as a fallback `|| N` for such a dict.
   - **Unrelated** — frame counts (e.g. `for (let i = 1; i <= 60; ...)`),
     coordinates, opacities, audio fadeout frames, picture IDs. These
     MUST be listed in the inventory as "unrelated" with a one-line
     justification, not silently skipped.
4. For each threshold-related hit, record:
   - File, line number, CE index in the JSON array (e.g. `ces[19]`), CE
     name (e.g. `EV_VitoriaCorrida`), and cmd index inside that CE's
     `list` (e.g. `cmd[8]`).
   - Surrounding context (2-3 lines, or the contiguous `code=355`/`655`
     Script block it belongs to).
   - Current code verbatim — copy the actual JS, do not paraphrase. CE 19
     currently uses a dict-with-fallback structure
     (`const thresholds = { 1: 200, 2: 400, 3: 600 }; const passou = pontos >= (thresholds[raceId] || 60);`),
     NOT a ternary. The inventory MUST reflect that structure.
   - Replacement plan using
     `window.JhonnyRace.isVictory($gameVariables.value(105), $gameVariables.value(100))`.
5. Find every `threshold` keyword in the plugin:
   ```
   rg -n "threshold" Jhonny/js/plugins/Jhonny_RaceHelper.js
   ```
   If the plugin already defines `THRESHOLDS` inline (as a const or in a
   closure), record where. The Phase 5 refactor will move that block to
   `window.JhonnyRace.Config.THRESHOLDS`.
6. Write `fase5/sites-inventory.md` with the full table of sites to
   migrate. The table MUST have one row per site, with columns: file,
   line, CE index, CE name, cmd index, current code, replacement plan.

## visual_validation

Discovery task. Validation is `fase5/sites-inventory.md` existing with
every threshold-related site catalogued. The inventory MUST include the
CE 19 cmd[8] dict (`{ 1: 200, 2: 400, 3: 600 }`) and cmd[9]
(`pontos >= (thresholds[raceId] || 60)`) at the very least. Any unrelated
literal hits (frame counts, picture IDs) MUST appear in the inventory as
"unrelated" with a one-line justification.

## Definition of Done

- [ ] Variable ID map verified against `Jhonny_RaceHelper.js` VAR_NAMES.
- [ ] `rg` output for both files captured, covering 60/100/150/200/400/600.
- [ ] Every hit classified as threshold-related or unrelated (with reason).
- [ ] Each threshold-related site has a verbatim current-code snapshot and
      a replacement plan.
- [ ] `fase5/sites-inventory.md` written with the required column set.
- [ ] CE 19 cmd[8] dict and cmd[9] fallback both listed.
- [ ] Existing `THRESHOLDS` definition in plugin located (if any).
