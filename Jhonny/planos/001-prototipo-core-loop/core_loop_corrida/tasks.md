---
title: "Plano de Ação — Core Loop da Corrida"
description: "Plano de execução em 7 fases para o protótipo jogável do minigame de Corrida em RPG Maker MZ (projeto Jhonny)."
tags: [plano-acao, core-loop, corrida, rpg-maker-mz, prototipo]
type: plano-acao
version: "1.0"
data_criacao: "2026-06-17"
executor: "agente IA"
validacao: "RPG Maker MZ (playtest ao fim de cada fase)"
guia_referencia: "[[Guia de Implementação - Core Loop da Corrida]]"
spec_referencia: "[[Corrida - Core Loop]]"
---

# Plano de Ação — Core Loop da Corrida

> Gerado a partir de [[Guia de Implementação - Core Loop da Corrida]] (Guia Técnico, 1191 linhas) e [[Corrida - Core Loop]] (Spec de Domínio, 614 linhas).
> **Executor:** agente IA. **Validação:** RPG Maker MZ (playtest visual ao fim de cada fase).
> **Convenções:** artefatos em pt-BR; identificadores/código em inglês (seguindo `.claude/rules/basci-rules.json`).

## Overview

Plano de execução para o protótipo jogável do minigame de Corrida (QTE timer-based binário com recurso de Consciência e Pontos de Glória). O minigame é decomposto em 5 subsistemas fracamente acoplados (Orchestrator, Timer, Renderer, Input, Restart) coordenados por variáveis/switches globais do RPG Maker MZ. Implementação 100% nativa (sem plugins de lógica de jogo) — apenas um plugin utilitário mínimo `Jhonny_RaceHelper.js` (fornecido completo no Apêndice A do Guia Técnico).

**Decisões técnicas críticas (load-bearing):**
- Timer em **frames** (240/210), não em segundos (drift de 16% com `Wait 0.1s`)
- **Contrato de escrita única** por variável (evita race conditions no loop cooperativo)
- `Math.random()` para v1; PRNG `mulberry32` reservado para v2
- `SW_INPUT_LOCKED` obrigatório nos handlers (anti-re-entrada)
- **Sorteio lazy** por cena (não pré-compõe array — MZ não tem array nativo em eventos)
- Botões com IDs 41-50 (z-order acima de overlays e HUD)
- Restart corta **fadeout/fadein** (não hover da barra) para ficar <1s sem perder comunicação de custo

## Fases

### Fase 1 — Setup MZ + Plugin Helper
**Objetivo:** infraestrutura mínima no MZ Editor + plugin utilitário ativo.
**Dependências:** nenhuma (paralela a F2).
**Validação visual:** ao abrir o projeto no RMMZ e rodar o jogo (Playtest), o console (F12) mostra `[Jhonny_RaceHelper] JhonnyRace helper inicializado.` e F9 (debug) → abas Variables/Switches mostram os IDs 100-113 / 100-105 com nomes descritos no Guia Técnico §3.1.

> **STATUS: COMPLETA E VALIDADA** (2026-06-17)
> - [x] task-1.1 — Registrar variáveis (Editor IDs 100-113) e switches (Editor IDs 100-105) no Database · ~2h · deps: nenhuma
> - [x] task-1.2 — Criar plugin `Jhonny_RaceHelper.js` (Apêndice A do Guia Técnico) · ~1h · deps: 1.1
> - [x] task-1.3 — Ativar plugins ButtonPicture + TextPicture + Jhonny_RaceHelper em `plugins.js` · ~1h · deps: 1.2
>
> **Correção de convenção (aprendizado F3):** a documentação pré-F3 referia-se a "IDs 101-114 / 101-106", mas o RMMZ acessa `_data[id]` diretamente sem offset (ver `rmmz_objects.js:691, 723`). Os Editor IDs reais são **100-113 (variáveis) e 100-105 (switches)**. A documentação original confundiu índice 0-based do array com Editor ID; na verdade ambos coincidem neste projeto porque `variables[0]`/`switches[0]` são placeholders não-usados.

### Fase 2 — Pipeline de Assets
**Objetivo:** todas as pictures e sound effects criados e pré-carregáveis.
**Dependências:** nenhuma (paralela a F1).
**Validação visual:** ao chamar o evento de teste `EV_Preload`, todas as pictures da corrida aparecem na tela por 1 frame sem hitch de carregamento (sem "loading stutter" entre frames).

> **STATUS: COMPLETA E VALIDADA** (2026-06-18)
> **Formato obrigatório:** Pictures em PNG (canal alpha para botões/overlays), áudio em OGG Vorbis (não MP3).
> **Nota:** `EV_Preload` foi criado diretamente em `CommonEvents.json` (ID 3) e validado em Playtest no RPG Maker MZ.

- [x] task-2.1 — Criar pictures (backgrounds + botões + HUD + overlays + placa Curva do Diabo + assets referenciados na F3) · ~3h · deps: nenhuma
- [x] task-2.2 — Criar 3 Sound Effects (crash_metal, freada, pneu_cantando) · ~1h · deps: nenhuma
- [x] task-2.3 — Criar `EV_Preload` (Common Event com Show+Erase sequencial) · ~2h · deps: 2.1

### Fase 3 — Orchestrator + Renderização Estática
**Objetivo:** ao iniciar a corrida, fundo da cena + HUD de Consciência aparecem com fade.
**Dependências:** F1 (variáveis/switches) + F2 (pictures) — **ambas completas**.
**Validação visual:** ao iniciar a corrida via evento autorun em Map001, a tela escurece e volta (fadein 18 frames) revelando o fundo da cena de Sinal e a barra de Consciência vazia (sépia escuro) no topo da tela.

> **STATUS: IMPLEMENTADA — AGUARDANDO PLAYTEST MZ** (2026-06-18)
> Implementação JSON de todas as 5 tasks concluída e validada sintaticamente (`python -m json.tool` OK em System.json, CommonEvents.json, Map001.json).
> **Validação visual pendente** — usuário precisa abrir o projeto no RPG Maker MZ e rodar Playtest (ver [[Jhonny/planos/001-prototipo-core-loop/core_loop_corrida/fase-3-completa]] para o checklist detalhado).
> **Correções vs spec original:** task specs 3.1/3.2 tinham formatos errados para o If MZ (exemplos usavam `[1, sw, 0]` para switch quando o canônico é `[0, sw, 1]`). Implementação segue o código-fonte MZ em `js/rmmz_objects.js`.
>
> **APRENDIZADO F1+F2 — Automação via JSON controlada:** Common Events simples (comandos MZ conhecidos) **podem ser criados diretamente em `Jhonny/data/CommonEvents.json`** quando houver slot vazio confirmado (IDs 4+ livres) — playbook validado na task 2.3. Eventos com `Parallel trigger`, loops `Label/Jump`, ou `Script` inline exigem maior cuidado — ver coluna "JSON" abaixo. **Sempre** validar com `python -m json.tool` + Playtest MZ obrigatório.
>
> **Pré-condições já satisfeitas (não recriar):**
> - Variáveis Editor IDs 100-113 nomeadas em `System.json` (F1). `VAR_LAST_RENDERED_INDEX` (Editor ID 113) já nomeada (subtarefa 3.2.1 concluída).
> - Switches Editor IDs 100-105 nomeadas (F1).
> - 16 PNGs em `Jhonny/img/pictures/race/` (F2) — todos os nomes referenciados pela F3 já existem: `bg_sinal`, `bg_curva`, `opala_pov`, `sinal_red`, `placa_curva_dir`, `bar_consciencia_bg`, `bar_consciencia_fill`.
> - `EV_Preload` (CE ID 3) já criado (F2).
> - **Reaproveitar SEs padrão** (F2 heurística): para tocar efeitos em playtests pontuais da F3, usar `crash_metal.ogg`, `freada.ogg`, `pneu_cantando.ogg` — não gerar áudio novo.

| Task | JSON-automatizável? | Notas de implementação |
|------|---------------------|------------------------|
| 3.1 `EV_RaceOrchestrator` | **Sim** (códigos 122/121/111/411/412/355/117/223/222) | Script inline `Math.random()` é simples; If/Else para `VAR_RACE_N_CENAS` é direto. |
| 3.2 `EV_RaceRenderer` | **Parcial — alta complexidade** (Parallel trigger + loop Label/Jump) | `trigger: 2` (Parallel) + `condition: 1` + `switchId: 101`. Validar MZ Editor obrigatório após escrita JSON. |
| 3.3 `EV_RenderSinal` + `EV_RenderCurva` | **Sim** (código 231 Show Picture) | Animação de fade-in (opcional) usa `Move Picture` (232) — semelhante a `EV_Preload`. |
| 3.4 HUD Consciência | **Sim para setup inicial** (Show Picture 231) | `Move Picture` com `scaleX` por variável é mais fiável via `Script` (355) chamando `$gameScreen.picture(21).move(...)` — documentar na task. |
| 3.5 Map001 autorun | **Sim** (Map001 já existe; adicionar 1 evento no array `events`) | Trigger `autorun` = `"trigger": 3`. Editar `Map001.json` com Python+json. |

- [x] task-3.1 — Criar `EV_RaceOrchestrator` (INIT block + fadein) · ~2h · deps: 1.1, 2.3 · **JSON: Sim** · CE ID 6 (24 cmds)
- [x] task-3.2 — Criar `EV_RaceRenderer` (Parallel, switch `SW_RACE_ACTIVE`) · ~3h · deps: 3.1, 3.4 · **JSON: Parcial (validar MZ)** · CE ID 8 (36 cmds, trigger=2, switchId=100)
- [x] task-3.3 — Criar `EV_RenderSinal` + `EV_RenderCurva` · ~3h · deps: 3.2 · **JSON: Sim** · CE IDs 9/10
- [x] task-3.4 — Implementar HUD de Consciência (bar bg ID 20 + fill ID 21 com scaleX dinâmico) · ~2h · deps: 3.1 · **JSON: Sim (setup) + Script para animação** · CE ID 7 + Pictures 20/21 no Orchestrator
- [x] task-3.5 — Criar mapa "garagem" (Map001) com event autorun chamando `EV_RaceOrchestrator` · ~1h · deps: 3.1, 3.4 · **JSON: Sim** · Event "Init Corrida" x=8 y=6 trigger=3

### Fase 4 — Input + Timer
**Objetivo:** botões aparecem, são clicáveis via ButtonPicture, e disparam handlers; timer corre; **clique produz feedback perceptível sem ferramentas de debug** (task 4.5).
**Dependências:** F3 (orchestrator e renderer ativos).
**Validação visual:** ao iniciar a corrida, botões Parar/Furar (ou Direita/Esquerda) surgem na parte inferior da tela; ao clicar qualquer botão, **um som distinto toca imediatamente** (`freada` para Safe, `pneu_cantando` para Risk) — sem precisar de F12/F9; a barra de timer horizontal diminui progressivamente e para de decrementar após o primeiro clique (lock ativo).

