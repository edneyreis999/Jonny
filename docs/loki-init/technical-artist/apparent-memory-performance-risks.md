# Loki Init - Technical Artist Inventory - Apparent memory/performance risks

Source index: [inventory.md](inventory.md)

## Apparent memory/performance risks

These are static risk flags, not measured performance claims:

- The game runs at screen/UI 1280x720. If race backgrounds or overlays are
  full-screen, each visible full-screen RGBA texture can occupy about 3.5 MiB
  uncompressed (`1280 * 720 * 4`) before renderer overhead. Actual dimensions
  were not read because only `img/**` listings were authorized.
- CE3 preloads 16 race picture references with `Show Picture -> Wait 1 -> Erase`
  on picture ID 1. This is a deliberate cache-warming pattern but needs runtime
  validation for hitching and retry behavior.
- The same surface mixes bitmap PNGs and runtime-generated TextPictures.
  Generated TextPictures can create additional texture/cache churn depending on
  plugin behavior; plugin source was not read in this envelope.
- Picture cleanup uses broad ranges (`1..63`) in CE18/CE19. This is safe-looking
  as cleanup intent but can erase unrelated presentation if future features use
  overlapping IDs without a reservation registry.
- `overlay_risk_low/med/high` are preloaded but not shown by inspected
  `Show Picture` commands; CE16 erases IDs 22-24. The intended hover overlay
  pipeline appears incomplete or implemented outside inspected sources.
- `timer_bar` is preloaded but inspected HUD uses TextPicture `TIMER: \V[120]s`
  rather than an image bar. This conflicts with the doc intent of a horizontal
  timer bar unless implemented elsewhere.
- `curva_do_diabo_placa` is shown by CE9 `EV_RenderCurva` for curva scenes in
  inspected data. Static inventory did not prove the conditional gating that
  limits it to Curva do Diabo only.
