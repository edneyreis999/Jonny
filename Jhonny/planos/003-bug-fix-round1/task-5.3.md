---
status: pending
phase: 5
task_id: 5.3
---

# Task 5.3 — Replace Literal Sites with `window.JhonnyRace.isVictory` and Playtest

## Objective

Walk through every threshold-related site from `fase5/sites-inventory.md`
and replace the inline literal logic with a call to
`window.JhonnyRace.isVictory(...)` (or `thresholdFor(...)`). Add a defensive
fallback in CE 19. Validate via Playtest at the threshold boundary.

## Dependencies

- task-5.2 — `window.JhonnyRace` namespace exists in the plugin.

## References

- Implementation Guide §2.3 (Usage from CE inline Script).
- Implementation Guide §2.4 (Migration Safety — Steps 3 and 4).
- Implementation Guide §8.3 (Testing Strategy — #1 thresholds).
- Project memory `user-testable-feedback` — visible outcome required.
- Prior art: any prior generator from this round for the CE edit pattern.

## Step-by-step

1. For each site in `fase5/sites-inventory.md`:
   - If the site is in `CommonEvents.json` (inline `Script` command, code 355
     or 655), write a patch in a new generator
     `fase5/build_phase5_ces.py` that rewrites the script string.
   - If the site is in `Jhonny_RaceHelper.js`, use the `Edit` tool to
     rewrite the inline expression.
2. Replacement pattern (from Implementation Guide §2.3):

   ```javascript
   // Before (example from CE 19):
   const thr = $gameVariables.value(100) === 1 ? 60 : $gameVariables.value(100) === 2 ? 100 : 150;
   $gameVariables.setValue(117, $gameVariables.value(105) >= thr ? 1 : 0);

   // After:
   const raceId = $gameVariables.value(100);
   const pontos = $gameVariables.value(105);
   $gameVariables.setValue(117, window.JhonnyRace.isVictory(pontos, raceId) ? 1 : 0);
   ```

3. **Defensive fallback in CE 19** (per Implementation Guide §2.4 Step 4):
   wrap the helper call in a `typeof` guard:

   ```javascript
   if (typeof window.JhonnyRace === "undefined") {
       const thr = $gameVariables.value(100) === 1 ? 60 : $gameVariables.value(100) === 2 ? 100 : 150;
       $gameVariables.setValue(117, $gameVariables.value(105) >= thr ? 1 : 0);
   } else {
       const raceId = $gameVariables.value(100);
       const pontos = $gameVariables.value(105);
       $gameVariables.setValue(117, window.JhonnyRace.isVictory(pontos, raceId) ? 1 : 0);
   }
   ```

4. For the generator (if any CE sites need rewriting):
   - Each patch function detects the old pattern (literal `60`, `100`, `150`
     in a script string referencing `value(105)` or `value(100)`) and rewrites
     to the new pattern.
   - Idempotency check: if the script string already contains
     `window.JhonnyRace.isVictory`, skip.
5. Run the generator (if any), then `node -c` on the plugin (if edited).
6. Validate JSON: `python3 -m json.tool Jhonny/data/CommonEvents.json`.
7. Programmatic audit:

   **Audit I** — No literal threshold numbers remain in CE 19 victory logic:
   ```
   python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); c19=ces[19]['list']; scripts=[cmd for cmd in c19 if cmd['code'] in (355,655)]; has_helper=any('JhonnyRace.isVictory' in str(s['parameters']) for s in scripts); has_literal=any(('>= 60' in str(s['parameters']) or '=== 60' in str(s['parameters'])) for s in scripts); assert has_helper and not has_literal, f'helper={has_helper} literal={has_literal}'; print('Audit I OK')"
   ```
   (Adjust the literal patterns based on what task 5.1 catalogued.)

8. Hand off to the user for Playtest:
   - **Boundary test (win at 60):** Win race 1 normally. The final glory
     must be ≥60. Victory screen shows.
   - **Boundary test (defeat at 59):** Use a debug picture or in-game
     mechanism to reach the end of race 1 with exactly 59 glory (or use
     console `$gameVariables.setValue(105, 59)` then complete the final
     scene). Defeat screen shows.

## visual_validation

On Playtest:

- **At ≥60 glory after race 1 end:** Victory screen with Victory ME.
- **At <60 glory after race 1 end:** Defeat screen with Defeat ME.
- The visible signal is which screen appears (victory vs defeat), driven
  entirely by the glory value vs the threshold.

> Console use is acceptable **only for setting the glory value to a precise
> number** for the boundary test. The actual outcome (which screen shows)
> must be perceived normally, not via F9.

## Definition of Done

- [ ] Every site in `fase5/sites-inventory.md` migrated.
- [ ] `node -c` on plugin passes (if plugin edited).
- [ ] `python3 -m json.tool` validates.
- [ ] Generator idempotent (if used): 2nd run = "skipped" + empty diff.
- [ ] Defensive fallback present in CE 19.
- [ ] Audit I prints "OK".
- [ ] User confirms: victory at ≥60 glory, defeat at <60 glory for race 1.
- [ ] `fase5/fase-5-completa.md` written with audit output and Playtest
      summary.
- [ ] Round 1 complete — all six issues resolved.
