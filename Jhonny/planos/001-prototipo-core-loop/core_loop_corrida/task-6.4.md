---
status: pending
---

<task_context>
<domain>engine/gameplay/victory</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>medium</complexity>
<dependencies>task-5.4</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 6.4: Implementar Tela de Vitória da Corrida

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §8 (encerramento da corrida), §3 (progressão entre corridas)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §3.2 (linhas 381-408 — INIT/reset entre corridas), §3.1 (linhas 349-379 — `VAR_RACE_ID`, `VAR_PONTOS_GLORIA`)

## Visão Geral

Criar o Common Event `EV_VitoriaCorrida`, disparado quando o jogador completa **todas as cenas** de uma corrida sem crashar (`VAR_SCENE_INDEX >= VAR_RACE_N_CENAS`). Esta task:

1. Mostra uma tela de vitória com a **pontuação final** (`VAR_PONTOS_GLORIA`).
2. Decide a **próxima corrida** (incrementa `VAR_RACE_ID` se < 3).
3. Reseta o estado para a próxima corrida (preservando `VAR_RACE_ID` novo e `VAR_ATTEMPT_N`).
4. Re-inicia o Orchestrator para a próxima corrida (ou mostra "FIM" se completou Corrida 3).

<requirements>
- `EV_VitoriaCorrida` criado com trigger "Call".
- Disparado pelo `EV_RaceRenderer` quando `VAR_SCENE_INDEX >= VAR_RACE_N_CENAS` (task-6.3).
- Mostra texto "VITÓRIA!" + pontuação final via TextPicture.
- Aguarda input do jogador (botão "Continuar" ou tecla).
- Após input: incrementa `VAR_RACE_ID` (se < 3), reseta estado, chama `EV_RaceOrchestrator`.
- Caso `VAR_RACE_ID == 3`: mostra tela "FIM" (não incrementa).
- Respeita preservação seletiva do Orchestrator (§3.2 do Guia).
- Duração da animação ≤ 2 segundos (não é crash — pode ser mais cerimonial).
</requirements>

## Subtarefas

- [ ] 6.4.1 Criar Common Event `EV_VitoriaCorrida` com trigger "Call"
- [ ] 6.4.2 Apagar pictures 1-60 (limpar cena de corrida)
- [ ] 6.4.3 Adicionar `Show Picture: 5` (fundo de vitória — criar `race/bg_vitoria.png` se faltar)
- [ ] 6.4.4 Adicionar `Play ME: "Victory"` ou `Play BGM: "vitoria.ogg"` (ME = Musical Effect)
- [ ] 6.4.5 Plugin Command TextPicture para "VITÓRIA!" grande no centro
- [ ] 6.4.6 Plugin Command TextPicture para "Pontos de Glória: \V[106]"
- [ ] 6.4.7 Plugin Command TextPicture para "Pressione [Espaço] para continuar"
- [ ] 6.4.8 Adicionar `Wait` por input (loop `Label: wait_input` + `If Button: OK is Triggered` → sair)
- [ ] 6.4.9 Após input, apagar pictures de vitória
- [ ] 6.4.10 `If VAR_RACE_ID < 3: Control Variables VAR_RACE_ID += 1` (avança corrida)
- [ ] 6.4.11 `Call Common Event: EV_RaceOrchestrator` (inicia próxima corrida)
- [ ] 6.4.12 Caso contrário (`VAR_RACE_ID == 3`): mostrar tela "FIM" e terminar (não chamar Orchestrator)
- [ ] 6.4.13 Salvar e validar com Playtest

## Detalhes de Implementação

### Pseudo-código do `EV_VitoriaCorrida`

