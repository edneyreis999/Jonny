---
status: pending
revisado: 2026-06-19
revisao_motivo: "Refletir estado real do projeto pós-F4.5/F6 — ler §Estado Herdado abaixo"
---

<task_context>
<domain>engine/audio/feedback</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>low</complexity>
<dependencies>task-2.2, task-5.3, task-6.1</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 7.1: Confirmar/Mover `Play SE` nos Handlers (Audio Feedback)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §9 (feedback sensorial — áudio)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §8.1 (Do's — usar SE para feedback de ações)
- Retrospectivas relevantes: [[fase-4-completa]] (F4.5 adicionou Play SE), [[fase-6-completa]] (F6 definiu ME Shock1 no Crash)

## ⚠️ Estado herdado (NÃO refazer) — ler antes de executar

Antes de implementar, observar que parte do trabalho já foi feita em fases anteriores:

| Handler | Áudio atual | Quando adicionado | Ação nesta task |
|---------|-------------|-------------------|------------------|
| **CE 11 (`EV_OnSafe`)** | `Play SE: freada` (vol 90) | **F4.5** ([[fase-4-completa]]) | ✅ Confirmar — **nenhuma ação** |
| **CE 12 (`EV_OnRisk`)** | `Play SE: pneu_cantando` (vol 90) | **F4.5** ([[fase-4-completa]]) | ⚠️ **REMOVER daqui** (será movido para CE 15) |
| **CE 15 (`EV_ResolucaoRiskOK`)** | (sem SE atualmente) | — | ⚠️ **ADICIONAR** `Play SE: pneu_cantando` aqui |
| **CE 18 (`EV_Crash`)** | `Play ME: Shock1` (vol 90) | **F6** ([[fase-6-completa]]) | ✅ Confirmar — **NÃO adicionar SE crash_metal** (decisão do usuário) |

### Decisões do usuário (2026-06-19)

1. **Risk-sucesso sound (pneu_cantando):** mover de CE 12 para CE 15 (`EV_ResolucaoRiskOK`) — sincroniza com flash dourado da resolução. Razão: o flash e o som devem disparar no mesmo instante (início da animação de resolução).
2. **Crash sound:** manter SOMENTE `ME Shock1` em CE 18. **NÃO adicionar** `SE crash_metal`. Razão: ME Shock1 já dá o impacto narrativo; adicionar crash_metal criaria sobreposição desnecessária. `crash_metal.ogg` (criado em task-2.2 como alias de Crash.ogg) fica disponível como asset sem uso neste MVP.
3. **Safe sound (freada):** já está em CE 11 desde F4.5 — apenas confirmar, sem alteração.

## Visão Geral

Após esta task, o áudio de feedback do core loop será:

| Ação | Áudio | Handler | Origem |
|------|-------|---------|--------|
| **Safe** (Parar/Direita) | `SE: freada` (vol 90, pitch 100) | CE 11 (`EV_OnSafe`) | F4.5 (manter) |
| **Risk-sucesso** (Furar/Esquerda OK) | `SE: pneu_cantando` (vol 90, pitch 100) | CE 15 (`EV_ResolucaoRiskOK`) | **Esta task** (mover de CE 12) |
| **Risk-falha/Crash** | `ME: Shock1` (vol 90, pitch 100) | CE 18 (`EV_Crash`) | F6 (manter) |

## Subtarefas

- [ ] 7.1.1 Confirmar que `freada.ogg`, `pneu_cantando.ogg`, `Shock1.ogg` existem:
  - `Jhonny/audio/se/freada.ogg` ✓ (task-2.2)
  - `Jhonny/audio/se/pneu_cantando.ogg` ✓ (task-2.2)
  - `Jhonny/audio/me/Shock1.ogg` ✓ (MZ default — verificar com `ls Jhonny/audio/me/ | grep -i shock`)
- [ ] 7.1.2 **Remover** `Play SE: pneu_cantando` de CE 12 (`EV_OnRisk`) — está logo após `SW_INPUT_LOCKED = ON`
- [ ] 7.1.3 **Adicionar** `Play SE: pneu_cantando` (vol 90, pitch 100, pan 0) no **início** de CE 15 (`EV_ResolucaoRiskOK`), antes do `Show Picture` do flash dourado
- [ ] 7.1.4 **Confirmar** que CE 11 já tem `Play SE: freada` (manter — não mexer)
- [ ] 7.1.5 **Confirmar** que CE 18 já tem `Play ME: Shock1` (manter — não adicionar SE crash_metal)
- [ ] 7.1.6 Validar que áudio não toca fora da corrida (handlers já têm guarda `SW_RACE_ACTIVE`)
- [ ] 7.1.7 Testar com BGM ligado — confirmar mixagem aceitável
- [ ] 7.1.8 Refresh runtime MZ: F10 → Ctrl+S → reiniciar Playtest (bug F4 — `$dataCommonEvents` em runtime pode não refletir JSON em disco sem reload)

## Detalhes de Implementação

### Abordagem: script gerador idempotente

Criar `Jhonny/planos/001-prototipo-core-loop/fase7/build_phase7_audio.py`:

- Patch **CE 12** (`EV_OnRisk`): detectar e remover o `Play SE: pneu_cantando` (code 249 com params contendo `"pneu_cantando"`). Detecção de padrão: procurar por cmd `code=249` cujo `parameters[0]` seja `"pneu_cantando"`. Se ausente, skip (idempotente).
- Patch **CE 15** (`EV_ResolucaoRiskOK`): detectar se já tem `Play SE: pneu_cantando`. Se não, inserir como **cmd 0** (antes de tudo).
- Patch **CE 11 / CE 18**: skip (já estão corretos desde F4.5/F6 — detecção por padrão confirma).

### Pseudo-código da mudança

**CE 12 (`EV_OnRisk`) — REMOVER o SE:**

```
# Estado atual (F4.5):
[guarda 1] If SW_RACE_ACTIVE OFF → Exit
[guarda 2] If SW_INPUT_LOCKED ON → Exit
ControlSwitch SW_INPUT_LOCKED ON
Play SE: pneu_cantando, vol 90, pitch 100     ← REMOVER
[placeholder lógica Risk — clamp, roll, etc.]
```

**CE 15 (`EV_ResolucaoRiskOK`) — ADICIONAR o SE no início:**

```
# Estado atual (F5):
# (vazio no início)
Show Picture: 31, "race/overlay_flash_gold", ...
Move Picture: 31 → opacity 0 over 6f
Wait 6f
ControlSwitch SW_INPUT_LOCKED OFF

# Estado após task 7.1:
Play SE: pneu_cantando, vol 90, pitch 100     ← ADICIONAR (novo cmd 0)
Show Picture: 31, "race/overlay_flash_gold", ...
Move Picture: 31 → opacity 0 over 6f
Wait 6f
ControlSwitch SW_INPUT_LOCKED OFF
```

### Formato do comando `Play SE` (code 249) em JSON

```json
{
  "code": 249,
  "indent": 0,
  "parameters": ["pneu_cantando", 90, 100, 0]
}
```

Onde `parameters = [name, volume, pitch, pan]`.

### Volume e pitch finais

| SE/ME | Volume | Pitch | Pan | Handler |
|-------|--------|-------|-----|---------|
| `freada` (SE) | 90 | 100 | 0 | CE 11 (manter) |
| `pneu_cantando` (SE) | 90 | 100 | 0 | CE 15 (mover para aqui) |
| `Shock1` (ME) | 90 | 100 | — | CE 18 (manter) |

> **Nota:** F4.5 usou volume 90 para freada e pneu_cantando. Spec original desta task sugeria 80 para freada, mas o estado real do projeto usa 90 — manter 90 para consistência com F4.5 (sem rework desnecessário).

### Por que mover pneu_cantando de CE 12 para CE 15?

**Antes (F4.5):** Som dispara no momento do clique, antes de saber se foi sucesso ou falha.
**Depois (task 7.1):** Som dispara somente no ramo de **sucesso** (CE 15), sincronizado com o flash dourado da resolução.

Vantagens:
- **Semântica correta:** pneu_cantando significa "derrapada controlada" — só faz sentido no sucesso. Risk-falha usa Shock1 (CE 18) que significa impacto.
- **Sincronia audiovisual:** flash dourado e pneu_cantando disparam no mesmo frame.
- **Redução de ambiguidade:** jogador ouve pneu_cantando → sabe que foi sucesso; ouve Shock1 → sabe que foi crash.

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Esquecer de remover pneu_cantando do CE 12 | Som toca duas vezes (clique + resolução) | Patch CE 12 deve detectar e remover antes de adicionar em CE 15 |
| Adicionar pneu_cantando no CE 15 antes do flash | Som "atrapalha" o efeito visual | Colocar como cmd 0 (antes de tudo) |
| Volume 100 | Machuca ouvidos | Manter 90 (alinhado ao F4.5) |
| Tocar SE em loop | Som infinito | Handlers são `Trigger: Call` (uma vez) |
| Esquecer refresh runtime MZ | JSON atualizado mas runtime não reflete | F10 → Ctrl+S → reiniciar Playtest |

## visual_validation

Ao concluir esta task:

1. **Ligue o som do computador.**
2. Inicie a corrida.
3. **Teste Safe:** clique em **Parar**.
   - **Som de freada** toca (~0,5s) — já funcionando desde F4.5.
   - Sincronizado com flash verde (CE 14).
4. **Teste Risk-sucesso:** force roll=0 (`$gameVariables.setValue(108, 0)` no F12 — debug only).
   - Clique em **Furar**.
   - **Som de pneu cantando** toca (~0,8s), **sincronizado com o flash dourado** (CE 15).
5. **Teste Risk-falha:** force roll=99.
   - Clique em **Furar**.
   - **ME Shock1** toca no início do Crash (CE 18), sincronizado com flash branco + shake.
   - **NÃO deve tocar pneu_cantando** (correto — ramo de falha não tem sucesso).
6. **Teste cliques rejeitados:** durante o lock, tente clicar de novo.
   - **Nenhum SE toca** (guarda `SW_INPUT_LOCKED` rejeita).
7. **Teste fora da corrida:** com `SW_RACE_ACTIVE = OFF`, chame handler manualmente.
   - **Nenhum SE/ME toca** (guarda `SW_RACE_ACTIVE` rejeita).
8. Mixagem aceitável (SEs claros sobre BGM se houver).
9. Console F12 sem erros.

## Critérios de Sucesso

- [ ] `Play SE: freada` confirmado em CE 11 (sem alteração).
- [ ] `Play SE: pneu_cantando` **removido** de CE 12.
- [ ] `Play SE: pneu_cantando` **adicionado** no início de CE 15.
- [ ] `Play ME: Shock1` confirmado em CE 18 (sem adicionar SE crash_metal).
- [ ] Volume 90, pitch 100, pan 0 — consistentes em todos os handlers.
- [ ] SE/ME não toca em cliques rejeitados pelos guardas.
- [ ] SE sincronizado com feedback visual correspondente (flash verde/dourado/branco).
- [ ] Mixagem aceitável com BGM.
- [ ] Sem erros no console.
- [ ] `visual_validation` (incluindo áudio) confirmada pelo usuário rodando o jogo.

## Fora de Escopo

- BGM da corrida (a definir em task futura ou manter silencioso no MVP).
- Música especial na Curva do Diabo — fora do MVP.
- Variação de pitch por Consciência — fora do MVP.
- Voice acting / narração — fora do MVP.
- Áudio 3D / spatial — fora do MVP.
- Opções de acessibilidade (mute SE, ajustar volume) — fora do MVP.
- **SE crash_metal** — explicitamente fora do escopo por decisão do usuário (ME Shock1 basta).
