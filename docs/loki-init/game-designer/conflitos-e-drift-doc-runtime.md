# Loki Init - Game Designer Inventory - Conflitos e drift doc-runtime

Source index: [inventory.md](inventory.md)

## Conflitos e drift doc-runtime

- O core loop historico diz "sem plugins", mas o inventario comum e
  `CommonEvents.json` mostram uso atual de `TextPicture` e `Jhonny_RaceHelper`.
- A Curva do Diabo aparece no topo da spec como fora do MVP, mas CE7 contem
  implementacao estatica para corrida 3 cena final.
- Timeout tem conflito textual: uma secao fala em crash por expirar, enquanto
  TL;DR/edge cases e CE10 apontam para safe automatico.
- A tabela de riscos diz que vencer sem risk seria aceitavel/planejado em um
  ponto, mas thresholds atuais 200/400/600 tornam safe-only insuficiente.
- Documentacao usa termos em PT-BR; tela runtime inventariada via CE19 usa
  `VICTORY!`, `DEFEAT!`, `Glory Score` e `Press [SPACE] to continue`.
- `EV_Crash` chama CE19 no parse atual; isso pode representar derrota
  cerimonial em crash, mas o comportamento perceptivel e o retry real precisam
  de analise tecnica/runtime antes de conclusao.
