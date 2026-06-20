---
status: pending
phase: 5
task_id: 5.2
---

# Task 5.2 — Add `window.JhonnyRace` Namespace to Plugin

## Objective

Add the `window.JhonnyRace.Config.THRESHOLDS` frozen object and the
`isVictory` / `thresholdFor` helpers to `Jhonny_RaceHelper.js`. This is a
pure addition — no behavior change yet. Task 5.3 wires the call sites.

## Dependencies

- task-5.1 — `fase5/sites-inventory.md` confirms where existing THRESHOLDS
  logic lives (so the new namespace can replace it cleanly in 5.3).

## References

- Implementation Guide §2.3 (pseudo-code for the namespace block).
- Implementation Guide §2.4 (Migration Safety — Step 2: add namespace block).
- Implementation Guide §2.2 (Pattern Reference — Coreto `window.Coreto.*`).
- Project memory `never-delete-common-events` — not applicable here (this
  is plugin code, not CE JSON), but the spirit applies: do not delete the
  existing inline THRESHOLDS yet — task 5.3 does that.

## Step-by-step

1. Read `Jhonny/js/plugins/Jhonny_RaceHelper.js` end-to-end (refresh from
   task 1.1's reading).
2. Locate the IIFE wrapper (the `(() => { ... })();` block at the top).
3. Inside the IIFE, before any existing helper definitions, add the
   namespace block (adapted from Implementation Guide §2.3):

   ```javascript
   const JhonnyRace = window.JhonnyRace || {};
   JhonnyRace.Config = JhonnyRace.Config || {};

   JhonnyRace.Config.THRESHOLDS = Object.freeze({
       1: 60,   // Lenda — 6 cenas, Safe puro basta
       2: 100,  // Rachadura — 8 cenas, exige ≥2 Risk sucessos
       3: 150,  // Abismo — 10 cenas, exige múltiplos Risk altos
   });

   JhonnyRace.Config.DEFAULT_THRESHOLD = 60;

   JhonnyRace.isVictory = function (pontosGloria, raceId) {
       const t = this.Config.THRESHOLDS[raceId] ?? this.Config.DEFAULT_THRESHOLD;
       return (pontosGloria | 0) >= t;
   };

   JhonnyRace.thresholdFor = function (raceId) {
       return this.Config.THRESHOLDS[raceId] ?? this.Config.DEFAULT_THRESHOLD;
   };

   window.JhonnyRace = JhonnyRace;
   ```

4. Use the `Edit` tool (not Write) to insert this block. Two passes per
   retrospective guidance:
   - **Pass 1:** Find the IIFE opening line `(() => {` and insert the
     namespace block immediately after it.
   - **Pass 2:** Verify the closing `window.JhonnyRace = JhonnyRace;` is
     inside the IIFE (before `})();`).
5. Validate syntax:
   ```
   node -c Jhonny/js/plugins/Jhonny_RaceHelper.js
   ```
   Must exit 0.
6. Re-read the plugin to confirm the namespace block sits inside the IIFE
   and does not collide with existing names.

## visual_validation

This task adds code but does not change game behavior. Validation:

- `node -c` passes.
- After Playtest launch (no game action needed), opening the browser
  console and typing `window.JhonnyRace.isVictory(60, 1)` returns `true`,
  and `window.JhonnyRace.isVictory(59, 1)` returns `false`.

> Note: console use here is for **verifying the helper exists** — this is
> the validation for the namespace addition itself, not for the in-game
> threshold behavior (that validation happens in task 5.3 Playtest).

## Definition of Done

- [ ] Namespace block inserted inside the plugin IIFE.
- [ ] `node -c Jhonny/js/plugins/Jhonny_RaceHelper.js` exits 0.
- [ ] Plugin still loads in Playtest (no syntax errors at boot).
- [ ] `window.JhonnyRace.isVictory(60, 1) === true` from console.
- [ ] `window.JhonnyRace.isVictory(59, 1) === false` from console.
- [ ] No call sites changed yet (deferred to task 5.3).
