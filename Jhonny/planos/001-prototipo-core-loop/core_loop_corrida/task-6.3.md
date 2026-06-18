---
status: pending
---

<task_context>
<domain>engine/gameplay/progression</domain>
<type>implementation</type>
<scope>core_feature</scope>
<complexity>low</complexity>
<dependencies>task-3.1</dependencies>
<prd_ref>[[Corrida - Core Loop]]</prd_ref>
<techspec_ref>[[Guia de Implementação - Core Loop da Corrida]]</techspec_ref>
</task_context>

# Tarefa 6.3: Configurar Variação de Corridas (6/8/10 Cenas)

## Referências de Origem

- Spec de Domínio: [[Corrida - Core Loop]] §3 (três corridas: Lenda, Rachadura, Abismo), §6.1 (comprimentos diferentes)
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §3.1 (linhas 349-379 — `VAR_RACE_ID` ID 101, `VAR_RACE_N_CENAS` ID 112), §3.2 (linhas 381-408 — INIT block já referencia o mapeamento)

## Visão Geral

Implementar a **decisão de comprimento de corrida** no `EV_RaceOrchestrator` (task-3.1) baseada em `VAR_RACE_ID`:

| `VAR_RACE_ID` | Nome | `VAR_RACE_N_CENAS` | Dificuldade |
|---------------|------|---------------------|-------------|
| 1 | Lenda | 6 | Fácil (curta) |
| 2 | Rachadura | 8 | Médio |
| 3 | Abismo | 10 | Difícil (longa, com Curva do Diabo na cena 9) |

Esta task adiciona a lógica condicional no INIT do Orchestrator (que hoje já referencia `VAR_RACE_N_CENAS` mas pode não estar calculando o valor).

Também ajusta o `EV_RaceRenderer` para usar `VAR_RACE_N_CENAS` como condição de parada (última cena → vitória, task-6.4).

<requirements>
- `EV_RaceOrchestrator` INIT calcula `VAR_RACE_N_CENAS` baseado em `VAR_RACE_ID`.
- Mapeamento fixo: 1→6, 2→8, 3→10.
- `EV_RaceRenderer` (task-3.2) usa `VAR_RACE_N_CENAS` para saber quantas cenas sortear.
- Vitória ao terminar `VAR_RACE_N_CENAS` cenas (detalhado em task-6.4).
- Suporte a futuras corridas adicionais (extensível).
</requirements>

## Subtarefas

- [ ] 6.3.1 Confirmar que `VAR_RACE_N_CENAS` (ID 112) existe em `System.json` (task-1.1)
- [ ] 6.3.2 Modificar `EV_RaceOrchestrator` (task-3.1) INIT para calcular comprimento:
  - [ ] Adicionar `If VAR_RACE_ID == 1: Set VAR_RACE_N_CENAS = 6`
  - [ ] `Else If VAR_RACE_ID == 2: Set VAR_RACE_N_CENAS = 8`
  - [ ] `Else If VAR_RACE_ID == 3: Set VAR_RACE_N_CENAS = 10`
  - [ ] `Else: Set VAR_RACE_N_CENAS = 6` (default)
- [ ] 6.3.3 Confirmar que `EV_RaceRenderer` respeita `VAR_RACE_N_CENAS` (não passa do limite)
- [ ] 6.3.4 Adicionar mecanismo para **mudar corrida** (após vitória, incrementa `VAR_RACE_ID`)
- [ ] 6.3.5 Garantir que `VAR_RACE_ID` não ultrapassa 3 (clamp ou loop)
- [ ] 6.3.6 Validar com Playtest em cada corrida

## Detalhes de Implementação

### Pseudo-código do cálculo no INIT Orchestrator

