---
status: pending
---

<task_context>
<domain>engine/gameplay/restart</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>task-5.2, task-5.6</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 6.1: Criar `EV_Crash` (CE 18, absorve CE 17, Restart < 1s)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §7 (Restart / Roguelite Loop — restart <1s, sem game over, preservar ConcernScore/RACE_ID), §1 (crash = derrota → restart imediato), §4/§5 (feedback visual do crash)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §4.4 (crash visual 0,3s de tela), §6.1 (fluxo de restart), §6.2 (preservação seletiva), §6.3 (otimização para <1s — corta fadeout/fadein, usa Tint), §6.4 (armadilhas do restart)
- Aprendizados F5: [[fase5/retrospectiva]], [[fase-5-completa]] — semântica do `ControlSwitch` (code 121), invariante de simetria de lock (4 ON ↔ 4 OFF)

## Visão Geral

Criar o Common Event `EV_Crash` (CE Editor ID 18), responsável pela sequência completa de **crash visual + restart em menos de 1 segundo**. **Substitui completamente o CE 17 (`EV_ResolucaoRiskFail`) criado em F5** — CE 17 será **deletado** nesta task, e o wire `Call CE 17` no FAIL branch do CE 12 (`EV_OnRisk`) será substituído por `Call CE 18`.

**Decisões de design confirmadas pelo usuário (2026-06-18, atualizadas 2026-06-19):**
1. **EV_Crash absorve CE 17** — um único CE faz tudo: feedback visual (Buzzer1 ME + Shake + Flash + Tint) + reset completo + re-render cena 1. Reduz um CE e elimina a separação artificial entre "feedback" e "restart".
2. **EV_Crash incrementa `VAR_ATTEMPT_N`** — cada Risk-falha que dispara crash conta como nova tentativa. Não há conflito com o INIT Orchestrator (que só incrementa no início de corridas novas).
3. **Som de crash: Buzzer1 (ME), não crash_metal (SE)** — Musical Effect padrão MZ para feedback negativo. Toca sobre BGM (não precisa parar BGM). Asset `crash_metal.ogg` da F2 fica reservado para uso futuro (v2 ou polish).
4. **Resetar `VAR_SEED` (110) a cada crash** — alinhado ao spec §7.3 ("nova seed entre restarts"). Jogador não pode decorar sequência após falha.
5. **Resetar `VAR_VITORIA_PASSOU` (117) = 0 no bloco de reset** — abordagem defensiva (também resetado no INIT Orchestrator, task-6.3). Estado nunca persiste errado.

A sequência combina 7 efeitos visuais concorrentes (shake, flash, hover, fadeout, reset, erase pictures, fadein) numa janela apertada. Erros aqui = sensação de "lag" que destrói a tensão.

<requirements>
- `EV_Crash` criado com Editor ID 18 e trigger "Call".
- **CE 17 (`EV_ResolucaoRiskFail`) deletado** do `CommonEvents.json`.
- **Wire no CE 12 (OnRisk) FAIL branch atualizado:** substituir `C(117, 1, [17])` por `C(117, 1, [18])`.
- Sequência completa em ≤ 60 frames (1 segundo a 60fps).
- **Decisão arquitetural crítica (§6.3 do Guia):** restart corta **fadeout/fadein** para ficar < 1s — usa **tela preta momentânea** (Tint Screen) em vez de fade lento.
- Não corta comunicação de custo: o jogador deve **ver** que algo aconteceu (flash + shake + reset).
- Aplica **reset de estado** conforme §6.2/§7.3 (CONSCIENCIA=0, GLORIA=0, SCENE_INDEX=0, **NOVA SEED**, VITORIA_PASSOU=0; preserva RACE_ID, RACE_N_CENAS, ATTEMPT_N que é incrementado +1).
- **Som de feedback: `Play ME: Buzzer1`** (code 249, volume 90, pitch 100) — ME toca sobre BGM, compatível com janela <1s. Não usar `crash_metal` SE nesta task.
- **Incrementa `VAR_ATTEMPT_N` (Editor ID 112)** — confirmação do usuário.
- **Reseta `VAR_SEED` (Editor ID 110)** para nova seed `Math.floor(Math.random() * 1e9)` — alinhado ao spec §7.3.
- **Reseta `VAR_VITORIA_PASSOU` (Editor ID 117) = 0** — abordagem defensiva (também resetado no INIT Orchestrator, task-6.3).
- Apaga todas as pictures 1-60 via Script inline (loop `$gameScreen.erasePicture(i)`).
- Desliga `SW_INPUT_LOCKED` no fim (destrava próximo input).
- Mantém **invariante de simetria de lock**: CE 18 assume o papel de "consumidor de lock para o ramo FAIL" anteriormente ocupado pelo CE 17 — não adiciona um 5º consumidor.
- Não entra em loop infinito (chamado uma vez por Risk-falha).
</requirements>

