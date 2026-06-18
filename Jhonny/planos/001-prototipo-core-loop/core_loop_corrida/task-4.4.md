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

# Tarefa 4.4: Criar `EV_KeyInput` e Validar W/S/A/D via `Input.keyMapper`

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §4 (Cena de Sinal — input teclado), §5 (Cena de Curva — input teclado)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §2.1.1 (linhas 165-189), §7.1 (Feature → linha em rmmz_*.js)
- Retrospectiva Fase 3: [[fase3/retrospectiva]] (convenção de IDs + auditoria inline)

## Visão Geral

O plugin `Jhonny_RaceHelper.js` (task 1.2) já estende `Input.keyMapper` para mapear W/S/A/D → up/down/left/right. Esta task cria o Common Event `EV_KeyInput` no **CE Editor ID 14** com trigger "Parallel" e condition `SW_RACE_ACTIVE` (100). Ele captura esses inputs e dispara os handlers `EV_OnSafe` (CE 12) / `EV_OnRisk` (CE 13) conforme o tipo de cena atual.

**Mapeamentos:**
- Cena de Sinal (`VAR_SCENE_TYPE` Editor ID **102** `== 0`): `↓/S` = Parar (Safe), `↑/W` = Furar (Risk).
- Cena de Curva (`VAR_SCENE_TYPE` Editor ID **102** `!= 0`): `→/D` = Direita (Safe), `←/A` = Esquerda (Risk).

> **Cuidado com `VAR_SCENE_TYPE`:** na documentação pré-F3 ele aparecia como Editor ID 103, mas o ID correto é **102** (ver tabela de IDs em [[tasks]]). Erro aqui faz o input sempre cair no ramo Curva.

<requirements>
- Common Event `EV_KeyInput` criado no CE Editor ID 14 com trigger "Parallel" e `switchId: 100` (`SW_RACE_ACTIVE`).
- Captura setas + W/S/A/D via `Input.isTriggered`.
- Distingue ação Safe vs Risk conforme `VAR_SCENE_TYPE` (Editor ID 102) (0=Sinal: down=Safe/up=Risk; !=0=Curva: right=Safe/left=Risk).
- Dispara `EV_OnSafe` (CE 12) ou `EV_OnRisk` (CE 13) via `reserveCommonEvent` (não `Call Common Event` — para evitar bloqueio síncrono).
- Não duplica lógica — apenas delega para os handlers.
</requirements>

## Subtarefas

- [ ] 4.4.1 **Estender o script gerador** `Jhonny/planos/001-prototipo-core-loop/fase4/build_phase4_ces.py` adicionando CE 14 — **não editar `CommonEvents.json` diretamente**
- [ ] 4.4.2 Implementar no script `EV_KeyInput` (CE Editor ID 14, trigger "Parallel", `switchId: 100`)
- [ ] 4.4.3 Implementar no script a captura de `Input.isTriggered` para 4 direções (setas) + 4 letras (WASD) — `keyMapper` já estendido em `Jhonny_RaceHelper.js`
- [ ] 4.4.4 Implementar no script a ramificação por `VAR_SCENE_TYPE` (Editor ID 102) (Sinal vs Curva)
- [ ] 4.4.5 Implementar no script o disparo de handler via `$gameTemp.reserveCommonEvent` (Script)
- [ ] 4.4.6 Implementar no script o `Wait 1 frame` no fim do loop
- [ ] 4.4.7 Executar o script para gravar CE 14 em `Jhonny/data/CommonEvents.json` (modo idempotente reemite CEs 11/12/13 das tasks anteriores)
- [ ] 4.4.8 **Auditar scripts inline:** `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json`
- [ ] 4.4.9 Validar JSON com `python3 -m json.tool`
- [ ] 4.4.10 Salvar o projeto
- [ ] 4.4.11 Testar com teclado durante playtest

## Detalhes de Implementação

### Estender o script gerador `fase4/build_phase4_ces.py`

Esta task **não cria um novo script** — estende o `build_phase4_ces.py` criado na task 4.1, adicionando o CE 14 (`EV_KeyInput`) após CEs 11/12/13 das tasks anteriores. Ao final desta task, uma única execução do script deve emitir os 4 CEs F4 (11/12/13/14) em ordem.

