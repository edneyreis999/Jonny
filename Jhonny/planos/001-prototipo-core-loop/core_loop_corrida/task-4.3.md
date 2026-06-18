---
status: pending
---

<task_context>
<domain>engine/gameplay/input</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>task-4.1, task-4.2</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 4.3: Criar `EV_OnSafe` + `EV_OnRisk` (Handlers com 3 Guardas)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §4 (Mecânica Sinal), §5 (Mecânica Curva)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §2.4 (linhas 301-325), §3.3 (linhas 410-457)

## Visão Geral

Criar os Common Events `EV_OnSafe` e `EV_OnRisk` — os handlers de input do minigame. Ambos são chamados via `$gameTemp.reserveCommonEvent` (pelo `ButtonPicture.onClick`) ou diretamente (pelo `EV_RaceTimer` em caso de timeout).

Esta task cria o **esqueleto** com os 3 guardas de re-entrada. A lógica completa (Consciência, roll, etc.) é implementada nas tasks 5.1 e 5.2.

<requirements>
- Common Event `EV_OnSafe` criado com trigger "Call".
- Common Event `EV_OnRisk` criado com trigger "Call".
- Ambos têm 3 guardas no início: `SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `VAR_TIMER_FRAMES`.
- Após passar nos guardas, ligam `SW_INPUT_LOCKED = ON`.
- Estrutura preparada para receber lógica de Safe (task 5.1) e Risk (task 5.2).
</requirements>

## Subtarefas

- [ ] 4.3.1 Criar Common Event `EV_OnSafe` com trigger "Call"
- [ ] 4.3.2 Adicionar 3 guardas (SW_RACE_ACTIVE, SW_INPUT_LOCKED, VAR_TIMER_FRAMES)
- [ ] 4.3.3 Adicionar `Control Switches: SW_INPUT_LOCKED = ON` após guardas
- [ ] 4.3.4 Adicionar placeholder `Comment: "TODO task 5.1 — lógica Safe aqui"`
- [ ] 4.3.5 Criar Common Event `EV_OnRisk` com trigger "Call"
- [ ] 4.3.6 Repetir guardas + lock + placeholder para `EV_OnRisk`
- [ ] 4.3.7 Salvar o projeto

## Detalhes de Implementação

### Estrutura do `EV_OnSafe` (esqueleto)

```
# EV_OnSafe (Trigger: Call)
# Handler para ação SAFE (Parar na cena de Sinal, Direita na cena de Curva).
# Único escritor de: VAR_CONSCIENCIA (+10), VAR_PONTOS_GLORIA (+10), VAR_SCENE_INDEX (++)

# === GUARDAS (Guia §2.4) ===
If SW_RACE_ACTIVE == OFF
  Exit Event Processing            # fora de corrida (VN ativa, menu, etc.)
End

If SW_INPUT_LOCKED == ON
  Exit Event Processing            # já processando outra ação neste tick
End

If VAR_TIMER_FRAMES <= 0
  Exit Event Processing            # cena já expirou — não aceita input tardio
End

# === LOCK contra cliques rápidos duplicados ===
Control Switches: SW_INPUT_LOCKED = ON

# === PLACEHOLDER para task 5.1 ===
# A implementação real da lógica Safe vai aqui:
#   VAR_CONSCIENCIA = min(100, VAR_CONSCIENCIA + 10)
#   VAR_PONTOS_GLORIA += 10
#   VAR_SCENE_INDEX += 1
#   Call EV_UpdateHud
#   Call EV_ResolucaoSafe (task 5.3)
#   SW_INPUT_LOCKED = OFF (destrava no fim da resolução)

Comment: "TODO task 5.1 — implementar lógica Safe"
```

### Estrutura do `EV_OnRisk` (esqueleto)

```
# EV_OnRisk (Trigger: Call)
# Handler para ação RISK (Furar na cena de Sinal, Esquerda na cena de Curva).
# Único escritor de: VAR_CONSCIENCIA (-P_cena), VAR_PONTOS_GLORIA (+P_cena*2 se sucesso),
#                    VAR_TAXA_SUCESSO, VAR_ROLL_RESULT, SW_CRASH_FLAG (em falha)

# === GUARDAS (Guia §2.4) ===
If SW_RACE_ACTIVE == OFF
  Exit Event Processing
End

If SW_INPUT_LOCKED == ON
  Exit Event Processing
End

If VAR_TIMER_FRAMES <= 0
  Exit Event Processing
End

# === LOCK ===
Control Switches: SW_INPUT_LOCKED = ON

