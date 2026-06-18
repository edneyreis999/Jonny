---
status: pending
---

<task_context>
<domain>engine/gameplay/input</domain>
<type>integration</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-1.2, task-4.3</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 4.4: Validar Input W/S/A/D via `Input.keyMapper`

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §4 (Cena de Sinal — input teclado), §5 (Cena de Curva — input teclado)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §2.1.1 (linhas 165-189), §7.1 (Feature → linha em rmmz_*.js)

## Visão Geral

O plugin `Jhonny_RaceHelper.js` (task 1.2) já estende `Input.keyMapper` para mapear W/S/A/D → up/down/left/right. Esta task cria um Common Event paralelo que captura esses inputs e dispara os handlers `EV_OnSafe` / `EV_OnRisk` conforme o tipo de cena atual.

**Mapeamentos:**
- Cena de Sinal: `↓/S` = Parar (Safe), `↑/W` = Furar (Risk).
- Cena de Curva: `→/D` = Direita (Safe), `←/A` = Esquerda (Risk).

<requirements>
- Common Event `EV_KeyInput` criado com trigger "Parallel" e condition `SW_RACE_ACTIVE`.
- Captura setas + W/S/A/D via `Input.isTriggered`.
- Distingue ação Safe vs Risk conforme `VAR_SCENE_TYPE` (0=Sinal: down=Safe/up=Risk; 1=Curva: right=Safe/left=Risk).
- Dispara `EV_OnSafe` ou `EV_OnRisk` via `reserveCommonEvent` (não `Call Common Event` — para evitar bloqueio síncrono).
- Não duplica lógica — apenas delega para os handlers.
</requirements>

## Subtarefas

- [ ] 4.4.1 Criar Common Event `EV_KeyInput` com trigger "Parallel" e condition `SW_RACE_ACTIVE`
- [ ] 4.4.2 Implementar captura de `Input.isTriggered` para 4 direções (setas) + 4 letras (WASD)
- [ ] 4.4.3 Implementar ramificação por `VAR_SCENE_TYPE` (Sinal vs Curva)
- [ ] 4.4.4 Disparar handler via `$gameTemp.reserveCommonEvent` (Script)
- [ ] 4.4.5 Adicionar `Wait 1 frame` no fim do loop
- [ ] 4.4.6 Salvar o projeto
- [ ] 4.4.7 Testar com teclado durante playtest

## Detalhes de Implementação

### Estrutura do Common Event

```
# EV_KeyInput (Trigger: Parallel, Condition: SW_RACE_ACTIVE == ON)
# Captura input de teclado (setas + WASD) e dispara handlers correspondentes

Label: KEY_LOOP
  If SW_RACE_ACTIVE == OFF
    Exit Event Processing
  End

  # === CENA DE SINAL (VAR_SCENE_TYPE == 0): down/S = Parar, up/W = Furar ===
  If VAR_SCENE_TYPE == 0
    # ↓ ou S = Parar (Safe)
    If Script: Input.isTriggered("down") || Input.isTriggered("down")
      Script: $gameTemp.reserveCommonEvent(<ID_EV_ONSAFE>)
    End
    # ↑ ou W = Furar (Risk)
    If Script: Input.isTriggered("up") || Input.isTriggered("up")
      Script: $gameTemp.reserveCommonEvent(<ID_EV_ONRISK>)
    End
  End

  # === CENA DE CURVA (VAR_SCENE_TYPE == 1 ou 2): right/D = Direita, left/A = Esquerda ===
  If VAR_SCENE_TYPE != 0
    # → ou D = Direita (Safe)
    If Script: Input.isTriggered("right") || Input.isTriggered("right")
      Script: $gameTemp.reserveCommonEvent(<ID_EV_ONSAFE>)
    End
    # ← ou A = Esquerda (Risk)
    If Script: Input.isTriggered("left") || Input.isTriggered("left")
      Script: $gameTemp.reserveCommonEvent(<ID_EV_ONRISK>)
    End
  End

  Wait 1 frame
  Jump to Label: KEY_LOOP
```

### Simplificação via Script

Em vez de 4 `If` separados, podemos condensar:

```javascript
// Em um único Script call dentro do CE:
if ($gameVariables.value(103) === 0) {  // VAR_SCENE_TYPE == 0 (Sinal)
    if (Input.isTriggered("down")) $gameTemp.reserveCommonEvent(ID_EV_ONSAFE);
    if (Input.isTriggered("up"))   $gameTemp.reserveCommonEvent(ID_EV_ONRISK);
} else {  // Curva (1 ou 2)
    if (Input.isTriggered("right")) $gameTemp.reserveCommonEvent(ID_EV_ONSAFE);
    if (Input.isTriggered("left"))  $gameTemp.reserveCommonEvent(ID_EV_ONRISK);
}
```

