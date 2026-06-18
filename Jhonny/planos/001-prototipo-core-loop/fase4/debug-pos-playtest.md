---
title: "Fase 4 — Debug pós-playtest"
type: diagnostico
fase: 4
data: "2026-06-18"
status: "diagnostico-em-andamento"
executor: "Claude (glm-5.2)"
depends_on: "[[fase-4-completa]]"
---

# Fase 4 — Debug pós-playtest

## Feedback do playtest (user)

### Setup (passou)
- [x] CEs 10-13 presentes com triggers corretos (Database → Common Events)
- [x] Variável ID 116 = `VAR_TIMER_TIMEOUT_FLAG` (Database → Variables)

### Playtest
| # | Item | Result | Detalhe |
|---|------|--------|---------|
| 1 | Cena inicial: fundo + HUD + botões | **PASS** | OK |
| 2 | Hover destaca botão | **FAIL** | Mouse over não destacou nada |
| 3 | Clique → SW_INPUT_LOCKED ON | **FAIL** | Clicou em "direita" → SW_INPUT_LOCKED ficou OFF no F9 |
| 5 | Reset manual `$gameSwitches.setValue(101, false)` | **PASS** | Retorna `undefined` (void, esperado); reseta corretamente |
| 7 | VAR_TIMER_FRAMES decrementa | **PASS** | Decrementando no F9 |
| 8 | Timeout → EV_OnSafe | **BLOCKED** | Handler silencioso, sem feedback visível ou console |
| 9 | Teclas direcionais | **BLOCKED** | Handler silencioso |
| 10 | Anti-spam | **BLOCKED** | Handler silencioso |
| 11 | Anti-re-entrada | **BLOCKED** | Handler silencioso |
| 12 | `$gameVariables.setValue(101, 1)` troca cena | **PASS** | Renderer re-renderizou |

## Diagnóstico preliminar

### Bug 1 — Hover não existe no ButtonPicture.js (falso bug)

**Causa raiz**: Documentação `fase-4-completa.md` (item 5 do checklist) afirma "Hover sobre botão destaca (ButtonPicture nativo)". **Isto está incorreto.**

`ButtonPicture.js` só sobrescreve dois métodos:
- `Sprite_Picture.prototype.isClickEnabled` (linha 84) — habilita clique
- `Sprite_Picture.prototype.onClick` (linha 88) — reserva o CE

Os métodos `onMouseEnter`, `onMouseExit`, `onPress` definidos em `rmmz_sprites.js:80-90` são **vazios por padrão**. O plugin não os sobrescreve, portanto **não há feedback visual de hover**.

**Trade-off**: hover visual exigiria plugin adicional ou patch do `Sprite_Picture.onMouseEnter` para mudar `scale`/`opacity`. Postergado para F5.

### Bug 2 — Clique no botão não dispara handler

**Sintoma**: clicar em "direita" não deixou `SW_INPUT_LOCKED` ON.

**Cadeia de execução esperada**:
1. Botão picture 41 (ou 43) é mostrado por CE 8/9
2. Script inline seta `picture.mzkp_commonEventId = 11` (ou 12)
3. User clica → `Sprite_Picture.processTouch` detecta
4. `isClickEnabled()` retorna `picture.mzkp_commonEventId && !$gameMessage.isBusy()`
5. `onClick()` chama `$gameTemp.reserveCommonEvent(this.picture().mzkp_commonEventId)`
6. Próximo frame, CE 11/12 executa → liga `SW_INPUT_LOCKED`

**Hipóteses ordenadas por probabilidade**:

| # | Hipótese | Como testar |
|---|----------|-------------|
| H1 | `mzkp_commonEventId` não está setado (script não rodou) | `$gameScreen.picture(41).mzkp_commonEventId` no console |
| H2 | Script roda mas propriedade é resetada | Mesmo teste acima após trocar de cena |
| H3 | `isClickEnabled` retorna false (mensagem ativa) | `$gameMessage.isBusy()` |
| H4 | Handler é chamado mas guarda bloqueia (lock já ON) | Verificar SW_INPUT_LOCKED antes do clique |
| H5 | `Input.isTriggered('right')` não se aplica à cena Sinal | Verificar VAR_SCENE_TYPE — `right` só funciona em Curva |

