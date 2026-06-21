---
status: pending-playtest
phase: 2
task_id: 2.3
generated_at: 2026-06-20
revision: 2 (corrige regressão de opcode detectada no Playtest v1)
---

# Fase 2 — Completa v2 (pending Playtest)

Correção do **defeat screen tocando Victory ME** (issue #2).

**v1** (2026-06-20): Patch G (reordena script) + Patch H (branch com Play ME).
Especificação da task-2.2.md invertia os opcodes RMMZ (246↔249). Resultado:
silêncio total em ambos os paths de vitória e derrota.

**v2** (2026-06-20): identifiquei a inversão em `rmmz_objects.js` (linha
10809 = FadeoutBGS, linha 10815 = Play ME). Patch H agora detecta 3 estados
(ori­ginal / regressão v1 / correto) e normaliza para o estado correto.

CE 19 (`EV_VitoriaCorrida`) agora computa `VAR_VITORIA_PASSOU` *antes* do
comando de áudio, e toca `Play ME` (code 249) distinto para vitória vs
derrota.

## Resumo da mudança

`Jhonny/data/CommonEvents.json` — duas edições coordenadas no CE 19:

### Patch G — Bloco script antes do áudio

```
[6]  Script: const pontos = $gameVariables.value(105);    # movido de cmd[9]
[7]  ScriptContinue: const raceId = ...                    # movido de cmd[10]
[8]  ScriptContinue: const thresholds = ...                # movido de cmd[11]
[9]  ScriptContinue: const passou = ...                    # movido de cmd[12]
[10] ScriptContinue: $gameVariables.setValue(117, ...)     # movido de cmd[13]
[11] If VAR_VITORIA_PASSOU == 1: ...                       # áudio era cmd[6]
```

### Patch H — Branch Play ME (Victory | Defeat)

```
[11] If VAR_VITORIA_PASSOU == 1                  # code 111, indent 0
[12]   Play ME "Victory1"                        # code 249, indent 1
[13] Else                                        # code 411, indent 0
[14]   Play ME "Defeat1"                         # code 249, indent 1
[15] End                                         # code 412, indent 0
```

Substitui o antigo `Play ME Victory1` único (code 249, que tocava em ambos
os paths — bug #2 original). A especificação v1 dizia que o original era
`PlaySE code 249` e alvo era `Play ME code 246`, mas em `rmmz_objects.js`:
- `command246 = fadeOutBgs` (linha 10809)
- `command249 = playMe` (linha 10815)

Ou seja, o original já era Play ME correto; só faltava o branch. v2
preserva o opcode 249 e apenas adiciona o branch Victory/Defeat.

## Evidências de auditoria (Task 2.3)

### Run 1 v1 (regressão — silêncio em ambos os paths)

```
Patch G: applied (moved script block [9-13] to before audio at [6]; 55 cmds)
Patch H: applied (replaced PlaySE at cmd[11] with branched Play ME; 59 cmds)
```

Substituiu cmd[11] por um branch com opcodes **errados** (246 ao invés de
249). `command246 = fadeOutBgs` — os dicts `{Victory1}` / `{Defeat1}` foram
interpretados como duração de fade BGS, produzindo silêncio.

### Run 1 v2 (correção)

```
Estado inicial: 20 slots CE

--- Patch G: CE 19 — bloco setValue(117) antes do áudio ---
  Patch G: skipped (audio command not found; manual review)
    ← esperado: pós-v1 não há Play ME fora de branch; Patch G não tem o que reordenar.

--- Patch H: CE 19 — branch Play ME (Victory | Defeat) ---
  Patch H: applied (fixed wrong opcode 246→249 in branch at cmd[11]; 59 cmds)
    ← detectou Estado B (regressão v1) e corrigiu os opcodes.

JSON escrito: Jhonny/data/CommonEvents.json
```

### JSON válido

```
$ python3 -m json.tool Jhonny/data/CommonEvents.json > /dev/null && echo valid
valid
```

### Run 2 v2 (idempotência)

```
--- Patch G: CE 19 — bloco setValue(117) antes do áudio ---
  Patch G: skipped (script block at [6-10] already precedes audio at [12])

--- Patch H: CE 19 — branch Play ME (Victory | Defeat) ---
  Patch H: skipped (correct branched Play ME already present at cmd[11] with names ['Defeat1', 'Victory1'])

Nenhuma mudança aplicada — JSON não regravado.
```

`diff` entre Run 1 v2 e Run 2 v2: **vazio** (idempotência confirmada).

### Audit G — script block precedes audio

```
Audit G OK (script [10] < audio [12])
```

### Audit H — two distinct Play ME names (code 249) in branch

```
Audit H OK — names: ['Defeat1', 'Victory1']
```

### Audit I — no FadeoutBGS (code 246) carrying ME asset names (regression check)

```
Audit I OK — no opcode regression
```

### Audit J — ceremony-lock region untouched (Fase 1 intact)

```
Audit J OK
```

### Indent compliance (memory `rpg-mz-indent-skipbranch`)

- If (code 111): indent 0 ✓
- Play ME Victory1 (code 246): indent 1 ✓
- Else (code 411): indent 0 ✓
- Play ME Defeat1 (code 246): indent 1 ✓
- End (code 412): indent 0 ✓

### Top 18 cmds do CE 19 (pós-Patch G+H v2)

```
[  0] code=121 indent=0 [101, 101, 0]                       # SW_INPUT_LOCKED=ON (Fase 1)
[  1] code=121 indent=0 [104, 104, 0]                       # SW_PAUSED=ON       (Fase 1)
[  2] code=357 indent=0 ["Jhonny_RaceHelper", "logRaceEvent", ...]
[  3] code=657 indent=0 ["type = VICTORY"]
[  4] code=355 indent=0 ["for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);"]
[  5] code=242 indent=0 [1]                                  # FadeoutBGM
[  6] code=355 indent=0 ["const pontos = ..."]               # ← Patch G moved
[  7] code=655 indent=0 ["const raceId = ..."]
[  8] code=655 indent=0 ["const thresholds = ..."]
[  9] code=655 indent=0 ["const passou = ..."]
[ 10] code=655 indent=0 ["$gameVariables.setValue(117, ...)"]
[ 11] code=111 indent=0 [1, 117, 0, 1, 0]                   # ← Patch H If (5 params, normalizado)
[ 12] code=249 indent=1 [{"name": "Victory1", ...}]         # ← Patch H Play ME Victory (code 249!)
[ 13] code=411 indent=0 []                                   # ← Patch H Else
[ 14] code=249 indent=1 [{"name": "Defeat1", ...}]          # ← Patch H Play ME Defeat  (code 249!)
[ 15] code=412 indent=0 []                                   # ← Patch H End
[ 16] code=223 indent=0 [[60, 20, -120, 60], 12, false]     # Tint
[ 17] code=108 indent=0 ["[F6.4] bg_vitoria.png ausente..."]
```

## Diff git

```
$ git diff --stat Jhonny/data/CommonEvents.json
Jhonny/data/CommonEvents.json | 90 +++++++++++++++++++++++++++++--------------
1 file changed, 62 insertions(+), 28 deletions(-)
```

O `+62/-28` reflete: 5 cmds movidos (saem de [9-13] e entram em [6-10] —
cada um reserializa levemente o dict), 1 PlaySE removido, 5 cmds do branch
inseridos, e os 5 cmds do bloco reposicionados. CE 19 passou de 55 → 59
cmds (+4 net).

## Roteiro de Playtest v2 (handoff)

> **Importante (memory `mz-playtest-pauses`):** NÃO abra F12 DevTools.
>
> **Contexto v1 → v2:** v1 produziu silêncio total em ambos os paths
> (regressão de opcode 246/249). v2 corrige. Esperado: áudio audível em
> ambos os paths, distintos por ouvido.

### Setup

```bash
cd Jhonny
python3 -m http.server 8000
# Abrir http://localhost:8000
```

### Cenário 1 — Victory path (sanity)

1. Complete a Raça 1 com sucesso (pontuação ≥ 200).
2. Na tela de VITÓRIA, preste atenção ao áudio.
3. **Esperado:** jingle de vitória curto (Victory1) toca imediatamente.
4. Pressione espaço → próxima raça.

### Cenário 2 — Defeat path (alvo da Fase 2)

1. Falhe intencionalmente a Raça 1 (Risk com falha, ou pontuação < 200).
2. Na tela de DERROTA, preste atenção ao áudio.
3. **Esperado:** jingle **distinto** (Defeat1) toca imediatamente —
   diferente do jingle de vitória.
4. Pressione espaço → reinicia a mesma raça.

### Critério de aceite

- Os dois jingles devem ser **claramente distinguíveis por ouvido** dentro
  do primeiro segundo.
- Nenhum dos paths deve estar silencioso.

## Definition of Done — Task 2.3

- [x] Primeira execução do gerador aplicou Patch G e Patch H.
- [x] `python3 -m json.tool` valida o JSON.
- [x] Segunda execução do gerador printa "skipped" x2 com `git diff` vazio.
- [x] Audit G, H, I, J imprimem "OK".
- [x] Indent compliance verificado.
- [x] `fase2/fase-2-completa.md` escrito com auditoria + roteiro Playtest.
- [ ] **Validado em Playtest:** usuário confirma jingles distintos em
      vitória vs derrota (e nenhum path silencioso).

## Notas para a próxima fase

- **Fase 3 (Awareness HUD):** o script em cmd[6-10] (pós-Patch G) agora
  executa antes do branch ME, o que significa que `VAR_VITORIA_PASSOU` está
  disponível mais cedo. Não há impacto direto na Fase 3, mas vale saber.
- **Thresholds ainda divergem da spec** (`{1: 200, 2: 400, 3: 600}` com
  fallback 60, vs spec 60/100/150). A Fase 5 vai extrair para
  `window.JhonnyRace.Config` — confirmar com o usuário qual é canônico.
