---
created: 2026-06-19
phase: 6
type: plan-update-diff
status: aplicado
---

# Atualização Aplicada — Fase 6 (Tasks 6.1–6.4)

> Snapshot do que foi alterado no plano da Fase 6 após cruzar as tasks originais com as retrospectivas das Fases 1–5 e com as 4 decisões confirmadas pelo usuário em 2026-06-18. Este arquivo é o **diff de auditoria** referenciado pelo banner `STATUS: ATUALIZADA COM APRENDIZADOS F1-F5` na seção Fase 6 de `tasks.md`.

## Por que esta atualização existiu

As tasks 6.1–6.4 originais foram escritas **antes** da Fase 5 terminar. Quando a Fase 5 consolidou aprendizados críticos (semântica do `ControlSwitch`, invariante de simetria de lock, padrão `build_phaseN_ces.py`, pós-edição MZ obrigatória), e o usuário confirmou 4 decisões de design em 2026-06-18, as tasks da Fase 6 ficaram desalinhadas:

1. **Decisão do usuário: EV_Crash absorve CE 17.** A task original 6.1 tratava o CE 17 (`EV_ResolucaoRiskFail`, criado na F5) como permanente. Agora CE 17 é **deletado** e absorvido pelo novo CE 18 (`EV_Crash`).
2. **Decisão do usuário: EV_Crash incrementa `VAR_ATTEMPT_N`.** A task original 6.1 não incrementava. Agora incrementa (Editor ID 112) — confirmado pelo usuário.
3. **Decisão do usuário: Curva do Diabo cena especial = fora de escopo.** A task original 6.2 especificava `VAR_P_CENA=100` fixo em Corrida 3 cena 9. Agora task-6.2 é **placeholder** e Corrida 3 tem 10 cenas normais.
4. **Decisão do usuário: Critério de avanço = pontuação mínima.** A task original 6.4 dizia "qualquer vitória avança". Agora há thresholds por corrida (R1=60, R2=100, R3=150 — calibráveis).
5. **IDs de variáveis conflitantes entre tasks.** Task-6.3 linha 122 dizia `VAR_RACE_N_CENAS = 112`; task-6.1 (escrita depois) dizia `VAR_ATTEMPT_N = 112`. Mapa canônico confirma: **N_CENAS = 111**, **ATTEMPT_N = 112**. Task-6.4 linha 51 dizia `\\V[106]` para Glória; canônico é **105**. Task-6.3 usava `value(101)` para RACE_ID; canônico é **100**.
6. **Ausência da invariante de simetria de lock.** F5 estabeleceu: 4 produtores de `SW_INPUT_LOCKED=ON` ↔ 4 consumidores de `OFF`. A absorção do CE 17 pelo CE 18 precisa preservar essa simetria.
7. **Semântica do `ControlSwitch` (code 121).** Bug crítico F5: `params[2]=0` → ON; `params[2]=1` → OFF (oposto do intuitivo). Tasks F6 precisam auditar isso explicitamente.
8. **Ausência do padrão `build_phase6_ces.py`.** F3/F4/F5 consolidaram o gerador como artefato-fonte idempotente. Tasks F6 não citavam o gerador.

## Decisões do usuário (2026-06-18) — fonte canônica

| # | Decisão | Impacto |
|---|---------|---------|
| 1 | **EV_Crash absorve CE 17** | CE 17 deletado; CE 18 criado com todas as responsabilidades; wire CE 12 FAIL atualizado de `Call CE 17` para `Call CE 18` |
| 2 | **EV_Crash incrementa `VAR_ATTEMPT_N`** | `Control Variables: VAR_ATTEMPT_N += 1` (Editor ID 112) adicionado ao bloco de reset do CE 18 |
| 3 | **Curva do Diabo cena especial = fora de escopo** | Task-6.2 transformada em placeholder; Corrida 3 tem 10 cenas normais; `SW_IS_CURVA_DIABO` (105) e `placa_curva_dir.png` ficam reservados sem uso |
| 4 | **Critério de avanço = pontuação mínima requerida** | Task-6.4 reescrita com threshold check; nova variável `VAR_VITORIA_PASSOU` (Editor ID 117) criada; branch de derrota reinicia mesma corrida via CE 18 |

