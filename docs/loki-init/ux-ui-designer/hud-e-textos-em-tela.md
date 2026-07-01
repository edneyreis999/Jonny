# Loki Init - UX/UI Designer Inventory - HUD E Textos Em Tela

Source index: [inventory.md](inventory.md)

## HUD E Textos Em Tela

HUD implementado estaticamente:

- Barra de consciencia:
  - Picture 20 `race/bar_consciencia_bg`
  - Picture 21 `race/bar_consciencia_fill`
  - Picture 60 TextPicture `\V[104]%`
  - Atualizacao via `CE6 EV_UpdateHud`, com `picture(21).move(... scaleX =
    clamp(VAR_CONSCIENCIA))`.
- Ranking/glory:
  - Picture 51 `race/bg-ranking`
  - Picture 57 TextPicture `\FS[40]\C[15] GLORY: \V[105]/\V[119]`
- Tentativa:
  - Picture 52 TextPicture `TRIAL \V[112]`
- Timer:
  - Picture 62 TextPicture `\C[0]TIMER: \V[120]s`
- Progresso de cena:
  - Picture 63 TextPicture `\C[0]\V[121]/\V[111]`
- Valor de risco/tentacao:
  - `CE8` e `CE9` mostram TextPicture `\V[103]%` em Picture 61.

Static risk: a spec diz que `P_cena` nao deve ser mostrado numericamente e que
a tentacao deveria ser visual. O runtime observado mostra `\V[103]%` em cenas
de Sinal e Curva. Esse e um conflito factual entre design documentado e
CommonEvents atuais.
