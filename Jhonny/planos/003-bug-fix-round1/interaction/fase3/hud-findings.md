# HUD Findings — Fase 3 descoberta

> Snapshot de `Jhonny/data/CommonEvents.json` em 2026-06-20 (pós-Fase 2).
> Toda inspeção feita via query Python direta contra o JSON — sem depender de
> dumps textuais pré-existentes (task-3.1 §Discovery hygiene).

## 1. HUD picture IDs

O HUD de consciência é composto por **três** pictures renderizadas no INIT da
corrida (CE 5 `EV_RaceOrchestrator`):

| Picture ID | Asset / Texto                    | Posição (x,y) | Origem | Papel                     |
| ---------- | -------------------------------- | ------------- | ------ | ------------------------- |
| 20         | `race/bar_consciencia_bg`        | (64, 96)      | 0      | Fundo estático da barra   |
| 21         | `race/bar_consciencia_fill`      | (72, 103)     | 0      | Fill animado (scaleX=c%)  |
| **60**     | `""` (TextPicture `\V[104]%`)    | (100, 148)    | 1      | **Texto da % — bug #5/#6** |

Picture 60 é o alvo direto dos bugs #5 ("stuck at 0%") e #6 ("disappears
after first attempt"). As pictures 20 e 21 não foram reportadas como bug;

## 2. Owner CE

- **Criação**: CE 5 `EV_RaceOrchestrator` (trigger=0 action), índices 21–25
  do `list`. Mostra pic 20, pic 21 e pic 60 (TextPicture) em sequência,
  imediatamente após `SW_RACE_ACTIVE = ON` (índice 20) e antes do Tint Screen
  fade-in (índices 26–28).
- **Update**: CE 6 `EV_UpdateHud` (trigger=0 action, switch=1), 9 cmds.
  Hoje atualiza Glória (pic 57), bg-ranking (pic 51), TENTATIVA (pic 52) e
  move pic 21 com `scaleX = c%` baseado em var 104. **Não re-bakeia pic 60.**
- **Erase em crash**: CE 18 `EV_Crash` índice 21, via script
  `for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);` — cobre pic 60.

## 3. TextPicture usage — confirmação

Padrão confirmado (code 357 + 657 + 231 com `name=""`):

```jsonc
// CE 5 INIT, cmds 23-25 — bake inicial do pic 60
{code: 357, parameters: ["TextPicture", "set", "Set Text Picture", {"text": "\\V[104]%"}]}
{code: 657, parameters: ["Text = \\V[104]%"]}
{code: 231, parameters: [60, "", 1, 0, 100, 148, 100, 100, 255, 0]}
```

`TextPicture` bakeia a substituição `\V[104]` **no momento do Show Picture**.
Mudanças posteriores em var 104 não atualizam pic 60 — é preciso re-aplicar
o trio 357/657/231 para re-bakear.

## 4. Lifecycle — por que #5 e #6 acontecem

- **#5 stuck at 0%**: pic 60 é bakeado uma vez no INIT (CE 5 cmd 25) com
  `var 104 = 0`. Nunca é re-bakeado. TextPicture não é dinâmico.
- **#6 disappears after first attempt**: CE 18 erase-all (índice 21) apaga
  pic 60 no crash. CE 18 chama CE 6 via `117 [6]` (índice 24), mas CE 6
  não recriia pic 60. CE 5 INIT não re-roda entre tentativas. Resultado:
  pic 60 some após o primeiro crash e nunca volta.

## 5. Update path atual

CE 6 `EV_UpdateHud` é chamado manualmente por:
- CE 11 `EV_OnSafe` índice 20 (`117 [6]`)
- CE 12 `EV_OnRisk` índice 18 (`117 [6]`)
- CE 18 `EV_Crash` índice 24 (`117 [6]`)

Essas chamadas atualizam Glória/TENTATIVA/move-pic-21, mas não re-bakeiam
pic 60. Por isso o % nunca muda.

## 6. Descoberta crítica — loop HUD_TICK vs. chamadas `117 [6]`

A spec da task-3.2 pede para **estender o CE 6** com `trigger=2` (parallel) +
`switchId=100` + label `HUD_TICK` + `Jump to HUD_TICK` (loop infinito).

Porém, converter CE 6 em um loop infinito **quebra os três callers
existentes**: `code 117` (`Game_Interpreter.prototype.command117`,
`rmmz_objects.js:10121`) faz `setupChild(commonEvent.list, eventId)` — o
interpretador do caller adota a lista do CE chamado e a executa
sincronamente. Se a lista tem `Jump to HUD_TICK` no fim, o caller
(CE 11/12/18) trava no loop forever, travando o jogo.

