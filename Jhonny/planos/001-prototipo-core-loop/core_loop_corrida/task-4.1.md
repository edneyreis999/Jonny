---
status: pending
---

<task_context>
<domain>engine/gameplay/timer</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-3.2</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 4.1: Criar `EV_RaceTimer` (Parallel, Tick por Frame, 3 Guardas)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §3 (Anatomia de uma Cena — fase 2 Janela input)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §2.3 (linhas 248-299), §2.4 (linhas 301-325)

## Visão Geral

Criar o Common Event `EV_RaceTimer` com trigger "Parallel" e condition `SW_RACE_ACTIVE`. Ele é o **único escritor de `VAR_TIMER_FRAMES`** (com exceção do Renderer no setup). A cada tick (1 frame), decrementa `VAR_TIMER_FRAMES`. Quando chega a 0, dispara timeout → ação safe automática.

<requirements>
- Common Event `EV_RaceTimer` criado com trigger "Parallel" e condition `SW_RACE_ACTIVE`.
- Loop com `Label + Jump to Label` terminando obrigatoriamente em `Wait 1 frame`.
- 3 guardas no início: `SW_RACE_ACTIVE == OFF` → exit, `SW_INPUT_LOCKED == ON` → skip tick, `VAR_TIMER_FRAMES <= 0` → exit (já expirou).
- Decrementa `VAR_TIMER_FRAMES` por 1 a cada frame.
- Quando `VAR_TIMER_FRAMES == 0`, chama `EV_OnSafe` com flag de timeout.
- Não escreve em `VAR_CONSCIENCIA` (escritor único são os handlers).
</requirements>

## Subtarefas

- [ ] 4.1.1 Criar variável auxiliar `VAR_TIMER_TIMEOUT_FLAG` (ID 116) para distinguish timeout vs clique
- [ ] 4.1.2 Criar Common Event `EV_RaceTimer` com trigger "Parallel" e condition `SW_RACE_ACTIVE`
- [ ] 4.1.3 Implementar loop com Label + Jump to Label
- [ ] 4.1.4 Implementar 3 guardas no início
- [ ] 4.1.5 Implementar decremento de `VAR_TIMER_FRAMES`
- [ ] 4.1.6 Implementar detecção de timeout e chamada de `EV_OnSafe`
- [ ] 4.1.7 Salvar o projeto

## Detalhes de Implementação

### Estrutura do Common Event

```
# EV_RaceTimer (Trigger: Parallel, Condition: SW_RACE_ACTIVE == ON)
# Único escritor de: VAR_TIMER_FRAMES (decremento contínuo)

Label: TICK
  # Guarda 1: fora de corrida (VN ativa, menu, etc.)
  If SW_RACE_ACTIVE == OFF
    Exit Event Processing
  End

  # Guarda 2: input locked (durante setup 0.3s ou resolução 0.4s) — pausa o timer
  If SW_INPUT_LOCKED == ON
    Wait 1 frame
    Jump to Label: TICK
  End

  # Guarda 3: já expirou (não tem o que fazer)
  If VAR_TIMER_FRAMES <= 0
    Wait 1 frame
    Jump to Label: TICK
  End

  # Decremento
  Control Variables: VAR_TIMER_FRAMES -= 1

  # Detecção de timeout
  If VAR_TIMER_FRAMES == 0
    # Timeout → ação safe automática (spec §4 e §5)
    Control Variables: VAR_TIMER_TIMEOUT_FLAG = 1
    Call Common Event: EV_OnSafe
    # EV_OnSafe (task 5.1) lê VAR_TIMER_TIMEOUT_FLAG e reseta para 0
  End

  Wait 1 frame
  Jump to Label: TICK
```

### Por que `Wait 1 frame` no final?

Em CE paralelo, o `Wait 1 frame` é **obrigatório** para liberar o interpreter deste CE para o próximo tick do frame. Sem ele:
- O CE spinnedentro de um único frame → engine trava.
- Ou pior: o decremento acontece infinitamente em 1 frame → `VAR_TIMER_FRAMES` vai para -∞ instantaneamente.

### Respeitando o contrato de escrita única

| Variável             | Único escritor                          |
| -------------------- | --------------------------------------- |
| `VAR_TIMER_FRAMES`   | `EV_RaceTimer` (decremento) + `EV_RaceRenderer` (reset no setup) |
| `VAR_TIMER_TIMEOUT_FLAG` | `EV_RaceTimer` (set 1) + `EV_OnSafe` (reset 0) |

