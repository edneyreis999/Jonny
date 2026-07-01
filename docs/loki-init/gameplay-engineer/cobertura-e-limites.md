# Loki Init - Gameplay Engineer Inventory - Cobertura e limites

Source index: [inventory.md](inventory.md)

## Cobertura e limites

Inspecionado em detalhe:

- `System.json` para `gameTitle`, locale, resolucao, start map, autosave, switches e variaveis de corrida.
- `CommonEvents.json` para CEs de corrida, chamadas `code:117`, comandos de plugin `code:357`, scripts inline, pictures, audio, transfers e labels.
- `plugins.js` para ordem e parametros dos plugins ativos.
- `Jhonny_RaceHelper.js` para API global, input mapping, debug logging, thresholds e patch em `Scene_Map`.

Apenas mapeado:

- `MapInfos.json` lista mapas, mas nao prova quais map events chamam a corrida porque `MapXXX.json` nao estava no envelope de fontes.
- Assets referenciados por pictures foram identificados pelos nomes em Common Events, mas existencia/dimensoes nao foram auditadas neste agente.

Nao lido por escopo:

- `Jhonny/data/MapXXX.json`, `Jhonny/js/rmmz_*.js`, saves, assets binarios, audio real e docs fora da lista permitida.
- `Jhonny/CLAUDE.md`/`AGENTS.md`; o envelope desta chamada restringiu as fontes read-only a uma lista explicita.
