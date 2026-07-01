# Loki Init - Scene Presentation Designer Inventory - Camera, Movimento e Transicoes

Source index: [presentation-inventory.md](presentation-inventory.md)

## Camera, Movimento e Transicoes

Fatos estaticos:

- O spec define camera/feedback como zoom-out em safe, zoom-in em risk-sucesso, motion blur, shake de 0,3s em crash, fade para preto de 0,4s e transicao de 0,2s entre cenas.
- Nos Common Events lidos, comandos de tint/shake/wait aparecem como command codes `223`, `225` e `230` em CEs de orquestracao/resolucao.
- CE14 `EV_ResolucaoSafe` tem dois `Tint Screen` e `Wait 12`.
- CE15 `EV_ResolucaoRiskOK` tem tint, shake, `Wait 18` e SE `pneu_cantando`.
- CE5 `EV_RaceOrchestrator` toca BGM `darkeletronic`, usa tint/fade waits de 72 e 18 frames e chama preload.
- CE7 `EV_RaceRenderer` apaga pictures de cena antes de renderizar nova cena e chama CE8/CE9 ou CE19 conforme estado.

Lacuna: o inventario estatico nao valida enquadramento, suavidade, sincronizacao, foco visual, duracao percebida, blend de tint, motion blur real ou ausencia de tela preta.
