---
status: pending
---

<task_context>
<domain>engine/gameplay/victory</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>task-5.4, task-6.1, task-6.3</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 6.4: Implementar Tela de Vitória com Critério de Pontuação Mínima

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §1 ("Condição de vitória: Ter a MAIOR pontuação total ao final da corrida"), §8 (encerramento da corrida), §3 (progressão entre corridas)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §3.1 (linhas 349-379 — `VAR_RACE_ID` Editor ID **100**, `VAR_PONTOS_GLORIA` Editor ID **105**), §3.2 (linhas 381-408 — INIT/reset entre corridas)
- Mapa canônico de IDs: ver [[tasks#Mapa de IDs]] — `VAR_RACE_ID=100`, `VAR_PONTOS_GLORIA=105`, `VAR_SCENE_INDEX=101`, `VAR_RACE_N_CENAS=111`, `VAR_VITORIA_PASSOU=117` (reservar nesta task)

## Visão Geral

Criar o Common Event `EV_VitoriaCorrida` (CE Editor ID 19), disparado quando o jogador completa **todas as cenas** de uma corrida sem crashar (`VAR_SCENE_INDEX >= VAR_RACE_N_CENAS`). Esta task implementa o **critério de pontuação mínima** confirmado pelo usuário (decisão 4 em [[tasks#DECISÕES CONFIRMADAS PELO USUÁRIO]]):

1. **Threshold por corrida** (calibrável em playtest; defaults propostos abaixo).
2. Compara `VAR_PONTOS_GLORIA` contra o threshold da corrida atual.
3. **Se passou (`VAR_VITORIA_PASSOU = 1`):**
   - Mostra tela de vitória cerimonial.
   - Após input, incrementa `VAR_RACE_ID` (se < 3) e chama `EV_RaceOrchestrator`.
   - Caso `VAR_RACE_ID == 3` (após incremento): tela "FIM".
4. **Se NÃO passou (`VAR_VITORIA_PASSOU = 0`):**
   - Mostra tela de "DERROTA" (não avança).
   - Após input, chama `EV_Crash` (CE 18) para restart da **mesma corrida** sem avançar `VAR_RACE_ID`.

**Thresholds propostos (calibráveis):**

| `VAR_RACE_ID` | Corrida | Threshold de `VAR_PONTOS_GLORIA` |
|---------------|---------|----------------------------------|
| 1 | Lenda (6 cenas) | **60** |
| 2 | Rachadura (8 cenas) | **100** |
| 3 | Abismo (10 cenas) | **150** |

> [!info] Por que esses números?
> Pontuação máxima teórica por corrida (todas Safe: +10/cena):
> - Corrida 1 (6 cenas): 60. Threshold 60 = "perfeito no Safe".
> - Corrida 2 (8 cenas): 80. Threshold 100 **exige** alguns Risk-sucessos.
> - Corrida 3 (10 cenas): 100. Threshold 150 **exige** múltiplos Risk-sucessos com P_CENA altos.
>
> Risk-sucesso dá `+P_CENA×2` (10-200 por cena). Então Risk é necessário para passar thresholds 2 e 3.
>
> Valores são **defaults para playtest** — ajustar conforme observação de dificuldade real.

<requirements>
- `EV_VitoriaCorrida` criado com Editor ID 19 e trigger "Call".
- Disparado pelo `EV_RaceRenderer` (CE 7) quando `VAR_SCENE_INDEX >= VAR_RACE_N_CENAS`.
- **Threshold check via Script inline** compara `VAR_PONTOS_GLORIA` (105) contra thresholds por `VAR_RACE_ID` (100).
- **Reservar `VAR_VITORIA_PASSOU` (Editor ID 117)** em `System.json` via script `fase6/setup_phase6_system.py` (pré-passo).
- Mostra **3 a 4 textos via TextPicture** (Plugin Command — passo manual MZ, mesma heurística da task 5.4):
  - **Picture 53: "VITÓRIA!"** (mostrada quando `VAR_VITORIA_PASSOU == 1`).
  - **Picture 56: "DERROTA!"** (mostrada quando `VAR_VITORIA_PASSOU == 0`).
  - Picture 54: "Pontos de Glória: N" (sempre).
  - Picture 55: "Pressione [Espaço] para continuar" (sempre).
- **Decisão 2026-06-19:** usar **2 TextPicture separados** (Picture 53 e 56) em vez de If/Else para alternar texto. TextPicture é fixo em edição — simplifica debug e evita condicional dentro de Plugin Command.
- Aguarda input do jogador (botão OK / tecla Espaço-Enter).
- Após input: branch por `VAR_VITORIA_PASSOU`:
  - **1 (passou):** incrementa `VAR_RACE_ID` (se < 3) → Call `EV_RaceOrchestrator`. Caso `VAR_RACE_ID == 3`: tela "FIM".
  - **0 (não passou):** chama `EV_Crash` (CE 18) — restart da mesma corrida, `VAR_ATTEMPT_N` incrementa.
- Duração da animação de vitória ≤ 3 segundos (cerimonial, mas não arrastado).
- Não deixa resíduos de pictures ao sair.
</requirements>

## Subtarefas

### Pré-passos

- [ ] 6.4.1 Criar script `Jhonny/planos/001-prototipo-core-loop/fase6/setup_phase6_system.py` para reservar `VAR_VITORIA_PASSOU` (Editor ID 117) em `System.json`. Validar com `python -m json.tool`.
- [ ] 6.4.2 Confirmar via snapshot que `variables[117]` está nomeado ("Vitoria: Passou").

### Implementação via script gerador

- [ ] 6.4.3 Estender `Jhonny/planos/001-prototipo-core-loop/fase6/build_phase6_ces.py` (iniciado em task-6.1) com CE 19 (`EV_VitoriaCorrida`).
- [ ] 6.4.4 Adicionar wire no CE 7 (`EV_RaceRenderer`): após incremento de `SCENE_INDEX`, adicionar `If VAR_SCENE_INDEX >= VAR_RACE_N_CENAS → Call CE 19 → Exit Event Processing`.
- [ ] 6.4.5 Sequência do CE 19 (parte JSON-automatizável):
  - [ ] 6.4.5a `Script:` erase pictures 1-60 — `for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);`
  - [ ] 6.4.5b `Stop BGM` com 60 frames de fadeout (code 241).
  - [ ] 6.4.5c `Play ME: "Victory"` (code 249) volume 90, pitch 100, pan 0 — ou `Play BGM: "vitoria"` se ME não existir.
  - [ ] 6.4.5d `Show Picture: 5, "race/bg_vitoria", (0,0), (100%,100%), 255, 12 frames, Normal` (code 231) — fallback: Tint Screen dourado via code 223.
  - [ ] 6.4.5e `Wait: 12 frames` (code 230) — deixar fundo aparecer.
  - [ ] 6.4.5f **Threshold check (Script inline, code 355):**
    ```javascript
    const pontos = $gameVariables.value(105);  // VAR_PONTOS_GLORIA
    const raceId = $gameVariables.value(100);  // VAR_RACE_ID
    const thresholds = { 1: 60, 2: 100, 3: 150 };
    const passou = pontos >= (thresholds[raceId] || 60);
    $gameVariables.setValue(117, passou ? 1 : 0);  // VAR_VITORIA_PASSOU
    ```
  - [ ] 6.4.5g `Wait: 1 frame` para o MZ processar a escrita.
- [ ] 6.4.6 **Placeholder Comment no CE 19** (gerador) marcando onde o usuário deve inserir os Plugin Commands TextPicture manualmente no MZ Editor:
  - `Comment: TASK 6.4 — Inserir manualmente 4x Plugin Command TextPicture (Picture 53/54/55/56)`
  - `Comment: 53 = "VITÓRIA!" — mostrar só se VAR_VITORIA_PASSOU (117) == 1`
  - `Comment: 56 = "DERROTA!" — mostrar só se VAR_VITORIA_PASSOU (117) == 0`
  - `Comment: 54 = "Pontos de Glória: \\V[105]" — sempre`
  - `Comment: 55 = "Pressione [Espaço] para continuar" — sempre`
- [ ] 6.4.7 Adicionar loop de espera por input (Label/Jump):
  ```
  Label: wait_input                                  # code 118
  If Script: Input.isTriggered('ok')                # code 111 + 355
    Jump to Label: end_wait                          # code 119
  End                                                # code 412
  Wait: 1 frame                                      # code 230
  Jump to Label: wait_input                          # code 119
  Label: end_wait                                    # code 118
  ```
- [ ] 6.4.8 Após input, apagar pictures de vitória: `Script: for (let i of [5,53,54,55,56]) $gameScreen.erasePicture(i);`
- [ ] 6.4.9 Branch por `VAR_VITORIA_PASSOU`:
  - [ ] 6.4.9a `If VAR_VITORIA_PASSOU (117) == 1`:
    - `If VAR_RACE_ID (100) < 3`:
      - `Control Variables: VAR_RACE_ID (100) += 1` (code 122, op=1, operand=0 const=1)
      - `Call Common Event: EV_RaceOrchestrator` (code 117, params=[5])
      - `Exit Event Processing` (code 115)
    - `Else` (RACE_ID == 3, última corrida):
      - `Show Picture: 5, "race/bg_fim", (0,0), (100%,100%), 255, 12 frames, Normal`
      - `Wait: 12 frames`
      - Placeholder Comment para usuário inserir TextPicture "FIM" + "Obrigado por jogar!" manualmente.
      - `Label: end_loop` + `Wait: 60 frames` + `Jump to Label: end_loop` (loop infinito — jogador fecha a janela)
  - [ ] 6.4.9b `Else` (VITORIA_PASSOU == 0):
    - `Comment: DERROTA — pontuação abaixo do threshold. Restart via EV_Crash.`
    - `Call Common Event: EV_Crash` (code 117, params=[18]) — task-6.1
    - `Exit Event Processing` (code 115)

### Passo manual MZ (TextPicture — não automatizável)

- [ ] 6.4.10 Abrir MZ Editor → Database (F10) → Common Events → CE 19 `EV_VitoriaCorrida`.
- [ ] 6.4.11 Substituir os 5 placeholders Comment (6.4.6) por **4 Plugin Commands TextPicture + 1 If/Else Show Picture**:
  - **Picture 53 (VITÓRIA):** `TextPicture > Set Text` com `"VITÓRIA!"` — sempre configurado, mas **só mostrado dentro do If VAR_VITORIA_PASSOU == 1** (abaixo).
  - **Picture 56 (DERROTA):** `TextPicture > Set Text` com `"DERROTA!"` — sempre configurado, mas **só mostrado dentro do Else** (VAR_VITORIA_PASSOU == 0).
  - **Picture 54 (pontuação):** `TextPicture > Set Text` com `"Pontos de Glória: \\V[105]"` — escape duplo `\\` para exibir literal `\V[105]`. Sempre mostrado.
  - **Picture 55 (instrução):** `TextPicture > Set Text` com `"Pressione [Espaço] para continuar"`. Sempre mostrado.
  - **Estrutura If/Else no CE 19 (após os Set Text):**
    ```
    If VAR_VITORIA_PASSOU (117) == 1
      TextPicture > Show: pictureId=53
    Else
      TextPicture > Show: pictureId=56
    End
    TextPicture > Show: pictureId=54
    TextPicture > Show: pictureId=55
    ```
- [ ] 6.4.12 Posicionar Pictures 53/54/55/56 conforme tabela abaixo.
- [ ] 6.4.13 Salvar (Ctrl+S) e fechar Database.

### Auditoria + validação

- [ ] 6.4.14 Rodar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` e confirmar IDs canônicos: 100 (RACE_ID), 105 (GLORIA), 117 (VITORIA_PASSOU).
- [ ] 6.4.15 Auditar operações `ControlSwitch` (code 121): confirmar semântica `0=ON | 1=OFF` (bug F5).
- [ ] 6.4.16 Pós-edição MZ obrigatória: F10 → Ctrl+S → reiniciar Playtest.
- [ ] 6.4.17 Playtest MZ com feedback perceptível (regra [[user-testable-feedback]]).

## Detalhes de Implementação

### Diagrama de fluxo do CE 19

```
EV_VitoriaCorrida (CE 19, Trigger: Call)
  │
  ├── Erase pictures 1-60
  ├── Stop BGM (60f fadeout) + Play ME "Victory"
  ├── Show Picture 5 (bg_vitoria) + Wait 12f
  ├── Threshold check (Script inline)
  │   └── seta VAR_VITORIA_PASSOU (117) = 0 ou 1
  ├── [Manual MZ] 4x TextPicture Set Text (Picture 53/56/54/55)
  ├── [Manual MZ] If/Else Show Picture:
  │   ├── If VITORIA_PASSOU == 1: Show Picture 53 ("VITÓRIA!")
  │   └── Else: Show Picture 56 ("DERROTA!")
  ├── [Manual MZ] Show Picture 54 (Glória) + Show Picture 55 (instrução)
  ├── Loop wait_input (Label/Jump + Wait 1f)
  │
  ├── Erase pictures 5, 53-56
  │
  └── Branch por VITORIA_PASSOU:
      ├── == 1 (passou):
      │   ├── If RACE_ID < 3:
      │   │   ├── RACE_ID += 1
      │   │   ├── Call CE 5 (Orchestrator)
      │   │   └── Exit Event Processing
      │   └── Else (RACE_ID == 3):
      │       ├── Show bg_fim + TextPicture "FIM"
      │       └── Loop infinito (jogador fecha janela)
      │
      └── == 0 (não passou):
          ├── Call CE 18 (EV_Crash) — restart mesma corrida
          └── Exit Event Processing
```

### Posições dos textos (resolução 816×624)

| Elemento | Picture ID | Posição | Tamanho | Cor |
|----------|-----------|---------|---------|-----|
| Fundo vitória/derrota | 5 | (0, 0) | 100% (fullscreen) | — |
| **"VITÓRIA!"** | **53** | (308, 200) | 72px | 6 (dourado) |
| **"DERROTA!"** | **56** | (308, 200) | 72px | 18 (vermelho) |
| "Pontos de Glória: N" | 54 | (260, 320) | 36px | 0 (branco) |
| "Pressione [Espaço]..." | 55 | (240, 450) | 24px | 7 (cinza) |
| "FIM" (após Corrida 3) | 53 (re-usado) | (350, 280) | 96px | 6 (dourado) |
| "Obrigado por jogar!" | 54 (re-usado) | (260, 400) | 32px | 0 (branco) |

> [!note] Cores de TextPicture
> Cores padrão MZ (0-31): 0=branco, 6=amarelo/dourado, 7=cinza, 18=vermelho. Para tons específicos, criar `TextPicture` config.
>
> [!info] Picture 53 e 56 nunca coexistem
> Estrutura If/Else no CE 19 garante que apenas Picture 53 (VITÓRIA) **ou** Picture 56 (DERROTA) seja mostrada — nunca ambas. Reduz confusão visual. Após input, **apagar ambos** via Script inline para garantir limpeza mesmo se o usuário editar o fluxo no futuro.

### Threshold check — por que Script inline e não If/Else MZ?

MZ `If` nativo não suporta lookup em dicionário. Opção com If/Else puro:

```
If VAR_RACE_ID == 1
  If VAR_PONTOS_GLORIA >= 60
    Control Variables: VAR_VITORIA_PASSOU = 1
  Else
    Control Variables: VAR_VITORIA_PASSOU = 0
  End
Else If VAR_RACE_ID == 2
  ... (repete 3x)
End
```

→ 12+ comandos, verboso.

Script inline é mais compacto e fácil de calibrar (mudar thresholds num único lugar):

```javascript
const pontos = $gameVariables.value(105);  // VAR_PONTOS_GLORIA
const raceId = $gameVariables.value(100);  // VAR_RACE_ID
const thresholds = { 1: 60, 2: 100, 3: 150 };
const passou = pontos >= (thresholds[raceId] || 60);
$gameVariables.setValue(117, passou ? 1 : 0);  // VAR_VITORIA_PASSOU
```

### Por que `Stop BGM` antes de `Play ME`?

`Play ME` (Musical Effect) é um jingle curto que toca **sobre** o BGM. Se você não parar o BGM, os dois tocam juntos (caos sonoro). Sequência:

1. **Fadeout BGM** (~1s) → silêncio.
2. **Play ME** (jingle de vitória/derrota, ~2-3s).
3. **Após ME:** tocar BGM da próxima corrida (no INIT Orchestrator).

### Loop de espera por input

```
Label: wait_input
If Script: Input.isTriggered('ok')   # OK = Espaço/Enter no MZ
  Jump to Label: end_wait
End
Wait: 1 frame
Jump to Label: wait_input
Label: end_wait
```

- `Input.isTriggered('ok')`: true no frame em que a tecla é pressionada.
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
- Pode pausar para celebrar (ou refletir sobre a derrota).

Spec §8 menciona "encerramento cerimonial" — input-driven alinha com isso.

### Decisão: 4 caminhos após vitória

| Condição | Texto Picture 53 | Próxima ação |
|----------|------------------|-------------|
| `VITORIA_PASSOU=1` AND `RACE_ID<3` | "VITÓRIA!" | Incrementa RACE_ID → Call CE 5 (próxima corrida) |
| `VITORIA_PASSOU=1` AND `RACE_ID==3` | "VITÓRIA!" | Tela "FIM" + loop infinito |
| `VITORIA_PASSOU=0` AND `RACE_ID<3` | "DERROTA!" | Call CE 18 (EV_Crash) → restart mesma corrida |
| `VITORIA_PASSOU=0` AND `RACE_ID==3` | "DERROTA!" | Call CE 18 (EV_Crash) → restart mesma corrida (sem endless) |

### Preservação seletiva no `EV_RaceOrchestrator` (chamado por CE 19 quando passou)

Quando `EV_VitoriaCorrida` chama `EV_RaceOrchestrator` (após incrementar `VAR_RACE_ID`):

- `VAR_RACE_ID`: já foi incrementado (preservado).
- `VAR_ATTEMPT_N`: incrementado no INIT Orchestrator (mantém contagem entre corridas).
- `VAR_RACE_N_CENAS`: recalculado pelo INIT (task-6.3 — baseado em novo RACE_ID).
- `VAR_CONSCIENCIA`, `VAR_PONTOS_GLORIA`, `VAR_SCENE_INDEX`: resetados pelo INIT (§3.2).
- `VAR_VITORIA_PASSOU`: deve ser resetado (próxima corrida começa "não passou") — Orchestrator INIT deve fazer `Control Variables: VAR_VITORIA_PASSOU = 0` (adicionar na task-6.3 se ainda não estiver).

> [!important] Resetar `VAR_VITORIA_PASSOU` no INIT Orchestrator
> Ao chamar CE 5 após vitória, o INIT do Orchestrator deve zerar `VAR_VITORIA_PASSOU` (117) — caso contrário, o estado "passou" persiste para a próxima corrida. Adicionar à task-6.3 como subtarefa extra se ainda não estiver lá.

### Preservação seletiva no `EV_Crash` (chamado por CE 19 quando NÃO passou)

Quando `EV_VitoriaCorrida` chama `EV_Crash` (CE 18 — task-6.1):

- `VAR_RACE_ID`: preservado (continua na mesma corrida).
- `VAR_ATTEMPT_N`: incrementado +1 pelo EV_Crash (confirmação do usuário).
- `VAR_RACE_N_CENAS`: preservado.
- `VAR_CONSCIENCIA`, `VAR_PONTOS_GLORIA`, `VAR_SCENE_INDEX`: resetados pelo EV_Crash.
- `VAR_VITORIA_PASSOU`: o EV_Crash atual não reseta — mas como o threshold check re-rodará quando chegar na próxima vitória, não é estritamente necessário. Por segurança, considerar adicionar `VAR_VITORIA_PASSOU = 0` ao bloco de reset do EV_Crash (task-6.1).

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Usar `\V[106]` em vez de `\V[105]` para Glória | Mostra TAXA_SUCESSO em vez de GLÓRIA | Confirmar ID 105 = GLÓRIA via snapshot |
| Confundir `VAR_RACE_ID` (100) com `VAR_SCENE_INDEX` (101) | Branch errado | Constantes nomeadas no script gerador |
| Esquecer `Erase Picture` após vitória/derrota | Texto fica na próxima corrida | Apagar 5/53/54/55 antes de chamar CE 5 ou CE 18 |
| Loop sem `Wait 1 frame` | Jogo trava | Sempre yield em loops |
| Incrementar `VAR_RACE_ID` sem clamp | Vai para 4, 5, ... | `If VAR_RACE_ID < 3` (não incrementa se já é 3) |
| Não resetar `VAR_VITORIA_PASSOU` em algum lugar | Estado persiste para próxima corrida | Reset no INIT Orchestrator (task-6.3) |
| Tocar ME sem parar BGM | Som caótico | `Stop BGM` antes de `Play ME` |
| Chamar Orchestrator sem incrementar RACE_ID | Repete a mesma corrida | Sempre incrementar antes (quando passou) |
| Chamar EV_Crash sem ter finalizado a vitória visual | Cutscene abrupta | Garantir input recebido antes de chamar CE 18 |
| Loop "FIM" infinito sem saída visível | Jogador não sabe o que fazer | Adicionar texto "Feche a janela para sair" ou aceitar input |
| Esquecer check `VAR_SCENE_INDEX >= VAR_RACE_N_CENAS` no Renderer | Vitória nunca dispara | Wire no CE 7 (task-6.4.4) |
| Picture ID 53/54/55 colidindo com HUD | Textos sobrepostos | Reservar 53-55 para vitória (F5 usou 51 para HUD Glória) |
| Threshold muito alto (impossível) | Jogador sempre perde | Calibrar: máximo teórico = (Safe-only = 10×N_CENAS) + (Risk-sucesso bônus) |
| Threshold muito baixo (sempre passa) | Sem desafio | Risk deveria ser necessário para passar Corrida 2 e 3 |

### Integração com `EV_RaceRenderer` (CE 7) — wire

```
# EV_RaceRenderer (CE 7, trecho — após resolução, antes de sortear próxima cena)

# Após Safe (CE 11 → CE 14) ou Risk-sucesso (CE 12 → CE 15), SCENE_INDEX foi incrementado.
If VAR_SCENE_INDEX (101) >= VAR_RACE_N_CENAS (111)
  # Todas as cenas completas → vitória/derrota!
  Call Common Event: EV_VitoriaCorrida   # CE 19 — task-6.4
  Exit Event Processing                   # code 115 — não continua o loop de render
Else
  # Continua para próxima cena
  ...sorteio normal (já existe em F3)...
End
```

Sem este check, Renderer continuaria sorteando cena `N+1`, `N+2`, etc. — bug sério.

### Sobre os backgrounds de vitória/derrota/FIM

Se `race/bg_vitoria.png`, `race/bg_derrota.png`, `race/bg_fim.png` não existirem (F2 não os criou), alternativas:

- **Tela preta + texto dourado/vermelho** (minimalista, sem picture).
- **Tint Screen dourado** (vitória) ou **Tint Screen vermelho-sangue** (derrota) via code 223 + texto simples.
- **Reusar bg da última cena** com filtro de overlay.

Gerar pictures formalmente em tarefa separada se faltar (não bloquear task-6.4 — usar fallback Tint).

## visual_validation

Ao concluir esta task (com 5.4, 6.1, 6.3 prontos):

### Cenário 1: Vitória com pontuação suficiente (Corrida 1 → 2)

1. Inicie Corrida 1 (`VAR_RACE_ID = 1`).
2. Jogue até a última cena (6ª). Risk-sucessos garantem pontuação ≥ 60.
3. Resolva a última cena (Safe).
4. **Tela de vitória aparece:**
   - Fundo (ou tela dourada via Tint).
   - "VITÓRIA!" grande no centro (dourado).
   - "Pontos de Glória: N" abaixo (≥60).
   - "Pressione [Espaço] para continuar".
5. BGM para, ME de vitória toca.
6. Pressione **Espaço**.
7. Tela limpa, **Corrida 2 começa** (fadein da próxima corrida).
8. F9 → `VAR_RACE_ID = 2` ✓, `VAR_RACE_N_CENAS = 8` ✓.
9. F9 → `VAR_VITORIA_PASSOU = 0` (resetado pelo INIT Orchestrator) ✓.
10. Console F12 sem erros.

### Cenário 2: Derrota com pontuação insuficiente (Corrida 2 → restart)

1. Inicie Corrida 2 (`VAR_RACE_ID = 2`, threshold = 100).
2. Jogue apenas Safe (8 cenas × +10 = 80 < 100).
3. Resolva a última cena (Safe).
4. **Tela de "DERROTA" aparece:**
   - "DERROTA!" no centro (vermelho).
   - "Pontos de Glória: 80" abaixo.
   - "Pressione [Espaço] para continuar".
5. Pressione **Espaço**.
6. **EV_Crash é chamado:** shake + flash + reset + cena 1 reaparece.
7. F9 → `VAR_RACE_ID = 2` (preservado, **não avançou**) ✓.
8. F9 → `VAR_ATTEMPT_N` incrementou +1 ✓.
9. F9 → `VAR_PONTOS_GLORIA = 0` (resetado pelo EV_Crash) ✓.

### Cenário 3: FIM após vencer Corrida 3

1. Inicie Corrida 3 (`VAR_RACE_ID = 3`, threshold = 150).
2. Jogue até a última cena (10ª). Mistura Safe + Risk-sucesso para ≥ 150.
3. Resolva a última cena.
4. **Tela de vitória aparece** com `VAR_VITORIA_PASSOU = 1`.
5. Pressione **Espaço**.
6. **Tela "FIM" + "Obrigado por jogar!"** aparece (não há Corrida 4).
7. Loop infinito — jogador fecha a janela.

### Cenário 4: Threshold inválido (debug-only)

1. Force `VAR_RACE_ID = 5` no F12 (fora de range).
2. Force `VAR_SCENE_INDEX >= VAR_RACE_N_CENAS`.
3. Dispare CE 19.
4. Threshold check usa default `|| 60` (raceId 5 não está no dict).
5. Comportamento: equivalente à Corrida 1.

## Critérios de Sucesso

- [ ] `VAR_VITORIA_PASSOU` (Editor ID 117) criado em `System.json` via `fase6/setup_phase6_system.py`.
- [ ] `EV_VitoriaCorrida` (CE 19) criado com trigger "Call".
- [ ] Wire no CE 7 (Renderer): `If SCENE_INDEX >= RACE_N_CENAS → Call CE 19 → Exit Event Processing`.
- [ ] Threshold check (Script inline) compara GLÓRIA contra thresholds {1:60, 2:100, 3:150} e seta `VAR_VITORIA_PASSOU`.
- [ ] **4x TextPicture** inseridos manualmente no CE 19: **Picture 53 ("VITÓRIA!")**, **Picture 56 ("DERROTA!")**, Picture 54 (Glória `\\V[105]`), Picture 55 (instrução).
- [ ] **If/Else Show Picture** no CE 19 mostra Picture 53 (VITORIA_PASSOU==1) **ou** Picture 56 (Else) — nunca ambos.
- [ ] Texto "VITÓRIA!" vs "DERROTA!" ramifica por `VAR_VITORIA_PASSOU`.
- [ ] Loop de input tem `Wait 1 frame` (não trava).
- [ ] Branch passou (==1): incrementa RACE_ID se <3, chama Orchestrator; caso RACE_ID==3 mostra tela FIM.
- [ ] Branch não-passou (==0): chama EV_Crash (CE 18) — restart mesma corrida.
- [ ] **Pictures 5/53/54/55/56 apagadas** antes de chamar CE 5 ou CE 18.
- [ ] `VAR_VITORIA_PASSOU` resetado no INIT Orchestrator (task-6.3) — verificar.
- [ ] BGM para antes de ME tocar.
- [ ] Sem erros no console.
- [ ] Script gerador `fase6/build_phase6_ces.py` estendido com CE 19 como artefato-fonte.
- [ ] Auditoria `rg "value\\(|setValue\\("` confirma IDs 100/105/117.
- [ ] Pós-edição MZ: F10 → Ctrl+S → reiniciar Playtest.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo nos 3 cenários (vitória, derrota, FIM).

## Fora de Escopo

- Tela de estatísticas detalhadas (tentativas, % sucesso Risk, etc.) — fora do MVP.
- High score / leaderboard — fora do MVP.
- Animação elaborada de vitória (partículas, zoom, etc.) — fora do MVP.
- Salvar progresso entre sessões (Save/Load) — fora do MVP.
- Modo NG+ após completar Corrida 3 — fora do MVP.
- Transição VN entre corridas (cutscene narrativa) — sistema VN separado.
- Música específica por corrida (3 BGMs diferentes) — fora do MVP.
- Calibração automática de threshold (análise de sessões jogadas) — fora do MVP.
- Tela distinta de "DERROTA" com picture própria (`bg_derrota.png`) — usa fallback Tint vermelho.
