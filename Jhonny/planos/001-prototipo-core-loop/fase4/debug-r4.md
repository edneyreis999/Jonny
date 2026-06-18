---
title: "Fase 4 — Debug R4 (click trace + watchdog)"
type: diagnostico
fase: 4
data: "2026-06-18"
status: "diagnostico-r4"
depends_on: "[[fase4/debug-r3]]"
---

# Fase 4 — Debug R4 (click trace + watchdog)

## Resultado do R3 — ANOMALIA

```
Scene constructor: Scene_Map     ✓
scene._active: true              ✓
scene.isActive(): true           ✓
SW_RACE_ACTIVE (100): true       ✓
queue após reserve: 1            ✓

[após 2s]
Game_Map.update calls: 0         ← IMPOSSÍVEL em jogo rodando
Game_Map.updateInterpreter: 0
Game_Map.setupStartingEvent: 0
setupReservedCommonEvent: 0
```

`Game_Map.update` deveria ser chamado ~120x em 2s (@60fps). **Zero chamadas** significa que o loop principal estava pausado.

## Causa raiz do artifact

Browsers pausam `requestAnimationFrame` quando a tab é oculta. Durante o `setTimeout(2000)` do R3, a janela do jogo perdeu visibilidade (provavelmente o user trocou para o editor MZ ou outro app para acompanhar o console).

`setInterval` também é throttled, mas ainda roda em tab oculta — watchdog com `setInterval` + `document.hidden` detecta a condição.

**Todos os testes R1/R2/R3 foram inconclusivos** — rodam com o jogo pausado, então reservas nunca são consumidas e SW_INPUT_LOCKED nunca liga.

## Estratégia do R4

1. **Watchdog com `setInterval`** — não depende do rAF
2. **`document.hidden` em cada amostra** — detecta tab oculta
3. **`Graphics.frameCount` delta** — confirma se o jogo avançou
4. **User CLIQUE no botão** durante o teste — reproduz o bug real
5. **Patches com logging em tempo real** — não só contagem

Cadeia completa rastreada:

```
Sprite_Picture.onClick (button click)
  → $gameTemp.reserveCommonEvent(id)         [push to queue]
  → Game_Map.update                           [main loop tick]
    → Game_Map.updateInterpreter
      → Game_Map.setupStartingEvent
        → Game_Interpreter.setupReservedCommonEvent  [pull from queue]
          → Game_Interpreter.setup(list)             [start CE execution]
            → command121 (Control Switches: SW_INPUT_LOCKED = ON)
```

Cada nó tem patch com `console.log`. Vai dar pra ver **exatamente** onde a cadeia quebra.

## Teste único R4

**Pré-requisitos críticos:**
- Jogo do Playtest VISÍVEL na tela (não coberta por outra janela)
- F12 aberto, mas com layout que mantenha o jogo visível (dock lateral ou second monitor)
- Consegue clicar no botão "Parar" ou "Furar" durante o teste

No console F12, colar este bloco **uma vez**:

```javascript
console.log('========= DIAGNÓSTICO R4 =========');
console.log('Frame inicial:', Graphics.frameCount);
console.log('Tab visível:', !document.hidden);

const startFrames = Graphics.frameCount;
const startTime = Date.now();

// ----- PATCHES -----
const _GM_update = Game_Map.prototype.update;
const _GT_reserve = Game_Temp.prototype.reserveCommonEvent;
const _GI_setupRes = Game_Interpreter.prototype.setupReservedCommonEvent;
const _GI_setup = Game_Interpreter.prototype.setup;
const _GI_command121 = Game_Interpreter.prototype.command121;
const _SP_onClick = Sprite_Picture.prototype.onClick;

let gmCalls = 0, reserveCalls = 0, setupResCalls = 0;
let setupCalls = 0, cmd121Calls = 0, clickCalls = 0;

Game_Map.prototype.update = function(sa) {
    gmCalls++;
    return _GM_update.call(this, sa);
};

Game_Temp.prototype.reserveCommonEvent = function(id) {
    reserveCalls++;
    console.log(`▶ [f=${Graphics.frameCount}] reserveCommonEvent(${id})`);
    return _GT_reserve.call(this, id);
};

Game_Interpreter.prototype.setupReservedCommonEvent = function() {
    setupResCalls++;
    console.log(`▶ [f=${Graphics.frameCount}] setupReservedCommonEvent CHAMADO (queue=${$gameTemp._commonEventQueue.length})`);
    const r = _GI_setupRes.call(this);
    console.log(`▶ [f=${Graphics.frameCount}] setupReserved retornou=${r}`);
    return r;
};

Game_Interpreter.prototype.setup = function(list, eventId) {
    setupCalls++;
    console.log(`▶ [f=${Graphics.frameCount}] Game_Interpreter.setup(list.length=${list?.length}, eventId=${eventId})`);
    return _GI_setup.call(this, list, eventId);
};

Game_Interpreter.prototype.command121 = function(params) {
    cmd121Calls++;
    console.log(`▶ [f=${Graphics.frameCount}] command121 (Control Switches) params=${JSON.stringify(params)}`);
    return _GI_command121.call(this, params);
};

Sprite_Picture.prototype.onClick = function() {
    clickCalls++;
    const p = this.picture();
    console.log(`▶ [f=${Graphics.frameCount}] Sprite_Picture.onClick name=${p?._name} mzkp_ce=${p?.mzkp_commonEventId}`);
    return _SP_onClick.call(this);
};

console.log('Patches instalados.');
console.log('>>> CLIQUE NO BOTÃO (Parar/Direita) AGORA <<<');
console.log('Watchdog rodando por 8 segundos...');

// ----- WATCHDOG -----
let n = 0;
const iv = setInterval(() => {
    n++;
    const frames = Graphics.frameCount;
    const delta = frames - startFrames;
    console.log(`watchdog ${n}: frameDelta=${delta} tab=${document.hidden ? 'HIDDEN' : 'visível'} GM.update=${gmCalls} reserve=${reserveCalls} setupRes=${setupResCalls} setup=${setupCalls} cmd121=${cmd121Calls} clicks=${clickCalls} queue=${$gameTemp._commonEventQueue.length} lock=${$gameSwitches.value(101)}`);
    if (n >= 16 || $gameSwitches.value(101)) {
        clearInterval(iv);
        // Restaurar
        Game_Map.prototype.update = _GM_update;
        Game_Temp.prototype.reserveCommonEvent = _GT_reserve;
        Game_Interpreter.prototype.setupReservedCommonEvent = _GI_setupRes;
        Game_Interpreter.prototype.setup = _GI_setup;
        Game_Interpreter.prototype.command121 = _GI_command121;
        Sprite_Picture.prototype.onClick = _SP_onClick;
        console.log('--- RESULTADO FINAL ---');
        console.log('Frames decorridos:', Graphics.frameCount - startFrames);
        console.log('Tempo decorrido (ms):', Date.now() - startTime);
        console.log('GM.update calls:', gmCalls);
        console.log('Sprite_Picture.onClick calls:', clickCalls);
        console.log('reserveCommonEvent calls:', reserveCalls);
        console.log('setupReservedCommonEvent calls:', setupResCalls);
        console.log('Game_Interpreter.setup calls:', setupCalls);
        console.log('command121 calls:', cmd121Calls);
        console.log('SW_INPUT_LOCKED:', $gameSwitches.value(101));
        console.log('queue final:', $gameTemp._commonEventQueue.length);
        console.log('==========================');
    }
}, 500);
```

## Como interpretar

### Caso E1: Jogo pausou durante o teste (tab hidden)

Sinais:
```
watchdog N: frameDelta=0 tab=HIDDEN ...
watchdog N: frameDelta=0 tab=HIDDEN ...
```

**Causa:** Janela do jogo ficou oculta durante o teste.

**Ação:** Reorganizar as janelas para manter o Playtest visível. Reexecutar o teste. Não usar alt-tab durante o watchdog.

---

### Caso E2: Jogo rodando, mas clique não registrado

Sinais:
```
watchdog N: frameDelta>60 tab=visível GM.update>60 clicks=0 ...
```

**Causa:** Botão visível mas `Sprite_Picture.onClick` não dispara. Suspeitas:
- `picture.mzkp_commonEventId` undefined no momento do clique
- `isClickEnabled()` retorna false (ButtonPicture.js:84 checa `$gameMessage.isBusy()` ou `picture.mzkp_commonEventId`)
- Botão fora da área clicável (coordenadas erradas)
- Plugin ButtonPicture não está ativo

**Diagnóstico adicional:** Rodar após o watchdog:
```javascript
const p41 = $gameScreen.picture(41);
console.log('Pic 41:', { name: p41?._name, x: p41?._x, y: p41?._y, visible: p41?._visible, mzkp_ce: p41?.mzkp_commonEventId });
const p42 = $gameScreen.picture(42);
console.log('Pic 42:', { name: p42?._name, x: p42?._x, y: p42?._y, visible: p42?._visible, mzkp_ce: p42?.mzkp_commonEventId });
```

Se `mzkp_ce` for undefined → bind do CE 11 falhou no CE 8/9. Se `visible=false` → botão apagado.

---

### Caso E3: Clique registrado, reserve chamado, mas setupReserved NUNCA