### Bug 3 — Teclas não disparam handler

**Sintoma**: apertar para direita não deixou `SW_INPUT_LOCKED` ON.

**Mapeamento crítico** (CE 13 `EV_KeyInput`):
```javascript
if ($gameVariables.value(102) === 0) {  // Sinal
    Input.isTriggered('down')  → reserveCommonEvent(11)
    Input.isTriggered('up')    → reserveCommonEvent(12)
} else {                                  // Curva
    Input.isTriggered('right') → reserveCommonEvent(11)
    Input.isTriggered('left')  → reserveCommonEvent(12)
}
```

**Suspeita**: user pode ter apertado "direita" em cena **Sinal**, onde `right` é ignorado. Em Sinal, são ↓/↑; em Curva, são ←/→.

**WASD**: depende do `Jhonny_RaceHelper.js` estender `Input.keyMapper` (W→up, S→down, A→left, D→right). Se o keyMapper não estiver estendido, apenas setas funcionam.

## Procedimento de debug (TAREFA DO USUÁRIO)

Abrir Playtest MZ (F5). Quando cena da corrida estiver ativa (botões visíveis), abrir console F12 e colar cada bloco. Reportar resultados.

### Passo 1 — Snapshot do estado da corrida

```javascript
console.log('=== ESTADO DA CORRIDA ===');
console.log('SW_RACE_ACTIVE (100):', $gameSwitches.value(100));
console.log('SW_INPUT_LOCKED (101):', $gameSwitches.value(101));
console.log('VAR_SCENE_INDEX (101):', $gameVariables.value(101));
console.log('VAR_SCENE_TYPE (102):', $gameVariables.value(102), '(0=Sinal, 1/2=Curva)');
console.log('VAR_TIMER_FRAMES (108):', $gameVariables.value(108));
console.log('VAR_LAST_RENDERED_INDEX (113):', $gameVariables.value(113));
console.log('=========================');
```

**Critério**: SW_RACE_ACTIVE deve ser `true`. SW_INPUT_LOCKED deve ser `false` (após os 18 frames iniciais). VAR_SCENE_TYPE deve ser `0` (Sinal) ou `1/2` (Curva).

### Passo 2 — Verificar se `mzkp_commonEventId` foi setado

```javascript
console.log('=== BIND DOS BOTÕES ===');
[41, 42, 43, 44].forEach(id => {
    const p = $gameScreen.picture(id);
    console.log(`picture(${id}):`, p ? 'existe' : 'AUSENTE',
                '| mzkp_commonEventId:', p ? p.mzkp_commonEventId : 'N/A');
});
console.log('=======================');
```

**Critério**:
- Pictures 41/42 devem ter `mzkp_commonEventId = 11` (e 12) se a cena atual for Sinal
- Pictures 43/44 devem ter `mzkp_commonEventId = 11` (e 12) se a cena atual for Curva
- As pictures da outra cena não precisam estar setadas (não visíveis)

Se retornar `undefined`, **H1 confirmado** — script de bind não rodou.

### Passo 3 — Verificar `isClickEnabled` no sprite

```javascript
console.log('=== SPRITE_PICTURE STATUS ===');
const container = SceneManager._scene._spriteset._pictureContainer;
[41, 42, 43, 44].forEach(id => {
    const idx = id - 1;
    const sprite = container.children[idx];
    if (!sprite) {
        console.log(`sprite picture(${id}): NÃO EXISTE no container`);
        return;
    }
    console.log(`sprite picture(${id}):`,
                'visible:', sprite.visible,
                '| width:', sprite.width,
                '| height:', sprite.height,
                '| isClickEnabled:', sprite.isClickEnabled(),
                '| isBeingTouched:', sprite.isBeingTouched());
});
console.log('=============================');
```

**Critério**: para botões visíveis, `width > 0`, `height > 0`, `isClickEnabled` deve retornar truthy.

Se `isClickEnabled` retornar `false` ou `0`, **H1 ou H3** confirmado.

### Passo 4 — Testar handler isoladamente (bypass input)

