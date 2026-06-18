---
title: "Fase 4 — Debug R3 (rastreamento via monkey-patch)"
type: diagnostico
fase: 4
data: "2026-06-18"
status: "diagnostico-r3"
depends_on: "[[fase4/debug-r2]]"
---

# Fase 4 — Debug R3 (rastreamento via monkey-patch)

## Resultado do R2

| Hipótese | Output | Veredito |
|----------|--------|----------|
| **A** — `$dataCommonEvents[11]` undefined | `CE 11 definido?: true`, `trigger: 0`, `list.length: 11` | **DESCARTADA** |
| **B** — `$gameMap._interpreter` sempre running | `isRunning(): false`, `_list set?: false` | **DESCARTADA** |
| **C** — CE 11 com `list` vazio | `list.length: 11` | **DESCARTADA** |

**Bug real isolado (idêntico nos 3 cenários — antes do play, após iniciar, após 10s):**

```
queue após reserve: 1
amostra 1-6 (1.5s): queue=1  ← FILA NUNCA CONSUMIDA
SW_INPUT_LOCKED final: false
```

Apesar de:
- CE 11 corretamente carregado
- `$gameMap._interpreter` livre

…o `setupReservedCommonEvent` não é chamado.

## Mecanismo confirmado no código RMMZ

### `Game_Map.update` requer `sceneActive=true`

`rmmz_objects.js:6702`:
```javascript
Game_Map.prototype.update = function(sceneActive) {
    this.refreshIfNeeded();
    if (sceneActive) {
        this.updateInterpreter();    // ← SÓ se sceneActive=true
    }
    this.updateEvents();              // ← SEMPRE (parallel CEs rodam daqui)
};
```

### `Scene_Map.updateMain` passa `this.isActive()` como sceneActive

`rmmz_scenes.js:841`:
```javascript
Scene_Map.prototype.updateMain = function() {
    $gameMap.update(this.isActive());    // ← sceneActive = this.isActive()
    $gamePlayer.update(this.isPlayerActive());
    $gameTimer.update(this.isActive());
    $gameScreen.update();
};
```

### `isActive()` retorna `_active`

`rmmz_scenes.js:32`:
```javascript
Scene_Base.prototype.isActive = function() {
    return this._active;     // ← false durante fade/transition
};
```

## Contradição explicada

- **CE 10 (RaceTimer, Parallel) roda** → via `updateEvents()` (sempre) → timer decrementa ✓
- **Reserved CEs não processam** → `updateInterpreter()` requer `isActive()=true`
- **Conclusão**: `_active` está false em runtime, apesar de scene aparentemente carregada

Possíveis causas para `_active=false`:

| # | Causa | Como confirmar |
|---|-------|----------------|
| **D1** | Scene não é Scene_Map (sobreposição por Scene_Menu/Scene_Message invisível) | `SceneManager._scene.constructor.name` |
| **D2** | Scene está em fade-in/fade-out contínuo (loop de transição) | `SceneManager._scene._active` |
| **D3** | `_active` em estado inválido (Plugin alterou) | Verificar plugins carregados |
| **D4** | `Game_Map.update` chamado por outro caminho que não respeita `sceneActive` | Monkey-patch em `update` |

## Teste único com monkey-patches (R3)

No console F12, com a corrida ativa (botões visíveis na tela, timer decrementando), colar este bloco **uma vez**:

```javascript
console.log('========= DIAGNÓSTICO R3 =========');

// ----- 1. ESTADO DA SCENE -----
console.log('--- 1. ESTADO DA SCENE ---');
const scene = SceneManager._scene;
console.log('Scene constructor:', scene?.constructor?.name);
console.log('scene._active:', scene?._active);
console.log('scene.isActive():', scene?.isActive?.());
console.log('scene.isReady():', scene?.isReady?.());
console.log('scene.isStarted():', scene?._started);
console.log('Children da scene:', scene?.children?.map(c => c?.constructor?.name));
console.log('SceneManager._stack:', SceneManager._stack?.map(s => s?.name));

// ----- 2. ESTADO DO GAME_MAP -----
console.log('--- 2. ESTADO DO GAME_MAP ---');
console.log('$gameMap._mapId:', $gameMap._mapId);
console.log('$gameMap._interpreter.isRunning():', $gameMap._interpreter.isRunning());
console.log('SW_RACE_ACTIVE (100):', $gameSwitches.value(100));
console.log('queue atual:', $gameTemp._commonEventQueue.length);

// ----- 3. MONKEY-PATCHES DE RASTREAMENTO -----
console.log('--- 3. INSTALANDO PATCHES ---');
const _GameMap_update = Game_Map.prototype.update;
const _GameMap_updateInterpreter = Game_Map.prototype.updateInterpreter;
const _Game_Interpreter_setupReserved = Game_Interpreter.prototype.setupReservedCommonEvent;
const _Game_Map_setupStartingEvent = Game_Map.prototype.setupStartingEvent;

let updateCalls = 0;
let updateWithSceneActive = 0;
let updateInterpreterCalls = 0;
let setupStartingCalls = 0;
let setupReservedCalls = 0;

Game_Map.prototype.update = function(sceneActive) {
    updateCalls++;
    if (sceneActive) updateWithSceneActive++;
    return _GameMap_update.call(this, sceneActive);
};

Game_Map.prototype.updateInterpreter = function() {
    updateInterpreterCalls++;
    return _GameMap_updateInterpreter.call(this);
};

Game_Map.prototype.setupStartingEvent = function() {
    setupStartingCalls++;
    return _Game_Map_setupStartingEvent.call(this);
};

Game_Interpreter.prototype.setupReservedCommonEvent = function() {
    setupReservedCalls++;
    console.log(`[t=${Graphics.frameCount}] setupReservedCommonEvent CHAMADO (queue antes: ${$gameTemp._commonEventQueue.length})`);
    const result = _Game_Interpreter_setupReserved.call(this);
    console.log(`[t=${Graphics.frameCount}] setupReservedCommonEvent retornou: ${result} (queue depois: ${$gameTemp._commonEventQueue.length})`);
    return result;
};

// ----- 4. RESERVAR E MONITORAR -----
console.log('--- 4. RESERVANDO CE 11 ---');
$gameTemp.reserveCommonEvent(11);
console.log('queue após reserve:', $gameTemp._commonEventQueue.length);

setTimeout(() => {
    console.log('--- 5. RESULTADO APÓS 2 SEGUNDOS ---');
    console.log('Game_Map.update calls:', updateCalls, '(esperado ~120 em 2s @ 60fps)');
    console.log('  └─ com sceneActive=true:', updateWithSceneActive);
    console.log('Game_Map.updateInterpreter calls:', updateInterpreterCalls);
    console.log('Game_Map.setupStartingEvent calls:', setupStartingCalls);
    console.log('Game_Interpreter.setupReservedCommonEvent calls:', setupReservedCalls, '(esperado ≥1)');
    console.log('SW_INPUT_LOCKED (101):', $gameSwitches.value(101));
    console.log('queue final:', $gameTemp._commonEventQueue.length);

    // Restaurar originais
    Game_Map.prototype.update = _GameMap_update;
    Game_Map.prototype.updateInterpreter = _GameMap_updateInterpreter;
    Game_Map.prototype.setupStartingEvent = _Game_Map_setupStartingEvent;
    Game_Interpreter.prototype.setupReservedCommonEvent = _Game_Interpreter_setupReserved;
    console.log('--- Patches restaurados ---');
    console.log('==========================');
}, 2000);
```

