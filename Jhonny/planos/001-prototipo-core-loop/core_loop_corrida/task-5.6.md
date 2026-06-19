---
status: pending
---

<task_context>
<domain>engine/gameplay/feedback</domain>
<type>bugfix</type>
<scope>core_feature</scope>
<complexity>low</complexity>
<dependencies>task-5.2, task-5.3</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
<discovered_in>playtest-fase-5</discovered_in>
</task_context>

# Tarefa 5.6: Bug fix pós-playtest F5 — Criar `EV_ResolucaoRiskFail` (CE 17)

> **BUG CONFIRMADO EM PLAYTEST (2026-06-18):** Risk FAIL não destrava input. Log empírico:
> ```
> [F5DBG] CE12 RISK click — sw100=true sw101=false sw102=false P_CENA(var103)=80
> [F5DBG] CE12 taxa=80 = clamp(consc=0 + P_CENA=80, 0, 100)
> [F5DBG] CE12 roll=83 vs taxa=80 → FAIL
> [F5DBG] CE12 FAIL branch ENTERED — sw101 vai PERMANECER true (BUG)
> [F5DBG] CE12 SW_CRASH_FLAG ON — sw101 ainda true
> [F5DBG] CE12 FAIL FIM — sw101=true sw102=true — INPUT PERMANECE TRANCADO (bug)
> ```
> Causa raiz: o FAIL branch do CE 12 (task 5.2) seta `SW_CRASH_FLAG` (102) mas não faz `SW_INPUT_LOCKED → OFF` nem chama nenhum CE de resolução. Apenas CE 14[4] e CE 15[5] desligam `sw[101]`, e o FAIL não chama nenhum dos dois. Ver [[fase5/retrospectiva]] PARTE 3 §P3.1.

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §6 (Resolução visual de Risk-falha — placeholder para F6)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §3.3 (transição OnRisk → resolução)
- Aprendizados F5: [[fase5/retrospectiva]] PARTE 3 (root cause analysis Bug 3)
- Tasks arquiteturalmente paralelas: [[task-5.3]] (CE 14/15 — ResolucaoSafe/RiskOK)

## Visão Geral

Criar o Common Event 17 `EV_ResolucaoRiskFail` como **par simétrico** de CE 14 (`EV_ResolucaoSafe`) e CE 15 (`EV_ResolucaoRiskOK`). Após criar, modificar o FAIL branch do CE 12 para **chamar CE 17** antes do fim — completando o padrão `On<Action> → Resolucao<Action>` já estabelecido.

Esta task é uma **ponte para F6**:
- F6 task 6.1 (`EV_Crash`) fará o reset completo (variáveis + tela preta + fadein + restart).
- Esta task 5.6 resolve apenas o **lock de input** + feedback audível/visual mínimo — suficiente para o protótipo jogável não travar.
- Quando F6 chegar, o encadeamento limpo será: `CE 12 FAIL → CE 17 (resolução bridge) → CE F6 (crash)`. CE 17 permanece como ponto único de orquestração do FAIL path.

<requirements>
- Criar Common Event 17 `EV_ResolucaoRiskFail` (trigger "Call") via `fase5/build_phase5_ces.py` (estende o gerador existente).
- Conteúdo do CE 17 (mínimo viável — sem flash visível, conforme aceito pelo usuário em playtest):
  - `Play SE: Buzzer1` (failure audible — já validado empiricamente que o usuário escuta).
  - `Shake Screen power 5, speed 5, duration 8 frames` (feedback tátil-visual perceptível).
  - `Control Switches: SW_INPUT_LOCKED (101) = OFF` (DESTRARVAR INPUT — correção central do bug).
- Modificar CE 12 FAIL branch (task 5.2): **antes do Comment `TASK 6.1 PENDENTE`** (atualmente no fim do FAIL), inserir `Call Common Event: 17`.
- Preservar `SW_CRASH_FLAG = ON` (102) — consumida futuramente por F6.
- Não mutar variáveis de estado (Consciência/Glória/cena já mutadas em CE 12; o FAIL custo já foi aplicado).
- Implementação obrigatoriamente via script gerador `fase5/build_phase5_ces.py` — nunca editar `CommonEvents.json` direto (regra F3+F4+F5 consolidada).
</requirements>

## Subtarefas

