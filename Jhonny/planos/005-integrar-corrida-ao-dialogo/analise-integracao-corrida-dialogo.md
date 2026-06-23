# Analise - Integracao da Corrida ao Dialogo

## Escopo

Investigar onde o jogador deve entrar no minigame de corrida (`Map001`) a partir dos mapas narrativos e para onde deve retornar somente depois de vencer a corrida.

Nenhuma alteracao foi aplicada nos arquivos `data/*.json` nesta analise.

## Entendimento Confirmado

- O jogador comeca o jogo pelo `Map011` (`Prologo`).
- O `Map001` deve ser tratado como um minigame isolado.
- O jogador so deve sair do `Map001` quando ganhar a corrida.
- Se perder, o `EV_RaceOrchestrator` deve reiniciar a mesma corrida ate a vitoria.
- `Map010` inicia a corrida `RACE_ID = 1`.
- `Map005` inicia a corrida `RACE_ID = 2`.
- Marcadores "JOGADOR VAI PARA A CORRIDA" no `Map013` iniciam a corrida `RACE_ID = 3`.
- Ao vencer a corrida 3, o jogador deve ser transferido para o `Map012`.

## Pontos de Entrada Identificados

| Origem | Evidencia atual | Mudanca necessaria |
| --- | --- | --- |
| `Map010`, evento `EV001`, pagina 2, comandos `79-80` | Seta `VAR_RACE_ID = 1` e transfere para `Map005` | Manter `VAR_RACE_ID = 1` e transferir para `Map001` |
| `Map005`, evento `EV001`, pagina 3, comandos `104-105` | Seta `VAR_RACE_ID = 2` e transfere para `Map013` | Manter `VAR_RACE_ID = 2` e transferir para `Map001` |
| `Map013`, evento 1, pagina 1, comando `7082` | Transfere para `Map006` em um ramo marcado como ida para corrida/final | Setar `VAR_RACE_ID = 3` e transferir para `Map001` |
| `Map013`, evento 1, pagina 1, comando `7107` | Transfere para `Map012` no fallthrough final | Setar `VAR_RACE_ID = 3` e transferir para `Map001` se este ponto representar entrada da corrida |
| `Map013`, comentarios "JOGADOR VAI PARA A CORRIDA" | Existem muitos comentarios sem `Transfer Player` executavel junto | Cada marcador que for entrada real precisa receber comandos reais: setar `VAR_RACE_ID = 3` e transferir para `Map001` |

## Saidas Pos-Vitoria

| `VAR_RACE_ID` | Corrida | Destino ao vencer |
| ---: | --- | --- |
| `1` | Primeira corrida | `Map005` (`Quarto_VN2`) |
| `2` | Segunda corrida | `Map013` (`Estrada_VN3`) |
| `3` | Terceira corrida | `Map012` (`FIM_FALSE_Formatura_False`) |

## Causa Raiz Confirmada

`Map001` inicia a corrida e transfere imediatamente para fora do minigame.

Evidencia em `Map001`, evento `Init Corrida`:

| Pagina | Condicao | Comandos atuais |
| --- | --- | --- |
| 1 | `VAR_RACE_ID >= 1` | `Common Event 5 (EV_RaceOrchestrator)` -> `Transfer Player Map005` |
| 2 | `VAR_RACE_ID >= 2` | `Common Event 5 (EV_RaceOrchestrator)` -> `Transfer Player Map013` |
| 3 | `VAR_RACE_ID >= 3` | `Common Event 5 (EV_RaceOrchestrator)` -> `Transfer Player Map012` |

Esse desenho faz o transfer cedo demais. O correto e o `Map001` permanecer ativo durante o loop da corrida e so transferir no fluxo de vitoria.

## Efeitos Colaterais Confirmados

### Common Events paralelos globais

`EV_RaceOrchestrator` liga `SW_RACE_ACTIVE`, que ativa Common Events paralelos:

- `EV_UpdateHud`
- `EV_RaceRenderer`
- `EV_RaceTimer`
- `EV_KeyInput`
- `EV_HoverRiskButton`

Pelo core do RPG Maker MZ, Common Events paralelos continuam ativos enquanto `event.trigger === 2` e o switch associado estiver ligado. Logo, se `SW_RACE_ACTIVE` continuar ligado depois do transfer, a corrida continua rodando no mapa narrativo.

### Pictures e busts

A corrida usa pictures dentro da faixa `1..61`, incluindo fundos, botoes, HUD, overlays e textos. Os mapas narrativos usam busts de VN nos picture IDs `1` e `2`.

Risco: se a limpeza da corrida acontecer tarde demais, pode apagar busts narrativos. Se a limpeza nao acontecer, HUD/botoes da corrida podem aparecer no mapa narrativo.

### Fila de Common Events

`ButtonPicture` reserva Common Events por clique usando `$gameTemp.reserveCommonEvent(...)`. Se houver clique perto do transfer, um evento de acao da corrida pode ficar pendente e executar no mapa seguinte.

## Proposta Cirurgica

1. Alterar os pontos de entrada dos mapas narrativos para sempre transferirem primeiro ao `Map001` com `VAR_RACE_ID` correto.
2. Remover os `Transfer Player` imediatos do evento `Init Corrida` no `Map001`.
3. Fazer o `Map001` apenas iniciar ou reiniciar `EV_RaceOrchestrator`.
4. Mover a saida da corrida para `EV_VitoriaCorrida`.
5. No ramo de vitoria:
   - desligar `SW_RACE_ACTIVE`;
   - bloquear input da corrida;
   - limpar Common Events reservados;
   - apagar pictures da corrida antes de chegar ao mapa narrativo;
   - resetar tint/audio se necessario;
   - transferir conforme `VAR_RACE_ID`.
6. No ramo de derrota:
   - nao transferir;
   - manter o jogador no `Map001`;
   - chamar/reiniciar `EV_RaceOrchestrator` para a mesma corrida.

## Checklist De Implementacao

- [ ] Confirmar todos os marcadores executaveis no `Map013` que devem virar entrada para `RACE_ID = 3`.
- [ ] Atualizar `Map010` para `RACE_ID = 1` -> `Map001`.
- [ ] Atualizar `Map005` para `RACE_ID = 2` -> `Map001`.
- [ ] Atualizar pontos confirmados do `Map013` para `RACE_ID = 3` -> `Map001`.
- [ ] Remover transfers imediatos de `Map001`.
- [ ] Ajustar `EV_VitoriaCorrida` para transferir apenas em vitoria.
- [ ] Garantir que derrota reinicia a corrida no `Map001`.
- [ ] Garantir cleanup antes da saida: switches, fila de Common Events, pictures, tint/audio.
- [ ] Validar em Playtest cada rota narrativa e cada derrota/vitoria.