> O Renderer (task 3.2) seta `VAR_TIMER_FRAMES = 240` ou `210` no setup da cena. O Timer só decrementa. Sem Race Condition.

### Por que 3 guardas?

1. **`SW_RACE_ACTIVE == OFF`**: previne execução durante VN ou menu (timer para de correr).
2. **`SW_INPUT_LOCKED == ON`**: pausa timer durante setup (0.3s) e resolução (0.4s) — sensação de "tempo congelado" durante animação.
3. **`VAR_TIMER_FRAMES <= 0`**: evita underflow (timer já expirou, handler ainda não resetou).

Sem guarda 2, o timer continuaria correndo durante a animação de resolução, fazendo o jogador perder tempo da próxima cena. Sem guarda 3, `VAR_TIMER_FRAMES` iria para negativo entre o timeout e o reset.

### Por que não usar `Game_Timer` nativo?

`Game_Timer` (`rmmz_objects.js:425-466`) é o timer do HUD do jogador. Problemas:
- **`onExpire` chama `BattleManager.abort()`** (`rmmz_objects.js:464-466`) — hardcoded para combate.
- **É singleton global** (`$gameTimer`) — não suporta múltiplos timers concorrentes.
- **Resolução em frames**, mas a UI dele é em segundos.

Para QTE com timer de 3.5s precisão sub-segundo, `VAR_TIMER_FRAMES` + CE paralelo é o padrão correto.

### Erro comum a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Esquecer `Wait 1 frame` no final | Engine trava | Sempre terminar loop com `Wait 1 frame` |
| Esquecer guarda `SW_INPUT_LOCKED` | Timer corre durante animação; jogador perde tempo | Sempre checar `SW_INPUT_LOCKED` antes de decrementar |
| Usar `Wait 0.1s` em vez de `Wait 1 frame` | Drift de 16% por tick (Guia §8.2 #5) | Sempre `Wait 1 frame` |
| Decrementar com `Math.max(0, ...)` via Script | Verboso; MZ `Control Variables` já suporta `-= 1` com floor | Usar command nativo |
| Resetar `VAR_TIMER_FRAMES` aqui | Conflito com Renderer (escritor único) | Timer só decrementa; Renderer reseta no setup |

## visual_validation

Ao concluir esta task (com 4.3 e 5.1 prontos para o handler de timeout):
1. No Map001, ative o event autorun.
2. Após o fadein, a cena 1 aparece com timer de 240 frames (Sinal) ou 210 (Curva).
3. Pressione F9 continuamente — observe `VAR_TIMER_FRAMES` diminuindo a cada frame (ex.: 240 → 239 → 238 → ...).
4. Não clicar em nada — após 4.0s (Sinal) ou 3.5s (Curva), o timer expira:
   - `VAR_TIMER_FRAMES = 0`.
   - `VAR_TIMER_TIMEOUT_FLAG = 1` momentaneamente.
   - `EV_OnSafe` é chamado (ainda sem implementação completa na task 5.1, mas o chamado acontece).
5. Console (F12) sem erros.

## Critérios de Sucesso

- [ ] `EV_RaceTimer` existe com trigger "Parallel" e condition `SW_RACE_ACTIVE`.
- [ ] Loop com Label + Jump to Label, terminando em `Wait 1 frame`.
- [ ] 3 guardas implementados corretamente.
- [ ] `VAR_TIMER_FRAMES` decrementa por 1 a cada frame.
- [ ] Timeout dispara `EV_OnSafe` com `VAR_TIMER_TIMEOUT_FLAG = 1`.
- [ ] Respeita contrato de escrita única (não escreve em `VAR_CONSCIENCIA` ou `VAR_PONTOS_GLORIA`).
- [ ] Engine não trava (spin infinito evitado).
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- Implementar `EV_OnSafe` completo (feito na task 5.1).
- Animar barra visual de timer (feita por overlay separado com `Move Picture` baseado em `VAR_TIMER_FRAMES` — polish posterior).
- Tocar som de "tick" opcional nos últimos 1.5s (polish posterior; spec §4 menciona como opcional).
- Implementar `Game_Timer` nativo (anti-pattern).
