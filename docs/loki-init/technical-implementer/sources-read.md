# Technical Implementer Inventory - Sources Read

Source index: [inventory.md](inventory.md)

## Sources Read

- `docs/loki-init/project-inventory.md`
- `docs/loki-init/technology-context.md`
- `docs/index.xml`
- `docs/02-Core-Loop/Corrida - Runtime e Eventos.md`
- `docs/03-Tech/RPG Maker MZ - Scripts de Plano.md`
- `Jhonny/CLAUDE.md`
- `Jhonny/package.json`
- `Jhonny/index.html`
- `Jhonny/js/main.js`
- `Jhonny/data/System.json`
- `Jhonny/data/CommonEvents.json`
- `Jhonny/data/MapInfos.json`
- `Jhonny/js/plugins.js`
- `Jhonny/js/plugins/Jhonny_RaceHelper.js`
- `/Users/edney/projects/coreto/loki-framework/docs/loki-init-inventory-contracts.md`

Structured inspection commands used read-only:

- `jq` over `Jhonny/package.json`, `Jhonny/data/System.json`,
  `Jhonny/data/CommonEvents.json`, and `Jhonny/data/MapInfos.json`.
- Node `vm` parsing of `Jhonny/js/plugins.js` to extract `$plugins` without
  editing the generated file.
- `find`, `grep`, and `sed` for local source discovery and excerpts.
