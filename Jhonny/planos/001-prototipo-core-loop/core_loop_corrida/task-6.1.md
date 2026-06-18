---
status: pending
---

<task_context>
<domain>engine/gameplay/restart</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>high</complexity>
<dependencies>task-5.2</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 6.1: Criar `EV_Crash` (Restart < 1s)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §10.risco (consequência de falha — restart imediato), §7 (reset entre corridas)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §4.4 (linhas 570-610 — "Crash visual — 0,3s de tela"), §6.1 (linhas 756-785 — "Fluxo de restart — diagrama"), §6.2 (linhas 786-803 — "Preservação seletiva"), §6.3 (linhas 804-822 — "Otimização para < 1s"), §6.4 (linhas 823-834 — "Armadilhas do restart")

## Visão Geral

Criar o Common Event `EV_Crash`, responsável pela sequência completa de **crash visual + restart em menos de 1 segundo**. Chamado pelo `EV_OnRisk` (task-5.2) no ramo de falha (`SW_CRASH_FLAG = ON`).

A sequência é a parte mais densa do minigame em termos de design — combina 7 efeitos visuais concorrentes (shake, flash, hover, fadeout, reset, erase pictures, fadein) numa janela apertada. Erros aqui = sensação de "lag" que destrói a tensão.

<requirements>
- `EV_Crash` criado com trigger "Call".
- Sequência completa em ≤ 60 frames (1 segundo a 60fps).
- **Decisão arquitetural crítica (§6.3 do Guia):** restart corta **fadeout/fadein** para ficar < 1s — usa **tela preta momentânea** (Tint Screen 1 frame) em vez de fade lento.
- Não corta comunicação de custo: o jogador deve **ver** que algo aconteceu (flash + shake + reset).
- Aplica **reset de estado** conforme §6.2 do Guia (CONSCIENCIA=0, GLORIA=0, SCENE_INDEX=0; preserva RACE_ID, ATTEMPT_N).
- Incrementa `VAR_ATTEMPT_N` (já feito no INIT Orchestrator — não duplicar).
- Apaga todas as pictures 1-60 (exceto HUD persistente a ser recriado).
- Desliga `SW_INPUT_LOCKED` no fim (destrava próximo input).
- Não entra em loop infinito (chamado uma vez por Risk-falha).
</requirements>

## Subtarefas

- [ ] 6.1.1 Criar Common Event `EV_Crash` com trigger "Call"
- [ ] 6.1.2 Adicionar `Play SE: "crash_metal"` (0 volume baixo, duração ~0,3s)
- [ ] 6.1.3 Adicionar `Shake Screen: power 8, speed 6, duration 18 frames`
- [ ] 6.1.4 Adicionar `Flash Damage` ou `Show Picture: 32 (flash branco fullscreen)` opacidade 255 por 6 frames
- [ ] 6.1.5 Adicionar `Tint Screen: (0,0,0,255) por 6 frames` (escurece)
- [ ] 6.1.6 Adicionar `Wait: 18 frames` (deixa shake + flash + tint rodando)
- [ ] 6.1.7 **Bloco de Reset (executado DURANTE o preto):**
  - [ ] 6.1.7a `Control Variables: VAR_CONSCIENCIA = 0`
  - [ ] 6.1.7b `Control Variables: VAR_PONTOS_GLORIA = 0`
  - [ ] 6.1.7c `Control Variables: VAR_SCENE_INDEX = 0`
  - [ ] 6.1.7d `Control Variables: VAR_TIMER_FRAMES = 240`
  - [ ] 6.1.7e `Control Switches: SW_CRASH_FLAG = OFF`
  - [ ] 6.1.7f `Control Switches: SW_INPUT_LOCKED = OFF`
  - [ ] 6.1.7g **NÃO** resetar `VAR_RACE_ID`, `VAR_ATTEMPT_N`, `VAR_RACE_N_CENAS`
