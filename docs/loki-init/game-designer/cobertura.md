# Loki Init - Game Designer Inventory - Cobertura

Source index: [inventory.md](inventory.md)

## Cobertura

Inspecionado em detalhe:

- Docs duradouros catalogados da corrida.
- `System.json`: titulo, locale, resolucao, mapa inicial, switches 100-105 e
  variaveis 100-121.
- `CommonEvents.json`: CEs 3, 5, 6, 7, 10, 11, 12, 13, 16, 18 e 19, alem do
  mapa geral de Common Events 1-24.
- Command codes relevantes: `117` Call Common Event, `357` plugin command,
  `121` switches, `122` variaveis, `355` scripts inline e condicionais.

Apenas mapeado por inventario comum:

- Plugins ativos `TextPicture`, `ButtonPicture`, `Jhonny_RaceHelper`,
  `VisuMZ_0_CoreEngine` e `VisuMZ_2_VNPictureBusts`.
- Assets visuais `img/pictures/race/**`.

Nao inspecionado nesta passada:

- Mapas `MapXXX.json`, eventos de mapa chamadores, assets binarios, audio,
  saves, plugin files e engine source `js/rmmz_*.js`.
- `Roleta Paulista`, direcao de arte e pitch completo, porque nao estavam na
  lista de fontes read-only aprovada para este agente.
- Playtest, editor RPG Maker MZ, browser/NW.js, input real, audio e render.
