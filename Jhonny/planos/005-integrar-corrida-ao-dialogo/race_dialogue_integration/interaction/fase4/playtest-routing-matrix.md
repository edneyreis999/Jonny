# Playtest Routing Matrix - Fase 4

## Objetivo

Validar manualmente a matriz final de entrada, derrota, vitoria e cleanup das tres corridas apos os patches estruturais da Fase 4.

## Preparacao

- Abrir o projeto `Jhonny/` em Playtest do RPG Maker MZ ou via servidor local.
- Garantir que os JSONs atuais da Fase 4 foram carregados.
- Repetir os testes sem saves antigos problemáticos, se houver suspeita de estado residual.

## Matriz

### Corrida 1

- Entrar pelo marcador narrativo de `Map010`.
- Confirmar `Map001` inicia a corrida e o jogador permanece no minigame.
- Perder depois da tela de resultado e apertar Espaco.
- Confirmar que a corrida reinicia em `Map001` sem tela preta morta.
- Confirmar que o retry volta com HUD/parallels da corrida sem travar no preload.
- Ganhar a corrida.
- Confirmar transferencia para `Map005`.

### Corrida 2

- Entrar pelo marcador narrativo de `Map005`.
- Confirmar `Map001` inicia a corrida e o jogador permanece no minigame.
- Perder depois da tela de resultado e apertar Espaco.
- Confirmar que a corrida reinicia em `Map001` sem tela preta morta.
- Confirmar que o retry volta com HUD/parallels da corrida sem travar no preload.
- Ganhar a corrida.
- Confirmar transferencia para `Map013`.
- Confirmar que nao ha salto automatico direto para Corrida 3 na vitoria.

### Corrida 3

- Alcancar pelo menos um dos pontos executaveis auditados em `Map013`.
- Confirmar `VAR_RACE_ID = 3` e transferencia para `Map001`.
- Confirmar `Map001` inicia a corrida e o jogador permanece no minigame.
- Perder depois da tela de resultado e apertar Espaco.
- Confirmar que a corrida reinicia em `Map001` sem tela preta morta.
- Confirmar que o retry volta com HUD/parallels da corrida sem travar no preload.
- Ganhar a corrida.
- Confirmar transferencia final para `Map012`.

## Cleanup

- Apos cada transferencia de vitoria, confirmar ausencia de HUD da corrida.
- Confirmar ausencia de botoes, overlays, tint residual e input atrasado da corrida no mapa narrativo.
- Se ocorrer tela preta, abrir o console e conferir:
  - `mapId`, posicao, `SW_RACE_ACTIVE`, `SW_PAUSED`
  - `isRunning()`, `isCommonEventReserved()`
  - pictures residuais

## Resultado

- Marcar a Fase 4 como validada somente depois da confirmacao manual do usuario.
