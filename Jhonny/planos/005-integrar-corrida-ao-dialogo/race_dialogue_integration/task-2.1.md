## markdown

## status: pending

<task_context>
<domain>rpg-maker-mz/data-json/maps</domain>
<type>integration</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-1.1</dependencies>
<prd_ref>../analise-integracao-corrida-dialogo.md</prd_ref>
<techspec_ref>./tasks.md</techspec_ref>
</task_context>

# Task 2.1: Wire Map010 Race 1 Entry

## Source References

- Technical analysis: [Entry Points Identified](../analise-integracao-corrida-dialogo.md#pontos-de-entrada-identificados)
- Target file: `Jhonny/data/Map010.json`
- Target event/page: `EV001`, page 2
- Current command evidence: commands `79-80` set `VAR_RACE_ID = 1` and transfer to `Map005`
- Required behavior: keep `VAR_RACE_ID = 1` and transfer to `Map001`

## Overview

Update the confirmed `Map010` race marker so it sends the player into the isolated race minigame as Race 1.

<requirements>
- Create a saved Python mutation script at `builds/fase2/01_wire_map010_race1_entry.py`.
- Assert the current command pattern before changing it.
- Preserve the existing `VAR_RACE_ID = 1` assignment.
- Change only the target transfer destination from `Map005` to `Map001`.
- Do not change unrelated dialogue commands.
</requirements>

## Dependencies

- task-1.1

## Subtasks

- [ ] Load `Map010.json` in the script and locate `EV001`, page 2.
- [ ] Assert that the current marker contains `VAR_RACE_ID = 1`.
- [ ] Assert that the following transfer currently targets `Map005`.
- [ ] Patch the transfer command to target `Map001`.
- [ ] Re-read and print the updated command summary.
- [ ] Record script output in `interaction/fase2/`.

## Implementation Details

The script must rely on command codes and parameters, not line numbers. Use the command indexes from the analysis as precondition hints, then verify the actual command shape from the JSON.

Expected mutation:

```text
Map010 EV001 page 2:
  keep Control Variables: VAR_RACE_ID = 1
  change Transfer Player destination: Map005 -> Map001
```

## visual_validation

In RPG Maker MZ Playtest:

- Start from the normal route that reaches the `Map010` marker.
- Trigger the marker described by comment `## Comentario 1`.
- The player should transfer to `Map001`.
- Race 1 should start and the player should remain on the race map instead of continuing directly to `Map005`.

## Success Criteria

- [ ] `Map010.json` parses after the script runs.
- [ ] `VAR_RACE_ID = 1` remains intact.
- [ ] The marker transfers to `Map001`.
- [ ] No unrelated commands in `EV001` are changed.
- [ ] User confirms `visual_validation` in RPG Maker MZ Playtest.

## Out of Scope

- Do not modify `Map005`.
- Do not modify `CommonEvents.json`.
- Do not implement post-victory routing.