- [ ] 5.6.1 (Pré-passo) Confirmar snapshot `System.json`: `variables[100:117]` e `switches[100:106]`.
- [ ] 5.6.2 (Pré-passo) Confirmar que CE 17 está livre em `CommonEvents.json` (slot `null` ou inexistente — array atualmente tem 17 entradas, índices 0-16).
- [ ] 5.6.3 Estender `Jhonny/planos/001-prototipo-core-loop/fase5/build_phase5_ces.py` com builder para CE 17 (preserva slots 0-16, modo idempotente).
- [ ] 5.6.4 Definir CE 17 `EV_ResolucaoRiskFail`: `trigger=0` (Call), `name="EV_ResolucaoRiskFail"`, `switchId=0`, `triggerConditionId=0`.
- [ ] 5.6.5 Adicionar comandos em ordem:
  - `Play SE: {"name":"Buzzer1","volume":80,"pitch":100,"pan":0}` (code 250)
  - `Shake Screen: power=5, speed=5, frames=8, waitForCompletion=false` (code 225, params `[5, 5, 8, false]`)
  - `Control Switches: [101, 101, 1]` (code 121 — `1=OFF` conforme `rmmz_objects.js:10172`)
  - `END` (code 0)
- [ ] 5.6.6 Estender o gerador para **modificar CE 12 FAIL branch**: localizar o Comment "TASK 6.1 PENDENTE" (code 108 com "TASK 6.1" no parameters[0]) e inserir ANTES dele: `Call Common Event: 17` (code 117, params `[17]`, indent=1).
- [ ] 5.6.7 Validar JSON gerado: `python -m json.tool Jhonny/data/CommonEvents.json`.
- [ ] 5.6.8 Auditar IDs: `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` — confirmar que nenhum script inline referencia ID inexistente.
- [ ] 5.6.9 Confirmar auditoria de switches: `rg '"code": 121' Jhonny/data/CommonEvents.json` deve mostrar o novo `[101, 101, 1]` no CE 17.
- [ ] 5.6.10 **Pós-edição MZ obrigatória:** reabrir MZ Editor → Database (F10) → Ctrl+S → fechar e reabrir Playtest (bug F4: `$dataCommonEvents` em runtime pode não refletir JSON em disco sem isso).
- [ ] 5.6.11 **Limpar logs de diagnóstico antes do playtest:** rodar `python3 Jhonny/planos/001-prototipo-core-loop/fase5/remove_debug_logs.py` para remover `[F5DBG]` + SEs diagnósticos. (Opcional — pode-se manter os logs se quiser confirmar a correção empiricamente primeiro.)
- [ ] 5.6.12 Playtest com feedback perceptível (sem F12): clicar Risk com falha forçada (ou até ocorrer naturalmente) e confirmar:
  - `Buzzer1` audível (já confirmado em playtest anterior).
  - Shake screen visível.
  - **Input destravado** — pode clicar novamente em Safe ou Risk sem reiniciar o jogo.
- [ ] 5.6.13 (Opcional, se manter logs) Filtrar F12 Console por `[F5DBG] CE12 FAIL` e confirmar novo log se desejado: `CE12 FAIL → Call CE 17 (resolução)` e `CE17 ResolucaoRiskFail FIM — sw101=false`.

## Detalhes de Implementação

### Alocação de CE IDs

CE 17 é o próximo slot livre após F5 task 5.5 (CE 16). Atualização da tabela canônica:

| CE Editor ID | Nome | Trigger | Origem |
|--------------|------|---------|--------|
| 14 | `EV_ResolucaoSafe` | Call | F5 task 5.3 |
| 15 | `EV_ResolucaoRiskOK` | Call | F5 task 5.3 |
| 16 | `EV_HoverRiskButton` | Parallel | F5 task 5.5 |
| **17** | **`EV_ResolucaoRiskFail`** | **Call** | **F5 task 5.6 (este bugfix)** |

### Pseudo-código do `EV_ResolucaoRiskFail`

```
# EV_ResolucaoRiskFail (Trigger: Call)
# Feedback mínimo para Risk-falha. Bridge para F6 EV_Crash.
# Duração total ~0,13s (8 frames) — shake + Buzzer1.
# Desliga SW_INPUT_LOCKED no fim (CORREÇÃO PRINCIPAL do bug).

Play SE: Buzzer1 (volume 80)
Shake Screen: power 5, speed 5, duration 8 frames
Control Switches: SW_INPUT_LOCKED = OFF
```

### Pseudo-código da modificação no CE 12 FAIL branch

Antes (estado atual com bug — `sw[101]` permanece ON):
```
# (dentro do If roll >= taxa, indent=1)
Script: $gameSwitches.setValue(102, true)  # SW_CRASH_FLAG ON
Comment: TASK 6.1 PENDENTE (EV_Crash em F6)
End  # do If
```

