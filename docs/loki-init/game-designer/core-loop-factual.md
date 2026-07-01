# Loki Init - Game Designer Inventory - Core loop factual

Source index: [inventory.md](inventory.md)

## Core loop factual

Evidencia estatica de design:

- A corrida e especificada como minigame roguelite timer-based de decisoes
  binarias, nao como steering racing.
- Unidade jogavel: cena com timer, tipo de cena, acao safe e acao risk.
- Tipos de cena documentados: `Sinal` e `Curva`.
- Safe documentado: `Parar` no sinal ou `Esquerda` na curva, sempre avanca,
  soma `+10` Consciência e soma `+10` Pontos de Gloria.
- Risk documentado: `Furar` no sinal ou `Direita` na curva, rola `0..99`
  contra `clamp(Consciência + P_cena, 0, 100)`, consome `P_cena`, avanca em
  sucesso e crasha em falha.
- `P_cena` documentado: valor por cena em `{0,10,20,...,100}`.
- Corridas documentadas: Lenda com 6 cenas, Rachadura com 8, Abismo com 10.
- Progressao documentada: vencer corrida atual avanca `VAR_RACE_ID`; derrota
  ou falha reinicia a mesma corrida.

Evidencia estatica implementada:

- `System.json` define `VAR_RACE_ID` em 100, `VAR_SCENE_INDEX` em 101,
  `VAR_SCENE_TYPE` em 102, `VAR_P_CENA` em 103, `VAR_CONSCIENCIA` em 104,
  `VAR_PONTOS_GLORIA` em 105, `VAR_TAXA_SUCESSO` em 106, `VAR_ROLL_RESULT` em
  107, `VAR_TIMER_FRAMES` em 108, `VAR_SEED` em 110, `VAR_RACE_N_CENAS` em
  111, `VAR_ATTEMPT_N` em 112, `VAR_VITORIA_PASSOU` em 117, `VAR_GLORIA_META`
  em 119, `VAR_TIMER_SECONDS` em 120 e `VAR_SCENE_DISPLAY` em 121.
- `System.json` define `SW_RACE_ACTIVE` em 100, `SW_INPUT_LOCKED` em 101,
  `SW_CRASH_FLAG` em 102, `SW_LAST_ACTION_SAFE` em 103, `SW_PAUSED` em 104 e
  `SW_IS_CURVA_DIABO` em 105.
- CE5 `EV_RaceOrchestrator` inicializa meta de Gloria por corrida, zera
  Consciência/Pontos/scene index, incrementa tentativa, gera seed e liga
  `SW_RACE_ACTIVE`.
- CE7 `EV_RaceRenderer` chama CE19 quando `VAR_SCENE_INDEX >=
  VAR_RACE_N_CENAS`, renderiza sinal/curva, define timer 240 frames para sinal
  e 210 frames para curva, e possui branch especial para corrida 3 cena 9 com
  `VAR_SCENE_TYPE=2`, `VAR_P_CENA=100` e `SW_IS_CURVA_DIABO=ON`.
- CE10 `EV_RaceTimer` decrementa `VAR_TIMER_FRAMES`; quando chega a zero,
  seta `VAR_TIMER_TIMEOUT_FLAG=1` e chama CE11 `EV_OnSafe`.
- CE11 `EV_OnSafe` aplica ganho de Consciência ate 100, soma `+10` Pontos de
  Gloria, seta ultima acao safe e avanca uma cena.
- CE12 `EV_OnRisk` calcula taxa, rola resultado, aplica custo de Consciência,
  soma `P_cena * 2` Pontos de Gloria em sucesso, avanca cena em sucesso e chama
  CE18 em falha.
- CE13 `EV_KeyInput` reserva CE11/CE12 por setas conforme tipo de cena quando
  `SW_INPUT_LOCKED` esta off.
- CE19 `EV_VitoriaCorrida` calcula vitoria por threshold 200/400/600 ou helper
  `window.JhonnyRace`, mostra texto de vitoria/derrota e decide progressao.

Inferencia de design:

- O jogo força uma economia de risco: safe e confiavel, mas sua pontuacao maxima
  documentada fica abaixo das metas atuais; risk e necessario para vencer.
- A profundidade pretendida vem da leitura de risco, da opacidade parcial de
  `P_cena` e do custo narrativo de gastar Consciência, nao de destreza de
  direcao veicular.
- O loop busca restart curto e iterativo: falhas devem devolver o jogador ao
  minigame da mesma corrida sem replay de VN.

Pendente de Playtest:

- Se a decisao safe/risk e clara sem mostrar `P_cena` numericamente.
- Se timers de 240/210 frames comunicam pressao sem parecer injustos.
- Se a necessidade matematica de risk para vencer e legivel e justa.
- Se restart, input por setas, feedback de hover e tela de resultado funcionam
  como experiencia perceptivel.