## Mapa canônico aplicado (referência rápida)

### Variáveis (`System.json`, 0-based array index = Editor ID)

| Editor ID | Nome | Faixa | Origem |
|-----------|------|-------|--------|
| 100 | `VAR_RACE_ID` | 1..3 | F1 |
| 101 | `VAR_SCENE_INDEX` | 0..N | F1 |
| 102 | `VAR_SCENE_TYPE` | 0=Sinal, 1=Curva, 2=Diabo (reservado) | F1 |
| 103 | `VAR_P_CENA` | 10..100 | F1 |
| 104 | `VAR_CONSCIENCIA` | 0..100 | F1 |
| 105 | `VAR_PONTOS_GLORIA` | 0..N | F1 |
| 106 | `VAR_TAXA_SUCESSO` | 0..100 | F1 |
| 107 | `VAR_ROLL_RESULT` | 0..99 | F1 |
| 108 | `VAR_TIMER_FRAMES` | 0..240 | F1 |
| 109 | `VAR_SCENE_START` | — | F1 |
| 110 | `VAR_SEED` | — | F1 |
| 111 | `VAR_RACE_N_CENAS` | 6/8/10 | F1 (calculado em F6 task 6.3) |
| 112 | `VAR_ATTEMPT_N` | 0..N | F1 (incrementado em F6 task 6.1 EV_Crash) |
| 113 | `VAR_LAST_RENDERED_INDEX` | — | F3 |
| 114 | (livre) | — | reservado |
| 115 | `VAR_HOVER_LEVEL` | 0..3 | F5 |
| 116 | `VAR_TIMER_TIMEOUT_FLAG` | 0..1 | F4 |
| **117** | **`VAR_VITORIA_PASSOU`** | **0..1** | **F6 task 6.4 (a criar)** |

### Switches (`System.json`)

| Editor ID | Nome | Estado em F6 |
|-----------|------|--------------|
| 100 | `SW_RACE_ACTIVE` | usado |
| 101 | `SW_INPUT_LOCKED` | usado (invariante de simetria) |
| 102 | `SW_CRASH_FLAG` | resetado no EV_Crash |
| 103 | `SW_LAST_ACTION_SAFE` | resetado no EV_Crash |
| 104 | `SW_PAUSED` | não usado em F6 |
| 105 | `SW_IS_CURVA_DIABO` | **reservado — NÃO usado em F6** (Curva do Diabo fora de escopo) |

### Common Events (`CommonEvents.json`) — pós-F6

| Editor ID | Nome | Trigger | Estado em F6 |
|-----------|------|---------|--------------|
| 1-4 | placeholders/legados/EV_Preload | — | intocados |
| 5 | `EV_RaceOrchestrator` | Call | **editado em 6.3** (cálculo N_CENAS) |
| 6 | `EV_UpdateHud` | Call | intocado |
| 7 | `EV_RaceRenderer` | Parallel | **editado em 6.4** (check vitória) |
| 8 | `EV_RenderSinal` | Call | intocado |
| 9 | `EV_RenderCurva` | Call | intocado |
| 10 | `EV_RaceTimer` | Parallel | intocado |
| 11 | `EV_OnSafe` | Call | intocado |
| 12 | `EV_OnRisk` | Call | **editado em 6.1** (wire FAIL: CE 17 → CE 18) |
| 13 | `EV_KeyInput` | Parallel | intocado |
| 14 | `EV_ResolucaoSafe` | Call | intocado |
| 15 | `EV_ResolucaoRiskOK` | Call | intocado |
| 16 | `EV_HoverRiskButton` | Parallel | intocado |
| ~~17~~ | ~~`EV_ResolucaoRiskFail`~~ | ~~Call~~ | **DELETADO em 6.1** (absorvido por CE 18) |
| **18** | **`EV_Crash`** | **Call** | **novo em 6.1** |
| **19** | **`EV_VitoriaCorrida`** | **Call** | **novo em 6.4** |

## Diff aplicado por arquivo

### `tasks.md`

#### Seção Fase 6 (substituída integralmente)

