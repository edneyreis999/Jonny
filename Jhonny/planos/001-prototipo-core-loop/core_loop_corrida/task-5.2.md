---
status: pending
---

<task_context>
<domain>engine/gameplay/logic</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>task-4.3, task-5.1</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 5.2: Implementar Lógica Risk no `EV_OnRisk`

> **ATUALIZAÇÃO (2026-06-18):** IDs de variáveis corrigidos ao mapa canônico (`VAR_TAXA_SUCESSO=106`, `VAR_ROLL_RESULT=107`, `VAR_CONSCIENCIA=104`, `VAR_PONTOS_GLORIA=105`, `VAR_P_CENA=103`). **Guarda 3 removido** — handlers usam apenas 2 guardas (bug fix F4 [[fase-4-completa#Bug do guarda 3]]). Implementação via `build_phase5_ces.py` (espelha F4). Ver [[fase5/Atualizacao-aplicada]] para o diff completo.

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §4 (Mecânica Sinal — ação Furar), §5 (Mecânica Curva — ação Esquerda), §6.2 (P_CENA), §6.3 (roll d100)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §3.3 (linhas 410-423 — tabela completa de transição), §3.3.1 (linhas 425-457 — pseudo-código canônico do `EV_OnRisk`)
- Aprendizados F1-F4: [[fase4/retrospectiva]] (guardas, gerador, MZ reload), [[fase-4-completa]] (bug do guarda 3, IDs canônicos)

## Visão Geral

Substituir o placeholder `TODO task 5.2` (criado em task-4.3) pela **lógica completa da ação Risk** dentro do `EV_OnRisk`. Esta task é o **coração da economia de risco** do jogo: o jogador rola um d100 contra a taxa de sucesso (`CONSCIENCIA + P_CENA`), paga o custo de Consciência **independente do resultado**, e em caso de falha dispara o `EV_Crash` (task-6.1).

Ação Risk é a única escritora de: `VAR_TAXA_SUCESSO`, `VAR_ROLL_RESULT`, `SW_CRASH_FLAG` (em falha) e da variável `VAR_PONTOS_GLORIA` no caminho `× 2` (em sucesso).

<requirements>
- Substituir o `Comment: "TODO task 5.2"` no `EV_OnRisk` pela lógica real.
- Seguir o pseudo-código canônico do §3.3.1 do Guia Técnico **literalmente**.
- Calcular `VAR_TAXA_SUCESSO = clamp(CONSCIENCIA + P_CENA, 0, 100)`.
- Rolar `VAR_ROLL_RESULT = Math.floor(Math.random() * 100)` via Script inline.
- Aplicar custo `VAR_CONSCIENCIA = max(0, current - P_CENA)` **antes** de incrementar cena, **em ambos os ramos** (sucesso e falha).
- Ramo sucesso: `VAR_PONTOS_GLORIA += P_CENA × 2`, `VAR_SCENE_INDEX += 1`, `Call EV_ResolucaoRiskOK` (task-5.3).
- Ramo falha: `SW_CRASH_FLAG = ON`, `Call EV_Crash` (task-6.1).
- Respeitar a **armadilha da ordem**: custo sempre **antes** do `VAR_SCENE_INDEX += 1`.
</requirements>

## Subtarefas

- [ ] 5.2.1 (Pré-passo) Confirmar snapshot de `System.json`: `variables[100:117]` e `switches[100:106]` — fonte de verdade para IDs
- [ ] 5.2.2 (Pré-passo) Criar/estender o gerador `Jhonny/planos/001-prototipo-core-loop/fase5/build_phase5_ces.py` (preserva slots 0-13, modo idempotente)
- [ ] 5.2.3 Substituir `Comment: "TODO task 5.2"` no `EV_OnRisk` (CE 12) pela lógica real — via gerador
- [ ] 5.2.4 Calcular `VAR_TAXA_SUCESSO (106) = min(100, VAR_CONSCIENCIA (104) + VAR_P_CENA (103))` via Script inline
- [ ] 5.2.5 Rolar `VAR_ROLL_RESULT (107) = Math.floor(Math.random() * 100)` via Script inline
- [ ] 5.2.6 Adicionar `If VAR_ROLL_RESULT (107) < VAR_TAXA_SUCESSO (106)` (sucesso)
- [ ] 5.2.7 No ramo sucesso: aplicar custo `VAR_CONSCIENCIA (104) = max(0, current - P_CENA)`
- [ ] 5.2.8 No ramo sucesso: `VAR_PONTOS_GLORIA (105) += VAR_P_CENA (103) * 2` via Script
- [ ] 5.2.9 No ramo sucesso: `Control Switches: SW_LAST_ACTION_SAFE (103) = OFF`
- [ ] 5.2.10 No ramo sucesso: `VAR_SCENE_INDEX (101) += 1`
- [ ] 5.2.11 No ramo sucesso: `Call EV_UpdateHud` (CE 6), `Call EV_ResolucaoRiskOK` (CE 15 — task-5.3)
- [ ] 5.2.12 No ramo `Else` (falha): aplicar custo `VAR_CONSCIENCIA (104) = max(0, current - P_CENA)`
- [ ] 5.2.13 No ramo falha: `Control Switches: SW_CRASH_FLAG (102) = ON`
- [ ] 5.2.14 No ramo falha: `Call Common Event: EV_Crash` (task-6.1)
- [ ] 5.2.15 Adicionar `End` (código 412)
- [ ] 5.2.16 Rodar o gerador; auditar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json`
- [ ] 5.2.17 **Pós-edição MZ obrigatória:** reabrir MZ Editor → Database (F10) → Ctrl+S → fechar e reabrir Playtest
- [ ] 5.2.18 Playtest com feedback perceptível (forçar roll via Script e observar mutações)

## Detalhes de Implementação

### Pseudo-código esperado no `EV_OnRisk`

```
# EV_OnRisk (Trigger: Call)
# Substitui o placeholder da task 4.3 por esta lógica.
# Pseudo-código canônico do §3.3.1 do Guia Técnico.

# === GUARDAS (já existentes da task 4.3 — apenas 2, bug do guarda 3 corrigido em F4) ===
If SW_RACE_ACTIVE == OFF
  Exit Event Processing
End
If SW_INPUT_LOCKED == ON
  Exit Event Processing
End

# === LOCK (já existente) ===
Control Switches: SW_INPUT_LOCKED = ON

# === LÓGICA RISK (task 5.2 — esta task) ===

# Passo 1: calcular taxa de sucesso
# taxa = clamp(CONSCIENCIA + P_CENA, 0, 100)
# IDs: TAXA=106, CONSCIENCIA=104, P_CENA=103
Script: $gameVariables.setValue(106, Math.min(100, Math.max(0, $gameVariables.value(104) + $gameVariables.value(103))))

# Passo 2: rolar d100 (0..99)
# ID: ROLL_RESULT=107
Script: $gameVariables.setValue(107, Math.floor(Math.random() * 100))

# Passo 3: branch sucesso vs falha
If VAR_ROLL_RESULT < VAR_TAXA_SUCESSO
  # === RISK-SUCESSO ===

  # CUSTO PRIMEIRO (antes de incrementar cena!)
  # VAR_CONSCIENCIA = max(0, current - P_CENA)
  If VAR_CONSCIENCIA >= VAR_P_CENA
    Control Variables: VAR_CONSCIENCIA -= VAR_P_CENA
  Else
    Control Variables: VAR_CONSCIENCIA = 0
  End

  # Glória × 2
  # MZ: Control Variables só aceita constante; usar Script para multiplicar por variável
  # IDs: GLORIA=105, P_CENA=103
  Script: $gameVariables.setValue(105, $gameVariables.value(105) + $gameVariables.value(103) * 2)

  # Marca última ação como não-safe
  Control Switches: SW_LAST_ACTION_SAFE = OFF

  # Incrementa cena AGORA (após custo)
  Control Variables: VAR_SCENE_INDEX += 1

  # Atualiza HUD
  Call Common Event: EV_UpdateHud

  # Resolução visual (flash verde/azul, etc.)
  Call Common Event: EV_ResolucaoRiskOK

Else
  # === RISK-FALHA ===

  # Custo aplicado mesmo no crash (spec §4 — independe do resultado)
  If VAR_CONSCIENCIA >= VAR_P_CENA
    Control Variables: VAR_CONSCIENCIA -= VAR_P_CENA
  Else
    Control Variables: VAR_CONSCIENCIA = 0
  End

  # Liga flag de crash (Orchestrator/EV_Crash consome)
  Control Switches: SW_CRASH_FLAG = ON

  # Dispara crash visual (task 6.1)
  Call Common Event: EV_Crash
End

# SW_INPUT_LOCKED: desligado por EV_ResolucaoRiskOK (sucesso) ou EV_Crash (falha)
```

### Por que `Script` em vez de `Control Variables` para taxa e Glória?

O MZ `Control Variables` (código 122) tem limitações:

- **Operações**: `Set`, `Add`, `Sub`, `Mul`, `Div`, `Mod` — apenas uma por comando.
- **Operandos**: constante, variável, random, game data. **Não aceita expressões compostas** como `min(100, A + B)` ou `Math.random() * 100`.
- **Multiplicação por variável**: tecnicamente possível (`Mul → Variable 104`), mas em duas operações separadas.

Para a **taxa de sucesso**, precisamos de `clamp(A + B, 0, 100)` em uma operação atômica — `Script` inline (código 355) é a forma canônica. Equivalente em eventos puros exigiria 4-5 comandos (Add, If > 100, Set 100, End) — verboso e propenso a erro.

Para **Glória × 2**, MZ faz `Mul 2` mas precisamos `+ (P_CENA × 2)` em uma operação. `Script` inline é mais claro.

### Por que `Math.floor(Math.random() * 100)` e não `Control Variables: Random 0..99`?

`Control Variables: Random 0..99` **funciona** e é equivalente. No entanto, optamos por `Script` por dois motivos:

1. **Consistência visual** com o cálculo da taxa (ambas as linhas são `Script: ...`).
2. **Debug facilitado**: para forçar sucesso/falha em playtest, basta substituir `Math.random() * 100` por `0.0` (sempre sucesso) ou `99.0` (sempre falha) — uma linha só.

Se você preferir eventos puros, `Control Variables: VAR_ROLL_RESULT = Random 0..99` é aceitável.

### A armadilha da ordem (§3.3.1)

> [!bug] Custo sempre ANTES de `VAR_SCENE_INDEX++`
>
> Se você inverter a ordem (incrementar cena antes do custo):
>
> 1. `VAR_SCENE_INDEX` muda.
> 2. `EV_RaceRenderer` (CE paralelo) detecta a mudança.
> 3. Renderer sorteia nova `VAR_P_CENA` para a próxima cena.
> 4. Seu código `VAR_CONSCIENCIA -= VAR_P_CENA` agora usa o **valor errado** (da próxima cena).
>
> **Regra:** toda mutação que dependa de `VAR_P_CENA` da cena atual deve acontecer **antes** de incrementar `VAR_SCENE_INDEX`.

Esta task aplica o custo em **ambos os ramos** (sucesso e falha) antes do increment — vale também para o ramo de sucesso, mesmo que o render ainda não tenha rodado.

### Quem desliga `SW_INPUT_LOCKED`?

- **`EV_ResolucaoRiskOK`** (task-5.3) — após animação de ~0,4s, no ramo sucesso.
- **`EV_Crash`** (task-6.1) — ao reiniciar, no ramo falha.

NÃO desligar no `EV_OnRisk`.

### Teste dirigido (forçar sucesso/falha)

Para testar o ramo específico durante Playtest, antes de clicar Risk, edite o Script inline temporariamente:

- **Forçar sucesso:** `$gameVariables.setValue(107, 0)` (roll = 0, sempre < taxa).
- **Forçar falha:** `$gameVariables.setValue(107, 99)` (roll = 99, sempre >= taxa).
- **Forçar falha por taxa baixa:** `$gameVariables.setValue(104, 0)` (Consciência = 0) e `$gameVariables.setValue(103, 0)` (P_CENA = 0) → taxa = 0.

Restaurar o código original antes de finalizar a task.

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Custo só no ramo sucesso | Destrói balanceamento (Risk fica "free" na falha) | Aplicar custo em **ambos** os ramos |
| Incrementar cena antes do custo | Custo usa P_CENA da próxima cena | Sempre custo → cena++ |
| Esquecer `clamp` em `VAR_TAXA_SUCESSO` | Taxa pode passar de 100 se Consciência + P_CENA > 100 | Usar `Math.min(100, ...)` |
| Usar `Math.ceil` em vez de `Math.floor` no roll | Pode gerar 100 (nunca sucesso com taxa 100) | Sempre `Math.floor` para 0..99 |
| Desligar `SW_INPUT_LOCKED` no fim | Crash dispara mas jogador pode clicar antes do restart | Deixar `EV_Crash` desligar no reset |
| Esquecer `Call EV_Crash` no ramo falha | Crash flag ligada mas nada acontece visualmente | Sempre chamar `EV_Crash` no Else |
| Multiplicar Glória como `Mul 2` constante | Glória fica só 2× em vez de 2×P_CENA | Usar `Script: VAR_PONTOS_GLORIA += P_CENA * 2` |

## visual_validation

Ao concluir esta task (com 4.x, 5.1 prontos):

1. Inicie a corrida e chegue numa cena com P_CENA conhecido (use Script para forçar: `$gameVariables.setValue(103, 50)`).
2. **Teste ramo sucesso:** no console F12, antes do clique: `$gameVariables.setValue(107, 0)`. Clique em **Furar** (ou **Esquerda**). Verifique:
   - `VAR_CONSCIENCIA` caiu de 50 (ou clamped em 0 se era < 50).
   - `VAR_PONTOS_GLORIA` subiu de `P_CENA × 2 = 100`.
   - `VAR_SCENE_INDEX` avançou 1.
   - `SW_INPUT_LOCKED` fica ON (a ser desligado por EV_ResolucaoRiskOK em 5.3).
3. **Teste ramo falha:** no console: `$gameVariables.setValue(107, 99)`. Clique em **Furar**. Verifique:
   - `VAR_CONSCIENCIA` caiu de P_CENA (ou 0).
   - `SW_CRASH_FLAG = ON`.
   - `VAR_PONTOS_GLORIA` **não** mudou (falha não dá Glória).
   - `EV_Crash` foi chamado (ainda placeholder em task-6.1 — pode nada visível ainda).
4. **Teste taxa baixa:** com Consciência=0 e P_CENA=0, clique Furar com roll normal. Quase sempre falha (taxa=0, qualquer roll >= 0 falha).
5. Console F12 sem erros.

**Antes da task-5.3 e task-6.1:** animações de resolução e crash ainda não existem — apenas variáveis são atualizadas. **Isso é esperado**.

## Critérios de Sucesso

- [ ] `EV_OnRisk` tem lógica completa (sem mais `TODO task 5.2`).
- [ ] Custo aplicado em **ambos** os ramos (sucesso e falha).
- [ ] Custo aplicado **antes** de incrementar cena.
- [ ] Glória × 2 no sucesso; sem mudança na falha.
- [ ] `SW_CRASH_FLAG = ON` apenas no ramo falha.
- [ ] `EV_Crash` é chamado no ramo falha (placeholder aceitável se task-6.1 ainda não rodou).
- [ ] `EV_ResolucaoRiskOK` é chamado no ramo sucesso (placeholder aceitável se task-5.3 ainda não rodou).
- [ ] Ordem: calcular taxa → roll → branch → custo → (Glória++) → cena++.
- [ ] `SW_INPUT_LOCKED` NÃO é desligado no `EV_OnRisk`.
- [ ] Roll cobre 0..99 (nunca 100).
- [ ] Taxa clampada em 0..100.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo (ambos os ramos).

## Fora de Escopo

- Animação de flash/zoom na resolução (feito em task-5.3).
- Crash visual completo (feito em task-6.1).
- HUD de Pontos de Glória (feito em task-5.4).
- Hover vermelho-sangue (feito em task-5.5).
- PRNG seedável (mantido `Math.random()` em v1).