**Decisão**: o gerador da Fase 3 (`build_phase3_ces.py`) faz Patch I em
duas partes coordenadas:

- **Patch I-a** — Converte CE 6 em parallel + adiciona loop `HUD_TICK` com
  guard `SW_PAUSED` (code 111 `[0,104,0]` → `115` Exit → `412` End) dentro
  do loop, e adiciona o re-bake do pic 60 (357/657/231) antes do
  `Wait 6 + Jump`.
- **Patch I-b** — Remove os `117 [6]` em CE 11 (índice 20), CE 12
  (índice 18) e CE 18 (índice 24). Com o CE 6 parallel, essas chamadas
  são redundantes (o loop auto-atualiza a 10 Hz) e causariam hang se
  mantidas.

Sem o I-b, o jogo trava na primeira ação Safe/Risk/Crash pós-Fase 3.

## 7. Guard `SW_PAUSED` — posicionamento

Spec task-3.2 §"Ceremony-lock interaction" pede o guard "no topo do list".
Para um CE paralelo com loop `HUD_TICK`, "topo" precisa ser **dentro do
loop**, não antes do label — caso contrário o guard roda uma vez só e o
loop infinito nunca mais checa `SW_PAUSED`.

Layout final do CE 6 (após Patch I-a):

```
[0] Label HUD_TICK              (code 118, indent 0)
[1] If SW_PAUSED == ON          (code 111, indent 0, params [0,104,0])
[2]   Exit Event Processing     (code 115, indent 1)
[3] End                         (code 412, indent 0)
[4] Script: move pic 21        (existente)
[5..11] Glória/TENTATIVA/bg    (existente, 7 cmds)
[12] TextPicture CONSCIÊNCIA    (NOVO, code 357)
[13] 657                        (NOVO)
[14] Show pic 60                (NOVO, code 231)
[15] Wait 6                     (NOVO, code 230)
[16] Jump HUD_TICK              (NOVO, code 119)
[17] end-of-list                (code 0)
```

`Exit` (code 115) seta `_index = list.length` — termina a run atual. Para
CE paralelo, a próxima run começa do índice 0, re-avalia SW_PAUSED. Logo,
quando `SW_PAUSED = ON` durante o cerimonial, o CE 6 efetivamente vira
no-op até o cerimonial liberar.

## 8. Patch J — INIT re-show

CE 5 já mostra pic 60 no INIT (cmds 23-25), mas **depois** das pictures
20/21 e antes do Tint Screen fade-in. O audit J da task-3.3 exige que a
**primeira** Show Picture após `SW_RACE_ACTIVE ON` seja precedida por um
TextPicture plugin command — ou seja, pic 60 deve vir imediatamente após
o switch, não após pic 20/21.

Patch J insere `[357 TextPicture, 657, 231 pic 60]` imediatamente após o
`121 [100,100,0]` (índice 20) no CE 5. O pic 60 pre-existente no INIT
(cmds 23-25 pós-inserção) torna-se redundante; mantemos por segurança
(idempotente: mesmo pic ID, o segundo `Show` substitui o primeiro).

## 9. Coordenadas canônicas do pic 60

Confirmadas em CE 5 cmd 25: `[60, "", 1, 0, 100, 148, 100, 100, 255, 0]`
→ pic ID 60, name "", origin 1 (center), x=100, y=148, scale 100%, opacity
255, blend 0. Usadas em ambos os patches (I-a re-bake + J INIT re-show).

## 10. Próximos passos

- Task 3.2: escrever `fase3/build_phase3_ces.py` com `patch_i_a_update_hud_parallel`,
  `patch_i_b_remove_callers`, `patch_j_init_reshow_hud`. Idempotentes via
  pattern detection.
- Task 3.3: rodar gerador 2x, validar JSON, rodar audits I/J/K, handoff
  Playtest com hard-refresh.

## 11. Definição de Done da Task 3.1

- [x] `rg TextPicture` output capturado (9 ocorrências em 5 CEs).
- [x] HUD picture ID identificado: **60** (texto), 21 (fill), 20 (bg).
- [x] HUD owner CE identificado: **CE 5** (cria), **CE 6** (atualiza).
- [x] HUD lifecycle mapeado: INIT em CE 5 cmds 21-25; erase em CE 18 cmd 21;
      refresh manual em CE 6 chamado por CE 11/12/18; nenhum re-bake do pic 60.
- [x] `fase3/hud-findings.md` escrito.
