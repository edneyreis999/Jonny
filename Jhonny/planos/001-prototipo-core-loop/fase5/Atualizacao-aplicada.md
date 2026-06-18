---
created: 2026-06-18
phase: 5
type: plan-update-diff
status: aplicado
---

# Atualização Aplicada — Fase 5 (Tasks 5.1–5.5)

> Snapshot do que foi alterado no plano da Fase 5 após cruzar as tasks originais com o mapa canônico pós-F4 (IDs, alocação de CEs e aprendizados das fases 1–4). Este arquivo é o **diff de auditoria** referenciado pelos banners `ATUALIZAÇÃO (2026-06-18)` em cada `task-5.x.md`.

## Por que esta atualização existiu

As tasks 5.1–5.5 foram escritas **antes** da Fase 4 terminar. Quando a Fase 4 consolidou o mapa canônico de IDs (e corrigiu bugs como o do guarda 3), as tasks da Fase 5 ficaram com referências desatualizadas:

1. **IDs de variáveis deslocados +1** em relação ao mapa canônico (ex.: `VAR_CONSCIENCIA` aparecia como 105, mas o canônico é 104).
2. **Alocação de Common Events obsoleta** (`F4=11-14` em vez do real `F4=10-13`), sem deixar claro onde alocar os novos CEs 14/15/16 da Fase 5.
3. **3 guardas nos handlers** (`SW_RACE_ACTIVE`, `SW_INPUT_LOCKED`, `VAR_TIMER_FRAMES`) — o guarda 3 foi removido em F4 (causava bug).
4. **Hover via Plugin Command `ButtonPicture.onHover`** apresentado como Opção A — F4 confirmou que o plugin **não expõe** esse callback; Opção B (Script inline com `TouchInput`) é a única viável.
5. **Ausência do padrão `build_phaseN_ces.py`** — F4 estabeleceu o gerador como artifact-source-of-truth idempotente; as tasks da Fase 5 não citavam o gerador.

## Mapa canônico aplicado (referência rápida)

### Variáveis (`System.json`, 0-based array index = Editor ID)

| Editor ID | Nome | Faixa |
|-----------|------|-------|
| 100 | `VAR_RACE_ID` | — |
| 101 | `VAR_SCENE_INDEX` | 0..N |
| 102 | `VAR_SCENE_TYPE` | 0=Sinal, 1=Curva |
| 103 | `VAR_P_CENA` | 0..N |
| 104 | `VAR_CONSCIENCIA` | 0..100 |
| 105 | `VAR_PONTOS_GLORIA` | 0..N |
| 106 | `VAR_TAXA_SUCESSO` | 0..100 |
| 107 | `VAR_ROLL_RESULT` | 0..99 |
| 108 | `VAR_TIMER_FRAMES` | 0..240 |
| 113 | `VAR_LAST_RENDERED_INDEX` | — |
| 115 | `VAR_HOVER_LEVEL` | 0..3 (a criar em 5.5) |

### Switches (`System.json`)

| Editor ID | Nome |
|-----------|------|
| 100 | `SW_RACE_ACTIVE` |
| 101 | `SW_INPUT_LOCKED` |
| 102 | `SW_CRASH_FLAG` |
| 103 | `SW_LAST_ACTION_SAFE` |
| 104 | `SW_PAUSED` |
| 105 | `SW_IS_CURVA_DIABO` |

### Common Events (`CommonEvents.json`)

| Editor ID | Nome | Fase |
|-----------|------|------|
| 5–9 | `EV_RaceOrchestrator`, `EV_UpdateHud`, `EV_RaceRenderer`, `EV_RenderSinal`, `EV_RenderCurva` | F3 |
| 10 | `EV_RaceTimer` | F4 |
| 11 | `EV_OnSafe` | F4 |
| 12 | `EV_OnRisk` | F4 |
| 13 | `EV_KeyInput` | F4 |
| 14 | `EV_ResolucaoSafe` | F5 (a criar em 5.3) |
| 15 | `EV_ResolucaoRiskOK` | F5 (a criar em 5.3) |
| 16 | `EV_HoverRiskButton` | F5 (a criar em 5.5) |

## Diff aplicado por arquivo

### `tasks.md`

