# Fase 3 — Completa (auditoria + aguardando Playtest)

> Tasks 3.1, 3.2, 3.3 executadas. Auditoria programática passou em todos os
> checks. Falta validação visual em Playtest (último item da Definition of
> Done da task-3.3).

## Resumo

HUD de Consciência (picture 60 — texto `\V[104]%`) agora re-bakeia a 10 Hz
via CE 6 paralelo, e é re-mostrado imediatamente após `SW_RACE_ACTIVE ON`
no INIT da corrida (CE 5). Os dois bugs da fase:

- **#5** "Awareness % HUD stuck at 0%" — TextPicture bakeia o `\V[104]` uma
  vez no INIT e nunca mais. **Fix**: Patch I-a adiciona re-bake do pic 60
  dentro do loop `HUD_TICK` (a cada 6 frames).
- **#6** "Awareness % HUD disappears after first attempt" — EV_Crash apaga
  pictures 1-60 e ninguém recriava o pic 60. **Fix**: Patch I-a + Patch I-b
  garantem que o loop paralelo re-bakeia pic 60 continuamente, e o Patch J
  mostra pic 60 já no INIT.

## Patches aplicados

### Patch I-a — CE 6 `EV_UpdateHud` convertido em parallel

- `trigger`: `0` → `2` (parallel)
- `switchId`: `1` → `100` (SW_RACE_ACTIVE)
- Lista reorganizada (9 cmds → 18 cmds):
  - **NOVO** `[0]` Label `HUD_TICK` (code 118)
  - **NOVO** `[1-3]` Guard `SW_PAUSED == ON` → `Exit` → `End` (dentro do
    loop, para re-avaliar a cada tick).
  - `[4-11]` Corpo original (Script move pic 21 + Glória pic 57 +
    bg-ranking pic 51 + TENTATIVA pic 52).
  - **NOVO** `[12-14]` Re-bake pic 60 via trio `357 TextPicture / 657 / 231`
    com `\V[104]%` e coords (100, 148) — mesmas params do CE 5 INIT.
  - **NOVO** `[15]` `Wait 6` (10 Hz refresh, per Implementation Guide §10.3).
  - **NOVO** `[16]` `Jump HUD_TICK` (fecha o loop).
  - `[17]` end-of-list (code 0).

### Patch I-b — Removidos os callers `117 [6]` em CE 11/12/18

Após Patch I-a, o CE 6 tem loop `HUD_TICK` infinito. `command117`
(`rmmz_objects.js:10121`) faz `setupChild` — o interpretador do caller
adota a lista do CE 6 e trava no loop. **Remoção obrigatória**:

- CE 11 `EV_OnSafe` — removido `117 [6]` (estava no índice 20). Lista: 28 → 27 cmds.
- CE 12 `EV_OnRisk` — removido `117 [6]` (estava no índice 18). Lista: 37 → 36 cmds.
- CE 18 `EV_Crash`  — removido `117 [6]` (estava no índice 24). Lista: 28 → 27 cmds.

Com CE 6 paralelo, essas chamadas eram redundantes (o loop auto-atualiza
HUD a 10 Hz).

### Patch J — CE 5 INIT re-show pic 60

Inserido trio `[357 TextPicture, 657, 231 pic 60]` imediatamente após
`SW_RACE_ACTIVE ON` (cmd 20) no CE 5 `EV_RaceOrchestrator`:

- `[21]` `357 TextPicture` com `{"text": "\\V[104]%"}` (NOVO)
- `[22]` `657 "Text = \\V[104]%"` (NOVO)
- `[23]` `231 pic 60` em (100, 148) — **primeira** Show Picture após switch ON (NOVO)
- `[24]` `231 pic 20` (bar bg, deslocado de 21→24)
- `[25]` `231 pic 21` (bar fill, deslocado de 22→25)
- `[26-28]` TextPicture + `231 pic 60` (pré-existente — redundante mas mantido)
- `[29]` `223 Tint Screen` (fade-in preto→normal)

Lista: 30 → 33 cmds.

## Generator — idempotência confirmada

```
$ python3 Jhonny/planos/003-bug-fix-round1/fase3/build_phase3_ces.py
# 1ª run:
Patch I-a: applied (CE 6 converted to parallel switch=100, loop HUD_TICK + SW_PAUSED guard + pic 60 re-bake; 18 cmds)
Patch I-b: applied (removed 3 `117 [6]` caller(s) across CE 11/12/18)
Patch J:   applied (inserted pic 60 re-show trio at cmd[21..23] in CE 5; 33 cmds)

# 2ª run:
Patch I-a: skipped (CE 6 already parallel with HUD_TICK label)
Patch I-b: skipped (no `117 [6]` callers in CE 11/12/18)
Patch J:   skipped (CE 5 already has TextPicture right after SW_RACE_ACTIVE ON at cmd[21])
Nenhuma mudança aplicada — JSON não regravado.
```

`git diff Jhonny/data/CommonEvents.json` após 2ª run = estável (somente
inserções da 1ª run: 113 insertions, 24 deletions, 137 lines changed).

## Auditorias programáticas

```
$ python3 -m json.tool Jhonny/data/CommonEvents.json > /dev/null && echo OK
OK

Audit I OK    (CE 6 parallel switch=100 + HUD_TICK label + SW_PAUSED guard in first 8 cmds)
Audit J OK    (CE 5 first Show Picture after SW_RACE_ACTIVE ON is preceded by TextPicture)
Audit K OK    (CE 19 head: SW_INPUT_LOCKED=ON + SW_PAUSED=ON intact; não toca SW_RACE_ACTIVE)

Sanity 1 OK: nenhum caller 117 [6] restante em CE 11/12/18
Sanity 2 OK: CE 6 re-bakeia pic 60 no índice 14, precedido por TextPicture
Sanity 3 OK: ordem do loop — Label[0] → Guard[1] → ... → Wait[15] → Jump[16]
Sanity 4 OK: CE 6 termina com code 0 em [17]
```

