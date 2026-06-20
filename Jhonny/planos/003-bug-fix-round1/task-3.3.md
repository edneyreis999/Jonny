---
status: pending
phase: 3
task_id: 3.3
---

# Task 3.3 — Run Generator, Audit, and Playtest Phase 3

## Objective

Apply Patch F (EV_UpdateHud) and Patch G (INIT re-show), validate JSON and
idempotency, run programmatic audits, and confirm via Playtest that the
awareness HUD updates live and survives a crash→restart cycle.

## Dependencies

- task-3.2 — `fase3/build_phase3_ces.py` exists and parses cleanly.

## References

- Implementation Guide §8.3 (Testing Strategy — #5 HUD updates, #6 HUD
  survives restart).
- Implementation Guide §10.3 (refresh HUD at 10 Hz, not 60 Hz).
- Project memory `user-testable-feedback` — visible HUD update required.

## Step-by-step

1. Run the generator:
   ```
   python3 Jhonny/planos/003-bug-fix-round1/fase3/build_phase3_ces.py
   ```
   Expected: prints "applied" x2.
2. Validate JSON: `python3 -m json.tool Jhonny/data/CommonEvents.json`.
3. Re-run the generator. Expected: "skipped" x2 with empty `git diff`.
4. Programmatic audits:

   **Audit F** — EV_UpdateHud CE exists, parallel, switch 100, with HUD_TICK:
   ```
   python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); hud=next((c for c in ces if c and c.get('name')=='EV_UpdateHud'), None); assert hud, 'EV_UpdateHud missing'; assert hud['trigger']==2 and hud['switchId']==100, f'wrong trigger/switch: {hud.get(\"trigger\")}/{hud.get(\"switchId\")}'; assert any('HUD_TICK' in str(cmd.get('parameters')) for cmd in hud['list']), 'HUD_TICK label missing'; print('Audit F OK')"
   ```

   **Audit G** — CE 5 INIT shows the HUD picture after SW_RACE_ACTIVE ON:
   ```
   python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); c5=ces[5]['list']; sw_on_idx=next((i for i,cmd in enumerate(c5) if cmd['code']==121 and cmd['parameters'][0]==100 and cmd['parameters'][2]==0), None); assert sw_on_idx is not None, 'SW_RACE_ACTIVE ON not found in CE 5'; show_idx=next((i for i,cmd in enumerate(c5[sw_on_idx:], sw_on_idx) if cmd['code']==231), None); assert show_idx is not None, 'no Show Picture after switch ON'; print('Audit G OK')"
   ```
5. Hand off to the user for Playtest:
   - Race 1 start: HUD "Consciência: 0%" visible from frame 1.
   - Perform a Safe action: HUD updates to "Consciência: 10%" within ~100ms
     (about 6 frames).
   - Crash mid-race (intentionally fail Risk): HUD erased by EV_Crash.
   - Restart attempt 2: HUD visible again at "Consciência: 0%" from frame 1
     of the new attempt (this is the #6 fix validation).

## visual_validation

On Playtest:

- HUD text "Consciência: X%" is visible at race start.
- After a Safe action, the number visibly increases (within ~100ms — fast
  but perceptible).
- After a crash and restart, the HUD is visible again at the start of the
  next attempt — it does not stay missing.

The visible signal is the HUD text itself changing on screen.

## Definition of Done

- [ ] First generator run prints "applied" x2.
- [ ] `python3 -m json.tool` validates.
- [ ] Second run prints "skipped" x2 with empty `git diff`.
- [ ] Audit F and G both print "OK".
- [ ] User confirms: HUD updates within 100ms of Safe action AND survives
      crash→restart cycle.
- [ ] `fase3/fase-3-completa.md` written with audit outputs and Playtest
      scenario summary.
