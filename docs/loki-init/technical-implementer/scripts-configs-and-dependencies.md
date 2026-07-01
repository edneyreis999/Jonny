# Technical Implementer Inventory - Scripts, Configs, And Dependencies

Source index: [inventory.md](inventory.md)

## Scripts, Configs, And Dependencies

Configuration surfaces:

- `Jhonny/package.json`: app shell metadata only; no package scripts or npm
  dependency declarations.
- `Jhonny/js/plugins.js`: generated RPG Maker plugin activation list. The file
  itself states it should not be edited directly.
- `Jhonny/data/System.json`: engine, locale, UI, variables, switches, and start
  position configuration.
- `Jhonny/data/CommonEvents.json`: event-command runtime behavior.

Historical scripts found under `Jhonny/planos/**` include Python builders and
mutators such as:

- `build_phase3_ces.py`
- `build_phase4_ces.py`
- `setup_phase4_system.py`
- `apply_task_5_6.py`
- `build_phase5_ces.py`
- `inject_debug_logs.py`
- `inject_debug_logs_v2.py`
- `remove_debug_logs.py`
- `setup_phase5_system.py`
- `build_phase6_ces.py`
- `setup_phase6_system.py`
- `build_phase7_ces.py`
- `build_phase1_ces.py`
- `build_phase2_ces.py`
- `apply_joices_phase1.py`
- `01_find_player_name_refs.py`
- `02_standardize_player_speaker_to_chance.py`

Per `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md`, these scripts are
historical evidence by default. They must not be treated as current
re-runnable tools without preflight, structured comparison against current
state, and explicit approval.