- [ ] 6.1.8 Adicionar `Erase Picture: 1-60` (loop ou comandos individuais para IDs 1-9, 10-19, 20-29, 30-39, 41-50, 51-60)
- [ ] 6.1.9 Adicionar `Tint Screen: Normal` (restaura cor)
- [ ] 6.1.10 Adicionar `Call Common Event: EV_UpdateHud` (recria HUD com novos valores zerados)
- [ ] 6.1.11 Adicionar `Call Common Event: EV_RenderSinal` (recria cena 1)
- [ ] 6.1.12 Adicionar `Wait: 6 frames` (transição)
- [ ] 6.1.13 Salvar e validar com Playtest — cronometrar restart

## Detalhes de Implementação

### Diagrama temporal (≤ 60 frames = 1s)

```
Frame:    0    6    12   18   24   30   36   42   48   54   60
Tela:     ──── FLASH BRANCO ───── PRETO ──────────── NOVA CENA ───
Shake:    ─────────── POWER 8 ──────────
Sound:    CRASH (0,3s)
                                  ↑ RESET AQUI (no preto)
                                  ↑ ERASE PICTURES
                                                  ↑ HUD NOVO
                                                  ↑ CENA 1 NOVA
```

Total: ~36-48 frames (~0,6-0,8s) — dentro do budget.

### Pseudo-código canônico do `EV_Crash`

```
# EV_Crash (Trigger: Call)
# Chamado por EV_OnRisk no ramo de falha (SW_CRASH_FLAG = ON).
# Conforme Guia Técnico §4.4 + §6.1 + §6.2 + §6.3.
# Objetivo: sequência visível + reset + nova cena em < 1s.

# === FASE 1: CRASH VISUAL (~18 frames) ===

# Som de impacto
Play SE: "crash_metal", volume 90, pitch 100, pan 0

# Shake intenso (vibração do Opala batendo)
Shake Screen: power 8, speed 6, duration 18 frames

# Flash branco fullscreen (recomendado: Picture 32)
Show Picture: 32, "race/overlay_flash_white", (0,0), (100%,100%), 255, 0 frames, Add
Move Picture: 32, (0,0), (100%,100%), 0, 6 frames, Normal   # fade out rápido

# Tint escuro (vai para preto)
Tint Screen: (-255, -255, -255, 0), 6 frames

# Esperar o efeito visual acontecer (ainda há shake rodando)
Wait: 18 frames

# === FASE 2: RESET (no escuro, jogador não vê) ===

# Limpar pictures do fundo/HUD/botões
Erase Picture: 1
Erase Picture: 2
# ... até ID 60 (ver pseudocódigo do loop abaixo)
# (Alternative: 60 comandos Erase Picture — verboso mas explícito)

# Resetar variáveis conforme §6.2 (preservar RACE_ID, ATTEMPT_N)
Control Variables: VAR_CONSCIENCIA = 0
Control Variables: VAR_PONTOS_GLORIA = 0
Control Variables: VAR_SCENE_INDEX = 0
Control Variables: VAR_TIMER_FRAMES = 240
Control Variables: VAR_TAXA_SUCESSO = 0
Control Variables: VAR_ROLL_RESULT = 0

# Resetar switches
Control Switches: SW_CRASH_FLAG = OFF
Control Switches: SW_INPUT_LOCKED = OFF
Control Switches: SW_LAST_ACTION_SAFE = OFF
# SW_RACE_ACTIVE permanece ON (continua na mesma corrida)

# Erase overlay de flash
Erase Picture: 32

# === FASE 3: RESTAURAR TELA (~18 frames) ===

# Voltar cor
Tint Screen: Normal, 12 frames

# Recriar HUD e cena 1
Call Common Event: EV_UpdateHud
Call Common Event: EV_RenderSinal

# Pequeno wait para estabilizar
Wait: 6 frames

# Pronto — jogador pode clicar de novo
```

### Preservação seletiva (§6.2 do Guia)