Depois (com fix):
```
# (dentro do If roll >= taxa, indent=1)
Script: $gameSwitches.setValue(102, true)  # SW_CRASH_FLAG ON
Call Common Event: 17  # EV_ResolucaoRiskFail — destrava input + Buzzer1
Comment: TASK 6.1 PENDENTE (EV_Crash em F6 — orquestrar por CE 17 quando pronto)
End  # do If
```

> [!important] Não setar `sw[101] = OFF` inline no CE 12
> Mesmo sendo uma linha, manter o padrão arquitetural `On<Action> → Resolucao<Action>` é load-bearing: quando F6 implementar `EV_Crash`, basta ao CE 17 fazer `Call Common Event: <F6_CE>` ANTES do `SW_INPUT_LOCKED = OFF` para preservar o lock durante a animação de crash. Inline exigiria refactor.

### Por que esta task é bridge e não F6 completa

- F6 task 6.1 (`EV_Crash`) exige: fadeout + reset de variáveis + erase pictures 1-60 + fadein <1s + variação de restart. Complexidade ~3h, dependerá de task 6.3 (race ID variation).
- Esta task 5.6 é o **mínimo viável** para o protótipo jogável não travar entre F5 e F6: <1h de implementação, sem novas pictures, sem novas variáveis, sem novas dependências.
- Permite ao usuário continuar testando Safe/Risk/Safe/Risk loops sem reiniciar o jogo, enquanto F6 não chega.

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Setar `sw[101] = OFF` inline no CE 12 em vez de chamar CE 17 | Quebra padrão arquitetural; refactor necessário em F6 | Sempre usar `Call Common Event: 17` |
| Esquecer `sw[101] = OFF` no CE 17 (continuar bug) | Bug persiste | Confirmar code 121 params `[101, 101, 1]` (não `[101, 101, 0]` que é ON) |
| Inserir `Call CE 17` após o Comment em vez de antes | Funciona, mas Comment perde função de marcador do ponto-de-extensão F6 | Inserir ANTES do Comment "TASK 6.1 PENDENTE" |
| Usar code 121 params `[101, 101, 0]` (inverteu OFF/ON) | Lock fica permanentemente ON | Confirmar `rmmz_objects.js:10172`: `0=ON, 1=OFF` |
| Esquecer de reabrir MZ Editor (F10) + Ctrl+S | JSON em disco não reflete em `$dataCommonEvents` runtime | Sempre fazer pós-edição MZ |

## visual_validation

Após concluir esta task:

1. Inicie a corrida.
2. Clique em **Furar** (Risk) repetidamente até cair no FAIL branch (ou force roll alto via `$gameVariables.setValue(107, 99)` em F12).
3. **Buzzer1** toca (audível).
4. Tela **treme** por ~8 frames (visível).
5. **Pode clicar novamente** — input destravado (não precisa reiniciar o jogo).
6. Faça um Safe em seguida para confirmar que o jogo continua fluindo: flash verde + cena avança normalmente.
7. Repita Risk → FAIL → Safe → Risk → SUCCESS várias vezes — nenhum estado trava.

## Critérios de Sucesso

- [ ] CE 17 `EV_ResolucaoRiskFail` criado com trigger "Call" via gerador.
- [ ] CE 12 FAIL branch chama CE 17 antes do fim.
- [ ] `SW_INPUT_LOCKED = OFF` no fim do CE 17 (auditável via `rg '"code": 121' Jhonny/data/CommonEvents.json`).
- [ ] Após Risk FAIL, input destravado (pode clicar de novo sem reiniciar).
- [ ] `Buzzer1` audível no FAIL (já confirmado em playtest anterior).
- [ ] Shake screen visível no FAIL.
- [ ] Sem erros de sintaxe JSON.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.
- [ ] Gerador `build_phase5_ces.py` atualizado (artefato-fonte reflete a mudança).

## Fora de Escopo

- Animação completa de crash (fadeout/reset/fadein) — tarefa de F6 task 6.1 `EV_Crash`.
- Reset de variáveis (`VAR_CONSCIENCIA`, `VAR_PONTOS_GLORIA`, `VAR_SCENE_INDEX`) — também F6.
- Variação por `VAR_RACE_ID` (6/8/10 cenas) — F6 task 6.3.
- Flash vermelho visível (aceito pelo usuário como limitação conhecida — Bug 4 da retrospectiva PARTE 3).
- Tela de vitória da corrida — F6 task 6.4.
