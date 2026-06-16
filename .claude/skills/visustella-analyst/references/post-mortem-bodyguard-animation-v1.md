# Post-Mortem: Bodyguard Intercept Animation

**Data:** 2026-05-02
**Tipo:** TECHNICAL DISCOVERY (descoberta arquitetural)
**Arquivo afetado:** `frontend/js/plugins/Coreto_Killin.js`
**Severidade:** CRÍTICA para animações customizadas em batalha

---

## Resumo

Implementamos interceptação visual com timing: Killin pula na frente do aliado ANTES do ataque inimigo e volta DEPOIS da animação terminar. Três camadas resolvidas: (1) **Timing** via `waitCount` antes da action sequence + `endAction()` como trigger dinâmico; (2) **Animation Redirect** via hook em `$gameTemp.requestAnimation` (gargalo universal); (3) **Sprite Management** com padrão save/reset/restore para offset do aliado no ATB.

---

## Licoes Aprendidas

### L1: `$gameTemp.requestAnimation` é o gargalo universal de animações

**Problema:** Pipeline de batalha processa animação visual ANTES do dano. Redirecionar dano em `apply()` não redireciona a animação.

**Causa raiz no pipeline:**
```
startAction() → logWindow.startAction(targets=ALIADO)
  → empilha [showAnimation(targets=ALIADO, animId), ...]
Log window processa: showAnimation → requestAnimation(targets=ALIADO, ...)
  → animação renderiza no sprite do ALIADO
updateAction() → apply(target=ALIADO) → hook redireciona para KILLIN
  → popup de dano aparece no KILLIN (correto) mas animação já tocou no ALIADO (errado)
```

**Solução:** Hook em `Game_Temp.prototype.requestAnimation` (rmmz_objects.js:102). Ambas as portas convergem aqui:
- RPG Maker padrão: `Window_BattleLog.showAnimation()` → `showNormalAnimation()` → `$gameTemp.requestAnimation()`
- VisuStella ActSeq: comando de action sequence → `$gameTemp.requestAnimation()` diretamente

**Código:**
```javascript
// Em startAction: criar Map de redirect
this._bodyguardAnimRedirect = new Map([[target, bodyguard]]); // aliado → Killin

// Hook em requestAnimation
const _Game_Temp_requestAnimation = Game_Temp.prototype.requestAnimation;
Game_Temp.requestAnimation = function (targets, animationId, mirror) {
    if (BattleManager._bodyguardAnimRedirect) {
        const redirect = BattleManager._bodyguardAnimRedirect;
        targets = targets.map(t => redirect.get(t) || t); // aliado vira Killin
    }
    _Game_Temp_requestAnimation.call(this, targets, animationId, mirror);
};

// Em endAction: limpar
this._bodyguardAnimRedirect = null;
```

**Por que é seguro:** O Map só existe entre `startAction` e `endAction` durante uma interceptação. Animações de curas, buffs, AoE passam sem modificação (Map é `null`).

---

### L2: Dano e animação são desacoplados no pipeline

**Descoberta:** No pipeline de batalha, **dano** e **animação visual** são processados em pontos diferentes:

```
Animação visual: logWindow queue → showAnimation → requestAnimation → renderer
                                                          ↑ ANTES do dano

Dano real: updateAction → invokeAction → apply(target)
                                           ↑ DEPOIS da animação
```

**Implicação:** Para consistência visual (animação + dano no mesmo alvo), você precisa de **DOIS hooks separados**:
- `requestAnimation` hook para redirecionar animação visual
- `apply` hook para redirecionar dano mecânico

---

### L3: Use hooks de lifecycle do engine em vez de timers fixos

**Problema:** Animações de inimigos têm duração variável. Timer fixo `ATTACK_HOLD = 50` falha:
- Timer curto: Killin volta antes do inimigo terminar (visualmente incorreto)
- Timer longo: Killin fica parado desnecessariamente após ataques rápidos

**Solução:** Hook em `BattleManager.endAction()`. Quando chamado, a action sequence visual completa foi processada. É um trigger baseado em evento, sempre preciso.

**Regra geral:** Para esperar algo do engine terminar, procure hooks de lifecycle (`endAction`, `startTpbTurn`, `onBattleEnd`) em vez de timers fixos.

---

### L4: Log Window Queue vs Sprite State Machine (dois sistemas independentes)

**Descoberta:** RPG Maker MZ tem dois sistemas de timing que rodam em paralelo:

**Sistema A: Log Window Queue** (frame-based, sequencial)
- Controla sequência visual da batalha
- `isBusy()` retorna true enquanto `_methods.length > 0` OU `waitCount > 0`
- Comandos processados em ordem (FIFO)
- Fast-forward (Shift) processa waits 3x mais rápido

**Sistema B: Sprite State Machine** (frame-based, independente)
- Controla posição visual dos sprites via `Sprite_Actor.updateMain()`
- Roda todo frame, independente do log window
- Não é afetado por fast-forward
- Usa `_offsetX/_offsetY` para movimentos

**A sacada:** Você pode ter sprites animando enquanto o log window está pausado. Use `waitCount` em `startAction` para criar espaço temporal, e deixe a state machine do sprite rodar independentemente durante a pausa.

---

### L5: `startAction()` é o ponto de maior liberdade no pipeline

**O que você pode fazer:**
- Ler `action.makeTargets()` para saber QUEM vai ser atacado (safe chamar 2x, não tem side effects)
- Iniciar animações de sprites (`startMove`, `startJump`)
- Empilhar `waitCount` no log window ANTES de chamar o original
- Modificar `this._targets` (mudar quem recebe a ação)
- Setar flags nos battlers para comunicação com hooks posteriores