> **STATUS: FASE 4 COMPLETA E VALIDADA** (2026-06-18) — todas as tasks 4.1-4.5 implementadas e validadas em playtest MZ. Clique + teclado + timeout todos produzem feedback audível conforme a regra [[user-testable-feedback]]. Bug do guarda 3 corrigido. Próxima fase: F5 (lógica Safe/Risk completa). Ver [[fase-4-completa]] para detalhes e [[fase4/retrospectiva]] para aprendizados.
>
> **DIRETRIZ DE GERAÇÃO (obrigatória):** todas as tasks JSON-automatizáveis da F4 (4.1, 4.3, 4.4 — **não** a 4.2) devem ser implementadas por um **único script gerador** `build_phase4_ces.py` localizado em **`Jhonny/planos/001-prototipo-core-loop/fase4/build_phase4_ces.py`** (espelha a organização da F3, cujo `build_phase3_ces.py` já vive em `fase3/`). O script é **artefato-fonte**: o modelo deve criá-lo/regenerá-lo antes de tocar em `CommonEvents.json`, e qualquer correção posterior de IDs/comandos deve ser feita no script e regenerada — nunca no JSON gerado diretamente (heurística consolidada em [[tasks]] §Aprendizados).
>
> **APRENDIZADO F3 — Convenção de IDs:** O código RMMZ (`rmmz_objects.js:691, 723`) acessa `_data[switchId]` e `_data[variableId]` **diretamente** (sem offset `-1`). Portanto o índice do array em `System.json` é igual ao Editor ID. Os nomes de variáveis/switches vivem em **Editor IDs `100-113`** (variáveis) e **`100-105`** (switches), não `101-114`/`101-106` como a documentação pré-F3 afirmava. Toda referência `$gameVariables.value(N)` ou `$gameSwitches.value(N)` em scripts inline deve usar **N = Editor ID**, e todo comando MZ 111/121/122 usa o mesmo Editor ID nos parâmetros.
>
> **Pré-passos obrigatórios da Fase 4 (uma única vez):**
> 1. **Criar `VAR_TIMER_TIMEOUT_FLAG` (Editor ID 116)** em `System.json` via Python+json — usada por `EV_RaceTimer` (task 4.1) para distinguir timeout de clique manual; lida por `EV_OnSafe` (task 5.1) e resetada para 0 ao final do handler.
> 2. **Confirmar snapshot real do `System.json`** antes de escrever qualquer comando MZ: imprimir `variables[95:117]` e `switches[95:107]`; usar essa tabela como fonte de verdade.
> 3. **Criar o script gerador** `Jhonny/planos/001-prototipo-core-loop/fase4/build_phase4_ces.py` antes da primeira task JSON-automatizável (task 4.1). Esse script será estendido incrementalmente em 4.1, 4.3, 4.4 e 4.5 e **deve** ser a única forma de escrita de CEs 10/11/12/13 em `CommonEvents.json` (a task 4.2 é MZ Editor — Plugin Command — e não passa pelo script).
>
> **Alocação de CE IDs (CommonEvents.json) — como implementado em F4:**
> | CE Editor ID | Nome | Trigger | Switch | Origem |
> |-------------|------|---------|--------|--------|
> | 1 | (null) | — | — | placeholder |
> | 2 | `acelerador` | Call | — | legado |
> | 3 | `freio` | Call | — | legado |
> | 4 | `EV_Preload` | Call | — | F2 |
> | 5 | `EV_RaceOrchestrator` | Call | — | F3 |
> | 6 | `EV_UpdateHud` | Call | — | F3 |
> | 7 | `EV_RaceRenderer` | Parallel | `SW_RACE_ACTIVE` (100) | F3 |
> | 8 | `EV_RenderSinal` | Call | — | F3 |
> | 9 | `EV_RenderCurva` | Call | — | F3 |
> | **10** | **`EV_RaceTimer`** | **Parallel** | **`SW_RACE_ACTIVE` (100)** | **F4 (task 4.1)** |
> | **11** | **`EV_OnSafe`** | **Call** | — | **F4 (task 4.3)** |
> | **12** | **`EV_OnRisk`** | **Call** | — | **F4 (task 4.3)** |
> | **13** | **`EV_KeyInput`** | **Parallel** | **`SW_RACE_ACTIVE` (100)** | **F4 (task 4.4)** |
>
> **Correção off-by-one (F4 retrospectiva):** documentação pré-F4 (incluindo versão anterior deste tasks.md) afirmava F3=6-10, F4=11-14 — **errado**. `rmmz_objects.js:6888` confirma `$dataCommonEvents[id]` acesso direto; `build_phase3_ces.py` escreveu em 5-9; portanto F4 escreveu em 10-13. Ver [[fase-4-completa#Correção crítica vs documentação pré-F4]].
>
> **Heurística de auditoria (F3+F4):** Antes de fechar cada task, rodar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` e confirmar que todos os IDs em scripts inline batem com a tabela real de `System.json`. O seletor visual do MZ Editor não audita scripts inline.

| Task | JSON-automatizável? | Notas de implementação |
|------|---------------------|------------------------|
| 4.1 `EV_RaceTimer` | **Sim — via `fase4/build_phase4_ces.py`** (Label/Jump + 111/121/117/355/230) | **Criar o script gerador nesta task** (`Jhonny/planos/001-prototipo-core-loop/fase4/build_phase4_ces.py`). Parallel CE com 3 guardas. Idempotente via script. Auditoria `value/setValue` obrigatória. |
| 4.2 Botões via `ButtonPicture` | **Bypass via Script inline** (code 355) — ver [[fase-4-completa#Decisões técnicas da implementação]] | `mzkp_commonEventId` setado via Script no CE 8/9 (RenderSinal/Curva). Não usa Plugin Command opaco. CE 7 (Renderer) apaga faixa 41-44 na troca de cena. **Hover nativo não existe** — postergado para F5 task 5.5. |
| 4.3 `EV_OnSafe` + `EV_OnRisk` | **Sim — via `fase4/build_phase4_ces.py`** (111/121/0/355) | **Estender o script gerador** com CEs 11/12. **2 guardas** (SW_RACE_ACTIVE=100, SW_INPUT_LOCKED=101) — guarda 3 removido no bug fix pós-F4.5. Placeholder para tasks 5.1/5.2. |
| 4.4 `EV_KeyInput` (teclado) | **Sim — via `fase4/build_phase4_ces.py`** (Label/Jump + 111/355/230) | **Estender o script gerador** com CE 13. Parallel com `Input.isTriggered` via Script inline; ramifica por `VAR_SCENE_TYPE` (ID **102**, não 103). |

- task-4.1 — Criar `EV_RaceTimer` (Parallel, tick por frame, 3 guardas) · ~2h · deps: 3.2 · **JSON: Sim** · CE ID 10, switchId=100
- task-4.2 — Implementar botões clicáveis via Script inline (`mzkp_commonEventId`) — Pictures 41-44 · ~3h · deps: 3.3 · **JSON: Sim** · altera CEs 7/8/9
- task-4.3 — Criar `EV_OnSafe` + `EV_OnRisk` (handlers com 2 guardas de re-entrada) · ~3h · deps: 4.1, 4.2 · **JSON: Sim** · CE IDs 11/12
- task-4.4 — Criar `EV_KeyInput` e validar W/S/A/D via `Input.keyMapper` extendido · ~2h · deps: 1.2, 4.3 · **JSON: Sim** · CE ID 13
- task-4.5 — Adicionar feedback sonoro nos handlers `EV_OnSafe`/`EV_OnRisk` (`Play SE: freada`/`pneu_cantando`) · ~30min · deps: 4.3 · **JSON: Sim** · altera CEs 11/12 via `build_phase4_ces.py`

### Fase 5 — Lógica de Estado e Resolução
**Objetivo:** ao clicar Safe, Consciência sobe e cena avança; ao clicar Risk, rola o d100, aplica custo, e Glória atualiza.
**Dependências:** F4 (handlers esqueleto prontos — CEs 10/11/12/13).
**Validação visual:** barra de Consciência sobe 10 pontos visivelmente no Safe; desce `P_cena` no Risk (ambos resultados); texto de Pontos de Glória no canto atualiza (+10 no Safe, +`P_cena×2` no Risk-sucesso); hover no botão Risk pisca vermelho-sangue em 3 níveis discretos. **Toda validação deve produzir feedback perceptível sem F12/F9** (regra [[user-testable-feedback]]): flash visível + som já existente da F4.

> **STATUS: FASE 5 IMPLEMENTADA — AGUARDANDO PLAYTEST MZ** (2026-06-18) — tasks 5.1/5.2/5.3/5.5/5.6 implementadas via `fase5/build_phase5_ces.py` (+ patch cirúrgico `apply_task_5_6.py` para preservar logs `[F5DBG]` e Plugin Command manual do CE 6); task 5.4 com Plugin Command TextPicture + Show Picture inseridos manualmente no CE 6 pelo usuário (ver [[fase-5-completa]] para revisão pendente da posição/pictureId). Pré-passo `fase5/setup_phase5_system.py` criou `VAR_HOVER_LEVEL` (Editor ID 115). Validação JSON + auditoria inline completa. **Bug crítico corrigido (sessão anterior):** docstring do gerador invertia `ControlSwitch` (`0=OFF|1=ON`); realidade MZ é `0=ON|1=OFF` (`rmmz_objects.js:10172`). 5 operações de switch corrigidas. **Bug crítico corrigido (esta sessão — task 5.6):** CE 12 FAIL branch não destravava input; criado CE 17 `EV_ResolucaoRiskFail` (Buzzer1 + Shake 8f + unlock) e wired no FAIL branch. Invariante de simetria de lock satisfeita (4 ON ↔ 4 OFF). Falta: revisão manual MZ do CE 6 (pictureId/posição), pós-edição MZ obrigatória (F10 → Ctrl+S → reiniciar Playtest), playtest de aceitação com feedback perceptível.
>
> **STATUS ANTIGO: ATUALIZADA COM APRENDIZADOS F1-F4** (2026-06-18) — tasks .md corrigidas para refletir mapa canônico de IDs (variáveis 100-116) e alocação real de CEs (F3=5-9, F4=10-13, F5=14-16). Pronta para implementação pelo agente IA. Ver [[fase5/Atualizacao-aplicada]] para o diff das mudanças.
>
> **DIRETRIZ DE GERAÇÃO (obrigatória, espelha F4):** todas as tasks JSON-automatizáveis da F5 (5.1, 5.2, 5.3) devem ser implementadas por um **único script gerador** `build_phase5_ces.py` localizado em **`Jhonny/planos/001-prototipo-core-loop/fase5/build_phase5_ces.py`**. O script é **artefato-fonte**: criá-lo/regenerá-lo antes de tocar em `CommonEvents.json`; qualquer correção posterior de IDs/comandos deve ser feita no script e regenerada — nunca no JSON gerado diretamente (heurística F3+F4 consolidada).
>
> **APRENDIZADO F4 — Guardas dos handlers:** `EV_OnSafe` (CE 11) e `EV_OnRisk` (CE 12) usam **apenas 2 guardas** (`SW_RACE_ACTIVE` OFF? + `SW_INPUT_LOCKED` ON?), não 3. O "guarda 3" (`VAR_TIMER_FRAMES <= 0`) foi removido em F4 ([[fase-4-completa#Bug do guarda 3]]) porque bloqueava o path de timeout → auto-Safe. Tasks 5.1/5.2 não devem reintroduzi-lo.
>
> **APRENDIZADO F4 — Pós-edição MZ obrigatória:** após rodar `build_phase5_ces.py`, é obrigatório reabrir MZ Editor → Database (F10) → Ctrl+S antes do Playtest. Sem isso, `$dataCommonEvents` em runtime pode não refletir o JSON em disco, causando reservas de CE ignoradas (bug real diagnosticado em F4 apêndice A).
>
> **APRENDIZADO F4 — Hover nativo não existe:** `ButtonPicture.js` NÃO fornece feedback visual de hover nativo (`rmmz_sprites.js:80-90` são vazios). Task 5.5 **obrigatoriamente** usa CE paralelo com `TouchInput.x/y` via Script inline — não tentar Plugin Command `onHover` (não existe).
>
> **Pré-passos obrigatórios da Fase 5 (uma única vez):**
> 1. **Snapshot do `System.json`** antes de qualquer edição: imprimir `variables[100:117]` e `switches[100:106]` (fonte de verdade canônica, não confiar em documentação).
> 2. **Confirmar CEs F4 ativos** no `CommonEvents.json`: CEs 10 (`EV_RaceTimer`), 11 (`EV_OnSafe`), 12 (`EV_OnRisk`), 13 (`EV_KeyInput`) — todos com `name` e `trigger` corretos.
> 3. **Criar o script gerador** `Jhonny/planos/001-prototipo-core-loop/fase5/build_phase5_ces.py` antes da primeira task JSON-automatizável (task 5.1). Usar `fase4/build_phase4_ces.py` como referência de estrutura (helpers `C(code, indent, params)`, constantes de IDs, modo idempotente preservando slots 0-13).
>
> **Alocação de CE IDs (CommonEvents.json) — corrigida com base na implementação real F4:**
> | CE Editor ID | Nome | Trigger | Switch | Origem |
> |-------------|------|---------|--------|--------|
> | 1-4 | (placeholders/legados/EV_Preload) | — | — | F1/F2 |
> | 5 | `EV_RaceOrchestrator` | Call | — | F3 |
> | 6 | `EV_UpdateHud` | Call | — | F3 |
> | 7 | `EV_RaceRenderer` | Parallel | `SW_RACE_ACTIVE` (100) | F3 |
> | 8 | `EV_RenderSinal` | Call | — | F3 |
> | 9 | `EV_RenderCurva` | Call | — | F3 |
> | 10 | `EV_RaceTimer` | Parallel | `SW_RACE_ACTIVE` (100) | F4 |
> | 11 | `EV_OnSafe` | Call | — | F4 (estendido em **5.1**) |
> | 12 | `EV_OnRisk` | Call | — | F4 (estendido em **5.2**) |
> | 13 | `EV_KeyInput` | Parallel | `SW_RACE_ACTIVE` (100) | F4 |
> | **14** | **`EV_ResolucaoSafe`** | **Call** | — | **F5 (task 5.3)** |
> | **15** | **`EV_ResolucaoRiskOK`** | **Call** | — | **F5 (task 5.3)** |
> | **16** | **`EV_HoverRiskButton`** | **Parallel** | **`SW_RACE_ACTIVE` (100)** | **F5 (task 5.5)** |
> | **17** | **`EV_ResolucaoRiskFail`** | **Call** | — | **F5 (task 5.6 — bugfix pós-playtest)** |
>
> **Heurística de auditoria (F3+F4):** Antes de fechar cada task, rodar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` e confirmar que todos os IDs em scripts inline batem com a tabela real de `System.json`. IDs canônicos da F5: `VAR_CONSCIENCIA=104`, `VAR_PONTOS_GLORIA=105`, `VAR_TAXA_SUCESSO=106`, `VAR_ROLL_RESULT=107`, `VAR_TIMER_FRAMES=108`, `VAR_TIMER_TIMEOUT_FLAG=116`, `VAR_P_CENA=103`, `VAR_SCENE_INDEX=101`, `VAR_SCENE_TYPE=102`.

| Task | JSON-automatizável? | Notas de implementação |
|------|---------------------|------------------------|
| 5.1 Lógica Safe em `EV_OnSafe` | **Sim — via `fase5/build_phase5_ces.py`** (estende CE 11) | Substituir placeholder `TODO task 5.1`. Manter 2 guardas (NÃO reintroduzir guarda 3). `VAR_CONSCIENCIA=104` (clamp 0-100), `VAR_PONTOS_GLORIA=105` (+10), `VAR_SCENE_INDEX=101` (+=1). Ordem crítica: CONSCIENCIA antes de cena++. |
| 5.2 Lógica Risk em `EV_OnRisk` | **Sim — via `fase5/build_phase5_ces.py`** (estende CE 12) | Substituir placeholder `TODO task 5.2`. Manter 2 guardas. Inline scripts: `setValue(106, ...)` TAXA, `setValue(107, ...)` ROLL, `setValue(105, ...)` GLORIA. Custo `VAR_CONSCIENCIA -= VAR_P_CENA` (104 -= 103) em AMBOS os ramos antes de cena++. |
| 5.3 `EV_ResolucaoSafe` + `EV_ResolucaoRiskOK` | **Sim — via `fase5/build_phase5_ces.py`** (CEs 14/15 novos) | Flash verde (Safe) + flash dourado + shake (Risk-sucesso). Duração ≤24 frames. Desligam `SW_INPUT_LOCKED` (101) no fim. |
| 5.4 HUD Glória via `TextPicture` | **MZ Editor** (Plugin Command) | Picture ID 51, posição (560, 20). Plugin Command `TextPicture > Set Text` com `"GLÓRIA: \\V[105]"` (escape duplo). Estende `EV_UpdateHud` (CE 6). |
| 5.5 Hover 3 níveis discretos | **Sim para CE 16 + Script inline** (Plugin Command NÃO existe) | CE 16 Parallel `EV_HoverRiskButton` com `TouchInput.x/y` via Script. `VAR_HOVER_LEVEL=115` (reserva nova). Pictures 22-24 (abaixo dos botões 41-50). Thresholds: taxa≥70 suave, 40-69 médio, <40 intenso. |

- [x] task-5.1 — Implementar lógica Safe no `EV_OnSafe` (Consciência +10 clamp, Glória +10, cena++) · ~2h · deps: 4.3 · **JSON: Sim** · estende CE 11 via `build_phase5_ces.py` (22 cmds)
- [x] task-5.2 — Implementar lógica Risk no `EV_OnRisk` (clamp, roll d100, custo aplicado, Glória ×2) · ~3h · deps: 4.3, 5.1 · **JSON: Sim** · estende CE 12 via `build_phase5_ces.py` (34 cmds)
- [x] task-5.3 — Criar `EV_ResolucaoSafe` (CE 14) + `EV_ResolucaoRiskOK` (CE 15) · ~3h · deps: 5.1, 5.2 · **JSON: Sim** · novos CEs via `build_phase5_ces.py` (CE 14=5 cmds, CE 15=6 cmds)
- [ ] task-5.4 — Implementar HUD de Pontos de Glória via `TextPicture` (Picture 51) · ~2h · deps: 5.1 · **MZ Editor** · estende CE 6 (placeholder Comment no gerador; **passo manual pendente** — ver [[fase-5-completa]])
- [x] task-5.5 — Implementar hover vermelho-sangue 3 níveis discretos via CE 16 + overlays (ID 22-24) · ~3h · deps: 3.4, 4.2 · **JSON: Sim** (CE 16 novo, 33 cmds) + Script inline
- [x] task-5.6 — **Bug fix pós-playtest F5:** criar `EV_ResolucaoRiskFail` (CE 17) + wire FAIL branch do CE 12 para destravar input (Bug 3 da [[fase5/retrospectiva]] PARTE 3) · ~1h · deps: 5.2, 5.3 · **JSON: Sim** via `build_phase5_ces.py` (estendido) + patch cirúrgico `fase5/apply_task_5_6.py` (preserva logs `[F5DBG]` e Plugin Command manual do CE 6). CE 17 = 4 cmds (Buzzer1 + Shake 8f + unlock); CE 12 FAIL = `Call CE 17` inserido antes do Comment `TASK 6.1 PENDENTE`. Invariante de simetria de lock satisfeita: 4 produtores ON (CE 5/7/11/12) ↔ 4 consumidores OFF (CE 7/14/15/17).

### Fase 6 — Crash, Restart, Variação de Corridas e Vitória
**Objetivo:** falha no Risk → crash visual → restart <1s; suporte a 3 corridas com comprimentos diferentes (6/8/10 cenas); tela de vitória com critério de pontuação mínima para avançar.
**Dependências:** F5 (lógica completa — CEs 11/12/14/15/16/17 já implementados).
**Validação visual:** ao clicar Risk com falha no roll, tela shake + flash branco + fade para preto + reset de variáveis + fadein direto na cena 1 — total <1s cronometrado; ao terminar todas as cenas sem crash com pontuação suficiente, tela cerimonial de vitória com fanfarra e texto "VITÓRIA!" + instrução para continuar; abaixo do threshold → mesma tela de vitória porém informando derrota (restart).

> **STATUS: FASE 6 COMPLETA E VALIDADA** (2026-06-19) — tasks 6.1, 6.3, 6.4 implementadas via `fase6/build_phase6_ces.py` (+ `fase6/setup_phase6_system.py` para criar VAR_VITORIA_PASSOU Editor ID 117) e **validadas em Playtest MZ pelo usuário**. CE 17 (EV_ResolucaoRiskFail) **limpo** para objeto vazio canônico (absorvido por CE 18 EV_Crash) — **NUNCA deletado** ([[never-delete-common-events]]). CE 12 FAIL branch agora chama CE 18 diretamente. CE 5 (Orchestrator) reescrito com Opção B (Script inline para cálculo de N_CENAS). CE 7 (Renderer) recebeu check de vitória antes do bloco de render. Asset `race/overlay_flash_white.png` criado (Pillow RGBA 816×624). CE 19 (`EV_VitoriaCorrida`) com 46 cmds incluindo 4 Plugin Commands TextPicture + If/Else Show Picture (53 VITÓRIA / 56 DERROTA) — padrão replicado de CE 6 (`EV_UpdateHud`), sem Comments placeholder `[MANUAL MZ F6.4]`. Validação JSON OK (`python3 -m json.tool`). Auditoria inline OK (todos IDs 100-117). Simetria de lock preservada (4 ON ↔ 4 OFF). Próxima fase: F7 (Polish + Observabilidade).
>
> **STATUS ANTIGO: ATUALIZADA COM APRENDIZADOS F1-F5** (2026-06-18) — tasks .md reescritas com base nas retrospectivas das fases anteriores e nas decisões confirmadas pelo usuário. Pronta para implementação pelo agente IA implementador. Ver [[fase6/Atualizacao-aplicada]] para o diff das mudanças.
>
> **DECISÕES CONFIRMADAS PELO USUÁRIO (2026-06-18; atualizada 2026-06-19):**
> 1. **EV_Crash absorve CE 17:** o CE 17 (`EV_ResolucaoRiskFail`, criado na F5) será **limpo** para um objeto vazio canônico (`name=""`, `list=[{code:0,indent:0,parameters:[]}]`, `switchId=1`, `trigger=0`) em favor do novo `EV_Crash` (CE Editor ID 18) que absorve todas as responsabilidades — feedback visual (Buzzer1 + Shake + Flash + Tint) + reset completo + re-render. Wire final: CE 12 FAIL branch → `Call CE 18` (substitui o `Call CE 17` atual). **Regra [[never-delete-common-events]]:** CEs nunca são deletados (`null`/removidos do array) — sempre limpos, preservando o `id` para compatibilidade com save files e referências indiretas. Reduz um CE ativo e elimina a separação artificial entre "feedback" e "restart".
> 2. **EV_Crash incrementa `VAR_ATTEMPT_N`:** confirmado pelo usuário. Cada Risk-falha conta como nova tentativa. Adicionar `Control Variables: VAR_ATTEMPT_N += 1` (Editor ID 112) dentro do bloco de reset do EV_Crash. Não há conflito com o INIT Orchestrator (que só incrementa no início de cada corrida nova).
> 3. **Curva do Diabo cena especial = fora de escopo desta implementação:** a cena 9 da Corrida 3 (definida na spec original §6.4 com `P_CENA=100` fixo) **NÃO** será implementada na F6. A Corrida 3 terá 10 cenas normais (sorteio 60/40 Sinal/Curva como as outras). A cena especial da Curva do Diabo (que bloqueará o caminho Safe e forçará Risk) fica reservada para uma fase futura ou v2. Task-6.2 mantida como placeholder.
> 4. **Critério de avanço = pontuação mínima requerida:** spec §1 diz "Condição de vitória: Ter a MAIOR pontuação total ao final da corrida". Como o core loop é single-player sem NPCs visíveis implementados, simulamos a "competição" via threshold numérico por corrida (calibrável em playtest; defaults propostos em [[task-6.4]]).
>
> **DIRETRIZ DE GERAÇÃO (obrigatória, espelha F4/F5):** todas as tasks JSON-automatizáveis da F6 (6.1, 6.3, 6.4) devem ser implementadas por um **único script gerador** `build_phase6_ces.py` localizado em **`Jhonny/planos/001-prototipo-core-loop/fase6/build_phase6_ces.py`** (espelha a organização das F3/F4/F5). O script é **artefato-fonte**: criá-lo/regenerá-lo antes de tocar em `CommonEvents.json`; qualquer correção posterior de IDs/comandos deve ser feita no script e regenerada — nunca no JSON gerado diretamente (heurística F3+F4+F5 consolidada em [[tasks]] §Aprendizados).
>
> **APRENDIZADO F5 — Semântica do ControlSwitch (code 121):** (`js/rmmz_objects.js:10172-10176`) `params[2] === 0` → switch **ON**; `params[2] === 1` → switch **OFF**. **Oposto do que parece.** Toda operação `121 [swid, swid, A]` na F6 precisa ser auditada contra essa regra (bug real F5 corrigido em 5 operações).
>
> **APRENDIZADO F5 — Invariante de simetria de lock:** 4 produtores de `SW_INPUT_LOCKED=ON` (CE 5 Orchestrator INIT, CE 7 Renderer, CE 11 OnSafe, CE 12 OnRisk) ↔ 4 consumidores de `SW_INPUT_LOCKED=OFF` (CE 7 Renderer erase, CE 14 ResolucaoSafe, CE 15 ResolucaoRiskOK, ~~CE 17 ResolucaoRiskFail~~ → **agora CE 18 EV_Crash**). Task-6.1 deve **substituir** a referência ao CE 17 por CE 18 no papel de "consumidor de lock para o ramo FAIL" — não adicionar CE 18 como 5º consumidor, sob risco de quebrar a simetria. O slot CE 17 permanece no array como CE limpo ([[never-delete-common-events]]), mas não conta como consumidor ativo.
>
> **APRENDIZADO F4/F5 — Pós-edição MZ obrigatória:** após rodar `build_phase6_ces.py`, é obrigatório reabrir MZ Editor → Database (F10) → Ctrl+S antes do Playtest. Sem isso, `$dataCommonEvents` em runtime pode não refletir o JSON em disco (bug real F4).
>
> **Pré-passos obrigatórios da Fase 6 (uma única vez):**
> 1. **Snapshot do `System.json`:** imprimir `variables[100:117]` e `switches[100:106]` (fonte de verdade canônica — IDs 100-116 variáveis, 100-105 switches).
> 2. **Confirmar CEs F5 ativos** no `CommonEvents.json`: CEs 10-17 (CE 17 será **limpo** para objeto vazio nesta fase — regra [[never-delete-common-events]], nunca deletado).
> 3. **Criar o script gerador** `Jhonny/planos/001-prototipo-core-loop/fase6/build_phase6_ces.py` antes da primeira task JSON-automatizável (task 6.1). Usar `fase5/build_phase5_ces.py` como referência de estrutura (helpers `C(code, indent, params)`, constantes de IDs, modo idempotente).
> 4. **Confirmar assets necessários** (alguns podem precisar ser criados):
>    - `race/bg_vitoria.png` (background da tela de vitória) — se não existir, usar Tint Screen dourado como fallback.
>    - `race/overlay_flash_white.png` (flash branco fullscreen) — se não existir, criar em Python+Pillow (RGBA 816×624 branco opaco).
>    - `race/bg_fim.png` (tela "FIM" ao completar Corrida 3) — fallback: tela preta + texto dourado via TextPicture.
>    - ME `Victory` (RPG Maker default) ou OGG `vitoria.ogg` para fanfarra.
>
> **Alocação de CE IDs (CommonEvents.json) — como ficará após F6:**
> | CE Editor ID | Nome | Trigger | Switch | Origem | Estado em F6 |
> |-------------|------|---------|--------|--------|---------------|
> | 1-4 | (placeholders/legados/EV_Preload) | — | — | F1/F2 | intocados |
> | 5 | `EV_RaceOrchestrator` | Call | — | F3 (estendido em **6.3**) | editado |
> | 6 | `EV_UpdateHud` | Call | — | F3 | intocado |
> | 7 | `EV_RaceRenderer` | Parallel | `SW_RACE_ACTIVE` (100) | F3 (estendido em **6.4**: check vitória) | editado |
> | 8 | `EV_RenderSinal` | Call | — | F3 | intocado |
> | 9 | `EV_RenderCurva` | Call | — | F3 | intocado |
> | 10 | `EV_RaceTimer` | Parallel | `SW_RACE_ACTIVE` (100) | F4 | intocado |
> | 11 | `EV_OnSafe` | Call | — | F4 (F5 estendeu) | editado: wire FAIL agora chama CE 18 |
> | 12 | `EV_OnRisk` | Call | — | F4 (F5 estendeu) | editado: wire FAIL agora chama CE 18 |
> | 13 | `EV_KeyInput` | Parallel | `SW_RACE_ACTIVE` (100) | F4 | intocado |
> | 14 | `EV_ResolucaoSafe` | Call | — | F5 | intocado |
> | 15 | `EV_ResolucaoRiskOK` | Call | — | F5 | intocado |
> | 16 | `EV_HoverRiskButton` | Parallel | `SW_RACE_ACTIVE` (100) | F5 | intocado |
> | ~~17~~ | ~~`EV_ResolucaoRiskFail`~~ | ~~Call~~ | — | ~~F5~~ | **LIMPO em F6** (objeto vazio canônico — absorvido por CE 18; regra [[never-delete-common-events]]) |
> | **18** | **`EV_Crash`** | **Call** | — | **F6 (task 6.1)** | **novo** |
> | **19** | **`EV_VitoriaCorrida`** | **Call** | — | **F6 (task 6.4)** | **novo** |
>
> **Heurística de auditoria (F3+F4+F5):** Antes de fechar cada task, rodar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` e confirmar que todos os IDs em scripts inline batem com a tabela real de `System.json`. IDs canônicos da F6: `VAR_RACE_ID=100`, `VAR_SCENE_INDEX=101`, `VAR_P_CENA=103`, `VAR_CONSCIENCIA=104`, `VAR_PONTOS_GLORIA=105`, `VAR_TAXA_SUCESSO=106`, `VAR_ROLL_RESULT=107`, `VAR_TIMER_FRAMES=108`, `VAR_RACE_N_CENAS=111`, `VAR_ATTEMPT_N=112`, `VAR_TIMER_TIMEOUT_FLAG=116`. Switches: `SW_RACE_ACTIVE=100`, `SW_INPUT_LOCKED=101`, `SW_CRASH_FLAG=102`, `SW_LAST_ACTION_SAFE=103`, `SW_PAUSED=104`, `SW_IS_CURVA_DIABO=105` (reservado para cena especial futura — não usado em F6).

| Task | JSON-automatizável? | Notas de implementação |
|------|---------------------|------------------------|
| 6.1 `EV_Crash` (CE 18, absorve CE 17) | **Sim — via `fase6/build_phase6_ces.py`** (350/355/121/122/230/223/232/231/117) | **Estende o script gerador com CE 18 e LIMPA o CE 17** para objeto vazio canônico (`{id:17, list:[{code:0,indent:0,parameters:[]}], name:"", switchId:1, trigger:0}`) — **NUNCA deletar** (regra [[never-delete-common-events]]). Substitui placeholder `Call CE 17` no FAIL branch do CE 12 por `Call CE 18`. Sequência: Buzzer1 + Shake 18f + Flash branco + Tint escuro + reset (CONSCIENCIA=0, GLORIA=0, SCENE_INDEX=0, TIMER=240, TAXA=0, ROLL=0) + `VAR_ATTEMPT_N += 1` + reset switches (CRASH_FLAG OFF, INPUT_LOCKED OFF, LAST_ACTION_SAFE OFF) + erase pictures 1-60 via Script + Tint normal + Call CE 6 (UpdateHud) + Call CE 8 (RenderSinal). Não toca em VAR_RACE_ID, VAR_RACE_N_CENAS, VAR_SEED (preservidos). |
| 6.2 Curva do Diabo cena especial | **FORA DE ESCOPO desta fase** | Cena especial da Curva do Diabo (RACE_ID=3 AND SCENE_INDEX=9 com `VAR_P_CENA=100` fixo e Safe bloqueado) reservada para fase futura. Task mantida como placeholder. Em F6: Corrida 3 tem 10 cenas normais (sorteio 60/40). |
| 6.3 Variação de corridas (6/8/10) | **Sim — via `fase6/build_phase6_ces.py`** (estende CE 5) + Script inline | Adiciona cálculo de `VAR_RACE_N_CENAS` no INIT do Orchestrator baseado em `VAR_RACE_ID`: 1→6, 2→8, 3→10, default→6+clamp. **Opção B (Script inline)** recomendada por ser compacta. Default para corrida 1 se `VAR_RACE_ID` inválido. **Não** referencia Curva do Diabo (fora de escopo). |
| 6.4 `EV_VitoriaCorrida` (CE 19) + threshold pontuação | **Parcial** — CE 19 + wire no CE 7 via script gerador (JSON); TextPicture Plugin Command no CE 19 é **manual MZ** (mesma heurística da task 5.4) | CE 19 novo: erase pictures + stop BGM + play ME + Show bg_vitoria + 3x TextPicture (VITÓRIA/Pontos/Continuar) + Wait input loop + decision (pontuação >= threshold → incrementa RACE_ID + Call CE 5; else → mensagem derrota + restart sem avançar). Threshold calibrável: R1=60, R2=100, R3=150 (valores propostos para playtest). Wire: CE 7 Renderer ganha check `If SCENE_INDEX >= RACE_N_CENAS → Call CE 19`. |

- [x] task-6.1 — Criar `EV_Crash` (CE 18, absorve CE 17, incrementa ATTEMPT_N, restart <1s) · ~3h · deps: 5.2, 5.6 · **JSON: Sim** via `build_phase6_ces.py` (CE 18 novo ~25 cmds + patch CE 12 FAIL branch + **limpa CE 17** para objeto vazio — regra [[never-delete-common-events]])
- task-6.2 — **FORA DE ESCOPO** — Cena especial da Curva do Diabo (Corrida 3 cena 9) · ~2h · deps: 3.2, 6.1 · reservada para fase futura
- [x] task-6.3 — Configurar variação de corridas (6/8/10 cenas por `VAR_RACE_ID` via Script inline no INIT Orchestrator) · ~2h · deps: 3.1 · **JSON: Sim** via `build_phase6_ces.py` (estende CE 5)
- [x] task-6.4 — Implementar `EV_VitoriaCorrida` (CE 19) + threshold pontuação + wire no Renderer · ~3h · deps: 5.4, 6.3 · **JSON: Sim** (CE 19 + wire CE 7 + 4 Plugin Commands TextPicture via `build_phase6_ces.py` — padrão replicado de CE 6)

### Fase 7 — Polish + Observabilidade
**Objetivo:** audio feedback, indicador "TENTATIVA N" discreto, e logger estruturado para playtest.
**Dependências:** F6 (loop completo funcional — [[fase-6-completa]]).
**Validação visual:** a cada ação (Safe/Risk-sucesso/Crash), o som correspondente toca (freada/pneu_cantando/ME Shock1); indicador "TENTATIVA N" aparece discreto no canto; ao abrir o console F12, cada ação registra um JSON estruturado (`RACE_EVENT`).

> **STATUS: IMPLEMENTADA — AGUARDANDO PLAYTEST MZ** (2026-06-19) — tasks 7.1/7.2/7.3 implementadas via `fase7/build_phase7_ces.py` + extensão do plugin `Jhonny_RaceHelper.js` (função `logRaceEvent` + `PluginManager.registerCommand`). **Gap F6 corrigido:** `setup_phase6_system.py` nunca tinha sido executado — System.json só tinha 117 slots (0-116); executado nesta sessão para criar `VAR_VITORIA_PASSOU` (Editor ID 117). **Task 7.1:** Play SE pneu_cantando removido do CE 12 e inserido no início do CE 15 (sincronizado com flash dourado da resolução Risk-OK); CE 11 (freada) e CE 18 (ME Shock1) confirmados sem alteração. **Task 7.2:** CE 6 (`EV_UpdateHud`) estendido com TextPicture "TENTATIVA N" (Picture ID 52, cinza `\C[7]`, opacidade 180, posição (350, 20)) via pattern 357+657+Show `name=""` replicado de CE 6 Glória; Comment stale `[TASK 5.4 MANUAL MZ]` removido (cmds 2-4 já implementam Glória desde F6). **Task 7.3:** plugin `Jhonny_RaceHelper.js` estendido com `logRaceEvent(args)` que captura frame + vars 100-117 + switches 100-105 + timestamp e imprime `RACE_EVENT: {json}` no F12; PluginManager.registerCommand registra `logRaceEvent` como Plugin Command MZ; CEs 5 (RACE_INIT), 11 (SAFE_CLICK), 12 (RISK_SUCCESS + RISK_FAIL), 18 (CRASH), 19 (VICTORY) receberam chamadas via Plugin Command (code 357 + 657). Idempotência validada (re-execução produz diff vazio). `node -c` no plugin OK. `python3 -m json.tool` OK. Próximo: **F10 → Ctrl+S → reiniciar Playtest** (bug F4 — refresh runtime obrigatório) e validar visualmente (ver [[fase-7-completa]]).
>
> **STATUS ANTIGO: ATUALIZADO** (2026-06-19) — tasks .md revisadas pós-F4.5/F6 para refletir estado real do projeto.
>
> **Heurística consolidada (F3+F4+F5+F6):** Todo trabalho em CEs é feito via **script gerador Python idempotente** (`build_phaseN_ces.py`) — JSON nunca é editado diretamente. F6 confirmou que Plugin Commands TextPicture (code 357 + 657 + Show Picture com `name=""`) PODEM ser inseridos via script — não há mais trabalho manual obrigatório no MZ Editor para esta fase.

**Estado atual herdado (NÃO refazer):**
- ✅ `Play SE: freada` já em CE 11 (`EV_OnSafe`) desde F4.5 — task 7.1 só confirma.
- ✅ `Play SE: pneu_cantando` em CE 12 (`EV_OnRisk`) desde F4.5 — **DEVE ser movido para CE 15** (`EV_ResolucaoRiskOK`) nesta fase, conforme decisão do usuário (sincroniza com flash dourado).
- ✅ CE 18 (`EV_Crash`) usa `ME: Shock1` desde F6 — **não adicionar SE crash_metal** (decisão do usuário: ME basta; crash_metal.ogg fica como asset sem uso neste MVP).
- ✅ `VAR_ATTEMPT_N += 1` já em CE 18 cmd 14 desde F6 — task 7.2 não precisa adicionar increment.
- ✅ `VAR_VITORIA_PASSOU` (Editor ID 117) existe desde F6 — task 7.3 captura vars até ID 117.

- task-7.1 — Confirmar/mover `Play SE` nos handlers (Safe=✓freada/CE11, Risk=mover pneu_cantando CE12→CE15, Crash=manter ME Shock1/CE18) · ~30min · deps: 2.2, 5.3, 6.1
- task-7.2 — Implementar indicador "TENTATIVA N" discreto via `TextPicture` (script gerador) · ~1h · deps: 5.4
- task-7.3 — Adicionar plugin command `logRaceEvent` no `Jhonny_RaceHelper.js` + chamadas via script gerador · ~1.5h · deps: 1.2

## Tabela de Tasks

| ID | Título | Fase | Deps | Tempo | JSON? |
| --- | --- | --- | --- | --- | --- |
| 1.1 | Registrar variáveis (101-113) e switches (101-106) no Database | F1 | — | 2h | Python+json |
| 1.2 | Criar plugin `Jhonny_RaceHelper.js` | F1 | 1.1 | 1h | Write direto |
| 1.3 | Ativar plugins ButtonPicture + TextPicture + Jhonny_RaceHelper | F1 | 1.2 | 1h | **MZ Editor** |
| 2.1 | Criar pictures (16 PNGs) | F2 | — | 3h | Python+Pillow |
| 2.2 | Criar 3 Sound Effects (aliases de sons padrão) | F2 | — | 1h | `cp` OGGs locais |
| 2.3 | Criar `EV_Preload` (CE ID 3) | F2 | 2.1 | 2h | Python+json |
| 3.1 | Criar `EV_RaceOrchestrator` | F3 | 1.1, 2.3 | 2h | **Python+json** |
| 3.2 | Criar `EV_RaceRenderer` (Parallel) | F3 | 3.1, 3.4 | 3h | Python+json + **validar MZ** |
| 3.3 | Criar `EV_RenderSinal` + `EV_RenderCurva` | F3 | 3.2 | 3h | **Python+json** |
| 3.4 | Implementar HUD de Consciência | F3 | 3.1 | 2h | **Python+json + Script inline** |
| 3.5 | Criar Map001 com event autorun | F3 | 3.1, 3.4 | 1h | **Python+json** |
| 4.1 | Criar `EV_RaceTimer` (CE 10) | F4 | 3.2 | 2h | **Python+json** + auditar inline |
| 4.2 | Botões clicáveis via Script inline (`mzkp_commonEventId`) — Pictures 41-44 | F4 | 3.3 | 3h | **Python+json** (bypass Plugin Cmd) |
| 4.3 | Criar `EV_OnSafe` (CE 11) + `EV_OnRisk` (CE 12) | F4 | 4.1, 4.2 | 3h | **Python+json** + auditar inline |
| 4.4 | Criar `EV_KeyInput` (CE 13) + validar W/S/A/D | F4 | 1.2, 4.3 | 2h | **Python+json** + Write no plugin |
| 4.5 | Feedback sonoro (`Play SE`) em `EV_OnSafe`/`EV_OnRisk` | F4 | 4.3 | 30min | **Python+json** (estende `build_phase4_ces.py`) |
| 5.1 | Implementar lógica Safe em `EV_OnSafe` (CE 11) | F5 | 4.3 | 2h | **Python+json** via `build_phase5_ces.py` |
| 5.2 | Implementar lógica Risk em `EV_OnRisk` (CE 12) | F5 | 4.3, 5.1 | 3h | **Python+json** via `build_phase5_ces.py` |
| 5.3 | Criar `EV_ResolucaoSafe` (CE 14) + `EV_ResolucaoRiskOK` (CE 15) | F5 | 5.1, 5.2 | 3h | **Python+json** via `build_phase5_ces.py` |
| 5.4 | HUD de Pontos de Glória via `TextPicture` (Picture 51) | F5 | 5.1 | 2h | **MZ Editor** (Plugin Cmd) |
| 5.5 | Hover vermelho-sangue 3 níveis discretos (CE 16) | F5 | 3.4, 4.2 | 3h | **Python+json** + Script inline (TouchInput) |
| 5.6 | **Bugfix:** `EV_ResolucaoRiskFail` (CE 17) + wire FAIL branch CE 12 | F5 | 5.2, 5.3 | 1h | **Python+json** (gerador + patch cirúrgico) |
| 6.1 | ~~Criar `EV_Crash` (CE 18, absorve CE 17, ATTEMPT_N++, restart <1s)~~ ✅ | F6 | 5.2, 5.6 | 3h | **Python+json** via `build_phase6_ces.py` (CE 18=25 cmds + **limpa CE 17** p/ objeto vazio) |
| 6.2 | ~~Implementar Curva do Diabo~~ **FORA DE ESCOPO** (cena especial futura) | F6 | — | — | _reservado_ |
| 6.3 | ~~Configurar variação de corridas (6/8/10 via Script inline no INIT Orchestrator)~~ ✅ | F6 | 3.1 | 2h | **Python+json** via `build_phase6_ces.py` (Opção B — Script inline) |
| 6.4 | ~~Implementar `EV_VitoriaCorrida` (CE 19) + threshold pontuação + wire Renderer~~ ✅ | F6 | 5.4, 6.3 | 3h | **Python+json** (CE 19 + wire CE 7) + **MZ Editor** (TextPicture manual pendente) |
| 7.1 | ~~Confirmar/mover `Play SE` nos handlers (CE 11 ✓, mover CE12→CE15, CE 18 manter ME)~~ ✅ | F7 | 2.2, 5.3, 6.1 | 30min | **Python+json** via `build_phase7_ces.py` (patch CE 12 + CE 15) |
| 7.2 | ~~Indicador "TENTATIVA N" via `TextPicture` (Picture ID 52)~~ ✅ | F7 | 5.4 | 1h | **Python+json** via `build_phase7_ces.py` (extende CE 6, pattern 357+657+Show name="") |
| 7.3 | ~~Plugin command `logRaceEvent` (Apêndice B) + chamadas nos CEs 5/11/12/18/19~~ ✅ | F7 | 1.2 | 1.5h | **Write** no plugin + **Python+json** (chamadas Plugin Cmd 357 nos CEs) |

## Ordem de Execução Recomendada

```
Paralelo inicial (F1 ∥ F2):
  Track A: 1.1 → 1.2 → 1.3
  Track B: 2.1 → 2.3  (2.2 paralelo)

Sync point: ambos tracks completos ✓ (estado atual do projeto)

Pré-passos F3 (uma única vez):
  - Python+json: nomear VAR_LAST_RENDERED_INDEX (Editor ID 113) em System.json
    (subtarefa 3.2.1 antecipada — evita reabrir Database depois)

Pré-passos F4 (uma única vez):
  - Snapshot obrigatório: imprimir variables[95:117] e switches[95:107]
  - Python+json: criar VAR_TIMER_TIMEOUT_FLAG (Editor ID 116) em System.json
  - Confirmar convenção: a partir da F3, Editor IDs reais = 100-113 (vars) e 100-105 (switches)

Linear daí em diante:
  3.4 → 3.1 → 3.5 → 3.2 → 3.3
  → 4.1 → 4.2 → 4.3 → 4.4 → 4.5
  → 5.1 → 5.2 → 5.3 → 5.4 → 5.5 → 5.6
  → 6.1 → 6.3 → 6.4
  → 7.1 → 7.2 → 7.3
```

> **Nota sobre ordem F6:** task-6.2 (Curva do Diabo cena especial) está fora de escopo desta fase — pulada da ordem linear. Task-6.1 (EV_Crash) primeiro porque 6.4 (vitória) precisa do restart funcional para o caso de "vitória com pontuação abaixo do threshold". Task-6.3 (variação) antes de 6.4 porque o Renderer precisa saber `VAR_RACE_N_CENAS` para disparar vitória. Task-6.4 por último (depende de 5.4 HUD + 6.3 comprimento + 6.1 restart).
```

> **Nota sobre ordem F3:** 3.4 antes de 3.1 porque o Orchestrator faz `Show Picture: 20/21` (setup do HUD) em seu INIT — reescrever o Orchestrator depois do HUD estar definido evita retrabalho. 3.5 depois de 3.1 porque o Map001 chama o Orchestrator. 3.2 depois de 3.1+3.4 porque o Renderer chama `EV_RenderSinal/Curva` e a barra de HUD precisa existir.
>
> **Nota sobre paralelismo:** F1 (Setup) e F2 (Assets) são independentes — podem ser executados em paralelo. O ponto de sincronização é o início de F3, que precisa de variáveis nomeadas (F1) E pictures no disco (F2).

## Fora de Escopo

- **Cenas VN (Visual Novel)** — corrida só inicia após VN terminar, mas VN em si é sistema separado.
- **ConcernScore** — variável oculta acumulada nas cenas VN; não afeta o core loop da corrida diretamente.
- **BGM da corrida** — spec menciona transição de música mas não detalha; adicionar depois de playtest.
- **Save/Load** — não mencionado no spec; ignorar no protótipo.
- **PRNG seedável** — usar `Math.random()` em v1; reservar `mulberry32` para v2 (debug de replay).
- **Pesos SINAL/CURVA diferenciados por corrida** — manter 60/40 fixo; variar em v2.
- **Distribuição triangular de `P_cena`** — manter uniforme; variar em v2 após playtest.

## Referências

- **Guia Técnico:** [[Guia de Implementação - Core Loop da Corrida]]
- **Spec de Domínio:** [[Corrida - Core Loop]]
- **Pitch (contexto narrativo):** [[Roleta Paulista]]
- **Prompt que originou este plano:** [[Prompt-plano-implementação-v2]]
- **Templates usados:** `.claude/templates/tasks-template.md` (índice), `.claude/templates/task-template.md` (por task)
- **Regras de código:** `.claude/rules/basci-rules.json`

---

## Aprendizados Consolidados (Fases 1-3 — Aplicáveis às Fases Seguintes)

Baseado nas retrospectivas [[fase1/retrospectiva]], [[fase2/retrospectiva]] e [[fase3/retrospectiva]], estes são os conhecimentos críticos adquiridos:

### Restrições técnicas confirmadas
- **CONVENÇÃO DE IDs (aprendizado crítico da F3):** RMMZ acessa `_data[id]` **diretamente** sem offset (`rmmz_objects.js:691` para switches, `:723` para variables). Portanto, o índice do array em `System.json` **é igual ao Editor ID** exibido no MZ (`#0100 SW_RACE_ACTIVE`). Neste projeto: variáveis = Editor IDs **100-113**; switches = Editor IDs **100-105**. Documentação pré-F3 confundia índice 0-based com Editor ID — desconsiderar.
- **System.json é a fonte de verdade** para IDs. Antes de qualquer edição de Common Events, imprimir `variables[95:115]` e `switches[95:107]` e usar essa tabela como referência.
- **Auditoria obrigatória de scripts inline:** toda correção de IDs em comandos MZ (111/121/122) exige rodar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` e confirmar que os IDs em scripts JS batem. O seletor visual do MZ Editor **não audita scripts inline**.
- **Plugin MZ requer IIFE** com tags `@target MZ`, `@plugindesc`, `@help`
- **Plugin Manager (F10) só acessível via GUI MZ** — não automatizável via CLI
- **Para JSON estruturado, usar Python + json** — Edit tool falha em JSON linha única
- **Common Events SIMPLES podem ser criados via JSON** (validado na task 2.3) quando:
  - Há slot vazio confirmado (`CommonEvents.json` com `null` ou CE vazio)
  - Os códigos de comando MZ são conhecidos
  - A alteração é validada por `python -m json.tool` + Playtest MZ
- **Common Events COMPLEXOS** (Plugin Commands, escolhas aninhadas, conditional branches profundas) **devem ser revisados no MZ Editor**
- **Pictures em subpasta** usam nome sem extensão no comando `Show Picture` (ex.: `race/bg_sinal`)
- **Códigos MZ canônicos** (uso frequente na F3 em diante):
  - `231` Show Picture, `232` Move Picture, `235` Erase Picture, `230` Wait
  - `121` Control Switches, `122` Control Variables
  - `111` If, `411` Else, `412` End
  - `117` Call Common Event
  - `118` Label, `119` Jump to Label, `115` Exit Event Processing
  - `223` Tint Screen, `221` Fadeout Screen, `222` Fadein Screen
  - `355` Script (inline), `655` Script (continuação do anterior)

### Mapa de IDs (snapshot 2026-06-18 — fonte de verdade pós-F5)

| Editor ID | Variável | Editor ID | Switch |
|-----------|----------|-----------|--------|
| 100 | `VAR_RACE_ID` | 100 | `SW_RACE_ACTIVE` |
| 101 | `VAR_SCENE_INDEX` | 101 | `SW_INPUT_LOCKED` |
| 102 | `VAR_SCENE_TYPE` | 102 | `SW_CRASH_FLAG` |
| 103 | `VAR_P_CENA` | 103 | `SW_LAST_ACTION_SAFE` |
| 104 | `VAR_CONSCIENCIA` | 104 | `SW_PAUSED` |
| 105 | `VAR_PONTOS_GLORIA` | 105 | `SW_IS_CURVA_DIABO` (reservado — cena especial futura, **não usado em F6**) |
| 106 | `VAR_TAXA_SUCESSO` | | |
| 107 | `VAR_ROLL_RESULT` | | |
| 108 | `VAR_TIMER_FRAMES` | | |
| 109 | `VAR_SCENE_START` | | |
| 110 | `VAR_SEED` | | |
| 111 | `VAR_RACE_N_CENAS` | | |
| 112 | `VAR_ATTEMPT_N` | | |
| 113 | `VAR_LAST_RENDERED_INDEX` | | |
| 114 | (livre) | | |
| 115 | `VAR_HOVER_LEVEL` (criada em F5) | | |
| 116 | `VAR_TIMER_TIMEOUT_FLAG` (criada em F4) | | |
| 117 | `VAR_VITORIA_PASSOU` (criada em F6 via `fase6/setup_phase6_system.py`) — resetado no EV_Crash (6.1) **e** no INIT Orchestrator (6.3) por defesa | | |

### Mapa de Common Events (snapshot 2026-06-18 — pós-F5 implementada, pré-F6)

| CE Editor ID | Nome | Trigger | Origem | Estado |
|--------------|------|---------|--------|--------|
| 1 | (null) | — | placeholder | intocado |
| 2 | `acelerador` | Call | legado | intocado |
| 3 | `freio` | Call | legado | intocado |
| 4 | `EV_Preload` | Call | F2 | intocado |
| 5 | `EV_RaceOrchestrator` | Call | F3 | **editado em 6.3** (cálculo N_CENAS) |
| 6 | `EV_UpdateHud` | Call | F3 | intocado (TextPicture 5.4 pendente manual) |
| 7 | `EV_RaceRenderer` | Parallel (`SW_RACE_ACTIVE` 100) | F3 | **editado em 6.4** (check vitória) |
| 8 | `EV_RenderSinal` | Call | F3 | intocado |
| 9 | `EV_RenderCurva` | Call | F3 | intocado |
| 10 | `EV_RaceTimer` | Parallel (`SW_RACE_ACTIVE` 100) | F4 | intocado |
| 11 | `EV_OnSafe` | Call | F4 (F5 estendeu) | intocado |
| 12 | `EV_OnRisk` | Call | F4 (F5 estendeu) | **editado em 6.1** (FAIL branch: Call CE 17 → Call CE 18) |
| 13 | `EV_KeyInput` | Parallel (`SW_RACE_ACTIVE` 100) | F4 | intocado |
| 14 | `EV_ResolucaoSafe` | Call | F5 | intocado |
| 15 | `EV_ResolucaoRiskOK` | Call | F5 | intocado |
| 16 | `EV_HoverRiskButton` | Parallel (`SW_RACE_ACTIVE` 100) | F5 | intocado |
| 17 | ~~`EV_ResolucaoRiskFail`~~ | ~~Call~~ | ~~F5~~ | **LIMPO em 6.1** (objeto vazio — absorvido por CE 18; regra [[never-delete-common-events]]) |
| 18 | `EV_Crash` | Call | **F6 task 6.1** | **novo** |
| 19 | `EV_VitoriaCorrida` | Call | **F6 task 6.4** | **novo** |

### Heurísticas de implementação
- **Sempre imprimir `System.json` IDs como pré-passo** antes de gerar ou debugar Common Events
- Se plano já existe, **implementar diretamente** sem replanejamento (evitar `mcp__pal__planner` redundante)
- Criar **instruções markdown** apenas para tarefas estritamente manuais (MZ Editor GUI)
- Validar plugins com `node -c` antes de considerar completa
- Validar JSON do RPG Maker com `python -m json.tool` antes de abrir o MZ
- **Antes de gerar assets, buscar todas as referências futuras por nome de arquivo** (evita descoberta tardia como `sinal_red`/`placa_curva_dir` na F2)
- **Local-first para assets:** verificar assets padrão em `Jhonny/audio/se/` antes de gerar/baixar novos
- TaskCreate não persiste entre sessões — usar arquivos markdown para rastreamento
- Escrever JSON do RPG Maker com `indent=4` para reduzir diff e facilitar revisão
- **Fonte geradora (`build_phaseN_ces.py`) é artefato-fonte:** se existir script gerador, corrigir o gerador antes do JSON gerado; regenerar e validar
- **Quando depurar bug visual em RMMZ:** priorizar inspeção de `System.json` + `CommonEvents.json` + playtest MZ do usuário; evitar automação browser (Playwright) que para na title screen

### Formatos de arquivo (consolidado)
- **Pictures**: Obrigatório PNG com canal alpha (para botões/overlays transparentes) — nunca JPEG
- **Áudio**: OGG Vorbis é o formato canônico (não MP3) para estabilidade em NW.js; `afconvert` falha codificando Vorbis no macOS, preferir aliases de sons padrão
- **Resolução base**: 816×624 (conforme `System.json`)
- **Pictures em subpasta**: nome sem extensão (ex.: `race/bg_sinal`)

### Estado de pré-requisitos para a Fase 6 (snapshot 2026-06-18 — pós-F5 implementada)
- **Variáveis Editor IDs 100-116** nomeadas em `System.json` (F1+F3+F4+F5)
- **Switches Editor IDs 100-105** nomeadas em `System.json` (F1)
- **Variável Editor ID 114** livre — reservado para uso futuro
- **Variável Editor ID 115 (`VAR_HOVER_LEVEL`)** criada em F5
- **Variável Editor ID 117 (`VAR_VITORIA_PASSOU`)** — **AUSENTE** — pré-passo obrigatório da F6 (criar via `fase6/setup_phase6_system.py`, necessário para tasks 6.1, 6.3 e 6.4)
- **Pictures em `Jhonny/img/pictures/race/`** (F2+F5):
  - 16 PNGs base (incluindo `sinal_red`, `placa_curva_dir`)
  - Overlays flash: `overlay_flash_green`, `overlay_flash_gold` (F5)
  - Hover: `hover_red_l1`, `hover_red_l2`, `hover_red_l3` (F5)
  - **F6 precisa criar:** `overlay_flash_white.png` (816×624 RGBA branco opaco — para crash flash)
  - **F6 opcional:** `bg_vitoria.png` (background tela de vitória), `bg_fim.png` (tela FIM Corrida 3). Fallback: Tint Screen dourado/preto + TextPicture.
- **3 OGGs** em `Jhonny/audio/se/`: `crash_metal.ogg` (reservado — **não usado em F6**), `freada.ogg`, `pneu_cantando.ogg`
- **CE Editor ID 4 `EV_Preload`** criado em `CommonEvents.json`
- **CEs Editor IDs 5-17** criados (F3+F4+F5); CE 17 será **limpo** para objeto vazio em F6 (regra [[never-delete-common-events]])
- **Slots livres para novos CEs**: Editor IDs 18+ (F6 usará 18 para `EV_Crash`, 19 para `EV_VitoriaCorrida`)
- **Picture IDs reservadas F6:** 32 (flash overlay crash), 5 (bg vitória/FIM), **53 (VITÓRIA!)**, **56 (DERROTA!)**, 54 (Glória), 55 (instrução). **Evitar colisão:** 51 já usado por HUD Glória (F5).

### Caminho mínimo recomendado para Fase 5
1. **Pré-passos (Python+json):**
   - Imprimir `variables[100:117]` e `switches[100:106]` para snapshot da tabela real (pós-F4)
   - Confirmar CEs 10-13 ativos no `CommonEvents.json` (`name`, `trigger`, `switchId`)
   - (Opcional, só se for executar task 5.5 primeiro) Criar `VAR_HOVER_LEVEL` (Editor ID 115) em `System.json`
2. **Criar o script gerador** `Jhonny/planos/001-prototipo-core-loop/fase5/build_phase5_ces.py` (usar `fase4/build_phase4_ces.py` como referência de estrutura — helpers `C(code, indent, params)`, constantes de IDs, modo idempotente preservando slots 0-13)
3. **Task 5.1 (Safe em `EV_OnSafe`):** estender o script para substituir placeholder no CE 11; manter **2 guardas** (race ativa + lock) — NÃO reintroduzir guarda 3; `VAR_CONSCIENCIA=104` clamp 0-100, `VAR_PONTOS_GLORIA=105` +10, `VAR_SCENE_INDEX=101` +=1; ordem CONSCIENCIA antes de cena++; chama `EV_UpdateHud` (CE 6) e `EV_ResolucaoSafe` (CE 14)
4. **Task 5.2 (Risk em `EV_OnRisk`):** estender o script para substituir placeholder no CE 12; manter 2 guardas; inline scripts: `setValue(106, ...)` TAXA clamp, `setValue(107, ...)` ROLL 0..99, `setValue(105, ...)` GLORIA +P_CENA×2; custo `VAR_CONSCIENCIA -= VAR_P_CENA` (104 -= 103) em AMBOS os ramos antes de cena++; ramo sucesso chama `EV_ResolucaoRiskOK` (CE 15); ramo falha seta `SW_CRASH_FLAG` (102) e chama `EV_Crash` (F6 — task 6.1)
5. **Task 5.3 (`EV_ResolucaoSafe`/`EV_ResolucaoRiskOK`):** estender o script com CEs 14/15; flash verde (Safe) e flash dourado + shake (Risk-sucesso); ≤24 frames; desligam `SW_INPUT_LOCKED` (101) no fim
6. **Task 5.4 (HUD Glória):** estender `EV_UpdateHud` (CE 6) via MZ Editor com Plugin Command `TextPicture > Set Text` + `Show` (Picture ID 51, posição 560,20); escape `"GLÓRIA: \\V[105]"` — **não usar o script gerador para esta task**
7. **Task 5.5 (Hover vermelho):** estender o script com CE 16 (`EV_HoverRiskButton`, Parallel); Script inline com `TouchInput.x/y` no retângulo do botão Furar (ID 42); ramificar por `VAR_TAXA_SUCESSO` (106) em 3 níveis; mostrar/ocultar Pictures 22/23/24; reservar `VAR_HOVER_LEVEL` (ID 115) em `System.json`
8. **Auditar scripts inline:** rodar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` e confirmar IDs (especialmente 103/104/105/106/107 — fáceis de confundir)
9. **Pós-edição MZ obrigatória:** após rodar o gerador, reabrir MZ Editor → Database (F10) → Ctrl+S → fechar e reabrir Playtest (bug real F4: `$dataCommonEvents` em runtime pode não refletir o JSON em disco)
10. **Playtest MZ** após cada task com feedback perceptível (sem F12/F9): flash visível + som já existente da F4
11. Atualizar `tasks.md` marcando F5 como completa
12. Criar registro de conclusão em `fase-5-completa.md`

### Caminho mínimo recomendado para Fase 6 (pós-F5 validada)

> **Decisões confirmadas pelo usuário em 2026-06-19:**
> 1. **Som de crash:** Buzzer1 (ME), não crash_metal (SE). Asset `crash_metal.ogg` da F2 fica reservado.
> 2. **VAR_SEED (110):** resetar a cada crash (alinhado ao spec §7.3 literalmente).
> 3. **VAR_VITORIA_PASSOU (117):** resetar nos DOIS lugares — bloco de reset do EV_Crash (task 6.1) e INIT Orchestrator (task 6.3). Abordagem defensiva.
> 4. **Texto VITÓRIA/DERROTA:** 2 TextPicture separados (Picture 53 = VITÓRIA!, Picture 56 = DERROTA!) com If/Else Show Picture. Não usar If/Else para alternar texto de uma mesma picture.

1. **Pré-passos (Python+json):**
   - Confirmar que **F5 está validada em Playtest MZ** (não iniciar F6 se F5 tem bugs pendentes).
   - Imprimir `variables[100:117]` e `switches[100:106]` para snapshot da tabela real (pós-F5).
   - Confirmar CEs 5-17 ativos no `CommonEvents.json` (CE 17 será **limpo** para objeto vazio nesta fase — regra [[never-delete-common-events]]).
   - Criar `VAR_VITORIA_PASSOU` (Editor ID 117) em `System.json` via `fase6/setup_phase6_system.py`.
2. **Criar o script gerador** `Jhonny/planos/001-prototipo-core-loop/fase6/build_phase6_ces.py` (usar `fase5/build_phase5_ces.py` como referência de estrutura — helpers `C(code, indent, params)`, constantes de IDs, modo idempotente preservando slots 0-16).
3. **Task 6.1 (`EV_Crash` CE 18, absorve CE 17):**
   - Estender o script para **limpar** CE 17 (`EV_ResolucaoRiskFail`) para objeto vazio canônico (`{id:17, list:[{code:0,indent:0,parameters:[]}], name:"", switchId:1, trigger:0}`) — **NUNCA deletar** (regra [[never-delete-common-events]]) — e criar CE 18 (`EV_Crash`).
   - **Patch do wire no CE 12 (OnRisk) FAIL branch:** substituir `C(117, 1, [17])` por `C(117, 1, [18])`.
   - **Sequência do CE 18 (≤ 60 frames = 1s):**
     - **Play ME `Buzzer1`** (code 249, volume 90, pitch 100) — ME toca sobre BGM, **não usar `crash_metal` SE**
     - Shake Screen power 8, speed 6, duration 18 frames
     - Show Picture 32 (`race/overlay_flash_white`) opacity 255 + Move Picture fade out em 6 frames
     - Tint Screen `(-255, -255, -255, 0)` em 6 frames
     - Wait 18 frames (shake + flash + tint rodando)
     - **Bloco de reset (no escuro):** `CONSCIENCIA=0`, `GLORIA=0`, `SCENE_INDEX=0`, `TIMER_FRAMES=240`, `TAXA_SUCESSO=0`, `ROLL_RESULT=0`; **`ATTEMPT_N += 1`** (Editor ID 112); **`SEED = Math.floor(Math.random()*1e9)`** (Editor ID 110 — decisão 2026-06-19); **`VITORIA_PASSOU = 0`** (Editor ID 117 — defensivo); switches: `CRASH_FLAG=OFF`, `INPUT_LOCKED=OFF`, `LAST_ACTION_SAFE=OFF`
     - Erase pictures 1-60 via Script inline: `for (let i = 1; i <= 60; i++) $gameScreen.erasePicture(i);`
     - Erase Picture 32 (flash overlay)
     - Tint Screen Normal em 12 frames
     - Call CE 6 (`EV_UpdateHud`) — recria HUD zerado
     - Call CE 8 (`EV_RenderSinal`) — recria cena 1
     - Wait 6 frames (estabilização)
   - **Não tocar em:** `VAR_RACE_ID` (preservado entre restarts), `VAR_RACE_N_CENAS` (preservado).
4. **Task 6.3 (Variação de corridas):**
   - Estender CE 5 (`EV_RaceOrchestrator`) INIT com Script inline para calcular `VAR_RACE_N_CENAS`:
     ```javascript
     const id = $gameVariables.value(100);   // VAR_RACE_ID
     const n = id === 1 ? 6 : id === 2 ? 8 : id === 3 ? 10 : 6;
     $gameVariables.setValue(111, n);        // VAR_RACE_N_CENAS
     if (id < 1 || id > 3) $gameVariables.setValue(100, 1);  // clamp
     ```
   - **Adicionar ao INIT Orchestrator:** `Control Variables: VAR_VITORIA_PASSOU = 0` (117) — reset defensivo (decisão 2026-06-19).
   - Não adicionar lógica de Curva do Diabo (fora de escopo).
5. **Task 6.4 (`EV_VitoriaCorrida` CE 19 + threshold + wire no Renderer):**
   - **Wire no CE 7 (Renderer):** após resolução (Safe/Risk-sucesso incrementa SCENE_INDEX), adicionar:
     ```
     If VAR_SCENE_INDEX >= VAR_RACE_N_CENAS
       Call Common Event: EV_VitoriaCorrida   (CE 19)
       Exit Event Processing
     Else
       (sorteio normal de próxima cena — já existe)
     End
     ```
   - **CE 19 (`EV_VitoriaCorrida`):**
     - Erase pictures 1-60 (Script inline)
     - Stop BGM (1s fadeout)
     - Play ME "Victory" (ou `vitoria.ogg` fallback)
     - Show Picture 5 (`race/bg_vitoria` ou fallback Tint dourado)
     - **Threshold check (Script inline):** comparar `VAR_PONTOS_GLORIA` (105) contra threshold por corrida:
       ```javascript
       const pontos = $gameVariables.value(105);  // VAR_PONTOS_GLORIA
       const raceId = $gameVariables.value(100);  // VAR_RACE_ID
       const thresholds = { 1: 60, 2: 100, 3: 150 };
       const passou = pontos >= (thresholds[raceId] || 60);
       $gameVariables.setValue(117, passou ? 1 : 0);  // VAR_VITORIA_PASSOU
       ```
     - **4x Plugin Command TextPicture** (Passo manual MZ — decisão 2026-06-19: 2 pictures separadas em vez de If/Else alternar texto):
       - **Picture 53: "VITÓRIA!"** — size 72, cor 6 (dourado). **Só mostrada se `VAR_VITORIA_PASSOU == 1`.**
       - **Picture 56: "DERROTA!"** — size 72, cor 18 (vermelho). **Só mostrada se `VAR_VITORIA_PASSOU == 0`.**
       - Picture 54: "Pontos de Glória: \\V[105]" — size 36, branco. Sempre.
       - Picture 55: "Pressione [Espaço] para continuar" — size 24, cinza. Sempre.
     - **Estrutura If/Else Show Picture (manual MZ):** If 117==1 → Show 53; Else → Show 56; End. Depois Show 54 + Show 55.
     - Wait input loop (Label/Jump com `If Button: OK is Triggered` + Wait 1 frame)
     - Erase pictures 5, 53-56 (todos, inclusive o não-mostrado, para segurança)
     - **If VAR_VITORIA_PASSOU == 1:** incrementa `VAR_RACE_ID` se < 3 → Call CE 5 (Orchestrator); else (RACE_ID==3) → tela "FIM" + loop eterno
     - **Else (pontuação abaixo do threshold):** chama CE 18 (`EV_Crash`) para restart sem avançar corrida
6. **Auditar scripts inline:** rodar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` e confirmar IDs (especialmente 100/101/104/105/110/111/112/117).
7. **Auditar operações `ControlSwitch` (121):** confirmar semântica `0=ON | 1=OFF` (bug F5).
8. **Pós-edição MZ obrigatória:** F10 → Ctrl+S → reiniciar Playtest (bug real: `$dataCommonEvents` em runtime pode não refletir JSON em disco).
9. **Playtest MZ** com feedback perceptível (regra `user-testable-feedback` — sem depender de F12/F9 como validação principal):
   - Task 6.1: cronometrar crash → restart <1s; **Buzzer1 audível** + shake + flash + tint escuro + tela volta com cena 1; F9 confirma `VAR_ATTEMPT_N` incrementou, `VAR_RACE_ID` preservado, `VAR_SEED` mudou.
   - Task 6.3: Force `VAR_RACE_ID=1/2/3` via F12 (debug-only), confirma `VAR_RACE_N_CENAS=6/8/10`.
   - Task 6.4: Force `VAR_PONTOS_GLORIA` acima/abaixo do threshold e confirma **Picture 53 visível na vitória** vs **Picture 56 visível na derrota**.
10. Atualizar `tasks.md` marcando F6 como completa.
11. Criar registro de conclusão em `fase-6-completa.md`.

### Erros comuns a evitar
- **Não usar IDs 101-114/101-106** — convenção pré-F3 está errada; usar 100-113/100-105
- **Não esquecer de auditar scripts inline** quando corrigir IDs de variáveis/switches
- **Não confiar no seletor visual do MZ** para validar scripts inline — ele não os audita
- **Não esquecer da semântica do ControlSwitch (code 121):** `params[2]===0` → switch **ON**; `params[2]===1` → switch **OFF** (bug crítico F5 — oposto do intuitivo)
- **Não reintroduzir o CE 17** após F6 — ele foi absorvido pelo CE 18 (`EV_Crash`); se o CE 12 FAIL branch ainda referencia CE 17, o wire está quebrado. **O slot CE 17 permanece no array como CE limpo** (`name=""`, `trigger=0`) — nunca o restaure nem o delete (regra [[never-delete-common-events]])
- **Não incrementar `VAR_RACE_ID` sem clamp** — limite em 3 (Corrida 3 é a última)
- **Não resetar `VAR_RACE_ID` ou `VAR_RACE_N_CENAS` no crash** — preservados entre restarts (spec §7.2)
- **(F6) Não usar `crash_metal` SE no EV_Crash** — decisão 2026-06-19: som de crash é **Buzzer1 (ME)**. `crash_metal.ogg` fica reservado para polish/v2.
- **(F6) Não preservar `VAR_SEED` no crash** — decisão 2026-06-19: alinhado ao spec §7.3, **resetar** `Math.floor(Math.random()*1e9)` a cada crash.
- **(F6) Não usar If/Else para alternar texto do mesmo Picture** — decisão 2026-06-19: **2 TextPicture separados** (Picture 53=VITÓRIA, Picture 56=DERROTA). Estrutura If/Else apenas para Show Picture.
- **(F6) Não esquecer de apagar Picture 56 ao sair da tela de vitória** — ela pode não estar visível, mas `erasePicture` é no-op se inexistente, então sempre incluir no loop erase.
- **(F6) Não esquecer `VAR_VITORIA_PASSOU` reset em ambos lugares** — CE 18 (EV_Crash) **e** CE 5 (INIT Orchestrator). Abordagem defensiva.
- **Não esquecer `Wait 1 frame` em loops Label/Jump** — sem yield, jogo trava
- **Não esquecer `Stop BGM` antes de `Play ME`** — som caótico se ambos tocam juntos (exceção: Buzzer1 é ME curto que tolera BGM, mas Victory ME longo precisa de fadeout BGM primeiro)
- Não usar Edit tool em JSON linha única — usar Python + json desde início
- Não usar TaskCreate para rastreamento persistente — usar markdown
- Não escrever JSON minificado — sempre `indent=4`
- Não ativar ferramentas de análise (Serena, etc.) para tarefas simples de JSON/assets
- Não usar Playwright para validar playtest RMMZ — para na title screen
- Não sobrescrever CEs existentes (`acelerador`, `freio`, `EV_Preload`, CEs F3-F5) — verificar `CommonEvents.json` antes
- **NUNCA deletar Common Events** — sempre limpar o slot para objeto vazio canônico (`{id:N, list:[{code:0,indent:0,parameters:[]}], name:"", switchId:1, trigger:0}`). Regra [[never-delete-common-events]]: deletar (`null` ou remover do array) pode deslocar IDs subsequentes e quebrar save files legados + referências indiretas.
- Não corrigir apenas o JSON gerado — corrigir sempre o script gerador (`build_phaseN_ces.py`) também para evitar regressão
- **Não implementar a Curva do Diabo cena especial em F6** — fora de escopo (decisão do usuário); Corrida 3 tem 10 cenas normais
