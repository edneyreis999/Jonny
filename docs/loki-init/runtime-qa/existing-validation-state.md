# Runtime QA Inventory - Existing Validation State

Source index: [inventory.md](inventory.md)

## Existing Validation State

Documented gates already exist:

- `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` states that Playtest is
  required when engine, input, pictures, audio, helper plugin or Common Events
  are affected.
- `docs/03-Tech/RPG Maker MZ - Debug Playtest.md` states that human Playtest is
  the final gate for visual behavior, input, audio, pictures, plugins and
  Common Events.
- The debug doc defines the minimum snapshot for black screen or stuck flow:
  map and player position, active event, pictures, opacity/tint/fade, race
  switches/variables, result variables/pictures, interpreter state, event
  reservation and plugin activation.

Validation not performed by this agent:

- No RPG Maker MZ Playtest.
- No browser/local server run.
- No save/load run.
- No input, pointer, audio, picture or plugin-command runtime observation.
- No editor acceptance check for Common Events.
- No full map event reachability audit.