```
# EV_VitoriaCorrida (Trigger: Call)
# Disparado pelo EV_RaceRenderer quando VAR_SCENE_INDEX >= VAR_RACE_N_CENAS.
# Mostra tela cerimonial de vitória + decide próxima corrida.

# === LIMPEZA DA CENA DE CORRIDA ===
Script: for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);

# Parar BGM da corrida e tocar fanfarro
Stop BGM: 1 second fadeout
Play ME: "Victory", volume 90, pitch 100, pan 0

# === MOSTRAR TELA DE VITÓRIA ===

# Fundo
Show Picture: 5, "race/bg_vitoria", (0,0), (100%, 100%), 255, 12 frames, Normal

# Esperar fade-in do fundo
Wait: 12 frames

# Texto "VITÓRIA!" grande
Plugin Command: TextPicture > Set Text
  text: "VITÓRIA!"
Plugin Command: TextPicture > Show
  pictureId: 53
  position: (308, 200)  # centro horizontal ~816/2-textwidth/2
  fontSettings: size 72, bold, color gold (6)

# Texto da pontuação
Plugin Command: TextPicture > Set Text
  text: "Pontos de Glória: \\V[106]"
Plugin Command: TextPicture > Show
  pictureId: 54
  position: (260, 320)
  fontSettings: size 36, color white (0)

# Texto de instrução
Plugin Command: TextPicture > Set Text
  text: "Pressione [Espaço] para continuar"
Plugin Command: TextPicture > Show
  pictureId: 55
  position: (240, 450)
  fontSettings: size 24, color gray (7)

# === LOOP DE ESPERA POR INPUT ===
Label: wait_input
If Button: OK is Triggered       # OK = Espaço/Enter no MZ
  Jump to Label: end_wait
End
Wait: 1 frame
Jump to Label: wait_input
Label: end_wait

# === LIMPEZA DA TELA DE VITÓRIA ===
Erase Picture: 5
Erase Picture: 53
Erase Picture: 54
Erase Picture: 55

# === DECISÃO: PRÓXIMA CORRIDA OU FIM ===
If VAR_RACE_ID < 3
  # Avança para próxima corrida
  Control Variables: VAR_RACE_ID += 1

  # Chama Orchestrator (reseta Consciência, Glória, SCENE_INDEX, mas preserva RACE_ID novo)
  Call Common Event: EV_RaceOrchestrator
Else
  # Corrida 3 completada → tela de FIM
  Show Picture: 5, "race/bg_fim", (0,0), (100%,100%), 255, 12 frames, Normal
  Wait: 12 frames

  Plugin Command: TextPicture > Set Text "FIM"
  Plugin Command: TextPicture > Show, pictureId: 53, position: (350, 280), size 96, gold

  Plugin Command: TextPicture > Set Text "Obrigado por jogar!"
  Plugin Command: TextPicture > Show, pictureId: 54, position: (260, 400), size 32, white

  # Loop eterno (jogador fecha o jogo)
  Label: end_loop
  Wait: 60 frames
  Jump to Label: end_loop
End
```

### Posições dos textos (resolução 816×624)

| Elemento | Picture ID | Posição | Tamanho |
|----------|-----------|---------|---------|
| Fundo vitória | 5 | (0, 0) | 100% (fullscreen) |
| "VITÓRIA!" | 53 | (308, 200) | 72px dourado |
| "Pontos de Glória: N" | 54 | (260, 320) | 36px branco |
| "Pressione [Espaço]..." | 55 | (240, 450) | 24px cinza |
| "FIM" | 53 (re-usado) | (350, 280) | 96px dourado |
| "Obrigado por jogar!" | 54 (re-usado) | (260, 400) | 32px branco |

> [!note] Cores de TextPicture
> Cores padrão MZ (0-31): 0=branco, 6=amarelo/dourado, 7=cinza. Para tons específicos, criar `TextPicture` config.

### Por que `Stop BGM` antes de `Play ME`?

`Play ME` (Musical Effect) é um jingle curto que toca **sobre** o BGM. Se você não parar o BGM, os dois tocam juntos (caos sonoro). Sequência:

1. **Fadeout BGM** (~1s) → silêncio.
2. **Play ME** (jingle de vitória, ~2-3s).
3. **Após ME:** tocar BGM da próxima corrida (no INIT Orchestrator).

### Loop de espera por input

```
Label: wait_input
If Button: OK is Triggered       # OK = Espaço/Enter
  Jump to Label: end_wait
End
Wait: 1 frame
Jump to Label: wait_input
```

- `If Button: OK is Triggered`: `Input.isTriggered('ok')` no MZ.
- `OK` é mapeado por padrão para **Espaço** e **Enter**.
- `Wait: 1 frame`: evita loop infinito travar o jogo.

> [!warning] Não esquecer `Wait 1 frame`
> Sem ele, o loop `Label/Jump` roda 60x por segundo sem yield → trava o NW.js.

### Por que esperar input?

Tela de vitória que some sozinha em 2s:

- Jogador pode não ver a pontuação.
- Sensação de "apressado".

Tela que espera input:

- Jogador controla o ritmo.
- Pode pausar para celebrar.

Spec §8 menciona "encerramento cerimonial" — input-driven alinha com isso.

### Decisão: avançar corrida ou FIM?

| Condição | Ação |
|----------|------|
| `VAR_RACE_ID < 3` | Incrementa → próxima corrida (1→2, 2→3) |
| `VAR_RACE_ID == 3` | Tela "FIM" (não há corrida 4) |

Razões:

- Spec §3: 3 corridas fixas (Lenda/Rachadura/Abismo).
- Progressão natural: termina 1 → vai para 2 → termina 2 → vai para 3 → termina 3 → FIM.
- Em v2: pode adicionar endless mode ou NG+.

### Preservação seletiva no `EV_RaceOrchestrator`

Quando `EV_VitoriaCorrida` chama `EV_RaceOrchestrator` (após incrementar `VAR_RACE_ID`):