| Variável/Switch | Reset? | Razão |
|-----------------|--------|-------|
| `VAR_RACE_ID` | ❌ preservar | Continua na mesma corrida (Lenda/Rachadura/Abismo) |
| `VAR_ATTEMPT_N` | ❌ preservar | Conta tentativas — incrementado no INIT Orchestrator |
| `VAR_RACE_N_CENAS` | ❌ preservar | Comprimento da corrida não muda entre tentativas |
| `VAR_SEED` | ❌ preservar (opcional) | Decorativo; ou resetar se quiser variar |
| `VAR_CONSCIENCIA` | ✅ reset 0 | Spec §7: reset a cada corrida e restart |
| `VAR_PONTOS_GLORIA` | ✅ reset 0 | Idem |
| `VAR_SCENE_INDEX` | ✅ reset 0 | Volta para cena 1 |
| `VAR_P_CENA` | (será re-sorteado pelo Renderer) | Não resetar explicitamente |
| `VAR_TIMER_FRAMES` | ✅ reset 240 | Próxima cena começa com timer cheio |
| `VAR_TAXA_SUCESSO` | ✅ reset 0 | Limpo para próxima iteração |
| `VAR_ROLL_RESULT` | ✅ reset 0 | Debug |
| `SW_RACE_ACTIVE` | ❌ manter ON | Continua em corrida |
| `SW_INPUT_LOCKED` | ✅ reset OFF | Destrava input |
| `SW_CRASH_FLAG` | ✅ reset OFF | Pronto para próxima falha |
| `SW_LAST_ACTION_SAFE` | ✅ reset OFF | Sem ação prévia |

### Erase Pictures — abordagem

Opção A: 60 comandos `Erase Picture` individuais (1-60).
- ✅ Explícito, fácil de auditar.
- ❌ Muito verboso, ocupa espaço no evento.

Opção B: Loop com `Label`/`Jump`.
```
Control Variables: VAR_TEMP_PIC_ID = 1
Label: loop_erase
If VAR_TEMP_PIC_ID > 60
  Jump to Label: end_erase
End
Erase Picture: VAR_TEMP_PIC_ID  # MZ aceita variável como ID? Verificar
Control Variables: VAR_TEMP_PIC_ID += 1
Jump to Label: loop_erase
Label: end_erase
```
- ❌ MZ `Erase Picture` não aceita variável como ID — apenas constant.
- Solução: usar Script inline `$gameScreen.erasePicture(N)` em loop JS.

Opção C: Script inline (recomendado).
```javascript
// Script inline
for (let i = 1; i <= 60; i++) {
  $gameScreen.erasePicture(i);
}
```
- ✅ Compacto (1 comando).
- ✅ Rápido.
- ✅ Fácil de manter.

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

### Armadilhas do restart (§6.4 do Guia)

| Armadilha | Sintoma | Solução |
|-----------|---------|---------|
| Esquecer de apagar pictures 1-60 | Botões/overlays antigos ficam na tela | Loop Erase (Opção C) |
| Resetar `VAR_ATTEMPT_N` | Contador de tentativas sempre 1 | Preservar (incrementado no INIT Orchestrator) |
| Resetar `VAR_RACE_ID` | Volta para Corrida 1 sempre | Preservar |
| Esquecer `SW_INPUT_LOCKED = OFF` | Lock fica ON para sempre | Resetar no fim |
| Usar `Fadeout/Fadein` em vez de Tint | Restart demora > 1s | Usar Tint Screen |
| Re-chamar `EV_RaceOrchestrator` no restart | Recria INIT completo (slow) | Apenas resetar variáveis + chamar EV_RenderSinal |
| Esquecer `Tint Screen: Normal` no fim | Tela fica escura | Sempre restaurar Tint |
| `Erase Picture` sem checar existência | Erro no console (cosmético) | `$gameScreen.erasePicture(N)` é safe (no-op se não existe) |

### Por que não re-chamar `EV_RaceOrchestrator` no restart?

O Orchestrator (task-3.1) faz muito mais do que precisamos no restart:

- INIT completo: fadein 18 frames + sorteio de corrida + setup de HUD.
- Já incrementa `VAR_ATTEMPT_N`.
- Recria a estrutura da corrida.

No restart, queremos apenas:

- Resetar variáveis de cena.
- Re-renderizar cena 1.

Re-executar Orchestrator adicionaria ~0,3s de fadein desnecessário. Em vez disso, `EV_Crash` faz o reset direto + chama `EV_RenderSinal` (task-3.3).

