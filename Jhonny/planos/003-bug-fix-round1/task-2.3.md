---
status: pending
phase: 2
task_id: 2.3
---

# Task 2.3 — Run Generator, Audit, and Playtest Phase 2

## Objective

Apply Patch D and Patch E to CE 19, validate JSON and generator idempotency,
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
   Expected: prints "applied" for both patches on the first run.
2. Validate JSON:
   ```
   python3 -m json.tool Jhonny/data/CommonEvents.json > /dev/null
   ```
3. Re-run the generator. Expected: prints "skipped" for both patches. Verify
   `git diff --stat Jhonny/data/CommonEvents.json` shows no changes.
4. Run programmatic audits:

   **Audit D** — VITORIA_PASSOU script block precedes Play ME in CE 19:
   ```
   python3 -c "import json; c=json.load(open('Jhonny/data/CommonEvents.json'))[19]; lst=c['list']; script_idx=next(i for i,cmd in enumerate(lst) if cmd['code'] in (355,655) and 'setValue(117' in str(cmd['parameters'])); me_idx=next(i for i,cmd in enumerate(lst) if cmd['code']==246); assert script_idx < me_idx, f'script at {script_idx}, ME at {me_idx} — order wrong'; print('Audit D OK')"
   ```

   **Audit E** — Two distinct ME names present in a branch:
   ```
   python3 -c "import json; c=json.load(open('Jhonny/data/CommonEvents.json'))[19]; lst=c['list']; names=[cmd['parameters'][0] for cmd in lst if cmd['code']==246]; assert len(set(names)) >= 2, f'expected >=2 distinct ME names, got {names}'; print('Audit E OK')"
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

## Definition of Done

- [ ] First generator run prints "applied" x2.
- [ ] `python3 -m json.tool` validates the JSON.
- [ ] Second generator run prints "skipped" x2 with empty `git diff`.
- [ ] Audit D and E both print "OK".
- [ ] User confirms via Playtest: distinct audible ME on loss vs win.
- [ ] `fase2/fase-2-completa.md` written with audit outputs and Playtest
      scenario summary.