- `VAR_RACE_ID`: já foi incrementado (preservado).
- `VAR_ATTEMPT_N`: incrementado no INIT Orchestrator (mantém contagem entre corridas).
- `VAR_RACE_N_CENAS`: recalculado pelo INIT (task-6.3).
- `VAR_CONSCIENCIA`, `VAR_PONTOS_GLORIA`, `VAR_SCENE_INDEX`: resetados pelo INIT (§3.2).

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Esquecer `Erase Picture` após vitória | Texto fica na próxima corrida | Apagar 53/54/55 antes de chamar Orchestrator |
| Loop sem `Wait 1 frame` | Jogo trava | Sempre yield em loops |
| Incrementar `VAR_RACE_ID` sem clamp | Vai para 4, 5, ... | `If VAR_RACE_ID < 3` (não incrementa se já é 3) |
| Tocar ME sem parar BGM | Som caótico | `Stop BGM` antes de `Play ME` |
| Chamar Orchestrator sem incrementar RACE_ID | Repete a mesma corrida | Sempre incrementar antes |
| Loop "FIM" infinito sem saída | Jogador não consegue fechar | Aceitar input para sair ou apenas fechar janela |
| Esquecer check `VAR_SCENE_INDEX >= VAR_RACE_N_CENAS` no Renderer | Vitória nunca dispara | Implementar no EV_RaceRenderer |
| Picture ID 53/54/55 colidindo com HUD | Textos sobrepostos | Reservar 53-55 para vitória |

### Integração com `EV_RaceRenderer`

```
# EV_RaceRenderer (trecho — após resolução, antes de sortear próxima cena)

If VAR_SCENE_INDEX >= VAR_RACE_N_CENAS
  # Todas as cenas completas
  Call Common Event: EV_VitoriaCorrida
  Exit Event Processing   # não continua o loop de render
Else
  # Continua para próxima cena
  ...sorteio normal...
End
```

Sem este check, Renderer continuaria sorteando cena `N+1`, `N+2`, etc. — bug sério.

### Sobre o background de vitória

Se `race/bg_vitoria.png` não existir (task-2.1 deveria ter criado), alternativas:

- **Tela preta + texto dourado** (minimalista).
- **Tint Screen dourado** + texto simples.
- **Reusar bg da última cena** com filtro de overlay.

Gerar picture formalmente em tarefa separada se faltar.

## visual_validation

Ao concluir esta task (com 5.4, 6.3 prontos):

1. Inicie Corrida 1 (`VAR_RACE_ID = 1`).
2. Force `VAR_SCENE_INDEX = 5` (última cena da Corrida 1, 0-indexed = cena 6): `$gameVariables.setValue(102, 5)` no F12.
3. Faça Safe para avançar (cena 6 = N_CENAS = 6 → vitória).
4. **Tela de vitória aparece:**
   - Fundo (ou tela preta dourada).
   - "VITÓRIA!" grande no centro.
   - "Pontos de Glória: N" abaixo.
   - "Pressione [Espaço] para continuar".
5. BGM para, ME de vitória toca.
6. Pressione **Espaço**.
7. Tela limpa, **Corrida 2 começa** (fadein da próxima corrida).
8. F9 → `VAR_RACE_ID = 2` ✓.
9. Repita para vencer Corrida 2 → vai para Corrida 3.
10. Vença Corrida 3 → tela "FIM" + "Obrigado por jogar!".
11. Console F12 sem erros.

## Critérios de Sucesso

- [ ] `EV_VitoriaCorrida` existe com trigger "Call".
- [ ] Disparado quando `VAR_SCENE_INDEX >= VAR_RACE_N_CENAS`.
- [ ] Mostra pontuação final corretamente.
- [ ] Espera input do jogador (Espaço/Enter).
- [ ] Incrementa `VAR_RACE_ID` se < 3.
- [ ] Chama `EV_RaceOrchestrator` para iniciar próxima corrida.
- [ ] Tela "FIM" ao completar Corrida 3.
- [ ] Apaga pictures de vitória antes de chamar Orchestrator.
- [ ] Loop de input tem `Wait 1 frame` (não trava).
- [ ] Sem erros no console.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo nas 3 corridas.

## Fora de Escopo

- Tela de estatísticas detalhadas (tentativas, % sucesso Risk, etc.) — fora do MVP.
- High score / leaderboard — fora do MVP.
- Animação elaborada de vitória (partículas, zoom, etc.) — fora do MVP.
- Salvar progresso entre sessões (Save/Load) — fora do MVP.
- Modo NG+ após completar Corrida 3 — fora do MVP.
- Transição VN entre corridas (cutscene narrativa) — sistema VN separado.
- Música específica por corrida (3 BGMs diferentes) — fora do MVP.
