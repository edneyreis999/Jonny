# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is an **RPG Maker MZ game project** called "Jhonny". It is a complete game with its own engine, assets, and data files that can be deployed as a standalone application or web game.

## Running the game

To test changes during development, open `index.html` in a web browser. For full playtesting with save/load functionality, run through a local server:
```bash
# Python 3
python3 -m http.server 8000
# Then open http://localhost:8000

# Node.js (with npx)
npx serve .
# Then open the URL shown in terminal
```

The game can also be deployed as an Electron/NW.js desktop app using `package.json`.

## Architecture

### Script Loading Pipeline (`main.js`)

Scripts load in strict order:
1. **Libraries**: pixi.js (rendering), pako (compression), localforage (storage), effekseer (effects), vorbisdecoder (audio)
2. **Core Engine**: `rmmz_core.js` → `rmmz_managers.js` → `rmmz_objects.js` → `rmmz_scenes.js` → `rmmz_sprites.js` → `rmmz_windows.js`
3. **Plugins**: `plugins.js` (generated, lists active plugins)
4. **Bootstrap**: `SceneManager.run(Scene_Boot)` starts the game

### RPG Maker MZ Core Structure

The engine is split into modular files:

- **rmmz_core.js**: Base classes (`Utils`, `AudioManager`, `ImageManager`, `SceneManager`, `StorageManager`)
- **rmmz_managers.js**: Game state managers (`DataManager`, `BattleManager`, `PluginManager`, etc.)
- **rmmz_objects.js**: Game logic objects (`Game_Actor`, `Game_Enemy`, `Game_Event`, `Game_Map`, etc.)
- **rmmz_scenes.js**: Scene controllers (`Scene_Map`, `Scene_Battle`, `Scene_Menu`, etc.)
- **rmmz_sprites.js**: Visual representations (`Sprite_Character`, `Sprite_Battler`, etc.)
- **rmmz_windows.js**: UI components (`Window_Base`, `Window_Command`, `Window_Message`, etc.)

### Data Layer (`data/*.json`)

Game data is stored as JSON files that define:
- **Actors**: Player characters with stats, equipment, skills
- **Classes**: Character class templates (growth rates, learned skills)
- **Skills, Items, Weapons, Armors**: Database entries with effects and pricing
- **Enemies**: Monster stats, drop tables, action patterns
- **Troops**: Enemy groups for battle formations
- **Maps**: Map data (Map001.json, etc.) with tile placement and events
- **System**: Global game settings, terms, UI preferences
- **CommonEvents**: Reusable event scripts
- **States**: Status effects (poison, sleep, etc.)
- **Animations**: Visual effect sequences
- **Tilesets**: Tile graphics and passability settings

**Important**: JSON files are read-only at runtime. Never modify these files directly while the game is running.

### Plugin System (`js/plugins/`)

Plugins extend or override core functionality. Each plugin is an IIFE that patches prototype methods or adds new classes. The project includes official plugins:
- **AltMenuScreen.js**: Changes menu layout (commands top, status bottom)
- **AltSaveScreen.js**: Custom save/load screen
- **ButtonPicture.js**: Picture-based button handling
- **TextPicture.js**: Display text in pictures

To add a plugin:
1. Place `.js` file in `js/plugins/`
2. Register in `plugins.js` (or use RPG Maker MZ editor to manage)
3. Follow RPG Maker MZ plugin format with `@target MZ`, `@plugindesc`, `@help` tags

### Localization

The game uses **Portuguese (pt_BR)** locale. All UI strings, database entries, and messages should be in Portuguese. Translation keys are in `System.json` under `terms` and `messages`.

### Development Plans (`planos/`)

The `planos/` directory contains development plans and prototypes. Each plan folder (e.g., `001-prototipo-core-loop`) may contain:
- Design documents
- Prototype code
- Test scenarios
- Implementation notes

## File Modification Guidelines

### When modifying core engine files (`rmmz_*.js`):
- Use prototype patching, not direct class replacement
- Preserve backward compatibility with save files
- Test both in browser and desktop deployment
- Document breaking changes

### When editing data files (`data/*.json`):
- Use RPG Maker MZ editor for database changes (actors, items, skills, etc.)
- For automated edits, validate JSON structure before committing
- Map files (Map*.json) have complex structure—prefer editor tools

### When writing plugins:
- Never directly modify `rmmz_*.js` files—use plugins instead
- Use strict mode and wrap in IIFE
- Provide `@help` documentation in both English and Japanese
- Support plugin parameters for user configuration
- Check for method existence before patching (plugin compatibility)

## Game Configuration

Key settings in `System.json`:
- **Resolution**: 816×624 (default RPG Maker MZ)
- **Window Opacity**: 192 (semi-transparent windows)
- **Battle System**: 0 (front-view, not side-view)
- **Autosave**: Enabled
- **Start Position**: Map 1, coordinates (8, 6)

## Asset Structure

- `audio/`: BGM, BGS, ME, SE audio files
- `img/`: Character sprites, battlebacks, pictures, system graphics
- `fonts/`: Custom font files (mplus-2p-bold-sub.woff, mplus-1m-regular.woff)
- `css/`: game.css for web deployment styling
- `movies/`: OGV format cutscene videos
- `effects/`: Effekseer effect files (.efkfmt)
