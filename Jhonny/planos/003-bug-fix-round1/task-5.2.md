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
- `Jhonny/js/plugins/Jhonny_RaceHelper.js` — existing helper plugin. The
  `window.JhonnyRace` global already exists at the bottom of the IIFE and
  exposes APIs used elsewhere. The namespace block MUST extend it via the
  `window.JhonnyRace = window.JhonnyRace || {}` accumulator pattern, never
  reassign it from scratch.

## Step-by-step

1. Read `Jhonny/js/plugins/Jhonny_RaceHelper.js` end-to-end (refresh from
   task 1.1's reading).
2. Locate the IIFE wrapper (the `(() => { ... })();` block at the top) and
   identify the existing `window.JhonnyRace = { ... }` assignment near the
   bottom of the IIFE (currently around line 170). List the existing
   properties on that object (e.g. `logFrameDebug`, `rollPCena`, etc.) —
   the new namespace block MUST NOT remove or shadow any of them.
3. Inside the IIFE, before the existing `window.JhonnyRace = { ... }`
   assignment, add the namespace block (adapted from Implementation Guide
   §2.3). Use the accumulator pattern to preserve any pre-existing
   properties:

   ```javascript
   const JhonnyRace = window.JhonnyRace || {};
   JhonnyRace.Config = JhonnyRace.Config || {};

   JhonnyRace.Config.THRESHOLDS = Object.freeze({
       1: 200,
       2: 400,
       3: 600,
   });

   JhonnyRace.Config.DEFAULT_THRESHOLD = 60;

   JhonnyRace.isVictory = function (pontosGloria, raceId) {
       const t = this.Config.THRESHOLDS[raceId] ?? this.Config.DEFAULT_THRESHOLD;
       return (pontosGloria | 0) >= t;
   };

   JhonnyRace.thresholdFor = function (raceId) {
       return this.Config.THRESHOLDS[raceId] ?? this.Config.DEFAULT_THRESHOLD;
   };
   ```

   The `THRESHOLDS` values `200/400/600` and `DEFAULT_THRESHOLD = 60` MUST
   match the literal values currently inlined in CE 19 cmd[8-9]
   (`{ 1: 200, 2: 400, 3: 600 }` with fallback `|| 60`). Any divergence
   between the namespace values and the CE 19 fallback in task 5.3 changes
   game balance, which is out of scope for this refactor.
4. Use the `Edit` tool (not Write) to insert the namespace block. Two
   passes are required:
   - **Pass 1:** Insert the namespace block inside the IIFE, before the
     existing `window.JhonnyRace = { ... }` assignment.
   - **Pass 2:** Verify the existing `window.JhonnyRace` assignment at the
     bottom of the IIFE still runs AFTER the namespace block, so the
     accumulated `JhonnyRace` local is published to `window`. If the
     existing assignment uses an object literal (`window.JhonnyRace = { ... }`),
     it MUST be rewritten to merge into the accumulator instead of
     replacing it (e.g. `Object.assign(JhonnyRace, { ... })`).
5. Validate syntax:
   ```
   node -c Jhonny/js/plugins/Jhonny_RaceHelper.js
   ```
   Must exit 0.
6. Re-read the plugin to confirm:
   - The namespace block sits inside the IIFE.
   - The existing `window.JhonnyRace` API surface (e.g. `logFrameDebug`)
     is still present and accessible from the console.
   - `JhonnyRace.Config.THRESHOLDS` is a frozen object with the
     `200/400/600` values.

## visual_validation

This task adds code but does not change game behavior. Validation:

- `node -c` passes.
- After Playtest launch (no game action needed), opening the browser
  console and typing `window.JhonnyRace.isVictory(200, 1)` returns `true`,
  and `window.JhonnyRace.isVictory(199, 1)` returns `false`.
- `window.JhonnyRace.thresholdFor(1) === 200`,
  `window.JhonnyRace.thresholdFor(99) === 60` (DEFAULT_THRESHOLD).
- Existing API surface (e.g. `window.JhonnyRace.logFrameDebug`) is still
  present and `typeof`-checks as `"function"`.

> Note: console use here is for **verifying the helper exists** — this is
> the validation for the namespace addition itself, not for the in-game
> threshold behavior (that validation happens in task 5.3 Playtest).

## Definition of Done

- [ ] Namespace block inserted inside the plugin IIFE before the existing
      `window.JhonnyRace = { ... }` assignment.
- [ ] Existing `window.JhonnyRace` API surface preserved (no properties
      shadowed or removed).
- [ ] `node -c Jhonny/js/plugins/Jhonny_RaceHelper.js` exits 0.
- [ ] Plugin still loads in Playtest (no syntax errors at boot).
- [ ] `window.JhonnyRace.isVictory(200, 1) === true` from console.
- [ ] `window.JhonnyRace.isVictory(199, 1) === false` from console.
- [ ] `window.JhonnyRace.Config.THRESHOLDS` is frozen and contains
      `{ 1: 200, 2: 400, 3: 600 }`.
- [ ] No call sites changed yet (deferred to task 5.3).
