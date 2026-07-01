# Loki Init - UX/UI Designer Inventory - Mapa De Localizacao

Source index: [inventory.md](inventory.md)

## Mapa De Localizacao

| Superficie | Fonte principal | Observacao |
| --- | --- | --- |
| Resolucao, fonte, termos de menu/save/load | `Jhonny/data/System.json` | `advanced`, `terms.commands`, `terms.messages`. |
| Fluxo da corrida e intencao de HUD | `docs/02-Core-Loop/Corrida - Core Loop.md` | Spec de UI e feedback; contem itens marcados `[PLAYTEST]`. |
| Contrato runtime de input/resultado | `docs/02-Core-Loop/Corrida - Runtime e Eventos.md` | Define `SW_INPUT_LOCKED`, tela de resultado e gates. |
| HUD, botoes, TextPicture, timer e resultado implementados | `Jhonny/data/CommonEvents.json` | CEs 5-19 concentram a UI da corrida. |
| Plugins ativos que afetam UI | `Jhonny/js/plugins.js` | `TextPicture`, `ButtonPicture`, `VisuMZ_0_CoreEngine`, `VisuMZ_2_VNPictureBusts`. |
| Validacao perceptiva | `docs/03-Tech/RPG Maker MZ - Debug Playtest.md` | Playtest humano e gate final para UI, input, audio, pictures e CEs. |