**O que você NÃO pode fazer:**
- Pausar a execução de `startAction` (é síncrono)
- Impedir que o original execute (se não chamar, a batalha trava)

**Padrão:**
```javascript
const _BattleManager_startAction = BattleManager.startAction;
BattleManager.startAction = function() {
    // PRÉ-PROCESSAMENTO: detectar, animar, empilhar waits
    this._logWindow.push('waitCount', 25);  // ← empilhado PRIMEIRO
    _BattleManager_startAction.call(this); // sempre chame o original
};
```

---

### L6: ATB ally offset — padrão save/reset/restore

**Problema:** No ATB, quando o gauge do aliado enche, VisuStella aplica "passo a frente" (`_offsetX/_offsetY`). Se o inimigo ataca antes do jogador selecionar a skill, Killin pula para defender — sprites ficam sobrepostos.

**Causa raiz:** Cálculo usava `_offsetX` do aliado. Se `_offsetX = 48`, Killin pulava para `_homeX + 48 + (-44)` = praticamente em cima do aliado.

**Solução — save/reset/restore:**
```javascript
// 1. Salvar offset e resetar aliado para home simultaneamente
target._bodyguardSavedOffsetX = tgtSprite._offsetX;
const dx = tgtSprite._homeX + OFFSET_X - bgSprite._homeX;  // sem _offsetX
bgSprite.startMove(dx, dy, DURATION);
tgtSprite.startMove(0, 0, DURATION);  // aliado volta home

// 2. Após Killin retornar, restaurar aliado
aSprite.startMove(ally._bodyguardSavedOffsetX, ally._bodyguardSavedOffsetY, 8);
delete ally._bodyguardSavedOffsetX;
```

**Importante:** Calcular posição usando `_homeX` (sem `_offsetX`) quando aliado está sendo resetado simultaneamente.

---

### L7: RPG Maker MZ source é acessível e bem estruturado

A documentação oficial não explica o pipeline. Mas o código-fonte é bem estruturado:

| Arquivo | Contém |
|---------|---------|
| `rmmz_managers.js` | `BattleManager` — fluxo de batalha |
| `rmmz_objects.js` | `Game_Action`, `Game_Temp` — lógica de ações e animação |
| `rmmz_windows.js` | `Window_BattleLog` — sequenciador visual |
| `rmmz_sprites.js` | `Sprite_Battler` — sistema de movimento |

---

### L8: VisuStella preserva o pipeline core mesmo ofuscado

VisuStella BattleCore (v1.85) é ofuscado, MAS:
- Métodos que ele override mantêm os mesmos nomes
- Pipeline fundamental (`startAction` → `logWindow` → `updateAction` → `apply` → `endAction`) é PRESERVADO
- Sistema `push/waitCount/waitForMovement` do log window FUNCIONA com VisuStella
- ATB não muda o pipeline de ação — só muda quando as ações são disparadas

---

## Tabela Rápida: Hooks vs Estratégia

| Situação | Hook | Estratégia |
|---|---|---|
| Animar algo antes do inimigo atacar | `startAction()` | Empilhar `waitCount` + iniciar animação sprite |
| Redirecionar dano para outro battler | `apply()` | Chamar original com target diferente + `return` |
| Redirecionar ANIMAÇÃO para outro battler | `$gameTemp.requestAnimation()` | Hook universal, redirecionar targets via Map |
| Fazer algo DEPOIS que inimigo termina | `endAction()` | Setar flag, ler na state machine do sprite |
| Fazer animação frame-a-frame | `updateMain()` | State machine no sprite, flags no battler |
| Gerenciar sprite de outro battler | `startMove()` | Salvar offset, resetar para (0,0), restaurar depois |
| Cleanup quando turno começa | `startTpbTurn()` | Remover states, limpar flags |
| Cleanup quando batalha acaba | `onBattleEnd()` | Resetar TODAS as flags customizadas |
| Esperar N frames | `logWindow.push('waitCount', N)` | Empilhar na fila |
| Saber o que vai acontecer | `action.makeTargets()` | Chamar antes de startAction original |

---

## Tabela Rápida: Workarounds por Bloqueio

| Bloqueio | Workaround |
|----------|-----------|
| Não pode pausar em `apply()` | Mova lógica para `startAction()`, use `waitCount` |
| Animação toca no target errado | Hook `$gameTemp.requestAnimation`, redirecionar targets |
| Sprites sobrepostos no ATB | Salvar offset, resetar para home, restaurar depois |
| Não pode saber quando animação termina | Use `endAction()` hook com flag para state machine |
| Não pode usar timer fixo (duração varia) | Use lifecycle hooks do engine (`endAction`, `startTpbTurn`) |
| Não pode impedir ação de acontecer | Redirecione o target em `apply()` |
| Fast-forward quebra timing | `waitCount` é 3x mais rápido, state machine não. Use ambos |

---

## Pipeline de Animação Completo

```
Skill animation ID → Window_BattleLog.showAnimation(subject, targets, animationId)
                      → showNormalAnimation(targets, animationId)
                        → $gameTemp.requestAnimation(targets, animationId, mirror)
                          → _animationQueue.push({ targets, animationId, mirror })
                          → Spriteset consome fila → renderiza animação nos sprites dos targets

VisuStella ActSeq: → $gameTemp.requestAnimation(targets, animationId) diretamente
```

**Todos os caminhos convergem em `$gameTemp.requestAnimation`.** Este é o hook point canônico para interceptar/redirecionar animações.
