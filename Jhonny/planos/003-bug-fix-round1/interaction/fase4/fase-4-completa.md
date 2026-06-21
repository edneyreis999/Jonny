# Fase 4 — Completa (pendente Playtest)

> Status: **aguardando confirmação do usuário no Playtest**.

## Resumo

Bug #4 do plano `003-bug-fix-round1` — "labels Risk/Safe invertidos na Cena
de Curva" — diagnosticado como **H6: inversão de event-binding** (mouse +
teclado). Nenhuma das hipóteses H1–H5 do task-4.1 explica o bug; o problema
real era que o botão **direito** (pic 43 `race/btn_direita`) estava bindado
ao CE 11 (Safe) e o **esquerdo** (pic 44 `race/btn_esquerda`) ao CE 12
(Risk), com o handler de teclado espelhando a mesma inversão.

Spec corrigida (memória `curva-convention-inversion.md`, 2026-06-21):
**Direita = Risk, Esquerda = Safe**.

## Artefatos

| Caminho | Tipo |
| ------- | ---- |
| `interaction/fase4/diagnosis.md` | Evidência do diagnóstico (H6 confirmado, H1–H5 rejeitados) |
| `interaction/fase4/fix_curve_labels.py` | Generator idempotente (patches K + L) |
| `Jhonny/data/CommonEvents.json` | 3 linhas trocadas (CE 9 cmd 12, CE 9 cmd 13, CE 13 cmd 4) |

## Patches aplicados

### Patch K — Mouse bindings (CE 9 `EV_RenderCurva` cmds 12, 13)

Troca o CE alvo em cada binding de picture:

| Cmd | Antes                                          | Depois                                         |
| --- | ---------------------------------------------- | ---------------------------------------------- |
| 12  | `picture(43).mzkp_commonEventId = 11;` (Safe) | `picture(43).mzkp_commonEventId = 12;` (Risk) |
| 13  | `picture(44).mzkp_commonEventId = 12;` (Risk) | `picture(44).mzkp_commonEventId = 11;` (Safe) |

Variable name normalizada de `p3`/`p4` para `p` (IIFE-scoped, sem
impacto funcional). Patch L usa regex tolerante a whitespace porque o
código original alinha `'left'`/`'up'` com `'right'`/`'down'` via
espaços extras.

### Patch L — Keyboard handler (CE 13 `EV_KeyInput` cmd 4)

Branch Curva do `if/else` trocada:

```js
// Antes
if (Input.isTriggered('right')) $gameTemp.reserveCommonEvent(11); // Safe
if (Input.isTriggered('left'))  $gameTemp.reserveCommonEvent(12); // Risk

// Depois
if (Input.isTriggered('right')) $gameTemp.reserveCommonEvent(12); // Risk
if (Input.isTriggered('left'))  $gameTemp.reserveCommonEvent(11); // Safe
```

Branch Sinal (`down`→11, `up`→12) **intocada** — spec-correct.

## Verificações automáticas

### JSON validation

```
$ python3 -m json.tool Jhonny/data/CommonEvents.json > /dev/null && echo OK
OK
```

### Diff mínimo (3 linhas)

```
$ git diff --stat Jhonny/data/CommonEvents.json
 Jhonny/data/CommonEvents.json | 6 +++---
 1 file changed, 3 insertions(+), 3 deletions(-)
```

Diferenças visíveis no diff:
- `pic43.mzkp_commonEventId` 11 → 12
- `pic44.mzkp_commonEventId` 12 → 11
- `reserveCommonEvent(11)` → `reserveCommonEvent(12)` para `'right'`
- `reserveCommonEvent(12)` → `reserveCommonEvent(11)` para `'left'`

### Idempotência

```
$ python3 fix_curve_labels.py  # 1ª run
applied: CE 9 cmds 12/13 swapped (pic43 -> CE 12, pic44 -> CE 11)
applied: CE 13 cmd 4 Curva branch swapped (right->CE 12, left->CE 11)

$ python3 fix_curve_labels.py  # 2ª run
skip: CE 9 cmds 12/13 already bound direita->12, esquerda->11
skip: CE 13 cmd 4 Curva branch already fixed (right->12, left->11)

$ git diff --stat Jhonny/data/CommonEvents.json
# mesmo 3+/3- da 1ª run — diff vazio entre runs
```

### Audit K/L (semântico, não tautológico)

```
$ python3 audit_phase4.py  # (inline no fase-4-completa.md)
Audit K/L OK
  pic 43 (race/btn_direita @ x=624) -> CE 12 (EV_OnRisk)   [Direita = Risk]
  pic 44 (race/btn_esquerda @ x=336) -> CE 11 (EV_OnSafe)  [Esquerda = Safe]
  keyboard: down->11 (Safe)  up->12 (Risk)  | Sinal
  keyboard: right->12 (Risk)  left->11 (Safe)  | Curva
```

O audit valida o **significado** (qual CE está bindado a qual
input/picture), não apenas "o opcode 355 está presente" — audits que
repetem o opcode que o patch escreveu são tautológicos e perdem
regressões (regra `semantic-audits` do plano).

## Handoff para Playtest

Antes de testar, **hard-refresh** o browser (`Cmd+Shift+R`) para o
engine recarregar o JSON cacheado — senão o fix é mascarado por dado
stale (regra `hard-refresh-in-playtest`).

### Passos

1. Entrar em uma corrida que tenha cenas de Curva (Corrida 1, 2 ou 3 —
   qualquer uma serve; sorteio 60/40 Sinal/Curva garante ao menos uma
   Curva cedo).
2. Ao chegar numa cena de Curva (identificável pela placa de curva à
   frente + botões seta direita/esquerda), confirmar:
   - **Botão direito** (seta → à direita, pic 43): clicar ou teclar `→`
     deve **consumir `P_cena`** e disparar o roll de Risk (toca
     `pneu_cantando` SE em caso de sucesso, ou causa Crash em falha).
   - **Botão esquerdo** (seta ← à esquerda, pic 44): clicar ou teclar
     `←` deve **dar +10 Consciência +10 Glória** (Safe) — sem roll, sem
     Crash.
3. Repetir 2-3 vezes para garantir consistência (incluindo timeout —
   timer expira sem input deve disparar Safe automático = `←`).

### Critério de aceite

Sinal visível/audível (regra `user-testable-feedback`):
- Right (mouse ou teclado) → comportamento de **Risk** (pneu_cantando
  em sucesso, crash em falha, `P_cena` consumida).
- Left (mouse ou teclado) → comportamento de **Safe** (+10 Consciência,
  SE `Up1`, sem crash).

Se Right ainda disparar Safe ou Left ainda disparar Risk, marcar Fase 4
como falha e capturar qual input path está incorreto.

## Notas para próxima LLM

- Patch letters usadas: **A–L** (A–F fase 1, G–H fase 2, I/J fase 3,
  K/L fase 4). Próxima fase começa em **M**.
- A invertion NÃO é só mouse — teclado também (CE 13 cmd 4). Auditoria
  que só checa mousebindings perde regressão de teclado.
- Variável 102 (`VAR_SCENE_TYPE`): 0 = Sinal, != 0 = Curva. O handler
  de teclado usa esse gate para saber qual branch rodar.
- Não confundir var 102 (VAR_SCENE_TYPE) com switch 102 (SW_CRASH_FLAG)
  — namespaces diferentes.
- Não há H6 na lista original de hipóteses do task-4.1; foi adicionado
  no diagnosis.md depois de inspecionar o JSON. Recomenda-se adicionar
  H6 explicitamente ao task-4.1 em próxima revisão do plano.