Sinais:
```
▶ Sprite_Picture.onClick name=race/btn_parar mzkp_ce=11
▶ reserveCommonEvent(11)
watchdog N: reserve=1 setupRes=0 queue=1 ...
watchdog N: reserve=1 setupRes=0 queue=1 ...   ← fila nunca consumida
```

**Causa real confirmada:** mesmo com `Game_Map.update` rodando (GM.update>0), `setupReservedCommonEvent` não é chamado. Isto seria o caso D3/D4 do R3 (plugin sobrescrevendo updateInterpreter).

**Ação:** Listar plugins e buscar overrides:
```javascript
console.log($plugins.map(p => p.name));
```

```bash
rg "Game_Map.prototype.updateInterpreter\s*=" Jhonny/js/plugins/
rg "Game_Map.prototype.update\s*=" Jhonny/js/plugins/
rg "setupReservedCommonEvent" Jhonny/js/plugins/
```

---

### Caso E4: setupReserved chamado mas retorna false

Sinais:
```
▶ setupReservedCommonEvent CHAMADO (queue=1)
▶ setupReserved retornou=false
```

**Causa:** `setupReserved` consumiu a fila mas o CE veio undefined, OU fila vazia quando chegou a vez. Ver `rmmz_objects.js:9548`:

```javascript
Game_Interpreter.prototype.setupReservedCommonEvent = function() {
    if ($gameTemp.isCommonEventReserved()) {
        const commonEvent = $gameTemp.retrieveCommonEvent();
        if (commonEvent) {
            this.setup(commonEvent.list);
            return true;
        }
    }
    return false;
};
```

Possíveis causas:
- `$gameTemp.isCommonEventReserved()` retornou false (fila já estava vazia)
- `retrieveCommonEvent()` retornou undefined (CE 11 não existe no `$dataCommonEvents`)

**Ação:** Verificar estado da fila no momento exato. Add log:
```javascript
const _retrieve = Game_Temp.prototype.retrieveCommonEvent;
Game_Temp.prototype.retrieveCommonEvent = function() {
    const r = _retrieve.call(this);
    console.log(`retrieveCommonEvent retornou:`, r?.name, 'list?', !!r?.list);
    return r;
};
```

---

### Caso E5: setup chamado mas command121 NUNCA

Sinais:
```
▶ setupReserved retornou=true
▶ Game_Interpreter.setup(list.length=11, eventId=0)
[esperado: command121 CHAMADO]
watchdog N: cmd121=0  ← NUNCA
```

**Causa:** `Game_Interpreter.setup` foi chamado mas o interpreter não roda. Provável:
- Interpreter novo criado mas não atachado ao mapa
- Interpreter com `_depth` excedido
- CE 11 list corrompido (primeiro comando não é 121)

**Ação:** Inspecionar `$dataCommonEvents[11].list[0]`:
```javascript
const ce11 = $dataCommonEvents[11];
console.log('CE 11 list[0]:', JSON.stringify(ce11?.list?.[0], null, 2));
console.log('CE 11 list completo:', JSON.stringify(ce11?.list, null, 2));
```

Esperado: `list[0]` é `{ code: 0, indent: 0, parameters: [] }` (Begin). Depois vem o primeiro comando real.

---

### Caso E6: Cadeia completa, lock liga

Sinais:
```
▶ Sprite_Picture.onClick ...
▶ reserveCommonEvent(11)
▶ setupReservedCommonEvent CHAMADO
▶ setupReserved retornou=true
▶ Game_Interpreter.setup(list.length=11, eventId=0)
▶ command121 params=[101, 0, 0]   ← SW_INPUT_LOCKED = ON
watchdog final: lock=true
```

**Conclusão:** Bug NÃO está na cadeia. Se isto acontecer durante o R4 mas o bug persiste no Playtest normal, então o bug é em outro lugar:
- Talvez `mzkp_commonEventId` se perde em re-render do CE 7 Renderer (ver `fase-4-completa.md` risco "Re-renderização do Renderer reseta `mzkp_commonEventId`")
- Talvez o jogo entra em estado diferente após o setup inicial

**Ação:** Após R4 confirmar E6, testar especificamente:
```javascript
// Simular re-render
const p = $gameScreen.picture(41);
console.log('Antes:', p?.mzkp_commonEventId);
$gameSwitches.setValue(100, false);
$gameSwitches.setValue(100, true);
setTimeout(() => {
    const p2 = $gameScreen.picture(41);
    console.log('Após toggle SW_RACE_ACTIVE:', p2?.mzkp_commonEventId);
}, 500);
```

## Próximo passo

Reportar os outputs do R4 com:
- Logs do watchdog (pelo menos 4 amostras)
- Quaisquer `▶` linhas do clique
- Resultado final

A partir do caso E1-E6 identificado, o fix é cirúrgico.
