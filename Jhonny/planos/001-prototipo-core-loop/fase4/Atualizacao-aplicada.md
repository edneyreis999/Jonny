---
title: "Fase 4 — Atualização aplicada"
type: registro-atualizacao
fase: 4
status: artefatos-atualizados
data_atualizacao: "2026-06-18"
origem_conhecimento: "[[fase1/retrospectiva]], [[fase2/retrospectiva]], [[fase3/retrospectiva]]"
artefatos_alterados:
  - "Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/tasks.md"
  - "Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/task-4.1.md"
  - "Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/task-4.2.md"
  - "Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/task-4.3.md"
  - "Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/task-4.4.md"
---

# Fase 4 — Atualização aplicada

## Motivo

Atualizar o plano `core_loop_corrida/tasks.md` e as tasks `task-4.*.md` com os conhecimentos consolidados das retrospectivas das Fases 1, 2 e 3. O usuário pediu explicitamente para perguntar em caso de ambiguidade; este documento registra as decisões tomadas após esclarecimento.

## Ambiguidades identificadas e esclarecidas

### 1. Convenção de IDs (variáveis e switches)

**Conflito:** a documentação pré-F3 (incluindo `tasks.md`, `fase-3-completa.md` e as `task-4.*.md` originais) usava Editor IDs **101-114 (variáveis) e 101-106 (switches)**. A retrospectiva da F3 afirma que os IDs reais são **100-113 / 100-105** e que tudo foi corrigido.

**Verificação do código RMMZ:** `rmmz_objects.js:691` (`Game_Switches.value` → `_data[switchId]`) e `:723` (`Game_Variables.value` → `_data[variableId]`) acessam o array **diretamente** sem offset. Portanto o índice do array em `System.json` é igual ao Editor ID. Os nomes vivem em Editor IDs 100-113 / 100-105.

**Snapshot real do `System.json` (2026-06-18):**
- Editor ID 100 = `VAR_RACE_ID` / `SW_RACE_ACTIVE`
- Editor ID 101 = `VAR_SCENE_INDEX` / `SW_INPUT_LOCKED`
- Editor ID 102 = `VAR_SCENE_TYPE` / `SW_CRASH_FLAG`
- Editor ID 103 = `VAR_P_CENA` / `SW_LAST_ACTION_SAFE`
- Editor ID 104 = `VAR_CONSCIENCIA` / `SW_PAUSED`
- Editor ID 105 = `VAR_PONTOS_GLORIA` / `SW_IS_CURVA_DIABO`
- Editor ID 106 = `VAR_TAXA_SUCESSO`
- Editor ID 107 = `VAR_ROLL_RESULT`
- Editor ID 108 = `VAR_TIMER_FRAMES`
- Editor ID 109 = `VAR_SCENE_START`
- Editor ID 110 = `VAR_SEED`
- Editor ID 111 = `VAR_RACE_N_CENAS`
- Editor ID 112 = `VAR_ATTEMPT_N`
- Editor ID 113 = `VAR_LAST_RENDERED_INDEX`

**Decisão do usuário:** usar IDs 100-113 / 100-105.

### 2. Variável `VAR_TIMER_TIMEOUT_FLAG` ausente

**Conflito:** a task 4.1 original referenciava `VAR_TIMER_TIMEOUT_FLAG` (ID 116) como subtask 4.1.1, mas essa variável não existe em `System.json`.

**Decisão do usuário:** adicionar ID 116 no setup da Fase 4 como pré-passo (mesmo padrão do pré-passo da F3 que nomeou ID 113).

### 3. Alocação de CE IDs para F4

**Estado atual de `CommonEvents.json`:** Editor IDs 1-10 ocupados (1=null, 2=acelerador, 3=freio, 4=EV_Preload, 5=vazio, 6=Orchestrator, 7=UpdateHud, 8=Renderer, 9=RenderSinal, 10=RenderCurva).

**Decisão do usuário:** IDs 11-14 sequenciais:
- 11 → `EV_RaceTimer` (Parallel, `switchId: 100`)
- 12 → `EV_OnSafe` (Call)
- 13 → `EV_OnRisk` (Call)
- 14 → `EV_KeyInput` (Parallel, `switchId: 100`)

## Mudanças aplicadas

### `tasks.md`

1. **Seção Fase 1:** corrigidos IDs 101-113/101-106 → 100-113/100-105; adicionada nota sobre a correção de convenção.
2. **Seção Fase 3:** corrigidos CE IDs (5→6 Orchestrator, 7→8 Renderer, 8→9 RenderSinal, 9→10 RenderCurva, 6→7 UpdateHud) e `switchId: 101` → `100`. Atualizada pré-condição (ID 114 → ID 113, já nomeado).
3. **Seção Fase 4:** reescrita com:
   - Pré-passos obrigatórios (criar `VAR_TIMER_TIMEOUT_FLAG` ID 116 + snapshot de IDs).
   - Tabela de alocação de CE IDs 1-14.
   - Heurística de auditoria inline (`rg "value\\(|setValue\\("`).
   - Tabela de automatização JSON × MZ Editor por task.
   - Atualização das 4 linhas de tasks (CE IDs 11/12/13/14).
