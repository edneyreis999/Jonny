---
status: validated
phase: 1
task_id: 1.3
generated_at: 2026-06-20
validated_at: 2026-06-20
revision: 2 (closes race condition discovered in first Playtest)
---

# Fase 1 — Completa v2 (pending Playtest)

Correção do **exploit de glória infinita na tela cerimonial** (issue #3).

**v1** (2026-06-20 manha): Patch A apenas — set INPUT_LOCKED=ON + PAUSED=ON
no topo do CE 19. Funcionou na tentativa 1, falhou na tentativa 2+.

**v2** (2026-06-20 tarde): identifiquei uma race condition entre Patch A e
CE 14 (Safe cleanup). Adicionei Patches D/E/F para promover SW_PAUSED a
sinal cerimonial robusto. Detalhes em `findings.md` §9.

## Resumo da mudança v2

`Jhonny/data/CommonEvents.json` — quatro edições coordenadas:

### CE 19 (`EV_VitoriaCorrida`) — head + exit

```
[0]  code=121 [101,101,0]    # SW_INPUT_LOCKED = ON     (Patch A, v1)
[1]  code=121 [104,104,0]    # SW_PAUSED       = ON     (Patch A, v1)
... (existing commands) ...
[29] Label WAIT_INPUT
[30] If !Input.isTriggered('ok'):
[31]   Wait 1
[32]   Jump WAIT_INPUT
[33] End
[34] code=121 [104,104,1]    # SW_PAUSED = OFF         (Patch D, v2 — NEW)
[35] ErasePicture ...
```

### CE 10 (`EV_RaceTimer`) — PAUSED guard

```
[0]  Label TICK
[1-3] If RACE_ACTIVE==OFF: Exit
[4]  If PAUSED==ON:          # Patch E, v2 — NEW
[5]    Wait 1
[6]    Jump TICK
[7]  End
[8]  If INPUT_LOCKED==ON:    # existing (was cmd[4])
[9]    Wait 1
[10]   Jump TICK
[11] End
[12] If TIMER_FRAMES<=0:
...
```

### CE 11 (`EV_OnSafe`) — PAUSED guard at head

```
[0]  If PAUSED==ON: Exit     # Patch F, v2 — NEW
[1]    Exit
[2]  End
[3]  If RACE_ACTIVE==OFF: Exit    # existing (was cmd[0])
[4]    Exit
[5]  End
[6]  If INPUT_LOCKED==ON: Exit    # existing (was cmd[3])
[7]    Exit
[8]  End
[9]  SET INPUT_LOCKED=ON
...
[16] code=122 [105,105,1,0,10]   # PONTOS_GLORIA += 10
```

## Por que a v2 fecha o exploit

Cadeia do bug em v1 (uma Safe action final do jogador pode disparar a
condição de corrida):

1. Jogador clica `btn_parar` (Safe) → ButtonPicture line 89 chama
   `$gameTemp.reserveCommonEvent(11)` → CE 11 entra na fila do
   **interpretador do mapa**.
2. CE 11 roda no interpretador do mapa: SET INPUT_LOCKED=ON, +10 glória,
   SCENE_INDEX++, log SAFE_CLICK, Call CE 14.
3. CE 14 cmd[2] Wait 12 frames — **bloqueia o interpretador do mapa**.
4. Durante esses 12 frames, **CE 7 (interpretador paralelo independente)**
   vê SCENE_INDEX >= RACE_N_CENAS e chama CE 19.
5. Patch A no interpretador de CE 7: SET INPUT_LOCKED=ON, SET PAUSED=ON,
   log VICTORY, entra em WAIT_INPUT.
6. Após 12 frames, CE 14 cmd[3] no interpretador do mapa: SET INPUT_LOCKED=OFF
   — **sobrescreve Patch A**.
7. CE 10 vê INPUT_LOCKED=OFF, decrementa TIMER_FRAMES.
8. TIMER_FRAMES chega a 0 → CE 10 chama CE 11 → CE 11 guarda vê
   INPUT_LOCKED=OFF, não dispara → +10 glória → chama CE 14 → CE 14 limpa
   INPUT_LOCKED de novo. Ciclo se repete.

Cadeia após v2 (Patch D/E/F):

1-6. Mesmo que v1: CE 14 limpa INPUT_LOCKED, mas PAUSED permanece ON (ninguém
   o limpa até Patch D).
7. CE 10 cmd[4] vê PAUSED=ON → Jump TICK sem decrementar. Timer congela.
8. CE 11 (mesmo chamado por algum caminho) cmd[0] vê PAUSED=ON → Exit. Sem
   glória.
9. Jogador pressiona espaço → CE 19 WAIT_INPUT sai → cmd[34] Patch D seta
   PAUSED=OFF → CE 19 continua para CE 5 (próxima raça) ou CE 18 (crash).
10. Próxima raça: PAUSED=OFF, CE 10 e CE 11 voltam ao normal.

## Evidências de auditoria (Task 1.3 step 4, v2)

### Run 1 (aplica patches)

```
Patch A: skipped (ceremony lock already present)
Patch B: skipped (timer guards already present)
Patch C: skipped (safe INPUT_LOCKED guard already present)
Patch D: applied (inserted PAUSED=OFF at CE19 cmd[34]; 55 cmds)
Patch E: applied (inserted PAUSED guard at CE10 cmd[4]; 24 cmds)
Patch F: applied (inserted PAUSED guard at CE11 head; 28 cmds)
JSON escrito: Jhonny/data/CommonEvents.json
```

### JSON válido

```
$ python3 -m json.tool Jhonny/data/CommonEvents.json > /dev/null && echo valid
valid
```

### Run 2 (idempotência)

```
Patch A: skipped
Patch B: skipped
Patch C: skipped
Patch D: skipped (PAUSED clear after WAIT_INPUT already present)
Patch E: skipped (timer PAUSED guard already present)
Patch F: skipped (safe PAUSED guard already present)
Nenhuma mudança aplicada — JSON não regravado.
```

`diff` entre Run 1 e Run 2: **vazio** (idempotência confirmada).

### Audit A — CE 19 head

```
Audit A OK — ceremony lock present, SW_RACE_ACTIVE untouched
```

### Audit B — CE 10 timer RACE_ACTIVE + INPUT_LOCKED guards

```
Audit B OK — timer aborts on RACE_ACTIVE OFF and waits on INPUT_LOCKED ON
```

### Audit C — CE 11 safe INPUT_LOCKED guard

```
Audit C OK — guard at cmd[6], glory award at cmd[16]
```

### Audit D — CE 19 PAUSED clear after WAIT_INPUT

```
Audit D OK — PAUSED=OFF cleared after WAIT_INPUT before pictures are erased
```

### Audit E — CE 10 PAUSED guard

```
Audit E OK — CE 10 jumps TICK when PAUSED==ON (before INPUT_LOCKED check)
```

### Audit F — CE 11 PAUSED guard at head

```
Audit F OK — PAUSED guard at cmd[0], glory award at cmd[16]
```

### Indent compliance (memory `rpg-mz-indent-skipbranch`)

- CE 10 PAUSED guard: branch indent 0, inner cmds (Wait/Jump) indent 1, End indent 0 ✓
- CE 11 PAUSED guard: branch indent 0, Exit indent 1, End indent 0 ✓
- CE 19 PAUSED clear: single cmd indent 0 ✓

## Diff git

```
$ git diff --stat Jhonny/data/CommonEvents.json
Jhonny/data/CommonEvents.json | 76 ++++++++++++++++++++++++++++++++++++++++++-
1 file changed, 75 insertions(+), 1 deletion(-)
```

A v2 adiciona 8 novos comandos (1 + 4 + 3) aos 2 do Patch A v1, totalizando
10 inserts. O `+1/-1` final é apenas o newline normalizado.

## Roteiro de Playtest v2 (handoff)

> **Importante (memory `mz-playtest-pauses`):** NÃO abra F12 DevTools.

### Setup

```bash
cd Jhonny
python3 -m http.server 8000
# Abrir http://localhost:8000
```

### Cenário 1 — Victory screen idle (tentativa 1)

1. Complete a Raça 1 com sucesso.
2. Na tela de VITÓRIA, **não pressione espaço**.
3. Aguarde **30 segundos**.
4. **Esperado:** número "Pontos de Glória: N" **não muda**.
5. Pressione espaço → vai para a próxima raça.

### Cenário 2 — Defeat screen idle (tentativa 1)

1. Falhe intencionalmente a Raça 1 (Risk com falha).
2. Na tela de DERROTA, **não pressione espaço**.
3. Aguarde **30 segundos**.
4. **Esperado:** número **não muda**.
5. Pressione espaço → reinicia a mesma raça.

### Cenário 3 — Defeat screen idle após restart (CRÍTICO — bug da v1)

1. Cenário 2 → pressione espaço → reinicia Raça 1.
2. **Na segunda tentativa (ATTEMPT_N=2+)**, falhe intencionalmente de novo.
3. Na tela de DERROTA, **não pressione espaço**.
4. Aguarde **30 segundos**.
5. **Esperado (v2):** número **não muda**. (v1 falhava aqui.)
6. Pressione espaço → reinicia a mesma raça.

### Cenário 4 — Múltiplos restarts

1. Repita Cenário 3 até ATTEMPT_N=5+.
2. Em todas as telas de DERROTA, glória **não aumenta** durante idle.

### Cenário 5 — Regressão: continue input funciona

1. Em qualquer tela cerimonial, pressione espaço imediatamente.
2. A tela deve sair dentro de ~1 frame.
3. A próxima raça deve iniciar normalmente (timer conta regressivo, input
   responde).

## Definition of Done — Task 1.3 (v2)

- [x] Primeira execução do gerador aplicou D/E/F (A/B/C skipados).
- [x] `python3 -m json.tool` valida o JSON.
- [x] Segunda execução do gerador printa "skipped" x6 com `git diff` vazio.
- [x] Audits A-F imprimem "OK".
- [x] Indent compliance verificado.
- [x] `fase1/fase-1-completa.md` atualizado com análise v2.
- [x] **Validado em Playtest (2026-06-20):** usuário confirmou que o bug não
      recursa em tentativas 2+. Cenários 1-5 todos passam. Fase 1 fechada.

## Notas para a próxima fase

- **Fase 2 (defeat ME):** o asset de áudio de derrota ainda precisa ser
  confirmado em `Jhonny/audio/me/`. O `PlaySE Victory1` atual em CE 19
  cmd[6] (após Patch A) é o alvo da troca.
- **Fase 5 (THRESHOLDS refactor):** o threshold atual em CE 19 cmd[9]
  (após Patch A) é `{1: 200, 2: 400, 3: 600}` com fallback 60 — diverge
  da spec (60/100/150). Confirmar com o usuário qual é canônico antes de
  extrair para `window.JhonnyRace`.
- **CE 15 (EV_ResolucaoRiskOK)** tem o mesmo padrão de CE 14 (clear
  INPUT_LOCKED no cleanup cmd[5]). Não afeta o exploit de glória (CE 12
  Risk não dá glória), mas vale considerar adicionar PAUSED guard por
  consistência defensiva. Adiar para Fase 2 ou posterior.
