# Loki Init - Gameplay Engineer Inventory - Save/load implications

Source index: [inventory.md](inventory.md)

## Save/load implications

Fatos estaticos:

- `System.json` tem `optAutosave: true`.
- A corrida usa switches e variaveis globais do jogo (`SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `VAR_SCENE_INDEX`, `VAR_CONSCIENCIA`, `VAR_PONTOS_GLORIA`, `VAR_TIMER_FRAMES`, etc.).
- Pictures, audio, reservations de Common Event, estado do helper em `Scene_Map` e input transient aparecem como superficies runtime.
- Nenhum save file, `DataManager`, `StorageManager`, `makeSaveContents` ou `extractSaveContents` foi lido neste envelope.

Implicacoes:

- Se o jogador salvar/autosave durante corrida, tela de resultado, input lock, crash ou transicao, ha risco estatico de restaurar estado intermediario sem que pictures/audio/reservations/transient plugin state estejam coerentes.
- `SW_RACE_ACTIVE` e `SW_INPUT_LOCKED` sao superficies criticas: restaurar com locks ligados pode bloquear input; restaurar com corrida ativa pode religar CEs paralelos no meio do fluxo.
- `VAR_ATTEMPT_N`, `VAR_SEED`, `VAR_SCENE_INDEX`, `VAR_LAST_RENDERED_INDEX`, `VAR_VITORIA_PASSOU` e `VAR_GLORIA_META` precisam de smoke matrix antes de qualquer mudanca de save/load.

Validacao pendente:

- Testar title/continue, antes de escolha, durante timer, durante resultado, apos derrota, apos vitoria e apos transfer.
- Confirmar engine source local de save/load em uma futura `loki:tech-analysis` se compatibilidade de saves virar requisito.
