# Post-Mortem: Bodyguard v2 (Plugin Coreto_Killin)

**Data:** 2026-05-02
**Tipo:** Refatoracao completa de state-based para plugin-based
**IDs Envolvidos:** Actor 5 (Kilin), Skill 71 (Bodyguard), State 83 (Bodyguard), State 82 (Represalia), CE 149 ([Bodyguard])

---

## Contexto Historico

### v0 - Implementacao Original
- State 83 com `<JS Pre-Damage as Target>` redirecionava **75% do dano** para Kilin
- Aliado ainda tomava 25% do dano
- State 82 (Represalia) com `<Counter Rate: 100%>` + `<Counter Skill: 64>` para contra-ataque
- State 83 tinha `autoRemovalTiming: 2` (Turn End), expirava no turno da ALIADA, nao do Kilin

### v1 - Primeira Correcao
- Redirecionamento de 75% → 100% do dano
- Adicionado `startDamagePopup()` apos `gainHp(-value)` para popup visual
- Desativado auto-remocao do State 83 (`autoRemovalTiming: 0`)
- Adicionado `<JS Post-Start Turn>` no Actor 5 para limpar State 83 dos aliados
- CE 149 criado com Action Sequence visual (67 comandos, `ActionEnd:eval: "false"`)
- **Pendente:** Link Skill 71 ↔ CE 149 precisa ser feito pelo RPG Maker Editor

### v2 - Refatoracao para Plugin
- Toda logica migrada para `Coreto_Killin.js`
- Notetags customizadas: `<Bodyguard>` e `<Bodyguard State: N>`
- Hooks em `Game_Action.apply`, `applyItemUserEffect`, `startTpbTurn`
- Nao depende mais de hardcoded actorId
- CE 149 ainda pendente (visual)

---

## Licoes Aprendidas

### L1: Ordem de carregamento do DataManager

**Problema:** `DataManager.onLoad` dispara quando `$dataSkills` carrega. Se o scan valida contra `$dataStates`, ele falha porque `$dataStates` ainda nao foi carregado.

**Causa-raiz:** RPG Maker MZ carrega databases em sequencia via XHR: Actors, Classes, Skills, Items, Weapons, Armors, Enemies, Troops, States, etc. Skills carrega ANTES de States.

**Solucao:** Separar extracao de validacao. No scan, extrair stateId diretamente da regex. Validar `$dataStates` apenas em runtime.

**Regra geral:** Nunca valide dados de um database X durante o `onLoad` de um database Y que carrega antes.

---

### L2: BattleManager.startTurn nao funciona no ATB

**Problema:** `this._subject` e sempre `null` em `BattleManager.startTurn` no ATB.

**Causa-raiz:** No ATB (TPB), o fluxo e: `updateTpb()` → `updateTpbBattler(battler)` → `battler.startTpbTurn()`. O `_subject` so e setado em `getNextSubject()`, depois de `startTurn`.

**Solucao:** Hook em `Game_Battler.prototype.startTpbTurn`. Chamado individualmente por battler. Equivalente ao `<JS Post-Start Turn>`.

**Regra geral:** Em ATB/TPB, prefira hooks no nivel do battler em vez do BattleManager.

---

### L3: VisuStella BattleCore sobrescreve o sistema de damage popup

**Problema:** HP diminui corretamente mas nenhum popup visual aparece no bodyguard.

**Causa-raiz:** O RM core usa `_damagePopup = true`. O VisuStella sobrescreve `isDamagePopupRequested()` para checar `_damagePopupArray.length > 0`. No redirect, o array nao e alimentado corretamente.

**Solucao:** Chamar `bodyguard.startDamagePopup()` explicitamente apos o redirect.

**Regra geral:** Sempre que redirecionar dano para um battler diferente do target original, chame `startDamagePopup()` explicitamente.

---

### L4: Plugin + Notetags vs JS Inline em States

**Problema da abordagem antiga:**
- Hardcoded actorId (5)
- Logica espalhada entre States, Actors e Skills
- Acoplamento temporal: mudancas em States quebram a mecanica
- Impossivel de reutilizar para outros personagens

**Abordagem plugin:**
- Notetags semanticas (`<Bodyguard>`, `<Bodyguard State: 83>`)
- Logica centralizada, extensivel para qualquer Actor/Enemy
- Cache com invalidacao no refresh

