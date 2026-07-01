# Runtime QA Inventory - Coverage And Limits

Source index: [inventory.md](inventory.md)

## Coverage And Limits

Inspected in detail:

- Runtime QA contract.
- Durable race runtime and debug docs.
- `System.json` fields relevant to visible runtime and save/load.
- Focused Common Event command summaries for race CEs.
- Active plugin order and race/helper plugin integration surfaces.
- Race picture file presence.
- Race audio cue file presence.
- Engine save/load and input semantics relevant to QA ownership.

Mapped only:

- `MapInfos.json` map list.
- Existing save file presence.
- VisuMZ plugin parameters relevant to input/debug/presentation.

Not inspected:

- Full `docs/index.xml` content beyond context already provided by common
  inventory.
- Full map event graphs and transfers.
- All database JSON files.
- Full vendor plugin internals.
- Binary asset dimensions, audio duration/format validation and image
  dimensions.
- Save file contents.
- Runtime/editor behavior.
