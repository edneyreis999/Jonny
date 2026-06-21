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
- Generator conventions (see existing generators under the
  `fase<N>/build_phase<N>_ces.py` pattern): module-level named constants
  for CE indices and command codes; `applied` / `skipped` status verbs
  with `startswith("applied")` dispatch; `_write_back` only when at least
  one patch applied; idempotency via substring presence of the new
  sentinel; sanity-check the CE name before mutating.

## Step-by-step

1. For each site in `fase5/sites-inventory.md`:
   - If the site is in `CommonEvents.json` (inline `Script` command, code 355
     or 655), write a patch in a new generator
     `fase5/build_phase5_ces.py` that rewrites the script string.
   - If the site is in `Jhonny_RaceHelper.js`, use the `Edit` tool to
     rewrite the inline expression.
2. Replacement pattern (adapted from Implementation Guide §2.3). The
   BEFORE form MUST match the actual current code in CE 19 cmd[6-10],
   which uses a dict-with-fallback structure (not a ternary):

   ```javascript
   // Before (current code in CE 19 cmd[6]-cmd[10]):
   const pontos = $gameVariables.value(105);
   const raceId = $gameVariables.value(100);
   const thresholds = { 1: 200, 2: 400, 3: 600 };
   const passou = pontos >= (thresholds[raceId] || 60);
   $gameVariables.setValue(117, passou ? 1 : 0);

   // After (when the helper is available):
   const raceId = $gameVariables.value(100);
   const pontos = $gameVariables.value(105);
   $gameVariables.setValue(117, window.JhonnyRace.isVictory(pontos, raceId) ? 1 : 0);
   ```

3. **Defensive fallback in CE 19** (per Implementation Guide §2.4 Step 4).
   The fallback branch MUST replicate the current dict-with-fallback
   structure verbatim, so a plugin load failure preserves the exact
   pre-refactor behavior. The fallback values MUST be `200/400/600` with
   `|| 60` — NOT the spec values `60/100/150`. Replacing the literals
   during the refactor changes game balance and is out of scope.

   ```javascript
   if (typeof window.JhonnyRace === "undefined") {
       const pontos = $gameVariables.value(105);
       const raceId = $gameVariables.value(100);
       const thresholds = { 1: 200, 2: 400, 3: 600 };
       const passou = pontos >= (thresholds[raceId] || 60);
       $gameVariables.setValue(117, passou ? 1 : 0);
   } else {
       const raceId = $gameVariables.value(100);
       const pontos = $gameVariables.value(105);
       $gameVariables.setValue(117, window.JhonnyRace.isVictory(pontos, raceId) ? 1 : 0);
   }
   ```

   The fallback MUST live inside the existing CE 19 `code=355`/`655` Script
   block, replacing cmds [6]-[10] in-place via slice assignment. It MUST
   NOT split into multiple Script commands (would shift indices of the
   downstream ceremony-lock and `WAIT_INPUT` region).

4. For the generator (`fase5/build_phase5_ces.py`):
   - **Patch letter M.** Confirm via
     `rg "patch_[a-z]_" fase*/build_phase*.py interaction/fase*/build_phase*.py`
     before naming; the function MUST be `patch_m_replace_threshold_with_helper`
     (or similar `patch_m_*`). Phases 1-4 reserved A-L.
   - **Idempotency predicate:** the script source of the target block
     already contains the substring `window.JhonnyRace.isVictory`. If so,
     return `"skipped"` and do not mutate.
   - **Old-pattern locator:** the target block is a contiguous sequence
     of `code=355` followed by `code=655` Script commands whose
     concatenated source contains BOTH (`value(105)` or `value(100)`)
     AND (`{ 1: 200` or `1:200` or any literal threshold token). The
     locator MUST tolerate alignment whitespace via regex `\s+` when
     matching JS substrings.
   - **CE sanity check:** `ces[19]` MUST exist, MUST NOT be `null`, and
     its `name` MUST be `"EV_VitoriaCorrida"`. If any of these fail,
     return `"skipped (CE 19 is not EV_VitoriaCorrida; manual review)"`
     and do not mutate.
   - **Ceremony-lock invariant:** the generator MUST NOT insert or modify
     any `code=121` (ControlSwitch) command on switches 100
     (`SW_RACE_ACTIVE`), 101 (`SW_INPUT_LOCKED`), or 104 (`SW_PAUSED`)
     anywhere in CE 19. The ceremony-lock head of CE 19 (which sets
     `SW_INPUT_LOCKED=ON` and `SW_PAUSED=ON`) MUST be preserved verbatim
     across the mutation.
   - **JSON writing:** use
     `json.dumps(ces, indent=4, ensure_ascii=False) + "\n"` with
     `encoding="utf-8"`. Before the first run, verify HEAD indent via
     `git show HEAD:Jhonny/data/CommonEvents.json | head -c 200`. Do NOT
     pass `sort_keys=True` — key order MUST match the existing file.
   - **Conditional write:** `_write_back` is called only when at least
     one patch returned `"applied"`. A second run with no changes MUST
     produce empty `git diff`.
   - **Status verbs:** every patch returns `tuple[str, list]` whose first
     element starts with exactly `"applied"` or `"skipped"`. The
     orchestrator dispatches via `result.startswith("applied")`.
