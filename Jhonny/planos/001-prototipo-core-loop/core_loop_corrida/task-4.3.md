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
- Retrospectiva Fase 3: [[fase3/retrospectiva]] (convenção de IDs 100-113 + auditoria inline)

## Visão Geral

Criar os Common Events `EV_OnSafe` (CE Editor ID 12) e `EV_OnRisk` (CE Editor ID 13) — os handlers de input do minigame. Ambos são chamados via `$gameTemp.reserveCommonEvent` (pelo `ButtonPicture.onClick` no CE 9/10) ou diretamente (pelo `EV_RaceTimer` no CE 11 em caso de timeout).

Esta task cria o **esqueleto** com os 3 guardas de re-entrada. A lógica completa (Consciência, roll, etc.) é implementada nas tasks 5.1 e 5.2.

> **Editor IDs (não usar 101+):** switches vivem em 100-105 e variáveis em 100-113. Toda referência em scripts inline ou comandos MZ usa esses IDs.

<requirements>
- Common Event `EV_OnSafe` criado no CE Editor ID 12 com trigger "Call".
- Common Event `EV_OnRisk` criado no CE Editor ID 13 com trigger "Call".
- Ambos têm 3 guardas no início: `SW_RACE_ACTIVE` (100), `SW_INPUT_LOCKED` (101), `VAR_TIMER_FRAMES` (108).
- Após passar nos guardas, ligam `SW_INPUT_LOCKED` (101) `= ON`.
- Estrutura preparada para receber lógica de Safe (task 5.1) e Risk (task 5.2).
</requirements>

## Subtarefas

- [ ] 4.3.1 **Estender o script gerador** `Jhonny/planos/001-prototipo-core-loop/fase4/build_phase4_ces.py` (criado na task 4.1) adicionando CE 12 e CE 13 — **não editar `CommonEvents.json` diretamente**
- [ ] 4.3.2 Implementar no script `EV_OnSafe` (CE 12, trigger "Call") com 3 guardas (SW_RACE_ACTIVE 100, SW_INPUT_LOCKED 101, VAR_TIMER_FRAMES 108)
- [ ] 4.3.3 Implementar no script `Control Switches: SW_INPUT_LOCKED (101) = ON` após guardas
- [ ] 4.3.4 Implementar no script placeholder `Comment: "TODO task 5.1 — lógica Safe aqui"`
- [ ] 4.3.5 Implementar no script `EV_OnRisk` (CE 13, trigger "Call") com mesma estrutura
- [ ] 4.3.6 Repetir guardas + lock + placeholder para `EV_OnRisk`
- [ ] 4.3.7 Executar o script para gravar CEs 12/13 em `Jhonny/data/CommonEvents.json` (modo idempotente preserva CE 11 da task 4.1)
- [ ] 4.3.8 **Auditar scripts inline:** `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json`
- [ ] 4.3.9 Validar JSON com `python3 -m json.tool`
- [ ] 4.3.10 Salvar o projeto

## Detalhes de Implementação

### Estender o script gerador `fase4/build_phase4_ces.py`

Esta task **não cria um novo script** — estende o `build_phase4_ces.py` criado na task 4.1, adicionando os CEs 12 (`EV_OnSafe`) e 13 (`EV_OnRisk`) após o CE 11 (`EV_RaceTimer`).

Modo idempotente: o script já faz `ces = ces[:KEEP]` com `KEEP = 11` antes de reemitir. Para esta task, **bump de `KEEP` para 12** ao final, OU (preferível) manter `KEEP = 11` e tratar CEs F4 como sendo reconstruídos do zero a cada execução — assim 4.1/4.3/4.4 compartilham a mesma lógica de reset e o `ces.append(...)` de cada task reemite todos os CEs F4.

> **Recomendação de coesão:** ao final desta task, o script deve emitir CEs 11, 12, 13 (três `ces.append(...)` na ordem). A task 4.4 adicionará o CE 14 à mesma sequência. Isso garante que uma única execução do script reconstrói **todos** os CEs F4 de forma determinística.

### Estrutura do `EV_OnSafe` (CE Editor ID 12 — esqueleto)