### Estrutura do Common Event

```
# EV_KeyInput (CE Editor ID 14)
# Trigger: Parallel, Condition: SW_RACE_ACTIVE (100) == ON
# Captura input de teclado (setas + WASD) e dispara handlers correspondentes

Label: KEY_LOOP
  If SW_RACE_ACTIVE (100) == OFF
    Exit Event Processing
  End

  # === CENA DE SINAL (VAR_SCENE_TYPE 102 == 0): down/S = Parar, up/W = Furar ===
  If VAR_SCENE_TYPE (102) == 0
    # ↓ ou S = Parar (Safe)
    If Script: Input.isTriggered("down")
      Script: $gameTemp.reserveCommonEvent(12)   # EV_OnSafe
    End
    # ↑ ou W = Furar (Risk)
    If Script: Input.isTriggered("up")
      Script: $gameTemp.reserveCommonEvent(13)   # EV_OnRisk
    End
  End

  # === CENA DE CURVA (VAR_SCENE_TYPE 102 != 0): right/D = Direita, left/A = Esquerda ===
  If VAR_SCENE_TYPE (102) != 0
    # → ou D = Direita (Safe)
    If Script: Input.isTriggered("right")
      Script: $gameTemp.reserveCommonEvent(12)   # EV_OnSafe
    End
    # ← ou A = Esquerda (Risk)
    If Script: Input.isTriggered("left")
      Script: $gameTemp.reserveCommonEvent(13)   # EV_OnRisk
    End
  End

  Wait 1 frame
  Jump to Label: KEY_LOOP
```

> **`keyMapper` em `Jhonny_RaceHelper.js`** já mapeia W→up, S→down, A→left, D→right. Portanto `Input.isTriggered("down")` cobre tanto a seta ↓ quanto a tecla S (ambas mapeadas para `"down"`). Não há necessidade de distinguir.

### Simplificação via Script único

Em vez de 4 `If` separados, podemos condensar em um único bloco Script:

```javascript
// Em um único Script call dentro do CE:
if ($gameVariables.value(102) === 0) {  // VAR_SCENE_TYPE == 0 (Sinal)
    if (Input.isTriggered("down")) $gameTemp.reserveCommonEvent(12);  // EV_OnSafe
    if (Input.isTriggered("up"))   $gameTemp.reserveCommonEvent(13);  // EV_OnRisk
} else {  // Curva (VAR_SCENE_TYPE 1 ou 2)
    if (Input.isTriggered("right")) $gameTemp.reserveCommonEvent(12); // EV_OnSafe
    if (Input.isTriggered("left"))  $gameTemp.reserveCommonEvent(13); // EV_OnRisk
}
```

**Atenção:** os IDs `12` e `13` são os Editor IDs dos CEs (`EV_OnSafe` e `EV_OnRisk`), e `102` é o Editor ID de `VAR_SCENE_TYPE`. Como `$gameVariables.value(id)` e `$gameTemp.reserveCommonEvent(id)` usam IDs diretamente, os números coincidem com os Editor IDs.

### Por que `Input.isTriggered` e não `Input.isPressed`?

- **`isTriggered`**: dispara no **primeiro frame** em que a tecla está pressionada (borda de subida). Ideal para QTE — uma tecla = uma ação.
- **`isPressed`**: dispara enquanto a tecla está pressionada (contínuo). Seria desastroso para QTE — segurar a tecla dispararia 60 ações por segundo.

Referência: `Input.isTriggered` em `rmmz_core.js:5790-5796`. Note o `_pressedTime === 0` — só dispara no primeiro frame.

### Por que `reserveCommonEvent` e não `Call Common Event`?

- **`Call Common Event`**: síncrono — bloqueia este CE até o chamado terminar. Loop de input ficaria congelado durante a resolução.
- **`reserveCommonEvent`**: assíncrono — enfileira o CE para execução no próximo frame pelo `Game_Map.updateInterpreter`. O loop de input continua rodando.

Como `SW_INPUT_LOCKED` (101) é checado pelos handlers (CE 12/13), cliques/teclas adicionais durante a resolução serão descartados pelos guardas (não há spam de handlers na fila).

