## markdown

## status: complete_structural_pending_playtest

<task_context>
<domain>rpg-maker-mz/data-json/maps</domain>
<type>integration</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-1.1</dependencies>
<prd_ref>../analise-integracao-corrida-dialogo.md</prd_ref>
<techspec_ref>./tasks.md</techspec_ref>
</task_context>

# Task 2.2: Wire Map005 Race 2 Entry

## Source References

- Technical analysis: [Entry Points Identified](../analise-integracao-corrida-dialogo.md#pontos-de-entrada-identificados)
- User correction: `Map005` should start `RACE_ID = 2`
- Target file: `Jhonny/data/Map005.json`
- Target event/page: `EV001`, page 3
- Current command evidence: commands `104-105` set `VAR_RACE_ID = 2` and transfer to `Map013`
- Required behavior: keep `VAR_RACE_ID = 2` and transfer to `Map001`

## Overview

Update the confirmed `Map005` race marker so it sends the player into the isolated race minigame as Race 2.

<requirements>
- Create a saved Python mutation script at `builds/fase2/02_wire_map005_race2_entry.py`.
- Assert the current command pattern before changing it.
- Preserve the existing `VAR_RACE_ID = 2` assignment.
- Change only the target transfer destination from `Map013` to `Map001`.
- Do not change unrelated dialogue commands.
</requirements>

## Dependencies

- task-1.1

## Subtasks

- [x] Load `Map005.json` in the script and locate `EV001`, page 3.
- [x] Assert that the current marker contains `VAR_RACE_ID = 2`.
- [x] Assert that the following transfer currently targets `Map013`.
- [x] Patch the transfer command to target `Map001`.
- [x] Re-read and print the updated command summary.
- [x] Record script output in `interaction/fase2/`.

## Implementation Details

Do not use the older typo that described `Map005` as `RACE_ID = 5`. The corrected and confirmed value is `RACE_ID = 2`.

Expected mutation:

```text
Map005 EV001 page 3:
  keep Control Variables: VAR_RACE_ID = 2
  change Transfer Player destination: Map013 -> Map001
```

## visual_validation

In RPG Maker MZ Playtest:

- Start from the normal route that reaches the `Map005` marker.
- Trigger the marker described by comment `## Comentario 2`.
- The player should transfer to `Map001`.
- Race 2 should start and the player should remain on the race map instead of continuing directly to `Map013`.

## Success Criteria

- [x] `Map005.json` parses after the script runs.
- [x] `VAR_RACE_ID = 2` remains intact.
- [x] The marker transfers to `Map001`.
- [x] No unrelated commands in `EV001` are changed.
- [ ] User confirms `visual_validation` in RPG Maker MZ Playtest.

## Execution Notes

- Mutation script: `builds/fase2/02_wire_map005_race2_entry.py`.
- Execution log: `interaction/fase2/02_wire_map005_race2_entry.log`.
- Updated command `105` from transfer parameters `[0, 13, 4, 5, 0, 0]` to `[0, 1, 4, 5, 0, 0]`.

## Out of Scope

- Do not modify `Map010`.
- Do not modify `Map013`.
- Do not implement post-victory routing.