- **Banner `STATUS: ATUALIZADA COM APRENDIZADOS F1-F5`** (2026-06-18) com referência a este arquivo.
- **Bloco "DECISÕES CONFIRMADAS PELO USUÁRIO"** com as 4 decisões em evidência.
- **Diretriz de geração** estendida para F6: `build_phase6_ces.py` obrigatório (espelha F4/F5).
- **Aprendizados F5 herdados:**
  - Semântica do `ControlSwitch` (code 121): `0=ON`, `1=OFF`.
  - Invariante de simetria de lock: 4 produtores ON ↔ 4 consumidores OFF (CE 18 assumiu papel do CE 17).
  - Pós-edição MZ obrigatória: F10 → Ctrl+S → reiniciar Playtest.
- **Pré-passos atualizados:**
  - Confirmar F5 validada em Playtest MZ.
  - Snapshot `variables[100:117]` e `switches[100:106]`.
  - Confirmar CEs 5-17 ativos (17 marcado para deleção).
  - Criar `build_phase6_ces.py`.
  - Confirmar assets: `race/bg_vitoria.png`, `race/overlay_flash_white.png`, `race/bg_fim.png`, ME `Victory`.
- **Tabela de alocação de CEs atualizada** com CE 17 deletado e CEs 18/19 novos.
- **Heurística de auditoria** com IDs canônicos da F6: 100/101/103/104/105/106/107/108/111/112/116 (e 117 a criar).
- **Classificação JSON-automatizável** atualizada:
  - 6.1: Sim (via script).
  - 6.2: **FORA DE ESCOPO** desta fase.
  - 6.3: Sim (via script) — Opção B (Script inline) para cálculo.
  - 6.4: Parcial — CE 19 + wire no CE 7 via script; TextPicture Plugin Command no CE 19 é manual MZ.

#### Tabela de Tasks (linhas 302-305)

- 6.1: descrição atualizada com "(CE 18, absorve CE 17, ATTEMPT_N++, restart <1s)".
- 6.2: ~~Implementar Curva do Diabo~~ **FORA DE ESCOPO** (cena especial futura) — `_reservado_`.
- 6.3: descrição atualizada com "(6/8/10 via Script inline no INIT Orchestrator)".
- 6.4: descrição atualizada com "(CE 19) + threshold pontuação + wire Renderer".

#### Ordem de Execução (linha ~336)

- Task-6.2 removida da ordem linear.
- Nota sobre ordem F6 adicionada: 6.1 primeiro (precisa para vitória com pontuação baixa); 6.3 antes de 6.4 (Renderer precisa saber N_CENAS); 6.4 por último.

#### Caminho mínimo recomendado para Fase 6 (novo bloco, linhas 490-562)

11 passos detalhados cobrindo: pré-passos → script gerador → task 6.1 (sequência completa) → task 6.3 (Script inline Opção B) → task 6.4 (wire CE 7 + CE 19 com threshold check + branch derrota via CE 18) → auditoria → MZ reload → playtest → registro.

#### Erros comuns a evitar (linhas 564-581)

- Adicionado: "Não reintroduzir o CE 17 após F6".
- Adicionado: "Não incrementar `VAR_RACE_ID` sem clamp".
- Adicionado: "Não resetar `VAR_RACE_ID` ou `VAR_RACE_N_CENAS` no crash".
- Adicionado: "Não esquecer `Wait 1 frame` em loops Label/Jump".
- Adicionado: "Não esquecer `Stop BGM` antes de `Play ME`".
- Adicionado: "Não implementar a Curva do Diabo cena especial em F6".

#### Estado de pré-requisitos para F6 (linhas 456-471)

- Atualizado para pós-F5: 16 PNGs base + overlays F5 (flash green/gold, hover l1/l2/l3).
- F6 precisa criar: `overlay_flash_white.png` (816×624 RGBA branco opaco).
- F6 opcional: `bg_vitoria.png`, `bg_fim.png` (fallback: Tint Screen).
- CEs 5-17 ativos; CE 17 será deletado em F6.
- Slots livres: 18+ para `EV_Crash` (6.1) e `EV_VitoriaCorrida` (6.4).
- Variável Editor ID 117 (`VAR_VITORIA_PASSOU`) — AUSENTE — pré-passo obrigatório da F6 task 6.4.

#### Mapa de Common Events (linhas 413-435)

