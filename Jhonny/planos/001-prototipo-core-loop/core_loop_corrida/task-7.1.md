---
status: pending
---

<task_context>
<domain>engine/audio/feedback</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>low</complexity>
<dependencies>task-2.2, task-5.3</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 7.1: Adicionar `Play SE` nos Handlers (Audio Feedback)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §9 (feedback sensorial — áudio)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §8.1 (Do's — usar SE para feedback de ações)

## Visão Geral

Adicionar **Sound Effects (SE)** nos handlers de input e resolução para dar feedback imediato ao jogador sobre cada ação:

| Ação | SE | Significado narrativo |
|------|-----|----------------------|
| **Safe** (Parar/Direita) | `freada.ogg` | Som de freio — Opala reduzindo |
| **Risk-sucesso** (Furar/Esquerda OK) | `pneu_cantando.ogg` | Pneu cantando — derrapada controlada |
| **Risk-falha** (Crash) | `crash_metal.ogg` | Impacto metálico — batida |

Estes 3 SEs já existem em `Jhonny/audio/se/` (criados em task-2.2 como aliases de sons padrão MZ).

<requirements>
- `Play SE: freada` no `EV_OnSafe` (task-5.1) após mutação de estado.
- `Play SE: pneu_cantando` no `EV_ResolucaoRiskOK` (task-5.3) no início da animação.
- `Play SE: crash_metal` no `EV_Crash` (task-6.1) — já incluído por padrão, confirmar.
- Volume e pitch consistentes (não mudam entre ações).
- Não tocar SE duplicado se handler é chamado múltiplas vezes no mesmo frame.
- BGM da corrida permanece tocando (SEs são camada adicional).
</requirements>

## Subtarefas

- [ ] 7.1.1 Confirmar que `freada.ogg`, `pneu_cantando.ogg`, `crash_metal.ogg` existem em `Jhonny/audio/se/` (task-2.2)
- [ ] 7.1.2 Adicionar `Play SE` no `EV_OnSafe` (task-5.1) — após mutação, antes de `EV_ResolucaoSafe`:
  - [ ] SE: `"freada"`, volume 80, pitch 100, pan 0
- [ ] 7.1.3 Adicionar `Play SE` no `EV_ResolucaoRiskOK` (task-5.3) — no início, antes de `Show Picture`:
  - [ ] SE: `"pneu_cantando"`, volume 90, pitch 100, pan 0
- [ ] 7.1.4 Confirmar que `EV_Crash` (task-6.1) já toca `crash_metal` (subtarefa 6.1.2)
- [ ] 7.1.5 Validar que áudio não toca fora da corrida (handlers já têm guarda `SW_RACE_ACTIVE`)
- [ ] 7.1.6 Testar com BGM ligado — confirmar mixagem aceitável

## Detalhes de Implementação

### Ordem de inserção do `Play SE`

| Handler | Posição no evento | Razão |
|---------|-------------------|-------|
| `EV_OnSafe` | Após mutação de Consciência/Glória, antes de `EV_ResolucaoSafe` | SE dispara quando ação é "confirmada" (não no clique — clique pode ser rejeitado pelos guardas) |
| `EV_ResolucaoRiskOK` | No início, antes de `Show Picture` flash | SE sincroniza com flash dourado |
| `EV_Crash` | No início (já existente em 6.1) | SE sincroniza com flash branco |

### Pseudo-código (trechos a adicionar)

**`EV_OnSafe` (task-5.1) — adicionar antes de `Call EV_ResolucaoSafe`:**
```
# Após VAR_SCENE_INDEX += 1 e EV_UpdateHud:

Play SE: "freada", volume 80, pitch 100, pan 0

Call Common Event: EV_ResolucaoSafe
```

**`EV_ResolucaoRiskOK` (task-5.3) — adicionar no início:**
```
# EV_ResolucaoRiskOK (Trigger: Call)

Play SE: "pneu_cantando", volume 90, pitch 100, pan 0

# Flash dourado: overlay fullscreen opacidade alta
Show Picture: 31, "race/overlay_flash_gold", ...
...
```

**`EV_Crash` (task-6.1) — já tem `crash_metal` (subtarefa 6.1.2):**
```
# EV_Crash (Trigger: Call)

Play SE: "crash_metal", volume 90, pitch 100, pan 0

Shake Screen: power 8, ...
...
```

### Volume e pitch por SE

| SE | Volume | Pitch | Pan | Duração estimada |
|----|--------|-------|-----|------------------|
| `freada` | 80 | 100 | 0 | ~0,5s |
| `pneu_cantando` | 90 | 100 | 0 | ~0,8s |
| `crash_metal` | 90 | 100 | 0 | ~0,6s |

- **Volume:** 80-90 (de 0-100). 100 é muito alto; 70 já é médio.
- **Pitch:** 100 (normal). 80 = grave, 120 = agudo.
- **Pan:** 0 (centro). Negativo = esquerda, positivo = direita.

### Por que estes volumes/pitchs?

- **Safe (freada 80):** ação menos " intensa" que Risk — volume um pouco menor para não cansar em sequência de Safes.
- **Risk-sucesso (pneu_cantando 90):** merece destaque — volume maior celebra a ousadia.
- **Crash (crash_metal 90):** alto o suficiente para impactar, mas não machucar ouvidos.

Calibrar em playtest.

### Por que SE dispara DEPOIS dos guardas?

Os guardas (`SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `VAR_TIMER_FRAMES`) podem rejeitar o input antes de qualquer mutação. SE só deve tocar se a ação realmente acontece:

- Clique fora da corrida → guardas rejeitam → sem SE. ✓
- Clique durante lock → guardas rejeitam → sem SE. ✓
- Clique com timer expirado → guardas rejeitam → sem SE. ✓

Posicionar o `Play SE` **após** os guardas (mas antes da resolução) garante feedback apenas para ações válidas.

### Por que `pneu_cantando` em vez de novo SE para Risk-sucesso?

Task-2.2 criou apenas 3 SEs:

- `crash_metal` (Crash)
- `freada` (Safe)
- `pneu_cantando` (inicialmente pensado para movimento, mas reusamos para Risk-sucesso)

**Razão:** gerar/baixar novo áudio é caro. `pneu_cantando` (som de pneu derrapando) combina narrativamente com Risk-sucesso ("você furou o sinal e o pneu cantou controlado").

Em v2, pode adicionar SEs distintos para Risk-sucesso (`motor_acelerando`) se playtest indicar necessidade.

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Tocar SE antes dos guardas | Áudio dispara em cliques rejeitados | Colocar após guardas |
| Volume 100 | Machuca ouvidos em sessões longas | Volume 80-90 |
| Esquecer `pan 0` | Som tende a um lado | Sempre `pan 0` (centro) |
| Tocar SE em loop (CE paralelo) | Som infinito | Handlers são `Trigger: Call` (uma vez) |
| Tocar SE duplicado (2 vezes seguidas) | Efeito " metralhadora" | Guardas já protegem — mas validar |
| Esquecer de testar com BGM | Mixagem ruim | Sempre testar com BGM ligado |
| SE muito longo (>1s) | Sobreposta na próxima ação | Manter ≤ 0,8s |

### Mixagem com BGM

Cenário ideal durante a corrida:

- **BGM da corrida** (a definir em task-7.x separada ou placeholder silencioso): volume ~70.
- **SEs (freada/pneu/crash)**: volume 80-90 — claramente audíveis sobre o BGM.

Se BGM muito alto cobre os SEs:

- Reduzir volume BGM para 50-60.
- Ou aumentar volume SE para 95.

Playtest final decide calibração.

## visual_validation

Ao concluir esta task (com 5.x, 6.1 prontos):

1. **Ligue o som do computador.**
2. Inicie a corrida (pode ter BGM de fundo ou não — testar ambos).
3. **Teste Safe:** clique em **Parar**.
   - **Som de freada** toca (~0,5s).
   - Sincronizado com flash verde (task-5.3).
4. **Teste Risk-sucesso:** force roll=0 (`$gameVariables.setValue(108, 0)` no F12).
   - Clique em **Furar**.
   - **Som de pneu cantando** toca (~0,8s).
   - Sincronizado com flash dourado (task-5.3).
5. **Teste Risk-falha:** force roll=99.
   - Clique em **Furar**.
   - **Som de impacto metálico** toca (~0,6s).
   - Sincronizado com flash branco + shake (task-6.1).
6. **Teste cliques rejeitados:** durante o lock (após clique), tente clicar de novo.
   - **Nenhum SE toca** (guarda `SW_INPUT_LOCKED` rejeita).
7. **Teste fora da corrida:** com `SW_RACE_ACTIVE = OFF`, tente disparar handler manualmente (`$gameTemp.reserveCommonEvent(N)`).
   - **Nenhum SE toca** (guarda `SW_RACE_ACTIVE` rejeita).
8. Mixagem aceitável (SEs claros sobre BGM se houver).
9. Console F12 sem erros.

## Critérios de Sucesso

- [ ] `Play SE: freada` no `EV_OnSafe` após mutação, antes de resolução.
- [ ] `Play SE: pneu_cantando` no `EV_ResolucaoRiskOK` no início.
- [ ] `Play SE: crash_metal` confirmado no `EV_Crash` (subtarefa 6.1.2).
- [ ] Volume 80-90, pitch 100, pan 0.
- [ ] SE não toca em cliques rejeitados pelos guardas.
- [ ] SE sincronizado com feedback visual correspondente.
- [ ] Mixagem aceitável com BGM.
- [ ] Sem erros no console.
- [ ] `visual_validation` (incluindo áudio) confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- BGM da corrida (a definir em task-7.x ou manter silencioso no MVP).
- Música especial na Curva do Diabo — fora do MVP.
- Variação de pitch por Consciência (ex.: Risk fica mais agudo quando Consciência alta) — fora do MVP.
- Voice acting / narração — fora do MVP.
- Áudio 3D / spatial — fora do MVP.
- Opções de acessibilidade (mute SE, ajustar volume) — fora do MVP (assumir defaults).