5. Run the generator, then `node -c` on the plugin (if edited).
6. Validate JSON: `python3 -m json.tool Jhonny/data/CommonEvents.json`.
7. Programmatic audit. The audit MUST be semantic: assert BOTH (a) the
   helper call is present in the rewritten CE 19 script block AND (b) no
   threshold literal in any of its comparison forms remains adjacent to
   `value(105)` or `value(100)`. The audit MUST cover all literal forms
   catalogued in `fase5/sites-inventory.md` (dict values like `{ 1: 200`,
   comparisons like `>= 200`, ternaries like `? 200 :`, fallbacks like
   `|| 60`).

   **Audit M** — CE 19 script block migrated to helper, no threshold
   literals remain in comparison form, ceremony-lock head intact:
   ```
   python3 -c "
   import json, re
   ces = json.load(open('Jhonny/data/CommonEvents.json'))
   ce19 = ces[19]['list']
   assert ces[19] and ces[19].get('name') == 'EV_VitoriaCorrida', 'CE 19 missing or misnamed'

   # (a) Helper call present in the script block.
   scripts = [c for c in ce19 if c['code'] in (355, 655)]
   src = '\n'.join(s['parameters'][0] for s in scripts)
   assert 'window.JhonnyRace.isVictory' in src, 'helper call missing'

   # (b) No threshold-literal-in-comparison form survives. Cover >=, >, ===, ternary, dict-value, and || fallback.
   comparison_forms = [
       r'>=\s*(60|100|150|200|400|600)\b',
       r'>\s*(60|100|150|200|400|600)\b',
       r'===\s*(60|100|150|200|400|600)\b',
       r'\?\s*(60|100|150|200|400|600)\s*:',
       r'\{\s*1:\s*(60|100|150|200|400|600)\b',
       r'\|\|\s*(60|100|150|200|400|600)\b',
   ]
   for pat in comparison_forms:
       # Only flag literals adjacent to value(105)/value(100). Search a 60-char window around each match.
       for m in re.finditer(pat, src):
           ctx = src[max(0, m.start()-60):m.end()+60]
           if 'value(105)' in ctx or 'value(100)' in ctx or 'thresholds' in ctx:
               raise AssertionError(f'threshold literal {m.group()!r} still in comparison form near vars')

   # (c) Ceremony-lock head intact: SW_INPUT_LOCKED (101) ON + SW_PAUSED (104) ON near the top.
   head = ce19[:8]
   sw_on_101 = any(c['code'] == 121 and c['parameters'][:2] == [101, 101] and c['parameters'][2] == 0 for c in head)
   sw_on_104 = any(c['code'] == 121 and c['parameters'][:2] == [104, 104] and c['parameters'][2] == 0 for c in head)
   assert sw_on_101 and sw_on_104, 'ceremony-lock head missing SW_INPUT_LOCKED=ON or SW_PAUSED=ON'

   print('Audit M OK')
   "
   ```

8. Hand off to the user for Playtest. After every JSON write, the user
   MUST hard-refresh the browser (`Cmd+Shift+R`) before re-entering the
   scene, or the cached JSON masks the fix.
   - **Boundary test (win at 200):** Win race 1 with glory ≥200. Victory
     screen shows.
   - **Boundary test (defeat at 199):** Use a debug picture or in-game
     mechanism to reach the end of race 1 with exactly 199 glory (or use
     console `$gameVariables.setValue(105, 199)` then complete the final
     scene). Defeat screen shows.

## visual_validation

On Playtest:

- **At ≥200 glory after race 1 end:** Victory screen with Victory ME.
- **At <200 glory after race 1 end:** Defeat screen with Defeat ME.
- The visible signal is which screen appears (victory vs defeat), driven
  entirely by the glory value vs the threshold.

> Console use is acceptable **only for setting the glory value to a precise
> number** for the boundary test. The actual outcome (which screen shows)
> must be perceived normally, not via F9.

## Definition of Done

- [ ] Every site in `fase5/sites-inventory.md` migrated.
- [ ] `node -c` on plugin passes (if plugin edited).
- [ ] `python3 -m json.tool` validates.
- [ ] Generator idempotent: 2nd run = "skipped" + empty `git diff`.
- [ ] Generator uses patch letter M (confirmed via `rg "patch_[a-z]_"`).
- [ ] Defensive fallback present in CE 19, replicating the dict-with-`|| 60`
      structure (values 200/400/600, not 60/100/150).
- [ ] Ceremony-lock head of CE 19 (`SW_INPUT_LOCKED=ON`, `SW_PAUSED=ON`)
      preserved; no `code=121` on switches 100/101/104 inserted.
- [ ] Audit M prints "OK".
- [ ] User confirms: victory at ≥200 glory, defeat at <200 glory for race 1.
- [ ] `fase5/fase-5-completa.md` written with audit output and Playtest
      summary.
- [ ] Round 1 complete — all six issues resolved.