## Como interpretar

### Caso D1: `Scene constructor` ≠ `Scene_Map`

Saída esperada:
```
Scene constructor: Scene_Menu (ou Scene_Title, Scene_Battle, etc.)
```

**Causa**: O playtest não está em Scene_Map. Talvez o user esteja em menu ou title.

**Fix**: Garantir que o teste é rodado APÓS carregar Map001 com botões visíveis na tela. Identificar o caminho de "iniciar jogo" que o user está usando (pode ser "Novo Jogo" na title, ou CE que carrega Map001).

---

### Caso D2: Scene = Scene_Map mas `_active=false`

Saída esperada:
```
Scene constructor: Scene_Map
scene._active: false
```

**Causa**: Scene em estado de fade/transition preso.

Evidência adicional:
```
Game_Map.update calls: ~120
  └─ com sceneActive=true: 0    ← TODAS as chamadas com sceneActive=false
Game_Map.updateInterpreter calls: 0
```

**Fix**:
1. Verificar se há fadein/fadeout pendente: `SceneManager._scene._fadeSign`, `SceneManager._scene._fadeDuration`.
2. Verificar se `$gamePlayer.isTransferring()`: pode estar em transferência infinita.
3. Inspecionar `Map001.json` por evento Auto-run com `Wait` longo ou loop de transição.

---

### Caso D3: Scene = Scene_Map, `_active=true`, mas updateInterpreter=0

Saída esperada:
```
Scene constructor: Scene_Map
scene._active: true
Game_Map.update calls: ~120
  └─ com sceneActive=true: ~120
Game_Map.updateInterpreter calls: 0    ← BUG: update não chama updateInterpreter
```

**Causa**: Plugin ou patch sobrescreveu `Game_Map.update` e removeu a chamada `updateInterpreter()`.

**Fix**: Listar plugins carregados:
```javascript
console.log($plugins.map(p => p.name));
```

Inspecionar cada plugin em `Jhonny/js/plugins/` por `Game_Map.prototype.update =`. Possíveis suspeitos: plugins de battle, otimização.

---

### Caso D4: Scene = Scene_Map, _active=true, updateInterpreter>0, setupStartingEvent=0

Saída esperada:
```
Game_Map.updateInterpreter calls: ~120
Game_Map.setupStartingEvent calls: 0    ← updateInterpreter não chama setupStartingEvent
```

**Causa**: impossível em código RMMZ padrão. Significa que `Game_Map.prototype.updateInterpreter` foi sobrescrito por plugin.

**Fix**: Mesma estratégia do Caso D3 — listar plugins e inspeção.

---

### Caso D5: Tudo roda mas SW_INPUT_LOCKED permanece false

Saída esperada:
```
setupReservedCommonEvent calls: ≥1
  logs: setupReservedCommonEvent retornou: true
SW_INPUT_LOCKED: false
queue final: 0
```

**Causa**: CE 11 foi executado mas os guardas bloquearam. Suspeitas:
- `SW_RACE_ACTIVE(100)` OFF no momento da execução
- `SW_INPUT_LOCKED(101)` já ON
- `VAR_TIMER_FRAMES(108) <= 0`

**Fix**: Antes de chamar reserveCommonEvent(11), garantir:
```javascript
$gameSwitches.setValue(100, true);    // SW_RACE_ACTIVE
$gameSwitches.setValue(101, false);   // SW_INPUT_LOCKED OFF
$gameVariables.setValue(108, 100);    // VAR_TIMER_FRAMES > 0
```

Depois reservar CE 11 novamente.

## Próximo passo

Reportar os outputs do teste único. Com base no caso identificado (D1-D5), o fix é direcionado e específico.
