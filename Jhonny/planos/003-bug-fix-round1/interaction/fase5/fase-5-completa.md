---
status: complete
phase: 5
task_id: 5.3
generated_at: 2026-06-21
playtest_confirmed_at: 2026-06-21
---

# Fase 5 — Refatoração de THRESHOLDS (Issue #1)

> Objetivo: extrair os magic numbers 60/100/150/200/400/600 para
> `window.JhonnyRace.Config.THRESHOLDS` e substituir o bloco inline
> de CE 19 por uma chamada a `window.JhonnyRace.isVictory(...)`.
> Comportamento do jogo **não muda** — refator pura.

## Resumo executivo

| Tarefa | Resultado |
| ------ | --------- |
| 5.1 — Inventário de literals | ✅ concluído. 1 site relacionado a threshold (CE 19 cmd[6-10]), 149 hits não relacionados, `150` não aparece em nenhum arquivo. |
| 5.2 — Namespace `window.JhonnyRace` no plugin | ✅ concluído. Bloco inserido via accumulator pattern; API existente preservada; `node -c` OK; smoke test OK. |
| 5.3 — Substituir CE 19 + fallback + audit M | ✅ concluído (automatizado). Pendente: Playtest do usuário. |

## Artefatos da Fase 5

| Caminho | Papel |
| ------- | ----- |
| `interaction/fase5/sites-inventory.md` | Inventário completo de literals (saída da task 5.1) |
| `js/plugins/Jhonny_RaceHelper.js` (linhas 170-200) | Bloco `window.JhonnyRace.Config.THRESHOLDS` + `isVictory`/`thresholdFor` |
| `interaction/fase5/build_phase5_ces.py` | Gerador idempotente do Patch M |
| `data/CommonEvents.json` (CE 19 cmd[6-10]) | Bloco script reescrito com helper + fallback |
| `interaction/fase5/fase-5-completa.md` | Este documento |

## Resultados do Patch M

**Comando executado:**
```
python3 planos/003-bug-fix-round1/interaction/fase5/build_phase5_ces.py
```

**Saída (1ª run):**
```
Estado inicial: 20 slots CE
--- Patch M: CE 19 — replace threshold dict with window.JhonnyRace.isVictory ---
  Patch M: applied (rewrote CE 19 cmd[6-10] to use window.JhonnyRace.isVictory; 59 cmds)
JSON escrito: /Users/edney/projects/coreto/summer26/Jhonny/data/CommonEvents.json
```

**Saída (2ª run — idempotência):**
```
Patch M: skipped (helper call already present)
Nenhuma mudança aplicada — JSON não regravado.
```

**Diff resultante em `data/CommonEvents.json`:** 6 linhas (5 strings de script reescritas + 1 trailing newline adicionada). Apenas cmd[6-10] do CE 19 foram tocados.

### Bloco reescrito (CE 19 cmd[6-10])

Cada cmd é uma string de uma linha; o RMMZ concatena `code=355 + code=655...` com newline join em runtime.

| cmd | code | Conteúdo |
| --- | ---- | -------- |
| 6 | 355 | `if (typeof window.JhonnyRace === "undefined") { const pontos = $gameVariables.value(105); const raceId = $gameVariables.value(100); const thresholds = { 1: 200, 2: 400, 3: 600 }; const passou = pontos >= (thresholds[raceId] || 60); $gameVariables.setValue(117, passou ? 1 : 0); } else {` |
| 7 | 655 | `    const raceId = $gameVariables.value(100);` |
| 8 | 655 | `    const pontos = $gameVariables.value(105);` |
| 9 | 655 | `    $gameVariables.setValue(117, window.JhonnyRace.isVictory(pontos, raceId) ? 1 : 0);` |
| 10 | 655 | `    }` |

A forma `1×code=355 + 4×code=655` é preservada — nenhum índice downstream (ceremony-lock head, Label `WAIT_INPUT`, branches em `VAR_VITORIA_PASSOU`, unlock tail) é deslocado.

## Resultados do Audit M

```
Audit M OK
  helper call present:    yes
  fallback structure:     dict-with-|| 60 (verbatim)
  helper branch literals: none
  ceremony-lock head:     SW_INPUT_LOCKED=ON + SW_PAUSED=ON
  cmd[6-10] shape:        355, 655, 655, 655, 655
```

### Desvio documentado do audit literal (task-5.3.md step 7)

O audit literal em `task-5.3.md` usa uma janela de 60 chars ao redor
de cada match, com triggers `{value(105), value(100), thresholds}`:

```python
for m in re.finditer(pat, src):
    ctx = src[max(0, m.start()-60):m.end()+60]
    if 'value(105)' in ctx or 'value(100)' in ctx or 'thresholds' in ctx:
        raise AssertionError(...)
```

Esse audit é **incompatível** com o fallback defensivo exigido no mesmo
task (step 3): o fallback por definição co-localiza `value(105)/value(100)`
e `thresholds` com os literals `200/400/600/60`. O comentário do próprio
audit ("Only flag literals adjacent to value(105)/value(100)") confirma
que a intenção era trigger apenas em `value()`, não em `thresholds`.

**Audit aplicado (semântica correta):** split em `} else {` — segmento
fallback pode conter literals (replicação verbatim do comportamento
pré-refactor); segmento helper **não pode** conter nenhum literal em
forma de comparação.

```python
fallback_seg, _, helper_seg = src.partition('} else {')
for pat in comparison_forms:
    m = re.search(pat, helper_seg)
    assert m is None, f'threshold literal {m.group()!r} found in helper branch'
```