```javascript
// Garante pré-condições
$gameSwitches.setValue(101, false);   // SW_INPUT_LOCKED OFF
$gameVariables.setValue(108, 100);    // VAR_TIMER_FRAMES > 0

// Força chamada do handler
$gameTemp.reserveCommonEvent(11);     // EV_OnSafe

// Espera 1 segundo, depois:
setTimeout(() => {
    console.log('SW_INPUT_LOCKED após reserveCommonEvent(11):',
                $gameSwitches.value(101));
}, 1000);
```

**Critério**:
- Se SW_INPUT_LOCKED ficou `true` → handler funciona; problema é no input (clique/teclado)
- Se ficou `false` → handler tem bug (provável guarda bloqueando)

### Passo 5 — Verificar CE 13 está rodando (input por tecla)

```javascript
// Monitorar Input.isTriggered por 5 segundos
const startFrames = Graphics.frameCount;
const monitor = setInterval(() => {
    const keys = ['down', 'up', 'left', 'right', 'w', 'a', 's', 'd'];
    const triggered = keys.filter(k => Input.isTriggered(k));
    if (triggered.length > 0) {
        console.log(`Frame ${Graphics.frameCount}: triggered =`, triggered);
    }
    if (Graphics.frameCount - startFrames > 300) { // 5s @ 60fps
        clearInterval(monitor);
        console.log('=== monitor encerrado ===');
    }
}, 16);
console.log('Monitor ativo. Pressione teclas para ver quais são capturadas.');
```

**Critério**: ao apertar teclas, o console deve listar as que foram capturadas. Se nenhuma tecla aparece, há problema no `Input` ou no keyMapper.

### Passo 6 — Verificar `$gameTemp` reserva de CEs

```javascript
// Verificar fila de CEs reservados
const checkReserved = setInterval(() => {
    console.log('CEs reservados pendentes:', $gameTemp._commonEventQueue?.length || 0);
}, 500);
setTimeout(() => clearInterval(checkReserved), 5000);
```

## Decisão após diagnóstico

Dependendo de qual teste falha, o caminho de correção muda:

- **H1 (script não rodou)**: investigar por que `$gameScreen.picture(N)` retorna null ou o script falha silenciosamente. Possível fix: aumentar Wait entre `Show Picture` e `Script`, ou usar Plugin Command nativo (code 357).
- **H3 (mensagem ativa)**: investigar por que `$gameMessage.isBusy()` retorna true (provável janela de diálogo aberta inadvertidamente).
- **H4 (lock já ON)**: ajustar guarda do handler ou remover o lock durante o setup inicial.
- **Bug 3 confirmação (Sinal vs Curva)**: alertar o user que em Sinal, setas laterais não funcionam — apenas ↓/↑.

## Fora de escopo deste debug

- Implementar lógica Safe completa (task 5.1)
- Implementar lógica Risk completa (task 5.2)
- Hover visual nativo (task 5.3 ou posterior)
- HUD de Pontos de Glória (task 5.4)

## Notas de implementação (para o engenheiro que for corrigir)

- **`Game_Screen.showPicture`** (`rmmz_objects.js:1065`) **cria uma nova instância de `Game_Picture` a cada chamada**. Portanto, se Show Picture for chamado novamente (mesmo por re-renderização acidental), `mzkp_commonEventId` é perdido. **Verificar se o Renderer está chamando Show Picture fora do momento de troca de cena.**
- **`Sprite_Picture`** herda de `Sprite_Clickable` (`rmmz_sprites.js:2891`). O processamento de toque roda no `update()` via `processTouch()`. Se o sprite não estiver no container ou `visible=false`, toque é ignorado.
- **`isClickEnabled`** (`ButtonPicture.js:84`) retorna truthy quando `mzkp_commonEventId` é setado E `$gameMessage.isBusy()` é false. Se alguma janela de diálogo está aberta (mesmo invisível), cliques são descartados.
- **`CE 13 EV_KeyInput` é Parallel** (trigger=2, switchId=100). Ele só roda se `SW_RACE_ACTIVE` estiver ON. Não há guarda para `SW_INPUT_LOCKED` no KeyInput — captura input mesmo com lock ligado. Mas o handler chamado (CE 11/12) tem guarda que bloqueia execução.