## Subtarefas

- [ ] 6.1.1 Criar o script gerador `Jhonny/planos/001-prototipo-core-loop/fase6/build_phase6_ces.py` (espelha estrutura do `fase5/build_phase5_ces.py`)
- [ ] 6.1.2 **Deletar CE 17** do `CommonEvents.json` via script gerador (preservar slots 0-16, setar slot 17 para `null` ou objeto vazio)
- [ ] 6.1.3 Criar CE 18 `EV_Crash` no script gerador com trigger "Call" e a sequência abaixo
- [ ] 6.1.4 Patch do CE 12 (`EV_OnRisk`) FAIL branch: substituir `Call CE 17` por `Call CE 18`
- [ ] 6.1.5 Adicionar `Play ME: "Buzzer1"` (code 249, volume 90, pitch 100, pan 0) — ME toca sobre BGM, **não** usar crash_metal SE
- [ ] 6.1.6 Adicionar `Shake Screen: power 8, speed 6, duration 18 frames`
- [ ] 6.1.7 Adicionar `Show Picture: 32, "race/overlay_flash_white", (0,0), (100%,100%), 255, 0 frames, Add` + `Move Picture: 32, (0,0), (100%,100%), 0, 6 frames, Normal` (fade out rápido do flash)
- [ ] 6.1.8 Adicionar `Tint Screen: (-255, -255, -255, 0), 6 frames` (escurece para preto)
- [ ] 6.1.9 Adicionar `Wait: 18 frames` (deixa shake + flash + tint rodando)
- [ ] 6.1.10 **Bloco de Reset (executado DURANTE o preto):**
  - [ ] 6.1.10a `Control Variables: VAR_CONSCIENCIA = 0` (104)
  - [ ] 6.1.10b `Control Variables: VAR_PONTOS_GLORIA = 0` (105)
  - [ ] 6.1.10c `Control Variables: VAR_SCENE_INDEX = 0` (101)
  - [ ] 6.1.10d `Control Variables: VAR_TIMER_FRAMES = 240` (108)
  - [ ] 6.1.10e `Control Variables: VAR_TAXA_SUCESSO = 0` (106)
  - [ ] 6.1.10f `Control Variables: VAR_ROLL_RESULT = 0` (107)
  - [ ] 6.1.10g **`Control Variables: VAR_ATTEMPT_N += 1`** (112) — **incremento de tentativa**
  - [ ] 6.1.10h **`Script: $gameVariables.setValue(110, Math.floor(Math.random() * 1e9));`** — **NOVA SEED** (spec §7.3)
  - [ ] 6.1.10i **`Control Variables: VAR_VITORIA_PASSOU = 0`** (117) — reset defensivo (também resetado no INIT Orchestrator, task-6.3)
  - [ ] 6.1.10j `Control Switches: SW_CRASH_FLAG = OFF` (102 → params[2]=1)
  - [ ] 6.1.10k `Control Switches: SW_INPUT_LOCKED = OFF` (101 → params[2]=1)
  - [ ] 6.1.10l `Control Switches: SW_LAST_ACTION_SAFE = OFF` (103 → params[2]=1)
