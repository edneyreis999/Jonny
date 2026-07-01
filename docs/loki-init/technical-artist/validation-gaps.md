# Loki Init - Technical Artist Inventory - Validation gaps

Source index: [inventory.md](inventory.md)

## Validation gaps

Required gates before declaring valid:

- `human-validation`: visual composition, readability, timing, animation feel,
  hover states, input hitboxes, result screen, retry cleanup, cache behavior,
  frame pacing, flashes/shake comfort and Curva do Diabo presentation.
- RPG Maker MZ Playtest/debug pass: capture active pictures, positions, tint,
  switch/variable state, current Common Event/interpreter, plugin state and
  retry path.
- Asset technical pass: dimensions, transparency, file size, color profile,
  texture memory estimate, duplicate/unused assets and naming/case-sensitivity.
- Plugin technical pass if behavior matters: `TextPicture`, `ButtonPicture`,
  `Jhonny_RaceHelper`, `VisuMZ_0_CoreEngine` and `VisuMZ_2_VNPictureBusts`
  source/semantics.
- Editor/runtime validation: JSON parse is not proof that RPG Maker editor state
  or browser/NW.js rendering behavior is valid.
