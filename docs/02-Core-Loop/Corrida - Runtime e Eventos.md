---
title: "Corrida - Runtime e Eventos"
tipo: "referencia tecnica runtime"
status: "aprovado"
tags:
  - core-loop
  - corrida
  - rpg-maker-mz
  - runtime
  - common-events
---

# Corrida - Runtime e Eventos

Este documento consolida contratos runtime da corrida que antes estavam espalhados por retrospectivas. Use junto com [[Corrida - Core Loop]] antes de alterar `CommonEvents.json`, mapas que chamam a corrida, preload, retry, tela de resultado ou helper plugins.

---

## Fonte de verdade

- `data/System.json` define IDs reais de switches e variáveis. Antes de editar, imprima a faixa de IDs afetada e confirme nomes no arquivo.
- `data/CommonEvents.json` define a lista executada pelo runtime. JSON válido não prova que o editor RPG Maker MZ aceitará novos slots criados por script.
- `js/rmmz_objects.js` é a fonte para semântica de `Game_Interpreter.prototype.commandNNN`.
- `js/plugins.js` é a fonte para plugins ativos e parâmetros salvos.

## Invariantes runtime

- `SW_RACE_ACTIVE` é switch de lifecycle da corrida. Desligar esse switch pode encerrar o Common Event paralelo dono e limpar o interpreter ativo.
- `SW_INPUT_LOCKED` bloqueia gameplay input. Use esse lock para tela de resultado, resolução e transições; não desligue `SW_RACE_ACTIVE` só para impedir input.
- `EV_VitoriaCorrida` é a tela canônica de resultado de fim de corrida. Derrota por pontuação passa por ela e só depois decide retry.
- Durante a tela de resultado, setas e CEs de gameplay devem respeitar `SW_INPUT_LOCKED`; apenas a confirmação da tela deve operar.
- `command117` chama outro Common Event como child síncrono. Não use `command117` para disparar um CE que depende de loop paralelo próprio sem garantir que ele termina.
- Retry não deve repetir a VN nem o preload completo quando o caminho validado pula esse trecho por tentativa. Confirme a semântica de `VAR_ATTEMPT_N` antes de mudar o fluxo.

## Grafo de Common Events

| CE | Nome | Papel runtime | Atenção |
| --- | --- | --- | --- |
| 3 | `EV_Preload` | Aquece pictures com `Show Picture -> Wait 1 frame -> Erase Picture`. | Deve ser pulado em retry quando a tentativa já está quente, conforme fluxo atual. |
| 5 | `EV_RaceOrchestrator` | Inicializa corrida, seed, cena atual, tentativa, reset defensivo e chama o fluxo principal. | É o caminho preferencial para iniciar ou reiniciar corrida. |
| 6 | `EV_UpdateHud` | Atualiza HUD. | Se virar loop paralelo, remova callers síncronos `command117` que possam travar. |
| 7 | `EV_RaceRenderer` | Renderiza cena, detecta fim de corrida e chama a tela de resultado. | Não deve pular `EV_VitoriaCorrida` quando `VAR_SCENE_INDEX >= VAR_RACE_N_CENAS`. |
| 10 | `EV_RaceTimer` | Tick de timer. | Deve respeitar input lock e estado de lifecycle. |
| 11 | `EV_OnSafe` | Resolve ação safe. | Deve respeitar `SW_INPUT_LOCKED`. |
| 12 | `EV_OnRisk` | Resolve ação risk. | Deve respeitar `SW_INPUT_LOCKED` e não criar tela paralela de resultado sem decisão. |
| 13 | `EV_KeyInput` | Entrada por teclado. | Na tela de resultado, setas não podem reservar CE11/CE12. |
| 16 | `EV_HoverRiskButton` | Feedback de hover/custo. | Deve ser silencioso quando input estiver bloqueado. |
| 18 | `EV_Crash` | Cleanup e restart da mesma corrida. | Não deve matar o handoff necessário antes de o fluxo alcançar o resultado correto. |
| 19 | `EV_VitoriaCorrida` | Tela VITORIA/DERROTA, threshold check e pós-input. | Precisa permanecer vivo enquanto espera confirmação. |

## Tela de resultado

`EV_VitoriaCorrida` faz erase defensivo de pictures, fadeout de BGM, toca ME curta, mostra fundo e TextPictures, calcula `VAR_VITORIA_PASSOU` e aguarda confirmação. A espera por input acontece dentro do próprio CE, então o owner paralelo não pode ser morto antes do `Wait 1 frame` e do branch pós-input.

Contrato de input:

- `SW_INPUT_LOCKED = ON` durante a tela.
- `EV_KeyInput`, safe, risk, hover e timer não podem consumir setas ou reservar CEs de gameplay.
- A confirmação da tela usa `Input.isTriggered('ok')`.
- Ao sair, apague as pictures de resultado de forma defensiva.

## Retry e tela preta

Quando uma derrota ou retry termina em tela preta, colete o snapshot mínimo descrito em [[RPG Maker MZ - Debug Playtest]] antes de editar. Em especial, confirme:

- `mapId`, posição e evento local que chamou a corrida.
- Pictures ativas, tint e BGM/ME.
- `SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `SW_CRASH_FLAG`.
- `VAR_RACE_ID`, `VAR_SCENE_INDEX`, `VAR_RACE_N_CENAS`, `VAR_ATTEMPT_N`, `VAR_VITORIA_PASSOU`.
- Estado de interpreter, child interpreter e event reservation.
- Se o evento `Init Corrida` foi apagado por `Erase Event` e não será executado de novo até reload de mapa.

## Gates antes de editar JSON

1. Confirme IDs e nomes em `System.json`.
2. Confirme command codes em `rmmz_objects.js`, não em memória ou em task antiga.
3. Preserve o estilo de escrita do arquivo. Neste projeto, os JSON de data observados usam indentação estável de 4 espaços e `ensure_ascii=False`.
4. Se adicionar Common Events, prefira criar os slots no editor RPG Maker MZ quando o editor precisar reconhecer os IDs. Depois sobrescreva o conteúdo preservando IDs reais.
5. Remapeie todos os callers `code:117` quando mover ou renumerar CEs.
6. Rode parse JSON depois da escrita.
7. Revise diff restrito ao escopo. Reflow massivo é falha de writer, não mudança aceitável.
8. Peça Playtest quando engine, input, pictures, audio, plugin helper ou Common Events forem afetados.

## Referências relacionadas

- [[Corrida - Core Loop]]
- [[RPG Maker MZ - Debug Playtest]]
