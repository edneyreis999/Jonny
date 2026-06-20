---
status: pending
phase: 1
task_id: 1.3
---

# Task 1.3 — Run Generator, Audit, and Playtest Phase 1

## Objective

Apply the three patches from `build_phase1_ces.py`, verify JSON validity and
generator idempotency, run programmatic audits per patch, and confirm via
Playtest that the glory exploit is closed.

## Dependencies

- task-1.2 — `fase1/build_phase1_ces.py` exists and parses cleanly.

## References

- Implementation Guide §4.5 (Verification Plan — Manual Playtest).
- Implementation Guide §11 (Phase 1 checklist).
- Project memory `mz-playtest-pauses` — F12 DevTools focus pauses the RMMZ
  game loop. Do NOT open F12 while measuring timer/glory behavior.
- Project memory `user-testable-feedback` — visible signal required; F9 is
  debug-only and does not count.

## Step-by-step

1. Run the generator from the repo root:
   ```
   python3 Jhonny/planos/003-bug-fix-round1/fase1/build_phase1_ces.py
   ```
   Expected: prints "applied" for all three patches on the first run.
2. Validate JSON:
   ```
   python3 -m json.tool Jhonny/data/CommonEvents.json > /dev/null
   ```
   Must exit 0.
3. Re-run the generator. Expected: prints "skipped" for all three patches.
   Verify with `git diff --stat Jhonny/data/CommonEvents.json` — no changes
   between the two runs (idempotency).
4. Run programmatic audits (one Python one-liner per patch). All must pass:

   **Audit A** — CE 19 has the three freeze switches at the top:
   ```
   python3 -c "import json; c=json.load(open('Jhonny/data/CommonEvents.json'))[19]; head=[cmd for cmd in c['list'][:8] if cmd['code']==121]; s={tuple(cmd['parameters']) for cmd in head}; assert (100,100,1) in s and (101,101,0) in s and (104,104,0) in s, f'freeze switches missing: {s}'; print('Audit A OK')"
   ```

   **Audit B** — Timer CE has an `Exit Event Processing` (code 115) inside a
   branch conditioned on switch 100:
   ```
   python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); timer_idx=<FROM_FINDINGS>; lst=ces[timer_idx]['list']; found=any(lst[i]['code']==111 and lst[i+1]['code']==115 for i in range(len(lst)-1)); assert found, 'timer early-return missing'; print('Audit B OK')"
   ```

   **Audit C** — Safe-resolution CE has a guard branch on
   `VAR_SCENE_INDEX >= VAR_RACE_N_CENAS`:
   ```
   python3 -c "import json; ces=json.load(open('Jhonny/data/CommonEvents.json')); safe_idx=<FROM_FINDINGS>; lst=ces[safe_idx]['list']; found=any(lst[i]['code']==111 and lst[i]['parameters'][0]==1 and lst[i]['parameters'][1]==101 and lst[i]['parameters'][6]==111 for i in range(len(lst))); assert found, 'safe invariant guard missing'; print('Audit C OK')"
   ```
   (Exact parameter indices may need adjustment based on the RMMZ branch
   command layout — verify against an existing branch in the same CE first.)
5. Hand off to the user for Playtest. Provide these explicit instructions:
   - Launch Playtest (`python3 -m http.server` from `Jhonny/`, then open
     `http://localhost:8000`).
   - Trigger the race scene. Complete race 1 successfully to reach the
     victory screen.
   - On the victory screen, **do not press space.** Wait 30 seconds.
   - Watch the glory number on the screen. It must not increase.
   - Press space. Confirm the glory value matches the value at the moment of
     victory (no +10, +20, etc. increments during idle).
   - Repeat for the defeat screen (intentionally fail a Risk action to crash,
     then idle on the defeat screen 30 seconds; glory must not increase).
6. If Playtest fails: re-read `fase1/findings.md` for the correct CE indices,
   fix the generator (do not edit JSON directly — per retrospective "artefato-
   fonte primeiro"), re-run, re-audit, re-Playtest.

## visual_validation

On Playtest (no F12):

- Victory screen: glory number printed on the picture stays put for the full
  30 seconds of idle. After pressing space, the value is identical to the
  end-of-race value.
- Defeat screen: same behavior — glory number stays put.

The visible signal is the **glory number on the screen** itself. If the HUD
does not display glory, ask the user to display it on a temporary debug
picture as part of this task (not F9 — F9 is debug-only and does not satisfy
`user-testable-feedback`).

## Definition of Done

- [ ] First generator run prints "applied" x3.
- [ ] `python3 -m json.tool` validates the JSON.
- [ ] Second generator run prints "skipped" x3 with empty `git diff`.
- [ ] Audit A, B, C all print "OK".
- [ ] User confirms via Playtest: glory number does not increase during 30s
      idle on both victory and defeat screens.
- [ ] `fase1/fase-1-completa.md` written with the audit outputs and the
      Playtest scenario summary.
