---
title: "Fase 4 — Debug R5 (click trace)"
type: diagnostico
fase: 4
data: "2026-06-18"
status: "diagnostico-r5"
depends_on: "[[fase4/debug-r4]]"
---

# Fase 4 — Debug R5 (click trace)

## Resultado do R3 reexecutado (jogo visível)

```
Game_Map.update calls: 83              ✓ (jogo rodando)
Game_Map.updateInterpreter calls: 83   ✓
setupStartingEvent calls: 84           ✓
setupReservedCommonEvent calls: 84     ✓

[t=437] setupReservedCommonEvent CHAMADO (queue antes: 1)
[t=437] setupReservedCommonEvent retornou: true (queue depois: 0)  ← CE 11 RODOU

SW_INPUT_LOCKED (101): true            ← LOCK LIGOU
queue final: 0
```

**CE 11 funciona 100%** quando reservado manualmente. Cadeia completa operacional.

## Bug isolado

Caminho que **funciona**:
```
$gameTemp.reserveCommonEvent(11)  →  setupReserved  →  CE 11 list  →  SW_INPUT_LOCKED = ON
```

Caminho que **falha**:
```
User click botão  →  ???  →  [esperado: reserveCommonEvent(11)]
```

A quebra está entre o evento de clique do mouse e `$gameTemp.reserveCommonEvent(11)`.

## Suspeitos (em ordem de probabilidade)

1. **`picture.mzkp_commonEventId` undefined** no botão clicado (bind do CE 8/9 não aplicou)
2. **`Sprite_Picture.onClick` não dispara** (botão fora da área clicável ou `isClickEnabled()` retorna false)
3. **Plugin `ButtonPicture` inativo** (não registrado em `$plugins` ou desativado)
4. **Posição/visibilidade da picture** impede o clique

## Teste único R5

**Pré-requisitos:**
- Lock resetado (test vai resetar automaticamente)
- Jogo do Playtest VISÍVEL durante todo o teste
- Consegue clicar no botão (Parar/Direita) nos próximos 10s

No console F12, colar este bloco **uma vez**:

```javascript
console.log('========= DIAGNÓSTICO R5 — CLICK TRACE =========');

// 1. Resetar lock para estado conhecido
console.log('SW_INPUT_LOCKED antes:', $gameSwitches.value(101));
$gameSwitches.setValue(101, false);
console.log('SW_INPUT_LOCKED resetado para false');

// 2. Inspecionar pictures dos botões (41-44)
console.log('--- Estado das pictures de botão ---');
[41, 42, 43, 44].forEach(id => {
    const p = $gameScreen.picture(id);
    console.log(`Pic ${id}:`, {
        name: p?._name,
        x: p?._x,
        y: p?._y,
        visible: p?._visible,
        mzkp_commonEventId: p?.mzkp_commonEventId
    });
});

// 3. Verificar se ButtonPicture está carregado
console.log('--- Plugin ButtonPicture ativo? ---');
console.log('ButtonPicture loaded:', typeof Sprite_Picture.prototype.onClick !== 'undefined');
console.log('$plugins com ButtonPicture:', $plugins.filter(p => p.name === 'ButtonPicture').length);
console.log('mzkp_commonEventId em alguma pic?:', [41, 42, 43, 44].some(id => $gameScreen.picture(id)?.mzkp_commonEventId));

// 4. Patches com logging
const _SP_onClick = Sprite_Picture.prototype.onClick;
const _GT_reserve = Game_Temp.prototype.reserveCommonEvent;

let clickCalls = 0;
let reserveCalls = 0;

Sprite_Picture.prototype.onClick = function() {
    clickCalls++;
    const p = this.picture();
    console.log(`▶ [f=${Graphics.frameCount}] Sprite_Picture.onClick`);
    console.log(`  picture._name: ${p?._name}`);
    console.log(`  mzkp_commonEventId: ${p?.mzkp_commonEventId}`);
    console.log(`  isClickEnabled: ${this.isClickEnabled()}`);
    const result = _SP_onClick.call(this);
    console.log(`  queue após onClick: ${$gameTemp._commonEventQueue.length}`);
    return result;
};

Game_Temp.prototype.reserveCommonEvent = function(id) {
    reserveCalls++;
    console.log(`▶ [f=${Graphics.frameCount}] reserveCommonEvent(${id})`);
    return _GT_reserve.call(this, id);
};

console.log('Patches instalados.');
console.log('>>> CLIQUE NO BOTÃO (Parar/Direita) AGORA <<<');
console.log('Aguardando 10 segundos...');

// 5. Watchdog leve para mostrar que jogo está rodando
let n = 0;
const startFrames = Graphics.frameCount;
const iv = setInterval(() => {
    n++;
    const delta = Graphics.frameCount - startFrames;
    console.log(`amostra ${n}: frameDelta=${delta} clicks=${clickCalls} reserve=${reserveCalls} queue=${$gameTemp._commonEventQueue.length} lock=${$gameSwitches.value(101)}`);
    if (n >= 10 || $gameSwitches.value(101)) {
        clearInterval(iv);
        Sprite_Picture.prototype.onClick = _SP_onClick;
        Game_Temp.prototype.reserveCommonEvent = _GT_reserve;
        console.log('--- RESULTADO FINAL ---');
        console.log('Clicks registrados:', clickCalls);
        console.log('reserveCommonEvent calls:', reserveCalls);
        console.log('SW_INPUT_LOCKED:', $gameSwitches.value(101));
        console.log('queue final:', $gameTemp._commonEventQueue.length);
        console.log('==========================');
    }
}, 1000);
```

