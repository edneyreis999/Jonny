# Runtime QA Inventory - Residual Risks

Source index: [inventory.md](inventory.md)

## Residual Risks

- Static event graphs can miss runtime ordering, interpreter lifecycle,
  reservation timing, frame timing, plugin patch behavior, map reload behavior
  and editor-specific acceptance.
- Result/retry behavior crosses parallel CEs, synchronous CE calls, switch
  lifecycle, input lock, plugin commands, pictures, audio and transfer paths.
- Save/load compatibility depends on persisted map/screen/timer/switch/variable
  state and cannot be inferred from file presence.
- Debug logs are enabled and VisuMZ debug/shortcut parameters are active; this
  is useful for development but remains a release-readiness review item.
