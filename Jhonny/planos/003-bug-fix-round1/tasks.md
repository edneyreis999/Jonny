# Action Plan — Race Feedback Bug Fix Round 1

> Generated from [Implementation Guide — Race Scene Feedback Batch](race-feedback-impl-guide.md) and [Draft — User Feedback](Draft.md).
> Executor: AI agent. Validation: RPG Maker MZ Playtest.

## Overview

Five-phase fix for six issues reported on 2026-06-19 against the race scene
(`Jhonny_RaceHelper.js` + Common Events). Critical bug first (#3 glory exploit),
pure refactor last (#1 THRESHOLDS). Each phase ends with a visible or audible
validation in Playtest.

## Source bugs

| ID  | Symptom                                                         | Phase |
| --- | --------------------------------------------------------------- | ----- |
| #3  | Timer leaks on victory/defeat screen → infinite glory (CRITICAL) | 1     |
| #2  | Defeat screen plays Victory ME                                  | 2     |
| #5  | Awareness % HUD stuck at 0%                                     | 3     |
| #6  | Awareness % HUD disappears after first attempt                  | 3     |
| #4  | Curve scene Risk/Safe labels inverted                           | 4     |
| #1  | THRESHOLDS magic numbers duplicated                             | 5     |

## Phases

### Phase 1 — Critical Glory Exploit Fix (#3)

**Goal:** Stop timer and glory award on the cerimonial screen without toggling the race-owner switch.
**Visual validation:** Glory number on victory/defeat screen stays put during a 30s idle, then continue input exits the screen.

- task-1.1 — Snapshot state + locate CE targets · ~1h · deps: none
- task-1.2 — Define idempotent CE ceremony-lock patch (3 checks) · ~3h · deps: 1.1
- task-1.3 — Run generator + audit + Playtest · ~1h · deps: 1.2

### Phase 2 — Defeat Music (#2)

**Goal:** Play a distinct ME on loss vs win.
**Visual validation:** Distinct audible ME plays on the loss screen (not Victory).

- task-2.1 — Inventory ME assets + pick non-Victory · ~1h · deps: 1.3
- task-2.2 — Write `fase2/build_phase2_ces.py` (reorder + branch ME) · ~3h · deps: 2.1
- task-2.3 — Run generator + audit + Playtest · ~1h · deps: 2.2

### Phase 3 — Awareness HUD Fixes (#5 + #6)

**Goal:** HUD updates live and survives crash→restart.
**Visual validation:** HUD "Consciência: X%" updates within ~100ms + is visible from frame 1 of the next attempt.

- task-3.1 — Locate HUD picture ID + TextPicture usage · ~1h · deps: 2.3
- task-3.2 — Write `fase3/build_phase3_ces.py` (EV_UpdateHud + INIT re-show) · ~4h · deps: 3.1
- task-3.3 — Run generator + audit + Playtest · ~1h · deps: 3.2

### Phase 4 — Curve Labels (#4)

**Goal:** Correct Risk/Safe label placement.
**Visual validation:** Left button labeled Risk, right button labeled Safe in the Curve scene.

- task-4.1 — Diagnose H1 (coord swap) vs H2 (file swap) vs H3 (condition) · ~1h · deps: 3.3
- task-4.2 — Apply fix (direct edit or generator per hypothesis) · ~2h · deps: 4.1
- task-4.3 — Run + audit + Playtest · ~1h · deps: 4.2

### Phase 5 — THRESHOLDS Refactor (#1)

**Goal:** Extract magic numbers to `window.JhonnyRace.Config`.
**Visual validation:** Victory screen at exactly 60 glory; defeat screen at 59.

- task-5.1 — Inventory literal 60/100/150 sites · ~1h · deps: 4.3
- task-5.2 — Add `window.JhonnyRace` namespace to plugin · ~2h · deps: 5.1
- task-5.3 — Replace literal sites + Playtest · ~3h · deps: 5.2

## Execution order

```
1.1 → 1.2 → 1.3 → 2.1 → 2.2 → 2.3 → 3.1 → 3.2 → 3.3 → 4.1 → 4.2 → 4.3 → 5.1 → 5.2 → 5.3
```

## Conventions

- **Generators** live at `fase<N>/build_phase<N>_ces.py`. Each is idempotent via
  pattern detection. A second run must print "skip" for every patch and produce
  an empty `git diff` on the JSON output.
- **Validation** after every edit:
  - `python3 -m json.tool Jhonny/data/CommonEvents.json` (after any CE edit)
  - `node -c Jhonny/js/plugins/Jhonny_RaceHelper.js` (after any plugin edit)
- **Audit:** one Python check per patch; all must pass before Playtest.
- **Visual feedback:** per project memory `user-testable-feedback.md`, every
  Playtest validation must produce a visible or audible signal the user can
  perceive without F12/F9.
- **CE safety:** per project memory `never-delete-common-events`, never null a
  Common Event — clean it to an empty object if removal is required.
- **Indent rule:** per project memory `rpg-mz-indent-skipbranch`, any command
  inserted inside an IF/ELSE branch must match the surrounding indent, or
  `skipBranch` will terminate the branch early.
- **ControlSwitch inversion:** code 121 with `params[2] === 0` turns the switch
  ON; `params[2] === 1` turns it OFF. Always audit raw JSON after editing.
- **Ceremony lock:** during victory/defeat `WAIT_INPUT`, keep `SW_RACE_ACTIVE`
  unchanged and use `SW_INPUT_LOCKED=ON` to pause timer/handlers.
- **Generated CE source:** when a task changes `CommonEvents.json`, update the
  corresponding generator/patcher and run it once to prove idempotency.
- **No auto-commit:** the user explicitly directs when to commit. Do not run
  `git commit` unless asked.

## References

- Implementation guide: [race-feedback-impl-guide.md](race-feedback-impl-guide.md)
- User feedback: [Draft.md](Draft.md)
- Spec (normative): `docs/02-Core-Loop/Corrida - Core Loop.md`
- Plugin target: `Jhonny/js/plugins/Jhonny_RaceHelper.js`
- Memory: `race-feedback-batch.md` (issue source)
