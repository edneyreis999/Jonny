# Loki Init - Technical Artist Inventory - Mapa de localizacao

Source index: [inventory.md](inventory.md)

## Mapa de localizacao

| Superficie | Onde procurar |
| --- | --- |
| Assets visuais gerais | `Jhonny/img/<familia>/` |
| Assets de corrida | `Jhonny/img/pictures/race/` |
| Referencias asset-runtime da corrida | `Jhonny/data/CommonEvents.json`, CEs 3, 5-9, 14-16, 18-19 |
| Picture IDs de corrida | `CommonEvents.json` comandos `231`, `235` e scripts que apagam `1..63` |
| TextPictures e UI textual | Plugin commands `TextPicture set` nos CEs 5, 6, 8, 9 e 19 |
| Click/tap de pictures | Plugin `ButtonPicture` ativo e scripts `mzkp_commonEventId` nos CEs 8 e 9 |
| Bust/VN picture states | Plugin commands `VisuMZ_2_VNPictureBusts` nos CEs 20-23 |
| Resolucao alvo | `System.json`: screen/UI 1280x720 |