```
# EV_OnSafe (CE Editor ID 12)
# Trigger: Call
# Handler para ação SAFE (Parar na cena de Sinal, Direita na cena de Curva).
# Único escritor de: VAR_CONSCIENCIA (104) (+10), VAR_PONTOS_GLORIA (105) (+10),
#                    VAR_SCENE_INDEX (101) (++)

# === GUARDAS (Guia §2.4) ===
If SW_RACE_ACTIVE (100) == OFF
  Exit Event Processing            # fora de corrida (VN ativa, menu, etc.)
End

If SW_INPUT_LOCKED (101) == ON
  Exit Event Processing            # já processando outra ação neste tick
End

If VAR_TIMER_FRAMES (108) <= 0
  Exit Event Processing            # cena já expirou — não aceita input tardio
End

# === LOCK contra cliques rápidos duplicados ===
Control Switches: SW_INPUT_LOCKED (101) = ON

# === PLACEHOLDER para task 5.1 ===
# A implementação real da lógica Safe vai aqui:
#   Control Variables: VAR_CONSCIENCIA (104) = min(100, value(104) + 10)
#   Control Variables: VAR_PONTOS_GLORIA (105) += 10
#   Control Variables: VAR_SCENE_INDEX (101) += 1
#   Call EV_UpdateHud (CE 7)
#   Call EV_ResolucaoSafe (task 5.3)
#   Control Switches: SW_INPUT_LOCKED (101) = OFF (destrava no fim da resolução)
#   If VAR_TIMER_TIMEOUT_FLAG (116) == 1:
#     Control Variables: VAR_TIMER_TIMEOUT_FLAG (116) = 0  # reset flag

Comment: "TODO task 5.1 — implementar lógica Safe"
```

### Estrutura do `EV_OnRisk` (CE Editor ID 13 — esqueleto)

```
# EV_OnRisk (CE Editor ID 13)
# Trigger: Call
# Handler para ação RISK (Furar na cena de Sinal, Esquerda na cena de Curva).
# Único escritor de: VAR_CONSCIENCIA (104) (-P_cena), VAR_PONTOS_GLORIA (105) (+P_cena*2 se sucesso),
#                    VAR_TAXA_SUCESSO (106), VAR_ROLL_RESULT (107), SW_CRASH_FLAG (102) (em falha)

# === GUARDAS (Guia §2.4) ===
If SW_RACE_ACTIVE (100) == OFF
  Exit Event Processing
End

If SW_INPUT_LOCKED (101) == ON
  Exit Event Processing
End

If VAR_TIMER_FRAMES (108) <= 0
  Exit Event Processing
End

# === LOCK ===
Control Switches: SW_INPUT_LOCKED (101) = ON

# === PLACEHOLDER para task 5.2 ===
# A implementação real da lógica Risk vai aqui:
#   Control Variables: VAR_TAXA_SUCESSO (106) = min(100, value(104) + value(103))
#   Script: $gameVariables.setValue(107, JhonnyRace.rollD100())  # VAR_ROLL_RESULT
#   If VAR_ROLL_RESULT (107) < VAR_TAXA_SUCESSO (106) → sucesso
#     Control Variables: VAR_PONTOS_GLORIA (105) += value(103) * 2
#     Control Variables: VAR_CONSCIENCIA (104) = max(0, value(104) - value(103))
#     Control Variables: VAR_SCENE_INDEX (101) += 1
#     Call EV_ResolucaoRiskOK (task 5.3)
#   Else → falha
#     Control Variables: VAR_CONSCIENCIA (104) = max(0, value(104) - value(103))  # custo aplicado mesmo no crash
#     Control Switches: SW_CRASH_FLAG (102) = ON
#     Call EV_Crash (task 6.1)
#   End
#   Control Switches: SW_INPUT_LOCKED (101) = OFF (destrava no fim da resolução ou no EV_Crash)

Comment: "TODO task 5.2 — implementar lógica Risk"
```

### Formato JSON canônico do comando If (code 111)

Conforme descoberto na F3 (ver `fase-3-completa.md`):
- `[0, switchId, 0]` para `If Switch == ON` (type 0 = switch, value 0 = is-ON)
- `[0, switchId, 1]` para `If Switch == OFF` (type 0 = switch, value 1 = is-OFF)
- `[1, variableId, 4, value, 1]` para `If Variable <= value` (op 4 = lte)

### Por que 3 guardas?

Conforme Guia §2.4, todos os handlers de input disparados via `ButtonPicture.onClick` ou `Input.isTriggered` devem começar com 3 guardas:

1. **`SW_RACE_ACTIVE` (100) `== OFF` → exit**: previne execução durante VN, menu, ou fora de corrida. Sem este guarda, um clique residual antes do fadein da corrida dispararia o handler.

2. **`SW_INPUT_LOCKED` (101) `== ON` → exit**: anti-re-entrada para clique-duplo ou touch flood. Sem este guarda:
   - Toque rápido pode gerar 2 events `touchstart` + `touchend` em frames separados.
   - `Sprite_Clickable.processTouch` dispara `onClick` quando o botão é solto (`rmmz_sprites.js:46-49`).
   - Em mouse rápido, ainda pode haver re-entrada entre `reserveCommonEvent` e o start do CE.