- **Seção Fase 5** substituída por bloco expandido com banner `ATUALIZADA`, diretriz de geração (`build_phase5_ces.py` obrigatório), aprendizados F4 (2 guardas, MZ reload, hover não nativo), pré-passos, tabela de alocação de CEs corrigida (F3=5-9, F4=10-13, **F5=14-16**), heurística de auditoria com IDs canônicos, e tabela de tasks com classificação JSON-automatizável.
- **Tabela de alocação de CEs da Fase 4** corrigida de `F4=11-14` para `F4=10-13` (com nota histórica de off-by-one).
- **Entradas de tasks da Fase 4** com IDs de CE atualizados (4.1 CE 11→10, 4.3 CEs 12/13→11/12, 4.4 CE 14→13, 4.5 CEs 11/12→10/11) e "3 guardas" → "2 guardas".
- **Tabela principal de tasks** (linhas ~234-243) com referências de CE ID e abordagem JSON atualizadas.
- **Mapa de Common Events**: adicionados CEs 14/15/16 da F5 marcados como "a criar".
- **Estado de pré-requisitos**: snapshot F4 substituído por snapshot F5 (`VAR_HOVER_LEVEL` pendente em 115, slots 14+ livres).
- **Caminho mínimo**: caminho F4 substituído por caminho F5 (12 passos: criação do gerador, auditoria de IDs, MZ reload, playtest com feedback perceptível).
- **Mapa de IDs** (linha 113+): 114 como livre, 115 como `VAR_HOVER_LEVEL` (a criar), 116 como `VAR_TIMER_TIMEOUT_FLAG` (criada em F4).

### `task-5.1.md` (Safe)

- **Banner `ATUALIZAÇÃO (2026-06-18)`** no topo com IDs corrigidos (`VAR_CONSCIENCIA=104`, `VAR_PONTOS_GLORIA=105`, `VAR_SCENE_INDEX=101`, `SW_INPUT_LOCKED=101`), remoção do guarda 3, referência a `build_phase5_ces.py`.
- **Referência de origem adicionada**: aprendizados F1-F4 (`[[fase4/retrospectiva]]`, `[[fase-4-completa]]`).
- **Subtarefas reescritas (12 itens)**: adicionados pré-passos (snapshot `System.json`, criação do `build_phase5_ces.py`), IDs canônicos (104/105/101/103), remoção do guarda 3, passo de MZ reload (5.1.11), playtest com feedback perceptível (5.1.12).
- **Pseudo-código**: removido `If VAR_TIMER_FRAMES <= 0 / Exit / End` (3º guarda); atualizada referência a "variável 105" → "variável 104"; corrigido inline script `setValue(105, ...)` → `setValue(104, ...)`.
- **visual_validation**: "Variável 105" → "Variável 104"; corrigido `$gameSwitches.setValue(102, false)` → `$gameSwitches.setValue(101, false)` (SW_INPUT_LOCKED é 101).

### `task-5.2.md` (Risk)

- **Banner `ATUALIZAÇÃO (2026-06-18)`** no topo com IDs corrigidos (`VAR_TAXA_SUCESSO=106`, `VAR_ROLL_RESULT=107`, `VAR_CONSCIENCIA=104`, `VAR_PONTOS_GLORIA=105`, `VAR_P_CENA=103`), remoção do guarda 3, referência a `build_phase5_ces.py`.
- **Referência de origem adicionada**: aprendizados F1-F4.
- **Subtarefas reescritas (18 itens)**: pré-passos, IDs canônicos (106/107/104/105/103/102/103/101), CEs referenciados corretamente (`EV_ResolucaoRiskOK` = CE 15, `EV_UpdateHud` = CE 6), passo de MZ reload (5.2.17), playtest com feedback perceptível (5.2.18).
- **Pseudo-código**: removido 3º guarda; corrigidos inline scripts:
  - `$gameVariables.setValue(107, Math.min(100, Math.max(0, $gameVariables.value(105) + $gameVariables.value(104))))` → `setValue(106, Math.min(100, Math.max(0, value(104) + value(103))))`
  - `$gameVariables.setValue(108, Math.floor(Math.random() * 100))` → `setValue(107, ...)`
  - `$gameVariables.setValue(106, $gameVariables.value(106) + $gameVariables.value(104) * 2)` → `setValue(105, value(105) + value(103) * 2)`
- **Teste dirigido**: corrigidos IDs nos scripts de forçar sucesso/falha (108→107, 105→104, 104→103).
- **visual_validation**: corrigidos IDs (108→107, 104→103).

### `task-5.3.md` (ResolucaoSafe + ResolucaoRiskOK)

- **Banner `ATUALIZAÇÃO (2026-06-18)`** no topo com alocação canônica de CEs (**CE 14** `EV_ResolucaoSafe`, **CE 15** `EV_ResolucaoRiskOK` — últimos slots livres após F3/F4), `SW_INPUT_LOCKED = 101` (corrigido de 102), referência a `build_phase5_ces.py`.
- **Referência de origem adicionada**: aprendizados F1-F4 (`build_phaseN_ces.py`, MZ reload pós-JSON) e F3 (auditar inline scripts).
- **Subtarefas reescritas (20 itens)**: pré-passos, alocação dos CEs 14 e 15 via gerador, IDs canônicos, passo de MZ reload (5.3.19), playtest com feedback perceptível (5.3.20).
- **visual_validation**: "Switch 102 = OFF" → "Switch 101 = OFF"; corrigido `setValue(108, 0)` → `setValue(107, 0)`.

