# Loki Init - Technical Artist Inventory - Findings

Source index: [inventory.md](inventory.md)

## Findings

- `picture`: Race picture references in inspected Common Events all resolve to
  listed `img/pictures/race/*.png` files.
- `ui-art-state`: TextPicture IDs 52-63 and image IDs 51, 58-59 form a
  substantial HUD/result layer that needs a picture-ID reservation map before
  future expansion.
- `vfx`: Static Common Events use tint and one shake command; no Show Animation
  command was found in `CommonEvents.json`.
- `atlas`: No atlas packing surface was found in authorized sources. Assets are
  loose RPG Maker image files.
- `memory`: Texture cost cannot be measured from listing-only assets; full-screen
  estimates remain hypothetical and require dimensions.
- `visual-performance`: CE3 preload warms race pictures manually; runtime hitch
  behavior is pending Playtest.
- `asset-runtime`: `ButtonPicture` connects button artwork to CE11/CE12 through
  picture metadata scripts in CE8/CE9.
- `open-question`: Why are `overlay_flash_white` and `!opala_pov` listed but not
  referenced by inspected Common Events?
- `open-question`: Are risk overlays IDs 22-24 intentionally disabled, or is
  hover feedback incomplete?
- `open-question`: Should `curva_do_diabo_placa` appear only in the future
  Curva do Diabo state, and if so where is the runtime condition enforced?