**Trade-off:** Plugin adiciona complexidade de infra (hooks, parsing, registry) mas paga dividendo em manutenibilidade e extensibilidade.

---

### L5: ActionEnd / "Home Reset" do VisuStella

No VisuStella Battle Core, o comando `ActSeq_Set_FinishAction` tem o parametro "Home Reset" (`ActionEnd:eval`). Controla se o battler volta para posicao original apos a Action Sequence.

- Todos os CEs do projeto usam `"ActionEnd:eval": "true"` (volta normal)
- Para Bodyguard, usamos `"false"` para Kilin permanecer na frente do aliado

**Regra geral:** Para mecanicas onde o battler precisa manter posicao alterada, set `ActionEnd:eval` para `"false"` no FinishAction da CE.

---

### L6: Counter-attack via flag + State Passive

O contra-ataque (Represalia) usa uma combinacao de:
1. `_bodyguardIntercept = true` - flag setada pelo bodyguard quando intercepta
2. State 82 (Represalia) - passive state no Kilin com `<Counter Rate: 100%>` e `<Counter Skill: 64>`
3. A condition do contra-ataque verifica `_bodyguardIntercept` para so disparar apos interceptacao

**Regra geral:** Para contra-ataques condicionais, use uma flag no battler como condicao em vez de counter rate puro. Isso evita contra-ataques em ataques que nao foram interceptados.

---

### L7: Log Window Queue vs Sprite State Machine

RPG Maker MZ tem dois sistemas de timing independentes que rodam em paralelo:

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

**Regra geral:** Você pode ter sprites animando enquanto o log window está pausado. Use `waitCount` em `startAction` para criar espaço temporal, e deixe a state machine do sprite rodar independentemente durante a pausa.

---

### L8: `startAction()` é o ponto de maior liberdade no pipeline

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
    _BattleManager_startAction.call(this);  // sempre chame o original
};
```

---

### L9: ATB ally offset — padrão save/reset/restore

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

**Regra geral:** Calcular posição usando `_homeX` (sem `_offsetX`) quando aliado está sendo resetado simultaneamente.

---

## Metodos do VisuStella Sobrescritos que Impactaram

| Metodo Original | VisuStella Override | Impacto |
|---|---|---|
| `clearDamagePopup` | Usa `_damagePopupArray` ao inves de `_damagePopup = false` | Popup nao aparecia |
| `isDamagePopupRequested` | Checa `_damagePopupArray.length > 0` | Idem |
| `BattleManager.startTurn` | Adiciona processamento de notetags JS | `_subject` e null no ATB |
| `startTpbTurn` | Nao e sobrescrito pelo VisuStella | Hook seguro para ATB |

---

## Referencia Rapida: Hooks por Sistema de Batalha

| Hook | Turn-Based | ATB/TPB | Recomendado Para |
|---|---|---|---|
| `BattleManager.startTurn` | `_subject` disponivel | `_subject` e null | Nao usar no ATB |
| `Game_Battler.startTpbTurn` | Nao chamado | Chamado por battler | Cleanup por-actor no ATB |
| `BattleManager.startAction` | Funciona | Funciona | Pre-processamento: ler targets, animar sprites, empilhar waits |
| `Game_Action.apply` | Funciona | Funciona | Interceptacao de dano |
| `Game_Action.applyItemUserEffect` | Funciona | Funciona | Registro de efeitos pos-skill |
| `$gameTemp.requestAnimation` | Funciona | Funciona | Redirecionar animacao visual (gargalo universal) |
| `BattleManager.endAction` | Funciona | Funciona | Trigger pos-animacao, cleanup |

---

## Estado Atual dos Arquivos

### Plugin: `Coreto_Killin.js`
- Notetags `<Bodyguard>` e `<Bodyguard State: N>` implementadas
- Hooks em apply, applyItemUserEffect, startTpbTurn, onBattleEnd, refresh, onLoad
- Funcional e testado

### Pendente: CE 149 (Action Sequence visual)
- Criado com 67 comandos, `ActionEnd:eval: "false"`
- Link Skill 71 ↔ CE 149 precisa ser feito pelo **RPG Maker Editor**
- Sem esse link, Kilin nao pula visualmente na frente do aliado
