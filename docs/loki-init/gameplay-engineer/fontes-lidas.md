# Loki Init - Gameplay Engineer Inventory - Fontes lidas

Source index: [inventory.md](inventory.md)

## Fontes lidas

| Fonte | Uso | Evidencia |
| --- | --- | --- |
| `docs/loki-init/project-inventory.md` | Contexto comum e limites de escrita. | Docs e runtime Jhonny identificados; runtime sensivel somente leitura. |
| `docs/loki-init/technology-context.md` | Stack e skills candidatas. | `selected_project_type: game-dev`, RPG Maker MZ, plugins ativos e gates humanos. |
| `docs/index.xml` | Catalogo duravel. | Docs de corrida catalogados como prioridade alta; entrada de gameplay-engineer existente no catalogo. |
| `docs/02-Core-Loop/Corrida - Core Loop.md` | Spec mecanica e pseudo-codigo. | Loop safe/risk, RNG, thresholds, estado canonico e decisoes abertas. |
| `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Contrato runtime. | Invariantes de `SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `command117`, retry e tela de resultado. |
| `Jhonny/data/System.json` | IDs reais de switches/variaveis, start e autosave. | `parse-valid`; editor IDs 100-121 mapeados. |
| `Jhonny/data/CommonEvents.json` | Common Events e comandos da corrida. | `parse-valid`; grafo CE3, CE5-19 mapeado por command codes e scripts. |
| `Jhonny/data/MapInfos.json` | Lista estrutural de mapas. | `parse-valid`; 16 mapas nomeados, start map ID 11 `Prologo`. |
| `Jhonny/js/plugins.js` | Plugins ativos e parametros salvos. | Structured parse ok; 5 plugins ativos. |
| `Jhonny/js/plugins/Jhonny_RaceHelper.js` | Helper custom de corrida. | `node --check` sem erro; comandos/API mapeados estaticamente. |
| Package inventory contract | Contrato universal e `gameplay-engineer`. | Este arquivo cobre mecanicas implementadas, estado, runtime surfaces, callers, save/load, integracoes e fontes tecnicas. |
