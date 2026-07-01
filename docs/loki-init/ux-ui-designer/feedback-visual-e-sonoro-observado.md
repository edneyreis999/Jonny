# Loki Init - UX/UI Designer Inventory - Feedback Visual E Sonoro Observado

Source index: [inventory.md](inventory.md)

## Feedback Visual E Sonoro Observado

Feedback visual estatico:

- Preload (`CE3`) aquece pictures de corrida com `Show Picture -> Wait -> Erase`.
- `CE8` mostra background de sinal, POV do carro, sinal vermelho, barras de
  luck, valor `P_cena` e botoes.
- `CE9` mostra background de curva, POV do carro, placa da Curva do Diabo
  quando `SW_IS_CURVA_DIABO` esta ON, barras de luck, valor `P_cena` e botoes.
- `CE14 EV_ResolucaoSafe` aplica tint verde/escuro e espera 12 frames.
- `CE15 EV_ResolucaoRiskOK` toca SE, aplica tint azul, screen shake, retorna
  tint e espera 18 frames.
- `CE19` aplica tint de resultado e mostra TextPictures de vitoria/derrota.

Feedback sonoro estatico:

- `CE11 EV_OnSafe` toca SE `freada` e `Up1`.
- `CE15 EV_ResolucaoRiskOK` toca SE `pneu_cantando`.
- `CE19 EV_VitoriaCorrida` toca ME `Victory1` ou `Defeat1`.

Docs descrevem feedback adicional como flash, opala freando/acelerando,
motion blur, crash visual, hover vermelho, ticks finais e haptic. Esses itens
sao direcao/expectativa de design ou polish `runtime-pending` enquanto nao
houver Playtest ou auditoria de assets/plugins apropriada.
