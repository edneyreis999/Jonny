# Loki Init - UX/UI Designer Inventory - Acessibilidade Observada

Source index: [inventory.md](inventory.md)

## Acessibilidade Observada

Superficies positivas observaveis:

- O jogo expõe pelo menos duas modalidades de acao para a corrida:
  clique em pictures e teclado por setas.
- Termo `Toque UI` existe em `System.json`, e `VisuMZ_0_CoreEngine` tem
  `ShowButtons: true`.
- `ButtonHeight` global do VisuMZ e `52`, mas os botoes de corrida sao
  pictures customizadas; tamanho efetivo depende do asset e nao foi medido.
- O resultado usa texto e ME; nao depende apenas de audio.

Gaps de acessibilidade:

- Contraste e non-text contrast nao foram medidos.
- Tamanho real dos touch targets nao foi medido.
- Font legibility da `JollyLodger-Regular.ttf` em HUD, timer e resultado nao
  foi validada.
- Dependencia de cor: estados usam vermelho/dourado/azul/verde; nao ha
  evidencia de fallback textual/shape para todos os estados.
- Timing: timer de 3,5s/4,0s nao tem evidencia de ajuste, pausa acessivel ou
  modo sem tempo.
- Remapeamento: setas sao observadas; WASD fica pendente; remapping nao foi
  observado.
- Motion/flash: tint, shake e flashes aparecem em docs/CEs; risco de conforto
  visual requer gate humano.
- Haptic citado em docs nao foi confirmado no runtime.
