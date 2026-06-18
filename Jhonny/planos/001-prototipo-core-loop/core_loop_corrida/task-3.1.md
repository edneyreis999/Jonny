---
status: pending
---

<task_context>
<domain>engine/gameplay/orchestrator</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-1.1, task-2.3</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 3.1: Criar `EV_RaceOrchestrator` (INIT + Fadein)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §2 (Diagrama do Loop), §7 (Restart / Roguelite Loop)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §1.1 (linhas 46-95), §3.2 (linhas 382-409), §9 Checklist (linhas 970)

## Visão Geral

Criar o Common Event `EV_RaceOrchestrator`, que é a **fonte da verdade** do minigame. Ele:
1. Zera as variáveis resetáveis (`VAR_CONSCIENCIA`, `VAR_PONTOS_GLORIA`, `VAR_SCENE_INDEX`).
2. Incrementa `VAR_ATTEMPT_N`.
3. Define `VAR_RACE_N_CENAS` baseado em `VAR_RACE_ID` (1→6, 2→8, 3→10).
4. Captura `VAR_SEED` decorativa.
5. Liga `SW_RACE_ACTIVE`.
6. Chama `EV_Preload` (task 2.3).
7. Executa fadein 18 frames (0.3s).

<requirements>
- Common Event `EV_RaceOrchestrator` criado com trigger "Call".
- INIT block executado na ordem especificada.
- Fadein de 18 frames para revelar a cena.
- Não escreve em `VAR_P_CENA` (escritor único é o `EV_RaceRenderer` na task 3.2 — Guia §1.1 contrato de escrita).
- Não inicializa `VAR_TIMER_FRAMES` (escritor único é o `EV_RaceTimer` na task 4.1).
</requirements>

## Subtarefas

- [ ] 3.1.1 Abrir MZ Editor → Database → Common Events
- [ ] 3.1.2 Criar `EV_RaceOrchestrator` com trigger "Call"
- [ ] 3.1.3 Adicionar INIT block (zerar variáveis)
- [ ] 3.1.4 Adicionar composição baseada em `VAR_RACE_ID`
- [ ] 3.1.5 Adicionar captura de seed via Script
- [ ] 3.1.6 Adicionar `Call Common Event: EV_Preload`
- [ ] 3.1.7 Adicionar fadein 18 frames
- [ ] 3.1.8 Salvar o projeto

## Detalhes de Implementação

### Estrutura do Common Event

```
# EV_RaceOrchestrator (Trigger: Call)
# Único escritor de: VAR_RACE_ID (entrada), VAR_RACE_N_CENAS, VAR_ATTEMPT_N, VAR_SEED,
#                   SW_RACE_ACTIVE (entrada/saída)
# NÃO escreve em: VAR_P_CENA (Renderer), VAR_TIMER_FRAMES (Timer), VAR_CONSCIENCIA (Handlers)

# === INIT BLOCK ===
Control Variables: VAR_CONSCIENCIA = 0
Control Variables: VAR_PONTOS_GLORIA = 0
Control Variables: VAR_SCENE_INDEX = 0
Control Variables: VAR_ATTEMPT_N += 1

# === COMPOSIÇÃO POR CORRIDA ===
If VAR_RACE_ID == 1
  Control Variables: VAR_RACE_N_CENAS = 6
Else
  If VAR_RACE_ID == 2
    Control Variables: VAR_RACE_N_CENAS = 8
  Else
    Control Variables: VAR_RACE_N_CENAS = 10
  End
End

# === SEED DECORATIVA ===
Script: $gameVariables.setValue(111, Math.floor(Math.random() * 1000000000))
# VAR_SEED capturada para logging/playtest. Math.random() não é seedável em v1.

# === ATIVA ESTADO DA CORRIDA ===
Control Switches: SW_RACE_ACTIVE = ON
Control Switches: SW_INPUT_LOCKED = ON   # trava input durante o setup inicial

# === PRÉ-CARREGAMENTO ===
Call Common Event: EV_Preload

# === FADEIN ===
Tint Screen: (0,0,0,255), 0 frames        # começa preto (sincronizado com fadeout anterior)
Fadein Screen: 18 frames                   # 0.3s de fadein (spec §3 fase 5 transição)

# === LOOP PRINCIPAL (delegado ao Renderer) ===
# O EV_RaceRenderer (CE paralelo com SW_RACE_ACTIVE) detecta VAR_SCENE_INDEX = 0
# e renderiza a primeira cena automaticamente.
```

### Respeitando o contrato de escrita única

