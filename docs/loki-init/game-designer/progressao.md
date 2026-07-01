# Loki Init - Game Designer Inventory - Progressao

Source index: [inventory.md](inventory.md)

## Progressao

Evidencia estatica:

- `VAR_RACE_ID` guarda corrida atual.
- CE5 define `VAR_RACE_N_CENAS` como 6 para corrida 1, 8 para corrida 2 e 10
  para corrida 3.
- CE5 calcula `VAR_GLORIA_META` por helper `window.JhonnyRace.thresholdFor` ou
  fallback 200/400/600.
- CE19 decide `VAR_VITORIA_PASSOU` usando `window.JhonnyRace.isVictory` ou
  fallback `pontos >= thresholds[raceId]`.
- CE19 chama CE5 no final do fluxo, preservando o papel de orquestrador.

Inferencia de design:

- A progressao entre corridas e linear e de escalada: mais cenas e metas maiores.
- A tela cerimonial transformou fim de corrida em checkpoint explicito, nao em
  transicao invisivel.
- `VAR_ATTEMPT_N` torna retry perceptivel/debugavel e pode reforcar leitura de
  repeticao roguelite.

Pendente de Playtest:

- Se as metas 200/400/600 produzem curva de dificuldade aceitavel.
- Se derrota por pontuacao apos completar cenas e compreendida como derrota
  legitima, nao bug.
