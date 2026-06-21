---
status: done
phase: 3
task_id: 3.3
---

# Task 3.3 — Run Generator, Audit, and Playtest Phase 3

## Objective

Apply Patch I (EV_UpdateHud) and Patch J (INIT re-show), validate JSON and
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

   > Audit letters continue the cross-phase namespace (Fase 2 used G/H/I/J
   > for its four checks). This phase uses I, J, K — same letters as the
   > patches, since each audit is paired with a patch.

   **Audit I** — EV_UpdateHud CE exists, parallel, switch 100, with HUD_TICK
   label and a SW_PAUSED early-exit guard (semantic check, not just opcode):
   ```
   python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); hud=next((c for c in ces if c and c.get('name')=='EV_UpdateHud'), None); assert hud, 'EV_UpdateHud missing'; assert hud['trigger']==2 and hud['switchId']==100, f'wrong trigger/switch: {hud.get(\"trigger\")}/{hud.get(\"switchId\")}'; assert any(cmd.get('code')==118 and cmd.get('parameters')==['HUD_TICK'] for cmd in hud['list']), 'HUD_TICK label (code 118) missing'; assert any(cmd.get('code')==111 and cmd.get('parameters')==[0,104,0] for cmd in hud['list'][:8]), 'SW_PAUSED guard missing at EV_UpdateHud head'; print('Audit I OK')"
   ```

   **Audit J** — CE 5 INIT shows the HUD picture after SW_RACE_ACTIVE ON,
   with TextPicture plugin command preceding the Show Picture (semantic
   check that the picture will actually render text, not just be empty):
   ```
   python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); c5=ces[5]['list']; sw_on_idx=next((i for i,cmd in enumerate(c5) if cmd['code']==121 and cmd['parameters'][0]==100 and cmd['parameters'][2]==0), None); assert sw_on_idx is not None, 'SW_RACE_ACTIVE ON not found in CE 5'; show_idx=next((i for i,cmd in enumerate(c5[sw_on_idx+1:], sw_on_idx+1) if cmd['code']==231), None); assert show_idx is not None, 'no Show Picture after switch ON'; has_tp=any(c5[i].get('code')==357 for i in range(sw_on_idx+1, show_idx)); assert has_tp, 'Show Picture not preceded by TextPicture plugin command'; print('Audit J OK')"
   ```

   **Audit K (ceremony-lock regression)** — Fase 1 v2 ceremony lock in
   CE 19 head is intact (Patch I/J must not have shifted indices):
   ```
   python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); head=ces[19]['list'][:8]; assert any(cmd['code']==121 and cmd['parameters']==[101,101,0] for cmd in head), 'SW_INPUT_LOCKED=ON missing from CE 19 head'; assert any(cmd['code']==121 and cmd['parameters']==[104,104,0] for cmd in head), 'SW_PAUSED=ON missing from CE 19 head'; assert not any(cmd['code']==121 and 100 in (cmd['parameters'][0], cmd['parameters'][1]) for cmd in head if cmd['code']==121 and cmd['parameters']), 'CE 19 head unexpectedly touches SW_RACE_ACTIVE'; print('Audit K OK')"
   ```
5. Hand off to the user for Playtest. **Browser cache rule:** after the
   generator writes `CommonEvents.json`, the user MUST hard-refresh the
   browser (`Cmd+Shift+R` on macOS) before re-entering the race scene.
   A soft refresh can serve the cached JSON and mask the fix.
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

- [ ] First generator run prints "applied" x2 (Patch I + Patch J).
- [ ] `python3 -m json.tool` validates.
- [ ] Second run prints "skipped" x2 with empty `git diff`.
- [ ] Audit I, J, and K all print "OK".
- [ ] User hard-refreshed browser before Playtest.
- [ ] User confirms: HUD updates within 100ms of Safe action AND survives
      crash→restart cycle.
- [ ] `fase3/fase-3-completa.md` written with audit outputs and Playtest
      scenario summary.
