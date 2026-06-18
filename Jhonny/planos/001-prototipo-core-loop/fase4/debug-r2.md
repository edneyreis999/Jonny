---
title: "Fase 4 — Debug R2 (reserveCommonEvent ignorado)"
type: diagnostico
fase: 4
data: "2026-06-18"
status: "diagnostico-r2"
depends_on: "[[fase4/debug-pos-playtest]]"
---

# Fase 4 — Debug R2 (reserveCommonEvent ignorado)

## Hipóteses confirmadas (R1)

Após os 6 testes do R1:

| Hipótese | Status |
|----------|--------|
| H1: `mzkp_commonEventId` não setado | **DESCARTADA** (Passo 2 mostrou 11 e 12 setados) |
| H3: `$gameMessage.isBusy()` bloqueando | **DESCARTADA** (Passo 3 mostrou `isClickEnabled: true`) |
| H4: lock já ON bloqueando handler | **DESCARTADA** (Passo 1 mostrou lock OFF) |
| Sinal vs Curva | **CONFIRMADO**: cena é Sinal (102=0); em Sinal, ↓/↑ são as teclas corretas |

**Bug real isolado (Passo 4)**: mesmo chamando `$gameTemp.reserveCommonEvent(11)` diretamente, `SW_INPUT_LOCKED` permaneceu `false` após 1 segundo.

**Passo 5**: `Input.isTriggered` funciona (down/up/left/right capturados) — então o input chega ao KeyInput, mas a chamada subsequente `reserveCommonEvent(11)` é ignorada.

**Passo 6**: fila sempre vazia nas amostras — reservas são consumidas mas handler não executa.

## Mecanismo do bug

`Game_Map.updateInterpreter` (`rmmz_objects.js:6799`) só processa reserved CEs quando `_interpreter` do mapa está livre:

```javascript
Game_Map.prototype.updateInterpreter = function() {
    for (;;) {
        this._interpreter.update();
        if (this._interpreter.isRunning()) {
            return;   // ← bloqueia setupStartingEvent()
        }
        // ...
        if (!this.setupStartingEvent()) {  // chama setupReservedCommonEvent
            return;
        }
    }
};
```

E `setupReservedCommonEvent` (`rmmz_objects.js:9548`) **consome da fila mesmo se o CE não existe**:

```javascript
Game_Interpreter.prototype.setupReservedCommonEvent = function() {
    if ($gameTemp.isCommonEventReserved()) {
        const commonEvent = $gameTemp.retrieveCommonEvent();  // ← shift já removeu da fila
        if (commonEvent) {                                    // ← undefined se CE não carregado
            this.setup(commonEvent.list);
            return true;
        }
    }
    return false;
};
```

## Hipóteses finais

| # | Hipótese | Como confirmar |
|---|----------|----------------|
| **A** | `$dataCommonEvents[11]` undefined em runtime | Imprimir diretamente |
| **B** | `$gameMap._interpreter.isRunning()` sempre true | Imprimir em loop |
| C | CE 11 foi carregado mas com `list` vazio | Verificar `list.length` |

## Teste único de isolamento

No console F12, com a corrida ativa, colar este bloco **uma vez**:

```javascript
console.log('========= DIAGNÓSTICO R2 =========');

// H1: $dataCommonEvents[11] existe em runtime?
console.log('--- Hipótese A: $dataCommonEvents[11] ---');
const ce11 = $dataCommonEvents[11];
console.log('CE 11 definido?:', !!ce11);
console.log('CE 11.name:', ce11?.name);
console.log('CE 11.trigger:', ce11?.trigger, '(esperado: 0 = Call)');
console.log('CE 11.switchId:', ce11?.switchId);
console.log('CE 11.list.length:', ce11?.list?.length, '(esperado: 11)');

// H2: interpreter do mapa está sempre running?
console.log('--- Hipótese B: $gameMap._interpreter ---');
const interp = $gameMap._interpreter;
console.log('interp.isRunning():', interp.isRunning());
console.log('interp._list set?:', !!interp._list);
console.log('interp._eventId:', interp._eventId);
console.log('interp._index:', interp._index);

// Teste ativo: reserve CE 11 e monitora fila
console.log('--- Teste ativo ---');
console.log('queue antes:', $gameTemp._commonEventQueue.length);
$gameTemp.reserveCommonEvent(11);
console.log('queue após reserve:', $gameTemp._commonEventQueue.length);

// Monitora 2 segundos
let samples = 0;
const startFrames = Graphics.frameCount;
const monitor = setInterval(() => {
    samples++;
    console.log(`amostra ${samples}: queue=${$gameTemp._commonEventQueue.length} lock=${$gameSwitches.value(101)} interp.running=${interp.isRunning()} interp.eventId=${interp._eventId} interp.index=${interp._index}`);
    if (samples >= 6) {  // 6 amostras x 250ms = 1.5s
        clearInterval(monitor);
        console.log('--- RESULTADO FINAL ---');
        console.log('SW_INPUT_LOCKED final:', $gameSwitches.value(101));
        console.log('queue final:', $gameTemp._commonEventQueue.length);
        console.log('==========================');
    }
}, 250);
```

## Como interpretar

### Se H-A for verdadeira (CE 11 undefined)

Saída esperada:
```
CE 11 definido?: false
CE 11.name: undefined
```

**Causa**: O Database foi aberto no MZ, mas algo resetou o `CommonEvents.json` para uma versão sem o CE 11. Ou o MZ não recarregou após a edição Python+json.

**Fix**:
1. Fechar o MZ Editor completamente.
2. Verificar que `Jhonny/data/CommonEvents.json` tem 14 entradas: `python3 -c "import json; print(len(json.load(open('Jhonny/data/CommonEvents.json'))))"`
3. Reabrir MZ, abrir Database (F10), verificar CE 11 aparece na lista.
4. Salvar Database (Ctrl+S) — MZ reescreve o JSON em seu formato.
5. Reabrir Playtest.

### Se H-B for verdadeira (interpreter sempre running)

Saída esperada:
```
interp.isRunning(): true
interp._list set?: true
```

E nas amostras:
```
amostra N: ... interp.running=true interp.eventId=N
```

**Causa**: O mapa Map001 tem um evento que está rodando em loop infinito (provavelmente um Parallel ou Auto-run event com `Jump to label` sem `wait`).

**Fix**: Inspeção de `Map001.json` para identificar o evento em loop. Possível conflito:
- O `EV_RaceOrchestrator` (CE 5) é Call, mas se invocado por um evento autorun do mapa, pode ficar preso.
- Verificar se há eventos no Map001 com `trigger: 3` (autorun) ou `trigger: 4` (parallel).

### Se CE 11 existe mas list.length == 0

Saída esperada:
```
CE 11.list.length: 0 (esperado: 11)
```

**Causa**: O gerador `build_phase4_ces.py` escreveu o `name` mas não a `list`, ou o JSON foi corrompido.

**Fix**: Reexecutar `python3 Jhonny/planos/001-prototipo-core-loop/fase4/build_phase4_ces.py`.

## Hipótese adicional (caso todas acima falhem)

Se CE 11 existe, interpreter está livre, e ainda assim o lock não liga — o CE 11 está sendo executado mas algum comando tem bug (provável: `command121` com formato inesperado). Para isolar, colar:

```javascript
// Executa a lista do CE 11 manualmente via interpreter novo
const interp = new Game_Interpreter(0);
interp.setup($dataCommonEvents[11].list);
console.log('CE 11 setup OK, list length:', $dataCommonEvents[11].list.length);
console.log('SW_INPUT_LOCKED antes:', $gameSwitches.value(101));
// Forçar execução completa (10 iteracoes)
for (let i = 0; i < 10; i++) {
    interp.update();
    if (!interp.isRunning()) break;
}
console.log('SW_INPUT_LOCKED depois:', $gameSwitches.value(101));
```

Se este teste LIGAR o lock, então o problema é que `setupReservedCommonEvent` não está sendo chamado (H-B). Se não ligar, o problema é no CE 11 em si (C).

## Próximo passo

Reportar os outputs do teste único. A partir daí, podemos identificar a correção necessária com precisão.