### `task-5.4.md` (HUD Glória)

- **Banner `ATUALIZAÇÃO (2026-06-18)`** no topo com IDs corrigidos (`VAR_PONTOS_GLORIA = 105` era 106; `VAR_CONSCIENCIA = 104` era 105; `VAR_ROLL_RESULT = 107` era 108), nota sobre Plugin Commands do TextPicture continuarem via MZ Editor (code 357 opaco), referência a `build_phase5_ces.py` para o esqueleto + edição manual MZ Editor para os Plugin Commands.
- **Referência de origem adicionada**: aprendizados F1-F4 (Plugin Command 357 opaco; gerador gera esqueleto, MZ Editor preenche TextPicture) e F3.
- **Subtarefas reescritas (12 itens)**: pré-passos, IDs canônicos, separação clara entre o que o gerador faz vs. o que é manual no MZ Editor, passo de MZ reload (5.4.11), playtest com feedback perceptível (5.4.12).
- **Pseudo-código**: corrigido `$gameVariables.value(105)` → `$gameVariables.value(104)` no `picture(21).move(...)` da barra de Consciência; corrigido template `"GLÓRIA: \\V[106]"` → `"GLÓRIA: \\V[105]"`.
- **Tabela de erros comuns**: corrigido `\V[106]` → `\V[105]` e `\\V[106]` → `\\V[105]`.
- **visual_validation**: corrigido `setValue(108, 0)` → `setValue(107, 0)`.

### `task-5.5.md` (Hover)

- **Banner `ATUALIZAÇÃO (2026-06-18)`** no topo com IDs corrigidos (`VAR_TAXA_SUCESSO = 106` era 107), nota de que F4 confirmou que `ButtonPicture.js` **não tem hover nativo** (Opção A descartada), CE alocado no slot **16 (`EV_HoverRiskButton`)**, `VAR_HOVER_LEVEL = 115` (a criar via gerador).
- **Referência de origem adicionada**: aprendizados F1-F4 (ButtonPicture sem hover nativo; gerador; MZ reload) e F3.
- **Subtarefas reescritas (13 itens)**: pré-passos (snapshot `System.json`, extensão do gerador para criar CE 16 e a variável 115), uso obrigatório da Opção B (Script inline com `TouchInput`), passo de MZ reload (5.5.12), playtest com feedback perceptível em 3 níveis forçados via Script (5.5.13).
- **Abordagem de detecção de hover**: adicionado callout de warning no topo marcando Opção A como descartada em F4; `ButtonPicture` bloco reescrito como "DESCARTADA em F4".
- **Pseudo-código (Opção B)**: corrigido `$gameVariables.value(107)` → `$gameVariables.value(106)` (taxa); mantido `setValue(115, nivel)` (já estava correto).
- **Nota sobre ID 115**: atualizada para refletir snapshot pós-F4 (114 livre, 115+ extensões).
- **visual_validation**: corrigidos IDs de teste (`setValue(107, 80)` → `setValue(106, 80)`, etc.).

## Auditoria final (heurística F3)

Para validar que nenhuma referência obsoleta restou nos arquivos atualizados:

```bash
# Procure por IDs do mapa antigo (105 quando deveria ser 104 para CONSCIENCIA, etc.)
rg "value\(10[5-9]\)|setValue\(10[5-9]\)|setValue\(108\)|Switch 102" \
  Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/task-5.*.md
# Resultado esperado: apenas ocorrências em banners ATUALIZAÇÃO e linhas de teste válidas com IDs 106/107

# Durante implementação, auditar CommonEvents.json depois de rodar build_phase5_ces.py:
rg "value\(|setValue\(" Jhonny/data/CommonEvents.json
```

## Próximos passos da Fase 5

1. Criar `Jhonny/planos/001-prototipo-core-loop/fase5/build_phase5_ces.py` (espelhar estrutura do `fase4/build_phase4_ces.py`).
2. Rodar o gerador após cada task 5.x, auditando `CommonEvents.json`.
3. Após cada rodada do gerador: **MZ Editor → F10 → Ctrl+S → reabrir Playtest** (padrão F4).
4. Para tasks com Plugin Commands (5.4 TextPicture, etc.): gerador cria esqueleto, MZ Editor preenche manualmente.
5. Playtest com feedback perceptível após cada task — banners visuais/sobreposição audível são mandatórios (regra `user-testable-feedback`).

## Veja também

- [[fase4/retrospectiva]] — guardas, gerador `build_phaseN_ces.py`, MZ reload pós-JSON.
- [[fase-4-completa]] — bug do guarda 3, IDs canônicos, alocação final de CEs 10-13.
- [[fase3/retrospectiva]] — auditar inline scripts com `rg "value\(|setValue\("`.
- [[core_loop_corrida/tasks]] — plano central atualizado com snapshot F5.