4. **Tabela de Tasks:** linhas 4.x atualizadas com CE IDs e estratégia JSON/MZ.
5. **Ordem de Execução:** adicionados pré-passos da F4.
6. **Aprendizados Consolidados:** reescrita como "Fases 1-3" com:
   - Convenção de IDs (RMMZ acesso direto, snapshot como fonte de verdade, auditoria inline obrigatória).
   - Mapa completo de IDs (variáveis + switches).
   - Mapa de Common Events (CE Editor IDs 1-14).
   - Estado de pré-requisitos para F4 (em vez de F3).
   - Caminho mínimo recomendado para F4.
   - Erros comuns atualizados com convenção 100-113.

### `task-4.1.md` (EV_RaceTimer)

- Pré-passo explícito de criação de `VAR_TIMER_TIMEOUT_FLAG` (Editor ID 116) com snippet Python+json.
- CE Editor ID 11 em vez de slot genérico.
- Guardas usando Editor IDs 100/101/108.
- Timeout chama `EV_OnSafe` no **CE Editor ID 12**.
- Adicionada seção "Formato JSON canônico do comando If (code 111)" com formatos `[0, sw, 0/1]` para switch e `[1, var, 4, val, 1]` para `<=`.
- Adicionada auditoria inline e validação JSON como subtasks.

### `task-4.2.md` (ButtonPicture)

- CE IDs reais da F3: RenderSinal=9, RenderCurva=10, Renderer=8.
- Botões referenciam CE 12 (`EV_OnSafe`) e CE 13 (`EV_OnRisk`).
- Recomendação explícita de usar MZ Editor para o bloco `Plugin Command` (schema opaco do code 357).
- Script de auditoria inline antes de fechar.

### `task-4.3.md` (Handlers)

- CEs 12/13 explicitados.
- Guardas usando Editor IDs 100/101/108.
- Placeholder das tasks 5.1/5.2 com IDs corretos em cada linha.
- Formato JSON canônico do If reiterado.
- Script de reset manual no console atualizado: `$gameSwitches.setValue(101, false)` (Editor ID 101 = `SW_INPUT_LOCKED`).

### `task-4.4.md` (KeyInput)

- CE Editor ID 14 explicitado.
- **Crítica:** `VAR_SCENE_TYPE` é Editor ID **102**, não 103 (esta confusão existia na task original).
- `reserveCommonEvent(12)` e `reserveCommonEvent(13)` (Editor IDs).
- Script de teste manual atualizado: `$gameVariables.setValue(102, 1)` para forçar cena Curva.
- Auditoria inline antes de fechar.

## Checklist para o implementador

Antes de iniciar a implementação da F4:

- [ ] Imprimir `variables[95:117]` e `switches[95:107]` de `System.json` (snapshot de IDs).
- [ ] Criar `VAR_TIMER_TIMEOUT_FLAG` (Editor ID 116) via snippet Python+json em `task-4.1.md`.
- [ ] Decidir estratégia: criar script gerador `build_phase4_ces.py` (idempotente) ou editar `CommonEvents.json` manualmente via Python+json. Recomendação: **criar o gerador** — mesma prática validada na F3.

Durante cada task:

- [ ] Após editar `CommonEvents.json`, rodar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` e confirmar IDs coerentes com 100-113/100-105.
- [ ] Rodar `python3 -m json.tool Jhonny/data/CommonEvents.json` antes de abrir MZ Editor.
- [ ] Para `task-4.2` (Plugin Command `ButtonPicture → Set`): usar MZ Editor para o bloco Plugin Command; Python+json para Show/Erase Picture.

Após implementar todas as tasks:

- [ ] Solicitar playtest MZ ao usuário.
- [ ] Criar `Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/fase-4-completa.md` com snapshot dos CEs 11-14 e validações.
- [ ] Atualizar `tasks.md` marcando F4 como completa.
- [ ] Após playtest validado, escrever `Jhonny/planos/001-prototipo-core-loop/fase4/retrospectiva.md`.

## Riscos conhecidos a observar

- **`VAR_SCENE_TYPE` (102) vs `VAR_P_CENA` (103):** fácil confusão. `VAR_SCENE_TYPE` define Sinal(0) vs Curva(1/2); `VAR_P_CENA` é o custo da cena corrente. Ramificações de input usam `VAR_SCENE_TYPE`.
- **Plugin Command code 357:** schema interno do MZ Editor pode variar entre versões. Se editar via Python+json, validar que o MZ consegue abrir o Database sem erro.
- **Anti-spin em CEs paralelos (CE 11, 14):** esquecer `Wait 1 frame` trava a engine. Confirmar no editor MZ que o `Wait 1 frame` está dentro do loop, antes do `Jump to Label`.
- **Auditoria de scripts inline:** os CEs 12 e 13 terão scripts inline (`$gameVariables.value/setValue`) quando as tasks 5.1/5.2 forem implementadas. A auditoria `rg` deve ser repetida a cada task subsequente.

## Fora de escopo desta atualização

- Implementação de fato das tasks 4.1-4.4 (será feita na próxima sessão).
- Atualização de `fase-3-completa.md` (snapshot histórico; manter como está para auditoria).
- Criação do `build_phase4_ces.py` (decisão de implementação, não de planejamento).
