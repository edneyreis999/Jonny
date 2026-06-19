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
- Guia Técnico: [[Guia de Implementação - Core Loop da Corrida]] §3.1 (linhas 349-379 — `VAR_RACE_ID` Editor ID **100**, `VAR_RACE_N_CENAS` Editor ID **111**), §3.2 (linhas 381-408 — INIT block já referencia o mapeamento)
- Mapa canônico de IDs: ver [[tasks#Mapa de IDs]] — `VAR_RACE_ID=100`, `VAR_RACE_N_CENAS=111`, `VAR_SCENE_INDEX=101`

## Visão Geral

Implementar a **decisão de comprimento de corrida** no `EV_RaceOrchestrator` (CE 5, task-3.1) baseada em `VAR_RACE_ID`:

| `VAR_RACE_ID` | Nome | `VAR_RACE_N_CENAS` | Dificuldade |
|---------------|------|---------------------|-------------|
| 1 | Lenda | 6 | Fácil (curta) |
| 2 | Rachadura | 8 | Médio |
| 3 | Abismo | 10 | Difícil (longa — 10 cenas normais) |

> [!info] Curva do Diabo fora de escopo desta fase
> A Corrida 3 tem **10 cenas normais** (sorteio 60/40 Sinal/Curva, igual às outras). A cena especial da Curva do Diabo (P_CENA=100 fixo + Safe bloqueado) está reservada para fase futura — ver [[task-6.2]] para o placeholder.

Esta task adiciona a lógica condicional no INIT do Orchestrator (que hoje já referencia `VAR_RACE_N_CENAS` mas não está calculando o valor).

Também ajusta o `EV_RaceRenderer` (CE 7) para usar `VAR_RACE_N_CENAS` como condição de parada (última cena → vitória, task-6.4).

<requirements>
- `EV_RaceOrchestrator` (CE 5) INIT calcula `VAR_RACE_N_CENAS` (Editor ID 111) baseado em `VAR_RACE_ID` (Editor ID 100).
- Mapeamento fixo: 1→6, 2→8, 3→10, default→6 (com clamp de `VAR_RACE_ID` para 1 se fora de range).
- `EV_RaceRenderer` (CE 7, task-3.2) usa `VAR_RACE_N_CENAS` para saber quantas cenas sortear.
- Vitória ao terminar `VAR_RACE_N_CENAS` cenas (detalhado em task-6.4 — Renderer chama `EV_VitoriaCorrida` CE 19).
- Suporte a futuras corridas adicionais (extensível).
- **Não adicionar lógica de Curva do Diabo** (fora de escopo desta fase).
</requirements>

## Subtarefas

- [ ] 6.3.1 Confirmar que `VAR_RACE_N_CENAS` (Editor ID 111) existe nomeado em `System.json` (pré-passo F1)
- [ ] 6.3.2 Criar/estender o script gerador `Jhonny/planos/001-prototipo-core-loop/fase6/build_phase6_ces.py` (usar `fase5/build_phase5_ces.py` como referência de estrutura)
- [ ] 6.3.3 Modificar `EV_RaceOrchestrator` (CE 5, task-3.1) INIT para calcular comprimento via Script inline (Opção B abaixo)
- [ ] 6.3.4 Confirmar que `EV_RaceRenderer` (CE 7) respeita `VAR_RACE_N_CENAS` (não passa do limite — wire de vitória fica na task-6.4)
- [ ] 6.3.5 Auditar scripts inline: `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` deve mostrar apenas IDs canônicos (100 e 111 nesta task)
- [ ] 6.3.6 Pós-edição MZ obrigatória: F10 → Ctrl+S → reiniciar Playtest
- [ ] 6.3.7 Validar com Playtest em cada corrida (RACE_ID=1/2/3)

## Detalhes de Implementação

### Pseudo-código do cálculo no INIT Orchestrator (Opção B — Script inline)

```
# EV_RaceOrchestrator (CE 5, INIT block — estendido da task-3.1)

# === CÁLCULO DE COMPRIMENTO DA CORRIDA ===
Script: const id = $gameVariables.value(100);                    # VAR_RACE_ID
        const n = id === 1 ? 6 : id === 2 ? 8 : id === 3 ? 10 : 6;
        $gameVariables.setValue(111, n);                         # VAR_RACE_N_CENAS
        if (id < 1 || id > 3) $gameVariables.setValue(100, 1);   # clamp para corrida 1

# === RESET DEFENSIVO DE VAR_VITORIA_PASSOU (117) ===
# Decisão 2026-06-19: também resetado no EV_Crash (task-6.1) — abordagem defensiva.
# Necessário aqui porque EV_VitoriaCorrida (task-6.4) chama este CE após vitória passou.
Control Variables: VAR_VITORIA_PASSOU = 0                        # code 122, id=117, op=0, operand=0 (const 0)

# === RESTO DO INIT (já existente em task-3.1) ===
# VAR_CONSCIENCIA = 0       (104)
# VAR_PONTOS_GLORIA = 0     (105)
# VAR_SCENE_INDEX = 0       (101)
# VAR_ATTEMPT_N += 1        (112)  ← já incrementado no INIT, NÃO duplicar no EV_Crash
# VAR_SEED = Math.floor(...) (110)
# SW_RACE_ACTIVE = ON       (100)
# Tint Screen: (0,0,0,255), 0 frames
# Fadein Screen: 18 frames
```

### Por que Opção B (Script inline) e não Opção A (If/Else aninhado)?

MZ `Control Variables` não aceita switch/case nativo. Duas abordagens:

**Opção A — If/Else aninhado (eventos puros MZ):**
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
- Auditável no MZ Editor (visual).
- Sem Script inline.
- Verboso (12+ comandos).

**Opção B — Script inline (recomendada):**
```javascript
const id = $gameVariables.value(100);   // VAR_RACE_ID
const n = id === 1 ? 6 : id === 2 ? 8 : id === 3 ? 10 : 6;
$gameVariables.setValue(111, n);        // VAR_RACE_N_CENAS
if (id < 1 || id > 3) $gameVariables.setValue(100, 1);  // clamp
```
- Compacto (1 Plugin Command Script — code 355).
- Fácil de estender (adicionar case 4: 12 cenas, etc.).
- Idiomática para JS.

Esta task recomenda **Opção B**. Auditar IDs via `rg "value\\(|setValue\\("` antes de fechar.

### Uso no `EV_RaceRenderer` (CE 7) — wire fica na task-6.4

```
# EV_RaceRenderer (CE 7, trecho — após resolução incrementar SCENE_INDEX)

# Após resolver uma cena (Safe ou Risk-sucesso incrementa SCENE_INDEX):
If VAR_SCENE_INDEX (101) >= VAR_RACE_N_CENAS (111)
  # Todas as cenas completas → vitória!
  Call Common Event: EV_VitoriaCorrida   # CE 19 — task-6.4
  Exit Event Processing                    # code 115 — não continua o loop de render
Else
  # Continua — sorteia próxima cena (já existe em F3)
  ...
End
```

> [!note] Implementação do wire acima é parte da task-6.4
> Esta task apenas garante que `VAR_RACE_N_CENAS` esteja corretamente calculado. O check `If SCENE_INDEX >= N_CENAS` é adicionado à CE 7 na task-6.4 junto com a criação do CE 19.

### Mecanismo para mudar corrida (task-6.4)

Após vitória na Corrida N (task-6.4 detalha), incrementar `VAR_RACE_ID`:

```
# EV_VitoriaCorrida (CE 19, trecho — task-6.4)

# Threshold check primeiro (pontuação mínima requerida):
# Ver task-6.4 para thresholds: R1=60, R2=100, R3=150 (calibrável).

# Se passou:
If VAR_VITORIA_PASSOU (117) == 1
  If VAR_RACE_ID (100) < 3
    Control Variables: VAR_RACE_ID (100) += 1
  End
  # Re-inicia Orchestrator para nova corrida ( INIT fará clamp + recalc N_CENAS)
  Call Common Event: EV_RaceOrchestrator   # CE 5
Else
  # Abaixo do threshold → restart sem avançar (mesma corrida)
  Call Common Event: EV_Crash                # CE 18 — task-6.1
End
```

### Clamp / Loop de `VAR_RACE_ID`

Quando jogador termina a Corrida 3 com pontuação suficiente (vitória confirmada):

- `VAR_RACE_ID` permanece em 3 (não incrementa além — check `If < 3`).
- Em F6, **sem endless mode formal**: jogador apenas vê tela "FIM".
- Em v2, considerar endless + dificuldade crescente.

### Por que 6/8/10 e não 5/10/15?

Spec §6.1 é explícita: comprimentos 6, 8, 10. Razões narrativas:

- **6 cenas (Lenda):** sessão curta (~2-3 min). Tutorial disfarçado.
- **8 cenas (Rachadura):** sessão média (~3-4 min). Mais variação.
- **10 cenas (Abismo):** sessão longa (~5 min). 10 cenas normais (Curva do Diabo especial fica para fase futura).

Diferença de 2 cenas entre níveis mantém **progressão suave** sem saltos.

### Erros comuns a evitar

| Erro | Consequência | Solução |
|------|--------------|---------|
| Confundir `VAR_RACE_ID` (100) com `VAR_SCENE_INDEX` (101) | ID errado no `value()` pega cena em vez de corrida | Usar constante nomeada no script gerador (`RACE_ID = 100`) |
| Confundir `VAR_RACE_N_CENAS` (111) com `VAR_ATTEMPT_N` (112) | Comprimento da corrida vira contagem de tentativas | Snapshot do `System.json` antes de gerar |
| Esquecer o `Else` default (id 0 ou >3) | `VAR_RACE_N_CENAS` fica 0 se RACE_ID inválido | `default: 6` no ternário + clamp para RACE_ID=1 |
| Resetar `VAR_RACE_N_CENAS` no crash (task-6.1) | Volta para 0, Render nunca termina | Task-6.1 não toca N_CENAS (preservado) |
| Comparar `> N_CENAS` em vez de `>=` | Off-by-one — vence uma cena antes | Usar `>=` |
| Incrementar `RACE_ID` sem clamp | Vai para 4, 5... — INIT cai no default 6 | Clamp `if (id < 1 \\|\\| id > 3)` no INIT |
| Resetar `RACE_ID` no INIT Orchestrator | Sempre volta para corrida 1 | Não resetar (preservado entre corridas) — Orchestrator só faz clamp se fora de range |
| Implementar Curva do Diabo cena especial | Quebra o core loop, fora de escopo | Não adicionar — task-6.2 é placeholder |

### Integração com task-6.1 (Crash)

Task-6.1 (EV_Crash, CE 18) **NÃO deve resetar**:

- `VAR_RACE_ID` (100) ✓ (preservado)
- `VAR_RACE_N_CENAS` (111) ✓ (preservado)
- `VAR_ATTEMPT_N` (112) ✓ (preservado e incrementado +1 no crash — decisão do usuário)
- `VAR_SEED` (110) ✓ (preservado em F6 por simplicidade)

Após crash, jogador continua na **mesma corrida**, **mesmo número de cenas**, **nova tentativa**.

## visual_validation

Ao concluir esta task (com 3.1, 3.2 prontos):

1. **Teste Corrida 1:** no F12 (debug-only — regra [[user-testable-feedback]] não se aplica a valores internos), `$gameVariables.setValue(100, 1)`. Inicie corrida via Map001 autorun.
   - F9 → `VAR_RACE_N_CENAS = 6` ✓.
   - Resolva 6 cenas (Safe ou Risk). Vitória deve disparar (task-6.4 — quando implementada).
2. **Teste Corrida 2:** `$gameVariables.setValue(100, 2)`. `VAR_RACE_N_CENAS = 8`.
3. **Teste Corrida 3:** `$gameVariables.setValue(100, 3)`. `VAR_RACE_N_CENAS = 10`. **Todas as 10 cenas são normais** (sorteio 60/40) — nenhuma é Curva do Diabo especial.
4. **Teste ID inválido:** `$gameVariables.setValue(100, 5)`. INIT cai no default: N_CENAS = 6 e RACE_ID = 1 (clamp).
5. **Teste após vitória:** (quando task-6.4 pronta) `VAR_RACE_ID` incrementa automaticamente se `VAR_VITORIA_PASSOU == 1`.
6. **Teste após crash:** `VAR_RACE_ID` e `VAR_RACE_N_CENAS` **preservados**.
7. Console F12 sem erros.
8. **Auditoria inline:** `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` — nenhum ID residual conflitando com o mapa canônico.

## Critérios de Sucesso

- [ ] `EV_RaceOrchestrator` (CE 5) calcula `VAR_RACE_N_CENAS` (111) corretamente: `VAR_RACE_ID` 1→6, 2→8, 3→10.
- [ ] Default para corrida 1 (N_CENAS=6) se `VAR_RACE_ID` inválido, com clamp de RACE_ID para 1.
- [ ] `EV_RaceRenderer` (CE 7) respeita `VAR_RACE_N_CENAS` (não passa do limite — wire de vitória fica na task-6.4).
- [ ] **`VAR_VITORIA_PASSOU` (117) resetado = 0 no INIT Orchestrator** — defensivo, também resetado no EV_Crash (task-6.1).
- [ ] `VAR_RACE_ID` (100) não é resetado no crash (preservado).
- [ ] `VAR_RACE_N_CENAS` (111) não é resetado no crash (preservado).
- [ ] Mecanismo de avanço de corrida (incrementa `VAR_RACE_ID` após vitória) preparado (executado na task-6.4).
- [ ] Clamp em `VAR_RACE_ID = 3` (não ultrapassa).
- [ ] Script gerador `fase6/build_phase6_ces.py` estendido para incluir esta task como artefato-fonte.
- [ ] Auditoria `rg "value\\(|setValue\\("` confirma IDs canônicos (100, 111).
- [ ] Pós-edição MZ: F10 → Ctrl+S → reiniciar Playtest.
- [ ] Sem erros no console.
- [ ] `visual_validation` confirmada pelo usuário rodando o jogo em cada corrida.

## Fora de Escopo

- Tela de vitória da corrida (task-6.4).
- **Curva do Diabo cena especial** — task-6.2 (fora de escopo desta fase inteira).
- Seleção manual de corrida via menu — fora do MVP (corrida é definida pela progressão VN).
- Dificuldade dinâmica (ajustar P_CENA conforme performance) — fora do MVP.
- Modo endless após Corrida 3 — fora do MVP.
- Salvar progresso entre sessões — fora do MVP.
