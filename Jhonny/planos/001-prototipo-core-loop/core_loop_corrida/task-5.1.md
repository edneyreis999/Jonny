---
status: pending
---

<task_context>
<domain>engine/gameplay/logic</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-4.3</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 5.1: Implementar Lógica Safe no `EV_OnSafe`

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §4 (Mecânica Sinal — ação Parar), §5 (Mecânica Curva — ação Direita)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §3.3 (linhas 410-457 — tabela de transição de estado), §3.3.1 (linhas 425-453 — pseudo-código), §3.2 (linhas 381-408 — INIT/reset)

## Visão Geral

Substituir o placeholder `TODO task 5.1` (criado em task-4.3) pela **lógica completa da ação Safe** dentro do `EV_OnSafe`. Esta task é o **motor de pontuação positiva** do minigame: o jogador que escolhe Parar/Direita ganha Consciência (+10) e Glória (+10) e avança uma cena.

A ação Safe é a única escritora das variáveis `VAR_CONSCIENCIA` (+10), `VAR_PONTOS_GLORIA` (+10) e `VAR_SCENE_INDEX` (++) no caminho seguro — respeitando o contrato de **escrita única por variável** (decisão arquitetural §1.2 do Guia).

<requirements>
- Substituir o `Comment: "TODO task 5.1"` no `EV_OnSafe` pela lógica real.
- Respeitar a tabela do §3.3 do Guia Técnico (trigger Safe → CONSCIENCIA = `min(100, current + 10)`, GLORIA `+= 10`, SCENE_INDEX `+= 1`).
- Garantir ordem correta: atualizar Consciência **antes** de incrementar cena (evita pegar `VAR_P_CENA` errado da próxima cena).
- Chamar `EV_UpdateHud` para refletir a barra visualmente.
- Chamar `EV_ResolucaoSafe` (a ser criado em task-5.3) — **não desligar `SW_INPUT_LOCKED` aqui**.
- Setar `SW_LAST_ACTION_SAFE = ON` para feedback e diferenciação no HUD.
</requirements>

## Subtarefas

- [ ] 5.1.1 Remover `Comment: "TODO task 5.1"` do `EV_OnSafe`
- [ ] 5.1.2 Adicionar `Control Variables: VAR_CONSCIENCIA = min(100, current + 10)` (operação `Set` + `Constant 10` com operação `Clamp 0-100` via `Script` se necessário)
- [ ] 5.1.3 Adicionar `Control Variables: VAR_PONTOS_GLORIA += 10`
- [ ] 5.1.4 Adicionar `Control Switches: SW_LAST_ACTION_SAFE = ON`
- [ ] 5.1.5 Adicionar `Control Variables: VAR_SCENE_INDEX += 1` (após Consciência — ordem crítica)
- [ ] 5.1.6 Adicionar `Call Common Event: EV_UpdateHud` (criado em task-3.4)
- [ ] 5.1.7 Adicionar `Call Common Event: EV_ResolucaoSafe` (será criado em task-5.3 — placeholder aceitável aqui)
- [ ] 5.1.8 Salvar o projeto e validar com Playtest

## Detalhes de Implementação

### Pseudo-código esperado no `EV_OnSafe`

```
# EV_OnSafe (Trigger: Call)
# Substitui o placeholder da task 4.3 por esta lógica.

# === GUARDAS (já existentes da task 4.3) ===
If SW_RACE_ACTIVE == OFF
  Exit Event Processing
End
If SW_INPUT_LOCKED == ON
  Exit Event Processing
End
If VAR_TIMER_FRAMES <= 0
  Exit Event Processing
End

# === LOCK (já existente) ===
Control Switches: SW_INPUT_LOCKED = ON

# === LÓGICA SAFE (task 5.1 — esta task) ===
# Tabela §3.3 do Guia:
#   VAR_CONSCIENCIA = min(100, current + 10)
#   VAR_PONTOS_GLORIA += 10
#   VAR_SCENE_INDEX += 1

# Consciência: clamp em 100
If VAR_CONSCIENCIA <= 90
  Control Variables: VAR_CONSCIENCIA += 10
Else
  Control Variables: VAR_CONSCIENCIA = 100   # clamp manual
End

# Glória: sempre soma 10 (sem clamp)
Control Variables: VAR_PONTOS_GLORIA += 10

# Marca última ação como Safe (feedback/HUD)
Control Switches: SW_LAST_ACTION_SAFE = ON

# Incrementa cena DEPOIS de aplicar Consciência
# (crítico: §3.3.1 armadilha — sempre custo/Consciência antes de incrementar cena)
Control Variables: VAR_SCENE_INDEX += 1

# Atualiza HUD (barra de Consciência visualmente)
Call Common Event: EV_UpdateHud

# Chama resolução visual (animação de flash verde, etc.)
# A resolução é responsável por desligar SW_INPUT_LOCKED no fim
Call Common Event: EV_ResolucaoSafe

# SW_INPUT_LOCKED é desligado por EV_ResolucaoSafe (task 5.3) — não aqui
```