3. **`VAR_TIMER_FRAMES` (108) `<= 0` → exit**: cena já expirou. Previne aceitar input "fantasma" entre o momento que o timer chegou a 0 e o `EV_RaceTimer` (CE 11) chama o `EV_OnSafe` de timeout. Sem este guarda, dois `EV_OnSafe` poderiam disparar (um do timer, um do clique tardio).

### Por que `SW_INPUT_LOCKED = ON` imediatamente após guardas?

Após passar nos guardas, **imediatamente** ligar o lock. Se você fizer qualquer coisa antes (ex.: `Control Variables`), um clique concorrente pode passar nos guardas também (ainda não tem lock) e disparar o handler duas vezes no mesmo frame.

### Quem desliga `SW_INPUT_LOCKED` (101)?

- **`EV_ResolucaoSafe`** (task 5.3) — após animação de 0.4s.
- **`EV_ResolucaoRiskOK`** (task 5.3) — após animação de 0.4s.
- **`EV_Crash`** (task 6.1) — ao reiniciar (reseta o lock).

Não desligar dentro do `EV_OnSafe` ou `EV_OnRisk` diretamente — sempre no final da resolução.

### Erro comum a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| **Usar IDs 101+ (convenção pré-F3)** | Guardas checam switches/variáveis erradas — handler sempre ativa ou nunca ativa | Usar Editor IDs 100/101/108 |
| **Usar formato `[1, sw, 0]` para If Switch** | If inválido | `[0, sw, 1]` para `== OFF` e `[0, sw, 0]` para `== ON` |
| Esquecer um dos 3 guardas | Comportamento indefinido em edge cases | Implementar os 3 sempre, nesta ordem |
| Ligar `SW_INPUT_LOCKED` antes de checar guardas | Bloqueia futuras execuções legítimas | Sempre checar guardas primeiro, depois ligar lock |
| Desligar `SW_INPUT_LOCKED` no fim do handler | Resolução não tem tempo de animar | Sempre desligar no fim da resolução (task 5.3) |
| Usar `$gameMessage.isBusy()` como única guarda | Não cobre `Scene_Map.isBusy()` (waitCount, etc.) | Compor com os 3 guardas acima |
| Esquecer `Exit Event Processing` | Código após o `If` roda mesmo quando devia sair | Sempre `Exit Event Processing` dentro de cada `If` de guarda |
| Esquecer auditoria inline | Scripts `value/setValue` podem usar IDs errados | Rodar `rg "value\\(|setValue\\("` antes de fechar a task |

## visual_validation

Ao concluir esta task (com 4.1 e 4.2 prontos):
1. No Map001, ative o event autorun.
2. Cena 1 aparece com botões.
3. Clicar em qualquer botão:
   - `SW_INPUT_LOCKED` (101) `= ON` após o clique (verificar F9).
   - Handler "termina" sem fazer nada visível (placeholder ainda).
   - `SW_INPUT_LOCKED` (101) fica ON para sempre (porque ninguém desliga ainda) — este comportamento é esperado nesta task; será corrigido na task 5.3.
4. Para resetar o lock manualmente durante o teste: `$gameSwitches.setValue(101, false)` no console (Editor ID 101 = `SW_INPUT_LOCKED`).
5. Console F12 sem erros.

## Critérios de Sucesso

- [ ] `EV_OnSafe` existe no CE Editor ID 12 com trigger "Call".
- [ ] `EV_OnRisk` existe no CE Editor ID 13 com trigger "Call".
- [ ] Ambos têm 3 guardas na ordem: `SW_RACE_ACTIVE` (100), `SW_INPUT_LOCKED` (101), `VAR_TIMER_FRAMES` (108).
- [ ] Ambos ligam `SW_INPUT_LOCKED` (101) `= ON` imediatamente após guardas.
- [ ] Placeholders claros (`Comment: "TODO ..."`) marcam onde a lógica vai nas tasks 5.1/5.2.
- [ ] `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` coerente.
- [ ] `python3 -m json.tool Jhonny/data/CommonEvents.json` OK.
- [ ] Sem erros de sintaxe nos eventos.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Implementar lógica completa de Safe/Risk (feito nas tasks 5.1 e 5.2).
- Implementar animações de resolução (feito na task 5.3).
- Implementar crash visual (feito na task 6.1).
- Implementar input via teclado W/S/A/D (feito na task 4.4).
