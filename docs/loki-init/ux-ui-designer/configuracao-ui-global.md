# Loki Init - UX/UI Designer Inventory - Configuracao UI Global

Source index: [inventory.md](inventory.md)

## Configuracao UI Global

Fatos observados em `System.json`:

- Titulo do jogo: `Bye Bye Jhonny`.
- Locale: `pt_BR`.
- Resolucao e area de UI: `1280x720`.
- Fonte principal e numerica: `JollyLodger-Regular.ttf`; fallback:
  `Verdana, sans-serif`.
- `fontSize`: `48`.
- `windowOpacity`: `192`.
- `picturesUpperLimit`: `100`.
- `optDrawTitle`: `true`; `title1Name` e `title2Name` vazios.
- Termos de menu/save/load em portugues incluem `Novo Jogo`, `Continuar`,
  `Salvar`, `Opcoes`, `Salvar em qual arquivo?`, `Carregar qual arquivo?`,
  `Arquivo`, `Autossalvar` e `Toque UI`.

Fatos observados em `plugins.js`:

- `TextPicture` ativo para texto renderizado como picture.
- `ButtonPicture` ativo para pictures clicaveis.
- `Jhonny_RaceHelper` ativo com `EnableDebugLogs: true`; descricao declara
  helpers para RNG, clamp, W/S/A/D e logger, mas o arquivo do plugin nao foi
  lido neste envelope.
- `VisuMZ_0_CoreEngine` ativo. Parametros relevantes: `ModernControls: true`,
  `ShowButtons: true`, `SideButtons: true`, `RightMenus: true`,
  `ButtonHeight: 52`, `BackOpacity: 192`, `LineHeight: 36`,
  `ShowScrollBar: true`.
- `VisuMZ_2_VNPictureBusts` ativo com escala `90%`, anchor `0.5/0.95`,
  `ScreenX` centralizado com buffer lateral de 200 px e `ScreenY` no rodape.

Limite: plugin files nao foram inspecionados; sem engine/runtime nao ha prova
de renderizacao efetiva, foco, clique, hover, layout, contraste ou leitura.