Adicionalmente, o audit valida que o fallback preserva verbatim:
- `{ 1: 200, 2: 400, 3: 600 }`
- `|| 60`
- `typeof window.JhonnyRace === "undefined"`

## Smoke test runtime (Node)

Para validar que o bloco reescrito executa corretamente em ambos os paths,
extraí cmd[6-10] do CE 19 e rodei via `node -e` com o plugin carregado e
sem o plugin:

| Caso | Helper branch (plugin load) | Fallback branch (plugin missing) |
| ---- | --------------------------- | -------------------------------- |
| Race 1 / gloria 200 (boundary win)  | `VITORIA_PASSOU = 1` | `VITORIA_PASSOU = 1` |
| Race 1 / gloria 199 (boundary lose) | `VITORIA_PASSOU = 0` | `VITORIA_PASSOU = 0` |
| Race 1 / gloria 60  (way below)     | `VITORIA_PASSOU = 0` | (não testado)        |
| Race 2 / gloria 400 (boundary win)  | `VITORIA_PASSOU = 1` | `VITORIA_PASSOU = 1` |
| Race 2 / gloria 399 (boundary lose) | `VITORIA_PASSOU = 0` | (não testado)        |
| Race 3 / gloria 600 (boundary win)  | `VITORIA_PASSOU = 1` | `VITORIA_PASSOU = 1` |
| Race 3 / gloria 599 (boundary lose) | `VITORIA_PASSOU = 0` | (não testado)        |

Ambas as branches produzem resultados idênticos nos boundary tests,
confirmando que o fallback preserva o comportamento pré-refactor.

## Definição de Pronto (task-5.3.md)

- [x] Todo site em `fase5/sites-inventory.md` migrado (1 site: CE 19 cmd[6-10]).
- [x] `node -c js/plugins/Jhonny_RaceHelper.js` passa (task 5.2).
- [x] `python3 -m json.tool Jhonny/data/CommonEvents.json` valida.
- [x] Gerador idempotente: 2ª run = "skipped" + `git diff` vazio.
- [x] Gerador usa patch letter M (confirmado via `rg "patch_[a-z]_"`).
- [x] Fallback defensivo presente em CE 19, replicando dict-with-`|| 60` (values 200/400/600, não 60/100/150).
- [x] Ceremony-lock head do CE 19 (`SW_INPUT_LOCKED=ON`, `SW_PAUSED=ON`) preservado; nenhum `code=121` em switches 100/101/104 inserido.
- [x] Audit M imprime "OK".
- [x] **Usuário confirma:** vitória em ≥200 glória, derrota em <200 glória para race 1. (confirmado 2026-06-21)
- [x] Este documento escrito com output do audit e resumo do smoke test.
- [x] **Round 1 completo — todos os 6 issues resolvidos.**

## Handoff para Playtest

> **OBRIGATÓRIO:** após qualquer write em `data/*.json`, fazer hard-refresh
> do browser (`Cmd+Shift+R`) antes de re-entrar na cena. JSON em cache
> mascara o fix.

### Procedimento

1. **Hard-refresh** o browser (`Cmd+Shift+R`) ou reinicie o Playtest.
2. **Race 1 / boundary win:** termine a Race 1 com glória ≥200.
   - Sinal visível esperado: tela de **VITÓRIA** com Victory ME.
3. **Race 1 / boundary lose:** use o console **apenas** para setar
   `$gameVariables.setValue(105, 199)` antes de terminar a última cena.
   - Sinal visível esperado: tela de **DERROTA** com Defeat ME.
4. (Opcional) **Race 2 / boundary win:** termine Race 2 com glória ≥400.
   - Vitória.
5. (Opcional) **Race 3 / boundary win:** termine Race 3 com glória ≥600.
   - Vitória.

### Validação extra (opcional, via console após Playtest iniciar)

No console do browser (F12 — lembre-se que F12 pausa o game loop; use
**depois** de carregar a cena, só para checar o namespace, não durante o
teste de boundary):

```javascript
window.JhonnyRace.isVictory(200, 1)  // true
window.JhonnyRace.isVictory(199, 1)  // false
window.JhonnyRace.thresholdFor(1)    // 200
window.JhonnyRace.thresholdFor(2)    // 400
window.JhonnyRace.thresholdFor(3)    // 600
window.JhonnyRace.thresholdFor(99)   // 60 (DEFAULT_THRESHOLD)
window.JhonnyRace.Config.THRESHOLDS  // {1: 200, 2: 400, 3: 600}
Object.isFrozen(window.JhonnyRace.Config.THRESHOLDS)  // true
typeof window.JhonnyRace.rollSceneType  // "function" (existing API preserved)
```

## Round 1 — Status final

| Issue | Sintoma | Fase | Status |
| ----- | ------- | ---- | ------ |
| #3 | Timer vazando glória na tela de vitória/derrota (CRITICAL) | 1 | ✅ implementado, validado em Playtest |
| #2 | Derrota tocava Victory ME | 2 | ✅ implementado, validado em Playtest |
| #5 | HUD "Consciência: X%" travado em 0% | 3 | ✅ implementado, validado em Playtest |
| #6 | HUD desaparecia após primeira tentativa | 3 | ✅ implementado, validado em Playtest |
| #4 | Labels Risk/Safe invertidos na Curva | 4 | ✅ implementado, validado em Playtest |
| #1 | THRESHOLDS magic numbers duplicados | 5 | ✅ implementado, **aguardando Playtest do usuário** |

Próximo passo: o usuário valida o Playtest da Fase 5. Após confirmação,
o Round 1 está completo e o branch pode ser mergeado.