- CE 5 marcado como "editado em 6.3".
- CE 7 marcado como "editado em 6.4".
- CE 12 marcado como "editado em 6.1".
- CE 17 marcado como "DELETADO em 6.1".
- CE 18 (`EV_Crash`) — novo.
- CE 19 (`EV_VitoriaCorrida`) — novo.

#### Mapa de IDs (linha 411)

- Adicionado `VAR_VITORIA_PASSOU` (Editor ID 117) — "a criar em F6".

### `task-6.1.md` (EV_Crash) — reescrita integral

- **Header:** "Tarefa 6.1: Criar `EV_Crash` (CE 18, absorve CE 17, Restart < 1s)".
- **Bloco "Decisões de design confirmadas pelo usuário (2026-06-18)"** com itens 1 e 2.
- **22 subtarefas** (6.1.1 a 6.1.22) cobrindo: criação do `build_phase6_ces.py`, deleção do CE 17, criação do CE 18, patch do wire no CE 12, sequência completa (Buzzer1/SE + Shake + Flash + Tint + reset + erase pictures + Tint normal + Call CE 6 + Call CE 8), criação de asset, validação.
- **Pseudo-código canônico do CE 18** com IDs MZ code explícitos para cada comando:
  - Fase 1 (crash visual, ~18 frames): `crash_metal` SE (250), Shake Screen (233), Show Picture 32 + Move Picture (231/232), Tint Screen escuro (223), Wait (230).
  - Fase 2 (reset no escuro): `Control Variables` (122) para CONSCIENCIA=0 (104), GLORIA=0 (105), SCENE_INDEX=0 (101), TIMER=240 (108), TAXA=0 (106), ROLL=0 (107), **ATTEMPT_N += 1 (112)**; `Control Switches` (121) com `params[2]=1` (OFF) para CRASH_FLAG (102), INPUT_LOCKED (101), LAST_ACTION_SAFE (103).
  - Fase 3 (restaurar tela, ~18 frames): Script erase pictures 1-60 (355), Erase Picture 32 (235), Tint Normal (223), Call CE 6 (117), Call CE 8 (117), Wait 6f (230).
- **Preservação seletiva** documentada em tabela (RACE_ID, RACE_N_CENAS, SEED preservados; CONSCIENCIA, GLORIA, SCENE_INDEX, TIMER, TAXA, ROLL resetados; **ATTEMPT_N += 1**).
- **Invariante de simetria de lock** explicitamente documentada: CE 18 assumiu o papel de "consumidor de lock para o ramo FAIL" anteriormente ocupado pelo CE 17 — não adiciona um 5º consumidor.
- **Wire patch instructions:** localizar `C(117, 1, [17])` no CE 12 FAIL branch e substituir por `C(117, 1, [18])`.
- **visual_validation** com 11 itens: cronometragem <1s, F9 confirma variáveis, F9 confirma switches, sem erros no console (em particular nenhum "Common Event ID 17 does not exist").
- **Critérios de Sucesso** com 21 itens cobrindo todos os aprendizados F5.

### `task-6.2.md` (Curva do Diabo) — reescrita como placeholder

- **Status:** `out_of_scope`.
- **Header:** "Tarefa 6.2: **FORA DE ESCOPO DESTA FASE** — Curva do Diabo (Cena Especial)".
- **Callout warning** no topo: "Status: reservada para fase futura ou v2".
- **Citação literal** da decisão do usuário (item 3).
- **Tradução prática para F6:** Corrida 3 tem 10 cenas normais; cena 9 sem tratamento especial; `SW_IS_CURVA_DIABO` (105) e `placa_curva_dir.png` permanecem reservados sem uso.
- **O que a cena especial faria** (preservado para implementador futuro): detectar condição, P_CENA=100 fixo, SCENE_TYPE=2, SW_IS_CURVA_DIABO=ON, placa diferenciada, **bloquear caminho Safe**, forçar Risk.
- **Pré-requisitos para ativar no futuro:** F6 validada + decisão de design sobre Safe block (Opções A/B/C) + calibração P_CENA.
- **Referências de origem** preservadas para o implementador futuro.
- Tudo marcado como Fora de Escopo.

### `task-6.3.md` (Variação de Corridas) — reescrita