## Validação visual (Playtest) — pendente

> ⚠️ **Hard-refresh obrigatório**: após o gerador escrever `CommonEvents.json`,
> o browser DEVE fazer `Cmd+Shift+R` antes de re-entrar na corrida. Soft
> refresh pode servir JSON cacheado e mascarar o fix.

Cenário de Playtest (3 checkpoints):

1. **Race 1 start (valida bug #6 — primeira tentativa)**:
   - HUD "Consciência: 0%" visível desde o frame 1 (após fade-in do Tint).
   - A barra de consciência (pics 20 + 21) também visível desde o frame 1.

2. **Após ação Safe (valida bug #5 — atualização live)**:
   - Fazer uma ação Safe que aumenta `var 104` em ~10.
   - HUD "Consciência: X%" atualiza para o novo valor dentro de ~100 ms
     (~6 frames). **Antes do fix, ficava stuck em 0%.**

3. **Após crash → restart (valida bug #6 — sobrevivência)**:
   - Falhar uma ação Risk propositalmente → EV_Crash apaga pictures 1-60.
   - Tentativa 2 começa: HUD "Consciência: 0%" **visível** dentro de
     ~100 ms (~6 frames) do restart. **Antes do fix, ficava invisível.**

### Sinal visível canônico

- Texto "X%" do pic 60 mudando na tela (bug #5).
- Texto "X%" do pic 60 aparecendo após crash (bug #6).

## Definition of Done

- [x] 1ª run do gerador imprime "applied" para os 3 patches (I-a, I-b, J).
- [x] `python3 -m json.tool` valida o JSON.
- [x] 2ª run imprime "skipped" para os 3 patches com JSON não regravado.
- [x] Audits I, J, K imprimem "OK".
- [x] Sanity 1-4 (callers removidos, pic 60 re-bake, ordem do loop, fim de lista).
- [x] User fez hard-refresh do browser antes do Playtest.
- [x] User confirma: HUD Consciência atualiza live (bug #5 resolvido).
- [x] User confirma: HUD Consciência sobrevive crash→restart (bug #6 resolvido).
- [x] User confirma: HUD Glória e TENTATIVA funcionando perfeitamente.
- [x] **User confirmou: "FUNCIONOU" em 2026-06-21.**

## Bonus Fix — Display da HUD de risco (P_CENA cru)

> Descoberto em Playtest pós-Fase 3 via dialog `loki:feedback`. Não estava
> no escopo original (#5 e #6 eram sobre consciência), mas mesmo padrão de
> bug afetava a HUD de risco.

**Sintoma:** HUD de "% de risco" travada em 0% se o jogador só escolhesse
Safe; valor sempre stale (mostrava `var 106` = TAXA_SUCESSO, só computada
após clicar Risk em CE 12 cmd 7).

**Diagnóstico (com evidência):**
- CE 8 cmd 5-6 e CE 9 cmd 7-8 bakeavam `\V[106]%` no pic 61.
- `var 106` é computada SÓ em CE 12 cmd 7 (após clicar Risk).
- `var 103 (P_CENA)` já é rollada por cena em CE 7 cmd 23
  (`JhonnyRace.rollPCena()`).
- Pic 61 já é re-bakeado por cena via CE 8/9 chamados por CE 7.

**Decisão de design (loki:feedback dialog):** HUD deve mostrar a **taxa
crua** (`var 103` = P_CENA), não a taxa somada com consciência. Jogador
faz a conta mentalmente — designer não mastiga.

**Correção aplicada (4 substituições diretas no JSON):**

| CE | Cmd | Antes | Depois |
| -- | --- | ----- | ------ |
| 8  | 5   | `\V[106]%` | `\V[103]%` |
| 8  | 6   | `Text = \V[106]%` | `Text = \V[103]%` |
| 9  | 7   | `\V[106]%` | `\V[103]%` |
| 9  | 8   | `Text = \V[106]%` | `Text = \V[103]%` |

CE 12 cmd 7 (roll formula `clamp(cons+P_CENA,0,100)`) **intocado** —
continua computando a taxa de sucesso real usada no roll.

**Confirmação Playtest:** User disse "FUNCIONOU" em 2026-06-21. Cada nova
cena mostra o P_CENA rolled fresh; Safe path também mostra o valor; não
mais stuck em 0%.

## Notas para o usuário

1. **Execute** `python3 -m http.server 8000` em `Jhonny/` e abra
   `http://localhost:8000` (ou use o Playtest do RPG Maker MZ).
2. **Hard-refresh** (`Cmd+Shift+R`) antes de entrar na corrida pela
   primeira vez após este patch.
3. **Cenário completo**: entre na Corrida → veja "Consciência: 0%" no
   canto superior esquerdo → faça Safe → veja o número subir → falhe
   Risk propositalmente → veja crash → comece tentativa 2 → confirme
   que "Consciência: 0%" reaparece.
4. **Atenção**: a posição da barra fill (pic 21) ainda pulsa para (310, 18)
   a cada tick do CE 6 (pré-existing bug do script move-pic-21, não
   introduzido por esta fase). Se incomodar visualmente, abrir tarefa
   separada — fora do escopo do #5/#6.

## Artefatos

- Generator: `Jhonny/planos/003-bug-fix-round1/fase3/build_phase3_ces.py`
- Findings: `Jhonny/planos/003-bug-fix-round1/fase3/hud-findings.md`
- JSON alterado: `Jhonny/data/CommonEvents.json` (CE 5, 6, 11, 12, 18)
