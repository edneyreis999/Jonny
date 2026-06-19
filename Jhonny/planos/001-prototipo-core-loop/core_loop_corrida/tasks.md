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
> **Validação visual pendente** — usuário precisa abrir o projeto no RPG Maker MZ e rodar Playtest (ver [[fase-3-completa]] para o checklist detalhado).
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

### Fase 6 — Crash, Restart e Curva do Diabo
**Objetivo:** falha no Risk → crash visual → restart <1s; cena 9 da Corrida 3 é a Curva do Diabo com `P_CENA=100`.
**Dependências:** F5 (lógica completa).
**Validação visual:** ao clicar Risk com falha no roll, tela shake + flash branco + fade para preto + reset de variáveis + fadein direto na cena 1 — total <1s cronometrado; na Corrida 3 (10 cenas), a última cena mostra a placa "CURVA DO DIABO" diferenciada; ao terminar todas as cenas sem crash, tela de vitória reconhece pontuação.

> **STATUS: ARTEFATOS CRIADOS** (2026-06-18) — tasks .md geradas, prontas para execução pelo agente IA implementador.

- task-6.1 — Criar `EV_Crash` (shake + flash + hover + fadeout + reset + erase pictures 1-60 + fadein <1s) · ~3h · deps: 5.2
- task-6.2 — Implementar Curva do Diabo (Corrida 3, cena 9, `VAR_P_CENA=100` fixo) · ~2h · deps: 3.2, 6.1
- task-6.3 — Configurar variação de corridas (6/8/10 cenas por `VAR_RACE_ID`) · ~2h · deps: 3.1
- task-6.4 — Implementar tela de vitória da corrida (maior pontuação → próxima corrida) · ~2h · deps: 5.4

### Fase 7 — Polish + Observabilidade
**Objetivo:** audio feedback, indicador "TENTATIVA N" discreto, e logger estruturado para playtest.
**Dependências:** F6 (loop completo funcional).
**Validação visual:** a cada ação (Safe/Risk-sucesso/Risk-falha/Crash), o som correspondente toca (freada/motor/impacto); indicador "TENTATIVA N" aparece discreto no canto; ao abrir o console F12, cada ação registra um JSON estruturado (`RACE_EVENT`).

> **STATUS: ARTEFATOS CRIADOS** (2026-06-18) — tasks .md geradas, prontas para execução pelo agente IA implementador.

- task-7.1 — Adicionar `Play SE` nos handlers (Safe=freada, Risk-sucesso=motor, Risk-falha=impacto) · ~2h · deps: 2.2, 5.3
- task-7.2 — Implementar indicador "TENTATIVA N" discreto via `TextPicture` · ~2h · deps: 5.4
- task-7.3 — Adicionar plugin command `logRaceEvent` no `Jhonny_RaceHelper.js` (Apêndice B do Guia Técnico) · ~2h · deps: 1.2

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
| 6.1 | Criar `EV_Crash` (restart <1s) | F6 | 5.2 | 3h | Python+json |
| 6.2 | Implementar Curva do Diabo | F6 | 3.2, 6.1 | 2h | Python+json |
| 6.3 | Configurar variação de corridas (6/8/10) | F6 | 3.1 | 2h | Python+json |
| 6.4 | Implementar tela de vitória | F6 | 5.4 | 2h | Python+json |
| 7.1 | Adicionar `Play SE` nos handlers | F7 | 2.2, 5.3 | 2h | Python+json |
| 7.2 | Indicador "TENTATIVA N" via `TextPicture` | F7 | 5.4 | 2h | **MZ Editor** (Plugin Cmd) |
| 7.3 | Plugin command `logRaceEvent` | F7 | 1.2 | 2h | Write no plugin |

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
  → 6.1 → 6.2 → 6.3 → 6.4
  → 7.1 → 7.2 → 7.3
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

### Mapa de IDs (snapshot 2026-06-18 — fonte de verdade)