### Por que `ButtonPicture` continua necessário?

`ButtonPicture` cobre **mouse e touch**. `EV_KeyInput` cobre **teclado**. São canais de input independentes — ambos necessários.

### Erro comum a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| **Usar `value(103)` para `VAR_SCENE_TYPE`** | Ramo Curva sempre ativo (103 = `VAR_P_CENA`, não type) | Usar `value(102)` |
| **Usar IDs 101+ para switches/vars** | Guardas falham | Usar Editor IDs 100-105 / 100-113 |
| Usar `Input.isPressed` em vez de `isTriggered` | Spam de ações (60x por segundo) | Sempre `isTriggered` para QTE |
| Esquecer `Wait 1 frame` no final | Engine trava | Sempre terminar loop com `Wait 1 frame` |
| Usar `Call Common Event` em vez de `reserveCommonEvent` | Bloqueia loop de input | Sempre `reserveCommonEvent` |
| Capturar setas sem verificar `SW_INPUT_LOCKED` | Input durante animação de resolução | Handlers já têm guarda `SW_INPUT_LOCKED` (101) — input passa mas é descartado |
| Esquecer de distinguir cena Sinal vs Curva | ↓ sempre dispara Safe mesmo em Curva | Ramificar por `VAR_SCENE_TYPE` (102) |
| Esquecer auditoria inline | Scripts `value/setValue/reserveCommonEvent` podem usar IDs errados | Rodar `rg` antes de fechar a task |

## visual_validation

Ao concluir esta task (com 1.2, 4.1, 4.2, 4.3 prontos):
1. No Map001, ative o event autorun.
2. Cena 1 aparece.
3. **Teste na cena de Sinal:**
   - Pressionar `↓` ou `S` → handler `EV_OnSafe` (CE 12) disparado (verificar F9: `SW_INPUT_LOCKED` (101) `= ON`).
   - Resetar: `$gameSwitches.setValue(101, false)`.
   - Pressionar `↑` ou `W` → handler `EV_OnRisk` (CE 13) disparado.
4. **Teste na cena de Curva:**
   - Forçar cena de Curva via console: `$gameVariables.setValue(102, 1)` (Editor ID 102 = `VAR_SCENE_TYPE`), então `$gameVariables.setValue(101, $gameVariables.value(101) + 1)` (Editor ID 101 = `VAR_SCENE_INDEX`) para forçar re-render.
   - Pressionar `→` ou `D` → handler `EV_OnSafe` (CE 12).
   - Pressionar `←` ou `A` → handler `EV_OnRisk` (CE 13).
5. **Teste anti-spam:** segurar uma tecla → apenas 1 action dispara (não 60/segundo).
6. **Teste anti-re-entrada:** clicar botão + pressionar tecla rapidamente → apenas 1 action processa (a outra é descartada pelos guardas).
7. Console F12 sem erros.

## Critérios de Sucesso

- [ ] `EV_KeyInput` existe no CE Editor ID 14 com trigger "Parallel" e `switchId: 100`.
- [ ] Setas funcionam (`↓↑←→`).
- [ ] W/S/A/D funcionam (via `Jhonny_RaceHelper` keyMapper extendido).
- [ ] Ramificação correta por `VAR_SCENE_TYPE` (Editor ID 102) (Sinal: ↓/↑; Curva: →/←).
- [ ] Anti-spam (segurar tecla não dispara continuamente).
- [ ] Anti-re-entrada (handlers têm guardas).
- [ ] `reserveCommonEvent` usado (não `Call Common Event`).
- [ ] Engine não trava (spin evitado com `Wait 1 frame`).
- [ ] `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` coerente.
- [ ] `python3 -m json.tool Jhonny/data/CommonEvents.json` OK.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo com teclado.

## Fora de Escopo

- Implementar lógica dos handlers (feito nas tasks 5.1 e 5.2).
- Capturar input de mouse/touch (feito via `ButtonPicture` na task 4.2).
- Implementar remapeamento dinâmico de teclas (fora de escopo).
- Adicionar atalhos para menu/pausa (fora de escopo).
