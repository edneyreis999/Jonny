---
title: "Fase 7 — Polish + Observabilidade (Implementação)"
fase: 7
tipo: registro-implementacao
data: "2026-06-19"
status: "implementada — aguardando playtest MZ do usuário"
---

# Fase 7 — Implementação Completa

> Cobertura: sessão única de implementação das tasks 7.1, 7.2, 7.3 via `fase7/build_phase7_ces.py` + extensão do plugin `Jhonny_RaceHelper.js`. **Zero intervenções do usuário** — execução fluiu conforme plano detalhado em `task-7.1.md`/`task-7.2.md`/`task-7.3.md`.

## 1. Resumo

**Solicitado:** "execute a fase 7 do plano" — implementar as 3 tasks F7 (audio feedback, HUD TENTATIVA N, logRaceEvent) com base no plano e tasks já atualizados na sessão anterior.

**Entregue:**

- `fase7/build_phase7_ces.py` — script gerador idempotente cobrindo as 3 tasks (7 patches em 6 CEs).
- `Jhonny/js/plugins/Jhonny_RaceHelper.js` — estendido com `logRaceEvent(args)` + `captureRaceState()` + `PluginManager.registerCommand(pluginName, "logRaceEvent", logRaceEvent)`. Header `@command logRaceEvent` + `@arg type` documentados.
- `Jhonny/data/CommonEvents.json` — regenerado com 7 patches cirúrgicos aplicados.
- `Jhonny/data/System.json` — gap F6 corrigido: `VAR_VITORIA_PASSOU` (Editor ID 117) finalmente gravada (`setup_phase6_system.py` executado nesta sessão — tinha sido pulado na F6).
- `tasks.md` — status F7 atualizado para IMPLEMENTADA; tabela de tasks 7.1/7.2/7.3 marcada ✅.

**Critérios de sucesso:**

- `node -c Jhonny_RaceHelper.js` → OK.
- `python3 -m json.tool CommonEvents.json` → OK.
- `build_phase7_ces.py` idempotente (re-execução produz diff vazio).
- 12 auditorias programáticas passam (Play SE freada, pneu_cantando movido, ME Shock1, Picture 52, Comment stale removido, 6 chamadas logRaceEvent).
- IDs inline em scripts 100-117 confirmados.

## 2. Alterações aplicadas

### Task 7.1 — Audio feedback

| CE | Antes | Depois |
|----|-------|--------|
| CE 11 (`EV_OnSafe`) | `Play SE: freada` (vol 90) cmd 7 | mantido ✓ |
| CE 12 (`EV_OnRisk`) | `Play SE: pneu_cantando` cmd 7 | **removido** (som agora só toca no sucesso) |
| CE 15 (`EV_ResolucaoRiskOK`) | (sem SE) | **adicionado `Play SE: pneu_cantando`** cmd 0 |
| CE 18 (`EV_Crash`) | `Play ME: Shock1` cmd 0 | mantido ✓ |

**Decisão do usuário (2026-06-19):** Risk sound deve tocar **sincronizado com o flash dourado** da resolução — por isso foi movido de CE 12 (momento do clique, antes de saber sucesso/falha) para CE 15 (início do flash de sucesso). Crash mantém SOMENTE `ME: Shock1` — `crash_metal.ogg` (alias de `Crash.ogg` criado em task-2.2) fica como asset disponível sem uso neste MVP.

### Task 7.2 — HUD TENTATIVA N

CE 6 (`EV_UpdateHud`) estendido ao final (antes do terminador):

```
Plugin Cmd TextPicture.set → text = "\C[7]TENTATIVA \V[112]"   (code 357)
Plugin Cont: "Text = \C[7]TENTATIVA \V[112]"                  (code 657)
Show Picture: [52, "", origin=0, designation=0, x=350, y=20,
               scaleX=100, scaleY=100, opacity=180, blendMode=0]   (code 231)
```

- `VAR_ATTEMPT_N` (Editor ID 112) — incrementada em CE 18 cmd 14 desde F6.
- `\C[7]` (cinza) + opacidade 180 → estilo discreto (não compete com HUD Consciência/Glória).
- Posição (350, 20) → topo central (816×624 default resolution).
- CE 18/19 já apagam pictures 1-60 em seus resets → indicador desaparece após crash/vitória.