Conforme Guia Técnico §1.1, **exatamente um escritor por variável**:

| Variável / Switch        | Único escritor                |
| ------------------------ | ----------------------------- |
| `VAR_RACE_ID`            | Map event (autorun em Map001) |
| `VAR_SCENE_INDEX`        | Orchestrator (init) + handlers de input via `reserveCommonEvent` |
| `VAR_TIMER_FRAMES`       | `EV_RaceTimer` (task 4.1)     |
| `VAR_CONSCIENCIA`        | Handlers de resolução (tasks 5.1, 5.2) |
| `VAR_P_CENA`             | `EV_RaceRenderer` (task 3.2)  |
| `SW_INPUT_LOCKED`        | Orchestrator (ligado no INIT, desligado no fim da resolução pelos handlers) |
| `SW_CRASH_FLAG`          | Handlers de Risk-falha (task 5.2) |

### Por que `SW_INPUT_LOCKED = ON` no INIT?

O `EV_RaceRenderer` precisa de 18 frames (0.3s) para fazer o setup da cena 1 antes que o jogador possa clicar. Sem o lock, um clique rápido durante o fadein dispararia o handler antes do botão estar posicionado — crash visual ou input perdido. O handler de resolução (task 5.3) desliga o lock ao final da animação.

### Onde chamar o `EV_RaceOrchestrator`?

1. **Map001 event autorun** (task 3.5) — ponto de entrada visível.
2. **`EV_Crash`** (task 6.1) — reinicia após crash.
3. **Console debug:** `$gameTemp.reserveCommonEvent(ID_DO_ORCHESTRATOR)`.

### Erro comum a evitar

- **Não sortear `VAR_P_CENA` aqui** — o sorteio é por cena e feito pelo `EV_RaceRenderer` quando detecta mudança de `VAR_SCENE_INDEX`. Se você sortear no Orchestrator, todas as cenas terão o mesmo `VAR_P_CENA`.
- **Não use `Wait 0.3s`** — sempre `Wait N frames` para evitar drift (Guia §8.2 anti-prática #5).
- **Não use `Game_Timer` nativo** — `onExpire` chama `BattleManager.abort()` (Guia §8.2 anti-prática #3).

## visual_validation

Ao concluir esta task (após também ter 3.5 pronto):
1. No Map001, ative o event autorun que chama `EV_RaceOrchestrator` (via Playtest).
2. **Antes do fadein:** tela preta (do estado anterior).
3. **Durante o fadein (0.3s):** tela clareia progressivamente.
4. **Após fadein:** cena 1 do minigame começa a renderizar (mas ainda sem botões clicáveis — vêm na task 4.2).
5. Pressione F9 → veja `VAR_CONSCIENCIA = 0`, `VAR_PONTOS_GLORIA = 0`, `VAR_SCENE_INDEX = 0`, `VAR_ATTEMPT_N = 1` (ou N+1), `VAR_RACE_N_CENAS = 6/8/10` conforme `VAR_RACE_ID`, `VAR_SEED = número grande`.
6. F9 → Switches: `SW_RACE_ACTIVE = ON`, `SW_INPUT_LOCKED = ON`.

## Critérios de Sucesso

- [ ] `EV_RaceOrchestrator` existe com trigger "Call".
- [ ] INIT block zera `VAR_CONSCIENCIA`, `VAR_PONTOS_GLORIA`, `VAR_SCENE_INDEX`.
- [ ] `VAR_ATTEMPT_N += 1` executa corretamente.
- [ ] `VAR_RACE_N_CENAS` é 6, 8, ou 10 baseado em `VAR_RACE_ID`.
- [ ] `VAR_SEED` é capturado via `Math.random()`.
- [ ] `SW_RACE_ACTIVE = ON` e `SW_INPUT_LOCKED = ON` ao final do INIT.
- [ ] `EV_Preload` é chamado antes do fadein.
- [ ] Fadein 18 frames executado.
- [ ] Respeita contrato de escrita única (não escreve em `VAR_P_CENA` ou `VAR_TIMER_FRAMES`).
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Renderizar a cena 1 (feito pelo `EV_RaceRenderer` na task 3.2).
- Detectar vitória/crash (feito em tasks 5.x e 6.x).
- Implementar fadeout/crash visual (feito na task 6.1 `EV_Crash`).
- Pré-carregar texturas (feito na task 2.3 `EV_Preload`).
- Sortear `VAR_P_CENA` da cena 1 (feito pelo `EV_RaceRenderer`).