| Editor ID | Variável | Editor ID | Switch |
|-----------|----------|-----------|--------|
| 100 | `VAR_RACE_ID` | 100 | `SW_RACE_ACTIVE` |
| 101 | `VAR_SCENE_INDEX` | 101 | `SW_INPUT_LOCKED` |
| 102 | `VAR_SCENE_TYPE` | 102 | `SW_CRASH_FLAG` |
| 103 | `VAR_P_CENA` | 103 | `SW_LAST_ACTION_SAFE` |
| 104 | `VAR_CONSCIENCIA` | 104 | `SW_PAUSED` |
| 105 | `VAR_PONTOS_GLORIA` | 105 | `SW_IS_CURVA_DIABO` |
| 106 | `VAR_TAXA_SUCESSO` | | |
| 107 | `VAR_ROLL_RESULT` | | |
| 108 | `VAR_TIMER_FRAMES` | | |
| 109 | `VAR_SCENE_START` | | |
| 110 | `VAR_SEED` | | |
| 111 | `VAR_RACE_N_CENAS` | | |
| 112 | `VAR_ATTEMPT_N` | | |
| 113 | `VAR_LAST_RENDERED_INDEX` | | |
| 114 | (livre) | | |
| 115 (a criar) | `VAR_HOVER_LEVEL` | | |
| 116 | `VAR_TIMER_TIMEOUT_FLAG` (criada em F4) | | |

### Mapa de Common Events (snapshot 2026-06-18 — pós-F4, pré-F5)

| CE Editor ID | Nome | Trigger | Origem |
|--------------|------|---------|--------|
| 1 | (null) | — | placeholder |
| 2 | `acelerador` | Call | legado |
| 3 | `freio` | Call | legado |
| 4 | `EV_Preload` | Call | F2 |
| 5 | `EV_RaceOrchestrator` | Call | F3 |
| 6 | `EV_UpdateHud` | Call | F3 |
| 7 | `EV_RaceRenderer` | Parallel (`SW_RACE_ACTIVE` 100) | F3 |
| 8 | `EV_RenderSinal` | Call | F3 |
| 9 | `EV_RenderCurva` | Call | F3 |
| 10 | `EV_RaceTimer` | Parallel (`SW_RACE_ACTIVE` 100) | F4 |
| 11 | `EV_OnSafe` | Call | F4 (estendido em F5 task 5.1) |
| 12 | `EV_OnRisk` | Call | F4 (estendido em F5 task 5.2) |
| 13 | `EV_KeyInput` | Parallel (`SW_RACE_ACTIVE` 100) | F4 |
| 14 | `EV_ResolucaoSafe` | Call | F5 task 5.3 (a criar) |
| 15 | `EV_ResolucaoRiskOK` | Call | F5 task 5.3 (a criar) |
| 16 | `EV_HoverRiskButton` | Parallel (`SW_RACE_ACTIVE` 100) | F5 task 5.5 (a criar) |
| 17 | `EV_ResolucaoRiskFail` | Call | F5 task 5.6 (bugfix pós-playtest) |

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

### Estado de pré-requisitos para a Fase 5 (snapshot 2026-06-18 — pós-F4 validada)
- **Variáveis Editor IDs 100-113 + 116** nomeadas em `System.json` (F1+F3+F4)
- **Switches Editor IDs 100-105** nomeadas em `System.json` (F1)
- **Variável Editor ID 115 (`VAR_HOVER_LEVEL`) está AUSENTE** — pré-passo obrigatório da F5 task 5.5
- **Variável Editor ID 114** está livre — reservado para uso futuro
- **16 PNGs** em `Jhonny/img/pictures/race/` (incluindo `sinal_red` e `placa_curva_dir`); **pictures de overlay para flash** (`overlay_flash_green`, `overlay_flash_gold`) e **pictures de hover** (`hover_red_l1/l2/l3`) precisarão ser criadas na F5
- **3 OGGs** em `Jhonny/audio/se/`: `crash_metal.ogg`, `freada.ogg`, `pneu_cantando.ogg`
- **CE Editor ID 4 `EV_Preload`** já criado em `CommonEvents.json` (49 comandos)
- **CEs Editor IDs 5-13** criados e validados em playtest MZ (F3+F4)
- **Slots livres para novos CEs**: Editor IDs 14+ (F5 usará 14/15/16)

### Caminho mínimo recomendado para Fase 5
1. **Pré-passos (Python+json):**
   - Imprimir `variables[100:117]` e `switches[100:106]` para snapshot da tabela real (pós-F4)
   - Confirmar CEs 10-13 ativos no `CommonEvents.json` (`name`, `trigger`, `switchId`)
   - (Opcional, só se for executar task 5.5 primeiro) Criar `VAR_HOVER_LEVEL` (Editor ID 115) em `System.json`