- **IDs corrigidos:**
  - `VAR_RACE_ID`: 101 → **100** (em todas as referências, incluindo `value(101)` → `value(100)` no Script inline).
  - `VAR_RACE_N_CENAS`: 112 → **111** (em todas as referências, incluindo `setValue(112, n)` → `setValue(111, n)`).
- **Referência ao mapa canônico** adicionada no topo.
- **Callout info** "Curva do Diabo fora de escopo desta fase" no início.
- **Tabela de corridas** atualizada: "10 | Difícil (longa — 10 cenas normais)" em vez de "com Curva do Diabo na cena 9".
- **Subtarefas** (7 itens) reescritas: confirmar N_CENAS=111 nomeado, estender `build_phase6_ces.py`, modificar CE 5 INIT, confirmar CE 7 respeita N_CENAS (wire fica na 6.4), auditar inline, MZ reload, playtest.
- **Pseudo-código** atualizado para Opção B (Script inline) com IDs canônicos:
  ```javascript
  const id = $gameVariables.value(100);   // VAR_RACE_ID
  const n = id === 1 ? 6 : id === 2 ? 8 : id === 3 ? 10 : 6;
  $gameVariables.setValue(111, n);        // VAR_RACE_N_CENAS
  if (id < 1 || id > 3) $gameVariables.setValue(100, 1);  // clamp
  ```
- **Wire de vitória movido para task-6.4** (anteriormente era parte da task-6.3).
- **Erros comuns** atualizados: removida linha sobre "Esquecer que Corrida 3 tem cena 9 = Diabo"; adicionadas linhas sobre confusão de IDs (100 vs 101, 111 vs 112) e sobre não implementar Curva do Diabo.
- **visual_validation** atualizado: cenário 3 diz "Todas as 10 cenas são normais (sorteio 60/40) — nenhuma é Curva do Diabo especial".
- **Fora de Escopo:** adicionado "Curva do Diabo cena especial — task-6.2 (fora de escopo desta fase inteira)".

### `task-6.4.md` (Tela de Vitória com Threshold) — reescrita integral

- **Header:** "Tarefa 6.4: Implementar Tela de Vitória com Critério de Pontuação Mínima".
- **Dependencies atualizadas:** `task-5.4, task-6.1, task-6.3` (adicionado 6.1 porque branch derrota chama EV_Crash; adicionado 6.3 porque wire no Renderer precisa de N_CENAS).
- **Referência à decisão do usuário** (item 4) e ao mapa canônico.
- **Bloco "Thresholds propostos (calibráveis)"** com tabela R1=60, R2=100, R3=150 + callout info explicando o racional (pontuação máxima teórica, necessidade de Risk).
- **Diagrama de fluxo do CE 19** mostrando 4 caminhos: (passou, RACE_ID<3), (passou, RACE_ID==3 → FIM), (não passou, RACE_ID<3 → restart), (não passou, RACE_ID==3 → restart sem endless).
- **IDs corrigidos:**
  - `VAR_RACE_ID`: 101 → **100**.
  - `VAR_PONTOS_GLORIA`: 106 → **105** (especialmente no `\\V[105]` do TextPicture).
- **`VAR_VITORIA_PASSOU` (Editor ID 117)** introduzida — nova variável a ser criada via `fase6/setup_phase6_system.py` (pré-passo).
- **Subtarefas** (17 itens) organizadas em 4 grupos: pré-passos (reservar var 117), implementação via script gerador (CE 19 + wire CE 7), passo manual MZ (TextPicture), auditoria + validação.
- **Threshold check via Script inline:**
  ```javascript
  const pontos = $gameVariables.value(105);  // VAR_PONTOS_GLORIA
  const raceId = $gameVariables.value(100);  // VAR_RACE_ID
  const thresholds = { 1: 60, 2: 100, 3: 150 };
  const passou = pontos >= (thresholds[raceId] || 60);
  $gameVariables.setValue(117, passou ? 1 : 0);  // VAR_VITORIA_PASSOU
  ```