- [ ] 6.1.11 Adicionar Script inline para erase pictures 1-60: `for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);`
- [ ] 6.1.12 Adicionar `Erase Picture: 32` (overlay de flash)
- [ ] 6.1.13 Adicionar `Tint Screen: Normal, 12 frames` (restaura cor)
- [ ] 6.1.14 Adicionar `Call Common Event: EV_UpdateHud` (CE 6 — recria HUD zerado)
- [ ] 6.1.15 Adicionar `Call Common Event: EV_RenderSinal` (CE 8 — recria cena 1)
- [ ] 6.1.16 Adicionar `Wait: 6 frames` (transição/estabilização)
- [ ] 6.1.17 Criar asset `race/overlay_flash_white.png` se não existir (RGBA 816×624 branco opaco via Python+Pillow)
- [ ] 6.1.18 Rodar `python3 -m json.tool` em `CommonEvents.json` para validar
- [ ] 6.1.19 Auditar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` para confirmar IDs em scripts inline (IDs esperados: 100-117)
- [ ] 6.1.20 Auditar operações `ControlSwitch` (code 121): confirmar semântica `0=ON | 1=OFF`
- [ ] 6.1.21 Pós-edição MZ obrigatória: F10 → Ctrl+S → reiniciar Playtest
- [ ] 6.1.22 Salvar e validar com Playtest — cronometrar restart <1s

## Detalhes de Implementação

### Diagrama temporal (≤ 60 frames = 1s)

```
Frame:    0    6    12   18   24   30   36   42   48   54   60
Tela:     ──── FLASH BRANCO ───── PRETO ──────────── NOVA CENA ───
Shake:    ─────────── POWER 8 ──────────
Sound:    CRASH (0,3s)
                                  ↑ RESET AQUI (no preto)
                                  ↑ ERASE PICTURES
                                  ↑ ATTEMPT_N += 1
                                                  ↑ HUD NOVO
                                                  ↑ CENA 1 NOVA
```

Total: ~36-48 frames (~0,6-0,8s) — dentro do budget.

### Pseudo-código canônico do `EV_Crash` (CE 18)

```
# EV_Crash (Editor ID 18, Trigger: Call)
# Chamado por EV_OnRisk (CE 12) no ramo de falha (SW_CRASH_FLAG = ON).
# Substitui completamente o CE 17 (EV_ResolucaoRiskFail) da F5.
# Conforme Guia Técnico §4.4 + §6.1 + §6.2 + §6.3.
# Objetivo: sequência visível + reset + nova cena em < 1s.

# === FASE 1: CRASH VISUAL (~18 frames) ===

# Som de feedback negativo (ME toca sobre BGM — não precisa parar BGM)
Play ME: "Buzzer1", volume 90, pitch 100, pan 0       # code 249

# Shake intenso (vibração do Opala batendo)
Shake Screen: power 8, speed 6, duration 18 frames    # code 233

# Flash branco fullscreen (Picture 32) com fade out rápido
Show Picture: 32, "race/overlay_flash_white", (0,0), (100%,100%), 255, 0 frames, Add  # code 231
Move Picture: 32, (0,0), (100%,100%), 0, 6 frames, Normal   # code 232 — fade out

# Tint escuro (vai para preto)
Tint Screen: (-255, -255, -255, 0), 6 frames           # code 223

# Esperar o efeito visual acontecer (ainda há shake rodando)
Wait: 18 frames                                        # code 230

# === FASE 2: RESET (no escuro, jogador não vê) ===

# Resetar variáveis conforme §6.2/§7.3 (preservar RACE_ID, RACE_N_CENAS, ATTEMPT_N que é incrementado +1)
Control Variables: VAR_CONSCIENCIA = 0                 # code 122, op=0, operand=0 (const 0), id=104
Control Variables: VAR_PONTOS_GLORIA = 0               # code 122, id=105
Control Variables: VAR_SCENE_INDEX = 0                 # code 122, id=101
Control Variables: VAR_TIMER_FRAMES = 240              # code 122, id=108
Control Variables: VAR_TAXA_SUCESSO = 0                # code 122, id=106
Control Variables: VAR_ROLL_RESULT = 0                 # code 122, id=107

