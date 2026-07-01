# Technical Implementer Inventory - Fact And Inference Boundary

Source index: [inventory.md](inventory.md)

## Fact And Inference Boundary

Facts in this inventory come from local files and structured parsing listed in
`Sources Read`.

Inferences are limited to implementation routing:

- Because `Jhonny/` contains RPG Maker MZ signature files, future runtime work
  should treat `Jhonny/` as the project root.
- Because race behavior crosses `CommonEvents.json`, `plugins.js`, and
  `Jhonny_RaceHelper.js`, future race implementation work should route through
  both data JSON and plugin workflow checks when those surfaces are touched.
- Because `Jhonny/package.json` has no scripts or dependency declarations,
  there is no npm-based build/test surface evidenced by that file.

These inferences do not validate runtime behavior.
