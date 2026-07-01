# Loki Init - Game Designer Inventory - Feedback inventariado

Source index: [inventory.md](inventory.md)

## Feedback inventariado

Feedback documentado:

- Barra de Consciência sempre visivel no topo durante a corrida.
- Timer como barra horizontal fina ou texto/HUD, conforme evolucao do runtime.
- Hover em risk deve mostrar custo visual em niveis discretos, sem revelar
  numero exato de `P_cena`.
- Safe possui feedback visual/sonoro leve; risk sucesso possui aceleracao e
  custo de Consciência; crash possui shake/fade/ME.
- Tela de resultado usa VITORIA/DERROTA, Pontos de Gloria e prompt de
  confirmacao.

Feedback implementado em eventos:

- CE6 `EV_UpdateHud` cria TextPictures para `GLORY: \V[105]/\V[119]`,
  `TRIAL \V[112]`, `\V[104]%`, `TIMER: \V[120]s` e `\V[121]/\V[111]`.
- CE16 `EV_HoverRiskButton` zera `VAR_HOVER_LEVEL` e apaga pictures 22-24.
- CE19 usa TextPictures em ingles: `VICTORY!`, `DEFEAT!`,
  `Glory Score: \V[105]` e `Press [SPACE] to continue`.
- CE5, CE11, CE12, CE18 e CE19 invocam `Jhonny_RaceHelper.logRaceEvent` para
  eventos de debug/telemetria local.

Pendente de Playtest:

- Legibilidade do HUD, fit de texto, idioma misto PT/EN, timing de feedback,
  audio real, hover real, input real e clareza da tela de resultado.