# INCREMENTO DE TENTATIVA (confirmação do usuário)
Control Variables: VAR_ATTEMPT_N += 1                  # code 122, op=1 (add), operand=0 (const 1), id=112

# NOVA SEED (spec §7.3 — "nova seed entre restarts")
Script: $gameVariables.setValue(110, Math.floor(Math.random() * 1e9));  # code 355, id=110

# RESET DEFENSIVO DE VAR_VITORIA_PASSOU (também no INIT Orchestrator, task-6.3)
Control Variables: VAR_VITORIA_PASSOU = 0              # code 122, id=117

# Resetar switches (semântica 121: params[2]=1 → OFF)
Control Switches: SW_CRASH_FLAG = OFF                  # code 121 [102, 102, 1]
Control Switches: SW_INPUT_LOCKED = OFF                # code 121 [101, 101, 1]
Control Switches: SW_LAST_ACTION_SAFE = OFF            # code 121 [103, 103, 1]
# SW_RACE_ACTIVE permanece ON (continua na mesma corrida)

# Limpar pictures 1-60 via Script inline (compacto, idempotente)
Script: for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);  # code 355

# Erase overlay de flash
Erase Picture: 32                                      # code 235

# === FASE 3: RESTAURAR TELA (~18 frames) ===

# Voltar cor
Tint Screen: Normal, 12 frames                         # code 223

# Recriar HUD e cena 1
Call Common Event: EV_UpdateHud                        # code 117, id=6
Call Common Event: EV_RenderSinal                      # code 117, id=8

# Pequeno wait para estabilizar
Wait: 6 frames                                         # code 230

