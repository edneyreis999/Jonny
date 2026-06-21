---
status: pending
phase: 2
task_id: 2.3
---

# Task 2.3 — Run Generator, Audit, and Playtest Phase 2

## Objective

Apply Patch G and Patch H to CE 19, validate JSON and generator idempotency,
run programmatic audits, and confirm via Playtest that a distinct ME plays
on loss vs win.

## Dependencies

- task-2.2 — `fase2/build_phase2_ces.py` exists and parses cleanly.

## References

- Implementation Guide §8.3 (Testing Strategy — #2 victory ME / #2 defeat ME).
- Implementation Guide §10.2 ("Don't use console.log").
- Project memory `user-testable-feedback` — audible signal required.

## Step-by-step

1. Run the generator from the repo root:
   ```
   python3 Jhonny/planos/003-bug-fix-round1/fase2/build_phase2_ces.py
   ```
   Expected: prints "applied" for Patch G and Patch H on the first run.
2. Validate JSON:
   ```
   python3 -m json.tool Jhonny/data/CommonEvents.json > /dev/null
   ```
3. Re-run the generator. Expected: prints "skipped" for Patch G and Patch H.
   Verify `git diff --stat Jhonny/data/CommonEvents.json` shows no changes.
4. Run programmatic audits:

   **Audit G** — VITORIA_PASSOU script block precedes the audio command in
   CE 19 (accepts either PlaySE 249 pre-conversion or Play ME 246
   post-conversion as the audio anchor):
   ```
   python3 -c "import json; c=json.load(open('Jhonny/data/CommonEvents.json'))[19]; lst=c['list']; script_idx=next(i for i,cmd in enumerate(lst) if cmd['code'] in (355,655) and 'setValue(117' in str(cmd['parameters'])); audio_idx=next(i for i,cmd in enumerate(lst) if cmd['code'] in (246, 249)); assert script_idx < audio_idx, f'script at {script_idx}, audio at {audio_idx} — order wrong'; print('Audit G OK')"
   ```

   **Audit H** — Two distinct Play ME names present in a conditional branch
   (extracts the `name` field from each Play ME parameter dict):
   ```
   python3 -c "import json; c=json.load(open('Jhonny/data/CommonEvents.json'))[19]; lst=c['list']; names=[cmd['parameters'][0].get('name') if isinstance(cmd['parameters'][0], dict) else cmd['parameters'][0] for cmd in lst if cmd['code']==246]; assert len(set(names)) >= 2, f'expected >=2 distinct ME names, got {names}'; print('Audit H OK')"
   ```

   **Audit I** — No PlaySE (code 249) remains in the audio position in
   CE 19 (confirms Patch H's opcode conversion 249 → 246 stuck):
   ```
   python3 -c "import json; c=json.load(open('Jhonny/data/CommonEvents.json'))[19]; lst=c['list']; se_names=[cmd['parameters'][0].get('name') for cmd in lst if cmd['code']==249 and isinstance(cmd['parameters'][0], dict) and cmd['parameters'][0].get('name') in ('Victory1','Defeat1','Defeat2','Gameover1','Gameover2')]; assert not se_names, f'PlaySE still used for ME asset(s): {se_names}'; print('Audit I OK')"
   ```

   **Audit J** — Ceremony-lock region untouched (cmd[0–1] still set the
   locks, cmd[29] is still `WAIT_INPUT`, and the `SW_PAUSED=OFF` marker
   still exists after the WAIT_INPUT loop):
   ```
   python3 -c "import json; c=json.load(open('Jhonny/data/CommonEvents.json'))[19]; lst=c['list']; assert lst[0]['code']==121 and lst[0]['parameters']==[101,101,0], 'SW_INPUT_LOCKED=ON missing at cmd[0]'; assert lst[1]['code']==121 and lst[1]['parameters']==[104,104,0], 'SW_PAUSED=ON missing at cmd[1]'; assert any(cmd['code']==118 and 'WAIT_INPUT' in str(cmd['parameters']) for cmd in lst), 'WAIT_INPUT label missing'; assert any(cmd['code']==121 and cmd['parameters']==[104,104,1] for cmd in lst), 'SW_PAUSED=OFF marker missing'; print('Audit J OK')"
   ```
5. Hand off to the user for Playtest:
   - Launch Playtest.
   - Win race 1 → victory screen → audible sting matches the Victory ME.
   - Lose race 1 (intentionally fail Risk to crash, or complete with score
     below threshold) → defeat screen → audible sting is the chosen Defeat
     ME, distinct from Victory.

## visual_validation

On Playtest:

- **Victory path:** short victory-flavored sting plays immediately when the
  victory screen appears.
- **Defeat path:** a different, distinct sting plays immediately when the
  defeat screen appears — not the victory sting, not silence.

The audible signal is the ME itself. The user must be able to tell the two
apart by ear within the first second.

> **Pre-Playtest sanity check.** Before delivering the build, verify that
> the implementer can hear *any* ME on the victory screen. The pre-Phase-2
> command was `PlaySE Victory1` (code 249), but `Victory1.ogg` lives in
> `audio/me/` only — the SE channel cannot load it. If the user reports
> silence on both victory and defeat paths after Patch H, the likely cause
> is that Patch H did not actually flip the opcode to 246; re-run Audit I.

## Definition of Done

- [ ] First generator run prints "applied" for Patch G and Patch H.
- [ ] `python3 -m json.tool` validates the JSON.
- [ ] Second generator run prints "skipped" for Patch G and Patch H with
      empty `git diff`.
- [ ] Audit G, H, I, and J all print "OK".
- [ ] User confirms via Playtest: distinct audible ME on loss vs win
      (and not silence on either path).
- [ ] `fase2/fase-2-completa.md` written with audit outputs and Playtest
      scenario summary.
