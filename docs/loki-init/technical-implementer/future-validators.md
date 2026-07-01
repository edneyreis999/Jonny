# Technical Implementer Inventory - Future Validators

Source index: [inventory.md](inventory.md)

## Future Validators

Use the smallest validator set matching the future change:

- Documentation-only change:
  - Confirm writes are inside approved docs or plan paths.
  - Review rendered Markdown/frontmatter if the note is user-facing in
    Obsidian.
- `data/*.json` change:
  - Load `loki-rpg-maker-mz-data-json`.
  - Parse target JSON before and after.
  - Confirm IDs and names in `System.json`.
  - Confirm event command semantics in local `rmmz_objects.js`.
  - Review a restricted diff for only approved IDs/commands.
  - Require Playtest for behavior.
- Plugin change:
  - Load `loki-rpg-maker-mz-plugin-workflow`.
  - Validate metadata, plugin command registration, and activation surface.
  - Run `node -c` on edited plugin files.
  - Review `plugins.js` activation if affected.
  - Require Playtest for behavior.
- Historical script reuse:
  - Classify script as read-only audit, validator, mutator, generator, or
    cleanup/debug.
  - Reconstruct historical intent with Git and same-phase task/retro docs.
  - Compare intended changes to current state using structured parsing.
  - Do not run mutators without approval.
- Runtime defect or perceptible behavior:
  - Use `docs/03-Tech/RPG Maker MZ - Debug Playtest.md`.
  - Collect minimum Playtest snapshot before editing.
  - Require human validation.