### Por que `min(100, current + 10)` e não simplesmente `+= 10`?

Conforme tabela §3.3 do Guia, Consciência tem **faixa 0..100** (variável 105). Soma direta `+= 10` poderia estourar para 110 quando o jogador já estava em 95. O MZ não tem clamp nativo em `Control Variables`, então duas opções:

1. **If/Else manual** (recomendado — mais legível): verificar se `VAR_CONSCIENCIA <= 90`, se sim somar 10, senão setar 100.
2. **Script inline**: `$gameVariables.setValue(105, Math.min(100, $gameVariables.value(105) + 10))`.

Esta task usa **opção 1 (If/Else)** para manter consistência com handlers de eventos (sem Script inline onde possível — melhora auditabilidade).

### Por que incrementar cena DEPOIS de atualizar Consciência?

O `EV_RaceRenderer` (task-3.2) é um CE paralelo que observa `VAR_SCENE_INDEX`. Se você incrementar cena **antes** de atualizar Consciência:

1. Renderer detecta mudança de `VAR_SCENE_INDEX`.
2. Renderer sorteia nova `VAR_P_CENA` (sobrescreve a variável).
3. Seu código a seguir que usa `VAR_P_CENA` estaria usando o valor da **próxima** cena.

Embora o handler Safe não use `VAR_P_CENA` diretamente, manter a ordem (custo/Consciência → cena++) é um **padrão consolidado** para o handler Risk (task-5.2) também — evita inconsistências.

### Quem desliga `SW_INPUT_LOCKED`?

**NÃO** desligar no `EV_OnSafe`. O `EV_ResolucaoSafe` (task-5.3) desliga após a animação (~0,4s). Se você desligar aqui, o jogador poderia clicar novamente antes da animação terminar, gerando cliques fantasmas.

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Soma direta `+= 10` sem clamp | Consciência passa de 100, quebra invariantes下游 | Usar If/Else ou `Math.min` |
| Incrementar cena antes de Consciência | Se outra variável usasse P_CENA, pegaria valor errado | Sempre atualizar recursos antes de incrementar cena |
| Desligar `SW_INPUT_LOCKED` no fim do handler | Cliques rápidos disparam 2 Safe no mesmo frame | Deixar `EV_ResolucaoSafe` desligar |
| Esquecer `EV_UpdateHud` | Barra de Consciência não atualiza visualmente | Chamar após cada mutação de CONSCIENCIA |
| Esquecer `EV_ResolucaoSafe` | Lock fica ON para sempre | Sempre chamar a resolução no fim |

## visual_validation

Ao concluir esta task (com 4.1, 4.2, 4.3 prontos):

1. Inicie a corrida via Map001 (autorun).
2. Cena 1 (Sinal) aparece com os botões.
3. Clique no botão **Parar** (ou **Direita** em cena de Curva).
4. **Barra de Consciência sobe visivelmente** em ~10 pontos (ver F9 → Variável 105 aumentou).
5. **Texto de Pontos de Glória** (a ser implementado em task-5.4) ainda não existe — mas F9 mostra `VAR_PONTOS_GLORIA` aumentou de 10 em 10.
6. **Cena avança** (cenário/fundo muda — depende de task-3.2 Renderer estar ativo).
7. `SW_INPUT_LOCKED` fica ON (a resolução ainda não desliga — corrigido na task-5.3).
8. Para resetar lock manualmente durante playtest: `$gameSwitches.setValue(102, false)` no console F12.
9. Console F12 sem erros.

**Antes da task-5.3:** após clicar Safe, o jogo trava (lock não desliga). **Isso é esperado** — task-5.3 corrige.

## Critérios de Sucesso

- [ ] `EV_OnSafe` tem lógica completa (sem mais `TODO task 5.1`).
- [ ] Consciência clamp em 100 (testar começando com 95 → termina em 100, não 105).
- [ ] Glória soma 10 em cada Safe.
- [ ] Cena incrementa 1 após cada Safe.
- [ ] `SW_LAST_ACTION_SAFE = ON` setado.
- [ ] `EV_UpdateHud` é chamado.
- [ ] `EV_ResolucaoSafe` é chamado (placeholder aceitável se task-5.3 ainda não rodou).
- [ ] `SW_INPUT_LOCKED` NÃO é desligado no `EV_OnSafe` (resolução cuida disso).
- [ ] Ordem: Consciência → cena++ (nunca o contrário).
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Animação de flash/zoom na resolução (feito em task-5.3).
- HUD visual de Pontos de Glória (feito em task-5.4).
- Lógica Risk (feito em task-5.2).
- Handler de timeout (timer chama `EV_OnSafe` direto — mesma lógica).