# Pronto — jogador pode clicar de novo
```

### Patch do CE 12 (OnRisk) FAIL branch

Localizar no `build_phase5_ces.py` (linha ~XXX) ou no JSON em disco o comando `C(117, 1, [17])` no CE 12 e substituir por `C(117, 1, [18])`. No script `build_phase6_ces.py`, usar patch cirúrgico (sem reescrever o CE 12 inteiro — mesma heurística do `apply_task_5_6.py` da F5).

### Preservação seletiva (§6.2/§7.3 da Spec)

| Variável/Switch | Reset? | Razão |
|-----------------|--------|-------|
| `VAR_RACE_ID` (100) | ❌ preservar | Continua na mesma corrida (Lenda/Rachadura/Abismo) |
| `VAR_ATTEMPT_N` (112) | ✅ **incrementar +1** | Conta tentativas — bug da task-6.1 original resolvido |
| `VAR_RACE_N_CENAS` (111) | ❌ preservar | Comprimento da corrida não muda entre tentativas |
| `VAR_SEED` (110) | ✅ **nova seed** `Math.random()*1e9` | Spec §7.3: "nova seed entre restarts". Decisão do usuário 2026-06-19: alinhar ao spec literalmente. |
| `VAR_CONSCIENCIA` (104) | ✅ reset 0 | Spec §7.3: reset a cada restart |
| `VAR_PONTOS_GLORIA` (105) | ✅ reset 0 | Spec §7.3 (implícito: nova tentativa, nova pontuação) |
| `VAR_SCENE_INDEX` (101) | ✅ reset 0 | Volta para cena 1 |
| `VAR_P_CENA` (103) | (será re-sorteado pelo Renderer) | Não resetar explicitamente |
| `VAR_TIMER_FRAMES` (108) | ✅ reset 240 | Próxima cena começa com timer cheio |
| `VAR_TAXA_SUCESSO` (106) | ✅ reset 0 | Limpo para próxima iteração |
| `VAR_ROLL_RESULT` (107) | ✅ reset 0 | Debug |
| `VAR_VITORIA_PASSOU` (117) | ✅ **reset 0** | Defensivo — também resetado no INIT Orchestrator (task-6.3) |
| `VAR_SCENE_TYPE` (102) | (será re-setado pelo Renderer) | Não resetar explicitamente |
| `SW_RACE_ACTIVE` (100) | ❌ manter ON | Continua em corrida |
| `SW_INPUT_LOCKED` (101) | ✅ reset OFF | Destrava input |
| `SW_CRASH_FLAG` (102) | ✅ reset OFF | Pronto para próxima falha |
| `SW_LAST_ACTION_SAFE` (103) | ✅ reset OFF | Sem ação prévia |
| `SW_IS_CURVA_DIABO` (105) | ❌ intocado | Não usado em F6 (cena especial fora de escopo) |

> **Nota sobre `VAR_SEED`:** Spec §7.3 diz "Sequência procedural de cenas + `P_cena` por cena (nova seed)" entre restarts. Em F6, **resetamos** a seed a cada crash (decisão do usuário 2026-06-19) — jogador não pode decorar sequência após falha. Implementação via Script inline `setValue(110, Math.floor(Math.random() * 1e9))`.

### Erase Pictures — abordagem

**Recomendado:** Script inline (Opção C da task original).

```javascript
// Script inline (code 355)
for (let i = 1; i <= 60; i++) {
  $gameScreen.erasePicture(i);
}
```

- ✅ Compacto (1 comando).
- ✅ Rápido.
- ✅ Fácil de manter.
- ✅ Idempotente: `erasePicture` é no-op se picture não existe.

> [!warning] `erasePicture` requer `$gameScreen` inicializado
> Sempre dentro de corrida (SW_RACE_ACTIVE = ON), então seguro. Fora de corrida, esse CE nem deve ser chamado.

### Por que cortar fade e usar Tint?

Conforme §6.3 do Guia, **`Fadeout Screen` e `Fadein Screen`** no MZ usam tempo fixo e são "caros" perceptualmente — o jogador sente cada frame. Para restart em < 1s:

- **Fadeout 12 frames + Fadein 12 frames = 24 frames (~0,4s) só de transição.** Corta metade do budget.
- **Tint Screen 6 frames + Normal 12 frames = 18 frames (~0,3s)** — economiza 6 frames.
- Diferença: jogador **vê** preto momentâneo (associado a "screen tear" do crash) sem sentir como "loading".

### Por que Shake Screen power 8?

- `power 0-9`: 8 = forte mas não vira o estômago.
- `speed 0-9`: 6 = rápida vibração.
- `duration`: 18 frames = 0,3s — suficiente para impacto, não enjoo.

Calibrar com playtest (task-7.x).

### Por que absorver CE 17 (decisão do usuário)

A F5 criou o CE 17 `EV_ResolucaoRiskFail` com feedback curto (Buzzer1 + Shake 8f + unlock) para "cobrir o buraco" antes de F6 implementar o `EV_Crash` completo. Em F6, manter os dois separados seria:

- ❌ Duplicação: ambos fariam Shake + unlock.
- ❌ Confusão semântica: "quando chamo CE 17 vs CE 18?".
- ❌ Quebra da invariante de simetria de lock (5 produtores ↔ 4 consumidores, ou 4 ↔ 5).

A absorção (CE 18 substitui CE 17) traz:

- ✅ 1 CE a menos para manter.
- ✅ Sequência unificada: feedback + reset + re-render no mesmo fluxo.
- ✅ Invariante de simetria preservada (4 ↔ 4).

### Invariante de simetria de lock (herdada da F5)

Após F6 task 6.1, a invariante deve continuar válida:

**4 produtores de `SW_INPUT_LOCKED=ON`:**
- CE 5 (`EV_RaceOrchestrator`) INIT
- CE 7 (`EV_RaceRenderer`) durante setup
- CE 11 (`EV_OnSafe`) handler
- CE 12 (`EV_OnRisk`) handler

**4 consumidores de `SW_INPUT_LOCKED=OFF`:**
- CE 7 (`EV_RaceRenderer`) erase
- CE 14 (`EV_ResolucaoSafe`)
- CE 15 (`EV_ResolucaoRiskOK`)
- **CE 18 (`EV_Crash`)** — assumiu o papel do ~~CE 17~~

> [!important] Não adicionar CE 18 como 5º consumidor
> O wire no CE 12 FAIL branch **substitui** `Call CE 17` por `Call CE 18`. Não adicionar ambos. Se ambos forem chamados, `SW_INPUT_LOCKED` seria desligado duas vezes (inofensivo em si, mas indica confusão semântica).

### Armadilhas do restart (§6.4 do Guia)

| Armadilha | Sintoma | Solução |
|-----------|---------|---------|
| Esquecer de apagar pictures 1-60 | Botões/overlays antigos ficam na tela | Script inline loop erase |
| Resetar `VAR_RACE_ID` | Volta para Corrida 1 sempre | Preservar |
| Resetar `VAR_RACE_N_CENAS` | Renderer perde o limite | Preservar |
| Esquecer `SW_INPUT_LOCKED = OFF` | Lock fica ON para sempre | Resetar no fim |
| Esquecer `SW_CRASH_FLAG = OFF` | Crash loop infinito | Resetar no bloco de reset |
| Usar `Fadeout/Fadein` em vez de Tint | Restart demora > 1s | Usar Tint Screen |
| Re-chamar `EV_RaceOrchestrator` no restart | Recria INIT completo (slow) + incrementa ATTEMPT_N duplicado | Apenas resetar variáveis + chamar EV_RenderSinal |
| Esquecer `Tint Screen: Normal` no fim | Tela fica escura | Sempre restaurar Tint |
| Esquecer `ATTEMPT_N += 1` | Contagem de tentativas nunca incrementa | Adicionar explicitamente |
| **Semântica do ControlSwitch (code 121)** | `params[2]=0` liga (ON); `params[2]=1` desliga (OFF) — oposto do intuitivo. Bug F5 corrigido em 5 operações. | **Obrigatório:** auditar todas as operações `121` |
| Manter wire `Call CE 17` no CE 12 | "Common Event ID 17 não existe" em runtime | Patch para `Call CE 18` |

### Por que não re-chamar `EV_RaceOrchestrator` no restart?

O Orchestrator (task-3.1) faz muito mais do que precisamos no restart:

- INIT completo: fadein 18 frames + sorteio de corrida + setup de HUD.
- Já incrementa `VAR_ATTEMPT_N` (esse é o único incremento canônico fora do crash).
- Recria a estrutura da corrida.

No restart, queremos apenas:

- Resetar variáveis de cena.
- Re-renderizar cena 1.
- **Incrementar `VAR_ATTEMPT_N`** (porque não passamos pelo Orchestrator).

Re-executar Orchestrator adicionaria ~0,3s de fadein desnecessário + duplicaria o incremento de ATTEMPT_N. Em vez disso, `EV_Crash` faz o reset direto + incrementa manualmente + chama `EV_RenderSinal` (CE 8).

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Total > 60 frames | Sensação de lag | Cronometrar com playtest |
| Shake power 9 | Enjoo | Power 8 é o limite |
| Flash branco opacidade 255 sem fade | Machuca olhos (especialmente fotossensíveis) | Fade out em 6 frames |
| Reset fora do "preto" | Jogador vê Consciência zerando (estranho) | Resetar DURANTE o Tint escuro |
| Esquecer `EV_UpdateHud` no fim | HUD mostra Glória antiga | Sempre chamar após reset |
| Esquecer `EV_RenderSinal` no fim | Tela preta permanente | Re-criar cena 1 |
| Loop infinito se `SW_CRASH_FLAG` não desliga | Crash infinito | Sempre `SW_CRASH_FLAG = OFF` no reset |
| Deletar CE 17 sem atualizar wire CE 12 | CE 12 chama CE 17 inexistente | Patch cirúrgico no script gerador |

## visual_validation

Ao concluir esta task (com F5 pronto):

1. Inicie a corrida, alcance uma cena.
2. Force Risk-falha: `$gameVariables.setValue(108, 99)` no F12 (roll = 99 sempre falha se taxa < 100).
3. Clique em **Furar**.
4. **Cronometre** com timer ou percepção:
   - **Imediato (frame 0):** shake intenso + flash branco + **Buzzer1 (ME)** tocando.
   - **Frame ~18 (0,3s):** tela escurece (preto).
   - **Frame ~24 (0,4s):** tela volta revelando **cena 1** (Sinal) — HUD zerado.
5. Total: **≤ 1 segundo** percebido.
6. F9 → Variáveis:
   - `VAR_CONSCIENCIA = 0` ✓
   - `VAR_PONTOS_GLORIA = 0` ✓
   - `VAR_SCENE_INDEX = 0` ✓
   - `VAR_ATTEMPT_N` **incrementou** de N para N+1 ✓
   - `VAR_RACE_ID` **preservado** ✓
   - `VAR_RACE_N_CENAS` **preservado** ✓
7. F9 → Switches:
   - `SW_INPUT_LOCKED = OFF` ✓ (pode clicar de novo)
   - `SW_CRASH_FLAG = OFF` ✓
8. **Nenhuma picture residual** na tela (F8 → Picture list vazia entre 1-60 antes de RenderSinal recriar).
9. Pode clicar novamente — próximo Risk funciona normalmente.
10. Console F12 sem erros — em particular, **nenhum erro "Common Event ID 17 does not exist"** (CE 17 deletado, wire atualizado).
11. **Auditoria final:** `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` deve mostrar apenas IDs 100-117; nenhuma referência residual a CE 17.

## Critérios de Sucesso

- [ ] Script gerador `fase6/build_phase6_ces.py` criado (helpers `C(code, indent, params)`, constantes de IDs, modo idempotente preservando slots 0-16).
- [ ] CE 17 **deletado** do `CommonEvents.json` (slot 17 = null).
- [ ] CE 18 `EV_Crash` criado com trigger "Call".
- [ ] CE 12 FAIL branch atualizado: `Call CE 18` (não `Call CE 17`).
- [ ] Sequência completa: **Play ME Buzzer1** + Shake + Flash + Tint escuro + reset + Tint normal + nova cena.
- [ ] Duração total percebida ≤ 60 frames (≤ 1 segundo).
- [ ] Reset conforme tabela §6.2/§7.3 (preserva RACE_ID, RACE_N_CENAS; **reseta SEED** conforme decisão 2026-06-19).
- [ ] **`VAR_ATTEMPT_N` incrementado** no bloco de reset.
- [ ] **`VAR_SEED` resetado** para nova `Math.floor(Math.random()*1e9)`.
- [ ] **`VAR_VITORIA_PASSOU` resetado = 0** (defensivo).
- [ ] `SW_INPUT_LOCKED` desligado no fim.
- [ ] `SW_CRASH_FLAG` desligado no reset.
- [ ] Todas pictures 1-60 apagadas (via Script loop).
- [ ] `EV_UpdateHud` chamado no fim (HUD com valores zerados).
- [ ] `EV_RenderSinal` chamado no fim (cena 1 recriada).
- [ ] Sem loop infinito (CE termina normalmente).
- [ ] Sem erros no console.
- [ ] Invariante de simetria de lock mantida (4 ON ↔ 4 OFF — CE 18 assumiu papel do CE 17).
- [ ] **Auditoria `ControlSwitch`:** todos os `params[2]` corretos (`0=ON`, `1=OFF`).
- [ ] **Auditoria scripts inline:** todos os IDs 100-117 batem com `System.json`.
- [ ] Asset `race/overlay_flash_white.png` criado (se não existia).
- [ ] `python3 -m json.tool` passa em `CommonEvents.json`.
- [ ] Pós-edição MZ: F10 → Ctrl+S → reiniciar Playtest.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo (cronometrar).

## Fora de Escopo

- Animação de "Game Over" permanente (após N tentativas) — fora do escopo v1.
- Tela de estatísticas de crash (quantas batidas, etc.) — fora do MVP.
- Som de riso/música sinistra no crash — fora do MVP (task-7.1 cuida de SEs básicos).
- Reset entre corridas (após vencer) — task-6.4 cuida.
- Variar intensidade do crash por corrida (Curva do Diabo especial?) — fora do MVP; cena especial da Curva do Diabo fora de escopo desta fase.
- Reset de `VAR_SEED` a cada crash (spec §7.3 sugere) — preservado em F6 por simplicidade; toggle para v2.
