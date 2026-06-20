---
status: pending
phase: 1
task_id: 1.1
---

# Task 1.1 — Snapshot State and Locate CE Targets

## Objective

Capture the current state of `Jhonny_RaceHelper.js`, `System.json`, and
`CommonEvents.json` so subsequent tasks in Phase 1 can write patches against
verified Editor IDs, CE indices, and existing command structure.

## Dependencies

None. This is the first task of the round.

## References

- Implementation Guide section "Fix — Three-Coordinated-Changes"
- Implementation Guide appendix "Pre-Implementation Discovery Commands"
- RMMZ Editor IDs (from spec `Corrida - Core Loop.md` §13.2):
  - Variables: 100 VAR_RACE_ID, 105 VAR_PONTOS_GLORIA, 111 VAR_RACE_N_CENAS,
    113 VAR_LAST_RENDERED_INDEX, 116 VAR_TIMER_TIMEOUT_FLAG, 117 VAR_VITORIA_PASSOU
  - Switches: 100 SW_RACE_ACTIVE, 101 SW_INPUT_LOCKED, 104 SW_PAUSED
- Common Events (from spec §13.3): CE 5 EV_RaceOrchestrator, CE 18 EV_Crash,
  CE 19 EV_VitoriaCorrida. Timer and Safe-resolution CEs need to be located.

## Step-by-step

1. Read `Jhonny/js/plugins/Jhonny_RaceHelper.js` end-to-end (193 lines).
   Anchor the read with:
   `rg -n "THRESHOLDS|threshold|isVictory|JhonnyRace|playBgm|playMe|CONSCIENCIA|GLORIA|TAXA|VITORIA|DERROTA" Jhonny/js/plugins/Jhonny_RaceHelper.js`
2. Snapshot System.json slice (variables and switches):
   ```
   python3 -c "import json; s=json.load(open('Jhonny/data/System.json')); print('VARS 95-120:'); [print(f'  {i}: {s[\"variables\"][i]!r}') for i in range(95,120)]; print('SWITCHES 95-110:'); [print(f'  {i}: {s[\"switches\"][i]!r}') for i in range(95,110)]"
   ```
3. Confirm CE names, triggers, switch owners, and command counts for indices 5, 7, 18, 19 and scan all
   slots for parallel CEs named like `EV_RaceTimer`, `EV_ResolucaoSafe`,
   `EV_TimeoutPath`, `EV_UpdateHud`:
   ```
   python3 -c "import json; c=json.load(open('Jhonny/data/CommonEvents.json')); [print(f'CE[{i}] {c[i].get(\"name\")!r} trigger={c[i].get(\"trigger\")} switch={c[i].get(\"switchId\")} cmds={len(c[i].get(\"list\",[]))}') for i in range(len(c)) if c[i]]"
   ```
4. Dump CE 19 (EV_VitoriaCorrida), CE 5 (EV_RaceOrchestrator), CE 7
   (renderer/parallel owner), CE 10 (timer), CE 11/12 (Safe/Risk handlers),
   and CE 18 (EV_Crash)
   to a temporary text summary (one line per command: index, code, indent,
   parameters). Save the summaries inside `fase1/` as `ce19-dump.txt`,
   `ce5-dump.txt`, `ce7-dump.txt`, `ce10-dump.txt`, `ce11-dump.txt`,
   `ce12-dump.txt`, `ce18-dump.txt`. These are scratch artifacts the next task
   consumes.
5. Locate the timer CE: search for any CE that performs
   ` VAR_TIMER_FRAMES -= 1` (variable Editor ID 108). Record its CE index.
6. Locate the Safe-resolution CE: search for any CE that performs
   `VAR_PONTOS_GLORIA += 10` or `+= 10` near a Safe/Risk branch. Record its CE index.
7. Write a one-page findings summary at `fase1/findings.md` with:
   - Plugin structure (functions exposed, helpers, constants).
   - Timer CE index + name.
   - Safe-resolution CE index + name.
   - Which parallel CE calls CE 19 and which switch keeps that owner alive.
   - Readers/writers of SW_RACE_ACTIVE, SW_INPUT_LOCKED, and SW_PAUSED in the
     CEs touched by this phase.
   - Confirmed Editor IDs from step 2.
   - Current top-of-list commands of CE 19 (so task 1.2 knows where to insert).

## visual_validation

This is a discovery task — no game-visible change. The "validation" is the
existence of `fase1/findings.md` with non-empty sections for every item in
step 7. Subsequent tasks will fail fast if this artifact is missing.

## Definition of Done

- [ ] `Jhonny_RaceHelper.js` read end-to-end.
- [ ] System.json snapshot produced; every referenced Editor ID is named
      (no empty strings in the 95-120 / 95-110 ranges used by the round).
- [ ] CE index listing produced; timer CE and Safe-resolution CE indices
      identified and recorded.
- [ ] CE 5/7/10/11/12/18/19 dumps written under `fase1/`.
- [ ] `fase1/findings.md` exists with all sections filled.
- [ ] `fase1/findings.md` identifies the CE 19 parallel owner and the
      switch/lock readers relevant to the ceremony screen.
- [ ] No edits made to runtime files (`data/*.json`, `js/plugins/*.js`).
