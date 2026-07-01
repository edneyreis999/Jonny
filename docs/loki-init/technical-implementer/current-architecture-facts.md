# Technical Implementer Inventory - Current Architecture Facts

Source index: [inventory.md](inventory.md)

## Current Architecture Facts

The consumer root is an AI-agent workspace and Obsidian vault, but the actual
game runtime identified for implementation work is `Jhonny/`.

`Jhonny/` is an RPG Maker MZ project. The static project signature includes:

- `Jhonny/game.rmmzproject`
- `Jhonny/index.html`
- `Jhonny/js/main.js`
- `Jhonny/js/rmmz_core.js`
- `Jhonny/js/rmmz_managers.js`
- `Jhonny/js/rmmz_objects.js`
- `Jhonny/js/rmmz_scenes.js`
- `Jhonny/js/rmmz_sprites.js`
- `Jhonny/js/rmmz_windows.js`
- `Jhonny/data/*.json`
- `Jhonny/js/plugins.js`
- `Jhonny/js/plugins/**`
- asset roots under `Jhonny/audio/`, `Jhonny/img/`, `Jhonny/fonts/`,
  `Jhonny/effects/`, and `Jhonny/movies/`.

The runtime bootstrap path is:

1. `Jhonny/index.html` loads `js/main.js`.
2. `js/main.js` loads library scripts: `pixi.js`, `pako.min.js`,
   `localforage.min.js`, `effekseer.min.js`, and `vorbisdecoder.js`.
3. `js/main.js` loads RPG Maker MZ core files:
   `rmmz_core.js`, `rmmz_managers.js`, `rmmz_objects.js`,
   `rmmz_scenes.js`, `rmmz_sprites.js`, and `rmmz_windows.js`.
4. `js/main.js` loads `js/plugins.js`.
5. When all scripts load, `PluginManager.setup($plugins)` runs.
6. After the Effekseer runtime initializes, `SceneManager.run(Scene_Boot)`
   starts the game.

`Jhonny/package.json` has no `scripts`, `dependencies`, or
`devDependencies` fields. It defines `main: "index.html"` and an NW.js style
window titled `Bye Bye Jhonny` with size `1280x720`.