```
# EV_RaceOrchestrator (INIT block — estendido da task-3.1)

# === CÁLCULO DE COMPRIMENTO DA CORRIDA ===
If VAR_RACE_ID == 1
  Control Variables: VAR_RACE_N_CENAS = 6
Else
  If VAR_RACE_ID == 2
    Control Variables: VAR_RACE_N_CENAS = 8
  Else
    If VAR_RACE_ID == 3
      Control Variables: VAR_RACE_N_CENAS = 10
    Else
      # Default: corrida 1 (caso RACE_ID esteja fora de range)
      Control Variables: VAR_RACE_N_CENAS = 6
      Control Variables: VAR_RACE_ID = 1
    End
  End
End

# === RESTO DO INIT (já existente em task-3.1) ===
VAR_CONSCIENCIA = 0
VAR_PONTOS_GLORIA = 0
VAR_SCENE_INDEX = 0
VAR_ATTEMPT_N += 1
VAR_SEED = Script: Math.floor(Math.random() * 1e9)
SW_RACE_ACTIVE = ON
Tint Screen: (0,0,0,255), 0 frames
Fadein Screen: 18 frames
```

### Por que `If/Else` aninhado e não `Script` inline?

MZ `Control Variables` não aceita switch/case nativo. Duas abordagens:

**Opção A — If/Else aninhado (recomendado para iniciantes MZ):**
```
If VAR_RACE_ID == 1
  Set VAR_RACE_N_CENAS = 6
Else
  If VAR_RACE_ID == 2
    Set VAR_RACE_N_CENAS = 8
  Else
    If VAR_RACE_ID == 3
      Set VAR_RACE_N_CENAS = 10
    Else
      Set VAR_RACE_N_CENAS = 6
      Set VAR_RACE_ID = 1
    End
  End
End
```
- ✅ Auditável no MZ Editor.
- ✅ Sem Script inline.
- ❌ Verboso (12+ comandos).

**Opção B — Script inline (mais compacto):**
```javascript
const id = $gameVariables.value(101);  // VAR_RACE_ID
const n = id === 1 ? 6 : id === 2 ? 8 : id === 3 ? 10 : 6;
$gameVariables.setValue(112, n);  // VAR_RACE_N_CENAS
if (id < 1 || id > 3) {
  $gameVariables.setValue(101, 1);  // clamp para corrida 1
}
```
- ✅ Compacto (1 Plugin Command Script).
- ✅ Fácil de estender (adicionar case 4: 12 cenas, etc.).
- ❌ Menos legível para não-programadores.

Esta task recomenda **Opção B** para o cálculo (mais idiomática para JS), mas **Opção A** para quem prefere eventos puros.

### Uso no `EV_RaceRenderer`

```
# EV_RaceRenderer (trecho — condição de parada)

# Após resolver uma cena (Safe ou Risk-sucesso incrementa SCENE_INDEX):
If VAR_SCENE_INDEX >= VAR_RACE_N_CENAS
  # Todas as cenas completas → vitória!
  Call Common Event: EV_VitoriaCorrida   # task-6.4
Else
  # Continua — sorteia próxima cena
  ...
End
```

### Mecanismo para mudar corrida

Após vitória na Corrida N (task-6.4 detalha), incrementar `VAR_RACE_ID`:

```
# EV_VitoriaCorrida (trecho — task-6.4)

# Avança para próxima corrida (se houver)
If VAR_RACE_ID < 3
  Control Variables: VAR_RACE_ID += 1
End
# (se RACE_ID já é 3, permanece — modo "endless" na última)

# Re-inicia Orchestrator para nova corrida
Call Common Event: EV_RaceOrchestrator
```

### Clamp / Loop de `VAR_RACE_ID`

Duas opções para quando jogador termina a Corrida 3:

**Opção A — Permanece na 3 (endless):** jogador pode jogar indefinidamente a corrida mais difícil.
- ✅ Simples.
- ❌ Pode cansar (sem progressão).

**Opção B — Loop para 1:** volta para Lenda.
- ✅ Dá sensação de "nova game+".
- ❌ Pode frustrar (perde progressão).

**Recomendado:** Opção A (permanece na 3) — Alinha com spec §3 que menciona 3 corridas fixas. Em v2, considerar endless + dificuldade crescente.