Substituir `ID_EV_ONSAFE` e `ID_EV_ONRISK` pelos IDs reais (verificados via Database → Common Events).

### Por que `Input.isTriggered` e não `Input.isPressed`?

- **`isTriggered`**: dispara no **primeiro frame** em que a tecla está pressionada (borda de subida). Ideal para QTE — uma tecla = uma ação.
- **`isPressed`**: dispara enquanto a tecla está pressionada (contínuo). Seria desastroso para QTE — segurar a tecla dispararia 60 ações por segundo.

Referência: `Input.isTriggered` em `rmmz_core.js:5790-5796`. Note o `_pressedTime === 0` — só dispara no primeiro frame.

### Por que `reserveCommonEvent` e não `Call Common Event`?

- **`Call Common Event`**: síncrono — bloqueia este CE até o chamado terminar. Loop de input ficaria congelado durante a resolução.
- **`reserveCommonEvent`**: assíncrono — enfileira o CE para execução no próximo frame pelo `Game_Map.updateInterpreter`. O loop de input continua rodando.

Como `SW_INPUT_LOCKED` é checado pelos handlers, cliques/teclas adicionais durante a resolução serão descartados pelos guardas (não há spam de handlers na fila).

### Por que `ButtonPicture` continua necessário?

`ButtonPicture` cobre **mouse e touch**. `EV_KeyInput` cobre **teclado**. São canais de input independentes — ambos necessários.

### Erro comum a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Usar `Input.isPressed` em vez de `isTriggered` | Spam de ações (60x por segundo) | Sempre `isTriggered` para QTE |
| Esquecer `Wait 1 frame` no final | Engine trava | Sempre terminar loop com `Wait 1 frame` |
| Usar `Call Common Event` em vez de `reserveCommonEvent` | Bloqueia loop de input | Sempre `reserveCommonEvent` |
| Capturar setas sem verificar `SW_INPUT_LOCKED` | Input durante animação de resolução | Handlers já têm guarda `SW_INPUT_LOCKED` — input passa mas é descartado |
| Esquecer de distinguir cena Sinal vs Curva | ↓ sempre dispara Safe mesmo em Curva | Ramificar por `VAR_SCENE_TYPE` |

## visual_validation

Ao concluir esta task (com 1.2, 4.1, 4.2, 4.3 prontos):
1. No Map001, ative o event autorun.
2. Cena 1 aparece.
3. **Teste na cena de Sinal:**
   - Pressionar `↓` ou `S` → handler `EV_OnSafe` disparado (verificar F9: `SW_INPUT_LOCKED = ON`).
   - Resetar: `$gameSwitches.setValue(102, false)`.
   - Pressionar `↑` ou `W` → handler `EV_OnRisk` disparado.
4. **Teste na cena de Curva:**
   - Forçar cena de Curva via console: `$gameVariables.setValue(103, 1)`, então `$gameVariables.setValue(102, $gameVariables.value(102) + 1)` para forçar re-render.
   - Pressionar `→` ou `D` → handler `EV_OnSafe`.
   - Pressionar `←` ou `A` → handler `EV_OnRisk`.
5. **Teste anti-spam:** segurar uma tecla → apenas 1 action dispara (não 60/segundo).
6. **Teste anti-re-entrada:** clicar botão + pressionar tecla rapidamente → apenas 1 action processa (a outra é descartada pelos guardas).
7. Console F12 sem erros.

## Critérios de Sucesso

- [ ] `EV_KeyInput` existe com trigger "Parallel" e condition `SW_RACE_ACTIVE`.
- [ ] Setas funcionam (`↓↑←→`).
- [ ] W/S/A/D funcionam (via `Jhonny_RaceHelper` keyMapper extendido).
- [ ] Ramificação correta por `VAR_SCENE_TYPE` (Sinal: ↓/↑; Curva: →/←).
- [ ] Anti-spam (segurar tecla não dispara continuamente).
- [ ] Anti-re-entrada (handlers têm guardas).
- [ ] `reserveCommonEvent` usado (não `Call Common Event`).
- [ ] Engine não trava (spin evitado com `Wait 1 frame`).
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo com teclado.

## Fora de Escopo

- Implementar lógica dos handlers (feito nas tasks 5.1 e 5.2).
- Capturar input de mouse/touch (feito via `ButtonPicture` na task 4.2).
- Implementar remapeamento dinâmico de teclas (fora de escopo).
- Adicionar atalhos para menu/pausa (fora de escopo).