# === PLACEHOLDER para task 5.2 ===
# A implementação real da lógica Risk vai aqui:
#   VAR_TAXA_SUCESSO = min(100, VAR_CONSCIENCIA + VAR_P_CENA)
#   VAR_ROLL_RESULT = JhonnyRace.rollD100()
#   If VAR_ROLL_RESULT < VAR_TAXA_SUCESSO → sucesso
#     VAR_PONTOS_GLORIA += VAR_P_CENA * 2
#     VAR_CONSCIENCIA = max(0, VAR_CONSCIENCIA - VAR_P_CENA)
#     VAR_SCENE_INDEX += 1
#     Call EV_ResolucaoRiskOK (task 5.3)
#   Else → falha
#     VAR_CONSCIENCIA = max(0, VAR_CONSCIENCIA - VAR_P_CENA)  # custo aplicado mesmo no crash
#     SW_CRASH_FLAG = ON
#     Call EV_Crash (task 6.1)
#   End
#   SW_INPUT_LOCKED = OFF (destrava no fim da resolução ou no EV_Crash)

Comment: "TODO task 5.2 — implementar lógica Risk"
```

### Por que 3 guardas?

Conforme Guia §2.4, todos os handlers de input disparados via `ButtonPicture.onClick` ou `Input.isTriggered` devem começar com 3 guardas:

1. **`SW_RACE_ACTIVE == OFF` → exit**: previne execução durante VN, menu, ou fora de corrida. Sem este guarda, um clique residual antes do fadein da corrida dispararia o handler.

2. **`SW_INPUT_LOCKED == ON` → exit**: anti-re-entrada para clique-duplo ou touch flood. Sem este guarda:
   - Toque rápido pode gerar 2 events `touchstart` + `touchend` em frames separados.
   - `Sprite_Clickable.processTouch` dispara `onClick` quando o botão é solto (`rmmz_sprites.js:46-49`).
   - Em mouse rápido, ainda pode haver re-entrada entre `reserveCommonEvent` e o start do CE.

3. **`VAR_TIMER_FRAMES <= 0` → exit**: cena já expirou. Previne aceitar input "fantasma" entre o momento que o timer chegou a 0 e o `EV_RaceTimer` chamar o `EV_OnSafe` de timeout. Sem este guarda, dois `EV_OnSafe` poderiam disparar (um do timer, um do clique tardio).

### Por que `SW_INPUT_LOCKED = ON` imediatamente após guardas?

Após passar nos guardas, **imediatamente** ligar o lock. Se você fizer qualquer coisa antes (ex.: `Control Variables`), um clique concorrente pode passar nos guardas também (ainda não tem lock) e disparar o handler duas vezes no mesmo frame.

### Quem desliga `SW_INPUT_LOCKED`?

- **`EV_ResolucaoSafe`** (task 5.3) — após animação de 0.4s.
- **`EV_ResolucaoRiskOK`** (task 5.3) — após animação de 0.4s.
- **`EV_Crash`** (task 6.1) — ao reiniciar (reseta o lock).

Não desligar dentro do `EV_OnSafe` ou `EV_OnRisk` diretamente — sempre no final da resolução.

### Erro comum a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Esquecer um dos 3 guardas | Comportamento indefinido em edge cases | Implementar os 3 sempre, nesta ordem |
| Ligar `SW_INPUT_LOCKED` antes de checar guardas | Bloqueia futuras execuções legitimas | Sempre checar guardas primeiro, depois ligar lock |
| Desligar `SW_INPUT_LOCKED` no fim do handler | Resolução não tem tempo de animar | Sempre desligar no fim da resolução (task 5.3) |
| Usar `$gameMessage.isBusy()` como única guarda | Não cobre `Scene_Map.isBusy()` (waitCount, etc.) | Compor com os 3 guardas acima |
| Esquecer `Exit Event Processing` | Código após o `If` roda mesmo quando devia sair | Sempre `Exit Event Processing` dentro de cada `If` de guarda |

## visual_validation

Ao concluir esta task (com 4.1 e 4.2 prontos):
1. No Map001, ative o event autorun.
2. Cena 1 aparece com botões.
3. Clicar em qualquer botão:
   - `SW_INPUT_LOCKED = ON` após o clique (verificar F9).
   - Handler "termina" sem fazer nada visível (placeholder ainda).
   - `SW_INPUT_LOCKED` fica ON para sempre (porque ninguém desliga ainda) — este comportamento é esperado nesta task; será corrigido na task 5.3.
4. Para resetar o lock manualmente durante o teste: `$gameSwitches.setValue(102, false)` no console.
5. Console F12 sem erros.

## Critérios de Sucesso

- [ ] `EV_OnSafe` existe com trigger "Call".
- [ ] `EV_OnRisk` existe com trigger "Call".
- [ ] Ambos têm 3 guardas na ordem: `SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `VAR_TIMER_FRAMES`.
- [ ] Ambos ligam `SW_INPUT_LOCKED = ON` imediatamente após guardas.
- [ ] Placeholders claros (`Comment: "TODO ..."`) marcam onde a lógica vai nas tasks 5.1/5.2.
- [ ] Sem erros de sintaxe nos eventos.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Implementar lógica completa de Safe/Risk (feito nas tasks 5.1 e 5.2).
- Implementar animações de resolução (feito na task 5.3).
- Implementar crash visual (feito na task 6.1).
- Implementar input via teclado W/S/A/D (feito na task 4.4).