## Como interpretar

### Caso F1: Bind do CE falhou (mais provável)

Sinais na seção "Estado das pictures":
```
Pic 41: { name: 'race/btn_parar', x: 100, y: 500, visible: true, mzkp_commonEventId: undefined }
                                                                          ^^^^^^^^^ BUG
```

**Causa:** CE 8 `EV_RenderSinal` (ou CE 9 `EV_RenderCurva`) não aplicou `picture.mzkp_commonEventId = 11`.

**Diagnóstico:** Verificar `CommonEvents.json` CE 8/9:

```bash
python3 -c "
import json
with open('Jhonny/data/CommonEvents.json') as f:
    ces = json.load(f)
ce8 = ces[8] if len(ces) > 8 else None
ce9 = ces[9] if len(ces) > 9 else None
for ce in [ce8, ce9]:
    if ce:
        print(f'CE {ce[\"id\"]} ({ce[\"name\"]}):')
        for i, cmd in enumerate(ce['list']):
            print(f'  [{i}] code={cmd[\"code\"]} params={cmd[\"parameters\"]}')
"
```

Procurar por `code: 355` (Script) com `mzkp_commonEventId = 11` ou `= 12`. Se não existir, o `build_phase4_ces.py` tem bug na geração do CE 8/9.

---

### Caso F2: Click registrado, mas reserveCommonEvent não chamado

Sinais durante o teste:
```
▶ [f=512] Sprite_Picture.onClick
  picture._name: race/btn_parar
  mzkp_commonEventId: 11
  isClickEnabled: false            ← BLOQUEADO AQUI
  queue após onClick: 0
```

**Causa:** `isClickEnabled()` retorna false. Em `ButtonPicture.js:84`:

```javascript
Sprite_Picture.prototype.isClickEnabled = function() {
    const picture = this.picture();
    return picture && this.visible && this.bitmap && picture.mzkp_commonEventId > 0;
};
```

Se algum desses for falso, clique é ignorado. Mais provável: `picture.mzkp_commonEventId` undefined ou 0.

**Ação:** Confirmar via:
```javascript
const p = $gameScreen.picture(41);
console.log({
    picture_exists: !!p,
    sprite_visible: !!SceneManager._scene?._spriteset?._pictureContainer?.children?.find(s => s?._pictureId === 41)?.visible,
    bitmap: !!p?._name,
    mzkp_ce: p?.mzkp_commonEventId
});
```

---

### Caso F3: Click não registrado (onClick nunca dispara)

Sinais durante o teste:
```
amostra 1: clicks=0 ...
amostra 2: clicks=0 ...
amostra 10: clicks=0 ...
```

E nenhum `▶ Sprite_Picture.onClick` aparece, mesmo clicando no botão.

**Causa:** Botão não está recebendo o evento de clique. Possíveis:
- Botão fora da área clicável (coordenadas erradas)
- Camada acima cobrindo o botão (outro sprite transparente)
- DevTools interceptando o clique
- Hover/click em área errada

**Diagnóstico:**
```javascript
// Verificar se há algo cobrindo o botão
const pic = $gameScreen.picture(41);
console.log('Pic 41 área:', { x: pic?._x, y: pic?._y, scale: pic?._scale });

// Listar TODAS as pictures ativas
for (let i = 1; i <= 100; i++) {
    const p = $gameScreen.picture(i);
    if (p?._name) console.log(`Pic ${i}:`, { name: p._name, x: p._x, y: p._y, z: p._z });
}

// Verificar se há eventos de pointermove respondendo
window.addEventListener('click', e => console.log('Window click at:', e.clientX, e.clientY), { once: true });
```

Tentar clicar em diferentes pontos da tela onde o botão deveria estar. Coordenadas do cliques devem corresponder à posição da picture.

---

### Caso F4: Plugin ButtonPicture inativo

Sinais na seção "Plugin ButtonPicture ativo?":
```
$plugins com ButtonPicture: 0    ← PLUGIN NÃO CARREGADO
```

**Causa:** `plugins.js` não inclui `ButtonPicture`.

**Ação:** Verificar:
```bash
rg "ButtonPicture" Jhonny/js/plugins.js
```

Se não aparecer, ativar manualmente via RPG Maker MZ → Plugin Manager (F10 → Plugins).

---

### Caso F5: Tudo funciona — clique liga o lock

Sinais durante o teste:
```
▶ [f=520] Sprite_Picture.onClick
  picture._name: race/btn_parar
  mzkp_commonEventId: 11
  isClickEnabled: true
  queue após onClick: 1

▶ [f=520] reserveCommonEvent(11)
amostra 2: clicks=1 reserve=1 queue=1 lock=false
amostra 3: clicks=1 reserve=1 queue=0 lock=true   ← LIGOU!
```

**Conclusão:** Bug não está no caminho do clique. Possivelmente:
- Bug foi introduzido por alguma mudança posterior (ver git diff)
- Bug só ocorre em condição específica (ex: cena específica, primeira execução)
- Observação original do user estava incorreta (pode ter confundido F9 visualização)

**Ação:**
- Reconfirmar bug: reiniciar Playtest, clicar botão sem rodar nenhum teste antes
- Se confirmado, capturar estado imediatamente após o clique que falha

## Próximo passo

Reportar:
1. Output da seção "Estado das pictures" (Pic 41-44)
2. Output da seção "Plugin ButtonPicture ativo?"
3. Qualquer `▶` linha que aparecer após clicar
4. Resultado final (clicks, reserve, lock)

A partir do caso F1-F5, o fix é direto.
