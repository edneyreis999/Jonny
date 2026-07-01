# Loki Init - Technical Artist Inventory - Plugin ownership

Source index: [inventory.md](inventory.md)

## Plugin ownership

Active plugins from structured parse of `Jhonny/js/plugins.js`:

| Order | Plugin | Technical art relevance |
| ---: | --- | --- |
| 1 | `TextPicture` | Generates text as pictures for HUD/result/counter surfaces. |
| 2 | `ButtonPicture` | Makes picture buttons clickable; button art is runtime input surface. |
| 3 | `Jhonny_RaceHelper` | Helper/logging and race utilities; `EnableDebugLogs` is `true`. |
| 4 | `VisuMZ_0_CoreEngine` | `AntiZoomPictures=true`, `SubfolderParse=true`, `ImgLoad` only preloads `system` Balloon/IconSet by parameter. |
| 5 | `VisuMZ_2_VNPictureBusts` | VN bust tone/scale states, default scale 90%, anchor 0.5/0.95. |

Static risk: race picture preload is implemented in CE3, not in the VisuMZ
`ImgLoad` parameter. Any future preload/cache change crosses Common Events,
plugin parameters and runtime visual validation.