> [!note] Exceção: se VAR_ATTEMPT_N deve incrementar
> Spec §10.risco diz "incrementa tentativa". No INIT Orchestrator (task-3.1) já está implementado. **Se o fluxo de crash NÃO passa pelo Orchestrator**, `EV_Crash` precisa incrementar manualmente:
> ```
> Control Variables: VAR_ATTEMPT_N += 1
> ```
> Verificar na implementação da task-3.1 se o increment está em INIT ou em outro lugar.

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Total > 60 frames | Sensação de lag | Cronometrar com playtest |
| Shake power 9 | Enjoo | Power 8 é o limite |
| Flash branco opacidade 255 sem fade | Machuca olhos (especialmente fotossensíveis) | Fade out em 6 frames |
| Reset fora do "preto" | Jogador vê Consciência zerando (estranho) | Resetar DURANTE o Tint escuro |
| Esquecer `EV_UpdateHud` no fim | HUD mostra Glória=999 (antigo) | Sempre chamar após reset |
| Esquecer `EV_RenderSinal` no fim | Tela preta permanente | Re-criar cena 1 |
| Loop infinito se `SW_CRASH_FLAG` não desliga | Crash infinito | Sempre `SW_CRASH_FLAG = OFF` no reset |

## visual_validation

Ao concluir esta task (com 5.x prontos):

1. Inicie a corrida, alcance uma cena.
2. Force Risk-falha: `$gameVariables.setValue(108, 99)` no F12 (roll = 99 sempre falha se taxa < 100).
3. Clique em **Furar**.
4. **Cronometre** com timer ou percepção:
   - **Imediato (frame 0):** shake intenso + flash branco + som de impacto.
   - **Frame ~18 (0,3s):** tela escurece (preto).
   - **Frame ~24 (0,4s):** tela volta revelando **cena 1** (Sinal) — HUD zerado.
5. Total: **≤ 1 segundo** percebido.
6. F9 → Variáveis:
   - `VAR_CONSCIENCIA = 0` ✓
   - `VAR_PONTOS_GLORIA = 0` ✓
   - `VAR_SCENE_INDEX = 0` ✓
   - `VAR_ATTEMPT_N` **incrementou** de N para N+1 ✓
   - `VAR_RACE_ID` **preservado** ✓
7. F9 → Switches:
   - `SW_INPUT_LOCKED = OFF` ✓ (pode clicar de novo)
   - `SW_CRASH_FLAG = OFF` ✓
8. **Nenhuma picture residual** na tela (F8 → Picture list vazia entre 1-60 antes de RenderSinal recriar).
9. Pode clicar novamente — próximo Risk funciona normalmente.
10. Console F12 sem erros.

## Critérios de Sucesso

- [ ] `EV_Crash` existe com trigger "Call".
- [ ] Sequência completa: shake + flash + tint escuro + reset + tint normal + nova cena.
- [ ] Duração total percebida ≤ 60 frames (≤ 1 segundo).
- [ ] Reset conforme tabela §6.2 (preserva RACE_ID, ATTEMPT_N).
- [ ] `SW_INPUT_LOCKED` desligado no fim.
- [ ] `SW_CRASH_FLAG` desligado no reset.
- [ ] Todas pictures 1-60 apagadas (via Script loop).
- [ ] `EV_UpdateHud` chamado no fim (HUD com valores zerados).
- [ ] `EV_RenderSinal` chamado no fim (cena 1 recriada).
- [ ] Sem loop infinito (CE termina normalmente).
- [ ] Sem erros no console.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo (cronometrar).

## Fora de Escopo

- Animação de "Game Over" permanente (após N tentativas) — fora do escopo v1.
- Tela de estatísticas de crash (quantos batidas, etc.) — fora do MVP.
- Som de riso/música sinistra no crash — fora do MVP (task-7.1 cuida de SEs básicos).
- Reset entre corridas (após vencer) — task-6.4 cuida.
- Variar intensidade do crash por corrida (Curva do Diabo tem crash especial?) — fora do MVP.
