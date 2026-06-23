## markdown

## status: implemented_pending_playtest

<task_context>
<domain>rpg-maker-mz/data-json/maps</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>rpg_maker_mz_data_json</dependencies>
<prd_ref>../analise-integracao-corrida-dialogo.md</prd_ref>
<techspec_ref>./tasks.md</techspec_ref>
</task_context>

# Task 1.1: Audit and Patch Map001 Race Containment

## Source References

- Technical analysis: [Cause Root Confirmed](../analise-integracao-corrida-dialogo.md#causa-raiz-confirmada)
- Target file: `Jhonny/data/Map001.json`
- Target event: `Init Corrida`
- Current behavior: `Common Event 5 (EV_RaceOrchestrator)` followed by immediate `Transfer Player` on pages gated by `VAR_RACE_ID >= 1`, `>= 2`, and `>= 3`
- Data edit workflow: `rpg-maker-mz-data-json` skill, `references/workflow.md`

## Overview

Patch `Map001` so it starts or restarts the race loop without immediately transferring the player back to narrative maps. This makes `Map001` behave as an isolated minigame map.

<requirements>
- Create a saved Python mutation script at `builds/fase1/01_fix_map001_race_containment.py`.
- The script must assert the current `Init Corrida` event shape before mutating anything.
- Preserve the `Common Event 5 (EV_RaceOrchestrator)` calls.
- Remove only the immediate `Transfer Player` commands that run after `EV_RaceOrchestrator` inside the `Init Corrida` autorun pages.
- Re-read and validate `Map001.json` after writing.
- Do not edit `Map001.json` directly.
</requirements>

## Dependencies

- None.

## Subtasks

- [x] Read `Jhonny/CLAUDE.md` and the `rpg-maker-mz-data-json` workflow before touching data files.
- [x] Write `builds/fase1/01_fix_map001_race_containment.py`.
- [x] Assert that `Map001.json` contains the `Init Corrida` event with three relevant pages gated by `VAR_RACE_ID`.
- [x] Assert that the immediate transfer destinations are currently `Map005`, `Map013`, and `Map012`.
- [x] Remove only those immediate transfer commands while preserving command list terminators.
- [x] Execute the script and record the validation output in `interaction/fase1/`.
- [x] Re-open `Map001.json` through the script and print the post-patch command summary.
- [x] Add `Erase Event` after `EV_RaceOrchestrator` so the autorun init event does not repeatedly restart the race on the same map load.

## Implementation Notes

- `builds/fase1/01_fix_map001_race_containment.py` removed the immediate `Transfer Player` commands from `Init Corrida` pages 1, 2, and 3.
- `builds/fase1/02_add_map001_init_erase_event.py` inserted RPG Maker command `214` (`Erase Event`) after the CE5 call on those pages.
- `rmmz_objects.js` implements command `214` as `$gameMap.eraseEvent(this._eventId)` when the interpreter is on the current map, which makes this a map-load-local guard against repeated autorun initialization.
- Validation logs were saved in `interaction/fase1/01_fix_map001_race_containment.log` and `interaction/fase1/02_add_map001_init_erase_event.log`.
- Final `Init Corrida` command codes are `[117, 214, 0]` on each race page: `EV_RaceOrchestrator`, `Erase Event`, terminator.

## Implementation Details

Use structured JSON parsing, not text replacement. The script should fail loudly if the event name, page count, command codes, or transfer destinations differ from the analysis.

Recommended script checks:

```text
load Map001.json
find event named "Init Corrida"
for each page with VAR_RACE_ID condition:
  assert one Common Event command references CE5
  assert immediate Transfer Player command matches expected destination
  remove only that immediate Transfer Player command
assert every page command list ends with command code 0
write JSON
re-read JSON
print changed page indexes and removed destinations
```

## visual_validation

In RPG Maker MZ Playtest:

- Set `VAR_RACE_ID` to `1`, transfer the player to `Map001`, and confirm the race starts without immediately transferring to `Map005`.
- Repeat with `VAR_RACE_ID = 2` and confirm the player does not immediately transfer to `Map013`.
- Repeat with `VAR_RACE_ID = 3` and confirm the player does not immediately transfer to `Map012`.
- The race HUD/loop should become visible or active on `Map001`.

## Success Criteria

- [x] `Map001.json` parses after the script runs.
- [x] The `Init Corrida` pages still call `EV_RaceOrchestrator`.
- [x] The immediate post-start transfers are gone.
- [ ] Player remains on `Map001` during Playtest after race start.
- [ ] User confirms `visual_validation` in RPG Maker MZ Playtest.

## Out of Scope

- Do not update `Map010`, `Map005`, or `Map013`.
- Do not modify `CommonEvents.json`.
- Do not implement victory routing in this task.