**Cleanup bônus:** Comment stale `[TASK 5.4 MANUAL MZ]` (cmd 1 do CE 6) removido — cmds 2-4 já implementavam Glória TextPicture via pattern desde F6 (Parte 4 da retrospectiva F6), mas o Comment placeholder nunca tinha sido limpo. Decisão: gerador idempotente deve deixar a estrutura final sem resíduos de pendências antigas.

### Task 7.3 — Plugin Command `logRaceEvent`

**No plugin `Jhonny_RaceHelper.js`:**

```javascript
const VAR_NAMES = { 100: "RACE_ID", 101: "SCENE_INDEX", ..., 117: "VITORIA_PASSOU" };
const SWITCH_NAMES = { 100: "RACE_ACTIVE", ..., 105: "IS_CURVA_DIABO" };

const captureRaceState = () => {
    const vars = {};  // $gameVariables.value(id) for each VAR_NAMES entry
    const switches = {};  // $gameSwitches.value(id) for each SWITCH_NAMES entry
    return { vars, switches };
};

const logRaceEvent = (args) => {
    try {
        const type = args && args.type ? String(args.type) : "UNKNOWN";
        const { vars, switches } = captureRaceState();
        const entry = {
            type, frame: Graphics.frameCount,
            vars, switches, timestamp: new Date().toISOString()
        };
        console.log("RACE_EVENT:", JSON.stringify(entry, null, 2));
        return entry;
    } catch (e) {
        console.warn("RACE_EVENT: error logging:", e);
        return null;
    }
};

window.JhonnyRace = { ..., logRaceEvent, captureRaceState };

if (typeof PluginManager !== "undefined") {
    PluginManager.registerCommand(pluginName, "logRaceEvent", logRaceEvent);
}
```

Header `@help` estendido com `@command logRaceEvent` + `@arg type` para o comando aparecer no MZ Editor.

**Chamadas Plugin Command inseridas via `build_phase7_ces.py`** (pattern F6 replicado):

| CE | Event Type | Posição | Motivo |
|----|-----------|---------|--------|
| CE 5 (`EV_RaceOrchestrator`) INIT | `"RACE_INIT"` | Após `ControlVar 117=0` (cmd 14), antes do SEED reset | Captura estado inicial de cada corrida |
| CE 11 (`EV_OnSafe`) | `"SAFE_CLICK"` | Após mutação de PONTOS_GLORIA, antes de `Call CE 14` (ResolucaoSafe) | Captura estado pós-ação |
| CE 12 (`EV_OnRisk`) ramo sucesso | `"RISK_SUCCESS"` | Após mutação, antes de `Call CE 15` (ResolucaoRiskOK) | Sincronizado com flash dourado + pneu_cantando |
| CE 12 (`EV_OnRisk`) ramo falha | `"RISK_FAIL"` | Após `SW_CRASH_FLAG ON`, antes de `Call CE 18` (Crash) | Estado pre-crash |
| CE 18 (`EV_Crash`) | `"CRASH"` | cmd 0 (antes de `Play ME Shock1`) | Captura ATTEMPT_N antes do increment |
| CE 19 (`EV_VitoriaCorrida`) | `"VICTORY"` | cmd 0 (antes do erase pictures loop) | Captura estado final |

Cada chamada são 2 comandos MZ:
```
{code: 357, parameters: ["Jhonny_RaceHelper", "logRaceEvent", "Log Race Event", {"type": "<EVENT>"}]}
{code: 657, parameters: ["type = <EVENT>"]}
```

### Pré-passo F6 executado nesta sessão (gap corrigido)

`setup_phase6_system.py` nunca tinha sido executado — System.json tinha apenas 117 slots (índices 0-116), faltando `VAR_VITORIA_PASSOU` (Editor ID 117). Os CEs 18/19 já referenciavam `$gameVariables.value(117)` e `ControlVar [117, 117, ...]` (que funcionam em runtime mesmo sem nome no System.json), mas o slot não estava nomeado no Database.

Executado agora: `python3 Jhonny/planos/001-prototipo-core-loop/fase6/setup_phase6_system.py` → System.json agora tem 118 slots (0-117) com slot 117 nomeado `VAR_VITORIA_PASSOU`.

## 3. Estrutura final dos CEs