2. **Criar o script gerador** `Jhonny/planos/001-prototipo-core-loop/fase5/build_phase5_ces.py` (usar `fase4/build_phase4_ces.py` como referência de estrutura — helpers `C(code, indent, params)`, constantes de IDs, modo idempotente preservando slots 0-13)
3. **Task 5.1 (Safe em `EV_OnSafe`):** estender o script para substituir placeholder no CE 11; manter **2 guardas** (race ativa + lock) — NÃO reintroduzir guarda 3; `VAR_CONSCIENCIA=104` clamp 0-100, `VAR_PONTOS_GLORIA=105` +10, `VAR_SCENE_INDEX=101` +=1; ordem CONSCIENCIA antes de cena++; chama `EV_UpdateHud` (CE 6) e `EV_ResolucaoSafe` (CE 14)
4. **Task 5.2 (Risk em `EV_OnRisk`):** estender o script para substituir placeholder no CE 12; manter 2 guardas; inline scripts: `setValue(106, ...)` TAXA clamp, `setValue(107, ...)` ROLL 0..99, `setValue(105, ...)` GLORIA +P_CENA×2; custo `VAR_CONSCIENCIA -= VAR_P_CENA` (104 -= 103) em AMBOS os ramos antes de cena++; ramo sucesso chama `EV_ResolucaoRiskOK` (CE 15); ramo falha seta `SW_CRASH_FLAG` (102) e chama `EV_Crash` (F6)
5. **Task 5.3 (`EV_ResolucaoSafe`/`EV_ResolucaoRiskOK`):** estender o script com CEs 14/15; flash verde (Safe) e flash dourado + shake (Risk-sucesso); ≤24 frames; desligam `SW_INPUT_LOCKED` (101) no fim
6. **Task 5.4 (HUD Glória):** estender `EV_UpdateHud` (CE 6) via MZ Editor com Plugin Command `TextPicture > Set Text` + `Show` (Picture ID 51, posição 560,20); escape `"GLÓRIA: \\V[105]"` — **não usar o script gerador para esta task**
7. **Task 5.5 (Hover vermelho):** estender o script com CE 16 (`EV_HoverRiskButton`, Parallel); Script inline com `TouchInput.x/y` no retângulo do botão Furar (ID 42); ramificar por `VAR_TAXA_SUCESSO` (106) em 3 níveis; mostrar/ocultar Pictures 22/23/24; reservar `VAR_HOVER_LEVEL` (ID 115) em `System.json`
8. **Auditar scripts inline:** rodar `rg "value\\(|setValue\\(" Jhonny/data/CommonEvents.json` e confirmar IDs (especialmente 103/104/105/106/107 — fáceis de confundir)
9. **Pós-edição MZ obrigatória:** após rodar o gerador, reabrir MZ Editor → Database (F10) → Ctrl+S → fechar e reabrir Playtest (bug real F4: `$dataCommonEvents` em runtime pode não refletir o JSON em disco)
10. **Playtest MZ** após cada task com feedback perceptível (sem F12/F9): flash visível + som já existente da F4
11. Atualizar `tasks.md` marcando F5 como completa
12. Criar registro de conclusão em `fase-5-completa.md`

### Erros comuns a evitar
- **Não usar IDs 101-114/101-106** — convenção pré-F3 está errada; usar 100-113/100-105
- **Não esquecer de auditar scripts inline** quando corrigir IDs de variáveis/switches
- **Não confiar no seletor visual do MZ** para validar scripts inline — ele não os audita
- Não usar Edit tool em JSON linha única — usar Python + json desde início
- Não usar TaskCreate para rastreamento persistente — usar markdown
- Não escrever JSON minificado — sempre `indent=4`
- Não ativar ferramentas de análise (Serena, etc.) para tarefas simples de JSON/assets
- Não usar Playwright para validar playtest RMMZ — para na title screen
- Não sobrescrever CEs existentes (`acelerador`, `freio`, `EV_Preload`, CEs F3) — verificar `CommonEvents.json` antes
- Não corrigir apenas o JSON gerado — corrigir sempre o script gerador (`build_phaseN_ces.py`) também para evitar regressão