### Por que 6/8/10 e não 5/10/15?

Spec §6.1 é explícito: comprimentos 6, 8, 10. Razões narrativas:

- **6 cenas (Lenda):** sessão curta (~2-3 min). Tutorial disfarçado.
- **8 cenas (Rachadura):** sessão média (~3-4 min). Mais variação.
- **10 cenas (Abismo):** sessão longa (~5 min). Inclui clímax (Curva do Diabo).

Diferença de 2 cenas entre níveis mantém **progressão suave** sem saltos.

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Esquecer o `Else` default | VAR_RACE_N_CENAS fica 0 se RACE_ID inválido | Sempre default 6 |
| Resetar `VAR_RACE_N_CENAS` no crash (task-6.1) | Volta para 0, Render nunca termina | Task-6.1 não toca N_CENAS |
| Comparar `> N_CENAS` em vez de `>=` | Off-by-one — vence uma cena antes | Usar `>=` |
| Incrementar `RACE_ID` sem clamp | Vai para 4, 5... — N_CENAS fica default 6 | Clamp em 3 |
| Resetar `RACE_ID` no INIT Orchestrator | Sempre volta para corrida 1 | Não resetar (preservado entre corridas) |
| Esquecer que Corrida 3 tem cena 9 = Diabo | Renderer não ativa especial | Task-6.2 cuida |

### Integração com task-6.1 (Crash)

Task-6.1 (EV_Crash) NÃO deve resetar:

- `VAR_RACE_ID` ✓ (preservado)
- `VAR_RACE_N_CENAS` ✓ (preservado)
- `VAR_ATTEMPT_N` ✓ (preservado)

Após crash, jogador continua na **mesma corrida**, **mesmo número de cenas**, **nova tentativa**.

## visual_validation

Ao concluir esta task (com 3.1, 3.2 prontos):

1. **Teste Corrida 1:** `$gameVariables.setValue(101, 1)` no F12. Inicie corrida.
   - `VAR_RACE_N_CENAS = 6` ✓ (F9).
   - Resolva 6 cenas (Safe ou Risk). Vitória deve disparar (task-6.4).
2. **Teste Corrida 2:** `$gameVariables.setValue(101, 2)`. N_CENAS = 8.
3. **Teste Corrida 3:** `$gameVariables.setValue(101, 3)`. N_CENAS = 10. Cena 9 = Curva do Diabo (task-6.2).
4. **Teste ID inválido:** `$gameVariables.setValue(101, 5)`. Default cai para corrida 1 (N_CENAS = 6).
5. **Teste após vitória:** (se task-6.4 pronta) `VAR_RACE_ID` incrementa automaticamente.
6. **Teste após crash:** `VAR_RACE_ID` e `VAR_RACE_N_CENAS` **preservados**.
7. Console F12 sem erros.

## Critérios de Sucesso

- [ ] `EV_RaceOrchestrator` calcula `VAR_RACE_N_CENAS` corretamente: 1→6, 2→8, 3→10.
- [ ] Default para corrida 1 se `VAR_RACE_ID` inválido.
- [ ] `EV_RaceRenderer` respeita `VAR_RACE_N_CENAS` (não passa do limite).
- [ ] `VAR_RACE_ID` não é resetado no crash (preservado).
- [ ] `VAR_RACE_N_CENAS` não é resetado no crash (preservado).
- [ ] Mecanismo de avanço de corrida (incrementa `VAR_RACE_ID` após vitória) preparado.
- [ ] Clamp em `VAR_RACE_ID = 3` (não ultrapassa).
- [ ] Sem erros no console.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo em cada corrida.

## Fora de Escopo

- Tela de vitória da corrida (task-6.4).
- Curva do Diabo (task-6.2).
- Seleção manual de corrida via menu — fora do MVP (corrida é definida pela progressão VN).
- Dificuldade dinâmica (ajustar P_CENA conforme performance) — fora do MVP.
- Modo endless após Corrida 3 — fora do MVP.
- Salvar progresso entre sessões — fora do MVP.