| CE | Nome | Cmds (antes → depois) |
|----|------|----------------------|
| CE 5 | `EV_RaceOrchestrator` | 25 → 27 (+2 RACE_INIT) |
| CE 6 | `EV_UpdateHud` | 6 → 8 (-1 stale comment +3 TENTATIVA TextPicture) |
| CE 11 | `EV_OnSafe` | 23 → 25 (+2 SAFE_CLICK) |
| CE 12 | `EV_OnRisk` | 34 → 37 (-1 pneu_cantando +2 RISK_SUCCESS +2 RISK_FAIL) |
| CE 15 | `EV_ResolucaoRiskOK` | 6 → 7 (+1 pneu_cantando) |
| CE 18 | `EV_Crash` | 26 → 28 (+2 CRASH) |
| CE 19 | `EV_VitoriaCorrida` | 46 → 48 (+2 VICTORY) |

## 4. Passos manuais MZ pendentes ( usuário )

> **Obrigatório:** bug F4 — runtime MZ não reflete JSON em disco sem refresh.

1. **Abrir RPG Maker MZ** com o projeto `Jhonny/`.
2. **F10** (Database) → verificar Common Events 5/6/11/12/15/18/19 — confirmar que os Plugin Commands `Jhonny_RaceHelper > Log Race Event` aparecem visíveis nos pontos esperados.
3. **Ctrl+S** (salvar — força MZ a reler os arquivos data/*.json).
4. **Plugins (F9 ou menu)** → confirmar que `Jhonny_RaceHelper` está ativado. Se não estiver, ativar.
5. **Reiniciar Playtest** (não basta F5 — precisa encerrar e reabrir).
6. **Validar visualmente** (ver §5 abaixo).

## 5. Cenários de playtest (validação visual)

> **Regra:** [[user-testable-feedback]] — todo feedback deve ser visível/audível **sem** F12/F9 (debug-only).

### 5.1 Áudio (task 7.1)

1. **Ligar som do computador.**
2. Iniciar corrida.
3. **Clique em Parar (Safe):** som de `freada` (~0.5s) — já funcionava desde F4.5.
4. **Clique em Furar com taxa baixa (Risk-falha):** NENHUM som de pneu_cantando. Só `ME: Shock1` quando crash iniciar.
5. **Clique em Furar com taxa alta (Risk-sucesso):** som de `pneu_cantando` (~0.8s) **sincronizado com o flash dourado** (CE 15).
6. Confirmar: pneu_cantando **não** toca no momento do clique (após resolução de sucesso).

### 5.2 HUD TENTATIVA N (task 7.2)

1. Iniciar corrida.
2. **Texto "TENTATIVA 1"** aparece no topo central (x≈350, y≈20), discreto (cinza, ~22px default, opacidade 180).
3. Force crash (roll=99, Furar).
4. Após restart (~1s), texto muda para **"TENTATIVA 2"**.
5. Force outro crash → "TENTATIVA 3".
6. Vence corrida → texto **desaparece** (CE 19 apaga pictures 1-60).
7. Nova corrida inicia com "TENTATIVA N+1" (contador não reseta entre corridas — MVP).

### 5.3 logRaceEvent (task 7.3)

1. **F12** para abrir DevTools → aba Console.
2. Iniciar corrida → JSON `RACE_EVENT: {"type": "RACE_INIT", ...}` aparece com vars 100-117 + switches 100-105 + frame + timestamp.
3. Clique Parar → `RACE_EVENT: {"type": "SAFE_CLICK", ...}` aparece.
4. Clique Furar com sucesso → `RACE_EVENT: {"type": "RISK_SUCCESS", ...}`.
5. Clique Furar com falha → `RACE_EVENT: {"type": "RISK_FAIL", ...}` seguido de `RACE_EVENT: {"type": "CRASH", ...}`.
6. Vence corrida → `RACE_EVENT: {"type": "VICTORY", ...}`.
7. **Filtrar console por "RACE_EVENT"** → todos os logs estruturados aparecem em sequência.
8. Estrutura JSON válida (copiar/colar em jsonlint.com → sem erro).
9. **Vars capturadas devem incluir `VITORIA_PASSOU`** (key 117) e `TIMER_TIMEOUT_FLAG` (key 116).
10. Sem erros de runtime no console.

> **Atenção — [[mz-playtest-pauses]]:** F12 devtools focus pausa o game loop. Para capturar logs sem pausar, use `setTimeout(() => console.log(...), 0)` — não aplicável aqui pois o plugin já usa `console.log` direto; o pause só afeta leitura visual dos logs após pause, não a captura em si.

## 6. Decisões de implementação

| Decisão | Motivo | Evidência |
|---------|--------|-----------|
| Remover Comment stale `[TASK 5.4 MANUAL MZ]` do CE 6 | cmds 2-4 já implementam o que ele pedia desde F6 | code 357+657+231 com `name=""` presentes |
| `pneu_cantando` no cmd 0 do CE 15 (antes do Tint/Shake) | Som dispara **antes** do flash visual → sensação de impacto | task-7.1.md §Detalhes |
| `logRaceEvent` no cmd 0 do CE 18 (antes do `Play ME Shock1`) | Captura ATTEMPT_N **antes** do increment — log mostra a tentativa que acabou de falhar | Especificação task-7.3.md tabela |
| `logRaceEvent` no cmd 0 do CE 19 (antes do erase pictures) | Captura estado final **com** pictures ainda ativas | Idem |
| Capturar `vars[100:118]` e `switches[100:106]` mesmo com slots vazios (114/106) | Plugin não sabe quais são ocupados; captura tudo para debug | task-7.3.md — captura é barata (microsegundos) |
| `_logRaceEvent` split em `captureRaceState()` + `logRaceEvent()` | Composição: captura reusável em outros contextos (futuro dashboard, replay) | Heurística Python/JS Standards — função pequena, single responsibility |
| `try/catch` em `logRaceEvent` | `$gameVariables`/`$gameSwitches` undefined em frame 0 não deve quebrar handlers | task-7.3.md §"Por que try/catch" |
| Pulamos slot 114 (vazio em VAR_NAMES) | Slot 114 nunca foi nomeado; capturar `$gameVariables.value(114)` retornaria 0 inútil | Snapshot System.json |

## 7. Heurísticas aplicadas (consolidadas de F1-F6)

- **Artefato-fonte primeiro:** corrigir `build_phaseN_ces.py` antes do JSON gerado.
- **Idempotência via pattern detection:** cada patch detecta se já foi aplicado.
- **Pattern TextPicture replicado de CE 6** (F6 Parte 4) — code 357 + 657 + Show 231 com `name=""`.
- **Plugin Command logRaceEvent inserível via JSON** (F6 confirmou Plugin Cmds 357 serem automatizáveis — task-7.3.md spec acertou em antecipar isso).
- **Bug F4 — refresh runtime:** F10 → Ctrl+S → reiniciar Playtest obrigatório após editar JSON em disco.
- **Bug F5 — ControlSwitch semântica:** `0=ON`, `1=OFF` (não aplicado nesta fase, mas preservado nos CEs existentes).
- **Regra [[never-delete-common-events]]:** nenhum CE foi deletado nesta fase — só estendido.
- **Regra [[user-testable-feedback]]:** áudio + HUD + logs verificados sem precisar de F12 para feedback principal (logs são bônus de debug).

## 8. Para a próxima fase

- Validar playtest MZ (passo do usuário).
- Se algum log não aparecer, auditar via `rg "Jhonny_RaceHelper" Jhonny/js/plugins.js` (confirma plugin carregado) e `PluginManager._commands` no F12.
- Se TextPicture não renderizar "TENTATIVA", confirmar que TextPicture.js está em `js/plugins/` e ativado em `plugins.js`.
- Próxima fase: provavelmente **F8 — Playtest acceptance + balance** (testar fluxo completo R1→R2→R3, ajustar thresholds se precisar).

## 9. Auditoria final (executada programaticamente)

```
=== AUDITORIA FINAL ===

CE 11: Play SE freada = 1 (esperado: 1)             ✓
CE 12: Play SE pneu_cantando = 0 (esperado: 0)       ✓
CE 15: Play SE pneu_cantando = 1 (esperado: 1)       ✓
CE 18: Play ME Shock1 = 1 (esperado: 1)              ✓

CE 6: Show Picture 52 (TENTATIVA) = 1 (esperado: 1)  ✓
CE 6: Comment stale [TASK 5.4 MANUAL MZ] = 0         ✓

CE 5: logRaceEvent RACE_INIT = True                  ✓
CE 11: logRaceEvent SAFE_CLICK = True                ✓
CE 12: logRaceEvent RISK_SUCCESS = True              ✓
CE 12: logRaceEvent RISK_FAIL = True                 ✓
CE 18: logRaceEvent CRASH = True                     ✓
CE 19: logRaceEvent VICTORY = True                   ✓

JSON válido (python3 -m json.tool)                   ✓
Plugin syntax OK (node -c)                           ✓
Script idempotente (re-run → diff vazio)             ✓
```