- **Branch derrota via CE 18 (EV_Crash):** jogador que não atingiu threshold reinicia a **mesma corrida** (RACE_ID preservado, ATTEMPT_N incrementado pelo EV_Crash).
- **Callout important** sobre resetar `VAR_VITORIA_PASSOU` no INIT Orchestrator (task-6.3) — caso contrário estado persiste para próxima corrida.
- **Tabela de decisão** com 4 caminhos pós-vitória.
- **Erros comuns** atualizados: adicionadas linhas sobre `\\V[106]` errado (deve ser 105), confusão RACE_ID 100 vs 101, não resetar VITORIA_PASSOU, threshold muito alto/baixo.
- **visual_validation** com 4 cenários: vitória com pontuação suficiente (R1→R2), derrota com pontuação insuficiente (R2 restart), FIM após vencer R3, threshold inválido (debug-only).
- **Critérios de Sucesso** com 16 itens cobrindo todos os aprendizados.

## Pré-passos criados nesta atualização

### Novo script: `fase6/setup_phase6_system.py`

A ser criado na implementação da task 6.4. Reserva `VAR_VITORIA_PASSOU` (Editor ID 117) em `System.json`. Análogo a `fase5/setup_phase5_system.py` (que reservou `VAR_HOVER_LEVEL` em 115).

### Novo script: `fase6/build_phase6_ces.py`

A ser criado no início da implementação da F6. Estende a estrutura do `fase5/build_phase5_ces.py` com:
- Constantes de IDs canônicos (RACE_ID=100, N_CENAS=111, ATTEMPT_N=112, VITORIA_PASSOU=117, etc.).
- Helpers `C(code, indent, params)` herdados.
- Modo idempotente preservando slots 0-16 (CE 17 é explicitamente nullificado).
- Deleção do CE 17 + criação do CE 18 + patch do wire CE 12 + criação do CE 19 + wire no CE 7.

## Heurísticas de auditoria herdadas (F3+F4+F5 — aplicáveis em F6)

1. **Snapshot do `System.json` antes de gerar:** imprimir `variables[100:117]` e `switches[100:106]` — fonte de verdade, não confiar em documentação.
2. **Auditar scripts inline:** `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` — confirmar IDs batem com o mapa canônico.
3. **Auditar `ControlSwitch` (code 121):** confirmar `params[2]=0` (ON) vs `params[2]=1` (OFF) — bug crítico F5.
4. **Validar JSON:** `python -m json.tool Jhonny/data/CommonEvents.json` antes de abrir MZ.
5. **Pós-edição MZ:** F10 → Ctrl+S → reiniciar Playtest (bug real F4: `$dataCommonEvents` em runtime pode não refletir JSON em disco).
6. **Playtest com feedback perceptível:** regra [[user-testable-feedback]] — sem F12/F9 em validação de UX.
7. **Artefato-fonte é o gerador:** se `build_phase6_ces.py` existe, corrigir nele antes do JSON gerado; regenerar e validar.

## Próximos passos para o implementador

1. **Confirmar F5 validada em Playtest MZ** (pré-condição — não iniciar F6 se F5 tem bugs pendentes).
2. **Executar os 11 passos do caminho mínimo em [[tasks#Caminho mínimo recomendado para Fase 6]]:**
   - Pré-passos (snapshot + setup_phase6_system.py para var 117).
   - Criar `build_phase6_ces.py`.
   - Task 6.1 (EV_Crash CE 18 + delete CE 17 + patch wire CE 12).
   - Task 6.3 (estender CE 5 com cálculo N_CENAS).
   - Task 6.4 (wire CE 7 + CE 19 + TextPicture manual + threshold check).
   - Auditorias + MZ reload + playtest.
3. **Atualizar `tasks.md`** marcando F6 como completa após playtest bem-sucedido.
4. **Criar `fase-6-completa.md`** com registro de conclusão (análogo a `fase-5-completa.md`).
5. **Atualizar retrospectiva** em `fase6/retrospectiva.md` com aprendizados da implementação (análogo a `fase5/retrospectiva.md`).

## Referências

- [[tasks]] — plano canônico pós-atualização.
- [[task-6.1]] — EV_Crash.
- [[task-6.2]] — placeholder Curva do Diabo.
- [[task-6.3]] — variação de corridas.
- [[task-6.4]] — vitória com threshold.
- [[fase5/retrospectiva]] — aprendizados F5 aplicados.
- [[fase-5-completa]] — snapshot F5 validada.
- [[Corrida - Core Loop]] — spec de domínio.
- [[Guia de Implementação - Core Loop da Corrida]] — guia técnico.
