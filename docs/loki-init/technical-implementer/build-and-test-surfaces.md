# Technical Implementer Inventory - Build And Test Surfaces

Source index: [inventory.md](inventory.md)

## Build And Test Surfaces

Current local build/test surfaces identified:

- Open `Jhonny/index.html` in a browser for basic game launch.
- For full playtesting with save/load, run a local server from `Jhonny/`, for
  example `python3 -m http.server 8000` or `npx serve .`.
- For plugin syntax after future plugin edits, `node -c` is an appropriate
  JavaScript syntax check.
- For data JSON after future JSON edits, parse with `jq` or another JSON
  parser and review a restricted diff.
- For RPG Maker runtime behavior, Playtest and human validation remain the
  final gate.

No build, lint, unit test, or npm script surface is declared in
`Jhonny/package.json`.
